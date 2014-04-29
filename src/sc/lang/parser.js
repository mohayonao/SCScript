(function(sc) {
  "use strict";

  require("./sc");

  var parser = {};

  var Token = parser.Token = {
    CharLiteral: "Char",
    EOF: "<EOF>",
    FalseLiteral: "False",
    FloatLiteral: "Float",
    Identifier: "Identifier",
    IntegerLiteral: "Integer",
    Keyword: "Keyword",
    Label: "Label",
    NilLiteral: "Nil",
    Punctuator: "Punctuator",
    StringLiteral: "String",
    SymbolLiteral: "Symbol",
    TrueLiteral: "True"
  };

  var Syntax = parser.Syntax = {
    AssignmentExpression: "AssignmentExpression",
    BinaryExpression: "BinaryExpression",
    BlockExpression: "BlockExpression",
    CallExpression: "CallExpression",
    FunctionExpression: "FunctionExpression",
    GlobalExpression: "GlobalExpression",
    Identifier: "Identifier",
    ListExpression: "ListExpression",
    Label: "Label",
    Literal: "Literal",
    ObjectExpression: "ObjectExpression",
    Program: "Program",
    ThisExpression: "ThisExpression",
    UnaryExpression: "UnaryExpression",
    VariableDeclaration: "VariableDeclaration",
    VariableDeclarator: "VariableDeclarator"
  };

  var Message = parser.Message = {
    ArgumentAlreadyDeclared: "argument '%0' already declared",
    InvalidLHSInAssignment: "invalid left-hand side in assignment",
    NotImplemented: "not implemented %0",
    UnexpectedEOS: "unexpected end of input",
    UnexpectedIdentifier: "unexpected identifier",
    UnexpectedChar: "unexpected char",
    UnexpectedLabel: "unexpected label",
    UnexpectedNumber: "unexpected number",
    UnexpectedString: "unexpected string",
    UnexpectedSymbol: "unexpected symbol",
    UnexpectedToken: "unexpected token %0",
    VariableAlreadyDeclared: "variable '%0' already declared",
    VariableNotDefined: "variable '%0' not defined"
  };

  var Keywords = parser.Keywords = {
    var: "keyword",
    arg: "keyword",
    const: "keyword",
    this: "function",
    thisThread: "function",
    thisProcess: "function",
    thisFunction: "function",
    thisFunctionDef: "function",
  };

  var binaryPrecedenceDefaults = {
    "?"  : 1,
    "??" : 1,
    "!?" : 1,
    "->" : 2,
    "||" : 3,
    "&&" : 4,
    "|"  : 5,
    "&"  : 6,
    "==" : 7,
    "!=" : 7,
    "===": 7,
    "!==": 7,
    "<"  : 8,
    ">"  : 8,
    "<=" : 8,
    ">=" : 8,
    "<<" : 9,
    ">>" : 9,
    "+>>": 9,
    "+"  : 10,
    "-"  : 10,
    "*"  : 11,
    "/"  : 11,
    "%"  : 11,
    "!"  : 12,
  };

  function char2num(ch) {
    var n = ch.charCodeAt(0);

    if (48 <= n && n <= 57) {
      return n - 48;
    }
    if (65 <= n && n <= 90) {
      return n - 55;
    }
    return n - 87; // if (97 <= n && n <= 122)
  }

  function isNumber(ch) {
    return "0" <= ch && ch <= "9";
  }

  function Scope(parser) {
    this.parser = parser;
    this.stack = [];
  }

  Scope.prototype.add = function(type, id) {
    var peek = this.stack[this.stack.length - 1];
    var vars, args, declared;

    vars = peek.vars;
    args = peek.args;
    declared = peek.declared;

    switch (type) {
    case "var":
      if (args[id] || vars[id]) {
        this.parser.throwError({}, Message.VariableAlreadyDeclared, id);
      } else {
        vars[id] = true;
        delete declared[id];
      }
      break;
    case "arg":
      if (args[id]) {
        this.parser.throwError({}, Message.ArgumentAlreadyDeclared, id);
      }
      args[id] = true;
      delete declared[id];
      break;
    }
  };

  Scope.prototype.begin = function() {
    var peek = this.stack[this.stack.length - 1];
    var declared = {};

    if (peek) {
      Array.prototype.concat.apply([], [
        peek.declared, peek.args, peek.vars
      ].map(Object.keys)).forEach(function(key) {
        declared[key] = true;
      });
    }

    this.stack.push({ vars: {}, args: {}, declared: declared });
  };

  Scope.prototype.end = function() {
    this.stack.pop();
  };

  function LocationMarker(parser) {
    this.parser = parser;
    this.marker = [
      parser.index,
      parser.lineNumber,
      parser.index - parser.lineStart
    ];
  }

  LocationMarker.prototype.apply = function(node) {
    var parser = this.parser;
    var marker = this.marker;

    /* istanbul ignore else */
    if (this.parser.opts.range) {
      node.range = [ marker[0], parser.index ];
    }
    /* istanbul ignore else */
    if (this.parser.opts.loc) {
      node.loc = {
        start: {
          line: marker[1],
          column: marker[2]
        },
        end: {
          line: parser.lineNumber,
          column: parser.index - parser.lineStart
        }
      };
    }
  };

  function SCParser(source, opts) {
    /* istanbul ignore next */
    if (typeof source !== "string") {
      if (typeof source === "undefined") {
        source = "";
      }
      source = String(source);
    }
    source = source.replace(/\r\n?/g, "\n");
    this.source = source;
    this.opts = opts;
    this.length = source.length;
    this.index = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart = 0;
    this.reverted = null;
    this.scope = new Scope(this);
    this.marker = [];
    this.tokens = opts.tokens ? [] : null;
    this.errors = opts.tolerant ? [] : null;
    this.state = {
      closedFunction: false,
      disallowGenerator: false,
      innerElements: false,
      immutableList: false,
      underscore: []
    };
  }

  SCParser.prototype.parse = function() {
    return this.parseProgram();
  };

  SCParser.prototype.skipComment = function() {
    var source = this.source;
    var length = this.length;
    var index = this.index;
    var lineNumber = this.lineNumber;
    var lineStart = this.lineStart;
    var ch, depth;

    LOOP: while (index < length) {
      ch = source.charAt(index);
      switch (ch) {

      case " ":
      case "\t":
        index += 1;
        continue LOOP;
        /* falls through */

      case "\n":
        index += 1;
        lineNumber += 1;
        lineStart = index;
        continue LOOP;
        /* falls through */

      case "/":
        ch = source.charAt(index + 1);
        switch (ch) {
        case "/":
          // line comment
          index += 2;
          while (index < length) {
            ch = source.charAt(index);
            index += 1;
            if (ch === "\n") {
              lineNumber += 1;
              lineStart = index;
              break;
            }
          }
          break;

        case "*":
          // block comment
          depth = 1;
          index += 2;
          while (index < length) {
            ch = source.charAt(index);
            switch (ch) {
            case "/":
              ch = source.charAt(index + 1);
              if (ch === "*") {
                depth += 1;
                index += 1;
              }
              break;
            case "*":
              ch = source.charAt(index + 1);
              if (ch === "/") {
                depth -= 1;
                index += 1;
                if (depth === 0) {
                  index += 1;
                  continue LOOP;
                }
              }
              break;
            case "\n":
              lineNumber += 1;
              lineStart = index;
              break;
            }
            index += 1;
          }
          this.throwError({}, Message.UnexpectedToken, "ILLEGAL");
          break;

        default:
          break LOOP;
        }
        break;

      default:
        break LOOP;
      }
    }

    this.index = index;
    this.lineNumber = lineNumber;
    this.lineStart = lineStart;
  };

  SCParser.prototype.collectToken = function() {
    var loc, token, source, t;

    this.skipComment();

    loc = {
      start: {
        line: this.lineNumber,
        column: this.index - this.lineStart
      }
    };

    token = this.advance();

    loc.end = {
      line: this.lineNumber,
      column: this.index - this.lineStart
    };

    if (token.type !== Token.EOF) {
      source = this.source;
      t = {
        type: token.type,
        value: source.slice(token.range[0], token.range[1])
      };
      if (this.opts.range) {
        t.range = [ token.range[0], token.range[1] ];
      }
      if (this.opts.loc) {
        t.loc = loc;
      }
      this.tokens.push(t);
    }

    return token;
  };

  SCParser.prototype.advance = function() {
    var ch, token;

    this.skipComment();

    if (this.length <= this.index) {
      return this.EOFToken();
    }

    ch = this.source.charAt(this.index);

    // Symbol literal starts with back slash
    if (ch === "\\") {
      return this.scanSymbolLiteral();
    }

    // Char literal starts with dollar
    if (ch === "$") {
      return this.scanCharLiteral();
    }

    // String literal starts with single quote or double quote
    if (ch === "'" || ch === "\"") {
      return this.scanStringLiteral();
    }

    // for partial application
    if (ch === "_") {
      return this.scanUnderscore();
    }

    if (ch === "-") {
      token = this.scanNegativeNumericLiteral();
      if (token) {
        return token;
      }
    }

    // Identifier starts with alphabet
    if (("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z")) {
      return this.scanIdentifier();
    }

    // Number literal starts with number
    if (isNumber(ch)) {
      return this.scanNumericLiteral();
    }

    return this.scanPunctuator();
  };

  SCParser.prototype.expect = function(value) {
    var token = this.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
  };

  SCParser.prototype.peek = function() {
    var index, lineNumber, lineStart;

    index = this.index;
    lineNumber = this.lineNumber;
    lineStart = this.lineStart;

    if (this.opts.tokens) {
      this.lookahead = this.collectToken();
    } else {
      this.lookahead = this.advance();
    }

    this.index = index;
    this.lineNumber = lineNumber;
    this.lineStart = lineStart;
  };

  SCParser.prototype.lex = function() {
    var token = this.lookahead;

    this.index = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart = token.lineStart;

    if (this.opts.tokens) {
      this.lookahead = this.collectToken();
    } else {
      this.lookahead = this.advance();
    }

    this.index = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart = token.lineStart;

    return token;
  };

  SCParser.prototype.EOFToken = function() {
    return {
      type: Token.EOF,
      value: "<EOF>",
      lineNumber: this.lineNumber,
      lineStart: this.lineStart,
      range: [ this.index, this.index ]
    };
  };

  SCParser.prototype.restore = function(saved) {
    this.lookahead  = saved[0];
    this.index      = saved[1];
    this.lineNumber = saved[2];
    this.lineStart  = saved[3];
    if (this.tokens) {
      this.tokens.pop();
    }
  };

  SCParser.prototype.save = function() {
    return [ this.lookahead, this.index, this.lineNumber, this.lineStart ];
  };

  SCParser.prototype.scanCharLiteral = function() {
    var start, value;

    start = this.index;
    value = this.source.charAt(this.index + 1);

    this.index += 2;

    return {
      type : Token.CharLiteral,
      value: value,
      lineNumber: this.lineNumber,
      lineStart : this.lineStart,
      range: [ start, this.index ]
    };
  };

  SCParser.prototype.scanIdentifier = function() {
    var source = this.source.slice(this.index);
    var start = this.index;
    var value, type;

    value = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(source)[0];

    this.index += value.length;

    if (this.source.charAt(this.index) === ":") {
      this.index += 1;
      return {
        type: Token.Label,
        value: value,
        lineNumber: this.lineNumber,
        lineStart: this.lineStart,
        range: [ start, this.index ]
      };
    } else if (this.isKeyword(value)) {
      type = Token.Keyword;
    } else {
      switch (value) {
      case "inf":
        type = Token.FloatLiteral;
        value = "Infinity";
        break;
      case "pi":
        type = Token.FloatLiteral;
        value = "Math.PI";
        break;
      case "nil":
        type = Token.NilLiteral;
        value = "null";
        break;
      case "true":
        type = Token.TrueLiteral;
        break;
      case "false":
        type = Token.FalseLiteral;
        break;
      default:
        type = Token.Identifier;
        break;
      }
    }

    return {
      type: type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart: this.lineStart,
      range: [ start, this.index ]
    };
  };

  SCParser.prototype.scanNumericLiteral = function(neg) {
    return this.scanNAryNumberLiteral(neg) || this.scanDecimalNumberLiteral(neg);
  };

  SCParser.prototype.scanNegativeNumericLiteral = function() {
    var token, ch1, ch2, ch3;
    var start, value = null;

    start = this.index;
    ch1 = this.source.charAt(this.index + 1);

    if (isNumber(ch1)) {
      this.index += 1;
      token = this.scanNumericLiteral(true);
      token.range[0] = start;
      return token;
    }

    ch2 = this.source.charAt(this.index + 2);
    ch3 = this.source.charAt(this.index + 3);

    if (ch1 + ch2 === "pi") {
      this.index += 3;
      value = -Math.PI;
    } else if (ch1 + ch2 + ch3 === "inf") {
      this.index += 4;
      value = -Infinity;
    }

    if (value !== null) {
      return {
        type : Token.FloatLiteral,
        value: value,
        lineNumber: this.lineNumber,
        lineStart : this.lineStart,
        range: [ start, this.index ]
      };
    }

    return null;
  };

  SCParser.prototype.scanNAryNumberLiteral = function(neg) {
    var re, start, items;
    var base, integer, frac, pi;
    var x, i, imax;
    var value, type;

    re = /^(\d+)r((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+)(?:\.((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+))?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    base    = items[1].replace(/^0+(?=\d)/g, "")|0;
    integer = items[2].replace(/(^0+(?=\d)|_)/g, "");
    frac    = items[3] && items[3].replace(/_/g, "");

    if (!frac && base < 26 && integer.substr(-2) === "pi") {
      integer = integer.substr(0, integer.length - 2);
      pi = true;
    }

    type  = Token.IntegerLiteral;
    value = 0;

    for (i = 0, imax = integer.length; i < imax; ++i) {
      value *= base;
      x = char2num(integer[i]);
      if (x >= base) {
        this.throwError({}, Message.UnexpectedToken, integer[i]);
      }
      value += x;
    }

    if (frac) {
      type = Token.FloatLiteral;
      for (i = 0, imax = frac.length; i < imax; ++i) {
        x = char2num(frac[i]);
        if (x >= base) {
          this.throwError({}, Message.UnexpectedToken, integer[i]);
        }
        value += x * Math.pow(base, -(i + 1));
      }
    }

    if (neg) {
      value *= -1;
    }

    if (pi) {
      type = Token.FloatLiteral;
      value = value + " * Math.PI";
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    } else {
      value = String(value);
    }

    this.index += items[0].length;

    return {
      type : type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart : this.lineStart,
      range: [ start, this.index ]
    };
  };

  SCParser.prototype.scanDecimalNumberLiteral = function(neg) {
    var re, start, items, integer, frac, pi;
    var value, type;

    re = /^((?:\d(?:_(?=\d))?)+((?:\.(?:\d(?:_(?=\d))?)+)?(?:e[-+]?(?:\d(?:_(?=\d))?)+)?))(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    integer = items[1];
    frac    = items[2];
    pi      = items[3];

    type  = (frac || pi) ? Token.FloatLiteral : Token.IntegerLiteral;
    value = +integer.replace(/(^0+(?=\d)|_)/g, "");

    if (neg) {
      value *= -1;
    }

    if (pi) {
      value = value + " * Math.PI";
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    } else {
      value = String(value);
    }

    this.index += items[0].length;

    return {
      type : type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart : this.lineStart,
      range: [ start, this.index ]
    };
  };

  SCParser.prototype.scanPunctuator = function() {
    var re, start, items;

    re = /^(\.{1,3}|[(){}[\]:;,~#`]|[-+*\/%<=>!?&|@]+)/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (items) {
      this.index += items[0].length;
      return {
        type : Token.Punctuator,
        value: items[0],
        lineNumber: this.lineNumber,
        lineStart : this.lineStart,
        range: [ start, this.index ]
      };
    }

    this.throwError({}, Message.UnexpectedToken, this.source.charAt(this.index));

    this.index = this.length;

    return this.EOFToken();
  };

  SCParser.prototype.scanStringLiteral = function() {
    var source, start;
    var length, index;
    var quote, ch, value, type;

    source = this.source;
    length = this.length;
    index  = start = this.index;
    quote  = source.charAt(start);
    type   = (quote === '"') ? Token.StringLiteral : Token.SymbolLiteral;

    index += 1;
    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === quote) {
        value = source.substr(start + 1, index - start - 2);
        value = value.replace(/\n/g, "\\n");
        this.index = index;
        return {
          type : type,
          value: value,
          lineNumber: this.lineNumber,
          lineStart : this.lineStart,
          range: [ start, this.index ]
        };
      } else if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else if (ch === "\\") {
        index += 1;
      }
    }

    this.index = index;
    this.throwError({}, Message.UnexpectedToken, "ILLEGAL");

    return this.EOFToken();
  };

  SCParser.prototype.scanSymbolLiteral = function() {
    var re, start, items;
    var value;

    re = /^\\([a-z_]\w*)?/i;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    value = items[1];

    this.index += items[0].length;

    return {
      type : Token.SymbolLiteral,
      value: value,
      lineNumber: this.lineNumber,
      lineStart : this.lineStart,
      range: [ start, this.index ]
    };
  };

  SCParser.prototype.scanUnderscore = function() {
    var start = this.index;

    this.index += 1;

    return {
      type: Token.Identifier,
      value: "_",
      lineNumber: this.lineNumber,
      lineStart: this.lineStart,
      range: [ start, this.index ]
    };
  };

  SCParser.prototype.createAssignmentExpression = function(operator, left, right, remain) {
    var node = {
      type: Syntax.AssignmentExpression,
      operator: operator,
      left: left,
      right: right
    };
    if (remain) {
      node.remain = remain;
    }
    return node;
  };

  SCParser.prototype.createBinaryExpression = function(operator, left, right) {
    var node = {
      type: Syntax.BinaryExpression,
      operator: operator.value,
      left: left,
      right: right
    };
    if (operator.adverb) {
      node.adverb = operator.adverb;
    }
    return node;
  };

  SCParser.prototype.createBlockExpression = function(body) {
    return {
      type: Syntax.BlockExpression,
      body: body
    };
  };

  SCParser.prototype.createCallExpression = function(callee, method, args, stamp) {
    var node;

    node = {
      type: Syntax.CallExpression,
      callee: callee,
      method: method,
      args  : args,
    };

    if (stamp) {
      node.stamp = stamp;
    }

    return node;
  };

  SCParser.prototype.createGlobalExpression = function(id) {
    return {
      type: Syntax.GlobalExpression,
      id: id
    };
  };

  SCParser.prototype.createFunctionExpression = function(args, body, closed, partial, blocklist) {
    var node;

    node = {
      type: Syntax.FunctionExpression,
      body: body
    };
    if (args) {
      node.args = args;
    }
    if (closed) {
      node.closed = true;
    }
    if (partial) {
      node.partial = true;
    }
    if (blocklist) {
      node.blocklist = true;
    }
    return node;
  };

  SCParser.prototype.createIdentifier = function(name) {
    return {
      type: Syntax.Identifier,
      name: name
    };
  };

  SCParser.prototype.createLabel = function(name) {
    return {
      type: Syntax.Label,
      name: name
    };
  };

  SCParser.prototype.createListExpression = function(elements, immutable) {
    var node = {
      type: Syntax.ListExpression,
      elements: elements
    };
    if (immutable) {
      node.immutable = !!immutable;
    }
    return node;
  };

  SCParser.prototype.createLiteral = function(token) {
    return {
      type: Syntax.Literal,
      value: token.value,
      valueType: token.type
    };
  };

  SCParser.prototype.createLocationMarker = function() {
    if (this.opts.loc || this.opts.range) {
      this.skipComment();
      return new LocationMarker(this);
    }
  };

  SCParser.prototype.createObjectExpression = function(elements) {
    return {
      type: Syntax.ObjectExpression,
      elements: elements
    };
  };

  SCParser.prototype.createProgram = function(body) {
    return {
      type: Syntax.Program,
      body: body
    };
  };

  SCParser.prototype.createThisExpression = function(name) {
    return {
      type: Syntax.ThisExpression,
      name: name
    };
  };

  SCParser.prototype.createUnaryExpression = function(operator, arg) {
    return {
      type: Syntax.UnaryExpression,
      operator: operator,
      arg: arg
    };
  };

  SCParser.prototype.createVariableDeclaration = function(declarations, kind) {
    return {
      type: Syntax.VariableDeclaration,
      declarations: declarations,
      kind: kind
    };
  };

  SCParser.prototype.createVariableDeclarator = function(id, init) {
    var node = {
      type: Syntax.VariableDeclarator,
      id: id
    };
    if (init) {
      node.init = init;
    }
    return node;
  };

  SCParser.prototype.isClassName = function(node) {
    var name, ch;

    if (node.type === Syntax.Identifier) {
      name = node.value || node.name;
      ch = name.charAt(0);
      return "A" <= ch && ch <= "Z";
    }

    return false;
  };

  SCParser.prototype.isKeyword = function(value) {
    return !!Keywords[value] || false;
  };

  SCParser.prototype.isLeftHandSide = function(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.GlobalExpression:
      return true;
    }
    return false;
  };


  SCParser.prototype.match = function(value) {
    var token = this.lookahead;
    return token.type === Token.Punctuator && token.value === value;
  };

  SCParser.prototype.matchAny = function(list) {
    var value, i, imax;

    if (this.lookahead.type === Token.Punctuator) {
      value = this.lookahead.value;
      for (i = 0, imax = list.length; i < imax; ++i) {
        if (list[i] === value) {
          return value;
        }
      }
    }

    return null;
  };

  SCParser.prototype.matchKeyword = function(value) {
    var token = this.lookahead;
    return token.type === Token.Keyword && token.value === value;
  };

  SCParser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
  };

  // 1. Program
  SCParser.prototype.parseProgram = function() {
    var node;

    this.skipComment();
    this.markStart();
    this.peek();

    node = this.withScope(function() {
      var body;

      body = this.parseFunctionBody("");
      if (body.length === 1 && body[0].type === Syntax.BlockExpression) {
        body = body[0].body;
      }

      return this.createProgram(body);
    });

    return this.markEnd(node);
  };

  // 2. Function
  // 2.1 Function Expression
  SCParser.prototype.parseFunctionExpression = function(closed, blocklist) {
    var node;

    node = this.withScope(function() {
      var args, body;

      if (this.match("|")) {
        args = this.parseFunctionArgument("|");
      } else if (this.matchKeyword("arg")) {
        args = this.parseFunctionArgument(";");
      }
      body = this.parseFunctionBody("}");

      return this.createFunctionExpression(args, body, closed, false, blocklist);
    });

    return node;
  };

  // 2.2 Function Argument
  SCParser.prototype.parseFunctionArgument = function(expect) {
    var args = { list: [] }, lookahead;

    this.lex();

    if (!this.match("...")) {
      do {
        args.list.push(this.parseFunctionArgumentElement());
        if (!this.match(",")) {
          break;
        }
        this.lex();
      } while (this.lookahead.type !== Token.EOF);
    }

    if (this.match("...")) {
      this.lex();
      lookahead = this.lookahead;
      args.remain = this.parseVariableIdentifier();
      this.scope.add("arg", args.remain.name);
    }

    this.expect(expect);

    return args;
  };

  SCParser.prototype.parseFunctionArgumentElement = function() {
    var init = null, id;

    this.skipComment();
    this.markStart();
    id = this.parseVariableIdentifier();
    this.scope.add("arg", id.name);

    if (this.match("=")) {
      this.lex();
      init = this.parseUnaryExpression(); // literal or immurable array of literals
    }

    return this.markEnd(this.createVariableDeclarator(id, init));
  };

  // 2.3 Function Body
  SCParser.prototype.parseFunctionBody = function(match) {
    var elements = [];

    while (this.matchKeyword("var")) {
      elements.push(this.parseVariableDeclaration());
    }

    while (this.lookahead.type !== Token.EOF && !this.match(match)) {
      elements.push(this.parseExpression());
      if (this.lookahead.type !== Token.EOF && !this.match(match)) {
        this.expect(";");
      } else {
        break;
      }
    }

    return elements;
  };

  // 3. Variable Declarations
  SCParser.prototype.parseVariableDeclaration = function() {
    var declaration;

    this.skipComment();
    this.markStart();

    this.lex(); // var

    declaration = this.markEnd(
      this.createVariableDeclaration(
        this.parseVariableDeclarationList(), "var"
      )
    );

    this.expect(";");

    return declaration;
  };

  SCParser.prototype.parseVariableDeclarationList = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclarationElement());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.lookahead.type !== Token.EOF);

    return list;
  };

  SCParser.prototype.parseVariableDeclarationElement = function() {
    var init = null, id;

    this.skipComment();
    this.markStart();
    id = this.parseVariableIdentifier();
    this.scope.add("var", id.name);

    if (this.match("=")) {
      this.lex();
      init = this.parseAssignmentExpression();
    }

    return this.markEnd(this.createVariableDeclarator(id, init));
  };

  // 4. Expression
  SCParser.prototype.parseExpression = function(node) {
    return this.parseAssignmentExpression(node);
  };

  // 4.1 Expressions
  SCParser.prototype.parseExpressions = function(node) {
    var nodes = [];

    if (node) {
      nodes.push(node);
      this.lex();
    }

    while (this.lookahead.type !== Token.EOF && !this.matchAny([ ",", ")", "]", ".." ])) {
      this.skipComment();
      this.markStart();
      node = this.parseAssignmentExpression();
      this.markEnd(node);
      nodes.push(node);
      if (this.match(";")) {
        this.lex();
      }
    }

    if (nodes.length === 0) {
      this.throwUnexpected(this.lookahead);
    }

    return nodes.length === 1 ? nodes[0] : nodes;
  };

  // 4.2 Assignment Expression
  SCParser.prototype.parseAssignmentExpression = function(node) {
    var token, left, right;
    var sharp, destructuringAssignment;
    var marker, saved;

    if (node) {
      return this.parsePartialExpression(node);
    }

    token = this.lookahead;

    this.skipComment();
    marker = this.createLocationMarker();
    this.markStart();

    saved = this.save();

    if (this.match("#")) {
      sharp = true;
      token = this.lex();
      if (this.matchAny([ "[", "{" ])) {
        this.restore(saved);
      } else {
        destructuringAssignment = true;
        left = this.parseDestructuringAssignmentLeft();
        token = this.lookahead;
        this.expect("=");

        right = this.parseAssignmentExpression();
        node = this.createAssignmentExpression(
          token.value, left.list, right, left.remain
        );
      }
    }

    if (!destructuringAssignment) {
      node = left = this.parsePartialExpression();

      if (this.match("=")) {
        if (node.type === Syntax.CallExpression) {
          token = this.lex();
          right = this.parseAssignmentExpression();
          left.method.name = this.getAssignMethod(left.method.name);
          left.args.list = node.args.list.concat(right);
          /* istanbul ignore else */
          if (this.opts.range) {
            left.range[1] = this.index;
          }
          /* istanbul ignore else */
          if (this.opts.loc) {
            left.loc.end = {
              line: this.lineNumber,
              column: this.index - this.lineStart
            };
          }
          node = left;
        } else {
          // TODO: fix
          if (!this.isLeftHandSide(left)) {
            this.throwError({}, Message.InvalidLHSInAssignment);
          }

          token = this.lex();
          right = this.parseAssignmentExpression();
          node  = this.createAssignmentExpression(
            token.value, left, right
          );
        }
      }
    }

    return this.markEnd(node);
  };

  SCParser.prototype.getAssignMethod = function(methodName) {
    switch (methodName) {
    case "at":
      return "put";
    case "copySeries":
      return "putSeries";
    }
    return methodName + "_";
  };

  SCParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = { list: [] }, element;

    do {
      element = this.parseLeftHandSideExpression();
      if (!this.isLeftHandSide(element)) {
        this.throwError({}, Message.InvalidLHSInAssignment);
      }
      params.list.push(element);
      if (this.match(",")) {
        this.lex();
      } else if (this.match("...")) {
        this.lex();
        params.remain = this.parseLeftHandSideExpression();
        if (!this.isLeftHandSide(params.remain)) {
          this.throwError({}, Message.InvalidLHSInAssignment);
        }
        break;
      }
    } while (this.lookahead.type !== Token.EOF && !this.match("="));

    return params;
  };

  // 4.3 Partial Expression
  SCParser.prototype.parsePartialExpression = function(node) {
    var underscore, x, y;

    if (this.state.innerElements) {
      node = this.parseBinaryExpression(node);
    } else {
      underscore = this.state.underscore;
      this.state.underscore = [];

      node = this.parseBinaryExpression(node);

      if (this.state.underscore.length) {
        node = this.withScope(function() {
          var args, i, imax;

          args = new Array(this.state.underscore.length);
          for (i = 0, imax = args.length; i < imax; ++i) {
            x = this.state.underscore[i];
            y = this.createVariableDeclarator(x);
            /* istanbul ignore else */
            if (x.range) {
              y.range = x.range;
            }
            /* istanbul ignore else */
            if (x.loc) {
              y.loc = x.loc;
            }
            args[i] = y;
            this.scope.add("arg", this.state.underscore[i].name);
          }

          return this.createFunctionExpression(
            { list: args }, [ node ], false, true, false
          );
        });
      }

      this.state.underscore = underscore;
    }

    return node;
  };

  // 4.4 Conditional Expression
  // 4.5 Binary Expression
  SCParser.prototype.parseBinaryExpression = function(node) {
    var marker, markers, expr, token, prec, stack;
    var left, operator, right, i;

    this.skipComment();

    marker = this.createLocationMarker();
    left = this.parseUnaryExpression(node);

    token = this.lookahead;
    prec = this.binaryPrecedence(token);
    if (prec === 0) {
      if (node) {
        return this.parseUnaryExpression(node);
      }
      return left;
    }
    this.lex();

    token.prec = prec;
    token.adverb = this.parseAdverb();

    markers = [ marker, this.createLocationMarker() ];
    right = this.parseUnaryExpression();

    stack = [ left, token, right ];

    while ((prec = this.binaryPrecedence(this.lookahead)) > 0) {
      // Reduce: make a binary expression from the three topmost entries.
      while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
        right = stack.pop();
        operator = stack.pop();
        left = stack.pop();
        expr = this.createBinaryExpression(operator, left, right);
        markers.pop();

        marker = markers.pop();
        /* istanbul ignore else */
        if (marker) {
          marker.apply(expr);
        }
        stack.push(expr);
        markers.push(marker);
      }

      // Shift.
      token = this.lex();
      token.prec = prec;
      token.adverb = this.parseAdverb();

      stack.push(token);
      markers.push(this.createLocationMarker());
      expr = this.parseUnaryExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    i = stack.length - 1;
    expr = stack[i];
    markers.pop();
    while (i > 1) {
      expr = this.createBinaryExpression(stack[i - 1], stack[i - 2], expr);
      i -= 2;
      marker = markers.pop();
      /* istanbul ignore else */
      if (marker) {
        marker.apply(expr);
      }
    }

    return expr;
  };

  SCParser.prototype.binaryPrecedence = function(token) {
    var table, prec = 0;

    if (this.opts.binaryPrecedence) {
      if (typeof this.opts.binaryPrecedence === "object") {
        table = this.opts.binaryPrecedence;
      } else {
        table = binaryPrecedenceDefaults;
      }
    } else {
      table = {};
    }
    switch (token.type) {
    case Token.Punctuator:
      if (token.value !== "=") {
        if (table.hasOwnProperty(token.value)) {
          prec = table[token.value];
        } else if (/^[-+*\/%<=>!?&|@]+$/.test(token.value)) {
          prec = 255;
        }
      }
      break;
    case Token.Label:
      prec = 255;
      break;
    }

    return prec;
  };

  SCParser.prototype.parseAdverb = function() {
    var adverb, lookahead;

    if (this.match(".")) {
      this.lex();

      lookahead = this.lookahead;
      adverb = this.parsePrimaryExpression();

      if (adverb.type === Syntax.Literal) {
        return adverb;
      }

      if (adverb.type === Syntax.Identifier) {
        adverb.type = Syntax.Literal;
        adverb.value = adverb.name;
        adverb.valueType = Token.SymbolLiteral;
        delete adverb.name;
        return adverb;
      }

      this.throwUnexpected(lookahead);
    }

    return null;
  };

  // 4.6 Unary Expressions
  SCParser.prototype.parseUnaryExpression = function(node) {
    var token, expr;

    this.markStart();

    if (this.match("`")) {
      token = this.lex();
      expr = this.parseUnaryExpression();
      expr = this.createUnaryExpression(token.value, expr);
    } else {
      expr = this.parseLeftHandSideExpression(node);
    }

    return this.markEnd(expr);
  };

  // 4.7 LeftHandSide Expressions
  SCParser.prototype.parseLeftHandSideExpression = function(node) {
    var marker, expr, args, m, prev, lookahead, closedFunction;
    var disallowGenerator, blocklist;
    var method;

    this.skipComment();

    marker = this.createLocationMarker();
    expr = this.parsePrimaryExpression(node);

    blocklist = false;

    while ((m = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      lookahead = this.lookahead;
      if ((prev === "{" && (m !== "#" && m !== "{")) || (prev === "(" && m === "(")) {
        this.throwUnexpected(lookahead);
      }
      switch (m) {
      case "(":
        if (this.isClassName(expr)) {
          method = this.markTouch(this.createIdentifier("new"));
          args   = this.parseCallArgument();
          expr   = this.createCallExpression(expr, method, args, "(");
        } else {
          if (expr.type !== Syntax.Identifier) {
            this.throwUnexpected(this.lookahead);
          }
          args = this.parseCallArgument();

          method = expr;
          expr   = args.list.shift();
          if (!expr) {
            if (args.expand) {
              expr = args.expand;
              delete args.expand;
            } else {
              this.throwUnexpected(lookahead);
            }
          }
          expr = this.createCallExpression(expr, method, args, "("); // TODO: max(0, 1)  .. (?
        }
        break;
      case "#":
        closedFunction = this.state.closedFunction;
        this.state.closedFunction = true;
        this.lex();
        if (!this.match("{")) {
          this.throwUnexpected(this.lookahead);
        }
        m = "{";
        /* falls through */
      case "{":
        if (expr.type === Syntax.CallExpression && expr.stamp && expr.stamp !== "(") {
          this.throwUnexpected(this.lookahead);
        }
        if (expr.type === Syntax.Identifier) {
          if (this.isClassName(expr)) {
            method = this.markTouch(this.createIdentifier("new"));
            expr   = this.createCallExpression(expr, method, { list: [] }, m);
          } else {
            expr = this.createCallExpression(null, expr, { list: [] });
          }
        }
        lookahead = this.lookahead;
        disallowGenerator = this.state.disallowGenerator;
        this.state.disallowGenerator = true;
        node = this.parseBraces(true);
        this.state.disallowGenerator = disallowGenerator;
        this.state.closedFunction = closedFunction;

        // TODO: refactoring
        if (expr.callee === null) {
          expr.callee = node;
          node = expr;
        } else {
          expr.args.list.push(node);
        }

        break;
      case "[":
        if (expr.type === Syntax.CallExpression && expr.stamp === "(") {
          this.throwUnexpected(this.lookahead);
        }
        if (this.isClassName(expr)) {
          expr = this.parseLeftHandSideNewFrom(expr);
        } else {
          expr = this.parseLeftHandSideListAt(expr);
        }
        break;
      case ".":
        this.lex();
        if (this.match("(")) {
          method = this.markTouch(this.createIdentifier("value"));
          args   = this.parseCallArgument();
          expr   = this.createCallExpression(expr, method, args, ".");
        } else if (this.match("[")) {
           // TODO: fix
          var expr0;
          method = this.markTouch(this.createIdentifier("value"));
          expr0  = expr;
          expr   = this.markTouch(this.createCallExpression(expr, method, { list: [] }, "."));
          /* istanbul ignore else */
          if (this.opts.range) {
            expr.range[0] = expr0.range[0];
          }
          /* istanbul ignore else */
          if (this.opts.loc) {
            expr.loc.start = expr0.loc.start;
          }
          expr = this.parseLeftHandSideListAt(expr);
        } else {
          method = this.parseProperty();
          if (this.match("(")) {
            args = this.parseCallArgument();
            expr = this.createCallExpression(expr, method, args);
          } else {
            expr = this.createCallExpression(expr, method, { list: [] });
          }
        }
        break;
      }
      /* istanbul ignore else */
      if (marker) {
        marker.apply(expr);
      }
      prev = m;
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideNewFrom = function(expr) {
    var node, method;

    method = this.markTouch(this.createIdentifier("newFrom"));

    this.skipComment();
    this.markStart();

    node = this.markEnd(this.parseListInitialiser());

    return this.createCallExpression(expr, method, { list: [ node ] }, "[");
  };

  SCParser.prototype.parseLeftHandSideListAt = function(expr) {
    var indexes, method;

    method = this.markTouch(this.createIdentifier("at"));

    indexes = this.parseListIndexer();
    if (indexes) {
      if (indexes.length === 3) {
        method.name = "copySeries";
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    return this.createCallExpression(expr, method, { list: indexes }, "[");
  };

  SCParser.prototype.parseCallArgument = function() {
    var args, node, key, value, hasKeyword, lookahead;

    args = { list: [] };
    hasKeyword = false;

    this.expect("(");

    while (this.lookahead.type !== Token.EOF && !this.match(")")) {
      lookahead = this.lookahead;
      if (!hasKeyword) {
        if (this.match("*")) {
          this.lex();
          args.expand = this.parseExpressions();
          hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          key = this.lex().value;
          value = this.parseExpressions();
          args.keywords = {};
          args.keywords[key] = value;
          hasKeyword = true;
        } else {
          node = this.parseExpressions();
          args.list.push(node);
        }
      } else {
        if (lookahead.type !== Token.Label) {
          this.throwUnexpected(lookahead);
        }
        key = this.lex().value;
        value = this.parseExpressions();
        if (!args.keywords) {
          args.keywords = {};
        }
        args.keywords[key] = value;
      }
      if (this.match(")")) {
        break;
      }
      this.expect(",");
    }

    this.expect(")");

    return args;
  };

  SCParser.prototype.parseListIndexer = function() {
    var first = null, second = null, last = null;
    var node = null;

    this.expect("[");

    if (!this.match("]")) {

      if (this.match("..")) {
        // [..A]
        this.lex();
        if (!this.match("]")) {
          last = this.parseExpressions();
          node = [ null, null, last ];
        } else {
          node = [ null, null, null ];
        }
      } else {
        if (!this.match(",")) {
          first = this.parseExpressions();
        } else {
          this.throwUnexpected(this.lookahead);
        }
        if (this.match("..")) {
          this.lex();
          if (!this.match("]")) {
            // [A..B]
            last = this.parseExpressions();
          }
          node = [ first, null, last ];
        } else if (this.match(",")) {
          this.lex();
          second = this.parseExpressions();
          if (this.match("..")) {
            // [A, B..C]
            this.lex();
            if (!this.match("]")) {
              last = this.parseExpressions();
            }
          } else {
            this.throwUnexpected(this.lookahead);
          }
          node = [ first, second, last ];
        } else {
          // [A]
          node = [ first ];
        }
      }
    }

    this.expect("]");

    if (node === null) {
      this.throwUnexpected({ value: "]" });
    }

    return node;
  };

  SCParser.prototype.parseProperty = function() {
    var token;

    this.skipComment();
    this.markStart();
    token = this.lex();

    if (token.type !== Token.Identifier || this.isClassName(token)) {
      this.throwUnexpected(token);
    }

    return this.markEnd(this.createIdentifier(token.value));
  };

  // 4.8 Primary Expressions
  SCParser.prototype.parsePrimaryExpression = function(node) {
    var expr, token, lookahead, closedFunction, disallowGenerator;

    if (node) {
      return node;
    }

    this.skipComment();
    this.markStart();

    if (this.match("~")) {
      this.lex();
      expr = this.createGlobalExpression(this.parseIdentifier());
    } else {
      lookahead = this.lookahead;

      switch (this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type) {
      case "(":
        expr = this.parseParentheses();
        break;
      case "{":
        expr = this.parseBraces();
        break;
      case "[":
        expr = this.parseListInitialiser();
        break;
      case "#":
        this.lex();
        switch (this.matchAny([ "[", "{" ])) {
        case "[":
          if (this.state.immutableList) {
            this.throwUnexpected(lookahead);
          }
          this.state.immutableList = true;
          expr = this.parseListInitialiser();
          this.state.immutableList = false;
          break;
        case "{":
          disallowGenerator = this.state.disallowGenerator;
          this.state.disallowGenerator = true;
          closedFunction = this.state.closedFunction;
          this.state.closedFunction = true;
          expr = this.parseBraces();
          this.state.closedFunction = closedFunction;
          this.state.disallowGenerator = disallowGenerator;
          break;
        default:
          expr = {};
          this.throwUnexpected(this.lookahead);
          break;
        }
        break;
      case Token.Keyword:
        if (Keywords[this.lookahead.value] === "keyword") {
          this.throwUnexpected(this.lookahead);
        }
        expr = this.createThisExpression(this.lex().value);
        break;
      case Token.Identifier:
        lookahead = this.lookahead;
        expr = this.parseIdentifier();
        if (expr.name === "_") {
          expr.name = "$_" + this.state.underscore.length.toString();
          this.state.underscore.push(expr);
        }
        break;
      case Token.CharLiteral:
      case Token.FloatLiteral:
      case Token.FalseLiteral:
      case Token.IntegerLiteral:
      case Token.NilLiteral:
      case Token.SymbolLiteral:
      case Token.TrueLiteral:
        expr = this.createLiteral(this.lex());
        break;
      case Token.StringLiteral:
        token = this.lex();
        if (this.isInterpolatedString(token.value)) {
          expr = this.parseInterpolatedString(token.value);
        } else {
          expr = this.createLiteral(token);
        }
        break;
      }
    }

    if (!expr) {
      expr = {};
      this.throwUnexpected(this.lex());
    }

    return this.markEnd(expr);
  };

  SCParser.prototype.isInterpolatedString = function(value) {
    var re = /(^|[^\x5c])#\{/;
    return re.test(value);
  };

  SCParser.prototype.parseInterpolatedString = function(value) {
    var len, items;
    var i, j, ch, depth, code, parser;

    len = value.length;
    items = [];

    i = 0;

    do {
      j = i;
      LOOP1: while (j < len) {
        ch = value.charAt(j);
        switch (ch) {
        case "#":
          if (value.charAt(j + 1) === "{") {
            break LOOP1;
          }
          break;
        case "\\":
          j += 1;
          break;
        }
        j += 1;
      }

      if (j >= len) {
        break;
      }
      code = value.substr(i, j - i);
      if (code) {
        items.push('"' + code + '"');
      }
      i = j + 2;
      j = i;
      depth = 0;
      LOOP2: while (j < len) {
        ch = value.charAt(j);
        switch (ch) {
        case "}":
          if (depth === 0) {
            code = value.substr(i, j - i);
            if (code) {
              items.push("(" + code + ").asString");
            }
            break LOOP2;
          }
          depth -= 1;
          break;
        case "{":
          depth += 1;
          break;
        }
        j += 1;
      }
      i = j + 1;
    } while (i < len);

    if (i < len) {
      items.push('"' + value.substr(i) + '"');
    }

    code = items.join("++");
    parser = new SCParser(code, {});
    parser.peek();

    return parser.parseExpression();
  };

  // ( ... )
  SCParser.prototype.parseParentheses = function() {
    var marker, node, expr, generator;

    this.skipComment();

    marker = this.createLocationMarker();
    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    if (this.lookahead.type === Token.Label) {
      expr = this.parseObjectInitialiser();
    } else if (this.matchKeyword("var")) {
      expr = this.withScope(function() {
        var body;
        body = this.parseFunctionBody(")");
        return this.createBlockExpression(body);
      });
    } else if (this.match("..")) {
      expr = this.parseSeriesInitialiser(null, generator);
    } else if (this.match(")")) {
      expr = this.createObjectExpression([]);
    } else {
      node = this.parseExpression();
      if (this.matchAny([ ",", ".." ])) {
        expr = this.parseSeriesInitialiser(node, generator);
      } else if (this.match(":")) {
        expr = this.parseObjectInitialiser(node);
      } else if (this.match(";")) {
        expr = this.parseExpressions(node);
        if (this.matchAny([ ",", ".." ])) {
          expr = this.parseSeriesInitialiser(expr, generator);
        }
        marker = null;
      } else {
        expr = this.parseExpression(node);
        marker = null;
      }
    }

    this.expect(")");

    /* istanbul ignore else */
    if (marker) {
      marker.apply(expr);
    }

    return expr;
  };

  SCParser.prototype.parseObjectInitialiser = function(node) {
    var elements = [], innerElements;

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    if (node) {
      this.expect(":");
    } else {
      node = this.parseLabelAsSymbol();
    }
    elements.push(node, this.parseExpression());

    if (this.match(",")) {
      this.lex();
    }

    while (this.lookahead.type !== Token.EOF && !this.match(")")) {
      if (this.lookahead.type === Token.Label) {
        node = this.parseLabelAsSymbol();
      } else {
        node = this.parseExpression();
        this.expect(":");
      }
      elements.push(node, this.parseExpression());
      if (!this.match(")")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return this.createObjectExpression(elements);
  };

  SCParser.prototype.parseSeriesInitialiser = function(node, generator) {
    var first = null, second = null, last = null;
    var method, innerElements;

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    method = this.markTouch(this.createIdentifier(
      generator ? "seriesIter" : "series"
    ));

    if (node === null) {
      // (..last)
      first = this.markTouch({
        type: Syntax.Literal,
        value: "0",
        valueType: Token.IntegerLiteral
      });
      this.expect("..");
      if (this.match(")")) {
        if (!generator) {
          this.throwUnexpected(this.lookahead);
        }
      } else {
        last = this.parseExpressions();
      }
    } else {
      first = node;
      if (this.match(",")) {
        // (first, second .. last)
        this.lex();
        second = this.parseExpressions();
        if (Array.isArray(second) && second.length === 0) {
          this.throwUnexpected(this.lookahead);
        }
        this.expect("..");
        if (!this.match(")")) {
          last = this.parseExpressions();
        } else if (!generator) {
          this.throwUnexpected(this.lookahead);
        }
      } else {
        // (first..last)
        this.lex();
        if (!this.match(")")) {
          last = this.parseExpressions();
        } else if (!generator) {
          this.throwUnexpected(this.lookahead);
        }
      }
    }

    this.state.innerElements = innerElements;

    return this.createCallExpression(first, method, { list: [ second, last ] });
  };

  SCParser.prototype.parseListInitialiser = function() {
    var elements, innerElements;

    elements = [];

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    this.expect("[");

    while (this.lookahead.type !== Token.EOF && !this.match("]")) {
      if (this.lookahead.type === Token.Label) {
        elements.push(this.parseLabelAsSymbol(), this.parseExpression());
      } else {
        elements.push(this.parseExpression());
        if (this.match(":")) {
          this.lex();
          elements.push(this.parseExpression());
        }
      }
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.expect("]");

    this.state.innerElements = innerElements;

    return this.createListExpression(elements, this.state.immutableList);
  };

  // { ... }
  SCParser.prototype.parseBraces = function(blocklist) {
    var expr;

    this.skipComment();
    this.markStart();

    this.expect("{");

    if (this.match(":")) {
      if (!this.state.disallowGenerator) {
        this.lex();
        expr = this.parseGeneratorInitialiser();
      } else {
        expr = {};
        this.throwUnexpected(this.lookahead);
      }
    } else {
      expr = this.parseFunctionExpression(this.state.closedFunction, blocklist);
    }

    this.expect("}");

    return this.markEnd(expr);
  };

  SCParser.prototype.parseGeneratorInitialiser = function() {
    this.throwError({}, Message.NotImplemented, "generator literal");

    this.parseExpression();
    this.expect(",");

    while (this.lookahead.type !== Token.EOF && !this.match("}")) {
      this.parseExpression();
      if (!this.match("}")) {
        this.expect(",");
      }
    }

    return this.createLiteral({ value: "null", valueType: Token.NilLiteral });
  };

  SCParser.prototype.parseLabel = function() {
    this.skipComment();
    this.markStart();
    return this.markEnd(this.createLabel(this.lex().value));
  };

  SCParser.prototype.parseLabelAsSymbol = function() {
    var label, node;

    label = this.parseLabel();
    node  = {
      type: Syntax.Literal,
      value: label.name,
      valueType: Token.SymbolLiteral
    };

    /* istanbul ignore else */
    if (label.range) {
      node.range = label.range;
    }
    /* istanbul ignore else */
    if (label.loc) {
      node.loc = label.loc;
    }

    return node;
  };

  SCParser.prototype.parseIdentifier = function() {
    var expr;

    this.skipComment();
    this.markStart();

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    expr = this.lex();

    return this.markEnd(this.createIdentifier(expr.value));
  };

  SCParser.prototype.parseVariableIdentifier = function() {
    var token, value, ch;

    this.skipComment();
    this.markStart();

    token = this.lex();
    value = token.value;

    if (token.type !== Token.Identifier) {
      this.throwUnexpected(token);
    } else {
      ch = value.charAt(0);
      if (("A" <= ch && ch <= "Z") || ch === "_") {
        this.throwUnexpected(token);
      }
    }

    return this.markEnd(this.createIdentifier(value));
  };

  SCParser.prototype.markStart = function() {
    /* istanbul ignore else */
    if (this.opts.loc) {
      this.marker.push(
        this.index - this.lineStart,
        this.lineNumber
      );
    }
    /* istanbul ignore else */
    if (this.opts.range) {
      this.marker.push(
        this.index
      );
    }
  };

  SCParser.prototype.markEnd = function(node) {
    if (Array.isArray(node) || node.range || node.loc) {
      /* istanbul ignore else */
      if (this.opts.range) {
        this.marker.pop();
      }
      /* istanbul ignore else */
      if (this.opts.loc) {
        this.marker.pop();
        this.marker.pop();
      }
    } else {
      /* istanbul ignore else */
      if (this.opts.range) {
        node.range = [ this.marker.pop(), this.index ];
      }
      /* istanbul ignore else */
      if (this.opts.loc) {
        node.loc = {
          start: {
            line: this.marker.pop(),
            column: this.marker.pop()
          },
          end: {
            line: this.lineNumber,
            column: this.index - this.lineStart
          }
        };
      }
    }
    return node;
  };

  SCParser.prototype.markTouch = function(node) {
    /* istanbul ignore else */
    if (this.opts.range) {
      node.range = [ this.index, this.index ];
    }
    /* istanbul ignore else */
    if (this.opts.loc) {
      node.loc = {
        start: {
          line: this.lineNumber,
          column: this.index - this.lineStart
        },
        end: {
          line: this.lineNumber,
          column: this.index - this.lineStart
        }
      };
    }
    return node;
  };

  SCParser.prototype.throwError = function(token, messageFormat) {
    var args, message;
    var error, index, lineNumber, column;
    var prev;

    args = Array.prototype.slice.call(arguments, 2);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    if (typeof token.lineNumber === "number") {
      index = token.range[0];
      lineNumber = token.lineNumber;
      column = token.range[0] - token.lineStart + 1;
    } else {
      index = this.index;
      lineNumber = this.lineNumber;
      column = this.index - this.lineStart + 1;
    }

    error = new Error("Line " + lineNumber + ": " + message);
    error.index = index;
    error.lineNumber = lineNumber;
    error.column = column;
    error.description = message;

    if (this.errors) {
      prev = this.errors[this.errors.length - 1];
      if (!(prev && error.index <= prev.index)) {
        this.errors.push(error);
      }
    } else {
      throw error;
    }
  };

  SCParser.prototype.throwUnexpected = function(token) {
    switch (token.type) {
    case Token.EOF:
      this.throwError(token, Message.UnexpectedEOS);
      break;
    case Token.FloatLiteral:
    case Token.IntegerLiteral:
      this.throwError(token, Message.UnexpectedNumber);
      break;
    case Token.CharLiteral:
      this.throwError(token, Message.UnexpectedChar);
      break;
    case Token.StringLiteral:
      this.throwError(token, Message.UnexpectedString);
      break;
    case Token.SymbolLiteral:
      this.throwError(token, Message.UnexpectedSymbol);
      break;
    case Token.Identifier:
      this.throwError(token, Message.UnexpectedIdentifier);
      break;
    default:
      this.throwError(token, Message.UnexpectedToken, token.value);
      break;
    }
  };

  parser.parse = function(source, opts) {
    var instance, ast;

    opts = opts || /* istanbul ignore next */ {};

    instance = new SCParser(source, opts);
    ast = instance.parse();

    if (!!opts.tokens && typeof instance.tokens !== "undefined") {
      ast.tokens = instance.tokens;
    }
    if (!!opts.tolerant && typeof instance.errors !== "undefined") {
      ast.errors = instance.errors;
    }

    return ast;
  };

  sc.lang.parser = parser;

  var SCScript = sc.SCScript;

  SCScript.tokenize = function(source, opts) {
    opts = opts || /* istanbul ignore next */ {};
    opts.tokens = true;
    return parser.parse(source, opts).tokens || /* istanbul ignore next */ [];
  };

  SCScript.parse = parser.parse;

})(sc);

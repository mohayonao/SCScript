(function(sc) {
  "use strict";

  require("./sc");
  require("./compiler");
  require("./scope");
  require("./lexer");
  require("./marker");
  require("./node");

  var parser = {};

  var Token    = sc.lang.compiler.Token;
  var Syntax   = sc.lang.compiler.Syntax;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;
  var Lexer    = sc.lang.compiler.lexer;
  var Marker   = sc.lang.compiler.marker;
  var Node     = sc.lang.compiler.node;

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

  var Scope = sc.lang.compiler.scope({
    begin: function() {
      var declared = this.getDeclaredVariable();

      this.stack.push({
        vars: {},
        args: {},
        declared: declared
      });
    }
  });

  function SCParser(source, opts) {
    var binaryPrecedence;

    this.opts  = opts || /* istanbul ignore next */ {};
    this.lexer = new Lexer(source, opts);
    this.scope = new Scope(this);
    this.state = {
      closedFunction: false,
      disallowGenerator: false,
      innerElements: false,
      immutableList: false,
      underscore: []
    };

    if (this.opts.binaryPrecedence) {
      if (typeof this.opts.binaryPrecedence === "object") {
        binaryPrecedence = this.opts.binaryPrecedence;
      } else {
        binaryPrecedence = binaryPrecedenceDefaults;
      }
    }

    this.binaryPrecedence = binaryPrecedence || {};
  }

  Object.defineProperty(SCParser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  SCParser.prototype.lex = function() {
    return this.lexer.lex();
  };

  SCParser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
  };

  SCParser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  SCParser.prototype.matchAny = function(list) {
    var value, i, imax;

    value = this.lexer.lookahead.value;
    for (i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }

    return null;
  };

  SCParser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
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
    case Token.StringLiteral:
    case Token.SymbolLiteral:
      this.throwError(token, Message.UnexpectedLiteral, token.type.toLowerCase());
      break;
    case Token.Identifier:
      this.throwError(token, Message.UnexpectedIdentifier);
      break;
    default:
      this.throwError(token, Message.UnexpectedToken, token.value);
      break;
    }
  };

  SCParser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
  };

  SCParser.prototype.parse = function() {
    return this.parseProgram();
  };

  // 1. Program
  SCParser.prototype.parseProgram = function() {
    var node, marker;

    marker = Marker.create(this.lexer);

    node = this.withScope(function() {
      var body;

      body = this.parseFunctionBody(null);
      if (body.length === 1 && body[0].type === Syntax.BlockExpression) {
        body = body[0].body;
      }

      return Node.createProgram(body);
    });

    return marker.update().apply(node);
  };

  // 2. Function
  // 2.1 Function Expression
  SCParser.prototype.parseFunctionExpression = function(closed, blocklist) {
    var node;

    node = this.withScope(function() {
      var args, body;

      if (this.match("|")) {
        args = this.parseFunctionArgument("|");
      } else if (this.match("arg")) {
        args = this.parseFunctionArgument(";");
      }
      body = this.parseFunctionBody("}");

      return Node.createFunctionExpression(args, body, closed, false, blocklist);
    });

    return node;
  };

  // 2.2 Function Argument
  SCParser.prototype.parseFunctionArgument = function(expect) {
    var args = { list: [] };

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
      args.remain = this.parseVariableIdentifier();
      this.scope.add("arg", args.remain.name);
    }

    this.expect(expect);

    return args;
  };

  SCParser.prototype._parseArgVarElement = function(type, method) {
    var init = null, id;
    var marker, declarator;

    marker = Marker.create(this.lexer);

    id = this.parseVariableIdentifier();
    this.scope.add(type, id.name);

    if (this.match("=")) {
      this.lex();
      init = this[method]();
    }

    declarator = Node.createVariableDeclarator(id, init);

    return marker.update().apply(declarator);
  };

  SCParser.prototype.parseFunctionArgumentElement = function() {
    var node = this._parseArgVarElement("arg", "parseArgumentableValue");

    if (node.init && !isValidArgumentValue(node.init)) {
      this.throwUnexpected(this.lookahead);
    }

    return node;
  };

  // 2.3 Function Body
  SCParser.prototype.parseFunctionBody = function(match) {
    var elements = [];

    while (this.match("var")) {
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
    var marker;

    marker = Marker.create(this.lexer);

    this.lex(); // var

    declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarationList(), "var"
    );

    declaration = marker.update().apply(declaration);

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
    return this._parseArgVarElement("var", "parseAssignmentExpression");
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
      var marker;

      marker = Marker.create(this.lexer);
      node   = this.parseAssignmentExpression();
      node   = marker.update().apply(node);

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
    var token, marker;

    if (node) {
      return this.parsePartialExpression(node);
    }

    marker = Marker.create(this.lexer);

    if (this.match("#")) {
      token = this.lexer.lex(true);
      if (this.matchAny([ "[", "{" ])) {
        token.revert();
      } else {
        node = this.parseDestructuringAssignmentExpression();
      }
    }

    if (!node) {
      node = this.parseSimpleAssignmentExpression();
    }

    return marker.update().apply(node);
  };

  SCParser.prototype.parseDestructuringAssignmentExpression = function() {
    var node, left, right, token;

    left = this.parseDestructuringAssignmentLeft();
    token = this.lookahead;
    this.expect("=");

    right = this.parseAssignmentExpression();
    node = Node.createAssignmentExpression(
      token.value, left.list, right, left.remain
    );

    return node;
  };

  SCParser.prototype.parseSimpleAssignmentExpression = function() {
    var node, left, right, token, methodName, marker;

    node = left = this.parsePartialExpression();

    if (this.match("=")) {
      if (node.type === Syntax.CallExpression) {
        marker = Marker.create(this.lexer, left);

        token = this.lex();
        right = this.parseAssignmentExpression();
        methodName = renameGetterToSetter(left.method.name);
        left.method.name = methodName;
        left.args.list   = node.args.list.concat(right);
        if (methodName.charAt(methodName.length - 1) === "_") {
          left.stamp = "=";
        }
        node = marker.update().apply(left, true);
      } else {
        if (!isLeftHandSide(left)) {
          this.throwError(left, Message.InvalidLHSInAssignment);
        }

        token = this.lex();
        right = this.parseAssignmentExpression();
        node  = Node.createAssignmentExpression(
          token.value, left, right
        );
      }
    }

    return node;
  };

  SCParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = { list: [] }, element;

    do {
      element = this.parseLeftHandSideExpression();
      if (!isLeftHandSide(element)) {
        this.throwError(element, Message.InvalidLHSInAssignment);
      }
      params.list.push(element);
      if (this.match(",")) {
        this.lex();
      } else if (this.match("...")) {
        this.lex();
        params.remain = this.parseLeftHandSideExpression();
        if (!isLeftHandSide(params.remain)) {
          this.throwError(params.remain, Message.InvalidLHSInAssignment);
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
            y = Node.createVariableDeclarator(x);
            args[i] = Marker.create(this.lexer, x).update(x).apply(y);
            this.scope.add("arg", this.state.underscore[i].name);
          }

          return Node.createFunctionExpression(
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
    var marker, left, token, prec;

    marker = Marker.create(this.lexer);
    left   = this.parseUnaryExpression(node);
    token  = this.lookahead;

    prec = calcBinaryPrecedence(token, this.binaryPrecedence);
    if (prec === 0) {
      if (node) {
        return this.parseUnaryExpression(node);
      }
      return left;
    }
    this.lex();

    token.prec   = prec;
    token.adverb = this.parseAdverb();

    return this.sortByBinaryPrecedence(left, token, marker);
  };

  SCParser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var expr;
    var prec, token;
    var markers, i;
    var right, stack;

    markers = [ marker, Marker.create(this.lexer) ];
    right = this.parseUnaryExpression();

    stack = [ left, operator, right ];

    while ((prec = calcBinaryPrecedence(this.lookahead, this.binaryPrecedence)) > 0) {
      // Reduce: make a binary expression from the three topmost entries.
      while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
        right    = stack.pop();
        operator = stack.pop();
        left     = stack.pop();
        expr = Node.createBinaryExpression(operator, left, right);
        markers.pop();

        marker = markers.pop();
        marker.update().apply(expr);

        stack.push(expr);

        markers.push(marker);
      }

      // Shift.
      token = this.lex();
      token.prec = prec;
      token.adverb = this.parseAdverb();

      stack.push(token);

      markers.push(Marker.create(this.lexer));
      expr = this.parseUnaryExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    i = stack.length - 1;
    expr = stack[i];
    markers.pop();
    while (i > 1) {
      expr = Node.createBinaryExpression(stack[i - 1], stack[i - 2], expr);
      i -= 2;
      marker = markers.pop();
      marker.update().apply(expr);
    }

    return expr;
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
    var token, expr, method;
    var marker;

    marker = Marker.create(this.lexer);

    switch (this.matchAny([ "`", "-" ])) {
    case "`":
      token = this.lex();
      expr = this.parseLeftHandSideExpression();
      expr = Node.createUnaryExpression(token.value, expr);
      break;
    case "-":
      token = this.lex();
      method = Node.createIdentifier("neg");
      method = marker.update().apply(method);
      expr = this.parseLeftHandSideExpression();
      expr = Node.createCallExpression(expr, method, { list: [] }, ".");
      break;
    default:
      expr = this.parseLeftHandSideExpression(node);
      break;
    }

    return marker.update().apply(expr, true);
  };

  // 4.7 LeftHandSide Expressions
  SCParser.prototype.parseLeftHandSideExpression = function(node) {
    var marker, expr, prev, lookahead;
    var blocklist, stamp;

    marker = Marker.create(this.lexer);
    expr   = this.parsePrimaryExpression(node);

    blocklist = false;

    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      lookahead = this.lookahead;
      if ((prev === "{" && (stamp === "(" || stamp === "[")) ||
          (prev === "(" && stamp === "(")) {
        this.throwUnexpected(lookahead);
      }
      switch (stamp) {
      case "(":
        expr = this.parseLeftHandSideParenthesis(expr);
        break;
      case "#":
        expr = this.parseLeftHandSideClosedBrace(expr);
        break;
      case "{":
        expr = this.parseLeftHandSideBrace(expr);
        break;
      case "[":
        expr = this.parseLeftHandSideBracket(expr);
        break;
      case ".":
        expr = this.parseLeftHandSideDot(expr);
        break;
      }
      marker.update().apply(expr, true);

      prev = stamp;
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideParenthesis = function(expr) {
    if (isClassName(expr)) {
      return this.parseLeftHandSideClassNew(expr);
    }

    return this.parseLeftHandSideMethodCall(expr);
  };

  SCParser.prototype.parseLeftHandSideClassNew = function(expr) {
    var method, args;

    method = Node.createIdentifier("new");
    method = Marker.create(this.lexer).apply(method);

    args   = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, "(");
  };

  SCParser.prototype.parseLeftHandSideMethodCall = function(expr) {
    var method, args, lookahead;

    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    lookahead = this.lookahead;
    args      = this.parseCallArgument();

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

    // max(0, 1) -> 0.max(1)
    return Node.createCallExpression(expr, method, args, "(");
  };

  SCParser.prototype.parseLeftHandSideClosedBrace = function(expr) {
    this.lex();
    if (!this.match("{")) {
      this.throwUnexpected(this.lookahead);
    }

    this.state.closedFunction = true;
    expr = this.parseLeftHandSideBrace(expr);
    this.state.closedFunction = false;

    return expr;
  };

  SCParser.prototype.parseLeftHandSideBrace = function(expr) {
    var method, lookahead, disallowGenerator, node;

    if (expr.type === Syntax.CallExpression && expr.stamp && expr.stamp !== "(") {
      this.throwUnexpected(this.lookahead);
    }
    if (expr.type === Syntax.Identifier) {
      if (isClassName(expr)) {
        method = Node.createIdentifier("new");
        method = Marker.create(this.lexer).apply(method);
        expr   = Node.createCallExpression(expr, method, { list: [] }, "{");
      } else {
        expr = Node.createCallExpression(null, expr, { list: [] });
      }
    }
    lookahead = this.lookahead;
    disallowGenerator = this.state.disallowGenerator;
    this.state.disallowGenerator = true;
    node = this.parseBraces(true);
    this.state.disallowGenerator = disallowGenerator;

    // TODO: refactoring
    if (expr.callee === null) {
      expr.callee = node;
      node = expr;
    } else {
      expr.args.list.push(node);
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideBracket = function(expr) {
    if (expr.type === Syntax.CallExpression && expr.stamp === "(") {
      this.throwUnexpected(this.lookahead);
    }

    if (isClassName(expr)) {
      expr = this.parseLeftHandSideNewFrom(expr);
    } else {
      expr = this.parseLeftHandSideListAt(expr);
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideNewFrom = function(expr) {
    var node, method;
    var marker;

    method = Node.createIdentifier("_newFrom");
    method = Marker.create(this.lexer).apply(method);

    marker = Marker.create(this.lexer);
    node = this.parseListInitialiser();
    node = marker.update().apply(node);

    return Node.createCallExpression(expr, method, { list: [ node ] }, "[");
  };

  SCParser.prototype.parseLeftHandSideListAt = function(expr) {
    var indexes, method;

    method = Node.createIdentifier("at");
    method = Marker.create(this.lexer).apply(method);

    indexes = this.parseListIndexer();
    if (indexes) {
      if (indexes.length === 3) {
        method.name = "copySeries";
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createCallExpression(expr, method, { list: indexes }, "[");
  };

  SCParser.prototype.parseLeftHandSideDot = function(expr) {
    var method, args;

    this.lex();

    if (this.match("(")) {
      // expr.()
      return this.parseLeftHandSideDotValue(expr);
    } else if (this.match("[")) {
      // expr.[0]
      return this.parseLeftHandSideDotBracket(expr);
    }

    method = this.parseProperty();
    if (this.match("(")) {
      // expr.method(args)
      args = this.parseCallArgument();
      return Node.createCallExpression(expr, method, args);
    }

    // expr.method
    return Node.createCallExpression(expr, method, { list: [] });
  };

  SCParser.prototype.parseLeftHandSideDotValue = function(expr) {
    var method, args;

    method = Node.createIdentifier("value");
    method = Marker.create(this.lexer).apply(method);

    args   = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, ".");
  };

  SCParser.prototype.parseLeftHandSideDotBracket = function(expr) {
    var method, marker;

    marker = Marker.create(this.lexer, expr);

    method = Node.createIdentifier("value");
    method = Marker.create(this.lexer).apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, ".");
    expr = marker.update().apply(expr);

    return this.parseLeftHandSideListAt(expr);
  };

  SCParser.prototype.parseCallArgument = function() {
    var args, node, hasKeyword, lookahead;

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
          this.parseCallArgumentKeyword(args);
          hasKeyword = true;
        } else {
          node = this.parseExpressions();
          args.list.push(node);
        }
      } else {
        if (lookahead.type !== Token.Label) {
          this.throwUnexpected(lookahead);
        }
        this.parseCallArgumentKeyword(args);
      }
      if (this.match(")")) {
        break;
      }
      this.expect(",");
    }

    this.expect(")");

    return args;
  };

  SCParser.prototype.parseCallArgumentKeyword = function(args) {
    var key, value;

    key = this.lex().value;
    value = this.parseExpressions();
    if (!args.keywords) {
      args.keywords = {};
    }
    args.keywords[key] = value;
  };

  SCParser.prototype.parseListIndexer = function() {
    var node = null;

    this.expect("[");

    if (!this.match("]")) {
      if (this.match("..")) {
        // [..last] / [..]
        node = this.parseListIndexerWithoutFirst();
      } else {
        // [first] / [first..last] / [first, second..last]
        node = this.parseListIndexerWithFirst();
      }
    }

    this.expect("]");

    if (node === null) {
      this.throwUnexpected({ value: "]" });
    }

    return node;
  };

  SCParser.prototype.parseListIndexerWithoutFirst = function() {
    var last;

    this.lex();

    if (!this.match("]")) {
      last = this.parseExpressions();

      // [..last]
      return [ null, null, last ];
    }

    // [..]
    return [ null, null, null ];
  };

  SCParser.prototype.parseListIndexerWithFirst = function() {
    var first = null;

    if (!this.match(",")) {
      first = this.parseExpressions();
    } else {
      this.throwUnexpected(this.lookahead);
    }

    if (this.match("..")) {
      return this.parseListIndexerWithoutSecond(first);
    } else if (this.match(",")) {
      return this.parseListIndexerWithSecond(first);
    }

    // [first]
    return [ first ];
  };

  SCParser.prototype.parseListIndexerWithoutSecond = function(first) {
    var last = null;

    this.lex();

    if (!this.match("]")) {
      last = this.parseExpressions();
    }

    // [first..last]
    return [ first, null, last ];
  };

  SCParser.prototype.parseListIndexerWithSecond = function(first) {
    var second, last = null;

    this.lex();

    second = this.parseExpressions();
    if (this.match("..")) {
      this.lex();
      if (!this.match("]")) {
        last = this.parseExpressions();
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    // [first, second..last]
    return [ first, second, last ];
  };

  SCParser.prototype.parseProperty = function() {
    var token, id;
    var marker;

    marker = Marker.create(this.lexer);
    token = this.lex();

    if (token.type !== Token.Identifier || isClassName(token)) {
      this.throwUnexpected(token);
    }

    id = Node.createIdentifier(token.value);

    return marker.update().apply(id);
  };

  // 4.8 Primary Expressions
  SCParser.prototype.parseArgumentableValue = function() {
    var expr, stamp;
    var marker;

    marker = Marker.create(this.lexer);

    stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;

    switch (stamp) {
    case "#":
      expr = this.parsePrimaryHashedExpression();
      break;
    case Token.CharLiteral:
    case Token.FloatLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.NilLiteral:
    case Token.SymbolLiteral:
    case Token.TrueLiteral:
      expr = Node.createLiteral(this.lex());
      break;
    }

    if (!expr) {
      expr = {};
      this.throwUnexpected(this.lex());
    }

    return marker.update().apply(expr);
  };

  SCParser.prototype.parsePrimaryExpression = function(node) {
    var expr, stamp;
    var marker;

    if (node) {
      return node;
    }

    marker = Marker.create(this.lexer);

    if (this.match("~")) {
      this.lex();
      expr = this.parseIdentifier();
      if (isClassName(expr)) {
        this.throwUnexpected({ type: Token.Identifier, value: expr.id });
      }
      expr = Node.createEnvironmentExpresion(expr);
    } else {
      stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;
      switch (stamp) {
      case "(":
        expr = this.parseParentheses();
        break;
      case "{":
        expr = this.parseBraces();
        break;
      case "[":
        expr = this.parseListInitialiser();
        break;
      case Token.Keyword:
        expr = this.parsePrimaryKeywordExpression();
        break;
      case Token.Identifier:
        expr = this.parsePrimaryIdentifier();
        break;
      case Token.StringLiteral:
        expr = this.parsePrimaryStringExpression();
        break;
      default:
        expr = this.parseArgumentableValue(stamp);
        break;
      }
    }

    return marker.update().apply(expr);
  };

  SCParser.prototype.parsePrimaryHashedExpression = function() {
    var expr, lookahead;

    lookahead = this.lookahead;

    this.lex();

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      expr = this.parsePrimaryImmutableListExpression(lookahead);
      break;
    case "{":
      expr = this.parsePrimaryClosedFunctionExpression();
      break;
    default:
      expr = {};
      this.throwUnexpected(this.lookahead);
      break;
    }

    return expr;
  };

  SCParser.prototype.parsePrimaryImmutableListExpression = function(lookahead) {
    var expr;

    if (this.state.immutableList) {
      this.throwUnexpected(lookahead);
    }

    this.state.immutableList = true;
    expr = this.parseListInitialiser();
    this.state.immutableList = false;

    return expr;
  };

  SCParser.prototype.parsePrimaryClosedFunctionExpression = function() {
    var expr, disallowGenerator, closedFunction;

    disallowGenerator = this.state.disallowGenerator;
    closedFunction    = this.state.closedFunction;

    this.state.disallowGenerator = true;
    this.state.closedFunction    = true;
    expr = this.parseBraces();
    this.state.closedFunction    = closedFunction;
    this.state.disallowGenerator = disallowGenerator;

    return expr;
  };


  SCParser.prototype.parsePrimaryKeywordExpression = function() {
    if (Keywords[this.lookahead.value] === "keyword") {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createThisExpression(this.lex().value);
  };

  SCParser.prototype.parsePrimaryIdentifier = function() {
    var expr, lookahead;

    lookahead = this.lookahead;

    expr = this.parseIdentifier();

    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }

    return expr;
  };

  SCParser.prototype.isInterpolatedString = function(value) {
    var re = /(^|[^\x5c])#\{/;
    return re.test(value);
  };

  SCParser.prototype.parsePrimaryStringExpression = function() {
    var token;

    token = this.lex();

    if (this.isInterpolatedString(token.value)) {
      return this.parseInterpolatedString(token.value);
    }

    return Node.createLiteral(token);
  };

  SCParser.prototype.parseInterpolatedString = function(value) {
    var len, items;
    var index1, index2, code, parser;

    len = value.length;
    items = [];

    index1 = 0;

    do {
      index2 = findString$InterpolatedString(value, index1);
      if (index2 >= len) {
        break;
      }
      code = value.substr(index1, index2 - index1);
      if (code) {
        items.push('"' + code + '"');
      }

      index1 = index2 + 2;
      index2 = findExpression$InterpolatedString(value, index1, items);

      code = value.substr(index1, index2 - index1);
      if (code) {
        items.push("(" + code + ").asString");
      }

      index1 = index2 + 1;
    } while (index1 < len);

    if (index1 < len) {
      items.push('"' + value.substr(index1) + '"');
    }

    code = items.join("++");
    parser = new SCParser(code, {});

    return parser.parseExpression();
  };

  // ( ... )
  SCParser.prototype.parseParentheses = function() {
    var marker, expr, generator;

    marker = Marker.create(this.lexer);

    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    if (this.lookahead.type === Token.Label) {
      expr = this.parseObjectInitialiser();
    } else if (this.match("var")) {
      expr = this.withScope(function() {
        var body;
        body = this.parseFunctionBody(")");
        return Node.createBlockExpression(body);
      });
    } else if (this.match("..")) {
      expr = this.parseSeriesInitialiser(null, generator);
    } else if (this.match(")")) {
      expr = Node.createEventExpression([]);
    } else {
      expr = this.parseParenthesesGuess(generator, marker);
    }

    this.expect(")");

    marker.update().apply(expr);

    return expr;
  };

  SCParser.prototype.parseParenthesesGuess = function(generator) {
    var node, expr;

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
    } else {
      expr = this.parseExpression(node);
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

    return Node.createEventExpression(elements);
  };

  SCParser.prototype.parseSeriesInitialiser = function(node, generator) {
    var method, innerElements;
    var items = [];

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    method = Node.createIdentifier(generator ? "seriesIter" : "series");
    method = Marker.create(this.lexer).apply(method);

    if (node === null) {
      // (..), (..last)
      items = this.parseSeriesInitialiserWithoutFirst(generator);
    } else {
      items = this.parseSeriesInitialiserWithFirst(node, generator);
    }

    this.state.innerElements = innerElements;

    return Node.createCallExpression(items.shift(), method, { list: items });
  };

  SCParser.prototype.parseSeriesInitialiserWithoutFirst = function(generator) {
    var first, last = null;

    // (..last)
    first = {
      type: Syntax.Literal,
      value: "0",
      valueType: Token.IntegerLiteral
    };
    first = Marker.create(this.lexer).apply(first);

    this.expect("..");
    if (this.match(")")) {
      if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    } else {
      last = this.parseExpressions();
    }

    return [ first, null, last ];
  };

  SCParser.prototype.parseSeriesInitialiserWithFirst = function(node, generator) {
    var first, second = null, last = null;

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

    return [ first, second, last ];
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

    return Node.createListExpression(elements, this.state.immutableList);
  };

  // { ... }
  SCParser.prototype.parseBraces = function(blocklist) {
    var expr;
    var marker;

    marker = Marker.create(this.lexer);

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

    return marker.update().apply(expr);
  };

  SCParser.prototype.parseGeneratorInitialiser = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");

    this.parseExpression();
    this.expect(",");

    while (this.lookahead.type !== Token.EOF && !this.match("}")) {
      this.parseExpression();
      if (!this.match("}")) {
        this.expect(",");
      }
    }

    return Node.createLiteral({ value: "null", valueType: Token.NilLiteral });
  };

  SCParser.prototype.parseLabel = function() {
    var label, marker;

    marker = Marker.create(this.lexer);

    label = Node.createLabel(this.lex().value);

    return marker.update().apply(label);
  };

  SCParser.prototype.parseLabelAsSymbol = function() {
    var marker, label, node;

    marker = Marker.create(this.lexer);

    label = this.parseLabel();
    node  = {
      type: Syntax.Literal,
      value: label.name,
      valueType: Token.SymbolLiteral
    };

    node = marker.update().apply(node);

    return node;
  };

  SCParser.prototype.parseIdentifier = function() {
    var expr;
    var marker;

    marker = Marker.create(this.lexer);

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    expr = this.lex();
    expr = Node.createIdentifier(expr.value);

    return marker.update().apply(expr);
  };

  SCParser.prototype.parseVariableIdentifier = function() {
    var token, value, ch;
    var id, marker;

    marker = Marker.create(this.lexer);

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

    id = Node.createIdentifier(value);

    return marker.update().apply(id);
  };

  var renameGetterToSetter = function(methodName) {
    switch (methodName) {
    case "at"        : return "put";
    case "copySeries": return "putSeries";
    }
    return methodName + "_";
  };

  var calcBinaryPrecedence = function(token, binaryPrecedence) {
    var prec = 0;

    switch (token.type) {
    case Token.Punctuator:
      if (token.value !== "=") {
        if (binaryPrecedence.hasOwnProperty(token.value)) {
          prec = binaryPrecedence[token.value];
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

  var isClassName = function(node) {
    var name, ch;

    if (node.type === Syntax.Identifier) {
      name = node.value || node.name;
      ch = name.charAt(0);
      return "A" <= ch && ch <= "Z";
    }

    return false;
  };

  var isLeftHandSide = function(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.EnvironmentExpresion:
      return true;
    }
    return false;
  };

  var isValidArgumentValue = function(node) {
    if (node.type === Syntax.Literal) {
      return true;
    }
    if (node.type === Syntax.ListExpression) {
      return node.elements.every(function(node) {
        return node.type === Syntax.Literal;
      });
    }

    return false;
  };

  var findString$InterpolatedString = function(value, index) {
    var len, ch;

    len = value.length;

    while (index < len) {
      ch = value.charAt(index);
      if (ch === "#") {
        if (value.charAt(index + 1) === "{") {
          break;
        }
      } else if (ch === "\\") {
        index += 1;
      }
      index += 1;
    }

    return index;
  };

  var findExpression$InterpolatedString = function(value, index) {
    var len, depth, ch;

    len = value.length;

    depth = 0;
    while (index < len) {
      ch = value.charAt(index);
      if (ch === "}") {
        if (depth === 0) {
          break;
        }
        depth -= 1;
      } else if (ch === "{") {
        depth += 1;
      }
      index += 1;
    }

    return index;
  };

  parser.parse = function(source, opts) {
    var instance, ast;

    opts = opts || /* istanbul ignore next */ {};

    instance = new SCParser(source, opts);
    ast = instance.parse();

    if (!!opts.tolerant && typeof instance.lexer.errors !== "undefined") {
      ast.errors = instance.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = parser;

})(sc);

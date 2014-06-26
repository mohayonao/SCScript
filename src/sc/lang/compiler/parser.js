(function(sc) {
  "use strict";

  require("./compiler");
  require("./scope");
  require("./lexer");
  require("./marker");
  require("./node");
  require("./interpolate-string");

  var parser = {};

  var Token    = sc.lang.compiler.Token;
  var Syntax   = sc.lang.compiler.Syntax;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;
  var Lexer    = sc.lang.compiler.lexer;
  var Node     = sc.lang.compiler.node;
  var InterpolateString = sc.lang.compiler.InterpolateString;

  var binaryPrecedenceDefaults = {
    "?": 1,
    "??": 1,
    "!?": 1,
    "->": 2,
    "||": 3,
    "&&": 4,
    "|": 5,
    "&": 6,
    "==": 7,
    "!=": 7,
    "===": 7,
    "!==": 7,
    "<": 8,
    ">": 8,
    "<=": 8,
    ">=": 8,
    "<<": 9,
    ">>": 9,
    "+>>": 9,
    "+": 10,
    "-": 10,
    "*": 11,
    "/": 11,
    "%": 11,
    "!": 12
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

  function Parser(source, opts) {
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

  Object.defineProperty(Parser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  Parser.prototype.lex = function() {
    return this.lexer.lex();
  };

  Parser.prototype.unlex = function(token) {
    return this.lexer.unlex(token);
  };

  Parser.prototype.expect = function(value) {
    var token = this.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
    return token;
  };

  Parser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  Parser.prototype.matchAny = function(list) {
    var value = this.lexer.lookahead.value;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }
    return null;
  };

  Parser.prototype.createMarker = function(node) {
    return this.lexer.createMarker(node);
  };

  Parser.prototype.hasNextToken = function() {
    return this.lookahead.type !== Token.EOF;
  };

  Parser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  Parser.prototype.throwUnexpected = function(token) {
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

  Parser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
  };

  Parser.prototype.parse = function() {
    return this.parseProgram();
  };

  /*
    Program :
      FunctionBody(opt)
  */
  Parser.prototype.parseProgram = function() {
    var marker = this.createMarker();

    var node = this.withScope(function() {
      var body = this.parseFunctionBody(null);
      return Node.createProgram(body);
    });

    return marker.update().apply(node);
  };

  /*
    FunctionExpression :
      { FunctionArgumentDefinition(opt) FunctionBody(opt) }
  */
  Parser.prototype.parseFunctionExpression = function(closed, blocklist) {
    this.expect("{");

    var node = this.withScope(function() {
      var args = this.parseFunctionArgumentDefinition();
      var body = this.parseFunctionBody("}");
      return Node.createFunctionExpression(args, body, closed, false, blocklist);
    });

    this.expect("}");

    return node;
  };

  /*
    FunctionArgumentDefinition :
         | FunctionArguments |
      args FunctionArguments ;
  */
  Parser.prototype.parseFunctionArgumentDefinition = function() {
    if (this.match("|")) {
      return this.parseFunctionArguments("|");
    }
    if (this.match("arg")) {
      return this.parseFunctionArguments(";");
    }
    return null;
  };

  /*
    FunctionArguments :
      FunctionArgumentList
      FunctionArgumentList ... VariableIdentifier
                           ... VariableIdentifier
  */
  Parser.prototype.parseFunctionArguments = function(expect) {
    var args = { list: [] };

    this.lex();

    args.list = this.parseFunctionArgumentList(expect);

    if (this.match("...")) {
      this.lex();
      args.remain = this.parseVariableIdentifier();
      this.scope.add("arg", args.remain.name);
    }

    this.expect(expect);

    return args;
  };

  /*
      FunctionArgumentList :
        FunctionArgumentElement
        FunctionArgumentList , FunctionArgumentElement
  */
  Parser.prototype.parseFunctionArgumentList = function(expect) {
    var elements = [];

    if (!this.match("...")) {
      do {
        elements.push(this.parseFunctionArgumentElement());
        if ((expect !== "|" && !this.match(",")) || this.matchAny([ expect, "..." ])) {
          break;
        }
        if (this.match(",")) {
          this.lex();
        }
      } while (this.hasNextToken());
    }

    return elements;
  };

  Parser.prototype._parseArgVarElement = function(type, method) {
    var marker = this.createMarker();

    var id = this.parseVariableIdentifier();
    this.scope.add(type, id.name);

    var init = null;
    if (this.match("=")) {
      this.lex();
      init = this[method]();
    }

    var declarator = Node.createVariableDeclarator(id, init);

    return marker.update().apply(declarator);
  };

  /*
    FunctionArgumentElement :
      VariableIdentifier
      VariableIdentifier = ArgumentableValue
  */
  Parser.prototype.parseFunctionArgumentElement = function() {
    var node = this._parseArgVarElement("arg", "parseArgumentableValue");

    if (node.init && !isValidArgumentValue(node.init)) {
      this.throwUnexpected(this.lookahead);
    }

    return node;
  };

  /*
    FunctionBody :
      VariableDeclarations(opt) SourceElements(opt)
  */
  Parser.prototype.parseFunctionBody = function(match) {
    return this.parseVariableDeclarations().concat(this.parseSourceElements(match));
  };

  /*
    VariableDeclarations :
      VariableDeclaration
      VariableDeclarations VariableDeclaration
  */
  Parser.prototype.parseVariableDeclarations = function() {
    var elements = [];

    while (this.match("var")) {
      elements.push(this.parseVariableDeclaration());
    }

    return elements;
  };

  /*
    SourceElements :
      Expression
      SourceElements ; Expression
  */
  Parser.prototype.parseSourceElements = function(match) {
    var elements = [];

    while (this.hasNextToken() && !this.match(match)) {
      elements.push(this.parseExpression());
      if (this.hasNextToken() && !this.match(match)) {
        this.expect(";");
      } else {
        break;
      }
    }

    return elements;
  };

  /*
    VariableDeclaration :
      var VariableDeclarationList ;
  */
  Parser.prototype.parseVariableDeclaration = function() {
    var marker = this.createMarker();

    this.lex(); // var

    var declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarationList(), "var"
    );

    declaration = marker.update().apply(declaration);

    this.expect(";");

    return declaration;
  };

  /*
    VariableDeclarationList :
      VariableDeclarationElement
      VariableDeclarationList , VariableDeclarationElement
  */
  Parser.prototype.parseVariableDeclarationList = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclarationElement());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.hasNextToken());

    return list;
  };

  /*
    VariableDeclarationElement :
      VariableIdentifier
      VariableIdentifier = AssignmentExpression
  */
  Parser.prototype.parseVariableDeclarationElement = function() {
    return this._parseArgVarElement("var", "parseAssignmentExpression");
  };

  /*
    Expression :
      AssignmentExpression
  */
  Parser.prototype.parseExpression = function(node) {
    return this.parseAssignmentExpression(node);
  };

  /*
    Expressions :
      AssignmentExpression
      Expressions ; AssignmentExpression
  */
  Parser.prototype.parseExpressions = function(node) {
    var nodes = [];

    if (node) {
      nodes.push(node);
      this.lex();
    }

    while (this.hasNextToken() && !this.matchAny([ ",", ")", "]", ".." ])) {
      var marker = this.createMarker();
      node = this.parseAssignmentExpression();
      node = marker.update().apply(node);

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

  /*
    AssignmentExpression :
      SimpleAssignmentExpression
      # DestructuringAssignmentExpression
  */
  Parser.prototype.parseAssignmentExpression = function(node) {
    if (node) {
      return this.parsePartialExpression(node);
    }

    var marker = this.createMarker();

    var token;
    if (this.match("#")) {
      token = this.lex();
      if (this.matchAny([ "[", "{" ])) {
        token = this.unlex(token);
      } else {
        node = this.parseDestructuringAssignmentExpression();
      }
    }

    if (!node) {
      node = this.parseSimpleAssignmentExpression();
    }

    return marker.update().apply(node, true);
  };

  /*
    DestructuringAssignmentExpression :
      DestructuringAssignmentLeft = AssignmentExpression
  */
  Parser.prototype.parseDestructuringAssignmentExpression = function() {
    var left = this.parseDestructuringAssignmentLeft();
    var operator = this.lookahead;
    this.expect("=");
    var right = this.parseAssignmentExpression();

    return Node.createAssignmentExpression(
      operator.value, left.list, right, left.remain
    );
  };

  /*
    SimpleAssignmentExpression :
      PartialExpression
      PartialExpression = AssignmentExpression
  */
  Parser.prototype.parseSimpleAssignmentExpression = function() {
    var node = this.parsePartialExpression();

    if (this.match("=")) {
      if (node.type === Syntax.CallExpression) {
        node = this._parseSimpleAssignmentCallExpression(node);
      } else {
        node = this._parseSimpleAssignmentExpression(node);
      }
    }

    return node;
  };

  Parser.prototype._parseSimpleAssignmentCallExpression = function(node) {
    this.expect("=");

    var marker = this.createMarker(node);
    var right = this.parseAssignmentExpression();

    node.method.name = node.method.name + "_";
    node.args.list   = node.args.list.concat(right);
    if (node.stamp !== "[")  {
      node.stamp = "=";
    }

    return marker.update().apply(node, true);
  };

  Parser.prototype._parseSimpleAssignmentExpression = function(node) {
    if (!isLeftHandSide(node)) {
      this.throwError(node, Message.InvalidLHSInAssignment);
    }

    var token = this.lex();
    var right = this.parseAssignmentExpression();

    return Node.createAssignmentExpression(token.value, node, right);
  };

  /*
    DestructuringAssignmentLeft :
      DestructingAssignmentLeftList
      DestructingAssignmentLeftList ... VariableIdentifier
  */
  Parser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = {};

    params.list = this.parseDestructingAssignmentLeftList();

    if (this.match("...")) {
      this.lex();
      params.remain = this.parseVariableIdentifier();
    }

    return params;
  };

  /*
    DestructingAssignmentLeftList :
      VariableIdentifier
      DestructingAssignmentLeftList , VariableIdentifier
  */
  Parser.prototype.parseDestructingAssignmentLeftList = function() {
    var elemtns = [];

    do {
      elemtns.push(this.parseVariableIdentifier());
      if (this.match(",")) {
        this.lex();
      }
    } while (this.hasNextToken() && !this.matchAny([ "...", "=" ]));

    return elemtns;
  };

  /*
    PartialExpression :
      BinaryExpression
  */
  Parser.prototype.parsePartialExpression = function(node) {
    if (this.state.innerElements) {
      return this.parseBinaryExpression(node);
    }

    var underscore = this.state.underscore;
    this.state.underscore = [];

    node = this.parseBinaryExpression(node);

    if (this.state.underscore.length) {
      node = this.withScope(function() {
        var args = new Array(this.state.underscore.length);
        for (var i = 0, imax = args.length; i < imax; ++i) {
          var x = this.state.underscore[i];
          var y = Node.createVariableDeclarator(x);
          args[i] = this.createMarker(x).update(x).apply(y);
          this.scope.add("arg", this.state.underscore[i].name);
        }

        return Node.createFunctionExpression(
          { list: args }, [ node ], false, true, false
        );
      });
    }

    this.state.underscore = underscore;

    return node;
  };

  /*
    BinaryExpression :
      LeftHandSideExpression
      BinaryExpression BinaryOperator LeftHandSideExpression
  */
  Parser.prototype.parseBinaryExpression = function(node) {
    var marker = this.createMarker();
    var left   = this.parseLeftHandSideExpression(node);
    var operator = this.lookahead;

    var prec = calcBinaryPrecedence(operator, this.binaryPrecedence);
    if (prec === 0) {
      if (node) {
        return this.parseLeftHandSideExpression(node);
      }
      return left;
    }
    this.lex();

    operator.prec   = prec;
    operator.adverb = this.parseAdverb();

    return this.sortByBinaryPrecedence(left, operator, marker);
  };

  // TODO: fix to read easily
  Parser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var markers = [ marker, this.createMarker() ];
    var right = this.parseLeftHandSideExpression();

    var stack = [ left, operator, right ];

    var prec, expr;
    while ((prec = calcBinaryPrecedence(this.lookahead, this.binaryPrecedence)) > 0) {
      prec = sortByBinaryPrecedence(prec, stack, markers);

      // Shift.
      var token = this.lex();
      token.prec = prec;
      token.adverb = this.parseAdverb();

      stack.push(token);

      markers.push(this.createMarker());
      expr = this.parseLeftHandSideExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    var i = stack.length - 1;
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

  function sortByBinaryPrecedence(prec, stack, markers) {
    // Reduce: make a binary expression from the three topmost entries.
    while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
      var right    = stack.pop();
      var operator = stack.pop();
      var left     = stack.pop();
      var expr = Node.createBinaryExpression(operator, left, right);
      markers.pop();

      var marker = markers.pop();
      marker.update().apply(expr);

      stack.push(expr);

      markers.push(marker);
    }

    return prec;
  }

  /* TODO: ???
    Adverb :
      . PrimaryExpression
  */
  Parser.prototype.parseAdverb = function() {
    if (!this.match(".")) {
      return null;
    }

    this.lex();

    var lookahead = this.lookahead;
    var adverb = this.parsePrimaryExpression();

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

    return null;
  };

  /*
    LeftHandSideExpression :
      TODO: write
  */
  Parser.prototype.parseLeftHandSideExpression = function(node) {
    var marker = this.createMarker();
    var expr = this.parseSignedExpression(node);
    var prev = null;

    var stamp;
    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      var lookahead = this.lookahead;
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

  Parser.prototype.parseLeftHandSideParenthesis = function(expr) {
    if (isClassName(expr)) {
      // Class()
      return this.parseLeftHandSideAbbreviatedMethodCall(expr, "new", "(");
    }
    // func(a) -> a.func()
    return this.parseLeftHandSideMethodCall(expr);
  };

  Parser.prototype.parseLeftHandSideMethodCall = function(expr) {
    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var lookahead = this.lookahead;
    var args      = this.parseCallArgument();

    var method = expr;

    expr = args.list.shift();

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

  Parser.prototype.parseLeftHandSideAbbreviatedMethodCall = function(expr, methodName, stamp) {
    var method = Node.createIdentifier(methodName);

    method = this.createMarker().apply(method);

    var args = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, stamp);
  };

  Parser.prototype.parseLeftHandSideClosedBrace = function(expr) {
    this.expect("#");
    if (!this.match("{")) {
      this.throwUnexpected(this.lookahead);
    }

    this.state.closedFunction = true;
    expr = this.parseLeftHandSideBrace(expr);
    this.state.closedFunction = false;

    return expr;
  };

  Parser.prototype.parseLeftHandSideBrace = function(expr) {
    var method, node;

    if (expr.type === Syntax.CallExpression && expr.stamp && expr.stamp !== "(") {
      this.throwUnexpected(this.lookahead);
    }
    if (expr.type === Syntax.Identifier) {
      if (isClassName(expr)) {
        method = Node.createIdentifier("new");
        method = this.createMarker().apply(method);
        expr   = Node.createCallExpression(expr, method, { list: [] }, "{");
      } else {
        expr = Node.createCallExpression(null, expr, { list: [] });
      }
    }
    var disallowGenerator = this.state.disallowGenerator;
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

  Parser.prototype.parseLeftHandSideBracket = function(expr) {
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

  Parser.prototype.parseLeftHandSideNewFrom = function(expr) {
    var method = Node.createIdentifier("[]");
    method = this.createMarker().apply(method);

    var marker = this.createMarker();

    var node = this.parseListInitialiser();
    node = marker.update().apply(node);

    return Node.createCallExpression(expr, method, { list: [ node ] }, "[");
  };

  Parser.prototype.parseLeftHandSideListAt = function(expr) {
    var method = Node.createIdentifier("[]");
    method = this.createMarker().apply(method);

    var indexer = this.parseListIndexer();
    if (indexer) {
      if (indexer.length === 3) {
        method.name = "[..]";
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createCallExpression(expr, method, { list: indexer }, "[");
  };

  Parser.prototype.parseLeftHandSideDot = function(expr) {
    this.expect(".");

    if (this.match("(")) {
      // expr.()
      return this.parseLeftHandSideAbbreviatedMethodCall(expr, "value", ".");
    }
    if (this.match("[")) {
      // expr.[0]
      return this.parseLeftHandSideDotBracket(expr);
    }

    var method = this.parseProperty();
    if (this.match("(")) {
      // expr.method(args)
      var args = this.parseCallArgument();
      return Node.createCallExpression(expr, method, args);
    }

    // expr.method
    return Node.createCallExpression(expr, method, { list: [] });
  };

  Parser.prototype.parseLeftHandSideDotBracket = function(expr) {
    var marker = this.createMarker(expr);

    var method = Node.createIdentifier("value");
    method = this.createMarker().apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, ".");
    expr = marker.update().apply(expr);

    return this.parseLeftHandSideListAt(expr);
  };

  Parser.prototype.parseCallArgument = function() {
    var args = { list: [] };
    var hasKeyword = false;

    this.expect("(");

    while (this.hasNextToken() && !this.match(")")) {
      var lookahead = this.lookahead;
      if (!hasKeyword) {
        if (this.match("*")) {
          this.lex();
          args.expand = this.parseExpressions();
          hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          this.parseCallArgumentKeyword(args);
          hasKeyword = true;
        } else {
          args.list.push(this.parseExpressions());
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

  Parser.prototype.parseCallArgumentKeyword = function(args) {
    var key = this.lex().value;
    var value = this.parseExpressions();
    if (!args.keywords) {
      args.keywords = {};
    }
    args.keywords[key] = value;
  };

  Parser.prototype.parseListIndexer = function() {
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

  Parser.prototype.parseListIndexerWithoutFirst = function() {
    var last;

    this.expect("..");

    if (!this.match("]")) {
      last = this.parseExpressions();

      // [..last]
      return [ null, null, last ];
    }

    // [..]
    return [ null, null, null ];
  };

  Parser.prototype.parseListIndexerWithFirst = function() {
    if (this.match(",")) {
      this.throwUnexpected(this.lookahead);
    }

    var first = this.parseExpressions();

    if (this.match("..")) {
      return this.parseListIndexerWithoutSecond(first);
    } else if (this.match(",")) {
      return this.parseListIndexerWithSecond(first);
    }

    // [first]
    return [ first ];
  };

  Parser.prototype.parseListIndexerWithoutSecond = function(first) {
    this.expect("..");

    var last = null;
    if (!this.match("]")) {
      last = this.parseExpressions();
    }

    // [first..last]
    return [ first, null, last ];
  };

  Parser.prototype.parseListIndexerWithSecond = function(first) {
    this.expect(",");

    var second = this.parseExpressions();
    var last = null;
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

  Parser.prototype.parseProperty = function() {
    var marker = this.createMarker();
    var property = this.lex();

    if (property.type !== Token.Identifier || isClassName(property)) {
      this.throwUnexpected(property);
    }

    var id = Node.createIdentifier(property.value);

    return marker.update().apply(id);
  };

  /*
    ArgumentableValue :
      PrimaryHashedExpression (TODO: -> # HashedListExpression)
      CharLiteral
      FloatLiteral
      FalseLiteral
      IntegerLiteral
      NilLiteral
      SymbolLiteral
      TrueLiteral
  */
  Parser.prototype.parseArgumentableValue = function() {
    var marker = this.createMarker();

    var stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;

    var expr;
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

  /*
    SignedExpression :
      PrimaryExpression
      - PrimaryExpression
  */
  Parser.prototype.parseSignedExpression = function(node) {
    if (node) {
      return node;
    }

    var marker = this.createMarker();
    var expr;
    if (this.match("-")) {
      this.lex();
      var method = Node.createIdentifier("neg");
      method = marker.update().apply(method);
      expr = this.parsePrimaryExpression();
      if (isNumber(expr)) {
        expr.value = "-" + expr.value;
      } else {
        expr = Node.createCallExpression(expr, method, { list: [] }, ".");
      }
    } else {
      expr = this.parsePrimaryExpression();
    }

    return marker.update().apply(expr, true);
  };

  /*
    PrimaryExpression :
      ( ... )
      { ... }
      [ ... ]
      ~ ...
      ` ...
      Keyword
      Identifier
      StringLiteral
      ArgumentableValue
  */
  Parser.prototype.parsePrimaryExpression = function() {
    var marker = this.createMarker();
    var stamp = this.matchAny([ "(", "{", "[", "#", "`", "~" ]) || this.lookahead.type;
    var expr;

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
    case "`":
      expr = this.parseRefExpression();
      break;
    case "~":
      expr = this.parseEnvironmentExpression();
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

    return marker.update().apply(expr);
  };

  /*
    EnvironmentExpresion :
      ~ LeftHandSideExpression
  */
  Parser.prototype.parseEnvironmentExpression = function() {
    var marker = this.createMarker();

    this.expect("~");
    var expr = this.parseIdentifier();
    if (isClassName(expr)) {
      this.throwUnexpected({ type: Token.Identifier, value: expr.id });
    }
    expr = Node.createEnvironmentExpresion(expr);
    expr = marker.update().apply(expr);

    if (this.match(".")) {
      expr = this.parseLeftHandSideExpression(expr);
    }

    return expr;
  };

  /*
    RefExpression
  */
  Parser.prototype.parseRefExpression = function() {
    var marker = this.createMarker();

    this.expect("`");

    var expr = this.parseLeftHandSideExpression();
    expr = Node.createUnaryExpression("`", expr);

    return marker.update().apply(expr, true);
  };

  Parser.prototype.parsePrimaryHashedExpression = function() {
    var lookahead = this.lookahead;

    this.expect("#");

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      return this.parsePrimaryImmutableListExpression(lookahead);
    case "{":
      return this.parsePrimaryClosedFunctionExpression();
    }
    this.throwUnexpected(this.lookahead);

    return {};
  };

  Parser.prototype.parsePrimaryImmutableListExpression = function(lookahead) {
    if (this.state.immutableList) {
      this.throwUnexpected(lookahead);
    }

    var expr;
    this.state.immutableList = true;
    expr = this.parseListInitialiser();
    this.state.immutableList = false;

    return expr;
  };

  Parser.prototype.parsePrimaryClosedFunctionExpression = function() {
    var expr;
    var disallowGenerator = this.state.disallowGenerator;
    var closedFunction    = this.state.closedFunction;

    this.state.disallowGenerator = true;
    this.state.closedFunction    = true;
    expr = this.parseBraces();
    this.state.closedFunction    = closedFunction;
    this.state.disallowGenerator = disallowGenerator;

    return expr;
  };

  Parser.prototype.parsePrimaryKeywordExpression = function() {
    if (Keywords[this.lookahead.value] === "keyword") {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createThisExpression(this.lex().value);
  };

  Parser.prototype.parsePrimaryIdentifier = function() {
    var expr = this.parseIdentifier();
    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }
    return expr;
  };

  Parser.prototype.parsePrimaryStringExpression = function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(code, {}).parseExpression();
    }

    return Node.createLiteral(token);
  };

  // ( ... )
  Parser.prototype.parseParentheses = function() {
    var expr, generator;
    var marker = this.createMarker();

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

  Parser.prototype.parseParenthesesGuess = function(generator) {
    var node = this.parseExpression();

    if (this.matchAny([ ",", ".." ])) {
      return this.parseSeriesInitialiser(node, generator);
    }
    if (this.match(":")) {
      return this.parseObjectInitialiser(node);
    }

    if (this.match(";")) {
      var expr = this.parseExpressions(node);
      if (this.matchAny([ ",", ".." ])) {
        return this.parseSeriesInitialiser(expr, generator);
      }
      return expr;
    }

    return this.parseExpression(node);
  };

  Parser.prototype.parseObjectInitialiser = function(node) {
    var elements = [];

    var innerElements = this.state.innerElements;
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

    while (this.hasNextToken() && !this.match(")")) {
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

  Parser.prototype.parseSeriesInitialiser = function(node, generator) {
    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var method = Node.createIdentifier(generator ? "seriesIter" : "series");
    method = this.createMarker().apply(method);

    var items;
    if (node === null) {
      // (..), (..last)
      items = this.parseSeriesInitialiserWithoutFirst(generator);
    } else {
      items = this.parseSeriesInitialiserWithFirst(node, generator);
    }

    this.state.innerElements = innerElements;

    return Node.createCallExpression(items.shift(), method, { list: items });
  };

  Parser.prototype.parseSeriesInitialiserWithoutFirst = function(generator) {
    // (..last)
    var first = {
      type: Syntax.Literal,
      value: "0",
      valueType: Token.IntegerLiteral
    };
    first = this.createMarker().apply(first);

    this.expect("..");

    var last = null;
    if (this.match(")")) {
      if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    } else {
      last = this.parseExpressions();
    }

    return [ first, null, last ];
  };

  Parser.prototype.parseSeriesInitialiserWithFirst = function(node, generator) {
    var first = node, second = null, last = null;

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

  /*
    ListInitialiser :
      [ ListElements(opts) ]
  */
  Parser.prototype.parseListInitialiser = function() {
    this.expect("[");

    var elements = this.parseListElements();

    this.expect("]");

    return Node.createListExpression(elements, this.state.immutableList);
  };

  /*
    ListElements :
      ListElement
      ListElements , ListElement
  */
  Parser.prototype.parseListElements = function() {
    var elements = [];
    var innerElements = this.state.innerElements;

    this.state.innerElements = true;

    while (this.hasNextToken() && !this.match("]")) {
      elements = elements.concat(this.parseListElement());
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return elements;
  };

  /*
    ListElement :
      Expression : Expression
      Expression
  */
  Parser.prototype.parseListElement = function() {
    var elements = [];

    if (this.lookahead.type === Token.Label) {
      elements.push(this.parseLabelAsSymbol(), this.parseExpression());
    } else {
      elements.push(this.parseExpression());
      if (this.match(":")) {
        this.lex();
        elements.push(this.parseExpression());
      }
    }

    return elements;
  };

  /*
    Braces :
      { : GeneratorInitialiser }
      {   FunctionExpression   }
  */
  Parser.prototype.parseBraces = function(blocklist) {
    var marker = this.createMarker();

    var token = this.expect("{");

    var expr;
    if (this.match(":")) {
      if (!this.state.disallowGenerator) {
        this.unlex(token);
        expr = this.parseGeneratorInitialiser();
      } else {
        expr = {};
        this.throwUnexpected(this.lookahead);
      }
      this.expect("}"); // TODO: remove
    } else {
      this.unlex(token);
      expr = this.parseFunctionExpression(this.state.closedFunction, blocklist);
    }

    return marker.update().apply(expr);
  };

  Parser.prototype.parseGeneratorInitialiser = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");

    this.expect("{");
    this.expect(":");

    this.parseExpression();
    this.expect(",");

    while (this.hasNextToken() && !this.match("}")) {
      this.parseExpression();
      if (!this.match("}")) {
        this.expect(",");
      }
    }

    // this.expect("}");

    return Node.createLiteral({ value: "nil", valueType: Token.NilLiteral });
  };

  Parser.prototype.parseLabel = function() {
    var marker = this.createMarker();

    var label = Node.createLabel(this.lex().value);

    return marker.update().apply(label);
  };

  Parser.prototype.parseLabelAsSymbol = function() {
    var marker = this.createMarker();

    var label = this.parseLabel();
    var node  = {
      type: Syntax.Literal,
      value: label.name,
      valueType: Token.SymbolLiteral
    };

    node = marker.update().apply(node);

    return node;
  };

  Parser.prototype.parseIdentifier = function() {
    var marker = this.createMarker();

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var expr = this.lex();
    expr = Node.createIdentifier(expr.value);

    return marker.update().apply(expr);
  };

  Parser.prototype.parseVariableIdentifier = function() {
    var marker = this.createMarker();

    var token = this.lex();
    var value = token.value;

    if (token.type !== Token.Identifier) {
      this.throwUnexpected(token);
    } else {
      var ch = value.charAt(0);
      if (("A" <= ch && ch <= "Z") || ch === "_") {
        this.throwUnexpected(token);
      }
    }

    var id = Node.createIdentifier(value);

    return marker.update().apply(id);
  };

  function calcBinaryPrecedence(token, binaryPrecedence) {
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
  }

  function isNumber(node) {
    if (node.type !== Syntax.Literal) {
      return false;
    }
    var valueType = node.valueType;
    return valueType === Token.IntegerLiteral || valueType === Token.FloatLiteral;
  }

  function isClassName(node) {
    if (node.type !== Syntax.Identifier) {
      return false;
    }

    var name = node.value || node.name;
    var ch = name.charAt(0);

    return "A" <= ch && ch <= "Z";
  }

  function isLeftHandSide(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.EnvironmentExpresion:
      return true;
    }
    return false;
  }

  function isValidArgumentValue(node) {
    if (node.type === Syntax.Literal) {
      return true;
    }
    if (node.type === Syntax.ListExpression) {
      return node.elements.every(function(node) {
        return node.type === Syntax.Literal;
      });
    }

    return false;
  }

  parser.parse = function(source, opts) {
    opts = opts || /* istanbul ignore next */ {};

    var instance = new Parser(source, opts);
    var ast = instance.parse();

    if (!!opts.tolerant && typeof instance.lexer.errors !== "undefined") {
      ast.errors = instance.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = parser;
})(sc);

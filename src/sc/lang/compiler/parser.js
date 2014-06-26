(function(sc) {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./marker");
  require("./node");
  require("./interpolate-string");
  require("./parser/base-parser");
  require("./parser/function-expr");
  require("./parser/assignment-expr");
  require("./parser/binop-expr");
  require("./parser/list-expr");
  require("./parser/list-indexer");
  require("./parser/event-expr");
  require("./parser/series-expr");
  require("./parser/generator-expr");

  var parser = {};

  var Token    = sc.lang.compiler.Token;
  var Syntax   = sc.lang.compiler.Syntax;
  var Keywords = sc.lang.compiler.Keywords;
  var Lexer    = sc.lang.compiler.lexer;
  var Node     = sc.lang.compiler.Node;
  var InterpolateString = sc.lang.compiler.InterpolateString;
  var BaseParser = sc.lang.compiler.BaseParser;
  var FunctionExpressionParser = sc.lang.compiler.FunctionExpressionParser;
  var AssignmentExpressionParser = sc.lang.compiler.AssignmentExpressionParser;
  var BinaryExpressionParser = sc.lang.compiler.BinaryExpressionParser;
  var ListExpressionParser = sc.lang.compiler.ListExpressionParser;
  var ListIndexerParser = sc.lang.compiler.ListIndexerParser;
  var EventExpressionParser = sc.lang.compiler.EventExpressionParser;
  var SeriesExpressionParser = sc.lang.compiler.SeriesExpressionParser;
  var GeneratorExpressionParser = sc.lang.compiler.GeneratorExpressionParser;

  function Parser(source, opts) {
    opts = opts || /* istanbul ignore next */ {};

    BaseParser.call(this, new Lexer(source, opts));
    this.opts  = opts;

    var binaryPrecedence;
    if (this.opts.binaryPrecedence) {
      if (typeof this.opts.binaryPrecedence === "object") {
        binaryPrecedence = this.opts.binaryPrecedence;
      } else {
        binaryPrecedence = BinaryExpressionParser.binaryPrecedenceDefaults;
      }
    }

    this.binaryPrecedence = binaryPrecedence || {};
  }
  sc.libs.extend(Parser, BaseParser);

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

  Parser.prototype.parseFunctionExpression = function(opts) {
    return new FunctionExpressionParser(this).parse(opts);
  };

  Parser.prototype.parseFunctionBody = function(match) {
    return new FunctionExpressionParser(this).parseFunctionBody(match);
  };

  /*
    Expression :
      AssignmentExpression
  */
  Parser.prototype.parseExpression = function() {
    return this.parseAssignmentExpression();
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
  Parser.prototype.parseAssignmentExpression = function() {
    return new AssignmentExpressionParser(this).parse();
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
    return new BinaryExpressionParser(this).parse(node);
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
    node = this.parseBraces({ blocklist: true });
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

    var node = this.parseListExpression();
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

    var method = this.parseMethodName();
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
    return new ListIndexerParser(this).parse();
  };

  Parser.prototype.parseMethodName = function() {
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
      expr = this.parseHashedExpression();
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
      expr = this.parseListExpression();
      break;
    case "`":
      expr = this.parseRefExpression();
      break;
    case "~":
      expr = this.parseEnvironmentExpression();
      break;
    case Token.Keyword:
      expr = this.parseKeywordExpression();
      break;
    case Token.Identifier:
      expr = this.parsePrimaryIdentifier();
      break;
    case Token.StringLiteral:
      expr = this.parseStringExpression();
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

  /*
    HashedExpression :
      ImmutableListExpression
      ClosedFunctionExpression
  */
  Parser.prototype.parseHashedExpression = function() {
    var lookahead = this.lookahead;

    var token = this.expect("#");

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      return this.unlex(token).parseImmutableListExpression(lookahead);
    case "{":
      return this.unlex(token).parseClosedFunctionExpression();
    }
    this.throwUnexpected(this.lookahead);

    return {};
  };

  /*
    ClosedFunctionExpression :
      # FunctionExpression
  */
  Parser.prototype.parseClosedFunctionExpression = function() {
    var expr;
    var disallowGenerator = this.state.disallowGenerator;
    var closedFunction    = this.state.closedFunction;

    this.expect("#");

    this.state.disallowGenerator = true;
    this.state.closedFunction    = true;
    expr = this.parseFunctionExpression({ closed: true });
    this.state.closedFunction    = closedFunction;
    this.state.disallowGenerator = disallowGenerator;

    return expr;
  };

  Parser.prototype.parseKeywordExpression = function() {
    if (Keywords[this.lookahead.value] === "keyword") {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createThisExpression(this.lex().value);
  };

  Parser.prototype.parseStringExpression = function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(code, {}).parseExpression();
    }

    return Node.createLiteral(token);
  };

  // ( ... )
  Parser.prototype.parseParentheses = function() {
    var token = this.expect("(");

    if (this.match(":")) {
      this.lex();
    }

    var selector = this.selectParenthesesParseMethod();

    return this.unlex(token)[selector].call(this);
  };

  Parser.prototype.selectParenthesesParseMethod = function() {
    if (this.lookahead.type === Token.Label) {
      return "parseEventExpression";
    }
    if (this.match("var")) {
      return "parseBlockExpression";
    }
    if (this.match("..")) {
      return "parseSeriesExpression";
    }
    if (this.match(")")) {
      return "parseEventExpression";
    }
    var node = this.parseExpression();

    if (this.matchAny([ ",", ".." ])) {
      return "parseSeriesExpression";
    }
    if (this.match(":")) {
      return "parseEventExpression";
    }
    if (this.match(";")) {
      this.parseExpressions(node);
      if (this.matchAny([ ",", ".." ])) {
        return "parseSeriesExpression";
      }
      return "parseExpressionsWithParentheses";
    }

    return "parsePartialExpressionWithParentheses";
  };

  Parser.prototype.parseBlockExpression = function() {
    this.expect("(");

    var expr = this.withScope(function() {
      var body;
      body = this.parseFunctionBody(")");
      return Node.createBlockExpression(body);
    });

    this.expect(")");

    return expr;
  };

  Parser.prototype.parseExpressionsWithParentheses = function() {
    return this.parseWithParentheses("parseExpressions");
  };

  Parser.prototype.parsePartialExpressionWithParentheses = function() {
    return this.parseWithParentheses("parsePartialExpression");
  };

  Parser.prototype.parseWithParentheses = function(methodName) {
    this.expect("(");

    var marker = this.createMarker();
    var expr = this[methodName].call(this);
    expr = marker.update().apply(expr);

    this.expect(")");

    return expr;
  };

  Parser.prototype.parseEventExpression = function() {
    return new EventExpressionParser(this).parse();
  };

  Parser.prototype.parseSeriesExpression = function() {
    return new SeriesExpressionParser(this).parse();
  };

  /*
    ListExpression
  */
  Parser.prototype.parseListExpression = function() {
    return new ListExpressionParser(this).parse();
  };

  /*
    ImmutableListExpression :
      # ListExpression
  */
  Parser.prototype.parseImmutableListExpression = function(lookahead) {
    if (this.state.immutableList) {
      this.throwUnexpected(lookahead);
    }

    var expr;
    this.state.immutableList = true;
    this.expect("#");
    expr = this.parseListExpression();
    this.state.immutableList = false;

    return expr;
  };

  /*
    Braces :
      { : GeneratorInitialiser }
      {   FunctionExpression   }
  */
  Parser.prototype.parseBraces = function(opts) {
    opts = opts || /* istanbul ignore next */ {};
    var marker = this.createMarker();

    var token = this.expect("{");
    var matchColon = this.match(":");
    this.unlex(token);

    var expr;
    if (!opts.blocklist && matchColon) {
      expr = this.parseGeneratorExpression();
    } else {
      expr = this.parseFunctionExpression({
        closed: this.state.closedFunction,
        blocklist: opts.blocklist
      });
    }

    return marker.update().apply(expr);
  };

  Parser.prototype.parseGeneratorExpression = function() {
    return new GeneratorExpressionParser(this).parse();
  };

  Parser.prototype.parseLabel = function() {
    var marker = this.createMarker();

    var label = Node.createLiteral({
      value: this.lex().value,
      type: Token.SymbolLiteral
    });

    return marker.update().apply(label);
  };

  Parser.prototype.parsePrimaryIdentifier = function() {
    var expr = this.parseIdentifier();
    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }
    return expr;
  };

  Parser.prototype.parseIdentifier = function() {
    var marker = this.createMarker();

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var expr = Node.createIdentifier(this.lex().value);

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

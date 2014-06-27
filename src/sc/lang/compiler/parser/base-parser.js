(function(sc) {
  "use strict";

  require("../compiler");
  require("../scope");
  require("../node");
  require("../interpolate-string");

  var Token = sc.lang.compiler.Token;
  var Syntax = sc.lang.compiler.Syntax;
  var Keywords = sc.lang.compiler.Keywords;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;

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

  function BaseParser(parent, lexer) {
    if (parent) {
      this.parent = parent;
      this.lexer = parent.lexer;
      this.state = parent.state;
      this.scope = parent.scope;
    } else {
      this.parent = null;
      this.lexer = lexer;
      this.state = {
        closedFunction: false,
        disallowGenerator: false,
        innerElements: false,
        immutableList: false,
        underscore: []
      };
      this.scope = new Scope(this);
    }
  }

  BaseParser.addMethod = function(methodName, method) {
    BaseParser.prototype[methodName] = method;
  };

  Object.defineProperty(BaseParser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  BaseParser.prototype.lex = function() {
    return this.lexer.lex();
  };

  BaseParser.prototype.unlex = function(token) {
    this.lexer.unlex(token);
    return this;
  };

  BaseParser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
    return token;
  };

  BaseParser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  BaseParser.prototype.matchAny = function(list) {
    var value = this.lexer.lookahead.value;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }
    return null;
  };

  BaseParser.prototype.createMarker = function(node) {
    return this.lexer.createMarker(node);
  };

  BaseParser.prototype.hasNextToken = function() {
    return this.lookahead.type !== Token.EOF;
  };

  BaseParser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  BaseParser.prototype.throwUnexpected = function(token) {
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

  BaseParser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
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
  BaseParser.prototype.parseArgumentableValue = function() {
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
  BaseParser.prototype.parseSignedExpression = function(node) {
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
    EnvironmentExpresion :
      ~ LeftHandSideExpression
  */
  BaseParser.prototype.parseEnvironmentExpression = function() {
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
  BaseParser.prototype.parseRefExpression = function() {
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
  BaseParser.prototype.parseHashedExpression = function() {
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
  BaseParser.prototype.parseClosedFunctionExpression = function() {
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

  BaseParser.prototype.parseKeywordExpression = function() {
    if (Keywords[this.lookahead.value] === "keyword") {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createThisExpression(this.lex().value);
  };

  // ( ... )
  BaseParser.prototype.parseParentheses = function() {
    var token = this.expect("(");

    if (this.match(":")) {
      this.lex();
    }

    var selector = this.selectParenthesesParseMethod();

    return this.unlex(token)[selector].call(this);
  };

  BaseParser.prototype.selectParenthesesParseMethod = function() {
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

  BaseParser.prototype.parseBlockExpression = function() {
    this.expect("(");

    var expr = this.withScope(function() {
      var body;
      body = this.parseFunctionBody(")");
      return Node.createBlockExpression(body);
    });

    this.expect(")");

    return expr;
  };

  BaseParser.prototype.parseExpressionsWithParentheses = function() {
    return this.parseWithParentheses("parseExpressions");
  };

  BaseParser.prototype.parsePartialExpressionWithParentheses = function() {
    return this.parseWithParentheses("parsePartialExpression");
  };

  BaseParser.prototype.parseWithParentheses = function(methodName) {
    this.expect("(");

    var marker = this.createMarker();
    var expr = this[methodName].call(this);
    expr = marker.update().apply(expr);

    this.expect(")");

    return expr;
  };

  /*
    ImmutableListExpression :
      # ListExpression
  */
  BaseParser.prototype.parseImmutableListExpression = function(lookahead) {
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
  BaseParser.prototype.parseBraces = function(opts) {
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

  BaseParser.prototype.parseLabel = function() {
    var marker = this.createMarker();

    var label = Node.createLiteral({
      value: this.lex().value,
      type: Token.SymbolLiteral
    });

    return marker.update().apply(label);
  };

  BaseParser.prototype.parsePrimaryIdentifier = function() {
    var expr = this.parseIdentifier();
    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }
    return expr;
  };

  BaseParser.prototype.parseIdentifier = function() {
    var marker = this.createMarker();

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var expr = Node.createIdentifier(this.lex().value);

    return marker.update().apply(expr);
  };

  BaseParser.prototype.parseVariableIdentifier = function() {
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

  sc.lang.compiler.BaseParser = BaseParser;
})(sc);

(function(sc) {
  "use strict";

  require("./parser");
  require("./event-expr");
  require("./series-expr");
  require("./expression");
  require("./partial-expr");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  // ( ... )
  Parser.addParseMethod("Parentheses", function() {
    return new ParenthesesParser(this).parse();
  });

  function ParenthesesParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(ParenthesesParser, Parser);

  ParenthesesParser.prototype.parse = function() {
    var token = this.expect("(");

    if (this.match(":")) {
      this.lex();
    }

    var selector = this.selectParenthesesParseMethod();

    return this.unlex(token)[selector].call(this);
  };

  ParenthesesParser.prototype.selectParenthesesParseMethod = function() {
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

  ParenthesesParser.prototype.parseBlockExpression = function() {
    this.expect("(");

    var expr = this.withScope(function() {
      var body;
      body = this.parseFunctionBody(")");
      return Node.createBlockExpression(body);
    });

    this.expect(")");

    return expr;
  };

  ParenthesesParser.prototype.parseExpressionsWithParentheses = function() {
    return this.parseWithParentheses("parseExpressions");
  };

  ParenthesesParser.prototype.parsePartialExpressionWithParentheses = function() {
    return this.parseWithParentheses("parsePartialExpression");
  };

  ParenthesesParser.prototype.parseWithParentheses = function(methodName) {
    this.expect("(");

    var marker = this.createMarker();
    var expr = this[methodName].call(this);
    expr = marker.update().apply(expr);

    this.expect(")");

    return expr;
  };
})(sc);

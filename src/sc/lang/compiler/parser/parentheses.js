(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    (...)
      EventExpression
      BlockExpression
      SeriesExpression
      BlockExpression
      ( Expressions )
      ( Expression  )
  */
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

    var delegate = this.selectParenthesesParseMethod();

    this.unlex(token);

    return delegate.call(this);
  };

  ParenthesesParser.prototype.selectParenthesesParseMethod = function() {
    if (this.lookahead.type === Token.Label || this.match(")")) {
      return function() {
        return this.parseEventExpression();
      };
    }
    if (this.match("var")) {
      return function() {
        return this.parseBlockExpression();
      };
    }
    if (this.match("..")) {
      return function() {
        return this.parseSeriesExpression();
      };
    }

    this.parseExpression();
    if (this.matchAny([ ",", ".." ])) {
      return function() {
        return this.parseSeriesExpression();
      };
    }
    if (this.match(":")) {
      return function() {
        return this.parseEventExpression();
      };
    }
    if (this.match(";")) {
      this.lex();
      this.parseExpressions();
      if (this.matchAny([ ",", ".." ])) {
        return function() {
          return this.parseSeriesExpression();
        };
      }
      return function() {
        return this.parseExpressionsWithParentheses();
      };
    }

    return function() {
      return this.parsePartialExpressionWithParentheses();
    };
  };

  ParenthesesParser.prototype.parseBlockExpression = function() {
    var marker = this.createMarker();

    this.expect("(");

    var expr = this.withScope(function() {
      return Node.createBlockExpression(
        this.parseFunctionBody()
      );
    });

    this.expect(")");

    return marker.update().apply(expr);
  };

  ParenthesesParser.prototype.parseExpressionsWithParentheses = function() {
    return this.parseWithParentheses(function() {
      return this.parseExpressions();
    });
  };

  ParenthesesParser.prototype.parsePartialExpressionWithParentheses = function() {
    return this.parseWithParentheses(function() {
      return this.parsePartialExpression();
    });
  };

  ParenthesesParser.prototype.parseWithParentheses = function(delegate) {
    this.expect("(");

    var marker = this.createMarker();
    var expr = delegate.call(this);
    expr = marker.update().apply(expr);

    this.expect(")");

    return expr;
  };
})(sc);

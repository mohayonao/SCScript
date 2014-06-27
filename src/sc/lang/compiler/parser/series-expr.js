(function(sc) {
  "use strict";

  require("./base-parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addMethod("parseSeriesExpression", function() {
    return new SeriesExpressionParser(this).parse();
  });

  function SeriesExpressionParser(parent) {
    BaseParser.call(this, parent);
    this.parent = parent;
  }
  sc.libs.extend(SeriesExpressionParser, BaseParser);

  SeriesExpressionParser.prototype.parse = function() {
    var generator = false;
    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    var method = Node.createIdentifier(generator ? "seriesIter" : "series");
    method = this.createMarker().apply(method);

    var first, items;
    if (this.match("..")) {
      // (..), (..last)
      first = Node.createLiteral({ type: Token.IntegerLiteral, value: "0" });
      first = this.createMarker().apply(first);
    } else {
      first = this.parseExpressions();
    }
    items = this.parseSeriesExpression(first, generator);

    this.state.innerElements = innerElements;

    this.expect(")");

    return Node.createCallExpression(items.shift(), method, { list: items });
  };

  SeriesExpressionParser.prototype.parseSeriesExpression = function(first, generator) {
    var second = null, last = null;

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
})(sc);

(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("SeriesExpression", function() {
    return new SeriesExpressionParser(this).parse();
  });

  function SeriesExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(SeriesExpressionParser, Parser);

  SeriesExpressionParser.prototype.parse = function() {
    var generator = false;

    var marker = this.createMarker();

    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    var method = this.createMarker().apply(
      Node.createIdentifier(generator ? "seriesIter" : "series")
    );

    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var items = [
      this.parseFirstElement(),
      this.parseSecondElement(),
      this.parseLastElement()
    ];

    this.state.innerElements = innerElements;

    if (!generator && items[2] === null) {
      this.throwUnexpected(this.lookahead);
    }
    this.expect(")");

    return marker.update().apply(
      Node.createCallExpression(items.shift(), method, { list: items }, "(")
    );
  };

  SeriesExpressionParser.prototype.parseFirstElement = function() {
    if (this.match("..")) {
      return this.createMarker().apply(
        Node.createLiteral({ type: Token.IntegerLiteral, value: "0" })
      );
    }
    return this.parseExpressions();
  };

  SeriesExpressionParser.prototype.parseSecondElement = function() {
    if (this.match(",")) {
      this.lex();
      return this.parseExpressions();
    }
    return null;
  };

  SeriesExpressionParser.prototype.parseLastElement = function() {
    this.expect("..");
    if (!this.match(")")) {
      return this.parseExpressions();
    }
    return null;
  };
})(sc);

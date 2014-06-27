(function(sc) {
  "use strict";

  require("./parser");

  /*
  */
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("EventExpression", function() {
    return new EventExpressionParser(this).parse();
  });

  function EventExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(EventExpressionParser, Parser);

  EventExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    this.expect("(");

    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var elements = [];
    while (this.hasNextToken() && !this.match(")")) {
      elements.push(
        this._getKeyElement(), this._getValElement()
      );
      if (this.match(",")) {
        this.lex();
      }
    }
    this.state.innerElements = innerElements;

    this.expect(")");

    return marker.update().apply(
      Node.createEventExpression(elements)
    );
  };

  EventExpressionParser.prototype._getKeyElement = function() {
    if (this.lookahead.type === Token.Label) {
      return this.parseLabelAsSymbol();
    }

    var node = this.parseExpression();
    this.expect(":");

    return node;
  };

  EventExpressionParser.prototype._getValElement = function() {
    return this.parseExpression();
  };
})(sc);

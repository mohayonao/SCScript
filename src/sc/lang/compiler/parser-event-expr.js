(function(sc) {
  "use strict";

  require("./compiler");
  require("./node");
  require("./parser-base");

  /*
  */
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  function EventExpressionParser(parent) {
    BaseParser.call(this, parent.lexer, parent.state);
    this.parent = parent;
  }
  sc.libs.extend(EventExpressionParser, BaseParser);

  EventExpressionParser.prototype.parse = function() {
    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    this.expect("(");

    var node, elements = [];
    while (this.hasNextToken() && !this.match(")")) {
      if (this.lookahead.type === Token.Label) {
        node = this.parent.parseLabel();
      } else {
        node = this.parseExpression();
        this.expect(":");
      }
      elements.push(node, this.parseExpression());
      if (!this.match(")")) {
        this.expect(",");
      }
    }

    this.expect(")");

    this.state.innerElements = innerElements;

    return Node.createEventExpression(elements);
  };

  sc.lang.compiler.EventExpressionParser = EventExpressionParser;
})(sc);

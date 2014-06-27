(function(sc) {
  "use strict";

  require("./parser");
  require("./expression");
  require("./label");

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
    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    this.expect("(");

    var node, elements = [];
    while (this.hasNextToken() && !this.match(")")) {
      if (this.lookahead.type === Token.Label) {
        node = this.parseLabel();
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
})(sc);

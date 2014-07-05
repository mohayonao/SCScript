(function(sc) {
  "use strict";

  require("./parser");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("BlockExpression", function() {
    var marker = this.createMarker();

    this.expect("(");

    var expr = this.withScope(function() {
      return Node.createBlockExpression(
        this.parseFunctionBody()
      );
    });

    this.expect(")");

    return marker.update().apply(expr);
  });
})(sc);

(function(sc) {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Program", function() {
    var marker = this.createMarker();

    var node = this.withScope(function() {
      return Node.createProgram(
        this.parseFunctionBody()
      );
    });

    if (hasSingleBlockExpression(node)) {
      node.body = node.body[0].body;
    }

    return marker.update().apply(node);
  });

  function hasSingleBlockExpression(node) {
    return node.body.length === 1 && node.body[0].type === Syntax.BlockExpression;
  }
})(sc);

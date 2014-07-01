(function(sc) {
  "use strict";

  require("./parser");

  var Keywords = sc.lang.compiler.Keywords;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("ThisExpression", function() {
    var marker = this.createMarker();

    var node = this.lex();
    if (Keywords[node.value] !== "function") {
      this.throwUnexpected(node);
    }

    return marker.update().apply(
      Node.createThisExpression(node.value)
    );
  });
})(sc);

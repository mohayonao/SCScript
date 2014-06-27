(function(sc) {
  "use strict";

  require("./parser");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Literal", function() {
    var marker = this.createMarker();

    var expr = Node.createLiteral(this.lex());

    return marker.update().apply(expr);
  });
})(sc);

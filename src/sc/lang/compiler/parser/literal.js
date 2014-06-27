(function(sc) {
  "use strict";

  require("./base-parser");

  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addParseMethod("Literal", function() {
    var marker = this.createMarker();

    var expr = Node.createLiteral(this.lex());

    return marker.update().apply(expr);
  });
})(sc);

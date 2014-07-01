(function(sc) {
  "use strict";

  require("./parser");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Program", function() {
    var marker = this.createMarker();

    var node = this.withScope(function() {
      return Node.createProgram(
        this.parseFunctionBody()
      );
    });

    return marker.update().apply(node);
  });
})(sc);

(function(sc) {
  "use strict";

  require("./base-parser");

  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addParseMethod("Program", function() {
    var marker = this.createMarker();

    var node = this.withScope(function() {
      var body = this.parseFunctionBody(null);
      return Node.createProgram(body);
    });

    return marker.update().apply(node);
  });
})(sc);

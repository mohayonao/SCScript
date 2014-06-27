(function(sc) {
  "use strict";

  require("./parser");
  require("./function-expr");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Program", function() {
    var marker = this.createMarker();

    var node = this.withScope(function() {
      var body = this.parseFunctionBody(null);
      return Node.createProgram(body);
    });

    return marker.update().apply(node);
  });
})(sc);

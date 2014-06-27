(function(sc) {
  "use strict";

  require("./parser");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    EnvironmentExpresion :
      ~ Identifier
  */
  Parser.addParseMethod("EnvironmentExpression", function() {
    var marker = this.createMarker();

    this.expect("~");
    var expr = this.parseIdentifier({ variable: true });

    return marker.update().apply(
      Node.createEnvironmentExpresion(expr)
    );
  });
})(sc);

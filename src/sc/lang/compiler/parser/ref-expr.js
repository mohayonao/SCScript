(function(sc) {
  "use strict";

  require("./parser");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    RefExpression
      ` LeftHandSideExpression
  */
  Parser.addParseMethod("RefExpression", function() {
    var marker = this.createMarker();

    this.expect("`");

    var expr = this.parseLeftHandSideExpression();

    return marker.update().apply(
      Node.createUnaryExpression("`", expr)
    );
  });
})(sc);

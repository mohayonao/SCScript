(function(sc) {
  "use strict";

  require("./base-parser");
  require("./left-hand-side-expr");

  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  /*
    RefExpression
      ` LeftHandSideExpression
  */
  BaseParser.addParseMethod("RefExpression", function() {
    var marker = this.createMarker();

    this.expect("`");

    var expr = this.parseLeftHandSideExpression();
    expr = Node.createUnaryExpression("`", expr);

    return marker.update().apply(expr);
  });
})(sc);

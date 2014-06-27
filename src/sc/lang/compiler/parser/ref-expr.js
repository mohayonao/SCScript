(function(sc) {
  "use strict";

  require("./parser");
  require("./left-hand-side-expr");

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
    expr = Node.createUnaryExpression("`", expr);

    return marker.update().apply(expr);
  });
})(sc);

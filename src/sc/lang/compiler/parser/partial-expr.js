(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;
  var Node = sc.lang.compiler.Node;

  /*
    PartialExpression :
      BinaryExpression
  */
  Parser.addParseMethod("PartialExpression", function() {
    if (this.state.innerElements) {
      return this.parseBinaryExpression();
    }

    this.state.underscore = [];

    var marker = this.createMarker();

    var node = this.parseBinaryExpression();

    if (this.state.underscore.length) {
      var args = new Array(this.state.underscore.length);
      for (var i = 0, imax = args.length; i < imax; ++i) {
        var x = this.state.underscore[i];
        var y = Node.createVariableDeclarator(x);
        args[i] = this.createMarker(x).update(x).apply(y);
      }
      node = Node.createFunctionExpression({ list: args }, [ node ], { partial: true });
    }

    this.state.underscore = [];

    return marker.update().apply(node);
  });
})(sc);

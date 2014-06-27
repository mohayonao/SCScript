(function(sc) {
  "use strict";

  require("./base-parser");

  var Keywords = sc.lang.compiler.Keywords;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addParseMethod("ThisExpression", function() {
    var node = this.lex();

    if (Keywords[node.value] !== "function") {
      this.throwUnexpected(node);
    }

    return Node.createThisExpression(node.value);
  });
})(sc);

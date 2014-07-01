(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("LabelAsSymbol", function() {
    var marker = this.createMarker();

    var node = this.lex();

    if (node.type !== Token.Label) {
      this.throwUnexpected(node);
    }

    var label = Node.createLiteral({
      value: node.value,
      type: Token.SymbolLiteral
    });

    return marker.update().apply(label);
  });
})(sc);

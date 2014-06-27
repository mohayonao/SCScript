(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Label", function() {
    var marker = this.createMarker();

    var label = Node.createLiteral({
      value: this.lex().value,
      type: Token.SymbolLiteral
    });

    return marker.update().apply(label);
  });
})(sc);

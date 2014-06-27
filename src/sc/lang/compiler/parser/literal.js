(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Literal", function() {
    var marker = this.createMarker();

    var node = this.lex();

    if (!isLiteral(node.type)) {
      this.throwUnexpected(node);
    }

    return marker.update().apply(
      Node.createLiteral(node)
    );
  });
  function isLiteral(type) {
    switch (type) {
    case Token.IntegerLiteral:
    case Token.FloatLiteral:
    case Token.NilLiteral:
    case Token.TrueLiteral:
    case Token.FalseLiteral:
    case Token.SymbolLiteral:
    case Token.StringLiteral:
    case Token.CharLiteral:
      return true;
    }
    return false;
  }
})(sc);

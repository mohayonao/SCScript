(function(sc) {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    SignedExpression :
      PrimaryExpression
      - PrimaryExpression
  */
  Parser.addParseMethod("SignedExpression", function() {
    // TODO: fix like this
    // if (!this.match("-")) {
    //   return this.parsePrimaryExpression();
    // }

    var marker = this.createMarker();
    var expr;
    if (this.match("-")) {
      this.lex();
      expr = this.parsePrimaryExpression();
      if (isNumber(expr)) {
        expr.value = "-" + expr.value;
      } else {
        expr = Node.createCallExpression(expr, Node.createIdentifier("neg"));
      }
    } else {
      expr = this.parsePrimaryExpression();
    }

    return marker.update().apply(expr, true);
  });

  function isNumber(node) {
    if (node.type !== Syntax.Literal) {
      return false;
    }
    var valueType = node.valueType;
    return valueType === Token.IntegerLiteral || valueType === Token.FloatLiteral;
  }
})(sc);

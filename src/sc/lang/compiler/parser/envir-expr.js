(function(sc) {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    EnvironmentExpresion :
      ~ LeftHandSideExpression
  */
  Parser.addParseMethod("EnvironmentExpression", function() {
    var marker = this.createMarker();

    this.expect("~");
    var expr = this.parseIdentifier();
    if (isClassName(expr)) {
      this.throwUnexpected({ type: Token.Identifier, value: expr.id });
    }
    expr = Node.createEnvironmentExpresion(expr);
    expr = marker.update().apply(expr);

    if (this.match(".")) {
      expr = this.parseLeftHandSideExpression(expr);
    }

    return expr;
  });

  function isClassName(node) {
    if (node.type !== Syntax.Identifier) {
      return false;
    }

    var name = node.value || node.name;
    var ch = name.charAt(0);

    return "A" <= ch && ch <= "Z";
  }
})(sc);

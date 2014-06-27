(function(sc) {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Identifier", function() {
    var marker = this.createMarker();

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var expr = Node.createIdentifier(this.lex().value);

    return marker.update().apply(expr);
  });

  Parser.addParseMethod("PrimaryIdentifier", function() {
    var expr = this.parseIdentifier();
    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }
    return expr;
  });

  Parser.addParseMethod("VariableIdentifier", function() {
    var marker = this.createMarker();

    var token = this.lex();
    var value = token.value;

    if (token.type !== Token.Identifier) {
      this.throwUnexpected(token);
    } else {
      var ch = value.charAt(0);
      if (("A" <= ch && ch <= "Z") || ch === "_") {
        this.throwUnexpected(token);
      }
    }

    var id = Node.createIdentifier(value);

    return marker.update().apply(id);
  });
})(sc);

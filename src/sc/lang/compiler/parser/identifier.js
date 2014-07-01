(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Identifier", function(opts) {
    opts = opts || {};
    var marker = this.createMarker();

    var node = this.lex();

    var err;
    err = err || (node.type !== Token.Identifier);
    err = err || (node.value === "_" && !opts.allowUnderscore);
    err = err || (opts.variable && !isVariable(node.value));
    if (err) {
      this.throwUnexpected(node);
    }

    return marker.update().apply(
      Node.createIdentifier(node.value)
    );
  });

  Parser.addParseMethod("PrimaryIdentifier", function() {
    var expr = this.parseIdentifier({ allowUnderscore: true });
    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }
    return expr;
  });

  function isVariable(value) {
    var ch = value.charCodeAt(0);
    return 97 <= ch && ch <= 122; // startsWith(/[a-z]/)
  }
})(sc);

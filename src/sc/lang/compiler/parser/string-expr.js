(function(sc) {
  "use strict";

  require("./parser");
  require("./interpolate-string");
  require("../lexer");

  var Node = sc.lang.compiler.Node;
  var Lexer = sc.lang.compiler.Lexer;
  var InterpolateString = sc.lang.compiler.InterpolateString;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("StringExpression", function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(null, new Lexer(code, {})).parseExpression();
    }

    return Node.createLiteral(token);
  });
})(sc);

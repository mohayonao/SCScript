(function(sc) {
  "use strict";

  require("./parser");
  require("./interpolate-string");
  require("../lexer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Lexer = sc.lang.compiler.Lexer;
  var InterpolateString = sc.lang.compiler.InterpolateString;
  var Parser = sc.lang.compiler.Parser;

  /*
    StringExpression :
      StringLiteral
      StringLiterals StringLiteral
  */
  Parser.addParseMethod("StringExpression", function() {
    return new StringExpressionParser(this).parse();
  });

  function StringExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(StringExpressionParser, Parser);

  StringExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    if (this.lookahead.type !== Token.StringLiteral) {
      this.throwUnexpected(this.lookahead);
    }

    var expr = this.parseStringLiteral();

    while (this.lookahead.type === Token.StringLiteral) {
      var next = this.parseStringLiteral();
      if (expr.type === Syntax.Literal && next.type === Syntax.Literal) {
        expr.value += next.value;
      } else {
        expr = Node.createBinaryExpression({ value: "++" }, expr, next);
      }
    }

    return marker.update().apply(expr, true);
  };

  StringExpressionParser.prototype.parseStringLiteral = function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(null, new Lexer(code, {})).parseExpression();
    }

    return Node.createLiteral(token);
  };
})(sc);

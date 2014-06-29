(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("GeneratorExpression", function() {
    return new GeneratorExpressionParser(this).parse();
  });

  function GeneratorExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(GeneratorExpressionParser, Parser);

  /* istanbul ignore next */
  GeneratorExpressionParser.prototype.parse = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");
    return Node.createLiteral({ value: "nil", valueType: Token.NilLiteral });
  };
})(sc);

(function(sc) {
  "use strict";

  require("./compiler");
  require("./node");
  require("./parser-base");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  function GeneratorExpressionParser(parent) {
    BaseParser.call(this, parent.lexer, parent.state);
    this.parent = parent;
  }
  sc.libs.extend(GeneratorExpressionParser, BaseParser);

  GeneratorExpressionParser.prototype.parse = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");

    this.expect("{");
    this.expect(":");

    this.parseExpression();
    this.expect(",");

    while (this.hasNextToken() && !this.match("}")) {
      this.parseExpression();
      if (!this.match("}")) {
        this.expect(",");
      }
    }

    this.expect("}");

    return Node.createLiteral({ value: "nil", valueType: Token.NilLiteral });
  };

  sc.lang.compiler.GeneratorExpressionParser = GeneratorExpressionParser;
})(sc);

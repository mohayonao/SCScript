(function() {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.parser", function() {
    it("parse", function() {
      var ast = sc.lang.compiler.parser.parse("[ 0, 1, 2 ]");
      expect(ast).to.eql({
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ListExpression,
            elements: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
              }
            ]
          }
        ]
      });
    });
  });
})();

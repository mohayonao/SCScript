(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("Value", function() {
      sc.test.codegen().each([
        {
          code: "10",
          expected: "this.push(), $.Integer(10)",
          ast: {
            type: Syntax.ValueMethodEvaluator,
            expr: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral
            }
          }
        },
        {
          code: "10",
          expected: "this.shift()",
          ast: {
            type: Syntax.ValueMethodResult
          }
        }
      ]);
    });
  });
})();

(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("EnvironmentExpression", function() {
      sc.test.codegen().each([
        {
          code: "~a",
          expected: "$.Environment('a')",
          ast: {
            type: Syntax.EnvironmentExpression,
            id: {
              type: Syntax.Identifier,
              name: "a",
            },
          }
        },
        {
          code: "~a = 10",
          expected: "$.Environment('a', $.Integer(10))",
          ast: {
            type: Syntax.AssignmentExpression,
            left: {
              type: Syntax.EnvironmentExpression,
              id: {
                type: Syntax.Identifier,
                name: "a",
              }
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral
            }
          }
        },
      ]);
    });
  });
})();

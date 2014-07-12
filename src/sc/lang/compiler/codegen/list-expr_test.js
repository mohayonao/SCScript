describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("ListExpression", function() {
    sc.test.codegen().each([
      {
        code: "[ 1, 2, 3 ]",
        expected: "$.Array([ $.Integer(1), $.Integer(2), $.Integer(3), ])",
        ast: {
          type: Syntax.ListExpression,
          elements: [
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral
            },
            {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral
            },
            {
              type: Syntax.Literal,
              value: "3",
              valueType: Token.IntegerLiteral
            }
          ]
        }
      },
      {
        code: "#[ 1, 2, 3 ]",
        expected: "$.Array([ $.Integer(1), $.Integer(2), $.Integer(3), ], true)",
        ast: {
          type: Syntax.ListExpression,
          immutable: true,
          elements: [
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral
            },
            {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral
            },
            {
              type: Syntax.Literal,
              value: "3",
              valueType: Token.IntegerLiteral
            }
          ]
        }
      }
    ]);
  });
});

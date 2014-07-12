describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("VariableStatement", function() {
    sc.test.codegen().each([
      {
        code: "a",
        expected: "$a = $.Nil()",
        ast: {
          type: Syntax.VariableDeclaration,
          kind: "var",
          declarations: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "a"
              }
            }
          ]
        }
      },
      {
        code: "a = 0",
        expected: "$a = $.Integer(0)",
        ast: {
          type: Syntax.VariableDeclaration,
          kind: "var",
          declarations: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "a"
              },
              init: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral
              }
            }
          ]
        }
      }
    ]);
  });
});

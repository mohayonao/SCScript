describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("BlockExpression", function() {
    sc.test.codegen().each([
      {
        code: "(var a = 10; a)",
        expected: "(function() { var $a; $a = $.Integer(10); return $a; })()",
        ast: {
          type: Syntax.BlockExpression,
          body: [
            {
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
                    value: "10",
                    valueType: Token.IntegerLiteral
                  }
                }
              ]
            },
            {
              type: Syntax.Identifier,
              name: "a"
            }
          ]
        }
      },
    ]);
  });
});

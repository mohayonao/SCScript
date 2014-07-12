describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("CallExpression", function() {
    sc.test.codegen().each([
      {
        code: "a0.a = 0",
        expected: "(_ref0 = $.Integer(0), $a0.$('a_', [ _ref0 ]), _ref0)",
        ast: {
          type: Syntax.CallExpression,
          stamp: "=",
          callee: {
            type: Syntax.Identifier,
            name: "a0"
          },
          method: {
            type: Syntax.Identifier,
            name: "a_"
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral
              }
            ]
          }
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
        }
      },
      {
        code: "a0.value",
        expected: "$a0.$('value')",
        ast: {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "a0"
          },
          method: {
            type: Syntax.Identifier,
            name: "value"
          },
          args: {
            list: []
          }
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
        }
      },
      {
        code: "a0.value(a1)",
        expected: "$a0.$('value', [ $a1 ])",
        ast: {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "a0"
          },
          method: {
            type: Syntax.Identifier,
            name: "value"
          },
          args: {
            list: [
              {
                type: Syntax.Identifier,
                name: "a1"
              }
            ]
          }
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
          codegen.scope.add("var", "a1");
        }
      },
      {
        code: "a0.value(*a1)",
        expected: "(_ref0 = $a0, _ref0.$('value', [].concat($a1.$('asArray')._)))",
        ast: {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "a0"
          },
          method: {
            type: Syntax.Identifier,
            name: "value"
          },
          args: {
            list: [],
            expand: {
              type: Syntax.Identifier,
              name: "a1"
            }
          }
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
          codegen.scope.add("var", "a1");
        }
      },
      {
        code: "a0.value(a:a1, b:a2)",
        expected: "$a0.$('value', [ { a: $a1, b: $a2 } ])",
        ast: {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "a0"
          },
          method: {
            type: Syntax.Identifier,
            name: "value"
          },
          args: {
            list: [],
            keywords: {
              a: {
                type: Syntax.Identifier,
                name: "a1"
              },
              b: {
                type: Syntax.Identifier,
                name: "a2"
              },
            }
          }
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
          codegen.scope.add("var", "a1");
          codegen.scope.add("var", "a2");
        }
      },
      {
        code: "a0.value(0, *a1, a:a2, b:a3)",
        expected: "(_ref0 = $a0, " +
                  "_ref0.$('value', [ " +
                  "  $.Integer(0), " +
                  "].concat($a1.$('asArray')._, { a: $a2, b: $a3 })))",
        ast: {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "a0"
          },
          method: {
            type: Syntax.Identifier,
            name: "value"
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral
              }
            ],
            expand: {
              type: Syntax.Identifier,
              name: "a1"
            },
            keywords: {
              a: {
                type: Syntax.Identifier,
                name: "a2"
              },
              b: {
                type: Syntax.Identifier,
                name: "a3"
              },
            }
          }
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
          codegen.scope.add("var", "a1");
          codegen.scope.add("var", "a2");
          codegen.scope.add("var", "a3");
        }
      },
    ]);
  });
});

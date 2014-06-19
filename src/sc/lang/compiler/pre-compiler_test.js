(function() {
  "use strict";

  require("./pre-compiler");

  var Syntax     = sc.lang.compiler.Syntax;
  var precompile = sc.lang.compiler.precompile;

  describe("sc.lang.compiler.precompile", function() {
    it("segmented check", function() {
      var ast, actual, expected;

      ast = {
        type: Syntax.FunctionExpression,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a"
            },
            method: {
              type: Syntax.Identifier,
              name: "wait"
            },
            args: {
              list: []
            }
          },
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a"
            },
            method: {
              type: Syntax.Identifier,
              name: "neg"
            },
            args: {
              list: []
            }
          },
        ]
      };

      expected = {
        type: Syntax.FunctionExpression,
        segmented: true,
        body: [
          {
            type: Syntax.CallExpression,
            segmented: true,
            callee: {
              type: Syntax.Identifier,
              name: "a"
            },
            method: {
              type: Syntax.Identifier,
              name: "wait"
            },
            args: {
              list: []
            }
          },
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a"
            },
            method: {
              type: Syntax.Identifier,
              name: "neg"
            },
            args: {
              list: []
            }
          },
        ]
      };

      actual = precompile(ast);
      expect(actual).to.eql(expected);
    });

    it("split value and value result for sync", function() {
      var ast, actual, expected;

      ast = {
        type: Syntax.FunctionExpression,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a"
            },
            method: {
              type: Syntax.Identifier,
              name: "value"
            },
            args: {
              list: [
                {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Identifier,
                    name: "b"
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "value"
                  },
                },
                {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Identifier,
                    name: "c"
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "value"
                  },
                },
              ]
            }
          }
        ]
      };

      expected = {
        type: Syntax.FunctionExpression,
        segmented: true,
        body: [
          {
            type: Syntax.ValueMethodEvaluator,
            segmented: true,
            id: 0,
            expr: {
              type: Syntax.CallExpression,
              segmented: true,
              callee: {
                type: Syntax.Identifier,
                name: "b"
              },
              method: {
                type: Syntax.Identifier,
                name: "value"
              },
            },
          },
          {
            type: Syntax.ValueMethodEvaluator,
            segmented: true,
            id: 1,
            expr: {
              type: Syntax.CallExpression,
              segmented: true,
              callee: {
                type: Syntax.Identifier,
                name: "c"
              },
              method: {
                type: Syntax.Identifier,
                name: "value"
              },
            },
          },
          {
            type: Syntax.ValueMethodEvaluator,
            segmented: true,
            id: 2,
            expr: {
              type: Syntax.CallExpression,
              segmented: true,
              callee: {
                type: Syntax.Identifier,
                name: "a"
              },
              method: {
                type: Syntax.Identifier,
                name: "value"
              },
              args: {
                list: [
                  {
                    type: Syntax.ValueMethodResult,
                    id: 0
                  },
                  {
                    type: Syntax.ValueMethodResult,
                    id: 1
                  },
                ]
              }
            }
          },
          {
            type: Syntax.ValueMethodResult,
            id: 2
          }
        ]
      };

      actual = precompile(ast);
      expect(actual).to.eql(expected);
    });
  });
})();

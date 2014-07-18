describe("sc.lang.compiler.rewriter", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Rewriter = sc.lang.compiler.Rewriter;

  it("segmented check", function() {
    var ast = {
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

    var expected = {
      type: Syntax.FunctionExpression,
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

    var actual = new Rewriter().rewrite(ast);

    expect(actual).to.deep.equal(expected);
  });

  it("segmented", function() {
    var ast = {
      type: Syntax.Program,
      body: [
        {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "true",
                valueType: Token.TrueLiteral,
              },
              method: {
                type: Syntax.Identifier,
                name: "if",
              },
              args: {
                list: [
                  {
                    type: Syntax.FunctionExpression,
                    body: [
                      {
                        type: Syntax.CallExpression,
                        stamp: ".",
                        callee: {
                          type: Syntax.Literal,
                          value: "1",
                          valueType: Token.IntegerLiteral,
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "wait",
                        },
                        args: {
                          list: []
                        },
                      }
                    ],
                    blockList: true,
                  }
                ]
              },
            },
            {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            }
          ],
        }
      ],
    };

    var expected = {
      type: Syntax.Program,
      body: [
        {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              segmented: true,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "true",
                valueType: Token.TrueLiteral,
              },
              method: {
                type: Syntax.Identifier,
                name: "if",
              },
              args: {
                list: [
                  {
                    type: Syntax.FunctionExpression,
                    body: [
                      {
                        type: Syntax.CallExpression,
                        segmented: true,
                        stamp: ".",
                        callee: {
                          type: Syntax.Literal,
                          value: "1",
                          valueType: Token.IntegerLiteral,
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "wait",
                        },
                        args: {
                          list: []
                        },
                      }
                    ],
                    blockList: true,
                  }
                ]
              },
            },
            {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            }
          ],
        }
      ],
    };

    var actual = new Rewriter().rewrite(ast);

    expect(actual).to.deep.equal(expected);
  });

  it("split value and value result for sync", function() {
    var ast = {
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

    var expected = {
      type: Syntax.FunctionExpression,
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

    var actual = new Rewriter().rewrite(ast);

    expect(actual).to.deep.equal(expected);
  });

});

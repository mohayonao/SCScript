(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseLeftHandSideExpression", function() {
      sc.test.compile(this.title).each({
        "a()": strlib.format(Message.UnexpectedToken, "("),
        "Object()": sc.test.OK,  // Object.new()
        "a(0)": sc.test.OK,      // 0.a
        "a(0)()": strlib.format(Message.UnexpectedToken, "("),
        "a(0){}": sc.test.OK,    // 0.a({})
        "a(0)[0]": sc.test.OK,   // (0.a)[0]
        "a(0).a": sc.test.OK,    // (0.a).a
        "0(0)": strlib.format(Message.UnexpectedToken, "("),
        "a{}": sc.test.OK,       // {}.a
        "Object{}": sc.test.OK,  // Object.new({})
        "a{}()": strlib.format(Message.UnexpectedToken, "("),
        "a{}{}": sc.test.OK,     // {}.a({})
        "a{}[0]": sc.test.OK,    // ({}.a)[0]
        "a{}.a": sc.test.OK,     // ({}.a).a
        "a#{}": sc.test.OK,      // #{}.a
        "Object#{}": sc.test.OK, // Object.new(#{})
        "a#{}()": strlib.format(Message.UnexpectedToken, "("),
        "a#{}#{}": sc.test.OK,   // #{}.a(#{})
        "a#{}[0]": sc.test.OK,   // (#{}.a)[0]
        "a#{}.a": sc.test.OK,    // (#{}.a).a
        "a#[]": strlib.format(Message.UnexpectedToken, "#"),
        "a[]": strlib.format(Message.UnexpectedToken, "]"),
        "Object[]": sc.test.OK,  // Object[]
        "a[0]": sc.test.OK,      // a[0]
        "a[..]": sc.test.OK,     // a[..]
        "a[0]()": strlib.format(Message.UnexpectedToken, "("),
        "a[0]{}": strlib.format(Message.UnexpectedToken, "{"),
        "a[0][0]": sc.test.OK,   // (a[0])[0]
        "a[0].a": sc.test.OK,    // (a[0]).a
        "a.a": sc.test.OK,       // a.a()
        "a.Object": Message.UnexpectedIdentifier,
        "a._": Message.UnexpectedIdentifier,
        "a.a()": sc.test.OK,     // a.a()
        "a.a{}": sc.test.OK,     // a.a({})
        "a.a[0]": sc.test.OK,    // (a.a)[0]
        "a.a.a": sc.test.OK,     // (a.a).a
        "a.()": sc.test.OK,      // a.value()
        "a.[0]": sc.test.OK,     // (a.value)[0]
        // arguments
        "a(*b)": sc.test.OK,     // b.a()
        "a(b:1)": strlib.format(Message.UnexpectedToken, "("),
        "a.a(0)": sc.test.OK,
        "a.a(0,1)": sc.test.OK,
        "a.a(*a)": sc.test.OK,
        "a.a(a:0,a:0)": sc.test.OK,
        "a.a(0,*a,a:0)": sc.test.OK,
        "a.a(*a,0)": Message.UnexpectedNumber,
        "a.a(a:0,*a)": strlib.format(Message.UnexpectedToken, "*"),
      });
      sc.test.parse(this.title).each({
        "a ": {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 },
          }
        },
        "a.b": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "b",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        },
        "a.b.c": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 },
              }
            },
            args: {
              list: []
            },
            range: [ 0, 3 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 3 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "c",
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "a.b()": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "b",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "a[0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "[]",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 3 },
                }
              }
            ]
          },
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 },
          }
        },
        "a[0][0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 1 },
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 1, column: 3 },
                  }
                }
              ]
            },
            range: [ 0, 4 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 4 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "[]",
            range: [ 4, 4 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 4 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 },
                }
              }
            ]
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        },
        "neg(1).abs": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 },
              }
            },
            args: {
              list: []
            },
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "abs",
            range: [ 7, 10 ],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 10 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 },
          }
        },
        "0.max(1, 2)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 9, 10 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end: { line: 1, column: 10 },
                }
              }
            ]
          },
          range: [ 0, 11 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 11 },
          }
        },
        "0.max(a:1, b:2)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [],
            keywords: {
              a: {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 9 },
                }
              },
              b: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 13, 14 ],
                loc: {
                  start: { line: 1, column: 13 },
                  end: { line: 1, column: 14 },
                }
              }
            }
          },
          range: [ 0, 15 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 15 },
          }
        },
        "0.max(*b)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [],
            expand: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 },
              }
            }
          },
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 9 },
          }
        },
        "0.max(1, *b)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              }
            ],
            expand: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 10, 11 ],
              loc: {
                start: { line: 1, column: 10 },
                end: { line: 1, column: 11 },
              }
            }
          },
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        },
        "0.max(1, a:2, b:3)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              }
            ],
            keywords: {
              a: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 },
                }
              },
              b: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 16, 17 ],
                loc: {
                  start: { line: 1, column: 16 },
                  end: { line: 1, column: 17 },
                }
              }
            }
          },
          range: [ 0, 18 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 18 },
          }
        },
        "0.max(*b, a:1, b:2)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [],
            expand: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 },
              }
            },
            keywords: {
              a: {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 12, 13 ],
                loc: {
                  start: { line: 1, column: 12 },
                  end: { line: 1, column: 13 },
                }
              },
              b: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 17, 18 ],
                loc: {
                  start: { line: 1, column: 17 },
                  end: { line: 1, column: 18 },
                }
              }
            }
          },
          range: [ 0, 19 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 19 },
          }
        },
        "0.max(1, *a, b:2)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 2, 5 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              }
            ],
            expand: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 10, 11 ],
              loc: {
                start: { line: 1, column: 10 },
                end: { line: 1, column: 11 },
              }
            },
            keywords: {
              b: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 15, 16 ],
                loc: {
                  start: { line: 1, column: 15 },
                  end: { line: 1, column: 16 },
                }
              }
            }
          },
          range: [ 0, 17 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 17 },
          }
        },
        "max(*a)": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 5, 6 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 6 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "max",
            range: [ 0, 3 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        },
        "List(0).size": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Identifier,
              name: "List",
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 4 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
              range: [ 4, 4 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 4 },
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 6 },
                  }
                }
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "size",
            range: [ 8, 12 ],
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 12 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        },
        "r {}": {
          type: Syntax.CallExpression,
          stamp: "{",
          callee: {
            type: Syntax.FunctionExpression,
            blockList: true,
            body: [],
            range: [ 2, 4 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 4 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "r",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 },
          }
        },
        "Routine {}": {
          type: Syntax.CallExpression,
          stamp: "{",
          callee: {
            type: Syntax.Identifier,
            name: "Routine",
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "new",
            range: [ 8, 8 ],
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 8 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                body: [],
                range: [ 8, 10 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 10 },
                }
              }
            ]
          },
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 },
          }
        },
        "case {}#{}#{}": {
          type: Syntax.CallExpression,
          stamp: "{",
          callee: {
            type: Syntax.FunctionExpression,
            blockList: true,
            body: [],
            range: [ 5, 7 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 7 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "case",
            range: [ 0, 4 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 4 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                closed: true,
                body: [],
                range: [ 8, 10 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 10 },
                }
              },
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                closed: true,
                body: [],
                range: [ 11, 13 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 13 },
                }
              },
            ]
          },
          range: [ 0, 13 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 13 },
          }
        },
        "Array[]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.Identifier,
            name: "Array",
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "[]",
            range: [ 5, 5 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 5 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.ListExpression,
                elements: [],
                range: [ 5, 7 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 7 },
                }
              }
            ]
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        },
        "a[..10][5..]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {

            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 1 },
              },
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 6 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 6 },
                  }
                }
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "[..]",
            range: [ 7, 7 ],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 7 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "5",
                valueType: Token.IntegerLiteral,
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 9 },
                }
              },
              null,
              null
            ]
          },
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        },
        "a.()": {
          type: Syntax.CallExpression,
          stamp: ".",
          callee: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "value",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 },
          }
        },
        "a.[0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.CallExpression,
            stamp: ".",
            callee: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 2 },
              }
            },
            args: {
              list: []
            },
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "[]",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 },
                }
              }
            ]
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          },
        }
      });
    });
  });
})();

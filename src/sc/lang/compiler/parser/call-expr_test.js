(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseCallExpression", function() {
      sc.test.compile(this.title).each({
        "a ": sc.test.OK,
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
        "Object()": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "Object",
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "new",
            range: [ 6, 6 ],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 6 },
            }
          },
          args: {
            list: []
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
          }
        },
        "a(0)": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
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
        "a(0){}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                body: [],
                range: [ 4, 6 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 6 },
                }
              }
            ]
          },
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 },
          }
        },
        "a(0)[0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "a",
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
        "a(0).a": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "a",
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
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 5, 6 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 6 },
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
        "a{}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.FunctionExpression,
            blockList: true,
            body: [],
            range: [ 1, 3 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
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
        "Object{}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "Object",
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "new",
            range: [ 6, 6 ],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 6 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                body: [],
                range: [ 6, 8 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 8 },
                }
              }
            ]
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
          }
        },
        "a{}{}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.FunctionExpression,
            blockList: true,
            body: [],
            range: [ 1, 3 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                body: [],
                range: [ 3, 5 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 5 },
                }
              }
            ]
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "a{}[0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.FunctionExpression,
              blockList: true,
              body: [],
              range: [ 1, 3 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
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
            name: "[]",
            range: [ 3, 3 ],
            loc: {
              start: { line: 1, column: 3 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ]
          },
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 },
          }
        },
        "a{}.a": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.FunctionExpression,
              blockList: true,
              body: [],
              range: [ 1, 3 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
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
            name: "a",
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
        "a#{}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.FunctionExpression,
            blockList: true,
            closed: true,
            body: [],
            range: [ 2, 4 ], // TODO: ???
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 4 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
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
        "Object#{}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "Object",
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "new",
            range: [ 7, 7 ],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 7 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                closed: true,
                body: [],
                range: [ 7, 9 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 9 },
                }
              }
            ]
          },
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 9 },
          }
        },
        "a#{}#{}": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.FunctionExpression,
            blockList: true,
            closed: true,
            body: [],
            range: [ 2, 4 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 4 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                closed: true,
                body: [],
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
        "a#{}[0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.FunctionExpression,
              blockList: true,
              closed: true,
              body: [],
              range: [ 2, 4 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 4 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "a",
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
        "a#{}.a": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.FunctionExpression,
              blockList: true,
              closed: true,
              body: [],
              range: [ 2, 4 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 4 },
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "a",
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
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 5, 6 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 6 },
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
        "Object[]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.Identifier,
            name: "Object",
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "[]",
            range: [ 6, 6 ],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 6 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.ListExpression,
                elements: [],
                range: [ 6, 8 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 8 },
                }
              }
            ]
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
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
        "a[..]": {
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
              null
            ]
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
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
        "a[0].a": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 5, 6 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 6 },
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
        "a.a": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
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
        "a.a()": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
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
        "a.a{}": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.FunctionExpression,
                blockList: true,
                body: [],
                range: [ 3, 5 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 5 },
                }
              }
            ]
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "a.a[0]": {
          type: Syntax.CallExpression,
          stamp: "[",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
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
              name: "a",
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
            name: "[]",
            range: [ 3, 3 ],
            loc: {
              start: { line: 1, column: 3 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ]
          },
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 },
          }
        },
        "a.a.a": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.CallExpression,
            stamp: "(",
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
              name: "a",
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
            name: "a",
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
        "a.()": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            stamp: "(",
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
        },
        "a(*b)": {
          type: Syntax.CallExpression,
          stamp: "(",
          callee: {
            type: Syntax.Identifier,
            name: "b",
            range: [ 3, 4 ],
            loc: {
              start: { line: 1, column: 3 },
              end: { line: 1, column: 4 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
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
        "a.a(0)": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ]
          },
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 },
          }
        },
        "a.a(0,1)": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              },
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
            ]
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
          }
        },
        "a.a(*a)": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [],
            expand: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 6 },
              }
            }
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        },
        "a.a(a:0,a:0)": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [],
            keywords: {
              a: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 10, 11 ],
                loc: {
                  start: { line: 1, column: 10 },
                  end: { line: 1, column: 11 },
                }
              }
            }
          },
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        },
        "a.a(0,*a,a:0)": {
          type: Syntax.CallExpression,
          stamp: "(",
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
            name: "a",
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ],
            expand: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 },
              }
            },
            keywords: {
              a: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 },
                }
              }
            }
          },
          range: [ 0, 13 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 13 },
          }
        },
      });
    });
  });
})();

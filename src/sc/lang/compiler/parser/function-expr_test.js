(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseFunctionExpression", function() {
      sc.test.compile(this.title).each({
        "{}": sc.test.OK,
        "{ 0; 1 }": sc.test.OK,
        "{ |a| }": sc.test.OK,
        "{ |a, b| }": sc.test.OK,
        "{ |a  b| }": sc.test.OK,
        "{ |a...b| }": sc.test.OK,
        "{ | ...a| }": sc.test.OK,
        "{ |a=0| }": sc.test.OK,
        "{ |a=#[0]| }": sc.test.OK,
        "{ arg a, b...c; }": sc.test.OK,

        "{ 0 1 }": strlib.format(Message.UnexpectedNumber),
        "{ 0": strlib.format(Message.UnexpectedEOS),
        "{ |a=[0]| }": strlib.format(Message.UnexpectedToken, "["),
        "{ |a=#{}| }": strlib.format(Message.UnexpectedToken, "{"),
        "{ |a= _ | }": strlib.format(Message.UnexpectedIdentifier),
        "{ |a=Nil| }": strlib.format(Message.UnexpectedIdentifier),
        "{ ||      }": strlib.format(Message.UnexpectedToken, "|"),
        "{ arg;    }": strlib.format(Message.UnexpectedToken, ";"),
        "{ var;    }": strlib.format(Message.UnexpectedToken, ";"),

        "{ |a, a| }": strlib.format(Message.Redeclaration, "arg", "a"),
        "{ |a| var a; }": strlib.format(Message.Redeclaration, "var", "a"),
        "{ var a, a; }": strlib.format(Message.Redeclaration, "var", "a"),
        "{ |a| { |a| } }": sc.test.OK,
        "{ |a| { var a; } }": sc.test.OK,
        "{ var a; { var a; } }": sc.test.OK,
      });
      sc.test.parse(this.title).each({
        "{}": {
          type: Syntax.FunctionExpression,
          body: [],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "{ 0; 1 }": {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 },
              }
            },
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 6 },
              }
            }
          ],
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
          }
        },
        "{ |a| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 },
                  }
                },
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 },
                }
              }
            ]
          },
          body: [],
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        },
        "{ |a, b| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 },
                  }
                },
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 },
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 },
                  }
                },
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              },
            ]
          },
          body: [],
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 },
          }
        },
        "{ |a  b| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 },
                  }
                },
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 },
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 },
                  }
                },
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              },
            ]
          },
          body: [],
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 },
          }
        },
        "{ |a...b| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 },
                  }
                },
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 },
                }
              }
            ],
            remain: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 },
              }
            }
          },
          body: [],
          range: [ 0, 11 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 11 },
          }
        },
        "{ | ...a| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [],
            remain: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 },
              }
            }
          },
          body: [],
          range: [ 0, 11 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 11 },
          }
        },
        "{ |a=0| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 },
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 6 },
                  }
                },
                range: [ 3, 6 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 6 },
                }
              }
            ]
          },
          body: [],
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 9 },
          }
        },
        "{ |a=#[0]| }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 },
                  }
                },
                init: {
                  type: Syntax.ListExpression,
                  immutable: true,
                  elements: [
                    {
                      type: Syntax.Literal,
                      value: "0",
                      valueType: Token.IntegerLiteral,
                      range: [ 7, 8 ],
                      loc: {
                        start: { line: 1, column: 7 },
                        end: { line: 1, column: 8 },
                      }
                    }
                  ],
                  range: [ 5, 9 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 9 },
                  }
                },
                range: [ 3, 9 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 9 },
                }
              }
            ]
          },
          body: [],
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        },
        "{ arg a, b...c; }": {
          type: Syntax.FunctionExpression,
          args: {
            list: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 },
                  }
                },
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 },
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 10 },
                  }
                },
                range: [ 9, 10 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end: { line: 1, column: 10 },
                }
              }
            ],
            remain: {
              type: Syntax.Identifier,
              name: "c",
              range: [ 13, 14 ],
              loc: {
                start: { line: 1, column: 13 },
                end: { line: 1, column: 14 },
              }
            }
          },
          body: [],
          range: [ 0, 17 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 17 },
          }
        }
      });
    });
    describe("parseFunctionBody", function() {
      sc.test.compile(this.title).each({
        "var a;": sc.test.OK,
        "var a, b;": sc.test.OK,
        "var a = 0;": sc.test.OK,
        "var a": strlib.format(Message.UnexpectedEOS),
        "a; b; c": sc.test.OK,
      });
      sc.test.parse(this.title).each({
        "var a;": [
          {
            type: Syntax.VariableDeclaration,
            kind: "var",
            declarations: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 },
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              },
            ],
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 },
            }
          }
        ],
        "var a, b;": [
          {
            type: Syntax.VariableDeclaration,
            kind: "var",
            declarations: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 },
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 8 },
                  }
                },
                range: [ 7, 8 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 8 },
                }
              }
            ],
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 8 },
            }
          },
        ],
        "var a = 0;": [
          {
            type: Syntax.VariableDeclaration,
            kind: "var",
            declarations: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 },
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 9 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 9 },
                  }
                },
                range: [ 4, 9 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 9 },
                }
              },
            ],
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 },
            }
          }
        ],
        "a; b; c": [
          {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          {
            type: Syntax.Identifier,
            name: "b",
            range: [ 3, 4 ],
            loc: {
              start: { line: 1, column: 3 },
              end: { line: 1, column: 4 },
            }
          },
          {
            type: Syntax.Identifier,
            name: "c",
            range: [ 6, 7 ],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 7 },
            }
          }
        ]
      });
    });
    describe("parseClosedFunctionExpression", function() {
      sc.test.compile(this.title).each({
        "#{}": sc.test.OK,
        " {}": strlib.format(Message.UnexpectedToken, "{"),
        " []": strlib.format(Message.UnexpectedToken, "["),
      });
      sc.test.parse(this.title).each({
        "#{}": {
          type: Syntax.FunctionExpression,
          closed: true,
          body: [],
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        }
      });
    });
  });
})();

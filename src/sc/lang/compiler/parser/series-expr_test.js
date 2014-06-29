(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseSeriesExpression", function() {
      sc.test.compile(this.title).each({
        "(..10)": sc.test.OK,
        "(1..10)": sc.test.OK,
        "(1,5..10)": sc.test.OK,
        "(..)": strlib.format(Message.UnexpectedToken, ")"),
        "(,5..)": strlib.format(Message.UnexpectedToken, ","),
        "(,5..10)": strlib.format(Message.UnexpectedToken, ","),
        "(1..)": strlib.format(Message.UnexpectedToken, ")"),
        "(1,5..)": strlib.format(Message.UnexpectedToken, ")"),
        "(1,..10)": strlib.format(Message.UnexpectedToken, ".."),
        "(:..)": sc.test.OK,
        "(:..10)": sc.test.OK,
        "(:1..)": sc.test.OK,
        "(:1..10)": sc.test.OK,
        "(:1,5..)": sc.test.OK,
        "(:1,5..10)": sc.test.OK,
        "(:,5..10)": strlib.format(Message.UnexpectedToken, ","),
        "[1..10]": strlib.format(Message.UnexpectedToken, "["),
        "(1..10]": strlib.format(Message.UnexpectedToken, "]"),
      });
      sc.test.parse(this.title).each({
        "(..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "series",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 }
            }
          },
          args: {
            list: [
              null,
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 3, 5 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 5 }
                }
              }
            ]
          },
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 }
          }
        },
        "(1..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "series",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 }
            }
          },
          args: {
            list: [
              null,
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 4, 6 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 6 }
                }
              }
            ]
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 }
          }
        },
        "(1,5..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "series",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 }
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "5",
                valueType: Token.IntegerLiteral,
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 }
                }
              },
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 6, 8 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 8 }
                }
              }
            ]
          },
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 9 }
          }
        },
        "(:..)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          args: {
            list: [
              null,
              null
            ]
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
        "(:..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          args: {
            list: [
              null,
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 4, 6 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 6 }
                }
              }
            ]
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 }
          }
        },
        "(:1..)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          args: {
            list: [
              null,
              null
            ]
          },
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 }
          }
        },
        "(:1..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          args: {
            list: [
              null,
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 5, 7 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 7 }
                }
              }
            ]
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 }
          }
        },
        "(:1,5..)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "5",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 }
                }
              },
              null
            ]
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 }
          }
        },
        "(:1,5..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 }
            }
          },
          args: {
            list: [
              {
                type: Syntax.Literal,
                value: "5",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 }
                }
              },
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 7, 9 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 9 }
                }
              },
            ]
          },
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 }
          }
        },
      });
    });
  });
})();

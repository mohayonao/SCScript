(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseBinaryExpression", function() {
      sc.test.compile(this.title).each({
        "a = 1": sc.test.OK,
        "a, b": sc.test.OK,
        "1 + 2": sc.test.OK,
        "1 + 2 * 3": sc.test.OK,
        "1 max: 2": sc.test.OK,
        "1 +.0 2": sc.test.OK,
        "1 +.f 2": sc.test.OK,
        "1 +.[] 2": strlib.format(Message.UnexpectedToken, "["),
        "1 +.0.0 2": Message.UnexpectedNumber,
        "1 +.nil 2": strlib.format(Message.UnexpectedLiteral, "nil"),
        "1 +.Nil 2": Message.UnexpectedIdentifier,
        "1 +._ 2": Message.UnexpectedIdentifier,
      });
      sc.test.parse(this.title).each({
        "a = 1": {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 },
          }
        },
        "a, b": {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 },
          }
        },
        "1 + 2": {
          type: Syntax.BinaryExpression,
          operator: "+",
          left: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          right: {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          },
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "1 + 2 * 3": { // (1 + 2) * 3
          type: Syntax.BinaryExpression,
          operator: "*",
          left: {
            type: Syntax.BinaryExpression,
            operator: "+",
            left: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
              }
            },
            right: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 },
              }
            },
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 },
            }
          },
          right: {
            type: Syntax.Literal,
            value: "3",
            valueType: Token.IntegerLiteral,
            range: [ 8, 9 ],
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 9 },
            }
          },
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 9 },
          }
        },
        "1 max: 2": {
          type: Syntax.BinaryExpression,
          operator: "max",
          left: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          right: {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 7, 8 ],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 8 },
            }
          },
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
          }
        },
        "1 +.0 2": {
          type: Syntax.BinaryExpression,
          operator: "+",
          left: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          right: {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 6, 7 ],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 7 },
            }
          },
          adverb: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        },
        "1 +.f 2": {
          type: Syntax.BinaryExpression,
          operator: "+",
          left: {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            }
          },
          right: {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 6, 7 ],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 7 },
            }
          },
          adverb: {
            type: Syntax.Literal,
            value: "f",
            valueType: Token.SymbolLiteral,
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          },
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 },
          }
        }
      });
      describe("parse with binaryPrecedence", function() {
        before(function() {
          sc.config.binaryPrecedence = true;
        });
        after(function() {
          sc.config.binaryPrecedence = false;
        });
        sc.test.parse(this.parent.title).each({
          "1 + 2 * 3": { // 1 + (2 * 3)
            type: Syntax.BinaryExpression,
            operator: "+",
            left: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
              }
            },
            right: {
              type: Syntax.BinaryExpression,
              operator: "*",
              left: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              },
              right: {
                type: Syntax.Literal,
                value: "3",
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
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 },
            }
          }
        });
      });
    });
  });
})();

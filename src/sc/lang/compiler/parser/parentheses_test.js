(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseParentheses", function() {
      sc.test.compile(this.title).each({
        "()": sc.test.OK,        // EventExpression
        "(a:1)": sc.test.OK,     // EventExpression
        "(0:1)": sc.test.OK,     // EventExpression
        "(:..)": sc.test.OK,     // SeriesExpression
        "(..10)": sc.test.OK,    // SeriesExpression
        "(0..10)": sc.test.OK,   // SeriesExpression
        "(0;1..10)": sc.test.OK, // SeriesExpression
        "(1;2)": sc.test.OK,     // Expressions
        "(1)": sc.test.OK,       // Expression
        "[1]": strlib.format(Message.UnexpectedToken, "["),
        "(var a;)": strlib.format(Message.UnexpectedToken, "var"),
      });
      sc.test.parse(this.title).each({
        "()": {
          type: Syntax.EventExpression,
          elements: [],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "(a:1)": {
          type: Syntax.EventExpression,
          elements: [
            {
              type: Syntax.Literal,
              value: "a",
              valueType: Token.SymbolLiteral,
              range: [ 1, 3 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
              }
            },
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 },
              }
            }
          ],
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "(0:1)": {
          type: Syntax.EventExpression,
          elements: [
            {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
              }
            },
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 },
              }
            }
          ],
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
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
              end: { line: 1, column: 2 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "seriesIter",
            range: [ 2, 2 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 2 },
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
            end: { line: 1, column: 5 },
          }
        },
        "(..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "series",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 },
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
        "(0..10)": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "series",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 },
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
        "(0;1..10)": {
          type: Syntax.CallExpression,
          callee: [
            {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
              }
            },
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 },
              }
            }
          ],
          method: {
            type: Syntax.Identifier,
            name: "series",
            range: [ 1, 1 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 },
            }
          },
          args: {
            list: [
              null,
              {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 6, 8 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 8 },
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
        "(1;2)": [
          {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            }
          },
          {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 3, 4 ],
            loc: {
              start: { line: 1, column: 3 },
              end: { line: 1, column: 4 },
            }
          }
        ],
        "(1)": {
          type: Syntax.Literal,
          value: "1",
          valueType: Token.IntegerLiteral,
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 },
          }
        }
      });
    });
  });
})();

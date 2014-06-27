(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseBinaryExpression", function() {
      it("parse", function() {
        _.chain({
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
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseBinaryExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("parse with binaryPrecedence", function() {
        sc.config.binaryPrecedence = true;
        _.chain({
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
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseBinaryExpression(), items[0]).to.eql(items[1]);
        });
        sc.config.binaryPrecedence = false;
      });
      it("error", function() {
        _.chain({
          "1 +.[] 2": "unexpected token [",
          "1 +.0.0 2": "unexpected number",
          "1 +.nil 2": "unexpected token nil",
          "1 +.Nil 2": "unexpected identifier",
          "1 +._ 2": "unexpected identifier",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseBinaryExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseListExpression", function() {
      it("parse", function() {
        _.chain({
          "[1, 2]": {
            type: Syntax.ListExpression,
            elements: [
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
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ],
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          "[a: 2]": {
            type: Syntax.ListExpression,
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
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ],
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          },
          "[1: 2]": {
            type: Syntax.ListExpression,
            elements: [
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
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 },
                }
              }
            ],
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 },
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseListExpression(), items[0]).to.eql(items[1]);
        });
      });
    });
    describe("parseImmutableListExpression", function() {
      it("parse", function() {
        _.chain({
          "#[1, 2]": {
            type: Syntax.ListExpression,
            elements: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 3 },
                }
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 },
                }
              }
            ],
            immutable: true,
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 },
            }
          },
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseImmutableListExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "#[ 0, #[ 1, 2 ] ]": "unexpected token #",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseImmutableListExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

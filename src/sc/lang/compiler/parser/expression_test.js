(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseExpression", function() {
      it("parseExpression", function() {
        _.chain({
          "10 ": {
            type: Syntax.Literal,
            value: "10",
            valueType: Token.IntegerLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("parseExpressions", function() {
        _.chain({
          "10;": {
            type: Syntax.Literal,
            value: "10",
            valueType: Token.IntegerLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          },
          "10 ]": {
            type: Syntax.Literal,
            value: "10",
            valueType: Token.IntegerLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          },
          "10;]": {
            type: Syntax.Literal,
            value: "10",
            valueType: Token.IntegerLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          },
          "10; 20": [
            {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 2 },
              }
            },
            {
              type: Syntax.Literal,
              value: "20",
              valueType: Token.IntegerLiteral,
              range: [ 4, 6 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 6 },
              }
            }
          ]
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseExpressions(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          ";": "unexpected token ;",
          "]": "unexpected token ]",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseExpressions();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

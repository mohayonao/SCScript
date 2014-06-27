(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseListIndexer", function() {
      it("parse", function() {
        _.chain({
          "[1]": [
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
              }
            }
          ],
          "[..]": [
            null,
            null,
            null
          ],
          "[..10]": [
            null,
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
          ],
          "[1..]": [
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
            null,
            null
          ],
          "[1,5]": [
            {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
              }
            }
          ],
          "[1,5..]": [
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
              value: "5",
              valueType: Token.IntegerLiteral,
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 },
              }
            },
            null
          ],
          "[1..10]": [
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
          ],
          "[1,5..10]": [
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
              value: "5",
              valueType: Token.IntegerLiteral,
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 },
              }
            },
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
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseListIndexer(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "[]": "unexpected token ]",
          "[1": "unexpected end of input",
          "[,5..10]": "unexpected token ,",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseListIndexer();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

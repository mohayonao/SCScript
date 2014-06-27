(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseSignedExpression", function() {
      it("parse", function() {
        _.chain({
          "a ": {
            type: Syntax.Identifier,
            name: "a",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 }
            }
          },
          "-a": {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 }
              }
            },
            args: {
              list: []
            },
            stamp: ".",
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 }
            }
          },
          "-1": {
            type: Syntax.Literal,
            value: "-1",
            valueType: Token.IntegerLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 }
            }
          },
          "-1.0": {
            type: Syntax.Literal,
            value: "-1.0",
            valueType: Token.FloatLiteral,
            range: [ 0, 4 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 4 }
            }
          },
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseSignedExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "+": "unexpected token +",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseSignedExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

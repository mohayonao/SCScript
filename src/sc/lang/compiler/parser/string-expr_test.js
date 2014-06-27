(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseStringExpression", function() {
      it("parse", function() {
        _.chain({
          '"str"': {
            type: Syntax.Literal,
            value: "str",
            valueType: Token.StringLiteral,
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 },
            }
          },
          '"#{freq}hz"': {
            type: Syntax.BinaryExpression,
            operator: "++",
            left: {
              type: Syntax.CallExpression,
              callee: {
                type: Syntax.Identifier,
                name: "freq"
              },
              method: {
                type: Syntax.Identifier,
                name: "asString"
              },
              args: {
                list: []
              }
            },
            right: {
              type: Syntax.Literal,
              value: "hz",
              valueType: Token.StringLiteral
            },
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 11 },
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseStringExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "'sym'": "unexpected symbol",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0]));
          expect(function() {
            p.parseStringExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

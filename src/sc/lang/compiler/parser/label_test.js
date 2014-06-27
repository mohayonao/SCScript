(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseLabelAsSymbol", function() {
      it("parse", function() {
        _.chain({
          "a:": {
            type: Syntax.Literal,
            value: "a",
            valueType: Token.SymbolLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseLabelAsSymbol(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "a :": "unexpected identifier",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseLabelAsSymbol();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

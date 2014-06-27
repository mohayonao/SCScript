(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseThisExpression", function() {
      it("parse", function() {
        _.chain({
          "this ": {
            type: Syntax.ThisExpression,
            name: "this",
            range: [ 0, 4 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 4 }
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseThisExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "var ": "unexpected token var",
          "this_ ": "unexpected identifier",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseThisExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

(function() {
  "use strict";

  require("./installer");

  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseGeneratorExpression", function() {
      it("parse", function() {
        _.chain({
          // TODO: write tests
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseGeneratorExpression(), items[0]).to.eql(items[1]);
        });
      });
    });
  });
})();

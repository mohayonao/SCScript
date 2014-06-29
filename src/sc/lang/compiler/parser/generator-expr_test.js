(function() {
  "use strict";

  require("./installer");

  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe.skip("parseGeneratorExpression", function() {
      sc.test.compile(this.title).each({
        // TODO: write tests
        "{:a, a<-[]}": sc.test.OK
      });
    });
    // TODO: fix later implement parseGeneratorExpression
    describe("error", function() {
      var p = new Parser(null, new Lexer("{:a, a<-[]}"));
      expect(function() {
        p.parseGeneratorExpression();
      }).to.throw();
    });
  });
})();

(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseBraces", function() {
      it("parse", function() {
        _.chain({
          "{}": {
            type: Syntax.FunctionExpression,
            body: [],
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseBraces(), items[0]).to.eql(items[1]);
        });
      });
      // TODO: fix later implement parseGeneratorExpression
      describe("parse generator", function() {
        it("parse", sinon.test(function() {
          var p = new Parser(null, new Lexer("{: a, a <- a }"));

          this.stub(p, "parseGeneratorExpression", sc.test.func());

          var test = p.parseBraces();
          expect(p.parseGeneratorExpression).to.be.calledLastIn(test);
        }));
        it("throw error when blockList", sinon.test(function() {
          var p = new Parser(null, new Lexer("{: a, a <- a }"));

          this.stub(p, "parseGeneratorExpression");

          expect(function() {
            p.parseBraces({ blockList: true });
          }).to.throw("unexpected token :");

          expect(p.parseGeneratorExpression).to.not.beCalled;
        }));
      });
    });
  });
})();

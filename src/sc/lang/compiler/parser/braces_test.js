(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseBraces", function() {
      sc.test.compile(this.title).each({
        "{}": sc.test.OK,
        "[]": strlib.format(Message.UnexpectedToken, "["),
      });
      sc.test.parse(this.title).each({
        "{}": {
          type: Syntax.FunctionExpression,
          body: [],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        }
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
          }).to.throw(strlib.format(Message.UnexpectedToken, ":"));

          expect(p.parseGeneratorExpression).to.not.beCalled;
        }));
      });
    });
  });
})();

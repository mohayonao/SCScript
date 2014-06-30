(function() {
  "use strict";

  require("./installer");

  describe("sc.lang.compiler", function() {
    it(".tokenize", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();
      var Lexer$tokenize = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "Lexer").withArgs(source, opts).returns({
        tokenize: Lexer$tokenize
      });

      var test = sc.lang.compiler.tokenize(source, opts);

      expect(sc.lang.compiler.Lexer).to.be.calledWithNew;
      expect(Lexer$tokenize).to.be.calledLastIn(test);
    }));
    it(".parse", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();
      var lexer = { name: "Lexer" };
      var Parser$parse = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "Lexer").withArgs(source, opts).returns(lexer);
      this.stub(sc.lang.compiler, "Parser").withArgs(null, lexer).returns({
        parse: Parser$parse
      });

      var test = sc.lang.compiler.parse(source, opts);

      expect(sc.lang.compiler.Lexer).to.be.calledWithNew;
      expect(sc.lang.compiler.Parser).to.be.calledWithNew;
      expect(Parser$parse).to.be.calledLastIn(test);
    }));
    it(".compile given string", sinon.test(function() {
      var source = String(Math.random());
      var opts = Math.random();
      var ast1 = Math.random();
      var ast2 = Math.random();
      var Rewriter$rewrite = this.spy(function() {
        return ast2;
      });
      var CodeGen$compile = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "parse").withArgs(source).returns(ast1);
      this.stub(sc.lang.compiler, "Rewriter").withArgs().returns({
        rewrite: Rewriter$rewrite
      });
      this.stub(sc.lang.compiler, "CodeGen").withArgs(null, opts).returns({
        compile: CodeGen$compile
      });

      var test = sc.lang.compiler.compile(source, opts);

      expect(sc.lang.compiler.parse).to.be.calledWith(source, opts);
      expect(sc.lang.compiler.Rewriter).to.be.calledWithNew;
      expect(Rewriter$rewrite).to.be.calledWith(ast1);
      expect(sc.lang.compiler.CodeGen).to.be.calledWithNew;
      expect(CodeGen$compile).to.be.calledWith(ast2);
      expect(CodeGen$compile).to.be.calledLastIn(test);
    }));
    it(".compile given ast", sinon.test(function() {
      var opts = Math.random();
      var ast1 = Math.random();
      var ast2 = Math.random();
      var Rewriter$rewrite = this.spy(function() {
        return ast2;
      });
      var CodeGen$compile = this.spy(sc.test.func());

      this.spy(sc.lang.compiler, "parse");
      this.stub(sc.lang.compiler, "Rewriter").withArgs().returns({
        rewrite: Rewriter$rewrite
      });
      this.stub(sc.lang.compiler, "CodeGen").withArgs(null, opts).returns({
        compile: CodeGen$compile
      });

      var test = sc.lang.compiler.compile(ast1, opts);

      expect(sc.lang.compiler.parse).to.be.not.called;
      expect(sc.lang.compiler.Rewriter).to.be.calledWithNew;
      expect(Rewriter$rewrite).to.be.calledWith(ast1);
      expect(sc.lang.compiler.CodeGen).to.be.calledWithNew;
      expect(CodeGen$compile).to.be.calledWith(ast2);
      expect(CodeGen$compile).to.be.calledLastIn(test);
    }));
    it("compile work", function() {
      var test = sc.lang.compiler.compile("\\source");
      expect(test).to.have.match(/^SCScript\([\s\S]+\);$/m);
    });
  });
})();

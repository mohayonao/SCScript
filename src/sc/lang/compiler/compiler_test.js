(function() {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./parser");
  require("./codegen");

  describe("sc.lang.compiler", function() {
    it(".tokenize", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();
      var tokenize = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "Lexer", function() {
        return { tokenize: tokenize };
      });

      var test = sc.lang.compiler.tokenize(source, opts);

      expect(sc.lang.compiler.Lexer).to.be.calledWithNew;
      expect(sc.lang.compiler.Lexer).to.be.calledWith(source, opts);
      expect(tokenize).to.be.calledLastIn(test);
    }));
    it(".parse", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();

      this.stub(sc.lang.compiler.parser, "parse", sc.test.func());

      var test = sc.lang.compiler.parse(source, opts);

      expect(sc.lang.compiler.parser.parse).to.be.calledWith(source, opts);
      expect(sc.lang.compiler.parser.parse).to.be.calledLastIn(test);
    }));
    it(".compile given string", sinon.test(function() {
      var source = String(Math.random());
      var opts = Math.random();
      var ast = Math.random();

      this.stub(sc.lang.compiler, "parse").withArgs(source).returns(ast);
      this.stub(sc.lang.compiler.codegen, "compile", sc.test.func());

      var test = sc.lang.compiler.compile(source, opts);

      expect(sc.lang.compiler.parse).to.be.calledWith(source, opts);
      expect(sc.lang.compiler.codegen.compile).to.be.calledWith(ast, opts);
      expect(sc.lang.compiler.codegen.compile).to.be.calledLastIn(test);
    }));
    it(".compile given ast", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();

      this.stub(sc.lang.compiler.codegen, "compile", sc.test.func());

      var test = sc.lang.compiler.compile(source, opts);

      expect(sc.lang.compiler.codegen.compile).to.be.calledWith(source, opts);
      expect(sc.lang.compiler.codegen.compile).to.be.calledLastIn(test);
    }));
  });
})();

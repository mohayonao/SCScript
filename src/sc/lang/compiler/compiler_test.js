(function() {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./parser");
  require("./codegen");

  var compiler = sc.lang.compiler;
  var SCScript = sc.SCScript;

  describe("sc.lang.compiler.compiler", function() {
    it("SCScript.tokenize", sinon.test(function() {
      var source, opts;
      var tokenize, test;

      source = Math.random();
      opts   = Math.random();

      tokenize = this.spy(sc.test.func());

      this.stub(compiler, "lexer", function() {
        return { tokenize: tokenize };
      });

      test = SCScript.tokenize(source, opts);
      expect(compiler.lexer).to.be.calledWithNew;
      expect(compiler.lexer).to.be.calledWith(source, opts);
      expect(tokenize).to.be.calledLastIn(test);
    }));
    it("SCScript.parse", sinon.test(function() {
      var source, opts;
      var test;

      source = Math.random();
      opts   = Math.random();

      this.stub(compiler.parser, "parse", sc.test.func());

      test = SCScript.parse(source, opts);
      expect(compiler.parser.parse).to.be.calledWith(source, opts);
      expect(compiler.parser.parse).to.be.calledLastIn(test);
    }));
    it("SCScript.compile", sinon.test(function() {
      var source, opts, ast;
      var test;

      source = "source";
      opts   = Math.random();
      ast    = Math.random();

      this.stub(SCScript, "parse", function() {
        return ast;
      });
      this.stub(compiler.codegen, "compile", sc.test.func());

      test = SCScript.compile(source, opts);

      expect(SCScript.parse).to.be.calledWith(source, opts);
      expect(compiler.codegen.compile).to.be.calledWith(ast, opts);
      expect(compiler.codegen.compile).to.be.calledLastIn(test);
    }));
    it("SCScript.compile with ast", sinon.test(function() {
      var source, opts;
      var test;

      source = {};
      opts   = Math.random();

      this.stub(compiler.codegen, "compile", sc.test.func());

      test = SCScript.compile(source, opts);

      expect(compiler.codegen.compile).to.be.calledWith(source, opts);
      expect(compiler.codegen.compile).to.be.calledLastIn(test);
    }));

  });

})();

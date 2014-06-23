(function() {
  "use strict";

  require("./sc");
  require("./lang/main");
  require("./lang/compiler");

  describe("SCScript", function() {
    it("should call main.run given function with lang.$", sinon.test(function() {
      var func = function() {};

      this.stub(sc.lang.main, "run");
      SCScript(func);

      expect(sc.lang.main.run).to.be.calledWith(func);
    }));
    describe(".VERSION", function() {
      it("should be a string", function() {
        expect(SCScript.VERSION).to.be.a("string");
      });
    });
    describe(".install", function() {
      it("should call given function with sc", function() {
        var installer = sinon.spy();
        SCScript.install(installer);
        expect(installer).to.be.calledWith(sc);
      });
    });
    describe(".tokenize", function() {
      it("should call compiler.tokenize", sinon.test(function() {
        var source = Math.random();
        var opts = Math.random();
        this.stub(sc.lang.compiler, "tokenize", sc.test.func());

        var test = SCScript.tokenize(source, opts);

        expect(sc.lang.compiler.tokenize).to.be.calledWith(source, opts);
        expect(sc.lang.compiler.tokenize).to.be.calledLastIn(test);
      }));
    });
    describe(".parse", function() {
      it("should call compiler.parse", sinon.test(function() {
        var source = Math.random();
        var opts = Math.random();
        this.stub(sc.lang.compiler, "parse", sc.test.func());

        var test = SCScript.parse(source, opts);

        expect(sc.lang.compiler.parse).to.be.calledWith(source, opts);
        expect(sc.lang.compiler.parse).to.be.calledLastIn(test);
      }));
    });
    describe(".compile", function() {
      it("should call compiler.compile", sinon.test(function() {
        var source = Math.random();
        var opts = Math.random();
        this.stub(sc.lang.compiler, "compile", sc.test.func());

        var test = SCScript.compile(source, opts);

        expect(sc.lang.compiler.compile).to.be.calledWith(source, opts);
        expect(sc.lang.compiler.compile).to.be.calledLastIn(test);
      }));
    });
  });
})();

(function() {
  "use strict";

  require("./sc");

  describe("SCScript", function() {
    var sc_lang;
    before(function() {
      sc_lang = sc.lang;
    });
    after(function() {
      sc.lang = sc_lang;
    });
    it("should call given function with sc.lang.$", function() {
      var func = function() {};

      sc.lang = {
        main: {
          run: sinon.spy()
        }
      };
      sc.SCScript(func);

      expect(sc.lang.main.run).to.be.calledWith(func);
    });
    describe(".install", function() {
      it("should call given function with sc", function() {
        var installer = sinon.spy();
        sc.SCScript.install(installer);
        expect(installer).to.be.calledWith(sc);
      });
    });
    describe(".VERSION", function() {
      it("should be exists", function() {
        expect(sc.SCScript.VERSION).to.be.a("string");
      });
    });
  });
})();

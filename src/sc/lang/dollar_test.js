(function() {
  "use strict";

  require("./dollar");

  var $ = sc.lang.$;

  describe("sc.lang.$", function() {
    if (!sc.lang.klass) {
      sc.lang.klass = { get: function() {} };
    }
    it("shold apply sc.lang.klass.get", sinon.test(function() {
      var stub = this.stub(sc.lang.klass, "get", sc.test.func());
      var test = $("Class");
      expect(stub).to.be.calledLastIn(test);
    }));
    it(".NOP should be a null", function() {
      expect($.NOP).to.be.null;
    });
  });
})();

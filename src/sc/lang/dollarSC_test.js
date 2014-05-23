(function() {
  "use strict";

  require("./dollarSC");

  var $SC = sc.lang.$SC;

  describe("sc.lang.$SC", function() {
    if (!sc.lang.klass) {
      sc.lang.klass = { get: function() {} };
    }
    it("shold apply sc.lang.klass.get", sinon.test(function() {
      var stub = this.stub(sc.lang.klass, "get", sc.test.func);
      var test = $SC("Class");
      expect(stub).to.be.calledLastIn(test);
    }));
  });

})();

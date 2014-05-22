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
    describe("Value", function() {
      it("should return _result if exists property _result", function() {
        var test, $value;
        $value = { _result: 100 };
        test = $SC.Value($value);
        expect(test).to.equal(100);
      });
      it("should return self if not exists property _result", function() {
        var test, $value;
        $value = {};
        test = $SC.Value($value);
        expect(test).to.equal($value);
      });
    });
  });

})();

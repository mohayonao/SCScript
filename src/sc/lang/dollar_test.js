(function() {
  "use strict";

  require("./dollar");

  var $ = sc.lang.$;

  describe("sc.lang.$", function() {
    var sc$lang$klass;
    before(function() {
      sc$lang$klass = sc.lang.klass;
      sc.lang.klass = { get: function() {} };
    });
    after(function() {
      sc.lang.klass = sc$lang$klass;
    });
    it("shold apply sc.lang.klass.get", sinon.test(function() {
      var stub = this.stub(sc.lang.klass, "get", sc.test.func());
      var test = $("Class");
      expect(stub).to.be.calledLastIn(test);
    }));
    it(".addProperty", function() {
      $.addProperty("test::addProperty", 12345);
      expect($["test::addProperty"]).to.equal(12345);
      $.addProperty("test::addProperty", null);
    });
    it(".NOP should be a null", function() {
      expect($.NOP).to.be.null;
    });
    it(".DoNothing should return self", function() {
      var a = { doNothing: $.DoNothing };
      expect(a.doNothing()).to.equal(a);
    });
  });
})();

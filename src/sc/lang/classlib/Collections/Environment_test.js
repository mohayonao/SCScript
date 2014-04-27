(function() {
  "use strict";

  require("./Environment");

  var $SC = sc.lang.$SC;

  describe("SCEnvironment", function() {
    var SCEnvironment;
    before(function() {
      SCEnvironment = $SC.Class("Environment");
      this.createInstance = function() {
        return SCEnvironment.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.eqls({});
    });
    it.skip(".make", function() {
    });
    it.skip(".use", function() {
    });
    it.skip("#make", function() {
    });
    it.skip("#use", function() {
    });
    it.skip("#eventAt", function() {
    });
    it.skip("#composeEvents", function() {
    });
    it.skip("#$pop", function() {
    });
    it.skip("#$push", function() {
    });
    it.skip("#pop", function() {
    });
    it.skip("#push", function() {
    });
    it.skip("#linkDoc", function() {
    });
    it.skip("#unlinkDoc", function() {
    });
  });
})();

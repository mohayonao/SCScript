(function() {
  "use strict";

  require("./Set");

  var $SC = sc.lang.$SC;

  describe("SCSet", function() {
    var SCSet;
    before(function() {
      SCSet = $SC("Set");
      this.createInstance = function() {
        return SCSet.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("#species", function() {
    });
    it.skip("#copy", function() {
    });
    it.skip("#do", function() {
    });
    it.skip("#clear", function() {
    });
    it.skip("#makeEmpty", function() {
    });
    it.skip("#includes", function() {
    });
    it.skip("#findMatch", function() {
    });
    it.skip("#add", function() {
    });
    it.skip("#remove", function() {
    });
    it.skip("#choose", function() {
    });
    it.skip("#pop", function() {
    });
    it.skip("#powerset", function() {
    });
    it.skip("#unify", function() {
    });
    it.skip("#sect", function() {
    });
    it.skip("#union", function() {
    });
    it.skip("#difference", function() {
    });
    it.skip("#symmetricDifference", function() {
    });
    it.skip("#isSubsetOf", function() {
    });
    it.skip("#initSet", function() {
    });
    it.skip("#putCheck", function() {
    });
    it.skip("#fullCheck", function() {
    });
    it.skip("#grow", function() {
    });
    it.skip("#noCheckAdd", function() {
    });
    it.skip("#scanFor", function() {
    });
    it.skip("#fixCollisionsFrom", function() {
    });
    it.skip("#keyAt", function() {
    });
    it.skip("#asSet", function() {
    });
  });
})();

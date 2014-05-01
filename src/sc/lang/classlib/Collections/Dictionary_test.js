(function() {
  "use strict";

  require("./Dictionary");

  var $SC = sc.lang.$SC;

  describe("SCDictionary", function() {
    var SCDictionary;
    before(function() {
      SCDictionary = $SC("Dictionary");
      this.createInstance = function() {
        return SCDictionary.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.eqls({});
    });
    it.skip("#$newFrom", function() {
    });
    it.skip("#at", function() {
    });
    it.skip("#atFail", function() {
    });
    it.skip("#matchAt", function() {
    });
    it.skip("#trueAt", function() {
    });
    it.skip("#add", function() {
    });
    it.skip("#put", function() {
    });
    it.skip("#putAll", function() {
    });
    it.skip("#putPairs", function() {
    });
    it.skip("#getPairs", function() {
    });
    it.skip("#associationAt", function() {
    });
    it.skip("#associationAtFail", function() {
    });
    it.skip("#keys", function() {
    });
    it.skip("#values", function() {
    });
    it.skip("#includes", function() {
    });
    it.skip("#includesKey", function() {
    });
    it.skip("#removeAt", function() {
    });
    it.skip("#removeAtFail", function() {
    });
    it.skip("#remove", function() {
    });
    it.skip("#removeFail", function() {
    });
    it.skip("#keysValuesDo", function() {
    });
    it.skip("#keysValuesChange", function() {
    });
    it.skip("#do", function() {
    });
    it.skip("#keysDo", function() {
    });
    it.skip("#associationsDo", function() {
    });
    it.skip("#pairsDo", function() {
    });
    it.skip("#collect", function() {
    });
    it.skip("#select", function() {
    });
    it.skip("#reject", function() {
    });
    it.skip("#invert", function() {
    });
    it.skip("#merge", function() {
    });
    it.skip("#blend", function() {
    });
    it.skip("#findKeyForValue", function() {
    });
    it.skip("#sortedKeysValuesDo", function() {
    });
    it.skip("#choose", function() {
    });
    it.skip("#order", function() {
    });
    it.skip("#powerset", function() {
    });
    it.skip("#transformEvent", function() {
    });
    it.skip("#embedInStream", function() {
    });
    it.skip("#asSortedArray", function() {
    });
    it.skip("#asKeyValuePairs", function() {
    });
    it.skip("#keysValuesArrayDo", function() {
    });
    it.skip("#grow", function() {
    });
    it.skip("#fixCollisionsFrom", function() {
    });
    it.skip("#scanFor", function() {
    });
    it.skip("#storeItemsOn", function() {
    });
    it.skip("#printItemsOn", function() {
    });
  });

  describe("SCIdentityDictionary", function() {
    var SCIdentityDictionary;
    before(function() {
      SCIdentityDictionary = $SC("IdentityDictionary");
      this.createInstance = function() {
        return SCIdentityDictionary.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.eqls({});
    });
    it.skip("#at", function() {
    });
    it.skip("#put", function() {
    });
    it.skip("#putGet", function() {
    });
    it.skip("#includesKey", function() {
    });
    it.skip("#findKeyForValue", function() {
    });
    it.skip("#scanFor", function() {
    });
    it.skip("#freezeAsParent", function() {
    });
    it.skip("#insertParent", function() {
    });
    it.skip("#storeItemsOn", function() {
    });
    it.skip("#doesNotUnderstand", function() {
    });
    it.skip("#nextTimeOnGrid", function() {
    });
    it.skip("#asQuant", function() {
    });
    it.skip("#timingOffset", function() {
    });
  });
})();

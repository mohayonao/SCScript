(function() {
  "use strict";

  require("./Association");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  var SCAssociation = $("Association");

  describe("SCAssociation", function() {
    before(function() {
      this.createInstance = function($key, $value) {
        return SCAssociation.new($key, $value);
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance($$(1), $$(2));

      test = instance.valueOf();
      expect(test).to.be.a("JSNumber").that.equals(1);
    });
    it("#==", function() {
      var instance, test;
      var $anAssociation;

      instance = this.createInstance($$(1), $$(2));

      $anAssociation = $$(null);
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $anAssociation = $$(SCAssociation.new());
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $anAssociation = $$(SCAssociation.new($$(1), $$(3)));
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#hash", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.hash();
      expect(test).to.be.a("SCInteger");
    });
    it("#<", function() {
      var instance, test;
      var $anAssociation;

      instance = this.createInstance($$(1), $$(2));

      $anAssociation = $$(SCAssociation.new($$(2), $$(3)));
      test = instance ["<"] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.true;

      $anAssociation = $$(SCAssociation.new($$(0), $$(3)));
      test = instance ["<"] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it.skip("#printOn", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#embedInStream", function() {
    });
    it.skip("#transformEvent", function() {
    });
  });
})();

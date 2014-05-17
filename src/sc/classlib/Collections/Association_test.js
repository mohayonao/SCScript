(function() {
  "use strict";

  require("./Association");

  var $SC = sc.lang.$SC;

  describe("SCAssociation", function() {
    var SCAssociation;
    before(function() {
      SCAssociation = $SC("Association");
      this.createInstance = function($key, $value) {
        return SCAssociation.new($key, $value);
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance($SC.Integer(1), $SC.Integer(2));

      test = instance.valueOf();
      expect(test).to.be.a("JSNumber").that.equals(1);
    });
    it("<>value", function() {
      var instance, test;
      var $value;

      $value = sc.test.object();

      instance = this.createInstance();

      test = instance.value_($value);
      expect(test).to.equal(instance);

      test = instance.value();
      expect(test).to.equal($value);
    });
    it("<>key", function() {
      var instance, test;
      var $key;

      $key = sc.test.object();

      instance = this.createInstance();

      test = instance.key_($key);
      expect(test).to.equal(instance);

      test = instance.key();
      expect(test).to.equal($key);
    });
    it("#==", function() {
      var instance, test;
      var $anAssociation;

      instance = this.createInstance($SC.Integer(1), $SC.Integer(2));

      $anAssociation = $SC.Nil();
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $anAssociation = SCAssociation.new();
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $anAssociation = SCAssociation.new($SC.Integer(1), $SC.Integer(3));
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it.skip("#hash", function() {
    });
    it("#<", function() {
      var instance, test;
      var $anAssociation;

      instance = this.createInstance($SC.Integer(1), $SC.Integer(2));

      $anAssociation = SCAssociation.new($SC.Integer(2), $SC.Integer(3));
      test = instance ["<"] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.true;

      $anAssociation = SCAssociation.new($SC.Integer(0), $SC.Integer(3));
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

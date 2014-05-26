(function() {
  "use strict";

  require("./Association");

  var $ = sc.lang.$;

  describe("SCAssociation", function() {
    var SCAssociation;
    before(function() {
      SCAssociation = $("Association");
      this.createInstance = function($key, $value) {
        return SCAssociation.new($key, $value);
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance($.Integer(1), $.Integer(2));

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

      instance = this.createInstance($.Integer(1), $.Integer(2));

      $anAssociation = $.Nil();
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $anAssociation = SCAssociation.new();
      test = instance ["=="] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $anAssociation = SCAssociation.new($.Integer(1), $.Integer(3));
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

      instance = this.createInstance($.Integer(1), $.Integer(2));

      $anAssociation = SCAssociation.new($.Integer(2), $.Integer(3));
      test = instance ["<"] ($anAssociation);
      expect(test).to.be.a("SCBoolean").that.is.true;

      $anAssociation = SCAssociation.new($.Integer(0), $.Integer(3));
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

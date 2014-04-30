(function() {
  "use strict";

  require("./klass-utils");

  var $SC = sc.lang.$SC;
  var utils = sc.lang.klass.utils;

  describe("sc.lang.klass.utils", function() {
    var test;
    it("BOOL", function() {
      expect(utils.BOOL($SC.True() )).to.be.a("JSBoolean").that.is.true;
      expect(utils.BOOL($SC.False())).to.be.a("JSBoolean").that.is.false;
    });
    it("$nil", function() {
      test = utils.$nil;
      expect(test).to.be.a("SCNil");
    });
    it("$true", function() {
      test = utils.$true;
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("$false", function() {
      test = utils.$false;
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("$int_0", function() {
      test = utils.$int_0;
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("$int_1", function() {
      test = utils.$int_1;
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("nop", function() {
      var that = {};
      test = utils.nop.call(that);
      expect(test).to.equal(that);
    });
    it("alwaysReturn$nil", function() {
      test = utils.alwaysReturn$nil();
      expect(test).to.be.a("SCNil");
    });
    it("alwaysReturn$true", function() {
      test = utils.alwaysReturn$true();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("alwaysReturn$false", function() {
      test = utils.alwaysReturn$false();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("alwaysReturn$int_0", function() {
      test = utils.alwaysReturn$int_0();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("alwaysReturn$int_1", function() {
      test = utils.alwaysReturn$int_1();
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("defaultValue$Nil", function() {
      var $obj = {};
      test = utils.defaultValue$Nil(undefined);
      expect(test).to.be.a("SCNil");

      test = utils.defaultValue$Nil($obj);
      expect(test).to.equals($obj);
    });
    it("defaultValue$Boolean", function() {
      var $obj = {};
      test = utils.defaultValue$Boolean(undefined, true);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = utils.defaultValue$Nil($obj);
      expect(test).to.equals($obj);
    });
    it("defaultValue$Integer", function() {
      var $obj = {};
      test = utils.defaultValue$Integer(undefined, 1);
      expect(test).to.be.a("SCInteger").that.equals(1);

      test = utils.defaultValue$Integer($obj, 1);
      expect(test).to.equals($obj);
    });
    it("defaultValue$Float", function() {
      var $obj = {};
      test = utils.defaultValue$Float(undefined, 1.0);
      expect(test).to.be.a("SCFloat").that.equals(1.0);

      test = utils.defaultValue$Float($obj, 1.0);
      expect(test).to.equals($obj);
    });
    it("defaultValue$Symbol", function() {
      var $obj = {};
      test = utils.defaultValue$Symbol(undefined, "symbol");
      expect(test).to.be.a("SCSymbol").that.equals("symbol");

      test = utils.defaultValue$Symbol($obj, "symbol");
      expect(test).to.equals($obj);
    });
    it("getMethod", function() {
      var test = utils.getMethod("Object", "class");
      expect(test).to.be.a("JSFunction");
    });
  });

})();

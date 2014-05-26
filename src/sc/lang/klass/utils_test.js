(function() {
  "use strict";

  require("./utils");

  var $     = sc.lang.$;
  var utils = sc.lang.klass.utils;

  describe("sc.lang.klass.utils", function() {
    var test;
    it("BOOL", function() {
      expect(utils.BOOL($.True() )).to.be.a("JSBoolean").that.is.true;
      expect(utils.BOOL($.False())).to.be.a("JSBoolean").that.is.false;
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
    it("getMethod", function() {
      var test = utils.getMethod("Object", "class");
      expect(test).to.be.a("JSFunction");
    });
  });

})();

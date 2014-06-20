(function() {
  "use strict";

  require("./utils");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var utils = sc.lang.klass.utils;

  describe("sc.lang.klass.utils", function() {
    var test;
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
    it("$int0", function() {
      test = utils.$int0;
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("$int1", function() {
      test = utils.$int1;
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
    it("alwaysReturn$int0", function() {
      test = utils.alwaysReturn$int0();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("alwaysReturn$int1", function() {
      test = utils.alwaysReturn$int1();
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("subclassResponsibility", function() {
      var instance = $("Object").new();
      instance.method = utils.subclassResponsibility("method");
      expect(function() {
        instance.method();
      }).to.throw("'method' should have been implemented by this subclass");
    });
    it("doesNotUnderstand", function() {
      var instance = $("Object").new();
      instance.method = utils.doesNotUnderstand("method");
      expect(function() {
        instance.method();
      }).to.throw("'method' not understood");
    });
    it("shouldNotImplement", function() {
      var instance = $("Object").new();
      instance.method = utils.shouldNotImplement("method");
      expect(function() {
        instance.method();
      }).to.throw("'method' not valid for this subclass");
    });
    it("notYetImplemented", function() {
      var instance = $("Object").new();
      instance.method = utils.notYetImplemented("method");
      expect(function() {
        instance.method();
      }).to.throw("'method' is not yet implemented");
    });
    it("notSupported", function() {
      var instance = $("Object").new();
      instance.method = utils.notSupported("method");
      expect(function() {
        instance.method();
      }).to.throw("'method' is not supported");
    });
    it("newCopyArgs", function() {
      var instance = utils.newCopyArgs($("Object"), {
        a: $.Integer(100), b: undefined
      });
      expect(instance).to.be.a("SCObject");
      expect(instance._$a).to.be.a("SCInteger").that.equals(100);
      expect(instance._$b).to.be.a("SCNil");
    });
    it("setPropety <>", function() {
      var test, obj = {};

      utils.setProperty(obj, "<>", "value");

      test = obj.value();
      expect(test).to.be.a("SCNil");

      test = obj.value_($$(100));
      expect(test).to.be.equal(obj);

      test = obj.value();
      expect(test).to.be.a("SCInteger").that.equals(100);

      test = obj.value_().value();
      expect(test).to.be.a("SCNil");
    });
    it("setProperty <", function() {
      var obj = { _$value: $$(100) };

      utils.setProperty(obj, "<", "value");
      expect(obj.value()).to.be.a("SCInteger").that.equals(100);
      expect(obj.value_ ).to.be.undefined;
    });
    it("setProperty >", function() {
      var obj = { _$value: $$(100) };

      utils.setProperty(obj, ">", "value");

      obj.value_($$(200));

      expect(obj.value  ).to.be.undefined;
      expect(obj._$value).to.be.a("SCInteger").that.equals(200);
    });
  });
})();

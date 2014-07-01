(function() {
  "use strict";

  require("./builder");

  var $$ = sc.test.object;

  var Builder = sc.lang.klass.Builder;

  describe("sc.lang.klass.builder", function() {
    var MetaClass, TestClass;
    beforeEach(function() {
      MetaClass = function MetaClass() {};
      TestClass = function TestClass() {};
      TestClass.prototype.__className = "TestClass";
      TestClass.metaClass  = MetaClass;
      MetaClass.__MetaSpec = MetaClass;
    });
    it("init", function() {
      new Builder(TestClass).init({
        constructor: null,
        __value: 12345
      });
      expect(TestClass.prototype.__value).to.equal(12345);
      expect(TestClass.prototype.constructor).to.not.equal.null;
    });
    it("addMethod", function() {
      new Builder(TestClass).init().addMethod("method", function() {
        return 12345;
      });
      var instance = new TestClass();
      expect(instance).to.respondTo("method");
      expect(instance.method()).to.equal(12345);
    });
    describe("addMethod usual returns", function() {
      it("DoNothing", function() {
        new Builder(TestClass).init().addMethod("method");
        var instance = new TestClass();
        expect(instance).to.respondTo("method");
        expect(instance.method()).to.equal(instance);
      });
      it("TRUE", function() {
        new Builder(TestClass).init().addMethod("method", sc.TRUE);
        var instance = new TestClass();
        expect(instance).to.respondTo("method");
        expect(instance.method()).to.be.a("SCBoolean").that.is.true;
      });
      it("FALSE", function() {
        new Builder(TestClass).init().addMethod("method", sc.FALSE);
        var instance = new TestClass();
        expect(instance).to.respondTo("method");
        expect(instance.method()).to.be.a("SCBoolean").that.is.false;
      });
    });
    it("addClassMethod", function() {
      new Builder(TestClass).init().addClassMethod("method", function() {
        return 12345;
      });
      var instance = new MetaClass();
      expect(instance).to.respondTo("method");
      expect(instance.method()).to.equal(12345);
    });
    it("throwErrorIfAlreadyExists instance method", function() {
      var builder = new Builder(TestClass).addMethod("method");
      builder.addClassMethod("method");
      expect(function() {
        builder.addMethod("method");
      }).to.throw("TestClass#method is already defined");
    });
    it("throwErrorIfAlreadyExists class method", function() {
      var builder = new Builder(TestClass).addClassMethod("method");
      builder.addMethod("method");
      expect(function() {
        builder.addClassMethod("method");
      }).to.throw("TestClass.method is already defined");
    });
    it("addProperty <>", function() {
      new Builder(TestClass).init().addProperty("<>", "value");
      var instance = new TestClass();
      expect(instance).to.respondTo("value");
      expect(instance).to.respondTo("value_");
    });
    it("addProperty <", function() {
      new Builder(TestClass).init().addProperty("<", "value");
      var instance = new TestClass();
      expect(instance).to.respondTo("value");
      expect(instance).to.not.respondTo("value_");
    });
    it("addProperty >", function() {
      new Builder(TestClass).init().addProperty(">", "value");
      var instance = new TestClass();
      expect(instance).to.not.respondTo("value");
      expect(instance).to.respondTo("value_");
    });
    describe("property", function() {
      var instance;
      beforeEach(function() {
        new Builder(TestClass).init().addProperty("<>", "value");
        instance = new TestClass();
      });
      it("default value is nil", function() {
        var value = instance.value();
        expect(value).to.be.a("SCNil");
      });
      it("set a value and get this", function() {
        var value = instance.value_($$(1)).value();
        expect(value).to.be.a("SCInteger").that.equals(1);
      });
      it("set the nil when called without arguments", function() {
        var value = instance.value_().value();
        expect(value).to.be.a("SCNil");
      });
    });
    it("subclassResponsibility", function() {
      new Builder(TestClass).init().subclassResponsibility("method");
      var instance = new TestClass();
      expect(function() {
        instance.method();
      }).to.throw("'method' should have been implemented by this subclass");
    });
    it("doesNotUnderstand", function() {
      new Builder(TestClass).init().doesNotUnderstand("method");
      var instance = new TestClass();
      expect(function() {
        instance.method();
      }).to.throw("'method' not understood");
    });
    it("shouldNotImplement", function() {
      new Builder(TestClass).init().shouldNotImplement("method");
      var instance = new TestClass();
      expect(function() {
        instance.method();
      }).to.throw("TestClass: 'method' not valid for this subclass");
    });
    it("notYetImplemented", function() {
      new Builder(TestClass).init().notYetImplemented("method");
      var instance = new TestClass();
      expect(function() {
        instance.method();
      }).to.throw("TestClass: 'method' is not yet implemented");
    });
    it("notSupported", function() {
      new Builder(TestClass).init().notSupported("method");
      var instance = new TestClass();
      expect(function() {
        instance.method();
      }).to.throw("TestClass: 'method' is not supported");
    });
  });
})();

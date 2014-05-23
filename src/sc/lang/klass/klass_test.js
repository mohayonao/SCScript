(function() {
  "use strict";

  require("./klass");

  var $SC = sc.lang.$SC;

  describe("sc.lang.klass", function() {
    var test;
    it("define", function() {
      expect(function() {
        sc.lang.klass.define("lowercase");
      }).to.throw("classname should be CamelCase");
      expect(function() {
        sc.lang.klass.define("Object");
      }).to.throw("already registered");
      expect(function() {
        sc.lang.klass.define("NewClass : UndefinedClass");
      }).to.throw("superclass 'UndefinedClass' is not registered");
      expect(function() {
        sc.lang.klass.define("NewClass");
      }).to.throw("class should have a constructor");
    });
    it("refine", function() {
      expect(function() {
        sc.lang.klass.refine("UndefinedClass");
      }).to.throw("class 'UndefinedClass' is not registered");
      expect(function() {
        sc.lang.klass.refine("Object", {
          $new: function() {}
        });
      }).to.throw("Object.new is already defined");
      expect(function() {
        sc.lang.klass.refine("Object", {
          valueOf: function() {}
        });
      }).to.throw("Object#valueOf is already defined");
    });
    it("get", function() {
      expect(function() {
        sc.lang.klass.get("UndefinedClass");
      }).to.throw("class 'UndefinedClass' is not registered");
    });
    it("exists", function() {
      test = sc.lang.klass.exists("Object");
      expect(test).to.be.a("JSBoolean").that.is.true;

      test = sc.lang.klass.exists("UndefinedClass");
      expect(test).to.be.a("JSBoolean").that.is.false;
    });
  });

  describe("SCObject", function() {
    var SCObject, SCNil, instance, $nil, test;
    before(function() {
      SCObject = $SC("Object");
      SCNil = $SC("Nil");
      $nil = $SC.Nil();
    });
    beforeEach(function() {
      instance = SCObject.new();
    });
    it("#class", function() {
      test = $nil.class();
      expect(test).to.equal(SCNil);

      test = instance.class();
      expect(test).to.equal(SCObject);
    });
    it("#valueOf", function() {
      test = $nil.valueOf();
      expect(test).to.be.a("JSNull");

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it("#toString", function() {
      test = $nil.toString();
      expect(test).to.be.a("JSString").that.equals("nil");

      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("an Object");
    });
    it("#valueOf", function() {
      test = $nil.valueOf();
      expect(test).to.be.a("JSNull");

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it("#_newCopyArgs", function() {
      var instance = SCObject._newCopyArgs({
        a: $SC.Integer(100), b: undefined
      });
      expect(instance._$a).to.be.a("SCInteger").that.equals(100);
      expect(instance._$b).to.be.a("SCNil");
    });
  });

  describe("SCClass", function() {
    var SCObject, SCClass;
    before(function() {
      SCObject = $SC("Object");
      SCClass = $SC("Class");
    });
    it(".new", function() {
      var test = SCClass.new();
      expect(test).to.be.a("SCNil");
    });
    it("#toString", function() {
      var test = SCClass.toString();
      expect(test).to.be.a("JSString").that.equals("Class");
    });
  });

  describe("__super__", function() {
    var SCTestClass1, SCTestClass2;
    before(function() {
      sc.lang.klass.define("TestClass1", {
        constructor: function() {
          this.__super__("Object");
          this._testClass1 = true;
        },
        $method: function() {
          this._testClass1ClassMethodCalled = true;
          return this;
        },
        method: function() {
          this._testClass1InstanceMethodCalled = true;
          return this;
        }
      });
      sc.lang.klass.define("TestClass2 : TestClass1", {
        constructor: function() {
          this.__super__("TestClass1");
          this._testClass2 = true;
        },
        $method: function() {
          this.__super__("method");
          this._testClass2ClassMethodCalled = true;
          return this;
        },
        method: function() {
          this.__super__("method");
          this._testClass2InstanceMethodCalled = true;
          return this;
        },
        notFound: function() {
          this.__super__("notFound");
          return this;
        }
      });
      SCTestClass1 = $SC("TestClass1");
      SCTestClass2 = $SC("TestClass2");
    });
    it("should call super constructor", function() {
      var instance = SCTestClass2.new();
      expect(instance._testClass1).to.be.true;
      expect(instance._testClass2).to.be.true;
    });
    it("should call superclass method", function() {
      var instance = SCTestClass2.new();
      instance.method();
      expect(instance._testClass1InstanceMethodCalled).to.be.true;
      expect(instance._testClass2InstanceMethodCalled).to.be.true;
    });
    it("should call superclass class method", function() {
      SCTestClass2.method();
      expect(SCTestClass2._testClass1ClassMethodCalled).to.be.true;
      expect(SCTestClass2._testClass2ClassMethodCalled).to.be.true;
    });
    it("should throw error if not found method", function() {
      var instance = SCTestClass2.new();
      expect(function() {
        instance.notFound();
      }).to.throw("not found");
    });
  });

})();

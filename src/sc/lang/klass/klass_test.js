(function() {
  "use strict";

  require("./klass");

  var $ = sc.lang.$;
  var klass = sc.lang.klass;

  describe("sc.lang.klass", function() {
    var test;
    it("define", function() {
      expect(function() {
        klass.define("lowercase");
      }).to.throw("classname should be CamelCase");
      expect(function() {
        klass.define("Object");
      }).to.throw("already registered");
      expect(function() {
        klass.define("NewClass : UndefinedClass");
      }).to.throw("superclass 'UndefinedClass' is not registered");
      expect(function() {
        klass.define("NewClass");
      }).to.throw("class should have a constructor");
    });
    it("refine", function() {
      expect(function() {
        klass.refine("UndefinedClass");
      }).to.throw("class 'UndefinedClass' is not registered");
      expect(function() {
        klass.refine("Object", {
          $new: function() {}
        });
      }).to.throw("Object.new is already defined");
      expect(function() {
        klass.refine("Object", {
          valueOf: function() {}
        });
      }).to.throw("Object#valueOf is already defined");
    });
    it("get", function() {
      expect(function() {
        klass.get("UndefinedClass");
      }).to.throw("Class not defined: UndefinedClass");
    });
    it("exists", function() {
      test = klass.exists("Object");
      expect(test).to.be.a("JSBoolean").that.is.true;

      test = klass.exists("UndefinedClass");
      expect(test).to.be.a("JSBoolean").that.is.false;
    });
  });

  describe("SCObject", function() {
    var SCObject, SCNil, instance, $nil, test;
    before(function() {
      SCObject = $("Object");
      SCNil = $("Nil");
      $nil = $.Nil();
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
        a: $.Integer(100), b: undefined
      });
      expect(instance._$a).to.be.a("SCInteger").that.equals(100);
      expect(instance._$b).to.be.a("SCNil");
    });
    describe("#$", function() {
      it("call with no-arguments", sinon.test(function() {
        var instance = SCObject.new();
        instance.neg = function() {};
        this.spy(instance, "neg");

        instance.$("neg");
        expect(instance.neg).to.be.called;
      }));
      it("call with arguments", sinon.test(function() {
        var instance = SCObject.new();
        instance.neg = function() {};
        this.spy(instance, "neg");

        instance.$("neg", [ 1, 2 ]);
        expect(instance.neg).to.be.calledWith(1, 2);
      }));
      it("call undefined method", function() {
        var instance = SCObject.new();
        expect(function() {
          instance.$("undefined-method");
        }).to.throw("not understood");
      });
    });
  });

  describe("SCClass", function() {
    var SCObject, SCClass;
    before(function() {
      SCObject = $("Object");
      SCClass = $("Class");
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
      klass.define("TestClass1", {
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
      klass.define("TestClass2 : TestClass1", {
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
      SCTestClass1 = $("TestClass1");
      SCTestClass2 = $("TestClass2");
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

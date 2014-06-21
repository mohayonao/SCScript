(function() {
  "use strict";

  require("./klass");

  var $ = sc.lang.$;
  var klass = sc.lang.klass;

  describe("sc.lang.klass", function() {
    describe("define", function() {
      it("create class", function() {
        var test = klass.define("TestClass");
        expect(test).to.be.a("JSFunction");
      });
      it("throw error if name of the class is not CamelCase", function() {
        expect(function() {
          klass.define("lowercase");
        }).to.throw("classname should be CamelCase");
      });
      it("throw error if the class have been defined already", function() {
        expect(function() {
          klass.define("Object");
        }).to.throw("already defined");
      });
      it("throw error if SuperClass is not exists", function() {
        expect(function() {
          klass.define("NewClass : UndefinedClass");
        }).to.throw("superclass 'UndefinedClass' is not defined");
      });
    });
    describe("refine", function() {
      it("throw error if the class is not defined", function() {
        expect(function() {
          klass.refine("UndefinedClass");
        }).to.throw("class 'UndefinedClass' is not defined");
      });
      it("throw error if try to redefine the method defined already", function() {
        expect(function() {
          klass.refine("Object", {
            valueOf: function() {}
          });
        }).to.throw("Object#valueOf is already defined");
      });
    });
    describe("get", function() {
      it("throw error if try to get an undefined class", function() {
        expect(function() {
          klass.get("UndefinedClass");
        }).to.throw("Class not defined: UndefinedClass");
      });
    });
    describe("exists", function() {
      it("test whether or not the given class exists", function() {
        expect(klass.exists("Object")        , 0).to.be.a("JSBoolean").that.is.true;
        expect(klass.exists("UndefinedClass"), 1).to.be.a("JSBoolean").that.is.false;
      });
    });
  });

  describe("SCObject", function() {
    var SCObject, SCNil, instance, $nil;
    before(function() {
      SCObject = $("Object");
      SCNil = $("Nil");
      $nil = $.Nil();
    });
    beforeEach(function() {
      instance = SCObject.new();
    });
    it("#class", function() {
      var test;

      test = $nil.class();
      expect(test).to.equal(SCNil);

      test = instance.class();
      expect(test).to.equal(SCObject);
    });
    it("#valueOf", function() {
      var test;

      test = $nil.valueOf();
      expect(test).to.be.a("JSNull");

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it("#toString", function() {
      var test;

      test = $nil.toString();
      expect(test).to.be.a("JSString").that.equals("nil");

      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("an Object");
    });
    it("#toJSON", function() {
      var test, json;

      test = $nil.toJSON();
      expect(test).to.be.a("JSString");

      json = JSON.parse(test);
      expect(json.class).to.equal("Nil");
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

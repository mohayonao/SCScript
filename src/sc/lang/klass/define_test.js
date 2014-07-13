describe("sc.lang.klass.define", function() {
  "use strict";

  var $ = sc.lang.$;

  describe("define", function() {
    it("create class", function() {
      var test = sc.lang.klass.define("TestClass");
      expect(test).to.be.a("JSFunction");
    });

    it("throw error if name of the class is not CamelCase", function() {
      expect(function() {
        sc.lang.klass.define("lowercase");
      }).to.throw("classname should be CamelCase");
    });

    it("throw error if the class have been defined already", function() {
      expect(function() {
        sc.lang.klass.define("Object");
      }).to.throw("already defined");
    });

    it("throw error if SuperClass is not exists", function() {
      expect(function() {
        sc.lang.klass.define("NewClass : UndefinedClass");
      }).to.throw("superclass 'UndefinedClass' is not defined");
    });
  });

  describe("refine", function() {
    it("throw error if the class is not defined", function() {
      expect(function() {
        sc.lang.klass.refine("UndefinedClass");
      }).to.throw("class 'UndefinedClass' is not defined");
    });

    it("throw error if try to redefine the method defined already", function() {
      expect(function() {
        sc.lang.klass.refine("Object", function(builder) {
          builder.addMethod("valueOf", function() {});
        });
      }).to.throw("Object#valueOf is already defined");
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
  });

  describe("__super__", function() {
    var SCTestClass1, SCTestClass2;
    before(function() {
      sc.lang.klass.define("TestClass1", function(builder) {
        builder.addMethod("__init__", function() {
          this.__super__("__init__");
          this._testClass1 = true;
        });
        builder.addClassMethod("method", function() {
          this._testClass1ClassMethodCalled = true;
          return this;
        });
        builder.addMethod("method", function() {
          this._testClass1InstanceMethodCalled = true;
          return this;
        });
      });
      sc.lang.klass.define("TestClass2 : TestClass1", function(builder) {
        builder.addMethod("__init__", function() {
          this.__super__("__init__");
          this._testClass2 = true;
        });
        builder.addClassMethod("method", function() {
          this.__super__("method");
          this._testClass2ClassMethodCalled = true;
          return this;
        });
        builder.addMethod("method", function() {
          this.__super__("method");
          this._testClass2InstanceMethodCalled = true;
          return this;
        });
        builder.addMethod("notFound", function() {
          this.__super__("notFound");
          return this;
        });
      });
      SCTestClass1 = $("TestClass1");
      SCTestClass2 = $("TestClass2");
    });

    it("should call super constructor", function() {
      var instance = SCTestClass2.new();
      expect(instance._testClass1, 1).to.be.true;
      expect(instance._testClass2, 2).to.be.true;
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

});

(function() {
  "use strict";

  require("./klass");

  var $SC = sc.lang.$SC;

  describe("sc.lang.klass", function() {
    var test;
    it("define", function() {
      expect(function() {
        sc.lang.klass.define("CONSTRUCTOR");
      }).to.throw("first argument must be a constructor");
      expect(function() {
        sc.lang.klass.define(function() {}, 0);
      }).to.throw("second argument must be a string");
      expect(function() {
        sc.lang.klass.define(function() {}, "lowercase");
      }).to.throw("classname should be CamelCase");
      expect(function() {
        sc.lang.klass.define(function() {}, "Object");
      }).to.throw("already registered");
      expect(function() {
        sc.lang.klass.define(function() {}, "NewClass : UndefinedClass");
      }).to.throw("superclass 'UndefinedClass' is not registered");
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
})();

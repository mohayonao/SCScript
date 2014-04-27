(function() {
  "use strict";

  require("./klass");

  var $SC = sc.lang.$SC;
  var utils = sc.lang.klass.utils;

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
      SCObject = $SC.Class("Object");
      SCNil = $SC.Class("Nil");
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
    it("#isClass", function() {
      test = $nil.isClass();
      expect(test).to.be.a("SCBoolean").that.is.false;

      test = instance.isClass();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#isKindOf", function() {
      test = $nil.isKindOf(SCObject);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = $nil.isKindOf(SCNil);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = instance.isKindOf(SCObject);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = instance.isKindOf(SCNil);
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#isMemberOf", function() {
      test = $nil.isMemberOf(SCObject);
      expect(test).to.be.a("SCBoolean").that.is.false;

      test = $nil.isMemberOf(SCNil);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = instance.isMemberOf(SCObject);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = instance.isMemberOf(SCNil);
      expect(test).to.be.a("SCBoolean").that.is.false;
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
    var SCObject, SCNil, SCClass, SCMeta_Object, SCMeta_Nil, SCMeta_Class, test;
    before(function() {
      SCObject = $SC.Class("Object");
      SCNil = $SC.Class("Nil");
      SCClass = $SC.Class("Class");
      SCMeta_Object = $SC.Class("Meta_Object");
      SCMeta_Nil = $SC.Class("Meta_Nil");
      SCMeta_Class = $SC.Class("Meta_Class");
    });
    it(".new", function() {
      test = SCClass.new();
      expect(test).to.be.a("SCNil");
    });
    it("#name", function() {
      test = SCClass.name();
      expect(test).to.be.a("SCString").that.equals("Class");
    });
    it("#class", function() {
      test = SCClass.class();
      expect(test).to.equal(SCMeta_Class);

      test = SCMeta_Class.class();
      expect(test).to.equal(SCClass);

      test = SCNil.class();
      expect(test).to.equal(SCMeta_Nil);

      test = SCMeta_Nil.class();
      expect(test).to.equal(SCClass);

      test = SCObject.class();
      expect(test).to.equal(SCMeta_Object);
    });
    it("#isClass", function() {
      test = SCClass.isClass();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#toString", function() {
      test = SCClass.toString();
      expect(test).to.be.a("JSString").that.equals("Class");
    });
  });

  describe("sc.lang.klass.utils", function() {
    var test;
    it("nilInstance", function() {
      test = utils.nilInstance;
      expect(test).to.be.a("SCNil");
    });
    it("trueInstance", function() {
      test = utils.trueInstance;
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("falseInstance", function() {
      test = utils.falseInstance;
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("int0Instance", function() {
      test = utils.int0Instance;
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("int1Instance", function() {
      test = utils.int1Instance;
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("nop", function() {
      var that = {};
      test = utils.nop.call(that);
      expect(test).to.equal(that);
    });
    it("alwaysReturn$Nil", function() {
      test = utils.alwaysReturn$Nil();
      expect(test).to.be.a("SCNil");
    });
    it("alwaysReturn$True", function() {
      test = utils.alwaysReturn$True();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("alwaysReturn$False", function() {
      test = utils.alwaysReturn$False();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("alwaysReturn$Integer_0", function() {
      test = utils.alwaysReturn$Integer_0();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("alwaysReturn$Integer_1", function() {
      test = utils.alwaysReturn$Integer_1();
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
    it("bool", function() {
      expect(utils.bool($SC.True() )).to.be.a("JSBoolean").that.is.true;
      expect(utils.bool($SC.False())).to.be.a("JSBoolean").that.is.false;
    });
    it("getMethod", function() {
      var test = utils.getMethod("Object", "class");
      expect(test).to.be.a("JSFunction");
    });
  });

  describe("$SC", function() {
    it("Nil should return an instance of SCNil", function() {
      var a, b;
      a = $SC.Nil();
      expect(a).to.be.a("SCNil");

      b = $SC.Nil();
      expect(a).to.equal(b);
    });
    it("Symbol should return an instance of SCSymbol", function() {
      var a, b, c;
      a = $SC.Symbol("a");
      expect(a).to.be.a("SCSymbol").that.equal("a");

      b = $SC.Symbol("b");
      expect(a).to.not.equal(b);

      c = $SC.Symbol("b");
      expect(b).to.equal(c);
    });
    it("True should return an instance of SCTrue", function() {
      var a, b;
      a = $SC.True();
      expect(a).to.be.a("SCBoolean").that.is.true;

      b = $SC.True();
      expect(a).to.equal(b);
    });
    it("False should return an instance of SCFalse", function() {
      var a, b;
      a = $SC.False();
      expect(a).to.be.a("SCBoolean").that.is.false;

      b = $SC.False();
      expect(a).to.equal(b);
    });
    it("Boolean should return an instance of SCBoolean", function() {
      var a;
      a = $SC.Boolean(true);
      expect(a).to.be.a("SCBoolean").that.is.true;

      a = $SC.Boolean(false);
      expect(a).to.be.a("SCBoolean").that.is.false;
    });
    it("Char should return an instance of SCChar", function() {
      var a, b, c;
      a = $SC.Char("a");
      expect(a).to.be.a("SCChar").that.equal("a");

      b = $SC.Char("b");
      expect(a).to.not.equal(b);

      c = $SC.Char("b");
      expect(b).to.equal(c);
    });
    it("Integer should return an instance of SCInteger", function() {
      var a, b, c, d;
      a = $SC.Integer(0);
      expect(a).to.be.a("SCInteger").that.equal(0);

      b = $SC.Integer(1);
      expect(a).to.not.equal(b);

      c = $SC.Integer(1);
      expect(b).to.equal(c);

      d = $SC.Integer(Infinity);
      expect(d).to.be.a("SCFloat").that.equal(Infinity);
    });
    it("Float should return an instance of SCFloat", function() {
      var a, b, c;
      a = $SC.Float(0.0);
      expect(a).to.be.a("SCFloat").that.equal(0.0);

      b = $SC.Float(1.0);
      expect(a).to.not.equal(b);

      c = $SC.Float(1.0);
      expect(b).to.equal(c);
    });
    it("Array should return an instance of SCArray", function() {
      var a, b;
      a = $SC.Array();
      expect(a).to.be.a("SCArray").that.eql([]);

      b = $SC.Array();
      expect(a).to.not.equal(b);
    });
    it("String should return an instance of SCString", function() {
      var a, b;
      a = $SC.String("");
      expect(a).to.be.a("SCString").that.eql("");

      b = $SC.String("");
      expect(a).to.not.equal(b);
    });
    it("Function should return an instance of SCFunction", function() {
      var a;
      a = $SC.Function(function() {});
      expect(a).to.be.a("SCFunction");
    });
  });
})();

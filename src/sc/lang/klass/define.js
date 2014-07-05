(function(sc) {
  "use strict";

  require("./klass");
  require("./builder");
  require("../dollar");

  var $ = sc.lang.$;
  var strlib = sc.libs.strlib;
  var metaClasses = {};
  var classes     = sc.lang.klass.classes;
  var hash = 0x100000;

  function createClassInstance(MetaSpec) {
    var instance = new SCClass();
    instance.__MetaSpec = MetaSpec;
    return instance;
  }

  function extend(constructor, superMetaClass) {
    function F() {}
    F.prototype = superMetaClass.__Spec.prototype;
    constructor.prototype = new F();

    function MetaF() {}
    MetaF.prototype = superMetaClass.__MetaSpec.prototype;

    function MetaSpec() {}
    MetaSpec.prototype = new MetaF();
    MetaSpec.__superClass = superMetaClass.__MetaSpec;

    constructor.metaClass = createClassInstance(MetaSpec);
    constructor.__superClass = superMetaClass.__Spec;
  }

  function throwIfInvalidClassName(className, superClassName) {
    if (!strlib.isClassName(className)) {
      throw new Error(strlib.format(
        "sc.lang.klass.define: classname should be CamelCase, but got '#{0}'", className
      ));
    }

    if (metaClasses.hasOwnProperty(className)) {
      throw new Error(strlib.format(
        "sc.lang.klass.define: class '#{0}' is already defined.", className
      ));
    }

    if (className !== "Object") {
      if (!metaClasses.hasOwnProperty(superClassName)) {
        throw new Error(strlib.format(
          "sc.lang.klass.define: superclass '#{0}' is not defined.", superClassName
        ));
      }
    }
  }

  function registerMetaClass(className, metaClass, constructor) {
    metaClass.__className  = "Meta_" + className;
    metaClass.__Spec = constructor;
    metaClass.__isMetaClass = true;
    metaClasses[className] = classes["Meta_" + className] = metaClass;
  }

  function registerClass(className, metaClass, constructor) {
    var newClass = new metaClass.__MetaSpec();
    newClass.__className = className;
    newClass.__Spec = constructor;
    newClass.__superClass = metaClass.__MetaSpec.__superClass;
    Object.defineProperties(constructor.prototype, {
      __class: { value: newClass, writable: true },
      __Spec: { value: constructor, writable: true },
      __className: { value: className, writable: true }
    });
    classes[className] = newClass;
  }

  function buildClass(constructor, spec) {
    if (typeof spec !== "function") {
      return new sc.lang.klass.Builder(constructor).init(spec);
    }
    spec(new sc.lang.klass.Builder(constructor), sc.lang.klass.utils);
  }

  function __super__(that, root, funcName, args) {
    var func, result;

    that.__superClassP = that.__superClassP || root;

    while (!func && that.__superClassP) {
      func = that.__superClassP.prototype[funcName];
      that.__superClassP = that.__superClassP.__superClass;
    }

    if (func) {
      result = func.apply(that, args);
    } else {
      throw new Error(strlib.format("supermethod '#{0}' not found", funcName));
    }

    that.__superClassP = null;

    return result || /* istanbul ignore next */ $.Nil();
  }

  var define = sc.lang.klass.define = function(className, spec) {
    var items = className.split(":");
    var superClassName = (items[1] || "Object").trim();

    className = items[0].trim();
    throwIfInvalidClassName(className, superClassName);

    var constructor = spec && spec.hasOwnProperty("constructor") ?
      spec.constructor : function() {
        this.__super__(superClassName);
      };

    if (className !== "Object") {
      extend(constructor, metaClasses[superClassName]);
    }

    var metaClass = constructor.metaClass;
    registerMetaClass(className, metaClass, constructor);
    registerClass    (className, metaClass, constructor);

    buildClass(constructor, spec);

    return constructor;
  };

  var refine = sc.lang.klass.refine = function(className, spec) {
    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(strlib.format(
        "sc.lang.klass.refine: class '#{0}' is not defined.", className
      ));
    }
    var constructor = metaClasses[className].__Spec;
    buildClass(constructor, spec);
  };

  // basic classes
  function SCObject() {
    this._ = this;
    Object.defineProperties(this, {
      __immutable: { value: false, writable: true },
      __hash: { value: hash++ }
    });
    if (this.__init__) {
      this.__init__();
    }
  }

  function SCClass() {
    SCObject.call(this);
    this.__isMetaClass = false;
  }

  SCObject.metaClass = createClassInstance(function() {});

  define("Object", {
    constructor: SCObject,
    __tag: sc.TAG_OBJ,
    __init__: function() {},
    __super__: function(funcName, args) {
      if (strlib.isClassName(funcName)) {
        return metaClasses[funcName].__Spec.call(this);
      }
      return __super__(this, this.__Spec.__superClass, funcName, args);
    }
  });

  define("Class", {
    constructor: SCClass,
    __super__: function(funcName, args) {
      return __super__(this, this.__superClass, funcName, args);
    }
  });

  classes.Class = createClassInstance();
  classes.Class.__Spec = SCClass;

  SCObject.metaClass.__MetaSpec.prototype = classes.Class;

  registerClass("Object", SCObject.metaClass, classes.Object.__Spec);

  refine("Object", function(builder) {
    builder.addClassMethod("new", function() {
      if (this.__Spec === SCClass) {
        return $.Nil();
      }
      return new this.__Spec();
    });

    builder.addMethod("$", function(methodName, args) {
      if (this[methodName]) {
        return this[methodName].apply(this, args);
      }
      return this.__attr__(methodName, args);
    });

    builder.addMethod("__attr__", function(methodName) {
      throw new Error(strlib.format(
        "RECEIVER #{0}: Message '#{1}' is not understood.", this.__str__(), methodName
      ));
    });
  });
})(sc);

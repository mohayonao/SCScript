(function(sc) {
  "use strict";

  require("../sc");
  require("../dollar");
  require("../../libs/strlib");

  var slice  = [].slice;
  var $      = sc.lang.$;
  var strlib = sc.libs.strlib;

  var klass       = {};
  var metaClasses = {};
  var classes     = klass.classes = {};
  var hash = 0x100000;

  var isClassName = function(name) {
    var ch = name.charCodeAt(0);
    return 0x41 <= ch && ch <= 0x5a;
  };

  var createClassInstance = function(MetaSpec) {
    var instance = new SCClass();
    instance.__MetaSpec = MetaSpec;
    return instance;
  };

  var extend = function(constructor, superMetaClass) {
    function F() {}
    F.prototype = superMetaClass.__Spec.prototype;
    constructor.prototype = new F();

    function Meta_F() {}
    Meta_F.prototype = superMetaClass.__MetaSpec.prototype;

    function MetaSpec() {}
    MetaSpec.prototype = new Meta_F();
    MetaSpec.__superClass = superMetaClass.__MetaSpec;

    constructor.metaClass = createClassInstance(MetaSpec);
    constructor.__superClass = superMetaClass.__Spec;
  };

  var def = function(className, constructor, spec, opts) {
    var classMethods, instanceMethods, setMethod;

    classMethods    = constructor.metaClass.__MetaSpec.prototype;
    instanceMethods = constructor.prototype;

    setMethod = function(methods, methodName, func) {
      var bond;
      if (methods.hasOwnProperty(methodName) && !opts.force) {
        bond = methods === classMethods ? "." : "#";
        throw new Error(
          "sc.lang.klass.refine: " +
            className + bond + methodName + " is already defined."
        );
      }
      Object.defineProperty(methods, methodName, {
        value: func, writable: true
      });
    };

    Object.keys(spec).forEach(function(methodName) {
      if (methodName !== "constructor") {
        if (methodName !== "$" && methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
          setMethod(classMethods, methodName.substr(1), spec[methodName]);
        } else {
          setMethod(instanceMethods, methodName, spec[methodName]);
        }
      }
    });
  };

  var throwIfInvalidClassName = function(className, superClassName) {
    if (!isClassName(className)) { // faster test than !/^[A-Z]/.test(className)
      throw new Error(
        "sc.lang.klass.define: " +
          "classname should be CamelCase, but got '" + className + "'"
      );
    }

    if (metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.define: " +
          "class '" + className + "' is already registered."
      );
    }

    if (className !== "Object") {
      if (!metaClasses.hasOwnProperty(superClassName)) {
        throw new Error(
          "sc.lang.klass.define: " +
            "superclass '" + superClassName + "' is not registered."
        );
      }
    }
  };

  var registerClass = function(MetaClass, className, constructor) {
    var newClass;

    newClass = new MetaClass.__MetaSpec();
    newClass._name = className;
    newClass.__Spec = constructor;
    newClass.__superClass = MetaClass.__MetaSpec.__superClass;
    Object.defineProperties(constructor.prototype, {
      __class: { value: newClass, writable: true },
      __Spec : { value: constructor, writable: true },
      __className: { value: className }
    });
    classes[className] = newClass;

    return newClass;
  };

  var buildClass = function(className, constructor) {
    var newClass, metaClass;

    metaClass = constructor.metaClass;
    newClass  = registerClass(metaClass, className, constructor);

    metaClass.__Spec = constructor;
    metaClass._isMetaClass = true;
    metaClass._name = "Meta_" + className;
    classes["Meta_" + className] = metaClass;

    if (newClass.initClass) {
      newClass.initClass();
    }

    metaClasses[className] = metaClass;
  };

  var evalSpec = function(spec) {
    var result;
    if (typeof spec === "function") {
      result = {};
      spec(result, klass.utils);
      return result;
    }
    return spec || /* istanbul ignore next */ {};
  };

  var __super__ = function(that, root, funcName, args) {
    var func, result;

    that.__superClassP = that.__superClassP || root;

    while (!func && that.__superClassP) {
      func = that.__superClassP.prototype[funcName];
      that.__superClassP = that.__superClassP.__superClass;
    }

    if (func) {
      result = func.apply(that, args || []);
    } else {
      throw new Error("supermethod '" + funcName + "' not found");
    }

    delete that.__superClassP;

    return result || /* istanbul ignore next */ $.Nil();
  };

  klass.define = function(className, spec) {
    var items, superClassName, constructor;

    items = className.split(":");
    className      = items[0].trim();
    superClassName = (items[1] || "Object").trim();

    throwIfInvalidClassName(className, superClassName);

    spec = evalSpec(spec);

    if (spec.hasOwnProperty("constructor")) {
      constructor = spec.constructor;
    } else {
      throw new Error(
        "sc.lang.klass.define: " +
          "class should have a constructor."
      );
    }

    if (className !== "Object") {
      extend(constructor, metaClasses[superClassName]);
    }

    def(className, constructor, spec, {});

    buildClass(className, constructor);

    return constructor;
  };

  klass.refine = function(className, spec, opts) {
    var constructor;

    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.refine: " +
          "class '" + className + "' is not registered."
      );
    }

    constructor = metaClasses[className].__Spec;

    spec = evalSpec(spec);
    def(className, constructor, spec, opts || {});
  };

  klass.get = function(name) {
    if (!classes[name]) {
      throw new Error(
        "sc.lang.klass.get: " +
          "class '" + name + "' is not registered."
      );
    }
    return classes[name];
  };

  klass.exists = function(name) {
    return !!classes[name];
  };

  // basic classes
  function SCObject() {
    this._ = this;
    Object.defineProperties(this, {
      __immutable: {
        value: false, writable: true
      },
      __hash: {
        value: hash++
      }
    });
  }

  function SCClass() {
    SCObject.call(this);
    this._name = "Class";
    this._isMetaClass = false;
  }

  SCObject.metaClass = createClassInstance(function() {});

  klass.define("Object", {
    constructor: SCObject,
    __tag: sc.TAG_OBJ,
    __super__: function(funcName, args) {
      if (isClassName(funcName)) {
        return metaClasses[funcName].__Spec.call(this);
      }

      return __super__(this, this.__Spec.__superClass, funcName, args);
    },
    toString: function() {
      var name = this.__class._name;
      return String(strlib.article(name) + " " + name);
    },
    valueOf: function() {
      return this._;
    }
  });

  klass.define("Class", {
    constructor: SCClass,
    __super__: function(funcName, args) {
      return __super__(this, this.__superClass, funcName, args);
    },
    toString: function() {
      return String(this._name);
    }
  });

  classes.Class = createClassInstance();
  classes.Class.__Spec = SCClass;

  SCObject.metaClass.__MetaSpec.prototype = classes.Class;

  registerClass(SCObject.metaClass, "Object", classes.Object.__Spec);

  klass.refine("Object", function(spec) {
    spec.$new = function() {
      if (this.__Spec === SCClass) {
        return $.Nil();
      }
      return new this.__Spec(slice.call(arguments));
    };
    spec.$_newCopyArgs = function(dict) {
      var instance;

      instance = new this.__Spec(slice.call(arguments));
      Object.keys(dict).forEach(function(key) {
        instance["_$" + key] = dict[key] || $.Nil();
      });

      return instance;
    };
    spec.$initClass = function() {
    };

    spec.$ = function(methodName, args) {
      if (this[methodName]) {
        if (args) {
          return this[methodName].apply(this, args);
        } else {
          return this[methodName]();
        }
      }
      return this._doesNotUnderstand(methodName, args);
    };

    spec._doesNotUnderstand = function(methodName) {
      throw new Error("RECEIVER " + this.__str__() + ": " +
                      "Message '" + methodName + "' not understood.");
    };
  });

  sc.lang.klass = klass;

})(sc);

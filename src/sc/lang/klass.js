(function(sc) {
  "use strict";

  require("./sc");
  require("./dollarSC");

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var klass       = {};
  var metaClasses = {};
  var classes     = klass.classes = {};

  var createClassInstance = function(MetaSpec) {
    var instance = new SCClass();
    instance._MetaSpec = MetaSpec;
    return instance;
  };

  var extend = function(constructor, superMetaClass) {
    function F() {}
    F.prototype = superMetaClass._Spec.prototype;
    constructor.prototype = new F();

    function Meta_F() {}
    Meta_F.prototype = superMetaClass._MetaSpec.prototype;

    function MetaSpec() {}
    MetaSpec.prototype = new Meta_F();

    constructor.metaClass = createClassInstance(MetaSpec);
  };

  var def = function(className, constructor, fn, opts) {
    var classMethods, instanceMethods, setMethod, spec;

    classMethods    = constructor.metaClass._MetaSpec.prototype;
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
      methods[methodName] = func;
    };

    if (typeof fn === "function") {
      fn(spec = {}, klass.utils);
    } else {
      spec = fn;
    }

    Object.keys(spec).forEach(function(methodName) {
      if (methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
        setMethod(classMethods, methodName.substr(1), spec[methodName]);
      } else {
        setMethod(instanceMethods, methodName, spec[methodName]);
      }
    });
  };

  var throwIfInvalidArgument = function(constructor, className) {
    if (typeof constructor !== "function") {
      throw new Error(
        "sc.lang.klass.define: " +
          "first argument must be a constructor, but got: " + typeof(constructor)
      );
    }

    if (typeof className !== "string") {
      throw new Error(
        "sc.lang.klass.define: " +
          "second argument must be a string, but got: " + String(className)
      );
    }
  };

  var throwIfInvalidClassName = function(className, superClassName) {
    var ch0 = className.charCodeAt(0);

    if (ch0 < 0x41 || 0x5a < ch0) { // faster test than !/^[A-Z]/.test(className)
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

  var buildClass = function(className, constructor) {
    var newClass, metaClass;

    metaClass = constructor.metaClass;

    newClass = new metaClass._MetaSpec();
    newClass._name = className;
    newClass._Spec = constructor;
    constructor.prototype.__class = newClass;
    constructor.prototype.__Spec  = constructor;

    metaClass._Spec = constructor;
    metaClass._isMetaClass = true;
    metaClass._name = "Meta_" + className;

    classes["Meta_" + className] = metaClass;
    classes[className] = newClass;

    if (newClass.initClass) {
      newClass.initClass();
    }

    metaClasses[className] = metaClass;
  };

  klass.define = function(constructor, className, fn) {
    var items, superClassName;

    throwIfInvalidArgument(constructor, className);

    items = className.split(":");
    className      = items[0].trim();
    superClassName = (items[1] || "Object").trim();

    throwIfInvalidClassName(className, superClassName);

    if (className !== "Object") {
      extend(constructor, metaClasses[superClassName]);
    }

    fn = fn || {};

    def(className, constructor, fn, {});

    buildClass(className, constructor);
  };

  klass.refine = function(className, fn, opts) {
    var constructor;

    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.refine: " +
          "class '" + className + "' is not registered."
      );
    }

    constructor = metaClasses[className]._Spec;

    def(className, constructor, fn, opts || {});
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
  }

  function SCClass() {
    this._ = this;
    this._name = "Class";
    this._Spec = null;
    this._isMetaClass = false;
  }

  SCObject.metaClass = createClassInstance(function() {});
  klass.define(SCObject, "Object", {
    __tag: sc.C.TAG_OBJ,
    __initializeWith__: function(className, args) {
      metaClasses[className]._Spec.apply(this, args);
    },
    $initClass: function() {}
  });

  klass.define(SCClass, "Class");

  SCObject.metaClass._MetaSpec.prototype = classes.Class = createClassInstance();
  classes.Class._Spec = SCClass;
  classes.Object = new SCObject.metaClass._MetaSpec();
  classes.Object._name = "Object";
  classes.Object._Spec = SCObject.metaClass._Spec;
  classes.Object._Spec.prototype.__class = classes.Object;
  classes.Object._Spec.prototype.__Spec = classes.Object._Spec;

  klass.refine("Object", function(spec) {
    spec.$new = function() {
      if (this._Spec === SCClass) {
        return $SC.Nil();
      }
      return new this._Spec(slice.call(arguments));
    };

    spec.class = function() {
      return this.__class;
    };

    spec.isClass = function() {
      return $SC.False();
    };

    spec.isKindOf = function($aClass) {
      return $SC.Boolean(this instanceof $aClass._Spec);
    };

    spec.isMemberOf = function($aClass) {
      return $SC.Boolean(this.__class === $aClass);
    };

    spec.toString = function() {
      var name = this.__class._name;
      if (/^[AEIOU]/.test(name)) {
        return String("an " + name);
      } else {
        return String("a " + name);
      }
    };

    spec.valueOf = function() {
      return this._;
    };
  });

  klass.refine("Class", function(spec) {
    spec.name = function() {
      return $SC.String(this._name);
    };

    spec.class = function() {
      if (this._isMetaClass) {
        return classes.Class;
      }
      return $SC("Meta_" + this._name);
    };

    spec.isClass = function() {
      return $SC.True();
    };

    spec.toString = function() {
      return String(this._name);
    };
  });

  sc.lang.klass = klass;

})(sc);

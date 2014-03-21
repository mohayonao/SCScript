(function(global) {
"use strict";

var sc = { VERSION: "0.0.3" };

// src/sc/sc.js
(function(sc) {

  sc.lang = {};
  sc.lang.$SC = {};

  function SCScript(fn) {
    return fn(sc.lang.$SC);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  SCScript.VERSION = sc.VERSION;

  global.SCScript = sc.SCScript = SCScript;

})(sc);

// src/sc/lang/klass.js
/* jshint latedef: false */
(function(sc) {

  sc.lang.klass = {};

  var object_keys = global.Object.keys;
  var metaClasses = {}, classes = {};

  var extend = function(constructor, superMetaClass) {
    function F() {}
    F.prototype = superMetaClass._Spec.prototype;
    constructor.prototype = new F();

    function Meta_F() {}
    Meta_F.prototype = superMetaClass._MetaSpec.prototype;

    function MetaSpec() {}
    MetaSpec.prototype = new Meta_F();

    constructor.metaClass = new Class(MetaSpec);
  };

  var def = function(spec, classMethods, instanceMethods) {
    object_keys(spec).forEach(function(methodName) {
      if (methodName === "constructor") {
        return;
      }
      if (methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
        classMethods[methodName.substr(1)] = spec[methodName];
      } else {
        instanceMethods[methodName] = spec[methodName];
      }
    });
  };

  sc.lang.klass.define = function(className, superClassName, spec, opts) {
    var ch0, constructor, metaClass;

    ch0 = className.charCodeAt(0);
    if (ch0 < 0x41 || 0x5a < ch0) { // faster test than !/^[A-Z]/.test(className)
      throw new Error(
        "sc.lang.klass.define: classname should be CamelCase, but got '" + className + "'"
      );
    }

    if (metaClasses.hasOwnProperty(className) && !(opts && opts.force)) {
      throw new Error(
        "sc.lang.klass.define: class '" + className + "' is already registered."
      );
    }

    spec = spec || {};
    constructor = spec.hasOwnProperty("constructor") ? spec.constructor : function() {};

    if (className !== "Object") {
      if (!metaClasses.hasOwnProperty(superClassName)) {
        throw new Error(
          "sc.lang.klass.define: superclass '" + superClassName + "' is not registered."
        );
      }
      extend(constructor, metaClasses[superClassName]);
    }

    metaClass = constructor.metaClass;

    def(spec, metaClass._MetaSpec.prototype, constructor.prototype);

    metaClass._Spec = constructor;
    metaClass._isMetaClass = true;
    metaClass._name = "Meta_" + className;
    metaClasses[className] = metaClass;
    classes[className] = null;
  };

  sc.lang.klass.refine = function(className, spec) {
    var metaClass;

    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.refine: class '" + className + "' is not registered."
      );
    }
    metaClass = metaClasses[className];
    def(spec, metaClass._MetaSpec.prototype, metaClass._Spec.prototype);
  };

  sc.lang.klass.get = function(name) {
    var metaClass;

    if (!classes[name]) {
      if (!metaClasses.hasOwnProperty(name)) {
        throw new Error(
          "sc.lang.klass.get: class '" + name + "' not registered."
        );
      }
      metaClass = metaClasses[name];
      classes[name] = new metaClass._MetaSpec();
      classes[name]._name = name;
      classes[name]._Spec = metaClass._Spec;
      classes[name].initClass();
    }

    return classes[name];
  };

  function Object() {}
  Object.metaClass = new Class();
  sc.lang.klass.define("Object", null, { constructor: Object });

  function Class(MetaSpec) {
    this._name = "Class";
    this._Spec = Class;
    this._MetaSpec = MetaSpec || function() {};
    this._isMetaClass = false;
  }
  sc.lang.klass.define("Class", "Object", { constructor: Class });

  Object.metaClass._MetaSpec.prototype = classes.Class = new Class();

  sc.lang.klass.refine("Object", {
    $new: function() {
      var instance = new this._Spec();
      instance._class = this;
      return instance;
    },
    $initClass: function() {},
    class: function() {
      return this._class;
    },
    isClass: function() {
      return false;
    },
    isKindOf: function(aClass) {
      return this instanceof aClass._Spec;
    },
    isMemberOf: function(aClass) {
      return this._class === aClass;
    },
    _initializeWith: function(className, args) {
      metaClasses[className]._Spec.apply(this, args);
    },
    _performWith: function(className, methodName, args) {
      var metaClass, proto;

      metaClass = metaClasses[className];
      if (methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
        methodName = methodName.substr(1);
        proto = metaClass._MetaSpec.prototype;
      } else {
        proto = metaClass._Spec.prototype;
      }

      return proto[methodName].apply(this, args);
    },
    toString: function() {
      return "instance of " + this._class._name;
    }
  });

  sc.lang.klass.refine("Class", {
    name: function() {
      return this._name;
    },
    class: function() {
      return this._isMetaClass ? classes.Class : this._Spec.metaClass;
    },
    isClass: function() {
      return true;
    },
    toString: function() {
      return this._name;
    }
  });

})(sc);

// src/sc/lang/dollarSC.js
(function(sc) {

  sc.lang.$SC = function(msg, rcv, args) {
      var method;

      method = rcv[msg];
      if (method) {
        return method.apply(rcv, args);
      }

      throw new Error(String(rcv) + " cannot understand message '" + msg + "'");
  };

})(sc);

})(this.self||global);

(function(global) {
"use strict";

var sc = { VERSION: "0.0.4" };

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

// src/sc/lang/dollarSC.js
(function(sc) {

  var $SC = function(msg, rcv, args) {
      var method;

      method = rcv[msg];
      if (method) {
        return method.apply(rcv, args);
      }

      throw new Error(String(rcv) + " cannot understand message '" + msg + "'");
  };

  /* istanbul ignore next */
  var shouldBeImplementedInClassLib = function() {};

  $SC.Class = shouldBeImplementedInClassLib;
  $SC.Integer = shouldBeImplementedInClassLib;
  $SC.Float = shouldBeImplementedInClassLib;
  $SC.Char = shouldBeImplementedInClassLib;
  $SC.Array = shouldBeImplementedInClassLib;
  $SC.String = shouldBeImplementedInClassLib;
  $SC.Dictionary = shouldBeImplementedInClassLib;
  $SC.Function = shouldBeImplementedInClassLib;
  $SC.Routine = shouldBeImplementedInClassLib;
  $SC.Ref = shouldBeImplementedInClassLib;
  $SC.Symbol = shouldBeImplementedInClassLib;
  $SC.Boolean = shouldBeImplementedInClassLib;
  $SC.True = shouldBeImplementedInClassLib;
  $SC.False = shouldBeImplementedInClassLib;
  $SC.Nil = shouldBeImplementedInClassLib;

  sc.lang.$SC = $SC;

})(sc);

// src/sc/lang/klass.js
(function(sc) {

  sc.lang.klass = {};

  var $SC = sc.lang.$SC;

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
    constructor = spec.hasOwnProperty("constructor") ? spec.constructor : function() {
      this.__initializeWith__(superClassName);
    };

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

  function Object() {
    this._raw = this;
  }
  Object.metaClass = new Class();
  sc.lang.klass.define("Object", null, { constructor: Object });

  function Class(MetaSpec) { // jshint ignore:line
    this._raw = this;
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
      return $SC.False();
    },
    isKindOf: function(aClass) {
      return $SC.Boolean(this instanceof aClass._Spec);
    },
    isMemberOf: function(aClass) {
      return $SC.Boolean(this._class === aClass);
    },
    __initializeWith__: function(className, args) {
      metaClasses[className]._Spec.apply(this, args);
    },
    __performWith__: function(className, methodName, args) {
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
      return $SC.String(this._name);
    },
    class: function() {
      return this._isMetaClass ? classes.Class : this._Spec.metaClass;
    },
    isClass: function() {
      return $SC.True();
    },
    toString: function() {
      return this._name;
    }
  });

  $SC.Class = sc.lang.klass.get;

})(sc);

// src/sc/lang/classlib/Core/Object.js
(function(sc) {

  sc.lang.klass.refine("Object", {
    js: function() {
      return this._raw;
    },
    __num__: function() {
      return 0;
    },
    __str__: function() {
      return this._class._name;
    }
  });

})(sc);

// src/sc/lang/classlib/Core/AbstractFunction.js
(function(sc) {

  sc.lang.klass.define("AbstractFunction", "Object");

})(sc);

// src/sc/lang/classlib/Streams/Stream.js
(function(sc) {

  sc.lang.klass.define("Stream", "AbstractFunction");

  sc.lang.klass.define("PauseStream", "Stream");

  sc.lang.klass.define("Task", "PauseStream");

})(sc);

// src/sc/lang/classlib/Math/Magnitude.js
(function(sc) {

  sc.lang.klass.define("Magnitude", "Object");

})(sc);

// src/sc/lang/classlib/Math/Number.js
(function(sc) {

  sc.lang.klass.define("Number", "Magnitude");

})(sc);

// src/sc/lang/classlib/Math/SimpleNumber.js
(function(sc) {

  sc.lang.klass.define("SimpleNumber", "Number");

})(sc);

// src/sc/lang/classlib/Math/Integer.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function Integer(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("SimpleNumber");
    this._class = $SC.Class("Integer");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Integer", "SimpleNumber", {
    constructor: Integer,
    $new: function() {
      throw new Error("Integer.new is illegal, should use literal.");
    }
  });

  $SC.Integer = function(value) {
    if (!global.isFinite(value)) {
      return $SC.Float(+value);
    }
    return new Integer(value|0);
  };

})(sc);

// src/sc/lang/classlib/Math/Float.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function Float(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("SimpleNumber");
    this._class = $SC.Class("Float");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Float", "SimpleNumber", {
    constructor: Float,
    $new: function() {
      throw new Error("Float.new is illegal, should use literal.");
    }
  });

  $SC.Float = function(value) {
    return new Float(+value);
  };

})(sc);

// src/sc/lang/classlib/Core/Thread.js
(function(sc) {

  sc.lang.klass.define("Thread", "Stream");

  sc.lang.klass.define("Routine", "Thread");

})(sc);

// src/sc/lang/classlib/Core/Symbol.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function Symbol(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Object");
    this._class = $SC.Class("Symbol");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Symbol", "Object", {
    constructor: Symbol,
    $new: function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    },
    __str__: function() {
      return this._raw;
    }
  });

  $SC.Symbol = function(value) {
    return new Symbol(String(value));
  };

})(sc);

// src/sc/lang/classlib/Core/Ref.js
(function(sc) {

  sc.lang.klass.define("Ref", "Object");

})(sc);

// src/sc/lang/classlib/Core/Nil.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var nilInstance = null;

  function Nil() {
    if (nilInstance) {
      return nilInstance;
    }
    this.__initializeWith__("Object");
    this._class = $SC.Class("Nil");
    this._raw = null;
    nilInstance = this;
  }

  sc.lang.klass.define("Nil", "Object", {
    constructor: Nil,
    $new: function() {
      throw new Error("Nil.new is illegal, should use literal.");
    }
  });

  $SC.Nil = function() {
    return new Nil();
  };

})(sc);

// src/sc/lang/classlib/Core/Kernel.js
(function(sc) {

  sc.lang.klass.refine("Class", {});

})(sc);

// src/sc/lang/classlib/Core/Function.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function Function(value) {
    this.__initializeWith__("AbstractFunction");
    this._class = $SC.Class("Function");
    this._raw = value;
  }

  sc.lang.klass.define("Function", "AbstractFunction", {
    constructor: Function,
    $new: function() {
      throw new Error("Function.new is illegal, should use literal.");
    },
  });

  $SC.Function = function(value) {
    return new Function(value); // jshint ignore: line
  };

})(sc);

// src/sc/lang/classlib/Core/Char.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function Char(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Magnitude");
    this._class = $SC.Class("Char");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Char", "Magnitude", {
    constructor: Char,
    $new: function() {
      throw new Error("Char.new is illegal, should use literal.");
    },
    __str__: function() {
      return this._raw;
    }
  });

  $SC.Char = function(value) {
    return new Char(String(value).charAt(0));
  };

})(sc);

// src/sc/lang/classlib/Core/Boolean.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var trueInstance = null;
  var falseInstance = null;

  function True() {
    if (trueInstance) {
      return trueInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("True");
    this._raw = true;
    trueInstance = this;
  }

  function False() {
    if (falseInstance) {
      return falseInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("False");
    this._raw = false;
    falseInstance = this;
  }

  sc.lang.klass.define("Boolean", "Object", {
    $new: function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    }
  });

  sc.lang.klass.define("True", "Boolean", {
    constructor: True,
    $new: function() {
      throw new Error("True.new is illegal, should use literal.");
    }
  });

  sc.lang.klass.define("False", "Boolean", {
    constructor: False,
    $new: function() {
      throw new Error("False.new is illegal, should use literal.");
    }
  });

  $SC.Boolean = function(value) {
    return value ? $SC.True() : $SC.False();
  };

  $SC.True = function() {
    return new True();
  };

  $SC.False = function() {
    return new False();
  };

})(sc);

// src/sc/lang/classlib/Collections/Collection.js
(function(sc) {

  sc.lang.klass.define("Collection", "Object");

})(sc);

// src/sc/lang/classlib/Collections/SequenceableCollection.js
(function(sc) {

  sc.lang.klass.define("SequenceableCollection", "Collection");

})(sc);

// src/sc/lang/classlib/Collections/ArrayedCollection.js
(function(sc) {

  sc.lang.klass.define("ArrayedCollection", "SequenceableCollection");

  sc.lang.klass.define("RawArray", "ArrayedCollection");

})(sc);

// src/sc/lang/classlib/Collections/String.js
(function(sc) {

  var jsString = global.String;
  var $SC = sc.lang.$SC;

  var instances = {};

  function String(value) {
    if (instances[value]) {
      return instances[value];
    }
    // TODO: array?
    this.__initializeWith__("RawArray");
    this._class = $SC.Class("String");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("String", "RawArray", {
    constructor: String,
    $new: function() {
      throw new Error("String.new is illegal, should use literal.");
    },
    __str__: function() {
      return this._raw;
    }
  });

  $SC.String = function(value) {
    return new String(jsString(value)); // jshint ignore: line
  };

})(sc);

// src/sc/lang/classlib/Collections/Set.js
(function(sc) {

  sc.lang.klass.define("Set", "Collection");

})(sc);

// src/sc/lang/classlib/Collections/Dictionary.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function Dictionary(value) {
    this.__initializeWith__("Set");
    this._class = $SC.Class("Dictionary");
    this._raw = value || {};
  }

  sc.lang.klass.define("Dictionary", "Set", {
    constructor: Dictionary
  });

  sc.lang.klass.define("IdentityDictionary", "Dictionary");

  $SC.Dictionary = function(value) {
    return new Dictionary(value);
  };

})(sc);

// src/sc/lang/classlib/Collections/Environment.js
(function(sc) {

  sc.lang.klass.define("Environment", "IdentityDictionary");

})(sc);

// src/sc/lang/classlib/Collections/Event.js
(function(sc) {

  sc.lang.klass.define("Event", "Environment");

})(sc);

// src/sc/lang/classlib/Collections/Array.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function Array(value) {
    this.__initializeWith__("ArrayedCollection");
    this._class = $SC.Class("Array");
    this._raw = value || [];
  }

  sc.lang.klass.define("Array", "ArrayedCollection", {
    constructor: Array
  });

  $SC.Array = function(value) {
    return new Array(value);
  };

})(sc);

})(this.self||global);

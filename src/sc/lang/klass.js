(function(sc) {
  "use strict";

  require("./sc");
  require("./dollarSC");

  sc.lang.klass = {};

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var metaClasses = {};
  var classes = {};
  var utils = {};

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

  var def = function(className, fn, classMethods, instanceMethods, opts) {

    var setMethod = function(methods, methodName, func) {
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

    var spec = {};
    if (typeof fn === "function") {
      fn(spec, utils);
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

  sc.lang.klass.define = function(constructor, className, spec) {
    var items, superClassName, metaClass, newClass;
    var mproto, cproto;

    throwIfInvalidArgument(constructor, className);

    items = className.split(":");
    className      = items[0].trim();
    superClassName = (items[1] || "Object").trim();

    throwIfInvalidClassName(className, superClassName);

    if (className !== "Object") {
      extend(constructor, metaClasses[superClassName]);
    }

    metaClass = constructor.metaClass;
    mproto    = metaClass._MetaSpec.prototype;
    cproto    = constructor.prototype;

    spec = spec || {};
    def(className, spec, mproto, cproto, {});

    newClass = new metaClass._MetaSpec();
    newClass._name = className;
    newClass._Spec = constructor;
    cproto.__class = newClass;
    cproto.__Spec  = constructor;

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

  sc.lang.klass.refine = function(className, spec, opts) {
    var metaClass;

    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.refine: " +
          "class '" + className + "' is not registered."
      );
    }
    metaClass = metaClasses[className];
    def(className, spec, metaClass._MetaSpec.prototype, metaClass._Spec.prototype, opts || {});
  };

  sc.lang.klass.get = function(name) {
    if (!classes[name]) {
      throw new Error(
        "sc.lang.klass.get: " +
          "class '" + name + "' is not registered."
      );
    }
    return classes[name];
  };

  sc.lang.klass.exists = function(name) {
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

  function SCNil() {
    this.__initializeWith__("Object");
    this._ = null;
  }

  function SCSymbol() {
    this.__initializeWith__("Object");
    this._ = "";
  }

  function SCBoolean() {
    this.__initializeWith__("Object");
  }

  function SCTrue() {
    this.__initializeWith__("Boolean");
    this._ = true;
  }

  function SCFalse() {
    this.__initializeWith__("Boolean");
    this._ = false;
  }

  function SCMagnitude() {
    this.__initializeWith__("Object");
  }

  function SCChar() {
    this.__initializeWith__("Magnitude");
    this._ = "\0";
  }

  function SCNumber() {
    this.__initializeWith__("Magnitude");
  }

  function SCSimpleNumber() {
    this.__initializeWith__("Number");
  }

  function SCInteger() {
    this.__initializeWith__("SimpleNumber");
    this._ = 0;
  }

  function SCFloat() {
    this.__initializeWith__("SimpleNumber");
    this._ = 0.0;
  }

  function SCCollection() {
    this.__initializeWith__("Object");
  }

  function SCSequenceableCollection() {
    this.__initializeWith__("Collection");
  }

  function SCArrayedCollection() {
    this.__initializeWith__("SequenceableCollection");
    this._immutable = false;
    this._ = [];
  }

  function SCRawArray() {
    this.__initializeWith__("ArrayedCollection");
  }

  function SCArray() {
    this.__initializeWith__("ArrayedCollection");
  }

  function SCString(value) {
    this.__initializeWith__("RawArray");
    this._ = value;
  }

  function SCAbstractFunction() {
    this.__initializeWith__("Object");
  }

  function SCFunction() {
    this.__initializeWith__("AbstractFunction");
    // istanbul ignore next
    this._ = function() {};
  }

  SCObject.metaClass = createClassInstance(function() {});
  sc.lang.klass.define(SCObject, "Object", {
    __tag: sc.C.TAG_OBJ,
    __initializeWith__: function(className, args) {
      metaClasses[className]._Spec.apply(this, args);
    },
    $initClass: function() {}
  });

  sc.lang.klass.define(SCClass, "Class");

  SCObject.metaClass._MetaSpec.prototype = classes.Class = createClassInstance();
  classes.Class._Spec = SCClass;
  classes.Object = new SCObject.metaClass._MetaSpec();
  classes.Object._name = "Object";
  classes.Object._Spec = SCObject.metaClass._Spec;
  classes.Object._Spec.prototype.__class = classes.Object;
  classes.Object._Spec.prototype.__Spec = classes.Object._Spec;

  sc.lang.klass.define(SCNil, "Nil", {
    __tag: sc.C.TAG_NIL
  });

  sc.lang.klass.define(SCSymbol, "Symbol", {
    __tag: sc.C.TAG_SYM
  });

  sc.lang.klass.define(SCBoolean, "Boolean");

  sc.lang.klass.define(SCTrue, "True : Boolean", {
    __tag: sc.C.TAG_TRUE
  });

  sc.lang.klass.define(SCFalse, "False : Boolean", {
    __tag: sc.C.TAG_FALSE
  });

  sc.lang.klass.define(SCMagnitude, "Magnitude");

  sc.lang.klass.define(SCChar, "Char : Magnitude", {
    __tag: sc.C.TAG_CHAR
  });

  sc.lang.klass.define(SCNumber, "Number : Magnitude");
  sc.lang.klass.define(SCSimpleNumber, "SimpleNumber : Number");

  sc.lang.klass.define(SCInteger, "Integer : SimpleNumber", {
    __tag: sc.C.TAG_INT
  });

  sc.lang.klass.define(SCFloat, "Float : SimpleNumber", {
    __tag: sc.C.TAG_FLOAT
  });

  sc.lang.klass.define(SCCollection, "Collection");
  sc.lang.klass.define(SCSequenceableCollection, "SequenceableCollection : Collection");
  sc.lang.klass.define(SCArrayedCollection, "ArrayedCollection : SequenceableCollection");
  sc.lang.klass.define(SCRawArray, "RawArray : ArrayedCollection");

  sc.lang.klass.define(SCArray, "Array : ArrayedCollection", {
    __tag: sc.C.TAG_ARRAY
  });

  sc.lang.klass.define(SCString, "String : RawArray", {
    __tag: sc.C.TAG_STR
  });

  sc.lang.klass.define(SCAbstractFunction, "AbstractFunction");

  sc.lang.klass.define(SCFunction, "Function : AbstractFunction", {
    __tag: sc.C.TAG_FUNCTION
  });

  sc.lang.klass.refine("Object", function(spec) {
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
      return falseInstance;
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

  sc.lang.klass.refine("Class", function(spec) {
    spec.name = function() {
      return $SC.String(this._name);
    };

    spec.class = function() {
      if (this._isMetaClass) {
        return  classes.Class;
      }
      return $SC.Class("Meta_" + this._name);
    };

    spec.isClass = function() {
      return trueInstance;
    };

    spec.toString = function() {
      return String(this._name);
    };
  });

  $SC.Class = sc.lang.klass.get;

  var nilInstance = new SCNil();

  $SC.Nil = function() {
    return nilInstance;
  };

  var symbolInstances = {};

  $SC.Symbol = function(value) {
    var instance;
    if (!symbolInstances.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._ = value;
      symbolInstances[value] = instance;
    }
    return symbolInstances[value];
  };

  var trueInstance = new SCTrue();
  var falseInstance = new SCFalse();

  $SC.True = function() {
    return trueInstance;
  };

  $SC.False = function() {
    return falseInstance;
  };
  $SC.Boolean = function($value) {
    return $value ? trueInstance : falseInstance;
  };

  var charInstances = {};

  $SC.Char = function(value) {
    var instance;

    value = String(value).charAt(0);

    if (!charInstances.hasOwnProperty(value)) {
      instance = new SCChar();
      instance._ = value;
      charInstances[value] = instance;
    }

    return charInstances[value];
  };

  var intInstances = {};

  $SC.Integer = function(value) {
    var instance;

    if (!global.isFinite(value)) {
      return $SC.Float(+value);
    }

    value = value|0;

    if (!intInstances.hasOwnProperty(value)) {
      instance = new SCInteger();
      instance._ = value;
      intInstances[value] = instance;
    }

    return intInstances[value];
  };

  var floatInstances = {};

  $SC.Float = function(value) {
    var instance;

    value = +value;

    if (!floatInstances.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._ = value;
      floatInstances[value] = instance;
    }

    return floatInstances[value];
  };

  $SC.Array = function(value, immutable) {
    var instance = new SCArray();
    instance._ = value || [];
    instance._immutable = !!immutable;
    return instance;
  };

  $SC.String = function(value, immutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($SC.Char);
    instance._immutable = !!immutable;
    return instance;
  };

  $SC.Function = function(value) {
    var instance = new SCFunction();
    instance._ = value;
    return instance;
  };

  var int0Instance = $SC.Integer(0);
  var int1Instance = $SC.Integer(1);

  utils = {
    nilInstance: nilInstance,
    trueInstance: trueInstance,
    falseInstance: falseInstance,
    int0Instance: int0Instance,
    int1Instance: int1Instance,
    nop: function() {
      return this;
    },
    alwaysReturn$Nil: $SC.Nil,
    alwaysReturn$True: $SC.True,
    alwaysReturn$False: $SC.False,
    alwaysReturn$Integer_0: function() {
      return int0Instance;
    },
    alwaysReturn$Integer_1: function() {
      return int1Instance;
    },
    defaultValue$Nil: function($obj) {
      return $obj || nilInstance;
    },
    defaultValue$Boolean: function($obj, value) {
      return $obj || $SC.Boolean(value);
    },
    defaultValue$Integer: function($obj, value) {
      return $obj || $SC.Integer(value);
    },
    defaultValue$Float: function($obj, value) {
      return $obj || $SC.Float(value);
    },
    defaultValue$Symbol: function($obj, value) {
      return $obj || $SC.Symbol(value);
    },
    bool: function(a) {
      return a.__bool__();
    },
    getMethod: function(className, methodName) {
      return sc.lang.klass.get(className)._Spec.prototype[methodName];
    }
  };

  sc.lang.klass.classes = classes;
  sc.lang.klass.utils = utils;

})(sc);

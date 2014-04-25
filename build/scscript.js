(function(global) {
"use strict";

var sc = { VERSION: "0.0.10" };

// src/sc/sc.js
(function(sc) {

  sc.lang = {};
  sc.lang.$SC = {};
  sc.libs = {};

  function SCScript(fn) {
    return fn(sc.lang.$SC);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  SCScript.VERSION = sc.VERSION;

  global.SCScript = sc.SCScript = SCScript;

})(sc);

// src/sc/libs/random.js
(function(sc) {

  var random = {};

  function RandGen(seed) {
    this.setSeed(seed);
  }

  RandGen.prototype.setSeed = function(seed) {
    if (typeof seed !== "number") {
      seed = Date.now();
    }
    seed += ~(seed <<  15);
    seed ^=   seed >>> 10;
    seed +=   seed <<  3;
    seed ^=   seed >>> 6;
    seed += ~(seed <<  11);
    seed ^=   seed >>> 16;

    this.x = 1243598713 ^ seed;
    this.y = 3093459404 ^ seed;
    this.z = 1821928721 ^ seed;

    return this;
  };

  RandGen.prototype.trand = function() {
    this.x = ((this.x & 4294967294) << 12) ^ (((this.x << 13) ^ this.x) >>> 19);
    this.y = ((this.y & 4294967288) <<  4) ^ (((this.y <<  2) ^ this.y) >>> 25);
    this.z = ((this.z & 4294967280) << 17) ^ (((this.z <<  3) ^ this.z) >>> 11);
    return this.x ^ this.y ^ this.z;
  };

  RandGen.prototype.next = function() {
    return (this.trand() >>> 0) / 4294967296;
  };

  RandGen.prototype.RandGen = RandGen;

  random = {
    RandGen: RandGen,
    current: new RandGen(),
    next: function() {
      return random.current.next();
    },
    setSeed: function(seed) {
      return random.current.setSeed(seed);
    }
  };

  sc.libs.random = random;

})(sc);

// src/sc/libs/mathlib.js
(function(sc) {

  var rand = sc.libs.random;
  var mathlib = {};

  mathlib.rand = function(a) {
    return rand.next() * a;
  };

  mathlib["+"] = function(a, b) {
    return a + b;
  };

  mathlib["-"] = function(a, b) {
    return a - b;
  };

  mathlib["*"] = function(a, b) {
    return a * b;
  };

  mathlib["/"] = function(a, b) {
    return a / b;
  };

  mathlib.mod = function(a, b) {
    if (a === 0 || b === 0) {
      return 0;
    }
    if ((a > 0 && b < 0) || (a < 0 && b > 0)) {
      return b + a % b;
    }
    return a % b;
  };

  mathlib.div = function(a, b) {
    if (b === 0) {
      return a|0;
    }
    return (a / b)|0;
  };

  mathlib.pow = function(a, b) {
    return Math.pow(a, b);
  };

  mathlib.min = Math.min;
  mathlib.max = Math.max;

  mathlib.bitAnd = function(a, b) {
    return a & b;
  };

  mathlib.bitOr = function(a, b) {
    return a | b;
  };

  mathlib.bitXor = function(a, b) {
    return a ^ b;
  };

  var gcd = function(a, b) {
    var t;

    a = a|0;
    b = b|0;

    while (b !== 0) {
      t = a % b;
      a = b;
      b = t;
    }

    return Math.abs(a);
  };

  mathlib.lcm = function(a, b) {
    if (a === 0 && b === 0) {
      return 0;
    }
    return Math.abs((a|0) * (b|0)) / gcd(a, b);
  };

  mathlib.gcd = function(a, b) {
    return gcd(a, b);
  };

  mathlib.round = function(a, b) {
    return b === 0 ? a : Math.round(a / b) * b;
  };

  mathlib.roundUp = function(a, b) {
    return b === 0 ? a : Math.ceil(a / b) * b;
  };

  mathlib.trunc = function(a, b) {
    return b === 0 ? a : Math.floor(a / b) * b;
  };

  mathlib.atan2 = Math.atan2;

  mathlib.hypot = function(a, b) {
    return Math.sqrt((a * a) + (b * b));
  };

  mathlib.hypotApx = function(a, b) {
    var x = Math.abs(a);
    var y = Math.abs(b);
    var minxy = Math.min(x, y);
    return x + y - (Math.sqrt(2) - 1) * minxy;
  };

  mathlib.leftShift = function(a, b) {
    if (b < 0) {
      return (a|0) >> (-b|0);
    }
    return (a|0) << (b|0);
  };

  mathlib.rightShift = function(a, b) {
    if (b < 0) {
      return (a|0) << (-b|0);
    }
    return (a|0) >> (b|0);
  };

  mathlib.unsignedRightShift = function(a, b) {
    if (b < 0) {
      return (a|0) << (-b|0);
    }
    return (a|0) >> (b|0);
  };

  mathlib.ring1 = function(a, b) {
    return a * b + a;
  };

  mathlib.ring2 = function(a, b) {
    return a * b + a + b;
  };

  mathlib.ring3 = function(a, b) {
    return a * a * b;
  };

  mathlib.ring4 = function(a, b) {
    return a * a * b - a * b * b;
  };

  mathlib.difsqr = function(a, b) {
    return a * a - b * b;
  };

  mathlib.sumsqr = function(a, b) {
    return a * a + b * b;
  };

  mathlib.sqrsum = function(a, b) {
    return (a + b) * (a + b);
  };

  mathlib.sqrdif = function(a, b) {
    return (a - b) * (a - b);
  };

  mathlib.absdif = function(a, b) {
    return Math.abs(a - b);
  };

  mathlib.thresh = function(a, b) {
    return a < b ? 0 : a;
  };

  mathlib.amclip = function(a, b) {
    return a * 0.5 * (b + Math.abs(b));
  };

  mathlib.scaleneg = function(a, b) {
    b = 0.5 * b + 0.5;
    return (Math.abs(a) - a) * b + a;
  };

  mathlib.clip2 = function(a, b) {
    return Math.max(-b, Math.min(a, b));
  };

  mathlib.fold2 = function(a, b) {
    var x, c, range, range2;

    if (b === 0) {
      return 0;
    }

    x = a + b;
    if (a >= b) {
      a = b + b - a;
      if (a >= -b) {
        return a;
      }
    } else if (a < -b) {
      a = -b - b - a;
      if (a < b) {
        return a;
      }
    } else {
      return a;
    }

    range  = b + b;
    range2 = range + range;
    c = x - range2 * Math.floor(x / range2);

    if (c >= range) {
      c = range2 - c;
    }

    return c - b;
  };

  mathlib.wrap2 = function(a, b) {
    var range;

    if (b === 0) {
      return 0;
    }

    if (a >= b) {
      range = b + b;
      a -= range;
      if (a < b) {
        return a;
      }
    } else if (a < -b) {
      range = b + b;
      a += range;
      if (a >= -b) {
        return a;
      }
    } else {
      return a;
    }

    return a - range * Math.floor((a + b) / range);
  };

  mathlib.excess = function(a, b) {
    return a - Math.max(-b, Math.min(a, b));
  };

  mathlib.firstArg = function(a) {
    return a;
  };

  mathlib.rrand = function(a, b) {
    return a + rand.next() * (b - a);
  };

  mathlib.exprand = function(a, b) {
    return a * Math.exp(Math.log(b / a) * rand.next());
  };

  mathlib.clip = function(val, lo, hi) {
    return Math.max(lo, Math.min(val, hi));
  };

  mathlib.iwrap = function(val, lo, hi) {
    var range;

    range = hi - lo + 1;
    val -= range * Math.floor((val - lo) / range);

    return val;
  };

  mathlib.wrap = function(val, lo, hi) {
    var range;

    if (hi === lo) {
      return lo;
    }

    range = (hi - lo);
    if (val >= hi) {
      val -= range;
      if (val < hi) {
        return val;
      }
    } else if (val < lo) {
      val += range;
      if (val >= lo) {
        return val;
      }
    } else {
      return val;
    }

    return val - range * Math.floor((val - lo) / range);
  };

  mathlib.ifold = function(val, lo, hi) {
    var x, range1, range2;

    range1 = hi - lo;
    range2 = range1 * 2;
    x = val - lo;
    x -= range2 * Math.floor(x / range2);

    if (x >= range1) {
      return range2 - x + lo;
    }

    return x + lo;
  };

  mathlib.fold = function(val, lo, hi) {
    var x, range1, range2;

    if (hi === lo) {
      return lo;
    }

    if (val >= hi) {
      val = (hi * 2) - val;
      if (val >= lo) {
        return val;
      }
    } else if (val < lo) {
      val = (lo * 2) - val;
      if (val < hi) {
        return val;
      }
    } else {
      return val;
    }

    range1 = hi - lo;
    range2 = range1 * 2;
    x = val - lo;
    x -= range2 * Math.floor(x / range2);

    if (x >= range1) {
      return range2 - x + lo;
    }

    return x + lo;
  };

  mathlib.clip_idx = function(index, len) {
    return Math.max(0, Math.min(index, len - 1));
  };

  mathlib.wrap_idx = function(index, len) {
    index = index % len;
    if (index < 0) {
      index += len;
    }
    return index;
  };

  mathlib.fold_idx = function(index, len) {
    var len2 = len * 2 - 2;

    index = (index|0) % len2;
    if (index < 0) {
      index += len2;
    }
    if (len <= index) {
      return len2 - index;
    }
    return index;
  };

  sc.libs.mathlib = mathlib;

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

// src/sc/lang/fn.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var fn = function(func, def) {
    var argNames, remain, wrapper;

    argNames = def.split(/\s*,\s*/);
    if (argNames[argNames.length - 1].charAt(0) === "*") {
      remain = !!argNames.pop();
    }

    wrapper = function() {
      var given, args;
      var dict, keys, name, index;
      var i, imax;

      given = slice.call(arguments);
      args  = [];

      if (isDictionary(given[given.length - 1])) {
        dict = given.pop();
        keys = Object.keys(dict);
        for (i = 0, imax = keys.length; i < imax; ++i) {
          name  = keys[i];
          index = argNames.indexOf(name);
          if (index !== -1) {
            args[index] = dict[name];
          }
        }
      }

      for (i = 0, imax = Math.min(argNames.length, given.length); i < imax; ++i) {
        args[i] = given[i];
      }
      if (remain) {
        args.push($SC.Array(given.slice(argNames.length)));
      }

      return func.apply(this, args);
    };

    return wrapper;
  };

  var isDictionary = function(obj) {
    return !!(obj && obj.constructor === Object);
  };

  sc.lang.fn = fn;

})(sc);

// src/sc/lang/klass.js
(function(sc) {

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

  sc.lang.klass.define = function(constructor, className, spec) {
    var items, superClassName, ch0, metaClass, newClass;

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

    items = className.split(":");
    className = items[0].trim();
    superClassName = (items[1] || "Object").trim();

    ch0 = className.charCodeAt(0);
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
      extend(constructor, metaClasses[superClassName]);
    }

    metaClass = constructor.metaClass;

    spec = spec || {};
    def(className, spec, metaClass._MetaSpec.prototype, constructor.prototype, {});

    metaClass._Spec = constructor;
    metaClass._isMetaClass = true;
    metaClass._name = "Meta_" + className;

    newClass = new metaClass._MetaSpec();
    newClass._name = className;
    newClass._Spec = metaClass._Spec;
    newClass._Spec.prototype.__class = newClass;
    newClass._Spec.prototype.__Spec  = newClass._Spec;

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
    __tag: 1,
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
    __tag: 773
  });

  sc.lang.klass.define(SCSymbol, "Symbol", {
    __tag: 1027
  });

  sc.lang.klass.define(SCBoolean, "Boolean");

  sc.lang.klass.define(SCTrue, "True : Boolean", {
    __tag: 775
  });

  sc.lang.klass.define(SCFalse, "False : Boolean", {
    __tag: 774
  });

  sc.lang.klass.define(SCMagnitude, "Magnitude");

  sc.lang.klass.define(SCChar, "Char : Magnitude", {
    __tag: 1028
  });

  sc.lang.klass.define(SCNumber, "Number : Magnitude");
  sc.lang.klass.define(SCSimpleNumber, "SimpleNumber : Number");

  sc.lang.klass.define(SCInteger, "Integer : SimpleNumber", {
    __tag: 770
  });

  sc.lang.klass.define(SCFloat, "Float : SimpleNumber", {
    __tag: 777
  });

  sc.lang.klass.define(SCCollection, "Collection");
  sc.lang.klass.define(SCSequenceableCollection, "SequenceableCollection : Collection");
  sc.lang.klass.define(SCArrayedCollection, "ArrayedCollection : SequenceableCollection");
  sc.lang.klass.define(SCRawArray, "RawArray : ArrayedCollection");

  sc.lang.klass.define(SCArray, "Array : ArrayedCollection", {
    __tag: 11
  });

  sc.lang.klass.define(SCString, "String : RawArray", {
    __tag: 1034
  });

  sc.lang.klass.define(SCAbstractFunction, "AbstractFunction");

  sc.lang.klass.define(SCFunction, "Function : AbstractFunction", {
    __tag: 12
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
    alwaysReturn$Integer_0: function () {
      return int0Instance;
    },
    alwaysReturn$Integer_1: function () {
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

// src/sc/lang/iterator.js
(function(sc) {

  var iterator = {};
  var $SC = sc.lang.$SC;
  var utils = sc.lang.klass.utils;

  var bool = function(a) {
    return a.__bool__();
  };

  var __stop__ = function() {
    return null;
  };

  // TODO: async function
  iterator.execute = function(iter, $function) {
    var $item, ret, i = 0;
    $function = utils.defaultValue$Nil($function);

    while (($item = iter.next()) !== null) {
      if (Array.isArray($item)) {
        ret = $function.value($item[0], $item[1]);
      } else {
        ret = $function.value($item, $SC.Integer(i++));
      }
      if (ret === 65535) {
        break;
      }
    }
  };

  iterator.object$do = function($obj) {
    var iter = {
      next: function() {
        iter.next = __stop__;
        return $obj;
      }
    };
    return iter;
  };

  iterator.function$while = function($function) {
    var $nil = utils.nilInstance;
    var iter = {
      next: function() {
        if (bool($function.value())) {
          return [ $nil, $nil ];
        }
        iter.next = __stop__;
        return null;
      }
    };

    return iter;
  };

  var sc_numeric_iter = function($start, $end, $step) {
    var iter, $i = $start;

    if (bool($i ["=="] ($end))) {
      iter = {
        next: function() {
          iter.next = __stop__;
          return $start;
        }
      };
    } else if ($i < $end && $step > 0) {
      iter = {
        next: function() {
          var $ret = $i;
          $i = $i ["+"] ($step);
          if ($i > $end) {
            iter.next = __stop__;
          }
          return $ret;
        }
      };
    } else if ($i > $end && $step < 0) {
      iter = {
        next: function() {
          var $ret = $i;
          $i = $i ["+"] ($step);
          if ($i < $end) {
            iter.next = __stop__;
          }
          return $ret;
        }
      };
    } else {
      iter = {
        next: __stop__
      };
    }

    return iter;
  };

  iterator.number$do = function($end) {
    var $start, $step;

    $start = utils.int0Instance;
    $end   = $end.__dec__();
    $step  = utils.int1Instance;

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = utils.int0Instance;
    $step  = $SC.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;
    $end = utils.defaultValue$Nil($end);

    $step = ($start <= $end) ? utils.int1Instance : $SC.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    $end  = utils.defaultValue$Nil($end);
    $step = utils.defaultValue$Nil($step);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $end, $step;

    $second = utils.defaultValue$Nil($second);
    $end    = utils.defaultValue$Nil($last);
    $step   = $second ["-"] ($start);

    return sc_numeric_iter($start, $end, $step);
  };

  var js_numeric_iter = function(start, end, step, type) {
    var iter, i = start;

    if (i === end) {
      iter = {
        next: function() {
          iter.next = __stop__;
          return type(start);
        }
      };
    } else if (i < end && step > 0) {
      iter = {
        next: function() {
          var ret = i;
          i += step;
          if (i > end) {
            iter.next = __stop__;
          }
          return type(ret);
        }
      };
    } else if (i > end && step < 0) {
      iter = {
        next: function() {
          var ret = i;
          i += step;
          if (i < end) {
            iter.next = __stop__;
          }
          return type(ret);
        }
      };
    } else {
      iter = {
        next: __stop__
      };
    }

    return iter;
  };

  iterator.integer$do = function($endval) {
    var end = $endval.__int__();
    return js_numeric_iter(0, end - 1, +1, $SC.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    var start = $startval.__int__();
    return js_numeric_iter(start - 1, 0, -1, $SC.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    $endval = utils.defaultValue$Nil($endval);

    var start = $startval.__int__();
    var end   = $endval  .__int__();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, $SC.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    $endval  = utils.defaultValue$Nil($endval);
    $stepval = utils.defaultValue$Nil($stepval);

    var start = $startval.__int__();
    var end   = $endval  .__int__();
    var step  = $stepval .__int__();

    return js_numeric_iter(start, end, step, $SC.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    $second = utils.defaultValue$Nil($second);
    $last   = utils.defaultValue$Nil($last);

    var start  = $startval.__int__();
    var second = $second  .__int__();
    var end    = $last    .__int__();
    var step   = second - start;

    return js_numeric_iter(start, end, step, $SC.Integer);
  };

  iterator.float$do = function($endval) {
    var end = $endval.__num__();
    return js_numeric_iter(0, end - 1, +1, $SC.Float);
  };

  iterator.float$reverseDo = function($startval) {
    var start = $startval.__num__();
    var end   = (start|0) - start;
    return js_numeric_iter(start - 1, end, -1, $SC.Float);
  };

  iterator.float$for = function($startval, $endval) {
    $endval = utils.defaultValue$Nil($endval);

    var start = $startval.__num__();
    var end   = $endval  .__num__();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, $SC.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    $endval  = utils.defaultValue$Nil($endval);
    $stepval = utils.defaultValue$Nil($stepval);

    var start = $startval.__num__();
    var end   = $endval  .__num__();
    var step  = $stepval .__num__();

    return js_numeric_iter(start, end, step, $SC.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    $second = utils.defaultValue$Nil($second);
    $last   = utils.defaultValue$Nil($last);

    var start  = $startval.__num__();
    var second = $second  .__num__();
    var end    = $last    .__num__();
    var step = second - start;

    return js_numeric_iter(start, end, step, $SC.Float);
  };

  var js_array_iter = function(list) {
    var iter, index = 0;

    if (list.length) {
      iter = {
        next: function() {
          var $ret = list[index++];
          if (index >= list.length) {
            iter.next = __stop__;
          }
          return $ret;
        }
      };
    } else {
      iter = {
        next: __stop__
      };
    }

    return iter;
  };

  iterator.array$do = function($array) {
    return js_array_iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js_array_iter($array._.slice().reverse());
  };

  sc.lang.iterator = iterator;

})(sc);

// src/sc/lang/classlib/Core/Object.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Object", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int1 = utils.int1Instance;
    var SCArray = $SC.Class("Array");

    spec.__num__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__int__ = function() {
      return this.__num__()|0;
    };

    spec.__bool__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__sym__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__str__ = function() {
      return String(this);
    };

    // TODO: implements $new
    // TODO: implements $newCopyArgs

    spec.$newFrom = function() {
      return this._doesNotUnderstand("newFrom");
    };

    // TODO: implements dump
    // TODO: implements post
    // TODO: implements postln
    // TODO: implements postc
    // TODO: implements postcln
    // TODO: implements postcs
    // TODO: implements totalFree
    // TODO: implements largestFreeBlock
    // TODO: implements gcDumpGrey
    // TODO: implements gcDumpSet
    // TODO: implements gcInfo
    // TODO: implements gcSanity
    // TODO: implements canCallOS

    spec.size = utils.alwaysReturn$Integer_0;
    spec.indexedSize = utils.alwaysReturn$Integer_0;
    spec.flatSize = utils.alwaysReturn$Integer_1;

    spec.do = function($function) {
      $function = utils.defaultValue$Nil($function);

      sc.lang.iterator.execute(
        sc.lang.iterator.object$do(this),
        $function
      );

      return this;
    };

    spec.generate = function($function, $state) {
      $state = utils.defaultValue$Nil($state);

      this.do($function);

      return $state;
    };

    // already defined: class
    // already defined: isKindOf
    // already defined: isMemberOf

    spec.respondsTo = function($aSymbol) {
      $aSymbol = utils.defaultValue$Nil($aSymbol);
      return $SC.Boolean(typeof this[$aSymbol.__sym__()] === "function");
    };

    // TODO: implements performMsg

    spec.perform = function($selector) {
      var selector, method;
      $selector = utils.defaultValue$Nil($selector);

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, slice.call(arguments, 1));
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.performList = function($selector, $arglist) {
      var selector, method;
      $selector = utils.defaultValue$Nil($selector);
      $arglist  = utils.defaultValue$Nil($arglist);

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, $arglist.asArray()._);
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.functionPerformList = utils.nop;

    // TODO: implements superPerform
    // TODO: implements superPerformList
    // TODO: implements tryPerform
    // TODO: implements multiChannelPerform
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs

    var copy = function(obj) {
      var copied = obj;

      if (Array.isArray(obj)) {
        copied = obj.slice();
      } else if (obj && obj.constructor === Object) {
        copied = {};
        Object.keys(obj).forEach(function(key) {
          copied[key] = obj[key];
        });
      }

      return copied;
    };

    spec.copy = function() {
      return this.shallowCopy();
    };

    // TODO: implements contentsCopy

    spec.shallowCopy = function() {
      var a = new this.__class._Spec();

      Object.keys(this).forEach(function(key) {
        a[key] = copy(this[key]);
      }, this);

      if (this._ === this) {
        a._ = a;
      }

      return a;
    };

    // TODO: implements copyImmutable
    // TODO: implements deepCopy

    spec.dup = function($n) {
      var $this = this;
      var $array, i, imax;

      $n = utils.defaultValue$Integer($n, 2);
      if (bool($n.isSequenceableCollection())) {
        return SCArray.fillND($n, $SC.Function(function() {
          return $this.copy();
        }));
      }

      $array = SCArray.new($n);
      for (i = 0, imax = $n.__int__(); i < imax; ++i) {
        $array.add(this.copy());
      }

      return $array;
    };

    spec["!"] = function($n) {
      return this.dup($n);
    };

    spec.poll = function() {
      return this.value();
    };

    spec.value = utils.nop;
    spec.valueArray = utils.nop;
    spec.valueEnvir = utils.nop;
    spec.valueArrayEnvir = utils.nop;

    spec["=="] = function($obj) {
      return this ["==="] ($obj);
    };

    spec["!="] = function($obj) {
      return (this ["=="] ($obj)).not();
    };

    spec["==="] = function($obj) {
      return $SC.Boolean(this === $obj);
    };

    spec["!=="] = function($obj) {
      return $SC.Boolean(this !== $obj);
    };

    // TODO: implements equals
    // TODO: implements compareObject
    // TODO: implements instVarHash
    // TODO: implements basicHash
    // TODO: implements hash
    // TODO: implements identityHash

    spec["->"] = function($obj) {
      return $SC.Class("Association").new(this, $obj);
    };

    spec.next = utils.nop;
    spec.reset = utils.nop;

    spec.first = function($inval) {
      $inval = utils.defaultValue$Nil($inval);

      this.reset();
      return this.next($inval);
    };

    spec.iter = function() {
      return $SC.Class("OneShotStream").new(this);
    };

    spec.stop = utils.nop;
    spec.free = utils.nop;
    spec.clear = utils.nop;
    spec.removedFromScheduler = utils.nop;
    spec.isPlaying = utils.alwaysReturn$False;

    spec.embedInStream = function() {
      return this.yield();
    };

    // TODO: implements cyc
    // TODO: implements fin
    // TODO: implements repeat
    // TODO: implements loop

    spec.asStream = utils.nop;

    // TODO: implements streamArg

    spec.eventAt = utils.alwaysReturn$Nil;

    spec.composeEvents = function($event) {
      $event = utils.defaultValue$Nil($event);
      return $event.copy();
    };

    spec.finishEvent = utils.nop;
    spec.atLimit = utils.alwaysReturn$False;
    spec.isRest = utils.alwaysReturn$False;
    spec.threadPlayer = utils.nop;
    spec.threadPlayer_ = utils.nop;
    spec["?"] = utils.nop;
    spec["??"] = utils.nop;

    spec["!?"] = function($obj) {
      $obj = utils.defaultValue$Nil($obj);
      return $obj.value(this);
    };

    spec.isNil = utils.alwaysReturn$False;
    spec.notNil = utils.alwaysReturn$True;
    spec.isNumber = utils.alwaysReturn$False;
    spec.isInteger = utils.alwaysReturn$False;
    spec.isFloat = utils.alwaysReturn$False;
    spec.isSequenceableCollection = utils.alwaysReturn$False;
    spec.isCollection = utils.alwaysReturn$False;
    spec.isArray = utils.alwaysReturn$False;
    spec.isString = utils.alwaysReturn$False;
    spec.containsSeqColl = utils.alwaysReturn$False;
    spec.isValidUGenInput = utils.alwaysReturn$False;
    spec.isException = utils.alwaysReturn$False;
    spec.isFunction = utils.alwaysReturn$False;

    spec.matchItem = function($item) {
      $item = utils.defaultValue$Nil($item);
      return this ["==="] ($item);
    };

    spec.trueAt = utils.alwaysReturn$False;

    spec.falseAt = function($key) {
      $key = utils.defaultValue$Nil($key);
      return this.trueAt($key).not();
    };

    // TODO: implements pointsTo
    // TODO: implements mutable
    // TODO: implements frozen
    // TODO: implements halt
    // TODO: implements primitiveFailed
    // TODO: implements reportError
    // TODO: implements subclassResponsibility
    spec._subclassResponsibility = function(methodName) {
      throw new Error("RECEIVER " + String(this) + ": " +
                      "'" + methodName + "' should have been implemented by subclass");
    };

    // TODO: implements doesNotUnderstand
    spec._doesNotUnderstand = function(methodName) {
      throw new Error("RECEIVER " + this.__str__() + ": " +
                      "Message '" + methodName + "' not understood.");
    };

    // TODO: implements shouldNotImplement
    // TODO: implements outOfContextReturn
    // TODO: implements immutableError
    // TODO: implements deprecated
    // TODO: implements mustBeBoolean
    // TODO: implements notYetImplemented
    // TODO: implements dumpBackTrace
    // TODO: implements getBackTrace
    // TODO: implements throw

    spec.species = function() {
      return this.class();
    };

    spec.asCollection = function() {
      return $SC.Array([ this ]);
    };

    spec.asSymbol = function() {
      return this.asString().asSymbol();
    };

    spec.asString = function() {
      return $SC.String(String(this));
    };

    // TODO: implements asCompileString
    // TODO: implements cs
    // TODO: implements printClassNameOn
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeParamsOn
    // TODO: implements simplifyStoreArgs
    // TODO: implements storeArgs
    // TODO: implements storeModifiersOn

    spec.as = function($aSimilarClass) {
      $aSimilarClass = utils.defaultValue$Nil($aSimilarClass);
      return $aSimilarClass.newFrom(this);
    };

    spec.dereference = utils.nop;

    spec.reference = function() {
      return $SC.Ref(this);
    };

    spec.asRef = function() {
      return $SC.Ref(this);
    };

    spec.asArray = function() {
      return this.asCollection().asArray();
    };

    spec.asSequenceableCollection = function() {
      return this.asArray();
    };

    spec.rank = utils.alwaysReturn$Integer_0;

    spec.deepCollect = function($depth, $function, $index, $rank) {
      $function = utils.defaultValue$Nil($function);
      return $function.value(this, $index, $rank);
    };

    spec.deepDo = function($depth, $function, $index, $rank) {
      $function = utils.defaultValue$Nil($function);
      $function.value(this, $index, $rank);
      return this;
    };

    spec.slice = utils.nop;
    spec.shape = utils.alwaysReturn$Nil;
    spec.unbubble = utils.nop;

    spec.bubble = function($depth, $levels) {
      var levels, a;
      $levels = utils.defaultValue$Integer($levels, 1);

      levels = $levels.__int__();
      if (levels <= 1) {
        a = [ this ];
      } else {
        a = [
          this.bubble($depth, $SC.Integer(levels - 1))
        ];
      }

      return $SC.Array(a);
    };

    spec.obtain = function($index, $default) {
      $index   = utils.defaultValue$Nil($index);
      $default = utils.defaultValue$Nil($default);

      if ($index.__num__() === 0) {
        return this;
      } else {
        return $default;
      }
    };

    spec.instill = function($index, $item, $default) {
      $index = utils.defaultValue$Nil($index);
      $item  = utils.defaultValue$Nil($item);

      if ($index.__num__() === 0) {
        return $item;
      } else {
        return this.asArray().instill($index, $item, $default);
      }
    };

    spec.addFunc = fn(function($$functions) {
      return $SC.Class("FunctionList").new(this ["++"] ($$functions));
    }, "*functions");

    spec.removeFunc = function($function) {
      if (this === $function) {
        return $nil;
      }
      return this;
    };

    spec.replaceFunc = function($find, $replace) {
      $replace = utils.defaultValue$Nil($replace);
      if (this === $find) {
        return $replace;
      }
      return this;
    };

    // TODO: implements addFuncTo
    // TODO: implements removeFuncFrom

    spec.while = function($body) {
      var $this = this;
      $body = utils.defaultValue$Nil($body);

      $SC.Function(function() {
        return $this.value();
      }).while($SC.Function(function() {
        return $body.value();
      }));

      return this;
    };

    spec.switch = function() {
      var args, i, imax;

      args = slice.call(arguments);
      for (i = 0, imax = args.length >> 1; i < imax; i++) {
        if (bool(this ["=="] (args[i * 2]))) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    };

    spec.yield = function() {
      // TODO: implements yield
    };

    // TODO: implements alwaysYield
    // TODO: implements yieldAndReset
    // TODO: implements idle
    // TODO: implements $initClass
    // TODO: implements dependants
    // TODO: implements changed
    // TODO: implements addDependant
    // TODO: implements removeDependant
    // TODO: implements release
    // TODO: implements releaseDependants
    // TODO: implements update
    // TODO: implements addUniqueMethod
    // TODO: implements removeUniqueMethods
    // TODO: implements removeUniqueMethod
    // TODO: implements inspect
    // TODO: implements inspectorClass
    // TODO: implements inspector
    // TODO: implements crash
    // TODO: implements stackDepth
    // TODO: implements dumpStack
    // TODO: implements dumpDetailedBackTrace
    // TODO: implements freeze

    spec["&"] = function($that) {
      return this.bitAnd($that);
    };

    spec["|"] = function($that) {
      return this.bitOr($that);
    };

    spec["%"] = function($that) {
      return this.mod($that);
    };

    spec["**"] = function($that) {
      return this.pow($that);
    };

    spec["<<"] = function($that) {
      return this.leftShift($that);
    };

    spec[">>"] = function($that) {
      return this.rightShift($that);
    };

    spec["+>>"] = function($that) {
      return this.unsignedRightShift($that);
    };

    spec["<!"] = function($that) {
      return this.firstArg($that);
    };

    spec.asInt = function() {
      return this.asInteger();
    };

    spec.blend = function($that, $blendFrac) {
      $that      = utils.defaultValue$Nil($that);
      $blendFrac = utils.defaultValue$Float($blendFrac, 0.5);
      return this ["+"] ($blendFrac ["*"] ($that ["-"] (this)));
    };

    spec.blendAt = function($index, $method) {
      var $iMin;
      $index  = utils.defaultValue$Nil($index);
      $method = utils.defaultValue$Symbol($method, "clipAt");

      $iMin = $index.roundUp($int1).asInteger().__dec__();
      return this.perform($method, $iMin).blend(
        this.perform($method, $iMin.__inc__()),
        $index.absdif($iMin)
      );
    };

    spec.blendPut = function($index, $val, $method) {
      var $iMin, $ratio;
      $index  = utils.defaultValue$Nil($index);
      $val    = utils.defaultValue$Nil($val);
      $method = utils.defaultValue$Symbol($method, "wrapPut");

      $iMin = $index.floor().asInteger();
      $ratio = $index.absdif($iMin);
      this.perform($method, $iMin, $val ["*"] ($int1 ["-"] ($ratio)));
      this.perform($method, $iMin.__inc__(), $val ["*"] ($ratio));

      return this;
    };

    spec.fuzzyEqual = function($that, $precision) {
      $that      = utils.defaultValue$Nil($that);
      $precision = utils.defaultValue$Float($precision, 1.0);

      return $SC.Float(0.0).max(
        $SC.Float(1.0) ["-"] (
          (this ["-"] ($that).abs()) ["/"] ($precision)
        )
      );
    };

    spec.isUGen = utils.alwaysReturn$False;
    spec.numChannels = utils.alwaysReturn$Integer_1;

    spec.pair = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $SC.Array([ this, $that ]);
    };

    spec.pairs = function($that) {
      var $list;
      $that = utils.defaultValue$Nil($that);

      $list = $SC.Array();
      this.asArray().do($SC.Function(function($a) {
        $that.asArray().do($SC.Function(function($b) {
          $list = $list.add($a.asArray() ["++"] ($b));
        }));
      }));

      return $list;
    };

    spec.awake = function($beats) {
      return this.next($beats);
    };

    spec.beats_ = utils.nop;
    spec.clock_ = utils.nop;

    spec.performBinaryOpOnSomething = function($aSelector) {
      var aSelector;
      $aSelector = utils.defaultValue$Nil($aSelector);

      aSelector = $aSelector.__sym__();
      if (aSelector === "==") {
        return utils.falseInstance;
      }
      if (aSelector === "!=") {
        return utils.trueInstance;
      }

      throw new Error("binary operator '" + aSelector + "' failed.");
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    };

    spec.performBinaryOpOnSignal  = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnComplex = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnSeqColl = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnUGen    = spec.performBinaryOpOnSimpleNumber;

    // TODO: implements writeDefFile

    spec.isInputUGen = utils.alwaysReturn$False;
    spec.isOutputUGen = utils.alwaysReturn$False;
    spec.isControlUGen = utils.alwaysReturn$False;
    spec.source = utils.nop;
    spec.asUGenInput = utils.nop;
    spec.asControlInput = utils.nop;

    spec.asAudioRateInput = function() {
      if (this.rate().__sym__() !== "audio") {
        return $SC.Class("K2A").ar(this);
      }
      return this;
    };

    // TODO: implements slotSize
    // TODO: implements slotAt
    // TODO: implements slotPut
    // TODO: implements slotKey
    // TODO: implements slotIndex
    // TODO: implements slotsDo
    // TODO: implements slotValuesDo
    // TODO: implements getSlots
    // TODO: implements setSlots
    // TODO: implements instVarSize
    // TODO: implements instVarAt
    // TODO: implements instVarPut
    // TODO: implements writeArchive
    // TODO: implements $readArchive
    // TODO: implements asArchive
    // TODO: implements initFromArchive
    // TODO: implements archiveAsCompileString
    // TODO: implements archiveAsObject
    // TODO: implements checkCanArchive
    // TODO: implements writeTextArchive
    // TODO: implements $readTextArchive
    // TODO: implements asTextArchive
    // TODO: implements getContainedObjects
    // TODO: implements writeBinaryArchive
    // TODO: implements $readBinaryArchive
    // TODO: implements asBinaryArchive
    // TODO: implements genNext
    // TODO: implements genCurrent
    // TODO: implements $classRedirect
    // TODO: implements help
  });

})(sc);

// src/sc/lang/classlib/Core/AbstractFunction.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;
  var utils = sc.lang.klass.utils;

  sc.lang.klass.refine("AbstractFunction", function(spec, utils) {
    spec.composeUnaryOp = function($aSelector) {
      return $SC.Class("UnaryOpFunction").new($aSelector, this);
    };

    spec.composeBinaryOp = function($aSelector, $something, $adverb) {
      return $SC.Class("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    };

    spec.reverseComposeBinaryOp = function($aSelector, $something, $adverb) {
      return $SC.Class("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    };

    spec.composeNAryOp = function($aSelector, $anArgList) {
      return $SC.Class("NAryOpFunction").new($aSelector, this, $anArgList);
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aNumber, $adverb);
    };

    spec.performBinaryOpOnSignal = function($aSelector, $aSignal, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSignal, $adverb);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aComplex, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSeqColl, $adverb);
    };

    spec.neg = function() {
      return this.composeUnaryOp($SC.Symbol("neg"));
    };

    spec.reciprocal = function() {
      return this.composeUnaryOp($SC.Symbol("reciprocal"));
    };

    spec.bitNot = function() {
      return this.composeUnaryOp($SC.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.composeUnaryOp($SC.Symbol("abs"));
    };

    spec.asFloat = function() {
      return this.composeUnaryOp($SC.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.composeUnaryOp($SC.Symbol("asInteger"));
    };

    spec.ceil = function() {
      return this.composeUnaryOp($SC.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.composeUnaryOp($SC.Symbol("floor"));
    };

    spec.frac = function() {
      return this.composeUnaryOp($SC.Symbol("frac"));
    };

    spec.sign = function() {
      return this.composeUnaryOp($SC.Symbol("sign"));
    };

    spec.squared = function() {
      return this.composeUnaryOp($SC.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.composeUnaryOp($SC.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.composeUnaryOp($SC.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.composeUnaryOp($SC.Symbol("exp"));
    };

    spec.midicps = function() {
      return this.composeUnaryOp($SC.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.composeUnaryOp($SC.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.composeUnaryOp($SC.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.composeUnaryOp($SC.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.composeUnaryOp($SC.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.composeUnaryOp($SC.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.composeUnaryOp($SC.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.composeUnaryOp($SC.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.composeUnaryOp($SC.Symbol("log"));
    };

    spec.log2 = function() {
      return this.composeUnaryOp($SC.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.composeUnaryOp($SC.Symbol("log10"));
    };

    spec.sin = function() {
      return this.composeUnaryOp($SC.Symbol("sin"));
    };

    spec.cos = function() {
      return this.composeUnaryOp($SC.Symbol("cos"));
    };

    spec.tan = function() {
      return this.composeUnaryOp($SC.Symbol("tan"));
    };

    spec.asin = function() {
      return this.composeUnaryOp($SC.Symbol("asin"));
    };

    spec.acos = function() {
      return this.composeUnaryOp($SC.Symbol("acos"));
    };

    spec.atan = function() {
      return this.composeUnaryOp($SC.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.composeUnaryOp($SC.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.composeUnaryOp($SC.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.composeUnaryOp($SC.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.composeUnaryOp($SC.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.composeUnaryOp($SC.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.composeUnaryOp($SC.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.composeUnaryOp($SC.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.composeUnaryOp($SC.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.composeUnaryOp($SC.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.composeUnaryOp($SC.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.composeUnaryOp($SC.Symbol("coin"));
    };

    spec.even = function() {
      return this.composeUnaryOp($SC.Symbol("even"));
    };

    spec.odd = function() {
      return this.composeUnaryOp($SC.Symbol("odd"));
    };

    spec.rectWindow = function() {
      return this.composeUnaryOp($SC.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.composeUnaryOp($SC.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.composeUnaryOp($SC.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.composeUnaryOp($SC.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.composeUnaryOp($SC.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.composeUnaryOp($SC.Symbol("ramp"));
    };

    spec.isPositive = function() {
      return this.composeUnaryOp($SC.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.composeUnaryOp($SC.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.composeUnaryOp($SC.Symbol("isStrictlyPositive"));
    };

    spec.rho = function() {
      return this.composeUnaryOp($SC.Symbol("rho"));
    };

    spec.theta = function() {
      return this.composeUnaryOp($SC.Symbol("theta"));
    };

    spec.rotate = function($function) {
      return this.composeBinaryOp($SC.Symbol("rotate"), $function);
    };

    spec.dist = function($function) {
      return this.composeBinaryOp($SC.Symbol("dist"), $function);
    };

    spec["+"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("+"), $function, $adverb);
    };

    spec["-"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("-"), $function, $adverb);
    };

    spec["*"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("*"), $function, $adverb);
    };

    spec["/"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("/"), $function, $adverb);
    };

    spec.div = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("div"), $function, $adverb);
    };

    spec.mod = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("mod"), $function, $adverb);
    };

    spec.pow = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("pow"), $function, $adverb);
    };

    spec.min = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("min"), $function, $adverb);
    };

    spec.max = function($function, $adverb) {
      $function = utils.defaultValue$Integer($function, 0);
      return this.composeBinaryOp($SC.Symbol("max"), $function, $adverb);
    };

    spec["<"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("<"), $function, $adverb);
    };

    spec["<="] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("<="), $function, $adverb);
    };

    spec[">"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol(">"), $function, $adverb);
    };

    spec[">="] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol(">="), $function, $adverb);
    };

    spec.bitAnd = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitAnd"), $function, $adverb);
    };

    spec.bitOr = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitOr"), $function, $adverb);
    };

    spec.bitXor = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitXor"), $function, $adverb);
    };

    spec.bitHammingDistance = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitHammingDistance"), $function, $adverb);
    };

    spec.lcm = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("lcm"), $function, $adverb);
    };

    spec.gcd = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("gcd"), $function, $adverb);
    };

    spec.round = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("round"), $function, $adverb);
    };

    spec.roundUp = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("roundUp"), $function, $adverb);
    };

    spec.trunc = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("trunc"), $function, $adverb);
    };

    spec.atan2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("atan2"), $function, $adverb);
    };

    spec.hypot = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("hypot"), $function, $adverb);
    };

    spec.hypotApx = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("hypotApx"), $function, $adverb);
    };

    spec.leftShift = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("leftShift"), $function, $adverb);
    };

    spec.rightShift = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("rightShift"), $function, $adverb);
    };

    spec.unsignedRightShift = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("unsignedRightShift"), $function, $adverb);
    };

    spec.ring1 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring1"), $function, $adverb);
    };

    spec.ring2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring2"), $function, $adverb);
    };

    spec.ring3 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring3"), $function, $adverb);
    };

    spec.ring4 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring4"), $function, $adverb);
    };

    spec.difsqr = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("difsqr"), $function, $adverb);
    };

    spec.sumsqr = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("sumsqr"), $function, $adverb);
    };

    spec.sqrsum = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("sqrsum"), $function, $adverb);
    };

    spec.sqrdif = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("sqrdif"), $function, $adverb);
    };

    spec.absdif = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("absdif"), $function, $adverb);
    };

    spec.thresh = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("thresh"), $function, $adverb);
    };

    spec.amclip = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("amclip"), $function, $adverb);
    };

    spec.scaleneg = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("scaleneg"), $function, $adverb);
    };

    spec.clip2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("clip2"), $function, $adverb);
    };

    spec.fold2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("fold2"), $function, $adverb);
    };

    spec.wrap2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("wrap2"), $function, $adverb);
    };

    spec.excess = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("excess"), $function, $adverb);
    };

    spec.firstArg = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("firstArg"), $function, $adverb);
    };

    spec.rrand = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("rrand"), $function, $adverb);
    };

    spec.exprand = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("exprand"), $function, $adverb);
    };

    spec["@"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("@"), $function, $adverb);
    };

    spec.real = utils.nop;
    spec.imag = function() {
      return $SC.Float(0.0);
    };

    spec["||"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("||"), $function, $adverb);
    };

    spec["&&"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("&&"), $function, $adverb);
    };

    spec.xor = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("xor"), $function, $adverb);
    };

    spec.nand = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("nand"), $function, $adverb);
    };

    spec.not = function() {
      return this.composeUnaryOp($SC.Symbol("not"));
    };

    spec.ref = function() {
      return this.composeUnaryOp($SC.Symbol("asRef"));
    };

    spec.clip = function($lo, $hi) {
      return this.composeNAryOp($SC.Symbol("clip"), $SC.Array([ $lo, $hi ]));
    };

    spec.wrap = function($lo, $hi) {
      return this.composeNAryOp($SC.Symbol("wrap"), $SC.Array([ $lo, $hi ]));
    };

    spec.fold = function($lo, $hi) {
      return this.composeNAryOp($SC.Symbol("fold"), $SC.Array([ $lo, $hi ]));
    };

    spec.blend = function($that, $blendFrac) {
      $blendFrac = utils.defaultValue$Float($blendFrac, 0.5);
      return this.composeNAryOp(
        $SC.Symbol("blend"), $SC.Array([ $that, $blendFrac ])
      );
    };

    spec.linlin = function($inMin, $inMax, $outMin, $outMax, $clip) {
      $clip = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("linlin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    };

    spec.linexp = function($inMin, $inMax, $outMin, $outMax, $clip) {
      $clip = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("linexp"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    };

    spec.explin = function($inMin, $inMax, $outMin, $outMax, $clip) {
      $clip = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("explin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    };

    spec.expexp = function($inMin, $inMax, $outMin, $outMax, $clip) {
      $clip = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("expexp"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    };

    spec.lincurve = function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      $inMin  = utils.defaultValue$Integer($inMin, 0);
      $inMax  = utils.defaultValue$Integer($inMax, 1);
      $outMin = utils.defaultValue$Integer($outMin, 0);
      $outMax = utils.defaultValue$Integer($outMax, 1);
      $curve  = utils.defaultValue$Integer($curve, -4);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("lincurve"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    };

    spec.curvelin = function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      $inMin  = utils.defaultValue$Integer($inMin, 0);
      $inMax  = utils.defaultValue$Integer($inMax, 1);
      $outMin = utils.defaultValue$Integer($outMin, 0);
      $outMax = utils.defaultValue$Integer($outMax, 1);
      $curve  = utils.defaultValue$Integer($curve, -4);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("curvelin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    };

    spec.bilin = function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      $clip = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("bilin"), $SC.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    };

    spec.biexp = function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      $clip = utils.defaultValue$Symbol($clip, "minmax");
      return this.composeNAryOp(
        $SC.Symbol("biexp"), $SC.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    };

    spec.moddif = function($function, $mod) {
      $function = utils.defaultValue$Float($function, 0.0);
      $mod      = utils.defaultValue$Float($mod     , 1.0);
      return this.composeNAryOp(
        $SC.Symbol("moddif"), $SC.Array([ $function, $mod ])
      );
    };

    spec.degreeToKey = function($scale, $stepsPerOctave) {
      $stepsPerOctave = utils.defaultValue$Integer($stepsPerOctave, 12);
      return this.composeNAryOp(
        $SC.Symbol("degreeToKey"), $SC.Array([ $scale, $stepsPerOctave ])
      );
    };

    spec.degrad = function() {
      return this.composeUnaryOp($SC.Symbol("degrad"));
    };

    spec.raddeg = function() {
      return this.composeUnaryOp($SC.Symbol("raddeg"));
    };

    spec.applyTo = function() {
      return this.value.apply(this, arguments);
    };

    // TODO: implements <>
    // TODO: implements sampled

    spec.asUGenInput = function($for) {
      return this.value($for);
    };

    spec.asAudioRateInput = function($for) {
      var $result;

      $result = this.value($for);

      if ($result.rate().__sym__() !== "audio") {
        return $SC.Class("K2A").ar($result);
      }

      return $result;
    };

    spec.asControlInput = function() {
      return this.value();
    };

    spec.isValidUGenInput = utils.alwaysReturn$True;
  });

  function SCUnaryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = utils.defaultValue$Nil(args[0]);
    this.$a        = utils.defaultValue$Nil(args[1]);
  }

  sc.lang.klass.define(SCUnaryOpFunction, "UnaryOpFunction : AbstractFunction", function(spec) {

    spec.value = function() {
      var $a = this.$a;
      return $a.value.apply($a, arguments).perform(this.$selector);
    };

    spec.valueArray = function($args) {
      return this.$a.valueArray($args).perform(this.$selector);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  function SCBinaryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = utils.defaultValue$Nil(args[0]);
    this.$a        = utils.defaultValue$Nil(args[1]);
    this.$b        = utils.defaultValue$Nil(args[2]);
    this.$adverb   = utils.defaultValue$Nil(args[3]);
  }

  sc.lang.klass.define(SCBinaryOpFunction, "BinaryOpFunction : AbstractFunction", function(spec) {

    spec.value = function() {
      return this.$a.value.apply(this.$a, arguments)
        .perform(this.$selector, this.$b.value.apply(this.$b, arguments), this.$adverb);
    };

    spec.valueArray = function($args) {
      return this.$a.valueArray($args)
        .perform(this.$selector, this.$b.valueArray($args, arguments), this.$adverb);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  function SCNAryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = utils.defaultValue$Nil(args[0]);
    this.$a        = utils.defaultValue$Nil(args[1]);
    this.$arglist  = utils.defaultValue$Nil(args[2]);
  }

  sc.lang.klass.define(SCNAryOpFunction, "NAryOpFunction : AbstractFunction", function(spec) {

    spec.value = function() {
      var args = arguments;
      return this.$a.value.apply(this.$a, args)
        .performList(this.$selector, this.$arglist.collect($SC.Function(function($_) {
          return $_.value.apply($_, args);
        })));
    };

    spec.valueArray = function($args) {
      return this.$a.valueArray($args)
        .performList(this.$selector, this.$arglist.collect($SC.Function(function($_) {
          return $_.valueArray($args);
        })));
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  function SCFunctionList(args) {
    this.__initializeWith__("AbstractFunction");
    this.$array   = utils.defaultValue$Nil(args[0]);
    this._flopped = false;
  }

  sc.lang.klass.define(SCFunctionList, "FunctionList : AbstractFunction", function(spec, utils) {

    spec.array = function() {
      return this.$array;
    };

    spec.array_ = function($value) {
      $value = utils.defaultValue$Nil($value);
      this.$array = $value;
      return this;
    };

    spec.flopped = function() {
      return $SC.Boolean(this._flopped);
    };

    spec.addFunc = fn(function($$functions) {
      if (this._flopped) {
        throw new Error("cannot add a function to a flopped FunctionList");
      }

      this.$array = this.$array.addAll($$functions);

      return this;
    }, "*functions");

    spec.removeFunc = function($function) {
      this.$array.remove($function);

      if (this.$array.size() < 2) {
        return this.$array.at(utils.int0Instance);
      }

      return this;
    };

    spec.replaceFunc = function($find, $replace) {
      this.$array = this.$array.replace($find, $replace);
      return this;
    };

    spec.value = function() {
      var $res, args = arguments;

      $res = this.$array.collect($SC.Function(function($_) {
        return $_.value.apply($_, args);
      }));

      return this._flopped ? $res.flop() : $res;
    };

    spec.valueArray = function($args) {
      var $res;

      $res = this.$array.collect($SC.Function(function($_) {
        return $_.valueArray($args);
      }));

      return this._flopped ? $res.flop() : $res;
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.do = function($function) {
      this.$array.do($function);
      return this;
    };

    spec.flop = function() {
      if (!this._flopped) {
        this.$array = this.$array.collect($SC.Function(function($_) {
          return $_.flop();
        }));
      }
      this._flopped = true;

      return this;
    };

    // TODO: implements envirFlop

    spec.storeArgs = function() {
      return $SC.Array([ this.$array ]);
    };

  });

})(sc);

// src/sc/lang/classlib/Streams/Stream.js
(function(sc) {

  function SCStream() {
    this.__initializeWith__("AbstractFunction");
  }

  sc.lang.klass.define(SCStream, "Stream : AbstractFunction", function() {
    // TODO: implements parent
    // TODO: implements next
    // TODO: implements iter
    // TODO: implements value
    // TODO: implements valueArray
    // TODO: implements nextN
    // TODO: implements all
    // TODO: implements put
    // TODO: implements putN
    // TODO: implements putAll
    // TODO: implements do
    // TODO: implements subSample
    // TODO: implements loop
    // TODO: implements generate
    // TODO: implements collect
    // TODO: implements reject
    // TODO: implements select
    // TODO: implements dot
    // TODO: implements interlace
    // TODO: implements ++
    // TODO: implements appendStream
    // TODO: implements collate
    // TODO: implements <>
    // TODO: implements composeUnaryOp
    // TODO: implements composeBinaryOp
    // TODO: implements reverseComposeBinaryOp
    // TODO: implements composeNAryOp
    // TODO: implements embedInStream
    // TODO: implements while
    // TODO: implements asEventStreamPlayer
    // TODO: implements play
    // TODO: implements trace
    // TODO: implements constrain
    // TODO: implements repeat
  });

  function SCPauseStream() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define(SCPauseStream, "PauseStream : Stream", function() {
    // TODO: implements stream
    // TODO: implements originalStream
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements streamHasEnded
    // TODO: implements streamHasEnded_

    // TODO: implements isPlaying
    // TODO: implements play
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements prStop
    // TODO: implements removedFromScheduler
    // TODO: implements streamError
    // TODO: implements wasStopped
    // TODO: implements canPause
    // TODO: implements pause
    // TODO: implements resume
    // TODO: implements refresh
    // TODO: implements start
    // TODO: implements stream_
    // TODO: implements next
    // TODO: implements awake
    // TODO: implements threadPlayer
  });

  function SCTask() {
    this.__initializeWith__("PauseStream");
  }

  sc.lang.klass.define(SCTask, "Task : PauseStream", function() {
    // TODO: implements storeArgs
  });

})(sc);

// src/sc/lang/classlib/Math/Magnitude.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Magnitude", function(spec, utils) {
    spec["=="] = function($aMagnitude) {
      return $SC.Boolean(this.valueOf() === $aMagnitude.valueOf());
    };

    spec["!="] = function($aMagnitude) {
      return $SC.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    };

    spec.hash = function() {
      return this._subclassResponsibility("hash");
    };

    spec["<"] = function($aMagnitude) {
      return $SC.Boolean(this < $aMagnitude);
    };

    spec[">"] = function($aMagnitude) {
      return $SC.Boolean(this > $aMagnitude);
    };

    spec["<="] = function($aMagnitude) {
      return $SC.Boolean(this <= $aMagnitude);
    };

    spec[">="] = function($aMagnitude) {
      return $SC.Boolean(this >= $aMagnitude);
    };

    spec.exclusivelyBetween = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);
      return $SC.Boolean($lo < this && this < $hi);
    };

    spec.inclusivelyBetween = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);
      return $SC.Boolean($lo <= this && this <= $hi);
    };

    spec.min = function($aMagnitude) {
      $aMagnitude = utils.defaultValue$Nil($aMagnitude);
      return this <= $aMagnitude ? this : $aMagnitude;
    };

    spec.max = function($aMagnitude) {
      $aMagnitude = utils.defaultValue$Nil($aMagnitude);
      return this >= $aMagnitude ? this : $aMagnitude;
    };

    spec.clip = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);
      return this <= $lo ? $lo : this >= $hi ? $hi : this;
    };
  });

})(sc);

// src/sc/lang/classlib/Math/Number.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  sc.lang.klass.refine("Number", function(spec, utils) {
    spec.isNumber = utils.alwaysReturn$True;

    spec["+"] = function() {
      return this._subclassResponsibility("+");
    };

    spec["-"] = function() {
      return this._subclassResponsibility("-");
    };

    spec["*"] = function() {
      return this._subclassResponsibility("*");
    };

    spec["/"] = function() {
      return this._subclassResponsibility("/");
    };

    spec.mod = function() {
      return this._subclassResponsibility("mod");
    };

    spec.div = function() {
      return this._subclassResponsibility("div");
    };

    spec.pow = function() {
      return this._subclassResponsibility("pow");
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      var $this = this;
      $aSeqColl = utils.defaultValue$Nil($aSeqColl);

      return $aSeqColl.collect($SC.Function(function($item) {
        return $item.perform($aSelector, $this, $adverb);
      }));
    };

    // TODO: implements performBinaryOpOnPoint

    spec.rho = utils.nop;

    spec.theta = function() {
      return $SC.Float(0.0);
    };

    spec.real = utils.nop;

    spec.imag = function() {
      return $SC.Float(0.0);
    };

    // TODO: implements @
    // TODO: implements complex
    // TODO: implements polar

    spec.for = function($endValue, $function) {
      iterator.execute(
        iterator.number$for(this, $endValue),
        $function
      );
      return this;
    };

    spec.forBy = function($endValue, $stepValue, $function) {
      iterator.execute(
        iterator.number$forBy(this, $endValue, $stepValue),
        $function
      );
      return this;
    };

    spec.forSeries = function($second, $last, $function) {
      iterator.execute(
        iterator.number$forSeries(this, $second, $last),
        $function
      );
      return this;
    };
  });

})(sc);

// src/sc/lang/classlib/Math/SimpleNumber.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var rand = sc.libs.random;

  function prOpSimpleNumber(selector, func) {
    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
      case 777:
        return $SC.Boolean(func(this._, $aNumber._));
      }

      if ($aNumber.isSequenceableCollection().valueOf()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $SC.Symbol(selector), this, $adverb
        );
      }

      return $SC.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(spec, utils) {
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;
    var SCArray = $SC.Class("Array");

    spec.__newFrom__ = $SC.Float;

    spec.__bool__ = function() {
      return this._ !== 0;
    };

    spec.__dec__ = function() {
      return this.__newFrom__(this._ - 1);
    };

    spec.__inc__ = function() {
      return this.__newFrom__(this._ + 1);
    };

    spec.__int__ = function() {
      if (!isFinite(this._)) {
        return this._;
      }
      return this._|0;
    };

    spec.__num__ = function() {
      return this._;
    };

    spec.isValidUGenInput = function() {
      return $SC.Boolean(!isNaN(this._));
    };

    spec.numChannels = utils.alwaysReturn$Integer_1;

    spec.magnitude = function() {
      return this.abs();
    };

    spec.angle = function() {
      return $SC.Float(this._ >= 0 ? 0 : Math.PI);
    };

    spec.neg = function() {
      return this.__newFrom__(-this._);
    };

    // bitNot: implemented by subclass

    spec.abs = function() {
      return this.__newFrom__(Math.abs(this._));
    };

    spec.ceil = function() {
      return this.__newFrom__(Math.ceil(this._));
    };

    spec.floor = function() {
      return this.__newFrom__(Math.floor(this._));
    };

    spec.frac = function() {
      var a = this._;

      if (a < 0) {
        return this.__newFrom__(1 + (a - (a|0)));
      }
      return this.__newFrom__(a - (a|0));
    };

    spec.sign = function() {
      var a = this._;
      return this.__newFrom__(
        a > 0 ? 1 : a === 0 ? 0 : -1
      );
    };

    spec.squared = function() {
      return this.__newFrom__(this._ * this._);
    };

    spec.cubed = function() {
      return this.__newFrom__(this._ * this._ * this._);
    };

    spec.sqrt = function() {
      return $SC.Float(Math.sqrt(this._));
    };

    spec.exp = function() {
      return $SC.Float(Math.exp(this._));
    };

    spec.reciprocal = function() {
      return $SC.Float(1 / this._);
    };

    spec.midicps = function() {
      return $SC.Float(
        440 * Math.pow(2, (this._ - 69) * 1/12)
      );
    };

    spec.cpsmidi = function() {
      return $SC.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E * 12 + 69
      );
    };

    spec.midiratio = function() {
      return $SC.Float(
        Math.pow(2, this._ * 1/12)
      );
    };

    spec.ratiomidi = function() {
      return $SC.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    };

    spec.ampdb = function() {
      return $SC.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    };

    spec.dbamp = function() {
      return $SC.Float(
        Math.pow(10, this._ * 0.05)
      );
    };

    spec.octcps = function() {
      return $SC.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    };

    spec.cpsoct = function() {
      return $SC.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E + 4.75
      );
    };

    spec.log = function() {
      return $SC.Float(Math.log(this._));
    };

    spec.log2 = function() {
      return $SC.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    };

    spec.log10 = function() {
      return $SC.Float(Math.log(this._) * Math.LOG10E);
    };

    spec.sin = function() {
      return $SC.Float(Math.sin(this._));
    };

    spec.cos = function() {
      return $SC.Float(Math.cos(this._));
    };

    spec.tan = function() {
      return $SC.Float(Math.tan(this._));
    };

    spec.asin = function() {
      return $SC.Float(Math.asin(this._));
    };

    spec.acos = function() {
      return $SC.Float(Math.acos(this._));
    };

    spec.atan = function() {
      return $SC.Float(Math.atan(this._));
    };

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    spec.sinh = function() {
      return $SC.Float(_sinh(this._));
    };

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    spec.cosh = function() {
      return $SC.Float(_cosh(this._));
    };

    spec.tanh = function() {
      return $SC.Float(_sinh(this._) / _cosh(this._));
    };

    spec.rand = function() {
      return this.__newFrom__(
        rand.next() * this._
      );
    };

    spec.rand2 = function() {
      return this.__newFrom__(
        (rand.next() * 2 - 1) * this._
      );
    };

    spec.linrand = function() {
      return this.__newFrom__(
        Math.min(rand.next(), rand.next()) * this._
      );
    };

    spec.bilinrand = function() {
      return this.__newFrom__(
        (rand.next() - rand.next()) * this._
      );
    };

    spec.sum3rand = function() {
      return this.__newFrom__(
        (rand.next() + rand.next() + rand.next() - 1.5) * 2/3 * this._
      );
    };

    spec.distort = function() {
      return $SC.Float(
        this._ / (1 + Math.abs(this._))
      );
    };

    spec.softclip = function() {
      var a = this._, abs_a = Math.abs(a);
      return $SC.Float(abs_a <= 0.5 ? a : (abs_a - 0.25) / a);
    };

    spec.coin = function() {
      return $SC.Boolean(rand.next() < this._);
    };

    spec.isPositive = function() {
      return $SC.Boolean(this._ >= 0);
    };

    spec.isNegative = function() {
      return $SC.Boolean(this._ < 0);
    };

    spec.isStrictlyPositive = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.isNaN = function() {
      return $SC.Boolean(isNaN(this._));
    };

    spec.asBoolean = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.booleanValue = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.binaryValue = function() {
      return this._ > 0 ? $int1 : $int0;
    };

    spec.rectWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(1);
    };

    spec.hanWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    };

    spec.welWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(Math.sin(a * Math.PI));
    };

    spec.triWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      if (a < 0.5) {
        return $SC.Float(2 * a);
      }
      return $SC.Float(-2 * a + 2);
    };

    spec.scurve = function() {
      var a = this._;
      if (a <= 0) {
        return $SC.Float(0);
      }
      if (1 <= a) {
        return $SC.Float(1);
      }
      return $SC.Float(a * a * (3 - 2 * a));
    };

    spec.ramp = function() {
      var a = this._;
      if (a <= 0) {
        return $SC.Float(0);
      }
      if (1 <= a) {
        return $SC.Float(1);
      }
      return $SC.Float(a);
    };

    // +: implemented by subclass
    // -: implemented by subclass
    // *: implemented by subclass
    // /: implemented by subclass
    // mod: implemented by subclass
    // div: implemented by subclass
    // pow: implemented by subclass
    // min: implemented by subclass
    // max: implemented by subclass
    // bitAnd: implemented by subclass
    // bitOr : implemented by subclass
    // bitXor: implemented by subclass

    spec.bitTest = function($bit) {
      $bit = utils.defaultValue$Nil($bit);
      return $SC.Boolean(
        this.bitAnd($int1.leftShift($bit)).valueOf() !== 0
      );
    };

    // lcm     : implemented by subclass
    // gcd     : implemented by subclass
    // round   : implemented by subclass
    // roundUp : implemented by subclass
    // trunc   : implemented by subclass
    // atan2   : implemented by subclass
    // hypot   : implemented by subclass
    // hypotApx: implemented by subclass
    // leftShift         : implemented by subclass
    // rightShift        : implemented by subclass
    // unsignedRightShift: implemented by subclass
    // ring1 : implemented by subclass
    // ring2 : implemented by subclass
    // ring3 : implemented by subclass
    // ring4 : implemented by subclass
    // difsqr: implemented by subclass
    // sumsqr: implemented by subclass
    // sqrsum: implemented by subclass
    // sqrdif: implemented by subclass
    // absdif: implemented by subclass
    // thresh: implemented by subclass
    // amclip: implemented by subclass
    // clip2 : implemented by subclass
    // fold2 : implemented by subclass
    // wrap2 : implemented by subclass
    // excess: implemented by subclass
    // firstArg: implemented by subclass
    // rrand   : implemented by subclass
    // exprand : implemented by subclass

    spec["=="] = function($aNumber) {
      return $SC.Boolean(this._ === $aNumber._);
    };

    spec["!="] = function($aNumber) {
      return $SC.Boolean(this._ !== $aNumber._);
    };

    spec["<"] = prOpSimpleNumber("<", function(a, b) {
      return a < b;
    });
    spec[">"] = prOpSimpleNumber(">", function(a, b) {
      return a > b;
    });
    spec["<="] = prOpSimpleNumber("<=", function(a, b) {
      return a <= b;
    });
    spec[">="] = prOpSimpleNumber(">=", function(a, b) {
      return a >= b;
    });

    spec.equalWithPrecision = function($that, $precision) {
      $that = utils.defaultValue$Nil($that);
      $precision = utils.defaultValue$Float($precision, 0.0001);
      return this.absdif($that) ["<"] ($precision);
    };

    // TODO: implements hash

    spec.asInteger = function() {
      return $SC.Integer(this._);
    };

    spec.asFloat = function() {
      return $SC.Float(this._);
    };

    // TODO: implements asComplex
    // TODO: implements asRect

    spec.degrad = function() {
      return $SC.Float(this._ * Math.PI / 180);
    };

    spec.raddeg = function() {
      return $SC.Float(this._ * 180 / Math.PI);
    };

    // TODO: implements performBinaryOpOnSimpleNumber
    // TODO: implements performBinaryOpOnComplex
    // TODO: implements performBinaryOpOnSignal

    spec.nextPowerOfTwo = function() {
      return $SC.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    };

    spec.nextPowerOf = function($base) {
      $base = utils.defaultValue$Nil($base);
      return $base.pow(
        (this.log() ["/"] ($base.log())).ceil()
      );
    };

    spec.nextPowerOfThree = function() {
      return $SC.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    };

    spec.previousPowerOf = function($base) {
      $base = utils.defaultValue$Nil($base);
      return $base.pow(
        (this.log() ["/"] ($base.log())).ceil().__dec__()
      );
    };

    spec.quantize = function($quantum, $tolerance, $strength) {
      var $round, $diff;
      $quantum   = utils.defaultValue$Float($quantum, 1.0);
      $tolerance = utils.defaultValue$Float($tolerance, 0.05);
      $strength  = utils.defaultValue$Float($strength, 1.0);

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength ["*"] ($diff));
      }

      return this;
    };

    spec.linlin = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    };

    spec.linexp = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    };

    spec.explin = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    };

    spec.expexp = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    };

    spec.lincurve = function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;
      $inMin  = utils.defaultValue$Integer($inMin, 0);
      $inMax  = utils.defaultValue$Integer($inMax, 1);
      $outMin = utils.defaultValue$Integer($outMin, 0);
      $outMax = utils.defaultValue$Integer($outMax, 1);
      $curve  = utils.defaultValue$Integer($curve, -4);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $outMax ["-"] ($outMin) ["/"] ($SC.Float(1.0) ["-"] ($grow));
          $b = $outMin ["+"] ($a);
          $scaled = (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin));

          $res = $b ["-"] ($a ["*"] ($grow.pow($scaled)));
        }
      }

      return $res;
    };

    spec.curvelin = function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;
      $inMin  = utils.defaultValue$Integer($inMin, 0);
      $inMax  = utils.defaultValue$Integer($inMax, 1);
      $outMin = utils.defaultValue$Integer($outMin, 0);
      $outMax = utils.defaultValue$Integer($outMax, 1);
      $curve  = utils.defaultValue$Integer($curve, -4);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $inMax ["-"] ($inMin) ["/"] ($SC.Float(1.0) ["-"] ($grow));
          $b = $inMin ["+"] ($a);

          $res = ((($b ["-"] (this)) ["/"] ($a)).log()
                  ["*"] ($outMax ["-"] ($outMin)) ["/"] ($curve) ["+"] ($outMin));
        }
      }

      return $res;
    };

    spec.bilin = function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;
      $inCenter  = utils.defaultValue$Nil($inCenter);
      $inMin     = utils.defaultValue$Nil($inMin);
      $inMax     = utils.defaultValue$Nil($inMax);
      $outCenter = utils.defaultValue$Nil($outCenter);
      $outMin    = utils.defaultValue$Nil($outMin);
      $outMax    = utils.defaultValue$Nil($outMax);
      $clip      = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.linlin($inCenter, $inMax, $outCenter, $outMax, $SC.Symbol("none"));
        } else {
          $res = this.linlin($inMin, $inCenter, $outMin, $outCenter, $SC.Symbol("none"));
        }
      }

      return $res;
    };

    spec.biexp = function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;
      $inCenter  = utils.defaultValue$Nil($inCenter);
      $inMin     = utils.defaultValue$Nil($inMin);
      $inMax     = utils.defaultValue$Nil($inMax);
      $outCenter = utils.defaultValue$Nil($outCenter);
      $outMin    = utils.defaultValue$Nil($outMin);
      $outMax    = utils.defaultValue$Nil($outMax);
      $clip      = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.explin($inCenter, $inMax, $outCenter, $outMax, $SC.Symbol("none"));
        } else {
          $res = this.explin($inMin, $inCenter, $outMin, $outCenter, $SC.Symbol("none"));
        }
      }

      return $res;
    };

    spec.moddif = function($aNumber, $mod) {
      var $diff, $modhalf;
      $aNumber = utils.defaultValue$Float($aNumber, 0.0);
      $mod     = utils.defaultValue$Float($mod    , 1.0);

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod ["*"] ($SC.Float(0.5));

      return $modhalf ["-"] ($diff.absdif($modhalf));
    };

    spec.lcurve = function($a, $m, $n, $tau) {
      var $rTau, $x;
      $a = utils.defaultValue$Float($a, 1.0);
      $m = utils.defaultValue$Float($m, 0.0);
      $n = utils.defaultValue$Float($n, 1.0);
      $tau = utils.defaultValue$Float($tau, 1.0);

      $x = this.neg();

      if ($tau.__num__() === 1.0) {
        // a * (m * exp(x) + 1) / (n * exp(x) + 1)
        return $a ["*"] (
          $m ["*"] ($x.exp()).__inc__()
        ) ["/"] (
          $n ["*"] ($x.exp()).__inc__()
        );
      } else {
        $rTau = $tau.reciprocal();
        return $a ["*"] (
          $m ["*"] ($x.exp()) ["*"] ($rTau).__inc__()
        ) ["/"] (
          $n ["*"] ($x.exp()) ["*"] ($rTau).__inc__()
        );
      }
    };

    spec.gauss = function($standardDeviation) {
      $standardDeviation = utils.defaultValue$Nil($standardDeviation);
        // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($SC.Float(-2.0) ["*"] ($SC.Float(1.0).rand().log()).sqrt() ["*"] (
        $SC.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    };

    spec.gaussCurve = function($a, $b, $c) {
      $a = utils.defaultValue$Float($a, 1.0);
      $b = utils.defaultValue$Float($b, 0.0);
      $c = utils.defaultValue$Float($c, 1.0);

      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a ["*"] ((
        (this ["-"] ($b).squared()) ["/"] ($SC.Float(-2.0) ["*"] ($c.squared()))
      ).exp());
    };

    // TODO: implements asPoint
    // TODO: implements asWarp

    spec.wait = function() {
      return this.yield();
    };

    // TODO: implements waitUntil
    // TODO: implements sleep
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.rate = function() {
      return $SC.Symbol("scalar");
    };

    spec.asAudioRateInput = function() {
      if (this._ === 0) {
        return $SC.Class("Silent").ar();
      }
      return $SC.Class("DC").ar(this);
    };

    spec.madd = function($mul, $add) {
      $mul = utils.defaultValue$Nil($mul);
      $add = utils.defaultValue$Nil($add);

      return (this ["*"] ($mul)) ["+"] ($add);
    };

    spec.lag = utils.nop;
    spec.lag2 = utils.nop;
    spec.lag3 = utils.nop;
    spec.lagud = utils.nop;
    spec.lag2ud = utils.nop;
    spec.lag3ud = utils.nop;
    spec.varlag = utils.nop;
    spec.slew = utils.nop;

    // TODO: implements writeInputSpec

    spec.series = function($second, $last) {
      var $step;
      var last, step, size;
      $second = utils.defaultValue$Nil($second);
      $last   = utils.defaultValue$Nil($last);

      if ($second === $nil) {
        if (this.valueOf() < $last.valueOf()) {
          $second = this.__inc__();
        } else {
          $second = this.__dec__();
        }
      }
      $step = $second ["-"] (this);

      last = $last.__num__();
      step = $step.__num__();
      size = (Math.floor((last - this._) / step + 0.001)|0) + 1;

      return SCArray.series($SC.Integer(size), this, $step);
    };

    // TODO: implements seriesIter
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInList
    // TODO: implements nearestInScale
    // TODO: implements partition
    // TODO: implements nextTimeOnGrid
    // TODO: implements playAndDelta
    // TODO: implements asQuant
    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    spec.shallowCopy = utils.nop;
  });

  function clip_for_map($this, $inMin, $inMax, $outMin, $outMax, $clip) {

    switch ($clip.__sym__()) {
    case "minmax":
      if ($this <= $inMin) {
        return $outMin;
      }
      if ($this >= $inMax) {
        return $outMax;
      }
      break;
    case "min":
      if ($this <= $inMin) {
        return $outMin;
      }
      break;
    case "max":
      if ($this >= $inMax) {
        return $outMax;
      }
      break;
    }

    return null;
  }

})(sc);

// src/sc/lang/classlib/Math/Integer.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib = sc.libs.mathlib;

  function prOpInt(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return type1(func(this._, $aNumber._));
      case 777:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol(selector), this, $adverb
      );
    };
  }

  sc.lang.klass.refine("Integer", function(spec, utils) {
    var $int1 = utils.int1Instance;
    var SCArray = $SC.Class("Array");

    spec.__newFrom__ = $SC.Integer;

    spec.__int__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String(""+ this._);
    };

    spec.$new = function() {
      throw new Error("Integer.new is illegal, should use literal.");
    };

    spec.isInteger = utils.alwaysReturn$True;

    // TODO: implements hash

    [
      [ "+", $SC.Integer, $SC.Float ],
      [ "-", $SC.Integer, $SC.Float ],
      [ "*", $SC.Integer, $SC.Float ],
      [ "/", $SC.Float  , $SC.Float ],
      [ "mod"     , $SC.Integer, $SC.Float   ],
      [ "div"     , $SC.Integer, $SC.Integer ],
      [ "pow"     , $SC.Float  , $SC.Float   ],
      [ "min"     , $SC.Integer, $SC.Float   ],
      [ "max"     , $SC.Integer, $SC.Float   ],
      [ "bitAnd"  , $SC.Integer, $SC.Float   ],
      [ "bitOr"   , $SC.Integer, $SC.Float   ],
      [ "bitXor"  , $SC.Integer, $SC.Float   ],
      [ "lcm"     , $SC.Integer, $SC.Float   ],
      [ "gcd"     , $SC.Integer, $SC.Float   ],
      [ "round"   , $SC.Integer, $SC.Float   ],
      [ "roundUp" , $SC.Integer, $SC.Float   ],
      [ "trunc"   , $SC.Integer, $SC.Float   ],
      [ "atan2"   , $SC.Float  , $SC.Float   ],
      [ "hypot"   , $SC.Float  , $SC.Float   ],
      [ "hypotApx", $SC.Float  , $SC.Float   ],
      [ "leftShift"         , $SC.Integer, $SC.Float ],
      [ "rightShift"        , $SC.Integer, $SC.Float ],
      [ "unsignedRightShift", $SC.Integer, $SC.Float ],
      [ "ring1"   , $SC.Integer, $SC.Float   ],
      [ "ring2"   , $SC.Integer, $SC.Float   ],
      [ "ring3"   , $SC.Integer, $SC.Float   ],
      [ "ring4"   , $SC.Integer, $SC.Float   ],
      [ "difsqr"  , $SC.Integer, $SC.Float   ],
      [ "sumsqr"  , $SC.Integer, $SC.Float   ],
      [ "sqrsum"  , $SC.Integer, $SC.Float   ],
      [ "sqrdif"  , $SC.Integer, $SC.Float   ],
      [ "absdif"  , $SC.Integer, $SC.Float   ],
      [ "thresh"  , $SC.Integer, $SC.Integer ],
      [ "amclip"  , $SC.Integer, $SC.Float   ],
      [ "scaleneg", $SC.Integer, $SC.Float   ],
      [ "clip2"   , $SC.Integer, $SC.Float   ],
      [ "fold2"   , $SC.Integer, $SC.Float   ],
      [ "excess"  , $SC.Integer, $SC.Float   ],
      [ "firstArg", $SC.Integer, $SC.Integer ],
      [ "rrand"   , $SC.Integer, $SC.Float   ],
      [ "exprand" , $SC.Float  , $SC.Float   ],
    ].forEach(function(items) {
      spec[items[0]] = prOpInt.apply(null, items);
    });

    spec.wrap2 = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return $SC.Integer(mathlib.iwrap(this._, -$aNumber._, $aNumber._));
      case 777:
        return $SC.Float(mathlib.wrap2(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol("wrap2"), this, $adverb
      );
    };

    spec.rrand = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return $SC.Integer(Math.round(mathlib.rrand(this._, $aNumber._)));
      case 777:
        return $SC.Float(mathlib.rrand(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol("rrand"), this, $adverb
      );
    };

    spec.clip = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _ClipInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $SC.Integer(
          mathlib.clip(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    };

    spec.wrap = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _WrapInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $SC.Integer(
          mathlib.iwrap(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    };

    spec.fold = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _FoldInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $SC.Integer(
          mathlib.ifold(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    };

    spec.even = function() {
      return $SC.Boolean(!(this._ & 1));
    };

    spec.odd = function() {
      return $SC.Boolean(!!(this._ & 1));
    };

    spec.xrand = function($exclude) {
      $exclude = utils.defaultValue$Integer($exclude, 0);
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int1)) ["%"] (this);
    };

    spec.xrand2 = function($exclude) {
      var raw, res;
      $exclude = utils.defaultValue$Integer($exclude, 0);

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $SC.Integer(res);
    };

    spec.degreeToKey = function($scale, $stepsPerOctave) {
      $scale = utils.defaultValue$Nil($scale);
      $stepsPerOctave = utils.defaultValue$Integer($stepsPerOctave, 12);

      return $scale.performDegreeToKey(this, $stepsPerOctave);
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.integer$do(this),
        $function
      );
      return this;
    };

    spec.generate = function($function) {
      $function = utils.defaultValue$Nil($function);

      $function.value(this);

      return this;
    };

    spec.collectAs = function($function, $class) {
      var $res;
      var i, imax;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      if ($class === utils.nilInstance) {
        $class = SCArray;
      }

      $res = $class.new(this);
      for (i = 0, imax = this._; i < imax; ++i) {
        $res.add($function.value($SC.Integer(i)));
      }

      return $res;
    };

    spec.collect = function($function) {
      return this.collectAs($function, SCArray);
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.integer$reverseDo(this),
        $function
      );
      return this;
    };

    spec.for = function($endval, $function) {
      iterator.execute(
        iterator.integer$for(this, $endval),
        $function
      );
      return this;
    };

    spec.forBy = function($endval, $stepval, $function) {
      iterator.execute(
        iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    };

    spec.to = function($hi, $step) {
      $step = utils.defaultValue$Integer($step, 1);
      return $SC.Class("Interval").new(this, $hi, $step);
    };

    spec.asAscii = function() {
      // <-- _AsAscii -->
      return $SC.Char(String.fromCharCode(this._|0));
    };

    spec.asUnicode = utils.nop;

    spec.asDigit = function() {
      var c;

      // <!-- _AsAscii -->
      c = this._;
      if (0 <= c && c <= 9) {
        return $SC.Char(String(c));
      }
      if (10 <= c && c <= 35) {
        return $SC.Char(String.fromCharCode(c + 55));
      }

      throw new Error("Integer: asDigit must be 0 <= this <= 35");
    };

    spec.asBinaryDigits = function($numDigits) {
      var raw, array, numDigits, i;
      $numDigits = utils.defaultValue$Integer($numDigits, 8);

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($SC.Integer((raw >> i) & 1));
      }

      return $SC.Array(array);
    };

    spec.asDigits = function($base, $numDigits) {
      var $num;
      var array, numDigits, i;
      $base      = utils.defaultValue$Integer($base, 10);
      $numDigits = utils.defaultValue$Nil($numDigits);

      $num = this;
      if ($numDigits === utils.nilInstance) {
        $numDigits = (
          this.log() ["/"] ($base.log() ["+"] ($SC.Float(1e-10)))
        ).asInteger().__inc__();
      }

      array = [];
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($num ["%"] ($base));
        $num = $num.div($base);
      }

      return $SC.Array(array);
    };

    // TODO: implements nextPowerOfTwo
    // TODO: implements isPowerOfTwo
    // TODO: implements leadingZeroes
    // TODO: implements trailingZeroes
    // TODO: implements numBits
    // TODO: implements log2Ceil
    // TODO: implements grayCode
    // TODO: implements setBit
    // TODO: implements nthPrime
    // TODO: implements prevPrime
    // TODO: implements nextPrime
    // TODO: implements indexOfPrime
    // TODO: implements isPrime
    // TODO: implements exit
    // TODO: implements asStringToBase
    // TODO: implements asBinaryString
    // TODO: implements asHexString
    // TODO: implements asIPString
    // TODO: implements archiveAsCompileString

    spec.geom = function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    };

    spec.fib = function($a, $b) {
      $a = utils.defaultValue$Float($a, 0.0);
      $b = utils.defaultValue$Float($b, 1.0);
      return SCArray.fib(this, $a, $b);
    };

    // TODO: implements factors
    // TODO: implements pidRunning
    // TODO: implements factorial
    // TODO: implements isCaps
    // TODO: implements isShift
    // TODO: implements isCtrl
    // TODO: implements isAlt
    // TODO: implements isCmd
    // TODO: implements isNumPad
    // TODO: implements isHelp
    // TODO: implements isFun

    spec.bitNot = function() {
      return $SC.Integer(~this._);
    };
  });

})(sc);

// src/sc/lang/classlib/Math/Float.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib = sc.libs.mathlib;

  function prOpFloat(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return type1(func(this._, $aNumber._));
      case 777:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol(selector), this, $adverb
      );
    };
  }

  sc.lang.klass.refine("Float", function(spec, utils) {
    spec.toString = function() {
      var raw = this._;

      if (raw === Infinity) {
        return "inf";
      }
      if (raw === -Infinity) {
        return "-inf";
      }
      if (isNaN(raw)) {
        return "nan";
      }

      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Float.new is illegal, should use literal.");
    };

    spec.isFloat = utils.alwaysReturn$True;
    spec.asFloat = utils.nop;

    [
      [ "+"  , $SC.Float, $SC.Float ],
      [ "-"  , $SC.Float, $SC.Float ],
      [ "*"  , $SC.Float, $SC.Float ],
      [ "/"  , $SC.Float, $SC.Float ],
      [ "mod"     , $SC.Float  , $SC.Float   ],
      [ "div"     , $SC.Integer, $SC.Integer ],
      [ "pow"     , $SC.Float  , $SC.Float   ],
      [ "min"     , $SC.Float  , $SC.Float   ],
      [ "max"     , $SC.Float  , $SC.Float   ],
      [ "bitAnd"  , $SC.Float  , $SC.Float   ],
      [ "bitOr"   , $SC.Float  , $SC.Float   ],
      [ "bitXor"  , $SC.Float  , $SC.Float   ],
      [ "lcm"     , $SC.Float  , $SC.Float   ],
      [ "gcd"     , $SC.Float  , $SC.Float   ],
      [ "round"   , $SC.Float  , $SC.Float   ],
      [ "roundUp" , $SC.Float  , $SC.Float   ],
      [ "trunc"   , $SC.Float  , $SC.Float   ],
      [ "atan2"   , $SC.Float  , $SC.Float   ],
      [ "hypot"   , $SC.Float  , $SC.Float   ],
      [ "hypotApx", $SC.Float  , $SC.Float   ],
      [ "leftShift"         , $SC.Float, $SC.Float ],
      [ "rightShift"        , $SC.Float, $SC.Float ],
      [ "unsignedRightShift", $SC.Float, $SC.Float ],
      [ "ring1"   , $SC.Float, $SC.Float ],
      [ "ring2"   , $SC.Float, $SC.Float ],
      [ "ring3"   , $SC.Float, $SC.Float ],
      [ "ring4"   , $SC.Float, $SC.Float ],
      [ "difsqr"  , $SC.Float, $SC.Float ],
      [ "sumsqr"  , $SC.Float, $SC.Float ],
      [ "sqrsum"  , $SC.Float, $SC.Float ],
      [ "sqrdif"  , $SC.Float, $SC.Float ],
      [ "absdif"  , $SC.Float, $SC.Float ],
      [ "thresh"  , $SC.Float, $SC.Float ],
      [ "amclip"  , $SC.Float, $SC.Float ],
      [ "scaleneg", $SC.Float, $SC.Float ],
      [ "clip2"   , $SC.Float, $SC.Float ],
      [ "fold2"   , $SC.Float, $SC.Float ],
      [ "wrap2"   , $SC.Float, $SC.Float ],
      [ "excess"  , $SC.Float, $SC.Float ],
      [ "firstArg", $SC.Float, $SC.Float ],
      [ "rrand"   , $SC.Float, $SC.Float ],
      [ "exprand" , $SC.Float, $SC.Float ],
    ].forEach(function(items) {
      spec[items[0]] = prOpFloat.apply(null, items);
    });

    spec.clip = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _ClipFloat -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $SC.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    };

    spec.wrap = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _WrapInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $SC.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    };

    spec.fold = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _FoldFloat -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $SC.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    };

    // TODO: implements coin
    // TODO: implements xrand2

    spec.as32Bits = function() {
      // <-- _As32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float32Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.high32Bits = function() {
      // <-- _High32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[1]
      );
    };

    spec.low32Bits = function() {
      // <-- _Low32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.$from32Bits = function($word) {
      // <-- _From32Bits -->
      return $SC.Float(
        new Float32Array(
          new Int32Array([ $word.__num__() ]).buffer
        )[0]
      );
    };

    spec.$from64Bits = function($hiWord, $loWord) {
      // <-- _From64Bits -->
      return $SC.Float(
        new Float64Array(
          new Int32Array([ $loWord.__num__(), $hiWord.__num__() ]).buffer
        )[0]
      );
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.float$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.float$reverseDo(this),
        $function
      );
      return this;
    };

    // TODO: implements asStringPrec
    // TODO: implements archiveAsCompileString
    // TODO: implements storeOn
    // TODO: implements switch

    spec.bitNot = function() {
      var f64 = new Float64Array([ this._ ]);
      var i32 = new Int32Array(f64.buffer);
      i32[0] = ~i32[0];
      return $SC.Float(f64[0]);
    };
  });

})(sc);

// src/sc/lang/classlib/Core/Thread.js
(function(sc) {

  function SCThread() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define(SCThread, "Thread : Stream", function() {
    // TODO: implements state
    // TODO: implements parent
    // TODO: implements primitiveError
    // TODO: implements primitiveIndex
    // TODO: implements beats
    // TODO: implements seconds
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements endBeat
    // TODO: implements endBeat_
    // TODO: implements endValue
    // TODO: implements endValue_
    // TODO: implements exceptionHandler
    // TODO: implements exceptionHandler_
    // TODO: implements threadPlayer_
    // TODO: implements executingPath
    // TODO: implements oldExecutingPath

    // TODO: implements init
    // TODO: implements copy
    // TODO: implements clock_
    // TODO: implements seconds_
    // TODO: implements beats_
    // TODO: implements isPlaying
    // TODO: implements threadPlayer
    // TODO: implements findThreadPlayer
    // TODO: implements randSeed_
    // TODO: implements randData_
    // TODO: implements randData
    // TODO: implements failedPrimitiveName
    // TODO: implements handleError
    // TODO: implements next
    // TODO: implements value
    // TODO: implements valueArray
    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  function SCRoutine() {
    this.__initializeWith__("Thread");
  }

  sc.lang.klass.define(SCRoutine, "Routine : Thread", function() {
    // TODO: implements $run
    // TODO: implements next
    // TODO: implements value
    // TODO: implements resume
    // TODO: implements run
    // TODO: implements valueArray
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });

})(sc);

// src/sc/lang/classlib/Core/Symbol.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Symbol", function(spec, utils) {
    spec.__sym__ = function() {
      return this._;
    };

    spec.__str__ = function() {
      return this._;
    };

    spec.$new = function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    };

    spec.asSymbol = utils.nop;

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this._);
      return $SC.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this._);
      return $SC.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      return this.asString().ascii();
    };

    // TODO: implements asCompileString

    spec.asClass = function() {
      if (sc.lang.klass.exists(this._)) {
        return sc.lang.klass.get(this._);
      }
      return utils.nilInstance;
    };

    // TODO: implements asSetter
    // TODO: implements asGetter
    // TODO: implements asSpec
    // TODO: implements asWarp
    // TODO: implements asTuning
    // TODO: implements asScale
    // TODO: implements isSetter
    // TODO: implements isClassName
    // TODO: implements isMetaClassName
    // TODO: implements isPrefix
    // TODO: implements isPrimitiveName
    // TODO: implements isPrimitive
    // TODO: implements isMap
    // TODO: implements isRest
    // TODO: implements envirGet
    // TODO: implements envirPut
    // TODO: implements blend
    // TODO: implements ++
    // TODO: implements asBinOpString
    // TODO: implements applyTo
    // TODO: implements performBinaryOpOnSomething

    spec.neg = utils.nop;
    spec.bitNot = utils.nop;
    spec.abs = utils.nop;
    spec.ceil = utils.nop;
    spec.floor = utils.nop;
    spec.frac = utils.nop;
    spec.sign = utils.nop;
    spec.sqrt = utils.nop;
    spec.exp = utils.nop;
    spec.midicps = utils.nop;
    spec.cpsmidi = utils.nop;
    spec.midiratio = utils.nop;
    spec.ratiomidi = utils.nop;
    spec.ampdb = utils.nop;
    spec.dbamp = utils.nop;
    spec.octcps = utils.nop;
    spec.cpsoct = utils.nop;
    spec.log = utils.nop;
    spec.log2 = utils.nop;
    spec.log10 = utils.nop;
    spec.sin = utils.nop;
    spec.cos = utils.nop;
    spec.tan = utils.nop;
    spec.asin = utils.nop;
    spec.acos = utils.nop;
    spec.atan = utils.nop;
    spec.sinh = utils.nop;
    spec.cosh = utils.nop;
    spec.tanh = utils.nop;
    spec.rand = utils.nop;
    spec.rand2 = utils.nop;
    spec.linrand = utils.nop;
    spec.bilinrand = utils.nop;
    spec.sum3rand = utils.nop;
    spec.distort = utils.nop;
    spec.softclip = utils.nop;
    spec.coin = utils.nop;
    spec.even = utils.nop;
    spec.odd = utils.nop;
    spec.rectWindow = utils.nop;
    spec.hanWindow = utils.nop;
    spec.welWindow = utils.nop;
    spec.triWindow = utils.nop;
    spec.scurve = utils.nop;
    spec.ramp = utils.nop;
    spec["+"] = utils.nop;
    spec["-"] = utils.nop;
    spec["*"] = utils.nop;
    spec["/"] = utils.nop;
    spec.mod = utils.nop;
    spec.min = utils.nop;
    spec.max = utils.nop;
    spec.bitAnd = utils.nop;
    spec.bitOr = utils.nop;
    spec.bitXor = utils.nop;
    spec.bitHammingDistance = utils.nop;
    // TODO: Implements hammingDistance
    spec.lcm = utils.nop;
    spec.gcd = utils.nop;
    spec.round = utils.nop;
    spec.roundUp = utils.nop;
    spec.trunc = utils.nop;
    spec.atan2 = utils.nop;
    spec.hypot = utils.nop;
    spec.hypotApx = utils.nop;
    spec.pow = utils.nop;
    spec.leftShift = utils.nop;
    spec.rightShift = utils.nop;
    spec.unsignedRightShift = utils.nop;
    spec.rrand = utils.nop;
    spec.exprand = utils.nop;

    // TODO: Implements <
    // TODO: Implements >
    // TODO: Implements <=
    // TODO: Implements >=

    spec.degreeToKey = utils.nop;
    spec.degrad = utils.nop;
    spec.raddeg = utils.nop;
    spec.doNumberOp = utils.nop;
    spec.doComplexOp = utils.nop;
    spec.doSignalOp = utils.nop;

    // TODO: Implements doListOp
    // TODO: Implements primitiveIndex
    // TODO: Implements specialIndex
    // TODO: Implements printOn
    // TODO: Implements storeOn
    // TODO: Implements codegen_UGenCtorArg

    spec.archiveAsCompileString = utils.alwaysReturn$True;

    // TODO: Implements kr
    // TODO: Implements ir
    // TODO: Implements tr
    // TODO: Implements ar
    // TODO: Implements matchOSCAddressPattern
    // TODO: Implements help

    spec.asString = function() {
      return $SC.String(this._);
    };

    spec.shallowCopy = utils.nop;

    spec.performBinaryOpOnSimpleNumber = utils.nop;
  });

})(sc);

// src/sc/lang/classlib/Core/Ref.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function SCRef(args) {
    this.__initializeWith__("Object");
    this._value = args[0] || $SC.Nil();
  }

  sc.lang.klass.define(SCRef, "Ref : AbstractFunction", function(spec, utils) {
    spec.valueOf = function() {
      return this._value.valueOf();
    };

    spec.value = function() {
      return this._value;
    };

    spec.value_ = function($value) {
      this._value = $value;
      return this;
    };

    // $new

    spec.set = function($thing) {
      $thing = utils.defaultValue$Nil($thing);
      this._value = $thing;
      return this;
    };

    spec.get = function() {
      return this._value;
    };

    spec.dereference = spec.value;

    spec.asRef = utils.nop;

    spec.valueArray = spec.value;

    spec.valueEnvir = spec.value;

    spec.valueArrayEnvir = spec.value;

    spec.next = spec.value;

    spec.asUGenInput = utils.nop;

    // TODO: implements printOn
    // TODO: implements storeOn

    spec.at = function($key) {
      return this._value.at($key);
    };

    spec.put = function($key, $val) {
      return this._value.put($key, $val);
    };

    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });

})(sc);

// src/sc/lang/classlib/Core/Nil.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Nil", function(spec, utils) {
    spec.__num__ = function() {
      return 0;
    };

    spec.__bool__ = function() {
      return false;
    };

    spec.__sym__ = function() {
      return "nil";
    };

    spec.toString = function() {
      return "nil";
    };

    spec.$new = function() {
      throw new Error("Nil.new is illegal, should use literal.");
    };

    spec.isNil = utils.alwaysReturn$True;
    spec.notNil = utils.alwaysReturn$False;

    spec["?"] = function($obj) {
      return $obj;
    };

    spec["??"] = function($obj) {
      return $obj.value();
    };

    spec["!?"] = utils.nop;

    spec.asBoolean = utils.alwaysReturn$False;
    spec.booleanValue = utils.alwaysReturn$False;

    spec.push = function($function) {
      $function = utils.defaultValue$Nil($function);
      return $function.value();
    };

    spec.appendStream = function($stream) {
      $stream = utils.defaultValue$Nil($stream);
      return $stream;
    };

    spec.pop = utils.nop;
    spec.source = utils.nop;
    spec.source_ = utils.nop;

    spec.rate = utils.nop;
    spec.numChannels = utils.nop;
    spec.isPlaying = utils.alwaysReturn$False;

    spec.do = utils.nop;
    spec.reverseDo = utils.nop;
    spec.pairsDo = utils.nop;
    spec.collect = utils.nop;
    spec.select = utils.nop;
    spec.reject = utils.nop;
    spec.detect = utils.nop;
    spec.collectAs = utils.nop;
    spec.selectAs = utils.nop;
    spec.rejectAs = utils.nop;

    spec.dependants = function() {
      return $SC.Class("IdentitySet").new();
    };

    spec.changed = utils.nop;
    spec.addDependant = utils.nop;
    spec.removeDependant = utils.nop;
    spec.release = utils.nop;
    spec.update = utils.nop;

    spec.transformEvent = function($event) {
      $event = utils.defaultValue$Nil($event);
      return $event;
    };

    spec.awake = utils.alwaysReturn$Nil;

    spec.play = utils.nop;

    spec.nextTimeOnGrid = function($clock) {
      $clock = utils.defaultValue$Nil($clock);

      if ($clock === utils.nilInstance) {
        return $clock;
      }

      return $SC.Function(function() {
        return $clock.nextTimeOnGrid();
      });
    };

    spec.asQuant = function() {
      return $SC.Class("Quant").default();
    };

    spec.swapThisGroup = utils.nop;
    spec.performMsg = utils.nop;

    spec.printOn = function($stream) {
      $stream = utils.defaultValue$Nil($stream);
      $stream.putAll($SC.String("nil"));
      return this;
    };

    spec.storeOn = function($stream) {
      $stream = utils.defaultValue$Nil($stream);
      $stream.putAll($SC.String("nil"));
      return this;
    };

    spec.matchItem = utils.alwaysReturn$True;

    spec.add = function($value) {
      $value = utils.defaultValue$Nil($value);
      return $SC.Array([ $value ]);
    };

    spec.addAll = function($array) {
      $array = utils.defaultValue$Nil($array);
      return $array.asArray();
    };

    spec["++"] = function($array) {
      $array = utils.defaultValue$Nil($array);
      return $array.asArray();
    };

    spec.asCollection = function() {
      return $SC.Array();
    };

    spec.remove = utils.nop;

    spec.set = utils.nop;

    spec.get = function($prevVal) {
      $prevVal = utils.defaultValue$Nil($prevVal);
      return $prevVal;
    };

    spec.addFunc = function() {
      var functions = slice.call(arguments);
      if (functions.length <= 1) {
        return functions[0];
      }
      return $SC.Class("FunctionList").new($SC.Array(functions));
    };

    spec.removeFunc = utils.nop;

    spec.replaceFunc = utils.nop;
    spec.seconds_ = utils.nop;
    spec.throw = utils.nop;

    // TODO: implements handleError

    spec.archiveAsCompileString = utils.alwaysReturn$True;

    spec.asSpec = function() {
      return $SC.Class("ControlSpec").new();
    };

    spec.superclassesDo = utils.nop;

    spec.shallowCopy = utils.nop;
  });

})(sc);

// src/sc/lang/classlib/Core/Kernel.js
(function(sc) {

  sc.lang.klass.refine("Class", {
    // TODO: implements superclass
    // TODO: implements asClass
    // TODO: implements initClass
    // TODO: implements $initClassTree
    // TODO: implements $allClasses
    // TODO: implements findMethod
    // TODO: implements findRespondingMethodFor
    // TODO: implements findOverriddenMethod
    // TODO: implements superclassesDo
    // TODO: implements while
    // TODO: implements dumpByteCodes
    // TODO: implements dumpClassSubtree
    // TODO: implements dumpInterface
    // TODO: implements asString
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements hasHelpFile
    // TODO: implements helpFilePath
    // TODO: implements help
    // TODO: implements openHelpFile
    // TODO: implements shallowCopy
    // TODO: implements openCodeFile
    // TODO: implements classVars
    // TODO: implements inspectorClass
    // TODO: implements findReferences
    // TODO: implements $findAllReferences
    // TODO: implements allSubclasses
    // TODO: implements superclasses
  });

})(sc);

// src/sc/lang/classlib/Core/Function.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Function", function(spec, utils) {
    var bool = utils.bool;
    var SCArray = $SC.Class("Array");

    // TODO: implements def

    spec.$new = function() {
      throw new Error("Function.new is illegal, should use literal.");
    };

    spec.isFunction = utils.alwaysReturn$True;

    // TODO: implements isClosed

    spec.archiveAsCompileString = utils.alwaysReturn$True;
    spec.archiveAsObject = utils.alwaysReturn$True;

    // TODO: implements checkCanArchive

    spec.shallowCopy = utils.nop;

    spec.choose = function() {
      return this.value();
    };

    spec.update = function() {
      return this._.apply(this, arguments);
    };

    spec.value = function() {
      return this._.apply(this, arguments);
    };

    spec.valueArray = function($args) {
      $args = utils.defaultValue$Nil($args);
      return this._.apply(this, $args.asArray()._);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir
    // TODO: implements functionPerformList
    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs
    // TODO: implements loop
    // TODO: implements block

    spec.asRoutine = function() {
      return $SC.Class("Routine").new(this);
    };

    spec.dup = function($n) {
      $n = utils.defaultValue$Integer($n, 2);
      return SCArray.fill($n, this);
    };

    // TODO: implements sum
    // TODO: implements defer
    // TODO: implements thunk
    // TODO: implements transformEvent
    // TODO: implements set
    // TODO: implements get
    // TODO: implements fork
    // TODO: implements forkIfNeeded
    // TODO: implements awake
    // TODO: implements cmdPeriod
    // TODO: implements bench
    // TODO: implements protect
    // TODO: implements try
    // TODO: implements prTry
    // TODO: implements handleError

    spec.case = function() {
      var args, i, imax;

      args = slice.call(arguments);
      args.unshift(this);

      for (i = 0, imax = args.length >> 1; i < imax; ++i) {
        if (bool(args[i * 2].value())) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return utils.nilInstance;
    };

    spec.r = function() {
      return $SC.Class("Routine").new(this);
    };

    spec.p = function() {
      return $SC.Class("Prout").new(this);
    };

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    spec.flop = function() {
      var $this = this;
      // if(def.argNames.isNil) { ^this };
      return $SC.Function(function() {
        var $$args = $SC.Array(slice.call(arguments));
        return $$args.flop().collect($SC.Function(function($_) {
          return $this.valueArray($_);
        }));
      });
    };

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    spec.while = function($body) {
      $body = utils.defaultValue$Nil($body);

      sc.lang.iterator.execute(
        sc.lang.iterator.function$while(this),
        $body
      );

      return this;
    };
  });

})(sc);

// src/sc/lang/classlib/Core/Char.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Char", function(spec, utils) {
    spec.__str__ = function() {
      return this._;
    };

    spec.$nl = function() {
      return $SC.Char("\n");
    };

    spec.$ff = function() {
      return $SC.Char("\f");
    };

    spec.$tab = function() {
      return $SC.Char("\t");
    };

    spec.$space = function() {
      return $SC.Char(" ");
    };

    spec.$comma = function() {
      return $SC.Char(",");
    };

    spec.$new = function() {
      throw new Error("Char.new is illegal, should use literal.");
    };

    // TODO: implements hash

    spec.ascii = function() {
      return $SC.Integer(this._.charCodeAt(0));
    };

    spec.digit = function() {
      var ascii = this._.charCodeAt(0);
      if (0x30 <= ascii && ascii <= 0x39) {
        return $SC.Integer(ascii - 0x30);
      }
      if (0x41 <= ascii && ascii <= 0x5a) {
        return $SC.Integer(ascii - 0x37);
      }
      if (0x61 <= ascii && ascii <= 0x7a) {
        return $SC.Integer(ascii - 0x57);
      }
      throw new Error("digitValue failed");
    };

    spec.asAscii = utils.nop;

    spec.asUnicode = function() {
      return this.ascii();
    };

    spec.toUpper = function() {
      return $SC.Char(this._.toUpperCase());
    };

    spec.toLower = function() {
      return $SC.Char(this._.toLowerCase());
    };

    spec.isAlpha = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isAlphaNum = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x30 <= ascii && ascii <= 0x39) ||
                         (0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isPrint = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x20 <= ascii && ascii <= 0x7e));
    };

    spec.isPunct = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x21 <= ascii && ascii <= 0x2f) ||
                         (0x3a <= ascii && ascii <= 0x40) ||
                         (0x5b <= ascii && ascii <= 0x60) ||
                         (0x7b <= ascii && ascii <= 0x7e));
    };

    spec.isControl = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x00 <= ascii && ascii <= 0x1f) || ascii === 0x7f);
    };

    spec.isSpace = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x09 <= ascii && ascii <= 0x0d) || ascii === 0x20);
    };

    spec.isVowl = function() {
      var ch = this._.charAt(0).toUpperCase();
      return $SC.Boolean("AEIOU".indexOf(ch) !== -1);
    };

    spec.isDecDigit = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x30 <= ascii && ascii <= 0x39));
    };

    spec.isUpper = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x41 <= ascii && ascii <= 0x5a));
    };

    spec.isLower = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isFileSafe = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x20 <= ascii && ascii <= 0x7e) &&
                         ascii !== 0x2f && // 0x2f is '/'
                         ascii !== 0x3a && // 0x3a is ':'
                         ascii !== 0x22);  // 0x22 is '"'
    };

    spec.isPathSeparator = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean(ascii === 0x2f);
    };

    spec["<"] = function($aChar) {
      return $SC.Boolean(this.ascii() < $aChar.ascii());
    };

    spec["++"] = function($that) {
      return $SC.String(this._ + $that.__str__());
    };

    // TODO: implements $bullet
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = function() {
      return $SC.True();
    };

    spec.asString = function() {
      return $SC.String(this._);
    };

    spec.shallowCopy = utils.nop;
  });

})(sc);

// src/sc/lang/classlib/Core/Boolean.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Boolean", function(spec, utils) {
    spec.__bool__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    };

    spec.xor = function($bool) {
      return $SC.Boolean(this === $bool).not();
    };

    // TODO: implements if
    // TODO: implements nop
    // TODO: implements &&
    // TODO: implements ||
    // TODO: implements and
    // TODO: implements or
    // TODO: implements nand
    // TODO: implements asInteger
    // TODO: implements binaryValue

    spec.asBoolean = utils.nop;
    spec.booleanValue = utils.nop;

    // TODO: implements keywordWarnings
    // TODO: implements trace
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = utils.alwaysReturn$True;

    spec.while = function() {
      var msg = "While was called with a fixed (unchanging) Boolean as the condition. ";
      msg += "Please supply a Function instead.";
      throw new Error(msg);
    };

    spec.shallowCopy = utils.nop;
  });

  sc.lang.klass.refine("True", function(spec, utils) {
    spec.$new = function() {
      throw new Error("True.new is illegal, should use literal.");
    };

    spec.if = function($trueFunc) {
      $trueFunc = utils.defaultValue$Nil($trueFunc);
      return $trueFunc.value();
    };

    spec.not = utils.alwaysReturn$False;

    spec["&&"] = function($that) {
      return $that.value();
    };

    spec["||"] = utils.nop;

    spec.and = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $that.value();
    };
    spec.or = spec["||"];

    spec.nand = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $that.value().not();
    };

    spec.asInteger = utils.alwaysReturn$Integer_1;
    spec.binaryValue = utils.alwaysReturn$Integer_1;
  });

  sc.lang.klass.refine("False", function(spec, utils) {
    spec.$new = function() {
      throw new Error("False.new is illegal, should use literal.");
    };

    spec.if = function($trueFunc, $falseFunc) {
      return $falseFunc.value();
    };

    spec.not = utils.alwaysReturn$True;

    spec["&&"] = utils.nop;

    spec["||"] = function($that) {
      return $that.value();
    };

    spec.and = utils.nop;

    spec.or = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $that.value();
    };

    spec.nand = utils.alwaysReturn$True;
    spec.asInteger = utils.alwaysReturn$Integer_0;
    spec.binaryValue = utils.alwaysReturn$Integer_0;
  });

})(sc);

// src/sc/lang/classlib/Collections/Collection.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Collection", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;
    var SCArray = $SC.Class("Array");

    spec.$newFrom = function($aCollection) {
      var $newCollection;
      $aCollection = utils.defaultValue$Nil($aCollection);

      $newCollection = this.new($aCollection.size());
      $aCollection.do($SC.Function(function($item) {
        $newCollection.add($item);
      }));

      return $newCollection;
    };

    spec.$with = fn(function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    }, "*args");

    spec.$fill = function($size, $function) {
      var $obj;
      var size, i;
      $size     = utils.defaultValue$Nil($size);
      $function = utils.defaultValue$Nil($function);

      if (bool($size.isSequenceableCollection())) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($SC.Integer(i)));
      }

      return $obj;
    };

    spec.$fill2D = function($rows, $cols, $function) {
      var $this = this, $obj, $obj2, $row, $col;
      var rows, cols, i, j;
      $rows     = utils.defaultValue$Nil($rows);
      $cols     = utils.defaultValue$Nil($cols);
      $function = utils.defaultValue$Nil($function);

      $obj = this.new($rows);

      rows = $rows.__int__();
      cols = $cols.__int__();

      for (i = 0; i < rows; ++i) {
        $row = $SC.Integer(i);
        $obj2 = $this.new($cols);
        for (j = 0; j < cols; ++j) {
          $col = $SC.Integer(j);
          $obj2 = $obj2.add($function.value($row, $col));
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    };

    spec.$fill3D = function($planes, $rows, $cols, $function) {
      var $this = this, $obj, $obj2, $obj3, $plane, $row, $col;
      var planes, rows, cols, i, j, k;
      $planes   = utils.defaultValue$Nil($planes);
      $rows     = utils.defaultValue$Nil($rows);
      $cols     = utils.defaultValue$Nil($cols);
      $function = utils.defaultValue$Nil($function);

      $obj = this.new($planes);

      planes = $planes.__int__();
      rows   = $rows  .__int__();
      cols   = $cols  .__int__();

      for (i = 0; i < planes; ++i) {
        $plane = $SC.Integer(i);
        $obj2 = $this.new($rows);
        for (j = 0; j < rows; ++j) {
          $row = $SC.Integer(j);
          $obj3 = $this.new($cols);
          for (k = 0; k < cols; ++k) {
            $col = $SC.Integer(k);
            $obj3 = $obj3.add($function.value($plane, $row, $col));
          }
          $obj2 = $obj2.add($obj3);
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    };

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.first();
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($SC.Function(function($i) {
          $obj.add($function.valueArray($args.put($argIndex, $i)));
        }));
      } else {
        $dimensions = $dimensions.drop($int1);
        $n.do($SC.Function(function($i) {
          $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
        }));
      }

      return $obj;
    };

    spec.$fillND = function($dimensions, $function) {
      $dimensions = utils.defaultValue$Nil($dimensions);
      $function   = utils.defaultValue$Nil($function);
      return fillND(this, $dimensions, $function, $SC.Array([]));
    };

    spec["@"] = function($index) {
      return this.at($index);
    };

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return utils.falseInstance;
      }
      if (this.size() !== $aCollection.size()) {
        return utils.falseInstance;
      }
      this.do($SC.Function(function($item) {
        if (!bool($aCollection.includes($item))) {
          $res = utils.falseInstance;
          return 65535;
        }
      }));

      return $res || utils.trueInstance;
    };

    // TODO: implements hash

    spec.species = function() {
      return SCArray;
    };

    spec.do = function() {
      return this._subclassResponsibility("do");
    };

    // TODO: implements iter

    spec.size = function() {
      var tally = 0;

      this.do($SC.Function(function() {
        tally++;
      }));

      return $SC.Integer(tally);
    };

    spec.flatSize = function() {
      return this.sum($SC.Function(function($_) {
        return $_.flatSize();
      }));
    };

    spec.isEmpty = function() {
      return $SC.Boolean(this.size().__int__() === 0);
    };

    spec.notEmpty = function() {
      return $SC.Boolean(this.size().__int__() !== 0);
    };

    spec.asCollection = utils.nop;
    spec.isCollection = utils.alwaysReturn$True;

    spec.add = function() {
      return this._subclassResponsibility("add");
    };

    spec.addAll = function($aCollection) {
      var $this = this;

      $aCollection = utils.defaultValue$Nil($aCollection);
      $aCollection.asCollection().do($SC.Function(function($item) {
        return $this.add($item);
      }));

      return this;
    };

    spec.remove = function() {
      return this._subclassResponsibility("remove");
    };

    spec.removeAll = function($list) {
      var $this = this;

      $list = utils.defaultValue$Nil($list);
      $list.do($SC.Function(function($item) {
        $this.remove($item);
      }));

      return this;
    };

    spec.removeEvery = function($list) {
      this.removeAllSuchThat($SC.Function(function($_) {
        return $list.includes($_);
      }));
      return this;
    };

    spec.removeAllSuchThat = function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($SC.Function(function($item) {
        if (bool($function.value($item))) {
          $this.remove($item);
          $removedItems = $removedItems.add($item);
        }
      }));

      return $removedItems;
    };

    spec.atAll = function($keys) {
      var $this = this;

      return $keys.collect($SC.Function(function($index) {
        return $this.at($index);
      }));
    };

    spec.putEach = function($keys, $values) {
      var keys, values, i, imax;
      $keys   = utils.defaultValue$Nil($keys);
      $values = utils.defaultValue$Nil($values);

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    };

    spec.includes = function($item1) {
      var $res = null;
      $item1 = utils.defaultValue$Nil($item1);

      this.do($SC.Function(function($item2) {
        if ($item1 === $item2) {
          $res = utils.trueInstance;
          return 65535;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.includesEqual = function($item1) {
      var $res = null;
      $item1 = utils.defaultValue$Nil($item1);

      this.do($SC.Function(function($item2) {
        if (bool( $item1 ["=="] ($item2) )) {
          $res = utils.trueInstance;
          return 65535;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.includesAny = function($aCollection) {
      var $this = this, $res = null;
      $aCollection = utils.defaultValue$Nil($aCollection);

      $aCollection.do($SC.Function(function($item) {
        if (bool($this.includes($item))) {
          $res = utils.trueInstance;
          return 65535;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.includesAll = function($aCollection) {
      var $this = this, $res = null;
      $aCollection = utils.defaultValue$Nil($aCollection);

      $aCollection.do($SC.Function(function($item) {
        if (!bool($this.includes($item))) {
          $res = utils.falseInstance;
          return 65535;
        }
      }));

      return $res || utils.trueInstance;
    };

    spec.matchItem = function($item) {
      return this.includes($item);
    };

    spec.collect = function($function) {
      return this.collectAs($function, this.species());
    };

    spec.select = function($function) {
      return this.selectAs($function, this.species());
    };

    spec.reject = function($function) {
      return this.rejectAs($function, this.species());
    };

    spec.collectAs = function($function, $class) {
      var $res;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        return $res.add($function.value($elem, $i));
      }));

      return $res;
    };

    spec.selectAs = function($function, $class) {
      var $res;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    };

    spec.rejectAs = function($function, $class) {
      var $res;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (!bool($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    };

    spec.detect = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $elem;
          return 65535;
        }
      }));

      return $res || $nil;
    };

    spec.detectIndex = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $i;
          return 65535;
        }
      }));
      return $res || $nil;
    };

    spec.doMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      this.do($SC.Function(function($item) {
        $item.perform.apply($item, args);
      }));
      return this;
    };

    spec.collectMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      return this.collect($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.selectMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      return this.select($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.rejectMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      return this.reject($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.detectMsg = fn(function($selector, $$args) {
      $selector = utils.defaultValue$Nil($selector);

      return this.detect($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector,*args");

    spec.detectIndexMsg = fn(function($selector, $$args) {
      $selector = utils.defaultValue$Nil($selector);

      return this.detectIndex($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector,*args");

    spec.lastForWhich = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $elem;
        } else {
          return 65535;
        }
      }));

      return $res || $nil;
    };

    spec.lastIndexForWhich = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $i;
        } else {
          return 65535;
        }
      }));

      return $res || $nil;
    };

    spec.inject = function($thisValue, $function) {
      var $nextValue;
      $thisValue = utils.defaultValue$Nil($thisValue);
      $function  = utils.defaultValue$Nil($function);

      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    };

    spec.injectr = function($thisValue, $function) {
      var $this = this, size, $nextValue;
      $thisValue = utils.defaultValue$Nil($thisValue);
      $function  = utils.defaultValue$Nil($function);

      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $item = $this.at($SC.Integer(--size));
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    };

    spec.count = function($function) {
      var sum = 0;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    };

    spec.occurrencesOf = function($obj) {
      var sum = 0;
      $obj = utils.defaultValue$Nil($obj);

      this.do($SC.Function(function($elem) {
        if (bool($elem ["=="] ($obj))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    };

    spec.any = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = utils.trueInstance;
          return 65535;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.every = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (!bool($function.value($elem, $i))) {
          $res = utils.falseInstance;
          return 65535;
        }
      }));

      return $res || utils.trueInstance;
    };

    spec.sum = function($function) {
      var $sum;
      $function = utils.defaultValue$Nil($function);

      $sum = $int0;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          $sum = $sum ["+"] ($elem);
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          $sum = $sum ["+"] ($function.value($elem, $i));
        }));
      }

      return $sum;
    };

    spec.mean = function($function) {
      return this.sum($function) ["/"] (this.size());
    };

    spec.product = function($function) {
      var $product;
      $function = utils.defaultValue$Nil($function);

      $product = $int1;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          $product = $product ["*"] ($elem);
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          $product = $product ["*"] ($function.value($elem, $i));
        }));
      }

      return $product;
    };

    spec.sumabs = function() {
      var $sum;

      $sum = $int0;
      this.do($SC.Function(function($elem) {
        if (bool($elem.isSequenceableCollection())) {
          $elem = $elem.at($int0);
        }
        $sum = $sum ["+"] ($elem.abs());
      }));

      return $sum;
    };

    spec.maxItem = function($function) {
      var $maxValue, $maxElement;
      $function = utils.defaultValue$Nil($function);

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          if ($maxElement === $nil) {
            $maxElement = $elem;
          } else if ($elem > $maxElement) {
            $maxElement = $elem;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxElement = $elem;
            }
          }
        }));
      }

      return $maxElement;
    };

    spec.minItem = function($function) {
      var $minValue, $minElement;
      $function = utils.defaultValue$Nil($function);

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          if ($minElement === $nil) {
            $minElement = $elem;
          } else if ($elem < $minElement) {
            $minElement = $elem;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($minValue === $nil) {
            $minValue = $function.value($elem, $i);
            $minElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $minValue) {
              $minValue = $val;
              $minElement = $elem;
            }
          }
        }));
      }

      return $minElement;
    };

    spec.maxIndex = function($function) {
      var $maxValue, $maxIndex;
      $function = utils.defaultValue$Nil($function);

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $maxIndex = $index;
          } else if ($elem > $maxValue) {
            $maxValue = $elem;
            $maxIndex = $index;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxIndex = $i;
            }
          }
        }));
      }

      return $maxIndex;
    };

    spec.minIndex = function($function) {
      var $maxValue, $minIndex;
      $function = utils.defaultValue$Nil($function);

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $minIndex = $index;
          } else if ($elem < $maxValue) {
            $maxValue = $elem;
            $minIndex = $index;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $minIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $maxValue) {
              $maxValue = $val;
              $minIndex = $i;
            }
          }
        }));
      }

      return $minIndex;
    };

    spec.maxValue = function($function) {
      var $maxValue, $maxElement;
      $function = utils.defaultValue$Nil($function);

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($SC.Function(function($elem, $i) {
        var $val;
        if ($maxValue === $nil) {
          $maxValue = $function.value($elem, $i);
          $maxElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val > $maxValue) {
            $maxValue = $val;
            $maxElement = $elem;
          }
        }
      }));

      return $maxValue;
    };

    spec.minValue = function($function) {
      var $minValue, $minElement;
      $function = utils.defaultValue$Nil($function);

      $minValue   = $nil;
      $minElement = $nil;
      this.do($SC.Function(function($elem, $i) {
        var $val;
        if ($minValue === $nil) {
          $minValue = $function.value($elem, $i);
          $minElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val < $minValue) {
            $minValue = $val;
            $minElement = $elem;
          }
        }
      }));

      return $minValue;
    };

    spec.maxSizeAtDepth = function($rank) {
      var rank, maxsize = 0;
      $rank = utils.defaultValue$Nil($rank);

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($SC.Function(function($sublist) {
        var sz;
        if (bool($sublist.isCollection())) {
          sz = $sublist.maxSizeAtDepth($SC.Integer(rank - 1));
        } else {
          sz = 1;
        }
        if (sz > maxsize) {
          maxsize = sz;
        }
      }));

      return $SC.Integer(maxsize);
    };

    spec.maxDepth = function($max) {
      var $res;
      $max = utils.defaultValue$Integer($max, 1);

      $res = $max;
      this.do($SC.Function(function($elem) {
        if (bool($elem.isCollection())) {
          $res = $res.max($elem.maxDepth($max.__inc__()));
        }
      }));

      return $res;
    };

    spec.deepCollect = function($depth, $function, $index, $rank) {
      $depth    = utils.defaultValue$Integer($depth, 1);
      $function = utils.defaultValue$Nil($function);
      $index    = utils.defaultValue$Integer($index, 0);
      $rank     = utils.defaultValue$Integer($rank, 0);

      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($SC.Function(function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($SC.Function(function($item, $i) {
        return $item.deepCollect($depth, $function, $i, $rank);
      }));
    };

    spec.deepDo = function($depth, $function, $index, $rank) {
      $depth    = utils.defaultValue$Integer($depth, 1);
      $function = utils.defaultValue$Nil($function);
      $index    = utils.defaultValue$Integer($index, 0);
      $rank     = utils.defaultValue$Integer($rank, 0);

      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($SC.Function(function($item, $i) {
          $item.deepDo($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($SC.Function(function($item, $i) {
        $item.deepDo($depth, $function, $i, $rank);
      }));
    };

    spec.invert = function($axis) {
      var $index;
      $axis = utils.defaultValue$Nil($axis);

      if (bool(this.isEmpty())) {
        return this.species().new();
      }
      if ($axis !== $nil) {
        $index = $axis ["*"] ($SC.Integer(2));
      } else {
        $index = this.minItem() ["+"] (this.maxItem());
      }

      return $index ["-"] (this);
    };

    spec.sect = function($that) {
      var $result;
      $that = utils.defaultValue$Nil($that);

      $result = this.species().new();
      this.do($SC.Function(function($item) {
        if (bool($that.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    };

    spec.union = function($that) {
      var $result;
      $that = utils.defaultValue$Nil($that);

      $result = this.copy();
      $that.do($SC.Function(function($item) {
        if (!bool($result.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    };

    spec.difference = function($that) {
      return this.copy().removeAll($that);
    };

    spec.symmetricDifference = function($that) {
      var $this = this, $result;
      $that = utils.defaultValue$Nil($that);

      $result = this.species().new();
      $this.do($SC.Function(function($item) {
        if (!bool($that.includes($item))) {
          $result = $result.add($item);
        }
      }));
      $that.do($SC.Function(function($item) {
        if (!bool($this.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    };

    spec.isSubsetOf = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $that.includesAll(this);
    };

    spec.asArray = function() {
      return SCArray.new(this.size()).addAll(this);
    };

    spec.asBag = function() {
      return $SC.Class("Bag").new(this.size()).addAll(this);
    };

    spec.asList = function() {
      return $SC.Class("List").new(this.size()).addAll(this);
    };

    spec.asSet = function() {
      return $SC.Class("Set").new(this.size()).addAll(this);
    };

    spec.asSortedList = function($function) {
      return $SC.Class("SortedList").new(this.size(), $function).addAll(this);
    };

    // TODO: implements powerset
    // TODO: implements flopDict
    // TODO: implements histo
    // TODO: implements printAll
    // TODO: implements printcsAll
    // TODO: implements dumpAll
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
    // TODO: implements writeDef
    // TODO: implements writeInputSpec
    // TODO: implements case
    // TODO: implements makeEnvirValPairs
  });

})(sc);

// src/sc/lang/classlib/Collections/SequenceableCollection.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("SequenceableCollection", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;

    spec["|@|"] = function($index) {
      return this.clipAt($index);
    };

    spec["@@"] = function($index) {
      return this.wrapAt($index);
    };

    spec["@|@"] = function($index) {
      return this.foldAt($index);
    };

    spec.$series = function($size, $start, $step) {
      var $obj, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $start = utils.defaultValue$Integer($start, 0);
      $step  = utils.defaultValue$Integer($step, 1);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start ["+"] ($step ["*"] ($SC.Integer(i))));
      }

      return $obj;
    };

    spec.$geom = function($size, $start, $grow) {
      var $obj, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $start = utils.defaultValue$Nil($start);
      $grow  = utils.defaultValue$Nil($grow);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start);
        $start = $start ["*"] ($grow);
      }

      return $obj;
    };

    spec.$fib = function($size, $a, $b) {
      var $obj, $temp, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $a = utils.defaultValue$Float($a, 0.0);
      $b = utils.defaultValue$Float($b, 1.0);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($b);
        $temp = $b;
        $b = $a ["+"] ($b);
        $a = $temp;
      }

      return $obj;
    };

    // TODO: implements $rand
    // TODO: implements $rand2
    // TODO: implements $linrand

    spec.$interpolation = function($size, $start, $end) {
      var $obj, $step, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $start = utils.defaultValue$Float($start, 0.0);
      $end   = utils.defaultValue$Float($end  , 1.0);

      $obj = this.new($size);
      if ($size.__int__() === 1) {
        return $obj.add($start);
      }

      $step = ($end ["-"] ($start)) ["/"] ($size.__dec__());
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start ["+"] ($SC.Integer(i) ["*"] ($step)));
      }

      return $obj;
    };

    spec["++"] = function($aSequenceableCollection) {
      var $newlist;
      $aSequenceableCollection = utils.defaultValue$Nil($aSequenceableCollection);

      $newlist = this.species().new(this.size() ["+"] ($aSequenceableCollection.size()));
      $newlist = $newlist.addAll(this).addAll($aSequenceableCollection);

      return $newlist;
    };

    // TODO: implements +++

    spec.asSequenceableCollection = utils.nop;

    spec.choose = function() {
      return this.at(this.size().rand());
    };

    spec.wchoose = function($weights) {
      $weights = utils.defaultValue$Nil($weights);
      return this.at($weights.windex());
    };

    spec["=="] = function($aCollection) {
      var $res = null;
      $aCollection = utils.defaultValue$Nil($aCollection);

      if ($aCollection.class() !== this.class()) {
        return utils.falseInstance;
      }
      if (this.size() !== $aCollection.size()) {
        return utils.falseInstance;
      }
      this.do($SC.Function(function($item, $i) {
        if (bool($item ["!="] ($aCollection.at($i)))) {
          $res = utils.falseInstance;
          return 65535;
        }
      }));

      return $res || utils.trueInstance;
    };

    // TODO: implements hash

    spec.copyRange = function($start, $end) {
      var $newColl, i, end;
      $start = utils.defaultValue$Nil($start);
      $end   = utils.defaultValue$Nil($end);

      i = $start.__int__();
      end = $end.__int__();
      $newColl = this.species().new($SC.Integer(end - i));
      while (i <= end) {
        $newColl.add(this.at($SC.Integer(i++)));
      }

      return $newColl;
    };

    spec.keep = function($n) {
      var n, size;
      $n = utils.defaultValue$Nil($n);

      n = $n.__int__();
      if (n >= 0) {
        return this.copyRange($int0, $SC.Integer(n - 1));
      }
      size = this.size().__int__();

      return this.copyRange($SC.Integer(size + n), $SC.Integer(size - 1));
    };

    spec.drop = function($n) {
      var n, size;
      $n = utils.defaultValue$Nil($n);

      n = $n.__int__();
      size = this.size().__int__();
      if (n >= 0) {
        return this.copyRange($n, $SC.Integer(size - 1));
      }

      return this.copyRange($int0, $SC.Integer(size + n - 1));
    };

    spec.copyToEnd = function($start) {
      return this.copyRange($start, $SC.Integer(this.size().__int__() - 1));
    };

    spec.copyFromStart = function($end) {
      return this.copyRange($int0, $end);
    };

    spec.indexOf = function($item) {
      var $ret = null;
      $item = utils.defaultValue$Nil($item);

      this.do($SC.Function(function($elem, $i) {
        if ($item === $elem) {
          $ret = $i;
          return 65535;
        }
      }));

      return $ret || $nil;
    };

    spec.indicesOfEqual = function($item) {
      var indices = [];
      $item = utils.defaultValue$Nil($item);

      this.do($SC.Function(function($elem, $i) {
        if ($item === $elem) {
          indices.push($i);
        }
      }));

      return indices.length ? $SC.Array(indices) : $nil;
    };

    spec.find = function($sublist, $offset) {
      var $subSize_1, $first, $index;
      var size, offset, i, imax;
      $sublist = utils.defaultValue$Nil($sublist);
      $offset  = utils.defaultValue$Integer($offset, 0);

      $subSize_1 = $sublist.size().__dec__();
      $first = $sublist.first();

      size   = this.size().__int__();
      offset = $offset.__int__();
      for (i = 0, imax = size - offset; i < imax; ++i) {
        $index = $SC.Integer(i + offset);
        if (bool(this.at($index) ["=="] ($first))) {
          if (bool(this.copyRange($index, $index ["+"] ($subSize_1)) ["=="] ($sublist))) {
            return $index;
          }
        }
      }

      return $nil;
    };

    spec.findAll = function($arr, $offset) {
      var $this = this, $indices, $i;
      $arr    = utils.defaultValue$Nil($arr);
      $offset = utils.defaultValue$Integer($offset, 0);

      $indices = $nil;
      $i = $int0;

      while (($i = $this.find($arr, $offset)) !== $nil) {
        $indices = $indices.add($i);
        $offset = $i.__inc__();
      }

      return $indices;
    };

    spec.indexOfGreaterThan = function($val) {
      $val = utils.defaultValue$Nil($val);
      return this.detectIndex($SC.Function(function($item) {
        return $SC.Boolean($item > $val);
      }));
    };

    spec.indexIn = function($val) {
      var $i, $j;
      $val = utils.defaultValue$Nil($val);

      $j = this.indexOfGreaterThan($val);
      if ($j === $nil) {
        return this.size().__dec__();
      }
      if ($j === $int0) {
        return $j;
      }

      $i = $j.__dec__();

      if ($val ["-"] (this.at($i)) < this.at($j) ["-"] ($val)) {
        return $i;
      }

      return $j;
    };

    spec.indexInBetween = function($val) {
      var $a, $b, $div, $i;
      $val = utils.defaultValue$Nil($val);

      if (bool(this.isEmpty())) {
        return $nil;
      }
      $i = this.indexOfGreaterThan($val);

      if ($i === $nil) {
        return this.size().__dec__();
      }
      if ($i === $int0) {
        return $i;
      }

      $a = this.at($i.__dec__());
      $b = this.at($i);
      $div = $b ["-"] ($a);

      // if (bool($div ["=="] ($int0))) {
      //   return $i;
      // }

      return (($val ["-"] ($a)) ["/"] ($div)) ["+"] ($i.__dec__());
    };

    spec.isSeries = function($step) {
      var $res = null;
      $step = utils.defaultValue$Nil($step);

      if (this.size() <= 1) {
        return utils.trueInstance;
      }
      this.doAdjacentPairs($SC.Function(function($a, $b) {
        var $diff = $b ["-"] ($a);
        if ($step === $nil) {
          $step = $diff;
        } else if (bool($step ["!="] ($diff))) {
          $res = utils.falseInstance;
          return 65535;
        }
      }));

      return $res || utils.trueInstance;
    };

    spec.resamp0 = function($newSize) {
      var $this = this, $factor;
      $newSize = utils.defaultValue$Nil($newSize);

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int1)
      );

      return this.species().fill($newSize, $SC.Function(function($i) {
        return $this.at($i ["*"] ($factor).round($SC.Float(1.0)).asInteger());
      }));
    };

    spec.resamp1 = function($newSize) {
      var $this = this, $factor;
      $newSize = utils.defaultValue$Nil($newSize);

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int1)
      );

      return this.species().fill($newSize, $SC.Function(function($i) {
        return $this.blendAt($i ["*"] ($factor));
      }));
    };

    spec.remove = function($item) {
      var $index;
      $item = utils.defaultValue$Nil($item);

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.removeAt($index);
      }

      return $nil;
    };

    spec.removing = function($item) {
      var $coll;
      $item = utils.defaultValue$Nil($item);

      $coll = this.copy();
      $coll.remove($item);

      return $coll;
    };

    spec.take = function($item) {
      var $index;
      $item = utils.defaultValue$Nil($item);

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.takeAt($index);
      }

      return $nil;
    };

    spec.lastIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $SC.Integer(size - 1);
      }

      return $nil;
    };

    spec.middleIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $SC.Integer((size - 1) >> 1);
      }

      return $nil;
    };

    spec.first = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($int0);
      }

      return $nil;
    };

    spec.last = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($SC.Integer(size - 1));
      }

      return $nil;
    };

    spec.middle = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($SC.Integer((size - 1) >> 1));
      }

      return $nil;
    };

    spec.top = function() {
      return this.last();
    };

    spec.putFirst = function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($int0, $obj);
      }

      return this;
    };

    spec.putLast = function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($SC.Integer(size - 1), $obj);
      }

      return this;
    };

    spec.obtain = function($index, $default) {
      var $res;
      $index   = utils.defaultValue$Nil($index);
      $default = utils.defaultValue$Nil($default);

      $res = this.at($index);
      if ($res === $nil) {
        $res = $default;
      }

      return $res;
    };

    spec.instill = function($index, $item, $default) {
      var $res;
      $index   = utils.defaultValue$Nil($index);
      $item    = utils.defaultValue$Nil($item);
      $default = utils.defaultValue$Nil($default);

      if ($index.__num__() >= this.size()) {
        $res = this.extend($index.__inc__(), $default);
      } else {
        $res = this.copy();
      }

      return $res.put($index, $item);
    };

    spec.pairsDo = function($function) {
      var $this = this, $int2 = $SC.Integer(2);
      $function = utils.defaultValue$Nil($function);

      $int0.forBy(this.size() ["-"] ($int2), $int2, $SC.Function(function($i) {
        return $function.value($this.at($i), $this.at($i.__inc__()), $i);
      }));

      return this;
    };

    spec.keysValuesDo = function($function) {
      return this.pairsDo($function);
    };

    spec.doAdjacentPairs = function($function) {
      var $i;
      var size, i, imax;
      $function = utils.defaultValue$Nil($function);

      size = this.size().__int__();
      for (i = 0, imax = size - 1; i < imax; ++i) {
        $i = $SC.Integer(i);
        $function.value(this.at($i), this.at($i.__inc__()), $i);
      }

      return this;
    };

    spec.separate = function($function) {
      var $this = this, $list, $sublist;
      $function = utils.defaultValue$Boolean($function, true);

      $list = $SC.Array();
      $sublist = this.species().new();
      this.doAdjacentPairs($SC.Function(function($a, $b, $i) {
        $sublist = $sublist.add($a);
        if (bool($function.value($a, $b, $i))) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        }
      }));
      if (bool(this.notEmpty())) {
        $sublist = $sublist.add(this.last());
      }
      $list = $list.add($sublist);

      return $list;
    };

    spec.delimit = function($function) {
      var $this = this, $list, $sublist;
      $function = utils.defaultValue$Nil($function);

      $list = $SC.Array();
      $sublist = this.species().new();
      this.do($SC.Function(function($item, $i) {
        if (bool($function.value($item, $i))) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        } else {
          $sublist = $sublist.add($item);
        }
      }));
      $list = $list.add($sublist);

      return $list;
    };

    spec.clump = function($groupSize) {
      var $this = this, $list, $sublist;
      $groupSize = utils.defaultValue$Nil($groupSize);

      $list = $SC.Array();
      $sublist = this.species().new($groupSize);
      this.do($SC.Function(function($item) {
        $sublist.add($item);
        if ($sublist.size() >= $groupSize) {
          $list.add($sublist);
          $sublist = $this.species().new($groupSize);
        }
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    };

    spec.clumps = function($groupSizeList) {
      var $this = this, $list, $subSize, $sublist, i = 0;
      $groupSizeList = utils.defaultValue$Nil($groupSizeList);

      $list = $SC.Array();
      $subSize = $groupSizeList.at($int0);
      $sublist = this.species().new($subSize);
      this.do($SC.Function(function($item) {
        $sublist = $sublist.add($item);
        if ($sublist.size() >= $subSize) {
          $list = $list.add($sublist);
          $subSize = $groupSizeList.wrapAt($SC.Integer(++i));
          $sublist = $this.species().new($subSize);
        }
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    };

    spec.curdle = function($probability) {
      $probability = utils.defaultValue$Nil($probability);
      return this.separate($SC.Function(function() {
        return $probability.coin();
      }));
    };

    spec.flatten = function($numLevels) {
      $numLevels = utils.defaultValue$Integer($numLevels, 1);
      return this._flatten($numLevels.__num__());
    };

    spec._flatten = function(numLevels) {
      var $list;

      if (numLevels <= 0) {
        return this;
      }
      numLevels = numLevels - 1;

      $list = this.species().new();
      this.do($SC.Function(function($item) {
        if ($item._flatten) {
          $list = $list.addAll($item._flatten(numLevels));
        } else {
          $list = $list.add($item);
        }
      }));

      return $list;
    };

    spec.flat = function() {
      return this._flat(this.species().new(this.flatSize()));
    };

    spec._flat = function($list) {
      this.do($SC.Function(function($item) {
        if ($item._flat) {
          $list = $item._flat($list);
        } else {
          $list = $list.add($item);
        }
      }));
      return $list;
    };

    spec.flatIf = function($func) {
      $func = utils.defaultValue$Nil($func);
      return this._flatIf($func);
    };

    spec._flatIf = function($func) {
      var $list;

      $list = this.species().new(this.size());
      this.do($SC.Function(function($item, $i) {
        if ($item._flatIf && bool($func.value($item, $i))) {
          $list = $list.addAll($item._flatIf($func));
        } else {
          $list = $list.add($item);
        }
      }));

      return $list;
    };

    spec.flop = function() {
      var $this = this, $list, $size, $maxsize;

      $size = this.size();
      $maxsize = $int0;
      this.do($SC.Function(function($sublist) {
        var $sz;
        if (bool($sublist.isSequenceableCollection())) {
          $sz = $sublist.size();
        } else {
          $sz = $int1;
        }
        if ($sz > $maxsize) {
          $maxsize = $sz;
        }
      }));

      $list = this.species().fill($maxsize, $SC.Function(function() {
        return $this.species().new($size);
      }));

      this.do($SC.Function(function($isublist) {
        if (bool($isublist.isSequenceableCollection())) {
          $list.do($SC.Function(function($jsublist, $j) {
            $jsublist.add($isublist.wrapAt($j));
          }));
        } else {
          $list.do($SC.Function(function($jsublist) {
            $jsublist.add($isublist);
          }));
        }
      }));

      return $list;
    };

    spec.flopWith = function($func) {
      var $this = this, $maxsize;
      $func = utils.defaultValue$Nil($func);

      $maxsize = this.maxValue($SC.Function(function($sublist) {
        if (bool($sublist.isSequenceableCollection())) {
          return $sublist.size();
        }
        return $int1;
      }));

      return this.species().fill($maxsize, $SC.Function(function($i) {
        return $func.valueArray($this.collect($SC.Function(function($sublist) {
          if (bool($sublist.isSequenceableCollection())) {
            return $sublist.wrapAt($i);
          } else {
            return $sublist;
          }
        })));
      }));
    };

    // TODO: implements flopTogether
    // TODO: implements flopDeep
    // TODO: implements wrapAtDepth
    // TODO: implements unlace
    // TODO: implements integrate
    // TODO: implements differentiate
    // TODO: implements convertDigits
    // TODO: implements hammingDistance
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInScale
    // TODO: implements nearestInList
    // TODO: implements transposeKey
    // TODO: implements mode
    // TODO: implements performDegreeToKey
    // TODO: implements performNearestInList
    // TODO: implements performNearestInScale
    // TODO: implements convertRhythm
    // TODO: implements sumRhythmDivisions
    // TODO: implements convertOneRhythm

    spec.isSequenceableCollection = utils.alwaysReturn$True;

    spec.containsSeqColl = function() {
      return this.any($SC.Function(function($_) {
        return $_.isSequenceableCollection();
      }));
    };

    spec.neg = function() {
      return this.performUnaryOp($SC.Symbol("neg"));
    };

    spec.bitNot = function() {
      return this.performUnaryOp($SC.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.performUnaryOp($SC.Symbol("abs"));
    };

    spec.ceil = function() {
      return this.performUnaryOp($SC.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.performUnaryOp($SC.Symbol("floor"));
    };

    spec.frac = function() {
      return this.performUnaryOp($SC.Symbol("frac"));
    };

    spec.sign = function() {
      return this.performUnaryOp($SC.Symbol("sign"));
    };

    spec.squared = function() {
      return this.performUnaryOp($SC.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.performUnaryOp($SC.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.performUnaryOp($SC.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.performUnaryOp($SC.Symbol("exp"));
    };

    spec.reciprocal = function() {
      return this.performUnaryOp($SC.Symbol("reciprocal"));
    };

    spec.midicps = function() {
      return this.performUnaryOp($SC.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.performUnaryOp($SC.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.performUnaryOp($SC.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.performUnaryOp($SC.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.performUnaryOp($SC.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.performUnaryOp($SC.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.performUnaryOp($SC.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.performUnaryOp($SC.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.performUnaryOp($SC.Symbol("log"));
    };

    spec.log2 = function() {
      return this.performUnaryOp($SC.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.performUnaryOp($SC.Symbol("log10"));
    };

    spec.sin = function() {
      return this.performUnaryOp($SC.Symbol("sin"));
    };

    spec.cos = function() {
      return this.performUnaryOp($SC.Symbol("cos"));
    };

    spec.tan = function() {
      return this.performUnaryOp($SC.Symbol("tan"));
    };

    spec.asin = function() {
      return this.performUnaryOp($SC.Symbol("asin"));
    };

    spec.acos = function() {
      return this.performUnaryOp($SC.Symbol("acos"));
    };

    spec.atan = function() {
      return this.performUnaryOp($SC.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.performUnaryOp($SC.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.performUnaryOp($SC.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.performUnaryOp($SC.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.performUnaryOp($SC.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.performUnaryOp($SC.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.performUnaryOp($SC.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.performUnaryOp($SC.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.performUnaryOp($SC.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.performUnaryOp($SC.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.performUnaryOp($SC.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.performUnaryOp($SC.Symbol("coin"));
    };

    spec.even = function() {
      return this.performUnaryOp($SC.Symbol("even"));
    };

    spec.odd = function() {
      return this.performUnaryOp($SC.Symbol("odd"));
    };

    spec.isPositive = function() {
      return this.performUnaryOp($SC.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.performUnaryOp($SC.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.performUnaryOp($SC.Symbol("isStrictlyPositive"));
    };

    spec.rectWindow = function() {
      return this.performUnaryOp($SC.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.performUnaryOp($SC.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.performUnaryOp($SC.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.performUnaryOp($SC.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.performUnaryOp($SC.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.performUnaryOp($SC.Symbol("ramp"));
    };

    spec.asFloat = function() {
      return this.performUnaryOp($SC.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.performUnaryOp($SC.Symbol("asInteger"));
    };

    spec.nthPrime = function() {
      return this.performUnaryOp($SC.Symbol("nthPrime"));
    };

    spec.prevPrime = function() {
      return this.performUnaryOp($SC.Symbol("prevPrime"));
    };

    spec.nextPrime = function() {
      return this.performUnaryOp($SC.Symbol("nextPrime"));
    };

    spec.indexOfPrime = function() {
      return this.performUnaryOp($SC.Symbol("indexOfPrime"));
    };

    spec.real = function() {
      return this.performUnaryOp($SC.Symbol("real"));
    };

    spec.imag = function() {
      return this.performUnaryOp($SC.Symbol("imag"));
    };

    spec.magnitude = function() {
      return this.performUnaryOp($SC.Symbol("magnitude"));
    };

    spec.magnitudeApx = function() {
      return this.performUnaryOp($SC.Symbol("magnitudeApx"));
    };

    spec.phase = function() {
      return this.performUnaryOp($SC.Symbol("phase"));
    };

    spec.angle = function() {
      return this.performUnaryOp($SC.Symbol("angle"));
    };

    spec.rho = function() {
      return this.performUnaryOp($SC.Symbol("rho"));
    };

    spec.theta = function() {
      return this.performUnaryOp($SC.Symbol("theta"));
    };

    spec.degrad = function() {
      return this.performUnaryOp($SC.Symbol("degrad"));

    };
    spec.raddeg = function() {
      return this.performUnaryOp($SC.Symbol("raddeg"));
    };

    spec["+"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("+"), $aNumber, $adverb);
    };

    spec["-"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("-"), $aNumber, $adverb);
    };

    spec["*"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("*"), $aNumber, $adverb);
    };

    spec["/"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("/"), $aNumber, $adverb);
    };

    spec.div = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("div"), $aNumber, $adverb);
    };

    spec.mod = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("mod"), $aNumber, $adverb);
    };

    spec.pow = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("pow"), $aNumber, $adverb);
    };

    spec.min = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("min"), $aNumber, $adverb);
    };

    spec.max = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("max"), $aNumber, $adverb);
    };

    spec["<"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("<"), $aNumber, $adverb);
    };

    spec["<="] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("<="), $aNumber, $adverb);
    };

    spec[">"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol(">"), $aNumber, $adverb);
    };

    spec[">="] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol(">="), $aNumber, $adverb);
    };

    spec.bitAnd = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitAnd"), $aNumber, $adverb);
    };

    spec.bitOr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitOr"), $aNumber, $adverb);
    };

    spec.bitXor = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitXor"), $aNumber, $adverb);
    };

    spec.bitHammingDistance = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitHammingDistance"), $aNumber, $adverb);
    };

    spec.lcm = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("lcm"), $aNumber, $adverb);
    };

    spec.gcd = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("gcd"), $aNumber, $adverb);
    };

    spec.round = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("round"), $aNumber, $adverb);
    };

    spec.roundUp = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("roundUp"), $aNumber, $adverb);
    };

    spec.trunc = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("trunc"), $aNumber, $adverb);
    };

    spec.atan2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("atan2"), $aNumber, $adverb);
    };

    spec.hypot = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("hypot"), $aNumber, $adverb);
    };

    spec.hypotApx = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("hypotApx"), $aNumber, $adverb);
    };

    spec.leftShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("leftShift"), $aNumber, $adverb);
    };

    spec.rightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("rightShift"), $aNumber, $adverb);
    };

    spec.unsignedRightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("unsignedRightShift"), $aNumber, $adverb);
    };

    spec.ring1 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring1"), $aNumber, $adverb);
    };

    spec.ring2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring2"), $aNumber, $adverb);
    };

    spec.ring3 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring3"), $aNumber, $adverb);
    };

    spec.ring4 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring4"), $aNumber, $adverb);
    };

    spec.difsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("difsqr"), $aNumber, $adverb);
    };

    spec.sumsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sumsqr"), $aNumber, $adverb);
    };

    spec.sqrsum = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sqrsum"), $aNumber, $adverb);
    };

    spec.sqrdif = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sqrdif"), $aNumber, $adverb);
    };

    spec.absdif = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("absdif"), $aNumber, $adverb);
    };

    spec.thresh = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("thresh"), $aNumber, $adverb);
    };

    spec.amclip = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("amclip"), $aNumber, $adverb);
    };

    spec.scaleneg = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("scaleneg"), $aNumber, $adverb);
    };

    spec.clip2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("clip2"), $aNumber, $adverb);
    };

    spec.fold2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("fold2"), $aNumber, $adverb);
    };

    spec.wrap2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("wrap2"), $aNumber, $adverb);
    };

    spec.excess = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("excess"), $aNumber, $adverb);
    };

    spec.firstArg = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("firstArg"), $aNumber, $adverb);
    };

    spec.rrand = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("rrand"), $aNumber, $adverb);
    };

    spec.exprand = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("exprand"), $aNumber, $adverb);
    };

    spec.performUnaryOp = function($aSelector) {
      return this.collect($SC.Function(function($item) {
        return $item.perform($aSelector);
      }));
    };

    spec.performBinaryOp = function($aSelector, $theOperand, $adverb) {
      $theOperand = utils.defaultValue$Nil($theOperand);
      return $theOperand.performBinaryOpOnSeqColl($aSelector, this, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $theOperand, $adverb) {
      var adverb;
      $aSelector  = utils.defaultValue$Nil($aSelector);
      $theOperand = utils.defaultValue$Nil($theOperand);
      $adverb     = utils.defaultValue$Nil($adverb);

      if ($adverb === $nil) {
        return _performBinaryOpOnSeqColl_adverb_nil(
          this, $aSelector, $theOperand
        );
      }
      if (bool($adverb.isInteger())) {
        return _performBinaryOpOnSeqColl_adverb_int(
          this, $aSelector, $theOperand, $adverb.valueOf()
        );
      }

      adverb = $adverb.__sym__();
      if (adverb === "t") {
        return _performBinaryOpOnSeqColl_adverb_t(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "x") {
        return _performBinaryOpOnSeqColl_adverb_x(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "s") {
        return _performBinaryOpOnSeqColl_adverb_s(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "f") {
        return _performBinaryOpOnSeqColl_adverb_f(
          this, $aSelector, $theOperand
        );
      }

      throw new Error(
        "unrecognized adverb: '" + adverb + "' for operator '" + String($aSelector) + "'"
      );
    };

    function _performBinaryOpOnSeqColl_adverb_nil($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().max($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add(
          $theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i))
        );
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_int($this, $aSelector, $theOperand, adverb) {
      var $size, $newList, $i;
      var size, i;

      if (adverb === 0) {
        $size = $this.size().max($theOperand.size());
        $newList = $this.species().new($size);

        size = $size.__int__();
        for (i = 0; i < size; ++i) {
          $i = $SC.Integer(i);
          $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
        }

      } else if (adverb > 0) {

        $newList = $theOperand.collect($SC.Function(function($item) {
          return $item.perform($aSelector, $this, $SC.Integer(adverb - 1));
        }));

      } else {

        $newList = $this.collect($SC.Function(function($item) {
          return $theOperand.perform($aSelector, $item, $SC.Integer(adverb + 1));
        }));

      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_t($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $theOperand.size();
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add($theOperand.at($i).perform($aSelector, $this));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_x($this, $aSelector, $theOperand) {
      var $size, $newList;

      $size = $theOperand.size() ["*"] ($this.size());
      $newList = $this.species().new($size);
      $theOperand.do($SC.Function(function($a) {
        $this.do($SC.Function(function($b) {
          $newList.add($a.perform($aSelector, $b));
        }));
      }));

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_s($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().min($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_f($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().max($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add($theOperand.foldAt($i).perform($aSelector, $this.foldAt($i)));
      }

      return $newList;
    }

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      $aNumber = utils.defaultValue$Nil($aNumber);
      return this.collect($SC.Function(function($item) {
        return $aNumber.perform($aSelector, $item, $adverb);
      }));
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      $aComplex = utils.defaultValue$Nil($aComplex);
      return this.collect($SC.Function(function($item) {
        return $aComplex.perform($aSelector, $item, $adverb);
      }));
    };

    spec.asFraction = function($denominator, $fasterBetter) {
      return this.collect($SC.Function(function($item) {
        return $item.asFraction($denominator, $fasterBetter);
      }));
    };

    // TODO: implements asPoint
    // TODO: implements asRect

    spec.ascii = function() {
      return this.collect($SC.Function(function($item) {
        return $item.ascii();
      }));
    };

    spec.rate = function() {
      if (this.size().__int__() === 1) {
        return this.first().rate();
      }
      return this.collect($SC.Function(function($item) {
        return $item.rate();
      })).minItem();
    };

    spec.multiChannelPerform = function() {
      var method;

      if (this.size() > 0) {
        method = utils.getMethod("Object", "multiChannelPerform");
        return method.apply(this, arguments);
      }

      return this.class().new();
    };

    spec.multichannelExpandRef = utils.nop;

    spec.clip = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("clip") ].concat(slice.call(arguments))
      );
    };

    spec.wrap = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("wrap") ].concat(slice.call(arguments))
      );
    };

    spec.fold = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("fold") ].concat(slice.call(arguments))
      );
    };

    spec.linlin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("linlin") ].concat(slice.call(arguments))
      );
    };

    spec.linexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("linexp") ].concat(slice.call(arguments))
      );
    };

    spec.explin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("explin") ].concat(slice.call(arguments))
      );
    };

    spec.expexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("expexp") ].concat(slice.call(arguments))
      );
    };

    spec.lincurve = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lincurve") ].concat(slice.call(arguments))
      );
    };

    spec.curvelin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("curvelin") ].concat(slice.call(arguments))
      );
    };

    spec.bilin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("bilin") ].concat(slice.call(arguments))
      );
    };

    spec.biexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("biexp") ].concat(slice.call(arguments))
      );
    };

    spec.moddif = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("moddif") ].concat(slice.call(arguments))
      );
    };

    spec.range = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("range") ].concat(slice.call(arguments))
      );
    };

    spec.exprange = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("exprange") ].concat(slice.call(arguments))
      );
    };

    spec.curverange = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("curverange") ].concat(slice.call(arguments))
      );
    };

    spec.unipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("unipolar") ].concat(slice.call(arguments))
      );
    };

    spec.bipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("bipolar") ].concat(slice.call(arguments))
      );
    };

    spec.lag = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag") ].concat(slice.call(arguments))
      );
    };

    spec.lag2 = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag2") ].concat(slice.call(arguments))
      );
    };

    spec.lag3 = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag3") ].concat(slice.call(arguments))
      );
    };

    spec.lagud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lagud") ].concat(slice.call(arguments))
      );
    };

    spec.lag2ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag2ud") ].concat(slice.call(arguments))
      );
    };

    spec.lag3ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag3ud") ].concat(slice.call(arguments))
      );
    };

    spec.varlag = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("varlag") ].concat(slice.call(arguments))
      );
    };

    spec.slew = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("slew") ].concat(slice.call(arguments))
      );
    };

    spec.blend = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("blend") ].concat(slice.call(arguments))
      );
    };

    spec.checkBadValues = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("checkBadValues") ].concat(slice.call(arguments))
      );
    };

    spec.prune = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("prune") ].concat(slice.call(arguments))
      );
    };

    // TODO: implements minNyquist
    // TODO: implements sort
    // TODO: implements sortBy
    // TODO: implements sortMap
    // TODO: implements sortedMedian
    // TODO: implements median
    // TODO: implements quickSort
    // TODO: implements order

    spec.swap = function($i, $j) {
      var $temp;
      $i = utils.defaultValue$Nil($i);
      $j = utils.defaultValue$Nil($j);

      $temp = this.at($i);
      this.put($i, this.at($j));
      this.put($j, $temp);

      return this;
    };

    // TODO: implements quickSortRange
    // TODO: implements mergeSort
    // TODO: implements mergeSortTemp
    // TODO: implements mergeTemp
    // TODO: implements insertionSort
    // TODO: implements insertionSortRange
    // TODO: implements hoareMedian
    // TODO: implements hoareFind
    // TODO: implements hoarePartition
    // TODO: implements $streamContensts
    // TODO: implements $streamContenstsLimit

    spec.wrapAt = function($index) {
      $index = utils.defaultValue$Nil($index);
      $index = $index ["%"] (this.size());
      return this.at($index);
    };

    spec.wrapPut = function($index, $value) {
      $index = utils.defaultValue$Nil($index);
      $value = utils.defaultValue$Nil($value);
      $index = $index ["%"] (this.size());
      return this.put($index, $value);
    };

    // TODO: implements reduce
    // TODO: implements join
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements schedBundleArrayOnClock
  });

})(sc);

// src/sc/lang/classlib/Collections/ArrayedCollection.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var fn = sc.lang.fn;
  var rand = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  sc.lang.klass.refine("ArrayedCollection", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.valueOf();
      });
    };

    spec.__elem__ = function(item) {
      return item;
    };

    spec._ThrowIfImmutable = function() {
      if (this._immutable) {
        throw new Error("Attempted write to immutable object.");
      }
    };

    // TODO: implements $newClear
    // TODO: implements indexedSize

    spec.size = function() {
      return $SC.Integer(this._.length);
    };

    // TODO: implements maxSize

    spec.swap = function($a, $b) {
      var raw = this._;
      var a, b, len, tmp;
      $a = utils.defaultValue$Nil($a);
      $b = utils.defaultValue$Nil($b);

      this._ThrowIfImmutable();

      a = $a.__int__();
      b = $b.__int__();
      len = raw.length;

      if (a < 0 || len <= a || b < 0 || len <= b) {
        throw new Error("out of index");
      }

      tmp = raw[b];
      raw[b] = raw[a];
      raw[a] = tmp;

      return this;
    };

    spec.at = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            return $nil;
          }
          return this._[i];
        }, this));
      }

      i = $index.__int__();

      return this._[i] || $nil;
    };

    spec.clipAt = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          i = mathlib.clip_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.clip_idx($index.__int__(), this._.length);

      return this._[i];
    };

    spec.wrapAt = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          var i = mathlib.wrap_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.wrap_idx($index.__int__(), this._.length);

      return this._[i];
    };

    spec.foldAt = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          var i = mathlib.fold_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.fold_idx($index.__int__(), this._.length);

      return this._[i];
    };

    spec.put = function($index, $item) {
      var i;
      $index = utils.defaultValue$Nil($index);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          var i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            throw new Error("out of index");
          }
          this._[i] = this.__elem__($item);
        }, this);
      } else {
        i = $index.__int__();
        if (i < 0 || this._.length <= i) {
          throw new Error("out of index");
        }
        this._[i] = this.__elem__($item);
      }

      return this;
    };

    spec.clipPut = function($index, $item) {
      $index = utils.defaultValue$Nil($index);
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    };

    spec.wrapPut = function($index, $item) {
      $index = utils.defaultValue$Nil($index);
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    };

    spec.foldPut = function($index, $item) {
      $index = utils.defaultValue$Nil($index);
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    };

    spec.removeAt = function($index) {
      var raw = this._;
      var index;
      $index = utils.defaultValue$Nil($index);

      this._ThrowIfImmutable();

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      return raw.splice(index, 1)[0];
    };

    spec.takeAt = function($index) {
      var raw = this._;
      var index, ret, instead;
      $index = utils.defaultValue$Nil($index);

      this._ThrowIfImmutable();

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      ret = raw[index];
      instead = raw.pop();
      if (index !== raw.length) {
        raw[index] = instead;
      }

      return ret;
    };

    spec.indexOf = function($item) {
      var index;
      $item = utils.defaultValue$Nil($item);

      index = this._.indexOf($item);
      return index === -1 ? $nil : $SC.Integer(index);
    };

    spec.indexOfGreaterThan = function($val) {
      var raw = this._;
      var val, i, imax = raw.length;
      $val = utils.defaultValue$Nil($val);

      val = $val.__num__();
      for (i = 0; i < imax; ++i) {
        if (raw[i].__num__() > val) {
          return $SC.Integer(i);
        }
      }

      return $nil;
    };

    spec.takeThese = function($func) {
      var raw = this._;
      var i = 0, $i;
      $func = utils.defaultValue$Nil($func);

      $i = $SC.Integer(i);
      while (i < raw.length) {
        if (bool($func.value(raw[i], $i))) {
          this.takeAt($i);
        } else {
          $i = $SC.Integer(++i);
        }
      }

      return this;
    };

    spec.replace = function($find, $replace) {
      var $index, $out, $array;
      $find    = utils.defaultValue$Nil($find);
      $replace = utils.defaultValue$Nil($replace);

      this._ThrowIfImmutable();

      $out     = $SC.Array();
      $array   = this;
      $find    = $find.asArray();
      $replace = $replace.asArray();
      $SC.Function(function() {
        return ($index = $array.find($find)).notNil();
      }).while($SC.Function(function() {
        $out = $out ["++"] ($array.keep($index)) ["++"] ($replace);
        $array = $array.drop($index ["+"] ($find.size()));
      }));

      return $out ["++"] ($array);
    };

    spec.slotSize = function() {
      return this.size();
    };

    spec.slotAt = function($index) {
      return this.at($index);
    };

    spec.slotPut = function($index, $value) {
      return this.put($index, $value);
    };

    spec.slotKey = function($index) {
      return $index;
    };

    spec.slotIndex = utils.alwaysReturn$Nil;

    spec.getSlots = function() {
      return this.copy();
    };

    spec.setSlots = function($array) {
      $array = utils.defaultValue$Nil($array);
      return this.overWrite($array);
    };

    spec.atModify = function($index, $function) {
      this.put($index, $function.value(this.at($index), $index));
      return this;
    };

    spec.atInc = function($index, $inc) {
      $inc = utils.defaultValue$Integer($inc, 1);
      this.put($index, this.at($index) ["+"] ($inc));
      return this;
    };

    spec.atDec = function($index, $dec) {
      $dec = utils.defaultValue$Integer($dec, 1);
      this.put($index, this.at($index) ["-"] ($dec));
      return this;
    };

    spec.isArray = utils.alwaysReturn$True;
    spec.asArray = utils.nop;

    spec.copyRange = function($start, $end) {
      var start, end, instance, raw;
      $start = utils.defaultValue$Nil($start);
      $end = utils.defaultValue$Nil($end);

      if ($start === $nil) {
        start = 0;
      } else {
        start = $start.__int__();
      }
      if ($end === $nil) {
        end = this._.length;
      } else {
        end = $end.__int__();
      }
      raw = this._.slice(start, end + 1);

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    };

    spec.copySeries = function($first, $second, $last) {
      var i, first, second, last, step, instance, raw;
      $first = utils.defaultValue$Nil($first);
      $second = utils.defaultValue$Nil($second);
      $last = utils.defaultValue$Nil($last);

      raw = [];
      if ($first === $nil) {
        first = 0;
      } else {
        first = $first.__int__();
      }
      if ($second === $nil) {
        second = first + 1;
      } else {
        second = $second.__int__();
      }
      if ($last === $nil) {
        last = Infinity;
      } else {
        last = $last.__int__();
      }
      last = Math.max(0, Math.min(last, this._.length - 1));
      step = second - first;

      if (step > 0) {
        for (i = first; i <= last; i += step) {
          raw.push(this._[i]);
        }
      } else if (step < 0) {
        for (i = first; i >= last; i += step) {
          raw.push(this._[i]);
        }
      }

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    };

    spec.putSeries = function($first, $second, $last, $value) {
      var i, first, second, last, step;
      $first = utils.defaultValue$Nil($first);
      $second = utils.defaultValue$Nil($second);
      $last = utils.defaultValue$Nil($last);
      $value = utils.defaultValue$Nil($value);

      this._ThrowIfImmutable();

      if ($first === $nil) {
        first = 0;
      } else {
        first = $first.__int__();
      }
      if ($second === $nil) {
        second = first + 1;
      } else {
        second = $second.__int__();
      }
      if ($last === $nil) {
        last = Infinity;
      } else {
        last = $last.__int__();
      }
      last = Math.max(0, Math.min(last, this._.length - 1));
      step = second - first;

      $value = this.__elem__($value);

      if (step > 0) {
        for (i = first; i <= last; i += step) {
          this._[i] = $value;
        }
      } else if (step < 0) {
        for (i = first; i >= last; i += step) {
          this._[i] = $value;
        }
      }

      return this;
    };

    spec.add = function($item) {
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();
      this._.push(this.__elem__($item));

      return this;
    };

    spec.addAll = function($aCollection) {
      var $this = this;
      $aCollection = utils.defaultValue$Nil($aCollection);

      this._ThrowIfImmutable();

      if ($aCollection.isSequenceableCollection().valueOf()) {
        $aCollection.do($SC.Function(function($item) {
          $this._.push($this.__elem__($item));
        }));
      } else {
        this.add($aCollection);
      }

      return this;
    };

    spec.putEach = function($keys, $values) {
      var keys, values, i, imax;
      $keys   = utils.defaultValue$Nil($keys);
      $values = utils.defaultValue$Nil($values);

      this._ThrowIfImmutable();

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], this.__elem__(values[i % values.length]));
      }

      return this;
    };

    spec.extend = function($size, $item) {
      var instance, raw, size, i;

      $size = utils.defaultValue$Nil($size);
      $item = utils.defaultValue$Nil($item);

      raw  = this._.slice();
      size = $size.__int__();
      if (raw.length > size) {
        raw.splice(size);
      } else if (raw.length < size) {
        for (i = size - raw.length; i--; ) {
          raw.push(this.__elem__($item));
        }
      }

      instance = new this.__Spec();
      instance._ = raw;
      return instance;

    };

    spec.insert = function($index, $item) {
      var index;
      $index = utils.defaultValue$Nil($index);
      $item  = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      index = Math.max(0, $index.__int__());
      this._.splice(index, 0, this.__elem__($item));

      return this;
    };

    spec.move = function($fromIndex, $toIndex) {
      return this.insert($toIndex, this.removeAt($fromIndex));
    };

    spec.addFirst = function($item) {
      var instance, raw;
      $item = utils.defaultValue$Nil($item);

      raw = this._.slice();
      raw.unshift(this.__elem__($item));

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    };

    spec.addIfNotNil = function($item) {
      $item = utils.defaultValue$Nil($item);

      if ($item === $nil) {
        return this;
      }

      return this.addFirst(this.__elem__($item));
    };

    spec.pop = function() {
      if (this._.length === 0) {
        return $nil;
      }
      this._ThrowIfImmutable();
      return this._.pop();
    };

    spec["++"] = function($anArray) {
      var instance, raw;

      raw = this._.slice();

      instance = new this.__Spec();
      instance._ = raw;
      if ($anArray !== $nil) {
        instance.addAll($anArray);
      }
      return instance;
    };

    // TODO: implements overWrite
    // TODO: implements grow
    // TODO: implements growClear

    spec.seriesFill = function($start, $step) {
      var i, imax;
      $start = utils.defaultValue$Nil($start);
      $step  = utils.defaultValue$Nil($step);

      for (i = 0, imax = this._.length; i < imax; ++i) {
        this.put($SC.Integer(i), $start);
        $start = $start ["+"] ($step);
      }

      return this;
    };

    spec.fill = function($value) {
      var raw, i, imax;
      $value = utils.defaultValue$Nil($value);

      this._ThrowIfImmutable();

      $value = this.__elem__($value);

      raw = this._;
      for (i = 0, imax = raw.length; i < imax; ++i) {
        raw[i] = $value;
      }

      return this;
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.array$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.array$reverseDo(this),
        $function
      );
      return this;
    };

    spec.reverse = function() {
      var $res = this.copy();

      $res._.reverse();

      return $res;
    };

    spec.windex = function() {
      var raw = this._;
      var x, r, i, imax;

      // <-- _ArrayWindex -->
      x = 0;
      r = rand.next();
      for (i = 0, imax = raw.length; i < imax; ++i) {
        x += raw[i].__num__();
        if (x >= r) {
          return $SC.Integer(i);
        }
      }

      return $int0;
    };

    spec.normalizeSum = function() {
      return this ["*"] (this.sum().reciprocal());
    };

    spec.normalize = function($min, $max) {
      var $minItem, $maxItem;
      $min = utils.defaultValue$Float($min, 0.0);
      $max = utils.defaultValue$Float($max, 1.0);

      $minItem = this.minItem();
      $maxItem = this.maxItem();
      return this.collect($SC.Function(function($el) {
        return $el.linlin($minItem, $maxItem, $min, $max);
      }));
    };

    // TODO: implements asciiPlot
    // TODO: implements perfectShuffle
    // TODO: implements performInPlace

    spec.clipExtend = function($length) {
      var last = this._[this._.length - 1] || $nil;
      return this.extend($length, last);
    };

    spec.rank = function() {
      return $int1 ["+"] (this.first().rank());
    };

    spec.shape = function() {
      return $SC.Array([ this.size() ]) ["++"] (this.at(0).shape());
    };

    spec.reshape = function() {
      var $result;
      var shape, size, i, imax;

      shape = slice.call(arguments);

      size = 1;
      for (i = 0, imax = shape.length; i < imax; ++i) {
        size *= shape[i].__int__();
      }

      $result = this.flat().wrapExtend($SC.Integer(size));
      for (i = imax - 1; i >= 1; --i) {
        $result = $result.clump(shape[i]);
      }

      return $result;
    };

    spec.reshapeLike = function($another, $indexing) {
      var $index, $flat;
      $another  = utils.defaultValue$Nil($another);
      $indexing = utils.defaultValue$Symbol($indexing, "wrapAt");

      $index = $int0;
      $flat  = this.flat();

      return $another.deepCollect($SC.Integer(0x7FFFFFFF), $SC.Function(function() {
        var $item = $flat.perform($indexing, $index);
        $index = $index.__inc__();
        return $item;
      }));
    };

    // TODO: implements deepCollect
    // TODO: implements deepDo

    spec.unbubble = function($depth, $levels) {
      $depth  = utils.defaultValue$Integer($depth , 0);
      $levels = utils.defaultValue$Integer($levels, 1);

      if ($depth.__num__() <= 0) {
        if (this.size().__int__() > 1) {
          return this;
        }
        if ($levels.__int__() <= 1) {
          return this.at(0);
        }
        return this.at(0).unbubble($depth, $levels.__dec__());
      }

      return this.collect($SC.Function(function($item) {
        return $item.unbubble($depth.__dec__());
      }));
    };

    spec.bubble = function($depth, $levels) {
      $depth  = utils.defaultValue$Integer($depth , 0);
      $levels = utils.defaultValue$Integer($levels, 1);

      if ($depth.__int__() <= 0) {
        if ($levels.__int__() <= 1) {
          return $SC.Array([ this ]);
        }
        return $SC.Array([ this.bubble($depth, $levels.__dec__()) ]);
      }

      return this.collect($SC.Function(function($item) {
        return $item.bubble($depth.__dec__(), $levels);
      }));
    };

    spec.slice = fn(function($$cuts) {
      var $firstCut, $list;
      var cuts_size, cuts;

      cuts_size = $$cuts.size().__int__();
      if (cuts_size === 0) {
        return this.copy();
      }

      $firstCut = $$cuts.at(0);
      if ($firstCut === $nil) {
        $list = this.copy();
      } else {
        $list = this.at($firstCut.asArray());
      }

      if (cuts_size === 1) {
        return $list.unbubble();
      }

      cuts = $$cuts._.slice(1);
      return $list.collect($SC.Function(function($item) {
        return $item.slice.apply($item, cuts);
      })).unbubble();
    }, "*cuts");

    spec.$iota = function() {
      var $a;
      var args, product, i, imax, a;

      args = arguments;

      product = 1;
      for (i = 0, imax = args.length; i < imax; ++i) {
        product *= args[i].__int__();
      }

      a = new Array(product);
      for (i = 0; i < product; ++i) {
        a[i] = $SC.Integer(i);
      }

      $a = $SC.Array(a);
      return $a.reshape.apply($a, args);
    };

    // TODO: implements asRandomTable
    // TODO: implements tableRand
    // TODO: implements msgSize
    // TODO: implements bundleSize
    // TODO: implements clumpBundles

    spec.includes = function($item) {
      return $SC.Boolean(this._.indexOf($item) !== -1);
    };
  });

  sc.lang.klass.refine("RawArray", function(spec, utils) {
    spec.archiveAsCompileString = utils.alwaysReturn$True;
    spec.archiveAsObject = utils.alwaysReturn$True;
    spec.rate = function() {
      return $SC.Symbol("scalar");
    };

    // TODO: implements readFromStream
    // TODO: implements powerset
  });

})(sc);

// src/sc/lang/classlib/Collections/String.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("String", function(spec, utils) {

    spec.__str__ = function() {
      return this.valueOf();
    };

    spec.__elem__ = function($item) {
      if ($item.__tag !== 1028) {
        throw new TypeError("Wrong type.");
      }
      return $item;
    };

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.__str__();
      }).join("");
    };

    spec.toString = function() {
      return this.valueOf();
    };

    // TODO: implements unixCmdActions
    // TODO: implements unixCmdActions_

    spec.$new = function() {
      throw new Error("String.new is illegal, should use literal.");
    };

    // TODO: implements $initClass
    // TODO: implements $doUnixCmdAction
    // TODO: implements unixCmd
    // TODO: implements unixCmdGetStdOut

    spec.asSymbol = function() {
      return $SC.Symbol(this.__str__());
    };

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this.__str__());
      return $SC.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this.__str__());
      return $SC.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      var raw = this.__str__();
      var a, i, imax;

      a = new Array(raw.length);
      for (i = 0, imax = a.length; i < imax; ++i) {
        a[i] = $SC.Integer(raw.charCodeAt(i));
      }

      return $SC.Array(a);
    };

    // TODO: implements stripRTF
    // TODO: implements stripHTML
    // TODO: implements $scDir

    spec.compare = function($aString, $ignoreCase) {
      var araw, braw, length, i, a, b, cmp, fn;
      $aString    = utils.defaultValue$Nil($aString);
      $ignoreCase = utils.defaultValue$Boolean($ignoreCase, false);

      if ($aString.__tag !== 1034) {
        return utils.nilInstance;
      }

      araw = this._;
      braw = $aString._;
      length = Math.min(araw.length, braw.length);

      if ($ignoreCase.__bool__()) {
        fn = function(ch) {
          return ch.toLowerCase();
        };
      } else {
        fn = function(ch) {
          return ch;
        };
      }
      for (i = 0; i < length; i++) {
        a = fn(araw[i]._).charCodeAt(0);
        b = fn(braw[i]._).charCodeAt(0);
        cmp = a - b;
        if (cmp !== 0) {
          return $SC.Integer(cmp < 0 ? -1 : +1);
        }
      }

      if (araw.length < braw.length) {
        cmp = -1;
      } else if (araw.length > braw.length) {
        cmp = 1;
      }

      return $SC.Integer(cmp);
    };

    spec["<"] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, utils.falseInstance).valueOf() < 0
      );
    };

    spec[">"] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, utils.falseInstance).valueOf() > 0
      );
    };

    spec["<="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, utils.falseInstance).valueOf() <= 0
      );
    };

    spec[">="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, utils.falseInstance).valueOf() >= 0
      );
    };

    spec["=="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, utils.falseInstance).valueOf() === 0
      );
    };

    spec["!="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, utils.falseInstance).valueOf() !== 0
      );
    };

    // TODO: implements hash

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber) {
      $aNumber = utils.defaultValue$Nil($aNumber);
      return $aNumber.asString().perform($aSelector, this);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex) {
      $aComplex = utils.defaultValue$Nil($aComplex);
      return $aComplex.asString().perform($aSelector, this);
    };

    spec.multiChannelPerform = function() {
      throw new Error("String:multiChannelPerform. Cannot expand strings.");
    };

    spec.isString = utils.alwaysReturn$True;

    spec.asString = utils.nop;

    spec.asCompileString = function() {
      return $SC.String("\"" + this.__str__() + "\"");
    };

    spec.species = function() {
      return $SC.Class("String");
    };

    // TODO: implements postln
    // TODO: implements post
    // TODO: implements postcln
    // TODO: implements postc
    // TODO: implements postf
    // TODO: implements format
    // TODO: implements matchRegexp
    // TODO: implements fformat
    // TODO: implements die
    // TODO: implements error
    // TODO: implements warn
    // TODO: implements inform

    spec["++"] = function($anObject) {
      return $SC.String(
        this.toString() + $anObject.asString().toString()
      );
    };

    spec["+"] = function($anObject) {
      return $SC.String(
        this.toString() + " " + $anObject.asString().toString()
      );
    };

    // TODO: implements catArgs
    // TODO: implements scatArgs
    // TODO: implements ccatArgs
    // TODO: implements catList
    // TODO: implements scatList
    // TODO: implements ccatList
    // TODO: implements split
    // TODO: implements containsStringAt
    // TODO: implements icontainsStringAt
    // TODO: implements contains
    // TODO: implements containsi
    // TODO: implements findRegexp
    // TODO: implements findAllRegexp
    // TODO: implements find
    // TODO: implements findBackwards
    // TODO: implements endsWith
    // TODO: implements beginsWith
    // TODO: implements findAll
    // TODO: implements replace
    // TODO: implements escapeChar
    // TODO: implements shellQuote
    // TODO: implements quote
    // TODO: implements tr
    // TODO: implements insert
    // TODO: implements wrapExtend
    // TODO: implements zeroPad
    // TODO: implements padLeft
    // TODO: implements padRight
    // TODO: implements underlined
    // TODO: implements scramble
    // TODO: implements rotate
    // TODO: implements compile
    // TODO: implements interpret
    // TODO: implements interpretPrint
    // TODO: implements $readNew
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements inspectorClass
    // TODO: implements standardizePath
    // TODO: implements realPath
    // TODO: implements withTrailingSlash
    // TODO: implements withoutTrailingSlash
    // TODO: implements absolutePath
    // TODO: implements pathMatch
    // TODO: implements load
    // TODO: implements loadPaths
    // TODO: implements loadRelative
    // TODO: implements resolveRelative
    // TODO: implements include
    // TODO: implements exclude
    // TODO: implements basename
    // TODO: implements dirname
    // TODO: implements splittext
    // TODO: implements +/+
    // TODO: implements asRelativePath
    // TODO: implements asAbsolutePath
    // TODO: implements systemCmd
    // TODO: implements gethostbyname
    // TODO: implements getenv
    // TODO: implements setenv
    // TODO: implements unsetenv
    // TODO: implements codegen_UGenCtorArg
    // TODO: implements ugenCodeString
    // TODO: implements asSecs
    // TODO: implements speak
    // TODO: implements toLower
    // TODO: implements toUpper
    // TODO: implements mkdir
    // TODO: implements parseYAML
    // TODO: implements parseYAMLFile
  });

})(sc);

// src/sc/lang/classlib/Collections/Set.js
(function(sc) {

  function SCSet() {
    this.__initializeWith__("Collection");
  }

  sc.lang.klass.define(SCSet, "Set : Collection", function() {
    // TODO: implements species
    // TODO: implements copy
    // TODO: implements do
    // TODO: implements clear
    // TODO: implements makeEmpty
    // TODO: implements includes
    // TODO: implements findMatch
    // TODO: implements add
    // TODO: implements remove
    // TODO: implements choose
    // TODO: implements pop
    // TODO: implements powerset
    // TODO: implements unify
    // TODO: implements sect
    // TODO: implements union
    // TODO: implements difference
    // TODO: implements symmetricDifference
    // TODO: implements isSubsetOf
    // TODO: implements initSet
    // TODO: implements putCheck
    // TODO: implements fullCheck
    // TODO: implements grow
    // TODO: implements noCheckAdd
    // TODO: implements scanFor
    // TODO: implements fixCollisionsFrom
    // TODO: implements keyAt
    // TODO: implements asSet
  });

})(sc);

// src/sc/lang/classlib/Collections/Dictionary.js
(function(sc) {

  function SCDictionary() {
    this.__initializeWith__("Set");
    this._ = {};
  }

  sc.lang.klass.define(SCDictionary, "Dictionary : Set", function() {
    // TODO: implements $newFrom
    // TODO: implements at
    // TODO: implements atFail
    // TODO: implements matchAt
    // TODO: implements trueAt
    // TODO: implements add
    // TODO: implements put
    // TODO: implements putAll
    // TODO: implements putPairs
    // TODO: implements getPairs
    // TODO: implements associationAt
    // TODO: implements associationAtFail
    // TODO: implements keys
    // TODO: implements values
    // TODO: implements includes
    // TODO: implements includesKey
    // TODO: implements removeAt
    // TODO: implements removeAtFail
    // TODO: implements remove
    // TODO: implements removeFail
    // TODO: implements keysValuesDo
    // TODO: implements keysValuesChange
    // TODO: implements do
    // TODO: implements keysDo
    // TODO: implements associationsDo
    // TODO: implements pairsDo
    // TODO: implements collect
    // TODO: implements select
    // TODO: implements reject
    // TODO: implements invert
    // TODO: implements merge
    // TODO: implements blend
    // TODO: implements findKeyForValue
    // TODO: implements sortedKeysValuesDo
    // TODO: implements choose
    // TODO: implements order
    // TODO: implements powerset
    // TODO: implements transformEvent
    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs
    // TODO: implements keysValuesArrayDo
    // TODO: implements grow
    // TODO: implements fixCollisionsFrom
    // TODO: implements scanFor
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
  });

  function SCIdentityDictionary() {
    this.__initializeWith__("Dictionary");
  }

  sc.lang.klass.define(SCIdentityDictionary, "IdentityDictionary : Dictionary", function() {
    // TODO: implements at
    // TODO: implements put
    // TODO: implements putGet
    // TODO: implements includesKey
    // TODO: implements findKeyForValue
    // TODO: implements scanFor
    // TODO: implements freezeAsParent
    // TODO: implements insertParent
    // TODO: implements storeItemsOn
    // TODO: implements doesNotUnderstand
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements timingOffset
  });

})(sc);

// src/sc/lang/classlib/Collections/Environment.js
(function(sc) {

  function SCEnvironment() {
    this.__initializeWith__("IdentityDictionary");
  }

  sc.lang.klass.define(SCEnvironment, "Environment : IdentityDictionary", function() {
    // TODO: implements $make
    // TODO: implements $use
    // TODO: implements make
    // TODO: implements use
    // TODO: implements eventAt
    // TODO: implements composeEvents
    // TODO: implements $pop
    // TODO: implements $push
    // TODO: implements pop
    // TODO: implements push
    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });

})(sc);

// src/sc/lang/classlib/Collections/Event.js
(function(sc) {

  function SCEvent() {
    this.__initializeWith__("Environment");
  }

  sc.lang.klass.define(SCEvent, "Event : Environment", function() {
    // TODO: implements $default
    // TODO: implements $silent
    // TODO: implements $addEventType
    // TODO: implements next
    // TODO: implements delta
    // TODO: implements play
    // TODO: implements isRest
    // TODO: implements isPlaying_
    // TODO: implements isRunning_
    // TODO: implements playAndDelta
    // TODO: implements synchWithQuant
    // TODO: implements asControlInput
    // TODO: implements asUGenInput
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements $initClass
    // TODO: implements $makeDefaultSynthDef
    // TODO: implements $makeParentEvents
  });

})(sc);

// src/sc/lang/classlib/Collections/Array.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;
  var rand = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  sc.lang.klass.refine("Array", function(spec, utils) {
    var bool = utils.bool;
    var SCArray = $SC.Class("Array");

    spec.$with = function() {
      return $SC.Array(slice.call(arguments));
    };

    spec.reverse = function() {
      // <-- _ArrayReverse -->
      return $SC.Array(this._.slice().reverse());
    };

    spec.scramble = function() {
      var a, tmp, i, j, m;

      // <-- _ArrayScramble -->
      a = this._.slice();
      m = a.length;
      if (m > 1) {
        for (i = 0; m > 0; ++i, --m) {
          j = i + (rand.next() * m)|0;
          tmp  = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
      }

      return $SC.Array(a);
    };

    spec.mirror = function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror -->
      size = raw.length * 2 - 1;
      if (size < 2) {
        return $SC.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $SC.Array(a);
    };

    spec.mirror1 = function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror1 -->
      size = raw.length * 2 - 2;
      if (size < 2) {
        return $SC.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $SC.Array(a);
    };

    spec.mirror2 = function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror2 -->
      size = raw.length * 2;
      if (size < 2) {
        return $SC.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 1, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $SC.Array(a);
    };

    spec.stutter = function($n) {
      var raw = this._;
      var n, a, i, j, imax, k;
      $n = utils.defaultValue$Integer($n, 2);

      // <-- _ArrayStutter -->
      n = Math.max(0, $n.__int__());
      a = new Array(raw.length * n);
      for (i = 0, j = 0, imax = raw.length; i < imax; ++i) {
        for (k = 0; k < n; ++k, ++j) {
          a[j] = raw[i];
        }
      }

      return $SC.Array(a);
    };

    spec.rotate = function($n) {
      var raw = this._;
      var n, a, size, i, j;
      $n = utils.defaultValue$Integer($n, 1);

      // <-- _ArrayRotate -->
      n = $n.__int__();
      a = new Array(raw.length);
      size = a.length;
      n %= size;
      if (n < 0) {
        n += size;
      }
      for (i = 0, j = n; i < size; ++i) {
        a[j] = raw[i];
        if (++j >= size) {
          j = 0;
        }
      }

      return $SC.Array(a);
    };

    spec.pyramid = function($patternType) {
      var patternType;
      var obj1, obj2, i, j, k, n, numslots, x;
      $patternType = utils.defaultValue$Integer($patternType, 1);

      obj1 = this._;
      obj2 = [];

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      x = numslots = obj1.length;

      switch (patternType) {
      case 1:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 2:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 3:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 4:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 5:
        n = x * x;
        for (i = k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 6:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 7:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 8:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 9:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 10:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      }

      return $SC.Array(obj2);
    };

    spec.pyramidg = function($patternType) {
      var raw = this._;
      var patternType;
      var list = [], lastIndex, i;
      $patternType = utils.defaultValue$Integer($patternType, 1);

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      lastIndex = raw.length - 1;

      switch (patternType) {
      case 1:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        break;
      case 2:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(lastIndex-i, lastIndex+1)));
        }
        break;
      case 3:
        for (i = lastIndex; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        break;
      case 4:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(i, lastIndex+1)));
        }
        break;
      case 5:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        for (i = lastIndex-1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        break;
      case 6:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(lastIndex-i, lastIndex+1)));
        }
        for (i = lastIndex-1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(lastIndex-i, lastIndex+1)));
        }
        break;
      case 7:
        for (i = lastIndex; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        break;
      case 8:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(i, lastIndex+1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(i, lastIndex+1)));
        }
        break;
      case 9:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(i, lastIndex+1)));
        }
        break;
      case 10:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(lastIndex-i, lastIndex+1)));
        }
        for (i = lastIndex-1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i+1)));
        }
        break;
      }

      return $SC.Array(list);
    };

    spec.sputter = function($probability, $maxlen) {
      var list, prob, maxlen, i, length;
      $probability = utils.defaultValue$Float($probability, 0.25);
      $maxlen      = utils.defaultValue$Float($maxlen, 100);

      list   = [];
      prob   = 1.0 - $probability.__num__();
      maxlen = $maxlen.__int__();
      i = 0;
      length = this._.length;
      while (i < length && list.length < maxlen) {
        list.push(this._[i]);
        if (rand.next() < prob) {
          i += 1;
        }
      }

      return $SC.Array(list);
    };

    spec.lace = function($length) {
      var raw = this._;
      var length, wrap = raw.length;
      var a, i, $item;
      $length = utils.defaultValue$Integer($length, wrap);

      length = $length.__int__();
      a = new Array(length);

      for (i = 0; i < length; ++i) {
        $item = raw[i % wrap];
        if (Array.isArray($item._)) {
          a[i] = $item._[ ((i / wrap)|0) % $item._.length ];
        } else {
          a[i] = $item;
        }
      }

      return $SC.Array(a);
    };

    spec.permute = function($nthPermutation) {
      var raw = this._;
      var obj1, obj2, size, $item;
      var nthPermutation, i, imax, j;
      $nthPermutation = utils.defaultValue$Integer($nthPermutation, 0);

      obj1 = raw;
      obj2 = raw.slice();
      size = raw.length;
      nthPermutation = $nthPermutation.__int__();

      for (i = 0, imax = size - 1; i < imax; ++i) {
        j = i + nthPermutation % (size - i);
        nthPermutation = (nthPermutation / (size - i))|0;

        $item = obj2[i];
        obj2[i] = obj2[j];
        obj2[j] = $item;
      }

      return $SC.Array(obj2);
    };

    spec.allTuples = function($maxTuples) {
      var maxSize;
      var obj1, obj2, obj3, obj4, newSize, tupSize;
      var i, j, k;
      $maxTuples = utils.defaultValue$Integer($maxTuples, 16384);

      maxSize = $maxTuples.__int__();

      obj1 = this._;
      newSize = 1;
      tupSize = obj1.length;
      for (i = 0; i < tupSize; ++i) {
        if (Array.isArray(obj1[i]._)) {
          newSize *= obj1[i]._.length;
        }
      }
      newSize = Math.min(newSize, maxSize);

      obj2 = new Array(newSize);

      for (i = 0; i < newSize; ++i) {
        k = i;
        obj3 = new Array(tupSize);
        for (j = tupSize - 1; j >=0; --j) {
          if (Array.isArray(obj1[j]._)) {
            obj4 = obj1[j]._;
            obj3[j] = obj4[k % obj4.length];
            k = (k / obj4.length)|0;
          } else {
            obj3[j] = obj1[j];
          }
        }
        obj2[i] = $SC.Array(obj3);
      }

      return $SC.Array(obj2);
    };

    spec.wrapExtend = function($size) {
      var raw = this._;
      var size, a, i;
      $size = utils.defaultValue$Nil($size);

      size = Math.max(0, $size.__int__());
      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[i % raw.length];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $SC.Array(a);
    };

    spec.foldExtend = function($size) {
      var raw = this._;
      var size, a, i;
      $size = utils.defaultValue$Nil($size);

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[mathlib.fold_idx(i, raw.length)];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $SC.Array(a);
    };

    spec.clipExtend = function($size) {
      var raw = this._;
      var size, a, i, imax, b;
      $size = utils.defaultValue$Nil($size);

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0, imax = raw.length; i< imax; ++i) {
          a[i] = raw[i];
        }
        for (b = a[i-1]; i < size; ++i) {
          a[i] = b;
        }
      } else {
        a = raw.slice(0, size);
      }

      return $SC.Array(a);
    };

    spec.slide = function($windowLength, $stepSize) {
      var raw = this._;
      var windowLength, stepSize;
      var obj1, obj2, m, n, numwin, numslots;
      var i, j, h, k;
      $windowLength = utils.defaultValue$Integer($windowLength, 3);
      $stepSize     = utils.defaultValue$Integer($stepSize    , 1);

      windowLength = $windowLength.__int__();
      stepSize = $stepSize.__int__();
      obj1 = raw;
      obj2 = [];
      m = windowLength;
      n = stepSize;
      numwin = ((raw.length + n - m) / n)|0;
      numslots = numwin * m;

      for (i = h = k = 0; i < numwin; ++i,h += n) {
        for (j = h; j < m + h; ++j) {
          obj2[k++] = obj1[j];
        }
      }

      return $SC.Array(obj2);
    };

    spec.containsSeqColl = function() {
      var raw = this._;
      var i, imax;

      for (i = 0, imax = raw.length; i < imax; ++i) {
        if (bool(raw[i].isSequenceableCollection())) {
          return $SC.True();
        }
      }

      return $SC.False();
    };

    spec.unlace = function($clumpSize, $numChan, $clip) {
      var raw = this._;
      var clumpSize, numChan;
      var a, b, size, i, j, k;
      $clumpSize = utils.defaultValue$Integer($clumpSize, 2);
      $numChan   = utils.defaultValue$Integer($numChan  , 1);
      $clip      = utils.defaultValue$Boolean($clip, false);

      clumpSize = $clumpSize.__int__();
      numChan   = $numChan  .__int__();
      size = (raw.length / clumpSize)|0;
      size = size - (size % numChan);
      if (size) {
        a = new Array(clumpSize);
        for (i = 0; i < clumpSize; ++i) {
          b = new Array(size);
          for (j = 0; j < size; j += numChan) {
            for (k = 0; k < numChan; ++k) {
              b[j + k] = raw[i * numChan + k + j * clumpSize];
            }
          }
          a[i] = $SC.Array(b);
        }
      } else {
        a = [];
      }

      return $SC.Array(a);
    };

    // TODO: implements interlace
    // TODO: implements deinterlace

    spec.flop =  function() {
      return this.multiChannelExpand();
    };

    spec.multiChannelExpand = function() {
      var raw = this._;
      var maxSize, size, obj1, obj2, obj3;
      var i, j;

      obj1 = raw;
      maxSize = obj1.reduce(function(len, $elem) {
        return Math.max(len, Array.isArray($elem._) ? $elem._.length : 1);
      }, 0);

      obj2 = new Array(maxSize);
      size = obj1.length;

      if (size === 0) {
        obj2[0] = $SC.Array([]);
      } else {
        for (i = 0; i < maxSize; ++i) {
          obj3 = new Array(size);
          for (j = 0; j < size; ++j) {
            if (Array.isArray(obj1[j]._)) {
              obj3[j] = obj1[j]._[i % obj1[j]._.length];
            } else {
              obj3[j] = obj1[j];
            }
          }
          obj2[i] = $SC.Array(obj3);
        }
      }

      return $SC.Array(obj2);
    };

    // TODO: implements envirPairs

    spec.shift = function($n, $filler) {
      var $fill, $remain;
      $n      = utils.defaultValue$Nil($n);
      $filler = utils.defaultValue$Float($filler, 0.0);

      $fill = SCArray.fill($n.abs(), $filler);
      $remain = this.drop($n.neg());

      if ($n < 0) {
        return $remain ["++"] ($fill);
      }

      return $fill ["++"] ($remain);
    };

    spec.powerset = function() {
      var raw = this._;
      var arrSize, powersize;
      var result, elemArr, mod, i, j;

      arrSize   = this.size().__int__();
      powersize = Math.pow(2, arrSize);

      result = [];
      for (i = 0; i < powersize; ++i) {
        elemArr = [];
        for (j = 0; j < arrSize; ++j) {
          mod = Math.pow(2, j);
          if (((i / mod)|0) % 2) {
            elemArr.push(raw[j]);
          }
        }
        result[i] = $SC.Array(elemArr);
      }

      return $SC.Array(result);
    };

    // TODO: implements source

    spec.asUGenInput = function($for) {
      return this.collect($SC.Function(function($_) {
        return $_.asUGenInput($for);
      }));
    };

    spec.asAudioRateInput = function($for) {
      return this.collect($SC.Function(function($_) {
        return $_.asAudioRateInput($for);
      }));
    };

    spec.asControlInput = function() {
      return this.collect($SC.Function(function($_) {
        return $_.asControlInput();
      }));
    };

    spec.isValidUGenInput = utils.alwaysReturn$True;

    spec.numChannels = function() {
      return this.size();
    };

    // TODO: implements poll
    // TODO: implements dpoll
    // TODO: implements evnAt
    // TODO: implements atIdentityHash
    // TODO: implements atIdentityHashInPairs
    // TODO: implements asSpec
    // TODO: implements fork

    spec.madd = function($mul, $add) {
      $mul = utils.defaultValue$Float($mul, 1.0);
      $add = utils.defaultValue$Float($add, 0.0);
      return $SC.Class("MulAdd").new(this, $mul, $add);
    };

    // TODO: implements asRawOSC
    // TODO: implements printOn
    // TODO: implements storeOn
  });

})(sc);

})(this.self||global);

(function(global) {
"use strict";

var sc = { VERSION: "0.0.51" };

// src/sc/sc.js
(function(sc) {

  sc.lang = {};
  sc.libs = {};

  function SCScript(fn) {
    return sc.lang.main.run(fn);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  /* istanbul ignore next */
  SCScript.stdout = function(msg) {
    console.log(msg);
  };

  /* istanbul ignore next */
  SCScript.stderr = function(msg) {
    console.error(msg);
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
      return a >> -b;
    }
    return a << b;
  };

  mathlib.rightShift = function(a, b) {
    if (b < 0) {
      return a << -b;
    }
    return a >> b;
  };

  mathlib.unsignedRightShift = function(a, b) {
    if (b < 0) {
      return (a << -b) >>> 0;
    }
    return a >>> b;
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

// src/sc/lang/dollar.js
(function(sc) {

  sc.lang.$ = function(name) {
    return sc.lang.klass.get(name);
  };

})(sc);

// src/sc/lang/fn.js
(function(sc) {

  var slice = [].slice;
  var $ = sc.lang.$;

  var _getDefaultValue = function(value) {
    var ch;

    switch (value) {
    case "nil":
      return $.Nil();
    case "true":
      return $.True();
    case "false":
      return $.False();
    case "inf":
      return $.Float(Infinity);
    case "-inf":
      return $.Float(-Infinity);
    }

    ch = value.charAt(0);
    switch (ch) {
    case "$":
      return $.Char(value.charAt(1));
    case "\\":
      return $.Symbol(value.substr(1));
    }

    if (value.indexOf(".") !== -1) {
      return $.Float(+value);
    }

    return $.Integer(+value);
  };

  var getDefaultValue = function(value) {
    if (value.charAt(0) === "[") {
      return $.Array(value.slice(1, -2).split(",").map(function(value) {
        return _getDefaultValue(value.trim());
      }));
    }
    return _getDefaultValue(value);
  };

  var fn = function(func, def) {
    var argItems, argNames, argVals;
    var remain, wrapper;

    argItems = def.split(/\s*;\s*/);
    if (argItems[argItems.length - 1].charAt(0) === "*") {
      remain = !!argItems.pop();
    }

    argNames = new Array(argItems.length);
    argVals  = new Array(argItems.length);

    argItems.forEach(function(items, i) {
      items = items.split("=");
      argNames[i] = items[0].trim();
      argVals [i] = getDefaultValue(items[1] || "nil");
    });

    wrapper = function() {
      var given, args;

      given = slice.call(arguments);
      args  = argVals.slice();

      if (isDictionary(given[given.length - 1])) {
        setKeywordArguments(args, argNames, given.pop());
      }

      copy(args, given, Math.min(argNames.length, given.length));

      if (remain) {
        args.push($.Array(given.slice(argNames.length)));
      }

      return func.apply(this, args);
    };

    wrapper._argNames = argNames;
    wrapper._argVals  = argVals;

    return wrapper;
  };

  var isDictionary = function(obj) {
    return !!(obj && obj.constructor === Object);
  };

  var copy = function(args, given, length) {
    for (var i = 0; i < length; ++i) {
      if (given[i]) {
        args[i] = given[i];
      }
    }
  };

  var setKeywordArguments = function(args, argNames, dict) {
    Object.keys(dict).forEach(function(key) {
      var index = argNames.indexOf(key);
      if (index !== -1) {
        args[index] = dict[key];
      }
    });
  };

  sc.lang.fn = fn;

})(sc);

// src/sc/lang/bytecode.js
(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  var bytecode = { current: null };

  function insideOfARoutine() {
    return sc.lang.main.$currentThread.__tag === 9;
  }

  function Bytecode(initializer, def) {
    this._initializer = initializer;
    this._def  = def;
    this._code = [];
    this._vals = [];
    this.init(initializer);
  }

  Bytecode.prototype.init = function() {
    var code = this._initializer();
    if (this._def && code.length) {
      code[0] = fn(code[0], this._def);
      this._argNames = code[0]._argNames;
      this._argVals  = code[0]._argVals;
    } else {
      this._argNames = [];
      this._argVals  = [];
    }
    this._code   = code;
    this._length = code.length;
    return this.reset();
  };

  Bytecode.prototype.reset = function() {
    this.state   = 0;
    this.result  = null;
    this._index  = 0;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this;
  };

  Bytecode.prototype.run = function(args) {
    if (insideOfARoutine()) {
      return this.runAsRoutine(args);
    } else if (this._iter) {
      return this.runAsFunctionWithIter();
    } else {
      return this.runAsFunction(args);
    }
  };

  Bytecode.prototype.runAsFunction = function(args) {
    var result;
    var i, code, length;

    code   = this._code;
    length = this._length;

    this._parent = bytecode.current;

    bytecode.current = this;
    this.state = 3;

    for (i = 0; i < length; ++i) {
      result = code[i].apply(this, args);
      if (this.state === -1) {
        this._iter = null;
        break;
      }
    }

    bytecode.current = this._parent;
    this._parent = null;

    this.state = 0;

    return result || $.Nil();
  };

  Bytecode.prototype.runAsFunctionWithIter = function() {
    var items;

    while (this._iter && (items = this._iter.next()) !== null) {
      this.runAsFunction(items);
    }

    this._iter = null;
  };

  Bytecode.prototype.runAsRoutine = function(args) {
    var result;
    var code, length, iter;
    var skip;

    this.setParent(bytecode.current);

    bytecode.current = this;

    if (this._child) {
      result = this._child.runAsRoutine(args);
      if (this.state === 5) {
        skip = true;
      }
    }

    if (!skip) {
      code   = this._code;
      length = this._length;
      iter   = this._iter;

      this.state  = 3;
      this.result = null;
      while (this._index < length) {
        if (iter && this._index === 0) {
          args = iter.next();
          if (args === null) {
            this.state  = 5;
            this._index = length;
            break;
          }
        }
        if (iter && !iter.hasNext) {
          iter = null;
        }

        result = code[this._index].apply(this, args);

        this._index += 1;
        if (this._index >= length) {
          if (iter) {
            this._index = 0;
          } else {
            this.state = 5;
          }
        }

        if (this.state !== 3) {
          break;
        }
      }
    }

    bytecode.current = this._parent;

    this.advance();

    return this.result ? $.Nil() : result;
  };

  Bytecode.prototype.setIterator = function(iter) {
    this._iter = iter;
    return this;
  };

  Bytecode.prototype.setParent = function(parent) {
    if (parent && parent !== this) {
      this._parent  = parent;
      parent._child = this;
    }
  };

  Bytecode.prototype.advance = function() {
    if (this._child || this._index < this._length) {
      this.state = 5;
      return;
    }
    if (!this.result) {
      this.state = 6;
    }
    if (this._parent) {
      this._parent._child = null;
      if (this.state === 6) {
        this._parent.state = 3;
      } else {
        this._parent.state = 5;
      }
      this._parent = null;
    }
  };

  Bytecode.prototype.push = function($value) {
    this._vals.push($value);
    return $value;
  };

  Bytecode.prototype.shift = function() {
    if (this._vals.length) {
      return this._vals.shift();
    } else {
      return this._parent.shift();
    }
  };

  Bytecode.prototype.break = function() {
    this.state  = -1;
    this._index = this._length;
  };

  Bytecode.prototype.yield = function($value) {
    this.state  = 5;
    this.result = $value;
    if (this._parent) {
      this._parent.yield($value);
    }
  };

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  bytecode.yield = function($value) {
    if (!insideOfARoutine()) {
      bytecode.current = null;
      throw new Error("yield was called outside of a Routine.");
    }
    bytecode.current.yield($value);
  };

  sc.lang.bytecode = bytecode;

})(sc);

// src/sc/libs/strlib.js
(function(sc) {

  var strlib = {};

  strlib.article = function(name) {
    if (/^[AEIOU]/i.test(name)) {
      return "an";
    }
    return "a";
  };

  sc.libs.strlib = strlib;

})(sc);

// src/sc/lang/klass/klass.js
(function(sc) {

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
    __tag: 0,
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

// src/sc/lang/klass/constructors.js
(function(sc) {

  var $        = sc.lang.$;
  var klass    = sc.lang.klass;
  var bytecode = sc.lang.bytecode;

  var $nil, $true, $false;
  var $symbols, $chars, $integers, $floats;

  function SCNil() {
    this.__super__("Object");
    this._ = null;
  }
  klass.define("Nil", {
    constructor: SCNil,
    __tag: 5
  });

  function SCSymbol() {
    this.__super__("Object");
    this._ = "";
  }
  klass.define("Symbol", {
    constructor: SCSymbol,
    __tag: 3
  });

  function SCBoolean() {
    this.__super__("Object");
  }
  klass.define("Boolean", {
    constructor: SCBoolean,
    __tag: 6
  });

  function SCTrue() {
    this.__super__("Boolean");
    this._ = true;
  }
  klass.define("True : Boolean", {
    constructor: SCTrue
  });

  function SCFalse() {
    this.__super__("Boolean");
    this._ = false;
  }
  klass.define("False : Boolean", {
    constructor: SCFalse
  });

  klass.define("Magnitude", {
    constructor: function SCMagnitude() {
      this.__super__("Object");
    }
  });

  function SCChar() {
    this.__super__("Magnitude");
    this._ = "\0";
  }
  klass.define("Char : Magnitude", {
    constructor: SCChar,
    __tag: 4
  });

  klass.define("Number : Magnitude", {
    constructor: function SCNumber() {
      this.__super__("Magnitude");
    }
  });

  klass.define("SimpleNumber : Number", {
    constructor: function SCSimpleNumber() {
      this.__super__("Number");
    }
  });

  function SCInteger() {
    this.__super__("SimpleNumber");
    this._ = 0;
  }
  klass.define("Integer : SimpleNumber", {
    constructor: SCInteger,
    __tag: 1
  });

  function SCFloat() {
    this.__super__("SimpleNumber");
    this._ = 0.0;
  }
  klass.define("Float : SimpleNumber", {
    constructor: SCFloat,
    __tag: 2
  });

  klass.define("Collection", {
    constructor: function SCCollection() {
      this.__super__("Object");
    }
  });

  klass.define("SequenceableCollection : Collection", {
    constructor: function SCSequenceableCollection() {
      this.__super__("Collection");
    }
  });

  klass.define("ArrayedCollection : SequenceableCollection", {
    constructor: function SCArrayedCollection() {
      this.__super__("SequenceableCollection");
      this.__immutable = false;
      this._ = [];
    }
  });

  klass.define("RawArray : ArrayedCollection", {
    constructor: function SCRawArray() {
      this.__super__("ArrayedCollection");
    }
  });

  function SCArray() {
    this.__super__("ArrayedCollection");
  }
  klass.define("Array : ArrayedCollection", {
    constructor: SCArray
  });

  function SCString() {
    this.__super__("RawArray");
  }
  klass.define("String : RawArray", {
    constructor: SCString,
    __tag: 7
  });

  klass.define("Set : Collection", {
    constructor: function SCSet() {
      this.__super__("Collection");
    }
  });

  klass.define("Dictionary : Set", {
    constructor: function SCDictionary() {
      this.__super__("Set");
    }
  });

  klass.define("IdentityDictionary : Dictionary", {
    constructor: function SCIdentityDictionary() {
      this.__super__("Dictionary");
    }
  });

  klass.define("Environment : IdentityDictionary", {
    constructor: function SCEnvironment() {
      this.__super__("IdentityDictionary");
    }
  });

  klass.define("Event : Environment", {
    constructor: function SCEvent() {
      this.__super__("Environment");
    }
  });

  klass.define("AbstractFunction", {
    constructor: function SCAbstractFunction() {
      this.__super__("Object");
    }
  });

  function SCFunction() {
    this.__super__("AbstractFunction");
    /* istanbul ignore next */
    this._ = function() {};
  }
  klass.define("Function : AbstractFunction", {
    constructor: SCFunction,
    __tag: 8
  });

  function SCRef() {
    this.__super__("Object");
  }
  klass.define("Ref : AbstractFunction", {
    constructor: SCRef
  });

  // $
  $nil      = new SCNil();
  $true     = new SCTrue();
  $false    = new SCFalse();
  $integers = {};
  $floats   = {};
  $symbols  = {};
  $chars    = {};

  $.Nil = function() {
    return $nil;
  };

  $.Boolean = function($value) {
    return $value ? $true : $false;
  };

  $.True = function() {
    return $true;
  };

  $.False = function() {
    return $false;
  };

  $.Integer = function(value) {
    var instance;

    if (!global.isFinite(value)) {
      return $.Float(+value);
    }

    value = value|0;

    if (!$integers.hasOwnProperty(value)) {
      instance = new SCInteger();
      instance._ = value;
      $integers[value] = instance;
    }

    return $integers[value];
  };

  $.Float = function(value) {
    var instance;

    value = +value;

    if (!$floats.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._ = value;
      $floats[value] = instance;
    }

    return $floats[value];
  };

  $.Symbol = function(value) {
    var instance;
    if (!$symbols.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._ = value;
      $symbols[value] = instance;
    }
    return $symbols[value];
  };

  $.Char = function(value) {
    var instance;

    value = String(value).charAt(0);

    if (!$chars.hasOwnProperty(value)) {
      instance = new SCChar();
      instance._ = value;
      $chars[value] = instance;
    }

    return $chars[value];
  };

  $.Array = function(value, immutable) {
    var instance = new SCArray();
    instance._ = value || [];
    instance.__immutable = !!immutable;
    return instance;
  };

  $.String = function(value, mutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($.Char);
    instance.__immutable = !mutable;
    return instance;
  };

  $.Event = function(value) {
    var instance, i, imax, j;
    i = imax = j = value;
    instance = $("Event").new();
    for (i = j = 0, imax = value.length >> 1; i < imax; ++i) {
      instance.put(value[j++], value[j++]);
    }
    return instance;
  };

  $.Function = function(value, def) {
    var instance = new SCFunction();
    instance._ = bytecode.create(value, def);
    return instance;
  };

  $.Ref = function(value) {
    var instance = new SCRef();
    instance._$value = value;
    return instance;
  };

})(sc);

// src/sc/lang/klass/utils.js
(function(sc) {

  var $     = sc.lang.$;
  var klass = sc.lang.klass;

  var utils = {
    $nil  : $.Nil(),
    $true : $.True(),
    $false: $.False(),
    $int_0: $.Integer(0),
    $int_1: $.Integer(1),
    nop: function() {
      return this;
    },
    alwaysReturn$nil  : $.Nil,
    alwaysReturn$true : $.True,
    alwaysReturn$false: $.False,
    alwaysReturn$int_0: function() {
      return utils.$int_0;
    },
    alwaysReturn$int_1: function() {
      return utils.$int_1;
    },
    getMethod: function(className, methodName) {
      return klass.get(className).__Spec.prototype[methodName];
    }
  };

  klass.utils = utils;

})(sc);

// src/sc/lang/main.js
(function(sc) {

  var main = {};

  var $ = sc.lang.$;
  var random = sc.libs.random;

  main.$currentEnv    = null;
  main.$currentThread = {};

  main.run = function(func) {
    if (!initialize.done) {
      initialize();
    }
    return func($);
  };

  function initialize() {
    var $process;

    $process = $("Main").new();
    $process._$interpreter = $("Interpreter").new();
    $process._$mainThread  = $("Thread").new($.Function(function() {
      return [];
    }));

    main.$currentEnv    = $("Environment").new();
    main.$currentThread = $process._$mainThread;

    // $interpreter._$s = SCServer.default();

    random.current = $process._$mainThread._randgen;

    // TODO:
    // SoundSystem.addProcess($process);
    // SoundSystem.start();

    initialize.done = true;

    main.$process = $process;
  }

  $.Environment = function(key, $value) {
    if ($value) {
      main.$currentEnv.put($.Symbol(key), $value);
      return $value;
    }
    return main.$currentEnv.at($.Symbol(key));
  };

  $.This = function() {
    return main.$process.interpreter();
  };

  $.ThisProcess = function() {
    return main.$process;
  };

  $.ThisThread = function() {
    return main.$currentThread;
  };

  sc.lang.main = main;

})(sc);

// src/sc/lang/iterator.js
(function(sc) {

  var iterator = {};
  var $      = sc.lang.$;
  var utils  = sc.lang.klass.utils;
  var $nil   = utils.$nil;
  var $int_0 = utils.$int_0;
  var $int_1 = utils.$int_1;

  var __stop__ = function() {
    return null;
  };

  var nop_iter = function(iter) {
    iter.hasNext = false;
    iter.next    = __stop__;
    return iter;
  };
  nop_iter.clone = function() {
    return nop_iter;
  };
  nop_iter(nop_iter);

  var one_shot_iter = function(value) {
    var iter = {
      hasNext: true,
      next: function() {
        nop_iter(iter);
        return [ value, $int_0 ];
      },
      clone: function() {
        return one_shot_iter(value);
      }
    };
    return iter;
  };

  iterator.execute = function(iter, $function) {
    $function._.setIterator(iter).run();
  };

  iterator.object$do = one_shot_iter;

  iterator.function$while = function($function) {
    var bytecode, iter;

    bytecode = $function._;

    iter = {
      hasNext: true,
      next: function() {
        if (!bytecode.runAsFunction().__bool__()) {
          nop_iter(iter);
          return null;
        }
        return [ $nil, $nil ];
      },
      clone: function() {
        return iterator.function$while($function);
      }
    };

    return iter;
  };

  var sc_incremental_iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i > $end) {
          nop_iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc_incremental_iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc_decremental_iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i < $end) {
          nop_iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc_decremental_iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc_numeric_iter = function($start, $end, $step) {
    if ($start.valueOf() === $end.valueOf()) {
      return one_shot_iter($start);
    } else if ($start < $end && $step > 0) {
      return sc_incremental_iter($start, $end, $step);
    } else if ($start > $end && $step < 0) {
      return sc_decremental_iter($start, $end, $step);
    }
    return nop_iter;
  };

  iterator.number$do = function($end) {
    var $start, $step;

    $start = $int_0;
    $end   = $end.__dec__();
    $step  = $int_1;

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = $int_0;
    $step  = $.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;

    $step = ($start <= $end) ? $int_1 : $.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $step;

    $step   = $second ["-"] ($start);

    return sc_numeric_iter($start, $last, $step);
  };

  var js_incremental_iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i > end) {
          nop_iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js_incremental_iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js_decremental_iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i < end) {
          nop_iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js_decremental_iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js_numeric_iter = function(start, end, step, type) {
    if (start === end) {
      return one_shot_iter(type(start));
    } else if (start < end && step > 0) {
      return js_incremental_iter(start, end, step, type);
    } else if (start > end && step < 0) {
      return js_decremental_iter(start, end, step, type);
    }
    return nop_iter;
  };

  var js_numeric_iter$do = function($endval, type) {
    var end = type($endval.__num__()).valueOf();
    return js_numeric_iter(0, end - 1, +1, type);
  };

  var js_numeric_iter$reverseDo = function($startval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = (start|0) - start;
    return js_numeric_iter(start - 1, end, -1, type);
  };

  var js_numeric_iter$for = function($startval, $endval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forBy = function($startval, $endval, $stepval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forSeries = function($startval, $second, $last, type) {
    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return js_numeric_iter(start, end, step, type);
  };

  iterator.integer$do = function($endval) {
    return js_numeric_iter$do($endval, $.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $.Integer);
  };

  iterator.float$do = function($endval) {
    return js_numeric_iter$do($endval, $.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $.Float);
  };

  var list_iter = function(list) {
    var i = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          nop_iter(iter);
        }
        return [ $ret, $.Integer(i - 1) ];
      },
      clone: function() {
        return list_iter(list);
      }
    };
    return iter;
  };

  var js_array_iter = function(list) {
    if (list.length) {
      return list_iter(list);
    }
    return nop_iter;
  };

  iterator.array$do = function($array) {
    return js_array_iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js_array_iter($array._.slice().reverse());
  };

  iterator.set$do = function($set) {
    return js_array_iter($set._$array._.filter(function($elem) {
      return $elem !== $nil;
    }));
  };

  sc.lang.iterator = iterator;

})(sc);

// src/sc/lang/io.js
(function(sc) {

  var io = {};

  var SCScript = sc.SCScript;
  var buffer   = "";

  io.post = function(msg) {
    var items;

    items  = (buffer + msg).split("\n");
    buffer = items.pop();

    items.forEach(function(msg) {
      SCScript.stdout(msg);
    });
  };

  io.warn = function(msg) {
    SCScript.stderr(msg);
  };

  sc.lang.io = io;

})(sc);

// src/sc/lang/compiler/compiler.js
(function(sc) {

  var compiler = {
    Token: {
      CharLiteral: "Char",
      EOF: "<EOF>",
      FalseLiteral: "False",
      FloatLiteral: "Float",
      Identifier: "Identifier",
      IntegerLiteral: "Integer",
      Keyword: "Keyword",
      Label: "Label",
      NilLiteral: "Nil",
      Punctuator: "Punctuator",
      StringLiteral: "String",
      SymbolLiteral: "Symbol",
      TrueLiteral: "True"
    },
    Syntax: {
      AssignmentExpression: "AssignmentExpression",
      BinaryExpression: "BinaryExpression",
      BlockExpression: "BlockExpression",
      CallExpression: "CallExpression",
      FunctionExpression: "FunctionExpression",
      EnvironmentExpresion: "EnvironmentExpresion",
      Identifier: "Identifier",
      ListExpression: "ListExpression",
      Label: "Label",
      Literal: "Literal",
      EventExpression: "EventExpression",
      Program: "Program",
      ThisExpression: "ThisExpression",
      UnaryExpression: "UnaryExpression",
      VariableDeclaration: "VariableDeclaration",
      VariableDeclarator: "VariableDeclarator",
      ValueMethodEvaluator: "ValueMethodEvaluator",
      ValueMethodResult: "ValueMethodResult"
    },
    Message: {
      ArgumentAlreadyDeclared: "argument '%0' already declared",
      InvalidLHSInAssignment: "invalid left-hand side in assignment",
      NotImplemented: "not implemented %0",
      UnexpectedEOS: "unexpected end of input",
      UnexpectedIdentifier: "unexpected identifier",
      UnexpectedNumber: "unexpected number",
      UnexpectedLiteral: "unexpected %0",
      UnexpectedToken: "unexpected token %0",
      VariableAlreadyDeclared: "variable '%0' already declared",
      VariableNotDefined: "variable '%0' not defined"
    },
    Keywords: {
      var: "keyword",
      arg: "keyword",
      const: "keyword",
      this: "function",
      thisThread: "function",
      thisProcess: "function",
      thisFunction: "function",
      thisFunctionDef: "function",
    }
  };

  sc.lang.compiler = compiler;

  var SCScript = sc.SCScript;

  SCScript.tokenize = function(source, opts) {
    return new compiler.lexer(source, opts).tokenize();
  };

  SCScript.parse = function(source, opts) {
    return compiler.parser.parse(source, opts);
  };

  SCScript.compile = function(source, opts) {
    var ast;

    if (typeof source === "string") {
      ast = SCScript.parse(source, opts);
    } else {
      ast = source;
    }

    return compiler.codegen.compile(ast, opts);
  };

})(sc);

// src/sc/lang/compiler/node.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;

  var Node = {
    createAssignmentExpression: function(operator, left, right, remain) {
      var node = {
        type: Syntax.AssignmentExpression,
        operator: operator,
        left: left,
        right: right
      };
      if (remain) {
        node.remain = remain;
      }
      return node;
    },
    createBinaryExpression: function(operator, left, right) {
      var node = {
        type: Syntax.BinaryExpression,
        operator: operator.value,
        left: left,
        right: right
      };
      if (operator.adverb) {
        node.adverb = operator.adverb;
      }
      return node;
    },
    createBlockExpression: function(body) {
      return {
        type: Syntax.BlockExpression,
        body: body
      };
    },
    createCallExpression: function(callee, method, args, stamp) {
      var node;

      node = {
        type: Syntax.CallExpression,
        callee: callee,
        method: method,
        args  : args,
      };

      if (stamp) {
        node.stamp = stamp;
      }

      return node;
    },
    createEnvironmentExpresion: function(id) {
      return {
        type: Syntax.EnvironmentExpresion,
        id: id
      };
    },
    createFunctionExpression: function(args, body, closed, partial, blocklist) {
      var node;

      node = {
        type: Syntax.FunctionExpression,
        body: body
      };
      if (args) {
        node.args = args;
      }
      if (closed) {
        node.closed = true;
      }
      if (partial) {
        node.partial = true;
      }
      if (blocklist) {
        node.blocklist = true;
      }
      return node;
    },
    createIdentifier: function(name) {
      return {
        type: Syntax.Identifier,
        name: name
      };
    },
    createLabel: function(name) {
      return {
        type: Syntax.Label,
        name: name
      };
    },
    createListExpression: function(elements, immutable) {
      var node = {
        type: Syntax.ListExpression,
        elements: elements
      };
      if (immutable) {
        node.immutable = !!immutable;
      }
      return node;
    },
    createLiteral: function(token) {
      return {
        type: Syntax.Literal,
        value: token.value,
        valueType: token.type
      };
    },
    createEventExpression: function(elements) {
      return {
        type: Syntax.EventExpression,
        elements: elements
      };
    },
    createProgram: function(body) {
      return {
        type: Syntax.Program,
        body: body
      };
    },
    createThisExpression: function(name) {
      return {
        type: Syntax.ThisExpression,
        name: name
      };
    },
    createUnaryExpression: function(operator, arg) {
      return {
        type: Syntax.UnaryExpression,
        operator: operator,
        arg: arg
      };
    },
    createVariableDeclaration: function(declarations, kind) {
      return {
        type: Syntax.VariableDeclaration,
        declarations: declarations,
        kind: kind
      };
    },
    createVariableDeclarator: function(id, init) {
      var node = {
        type: Syntax.VariableDeclarator,
        id: id
      };
      if (init) {
        node.init = init;
      }
      return node;
    },
    createValueMethodEvaluator: function(id, expr) {
      return {
        type: Syntax.ValueMethodEvaluator,
        id  : id,
        expr: expr,
        segmented: true
      };
    },
    createValueMethodResult: function(id) {
      return {
        type: Syntax.ValueMethodResult,
        id: id
      };
    }
  };

  sc.lang.compiler.node = Node;

})(sc);

// src/sc/lang/compiler/pre-compiler.js
(function(sc) {

  var compiler = sc.lang.compiler;
  var Syntax   = compiler.Syntax;
  var Node     = sc.lang.compiler.node;

  var SegmentedMethod = {
    idle : true,
    sleep: true,
    wait : true,
    yield: true,
    embedInStream: true,
  };

  function PreCompiler() {
    this.functionStack = [];
    this.functionArray = [];
  }

  PreCompiler.prototype.compile = function(ast) {
    ast = this.traverse(ast);
    this.functionArray.forEach(function(node) {
      node.body = this.segment(node.body);
    }, this);
    return ast;
  };

  PreCompiler.prototype.traverse = function(node) {
    var result;

    if (Array.isArray(node)) {
      result = this.traverse$Array(node);
    } else if (node && typeof node === "object") {
      result = this.traverse$Object(node);
    } else {
      result = node;
    }

    return result;
  };

  PreCompiler.prototype.traverse$Array = function(node) {
    return node.map(function(node) {
      return this.traverse(node);
    }, this);
  };

  PreCompiler.prototype.traverse$Object = function(node) {
    var result = {};

    if (isFunctionExpression(node)) {
      this.functionStack.push(result);
    } else if (isSegmentedMethod(node)) {
      result.segmented = true;
      this.functionStack.forEach(function(node) {
        if (!node.segmented) {
          this.functionArray.push(node);
          node.segmented = true;
        }
      }, this);
    }

    Object.keys(node).forEach(function(key) {
      /* istanbul ignore next */
      if (key === "range" || key === "loc") {
        result[key] = node[key];
      } else {
        result[key] = this.traverse(node[key]);
      }
    }, this);

    if (isFunctionExpression(result)) {
      this.functionStack.pop();
    }

    return result;
  };

  PreCompiler.prototype.segment = function(list) {
    var result = [];
    var id = 0;
    var i, imax;

    function traverse(parent, node, key) {
      var expr;

      if (node && typeof node === "object") {
        Object.keys(node).forEach(function(key) {
          traverse(node, node[key], key);
        });
      }
      if (isValueMethod(node)) {
        expr = Node.createValueMethodEvaluator(id, node);
        parent[key] = Node.createValueMethodResult(id++);
        result.push(expr);
      }

    }

    for (i = 0, imax = list.length; i < imax; ++i) {
      traverse(list, list[i], i);
      result.push(list[i]);
    }

    return result;
  };

  function isFunctionExpression(node) {
    return node.type === Syntax.FunctionExpression;
  }

  function isSegmentedMethod(node) {
    return node.type === Syntax.CallExpression &&
      (SegmentedMethod.hasOwnProperty(node.method.name) || isValueMethod(node));
  }

  function isValueMethod(node) {
    return node.type === Syntax.CallExpression &&
      node.method.name.substr(0, 5) === "value";
  }

  function precompile(ast) {
    return new PreCompiler().compile(ast);
  }

  sc.lang.compiler.precompile = precompile;

})(sc);

// src/sc/lang/compiler/scope.js
(function(sc) {

  var Message = sc.lang.compiler.Message;

  function Scope(methods) {
    var f = function(parent) {
      this.parent = parent;
      this.stack  = [];
    };

    function F() {}
    F.prototype = Scope;
    f.prototype = new F();

    Object.keys(methods).forEach(function(key) {
      f.prototype[key] = methods[key];
    });

    return f;
  }

  Scope.add = function(type, id, opts) {
    var peek = this.stack[this.stack.length - 1];
    var scope, vars, args, declared, stmt, indent;

    opts = opts || {};

    scope = opts.scope;
    if (scope) {
      vars = scope.vars;
      args = scope.args;
      declared = scope.declared;
      stmt = scope.stmt;
      indent = scope.indent;
    } else {
      vars = peek.vars;
      args = peek.args;
      declared = peek.declared;
      stmt = peek.stmt;
      indent = peek.indent;
    }

    if (args[id]) {
      this.parent.throwError({}, Message.ArgumentAlreadyDeclared, id);
    }

    if (vars[id] && id.charAt(0) !== "_") {
      this.parent.throwError({}, Message.VariableAlreadyDeclared, id);
    }

    switch (type) {
    case "var":
      if (!vars[id]) {
        this.add_delegate(stmt, id, indent, peek, opts);
        vars[id] = true;
        delete declared[id];
      }
      break;
    case "arg":
      args[id] = true;
      delete declared[id];
      break;
    }
  };

  Scope.add_delegate = function() {
  };

  Scope.end = function() {
    this.stack.pop();
  };

  Scope.getDeclaredVariable = function() {
    var peek = this.stack[this.stack.length - 1];
    var declared = {};

    if (peek) {
      Array.prototype.concat.apply([], [
        peek.declared, peek.args, peek.vars
      ].map(Object.keys)).forEach(function(key) {
        declared[key] = true;
      });
    }

    return declared;
  };

  Scope.find = function(id) {
    var peek = this.stack[this.stack.length - 1];
    return peek.vars[id] || peek.args[id] || peek.declared[id];
  };

  Scope.peek = function() {
    return this.stack[this.stack.length - 1];
  };

  sc.lang.compiler.scope = Scope;

})(sc);

// src/sc/lang/compiler/codegen.js
(function(sc) {

  var codegen = {};

  var compiler = sc.lang.compiler;
  var Syntax   = compiler.Syntax;
  var Token    = compiler.Token;
  var Message  = compiler.Message;
  var precompile = compiler.precompile;

  var Scope = compiler.scope({
    add_delegate: function(stmt, id, indent, peek, opts) {
      if (stmt.vars.length === 0) {
        this._addNewVariableStatement(stmt, id, indent);
      } else {
        this._appendVariable(stmt, id);
      }
      if (opts.scope) {
        peek.declared[id] = true;
      }
    },
    _addNewVariableStatement: function(stmt, id, indent) {
      stmt.head.push(indent, "var ");
      stmt.vars.push($id(id));
      stmt.tail.push(";", "\n");
    },
    _appendVariable: function(stmt, id) {
      stmt.vars.push(", ", $id(id));
    },
    begin: function(stream, args) {
      var declared = this.getDeclaredVariable();
      var stmt = { head: [], vars: [], tail: [] };
      var i, imax;

      this.stack.push({
        vars    : {},
        args    : {},
        declared: declared,
        indent  : this.parent.base,
        stmt    : stmt
      });

      for (i = 0, imax = args.length; i < imax; i++) {
        this.add("arg", args[i]);
      }

      stream.push(stmt.head, stmt.vars, stmt.tail);
    },
    begin_ref: function(scope) {
      var refId   = (this._refId | 0);
      var refName = "_ref" + refId;
      this.add("var", refName, { scope: scope, init: false });
      this._refId = refId + 1;
      return refName;
    },
    end_ref: function() {
      var refId = (this._refId | 0) - 1;
      this._refId = Math.max(0, refId);
    }
  });

  function CodeGen(opts) {
    this.opts = opts || {};
    this.base = "";
    this.state = {
      calledSegmentedMethod: false,
      syncBlockScope: null
    };
    this.scope = new Scope(this);
    if (typeof this.opts.bare === "undefined") {
      this.opts.bare = false;
    }
    this.functionStack = [];
    this.functionArray = [];
  }

  CodeGen.prototype.compile = function(ast) {
    ast = precompile(ast);
    return this.generate(ast);
  };

  CodeGen.prototype.toSourceNodeWhenNeeded = function(generated) {
    if (Array.isArray(generated)) {
      return this.flattenToString(generated);
    }
    return generated;
  };

  CodeGen.prototype.flattenToString = function(list) {
    var i, imax, e, result = "";
    for (i = 0, imax = list.length; i < imax; ++i) {
      e = list[i];
      result += Array.isArray(e) ? this.flattenToString(e) : e;
    }
    return result;
  };

  CodeGen.prototype.addIndent = function(stmt) {
    return [ this.base, stmt ];
  };

  CodeGen.prototype.generate = function(node, opts) {
    var result;

    if (Array.isArray(node)) {
      result = [
        "(", this.stitchWith(node, ", ", function(item) {
          return this.generate(item, opts);
        }), ")"
      ];
    } else if (node && node.type) {
      result = this[node.type](node, opts);
      result = this.toSourceNodeWhenNeeded(result, node);
    } else if (typeof node === "string") {
      result = $id(node);
    } else {
      result = node;
    }

    return result;
  };

  CodeGen.prototype.withFunction = function(args, fn) {
    var result;
    var argItems, base;

    argItems = this.stitchWith(args, ", ", function(item) {
      return this.generate(item);
    });

    result = [ "function(", argItems, ") {\n" ];

    base = this.base;
    this.base += "  ";

    this.scope.begin(result, args);
    result.push(fn.call(this));
    this.scope.end();

    this.base = base;

    result.push("\n", this.base, "}");

    return result;
  };

  CodeGen.prototype.withIndent = function(fn) {
    var base, result;

    base = this.base;
    this.base += "  ";
    result = fn.call(this);
    this.base = base;

    return result;
  };

  CodeGen.prototype.insertArrayElement = function(elements) {
    var result, items;

    result = [ "[", "]" ];

    if (elements.length) {
      items = this.withIndent(function() {
        return this.stitchWith(elements, "\n", function(item) {
          return [ this.base, this.generate(item), "," ];
        });
      });
      result.splice(1, 0, "\n", items, "\n", this.base);
    }

    return result;
  };

  CodeGen.prototype.insertKeyValueElement = function(keyValues, with_comma) {
    var result = [];

    if (keyValues) {
      if (with_comma) {
        result.push(", ");
      }
      result.push(
        "{ ", this.stitchWith(Object.keys(keyValues), ", ", function(key) {
          return [ key, ": ", this.generate(keyValues[key]) ];
        }), " }"
      );
    }

    return result;
  };

  CodeGen.prototype.stitchWith = function(elements, bond, fn) {
    var result, i, imax;

    result = [];
    for (i = 0, imax = elements.length; i < imax; ++i) {
      if (i) {
        result.push(bond);
      }
      result.push(fn.call(this, elements[i], i));
    }

    return result;
  };

  CodeGen.prototype.throwError = function(obj, messageFormat) {
    var args, message;

    args = Array.prototype.slice.call(arguments, 2);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    throw new Error(message);
  };

  CodeGen.prototype.AssignmentExpression = function(node) {
    if (Array.isArray(node.left)) {
      return this._DestructuringAssignment(node);
    }

    return this._SimpleAssignment(node);
  };

  CodeGen.prototype._SimpleAssignment = function(node) {
    var result = [];
    var opts;

    opts = { right: node.right, used: false };

    result.push(this.generate(node.left, opts));

    if (!opts.used) {
      result.push(" " + node.operator + " ", this.generate(opts.right));
    }

    return result;
  };

  CodeGen.prototype._DestructuringAssignment = function(node) {
    var elements = node.left;
    var operator = node.operator;
    var assignments;
    var result;
    var ref;

    ref = this.scope.begin_ref();

    assignments = this.withIndent(function() {
      var result, lastUsedIndex;

      lastUsedIndex = elements.length;

      result = [
        this.stitchWith(elements, ",\n", function(item, i) {
          return this.addIndent(this._Assign(
            item, operator, ref + ".$('at', [ $.Integer(" + i + ") ])"
          ));
        })
      ];

      if (node.remain) {
        result.push(",\n", this.addIndent(this._Assign(
          node.remain, operator, ref + ".$('copyToEnd', [ $.Integer(" + lastUsedIndex + ") ])"
        )));
      }

      return result;
    });

    result = [
      "(" + ref + " = ", this.generate(node.right), ",\n",
      assignments , ",\n",
      this.addIndent(ref + ")")
    ];

    this.scope.end_ref();

    return result;
  };

  CodeGen.prototype._Assign = function(left, operator, right) {
    var result = [];
    var opts;

    opts = { right: right, used: false };

    result.push(this.generate(left, opts));

    if (!opts.used) {
      result.push(" " + operator + " ", right);
    }

    return result;
  };

  CodeGen.prototype.BinaryExpression = function(node) {
    var operator = node.operator;

    if (operator === "===" || operator === "!==") {
      return this._EqualityOperator(node);
    }

    return this._BinaryExpression(node);
  };

  CodeGen.prototype._EqualityOperator = function(node) {
    return [
      "$.Boolean(",
      this.generate(node.left), " " + node.operator + " ", this.generate(node.right),
      ")"
    ];
  };

  CodeGen.prototype._BinaryExpression = function(node) {
    var result;

    result = [
      this.generate(node.left),
      ".$('" + node.operator + "', [ ", this.generate(node.right)
    ];

    if (node.adverb) {
      result.push(", ", this.generate(node.adverb));
    }
    result.push(" ])");

    return result;
  };

  CodeGen.prototype.BlockExpression = function(node) {
    var body = this.withFunction([], function() {
      return this._Statements(node.body);
    });

    return [ "(", body, ")()" ];
  };

  CodeGen.prototype.CallExpression = function(node) {
    if (node.segmented) {
      this.state.calledSegmentedMethod = true;
    }

    if (node.args.expand) {
      return this._ExpandCall(node);
    }

    return this._SimpleCall(node);
  };

  CodeGen.prototype._SimpleCall = function(node) {
    var args;
    var list;
    var hasActualArgument;
    var result;
    var ref;

    list = node.args.list;
    hasActualArgument = !!list.length;

    if (node.stamp === "=") {
      ref = this.scope.begin_ref();
      result = [
        "(" + ref + " = ", this.generate(list[0]), ", ",
        this.generate(node.callee), ".$('" + node.method.name + "', [ " + ref + " ]), ",
        ref + ")"
      ];
      this.scope.end_ref();
    } else {
      if (list.length || node.args.keywords) {
        args = [
          this.stitchWith(list, ", ", function(item) {
            return this.generate(item);
          }),
          this.insertKeyValueElement(node.args.keywords, hasActualArgument)
        ];
        result = [
          this.generate(node.callee), ".$('" + node.method.name + "', [ ", args, " ])"
        ];
      } else {
        result = [
          this.generate(node.callee), ".$('" + node.method.name + "')"
        ];
      }
    }

    return result;
  };

  CodeGen.prototype._ExpandCall = function(node) {
    var result;
    var ref;

    ref = this.scope.begin_ref();

    result = [
      "(" + ref + " = ",
      this.generate(node.callee),
      ", " + ref + ".$('" + node.method.name + "', ",
      this.insertArrayElement(node.args.list), ".concat(",
      this.generate(node.args.expand), ".$('asArray')._",
      this.insertKeyValueElement(node.args.keywords, true),
      ")))"
    ];

    this.scope.end_ref();

    return result;
  };

  CodeGen.prototype.EnvironmentExpresion = function(node, opts) {
    var result;

    if (opts) {
      // setter
      result = [ "$.Environment('" + node.id.name + "', ", this.generate(opts.right), ")" ];
      opts.used = true;
    } else {
      // getter
      result = "$.Environment('" + node.id.name + "')";
    }

    return result;
  };

  CodeGen.prototype.FunctionExpression = function(node) {
    var info = getInformationOfFunction(node);

    return [
      "$.Function(",
      this._FunctionBody(node, info.args),
      this._FunctionMetadata(info),
      ")"
    ];
  };

  CodeGen.prototype._FunctionBody = function(node, args) {
    var fargs, body, assignArguments;

    fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    assignArguments = function(item, i) {
      return $id(args[i]) + " = " + fargs[i];
    };

    body = this.withFunction([], function() {
      var result = [];
      var fragments = [], syncBlockScope;
      var elements = node.body;
      var i, imax;
      var functionBodies, calledSegmentedMethod;

      if (elements.length) {
        for (i = 0, imax = args.length; i < imax; ++i) {
          this.scope.add("var", args[i], { init: false });
        }

        syncBlockScope = this.state.syncBlockScope;
        this.state.syncBlockScope = this.scope.peek();

        functionBodies = this.withIndent(function() {
          var fragments = [];
          var i = 0, imax = elements.length;
          var lastIndex = imax - 1;

          fragments.push("\n");

          var loop = function() {
            var fragments = [];
            var stmt, j = 0;

            while (i < imax) {
              if (i === 0) {
                if (args.length) {
                  stmt = this.stitchWith(args, "; ", assignArguments);
                  fragments.push([ this.addIndent(stmt), ";", "\n" ]);
                }
              } else if (j) {
                fragments.push("\n");
              }

              calledSegmentedMethod = this.state.calledSegmentedMethod;
              this.state.calledSegmentedMethod = false;
              stmt = this.generate(elements[i]);

              if (i === lastIndex || this.state.calledSegmentedMethod) {
                stmt = [ "return ", stmt ];
              }
              fragments.push([ this.addIndent(stmt), ";" ]);
              j += 1;

              i += 1;
              if (this.state.calledSegmentedMethod) {
                break;
              }
              this.state.calledSegmentedMethod = calledSegmentedMethod;
            }

            return fragments;
          };

          while (i < imax) {
            if (i) {
              fragments.push(",", "\n", this.addIndent(this.withFunction([], loop)));
            } else {
              fragments.push(this.addIndent(this.withFunction(fargs, loop)));
            }
          }

          fragments.push("\n");

          return fragments;
        });

        fragments.push("return [", functionBodies, this.addIndent("];"));
      } else {
        fragments.push("return [];");
      }

      result.push([ this.addIndent(fragments) ]);

      this.state.syncBlockScope = syncBlockScope;

      return result;
    });

    return body;
  };

  var format_argument = function(node) {
    switch (node.valueType) {
    case Token.NilLiteral   : return "nil";
    case Token.TrueLiteral  : return "true";
    case Token.FalseLiteral : return "false";
    case Token.CharLiteral  : return "$" + node.value;
    case Token.SymbolLiteral: return "\\" + node.value;
    }
    switch (node.value) {
    case "Infinity" : return "inf";
    case "-Infinity": return "-inf";
    }
    return node.value;
  };

  CodeGen.prototype._FunctionMetadata = function(info) {
    var keys, vals;
    var args, result;

    keys = info.keys;
    vals = info.vals;

    if (keys.length === 0 && !info.remain && !info.closed) {
      return [];
    }

    args = this.stitchWith(keys, "; ", function(item, i) {
      var result = [ keys[i] ];

      if (vals[i]) {
        if (vals[i].type === Syntax.ListExpression) {
          result.push("=[ ", this.stitchWith(vals[i].elements, ", ", function(item) {
            return format_argument(item);
          }), " ]");
        } else {
          result.push("=", format_argument(vals[i]));
        }
      }

      return result;
    });

    result = [ ", '", args ];

    if (info.remain) {
      if (keys.length) {
        result.push("; ");
      }
      result.push("*" + info.remain);
    }
    result.push("'");

    if (info.closed) {
      result.push(", true");
    }

    return result;
  };

  CodeGen.prototype.Identifier = function(node, opts) {
    var name = node.name;

    if (isClassName(name)) {
      return "$('" + name + "')";
    }

    if (this.scope.find(name)) {
      return $id(name);
    }

    if (name.length === 1) {
      return this._InterpreterVariable(node, opts);
    }

    this.throwError(null, Message.VariableNotDefined, name);
  };

  CodeGen.prototype._InterpreterVariable = function(node, opts) {
    var name, ref;

    if (opts) {
      // setter
      ref = this.scope.begin_ref();
      name = [
        "(" + ref + " = ", this.generate(opts.right),
        ", $.This().$('" + node.name + "_', [ " + ref + " ]), " + ref + ")"
      ];
      opts.used = true;
      this.scope.end_ref();
    } else {
      // getter
      name = "$.This().$('" + node.name + "')";
    }

    return name;
  };

  CodeGen.prototype.ListExpression = function(node) {
    var result;

    result = [
      "$.Array(",
      this.insertArrayElement(node.elements),
    ];

    if (node.immutable) {
      result.push(", ", "true");
    }

    result.push(")");

    return result;
  };

  CodeGen.prototype.Literal = function(node) {
    switch (node.valueType) {
    case Token.IntegerLiteral:
      return "$.Integer(" + node.value + ")";
    case Token.FloatLiteral:
      return "$.Float(" + node.value + ")";
    case Token.CharLiteral:
      return "$.Char('" + node.value + "')";
    case Token.SymbolLiteral:
      return "$.Symbol('" + node.value + "')";
    case Token.StringLiteral:
      return "$.String('" + node.value + "')";
    case Token.TrueLiteral:
      return "$.True()";
    case Token.FalseLiteral:
      return "$.False()";
    }

    return "$.Nil()";
  };

  CodeGen.prototype.EventExpression = function(node) {
    return [
      "$.Event(", this.insertArrayElement(node.elements), ")"
    ];
  };

  CodeGen.prototype.Program = function(node) {
    var result, body;

    if (node.body.length) {
      body = this.withFunction([ "" ], function() { // "" compiled as $
        return this._Statements(node.body);
      });

      result = [ "(", body, ")" ];

      if (!this.opts.bare) {
        result = [ "SCScript", result, ";" ];
      }
    } else {
      result = [];
    }

    return result;
  };

  CodeGen.prototype.ThisExpression = function(node) {
    var name = node.name;
    name = name.charAt(0).toUpperCase() + name.substr(1);
    return [ "$." + name + "()" ];
  };

  CodeGen.prototype.UnaryExpression = function(node) {
    /* istanbul ignore else */
    if (node.operator === "`") {
      return [ "$.Ref(", this.generate(node.arg), ")" ];
    }

    /* istanbul ignore next */
    throw new Error("Unknown UnaryExpression: " + node.operator);
  };

  CodeGen.prototype.VariableDeclaration = function(node) {
    var scope = this.state.syncBlockScope;

    return this.stitchWith(node.declarations, ", ", function(item) {
      var result;

      this.scope.add("var", item.id.name, { scope: scope, init: false });

      result = [ this.generate(item.id) ];

      if (item.init) {
        result.push(" = ", this.generate(item.init));
      } else {
        result.push(" = $.Nil()");
      }

      return result;
    });
  };

  CodeGen.prototype.ValueMethodEvaluator = function(node) {
    this.state.calledSegmentedMethod = true;
    return [ "this.push(", this.generate(node.expr), ")" ];
  };

  CodeGen.prototype.ValueMethodResult = function() {
    return "this.shift()";
  };

  CodeGen.prototype._Statements = function(elements) {
    var lastIndex = elements.length - 1;

    return this.stitchWith(elements, "\n", function(item, i) {
      var stmt;

      stmt = this.generate(item);

      if (i === lastIndex) {
        stmt = [ "return ", stmt ];
      }

      return [ this.addIndent(stmt), ";" ];
    });
  };

  var $id = function(id) {
    var ch = id.charAt(0);

    if (ch !== "_" && ch !== "$") {
      id = "$" + id;
    }

    return id;
  };

  var getInformationOfFunction = function(node) {
    var args = [];
    var keys, vals, remain;
    var list, i, imax;

    keys = [];
    vals = [];
    remain = null;

    if (node.args) {
      list = node.args.list;
      for (i = 0, imax = list.length; i < imax; ++i) {
        args.push(list[i].id.name);
        keys.push(list[i].id.name);
        vals.push(list[i].init);
      }
      if (node.args.remain) {
        remain = node.args.remain.name;
        args.push(remain);
      }
    }

    if (node.partial) {
      keys = [];
    }

    return {
      args  : args,
      keys  : keys,
      vals  : vals,
      remain: remain,
      closed: node.closed
    };
  };

  var isClassName = function(name) {
    var ch0 = name.charAt(0);
    return "A" <= ch0 && ch0 <= "Z";
  };

  codegen.compile = function(ast, opts) {
    return new CodeGen(opts).compile(ast);
  };

  compiler.codegen = codegen;

})(sc);

// src/sc/lang/compiler/marker.js
(function(sc) {

  function Marker(lexer, locItems) {
    this.lexer = lexer;
    this.startLocItems = locItems;
    this.endLocItems   = null;
  }

  Marker.create = function(lexer, node) {
    var locItems;

    if (!lexer.opts.loc && !lexer.opts.range) {
      return nopMarker;
    }

    if (node) {
      locItems = [ node.range[0], node.loc.start.line, node.loc.start.column ];
    } else {
      lexer.skipComment();
      locItems = lexer.getLocItems();
    }

    return new Marker(lexer, locItems);
  };

  Marker.prototype.update = function(node) {
    var locItems;

    if (node) {
      locItems = [ node.range[1], node.loc.end.line, node.loc.end.column ];
    } else {
      locItems = this.lexer.getLocItems();
    }
    this.endLocItems = locItems;

    return this;
  };

  Marker.prototype.apply = function(node, force) {
    var startLocItems, endLocItems;

    if (Array.isArray(node)) {
      return node;
    }

    if (force || !node.range || !node.loc) {
      startLocItems = this.startLocItems;
      if (this.endLocItems) {
        endLocItems = this.endLocItems;
      } else {
        endLocItems = this.startLocItems;
      }
      /* istanbul ignore else */
      if (this.lexer.opts.range) {
        node.range = [ startLocItems[0], endLocItems[0] ];
      }
      /* istanbul ignore else */
      if (this.lexer.opts.loc) {
        node.loc = {
          start: {
            line  : startLocItems[1],
            column: startLocItems[2]
          },
          end: {
            line  : endLocItems[1],
            column: endLocItems[2]
          }
        };
      }
    }

    return node;
  };

  var nopMarker = {
    apply: function(node) {
      return node;
    },
    update: function() {
      return this;
    }
  };

  sc.lang.compiler.marker = Marker;

})(sc);

// src/sc/lang/compiler/lexer.js
(function(sc) {

  var Token    = sc.lang.compiler.Token;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;

  function Lexer(source, opts) {
    /* istanbul ignore next */
    if (typeof source !== "string") {
      if (typeof source === "undefined") {
        source = "";
      }
      source = String(source);
    }
    source = source.replace(/\r\n?/g, "\n");

    opts = opts || /* istanbul ignore next */ {};

    this.source = source;
    this.opts   = opts;
    this.length = source.length;
    this.index  = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart  = 0;
    this.reverted   = null;
    this.errors     = opts.tolerant ? [] : null;

    this.peek();
  }

  function char2num(ch) {
    var n = ch.charCodeAt(0);

    if (48 <= n && n <= 57) {
      return n - 48;
    }
    if (65 <= n && n <= 90) {
      return n - 55;
    }
    return n - 87; // if (97 <= n && n <= 122)
  }

  function isAlpha(ch) {
    return ("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z");
  }

  function isNumber(ch) {
    return "0" <= ch && ch <= "9";
  }

  Lexer.prototype.tokenize = function() {
    var tokens, token;

    tokens = [];

    while (true) {
      token = this.collectToken();
      if (token.type === Token.EOF) {
        break;
      }
      tokens.push(token);
    }

    return tokens;
  };

  Lexer.prototype.collectToken = function() {
    var loc, token, t;

    this.skipComment();

    loc = {
      start: {
        line  : this.lineNumber,
        column: this.index - this.lineStart
      }
    };

    token = this.advance();

    loc.end = {
      line  : this.lineNumber,
      column: this.index - this.lineStart
    };

    t = {
      type : token.type,
      value: token.value
    };

    if (this.opts.range) {
      t.range = token.range;
    }
    if (this.opts.loc) {
      t.loc = loc;
    }

    return t;
  };

  Lexer.prototype.skipComment = function() {
    var source = this.source;
    var length = this.length;
    var index = this.index;
    var ch;

    LOOP: while (index < length) {
      ch = source.charAt(index);

      if (ch === " " || ch === "\t") {
        index += 1;
        continue;
      }

      if (ch === "\n") {
        index += 1;
        this.lineNumber += 1;
        this.lineStart = index;
        continue;
      }

      if (ch === "/") {
        ch = source.charAt(index + 1);
        if (ch === "/") {
          index = this.skipLineComment(index + 2);
          continue;
        }
        if (ch === "*") {
          index = this.skipBlockComment(index + 2);
          continue;
        }
      }

      break;
    }

    this.index = index;
  };

  Lexer.prototype.skipLineComment = function(index) {
    var source = this.source;
    var length = this.length;
    var ch;

    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
        break;
      }
    }

    return index;
  };

  Lexer.prototype.skipBlockComment = function(index) {
    var source = this.source;
    var length = this.length;
    var ch, depth;

    depth = 1;
    while (index < length) {
      ch = source.charAt(index);

      if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else {
        ch = ch + source.charAt(index + 1);
        if (ch === "/*") {
          depth += 1;
          index += 1;
        } else if (ch === "*/") {
          depth -= 1;
          index += 1;
          if (depth === 0) {
            return index + 1;
          }
        }
      }

      index += 1;
    }
    this.throwError({}, Message.UnexpectedToken, "ILLEGAL");

    return index;
  };

  Lexer.prototype.advance = function() {
    var ch, token;

    this.skipComment();

    if (this.length <= this.index) {
      return this.EOFToken();
    }

    ch = this.source.charAt(this.index);

    if (ch === "\\") {
      return this.scanSymbolLiteral();
    }
    if (ch === "'") {
      return this.scanQuotedLiteral(Token.SymbolLiteral, ch);
    }

    if (ch === "$") {
      return this.scanCharLiteral();
    }

    if (ch === '"') {
      return this.scanQuotedLiteral(Token.StringLiteral, ch);
    }

    if (ch === "_") {
      return this.scanUnderscore();
    }

    if (ch === "-") {
      token = this.scanNegativeNumericLiteral();
      if (token) {
        return token;
      }
    }

    if (isAlpha(ch)) {
      return this.scanIdentifier();
    }

    if (isNumber(ch)) {
      return this.scanNumericLiteral();
    }

    return this.scanPunctuator();
  };

  Lexer.prototype.peek = function() {
    var index, lineNumber, lineStart;

    index      = this.index;
    lineNumber = this.lineNumber;
    lineStart  = this.lineStart;

    this.lookahead = this.advance();

    this.index      = index;
    this.lineNumber = lineNumber;
    this.lineStart  = lineStart;
  };

  Lexer.prototype.lex = function(saved) {
    var that = this;
    var token = this.lookahead;

    if (saved) {
      saved = [
        this.lookahead,
        this.index,
        this.lineNumber,
        this.lineStart
      ];
    }

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    this.lookahead = this.advance();

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    if (saved) {
      token.revert = function() {
        that.lookahead  = saved[0];
        that.index      = saved[1];
        that.lineNumber = saved[2];
        that.lineStart  = saved[3];
      };
    }

    return token;
  };

  Lexer.prototype.makeToken = function(type, value, start) {
    return {
      type : type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart : this.lineStart,
      range: [ start, this.index ]
    };
  };

  Lexer.prototype.EOFToken = function() {
    return this.makeToken(Token.EOF, "<EOF>", this.index);
  };

  Lexer.prototype.scanCharLiteral = function() {
    var start, value;

    start = this.index;
    value = this.source.charAt(this.index + 1);

    this.index += 2;

    return this.makeToken(Token.CharLiteral, value, start);
  };

  Lexer.prototype.scanIdentifier = function() {
    var source = this.source.slice(this.index);
    var start = this.index;
    var value, type;

    value = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(source)[0];

    this.index += value.length;

    if (this.source.charAt(this.index) === ":") {
      this.index += 1;
      return this.makeToken(Token.Label, value, start);
    } else if (this.isKeyword(value)) {
      type = Token.Keyword;
    } else {
      switch (value) {
      case "inf":
        type = Token.FloatLiteral;
        value = "Infinity";
        break;
      case "pi":
        type = Token.FloatLiteral;
        value = String(Math.PI);
        break;
      case "nil":
        type = Token.NilLiteral;
        value = "nil";
        break;
      case "true":
        type = Token.TrueLiteral;
        break;
      case "false":
        type = Token.FalseLiteral;
        break;
      default:
        type = Token.Identifier;
        break;
      }
    }

    return this.makeToken(type, value, start);
  };

  Lexer.prototype.scanNumericLiteral = function(neg) {
    return this.scanNAryNumberLiteral(neg) ||
      this.scanHexNumberLiteral(neg) ||
      this.scanAccidentalNumberLiteral(neg) ||
      this.scanDecimalNumberLiteral(neg);
  };

  Lexer.prototype.scanNegativeNumericLiteral = function() {
    var token, ch1, ch2, ch3;
    var start, value = null;

    start = this.index;
    ch1 = this.source.charAt(this.index + 1);

    if (isNumber(ch1)) {
      this.index += 1;
      token = this.scanNumericLiteral(true);
      token.range[0] = start;
      return token;
    }

    ch2 = this.source.charAt(this.index + 2);
    ch3 = this.source.charAt(this.index + 3);

    if (ch1 + ch2 === "pi") {
      this.index += 3;
      value = String(-Math.PI);
    } else if (ch1 + ch2 + ch3 === "inf") {
      this.index += 4;
      value = "-Infinity";
    }

    if (value !== null) {
      return this.makeToken(Token.FloatLiteral, value, start);
    }

    return null;
  };

  var makeNumberToken = function(type, value, neg, pi) {
    if (neg) {
      value *= -1;
    }

    if (pi) {
      type = Token.FloatLiteral;
      value = value * Math.PI;
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    } else {
      value = String(value);
    }

    return {
      type : type,
      value: value
    };
  };

  Lexer.prototype.scanNAryNumberLiteral = function(neg) {
    var re, start, items;
    var base, integer, frac, pi;
    var value, type;
    var token;

    re = /^(\d+)r((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+)(?:\.((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+))?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    base    = items[1].replace(/^0+(?=\d)/g, "")|0;
    integer = items[2].replace(/(^0+(?=\d)|_)/g, "");
    frac    = items[3] && items[3].replace(/_/g, "");

    if (!frac && base < 26 && integer.substr(-2) === "pi") {
      integer = integer.slice(0, -2);
      pi = true;
    }

    type  = Token.IntegerLiteral;
    value = this.calcNBasedInteger(integer, base);

    if (frac) {
      type = Token.FloatLiteral;
      value += this.calcNBasedFrac(frac, base);
    }

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.char2num = function(ch, base) {
    var x = char2num(ch, base);
    if (x >= base) {
      this.throwError({}, Message.UnexpectedToken, ch);
    }
    return x;
  };

  Lexer.prototype.calcNBasedInteger = function(integer, base) {
    var value, i, imax;

    for (i = value = 0, imax = integer.length; i < imax; ++i) {
      value *= base;
      value += this.char2num(integer[i], base);
    }

    return value;
  };

  Lexer.prototype.calcNBasedFrac = function(frac, base) {
    var value, i, imax;

    for (i = value = 0, imax = frac.length; i < imax; ++i) {
      value += this.char2num(frac[i], base) * Math.pow(base, -(i + 1));
    }

    return value;
  };

  Lexer.prototype.scanHexNumberLiteral = function(neg) {
    var re, start, items;
    var integer, pi;
    var value, type;
    var token;

    re = /^(0x(?:[\da-fA-F](?:_(?=[\da-fA-F]))?)+)(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    integer = items[1].replace(/_/g, "");
    pi      = !!items[2];

    type  = Token.IntegerLiteral;
    value = +integer;

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanAccidentalNumberLiteral = function(neg) {
    var re, start, items;
    var integer, accidental, cents;
    var sign, value;
    var token;

    re = /^(\d+)([bs]+)(\d*)/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    integer    = items[1];
    accidental = items[2];
    sign = (accidental.charAt(0) === "s") ? +1 : -1;

    if (items[3] === "") {
      cents = Math.min(accidental.length * 0.1, 0.4);
    } else {
      cents = Math.min(items[3] * 0.001, 0.499);
    }
    value = +integer + (sign * cents);

    token = makeNumberToken(Token.FloatLiteral, value, neg, false);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanDecimalNumberLiteral = function(neg) {
    var re, start, items, integer, frac, pi;
    var value, type;
    var token;

    re = /^((?:\d(?:_(?=\d))?)+((?:\.(?:\d(?:_(?=\d))?)+)?(?:e[-+]?(?:\d(?:_(?=\d))?)+)?))(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    integer = items[1];
    frac    = items[2];
    pi      = items[3];

    type  = (frac || pi) ? Token.FloatLiteral : Token.IntegerLiteral;
    value = +integer.replace(/(^0+(?=\d)|_)/g, "");

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanPunctuator = function() {
    var re, start, items;

    re = /^(\.{1,3}|[(){}[\]:;,~#`]|[-+*\/%<=>!?&|@]+)/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (items) {
      this.index += items[0].length;
      return this.makeToken(Token.Punctuator, items[0], start);
    }

    this.throwError({}, Message.UnexpectedToken, this.source.charAt(this.index));

    this.index = this.length;

    return this.EOFToken();
  };

  Lexer.prototype.scanQuotedLiteral = function(type, quote) {
    var start, value;
    start = this.index;
    value = this._scanQuotedLiteral(quote);
    return value ? this.makeToken(type, value, start) : this.EOFToken();
  };

  Lexer.prototype._scanQuotedLiteral = function(quote) {
    var source, length, index, start, value, ch;

    source = this.source;
    length = this.length;
    index  = this.index + 1;
    start  = index;
    value  = null;

    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === quote) {
        value = source.substr(start, index - start - 1).replace(/\n/g, "\\n");
        break;
      } else if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else if (ch === "\\") {
        index += 1;
      }
    }

    this.index = index;

    if (!value) {
      this.throwError({}, Message.UnexpectedToken, "ILLEGAL");
    }

    return value;
  };

  Lexer.prototype.scanSymbolLiteral = function() {
    var re, start, items;
    var value;

    re = /^\\([a-zA-Z_]\w*|\d+)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    value = items[1] || "";

    this.index += items[0].length;

    return this.makeToken(Token.SymbolLiteral, value, start);
  };

  Lexer.prototype.scanUnderscore = function() {
    var start = this.index;

    this.index += 1;

    return this.makeToken(Token.Identifier, "_", start);
  };

  Lexer.prototype.isKeyword = function(value) {
    return !!Keywords[value] || false;
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.index, this.lineNumber, this.index - this.lineStart ];
  };

  Lexer.prototype.throwError = function(token, messageFormat) {
    var args, message;
    var error, index, lineNumber, column;
    var prev;

    args = Array.prototype.slice.call(arguments, 2);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    if (typeof token.lineNumber === "number") {
      index      = token.range[0];
      lineNumber = token.lineNumber;
      column     = token.range[0] - token.lineStart + 1;
    } else {
      index      = this.index;
      lineNumber = this.lineNumber;
      column     = index - this.lineStart + 1;
    }

    error = new Error("Line " + lineNumber + ": " + message);
    error.index       = index;
    error.lineNumber  = lineNumber;
    error.column      = column;
    error.description = message;

    if (this.errors) {
      prev = this.errors[this.errors.length - 1];
      if (!(prev && error.index <= prev.index)) {
        this.errors.push(error);
      }
    } else {
      throw error;
    }
  };

  sc.lang.compiler.lexer = Lexer;

})(sc);

// src/sc/lang/compiler/parser.js
(function(sc) {

  var parser = {};

  var Token    = sc.lang.compiler.Token;
  var Syntax   = sc.lang.compiler.Syntax;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;
  var Lexer    = sc.lang.compiler.lexer;
  var Marker   = sc.lang.compiler.marker;
  var Node     = sc.lang.compiler.node;

  var binaryPrecedenceDefaults = {
    "?"  : 1,
    "??" : 1,
    "!?" : 1,
    "->" : 2,
    "||" : 3,
    "&&" : 4,
    "|"  : 5,
    "&"  : 6,
    "==" : 7,
    "!=" : 7,
    "===": 7,
    "!==": 7,
    "<"  : 8,
    ">"  : 8,
    "<=" : 8,
    ">=" : 8,
    "<<" : 9,
    ">>" : 9,
    "+>>": 9,
    "+"  : 10,
    "-"  : 10,
    "*"  : 11,
    "/"  : 11,
    "%"  : 11,
    "!"  : 12,
  };

  var Scope = sc.lang.compiler.scope({
    begin: function() {
      var declared = this.getDeclaredVariable();

      this.stack.push({
        vars: {},
        args: {},
        declared: declared
      });
    }
  });

  function SCParser(source, opts) {
    var binaryPrecedence;

    this.opts  = opts || /* istanbul ignore next */ {};
    this.lexer = new Lexer(source, opts);
    this.scope = new Scope(this);
    this.state = {
      closedFunction: false,
      disallowGenerator: false,
      innerElements: false,
      immutableList: false,
      underscore: []
    };

    if (this.opts.binaryPrecedence) {
      if (typeof this.opts.binaryPrecedence === "object") {
        binaryPrecedence = this.opts.binaryPrecedence;
      } else {
        binaryPrecedence = binaryPrecedenceDefaults;
      }
    }

    this.binaryPrecedence = binaryPrecedence || {};
  }

  Object.defineProperty(SCParser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  SCParser.prototype.lex = function() {
    return this.lexer.lex();
  };

  SCParser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
  };

  SCParser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  SCParser.prototype.matchAny = function(list) {
    var value, i, imax;

    value = this.lexer.lookahead.value;
    for (i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }

    return null;
  };

  SCParser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  SCParser.prototype.throwUnexpected = function(token) {
    switch (token.type) {
    case Token.EOF:
      this.throwError(token, Message.UnexpectedEOS);
      break;
    case Token.FloatLiteral:
    case Token.IntegerLiteral:
      this.throwError(token, Message.UnexpectedNumber);
      break;
    case Token.CharLiteral:
    case Token.StringLiteral:
    case Token.SymbolLiteral:
      this.throwError(token, Message.UnexpectedLiteral, token.type.toLowerCase());
      break;
    case Token.Identifier:
      this.throwError(token, Message.UnexpectedIdentifier);
      break;
    default:
      this.throwError(token, Message.UnexpectedToken, token.value);
      break;
    }
  };

  SCParser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
  };

  SCParser.prototype.parse = function() {
    return this.parseProgram();
  };

  // 1. Program
  SCParser.prototype.parseProgram = function() {
    var node, marker;

    marker = Marker.create(this.lexer);

    node = this.withScope(function() {
      var body;

      body = this.parseFunctionBody(null);
      if (body.length === 1 && body[0].type === Syntax.BlockExpression) {
        body = body[0].body;
      }

      return Node.createProgram(body);
    });

    return marker.update().apply(node);
  };

  // 2. Function
  // 2.1 Function Expression
  SCParser.prototype.parseFunctionExpression = function(closed, blocklist) {
    var node;

    node = this.withScope(function() {
      var args, body;

      if (this.match("|")) {
        args = this.parseFunctionArgument("|");
      } else if (this.match("arg")) {
        args = this.parseFunctionArgument(";");
      }
      body = this.parseFunctionBody("}");

      return Node.createFunctionExpression(args, body, closed, false, blocklist);
    });

    return node;
  };

  // 2.2 Function Argument
  SCParser.prototype.parseFunctionArgument = function(expect) {
    var args = { list: [] };

    this.lex();

    if (!this.match("...")) {
      do {
        args.list.push(this.parseFunctionArgumentElement());
        if (!this.match(",")) {
          break;
        }
        this.lex();
      } while (this.lookahead.type !== Token.EOF);
    }

    if (this.match("...")) {
      this.lex();
      args.remain = this.parseVariableIdentifier();
      this.scope.add("arg", args.remain.name);
    }

    this.expect(expect);

    return args;
  };

  SCParser.prototype._parseArgVarElement = function(type, method) {
    var init = null, id;
    var marker, declarator;

    marker = Marker.create(this.lexer);

    id = this.parseVariableIdentifier();
    this.scope.add(type, id.name);

    if (this.match("=")) {
      this.lex();
      init = this[method]();
    }

    declarator = Node.createVariableDeclarator(id, init);

    return marker.update().apply(declarator);
  };

  SCParser.prototype.parseFunctionArgumentElement = function() {
    var node = this._parseArgVarElement("arg", "parseArgumentableValue");

    if (node.init && !isValidArgumentValue(node.init)) {
      this.throwUnexpected(this.lookahead);
    }

    return node;
  };

  // 2.3 Function Body
  SCParser.prototype.parseFunctionBody = function(match) {
    var elements = [];

    while (this.match("var")) {
      elements.push(this.parseVariableDeclaration());
    }

    while (this.lookahead.type !== Token.EOF && !this.match(match)) {
      elements.push(this.parseExpression());
      if (this.lookahead.type !== Token.EOF && !this.match(match)) {
        this.expect(";");
      } else {
        break;
      }
    }

    return elements;
  };

  // 3. Variable Declarations
  SCParser.prototype.parseVariableDeclaration = function() {
    var declaration;
    var marker;

    marker = Marker.create(this.lexer);

    this.lex(); // var

    declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarationList(), "var"
    );

    declaration = marker.update().apply(declaration);

    this.expect(";");

    return declaration;
  };

  SCParser.prototype.parseVariableDeclarationList = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclarationElement());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.lookahead.type !== Token.EOF);

    return list;
  };

  SCParser.prototype.parseVariableDeclarationElement = function() {
    return this._parseArgVarElement("var", "parseAssignmentExpression");
  };

  // 4. Expression
  SCParser.prototype.parseExpression = function(node) {
    return this.parseAssignmentExpression(node);
  };

  // 4.1 Expressions
  SCParser.prototype.parseExpressions = function(node) {
    var nodes = [];

    if (node) {
      nodes.push(node);
      this.lex();
    }

    while (this.lookahead.type !== Token.EOF && !this.matchAny([ ",", ")", "]", ".." ])) {
      var marker;

      marker = Marker.create(this.lexer);
      node   = this.parseAssignmentExpression();
      node   = marker.update().apply(node);

      nodes.push(node);

      if (this.match(";")) {
        this.lex();
      }
    }

    if (nodes.length === 0) {
      this.throwUnexpected(this.lookahead);
    }

    return nodes.length === 1 ? nodes[0] : nodes;
  };

  // 4.2 Assignment Expression
  SCParser.prototype.parseAssignmentExpression = function(node) {
    var token, marker;

    if (node) {
      return this.parsePartialExpression(node);
    }

    marker = Marker.create(this.lexer);

    if (this.match("#")) {
      token = this.lexer.lex(true);
      if (this.matchAny([ "[", "{" ])) {
        token.revert();
      } else {
        node = this.parseDestructuringAssignmentExpression();
      }
    }

    if (!node) {
      node = this.parseSimpleAssignmentExpression();
    }

    return marker.update().apply(node);
  };

  SCParser.prototype.parseDestructuringAssignmentExpression = function() {
    var node, left, right, token;

    left = this.parseDestructuringAssignmentLeft();
    token = this.lookahead;
    this.expect("=");

    right = this.parseAssignmentExpression();
    node = Node.createAssignmentExpression(
      token.value, left.list, right, left.remain
    );

    return node;
  };

  SCParser.prototype.parseSimpleAssignmentExpression = function() {
    var node, left, right, token, methodName, marker;

    node = left = this.parsePartialExpression();

    if (this.match("=")) {
      if (node.type === Syntax.CallExpression) {
        marker = Marker.create(this.lexer, left);

        token = this.lex();
        right = this.parseAssignmentExpression();
        methodName = left.method.name + "_";
        left.method.name = methodName;
        left.args.list   = node.args.list.concat(right);
        if (left.stamp !== "[")  {
          left.stamp = "=";
        }
        node = marker.update().apply(left, true);
      } else {
        if (!isLeftHandSide(left)) {
          this.throwError(left, Message.InvalidLHSInAssignment);
        }

        token = this.lex();
        right = this.parseAssignmentExpression();
        node  = Node.createAssignmentExpression(
          token.value, left, right
        );
      }
    }

    return node;
  };

  SCParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = { list: [] }, element;

    do {
      element = this.parseLeftHandSideExpression();
      if (!isLeftHandSide(element)) {
        this.throwError(element, Message.InvalidLHSInAssignment);
      }
      params.list.push(element);
      if (this.match(",")) {
        this.lex();
      } else if (this.match("...")) {
        this.lex();
        params.remain = this.parseLeftHandSideExpression();
        if (!isLeftHandSide(params.remain)) {
          this.throwError(params.remain, Message.InvalidLHSInAssignment);
        }
        break;
      }
    } while (this.lookahead.type !== Token.EOF && !this.match("="));

    return params;
  };

  // 4.3 Partial Expression
  SCParser.prototype.parsePartialExpression = function(node) {
    var underscore, x, y;

    if (this.state.innerElements) {
      node = this.parseBinaryExpression(node);
    } else {
      underscore = this.state.underscore;
      this.state.underscore = [];

      node = this.parseBinaryExpression(node);

      if (this.state.underscore.length) {
        node = this.withScope(function() {
          var args, i, imax;

          args = new Array(this.state.underscore.length);
          for (i = 0, imax = args.length; i < imax; ++i) {
            x = this.state.underscore[i];
            y = Node.createVariableDeclarator(x);
            args[i] = Marker.create(this.lexer, x).update(x).apply(y);
            this.scope.add("arg", this.state.underscore[i].name);
          }

          return Node.createFunctionExpression(
            { list: args }, [ node ], false, true, false
          );
        });
      }

      this.state.underscore = underscore;
    }

    return node;
  };

  // 4.4 Conditional Expression
  // 4.5 Binary Expression
  SCParser.prototype.parseBinaryExpression = function(node) {
    var marker, left, token, prec;

    marker = Marker.create(this.lexer);
    left   = this.parseUnaryExpression(node);
    token  = this.lookahead;

    prec = calcBinaryPrecedence(token, this.binaryPrecedence);
    if (prec === 0) {
      if (node) {
        return this.parseUnaryExpression(node);
      }
      return left;
    }
    this.lex();

    token.prec   = prec;
    token.adverb = this.parseAdverb();

    return this.sortByBinaryPrecedence(left, token, marker);
  };

  SCParser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var expr;
    var prec, token;
    var markers, i;
    var right, stack;

    markers = [ marker, Marker.create(this.lexer) ];
    right = this.parseUnaryExpression();

    stack = [ left, operator, right ];

    while ((prec = calcBinaryPrecedence(this.lookahead, this.binaryPrecedence)) > 0) {
      // Reduce: make a binary expression from the three topmost entries.
      while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
        right    = stack.pop();
        operator = stack.pop();
        left     = stack.pop();
        expr = Node.createBinaryExpression(operator, left, right);
        markers.pop();

        marker = markers.pop();
        marker.update().apply(expr);

        stack.push(expr);

        markers.push(marker);
      }

      // Shift.
      token = this.lex();
      token.prec = prec;
      token.adverb = this.parseAdverb();

      stack.push(token);

      markers.push(Marker.create(this.lexer));
      expr = this.parseUnaryExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    i = stack.length - 1;
    expr = stack[i];
    markers.pop();
    while (i > 1) {
      expr = Node.createBinaryExpression(stack[i - 1], stack[i - 2], expr);
      i -= 2;
      marker = markers.pop();
      marker.update().apply(expr);
    }

    return expr;
  };

  SCParser.prototype.parseAdverb = function() {
    var adverb, lookahead;

    if (this.match(".")) {
      this.lex();

      lookahead = this.lookahead;
      adverb = this.parsePrimaryExpression();

      if (adverb.type === Syntax.Literal) {
        return adverb;
      }

      if (adverb.type === Syntax.Identifier) {
        adverb.type = Syntax.Literal;
        adverb.value = adverb.name;
        adverb.valueType = Token.SymbolLiteral;
        delete adverb.name;
        return adverb;
      }

      this.throwUnexpected(lookahead);
    }

    return null;
  };

  // 4.6 Unary Expressions
  SCParser.prototype.parseUnaryExpression = function(node) {
    var token, expr, method;
    var marker;

    marker = Marker.create(this.lexer);

    switch (this.matchAny([ "`", "-" ])) {
    case "`":
      token = this.lex();
      expr = this.parseLeftHandSideExpression();
      expr = Node.createUnaryExpression(token.value, expr);
      break;
    case "-":
      token = this.lex();
      method = Node.createIdentifier("neg");
      method = marker.update().apply(method);
      expr = this.parseLeftHandSideExpression();
      expr = Node.createCallExpression(expr, method, { list: [] }, ".");
      break;
    default:
      expr = this.parseLeftHandSideExpression(node);
      break;
    }

    return marker.update().apply(expr, true);
  };

  // 4.7 LeftHandSide Expressions
  SCParser.prototype.parseLeftHandSideExpression = function(node) {
    var marker, expr, prev, lookahead;
    var blocklist, stamp;

    marker = Marker.create(this.lexer);
    expr   = this.parsePrimaryExpression(node);

    blocklist = false;

    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      lookahead = this.lookahead;
      if ((prev === "{" && (stamp === "(" || stamp === "[")) ||
          (prev === "(" && stamp === "(")) {
        this.throwUnexpected(lookahead);
      }
      switch (stamp) {
      case "(":
        expr = this.parseLeftHandSideParenthesis(expr);
        break;
      case "#":
        expr = this.parseLeftHandSideClosedBrace(expr);
        break;
      case "{":
        expr = this.parseLeftHandSideBrace(expr);
        break;
      case "[":
        expr = this.parseLeftHandSideBracket(expr);
        break;
      case ".":
        expr = this.parseLeftHandSideDot(expr);
        break;
      }
      marker.update().apply(expr, true);

      prev = stamp;
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideParenthesis = function(expr) {
    if (isClassName(expr)) {
      return this.parseLeftHandSideClassNew(expr);
    }

    return this.parseLeftHandSideMethodCall(expr);
  };

  SCParser.prototype.parseLeftHandSideClassNew = function(expr) {
    var method, args;

    method = Node.createIdentifier("new");
    method = Marker.create(this.lexer).apply(method);

    args   = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, "(");
  };

  SCParser.prototype.parseLeftHandSideMethodCall = function(expr) {
    var method, args, lookahead;

    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    lookahead = this.lookahead;
    args      = this.parseCallArgument();

    method = expr;
    expr   = args.list.shift();

    if (!expr) {
      if (args.expand) {
        expr = args.expand;
        delete args.expand;
      } else {
        this.throwUnexpected(lookahead);
      }
    }

    // max(0, 1) -> 0.max(1)
    return Node.createCallExpression(expr, method, args, "(");
  };

  SCParser.prototype.parseLeftHandSideClosedBrace = function(expr) {
    this.lex();
    if (!this.match("{")) {
      this.throwUnexpected(this.lookahead);
    }

    this.state.closedFunction = true;
    expr = this.parseLeftHandSideBrace(expr);
    this.state.closedFunction = false;

    return expr;
  };

  SCParser.prototype.parseLeftHandSideBrace = function(expr) {
    var method, lookahead, disallowGenerator, node;

    if (expr.type === Syntax.CallExpression && expr.stamp && expr.stamp !== "(") {
      this.throwUnexpected(this.lookahead);
    }
    if (expr.type === Syntax.Identifier) {
      if (isClassName(expr)) {
        method = Node.createIdentifier("new");
        method = Marker.create(this.lexer).apply(method);
        expr   = Node.createCallExpression(expr, method, { list: [] }, "{");
      } else {
        expr = Node.createCallExpression(null, expr, { list: [] });
      }
    }
    lookahead = this.lookahead;
    disallowGenerator = this.state.disallowGenerator;
    this.state.disallowGenerator = true;
    node = this.parseBraces(true);
    this.state.disallowGenerator = disallowGenerator;

    // TODO: refactoring
    if (expr.callee === null) {
      expr.callee = node;
      node = expr;
    } else {
      expr.args.list.push(node);
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideBracket = function(expr) {
    if (expr.type === Syntax.CallExpression && expr.stamp === "(") {
      this.throwUnexpected(this.lookahead);
    }

    if (isClassName(expr)) {
      expr = this.parseLeftHandSideNewFrom(expr);
    } else {
      expr = this.parseLeftHandSideListAt(expr);
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideNewFrom = function(expr) {
    var node, method;
    var marker;

    method = Node.createIdentifier("[]");
    method = Marker.create(this.lexer).apply(method);

    marker = Marker.create(this.lexer);
    node = this.parseListInitialiser();
    node = marker.update().apply(node);

    return Node.createCallExpression(expr, method, { list: [ node ] }, "[");
  };

  SCParser.prototype.parseLeftHandSideListAt = function(expr) {
    var indexes, method;

    method = Node.createIdentifier("[]");
    method = Marker.create(this.lexer).apply(method);

    indexes = this.parseListIndexer();
    if (indexes) {
      if (indexes.length === 3) {
        method.name = "[..]";
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createCallExpression(expr, method, { list: indexes }, "[");
  };

  SCParser.prototype.parseLeftHandSideDot = function(expr) {
    var method, args;

    this.lex();

    if (this.match("(")) {
      // expr.()
      return this.parseLeftHandSideDotValue(expr);
    } else if (this.match("[")) {
      // expr.[0]
      return this.parseLeftHandSideDotBracket(expr);
    }

    method = this.parseProperty();
    if (this.match("(")) {
      // expr.method(args)
      args = this.parseCallArgument();
      return Node.createCallExpression(expr, method, args);
    }

    // expr.method
    return Node.createCallExpression(expr, method, { list: [] });
  };

  SCParser.prototype.parseLeftHandSideDotValue = function(expr) {
    var method, args;

    method = Node.createIdentifier("value");
    method = Marker.create(this.lexer).apply(method);

    args   = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, ".");
  };

  SCParser.prototype.parseLeftHandSideDotBracket = function(expr) {
    var method, marker;

    marker = Marker.create(this.lexer, expr);

    method = Node.createIdentifier("value");
    method = Marker.create(this.lexer).apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, ".");
    expr = marker.update().apply(expr);

    return this.parseLeftHandSideListAt(expr);
  };

  SCParser.prototype.parseCallArgument = function() {
    var args, node, hasKeyword, lookahead;

    args = { list: [] };
    hasKeyword = false;

    this.expect("(");

    while (this.lookahead.type !== Token.EOF && !this.match(")")) {
      lookahead = this.lookahead;
      if (!hasKeyword) {
        if (this.match("*")) {
          this.lex();
          args.expand = this.parseExpressions();
          hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          this.parseCallArgumentKeyword(args);
          hasKeyword = true;
        } else {
          node = this.parseExpressions();
          args.list.push(node);
        }
      } else {
        if (lookahead.type !== Token.Label) {
          this.throwUnexpected(lookahead);
        }
        this.parseCallArgumentKeyword(args);
      }
      if (this.match(")")) {
        break;
      }
      this.expect(",");
    }

    this.expect(")");

    return args;
  };

  SCParser.prototype.parseCallArgumentKeyword = function(args) {
    var key, value;

    key = this.lex().value;
    value = this.parseExpressions();
    if (!args.keywords) {
      args.keywords = {};
    }
    args.keywords[key] = value;
  };

  SCParser.prototype.parseListIndexer = function() {
    var node = null;

    this.expect("[");

    if (!this.match("]")) {
      if (this.match("..")) {
        // [..last] / [..]
        node = this.parseListIndexerWithoutFirst();
      } else {
        // [first] / [first..last] / [first, second..last]
        node = this.parseListIndexerWithFirst();
      }
    }

    this.expect("]");

    if (node === null) {
      this.throwUnexpected({ value: "]" });
    }

    return node;
  };

  SCParser.prototype.parseListIndexerWithoutFirst = function() {
    var last;

    this.lex();

    if (!this.match("]")) {
      last = this.parseExpressions();

      // [..last]
      return [ null, null, last ];
    }

    // [..]
    return [ null, null, null ];
  };

  SCParser.prototype.parseListIndexerWithFirst = function() {
    var first = null;

    if (!this.match(",")) {
      first = this.parseExpressions();
    } else {
      this.throwUnexpected(this.lookahead);
    }

    if (this.match("..")) {
      return this.parseListIndexerWithoutSecond(first);
    } else if (this.match(",")) {
      return this.parseListIndexerWithSecond(first);
    }

    // [first]
    return [ first ];
  };

  SCParser.prototype.parseListIndexerWithoutSecond = function(first) {
    var last = null;

    this.lex();

    if (!this.match("]")) {
      last = this.parseExpressions();
    }

    // [first..last]
    return [ first, null, last ];
  };

  SCParser.prototype.parseListIndexerWithSecond = function(first) {
    var second, last = null;

    this.lex();

    second = this.parseExpressions();
    if (this.match("..")) {
      this.lex();
      if (!this.match("]")) {
        last = this.parseExpressions();
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    // [first, second..last]
    return [ first, second, last ];
  };

  SCParser.prototype.parseProperty = function() {
    var token, id;
    var marker;

    marker = Marker.create(this.lexer);
    token = this.lex();

    if (token.type !== Token.Identifier || isClassName(token)) {
      this.throwUnexpected(token);
    }

    id = Node.createIdentifier(token.value);

    return marker.update().apply(id);
  };

  // 4.8 Primary Expressions
  SCParser.prototype.parseArgumentableValue = function() {
    var expr, stamp;
    var marker;

    marker = Marker.create(this.lexer);

    stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;

    switch (stamp) {
    case "#":
      expr = this.parsePrimaryHashedExpression();
      break;
    case Token.CharLiteral:
    case Token.FloatLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.NilLiteral:
    case Token.SymbolLiteral:
    case Token.TrueLiteral:
      expr = Node.createLiteral(this.lex());
      break;
    }

    if (!expr) {
      expr = {};
      this.throwUnexpected(this.lex());
    }

    return marker.update().apply(expr);
  };

  SCParser.prototype.parsePrimaryExpression = function(node) {
    var expr, stamp;
    var marker;

    if (node) {
      return node;
    }

    marker = Marker.create(this.lexer);

    if (this.match("~")) {
      this.lex();
      expr = this.parseIdentifier();
      if (isClassName(expr)) {
        this.throwUnexpected({ type: Token.Identifier, value: expr.id });
      }
      expr = Node.createEnvironmentExpresion(expr);
    } else {
      stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;
      switch (stamp) {
      case "(":
        expr = this.parseParentheses();
        break;
      case "{":
        expr = this.parseBraces();
        break;
      case "[":
        expr = this.parseListInitialiser();
        break;
      case Token.Keyword:
        expr = this.parsePrimaryKeywordExpression();
        break;
      case Token.Identifier:
        expr = this.parsePrimaryIdentifier();
        break;
      case Token.StringLiteral:
        expr = this.parsePrimaryStringExpression();
        break;
      default:
        expr = this.parseArgumentableValue(stamp);
        break;
      }
    }

    return marker.update().apply(expr);
  };

  SCParser.prototype.parsePrimaryHashedExpression = function() {
    var expr, lookahead;

    lookahead = this.lookahead;

    this.lex();

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      expr = this.parsePrimaryImmutableListExpression(lookahead);
      break;
    case "{":
      expr = this.parsePrimaryClosedFunctionExpression();
      break;
    default:
      expr = {};
      this.throwUnexpected(this.lookahead);
      break;
    }

    return expr;
  };

  SCParser.prototype.parsePrimaryImmutableListExpression = function(lookahead) {
    var expr;

    if (this.state.immutableList) {
      this.throwUnexpected(lookahead);
    }

    this.state.immutableList = true;
    expr = this.parseListInitialiser();
    this.state.immutableList = false;

    return expr;
  };

  SCParser.prototype.parsePrimaryClosedFunctionExpression = function() {
    var expr, disallowGenerator, closedFunction;

    disallowGenerator = this.state.disallowGenerator;
    closedFunction    = this.state.closedFunction;

    this.state.disallowGenerator = true;
    this.state.closedFunction    = true;
    expr = this.parseBraces();
    this.state.closedFunction    = closedFunction;
    this.state.disallowGenerator = disallowGenerator;

    return expr;
  };

  SCParser.prototype.parsePrimaryKeywordExpression = function() {
    if (Keywords[this.lookahead.value] === "keyword") {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createThisExpression(this.lex().value);
  };

  SCParser.prototype.parsePrimaryIdentifier = function() {
    var expr, lookahead;

    lookahead = this.lookahead;

    expr = this.parseIdentifier();

    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }

    return expr;
  };

  SCParser.prototype.isInterpolatedString = function(value) {
    var re = /(^|[^\x5c])#\{/;
    return re.test(value);
  };

  SCParser.prototype.parsePrimaryStringExpression = function() {
    var token;

    token = this.lex();

    if (this.isInterpolatedString(token.value)) {
      return this.parseInterpolatedString(token.value);
    }

    return Node.createLiteral(token);
  };

  SCParser.prototype.parseInterpolatedString = function(value) {
    var len, items;
    var index1, index2, code, parser;

    len = value.length;
    items = [];

    index1 = 0;

    do {
      index2 = findString$InterpolatedString(value, index1);
      if (index2 >= len) {
        break;
      }
      code = value.substr(index1, index2 - index1);
      if (code) {
        items.push('"' + code + '"');
      }

      index1 = index2 + 2;
      index2 = findExpression$InterpolatedString(value, index1, items);

      code = value.substr(index1, index2 - index1);
      if (code) {
        items.push("(" + code + ").asString");
      }

      index1 = index2 + 1;
    } while (index1 < len);

    if (index1 < len) {
      items.push('"' + value.substr(index1) + '"');
    }

    code = items.join("++");
    parser = new SCParser(code, {});

    return parser.parseExpression();
  };

  // ( ... )
  SCParser.prototype.parseParentheses = function() {
    var marker, expr, generator;

    marker = Marker.create(this.lexer);

    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    if (this.lookahead.type === Token.Label) {
      expr = this.parseObjectInitialiser();
    } else if (this.match("var")) {
      expr = this.withScope(function() {
        var body;
        body = this.parseFunctionBody(")");
        return Node.createBlockExpression(body);
      });
    } else if (this.match("..")) {
      expr = this.parseSeriesInitialiser(null, generator);
    } else if (this.match(")")) {
      expr = Node.createEventExpression([]);
    } else {
      expr = this.parseParenthesesGuess(generator, marker);
    }

    this.expect(")");

    marker.update().apply(expr);

    return expr;
  };

  SCParser.prototype.parseParenthesesGuess = function(generator) {
    var node, expr;

    node = this.parseExpression();
    if (this.matchAny([ ",", ".." ])) {
      expr = this.parseSeriesInitialiser(node, generator);
    } else if (this.match(":")) {
      expr = this.parseObjectInitialiser(node);
    } else if (this.match(";")) {
      expr = this.parseExpressions(node);
      if (this.matchAny([ ",", ".." ])) {
        expr = this.parseSeriesInitialiser(expr, generator);
      }
    } else {
      expr = this.parseExpression(node);
    }

    return expr;
  };

  SCParser.prototype.parseObjectInitialiser = function(node) {
    var elements = [], innerElements;

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    if (node) {
      this.expect(":");
    } else {
      node = this.parseLabelAsSymbol();
    }
    elements.push(node, this.parseExpression());

    if (this.match(",")) {
      this.lex();
    }

    while (this.lookahead.type !== Token.EOF && !this.match(")")) {
      if (this.lookahead.type === Token.Label) {
        node = this.parseLabelAsSymbol();
      } else {
        node = this.parseExpression();
        this.expect(":");
      }
      elements.push(node, this.parseExpression());
      if (!this.match(")")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return Node.createEventExpression(elements);
  };

  SCParser.prototype.parseSeriesInitialiser = function(node, generator) {
    var method, innerElements;
    var items = [];

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    method = Node.createIdentifier(generator ? "seriesIter" : "series");
    method = Marker.create(this.lexer).apply(method);

    if (node === null) {
      // (..), (..last)
      items = this.parseSeriesInitialiserWithoutFirst(generator);
    } else {
      items = this.parseSeriesInitialiserWithFirst(node, generator);
    }

    this.state.innerElements = innerElements;

    return Node.createCallExpression(items.shift(), method, { list: items });
  };

  SCParser.prototype.parseSeriesInitialiserWithoutFirst = function(generator) {
    var first, last = null;

    // (..last)
    first = {
      type: Syntax.Literal,
      value: "0",
      valueType: Token.IntegerLiteral
    };
    first = Marker.create(this.lexer).apply(first);

    this.expect("..");
    if (this.match(")")) {
      if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    } else {
      last = this.parseExpressions();
    }

    return [ first, null, last ];
  };

  SCParser.prototype.parseSeriesInitialiserWithFirst = function(node, generator) {
    var first, second = null, last = null;

    first = node;
    if (this.match(",")) {
      // (first, second .. last)
      this.lex();
      second = this.parseExpressions();
      if (Array.isArray(second) && second.length === 0) {
        this.throwUnexpected(this.lookahead);
      }
      this.expect("..");
      if (!this.match(")")) {
        last = this.parseExpressions();
      } else if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    } else {
      // (first..last)
      this.lex();
      if (!this.match(")")) {
        last = this.parseExpressions();
      } else if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    }

    return [ first, second, last ];
  };

  SCParser.prototype.parseListInitialiser = function() {
    var elements, innerElements;

    elements = [];

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    this.expect("[");

    while (this.lookahead.type !== Token.EOF && !this.match("]")) {
      if (this.lookahead.type === Token.Label) {
        elements.push(this.parseLabelAsSymbol(), this.parseExpression());
      } else {
        elements.push(this.parseExpression());
        if (this.match(":")) {
          this.lex();
          elements.push(this.parseExpression());
        }
      }
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.expect("]");

    this.state.innerElements = innerElements;

    return Node.createListExpression(elements, this.state.immutableList);
  };

  // { ... }
  SCParser.prototype.parseBraces = function(blocklist) {
    var expr;
    var marker;

    marker = Marker.create(this.lexer);

    this.expect("{");

    if (this.match(":")) {
      if (!this.state.disallowGenerator) {
        this.lex();
        expr = this.parseGeneratorInitialiser();
      } else {
        expr = {};
        this.throwUnexpected(this.lookahead);
      }
    } else {
      expr = this.parseFunctionExpression(this.state.closedFunction, blocklist);
    }

    this.expect("}");

    return marker.update().apply(expr);
  };

  SCParser.prototype.parseGeneratorInitialiser = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");

    this.parseExpression();
    this.expect(",");

    while (this.lookahead.type !== Token.EOF && !this.match("}")) {
      this.parseExpression();
      if (!this.match("}")) {
        this.expect(",");
      }
    }

    return Node.createLiteral({ value: "nil", valueType: Token.NilLiteral });
  };

  SCParser.prototype.parseLabel = function() {
    var label, marker;

    marker = Marker.create(this.lexer);

    label = Node.createLabel(this.lex().value);

    return marker.update().apply(label);
  };

  SCParser.prototype.parseLabelAsSymbol = function() {
    var marker, label, node;

    marker = Marker.create(this.lexer);

    label = this.parseLabel();
    node  = {
      type: Syntax.Literal,
      value: label.name,
      valueType: Token.SymbolLiteral
    };

    node = marker.update().apply(node);

    return node;
  };

  SCParser.prototype.parseIdentifier = function() {
    var expr;
    var marker;

    marker = Marker.create(this.lexer);

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    expr = this.lex();
    expr = Node.createIdentifier(expr.value);

    return marker.update().apply(expr);
  };

  SCParser.prototype.parseVariableIdentifier = function() {
    var token, value, ch;
    var id, marker;

    marker = Marker.create(this.lexer);

    token = this.lex();
    value = token.value;

    if (token.type !== Token.Identifier) {
      this.throwUnexpected(token);
    } else {
      ch = value.charAt(0);
      if (("A" <= ch && ch <= "Z") || ch === "_") {
        this.throwUnexpected(token);
      }
    }

    id = Node.createIdentifier(value);

    return marker.update().apply(id);
  };

  var calcBinaryPrecedence = function(token, binaryPrecedence) {
    var prec = 0;

    switch (token.type) {
    case Token.Punctuator:
      if (token.value !== "=") {
        if (binaryPrecedence.hasOwnProperty(token.value)) {
          prec = binaryPrecedence[token.value];
        } else if (/^[-+*\/%<=>!?&|@]+$/.test(token.value)) {
          prec = 255;
        }
      }
      break;
    case Token.Label:
      prec = 255;
      break;
    }

    return prec;
  };

  var isClassName = function(node) {
    var name, ch;

    if (node.type === Syntax.Identifier) {
      name = node.value || node.name;
      ch = name.charAt(0);
      return "A" <= ch && ch <= "Z";
    }

    return false;
  };

  var isLeftHandSide = function(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.EnvironmentExpresion:
      return true;
    }
    return false;
  };

  var isValidArgumentValue = function(node) {
    if (node.type === Syntax.Literal) {
      return true;
    }
    if (node.type === Syntax.ListExpression) {
      return node.elements.every(function(node) {
        return node.type === Syntax.Literal;
      });
    }

    return false;
  };

  var findString$InterpolatedString = function(value, index) {
    var len, ch;

    len = value.length;

    while (index < len) {
      ch = value.charAt(index);
      if (ch === "#") {
        if (value.charAt(index + 1) === "{") {
          break;
        }
      } else if (ch === "\\") {
        index += 1;
      }
      index += 1;
    }

    return index;
  };

  var findExpression$InterpolatedString = function(value, index) {
    var len, depth, ch;

    len = value.length;

    depth = 0;
    while (index < len) {
      ch = value.charAt(index);
      if (ch === "}") {
        if (depth === 0) {
          break;
        }
        depth -= 1;
      } else if (ch === "{") {
        depth += 1;
      }
      index += 1;
    }

    return index;
  };

  parser.parse = function(source, opts) {
    var instance, ast;

    opts = opts || /* istanbul ignore next */ {};

    instance = new SCParser(source, opts);
    ast = instance.parse();

    if (!!opts.tolerant && typeof instance.lexer.errors !== "undefined") {
      ast.errors = instance.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = parser;

})(sc);

})(this.self||global);
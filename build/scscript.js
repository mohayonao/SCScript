(function(global) {
"use strict";
var sc = { VERSION: "0.0.66" };

// src/sc/sc.js
(function(sc) {
  sc.lang = {};
  sc.libs = {};
  sc.config = {};

  function SCScript(fn) {
    return sc.lang.main.run(fn);
  }

  SCScript.VERSION = sc.VERSION;

  SCScript.install = function(installer) {
    installer(sc);
    return SCScript;
  };

  SCScript.stdout = function(msg) {
    console.log(msg);
    return SCScript;
  };

  SCScript.stderr = function(msg) {
    console.error(msg);
    return SCScript;
  };

  SCScript.tokenize = function(source, opts) {
    return sc.lang.compiler.tokenize(source, opts);
  };

  SCScript.parse = function(source, opts) {
    return sc.lang.compiler.parse(source, opts);
  };

  SCScript.compile = function(source, opts) {
    return sc.lang.compiler.compile(source, opts);
  };

  global.SCScript = sc.SCScript = SCScript;
})(sc);

// src/sc/libs/strlib.js
(function(sc) {

  var slice = [].slice;
  var strlib = {};

  strlib.article = function(name) {
    if (/^[AEIOU]/i.test(name)) {
      return "an";
    }
    return "a";
  };

  strlib.isAlpha = function(ch) {
    return ("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z");
  };

  strlib.isNumber = function(ch) {
    return "0" <= ch && ch <= "9";
  };

  strlib.isClassName = function(name) {
    var ch = name.charCodeAt(0);
    return 0x41 <= ch && ch <= 0x5a;
  };

  strlib.char2num = function(ch) {
    var n = ch.charCodeAt(0);

    if (48 <= n && n <= 57) {
      return n - 48;
    }
    if (65 <= n && n <= 90) {
      return n - 55;
    }
    return n - 87; // if (97 <= n && n <= 122)
  };

  function formatWithList(fmt, list) {
    var msg = fmt;
    list.forEach(function(value, index) {
      msg = msg.replace(
        new RegExp("#\\{" + index + "\\}", "g"), String(value)
      );
    });
    return msg;
  }

  function formatWithDict(fmt, dict) {
    var msg = fmt;
    Object.keys(dict).forEach(function(key) {
      if (/^\w+$/.test(key)) {
        msg = msg.replace(
          new RegExp("#\\{" + key + "\\}", "g"), String(dict[key])
        );
      }
    });
    return msg;
  }

  strlib.format = function(fmt, arg) {
    if (Array.isArray(arg)) {
      return formatWithList(fmt, arg);
    }
    if (arg && arg.constructor === Object) {
      return formatWithDict(fmt, arg);
    }
    return formatWithList(fmt, slice.call(arguments, 1));
  };

  sc.libs.strlib = strlib;
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

  mathlib.clipIndex = function(index, len) {
    return Math.max(0, Math.min(index, len - 1));
  };

  mathlib.wrapIndex = function(index, len) {
    index = index % len;
    if (index < 0) {
      index += len;
    }
    return index;
  };

  mathlib.foldIndex = function(index, len) {
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

// src/sc/libs/extend.js
(function(sc) {

  function extend(child, parent) {
    var ctor = function() {
      this.constructor = child;
    };
    ctor.prototype = parent.prototype;
    /* jshint newcap: false */
    child.prototype = new ctor();
    /* jshint newcap: true */
    return child;
  }

  sc.libs.extend = extend;
})(sc);

// src/sc/lang/dollar.js
(function(sc) {

  var $ = function(name) {
    return sc.lang.klass.get(name);
  };

  $.addProperty = function(name, payload) {
    $[name] = payload;
  };

  $.addProperty("NOP", null);
  $.addProperty("DoNothing", function() {
    return this;
  });

  sc.lang.$ = $;
})(sc);

// src/sc/lang/main.js
(function(sc) {

  var main = {};

  var $ = sc.lang.$;
  var random = sc.libs.random;

  var $process = null;
  var $currentEnvir = null;
  var $currentThread = {};

  main.run = function(func) {
    if (!$process) {
      initialize();
    }
    return func($);
  };

  main.setCurrentEnvir = function($envir) {
    $currentEnvir = $envir;
  };

  main.getCurrentEnvir = function() {
    return $currentEnvir;
  };

  main.setCurrentThread = function($thread) {
    $currentThread = $thread;
  };

  main.getCurrentThread = function() {
    return $currentThread;
  };

  function initialize() {
    $process = $("Main").new();
    $process._$interpreter = $("Interpreter").new();
    $process._$mainThread  = $("Thread").new($.Func());

    $currentEnvir = $("Environment").new();
    $currentThread = $process._$mainThread;

    // $interpreter._$s = SCServer.default();

    random.current = $process._$mainThread._randgen;
    // TODO:
    // SoundSystem.addProcess($process);
    // SoundSystem.start();
  }

  $.addProperty("Environment", function(key, $value) {
    if ($value) {
      $currentEnvir.put($.Symbol(key), $value);
      return $value;
    }
    return $currentEnvir.at($.Symbol(key));
  });

  $.addProperty("This", function() {
    return $process.interpreter();
  });

  $.addProperty("ThisProcess", function() {
    return $process;
  });

  $.addProperty("ThisThread", function() {
    return $currentThread;
  });

  sc.lang.main = main;
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

    if (!def) {
      return func;
    }

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
  var current = null;

  function insideOfARoutine() {
    return sc.lang.main.getCurrentThread().__tag === 9;
  }

  function Bytecode(initializer, def) {
    this._initializer = initializer;
    this._def  = def;
    this._code = [];
    this._vals = [];
    this._$owner = null;
    this._init(initializer);
  }

  Bytecode.prototype._init = function() {
    var code = this._initializer();
    if (this._def && code[0]) {
      code[0] = fn(code[0], this._def);
      this._argNames = code[0]._argNames;
      this._argVals  = code[0]._argVals;
    } else {
      this._argNames = [];
      this._argVals  = [];
    }
    if (code.length > 1) {
      this._freeFunc = code.pop();
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

  Bytecode.prototype.free = function() {
    if (this._freeFunc) {
      this._freeFunc();
    }
    return this;
  };

  Bytecode.prototype.setOwner = function($owner) {
    this._$owner = $owner;
    return this;
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

    this._parent = current;

    current = this;
    this.state = 3;

    for (i = 0; i < length; ++i) {
      result = this.update(code[i].apply(this, args));
      if (this.state === -1) {
        this._iter = null;
        break;
      }
    }
    if (this._freeFunc) {
      this._freeFunc();
    }

    current = this._parent;
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

    this.setParent(current);

    current = this;

    if (this._child) {
      result = this._child.runAsRoutine(args);
      if (this.state === 3) {
        result = null;
      }
    }

    if (!result) {
      result = this._runAsRoutine(args);
    }

    current = this._parent;

    this.advance();

    return this.result ? $.Nil() : result;
  };

  Bytecode.prototype._runAsRoutine = function(args) {
    var result;
    var code, length, iter;

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

      result = this.update(code[this._index].apply(this, args));

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

    return result;
  };

  Bytecode.prototype.advance = function() {
    if (this.state === 0) {
      this.free();
      return;
    }
    if (this._child || this._index < this._length) {
      this.state = 5;
      return;
    }
    if (!this.result) {
      this.state = 6;
      this.free();
    }
    if (this._parent) {
      if (this.state === 6) {
        this._parent.state = 3;
      } else {
        this._parent.state = 5;
        this.free();
      }
      this._parent.purge();
    }
  };

  Bytecode.prototype.purge = function() {
    if (this._child) {
      this._child._parent = null;
      this._child = null;
    }
    return this;
  };

  Bytecode.prototype.push = function() {
    this._vals.push(null);
  };

  Bytecode.prototype.shift = function() {
    if (this._vals.length) {
      return this._vals.shift();
    }
    return this._parent.shift();
  };

  Bytecode.prototype.update = function($value) {
    if (this._vals.length) {
      this._vals[this._vals.length - 1] = $value;
    } else if (this._parent) {
      this._parent.update($value);
    }
    return $value;
  };

  Bytecode.prototype.break = function() {
    this.state  = -1;
    this._index = this._length;
    return this;
  };

  Bytecode.prototype.yield = function($value) {
    this.state  = 5;
    this.result = $value;
    if (this._parent && this._$owner.__tag === 8) {
      this._parent.yield($value);
    }
    return this;
  };

  Bytecode.prototype.yieldAndReset = function($value) {
    this.state   = 0;
    this.result  = $value;
    if (this._parent && this._$owner.__tag === 8) {
      this._parent.yieldAndReset($value);
    }
    this._index  = 0;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this;
  };

  Bytecode.prototype.alwaysYield = function($value) {
    this.state   = 6;
    this.result  = $value;
    if (this._parent && this._$owner.__tag === 8) {
      this._parent.alwaysYield($value);
    }
    this._index  = this._length;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this.free();
  };

  var throwIfOutsideOfRoutine = function() {
    if (!insideOfARoutine()) {
      current = null;
      throw new Error("yield was called outside of a Routine.");
    }
  };

  var bytecode = {};

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  bytecode.yield = function($value) {
    throwIfOutsideOfRoutine();
    return current.yield($value).purge();
  };

  bytecode.alwaysYield = function($value) {
    throwIfOutsideOfRoutine();
    return current.alwaysYield($value);
  };

  bytecode.yieldAndReset = function($value) {
    throwIfOutsideOfRoutine();
    return current.yieldAndReset($value);
  };

  bytecode.setCurrent = function(bytecode) {
    current = bytecode;
  };

  bytecode.getCurrent = function() {
    return current;
  };

  sc.lang.bytecode = bytecode;
})(sc);

// src/sc/lang/klass/klass.js
(function(sc) {

  var klass = {
    classes: {}
  };

  klass.get = function(name) {
    if (!klass.classes[name]) {
      throw new Error("Class not defined: " + name);
    }
    return klass.classes[name];
  };

  klass.exists = function(name) {
    return !!klass.classes[name];
  };

  sc.lang.klass = klass;
})(sc);

// src/sc/lang/klass/builder.js
(function(sc) {

  var $ = sc.lang.$;
  var fn = sc.lang.fn;
  var strlib = sc.libs.strlib;

  function Builder(constructor) {
    this._className = constructor.prototype.__className;
    this._constructor = constructor;
    this._classMethods    = constructor.metaClass.__MetaSpec.prototype;
    this._instanceMethods = constructor.prototype;
  }

  Builder.prototype.init = function(defaults) {
    if (defaults) {
      Object.keys(defaults).forEach(function(name) {
        if (name !== "constructor") {
          this._instanceMethods[name] = defaults[name];
        }
      }, this);
    }
    return this;
  };

  Builder.prototype.addClassMethod = function(name, opts, func) {
    return addMethod(this, this._classMethods, name, opts, func);
  };

  Builder.prototype.addMethod = function(name, opts, func) {
    return addMethod(this, this._instanceMethods, name, opts, func);
  };

  Builder.prototype.addProperty = function(type, name) {
    var attrName = "_$" + name;

    if (type.indexOf("<") === 0) {
      this.addMethod(name, {}, function() {
        return this[attrName] || $.nil;
      });
    }
    if (type.indexOf(">") === type.length - 1) {
      this.addMethod(name + "_", {}, function($_) {
        this[attrName] = $_ || $.nil;
        return this;
      });
    }

    return this;
  };

  function createErrorFunc(errorType, message) {
    var func = function() {
      var errMsg = strlib.format("RECEIVER #{0}: #{1}", this.__className, message);
      throw new Error(errMsg);
    };
    func.__errorType = errorType;
    return func;
  }

  Builder.prototype.subclassResponsibility = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      "subclassResponsibility",
      strlib.format("'#{0}' should have been implemented by this subclass", methodName)
    ));
  };

  Builder.prototype.doesNotUnderstand = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      "doesNotUnderstand",
      strlib.format("'#{0}' not understood", methodName)
    ));
  };

  Builder.prototype.shouldNotImplement = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      "shouldNotImplement",
      strlib.format("'#{0}' not valid for this subclass", methodName)
    ));
  };

  Builder.prototype.notYetImplemented = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      "notYetImplemented",
      strlib.format("'#{0}' is not yet implemented", methodName)
    ));
  };

  Builder.prototype.notSupported = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      "notSupported",
      strlib.format("'#{0}' is not supported", methodName)
    ));
  };

  function bond(that, methods) {
    return methods === that._classMethods ? "." : "#";
  }

  function throwErrorIfAlreadyExists(that, methods, methodName) {
    if (methods.hasOwnProperty(methodName)) {
      throw new Error(strlib.format(
        "#{0} is already defined", (that._className + bond(that, methods) + methodName)
      ));
    }
  }

  function choose(type) {
    switch (type) {
    case 3 : return $.True;
    case 4: return $.False;
    }
    return $.DoNothing;
  }

  function addMethod(that, methods, name, opts, func) {
    throwErrorIfAlreadyExists(that, methods, name);
    if (typeof opts === "function") {
      func = opts;
      opts = {};
    } else if (typeof func !== "function") {
      func = choose(opts);
      opts = {};
    }
    methods[name] = fn(func, opts.args);
    return that;
  }

  sc.lang.klass.Builder = Builder;
})(sc);

// src/sc/lang/klass/define.js
(function(sc) {

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
    __tag: 0,
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
        "RECEIVER #{0}: Message '#{1}' not understood.", this.__str__(), methodName
      ));
    });
  });
})(sc);

// src/sc/lang/klass/constructors.js
(function(sc) {

  var $ = sc.lang.$;
  var define = sc.lang.klass.define;

  var SCNil = define("Nil", {
    __tag: 5
  });

  var SCSymbol = define("Symbol", {
    __tag: 3
  });

  define("Boolean", {
    __tag: 6
  });

  var SCTrue  = define("True  : Boolean");
  var SCFalse = define("False : Boolean");

  define("Magnitude");

  var SCChar = define("Char : Magnitude", {
    __tag: 4
  });

  define("Number : Magnitude");
  define("SimpleNumber : Number");

  var SCInteger = define("Integer : SimpleNumber", {
    __tag: 1
  });

  var SCFloat = define("Float : SimpleNumber", {
    __tag: 2
  });

  define("Association : Magnitude");
  define("Collection");
  define("SequenceableCollection : Collection");

  define("ArrayedCollection : SequenceableCollection", {
    constructor: function SCArrayedCollection() {
      this.__super__("SequenceableCollection");
      this._ = [];
    }
  });

  define("RawArray : ArrayedCollection");

  var SCArray = define("Array : ArrayedCollection");

  var SCString = define("String : RawArray", {
    __tag: 7
  });

  define("Set : Collection");
  define("Dictionary : Set");
  define("IdentityDictionary : Dictionary");
  define("Environment : IdentityDictionary");

  define("Event : Environment", {
    constructor: function SCEvent() {
      this.__super__("Environment");
    }
  });

  define("AbstractFunction");

  var SCFunction = define("Function : AbstractFunction", {
    __tag: 8
  });

  define("Stream : AbstractFunction");
  define("Thread : Stream");
  define("Routine : Thread", {
    __tag: 9
  });

  var SCRef = define("Ref : AbstractFunction");

  // $
  var $nil = (function() {
    var instance = new SCNil();
    instance._ = null;
    return instance;
  })();
  var $true = (function() {
    var instance = new SCTrue();
    instance._ = true;
    return instance;
  })();
  var $false = (function() {
    var instance = new SCFalse();
    instance._ = false;
    return instance;
  })();
  var $integers = {};
  var $floats   = {};
  var $symbols  = {};
  var $chars    = {};

  $.addProperty("Nil", function() {
    return $nil;
  });

  $.addProperty("Boolean", function(value) {
    return value ? $true : $false;
  });

  $.addProperty("True", function() {
    return $true;
  });

  $.addProperty("False", function() {
    return $false;
  });

  $.addProperty("Integer", function(value) {
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
  });

  $.addProperty("Float", function(value) {
    var instance;

    value = +value;

    if (!$floats.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._ = value;
      $floats[value] = instance;
    }

    return $floats[value];
  });

  $.addProperty("Symbol", function(value) {
    var instance;
    value = String(value);
    if (!$symbols.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._ = value;
      $symbols[value] = instance;
    }
    return $symbols[value];
  });

  $.addProperty("Char", function(value) {
    var instance;

    value = String(value).charAt(0);

    if (!$chars.hasOwnProperty(value)) {
      instance = new SCChar();
      instance._ = value;
      $chars[value] = instance;
    }

    return $chars[value];
  });

  $.addProperty("Array", function(value, immutable) {
    var instance = new SCArray();
    instance._ = value || [];
    instance.__immutable = !!immutable;
    return instance;
  });

  $.addProperty("String", function(value, mutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($.Char);
    instance.__immutable = !mutable;
    return instance;
  });

  $.addProperty("Event", function(value) {
    var instance, i, imax, j;
    i = imax = j = value;
    instance = $("Event").new();
    for (i = j = 0, imax = value.length >> 1; i < imax; ++i) {
      instance.put(value[j++], value[j++]);
    }
    return instance;
  });

  $.addProperty("Function", function(value, def) {
    var instance = new SCFunction();
    instance._bytecode = sc.lang.bytecode.create(value, def).setOwner(instance);
    return instance;
  });

  $.addProperty("Func", function(func) {
    return $.Function(function() {
      return [ func ];
    });
  });

  $.addProperty("Ref", function(value) {
    var instance = new SCRef();
    instance._$value = value;
    return instance;
  });

  $.addProperty("nil", $nil);
  $.addProperty("true", $true);
  $.addProperty("false", $false);
  $.addProperty("int0", $.Integer(0));
  $.addProperty("int1", $.Integer(1));
})(sc);

// src/sc/lang/klass/utils.js
(function(sc) {

  var slice = Array.prototype.slice;
  var $nil = sc.lang.$.nil;

  sc.lang.klass.utils = {
    toArray: function(args) {
      return slice.call(args);
    },
    newCopyArgs: function(that, dict) {
      var instance = new that.__Spec();
      Object.keys(dict).forEach(function(key) {
        instance["_$" + key] = dict[key] || $nil;
      });
      return instance;
    }
  };
})(sc);

// src/sc/lang/iterator.js
(function(sc) {

  var iterator = {};
  var $     = sc.lang.$;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var $int1 = $.int1;

  var __stop__ = function() {
    return null;
  };

  var nop$iter = function(iter) {
    iter.hasNext = false;
    iter.next    = __stop__;
    return iter;
  };
  nop$iter.clone = function() {
    return nop$iter;
  };
  nop$iter(nop$iter);

  var once$iter = function(value) {
    var iter = {
      hasNext: true,
      next: function() {
        nop$iter(iter);
        return [ value, $int0 ];
      },
      clone: function() {
        return once$iter(value);
      }
    };
    return iter;
  };

  iterator.execute = function(iter, $function) {
    $function._bytecode.setIterator(iter).run();
  };

  iterator.object$do = once$iter;

  iterator.function$while = function($function) {
    var bytecode, iter;

    bytecode = $function._bytecode;

    iter = {
      hasNext: true,
      next: function() {
        if (!bytecode.runAsFunction().__bool__()) {
          nop$iter(iter);
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

  iterator.function$loop = function() {
    var iter = {
      hasNext: true,
      next: function() {
        return [ $nil, $nil ];
      },
      clone: function() {
        return iter;
      }
    };
    return iter;
  };

  var sc$incremental$iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i > $end) {
          nop$iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc$incremental$iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc$decremental$iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i < $end) {
          nop$iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc$decremental$iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc$numeric$iter = function($start, $end, $step) {
    if ($start.valueOf() === $end.valueOf()) {
      return once$iter($start);
    } else if ($start < $end && $step > 0) {
      return sc$incremental$iter($start, $end, $step);
    } else if ($start > $end && $step < 0) {
      return sc$decremental$iter($start, $end, $step);
    }
    return nop$iter;
  };

  iterator.number$do = function($end) {
    var $start, $step;

    $start = $int0;
    $end   = $end.__dec__();
    $step  = $int1;

    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = $int0;
    $step  = $.Integer(-1);

    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;

    $step = ($start <= $end) ? $int1 : $.Integer(-1);

    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $step;

    $step   = $second ["-"] ($start);

    return sc$numeric$iter($start, $last, $step);
  };

  var js$incremental$iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i > end) {
          nop$iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js$incremental$iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js$decremental$iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i < end) {
          nop$iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js$decremental$iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js$numeric$iter = function(start, end, step, type) {
    if (start === end) {
      return once$iter(type(start));
    } else if (start < end && step > 0) {
      return js$incremental$iter(start, end, step, type);
    } else if (start > end && step < 0) {
      return js$decremental$iter(start, end, step, type);
    }
    return nop$iter;
  };

  var js$numeric$iter$do = function($endval, type) {
    var end = type($endval.__num__()).valueOf();
    return js$numeric$iter(0, end - 1, +1, type);
  };

  var js$numeric$iter$reverseDo = function($startval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = (start|0) - start;
    return js$numeric$iter(start - 1, end, -1, type);
  };

  var js$numeric$iter$for = function($startval, $endval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return js$numeric$iter(start, end, step, type);
  };

  var js$numeric$iter$forBy = function($startval, $endval, $stepval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return js$numeric$iter(start, end, step, type);
  };

  var js$numeric$iter$forSeries = function($startval, $second, $last, type) {
    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return js$numeric$iter(start, end, step, type);
  };

  iterator.integer$do = function($endval) {
    return js$numeric$iter$do($endval, $.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return js$numeric$iter$reverseDo($startval, $.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return js$numeric$iter$for($startval, $endval, $.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return js$numeric$iter$forBy($startval, $endval, $stepval, $.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return js$numeric$iter$forSeries($startval, $second, $last, $.Integer);
  };

  iterator.float$do = function($endval) {
    return js$numeric$iter$do($endval, $.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return js$numeric$iter$reverseDo($startval, $.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return js$numeric$iter$for($startval, $endval, $.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return js$numeric$iter$forBy($startval, $endval, $stepval, $.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return js$numeric$iter$forSeries($startval, $second, $last, $.Float);
  };

  var list$iter = function(list) {
    var i = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          nop$iter(iter);
        }
        return [ $ret, $.Integer(i - 1) ];
      },
      clone: function() {
        return list$iter(list);
      }
    };
    return iter;
  };

  var js$array$iter = function(list) {
    if (list.length) {
      return list$iter(list);
    }
    return nop$iter;
  };

  iterator.array$do = function($array) {
    return js$array$iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js$array$iter($array._.slice().reverse());
  };

  iterator.set$do = function($set) {
    return js$array$iter($set._$array._.filter(function($elem) {
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

  sc.lang.compiler = {
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
      TrueLiteral: "True",
      SingleLineComment: "SingleLineComment",
      MultiLineComment: "MultiLineComment"
    },
    Syntax: {
      AssignmentExpression: "AssignmentExpression",
      BinaryExpression: "BinaryExpression",
      CallExpression: "CallExpression",
      FunctionExpression: "FunctionExpression",
      EnvironmentExpression: "EnvironmentExpression",
      Identifier: "Identifier",
      ListExpression: "ListExpression",
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
      ArgumentAlreadyDeclared: "argument '#{0}' already declared",
      InvalidLHSInAssignment: "invalid left-hand side in assignment",
      NotImplemented: "not implemented #{0}",
      UnexpectedEOS: "unexpected end of input",
      UnexpectedIdentifier: "unexpected identifier",
      UnexpectedKeyword: "unexpected keyword",
      UnexpectedNumber: "unexpected number",
      UnexpectedLabel: "unexpected label",
      UnexpectedLiteral: "unexpected #{0}",
      UnexpectedToken: "unexpected token #{0}",
      VariableAlreadyDeclared: "variable '#{0}' already declared",
      VariableNotDefined: "variable '#{0}' not defined"
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
    },
    binaryPrecedenceDefaults: {
      "?": 1,
      "??": 1,
      "!?": 1,
      "->": 2,
      "||": 3,
      "&&": 4,
      "|": 5,
      "&": 6,
      "==": 7,
      "!=": 7,
      "===": 7,
      "!==": 7,
      "<": 8,
      ">": 8,
      "<=": 8,
      ">=": 8,
      "<<": 9,
      ">>": 9,
      "+>>": 9,
      "+": 10,
      "-": 10,
      "*": 11,
      "/": 11,
      "%": 11,
      "!": 12
    },
    tokenize: function(source, opts) {
      return new sc.lang.compiler.Lexer(source, opts).tokenize();
    },
    parse: function(source, opts) {
      var lexer = new sc.lang.compiler.Lexer(source, opts);
      return new sc.lang.compiler.Parser(null, lexer).parse();
    },
    compile: function(source, opts) {
      var ast;

      if (typeof source === "string") {
        ast = sc.lang.compiler.parse(source, opts);
      } else {
        ast = source;
      }

      ast = new sc.lang.compiler.Rewriter().rewrite(ast);

      return new sc.lang.compiler.CodeGen(null, opts).compile(ast);
    }
  };
})(sc);

// src/sc/lang/compiler/codegen/scope.js
(function(sc) {

  function Scope() {
    this.stack = [];
    this.tempVarId = 0;
    this.begin();
  }

  var delegate = {
    var: function addToVariable(scope, name) {
      if (!scope.vars[name]) {
        addVariableToStatement(scope, name);
      }
      scope.vars[name] = true;
    },
    arg: function addToArguments(scope, name) {
      scope.args[name] = true;
    }
  };

  Scope.prototype.add = function(type, name, scope) {
    delegate[type](scope || this.peek(), name);
    return this;
  };

  Scope.prototype.begin = function() {
    this.stack.unshift({
      vars: {},
      args: {},
      stmt: { head: [], vars: [], tail: [] }
    });
    return this;
  };

  Scope.prototype.end = function() {
    this.stack.shift();
    return this;
  };

  Scope.prototype.toVariableStatement = function() {
    var stmt = this.peek().stmt;
    return [ stmt.head, stmt.vars, stmt.tail ];
  };

  Scope.prototype.peek = function() {
    return this.stack[0];
  };

  Scope.prototype.find = function(name) {
    return this.stack.some(function(scope) {
      return scope.vars[name] || scope.args[name];
    });
  };

  function addVariableToStatement(scope, name) {
    var stmt = scope.stmt;
    if (stmt.vars.length) {
      stmt.vars.push(", ");
    } else {
      stmt.head.push("var ");
      stmt.tail.push(";");
    }
    stmt.vars.push(name.replace(/^(?![_$])/, "$"));
  }

  sc.lang.compiler.Scope = Scope;
})(sc);

// src/sc/lang/compiler/codegen/codegen.js
(function(sc) {

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Scope = sc.lang.compiler.Scope;

  function CodeGen(parent, opts) {
    if (!parent) {
      initialize(this, opts);
    } else {
      this.parent = parent;
      this.opts  = parent.opts;
      this.state = parent.state;
      this.scope = parent.scope;
    }
  }

  function initialize(that, opts) {
    that.parent = null;
    that.opts = opts || {};
    that.state = {
      calledSegmentedMethod: false,
      syncBlockScope: null,
      tempVarId: 0
    };
    that.scope = new Scope(that);
  }

  CodeGen.addGenerateMethod = function(name, method) {
    CodeGen.prototype[name] = method;
  };

  CodeGen.prototype.compile = function(ast) {
    return this.generate(ast);
  };

  CodeGen.prototype.generate = function(node, opts) {
    if (Array.isArray(node)) {
      return [
        "(", this.stitchWith(node, ",", function(item) {
          return this.generate(item, opts);
        }), ")"
      ];
    }

    if (node && node.type) {
      return toSourceNodeWhenNeeded(this[node.type](node, opts), node);
    }

    if (typeof node === "string") {
      return node.replace(/^(?![_$])/, "$");
    }

    return "null";
  };

  CodeGen.prototype.withFunction = function(args, func) {
    var argItems = this.stitchWith(args, ",", function(item) {
      return this.generate(item);
    });
    var result = [ "function(", argItems, "){" ];

    this.scope.begin();
    for (var i = 0, imax = args.length; i < imax; ++i) {
      this.scope.add("arg", args[i]);
    }
    result.push(
      this.scope.toVariableStatement(),
      func.call(this)
    );
    this.scope.end();

    result.push("}");

    return result;
  };

  CodeGen.prototype.insertArrayElement = function(elements) {
    var result = [ "[", "]" ];

    if (elements.length) {
      var items = this.stitchWith(elements, ",", function(item) {
        return this.generate(item);
      });
      result.splice(1, 0, items);
    }

    return result;
  };

  CodeGen.prototype.stitchWith = function(elements, bond, func) {
    var result = [];

    for (var i = 0, imax = elements.length; i < imax; ++i) {
      if (i) {
        result.push(bond);
      }
      result.push(func.call(this, elements[i], i));
    }

    return result;
  };

  CodeGen.prototype.useTemporaryVariable = function(func) {
    var result;
    var tempName = "_ref" + this.state.tempVarId;

    this.scope.add("var", tempName);

    this.state.tempVarId += 1;
    result = func.call(this, tempName);
    this.state.tempVarId -= 1;

    return result;
  };

  CodeGen.prototype.throwError = function(obj, messageFormat) {
    var message = strlib.format(messageFormat, slice.call(arguments, 2));
    throw new Error(message);
  };

  function toSourceNodeWhenNeeded(generated) {
    if (Array.isArray(generated)) {
      return flattenToString(generated);
    }
    return generated;
  }

  function flattenToString(list) {
    var result = "";

    for (var i = 0, imax = list.length; i < imax; ++i) {
      var elem = list[i];
      result += Array.isArray(elem) ? flattenToString(elem) : elem;
    }

    return result;
  }

  sc.lang.compiler.CodeGen = CodeGen;
})(sc);

// src/sc/lang/compiler/codegen/var-stmt.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("VariableDeclaration", function(node) {
    var scope = this.state.syncBlockScope;

    return this.stitchWith(node.declarations, ",", function(item) {
      this.scope.add("var", item.id.name, scope);

      var result = [ this.generate(item.id) ];

      if (item.init) {
        result.push("=", this.generate(item.init));
      } else {
        result.push("=$.Nil()");
      }

      return result;
    });
  });
})(sc);

// src/sc/lang/compiler/codegen/value.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("ValueMethodEvaluator", function(node) {
    this.state.calledSegmentedMethod = true;
    return [ "this.push(),", this.generate(node.expr) ];
  });

  CodeGen.addGenerateMethod("ValueMethodResult", function() {
    return "this.shift()";
  });
})(sc);

// src/sc/lang/compiler/codegen/uop-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("UnaryExpression", function(node) {
    if (node.operator === "`") {
      return [ "$.Ref(", this.generate(node.arg), ")" ];
    }
    throw new Error("Unknown UnaryExpression: " + node.operator);
  });
})(sc);

// src/sc/lang/compiler/codegen/this-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("ThisExpression", function(node) {
    var name = node.name;
    name = name.charAt(0).toUpperCase() + name.substr(1);
    return [ "$." + name + "()" ];
  });
})(sc);

// src/sc/lang/compiler/codegen/program.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("Program", function(node) {
    if (!node.body.length) {
      return [];
    }

    var body = this.withFunction([ "" ], function() { // "" compiled as $
      return generateStatements(this, node.body);
    });

    var result = [ "(", body, ")" ];

    if (!this.opts.bare) {
      result = [ "SCScript", result, ";" ];
    }

    return result;
  });

  function generateStatements(that, elements) {
    var lastIndex = elements.length - 1;

    return elements.map(function(item, i) {
      var stmt = that.generate(item);

      if (i === lastIndex) {
        stmt = [ "return ", stmt ];
      }

      return [ stmt, ";" ];
    });
  }
})(sc);

// src/sc/lang/compiler/codegen/literal.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("Literal", function(node) {
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
  });
})(sc);

// src/sc/lang/compiler/codegen/list-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("ListExpression", function(node) {
    var result = [
      "$.Array(",
      this.insertArrayElement(node.elements),
    ];

    if (node.immutable) {
      result.push(",true");
    }

    result.push(")");

    return result;
  });
})(sc);

// src/sc/lang/compiler/codegen/identifier.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  CodeGen.addGenerateMethod("Identifier", function(node, opts) {
    var name = node.name;

    if (strlib.isClassName(name)) {
      return "$('" + name + "')";
    }

    if (this.scope.find(name)) {
      return name.replace(/^(?![_$])/, "$");
    }

    if (name.length === 1) {
      return generateInterpreterVariable(this, node, opts);
    }

    this.throwError(null, Message.VariableNotDefined, name);
  });

  function generateInterpreterVariable(that, node, opts) {
    if (!opts) {
      // getter
      return "$.This().$('" + node.name + "')";
    }

    // setter
    opts.used = true;
    return that.useTemporaryVariable(function(tempVar) {
      return [
        "(" + tempVar + "=", that.generate(opts.right),
        ", $.This().$('" + node.name + "_',[" + tempVar + "]), " + tempVar + ")"
      ];
    });
  }
})(sc);

// src/sc/lang/compiler/codegen/function-expr.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("FunctionExpression", function(node) {
    var meta = getMetaDataOfFunction(node);
    return [
      "$.Function(",
      generateFunctionBody(this, node, meta.args),
      generateFunctionMetadata(this, meta),
      ")"
    ];
  });

  function generateFunctionBody(that, node, args) {
    return that.withFunction([], function() {
      if (!node.body.length) {
        return [ "return [];" ];
      }

      return [
        "return [",
        generateSegmentedFunctionBody(that, node, args),
        "];"
      ];
    });
  }

  function generateSegmentedFunctionBody(that, node, args) {
    for (var i = 0, imax = args.length; i < imax; ++i) {
      that.scope.add("var", args[i]);
    }

    var result;
    var syncBlockScope = that.state.syncBlockScope;
    that.state.syncBlockScope = that.scope.peek();

    result = generateSegmentedFunctionBodyElements(that, node, args);

    that.state.syncBlockScope = syncBlockScope;

    return result;
  }

  function generateSegmentedFunctionBodyElements(that, node, args) {
    var fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    var assignArguments = function(item, i) {
      return $id(args[i]) + "=" + fargs[i];
    };

    var i = 0, imax = node.body.length;
    var lastIndex = imax - 1;

    var fragments = [];

    var loop = function() {
      var fragments = [];
      var stmt;

      while (i < imax) {
        if (i === 0) {
          if (args.length) {
            stmt = that.stitchWith(args, ";", assignArguments);
            fragments.push([ stmt, ";" ]);
          }
        }

        var calledSegmentedMethod = that.state.calledSegmentedMethod;
        that.state.calledSegmentedMethod = false;

        stmt = that.generate(node.body[i]);

        if (i === lastIndex || that.state.calledSegmentedMethod) {
          stmt = [ "return ", stmt ];
        }
        fragments.push([ stmt, ";" ]);

        i += 1;
        if (that.state.calledSegmentedMethod) {
          break;
        }

        that.state.calledSegmentedMethod = calledSegmentedMethod;
      }

      return fragments;
    };

    fragments.push(that.withFunction(fargs, loop));

    while (i < imax) {
      fragments.push(",", that.withFunction([], loop));
    }

    fragments.push(generateFunctionToCleanVariables(that));

    return fragments;
  }

  function generateFunctionMetadata(that, info) {
    var keys = info.keys;
    var vals = info.vals;

    if (keys.length === 0 && !info.remain && !info.closed) {
      return [];
    }

    var args = that.stitchWith(keys, ";", function(item, i) {
      var result = [ keys[i] ];

      if (vals[i]) {
        if (vals[i].type === Syntax.ListExpression) {
          result.push("=[", that.stitchWith(vals[i].elements, ",", function(item) {
            return toArgumentValueString(item);
          }), "]");
        } else {
          result.push("=", toArgumentValueString(vals[i]));
        }
      }

      return result;
    });

    var result = [ ",'", args ];

    if (info.remain) {
      if (keys.length) {
        result.push(";");
      }
      result.push("*" + info.remain);
    }
    result.push("'");

    if (info.closed) {
      result.push(",true");
    }

    return result;
  }

  function $id(name) {
    return name.replace(/^(?![_$])/, "$");
  }

  function toArgumentValueString(node) {
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
  }

  function generateFunctionToCleanVariables(that) {
    var resetVars = Object.keys(that.state.syncBlockScope.vars);

    if (resetVars.length) {
      return [ ",", that.withFunction([], function() {
        return resetVars.sort().map($id).join("=") + "=null;";
      }) ];
    }

    return [ ",$.NOP" ];
  }

  function getMetaDataOfFunction(node) {
    var args = [];
    var keys = [];
    var vals = [];
    var remain = null;

    if (node.args) {
      var list = node.args.list;
      for (var i = 0, imax = list.length; i < imax; ++i) {
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
      args: args,
      keys: keys,
      vals: vals,
      remain: remain,
      closed: node.closed
    };
  }
})(sc);

// src/sc/lang/compiler/codegen/event-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("EventExpression", function(node) {
    return [
      "$.Event(", this.insertArrayElement(node.elements), ")"
    ];
  });
})(sc);

// src/sc/lang/compiler/codegen/envir-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("EnvironmentExpression", function(node, opts) {
    if (!opts) {
      // getter
      return "$.Environment('" + node.id.name + "')";
    }

    // setter
    opts.used = true;
    return [ "$.Environment('" + node.id.name + "',", this.generate(opts.right), ")" ];
  });
})(sc);

// src/sc/lang/compiler/codegen/call-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("CallExpression", function(node) {
    if (node.segmented) {
      this.state.calledSegmentedMethod = true;
    }

    if (node.args.expand) {
      return generateExpandCall(this, node);
    }

    return generateSimpleCall(this, node);
  });

  function generateSimpleCall(that, node) {
    var list = node.args.list;

    if (node.stamp === "=") {
      return that.useTemporaryVariable(function(tempVar) {
        return [
          "(" + tempVar + "=", that.generate(list[0]), ",",
          that.generate(node.callee), ".$('" + node.method.name + "',[" + tempVar + "]), ",
          tempVar + ")"
        ];
      });
    }

    if (list.length || node.args.keywords) {
      var hasActualArgument = !!list.length;
      var args = [
        that.stitchWith(list, ",", function(item) {
          return that.generate(item);
        }),
        insertKeyValueElement(that, node.args.keywords, hasActualArgument)
      ];
      return [
        that.generate(node.callee), ".$('" + node.method.name + "',[", args, "])"
      ];
    }

    return [
      that.generate(node.callee), ".$('" + node.method.name + "')"
    ];
  }

  function generateExpandCall(that, node) {
    return that.useTemporaryVariable(function(tempVar) {
      return [
        "(" + tempVar + "=",
        that.generate(node.callee),
        "," + tempVar + ".$('" + node.method.name + "',",
        that.insertArrayElement(node.args.list), ".concat(",
        that.generate(node.args.expand), ".$('asArray')._",
        insertKeyValueElement(that, node.args.keywords, true),
        ")))"
      ];
    });
  }

  function insertKeyValueElement(that, keyValues, withComma) {
    var result = [];

    if (keyValues) {
      if (withComma) {
        result.push(",");
      }
      result.push(
        "{", that.stitchWith(Object.keys(keyValues), ",", function(key) {
          return [ key, ":", that.generate(keyValues[key]) ];
        }), "}"
      );
    }

    return result;
  }
})(sc);

// src/sc/lang/compiler/codegen/binop-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("BinaryExpression", function(node) {
    var operator = node.operator;

    if (operator === "===" || operator === "!==") {
      return generateEqualityOperator(this, node);
    }

    return generateBinaryExpression(this, node);
  });

  function generateEqualityOperator(that, node) {
    return [
      "$.Boolean(",
      that.generate(node.left), node.operator, that.generate(node.right),
      ")"
    ];
  }

  function generateBinaryExpression(that, node) {
    var result = [
      that.generate(node.left),
      ".$('" + node.operator + "',[", that.generate(node.right)
    ];

    if (node.adverb) {
      result.push(",", that.generate(node.adverb));
    }
    result.push("])");

    return result;
  }
})(sc);

// src/sc/lang/compiler/codegen/assignment-expr.js
(function(sc) {

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("AssignmentExpression", function(node) {
    if (Array.isArray(node.left)) {
      return generateDestructuringAssignment(this, node);
    }
    return generateSimpleAssignment(this, node);
  });

  function generateSimpleAssignment(that, node) {
    var result = [];

    var opts = { right: node.right, used: false };

    result.push(that.generate(node.left, opts));

    if (!opts.used) {
      result.push(node.operator, that.generate(opts.right));
    }

    return result;
  }

  function generateDestructuringAssignment(that, node) {
    return that.useTemporaryVariable(function(tempVar) {
      var elements = node.left;
      var operator = node.operator;

      var result = [ "(" + tempVar + "=", that.generate(node.right), "," ];

      result.push(that.stitchWith(elements, ",", function(item, i) {
        return generateAssign(
          that, item, operator, tempVar + ".$('at',[$.Integer(" + i + ")])"
        );
      }));

      if (node.remain) {
        result.push(",", generateAssign(
          that, node.remain, operator,
          tempVar + ".$('copyToEnd',[$.Integer(" + elements.length + ")])"
        ));
      }

      result.push(",", tempVar + ")");

      return result;
    });
  }

  function generateAssign(that, left, operator, right) {
    var opts = { right: right, used: false };
    var result = [ that.generate(left, opts) ];

    if (!opts.used) {
      result.push(operator, right);
    }

    return result;
  }
})(sc);

// src/sc/lang/compiler/marker/marker.js
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
            line: startLocItems[1],
            column: startLocItems[2]
          },
          end: {
            line: endLocItems[1],
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

  sc.lang.compiler.Marker = Marker;
})(sc);

// src/sc/lang/compiler/node/node.js
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
    createCallExpression: function(callee, method, args, stamp) {
      return {
        type: Syntax.CallExpression,
        stamp: stamp,
        callee: callee,
        method: method,
        args: args,
      };
    },
    createEnvironmentExpression: function(id) {
      return {
        type: Syntax.EnvironmentExpression,
        id: id
      };
    },
    createFunctionExpression: function(args, body, opts) {
      var node;

      node = {
        type: Syntax.FunctionExpression,
        body: body
      };
      if (args) {
        node.args = args;
      }
      if (opts.closed) {
        node.closed = true;
      }
      if (opts.partial) {
        node.partial = true;
      }
      if (opts.blockList) {
        node.blockList = true;
      }
      return node;
    },
    createIdentifier: function(name) {
      return {
        type: Syntax.Identifier,
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
        id: id,
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

  sc.lang.compiler.Node = Node;
})(sc);

// src/sc/lang/compiler/lexer/comment.js
(function(sc) {

  var Token = sc.lang.compiler.Token;

  function CommentLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  CommentLexer.prototype.scan = function() {
    var source = this.source;
    var index = this.index;
    var op = source.charAt(index) + source.charAt(index + 1);
    if (op === "//") {
      return this.scanSingleLineComment();
    }
    if (op === "/*") {
      return this.scanMultiLineComment();
    }
  };

  CommentLexer.prototype.scanSingleLineComment = function() {
    var source = this.source;
    var index = this.index;
    var length = source.length;

    var value = "";
    var line = 0;
    while (index < length) {
      var ch = source.charAt(index++);
      value += ch;
      if (ch === "\n") {
        line = 1;
        break;
      }
    }

    return makeCommentToken(Token.SingleLineComment, value, line);
  };

  CommentLexer.prototype.scanMultiLineComment = function() {
    var source = this.source;
    var index = this.index;
    var length = source.length;

    var value = "";
    var line = 0, depth = 0;
    while (index < length) {
      var ch1 = source.charAt(index);
      var ch2 = source.charAt(index + 1);
      value += ch1;

      if (ch1 === "\n") {
        line += 1;
      } else if (ch1 === "/" && ch2 === "*") {
        depth += 1;
        index += 1;
        value += ch2;
      } else if (ch1 === "*" && ch2 === "/") {
        depth -= 1;
        index += 1;
        value += ch2;
        if (depth === 0) {
          return makeCommentToken(Token.MultiLineComment, value, line);
        }
      }

      index += 1;
    }

    return { error: true, value: "ILLEGAL", length: length, line: line };
  };

  function makeCommentToken(type, value, line) {
    return {
      type: type,
      value: value,
      length: value.length,
      line: line|0
    };
  }

  sc.lang.compiler.lexComment = function(source, index) {
    return new CommentLexer(source, index).scan();
  };
})(sc);

// src/sc/lang/compiler/lexer/punctuator.js
(function(sc) {

  var Token = sc.lang.compiler.Token;

  function PunctuatorLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  var re = /^(\.{1,3}|[(){}[\]:;,~#`]|[-+*\/%<=>!?&|@]+)/;

  PunctuatorLexer.prototype.scan = function() {
    var source = this.source;
    var index  = this.index;

    var items = re.exec(source.slice(index));

    if (items) {
      return {
        type: Token.Punctuator, value: items[0], length: items[0].length
      };
    }

    return { error: true, value: source.charAt(index), length: 1 };
  };

  sc.lang.compiler.lexPunctuator = function(source, index) {
    return new PunctuatorLexer(source, index).scan();
  };
})(sc);

// src/sc/lang/compiler/lexer/number.js
(function(sc) {

  var strlib = sc.libs.strlib;
  var Token = sc.lang.compiler.Token;

  function NumberLexer(source, index) {
    this.source = source;
    this.index  = index;
  }

  NumberLexer.prototype.scan = function() {
    return this.scanNAryNumberLiteral() ||
      this.scanHexNumberLiteral() ||
      this.scanAccidentalNumberLiteral() ||
      this.scanDecimalNumberLiteral();
  };

  NumberLexer.prototype.match = function(re) {
    return re.exec(this.source.slice(this.index));
  };

  NumberLexer.prototype.scanNAryNumberLiteral = function() {
    var items = this.match(
      /^(\d+)r((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+)(?:\.((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+))?/
    );

    if (!items) {
      return;
    }

    var base    = removeUnderscore(items[1])|0;
    var integer = removeUnderscore(items[2]);
    var frac    = removeUnderscore(items[3]) || "";
    var pi = false;

    if (!frac && base < 26 && integer.substr(-2) === "pi") {
      integer = integer.slice(0, -2);
      pi = true;
    }

    var type  = Token.IntegerLiteral;
    var value = calcNBasedInteger(integer, base);

    if (frac) {
      type = Token.FloatLiteral;
      value += calcNBasedFrac(frac, base);
    }

    if (isNaN(value)) {
      return { error: true, value: items[0], length: items[0].length };
    }

    return makeNumberToken(type, value, pi, items[0].length);
  };

  NumberLexer.prototype.scanHexNumberLiteral = function() {
    var items = this.match(/^(0x(?:[\da-fA-F](?:_(?=[\da-fA-F]))?)+)(pi)?/);

    if (!items) {
      return;
    }

    var integer = removeUnderscore(items[1]);
    var pi      = !!items[2];

    var type  = Token.IntegerLiteral;
    var value = +integer;

    return makeNumberToken(type, value, pi, items[0].length);
  };

  NumberLexer.prototype.scanAccidentalNumberLiteral = function() {
    var items = this.match(/^(\d+)([bs]+)(\d*)/);

    if (!items) {
      return;
    }

    var integer    = removeUnderscore(items[1]);
    var accidental = items[2];
    var sign = (accidental.charAt(0) === "s") ? +1 : -1;

    var cents;
    if (items[3] === "") {
      cents = Math.min(accidental.length * 0.1, 0.4);
    } else {
      cents = Math.min(items[3] * 0.001, 0.499);
    }
    var value = +integer + (sign * cents);

    return makeNumberToken(Token.FloatLiteral, value, false, items[0].length);
  };

  NumberLexer.prototype.scanDecimalNumberLiteral = function() {
    var items = this.match(
      /^((?:\d(?:_(?=\d))?)+((?:\.(?:\d(?:_(?=\d))?)+)?(?:e[-+]?(?:\d(?:_(?=\d))?)+)?))(pi)?/
    );

    var integer = +removeUnderscore(items[1]);
    var frac    = !!items[2];
    var pi      = !!items[3];

    var type  = (frac || pi) ? Token.FloatLiteral : Token.IntegerLiteral;
    var value = integer;

    return makeNumberToken(type, value, pi, items[0].length);
  };

  function removeUnderscore(str) {
    return str && str.replace(/_/g, "");
  }

  function char2num(ch, base) {
    var num = strlib.char2num(ch, base);
    if (num >= base) {
      num = NaN;
    }
    return num;
  }

  function calcNBasedInteger(integer, base) {
    var value = 0;
    for (var i = 0, imax = integer.length; i < imax; ++i) {
      value *= base;
      value += char2num(integer[i], base);
    }
    return value;
  }

  function calcNBasedFrac(frac, base) {
    var value = 0;
    for (var i = 0, imax = frac.length; i < imax; ++i) {
      value += char2num(frac[i], base) * Math.pow(base, -(i + 1));
    }
    return value;
  }

  function makeNumberToken(type, value, pi, length) {
    if (pi) {
      type = Token.FloatLiteral;
      value = value * Math.PI;
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    }

    return { type: type, value: String(value), length: length };
  }

  sc.lang.compiler.lexNumber = function(source, index) {
    return new NumberLexer(source, index).scan();
  };
})(sc);

// src/sc/lang/compiler/lexer/string.js
(function(sc) {

  var Token = sc.lang.compiler.Token;

  function StringLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  StringLexer.prototype.scan = function() {
    return this.scanSymbolLiteral() ||
      this.scanQuotedSymbolLiteral() ||
      this.scanStringLiteral() ||
      this.scanCharLiteral();
  };

  StringLexer.prototype.match = function(re) {
    return re.exec(this.source.slice(this.index));
  };

  StringLexer.prototype.scanCharLiteral = function() {
    var source = this.source;
    var index  = this.index;

    if (source.charAt(index) !== "$") {
      return;
    }

    var value = source.charAt(index + 1) || "";

    return makeStringToken(Token.CharLiteral, value, 1);
  };

  StringLexer.prototype.scanSymbolLiteral = function() {
    var items = this.match(/^\\([a-zA-Z_]\w*|\d+)?/);

    if (!items) {
      return;
    }

    var value = items[1] || "";

    return makeStringToken(Token.SymbolLiteral, value, 1);
  };

  StringLexer.prototype.scanQuotedSymbolLiteral = function() {
    var source = this.source;
    var index  = this.index;

    if (source.charAt(index) !== "'") {
      return;
    }

    var value = "";
    var pad = 2;
    for (var i = index + 1, imax = source.length; i < imax; ++i) {
      var ch = source.charAt(i);
      if (ch === "'") {
        return makeStringToken(Token.SymbolLiteral, value, pad);
      }
      if (ch === "\n") {
        break;
      }
      if (ch === "\\") {
        pad += 1;
      } else {
        value += ch;
      }
    }

    return makeErrorToken("'" + value);
  };

  StringLexer.prototype.scanStringLiteral = function() {
    var source = this.source;
    var index  = this.index;

    if (source.charAt(index) !== '"') {
      return;
    }

    var value = "";
    var pad = 2, line = 0;
    for (var i = index + 1, imax = source.length; i < imax; ++i) {
      var ch = source.charAt(i);
      if (ch === '"') {
        return makeStringToken(Token.StringLiteral, value, pad, line);
      } else if (ch === "\n") {
        line += 1;
        value += "\\n";
        pad -= 1;
      } else if (ch === "\\") {
        value += "\\" + source.charAt(++i);
      } else {
        value += ch;
      }
    }

    return makeErrorToken('"' + value, line);
  };

  function makeStringToken(type, value, pad, line) {
    return {
      type: type,
      value: value,
      length: value.length + pad,
      line: line|0
    };
  }

  function makeErrorToken(value, line) {
    return {
      error: true,
      value: value,
      length: value.length,
      line: line|0
    };
  }

  sc.lang.compiler.lexString = function(source, index) {
    return new StringLexer(source, index).scan();
  };
})(sc);

// src/sc/lang/compiler/lexer/identifier.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Keywords = sc.lang.compiler.Keywords;

  function IdentifierLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  var re = /^(_|[a-zA-Z][a-zA-Z0-9_]*)/;

  IdentifierLexer.prototype.scan = function() {
    var source = this.source;
    var index  = this.index;

    var value = re.exec(source.slice(index))[0];
    var length = value.length;

    var type;
    if (source.charAt(index + length) === ":") {
      type = Token.Label;
      length += 1;
    } else if (isKeyword(value)) {
      type = Token.Keyword;
    } else if (value === "inf") {
      type = Token.FloatLiteral;
      value = "Infinity";
    } else if (value === "pi") {
      type = Token.FloatLiteral;
      value = String(Math.PI);
    } else if (value === "nil") {
      type = Token.NilLiteral;
    } else if (value === "true") {
      type = Token.TrueLiteral;
    } else if (value === "false") {
      type = Token.FalseLiteral;
    } else {
      type = Token.Identifier;
    }

    return { type: type, value: value, length: length };
  };

  function isKeyword(value) {
    return Keywords.hasOwnProperty(value);
  }

  sc.lang.compiler.lexIdentifier = function(source, index) {
    return new IdentifierLexer(source, index).scan();
  };
})(sc);

// src/sc/lang/compiler/lexer/lexer.js
(function(sc) {

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Token    = sc.lang.compiler.Token;
  var Message  = sc.lang.compiler.Message;
  var Marker = sc.lang.compiler.Marker;
  var lexIdentifier = sc.lang.compiler.lexIdentifier;
  var lexString = sc.lang.compiler.lexString;
  var lexNumber = sc.lang.compiler.lexNumber;
  var lexPunctuator = sc.lang.compiler.lexPunctuator;
  var lexComment = sc.lang.compiler.lexComment;

  function Lexer(source, opts) {
    /* istanbul ignore next */
    if (typeof source !== "string") {
      if (typeof source === "undefined") {
        source = "";
      }
      source = String(source);
    }
    this.source = source.replace(/\r\n?/g, "\n");
    this.opts = opts = opts || /* istanbul ignore next */ {};

    this.length = source.length;
    this.errors = null;

    this.index = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart = 0;

    this.lookahead = this.advance();

    this.index = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart = 0;
  }

  Object.defineProperty(Lexer.prototype, "columnNumber", {
    get: function() {
      return this.index - this.lineStart;
    }
  });

  Lexer.prototype.tokenize = function() {
    var tokens = [];

    while (true) {
      var token = this.collectToken();
      if (token.type === Token.EOF) {
        break;
      }
      tokens.push(token);
    }

    return tokens;
  };

  Lexer.prototype.collectToken = function() {
    var token = this.advance();

    var result = {
      type: token.type,
      value: token.value
    };

    if (this.opts.range) {
      result.range = token.range;
    }
    if (this.opts.loc) {
      result.loc = token.loc;
    }

    return result;
  };

  Lexer.prototype.lex = function() {
    var token = this.lookahead;

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    this.lookahead = this.advance();

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    return token;
  };

  Lexer.prototype.unlex = function(token) {
    this.lookahead = token;
    this.index = token.range[0];
    this.lineNumber = token.lineNumber;
    this.lineStart = token.lineStart;
  };

  Lexer.prototype.advance = function() {
    this.skipComment();

    if (this.length <= this.index) {
      return this.EOFToken();
    }

    var lineNumber = this.lineNumber;
    var columnNumber = this.columnNumber;

    var token = this.scan();

    token.loc = {
      start: { line: lineNumber, column: columnNumber },
      end: { line: this.lineNumber, column: this.columnNumber }
    };

    return token;
  };

  Lexer.prototype.createMarker = function(node) {
    return Marker.create(this, node);
  };

  Lexer.prototype.skipComment = function() {
    var source = this.source;
    var length = this.length;

    while (this.index < length) {
      var ch1 = source.charAt(this.index);
      var ch2 = source.charAt(this.index + 1);

      if (ch1 === " " || ch1 === "\t") {
        this.index += 1;
      } else if (ch1 === "\n") {
        this.index += 1;
        this.lineNumber += 1;
        this.lineStart = this.index;
      } else if (ch1 === "/" && (ch2 === "/" || ch2 === "*")) {
        this.scanWithFunc(lexComment);
      } else {
        break;
      }
    }
  };

  Lexer.prototype.scan = function() {
    return this.scanWithFunc(this.selectScanner());
  };

  Lexer.prototype.selectScanner = function() {
    var ch = this.source.charAt(this.index);

    if (ch === "\\" || ch === "'" || ch === '"' || ch === "$") {
      return lexString;
    }

    if (ch === "_" || strlib.isAlpha(ch)) {
      return lexIdentifier;
    }

    if (strlib.isNumber(ch)) {
      return lexNumber;
    }

    return lexPunctuator;
  };

  Lexer.prototype.scanWithFunc = function(func) {
    var start = this.index;
    var token = func(this.source, this.index);
    if (token.error) {
      return this.throwError({}, Message.UnexpectedToken, token.value);
    }
    this.index += token.length;
    if (token.line) {
      var value = token.value;
      this.lineStart = this.index - (value.length - value.lastIndexOf("\n") - 1);
      this.lineNumber += token.line;
    }
    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.makeToken = function(type, value, start) {
    return {
      type: type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart: this.lineStart,
      range: [ start, this.index ]
    };
  };

  Lexer.prototype.EOFToken = function() {
    return this.makeToken(Token.EOF, "<EOF>", this.index);
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.index, this.lineNumber, this.columnNumber ];
  };

  Lexer.prototype.throwError = function(token, messageFormat) {
    var message = strlib.format(messageFormat, slice.call(arguments, 2));

    var index, lineNumber, column;
    if (typeof token.lineNumber === "number") {
      index      = token.range[0];
      lineNumber = token.lineNumber;
      column     = token.range[0] - token.lineStart + 1;
    } else {
      index      = this.index;
      lineNumber = this.lineNumber;
      column     = index - this.lineStart + 1;
    }

    var error = new Error("Line " + lineNumber + ": " + message);
    error.index       = index;
    error.lineNumber  = lineNumber;
    error.column      = column;
    error.description = message;

    throw error;
  };

  sc.lang.compiler.Lexer = Lexer;
})(sc);

// src/sc/lang/compiler/parser/parser.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  function Parser(parent, lexer) {
    if (!parent) {
      initialize(this, lexer);
    } else {
      this.parent = parent;
      this.lexer = parent.lexer;
      this.state = parent.state;
    }
  }

  function initialize(that, lexer) {
    that.parent = null;
    that.lexer = lexer;
    that.state = {
      innerElements: false,
      immutableList: false,
      declared: {},
      underscore: []
    };
  }

  Parser.addParseMethod = function(name, method) {
    Parser.prototype["parse" + name] = method;
  };

  Object.defineProperty(Parser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  Parser.prototype.parse = function() {
    return this.parseProgram();
  };

  Parser.prototype.lex = function() {
    return this.lexer.lex();
  };

  Parser.prototype.unlex = function(token) {
    this.lexer.unlex(token);
    return this;
  };

  Parser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
    return token;
  };

  Parser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  Parser.prototype.matchAny = function(list) {
    var value = this.lexer.lookahead.value;
    if (list.indexOf(value) !== -1) {
      return value;
    }
    return null;
  };

  Parser.prototype.createMarker = function(node) {
    return this.lexer.createMarker(node);
  };

  Parser.prototype.hasNextToken = function() {
    return this.lookahead.type !== Token.EOF;
  };

  Parser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  Parser.prototype.throwUnexpected = function(token) {
    switch (token.type) {
    case Token.EOF:
      return this.throwError(token, Message.UnexpectedEOS);
    case Token.FloatLiteral:
    case Token.IntegerLiteral:
      return this.throwError(token, Message.UnexpectedNumber);
    case Token.CharLiteral:
    case Token.StringLiteral:
    case Token.SymbolLiteral:
    case Token.TrueLiteral:
    case Token.FalseLiteral:
    case Token.NilLiteral:
      return this.throwError(token, Message.UnexpectedLiteral, token.type.toLowerCase());
    case Token.Keyword:
      return this.throwError(token, Message.UnexpectedKeyword);
    case Token.Label:
      return this.throwError(token, Message.UnexpectedLabel);
    case Token.Identifier:
      return this.throwError(token, Message.UnexpectedIdentifier);
    }
    return this.throwError(token, Message.UnexpectedToken, token.value);
  };

  Parser.prototype.addToScope = function(type, name) {
    if (this.state.declared[name]) {
      var tmpl = (type === "var") ?
        Message.VariableAlreadyDeclared : Message.ArgumentAlreadyDeclared;
      this.throwError({}, tmpl, name);
    }
    this.state.declared[name] = true;
  };

  Parser.prototype.withScope = function(func) {
    var result;

    var declared = this.state.declared;

    this.state.declared = {};
    result = func.call(this);
    this.state.declared = declared;

    return result;
  };

  sc.lang.compiler.Parser = Parser;
})(sc);

// src/sc/lang/compiler/parser/this-expr.js
(function(sc) {

  var Keywords = sc.lang.compiler.Keywords;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("ThisExpression", function() {
    var marker = this.createMarker();

    var node = this.lex();
    if (Keywords[node.value] !== "function") {
      this.throwUnexpected(node);
    }

    return marker.update().apply(
      Node.createThisExpression(node.value)
    );
  });
})(sc);

// src/sc/lang/compiler/parser/interpolate-string.js
(function(sc) {

  function InterpolateString(str) {
    this.str = str;
  }

  InterpolateString.hasInterpolateString = function(str) {
    return (/(?:^|[^\\\\])#\{/).test(str);
  };

  InterpolateString.prototype.toCompiledString = function() {
    return toCompiledString(this.str);
  };

  function toCompiledString(str) {
    var len = str.length;
    var items = [];

    var index1 = 0;
    var code;
    do {
      var index2 = findString(str, index1);
      if (index2 >= len) {
        break;
      }
      code = str.substr(index1, index2 - index1);
      if (code) {
        items.push('"' + code + '"');
      }

      index1 = index2 + 2;
      index2 = findExpression(str, index1, items);

      code = str.substr(index1, index2 - index1);
      if (code) {
        items.push("(" + code + ").asString");
      }

      index1 = index2 + 1;
    } while (index1 < len);

    if (index1 < len) {
      items.push('"' + str.substr(index1) + '"');
    }

    return items.join("++");
  }

  function findString(str, index) {
    var len = str.length;

    while (index < len) {
      switch (str.charAt(index)) {
      case "#":
        if (str.charAt(index + 1) === "{") {
          return index;
        }
        break;
      case "\\":
        index += 1;
        break;
      }
      index += 1;
    }

    return index;
  }

  function findExpression(str, index) {
    var len = str.length;

    var depth = 0;
    while (index < len) {
      switch (str.charAt(index)) {
      case "}":
        if (depth === 0) {
          return index;
        }
        depth -= 1;
        break;
      case "{":
        depth += 1;
        break;
      }
      index += 1;
    }

    return index;
  }

  sc.lang.compiler.InterpolateString = InterpolateString;
})(sc);

// src/sc/lang/compiler/parser/string-expr.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Lexer = sc.lang.compiler.Lexer;
  var InterpolateString = sc.lang.compiler.InterpolateString;
  var Parser = sc.lang.compiler.Parser;

  /*
    StringExpression :
      StringLiteral
      StringLiterals StringLiteral
  */
  Parser.addParseMethod("StringExpression", function() {
    return new StringExpressionParser(this).parse();
  });

  function StringExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(StringExpressionParser, Parser);

  StringExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    if (this.lookahead.type !== Token.StringLiteral) {
      this.throwUnexpected(this.lookahead);
    }

    var expr = this.parseStringLiteral();

    while (this.lookahead.type === Token.StringLiteral) {
      var next = this.parseStringLiteral();
      if (expr.type === Syntax.Literal && next.type === Syntax.Literal) {
        expr.value += next.value;
      } else {
        expr = Node.createBinaryExpression({ value: "++" }, expr, next);
      }
    }

    return marker.update().apply(expr, true);
  };

  StringExpressionParser.prototype.parseStringLiteral = function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(null, new Lexer(code, {})).parseExpression();
    }

    return Node.createLiteral(token);
  };
})(sc);

// src/sc/lang/compiler/parser/signed-expr.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    SignedExpression :
      PrimaryExpression
      - PrimaryExpression
  */
  Parser.addParseMethod("SignedExpression", function() {
    // TODO: fix like this
    // if (!this.match("-")) {
    //   return this.parsePrimaryExpression();
    // }

    var marker = this.createMarker();
    var expr;
    if (this.match("-")) {
      this.lex();
      var method = Node.createIdentifier("neg");
      method = marker.update().apply(method);
      expr = this.parsePrimaryExpression();
      if (isNumber(expr)) {
        expr.value = "-" + expr.value;
      } else {
        expr = Node.createCallExpression(expr, method, { list: [] }, "(");
      }
    } else {
      expr = this.parsePrimaryExpression();
    }

    return marker.update().apply(expr, true);
  });

  function isNumber(node) {
    if (node.type !== Syntax.Literal) {
      return false;
    }
    var valueType = node.valueType;
    return valueType === Token.IntegerLiteral || valueType === Token.FloatLiteral;
  }
})(sc);

// src/sc/lang/compiler/parser/series-expr.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("SeriesExpression", function() {
    return new SeriesExpressionParser(this).parse();
  });

  function SeriesExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(SeriesExpressionParser, Parser);

  SeriesExpressionParser.prototype.parse = function() {
    var generator = false;

    var marker = this.createMarker();

    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    var method = this.createMarker().apply(
      Node.createIdentifier(generator ? "seriesIter" : "series")
    );

    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var items = [
      this.parseFirstElement(),
      this.parseSecondElement(),
      this.parseLastElement()
    ];

    this.state.innerElements = innerElements;

    if (!generator && items[2] === null) {
      this.throwUnexpected(this.lookahead);
    }
    this.expect(")");

    return marker.update().apply(
      Node.createCallExpression(items.shift(), method, { list: items }, "(")
    );
  };

  SeriesExpressionParser.prototype.parseFirstElement = function() {
    if (this.match("..")) {
      return this.createMarker().apply(
        Node.createLiteral({ type: Token.IntegerLiteral, value: "0" })
      );
    }
    return this.parseExpressions();
  };

  SeriesExpressionParser.prototype.parseSecondElement = function() {
    if (this.match(",")) {
      this.lex();
      return this.parseExpressions();
    }
    return null;
  };

  SeriesExpressionParser.prototype.parseLastElement = function() {
    this.expect("..");
    if (!this.match(")")) {
      return this.parseExpressions();
    }
    return null;
  };
})(sc);

// src/sc/lang/compiler/parser/ref-expr.js
(function(sc) {

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    RefExpression
      ` CallExpression
  */
  Parser.addParseMethod("RefExpression", function() {
    var marker = this.createMarker();

    this.expect("`");

    var expr = this.parseCallExpression();

    return marker.update().apply(
      Node.createUnaryExpression("`", expr)
    );
  });
})(sc);

// src/sc/lang/compiler/parser/program.js
(function(sc) {

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Program", function() {
    var marker = this.createMarker();

    var node = this.withScope(function() {
      return Node.createProgram(
        this.parseFunctionBody()
      );
    });

    return marker.update().apply(node);
  });
})(sc);

// src/sc/lang/compiler/parser/primary-expr.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;

  /*
    PrimaryExpression :
      ( ... )
      { ... }
      ListExpression
      HashedExpression
      RefExpression
      EnvironmentExpression
      ThisExpression
      PrimaryIdentifier
      StringExpression
      PrimaryArgExpression
  */
  Parser.addParseMethod("PrimaryExpression", function() {
    switch (this.matchAny([ "(", "{", "[", "#", "`", "~" ])) {
    case "(": return this.parseParentheses();
    case "{": return this.parseBraces();
    case "[": return this.parseListExpression();
    case "#": return this.parseHashedExpression();
    case "`": return this.parseRefExpression();
    case "~": return this.parseEnvironmentExpression();
    }

    switch (this.lookahead.type) {
    case Token.Keyword:       return this.parseThisExpression();
    case Token.Identifier:    return this.parsePrimaryIdentifier();
    case Token.StringLiteral: return this.parseStringExpression();
    }

    return this.parsePrimaryArgExpression();
  });

  /*
    PrimaryArgExpression :
      ImmutableListExpression
      NilLiteral
      TrueLiteral
      FalseLiteral
      IntegerLiteral
      FloatLiteral
      SymbolLiteral
      CharLiteral
  */
  Parser.addParseMethod("PrimaryArgExpression", function() {
    if (this.match("#")) {
      return this.parseImmutableListExpression();
    }

    switch (this.lookahead.type) {
    case Token.NilLiteral:
    case Token.TrueLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.FloatLiteral:
    case Token.SymbolLiteral:
    case Token.CharLiteral:
      return this.parseLiteral();
    }

    return this.throwUnexpected(this.lex());
  });
})(sc);

// src/sc/lang/compiler/parser/partial-expr.js
(function(sc) {

  var Parser = sc.lang.compiler.Parser;
  var Node = sc.lang.compiler.Node;

  /*
    PartialExpression :
      BinaryExpression
  */
  Parser.addParseMethod("PartialExpression", function() {
    if (this.state.innerElements) {
      return this.parseBinaryExpression();
    }

    this.state.underscore = [];

    var marker = this.createMarker();

    var node = this.parseBinaryExpression();

    if (this.state.underscore.length) {
      var args = new Array(this.state.underscore.length);
      for (var i = 0, imax = args.length; i < imax; ++i) {
        var x = this.state.underscore[i];
        var y = Node.createVariableDeclarator(x);
        args[i] = this.createMarker(x).update(x).apply(y);
      }
      node = Node.createFunctionExpression({ list: args }, [ node ], { partial: true });
    }

    this.state.underscore = [];

    return marker.update().apply(node);
  });
})(sc);

// src/sc/lang/compiler/parser/parentheses.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;

  /*
    (...)
      EventExpression
      SeriesExpression
      BlockExpression
      ( Expressions )
      ( Expression  )
  */
  Parser.addParseMethod("Parentheses", function() {
    return new ParenthesesParser(this).parse();
  });

  function ParenthesesParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(ParenthesesParser, Parser);

  ParenthesesParser.prototype.parse = function() {
    var token = this.expect("(");

    if (this.match(":")) {
      this.lex();
    }

    var delegate = this.selectParenthesesParseMethod();

    this.unlex(token);

    return delegate.call(this);
  };

  ParenthesesParser.prototype.selectParenthesesParseMethod = function() {
    if (this.lookahead.type === Token.Label || this.match(")")) {
      return function() {
        return this.parseEventExpression();
      };
    }
    if (this.match("..")) {
      return function() {
        return this.parseSeriesExpression();
      };
    }

    this.parseExpression();
    if (this.matchAny([ ",", ".." ])) {
      return function() {
        return this.parseSeriesExpression();
      };
    }
    if (this.match(":")) {
      return function() {
        return this.parseEventExpression();
      };
    }
    if (this.match(";")) {
      this.lex();
      this.parseExpressions();
      if (this.matchAny([ ",", ".." ])) {
        return function() {
          return this.parseSeriesExpression();
        };
      }
      return function() {
        return this.parseExpressionsWithParentheses();
      };
    }

    return function() {
      return this.parsePartialExpressionWithParentheses();
    };
  };

  ParenthesesParser.prototype.parseExpressionsWithParentheses = function() {
    return this.parseWithParentheses(function() {
      return this.parseExpressions();
    });
  };

  ParenthesesParser.prototype.parsePartialExpressionWithParentheses = function() {
    return this.parseWithParentheses(function() {
      return this.parsePartialExpression();
    });
  };

  ParenthesesParser.prototype.parseWithParentheses = function(delegate) {
    this.expect("(");

    var marker = this.createMarker();
    var expr = delegate.call(this);
    expr = marker.update().apply(expr);

    this.expect(")");

    return expr;
  };
})(sc);

// src/sc/lang/compiler/parser/literal.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Literal", function() {
    var marker = this.createMarker();

    var node = this.lex();

    if (!isLiteral(node.type)) {
      this.throwUnexpected(node);
    }

    return marker.update().apply(
      Node.createLiteral(node)
    );
  });
  function isLiteral(type) {
    switch (type) {
    case Token.IntegerLiteral:
    case Token.FloatLiteral:
    case Token.NilLiteral:
    case Token.TrueLiteral:
    case Token.FalseLiteral:
    case Token.SymbolLiteral:
    case Token.StringLiteral:
    case Token.CharLiteral:
      return true;
    }
    return false;
  }
})(sc);

// src/sc/lang/compiler/parser/list-indexer.js
(function(sc) {

  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("ListIndexer", function() {
    return new ListIndexerParser(this).parse();
  });

  function ListIndexerParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(ListIndexerParser, Parser);

  ListIndexerParser.prototype.parse = function() {
    this.expect("[");

    var items;
    if (this.match("..")) {
      // [.. ???
      this.lex();
      items = this.parseListIndexerWithoutFirst();
    } else {
      // [first ???
      items = this.parseListIndexerWithFirst();
    }

    this.expect("]");

    return items;
  };

  ListIndexerParser.prototype.parseListIndexerWithFirst = function() {
    var first = this.parseExpressions();

    if (this.match("..")) {
      this.lex();
      // [first.. ???
      return this.parseListIndexerWithFirstWithoutSecond(first);
    }

    if (this.match(",")) {
      this.lex();
      // [first, second ???
      return this.parseListIndexerWithFirstAndSecond(first, this.parseExpressions());
    }

    // [first]
    return [ first ];
  };

  ListIndexerParser.prototype.parseListIndexerWithoutFirst = function() {
    // [..last]
    if (!this.match("]")) {
      return [ null, null, this.parseExpressions() ];
    }

    // [..]
    return [ null, null, null ];
  };

  ListIndexerParser.prototype.parseListIndexerWithFirstWithoutSecond = function(first) {
    // [first..last]
    if (!this.match("]")) {
      return [ first, null, this.parseExpressions() ];
    }

    // [first..]
    return [ first, null, null ];
  };

  ListIndexerParser.prototype.parseListIndexerWithFirstAndSecond = function(first, second) {
    if (this.match("..")) {
      this.lex();
      // [first, second..last]
      if (!this.match("]")) {
        return [ first, second, this.parseExpressions() ];
      }
      // [first, second..]
      return [ first, second, null ];
    }

    // [first, second] (the second is ignored)
    return [ first ];
  };
})(sc);

// src/sc/lang/compiler/parser/list-expr.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    ListExpression :
      [ ListElements(opts) ]

    ListElements :
      ListElement
      ListElements , ListElement

    ListElement :
      Label         Expressions
      Expressions : Expressions
      Expressions
  */
  Parser.addParseMethod("ListExpression", function() {
    return new ListExpressionParser(this).parse();
  });

  /*
    ImmutableListExpression :
      # ListExpression
  */
  Parser.addParseMethod("ImmutableListExpression", function() {
    if (this.state.immutableList) {
      this.throwUnexpected(this.lookahead);
    }
    var marker = this.createMarker();

    this.expect("#");

    this.state.immutableList = true;
    var expr = this.parseListExpression();
    this.state.immutableList = false;

    return marker.update().apply(expr, true);
  });

  function ListExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(ListExpressionParser, Parser);

  ListExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    this.expect("[");

    var elements = this.parseListElements();

    this.expect("]");

    return marker.update().apply(
      Node.createListExpression(elements, this.state.immutableList)
    );
  };

  ListExpressionParser.prototype.parseListElements = function() {
    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var elements = [];
    while (this.hasNextToken() && !this.match("]")) {
      elements.push.apply(elements, this.parseListElement());
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return elements;
  };

  ListExpressionParser.prototype.parseListElement = function() {
    if (this.lookahead.type === Token.Label) {
      return [ this.parseLabelAsSymbol(), this.parseExpressions() ];
    }

    var elements = [ this.parseExpressions() ];
    if (this.match(":")) {
      this.lex();
      elements.push(this.parseExpressions());
    }

    return elements;
  };
})(sc);

// src/sc/lang/compiler/parser/label.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("LabelAsSymbol", function() {
    var marker = this.createMarker();

    var node = this.lex();

    if (node.type !== Token.Label) {
      this.throwUnexpected(node);
    }

    var label = Node.createLiteral({
      value: node.value,
      type: Token.SymbolLiteral
    });

    return marker.update().apply(label);
  });
})(sc);

// src/sc/lang/compiler/parser/identifier.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("Identifier", function(opts) {
    opts = opts || {};
    var marker = this.createMarker();

    var node = this.lex();

    var err;
    err = err || (node.type !== Token.Identifier);
    err = err || (node.value === "_" && !opts.allowUnderscore);
    err = err || (opts.variable && !isVariable(node.value));
    if (err) {
      this.throwUnexpected(node);
    }

    return marker.update().apply(
      Node.createIdentifier(node.value)
    );
  });

  Parser.addParseMethod("PrimaryIdentifier", function() {
    var expr = this.parseIdentifier({ allowUnderscore: true });
    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }
    return expr;
  });

  function isVariable(value) {
    var ch = value.charCodeAt(0);
    return 97 <= ch && ch <= 122; // startsWith(/[a-z]/)
  }
})(sc);

// src/sc/lang/compiler/parser/hashed-expr.js
(function(sc) {

  var Parser = sc.lang.compiler.Parser;

  /*
    HashedExpression :
      ImmutableListExpression
      ClosedFunctionExpression
  */
  Parser.addParseMethod("HashedExpression", function() {
    var token = this.expect("#");

    if (this.match("[")) {
      return this.unlex(token).parseImmutableListExpression();
    }
    if (this.match("{")) {
      return this.unlex(token).parseClosedFunctionExpression();
    }

    return this.throwUnexpected(token);
  });
})(sc);

// src/sc/lang/compiler/parser/generator-expr.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("GeneratorExpression", function() {
    return new GeneratorExpressionParser(this).parse();
  });

  function GeneratorExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(GeneratorExpressionParser, Parser);

  /* istanbul ignore next */
  GeneratorExpressionParser.prototype.parse = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");
    return Node.createLiteral({ value: "nil", valueType: Token.NilLiteral });
  };
})(sc);

// src/sc/lang/compiler/parser/function-expr.js
(function(sc) {

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    FunctionExpression :
      { FunctionParameterDeclaration(opt) FunctionBody(opt) }

    FunctionParameterDeclaration :
         | FunctionParameter |
      args FunctionParameter ;

    FunctionParameter :
      FunctionParameterElements
      FunctionParameterElements ... Identifier
                                ... Identifier

    FunctionParameterElements :
      FunctionParameterElement
      FunctionParameterElements , FunctionParameterElement

    FunctionParameterElement :
      Identifier
      Identifier = parsePrimaryArgExpression
  */
  Parser.addParseMethod("FunctionExpression", function(opts) {
    return new FunctionExpressionParser(this).parse(opts);
  });

  /*
    FunctionBody :
      VariableStatements(opt) SourceElements(opt)

    VariableStatements :
      VariableStatement
      VariableStatements VariableStatement

    VariableStatement :
      var VariableDeclarationList ;

    VariableDeclarationList :
      VariableDeclaration
      VariableDeclarationList , VariableDeclaration

    VariableDeclaration :
      Identifier
      Identifier = AssignmentExpression

    SourceElements :
      Expression
      SourceElements ; Expression
  */
  Parser.addParseMethod("FunctionBody", function() {
    return new FunctionExpressionParser(this).parseFunctionBody();
  });

  /*
    ClosedFunctionExpression :
      # FunctionExpression
  */
  Parser.addParseMethod("ClosedFunctionExpression", function() {
    var marker = this.createMarker();
    this.expect("#");

    var expr = this.parseFunctionExpression({ closed: true });

    return marker.update().apply(expr, true);
  });

  function FunctionExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(FunctionExpressionParser, Parser);

  FunctionExpressionParser.prototype.parse = function(opts) {
    opts = opts || {};

    var marker = this.createMarker();

    this.expect("{");

    var node = this.withScope(function() {
      var args = this.parseFunctionParameterDeclaration();
      var body = this.parseFunctionBody();
      return Node.createFunctionExpression(args, body, opts);
    });

    this.expect("}");

    return marker.update().apply(node);
  };

  FunctionExpressionParser.prototype.parseFunctionParameterDeclaration = function() {
    if (this.match("|")) {
      return this.parseFunctionParameter("|");
    }
    if (this.match("arg")) {
      return this.parseFunctionParameter(";");
    }
    return null;
  };

  FunctionExpressionParser.prototype.parseFunctionParameter = function(sentinel) {
    this.lex();

    var args = {
      list: this.parseFunctionParameterElements(sentinel)
    };

    if (this.match("...")) {
      this.lex();
      args.remain = this.parseIdentifier({ variable: true });
      this.addToScope("arg", args.remain.name);
    }

    this.expect(sentinel);

    return args;
  };

  FunctionExpressionParser.prototype.parseFunctionParameterElements = function(sentinel) {
    var elements = [];

    if (!this.match("...")) {
      while (this.hasNextToken()) {
        elements.push(this.parseFunctionParameterElement());
        if (this.matchAny([ sentinel, "..." ]) || (sentinel === ";" && !this.match(","))) {
          break;
        }
        if (this.match(",")) {
          this.lex();
        }
      }
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseFunctionParameterElement = function() {
    return this.parseDeclaration("arg", function() {
      return this.parsePrimaryArgExpression();
    });
  };

  FunctionExpressionParser.prototype.parseFunctionBody = function() {
    return this.parseVariableStatements().concat(this.parseSourceElements());
  };

  FunctionExpressionParser.prototype.parseVariableStatements = function() {
    var elements = [];

    while (this.match("var")) {
      elements.push(this.parseVariableStatement());
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseVariableStatement = function() {
    var marker = this.createMarker();

    this.lex(); // var

    var declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarationList(), "var"
    );
    declaration = marker.update().apply(declaration);

    this.expect(";");

    return declaration;
  };

  FunctionExpressionParser.prototype.parseVariableDeclarationList = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclaration());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.hasNextToken());

    return list;
  };

  FunctionExpressionParser.prototype.parseVariableDeclaration = function() {
    return this.parseDeclaration("var", function() {
      return this.parseAssignmentExpression();
    });
  };

  FunctionExpressionParser.prototype.parseSourceElements = function() {
    var elements = [];

    while (this.hasNextToken() && !this.matchAny([ "}", ")" ])) {
      elements.push(this.parseExpression());
      if (this.matchAny([ "}", ")" ])) {
        break;
      }
      if (this.hasNextToken()) {
        this.expect(";");
      }
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseDeclaration = function(type, delegate) {
    var marker = this.createMarker();

    var identifier = this.parseIdentifier({ variable: true });
    this.addToScope(type, identifier.name);

    var initialValue = this.parseInitialiser(delegate);

    return marker.update().apply(
      Node.createVariableDeclarator(identifier, initialValue)
    );
  };

  FunctionExpressionParser.prototype.parseInitialiser = function(delegate) {
    if (!this.match("=")) {
      return null;
    }
    this.lex();
    return delegate.call(this);
  };
})(sc);

// src/sc/lang/compiler/parser/expression.js
(function(sc) {

  var Parser = sc.lang.compiler.Parser;

  /*
    Expression :
      AssignmentExpression
  */
  Parser.addParseMethod("Expression", function() {
    return this.parseAssignmentExpression();
  });

  /*
    Expressions :
      Expression
      Expressions ; Expression
  */
  Parser.addParseMethod("Expressions", function() {
    var nodes = [];

    while (this.hasNextToken() && !this.matchAny([ ",", ")", "]", "}", ":", ".." ])) {
      nodes.push(
        this.parseExpression()
      );
      if (this.match(";")) {
        this.lex();
      }
    }

    if (nodes.length === 0) {
      this.throwUnexpected(this.lookahead);
    }

    return nodes.length === 1 ? nodes[0] : nodes;
  });
})(sc);

// src/sc/lang/compiler/parser/event-expr.js
(function(sc) {

  /*
  */
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("EventExpression", function() {
    return new EventExpressionParser(this).parse();
  });

  function EventExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(EventExpressionParser, Parser);

  EventExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    this.expect("(");

    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var elements = [];
    while (this.hasNextToken() && !this.match(")")) {
      elements.push(
        this._getKeyElement(), this._getValElement()
      );
      if (this.match(",")) {
        this.lex();
      }
    }
    this.state.innerElements = innerElements;

    this.expect(")");

    return marker.update().apply(
      Node.createEventExpression(elements)
    );
  };

  EventExpressionParser.prototype._getKeyElement = function() {
    if (this.lookahead.type === Token.Label) {
      return this.parseLabelAsSymbol();
    }

    var node = this.parseExpression();
    this.expect(":");

    return node;
  };

  EventExpressionParser.prototype._getValElement = function() {
    return this.parseExpression();
  };
})(sc);

// src/sc/lang/compiler/parser/envir-expr.js
(function(sc) {

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    EnvironmentExpression :
      ~ Identifier
  */
  Parser.addParseMethod("EnvironmentExpression", function() {
    var marker = this.createMarker();

    this.expect("~");
    var expr = this.parseIdentifier({ variable: true });

    return marker.update().apply(
      Node.createEnvironmentExpression(expr)
    );
  });
})(sc);

// src/sc/lang/compiler/parser/call-expr.js
(function(sc) {

  var Parser = sc.lang.compiler.Parser;
  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;

  Parser.addParseMethod("CallExpression", function() {
    return new CallExpressionParser(this).parse();
  });

  function CallExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(CallExpressionParser, Parser);

  /*
    CallExpression :
      TODO: write
  */
  CallExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();
    var expr = this.parseSignedExpression();

    var stamp;
    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      var err = false;
      err = err || (expr.stamp === "(" && stamp === "(");
      err = err || (expr.stamp === "[" && stamp === "(");
      err = err || (expr.stamp === "[" && stamp === "{");
      if (err) {
        this.throwUnexpected(this.lookahead);
      }

      expr = this.parseCallChainExpression(stamp, expr);
      marker.update().apply(expr, true);
    }

    return expr;
  };

  CallExpressionParser.prototype.parseCallChainExpression = function(stamp, expr) {
    if (stamp === "(") {
      return this.parseCallParentheses(expr);
    }
    if (stamp === "#") {
      return this.parseCallClosedBraces(expr);
    }
    if (stamp === "{") {
      return this.parseCallBraces(expr);
    }
    if (stamp === "[") {
      return this.parseCallBrackets(expr);
    }
    return this.parseCallDot(expr);
  };

  CallExpressionParser.prototype.parseCallParentheses = function(expr) {
    if (isClassName(expr)) {
      // Expr.new( ... )
      return this.parseCallAbbrMethodCall(expr, "new", "(");
    }
    // expr( a ... ) -> a.expr( ... )
    return this.parseCallMethodCall(expr);
  };

  CallExpressionParser.prototype.parseCallClosedBraces = function(expr) {
    var token = this.expect("#");
    if (!this.match("{")) {
      return this.throwUnexpected(token);
    }
    return this.parseCallBraces(expr, { closed: true });
  };

  CallExpressionParser.prototype.parseCallBraces = function(expr, opts) {
    opts = opts || {};

    if (expr.type === Syntax.Identifier) {
      expr = createCallExpressionForBraces(expr, this.createMarker());
    }
    var node = this.parseFunctionExpression({ blockList: true, closed: !!opts.closed });

    if (expr.callee === null) {
      expr.callee = node;
    } else {
      expr.args.list.push(node);
    }

    return expr;
  };

  function createCallExpressionForBraces(expr, marker) {
    var callee, method;

    if (isClassName(expr)) {
      callee = expr;
      method = marker.apply(Node.createIdentifier("new"));
    } else {
      callee = null;
      method = expr;
    }

    return Node.createCallExpression(callee, method, { list: [] }, "(");
  }

  CallExpressionParser.prototype.parseCallMethodCall = function(expr) {
    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var lookahead = this.lookahead;
    var args      = new ArgumentsParser(this).parse();

    var method = expr;

    expr = args.list.shift();

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

  CallExpressionParser.prototype.parseCallAbbrMethodCall = function(expr, methodName, stamp) {
    var method = Node.createIdentifier(methodName);

    method = this.createMarker().apply(method);

    var args = new ArgumentsParser(this).parse();

    return Node.createCallExpression(expr, method, args, stamp);
  };

  CallExpressionParser.prototype.parseCallBrackets = function(expr) {
    if (isClassName(expr)) {
      return this.parseCallwithList(expr);
    }
    return this.parseCallwithIndexer(expr);
  };

  CallExpressionParser.prototype.parseCallwithList = function(expr) {
    var marker = this.createMarker();

    var method = this.createMarker().apply(
      Node.createIdentifier("at")
    );
    var listExpr = this.parseListExpression();

    return marker.update().apply(
      Node.createCallExpression(expr, method, { list: [ listExpr ] }, "[")
    );
  };

  CallExpressionParser.prototype.parseCallwithIndexer = function(expr) {
    var marker = this.createMarker();

    var method = this.createMarker().apply(
      Node.createIdentifier()
    );
    var listIndexer = this.parseListIndexer();

    method.name = listIndexer.length === 3 ? "copySeries" : "at";

    return marker.update().apply(
      Node.createCallExpression(expr, method, { list: listIndexer }, "[")
    );
  };

  CallExpressionParser.prototype.parseCallDot = function(expr) {
    this.expect(".");

    if (this.match("(")) {
      // expr.()
      return this.parseCallAbbrMethodCall(expr, "value", "(");
    }
    if (this.match("[")) {
      // expr.[0]
      return this.parseDotBrackets(expr);
    }

    var marker = this.createMarker();

    var method = this.parseIdentifier({ variable: true });
    var args   = new ArgumentsParser(this).parse();

    return marker.update().apply(
      Node.createCallExpression(expr, method, args, "(")
    );
  };

  CallExpressionParser.prototype.parseDotBrackets = function(expr) {
    var marker = this.createMarker(expr);

    var method = Node.createIdentifier("value");
    method = this.createMarker().apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, "(");
    expr = marker.update().apply(expr);

    return this.parseCallwithIndexer(expr);
  };

  function ArgumentsParser(parent) {
    Parser.call(this, parent);
    this._hasKeyword = false;
    this._args = { list: [] };
  }
  sc.libs.extend(ArgumentsParser, Parser);

  ArgumentsParser.prototype.parse = function() {
    if (this.match("(")) {
      return this.parseArguments();
    }
    return { list: [] };
  };

  ArgumentsParser.prototype.parseArguments = function() {
    this.expect("(");

    while (this.hasNextToken() && !this.match(")")) {
      var lookahead = this.lookahead;
      if (!this._hasKeyword) {
        if (this.match("*")) {
          this.lex();
          this._args.expand = this.parseExpressions();
          this._hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          this.parseKeywordArgument();
          this._hasKeyword = true;
        } else {
          this._args.list.push(this.parseExpressions());
        }
      } else {
        this.parseKeywordArgument();
      }
      if (!this.match(")")) {
        this.expect(",");
      }
    }

    this.expect(")");

    return this._args;
  };

  ArgumentsParser.prototype.parseKeywordArgument = function() {
    var token = this.lex();
    if (token.type !== Token.Label) {
      return this.throwUnexpected(token);
    }

    var key = token.value;
    var val = this.parseExpressions();

    if (!this._args.keywords) {
      this._args.keywords = {};
    }
    this._args.keywords[key] = val;
  };

  function isClassName(node) {
    if (node.type !== Syntax.Identifier) {
      return false;
    }

    var name = node.value || node.name;
    var ch = name.charAt(0);

    return "A" <= ch && ch <= "Z";
  }
})(sc);

// src/sc/lang/compiler/parser/braces.js
(function(sc) {

  var Parser = sc.lang.compiler.Parser;

  /*
    Braces :
      { : GeneratorExpression }
      {   FunctionExpression  }
  */
  Parser.addParseMethod("Braces", function(opts) {
    opts = opts || {};
    var token = this.expect("{");
    var colon = this.match(":");

    this.unlex(token);

    if (colon && !opts.blockList) {
      return this.parseGeneratorExpression();
    }

    return this.parseFunctionExpression(opts);
  });
})(sc);

// src/sc/lang/compiler/parser/binop-expr.js
(function(sc) {

  var Token = sc.lang.compiler.Token;
  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    BinaryExpression :
      CallExpression BinaryExpressionOperator BinaryExpressionAdverb(opts) BinaryExpression

    BinaryExpressionOperator :
      /[-+*\/%<=>!?&|@]+/
      LabelLiteral

    BinaryExpressionAdverb :
      . Identifier
      . IntegerLiteral
  */
  Parser.addParseMethod("BinaryExpression", function() {
    return new BinaryExpressionParser(this).parse();
  });

  function BinaryExpressionParser(parent) {
    Parser.call(this, parent);

    // TODO:
    // replace
    // this.binaryPrecedence = sc.config.binaryPrecedence;
    //
    // remove below
    var binaryPrecedence;
    if (sc.config.binaryPrecedence) {
      // istanbul ignore next
      if (typeof sc.config.binaryPrecedence === "object") {
        binaryPrecedence = sc.config.binaryPrecedence;
      } else {
        binaryPrecedence = sc.lang.compiler.binaryPrecedenceDefaults;
      }
    }

    this.binaryPrecedence = binaryPrecedence || {};
  }
  sc.libs.extend(BinaryExpressionParser, Parser);

  BinaryExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    var expr = this.parseCallExpression();

    var prec = this.calcBinaryPrecedence(this.lookahead);
    if (prec === 0) {
      return expr;
    }

    var operator = this.parseBinaryExpressionOperator(prec);

    return this.sortByBinaryPrecedence(expr, operator, marker);
  };

  BinaryExpressionParser.prototype.calcBinaryPrecedence = function(token) {
    if (token.type === Token.Label) {
      return 255;
    }

    if (token.type === Token.Punctuator) {
      var operator = token.value;
      if (operator === "=") {
        return 0;
      }
      if (isBinaryOperator(operator)) {
        return this.binaryPrecedence[operator] || 255;
      }
    }

    return 0;
  };

  BinaryExpressionParser.prototype.parseBinaryExpressionOperator = function(prec) {
    var operator = this.lex();
    operator.prec = prec;
    operator.adverb = this.parseBinaryExpressionAdverb();
    return operator;
  };

  BinaryExpressionParser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var markerStack = [ marker, this.createMarker() ];
    var exprOpStack = [ left, operator, this.parseCallExpression() ];

    var prec;
    while ((prec = this.calcBinaryPrecedence(this.lookahead)) > 0) {
      sortByBinaryPrecedence(prec, exprOpStack, markerStack);

      operator = this.parseBinaryExpressionOperator(prec);

      markerStack.push(this.createMarker());
      exprOpStack.push(operator, this.parseCallExpression());
    }

    return reduceBinaryExpressionStack(exprOpStack, markerStack);
  };

  BinaryExpressionParser.prototype.parseBinaryExpressionAdverb = function() {
    if (!this.match(".")) {
      return null;
    }

    this.lex();

    var lookahead = this.lookahead;
    var adverb = this.parsePrimaryExpression();

    if (isInteger(adverb)) {
      return adverb;
    }

    if (isAdverb(adverb)) {
      return this.createMarker(adverb).update().apply(
        Node.createLiteral({ type: Token.SymbolLiteral, value: adverb.name })
      );
    }

    return this.throwUnexpected(lookahead);
  };

  function sortByBinaryPrecedence(prec, exprOpStack, markerStack) {
    while (isNeedSort(prec, exprOpStack)) {
      var right    = exprOpStack.pop();
      var operator = exprOpStack.pop();
      var left     = exprOpStack.pop();
      markerStack.pop();
      exprOpStack.push(peek(markerStack).update().apply(
        Node.createBinaryExpression(operator, left, right)
      ));
    }
  }

  function reduceBinaryExpressionStack(exprOpStack, markerStack) {
    markerStack.pop();

    var expr = exprOpStack.pop();
    while (exprOpStack.length) {
      expr = markerStack.pop().update().apply(
        Node.createBinaryExpression(exprOpStack.pop(), exprOpStack.pop(), expr)
      );
    }

    return expr;
  }

  function peek(stack) {
    return stack[stack.length - 1];
  }

  function isNeedSort(prec, exprOpStack) {
    return exprOpStack.length > 2 && prec <= exprOpStack[exprOpStack.length - 2].prec;
  }

  function isBinaryOperator(operator) {
    return (/^[-+*\/%<=>!?&|@]+$/).test(operator);
  }

  function isInteger(node) {
    return node.valueType === Token.IntegerLiteral;
  }

  function isAdverb(node) {
    if (node.type === Syntax.Identifier) {
      return (/^[a-z]$/).test(node.name.charAt(0));
    }
    return false;
  }
})(sc);

// src/sc/lang/compiler/parser/assignment-expr.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    AssignmentExpression :
      PartialExpression
      PartialExpression = AssignmentExpression
      # DestructuringAssignmentLeft = AssignmentExpression

    DestructuringAssignmentLeft :
      DestructingAssignmentLeftList
      DestructingAssignmentLeftList ... Identifier

    DestructingAssignmentLeftList :
      Identifier
      DestructingAssignmentLeftList , Identifier
  */
  Parser.addParseMethod("AssignmentExpression", function() {
    return new AssignmentExpressionParser(this).parse();
  });

  function AssignmentExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(AssignmentExpressionParser, Parser);

  AssignmentExpressionParser.prototype.parse = function() {
    var token;
    if (this.match("#")) {
      token = this.lex();
      if (!this.matchAny([ "[", "{" ])) {
        return this.unlex(token).parseDestructuringAssignmentExpression();
      }
      this.unlex(token);
    }
    return this.parseSimpleAssignmentExpression();
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpression = function() {
    var expr = this.parsePartialExpression();

    if (!this.match("=")) {
      return expr;
    }
    this.lex();

    if (expr.type === Syntax.CallExpression) {
      return this.parseSimpleAssignmentExpressionViaMethod(expr);
    }

    return this.parseSimpleAssignmentExpressionViaOperator(expr);
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpressionViaMethod = function(expr) {
    var marker = this.createMarker(expr);
    var right = this.parseAssignmentExpression();

    var methodName = expr.method.name;
    if (expr.stamp === "[") {
      methodName = methodName === "at" ? "put" : "putSeries";
    } else {
      methodName = methodName + "_";
    }

    expr.method.name = methodName;
    expr.args.list   = expr.args.list.concat(right);
    if (expr.stamp !== "[")  {
      expr.stamp = "=";
    }

    return marker.update().apply(expr, true);
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpressionViaOperator = function(expr) {
    if (isInvalidLeftHandSide(expr)) {
      this.throwError(expr, Message.InvalidLHSInAssignment);
    }

    var marker = this.createMarker(expr);
    var right = this.parseAssignmentExpression();

    return marker.update().apply(
      Node.createAssignmentExpression("=", expr, right)
    );
  };

  AssignmentExpressionParser.prototype.parseDestructuringAssignmentExpression = function() {
    var marker = this.createMarker();

    this.expect("#");

    var left = this.parseDestructuringAssignmentLeft();

    this.expect("=");
    var right = this.parseAssignmentExpression();

    return marker.update().apply(
      Node.createAssignmentExpression("=", left.list, right, left.remain)
    );
  };

  AssignmentExpressionParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = {
      list: this.parseDestructingAssignmentLeftList()
    };

    if (this.match("...")) {
      this.lex();
      params.remain = this.parseIdentifier({ variable: true });
    }

    return params;
  };

  AssignmentExpressionParser.prototype.parseDestructingAssignmentLeftList = function() {
    var elemtns = [];

    do {
      elemtns.push(this.parseIdentifier({ variable: true }));
      if (this.match(",")) {
        this.lex();
      }
    } while (this.hasNextToken() && !this.matchAny([ "...", "=" ]));

    return elemtns;
  };

  function isInvalidLeftHandSide(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.EnvironmentExpression:
      return false;
    }
    return true;
  }
})(sc);

// src/sc/lang/compiler/rewriter/rewriter.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;

  var SegmentedMethod = {
    idle: true,
    sleep: true,
    wait: true,
    yield: true,
    alwaysYield: true,
    yieldAndReset: true,
    embedInStream: true,
  };

  function Rewriter() {
    this.functionStack = [];
    this.functionArray = [];
  }

  Rewriter.prototype.rewrite = function(ast) {
    ast = this.traverse(ast);
    this.functionArray.forEach(function(node) {
      node.body = this.segment(node.body);
    }, this);
    return ast;
  };

  Rewriter.prototype.traverse = function(node) {
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

  Rewriter.prototype.traverse$Array = function(node) {
    return node.map(function(node) {
      return this.traverse(node);
    }, this);
  };

  Rewriter.prototype.traverse$Object = function(node) {
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

  Rewriter.prototype.segment = function(list) {
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
    return node && node.type === Syntax.FunctionExpression;
  }

  function isSegmentedMethod(node) {
    return node && node.type === Syntax.CallExpression &&
      (SegmentedMethod.hasOwnProperty(node.method.name) || isValueMethod(node));
  }

  function isValueMethod(node) {
    return node && node.type === Syntax.CallExpression &&
      node.method.name.substr(0, 5) === "value";
  }

  sc.lang.compiler.Rewriter = Rewriter;
})(sc);

})(this.self || global);

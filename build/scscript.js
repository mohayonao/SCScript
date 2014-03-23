(function(global) {
"use strict";

var sc = { VERSION: "0.0.7" };

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

  var metaClasses = {}, classes = {};

  var extend = function(constructor, superMetaClass) {
    function F() {}
    F.prototype = superMetaClass._Spec.prototype;
    constructor.prototype = new F();

    function Meta_F() {}
    Meta_F.prototype = superMetaClass._MetaSpec.prototype;

    function MetaSpec() {}
    MetaSpec.prototype = new Meta_F();

    constructor.metaClass = new SCClass(MetaSpec);
  };

  var throwError = {
    NotYetImplemented: function(id) {
      return function() {
        throw new Error("NotYetImplemented: " + id);
      };
    }
  };

  var def = function(className, spec, classMethods, instanceMethods, opts) {

    var setMethod = function(methods, methodName, func) {
      var dot;

      if (methods.hasOwnProperty(methodName) && !(opts && opts.force)) {
        dot = methods === classMethods ? "." : "#";
        throw new Error(className + dot + methodName + " is already defined.");
      }

      methods[methodName] = func;
    };

    Object.keys(spec).forEach(function(methodName) {
      var thrower;

      if (methodName === "constructor") {
        return;
      }

      if (throwError.hasOwnProperty(methodName)) {
        thrower = throwError[methodName];
        spec[methodName].forEach(function(methodName) {
          if (methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
            methodName = methodName.substr(1);
            setMethod(classMethods, methodName, thrower(className + "." + methodName));
          } else {
            setMethod(instanceMethods, methodName, thrower(className + "#" + methodName));
          }
        });
      } else {
        if (methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
          setMethod(classMethods, methodName.substr(1), spec[methodName]);
        } else {
          setMethod(instanceMethods, methodName, spec[methodName]);
        }
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

    def(className, spec, metaClass._MetaSpec.prototype, constructor.prototype, opts);

    metaClass._Spec = constructor;
    metaClass._isMetaClass = true;
    metaClass._name = "Meta_" + className;
    metaClasses[className] = metaClass;
    classes[className] = null;
  };

  sc.lang.klass.refine = function(className, spec, opts) {
    var metaClass;

    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.refine: class '" + className + "' is not registered."
      );
    }
    metaClass = metaClasses[className];
    def(className, spec, metaClass._MetaSpec.prototype, metaClass._Spec.prototype, opts);
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

  function SCObject() {
    this._raw = this;
  }
  SCObject.metaClass = new SCClass();
  sc.lang.klass.define("Object", null, { constructor: SCObject });

  function SCClass(MetaSpec) { // jshint ignore:line
    this._raw = this;
    this._name = "Class";
    this._Spec = SCClass;
    this._MetaSpec = MetaSpec || function() {};
    this._isMetaClass = false;
  }
  sc.lang.klass.define("Class", "Object", { constructor: SCClass });

  SCObject.metaClass._MetaSpec.prototype = classes.Class = new SCClass();

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

  // var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Object", {
    js: function() {
      return this._raw;
    },
    __tag__: function() {
      return 1;
    },
    __num__: function() {
      return 0;
    },
    __str__: function() {
      return this._class._name;
    },
    NotYetImplemented: [
      "$newCopyArgs",
      "dump",
      "post",
      "postln",
      "postc",
      "postcln",
      "postcs",
      "totalFree",
      "largestFreeBlock",
      "gcDumpGrey",
      "gcDumpSet",
      "gcInfo",
      "gcSanity",
      "canCallOS",
      "size",
      "indexedSize",
      "flatSize",
      "do",
      "generate",
      "respondsTo",
      "performMsg",
      "perform",
      "performList",
      "functionPerformList",
      "superPerform",
      "superPerformList",
      "tryPerform",
      "multiChannelPerform",
      "performWithEnvir",
      "performKeyValuePairs",
      "copy",
      "contentsCopy",
      "shallowCopy",
      "copyImmutable",
      "deepCopy",
      "dup",
      "poll",
      "value",
      "valueArray",
      "valueEnvir",
      "valueArrayEnvir",
      "equals",
      "compareObject",
      "instVarHash",
      "basicHash",
      "hash",
      "identityHash",
      "next",
      "reset",
      "first",
      "iter",
      "stop",
      "free",
      "clear",
      "removedFromScheduler",
      "isPlaying",
      "embedInStream",
      "cyc",
      "fin",
      "repeat",
      "loop",
      "asStream",
      "eventAt",
      "composeEvents",
      "finishEvent",
      "atLimit",
      "isRest",
      "threadPlayer",
      "threadPlayer_",
      "isNil",
      "notNil",
      "isNumber",
      "isInteger",
      "isFloat",
      "isSequenceableCollection",
      "isCollection",
      "isArray",
      "isString",
      "containsSeqColl",
      "isValidUGenInput",
      "isException",
      "isFunction",
      "matchItem",
      "trueAt",
      "falseAt",
      "pointsTo",
      "mutable",
      "frozen",
      "halt",
      "prHalt",
      "primitiveFailed",
      "reportError",
      "subclassResponsibility",
      "doesNotUnderstand",
      "shouldNotImplement",
      "outOfContextReturn",
      "immutableError",
      "deprecated",
      "mustBeBoolean",
      "notYetImplemented",
      "dumpBackTrace",
      "getBackTrace",
      "throw",
      "species",
      "asCollection",
      "asSymbol",
      "asString",
      "asCompileString",
      "cs",
      "printClassNameOn",
      "printOn",
      "storeOn",
      "storeParamsOn",
      "simplifyStoreArgs",
      "storeArgs",
      "storeModifiersOn",
      "as",
      "dereference",
      "reference",
      "asRef",
      "asArray",
      "asSequenceableCollection",
      "rank",
      "deepCollect",
      "deepDo",
      "slice",
      "shape",
      "unbubble",
      "bubble",
      "obtain",
      "instill",
      "addFunc",
      "removeFunc",
      "replaceFunc",
      "addFuncTo",
      "removeFuncFrom",
      "while",
      "switch",
      "yield",
      "alwaysYield",
      "yieldAndReset",
      "idle",
      "dependants",
      "changed",
      "addDependant",
      "removeDependant",
      "release",
      "releaseDependants",
      "update",
      "addUniqueMethod",
      "removeUniqueMethods",
      "removeUniqueMethod",
      "inspect",
      "inspectorClass",
      "inspector",
      "crash",
      "stackDepth",
      "dumpStack",
      "dumpDetailedBackTrace",
      "freeze",
      "asInt",
      "blend",
      "blendAt",
      "blendPut",
      "fuzzyEqual",
      "isUGen",
      "numChannels",
      "pair",
      "pairs",
      "awake",
      "beats_",
      "clock_",
      "performBinaryOpOnSomething",
      "performBinaryOpOnSimpleNumber",
      "performBinaryOpOnSignal",
      "performBinaryOpOnComplex",
      "performBinaryOpOnSeqColl",
      "performBinaryOpOnUGen",
      "writeDefFile",
      "protect",
      "isInputUGen",
      "isOutputUGen",
      "isControlUGen",
      "source",
      "asUGenInput",
      "asControlInput",
      "asAudioRateInput",
      "$prNew",
      "$prNewCopyArgs",
      "slotSize",
      "slotAt",
      "slotPut",
      "slotKey",
      "slotIndex",
      "slotsDo",
      "slotValuesDo",
      "getSlots",
      "setSlots",
      "instVarSize",
      "instVarAt",
      "instVarPut",
      "writeArchive",
      "$readArchive",
      "asArchive",
      "initFromArchive",
      "archiveAsCompileString",
      "archiveAsObject",
      "checkCanArchive",
      "writeTextArchive",
      "$readTextArchive",
      "asTextArchive",
      "getContainedObjects",
      "writeBinaryArchive",
      "$readBinaryArchive",
      "asBinaryArchive",
      "genNext",
      "genCurrent",
      "$classRedirect",
      "help",
    ]
  });

})(sc);

// src/sc/lang/classlib/Core/AbstractFunction.js
(function(sc) {

  sc.lang.klass.define("AbstractFunction", "Object", {
    NotYetImplemented: [
      "composeUnaryOp",
      "composeBinaryOp",
      "reverseComposeBinaryOp",
      "composeNAryOp",
      "performBinaryOpOnSimpleNumber",
      "performBinaryOpOnSignal",
      "performBinaryOpOnComplex",
      "performBinaryOpOnSeqColl",
      "neg",
      "reciprocal",
      "bitNot",
      "abs",
      "asFloat",
      "asInteger",
      "ceil",
      "floor",
      "frac",
      "sign",
      "squared",
      "cubed",
      "sqrt",
      "exp",
      "midicps",
      "cpsmidi",
      "midiratio",
      "ratiomidi",
      "ampdb",
      "dbamp",
      "octcps",
      "cpsoct",
      "log",
      "log2",
      "log10",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "rand",
      "rand2",
      "linrand",
      "bilinrand",
      "sum3rand",
      "distort",
      "softclip",
      "coin",
      "even",
      "odd",
      "rectWindow",
      "hanWindow",
      "welWindow",
      "triWindow",
      "scurve",
      "ramp",
      "isPositive",
      "isNegative",
      "isStrictlyPositive",
      "rho",
      "theta",
      "rotate",
      "dist",
      "div",
      "mod",
      "pow",
      "min",
      "max",
      "bitAnd",
      "bitOr",
      "bitXor",
      "bitHammingDistance",
      "lcm",
      "gcd",
      "round",
      "roundUp",
      "trunc",
      "atan2",
      "hypot",
      "hypotApx",
      "leftShift",
      "rightShift",
      "unsignedRightShift",
      "ring1",
      "ring2",
      "ring3",
      "ring4",
      "difsqr",
      "sumsqr",
      "sqrsum",
      "sqrdif",
      "absdif",
      "thresh",
      "amclip",
      "scaleneg",
      "clip2",
      "fold2",
      "wrap2",
      "excess",
      "firstArg",
      "rrand",
      "exprand",
      "real",
      "imag",
      "xor",
      "nand",
      "not",
      "ref",
      "clip",
      "wrap",
      "fold",
      "blend",
      "linlin",
      "linexp",
      "explin",
      "expexp",
      "lincurve",
      "curvelin",
      "bilin",
      "biexp",
      "moddif",
      "degreeToKey",
      "degrad",
      "raddeg",
      "applyTo",
      "sampled",
      "asUGenInput",
      "asAudioRateInput",
      "asControlInput",
      "isValidUGenInput",
    ]
  });

})(sc);

// src/sc/lang/classlib/Streams/Stream.js
(function(sc) {

  sc.lang.klass.define("Stream", "AbstractFunction", {
    NotYetImplemented: [
      "parent",
      "next",
      "iter",
      "value",
      "valueArray",
      "nextN",
      "all",
      "put",
      "putN",
      "putAll",
      "do",
      "subSample",
      "loop",
      "generate",
      "collect",
      "reject",
      "select",
      "dot",
      "interlace",
      "appendStream",
      "collate",
      "composeUnaryOp",
      "composeBinaryOp",
      "reverseComposeBinaryOp",
      "composeNAryOp",
      "embedInStream",
      "while",
      "asEventStreamPlayer",
      "play",
      "trace",
      "constrain",
      "repeat",
    ]
  });

  sc.lang.klass.define("PauseStream", "Stream", {
    NotYetImplemented: [
      "$new",
      "isPlaying",
      "play",
      "reset",
      "stop",
      "prStop",
      "removedFromScheduler",
      "streamError",
      "wasStopped",
      "canPause",
      "pause",
      "resume",
      "refresh",
      "start",
      "stream_",
      "next",
      "awake",
      "threadPlayer",
    ]
  });

  sc.lang.klass.define("Task", "PauseStream", {
    NotYetImplemented: [
      "$new",
      "storeArgs",
    ]
  });

})(sc);

// src/sc/lang/classlib/Math/Magnitude.js
(function(sc) {

  sc.lang.klass.define("Magnitude", "Object", {
    NotYetImplemented: [
      "hash",
      "exclusivelyBetween",
      "inclusivelyBetween",
      "min",
      "max",
      "clip",
    ]
  });

})(sc);

// src/sc/lang/classlib/Math/Number.js
(function(sc) {

  sc.lang.klass.define("Number", "Magnitude", {
    NotYetImplemented: [
      "isNumber",
      "mod",
      "div",
      "pow",
      "performBinaryOpOnSeqColl",
      "performBinaryOpOnPoint",
      "rho",
      "theta",
      "real",
      "imag",
      "complex",
      "polar",
      "for",
      "forBy",
      "forSeries",
    ]
  });

})(sc);

// src/sc/lang/classlib/Math/SimpleNumber.js
(function(sc) {

  sc.lang.klass.define("SimpleNumber", "Number", {
    NotYetImplemented: [
      "$new",
      "isValidUGenInput",
      "numChannels",
      "magnitude",
      "angle",
      "neg",
      "bitNot",
      "abs",
      "ceil",
      "floor",
      "frac",
      "sign",
      "squared",
      "cubed",
      "sqrt",
      "exp",
      "reciprocal",
      "midicps",
      "cpsmidi",
      "midiratio",
      "ratiomidi",
      "ampdb",
      "dbamp",
      "octcps",
      "cpsoct",
      "log",
      "log2",
      "log10",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "rand",
      "rand2",
      "linrand",
      "bilinrand",
      "sum3rand",
      "distort",
      "softclip",
      "coin",
      "isPositive",
      "isNegative",
      "isStrictlyPositive",
      "isNaN",
      "asBoolean",
      "booleanValue",
      "binaryValue",
      "rectWindow",
      "hanWindow",
      "welWindow",
      "triWindow",
      "scurve",
      "ramp",
      "mod",
      "div",
      "pow",
      "min",
      "max",
      "bitAnd",
      "bitOr",
      "bitXor",
      "bitHammingDistance",
      "bitTest",
      "lcm",
      "gcd",
      "round",
      "roundUp",
      "trunc",
      "atan2",
      "hypot",
      "hypotApx",
      "leftShift",
      "rightShift",
      "unsignedRightShift",
      "ring1",
      "ring2",
      "ring3",
      "ring4",
      "difsqr",
      "sumsqr",
      "sqrsum",
      "sqrdif",
      "absdif",
      "thresh",
      "amclip",
      "scaleneg",
      "clip2",
      "fold2",
      "wrap2",
      "excess",
      "firstArg",
      "rrand",
      "exprand",
      "equalWithPrecision",
      "hash",
      "asInteger",
      "asFloat",
      "asComplex",
      "asRect",
      "degrad",
      "raddeg",
      "performBinaryOpOnSimpleNumber",
      "performBinaryOpOnComplex",
      "performBinaryOpOnSignal",
      "nextPowerOfTwo",
      "nextPowerOf",
      "nextPowerOfThree",
      "previousPowerOf",
      "quantize",
      "linlin",
      "linexp",
      "explin",
      "expexp",
      "lincurve",
      "curvelin",
      "bilin",
      "biexp",
      "moddif",
      "lcurve",
      "gauss",
      "gaussCurve",
      "asPoint",
      "asWarp",
      "wait",
      "waitUntil",
      "sleep",
      "printOn",
      "storeOn",
      "rate",
      "asAudioRateInput",
      "madd",
      "lag",
      "lag2",
      "lag3",
      "lagud",
      "lag2ud",
      "lag3ud",
      "varlag",
      "slew",
      "writeInputSpec",
      "series",
      "seriesIter",
      "degreeToKey",
      "keyToDegree",
      "nearestInList",
      "nearestInScale",
      "partition",
      "nextTimeOnGrid",
      "playAndDelta",
      "asQuant",
      "asTimeString",
      "asFraction",
      "prSimpleNumberSeries",
      "asBufWithValues",
      "schedBundleArrayOnClock",
    ]
  });

})(sc);

// src/sc/lang/classlib/Math/Integer.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCInteger(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("SimpleNumber");
    this._class = $SC.Class("Integer");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Integer", "SimpleNumber", {
    constructor: SCInteger,
    $new: function() {
      throw new Error("Integer.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 2;
    },
    NotYetImplemented: [
      "isInteger",
      "hash",
      "clip",
      "wrap",
      "fold",
      "even",
      "odd",
      "xrand",
      "xrand2",
      "degreeToKey",
      "do",
      "generate",
      "collectAs",
      "collect",
      "reverseDo",
      "for",
      "forBy",
      "to",
      "asAscii",
      "asUnicode",
      "asDigit",
      "asBinaryDigits",
      "asDigits",
      "nextPowerOfTwo",
      "isPowerOfTwo",
      "leadingZeroes",
      "trailingZeroes",
      "numBits",
      "log2Ceil",
      "grayCode",
      "setBit",
      "nthPrime",
      "prevPrime",
      "nextPrime",
      "indexOfPrime",
      "isPrime",
      "exit",
      "asStringToBase",
      "asBinaryString",
      "asHexString",
      "asIPString",
      "archiveAsCompileString",
      "geom",
      "fib",
      "factors",
      "while",
      "pidRunning",
      "factorial",
      "isCaps",
      "isShift",
      "isCtrl",
      "isAlt",
      "isCmd",
      "isNumPad",
      "isHelp",
      "isFun",
    ]
  });

  $SC.Integer = function(value) {
    if (!global.isFinite(value)) {
      return $SC.Float(+value);
    }
    return new SCInteger(value|0);
  };

})(sc);

// src/sc/lang/classlib/Math/Float.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCFloat(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("SimpleNumber");
    this._class = $SC.Class("Float");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Float", "SimpleNumber", {
    constructor: SCFloat,
    $new: function() {
      throw new Error("Float.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 9;
    },
    NotYetImplemented: [
      "isFloat",
      "asFloat",
      "clip",
      "wrap",
      "fold",
      "coin",
      "xrand2",
      "as32Bits",
      "high32Bits",
      "low32Bits",
      "$from32Bits",
      "$from64Bits",
      "do",
      "reverseDo",
      "asStringPrec",
      "archiveAsCompileString",
      "storeOn",
      "switch",
    ]
  });

  $SC.Float = function(value) {
    return new SCFloat(+value);
  };

})(sc);

// src/sc/lang/classlib/Core/Thread.js
(function(sc) {

  sc.lang.klass.define("Thread", "Stream", {
    NotYetImplemented: [
      "$new",
      "init",
      "copy",
      "clock_",
      "seconds_",
      "beats_",
      "isPlaying",
      "threadPlayer",
      "findThreadPlayer",
      "randSeed_",
      "randData_",
      "randData",
      "failedPrimitiveName",
      "handleError",
      "next",
      "value",
      "valueArray",
      "$primitiveError",
      "$primitiveErrorString",
      "storeOn",
      "archiveAsCompileString",
      "checkCanArchive",
    ]
  });

  sc.lang.klass.define("Routine", "Thread", {
    NotYetImplemented: [
      "$run",
      "next",
      "value",
      "resume",
      "run",
      "valueArray",
      "reset",
      "stop",
      "prStop",
      "storeArgs",
      "storeOn",
      "awake",
      "prStart",
    ]
  });

})(sc);

// src/sc/lang/classlib/Core/Symbol.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCSymbol(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Object");
    this._class = $SC.Class("Symbol");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Symbol", "Object", {
    constructor: SCSymbol,
    $new: function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 3;
    },
    __str__: function() {
      return this._raw;
    },
    NotYetImplemented: [
      "asSymbol",
      "asInteger",
      "asFloat",
      "ascii",
      "asCompileString",
      "asClass",
      "asSetter",
      "asGetter",
      "asSpec",
      "asWarp",
      "asTuning",
      "asScale",
      "isSetter",
      "isClassName",
      "isMetaClassName",
      "isPrefix",
      "isPrimitiveName",
      "isPrimitive",
      "isMap",
      "isRest",
      "envirGet",
      "envirPut",
      "blend",
      "asBinOpString",
      "applyTo",
      "performBinaryOpOnSomething",
      "neg",
      "bitNot",
      "abs",
      "ceil",
      "floor",
      "frac",
      "sign",
      "sqrt",
      "exp",
      "midicps",
      "cpsmidi",
      "midiratio",
      "ratiomidi",
      "ampdb",
      "dbamp",
      "octcps",
      "cpsoct",
      "log",
      "log2",
      "log10",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "rand",
      "rand2",
      "linrand",
      "bilinrand",
      "sum3rand",
      "distort",
      "softclip",
      "coin",
      "even",
      "odd",
      "rectWindow",
      "hanWindow",
      "welWindow",
      "triWindow",
      "scurve",
      "ramp",
      "mod",
      "min",
      "max",
      "bitAnd",
      "bitOr",
      "bitXor",
      "bitHammingDistance",
      "hammingDistance",
      "lcm",
      "gcd",
      "round",
      "roundUp",
      "trunc",
      "atan2",
      "hypot",
      "hypotApx",
      "pow",
      "leftShift",
      "rightShift",
      "unsignedRightShift",
      "rrand",
      "exprand",
      "degreeToKey",
      "degrad",
      "raddeg",
      "doNumberOp",
      "doComplexOp",
      "doSignalOp",
      "doListOp",
      "primitiveIndex",
      "specialIndex",
      "printOn",
      "storeOn",
      "codegen_UGenCtorArg",
      "archiveAsCompileString",
      "kr",
      "ir",
      "tr",
      "ar",
      "matchOSCAddressPattern",
      "help",
    ]
  });

  $SC.Symbol = function(value) {
    return new SCSymbol(String(value));
  };

})(sc);

// src/sc/lang/classlib/Core/Ref.js
(function(sc) {

  sc.lang.klass.define("Ref", "Object", {
    NotYetImplemented: [
      "$new",
      "set",
      "get",
      "dereference",
      "asRef",
      "valueArray",
      "valueEnvir",
      "valueArrayEnvir",
      "next",
      "embedInStream",
      "asUGenInput",
      "printOn",
      "storeOn",
      "at",
      "put",
      "seq",
      "asControlInput",
      "asBufWithValues",
      "multichannelExpandRef",
    ]
  });

})(sc);

// src/sc/lang/classlib/Core/Nil.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var nilInstance = null;

  function SCNil() {
    if (nilInstance) {
      return nilInstance;
    }
    this.__initializeWith__("Object");
    this._class = $SC.Class("Nil");
    this._raw = null;
    nilInstance = this;
  }

  sc.lang.klass.define("Nil", "Object", {
    constructor: SCNil,
    $new: function() {
      throw new Error("Nil.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 5;
    },
    NotYetImplemented: [
      "isNil",
      "notNil",
      "asBoolean",
      "booleanValue",
      "push",
      "appendStream",
      "pop",
      "source",
      "source_",
      "rate",
      "numChannels",
      "isPlaying",
      "do",
      "reverseDo",
      "pairsDo",
      "collect",
      "select",
      "reject",
      "detect",
      "collectAs",
      "selectAs",
      "rejectAs",
      "dependants",
      "changed",
      "addDependant",
      "removeDependant",
      "release",
      "update",
      "transformEvent",
      "awake",
      "play",
      "nextTimeOnGrid",
      "asQuant",
      "swapThisGroup",
      "performMsg",
      "printOn",
      "storeOn",
      "matchItem",
      "add",
      "addAll",
      "asCollection",
      "remove",
      "set",
      "get",
      "addFunc",
      "removeFunc",
      "replaceFunc",
      "seconds_",
      "throw",
      "handleError",
      "archiveAsCompileString",
      "asSpec",
      "superclassesDo",
    ]
  });

  $SC.Nil = function() {
    return new SCNil();
  };

})(sc);

// src/sc/lang/classlib/Core/Kernel.js
(function(sc) {

  sc.lang.klass.refine("Class", {
    NotYetImplemented: [
      "superclass",
      "asClass",
      "initClass",
      "$initClassTree",
      "$allClasses",
      "findMethod",
      "findRespondingMethodFor",
      "findOverriddenMethod",
      "superclassesDo",
      "while",
      "dumpByteCodes",
      "dumpClassSubtree",
      "dumpInterface",
      "asString",
      "printOn",
      "storeOn",
      "archiveAsCompileString",
      "hasHelpFile",
      "helpFilePath",
      "help",
      "openHelpFile",
      "shallowCopy",
      "openCodeFile",
      "classVars",
      "inspectorClass",
      "findReferences",
      "$findAllReferences",
      "allSubclasses",
      "superclasses",
    ]
  });

})(sc);

// src/sc/lang/classlib/Core/Function.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function SCFunction(value) {
    this.__initializeWith__("AbstractFunction");
    this._class = $SC.Class("Function");
    this._raw = value;
  }

  sc.lang.klass.define("Function", "AbstractFunction", {
    constructor: SCFunction,
    $new: function() {
      throw new Error("Function.new is illegal, should use literal.");
    },
    NotYetImplemented: [
      "isFunction",
      "isClosed",
      "storeOn",
      "archiveAsCompileString",
      "archiveAsObject",
      "checkCanArchive",
      "shallowCopy",
      "choose",
      "update",
      "value",
      "valueArray",
      "valueEnvir",
      "valueArrayEnvir",
      "functionPerformList",
      "valueWithEnvir",
      "performWithEnvir",
      "performKeyValuePairs",
      "numArgs",
      "numVars",
      "varArgs",
      "loop",
      "block",
      "asRoutine",
      "dup",
      "sum",
      "defer",
      "thunk",
      "transformEvent",
      "set",
      "get",
      "fork",
      "forkIfNeeded",
      "awake",
      "cmdPeriod",
      "bench",
      "protect",
      "try",
      "prTry",
      "handleError",
      "case",
      "matchItem",
      "performDegreeToKey",
      "flop",
      "envirFlop",
      "makeFlopFunc",
      "inEnvir",
    ]
  });

  $SC.Function = function(value) {
    return new SCFunction(value); // jshint ignore: line
  };

})(sc);

// src/sc/lang/classlib/Core/Char.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCChar(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Magnitude");
    this._class = $SC.Class("Char");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Char", "Magnitude", {
    constructor: SCChar,
    $new: function() {
      throw new Error("Char.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 4;
    },
    __str__: function() {
      return this._raw;
    },
    NotYetImplemented: [
      "hash",
      "ascii",
      "digit",
      "asAscii",
      "asUnicode",
      "toUpper",
      "toLower",
      "isAlpha",
      "isAlphaNum",
      "isPrint",
      "isPunct",
      "isControl",
      "isSpace",
      "isVowel",
      "isDecDigit",
      "isUpper",
      "isLower",
      "isFileSafe",
      "isPathSeparator",
      "$bullet",
      "printOn",
      "storeOn",
      "archiveAsCompileString",
    ]
  });

  $SC.Char = function(value) {
    return new SCChar(String(value).charAt(0));
  };

})(sc);

// src/sc/lang/classlib/Core/Boolean.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var trueInstance = null;
  var falseInstance = null;

  function SCTrue() {
    if (trueInstance) {
      return trueInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("True");
    this._raw = true;
    trueInstance = this;
  }

  function SCFalse() {
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
    },
    NotYetImplemented: [
      "xor",
      "if",
      "not",
      "and",
      "or",
      "nand",
      "asInteger",
      "binaryValue",
      "asBoolean",
      "booleanValue",
      "keywordWarnings",
      "trace",
      "printOn",
      "storeOn",
      "archiveAsCompileString",
      "while",
    ]
  });

  sc.lang.klass.define("True", "Boolean", {
    constructor: SCTrue,
    $new: function() {
      throw new Error("True.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 7;
    },
    NotYetImplemented: [
      "if",
      "not",
      "and",
      "or",
      "nand",
      "asInteger",
      "binaryValue",
    ]
  });

  sc.lang.klass.define("False", "Boolean", {
    constructor: SCFalse,
    $new: function() {
      throw new Error("False.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 6;
    },
    NotYetImplemented: [
      "if",
      "not",
      "and",
      "or",
      "nand",
      "asInteger",
      "binaryValue",
    ]
  });

  $SC.Boolean = function(value) {
    return value ? $SC.True() : $SC.False();
  };

  $SC.True = function() {
    return new SCTrue();
  };

  $SC.False = function() {
    return new SCFalse();
  };

})(sc);

// src/sc/lang/classlib/Collections/Collection.js
(function(sc) {

  sc.lang.klass.define("Collection", "Object", {
    NotYetImplemented: [
      "$newFrom",
      "$with",
      "$fill",
      "$fill2D",
      "$fill3D",
      "$fillND",
      "hash",
      "species",
      "do",
      "iter",
      "size",
      "flatSize",
      "isEmpty",
      "notEmpty",
      "asCollection",
      "isCollection",
      "add",
      "addAll",
      "remove",
      "removeAll",
      "removeEvery",
      "removeAllSuchThat",
      "atAll",
      "putEach",
      "includes",
      "includesEqual",
      "includesAny",
      "includesAll",
      "matchItem",
      "collect",
      "select",
      "reject",
      "collectAs",
      "selectAs",
      "rejectAs",
      "detect",
      "detectIndex",
      "doMsg",
      "collectMsg",
      "selectMsg",
      "rejectMsg",
      "detectMsg",
      "detectIndexMsg",
      "lastForWhich",
      "lastIndexForWhich",
      "inject",
      "injectr",
      "count",
      "occurrencesOf",
      "any",
      "every",
      "sum",
      "mean",
      "product",
      "sumabs",
      "maxItem",
      "minItem",
      "maxIndex",
      "minIndex",
      "maxValue",
      "minValue",
      "maxSizeAtDepth",
      "maxDepth",
      "deepCollect",
      "deepDo",
      "invert",
      "sect",
      "union",
      "difference",
      "symmetricDifference",
      "isSubsetOf",
      "asArray",
      "asBag",
      "asList",
      "asSet",
      "asSortedList",
      "powerset",
      "flopDict",
      "histo",
      "printAll",
      "printcsAll",
      "dumpAll",
      "printOn",
      "storeOn",
      "storeItemsOn",
      "printItemsOn",
      "writeDef",
      "writeInputSpec",
      "case",
      "makeEnvirValPairs",
    ]
  });

})(sc);

// src/sc/lang/classlib/Collections/SequenceableCollection.js
(function(sc) {

  sc.lang.klass.define("SequenceableCollection", "Collection", {
    NotYetImplemented: [
      "$series",
      "$geom",
      "$fib",
      "$rand",
      "$exprand",
      "$rand2",
      "$linrand",
      "asSequenceableCollection",
      "choose",
      "wchoose",
      "hash",
      "copyRange",
      "keep",
      "drop",
      "copyToEnd",
      "copyFromStart",
      "indexOf",
      "indexOfEqual",
      "indicesOfEqual",
      "find",
      "findAll",
      "indexOfGreaterThan",
      "indexIn",
      "indexInBetween",
      "isSeries",
      "resamp0",
      "resamp1",
      "remove",
      "removing",
      "take",
      "lastIndex",
      "middleIndex",
      "first",
      "last",
      "middle",
      "top",
      "putFirst",
      "putLast",
      "obtain",
      "instill",
      "pairsDo",
      "keysValuesDo",
      "doAdjacentPairs",
      "separate",
      "delimit",
      "clump",
      "clumps",
      "curdle",
      "flatten",
      "flat",
      "prFlat",
      "flatIf",
      "flop",
      "flopWith",
      "flopTogether",
      "flopDeep",
      "wrapAtDepth",
      "unlace",
      "integrate",
      "differentiate",
      "convertDigits",
      "hammingDistance",
      "degreeToKey",
      "keyToDegree",
      "nearestInScale",
      "nearestInList",
      "transposeKey",
      "mode",
      "performDegreeToKey",
      "performKeyToDegree",
      "performNearestInList",
      "performNearestInScale",
      "convertRhythm",
      "sumRhythmDivisions",
      "convertOneRhythm",
      "isSequenceableCollection",
      "containsSeqColl",
      "neg",
      "bitNot",
      "abs",
      "ceil",
      "floor",
      "frac",
      "sign",
      "squared",
      "cubed",
      "sqrt",
      "exp",
      "reciprocal",
      "midicps",
      "cpsmidi",
      "midiratio",
      "ratiomidi",
      "ampdb",
      "dbamp",
      "octcps",
      "cpsoct",
      "log",
      "log2",
      "log10",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "rand",
      "rand2",
      "linrand",
      "bilinrand",
      "sum3rand",
      "distort",
      "softclip",
      "coin",
      "even",
      "odd",
      "isPositive",
      "isNegative",
      "isStrictlyPositive",
      "rectWindow",
      "hanWindow",
      "welWindow",
      "triWindow",
      "scurve",
      "ramp",
      "asFloat",
      "asInteger",
      "nthPrime",
      "prevPrime",
      "nextPrime",
      "indexOfPrime",
      "real",
      "imag",
      "magnitude",
      "magnitudeApx",
      "phase",
      "angle",
      "rho",
      "theta",
      "degrad",
      "raddeg",
      "div",
      "mod",
      "pow",
      "min",
      "max",
      "bitAnd",
      "bitOr",
      "bitXor",
      "bitHammingDistance",
      "lcm",
      "gcd",
      "round",
      "roundUp",
      "trunc",
      "atan2",
      "hypot",
      "hypotApx",
      "leftShift",
      "rightShift",
      "unsignedRightShift",
      "ring1",
      "ring2",
      "ring3",
      "ring4",
      "difsqr",
      "sumsqr",
      "sqrsum",
      "sqrdif",
      "absdif",
      "thresh",
      "amclip",
      "scaleneg",
      "clip2",
      "fold2",
      "wrap2",
      "excess",
      "firstArg",
      "rrand",
      "exprand",
      "performUnaryOp",
      "performBinaryOp",
      "performBinaryOpOnSeqColl",
      "performBinaryOpOnSimpleNumber",
      "performBinaryOpOnComplex",
      "asFraction",
      "asPoint",
      "asRect",
      "ascii",
      "rate",
      "multiChannelPerform",
      "multichannelExpandRef",
      "clip",
      "wrap",
      "fold",
      "linlin",
      "linexp",
      "explin",
      "expexp",
      "lincurve",
      "curvelin",
      "bilin",
      "biexp",
      "moddif",
      "range",
      "exprange",
      "curverange",
      "unipolar",
      "bipolar",
      "lag",
      "lag2",
      "lag3",
      "lagud",
      "lag2ud",
      "lag3ud",
      "varlag",
      "slew",
      "blend",
      "checkBadValues",
      "prune",
      "minNyquist",
      "sort",
      "sortBy",
      "sortMap",
      "sortedMedian",
      "median",
      "quickSort",
      "order",
      "swap",
      "quickSortRange",
      "mergeSort",
      "mergeSortTemp",
      "mergeTemp",
      "insertionSort",
      "insertionSortRange",
      "hoareMedian",
      "hoareFind",
      "hoarePartition",
      "$streamContents",
      "$streamContentsLimit",
      "wrapAt",
      "wrapPut",
      "reduce",
      "join",
      "nextTimeOnGrid",
      "asQuant",
      "asUGenInput",
      "schedBundleArrayOnClock",
    ]
  });

})(sc);

// src/sc/lang/classlib/Collections/ArrayedCollection.js
(function(sc) {

  sc.lang.klass.define("ArrayedCollection", "SequenceableCollection", {
    NotYetImplemented: [
      "$newClear",
      "indexedSize",
      "size",
      "maxSize",
      "swap",
      "at",
      "clipAt",
      "wrapAt",
      "foldAt",
      "put",
      "clipPut",
      "wrapPut",
      "foldPut",
      "removeAt",
      "takeAt",
      "indexOf",
      "indexOfGreaterThan",
      "takeThese",
      "replace",
      "slotSize",
      "slotAt",
      "slotPut",
      "slotKey",
      "slotIndex",
      "getSlots",
      "setSlots",
      "atModify",
      "atInc",
      "atDec",
      "isArray",
      "asArray",
      "copyRange",
      "copySeries",
      "putSeries",
      "add",
      "addAll",
      "putEach",
      "extend",
      "insert",
      "move",
      "addFirst",
      "addIfNotNil",
      "pop",
      "overWrite",
      "grow",
      "growClear",
      "seriesFill",
      "fill",
      "do",
      "reverseDo",
      "reverse",
      "windex",
      "normalizeSum",
      "normalize",
      "asciiPlot",
      "perfectShuffle",
      "performInPlace",
      "clipExtend",
      "rank",
      "shape",
      "reshape",
      "reshapeLike",
      "deepCollect",
      "deepDo",
      "unbubble",
      "bubble",
      "slice",
      "$iota",
      "asRandomTable",
      "tableRand",
      "msgSize",
      "bundleSize",
      "clumpBundles",
      "prBundleSize",
      "includes",
    ]
  });

  sc.lang.klass.define("RawArray", "ArrayedCollection", {
    NotYetImplemented: [
      "archiveAsCompileString",
      "archiveAsObject",
      "rate",
      "readFromStream",
      "powerset",
    ]
  });

})(sc);

// src/sc/lang/classlib/Collections/String.js
(function(sc) {

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCString(value) {
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
    constructor: SCString,
    $new: function() {
      throw new Error("String.new is illegal, should use literal.");
    },
    __tag__: function() {
      return 10;
    },
    __str__: function() {
      return this._raw;
    },
    NotYetImplemented: [
      // "$initClass",
      "$doUnixCmdAction",
      "prUnixCmd",
      "unixCmd",
      "unixCmdGetStdOut",
      "asSymbol",
      "asInteger",
      "asFloat",
      "ascii",
      "stripRTF",
      "stripHTML",
      "$scDir",
      "compare",
      "hash",
      "performBinaryOpOnSimpleNumber",
      "performBinaryOpOnComplex",
      "multiChannelPerform",
      "isString",
      "asString",
      "asCompileString",
      "species",
      "postln",
      "post",
      "postcln",
      "postc",
      "postf",
      "format",
      "prFormat",
      "matchRegexp",
      "fformat",
      "die",
      "error",
      "warn",
      "inform",
      "catArgs",
      "scatArgs",
      "ccatArgs",
      "catList",
      "scatList",
      "ccatList",
      "split",
      "containsStringAt",
      "icontainsStringAt",
      "contains",
      "containsi",
      "findRegexp",
      "findAllRegexp",
      "find",
      "findBackwards",
      "endsWith",
      "beginsWith",
      "findAll",
      "replace",
      "escapeChar",
      "shellQuote",
      "quote",
      "tr",
      "insert",
      "wrapExtend",
      "zeroPad",
      "padLeft",
      "padRight",
      "underlined",
      "scramble",
      "rotate",
      "compile",
      "interpret",
      "interpretPrint",
      "$readNew",
      "prCat",
      "printOn",
      "storeOn",
      "inspectorClass",
      "standardizePath",
      "realPath",
      "withTrailingSlash",
      "withoutTrailingSlash",
      "absolutePath",
      "pathMatch",
      "load",
      "loadPaths",
      "loadRelative",
      "resolveRelative",
      "include",
      "exclude",
      "basename",
      "dirname",
      "splitext",
      "asRelativePath",
      "asAbsolutePath",
      "systemCmd",
      "gethostbyname",
      "getenv",
      "setenv",
      "unsetenv",
      "codegen_UGenCtorArg",
      "ugenCodeString",
      "asSecs",
      "speak",
      "toLower",
      "toUpper",
      "mkdir",
      "parseYAML",
      "parseYAMLFile",
    ]
  });

  $SC.String = function(value) {
    return new SCString(String(value)); // jshint ignore: line
  };

})(sc);

// src/sc/lang/classlib/Collections/Set.js
(function(sc) {

  sc.lang.klass.define("Set", "Collection", {
    NotYetImplemented: [
      // "$new",
      "species",
      "copy",
      "do",
      "clear",
      "makeEmpty",
      "includes",
      "findMatch",
      "add",
      "remove",
      "choose",
      "pop",
      "powerset",
      "unify",
      "sect",
      "union",
      "difference",
      "symmetricDifference",
      "isSubsetOf",
      "initSet",
      "putCheck",
      "fullCheck",
      "grow",
      "noCheckAdd",
      "scanFor",
      "fixCollisionsFrom",
      "keyAt",
      "asSet",
    ]
  });

})(sc);

// src/sc/lang/classlib/Collections/Dictionary.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function SCDictionary(value) {
    this.__initializeWith__("Set");
    this._class = $SC.Class("Dictionary");
    this._raw = value || {};
  }

  sc.lang.klass.define("Dictionary", "Set", {
    constructor: SCDictionary,
    NotYetImplemented: [
      // "$new",
      "$newFrom",
      "at",
      "atFail",
      "matchAt",
      "trueAt",
      "add",
      "put",
      "putAll",
      "putPairs",
      "getPairs",
      "associationAt",
      "associationAtFail",
      "keys",
      "values",
      "includes",
      "includesKey",
      "removeAt",
      "removeAtFail",
      "remove",
      "removeFail",
      "keysValuesDo",
      "keysValuesChange",
      "do",
      "keysDo",
      "associationsDo",
      "pairsDo",
      "collect",
      "select",
      "reject",
      "invert",
      "merge",
      "blend",
      "findKeyForValue",
      "sortedKeysValuesDo",
      "choose",
      "order",
      "powerset",
      "transformEvent",
      "embedInStream",
      "asSortedArray",
      "asKeyValuePairs",
      "keysValuesArrayDo",
      "grow",
      "fixCollisionsFrom",
      "scanFor",
      "storeItemsOn",
      "printItemsOn",
    ]
  });

  sc.lang.klass.define("IdentityDictionary", "Dictionary", {
    NotYetImplemented: [
      "$new",
      "at",
      "put",
      "putGet",
      "includesKey",
      "findKeyForValue",
      "scanFor",
      "freezeAsParent",
      "insertParent",
      "storeItemsOn",
      "doesNotUnderstand",
      "nextTimeOnGrid",
      "asQuant",
      "timingOffset",
    ]
  });

  $SC.Dictionary = function(value) {
    return new SCDictionary(value);
  };

})(sc);

// src/sc/lang/classlib/Collections/Environment.js
(function(sc) {

  sc.lang.klass.define("Environment", "IdentityDictionary", {
    NotYetImplemented: [
      "$make",
      "$use",
      "make",
      "use",
      "eventAt",
      "composeEvents",
      "$pop",
      "$push",
      "pop",
      "push",
      "linkDoc",
      "unlinkDoc",
    ]
  });

})(sc);

// src/sc/lang/classlib/Collections/Event.js
(function(sc) {

  sc.lang.klass.define("Event", "Environment", {
    NotYetImplemented: [
      "$new",
      "$default",
      "$silent",
      "$addEventType",
      "next",
      "delta",
      "play",
      "isRest",
      "isPlaying_",
      "isRunning_",
      "playAndDelta",
      "synchWithQuant",
      "asControlInput",
      "asUGenInput",
      "printOn",
      "storeOn",
      "$initClass",
      "$makeDefaultSynthDef",
      "$makeParentEvents",
    ]
  });

})(sc);

// src/sc/lang/classlib/Collections/Array.js
(function(sc) {

  var $SC = sc.lang.$SC;

  function SCArray(value) {
    this.__initializeWith__("ArrayedCollection");
    this._class = $SC.Class("Array");
    this._raw = value || [];
  }

  sc.lang.klass.define("Array", "ArrayedCollection", {
    constructor: SCArray,
    NotYetImplemented: [
      "$with",
      "reverse",
      "scramble",
      "mirror",
      "mirror1",
      "mirror2",
      "stutter",
      "rotate",
      "pyramid",
      "pyramidg",
      "sputter",
      "while",
      "lace",
      "permute",
      "allTuples",
      "wrapExtend",
      "foldExtend",
      "clipExtend",
      "slide",
      "containsSeqColl",
      "unlace",
      "prUnlace",
      "interlace",
      "deinterlace",
      "flop",
      "multiChannelExpand",
      "envirPairs",
      "shift",
      "powerset",
      "source",
      "asUGenInput",
      "asControlInput",
      "isValidUGenInput",
      "numChannels",
      "poll",
      "dpoll",
      "envAt",
      "$newClear2D",
      "$new2D",
      "at2D",
      "put2D",
      "fill2D",
      "atIdentityHash",
      "atIdentityHashInPairs",
      "asSpec",
      "fork",
      "madd",
      "asRawOSC",
      "printOn",
      "storeOn",
      "prUnarchive",
    ]
  });

  $SC.Array = function(value) {
    return new SCArray(value);
  };

})(sc);

})(this.self||global);

(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCSymbol() {
    this.__initializeWith__("Object");
    this._class = $SC.Class("Symbol");
    this._raw = "";
  }

  sc.lang.klass.define("Symbol", "Object", {
    constructor: SCSymbol,
    $new: function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_SYM;
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
    var instance;

    if (!instances.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._raw = value;
      instances[value] = instance;
    }

    return instances[value];
  };

})(sc);

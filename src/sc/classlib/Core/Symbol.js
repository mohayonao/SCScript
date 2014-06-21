SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.refine("Symbol", function(spec, utils) {
    var $nil = utils.$nil;

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
      return $.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this._);
      return $.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      return this.asString().ascii();
    };

    // TODO: implements asCompileString

    spec.asClass = function() {
      if (klass.exists(this._)) {
        return klass.get(this._);
      }
      return $nil;
    };

    spec.asSetter = function() {
      var matches = /^([a-z]\w{0,255}?)_?$/.exec(this._);
      if (matches) {
        return $.Symbol(matches[1] + "_");
      }
      throw new Error("Cannot convert class names or primitive names to setters.");
    };

    spec.asGetter = function() {
      return $.Symbol(this._.replace(/_$/, ""));
    };

    spec.asSpec = function() {
      return $("Spec").specs().at(this);
    };

    spec.asWarp = function($spec) {
      return $("Warp").warps().at(this).new($spec);
    };

    spec.asTuning = function() {
      return $("Tuning").at(this);
    };

    spec.asScale = function() {
      return $("Scale").at(this);
    };

    spec.isSetter = function() {
      return $.Boolean(/^[a-z]\w*_$/.test(this._));
    };

    spec.isClassName = function() {
      return $.Boolean(/^[A-Z]\w*$/.test(this._));
    };

    spec.isMetaClassName = function() {
      return $.Boolean(/^Meta_[A-Z]\w*$/.test(this._));
    };

    spec.isPrefix = fn(function($other) {
      if ($other.__tag === sc.TAG_SYM) {
        return $.Boolean(this._.indexOf($other._) === 0);
      }
      return this;
    }, "other");

    spec.isPrimitiveName = function() {
      return $.Boolean(this._.charAt(0) === "_");
    };

    spec.isPrimitive = utils.alwaysReturn$false;

    spec.isMap = function() {
      return $.Boolean(/^[ac]\d/.test(this._));
    };

    spec.isRest = function() {
      return $.Boolean(!/^[ac]\d/.test(this._));
    };

    spec.envirGet = function() {
      return $.Environment(this._);
    };

    spec.envirPut = function($aValue) {
      $aValue = $aValue || /* istanbul ignore next */ $nil;
      return $.Environment(this._, $aValue);
    };

    spec.blend = utils.nop;

    spec["++"] = fn(function($aString) {
      return $.String(this._ + $aString.__str__(), true);
    }, "aString");

    spec.asBinOpString = function() {
      if (/^[a-z]\w*$/.exec(this._)) {
        return $.String(this._ + ":", true);
      }
      return this;
    };

    spec.applyTo = fn(function($firstArg, $$args) {
      return $firstArg.perform.apply($firstArg, [ this ].concat($$args._));
    }, "first; *args");

    spec.performBinaryOpOnSomething = utils.nop;
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

    spec["<"] = function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ < $aNumber._);
    };

    spec[">"] = function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ > $aNumber._);
    };

    spec["<="] = function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ <= $aNumber._);
    };

    spec[">="] = function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ >= $aNumber._);
    };

    spec.degreeToKey = utils.nop;
    spec.degrad = utils.nop;
    spec.raddeg = utils.nop;
    spec.doNumberOp = utils.nop;
    spec.doComplexOp = utils.nop;
    spec.doSignalOp = utils.nop;

    spec.doListOp = fn(function($aSelector, $aList) {
      var $this = this;
      $aList.do($.Func(function($item) {
        return $item.perform($aSelector, $this);
      }));
      return this;
    }, "aSelector; aList");

    // TODO: Implements primitiveIndex
    // TODO: Implements specialIndex
    // TODO: Implements printOn
    // TODO: Implements storeOn
    // TODO: Implements codegen_UGenCtorArg

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    // TODO: Implements kr
    // TODO: Implements ir
    // TODO: Implements tr
    // TODO: Implements ar
    // TODO: Implements matchOSCAddressPattern
    // TODO: Implements help

    spec.asString = function() {
      return $.String(this._);
    };

    spec.shallowCopy = utils.nop;

    spec.performBinaryOpOnSimpleNumber = utils.nop;
  });
});

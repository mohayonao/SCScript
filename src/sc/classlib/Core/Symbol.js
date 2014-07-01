SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Symbol", function(builder) {
    builder.addMethod("__sym__", function() {
      return this._;
    });

    builder.addMethod("__str__", function() {
      return this._;
    });

    builder.addClassMethod("new", function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    });

    builder.addMethod("asSymbol");

    builder.addMethod("asInteger", function() {
      var m = /^[-+]?\d+/.exec(this._);
      return $.Integer(m ? m[0]|0 : 0);
    });

    builder.addMethod("asFloat", function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this._);
      return $.Float(m ? +m[0] : 0);
    });

    builder.addMethod("ascii", function() {
      return this.asString().ascii();
    });

    // TODO: implements asCompileString

    builder.addMethod("asClass", function() {
      if (sc.lang.klass.exists(this._)) {
        return sc.lang.klass.get(this._);
      }
      return $nil;
    });

    builder.addMethod("asSetter", function() {
      var matches = /^([a-z]\w{0,255}?)_?$/.exec(this._);
      if (matches) {
        return $.Symbol(matches[1] + "_");
      }
      throw new Error("Cannot convert class names or primitive names to setters.");
    });

    builder.addMethod("asGetter", function() {
      return $.Symbol(this._.replace(/_$/, ""));
    });

    builder.addMethod("asSpec", function() {
      return $("Spec").specs().at(this);
    });

    builder.addMethod("asWarp", function($spec) {
      return $("Warp").warps().at(this).new($spec);
    });

    builder.addMethod("asTuning", function() {
      return $("Tuning").at(this);
    });

    builder.addMethod("asScale", function() {
      return $("Scale").at(this);
    });

    builder.addMethod("isSetter", function() {
      return $.Boolean(/^[a-z]\w*_$/.test(this._));
    });

    builder.addMethod("isClassName", function() {
      return $.Boolean(/^[A-Z]\w*$/.test(this._));
    });

    builder.addMethod("isMetaClassName", function() {
      return $.Boolean(/^Meta_[A-Z]\w*$/.test(this._));
    });

    builder.addMethod("isPrefix", {
      args: "other"
    }, function($other) {
      if ($other.__tag === sc.TAG_SYM) {
        return $.Boolean(this._.indexOf($other._) === 0);
      }
      return this;
    });

    builder.addMethod("isPrimitiveName", function() {
      return $.Boolean(this._.charAt(0) === "_");
    });

    builder.addMethod("isPrimitive", sc.FALSE);

    builder.addMethod("isMap", function() {
      return $.Boolean(/^[ac]\d/.test(this._));
    });

    builder.addMethod("isRest", function() {
      return $.Boolean(!/^[ac]\d/.test(this._));
    });

    builder.addMethod("envirGet", function() {
      return $.Environment(this._);
    });

    builder.addMethod("envirPut", function($aValue) {
      $aValue = $aValue || /* istanbul ignore next */ $nil;
      return $.Environment(this._, $aValue);
    });

    builder.addMethod("blend");

    builder.addMethod("++", {
      args: "aString"
    }, function($aString) {
      return $.String(this._ + $aString.__str__(), true);
    });

    builder.addMethod("asBinOpString", function() {
      if (/^[a-z]\w*$/.exec(this._)) {
        return $.String(this._ + ":", true);
      }
      return this;
    });

    builder.addMethod("applyTo", {
      args: "firstArg; *args"
    }, function($firstArg, $$args) {
      return $firstArg.perform.apply($firstArg, [ this ].concat($$args._));
    });

    builder.addMethod("performBinaryOpOnSomething");
    builder.addMethod("neg");
    builder.addMethod("bitNot");
    builder.addMethod("abs");
    builder.addMethod("ceil");
    builder.addMethod("floor");
    builder.addMethod("frac");
    builder.addMethod("sign");
    builder.addMethod("sqrt");
    builder.addMethod("exp");
    builder.addMethod("midicps");
    builder.addMethod("cpsmidi");
    builder.addMethod("midiratio");
    builder.addMethod("ratiomidi");
    builder.addMethod("ampdb");
    builder.addMethod("dbamp");
    builder.addMethod("octcps");
    builder.addMethod("cpsoct");
    builder.addMethod("log");
    builder.addMethod("log2");
    builder.addMethod("log10");
    builder.addMethod("sin");
    builder.addMethod("cos");
    builder.addMethod("tan");
    builder.addMethod("asin");
    builder.addMethod("acos");
    builder.addMethod("atan");
    builder.addMethod("sinh");
    builder.addMethod("cosh");
    builder.addMethod("tanh");
    builder.addMethod("rand");
    builder.addMethod("rand2");
    builder.addMethod("linrand");
    builder.addMethod("bilinrand");
    builder.addMethod("sum3rand");
    builder.addMethod("distort");
    builder.addMethod("softclip");
    builder.addMethod("coin");
    builder.addMethod("even");
    builder.addMethod("odd");
    builder.addMethod("rectWindow");
    builder.addMethod("hanWindow");
    builder.addMethod("welWindow");
    builder.addMethod("triWindow");
    builder.addMethod("scurve");
    builder.addMethod("ramp");
    builder.addMethod("+");
    builder.addMethod("-");
    builder.addMethod("*");
    builder.addMethod("/");
    builder.addMethod("mod");
    builder.addMethod("min");
    builder.addMethod("max");
    builder.addMethod("bitAnd");
    builder.addMethod("bitOr");
    builder.addMethod("bitXor");
    builder.addMethod("bitHammingDistance");
    // TODO: Implements hammingDistance
    builder.addMethod("lcm");
    builder.addMethod("gcd");
    builder.addMethod("round");
    builder.addMethod("roundUp");
    builder.addMethod("trunc");
    builder.addMethod("atan2");
    builder.addMethod("hypot");
    builder.addMethod("hypotApx");
    builder.addMethod("pow");
    builder.addMethod("leftShift");
    builder.addMethod("rightShift");
    builder.addMethod("unsignedRightShift");
    builder.addMethod("rrand");
    builder.addMethod("exprand");

    builder.addMethod("<", function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ < $aNumber._);
    });

    builder.addMethod(">", function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ > $aNumber._);
    });

    builder.addMethod("<=", function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ <= $aNumber._);
    });

    builder.addMethod(">=", function($aNumber) {
      return $.Boolean($aNumber.__tag === sc.TAG_SYM && this._ >= $aNumber._);
    });

    builder.addMethod("degreeToKey");
    builder.addMethod("degrad");
    builder.addMethod("raddeg");
    builder.addMethod("doNumberOp");
    builder.addMethod("doComplexOp");
    builder.addMethod("doSignalOp");

    builder.addMethod("doListOp", {
      args: "aSelector; aList"
    }, function($aSelector, $aList) {
      var $this = this;
      $aList.do($.Func(function($item) {
        return $item.perform($aSelector, $this);
      }));
      return this;
    });

    // TODO: Implements primitiveIndex
    // TODO: Implements specialIndex
    // TODO: Implements printOn
    // TODO: Implements storeOn
    // TODO: Implements codegen_UGenCtorArg

    builder.addMethod("archiveAsCompileString", sc.TRUE);

    // TODO: Implements kr
    // TODO: Implements ir
    // TODO: Implements tr
    // TODO: Implements ar
    // TODO: Implements matchOSCAddressPattern
    // TODO: Implements help

    builder.addMethod("asString", function() {
      return $.String(this._);
    });

    builder.addMethod("shallowCopy");

    builder.addMethod("performBinaryOpOnSimpleNumber");
  });
});

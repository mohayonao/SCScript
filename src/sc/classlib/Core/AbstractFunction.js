SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $SC   = sc.lang.$SC;
  var fn    = sc.lang.fn;
  var utils = sc.lang.klass.utils;
  var $nil  = utils.$nil;

  sc.lang.klass.refine("AbstractFunction", function(spec, utils) {
    spec.composeUnaryOp = function($aSelector) {
      return $SC("UnaryOpFunction").new($aSelector, this);
    };

    spec.composeBinaryOp = function($aSelector, $something, $adverb) {
      return $SC("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    };

    spec.reverseComposeBinaryOp = function($aSelector, $something, $adverb) {
      return $SC("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    };

    spec.composeNAryOp = function($aSelector, $anArgList) {
      return $SC("NAryOpFunction").new($aSelector, this, $anArgList);
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

    spec.blend = fn(function($that, $blendFrac) {
      return this.composeNAryOp(
        $SC.Symbol("blend"), $SC.Array([ $that, $blendFrac ])
      );
    }, "that; blendFrac=0.5");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("linlin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("linexp"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("explin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("expexp"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("lincurve"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("curvelin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("bilin"), $SC.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("biexp"), $SC.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($function, $mod) {
      return this.composeNAryOp(
        $SC.Symbol("moddif"), $SC.Array([ $function, $mod ])
      );
    }, "function; mod");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return this.composeNAryOp(
        $SC.Symbol("degreeToKey"), $SC.Array([ $scale, $stepsPerOctave ])
      );
    }, "scale; stepsPerOctave=12");

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
        return $SC("K2A").ar($result);
      }

      return $result;
    };

    spec.asControlInput = function() {
      return this.value();
    };

    spec.isValidUGenInput = utils.alwaysReturn$true;
  });

  function SCUnaryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = args[0] || /* istanbul ignore next */ $nil;
    this.$a        = args[1] || /* istanbul ignore next */ $nil;
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
    this.$selector = args[0] || /* istanbul ignore next */ $nil;
    this.$a        = args[1] || /* istanbul ignore next */ $nil;
    this.$b        = args[2] || /* istanbul ignore next */ $nil;
    this.$adverb   = args[3] || /* istanbul ignore next */ $nil;
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
    this.$selector = args[0] || /* istanbul ignore next */ $nil;
    this.$a        = args[1] || /* istanbul ignore next */ $nil;
    this.$arglist  = args[2] || /* istanbul ignore next */ $nil;
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
    this.$array   = args[0] || /* istanbul ignore next */ $nil;
    this._flopped = false;
  }

  sc.lang.klass.define(SCFunctionList, "FunctionList : AbstractFunction", function(spec, utils) {
    var $int_0 = utils.$int_0;

    spec.array = function() {
      return this.$array;
    };

    spec.array_ = fn(function($value) {
      this.$array = $value;
      return this;
    }, "value");

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
        return this.$array.at($int_0);
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

});

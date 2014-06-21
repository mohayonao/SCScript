SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.refine("AbstractFunction", function(spec, utils) {
    spec.composeUnaryOp = function($aSelector) {
      return $("UnaryOpFunction").new($aSelector, this);
    };

    spec.composeBinaryOp = function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    };

    spec.reverseComposeBinaryOp = function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    };

    spec.composeNAryOp = function($aSelector, $anArgList) {
      return $("NAryOpFunction").new($aSelector, this, $anArgList);
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
      return this.composeUnaryOp($.Symbol("neg"));
    };

    spec.reciprocal = function() {
      return this.composeUnaryOp($.Symbol("reciprocal"));
    };

    spec.bitNot = function() {
      return this.composeUnaryOp($.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.composeUnaryOp($.Symbol("abs"));
    };

    spec.asFloat = function() {
      return this.composeUnaryOp($.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.composeUnaryOp($.Symbol("asInteger"));
    };

    spec.ceil = function() {
      return this.composeUnaryOp($.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.composeUnaryOp($.Symbol("floor"));
    };

    spec.frac = function() {
      return this.composeUnaryOp($.Symbol("frac"));
    };

    spec.sign = function() {
      return this.composeUnaryOp($.Symbol("sign"));
    };

    spec.squared = function() {
      return this.composeUnaryOp($.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.composeUnaryOp($.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.composeUnaryOp($.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.composeUnaryOp($.Symbol("exp"));
    };

    spec.midicps = function() {
      return this.composeUnaryOp($.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.composeUnaryOp($.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.composeUnaryOp($.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.composeUnaryOp($.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.composeUnaryOp($.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.composeUnaryOp($.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.composeUnaryOp($.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.composeUnaryOp($.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.composeUnaryOp($.Symbol("log"));
    };

    spec.log2 = function() {
      return this.composeUnaryOp($.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.composeUnaryOp($.Symbol("log10"));
    };

    spec.sin = function() {
      return this.composeUnaryOp($.Symbol("sin"));
    };

    spec.cos = function() {
      return this.composeUnaryOp($.Symbol("cos"));
    };

    spec.tan = function() {
      return this.composeUnaryOp($.Symbol("tan"));
    };

    spec.asin = function() {
      return this.composeUnaryOp($.Symbol("asin"));
    };

    spec.acos = function() {
      return this.composeUnaryOp($.Symbol("acos"));
    };

    spec.atan = function() {
      return this.composeUnaryOp($.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.composeUnaryOp($.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.composeUnaryOp($.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.composeUnaryOp($.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.composeUnaryOp($.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.composeUnaryOp($.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.composeUnaryOp($.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.composeUnaryOp($.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.composeUnaryOp($.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.composeUnaryOp($.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.composeUnaryOp($.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.composeUnaryOp($.Symbol("coin"));
    };

    spec.even = function() {
      return this.composeUnaryOp($.Symbol("even"));
    };

    spec.odd = function() {
      return this.composeUnaryOp($.Symbol("odd"));
    };

    spec.rectWindow = function() {
      return this.composeUnaryOp($.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.composeUnaryOp($.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.composeUnaryOp($.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.composeUnaryOp($.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.composeUnaryOp($.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.composeUnaryOp($.Symbol("ramp"));
    };

    spec.isPositive = function() {
      return this.composeUnaryOp($.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.composeUnaryOp($.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.composeUnaryOp($.Symbol("isStrictlyPositive"));
    };

    spec.rho = function() {
      return this.composeUnaryOp($.Symbol("rho"));
    };

    spec.theta = function() {
      return this.composeUnaryOp($.Symbol("theta"));
    };

    spec.rotate = function($function) {
      return this.composeBinaryOp($.Symbol("rotate"), $function);
    };

    spec.dist = function($function) {
      return this.composeBinaryOp($.Symbol("dist"), $function);
    };

    spec["+"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("+"), $function, $adverb);
    };

    spec["-"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("-"), $function, $adverb);
    };

    spec["*"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("*"), $function, $adverb);
    };

    spec["/"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("/"), $function, $adverb);
    };

    spec.div = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("div"), $function, $adverb);
    };

    spec.mod = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("mod"), $function, $adverb);
    };

    spec.pow = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("pow"), $function, $adverb);
    };

    spec.min = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("min"), $function, $adverb);
    };

    spec.max = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("max"), $function, $adverb);
    };

    spec["<"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<"), $function, $adverb);
    };

    spec["<="] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<="), $function, $adverb);
    };

    spec[">"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">"), $function, $adverb);
    };

    spec[">="] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">="), $function, $adverb);
    };

    spec.bitAnd = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitAnd"), $function, $adverb);
    };

    spec.bitOr = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitOr"), $function, $adverb);
    };

    spec.bitXor = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitXor"), $function, $adverb);
    };

    spec.bitHammingDistance = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitHammingDistance"), $function, $adverb);
    };

    spec.lcm = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("lcm"), $function, $adverb);
    };

    spec.gcd = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("gcd"), $function, $adverb);
    };

    spec.round = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("round"), $function, $adverb);
    };

    spec.roundUp = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("roundUp"), $function, $adverb);
    };

    spec.trunc = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("trunc"), $function, $adverb);
    };

    spec.atan2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("atan2"), $function, $adverb);
    };

    spec.hypot = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypot"), $function, $adverb);
    };

    spec.hypotApx = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypotApx"), $function, $adverb);
    };

    spec.leftShift = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("leftShift"), $function, $adverb);
    };

    spec.rightShift = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rightShift"), $function, $adverb);
    };

    spec.unsignedRightShift = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("unsignedRightShift"), $function, $adverb);
    };

    spec.ring1 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring1"), $function, $adverb);
    };

    spec.ring2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring2"), $function, $adverb);
    };

    spec.ring3 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring3"), $function, $adverb);
    };

    spec.ring4 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring4"), $function, $adverb);
    };

    spec.difsqr = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("difsqr"), $function, $adverb);
    };

    spec.sumsqr = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sumsqr"), $function, $adverb);
    };

    spec.sqrsum = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrsum"), $function, $adverb);
    };

    spec.sqrdif = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrdif"), $function, $adverb);
    };

    spec.absdif = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("absdif"), $function, $adverb);
    };

    spec.thresh = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("thresh"), $function, $adverb);
    };

    spec.amclip = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("amclip"), $function, $adverb);
    };

    spec.scaleneg = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("scaleneg"), $function, $adverb);
    };

    spec.clip2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("clip2"), $function, $adverb);
    };

    spec.fold2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("fold2"), $function, $adverb);
    };

    spec.wrap2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("wrap2"), $function, $adverb);
    };

    spec.excess = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("excess"), $function, $adverb);
    };

    spec.firstArg = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("firstArg"), $function, $adverb);
    };

    spec.rrand = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rrand"), $function, $adverb);
    };

    spec.exprand = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("exprand"), $function, $adverb);
    };

    spec["@"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("@"), $function, $adverb);
    };

    spec.real = utils.nop;
    spec.imag = function() {
      return $.Float(0.0);
    };

    spec["||"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("||"), $function, $adverb);
    };

    spec["&&"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("&&"), $function, $adverb);
    };

    spec.xor = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("xor"), $function, $adverb);
    };

    spec.nand = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("nand"), $function, $adverb);
    };

    spec.not = function() {
      return this.composeUnaryOp($.Symbol("not"));
    };

    spec.ref = function() {
      return this.composeUnaryOp($.Symbol("asRef"));
    };

    spec.clip = function($lo, $hi) {
      return this.composeNAryOp($.Symbol("clip"), $.Array([ $lo, $hi ]));
    };

    spec.wrap = function($lo, $hi) {
      return this.composeNAryOp($.Symbol("wrap"), $.Array([ $lo, $hi ]));
    };

    spec.fold = function($lo, $hi) {
      return this.composeNAryOp($.Symbol("fold"), $.Array([ $lo, $hi ]));
    };

    spec.blend = fn(function($that, $blendFrac) {
      return this.composeNAryOp(
        $.Symbol("blend"), $.Array([ $that, $blendFrac ])
      );
    }, "that; blendFrac=0.5");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linlin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("explin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("expexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("lincurve"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("curvelin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("bilin"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("biexp"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($function, $mod) {
      return this.composeNAryOp(
        $.Symbol("moddif"), $.Array([ $function, $mod ])
      );
    }, "function; mod");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return this.composeNAryOp(
        $.Symbol("degreeToKey"), $.Array([ $scale, $stepsPerOctave ])
      );
    }, "scale; stepsPerOctave=12");

    spec.degrad = function() {
      return this.composeUnaryOp($.Symbol("degrad"));
    };

    spec.raddeg = function() {
      return this.composeUnaryOp($.Symbol("raddeg"));
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
        return $("K2A").ar($result);
      }

      return $result;
    };

    spec.asControlInput = function() {
      return this.value();
    };

    spec.isValidUGenInput = utils.alwaysReturn$true;
  });

  klass.define("UnaryOpFunction : AbstractFunction", function(spec, utils) {
    spec.$new = function($selector, $a) {
      return utils.newCopyArgs(this, {
        selector: $selector,
        a: $a
      });
    };

    spec.value = function() {
      var $a = this._$a;
      return $a.value.apply($a, arguments).perform(this._$selector);
    };

    spec.valueArray = function($args) {
      return this._$a.valueArray($args).perform(this._$selector);
    };

    spec.valueEnvir = function() {
      var $a = this._$a;
      return $a.valueEnvir.apply($a, arguments).perform(this._$selector);
    };

    spec.valueArrayEnvir = function($args) {
      return this._$a.valueArrayEnvir($args).perform(this._$selector);
    };

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };
    // TODO: implements storeOn
  });

  klass.define("BinaryOpFunction : AbstractFunction", function(spec, utils) {
    spec.$new = function($selector, $a, $b, $adverb) {
      return utils.newCopyArgs(this, {
        selector: $selector,
        a: $a,
        b: $b,
        adverb: $adverb
      });
    };

    spec.value = function() {
      return this._$a.value.apply(this._$a, arguments)
        .perform(this._$selector, this._$b.value.apply(this._$b, arguments), this._$adverb);
    };

    spec.valueArray = function($args) {
      return this._$a.valueArray($args)
        .perform(this._$selector, this._$b.valueArray($args, arguments), this._$adverb);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };
    // TODO: implements storeOn
  });

  klass.define("NAryOpFunction : AbstractFunction", function(spec, utils) {
    spec.$new = function($selector, $a, $arglist) {
      return utils.newCopyArgs(this, {
        selector: $selector,
        a: $a,
        arglist: $arglist
      });
    };

    spec.value = function() {
      var args = arguments;
      return this._$a.value.apply(this._$a, args)
        .performList(this._$selector, this._$arglist.collect($.Function(function() {
          return [ function($_) {
            return $_.value.apply($_, args);
          } ];
        })));
    };

    spec.valueArray = function($args) {
      return this._$a.valueArray($args)
        .performList(this._$selector, this._$arglist.collect($.Function(function() {
          return [ function($_) {
            return $_.valueArray($args);
          } ];
        })));
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, _$arglist) {
      return this.performList($selector, _$arglist);
    };
    // TODO: implements storeOn
  });

  klass.define("FunctionList : AbstractFunction", function(spec, utils) {
    var $int0 = utils.$int0;

    spec.constructor = function() {
      this.__super__("AbstractFunction");
      this._flopped = false;
    };
    utils.setProperty(spec, "<>", "array");

    spec.$new = function($functions) {
      return utils.newCopyArgs(this, {
        array: $functions
      });
    };

    spec.flopped = function() {
      return $.Boolean(this._flopped);
    };

    spec.addFunc = fn(function($$functions) {
      if (this._flopped) {
        throw new Error("cannot add a function to a flopped FunctionList");
      }

      this._$array = this._$array.addAll($$functions);

      return this;
    }, "*functions");

    spec.removeFunc = function($function) {
      this._$array.remove($function);

      if (this._$array.size() < 2) {
        return this._$array.at($int0);
      }

      return this;
    };

    spec.replaceFunc = function($find, $replace) {
      this._$array = this._$array.replace($find, $replace);
      return this;
    };

    spec.value = function() {
      var $res, args = arguments;

      $res = this._$array.collect($.Function(function() {
        return [ function($_) {
          return $_.value.apply($_, args);
        } ];
      }));

      return this._flopped ? $res.flop() : $res;
    };

    spec.valueArray = function($args) {
      var $res;

      $res = this._$array.collect($.Function(function() {
        return [ function($_) {
          return $_.valueArray($args);
        } ];
      }));

      return this._flopped ? $res.flop() : $res;
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.do = function($function) {
      this._$array.do($function);
      return this;
    };

    spec.flop = function() {
      if (!this._flopped) {
        this._$array = this._$array.collect($.Function(function() {
          return [ function($_) {
            return $_.$("flop");
          } ];
        }));
      }
      this._flopped = true;

      return this;
    };

    // TODO: implements envirFlop

    spec.storeArgs = function() {
      return $.Array([ this._$array ]);
    };
  });
});

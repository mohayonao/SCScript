SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $ = sc.lang.$;
  var $int0 = $.int0;

  sc.lang.klass.refine("AbstractFunction", function(builder) {
    builder.addMethod("composeUnaryOp", function($aSelector) {
      return $("UnaryOpFunction").new($aSelector, this);
    });

    builder.addMethod("composeBinaryOp", function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    });

    builder.addMethod("reverseComposeBinaryOp", function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    });

    builder.addMethod("composeNAryOp", function($aSelector, $anArgList) {
      return $("NAryOpFunction").new($aSelector, this, $anArgList);
    });

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector, $aNumber, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aNumber, $adverb);
    });

    builder.addMethod("performBinaryOpOnSignal", function($aSelector, $aSignal, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSignal, $adverb);
    });

    builder.addMethod("performBinaryOpOnComplex", function($aSelector, $aComplex, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aComplex, $adverb);
    });

    builder.addMethod("performBinaryOpOnSeqColl", function($aSelector, $aSeqColl, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSeqColl, $adverb);
    });

    builder.addMethod("neg", function() {
      return this.composeUnaryOp($.Symbol("neg"));
    });

    builder.addMethod("reciprocal", function() {
      return this.composeUnaryOp($.Symbol("reciprocal"));
    });

    builder.addMethod("bitNot", function() {
      return this.composeUnaryOp($.Symbol("bitNot"));
    });

    builder.addMethod("abs", function() {
      return this.composeUnaryOp($.Symbol("abs"));
    });

    builder.addMethod("asFloat", function() {
      return this.composeUnaryOp($.Symbol("asFloat"));
    });

    builder.addMethod("asInteger", function() {
      return this.composeUnaryOp($.Symbol("asInteger"));
    });

    builder.addMethod("ceil", function() {
      return this.composeUnaryOp($.Symbol("ceil"));
    });

    builder.addMethod("floor", function() {
      return this.composeUnaryOp($.Symbol("floor"));
    });

    builder.addMethod("frac", function() {
      return this.composeUnaryOp($.Symbol("frac"));
    });

    builder.addMethod("sign", function() {
      return this.composeUnaryOp($.Symbol("sign"));
    });

    builder.addMethod("squared", function() {
      return this.composeUnaryOp($.Symbol("squared"));
    });

    builder.addMethod("cubed", function() {
      return this.composeUnaryOp($.Symbol("cubed"));
    });

    builder.addMethod("sqrt", function() {
      return this.composeUnaryOp($.Symbol("sqrt"));
    });

    builder.addMethod("exp", function() {
      return this.composeUnaryOp($.Symbol("exp"));
    });

    builder.addMethod("midicps", function() {
      return this.composeUnaryOp($.Symbol("midicps"));
    });

    builder.addMethod("cpsmidi", function() {
      return this.composeUnaryOp($.Symbol("cpsmidi"));
    });

    builder.addMethod("midiratio", function() {
      return this.composeUnaryOp($.Symbol("midiratio"));
    });

    builder.addMethod("ratiomidi", function() {
      return this.composeUnaryOp($.Symbol("ratiomidi"));
    });

    builder.addMethod("ampdb", function() {
      return this.composeUnaryOp($.Symbol("ampdb"));
    });

    builder.addMethod("dbamp", function() {
      return this.composeUnaryOp($.Symbol("dbamp"));
    });

    builder.addMethod("octcps", function() {
      return this.composeUnaryOp($.Symbol("octcps"));
    });

    builder.addMethod("cpsoct", function() {
      return this.composeUnaryOp($.Symbol("cpsoct"));
    });

    builder.addMethod("log", function() {
      return this.composeUnaryOp($.Symbol("log"));
    });

    builder.addMethod("log2", function() {
      return this.composeUnaryOp($.Symbol("log2"));
    });

    builder.addMethod("log10", function() {
      return this.composeUnaryOp($.Symbol("log10"));
    });

    builder.addMethod("sin", function() {
      return this.composeUnaryOp($.Symbol("sin"));
    });

    builder.addMethod("cos", function() {
      return this.composeUnaryOp($.Symbol("cos"));
    });

    builder.addMethod("tan", function() {
      return this.composeUnaryOp($.Symbol("tan"));
    });

    builder.addMethod("asin", function() {
      return this.composeUnaryOp($.Symbol("asin"));
    });

    builder.addMethod("acos", function() {
      return this.composeUnaryOp($.Symbol("acos"));
    });

    builder.addMethod("atan", function() {
      return this.composeUnaryOp($.Symbol("atan"));
    });

    builder.addMethod("sinh", function() {
      return this.composeUnaryOp($.Symbol("sinh"));
    });

    builder.addMethod("cosh", function() {
      return this.composeUnaryOp($.Symbol("cosh"));
    });

    builder.addMethod("tanh", function() {
      return this.composeUnaryOp($.Symbol("tanh"));
    });

    builder.addMethod("rand", function() {
      return this.composeUnaryOp($.Symbol("rand"));
    });

    builder.addMethod("rand2", function() {
      return this.composeUnaryOp($.Symbol("rand2"));
    });

    builder.addMethod("linrand", function() {
      return this.composeUnaryOp($.Symbol("linrand"));
    });

    builder.addMethod("bilinrand", function() {
      return this.composeUnaryOp($.Symbol("bilinrand"));
    });

    builder.addMethod("sum3rand", function() {
      return this.composeUnaryOp($.Symbol("sum3rand"));
    });

    builder.addMethod("distort", function() {
      return this.composeUnaryOp($.Symbol("distort"));
    });

    builder.addMethod("softclip", function() {
      return this.composeUnaryOp($.Symbol("softclip"));
    });

    builder.addMethod("coin", function() {
      return this.composeUnaryOp($.Symbol("coin"));
    });

    builder.addMethod("even", function() {
      return this.composeUnaryOp($.Symbol("even"));
    });

    builder.addMethod("odd", function() {
      return this.composeUnaryOp($.Symbol("odd"));
    });

    builder.addMethod("rectWindow", function() {
      return this.composeUnaryOp($.Symbol("rectWindow"));
    });

    builder.addMethod("hanWindow", function() {
      return this.composeUnaryOp($.Symbol("hanWindow"));
    });

    builder.addMethod("welWindow", function() {
      return this.composeUnaryOp($.Symbol("welWindow"));
    });

    builder.addMethod("triWindow", function() {
      return this.composeUnaryOp($.Symbol("triWindow"));
    });

    builder.addMethod("scurve", function() {
      return this.composeUnaryOp($.Symbol("scurve"));
    });

    builder.addMethod("ramp", function() {
      return this.composeUnaryOp($.Symbol("ramp"));
    });

    builder.addMethod("isPositive", function() {
      return this.composeUnaryOp($.Symbol("isPositive"));
    });

    builder.addMethod("isNegative", function() {
      return this.composeUnaryOp($.Symbol("isNegative"));
    });

    builder.addMethod("isStrictlyPositive", function() {
      return this.composeUnaryOp($.Symbol("isStrictlyPositive"));
    });

    builder.addMethod("rho", function() {
      return this.composeUnaryOp($.Symbol("rho"));
    });

    builder.addMethod("theta", function() {
      return this.composeUnaryOp($.Symbol("theta"));
    });

    builder.addMethod("rotate", function($function) {
      return this.composeBinaryOp($.Symbol("rotate"), $function);
    });

    builder.addMethod("dist", function($function) {
      return this.composeBinaryOp($.Symbol("dist"), $function);
    });

    builder.addMethod("+", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("+"), $function, $adverb);
    });

    builder.addMethod("-", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("-"), $function, $adverb);
    });

    builder.addMethod("*", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("*"), $function, $adverb);
    });

    builder.addMethod("/", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("/"), $function, $adverb);
    });

    builder.addMethod("div", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("div"), $function, $adverb);
    });

    builder.addMethod("mod", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("mod"), $function, $adverb);
    });

    builder.addMethod("pow", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("pow"), $function, $adverb);
    });

    builder.addMethod("min", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("min"), $function, $adverb);
    });

    builder.addMethod("max", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("max"), $function, $adverb);
    });

    builder.addMethod("<", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<"), $function, $adverb);
    });

    builder.addMethod("<=", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<="), $function, $adverb);
    });

    builder.addMethod(">", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">"), $function, $adverb);
    });

    builder.addMethod(">=", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">="), $function, $adverb);
    });

    builder.addMethod("bitAnd", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitAnd"), $function, $adverb);
    });

    builder.addMethod("bitOr", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitOr"), $function, $adverb);
    });

    builder.addMethod("bitXor", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitXor"), $function, $adverb);
    });

    builder.addMethod("bitHammingDistance", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitHammingDistance"), $function, $adverb);
    });

    builder.addMethod("lcm", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("lcm"), $function, $adverb);
    });

    builder.addMethod("gcd", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("gcd"), $function, $adverb);
    });

    builder.addMethod("round", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("round"), $function, $adverb);
    });

    builder.addMethod("roundUp", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("roundUp"), $function, $adverb);
    });

    builder.addMethod("trunc", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("trunc"), $function, $adverb);
    });

    builder.addMethod("atan2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("atan2"), $function, $adverb);
    });

    builder.addMethod("hypot", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypot"), $function, $adverb);
    });

    builder.addMethod("hypotApx", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypotApx"), $function, $adverb);
    });

    builder.addMethod("leftShift", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("leftShift"), $function, $adverb);
    });

    builder.addMethod("rightShift", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rightShift"), $function, $adverb);
    });

    builder.addMethod("unsignedRightShift", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("unsignedRightShift"), $function, $adverb);
    });

    builder.addMethod("ring1", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring1"), $function, $adverb);
    });

    builder.addMethod("ring2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring2"), $function, $adverb);
    });

    builder.addMethod("ring3", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring3"), $function, $adverb);
    });

    builder.addMethod("ring4", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring4"), $function, $adverb);
    });

    builder.addMethod("difsqr", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("difsqr"), $function, $adverb);
    });

    builder.addMethod("sumsqr", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sumsqr"), $function, $adverb);
    });

    builder.addMethod("sqrsum", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrsum"), $function, $adverb);
    });

    builder.addMethod("sqrdif", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrdif"), $function, $adverb);
    });

    builder.addMethod("absdif", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("absdif"), $function, $adverb);
    });

    builder.addMethod("thresh", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("thresh"), $function, $adverb);
    });

    builder.addMethod("amclip", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("amclip"), $function, $adverb);
    });

    builder.addMethod("scaleneg", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("scaleneg"), $function, $adverb);
    });

    builder.addMethod("clip2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("clip2"), $function, $adverb);
    });

    builder.addMethod("fold2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("fold2"), $function, $adverb);
    });

    builder.addMethod("wrap2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("wrap2"), $function, $adverb);
    });

    builder.addMethod("excess", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("excess"), $function, $adverb);
    });

    builder.addMethod("firstArg", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("firstArg"), $function, $adverb);
    });

    builder.addMethod("rrand", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rrand"), $function, $adverb);
    });

    builder.addMethod("exprand", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("exprand"), $function, $adverb);
    });

    builder.addMethod("@", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("@"), $function, $adverb);
    });

    builder.addMethod("real");

    builder.addMethod("imag", function() {
      return $.Float(0.0);
    });

    builder.addMethod("||", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("||"), $function, $adverb);
    });

    builder.addMethod("&&", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("&&"), $function, $adverb);
    });

    builder.addMethod("xor", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("xor"), $function, $adverb);
    });

    builder.addMethod("nand", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("nand"), $function, $adverb);
    });

    builder.addMethod("not", function() {
      return this.composeUnaryOp($.Symbol("not"));
    });

    builder.addMethod("ref", function() {
      return this.composeUnaryOp($.Symbol("asRef"));
    });

    builder.addMethod("clip", function($lo, $hi) {
      return this.composeNAryOp($.Symbol("clip"), $.Array([ $lo, $hi ]));
    });

    builder.addMethod("wrap", function($lo, $hi) {
      return this.composeNAryOp($.Symbol("wrap"), $.Array([ $lo, $hi ]));
    });

    builder.addMethod("fold", function($lo, $hi) {
      return this.composeNAryOp($.Symbol("fold"), $.Array([ $lo, $hi ]));
    });

    builder.addMethod("blend", {
      args: "that; blendFrac=0.5"
    }, function($that, $blendFrac) {
      return this.composeNAryOp(
        $.Symbol("blend"), $.Array([ $that, $blendFrac ])
      );
    });

    builder.addMethod("linlin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linlin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("linexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("explin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("explin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("expexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("expexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("lincurve", {
      args: "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("lincurve"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    });

    builder.addMethod("curvelin", {
      args: "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("curvelin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    });

    builder.addMethod("bilin", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("bilin"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    });

    builder.addMethod("biexp", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("biexp"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    });

    builder.addMethod("moddif", {
      args: "function; mod"
    }, function($function, $mod) {
      return this.composeNAryOp(
        $.Symbol("moddif"), $.Array([ $function, $mod ])
      );
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return this.composeNAryOp(
        $.Symbol("degreeToKey"), $.Array([ $scale, $stepsPerOctave ])
      );
    });

    builder.addMethod("degrad", function() {
      return this.composeUnaryOp($.Symbol("degrad"));
    });

    builder.addMethod("raddeg", function() {
      return this.composeUnaryOp($.Symbol("raddeg"));
    });

    builder.addMethod("applyTo", function() {
      return this.value.apply(this, arguments);
    });

    // TODO: implements <>
    // TODO: implements sampled

    builder.addMethod("asUGenInput", function($for) {
      return this.value($for);
    });

    builder.addMethod("asAudioRateInput", function($for) {
      var $result;

      $result = this.value($for);

      if ($result.rate().__sym__() !== "audio") {
        return $("K2A").ar($result);
      }

      return $result;
    });

    builder.addMethod("asControlInput", function() {
      return this.value();
    });

    builder.addMethod("isValidUGenInput", sc.TRUE);
  });

  sc.lang.klass.define("UnaryOpFunction : AbstractFunction", function(builder, _) {
    builder.addClassMethod("new", function($selector, $a) {
      return _.newCopyArgs(this, {
        selector: $selector,
        a: $a
      });
    });

    builder.addMethod("value", function() {
      var $a = this._$a;
      return $a.value.apply($a, arguments).perform(this._$selector);
    });

    builder.addMethod("valueArray", function($args) {
      return this._$a.valueArray($args).perform(this._$selector);
    });

    builder.addMethod("valueEnvir", function() {
      var $a = this._$a;
      return $a.valueEnvir.apply($a, arguments).perform(this._$selector);
    });

    builder.addMethod("valueArrayEnvir", function($args) {
      return this._$a.valueArrayEnvir($args).perform(this._$selector);
    });

    builder.addMethod("functionPerformList", function($selector, $arglist) {
      return this.performList($selector, $arglist);
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpFunction : AbstractFunction", function(builder, _) {
    builder.addClassMethod("new", function($selector, $a, $b, $adverb) {
      return _.newCopyArgs(this, {
        selector: $selector,
        a: $a,
        b: $b,
        adverb: $adverb
      });
    });

    builder.addMethod("value", function() {
      return this._$a.value.apply(this._$a, arguments)
        .perform(this._$selector, this._$b.value.apply(this._$b, arguments), this._$adverb);
    });

    builder.addMethod("valueArray", function($args) {
      return this._$a.valueArray($args)
        .perform(this._$selector, this._$b.valueArray($args, arguments), this._$adverb);
    });

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    builder.addMethod("functionPerformList", function($selector, $arglist) {
      return this.performList($selector, $arglist);
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("NAryOpFunction : AbstractFunction", function(builder, _) {
    builder.addClassMethod("new", function($selector, $a, $arglist) {
      return _.newCopyArgs(this, {
        selector: $selector,
        a: $a,
        arglist: $arglist
      });
    });

    builder.addMethod("value", function() {
      var args = arguments;
      return this._$a.value.apply(this._$a, args)
        .performList(this._$selector, this._$arglist.collect($.Func(function($_) {
          return $_.value.apply($_, args);
        })));
    });

    builder.addMethod("valueArray", function($args) {
      return this._$a.valueArray($args)
        .performList(this._$selector, this._$arglist.collect($.Func(function($_) {
          return $_.valueArray($args);
        })));
    });

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    builder.addMethod("functionPerformList", function($selector, _$arglist) {
      return this.performList($selector, _$arglist);
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("FunctionList : AbstractFunction", function(builder, _) {
    builder.addProperty("<>", "array");

    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._flopped = false;
    });

    builder.addClassMethod("new", function($functions) {
      return _.newCopyArgs(this, {
        array: $functions
      });
    });

    builder.addMethod("flopped", function() {
      return $.Boolean(this._flopped);
    });

    builder.addMethod("addFunc", {
      args: "*functions"
    }, function($$functions) {
      if (this._flopped) {
        throw new Error("cannot add a function to a flopped FunctionList");
      }

      this._$array = this._$array.addAll($$functions);

      return this;
    });

    builder.addMethod("removeFunc", function($function) {
      this._$array.remove($function);

      if (this._$array.size() < 2) {
        return this._$array.at($int0);
      }

      return this;
    });

    builder.addMethod("replaceFunc", function($find, $replace) {
      this._$array = this._$array.replace($find, $replace);
      return this;
    });

    builder.addMethod("value", function() {
      var $res, args = arguments;

      $res = this._$array.collect($.Func(function($_) {
        return $_.value.apply($_, args);
      }));

      return this._flopped ? $res.flop() : $res;
    });

    builder.addMethod("valueArray", function($args) {
      var $res;

      $res = this._$array.collect($.Func(function($_) {
        return $_.valueArray($args);
      }));

      return this._flopped ? $res.flop() : $res;
    });

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    builder.addMethod("do", function($function) {
      this._$array.do($function);
      return this;
    });

    builder.addMethod("flop", function() {
      if (!this._flopped) {
        this._$array = this._$array.collect($.Func(function($_) {
          return $_.$("flop");
        }));
      }
      this._flopped = true;

      return this;
    });

    // TODO: implements envirFlop

    builder.addMethod("storeArgs", function() {
      return $.Array([ this._$array ]);
    });
  });
});

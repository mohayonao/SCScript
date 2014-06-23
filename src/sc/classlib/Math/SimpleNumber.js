SCScript.install(function(sc) {
  "use strict";

  require("./Number");

  var $ = sc.lang.$;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var $int1 = $.int1;
  var random = sc.libs.random;
  var format = sc.libs.strlib.format;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  function prOpSimpleNumber(selector, func) {
    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.TAG_INT:
      case sc.TAG_FLOAT:
        return $.Boolean(func(this._, $aNumber._));
      }

      if ($aNumber.isSequenceableCollection().__bool__()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $.Symbol(selector), this, $adverb
        );
      }

      return $.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(builder) {
    builder.addMethod("__newFrom__", $.Float);

    builder.addMethod("__bool__", function() {
      return this._ !== 0;
    });

    builder.addMethod("__dec__", function() {
      return this.__newFrom__(this._ - 1);
    });

    builder.addMethod("__inc__", function() {
      return this.__newFrom__(this._ + 1);
    });

    builder.addMethod("__int__", function() {
      if (!isFinite(this._)) {
        return this._;
      }
      return this._|0;
    });

    builder.addMethod("__num__", function() {
      return this._;
    });

    builder.addMethod("isValidUGenInput", function() {
      return $.Boolean(!isNaN(this._));
    });

    builder.addMethod("numChannels", function() {
      return $int1;
    });

    builder.addMethod("magnitude", function() {
      return this.abs();
    });

    builder.addMethod("angle", function() {
      return $.Float(this._ >= 0 ? 0 : Math.PI);
    });

    builder.addMethod("neg", function() {
      return this.__newFrom__(-this._);
    });

    // bitNot: implemented by subclass

    builder.addMethod("abs", function() {
      return this.__newFrom__(Math.abs(this._));
    });

    builder.addMethod("ceil", function() {
      return this.__newFrom__(Math.ceil(this._));
    });

    builder.addMethod("floor", function() {
      return this.__newFrom__(Math.floor(this._));
    });

    builder.addMethod("frac", function() {
      var a = this._;

      if (a < 0) {
        return this.__newFrom__(1 + (a - (a|0)));
      }
      return this.__newFrom__(a - (a|0));
    });

    builder.addMethod("sign", function() {
      var a = this._;
      return this.__newFrom__(
        a > 0 ? 1 : a === 0 ? 0 : -1
      );
    });

    builder.addMethod("squared", function() {
      return this.__newFrom__(this._ * this._);
    });

    builder.addMethod("cubed", function() {
      return this.__newFrom__(this._ * this._ * this._);
    });

    builder.addMethod("sqrt", function() {
      return $.Float(Math.sqrt(this._));
    });

    builder.addMethod("exp", function() {
      return $.Float(Math.exp(this._));
    });

    builder.addMethod("reciprocal", function() {
      return $.Float(1 / this._);
    });

    builder.addMethod("midicps", function() {
      return $.Float(
        440 * Math.pow(2, (this._ - 69) * 1 / 12)
      );
    });

    builder.addMethod("cpsmidi", function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1 / 440) * Math.LOG2E * 12 + 69
      );
    });

    builder.addMethod("midiratio", function() {
      return $.Float(
        Math.pow(2, this._ * 1 / 12)
      );
    });

    builder.addMethod("ratiomidi", function() {
      return $.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    });

    builder.addMethod("ampdb", function() {
      return $.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    });

    builder.addMethod("dbamp", function() {
      return $.Float(
        Math.pow(10, this._ * 0.05)
      );
    });

    builder.addMethod("octcps", function() {
      return $.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    });

    builder.addMethod("cpsoct", function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1 / 440) * Math.LOG2E + 4.75
      );
    });

    builder.addMethod("log", function() {
      return $.Float(Math.log(this._));
    });

    builder.addMethod("log2", function() {
      return $.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    });

    builder.addMethod("log10", function() {
      return $.Float(Math.log(this._) * Math.LOG10E);
    });

    builder.addMethod("sin", function() {
      return $.Float(Math.sin(this._));
    });

    builder.addMethod("cos", function() {
      return $.Float(Math.cos(this._));
    });

    builder.addMethod("tan", function() {
      return $.Float(Math.tan(this._));
    });

    builder.addMethod("asin", function() {
      return $.Float(Math.asin(this._));
    });

    builder.addMethod("acos", function() {
      return $.Float(Math.acos(this._));
    });

    builder.addMethod("atan", function() {
      return $.Float(Math.atan(this._));
    });

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    builder.addMethod("sinh", function() {
      return $.Float(_sinh(this._));
    });

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    builder.addMethod("cosh", function() {
      return $.Float(_cosh(this._));
    });

    builder.addMethod("tanh", function() {
      return $.Float(_sinh(this._) / _cosh(this._));
    });

    builder.addMethod("rand", function() {
      return this.__newFrom__(
        random.next() * this._
      );
    });

    builder.addMethod("rand2", function() {
      return this.__newFrom__(
        (random.next() * 2 - 1) * this._
      );
    });

    builder.addMethod("linrand", function() {
      return this.__newFrom__(
        Math.min(random.next(), random.next()) * this._
      );
    });

    builder.addMethod("bilinrand", function() {
      return this.__newFrom__(
        (random.next() - random.next()) * this._
      );
    });

    builder.addMethod("sum3rand", function() {
      return this.__newFrom__(
        (random.next() + random.next() + random.next() - 1.5) * 2 / 3 * this._
      );
    });

    builder.addMethod("distort", function() {
      return $.Float(
        this._ / (1 + Math.abs(this._))
      );
    });

    builder.addMethod("softclip", function() {
      var a = this._, abs = Math.abs(a);
      return $.Float(abs <= 0.5 ? a : (abs - 0.25) / a);
    });

    builder.addMethod("coin", function() {
      return $.Boolean(random.next() < this._);
    });

    builder.addMethod("isPositive", function() {
      return $.Boolean(this._ >= 0);
    });

    builder.addMethod("isNegative", function() {
      return $.Boolean(this._ < 0);
    });

    builder.addMethod("isStrictlyPositive", function() {
      return $.Boolean(this._ > 0);
    });

    builder.addMethod("isNaN", function() {
      return $.Boolean(isNaN(this._));
    });

    builder.addMethod("asBoolean", function() {
      return $.Boolean(this._ > 0);
    });

    builder.addMethod("booleanValue", function() {
      return $.Boolean(this._ > 0);
    });

    builder.addMethod("binaryValue", function() {
      return this._ > 0 ? $int1 : $int0;
    });

    builder.addMethod("rectWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(1);
    });

    builder.addMethod("hanWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    });

    builder.addMethod("welWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(Math.sin(a * Math.PI));
    });

    builder.addMethod("triWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      if (a < 0.5) {
        return $.Float(2 * a);
      }
      return $.Float(-2 * a + 2);
    });

    builder.addMethod("scurve", function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a * a * (3 - 2 * a));
    });

    builder.addMethod("ramp", function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a);
    });

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

    builder.addMethod("bitTest", function($bit) {
      return $.Boolean(
        this.bitAnd($int1.leftShift($bit)).__num__() !== 0
      );
    });

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

    builder.addMethod("==", function($aNumber) {
      return $.Boolean(this._ === $aNumber._);
    });

    builder.addMethod("!=", function($aNumber) {
      return $.Boolean(this._ !== $aNumber._);
    });

    builder.addMethod("<", prOpSimpleNumber("<", function(a, b) {
      return a < b;
    }));

    builder.addMethod(">", prOpSimpleNumber(">", function(a, b) {
      return a > b;
    }));

    builder.addMethod("<=", prOpSimpleNumber("<=", function(a, b) {
      return a <= b;
    }));

    builder.addMethod(">=", prOpSimpleNumber(">=", function(a, b) {
      return a >= b;
    }));

    builder.addMethod("equalWithPrecision", {
      args: "that; precision=0.0001"
    }, function($that, $precision) {
      return this.absdif($that) ["<"] ($precision);
    });

    builder.addMethod("asInteger", function() {
      return $.Integer(this._);
    });

    builder.addMethod("asFloat", function() {
      return $.Float(this._);
    });

    // TODO: implements asComplex
    // TODO: implements asRect

    builder.addMethod("degrad", function() {
      return $.Float(this._ * Math.PI / 180);
    });

    builder.addMethod("raddeg", function() {
      return $.Float(this._ * 180 / Math.PI);
    });

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector) {
      throw new Error(format("binary operator '#{0}' failed", $aSelector.__sym__()));
    });

    // TODO: implements performBinaryOpOnComplex

    builder.addMethod("performBinaryOpOnSignal", function($aSelector) {
      throw new Error(format("binary operator '#{0}' failed", $aSelector.__sym__()));
    });

    builder.addMethod("nextPowerOfTwo", function() {
      return $.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    });

    builder.addMethod("nextPowerOf", {
      args: "base"
    }, function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil()
      );
    });

    builder.addMethod("nextPowerOfThree", function() {
      return $.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    });

    builder.addMethod("previousPowerOf", {
      args: "base"
    }, function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil().__dec__()
      );
    });

    builder.addMethod("quantize", {
      args: "quantum=1.0; tolerance=0.05; strength=1.0"
    }, function($quantum, $tolerance, $strength) {
      var $round, $diff;

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength.$("*", [ $diff ]));
      }

      return this;
    });

    builder.addMethod("linlin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    });

    builder.addMethod("linexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    });

    builder.addMethod("explin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    });

    builder.addMethod("expexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    });

    builder.addMethod("lincurve", {
      args: "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.__num__()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $outMax ["-"] ($outMin) ["/"] ($.Float(1.0) ["-"] ($grow));
          $b = $outMin ["+"] ($a);
          $scaled = (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin));

          $res = $b ["-"] ($a ["*"] ($grow.pow($scaled)));
        }
      }

      return $res;
    });

    builder.addMethod("curvelin", {
      args: "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax"
    },function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.__num__()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $inMax ["-"] ($inMin) ["/"] ($.Float(1.0) ["-"] ($grow));
          $b = $inMin ["+"] ($a);

          $res = ((($b ["-"] (this)) ["/"] ($a)).log()
                  ["*"] ($outMax ["-"] ($outMin)) ["/"] ($curve) ["+"] ($outMin));
        }
      }

      return $res;
    });

    builder.addMethod("bilin", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.linlin($inCenter, $inMax, $outCenter, $outMax, $.Symbol("none"));
        } else {
          $res = this.linlin($inMin, $inCenter, $outMin, $outCenter, $.Symbol("none"));
        }
      }

      return $res;
    });

    builder.addMethod("biexp", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.explin($inCenter, $inMax, $outCenter, $outMax, $.Symbol("none"));
        } else {
          $res = this.explin($inMin, $inCenter, $outMin, $outCenter, $.Symbol("none"));
        }
      }

      return $res;
    });

    builder.addMethod("moddif", {
      args: "aNumber=0.0; mod=1.0"
    }, function($aNumber, $mod) {
      var $diff, $modhalf;

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod.$("*", [ $.Float(0.5) ]);

      return $modhalf.$("-", [ $diff.absdif($modhalf) ]);
    });

    builder.addMethod("lcurve", {
      args: "a=1.0; m=0.0; n=1.0; tau=1.0"
    }, function($a, $m, $n, $tau) {
      var $rTau, $x;

      $x = this.neg();

      if ($tau.__num__() === 1.0) {
        // a * (m * exp(x) + 1) / (n * exp(x) + 1)
        return $a.$("*", [
          $m.$("*", [ $x.exp() ]).__inc__()
        ]).$("/", [
          $n.$("*", [ $x.exp() ]).__inc__()
        ]);
      } else {
        $rTau = $tau.reciprocal();
        return $a.$("*", [
          $m.$("*", [ $x.exp() ]) ["*"] ($rTau).__inc__()
        ]).$("/", [
          $n.$("*", [ $x.exp() ]) ["*"] ($rTau).__inc__()
        ]);
      }
    });

    builder.addMethod("gauss", {
      args: "standardDeviation"
    }, function($standardDeviation) {
      // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($.Float(-2.0) ["*"] ($.Float(1.0).rand().log()).sqrt() ["*"] (
        $.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    });

    builder.addMethod("gaussCurve", {
      args: "a=1.0; b=0.0; c=1.0"
    }, function($a, $b, $c) {
      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a.$("*", [ ((
        (this ["-"] ($b).squared()) ["/"] ($.Float(-2.0) ["*"] ($c.$("squared")))
      ).exp()) ]);
    });

    // TODO: implements asPoint
    // TODO: implements asWarp

    builder.addMethod("wait", function() {
      return this.yield();
    });

    // TODO: implements waitUntil
    // TODO: implements sleep
    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("rate", function() {
      return $.Symbol("scalar");
    });

    builder.addMethod("asAudioRateInput", function() {
      if (this._ === 0) {
        return $("Silent").ar();
      }
      return $("DC").ar(this);
    });

    builder.addMethod("madd", {
      args: "mul; add"
    }, function($mul, $add) {
      return (this ["*"] ($mul)) ["+"] ($add);
    });

    builder.addMethod("lag");
    builder.addMethod("lag2");
    builder.addMethod("lag3");
    builder.addMethod("lagud");
    builder.addMethod("lag2ud");
    builder.addMethod("lag3ud");
    builder.addMethod("varlag");
    builder.addMethod("slew");

    // TODO: implements writeInputSpec

    builder.addMethod("series", {
      args: "second; last"
    }, function($second, $last) {
      var $step;
      var last, step, size;

      if ($second === $nil) {
        if (this.__num__() < $last.__num__()) {
          $second = this.__inc__();
        } else {
          $second = this.__dec__();
        }
      }
      $step = $second ["-"] (this);

      last = $last.__num__();
      step = $step.__num__();
      size = (Math.floor((last - this._) / step + 0.001)|0) + 1;

      return SCArray.series($.Integer(size), this, $step);
    });

    builder.addMethod("seriesIter", {
      args: "second; last"
    }, function($second, $last) {
      var first, second, last, step;
      var $newFrom = this.__newFrom__;

      first = this.__num__();
      if ($second === $nil) {
        last = ($last !== $nil) ? $last.__num__() : Infinity;
        step = first < last ? 1 : -1;
      } else {
        second = $second.__num__();
        last = ($last !== $nil) ? $last.__num__() : (
          $second < first ? -Infinity : Infinity
        );
        step = second - first;
      }
      return SCRoutine.new($.Function(function() {
        var val, $cond;
        $cond = $.Func(step < 0 ? function() {
          return $.Boolean(val >= last);
        } : function() {
          return $.Boolean(val <= last);
        });
        return [ function() {
          val = first;
          return $cond.while($.Func(function() {
            $newFrom(val).yield();
            val += step;
            return $nil;
          }));
        } ];
      }));
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      var $scaleDegree, $accidental;
      $scaleDegree = this.round($int1).asInteger();
      $accidental  = (this ["-"] ($scaleDegree)) ["*"] ($.Float(10.0));
      return $scale.performDegreeToKey($scaleDegree, $stepsPerOctave, $accidental);
    });

    builder.addMethod("keyToDegree", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return $scale.performKeyToDegree(this, $stepsPerOctave);
    });

    builder.addMethod("nearestInList", {
      args: "list"
    }, function($list) {
      return $list.performNearestInList(this);
    });

    builder.addMethod("nearestInScale", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return $scale.performNearestInScale(this, $stepsPerOctave);
    });

    builder.addMethod("partition", {
      args: "parts=2; min=1"
    }, function($parts, $min) {
      var $n = this ["-"] ($min.__dec__() ["*"] ($parts));
      return $int1.series(null, $n.__dec__()).scramble().keep($parts.__dec__())
        .sort().add($n).differentiate() ["+"] ($min.__dec__());
    });

    builder.addMethod("nextTimeOnGrid", {
      args: "clock"
    }, function($clock) {
      return $clock.nextTimeOnGrid(this, $int0);
    });

    builder.addMethod("playAndDelta");

    builder.addMethod("asQuant", function() {
      return $("Quant").new(this);
    });

    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    builder.addMethod("shallowCopy");
  });

  function getClippedValue($this, $inMin, $inMax, $outMin, $outMax, $clip) {
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
});

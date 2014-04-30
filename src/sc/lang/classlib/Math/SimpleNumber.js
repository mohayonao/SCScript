(function(sc) {
  "use strict";

  require("./Number");

  var $SC = sc.lang.$SC;
  var rand = sc.libs.random;

  function prOpSimpleNumber(selector, func) {
    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.C.TAG_INT:
      case sc.C.TAG_FLOAT:
        return $SC.Boolean(func(this._, $aNumber._));
      }

      if ($aNumber.isSequenceableCollection().valueOf()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $SC.Symbol(selector), this, $adverb
        );
      }

      return $SC.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.__newFrom__ = $SC.Float;

    spec.__bool__ = function() {
      return this._ !== 0;
    };

    spec.__dec__ = function() {
      return this.__newFrom__(this._ - 1);
    };

    spec.__inc__ = function() {
      return this.__newFrom__(this._ + 1);
    };

    spec.__int__ = function() {
      if (!isFinite(this._)) {
        return this._;
      }
      return this._|0;
    };

    spec.__num__ = function() {
      return this._;
    };

    spec.isValidUGenInput = function() {
      return $SC.Boolean(!isNaN(this._));
    };

    spec.numChannels = utils.alwaysReturn$int_1;

    spec.magnitude = function() {
      return this.abs();
    };

    spec.angle = function() {
      return $SC.Float(this._ >= 0 ? 0 : Math.PI);
    };

    spec.neg = function() {
      return this.__newFrom__(-this._);
    };

    // bitNot: implemented by subclass

    spec.abs = function() {
      return this.__newFrom__(Math.abs(this._));
    };

    spec.ceil = function() {
      return this.__newFrom__(Math.ceil(this._));
    };

    spec.floor = function() {
      return this.__newFrom__(Math.floor(this._));
    };

    spec.frac = function() {
      var a = this._;

      if (a < 0) {
        return this.__newFrom__(1 + (a - (a|0)));
      }
      return this.__newFrom__(a - (a|0));
    };

    spec.sign = function() {
      var a = this._;
      return this.__newFrom__(
        a > 0 ? 1 : a === 0 ? 0 : -1
      );
    };

    spec.squared = function() {
      return this.__newFrom__(this._ * this._);
    };

    spec.cubed = function() {
      return this.__newFrom__(this._ * this._ * this._);
    };

    spec.sqrt = function() {
      return $SC.Float(Math.sqrt(this._));
    };

    spec.exp = function() {
      return $SC.Float(Math.exp(this._));
    };

    spec.reciprocal = function() {
      return $SC.Float(1 / this._);
    };

    spec.midicps = function() {
      return $SC.Float(
        440 * Math.pow(2, (this._ - 69) * 1/12)
      );
    };

    spec.cpsmidi = function() {
      return $SC.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E * 12 + 69
      );
    };

    spec.midiratio = function() {
      return $SC.Float(
        Math.pow(2, this._ * 1/12)
      );
    };

    spec.ratiomidi = function() {
      return $SC.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    };

    spec.ampdb = function() {
      return $SC.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    };

    spec.dbamp = function() {
      return $SC.Float(
        Math.pow(10, this._ * 0.05)
      );
    };

    spec.octcps = function() {
      return $SC.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    };

    spec.cpsoct = function() {
      return $SC.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E + 4.75
      );
    };

    spec.log = function() {
      return $SC.Float(Math.log(this._));
    };

    spec.log2 = function() {
      return $SC.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    };

    spec.log10 = function() {
      return $SC.Float(Math.log(this._) * Math.LOG10E);
    };

    spec.sin = function() {
      return $SC.Float(Math.sin(this._));
    };

    spec.cos = function() {
      return $SC.Float(Math.cos(this._));
    };

    spec.tan = function() {
      return $SC.Float(Math.tan(this._));
    };

    spec.asin = function() {
      return $SC.Float(Math.asin(this._));
    };

    spec.acos = function() {
      return $SC.Float(Math.acos(this._));
    };

    spec.atan = function() {
      return $SC.Float(Math.atan(this._));
    };

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    spec.sinh = function() {
      return $SC.Float(_sinh(this._));
    };

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    spec.cosh = function() {
      return $SC.Float(_cosh(this._));
    };

    spec.tanh = function() {
      return $SC.Float(_sinh(this._) / _cosh(this._));
    };

    spec.rand = function() {
      return this.__newFrom__(
        rand.next() * this._
      );
    };

    spec.rand2 = function() {
      return this.__newFrom__(
        (rand.next() * 2 - 1) * this._
      );
    };

    spec.linrand = function() {
      return this.__newFrom__(
        Math.min(rand.next(), rand.next()) * this._
      );
    };

    spec.bilinrand = function() {
      return this.__newFrom__(
        (rand.next() - rand.next()) * this._
      );
    };

    spec.sum3rand = function() {
      return this.__newFrom__(
        (rand.next() + rand.next() + rand.next() - 1.5) * 2/3 * this._
      );
    };

    spec.distort = function() {
      return $SC.Float(
        this._ / (1 + Math.abs(this._))
      );
    };

    spec.softclip = function() {
      var a = this._, abs_a = Math.abs(a);
      return $SC.Float(abs_a <= 0.5 ? a : (abs_a - 0.25) / a);
    };

    spec.coin = function() {
      return $SC.Boolean(rand.next() < this._);
    };

    spec.isPositive = function() {
      return $SC.Boolean(this._ >= 0);
    };

    spec.isNegative = function() {
      return $SC.Boolean(this._ < 0);
    };

    spec.isStrictlyPositive = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.isNaN = function() {
      return $SC.Boolean(isNaN(this._));
    };

    spec.asBoolean = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.booleanValue = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.binaryValue = function() {
      return this._ > 0 ? $int_1 : $int_0;
    };

    spec.rectWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(1);
    };

    spec.hanWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    };

    spec.welWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(Math.sin(a * Math.PI));
    };

    spec.triWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      if (a < 0.5) {
        return $SC.Float(2 * a);
      }
      return $SC.Float(-2 * a + 2);
    };

    spec.scurve = function() {
      var a = this._;
      if (a <= 0) {
        return $SC.Float(0);
      }
      if (1 <= a) {
        return $SC.Float(1);
      }
      return $SC.Float(a * a * (3 - 2 * a));
    };

    spec.ramp = function() {
      var a = this._;
      if (a <= 0) {
        return $SC.Float(0);
      }
      if (1 <= a) {
        return $SC.Float(1);
      }
      return $SC.Float(a);
    };

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

    spec.bitTest = function($bit) {
      $bit = utils.defaultValue$Nil($bit);
      return $SC.Boolean(
        this.bitAnd($int_1.leftShift($bit)).valueOf() !== 0
      );
    };

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

    spec["=="] = function($aNumber) {
      return $SC.Boolean(this._ === $aNumber._);
    };

    spec["!="] = function($aNumber) {
      return $SC.Boolean(this._ !== $aNumber._);
    };

    spec["<"] = prOpSimpleNumber("<", function(a, b) {
      return a < b;
    });
    spec[">"] = prOpSimpleNumber(">", function(a, b) {
      return a > b;
    });
    spec["<="] = prOpSimpleNumber("<=", function(a, b) {
      return a <= b;
    });
    spec[">="] = prOpSimpleNumber(">=", function(a, b) {
      return a >= b;
    });

    spec.equalWithPrecision = function($that, $precision) {
      $that = utils.defaultValue$Nil($that);
      $precision = utils.defaultValue$Float($precision, 0.0001);
      return this.absdif($that) ["<"] ($precision);
    };

    // TODO: implements hash

    spec.asInteger = function() {
      return $SC.Integer(this._);
    };

    spec.asFloat = function() {
      return $SC.Float(this._);
    };

    // TODO: implements asComplex
    // TODO: implements asRect

    spec.degrad = function() {
      return $SC.Float(this._ * Math.PI / 180);
    };

    spec.raddeg = function() {
      return $SC.Float(this._ * 180 / Math.PI);
    };

    // TODO: implements performBinaryOpOnSimpleNumber
    // TODO: implements performBinaryOpOnComplex
    // TODO: implements performBinaryOpOnSignal

    spec.nextPowerOfTwo = function() {
      return $SC.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    };

    spec.nextPowerOf = function($base) {
      $base = utils.defaultValue$Nil($base);
      return $base.pow(
        (this.log() ["/"] ($base.log())).ceil()
      );
    };

    spec.nextPowerOfThree = function() {
      return $SC.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    };

    spec.previousPowerOf = function($base) {
      $base = utils.defaultValue$Nil($base);
      return $base.pow(
        (this.log() ["/"] ($base.log())).ceil().__dec__()
      );
    };

    spec.quantize = function($quantum, $tolerance, $strength) {
      var $round, $diff;
      $quantum   = utils.defaultValue$Float($quantum, 1.0);
      $tolerance = utils.defaultValue$Float($tolerance, 0.05);
      $strength  = utils.defaultValue$Float($strength, 1.0);

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength ["*"] ($diff));
      }

      return this;
    };

    spec.linlin = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    };

    spec.linexp = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    };

    spec.explin = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    };

    spec.expexp = function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;
      $inMin  = utils.defaultValue$Nil($inMin);
      $inMax  = utils.defaultValue$Nil($inMax);
      $outMin = utils.defaultValue$Nil($outMin);
      $outMax = utils.defaultValue$Nil($outMax);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    };

    spec.lincurve = function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;
      $inMin  = utils.defaultValue$Integer($inMin, 0);
      $inMax  = utils.defaultValue$Integer($inMax, 1);
      $outMin = utils.defaultValue$Integer($outMin, 0);
      $outMax = utils.defaultValue$Integer($outMax, 1);
      $curve  = utils.defaultValue$Integer($curve, -4);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $outMax ["-"] ($outMin) ["/"] ($SC.Float(1.0) ["-"] ($grow));
          $b = $outMin ["+"] ($a);
          $scaled = (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin));

          $res = $b ["-"] ($a ["*"] ($grow.pow($scaled)));
        }
      }

      return $res;
    };

    spec.curvelin = function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;
      $inMin  = utils.defaultValue$Integer($inMin, 0);
      $inMax  = utils.defaultValue$Integer($inMax, 1);
      $outMin = utils.defaultValue$Integer($outMin, 0);
      $outMax = utils.defaultValue$Integer($outMax, 1);
      $curve  = utils.defaultValue$Integer($curve, -4);
      $clip   = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $inMax ["-"] ($inMin) ["/"] ($SC.Float(1.0) ["-"] ($grow));
          $b = $inMin ["+"] ($a);

          $res = ((($b ["-"] (this)) ["/"] ($a)).log()
                  ["*"] ($outMax ["-"] ($outMin)) ["/"] ($curve) ["+"] ($outMin));
        }
      }

      return $res;
    };

    spec.bilin = function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;
      $inCenter  = utils.defaultValue$Nil($inCenter);
      $inMin     = utils.defaultValue$Nil($inMin);
      $inMax     = utils.defaultValue$Nil($inMax);
      $outCenter = utils.defaultValue$Nil($outCenter);
      $outMin    = utils.defaultValue$Nil($outMin);
      $outMax    = utils.defaultValue$Nil($outMax);
      $clip      = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.linlin($inCenter, $inMax, $outCenter, $outMax, $SC.Symbol("none"));
        } else {
          $res = this.linlin($inMin, $inCenter, $outMin, $outCenter, $SC.Symbol("none"));
        }
      }

      return $res;
    };

    spec.biexp = function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;
      $inCenter  = utils.defaultValue$Nil($inCenter);
      $inMin     = utils.defaultValue$Nil($inMin);
      $inMax     = utils.defaultValue$Nil($inMax);
      $outCenter = utils.defaultValue$Nil($outCenter);
      $outMin    = utils.defaultValue$Nil($outMin);
      $outMax    = utils.defaultValue$Nil($outMax);
      $clip      = utils.defaultValue$Symbol($clip, "minmax");

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.explin($inCenter, $inMax, $outCenter, $outMax, $SC.Symbol("none"));
        } else {
          $res = this.explin($inMin, $inCenter, $outMin, $outCenter, $SC.Symbol("none"));
        }
      }

      return $res;
    };

    spec.moddif = function($aNumber, $mod) {
      var $diff, $modhalf;
      $aNumber = utils.defaultValue$Float($aNumber, 0.0);
      $mod     = utils.defaultValue$Float($mod    , 1.0);

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod ["*"] ($SC.Float(0.5));

      return $modhalf ["-"] ($diff.absdif($modhalf));
    };

    spec.lcurve = function($a, $m, $n, $tau) {
      var $rTau, $x;
      $a = utils.defaultValue$Float($a, 1.0);
      $m = utils.defaultValue$Float($m, 0.0);
      $n = utils.defaultValue$Float($n, 1.0);
      $tau = utils.defaultValue$Float($tau, 1.0);

      $x = this.neg();

      if ($tau.__num__() === 1.0) {
        // a * (m * exp(x) + 1) / (n * exp(x) + 1)
        return $a ["*"] (
          $m ["*"] ($x.exp()).__inc__()
        ) ["/"] (
          $n ["*"] ($x.exp()).__inc__()
        );
      } else {
        $rTau = $tau.reciprocal();
        return $a ["*"] (
          $m ["*"] ($x.exp()) ["*"] ($rTau).__inc__()
        ) ["/"] (
          $n ["*"] ($x.exp()) ["*"] ($rTau).__inc__()
        );
      }
    };

    spec.gauss = function($standardDeviation) {
      $standardDeviation = utils.defaultValue$Nil($standardDeviation);
        // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($SC.Float(-2.0) ["*"] ($SC.Float(1.0).rand().log()).sqrt() ["*"] (
        $SC.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    };

    spec.gaussCurve = function($a, $b, $c) {
      $a = utils.defaultValue$Float($a, 1.0);
      $b = utils.defaultValue$Float($b, 0.0);
      $c = utils.defaultValue$Float($c, 1.0);

      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a ["*"] ((
        (this ["-"] ($b).squared()) ["/"] ($SC.Float(-2.0) ["*"] ($c.squared()))
      ).exp());
    };

    // TODO: implements asPoint
    // TODO: implements asWarp

    spec.wait = function() {
      return this.yield();
    };

    // TODO: implements waitUntil
    // TODO: implements sleep
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.rate = function() {
      return $SC.Symbol("scalar");
    };

    spec.asAudioRateInput = function() {
      if (this._ === 0) {
        return $SC("Silent").ar();
      }
      return $SC("DC").ar(this);
    };

    spec.madd = function($mul, $add) {
      $mul = utils.defaultValue$Nil($mul);
      $add = utils.defaultValue$Nil($add);

      return (this ["*"] ($mul)) ["+"] ($add);
    };

    spec.lag = utils.nop;
    spec.lag2 = utils.nop;
    spec.lag3 = utils.nop;
    spec.lagud = utils.nop;
    spec.lag2ud = utils.nop;
    spec.lag3ud = utils.nop;
    spec.varlag = utils.nop;
    spec.slew = utils.nop;

    // TODO: implements writeInputSpec

    spec.series = function($second, $last) {
      var $step;
      var last, step, size;
      $second = utils.defaultValue$Nil($second);
      $last   = utils.defaultValue$Nil($last);

      if ($second === $nil) {
        if (this.valueOf() < $last.valueOf()) {
          $second = this.__inc__();
        } else {
          $second = this.__dec__();
        }
      }
      $step = $second ["-"] (this);

      last = $last.__num__();
      step = $step.__num__();
      size = (Math.floor((last - this._) / step + 0.001)|0) + 1;

      return SCArray.series($SC.Integer(size), this, $step);
    };

    // TODO: implements seriesIter
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInList
    // TODO: implements nearestInScale
    // TODO: implements partition
    // TODO: implements nextTimeOnGrid
    // TODO: implements playAndDelta
    // TODO: implements asQuant
    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    spec.shallowCopy = utils.nop;
  });

  function clip_for_map($this, $inMin, $inMax, $outMin, $outMax, $clip) {

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

})(sc);

SCScript.install(function(sc) {
  "use strict";

  require("./Number");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var rand = sc.libs.random;
  var q    = sc.libs.strlib.quote;

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

      if ($aNumber.isSequenceableCollection().valueOf()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $.Symbol(selector), this, $adverb
        );
      }

      return $.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(spec, utils) {
    var $nil  = utils.$nil;
    var $int0 = utils.$int0;
    var $int1 = utils.$int1;

    spec.__newFrom__ = $.Float;

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
      return $.Boolean(!isNaN(this._));
    };

    spec.numChannels = utils.alwaysReturn$int1;

    spec.magnitude = function() {
      return this.abs();
    };

    spec.angle = function() {
      return $.Float(this._ >= 0 ? 0 : Math.PI);
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
      return $.Float(Math.sqrt(this._));
    };

    spec.exp = function() {
      return $.Float(Math.exp(this._));
    };

    spec.reciprocal = function() {
      return $.Float(1 / this._);
    };

    spec.midicps = function() {
      return $.Float(
        440 * Math.pow(2, (this._ - 69) * 1 / 12)
      );
    };

    spec.cpsmidi = function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1 / 440) * Math.LOG2E * 12 + 69
      );
    };

    spec.midiratio = function() {
      return $.Float(
        Math.pow(2, this._ * 1 / 12)
      );
    };

    spec.ratiomidi = function() {
      return $.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    };

    spec.ampdb = function() {
      return $.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    };

    spec.dbamp = function() {
      return $.Float(
        Math.pow(10, this._ * 0.05)
      );
    };

    spec.octcps = function() {
      return $.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    };

    spec.cpsoct = function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1 / 440) * Math.LOG2E + 4.75
      );
    };

    spec.log = function() {
      return $.Float(Math.log(this._));
    };

    spec.log2 = function() {
      return $.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    };

    spec.log10 = function() {
      return $.Float(Math.log(this._) * Math.LOG10E);
    };

    spec.sin = function() {
      return $.Float(Math.sin(this._));
    };

    spec.cos = function() {
      return $.Float(Math.cos(this._));
    };

    spec.tan = function() {
      return $.Float(Math.tan(this._));
    };

    spec.asin = function() {
      return $.Float(Math.asin(this._));
    };

    spec.acos = function() {
      return $.Float(Math.acos(this._));
    };

    spec.atan = function() {
      return $.Float(Math.atan(this._));
    };

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    spec.sinh = function() {
      return $.Float(_sinh(this._));
    };

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    spec.cosh = function() {
      return $.Float(_cosh(this._));
    };

    spec.tanh = function() {
      return $.Float(_sinh(this._) / _cosh(this._));
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
        (rand.next() + rand.next() + rand.next() - 1.5) * 2 / 3 * this._
      );
    };

    spec.distort = function() {
      return $.Float(
        this._ / (1 + Math.abs(this._))
      );
    };

    spec.softclip = function() {
      var a = this._, abs = Math.abs(a);
      return $.Float(abs <= 0.5 ? a : (abs - 0.25) / a);
    };

    spec.coin = function() {
      return $.Boolean(rand.next() < this._);
    };

    spec.isPositive = function() {
      return $.Boolean(this._ >= 0);
    };

    spec.isNegative = function() {
      return $.Boolean(this._ < 0);
    };

    spec.isStrictlyPositive = function() {
      return $.Boolean(this._ > 0);
    };

    spec.isNaN = function() {
      return $.Boolean(isNaN(this._));
    };

    spec.asBoolean = function() {
      return $.Boolean(this._ > 0);
    };

    spec.booleanValue = function() {
      return $.Boolean(this._ > 0);
    };

    spec.binaryValue = function() {
      return this._ > 0 ? $int1 : $int0;
    };

    spec.rectWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(1);
    };

    spec.hanWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    };

    spec.welWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(Math.sin(a * Math.PI));
    };

    spec.triWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      if (a < 0.5) {
        return $.Float(2 * a);
      }
      return $.Float(-2 * a + 2);
    };

    spec.scurve = function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a * a * (3 - 2 * a));
    };

    spec.ramp = function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a);
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
      return $.Boolean(
        this.bitAnd($int1.leftShift($bit)).valueOf() !== 0
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
      return $.Boolean(this._ === $aNumber._);
    };

    spec["!="] = function($aNumber) {
      return $.Boolean(this._ !== $aNumber._);
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

    spec.equalWithPrecision = fn(function($that, $precision) {
      return this.absdif($that) ["<"] ($precision);
    }, "that; precision=0.0001");

    spec.asInteger = function() {
      return $.Integer(this._);
    };

    spec.asFloat = function() {
      return $.Float(this._);
    };

    // TODO: implements asComplex
    // TODO: implements asRect

    spec.degrad = function() {
      return $.Float(this._ * Math.PI / 180);
    };

    spec.raddeg = function() {
      return $.Float(this._ * 180 / Math.PI);
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector) {
      throw new Error("binary operator " + q($aSelector.__sym__()) + " failed");
    };

    // TODO: implements performBinaryOpOnComplex

    spec.performBinaryOpOnSignal = function($aSelector) {
      throw new Error("binary operator " + q($aSelector.__sym__()) + " failed");
    };

    spec.nextPowerOfTwo = function() {
      return $.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    };

    spec.nextPowerOf = fn(function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil()
      );
    }, "base");

    spec.nextPowerOfThree = function() {
      return $.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    };

    spec.previousPowerOf = fn(function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil().__dec__()
      );
    }, "base");

    spec.quantize = fn(function($quantum, $tolerance, $strength) {
      var $round, $diff;

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength.$("*", [ $diff ]));
      }

      return this;
    }, "quantum=1.0; tolerance=0.05; strength=1.0");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
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
    }, "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
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
    }, "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
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
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
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
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($aNumber, $mod) {
      var $diff, $modhalf;

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod.$("*", [ $.Float(0.5) ]);

      return $modhalf.$("-", [ $diff.absdif($modhalf) ]);
    }, "aNumber=0.0; mod=1.0");

    spec.lcurve = fn(function($a, $m, $n, $tau) {
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
    }, "a=1.0; m=0.0; n=1.0; tau=1.0");

    spec.gauss = fn(function($standardDeviation) {
      // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($.Float(-2.0) ["*"] ($.Float(1.0).rand().log()).sqrt() ["*"] (
        $.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    }, "standardDeviation");

    spec.gaussCurve = fn(function($a, $b, $c) {
      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a.$("*", [ ((
        (this ["-"] ($b).squared()) ["/"] ($.Float(-2.0) ["*"] ($c.$("squared")))
      ).exp()) ]);
    }, "a=1.0; b=0.0; c=1.0");

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
      return $.Symbol("scalar");
    };

    spec.asAudioRateInput = function() {
      if (this._ === 0) {
        return $("Silent").ar();
      }
      return $("DC").ar(this);
    };

    spec.madd = fn(function($mul, $add) {
      return (this ["*"] ($mul)) ["+"] ($add);
    }, "mul; add");

    spec.lag = utils.nop;
    spec.lag2 = utils.nop;
    spec.lag3 = utils.nop;
    spec.lagud = utils.nop;
    spec.lag2ud = utils.nop;
    spec.lag3ud = utils.nop;
    spec.varlag = utils.nop;
    spec.slew = utils.nop;

    // TODO: implements writeInputSpec

    spec.series = fn(function($second, $last) {
      var $step;
      var last, step, size;

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

      return SCArray.series($.Integer(size), this, $step);
    }, "second; last");

    spec.seriesIter = fn(function($second, $last) {
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
        $cond = $.Function(function() {
          return [ step < 0 ? function() {
            return $.Boolean(val >= last);
          } : function() {
            return $.Boolean(val <= last);
          } ];
        });
        return [ function() {
          val = first;
          return $cond.while($.Function(function() {
            return [ function() {
              $newFrom(val).yield();
              val += step;
              return $nil;
            } ];
          }));
        } ];
      }));
    }, "second; last");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      var $scaleDegree, $accidental;
      $scaleDegree = this.round($int1).asInteger();
      $accidental  = (this ["-"] ($scaleDegree)) ["*"] ($.Float(10.0));
      return $scale.performDegreeToKey($scaleDegree, $stepsPerOctave, $accidental);
    }, "scale; stepsPerOctave=12");

    spec.keyToDegree = fn(function($scale, $stepsPerOctave) {
      return $scale.performKeyToDegree(this, $stepsPerOctave);
    }, "scale; stepsPerOctave=12");

    spec.nearestInList = fn(function($list) {
      return $list.performNearestInList(this);
    }, "list");

    spec.nearestInScale = fn(function($scale, $stepsPerOctave) {
      return $scale.performNearestInScale(this, $stepsPerOctave);
    }, "scale; stepsPerOctave=12");

    spec.partition = fn(function($parts, $min) {
      var $n = this ["-"] ($min.__dec__() ["*"] ($parts));
      return $int1.series(null, $n.__dec__()).scramble().keep($parts.__dec__())
        .sort().add($n).differentiate() ["+"] ($min.__dec__());
    }, "parts=2; min=1");

    spec.nextTimeOnGrid = fn(function($clock) {
      return $clock.nextTimeOnGrid(this, $int0);
    }, "clock");

    spec.playAndDelta = utils.nop;

    spec.asQuant = function() {
      return $("Quant").new(this);
    };

    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    spec.shallowCopy = utils.nop;
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

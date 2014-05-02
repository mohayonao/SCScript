(function(sc) {
  "use strict";

  require("./SimpleNumber");
  require("./bop");

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  sc.lang.klass.refine("Integer", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.__newFrom__ = $SC.Integer;

    spec.__int__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String("" + this._);
    };

    spec.$new = function() {
      throw new Error("Integer.new is illegal, should use literal.");
    };

    spec.isInteger = utils.alwaysReturn$true;

    // TODO: implements hash

    [
      [ "+", $SC.Integer, $SC.Float ],
      [ "-", $SC.Integer, $SC.Float ],
      [ "*", $SC.Integer, $SC.Float ],
      [ "/", $SC.Float  , $SC.Float ],
      [ "mod"     , $SC.Integer, $SC.Float   ],
      [ "div"     , $SC.Integer, $SC.Integer ],
      [ "pow"     , $SC.Float  , $SC.Float   ],
      [ "min"     , $SC.Integer, $SC.Float   ],
      [ "max"     , $SC.Integer, $SC.Float   ],
      [ "bitAnd"  , $SC.Integer, $SC.Float   ],
      [ "bitOr"   , $SC.Integer, $SC.Float   ],
      [ "bitXor"  , $SC.Integer, $SC.Float   ],
      [ "lcm"     , $SC.Integer, $SC.Float   ],
      [ "gcd"     , $SC.Integer, $SC.Float   ],
      [ "round"   , $SC.Integer, $SC.Float   ],
      [ "roundUp" , $SC.Integer, $SC.Float   ],
      [ "trunc"   , $SC.Integer, $SC.Float   ],
      [ "atan2"   , $SC.Float  , $SC.Float   ],
      [ "hypot"   , $SC.Float  , $SC.Float   ],
      [ "hypotApx", $SC.Float  , $SC.Float   ],
      [ "leftShift"         , $SC.Integer, $SC.Float ],
      [ "rightShift"        , $SC.Integer, $SC.Float ],
      [ "unsignedRightShift", $SC.Integer, $SC.Float ],
      [ "ring1"   , $SC.Integer, $SC.Float   ],
      [ "ring2"   , $SC.Integer, $SC.Float   ],
      [ "ring3"   , $SC.Integer, $SC.Float   ],
      [ "ring4"   , $SC.Integer, $SC.Float   ],
      [ "difsqr"  , $SC.Integer, $SC.Float   ],
      [ "sumsqr"  , $SC.Integer, $SC.Float   ],
      [ "sqrsum"  , $SC.Integer, $SC.Float   ],
      [ "sqrdif"  , $SC.Integer, $SC.Float   ],
      [ "absdif"  , $SC.Integer, $SC.Float   ],
      [ "thresh"  , $SC.Integer, $SC.Integer ],
      [ "amclip"  , $SC.Integer, $SC.Float   ],
      [ "scaleneg", $SC.Integer, $SC.Float   ],
      [ "clip2"   , $SC.Integer, $SC.Float   ],
      [ "fold2"   , $SC.Integer, $SC.Float   ],
      [ "excess"  , $SC.Integer, $SC.Float   ],
      [ "firstArg", $SC.Integer, $SC.Integer ],
      [ "rrand"   , $SC.Integer, $SC.Float   ],
      [ "exprand" , $SC.Float  , $SC.Float   ],
    ].forEach(function(items) {
      spec[items[0]] = sc.lang.classlib.bop.apply(null, items);
    });

    spec.wrap2 = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.C.TAG_INT:
        return $SC.Integer(mathlib.iwrap(this._, -$aNumber._, $aNumber._));
      case sc.C.TAG_FLOAT:
        return $SC.Float(mathlib.wrap2(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol("wrap2"), this, $adverb
      );
    };

    spec.rrand = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.C.TAG_INT:
        return $SC.Integer(Math.round(mathlib.rrand(this._, $aNumber._)));
      case sc.C.TAG_FLOAT:
        return $SC.Float(mathlib.rrand(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol("rrand"), this, $adverb
      );
    };

    spec.clip = fn(function($lo, $hi) {
      // <-- _ClipInt -->
      if ($lo.__tag === sc.C.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.C.TAG_SYM) {
        return $hi;
      }
      if ($lo.__tag === sc.C.TAG_INT && $hi.__tag === sc.C.TAG_INT) {
        return $SC.Integer(
          mathlib.clip(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.wrap = fn(function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === sc.C.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.C.TAG_SYM) {
        return $hi;
      }
      if ($lo.__tag === sc.C.TAG_INT && $hi.__tag === sc.C.TAG_INT) {
        return $SC.Integer(
          mathlib.iwrap(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.fold = fn(function($lo, $hi) {
      // <-- _FoldInt -->
      if ($lo.__tag === sc.C.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.C.TAG_SYM) {
        return $hi;
      }
      if ($lo.__tag === sc.C.TAG_INT && $hi.__tag === sc.C.TAG_INT) {
        return $SC.Integer(
          mathlib.ifold(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.even = function() {
      return $SC.Boolean(!(this._ & 1));
    };

    spec.odd = function() {
      return $SC.Boolean(!!(this._ & 1));
    };

    spec.xrand = fn(function($exclude) {
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int_1)) ["%"] (this);
    }, "exclude=0");

    spec.xrand2 = fn(function($exclude) {
      var raw, res;

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $SC.Integer(res);
    }, "exclude=0");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return $scale.performDegreeToKey(this, $stepsPerOctave);
    }, "scale; stepsPerOctave=12");

    spec.do = function($function) {
      iterator.execute(
        iterator.integer$do(this),
        $function
      );
      return this;
    };

    spec.generate = function($function) {

      $function.value(this);

      return this;
    };

    spec.collectAs = fn(function($function, $class) {
      var $res;
      var i, imax;

      if ($class === $nil) {
        $class = SCArray;
      }

      $res = $class.new(this);
      for (i = 0, imax = this._; i < imax; ++i) {
        $res.add($function.value($SC.Integer(i)));
      }

      return $res;
    }, "function; class");

    spec.collect = function($function) {
      return this.collectAs($function, SCArray);
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.integer$reverseDo(this),
        $function
      );
      return this;
    };

    spec.for = fn(function($endval, $function) {
      iterator.execute(
        iterator.integer$for(this, $endval),
        $function
      );
      return this;
    }, "endval; function");

    spec.forBy = fn(function($endval, $stepval, $function) {
      iterator.execute(
        iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    }, "endval; stepval; function");

    spec.to = fn(function($hi, $step) {
      return $SC("Interval").new(this, $hi, $step);
    }, "hi; step=1");

    spec.asAscii = function() {
      // <-- _AsAscii -->
      return $SC.Char(String.fromCharCode(this._|0));
    };

    spec.asUnicode = utils.nop;

    spec.asDigit = function() {
      var c;

      // <!-- _AsAscii -->
      c = this._;
      if (0 <= c && c <= 9) {
        return $SC.Char(String(c));
      }
      if (10 <= c && c <= 35) {
        return $SC.Char(String.fromCharCode(c + 55));
      }

      throw new Error("Integer: asDigit must be 0 <= this <= 35");
    };

    spec.asBinaryDigits = fn(function($numDigits) {
      var raw, array, numDigits, i;

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($SC.Integer((raw >> i) & 1));
      }

      return $SC.Array(array);
    }, "numDigits=8");

    spec.asDigits = fn(function($base, $numDigits) {
      var $num;
      var array, numDigits, i;

      $num = this;
      if ($numDigits === $nil) {
        $numDigits = (
          this.log() ["/"] ($base.log() ["+"] ($SC.Float(1e-10)))
        ).asInteger().__inc__();
      }

      array = [];
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($num ["%"] ($base));
        $num = $num.div($base);
      }

      return $SC.Array(array);
    }, "base=10; numDigits");

    // TODO: implements nextPowerOfTwo
    // TODO: implements isPowerOfTwo
    // TODO: implements leadingZeroes
    // TODO: implements trailingZeroes
    // TODO: implements numBits
    // TODO: implements log2Ceil
    // TODO: implements grayCode
    // TODO: implements setBit
    // TODO: implements nthPrime
    // TODO: implements prevPrime
    // TODO: implements nextPrime
    // TODO: implements indexOfPrime
    // TODO: implements isPrime
    // TODO: implements exit
    // TODO: implements asStringToBase
    // TODO: implements asBinaryString
    // TODO: implements asHexString
    // TODO: implements asIPString
    // TODO: implements archiveAsCompileString

    spec.geom = fn(function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    }, "start; grow");

    spec.fib = fn(function($a, $b) {
      return SCArray.fib(this, $a, $b);
    }, "a=0.0; b=1.0");

    // TODO: implements factors
    // TODO: implements pidRunning
    // TODO: implements factorial
    // TODO: implements isCaps
    // TODO: implements isShift
    // TODO: implements isCtrl
    // TODO: implements isAlt
    // TODO: implements isCmd
    // TODO: implements isNumPad
    // TODO: implements isHelp
    // TODO: implements isFun

    spec.bitNot = function() {
      return $SC.Integer(~this._);
    };
  });

})(sc);

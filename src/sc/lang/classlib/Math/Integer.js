(function(sc) {
  "use strict";

  require("./SimpleNumber");
  require("./bop");

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib = sc.libs.mathlib;

  sc.lang.klass.refine("Integer", function(spec, utils) {
    var $int1 = utils.int1Instance;
    var SCArray = $SC.Class("Array");

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

    spec.isInteger = utils.alwaysReturn$True;

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

    spec.clip = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

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
    };

    spec.wrap = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

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
    };

    spec.fold = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

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
    };

    spec.even = function() {
      return $SC.Boolean(!(this._ & 1));
    };

    spec.odd = function() {
      return $SC.Boolean(!!(this._ & 1));
    };

    spec.xrand = function($exclude) {
      $exclude = utils.defaultValue$Integer($exclude, 0);
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int1)) ["%"] (this);
    };

    spec.xrand2 = function($exclude) {
      var raw, res;
      $exclude = utils.defaultValue$Integer($exclude, 0);

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $SC.Integer(res);
    };

    spec.degreeToKey = function($scale, $stepsPerOctave) {
      $scale = utils.defaultValue$Nil($scale);
      $stepsPerOctave = utils.defaultValue$Integer($stepsPerOctave, 12);

      return $scale.performDegreeToKey(this, $stepsPerOctave);
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.integer$do(this),
        $function
      );
      return this;
    };

    spec.generate = function($function) {
      $function = utils.defaultValue$Nil($function);

      $function.value(this);

      return this;
    };

    spec.collectAs = function($function, $class) {
      var $res;
      var i, imax;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      if ($class === utils.nilInstance) {
        $class = SCArray;
      }

      $res = $class.new(this);
      for (i = 0, imax = this._; i < imax; ++i) {
        $res.add($function.value($SC.Integer(i)));
      }

      return $res;
    };

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

    spec.for = function($endval, $function) {
      iterator.execute(
        iterator.integer$for(this, $endval),
        $function
      );
      return this;
    };

    spec.forBy = function($endval, $stepval, $function) {
      iterator.execute(
        iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    };

    spec.to = function($hi, $step) {
      $step = utils.defaultValue$Integer($step, 1);
      return $SC.Class("Interval").new(this, $hi, $step);
    };

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

    spec.asBinaryDigits = function($numDigits) {
      var raw, array, numDigits, i;
      $numDigits = utils.defaultValue$Integer($numDigits, 8);

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($SC.Integer((raw >> i) & 1));
      }

      return $SC.Array(array);
    };

    spec.asDigits = function($base, $numDigits) {
      var $num;
      var array, numDigits, i;
      $base      = utils.defaultValue$Integer($base, 10);
      $numDigits = utils.defaultValue$Nil($numDigits);

      $num = this;
      if ($numDigits === utils.nilInstance) {
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
    };

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

    spec.geom = function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    };

    spec.fib = function($a, $b) {
      $a = utils.defaultValue$Float($a, 0.0);
      $b = utils.defaultValue$Float($b, 1.0);
      return SCArray.fib(this, $a, $b);
    };

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

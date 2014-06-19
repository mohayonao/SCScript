SCScript.install(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  var bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.TAG_INT:
        return type1(func(this._, $aNumber._));
      case sc.TAG_FLOAT:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol(selector), this, $adverb
      );
    };
  };

  sc.lang.klass.refine("Integer", function(spec, utils) {
    var $nil  = utils.$nil;
    var $int1 = utils.$int1;
    var SCArray = $("Array");

    spec.__newFrom__ = $.Integer;

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

    spec.hash = function() {
      return $.Float(this._).hash();
    };

    [
      [ "+", $.Integer, $.Float ],
      [ "-", $.Integer, $.Float ],
      [ "*", $.Integer, $.Float ],
      [ "/", $.Float  , $.Float ],
      [ "mod"     , $.Integer, $.Float   ],
      [ "div"     , $.Integer, $.Integer ],
      [ "pow"     , $.Float  , $.Float   ],
      [ "min"     , $.Integer, $.Float   ],
      [ "max"     , $.Integer, $.Float   ],
      [ "bitAnd"  , $.Integer, $.Float   ],
      [ "bitOr"   , $.Integer, $.Float   ],
      [ "bitXor"  , $.Integer, $.Float   ],
      [ "lcm"     , $.Integer, $.Float   ],
      [ "gcd"     , $.Integer, $.Float   ],
      [ "round"   , $.Integer, $.Float   ],
      [ "roundUp" , $.Integer, $.Float   ],
      [ "trunc"   , $.Integer, $.Float   ],
      [ "atan2"   , $.Float  , $.Float   ],
      [ "hypot"   , $.Float  , $.Float   ],
      [ "hypotApx", $.Float  , $.Float   ],
      [ "leftShift"         , $.Integer, $.Float ],
      [ "rightShift"        , $.Integer, $.Float ],
      [ "unsignedRightShift", $.Integer, $.Float ],
      [ "ring1"   , $.Integer, $.Float   ],
      [ "ring2"   , $.Integer, $.Float   ],
      [ "ring3"   , $.Integer, $.Float   ],
      [ "ring4"   , $.Integer, $.Float   ],
      [ "difsqr"  , $.Integer, $.Float   ],
      [ "sumsqr"  , $.Integer, $.Float   ],
      [ "sqrsum"  , $.Integer, $.Float   ],
      [ "sqrdif"  , $.Integer, $.Float   ],
      [ "absdif"  , $.Integer, $.Float   ],
      [ "thresh"  , $.Integer, $.Integer ],
      [ "amclip"  , $.Integer, $.Float   ],
      [ "scaleneg", $.Integer, $.Float   ],
      [ "clip2"   , $.Integer, $.Float   ],
      [ "fold2"   , $.Integer, $.Float   ],
      [ "excess"  , $.Integer, $.Float   ],
      [ "firstArg", $.Integer, $.Integer ],
      [ "rrand"   , $.Integer, $.Float   ],
      [ "exprand" , $.Float  , $.Float   ],
    ].forEach(function(items) {
      spec[items[0]] = bop.apply(null, items);
    });

    spec.wrap2 = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.TAG_INT:
        return $.Integer(mathlib.iwrap(this._, -$aNumber._, $aNumber._));
      case sc.TAG_FLOAT:
        return $.Float(mathlib.wrap2(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol("wrap2"), this, $adverb
      );
    };

    spec.rrand = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.TAG_INT:
        return $.Integer(Math.round(mathlib.rrand(this._, $aNumber._)));
      case sc.TAG_FLOAT:
        return $.Float(mathlib.rrand(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol("rrand"), this, $adverb
      );
    };

    spec.clip = fn(function($lo, $hi) {
      // <-- _ClipInt -->
      if ($lo.__tag === sc.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.TAG_SYM) {
        return $hi;
      }
      if ($lo.__tag === sc.TAG_INT && $hi.__tag === sc.TAG_INT) {
        return $.Integer(
          mathlib.clip(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.wrap = fn(function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === sc.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.TAG_SYM) {
        return $hi;
      }
      if ($lo.__tag === sc.TAG_INT && $hi.__tag === sc.TAG_INT) {
        return $.Integer(
          mathlib.iwrap(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.fold = fn(function($lo, $hi) {
      // <-- _FoldInt -->
      if ($lo.__tag === sc.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.TAG_SYM) {
        return $hi;
      }
      if ($lo.__tag === sc.TAG_INT && $hi.__tag === sc.TAG_INT) {
        return $.Integer(
          mathlib.ifold(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.even = function() {
      return $.Boolean(!(this._ & 1));
    };

    spec.odd = function() {
      return $.Boolean(!!(this._ & 1));
    };

    spec.xrand = fn(function($exclude) {
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int1)) ["%"] (this);
    }, "exclude=0");

    spec.xrand2 = fn(function($exclude) {
      var raw, res;

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $.Integer(res);
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
        $res.add($function.value($.Integer(i)));
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
      return $("Interval").new(this, $hi, $step);
    }, "hi; step=1");

    spec.asAscii = function() {
      // <-- _AsAscii -->
      return $.Char(String.fromCharCode(this._|0));
    };

    spec.asUnicode = utils.nop;

    spec.asDigit = function() {
      var c;

      // <!-- _AsAscii -->
      c = this._;
      if (0 <= c && c <= 9) {
        return $.Char(String(c));
      }
      if (10 <= c && c <= 35) {
        return $.Char(String.fromCharCode(c + 55));
      }

      throw new Error("Integer: asDigit must be 0 <= this <= 35");
    };

    spec.asBinaryDigits = fn(function($numDigits) {
      var raw, array, numDigits, i;

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($.Integer((raw >> i) & 1));
      }

      return $.Array(array);
    }, "numDigits=8");

    spec.asDigits = fn(function($base, $numDigits) {
      var $num;
      var array, numDigits, i;

      $num = this;
      if ($numDigits === $nil) {
        $numDigits = (
          this.log() ["/"] ($base.log() ["+"] ($.Float(1e-10)))
        ).asInteger().__inc__();
      }

      array = [];
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($num ["%"] ($base));
        $num = $num.div($base);
      }

      return $.Array(array);
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
      return $.Integer(~this._);
    };
  });
});

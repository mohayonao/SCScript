SCScript.install(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $ = sc.lang.$;
  var $nil  = $.nil;
  var $int1 = $.int1;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  var SCArray = $("Array");

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

  sc.lang.klass.refine("Integer", function(builder) {
    builder.addMethod("__newFrom__", $.Integer);

    builder.addMethod("__int__", function() {
      return this._;
    });

    builder.addMethod("toString", function() {
      return String("" + this._);
    });

    builder.addClassMethod("new", function() {
      throw new Error("Integer.new is illegal, should use literal.");
    });

    builder.addMethod("isInteger", sc.TRUE);

    builder.addMethod("hash", function() {
      return $.Float(this._).hash();
    });

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
      // [ "rrand"   , $.Integer, $.Float   ],
      [ "exprand" , $.Float  , $.Float   ],
    ].forEach(function(items) {
      builder.addMethod(items[0], bop.apply(null, items));
    });

    builder.addMethod("wrap2", function($aNumber, $adverb) {
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
    });

    builder.addMethod("rrand", function($aNumber, $adverb) {
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
    });

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
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
    });

    builder.addMethod("wrap", {
      args: "lo; hi"
    }, function($lo, $hi) {
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
    });

    builder.addMethod("fold", {
      args: "lo; hi"
    }, function($lo, $hi) {
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
    });

    builder.addMethod("even", function() {
      return $.Boolean(!(this._ & 1));
    });

    builder.addMethod("odd", function() {
      return $.Boolean(!!(this._ & 1));
    });

    builder.addMethod("xrand", {
      args: "exclude=0"
    }, function($exclude) {
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int1)) ["%"] (this);
    });

    builder.addMethod("xrand2", {
      args: "exclude=0"
    }, function($exclude) {
      var raw, res;

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $.Integer(res);
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return $scale.performDegreeToKey(this, $stepsPerOctave);
    });

    builder.addMethod("do", function($function) {
      iterator.execute(
        iterator.integer$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("generate", function($function) {
      $function.value(this);
      return this;
    });

    builder.addMethod("collectAs", {
      args: "function; class"
    }, function($function, $class) {
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
    });

    builder.addMethod("collect", function($function) {
      return this.collectAs($function, SCArray);
    });

    builder.addMethod("reverseDo", function($function) {
      iterator.execute(
        iterator.integer$reverseDo(this),
        $function
      );
      return this;
    });

    builder.addMethod("for", {
      args: "endval; function"
    }, function($endval, $function) {
      iterator.execute(
        iterator.integer$for(this, $endval),
        $function
      );
      return this;
    });

    builder.addMethod("forBy", {
      args: "endval; stepval; function"
    }, function($endval, $stepval, $function) {
      iterator.execute(
        iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    });

    builder.addMethod("to", {
      args: "hi; step=1"
    }, function($hi, $step) {
      return $("Interval").new(this, $hi, $step);
    });

    builder.addMethod("asAscii", function() {
      // <-- _AsAscii -->
      return $.Char(String.fromCharCode(this._|0));
    });

    builder.addMethod("asUnicode");

    builder.addMethod("asDigit", function() {
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
    });

    builder.addMethod("asBinaryDigits", {
      args: "numDigits=8"
    }, function($numDigits) {
      var raw, array, numDigits, i;

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($.Integer((raw >> i) & 1));
      }

      return $.Array(array);
    });

    builder.addMethod("asDigits", {
      args: "base=10; numDigits"
    }, function($base, $numDigits) {
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
    });

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

    builder.addMethod("geom", {
      args: "start; grow"
    }, function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    });

    builder.addMethod("fib", {
      args: "a=0.0; b=1.0"
    }, function($a, $b) {
      return SCArray.fib(this, $a, $b);
    });

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

    builder.addMethod("bitNot", function() {
      return $.Integer(~this._);
    });
  });
});

(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib = sc.libs.mathlib;

  function prOpFloat(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.C.TAG_INT:
        return type1(func(this._, $aNumber._));
      case sc.C.TAG_FLOAT:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol(selector), this, $adverb
      );
    };
  }

  sc.lang.klass.refine("Float", function(spec, utils) {
    spec.toString = function() {
      var raw = this._;

      if (raw === Infinity) {
        return "inf";
      }
      if (raw === -Infinity) {
        return "-inf";
      }
      if (isNaN(raw)) {
        return "nan";
      }

      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Float.new is illegal, should use literal.");
    };

    spec.isFloat = utils.alwaysReturn$True;
    spec.asFloat = utils.nop;

    [
      [ "+"  , $SC.Float, $SC.Float ],
      [ "-"  , $SC.Float, $SC.Float ],
      [ "*"  , $SC.Float, $SC.Float ],
      [ "/"  , $SC.Float, $SC.Float ],
      [ "mod"     , $SC.Float  , $SC.Float   ],
      [ "div"     , $SC.Integer, $SC.Integer ],
      [ "pow"     , $SC.Float  , $SC.Float   ],
      [ "min"     , $SC.Float  , $SC.Float   ],
      [ "max"     , $SC.Float  , $SC.Float   ],
      [ "bitAnd"  , $SC.Float  , $SC.Float   ],
      [ "bitOr"   , $SC.Float  , $SC.Float   ],
      [ "bitXor"  , $SC.Float  , $SC.Float   ],
      [ "lcm"     , $SC.Float  , $SC.Float   ],
      [ "gcd"     , $SC.Float  , $SC.Float   ],
      [ "round"   , $SC.Float  , $SC.Float   ],
      [ "roundUp" , $SC.Float  , $SC.Float   ],
      [ "trunc"   , $SC.Float  , $SC.Float   ],
      [ "atan2"   , $SC.Float  , $SC.Float   ],
      [ "hypot"   , $SC.Float  , $SC.Float   ],
      [ "hypotApx", $SC.Float  , $SC.Float   ],
      [ "leftShift"         , $SC.Float, $SC.Float ],
      [ "rightShift"        , $SC.Float, $SC.Float ],
      [ "unsignedRightShift", $SC.Float, $SC.Float ],
      [ "ring1"   , $SC.Float, $SC.Float ],
      [ "ring2"   , $SC.Float, $SC.Float ],
      [ "ring3"   , $SC.Float, $SC.Float ],
      [ "ring4"   , $SC.Float, $SC.Float ],
      [ "difsqr"  , $SC.Float, $SC.Float ],
      [ "sumsqr"  , $SC.Float, $SC.Float ],
      [ "sqrsum"  , $SC.Float, $SC.Float ],
      [ "sqrdif"  , $SC.Float, $SC.Float ],
      [ "absdif"  , $SC.Float, $SC.Float ],
      [ "thresh"  , $SC.Float, $SC.Float ],
      [ "amclip"  , $SC.Float, $SC.Float ],
      [ "scaleneg", $SC.Float, $SC.Float ],
      [ "clip2"   , $SC.Float, $SC.Float ],
      [ "fold2"   , $SC.Float, $SC.Float ],
      [ "wrap2"   , $SC.Float, $SC.Float ],
      [ "excess"  , $SC.Float, $SC.Float ],
      [ "firstArg", $SC.Float, $SC.Float ],
      [ "rrand"   , $SC.Float, $SC.Float ],
      [ "exprand" , $SC.Float, $SC.Float ],
    ].forEach(function(items) {
      spec[items[0]] = prOpFloat.apply(null, items);
    });

    spec.clip = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _ClipFloat -->
      if ($lo.__tag === sc.C.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.C.TAG_SYM) {
        return $hi;
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

      return $SC.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    };

    spec.fold = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);

      // <-- _FoldFloat -->
      if ($lo.__tag === sc.C.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.C.TAG_SYM) {
        return $hi;
      }

      return $SC.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    };

    // TODO: implements coin
    // TODO: implements xrand2

    spec.as32Bits = function() {
      // <-- _As32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float32Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.high32Bits = function() {
      // <-- _High32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[1]
      );
    };

    spec.low32Bits = function() {
      // <-- _Low32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.$from32Bits = function($word) {
      // <-- _From32Bits -->
      return $SC.Float(
        new Float32Array(
          new Int32Array([ $word.__num__() ]).buffer
        )[0]
      );
    };

    spec.$from64Bits = function($hiWord, $loWord) {
      // <-- _From64Bits -->
      return $SC.Float(
        new Float64Array(
          new Int32Array([ $loWord.__num__(), $hiWord.__num__() ]).buffer
        )[0]
      );
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.float$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.float$reverseDo(this),
        $function
      );
      return this;
    };

    // TODO: implements asStringPrec
    // TODO: implements archiveAsCompileString
    // TODO: implements storeOn
    // TODO: implements switch

    spec.bitNot = function() {
      var f64 = new Float64Array([ this._ ]);
      var i32 = new Int32Array(f64.buffer);
      i32[0] = ~i32[0];
      return $SC.Float(f64[0]);
    };
  });

})(sc);

SCScript.install(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $ = sc.lang.$;
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

  sc.lang.klass.refine("Float", function(builder) {
    builder.addMethod("toString", function() {
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
    });

    builder.addClassMethod("new", function() {
      throw new Error("Float.new is illegal, should use literal.");
    });

    builder.addMethod("isFloat", sc.TRUE);
    builder.addMethod("asFloat");

    [
      [ "+"  , $.Float, $.Float ],
      [ "-"  , $.Float, $.Float ],
      [ "*"  , $.Float, $.Float ],
      [ "/"  , $.Float, $.Float ],
      [ "mod"     , $.Float  , $.Float   ],
      [ "div"     , $.Integer, $.Integer ],
      [ "pow"     , $.Float  , $.Float   ],
      [ "min"     , $.Float  , $.Float   ],
      [ "max"     , $.Float  , $.Float   ],
      [ "bitAnd"  , $.Float  , $.Float   ],
      [ "bitOr"   , $.Float  , $.Float   ],
      [ "bitXor"  , $.Float  , $.Float   ],
      [ "lcm"     , $.Float  , $.Float   ],
      [ "gcd"     , $.Float  , $.Float   ],
      [ "round"   , $.Float  , $.Float   ],
      [ "roundUp" , $.Float  , $.Float   ],
      [ "trunc"   , $.Float  , $.Float   ],
      [ "atan2"   , $.Float  , $.Float   ],
      [ "hypot"   , $.Float  , $.Float   ],
      [ "hypotApx", $.Float  , $.Float   ],
      [ "leftShift"         , $.Float, $.Float ],
      [ "rightShift"        , $.Float, $.Float ],
      [ "unsignedRightShift", $.Float, $.Float ],
      [ "ring1"   , $.Float, $.Float ],
      [ "ring2"   , $.Float, $.Float ],
      [ "ring3"   , $.Float, $.Float ],
      [ "ring4"   , $.Float, $.Float ],
      [ "difsqr"  , $.Float, $.Float ],
      [ "sumsqr"  , $.Float, $.Float ],
      [ "sqrsum"  , $.Float, $.Float ],
      [ "sqrdif"  , $.Float, $.Float ],
      [ "absdif"  , $.Float, $.Float ],
      [ "thresh"  , $.Float, $.Float ],
      [ "amclip"  , $.Float, $.Float ],
      [ "scaleneg", $.Float, $.Float ],
      [ "clip2"   , $.Float, $.Float ],
      [ "fold2"   , $.Float, $.Float ],
      [ "wrap2"   , $.Float, $.Float ],
      [ "excess"  , $.Float, $.Float ],
      [ "firstArg", $.Float, $.Float ],
      [ "rrand"   , $.Float, $.Float ],
      [ "exprand" , $.Float, $.Float ],
    ].forEach(function(items) {
      builder.addMethod(items[0], bop.apply(null, items));
    });

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _ClipFloat -->
      if ($lo.__tag === sc.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.TAG_SYM) {
        return $hi;
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

      return $.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    });

    builder.addMethod("fold", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _FoldFloat -->
      if ($lo.__tag === sc.TAG_SYM) {
        return $lo;
      }
      if ($hi.__tag === sc.TAG_SYM) {
        return $hi;
      }

      return $.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    });

    // TODO: implements coin
    // TODO: implements xrand2

    builder.addMethod("as32Bits", function() {
      // <-- _As32Bits -->
      return $.Integer(
        new Int32Array(
          new Float32Array([ this._ ]).buffer
        )[0]
      );
    });

    builder.addMethod("high32Bits", function() {
      // <-- _High32Bits -->
      return $.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[1]
      );
    });

    builder.addMethod("low32Bits", function() {
      // <-- _Low32Bits -->
      return $.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[0]
      );
    });

    builder.addClassMethod("from32Bits", {
      args: "word"
    }, function($word) {
      // <-- _From32Bits -->
      return $.Float(
        new Float32Array(
          new Int32Array([ $word.__num__() ]).buffer
        )[0]
      );
    });

    builder.addClassMethod("from64Bits", {
      args: "hiWord; loWord"
    }, function($hiWord, $loWord) {
      // <-- _From64Bits -->
      return $.Float(
        new Float64Array(
          new Int32Array([ $loWord.__num__(), $hiWord.__num__() ]).buffer
        )[0]
      );
    });

    builder.addMethod("do", function($function) {
      iterator.execute(
        iterator.float$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("reverseDo", function($function) {
      iterator.execute(
        iterator.float$reverseDo(this),
        $function
      );
      return this;
    });

    // TODO: implements asStringPrec
    // TODO: implements archiveAsCompileString
    // TODO: implements storeOn
    // TODO: implements switch

    builder.addMethod("bitNot",function() {
      var f64 = new Float64Array([ this._ ]);
      var i32 = new Int32Array(f64.buffer);
      i32[0] = ~i32[0];
      return $.Float(f64[0]);
    });
  });
});

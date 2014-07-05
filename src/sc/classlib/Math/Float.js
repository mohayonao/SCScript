SCScript.install(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $ = sc.lang.$;
  var mathlib = sc.libs.mathlib;

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

    builder.addMethod("isFloat", sc.TRUE);
    builder.addMethod("asFloat");

    builder.addMethod("+", bop("+", $.Float, $.Float));
    builder.addMethod("-", bop("-", $.Float, $.Float));
    builder.addMethod("*", bop("*", $.Float, $.Float));
    builder.addMethod("/", bop("/", $.Float, $.Float));
    builder.addMethod("mod", bop("mod", $.Float, $.Float));
    builder.addMethod("div", bop("div", $.Integer, $.Integer));
    builder.addMethod("pow", bop("pow", $.Float, $.Float));
    builder.addMethod("min", bop("min", $.Float, $.Float));
    builder.addMethod("max", bop("max", $.Float, $.Float));
    builder.addMethod("bitAnd", bop("bitAnd", $.Float, $.Float));
    builder.addMethod("bitOr", bop("bitOr", $.Float, $.Float));
    builder.addMethod("bitXor", bop("bitXor", $.Float, $.Float));
    builder.addMethod("lcm", bop("lcm", $.Float, $.Float));
    builder.addMethod("gcd", bop("gcd", $.Float, $.Float));
    builder.addMethod("round", bop("round", $.Float, $.Float));
    builder.addMethod("roundUp", bop("roundUp", $.Float, $.Float));
    builder.addMethod("trunc", bop("trunc", $.Float, $.Float));
    builder.addMethod("atan2", bop("atan2", $.Float, $.Float));
    builder.addMethod("hypot", bop("hypot", $.Float, $.Float));
    builder.addMethod("hypotApx", bop("hypotApx", $.Float, $.Float));
    builder.addMethod("leftShift", bop("leftShift", $.Float, $.Float));
    builder.addMethod("rightShift", bop("rightShift", $.Float, $.Float));
    builder.addMethod("unsignedRightShift", bop("unsignedRightShift", $.Float, $.Float));
    builder.addMethod("ring1", bop("ring1", $.Float, $.Float));
    builder.addMethod("ring2", bop("ring2", $.Float, $.Float));
    builder.addMethod("ring3", bop("ring3", $.Float, $.Float));
    builder.addMethod("ring4", bop("ring4", $.Float, $.Float));
    builder.addMethod("difsqr", bop("difsqr", $.Float, $.Float));
    builder.addMethod("sumsqr", bop("sumsqr", $.Float, $.Float));
    builder.addMethod("sqrsum", bop("sqrsum", $.Float, $.Float));
    builder.addMethod("sqrdif", bop("sqrdif", $.Float, $.Float));
    builder.addMethod("absdif", bop("absdif", $.Float, $.Float));
    builder.addMethod("thresh", bop("thresh", $.Float, $.Float));
    builder.addMethod("amclip", bop("amclip", $.Float, $.Float));
    builder.addMethod("scaleneg", bop("scaleneg", $.Float, $.Float));
    builder.addMethod("clip2", bop("clip2", $.Float, $.Float));
    builder.addMethod("fold2", bop("fold2", $.Float, $.Float));
    builder.addMethod("wrap2", bop("wrap2", $.Float, $.Float));
    builder.addMethod("excess", bop("excess", $.Float, $.Float));
    builder.addMethod("firstArg", bop("firstArg", $.Float, $.Float));
    builder.addMethod("rrand", bop("rrand", $.Float, $.Float));
    builder.addMethod("exprand", bop("exprand", $.Float, $.Float));

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
      sc.lang.iterator.execute(
        sc.lang.iterator.float$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("reverseDo", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.float$reverseDo(this),
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

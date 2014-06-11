(function() {
  "use strict";

  require("./AbstractFunction");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;

  describe("SCAbstractFunction", function() {
    var SCAbstractFunction;
    before(function() {
      SCAbstractFunction = $("AbstractFunction");
      this.createInstance = function(func) {
        var instance = $.Function(function() {
          return [ func || function() {} ];
        });
        var testMethod = this.test.title.substr(1);
        sc.test.setSingletonMethod(instance, "AbstractFunction", testMethod);
        return instance;
      };
    });

    it("#composeUnaryOp", sinon.test(function() {
      var instance, test, spy;
      var $aSelector;

      spy = this.spy(sc.test.func);
      $aSelector = $$();
      this.stub(sc.lang.klass, "get").withArgs("UnaryOpFunction").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.composeUnaryOp($aSelector);
      expect(spy).to.be.calledWith($aSelector, instance);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp", sinon.test(function() {
      var instance, test, spy;
      var $aSelector, $something, $adverb;

      spy = this.spy(sc.test.func);
      $aSelector = $$();
      $something = $$();
      $adverb    = $$();
      this.stub(sc.lang.klass, "get").withArgs("BinaryOpFunction").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.composeBinaryOp($aSelector, $something, $adverb);
      expect(spy).to.be.calledWith($aSelector, instance, $something, $adverb);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#reverseComposeBinaryOp", sinon.test(function() {
      var instance, test, spy;
      var $aSelector, $something, $adverb;

      spy = this.spy(sc.test.func);
      $aSelector = $$();
      $something = $$();
      $adverb    = $$();
      this.stub(sc.lang.klass, "get").withArgs("BinaryOpFunction").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($aSelector, $something, $adverb);
      expect(spy).to.be.calledWith($aSelector, $something, instance, $adverb);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#composeNAryOp", sinon.test(function() {
      var instance, test, spy;
      var $aSelector, $anArgList;

      spy = this.spy(sc.test.func);
      $aSelector = $$();
      $anArgList = $$();
      this.stub(sc.lang.klass, "get").withArgs("NAryOpFunction").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.composeNAryOp($aSelector, $anArgList);
      expect(spy).to.be.calledWith($aSelector, instance, $anArgList);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSimpleNumber", sinon.test(function() {
      var instance, test;
      var $aSelector, $aNumber, $adverb;

      $aSelector = $$();
      $aNumber   = $$();
      $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

      test = instance.performBinaryOpOnSimpleNumber($aSelector, $aNumber, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aNumber, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSignal", sinon.test(function() {
      var instance, test;
      var $aSelector, $aSignal, $adverb;

      $aSelector = $$();
      $aSignal   = $$();
      $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

      test = instance.performBinaryOpOnSignal($aSelector, $aSignal, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aSignal, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnComplex", sinon.test(function() {
      var instance, test;
      var $aSelector, $aComplex, $adverb;

      $aSelector = $$();
      $aComplex  = $$();
      $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

      test = instance.performBinaryOpOnComplex($aSelector, $aComplex, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aComplex, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSeqColl", sinon.test(function() {
      var instance, test;
      var $aSelector, $aSeqColl, $adverb;

      $aSelector = $$();
      $aSeqColl  = $$();
      $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

      test = instance.performBinaryOpOnSeqColl($aSelector, $aSeqColl, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aSeqColl, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));

    [
      "neg",
      "reciprocal",
      "bitNot",
      "abs",
      "asFloat",
      "asInteger",
      "ceil",
      "floor",
      "frac",
      "sign",
      "squared",
      "cubed",
      "sqrt",
      "exp",
      "midicps",
      "cpsmidi",
      "midiratio",
      "ratiomidi",
      "ampdb",
      "dbamp",
      "octcps",
      "cpsoct",
      "log",
      "log2",
      "log10",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "rand",
      "rand2",
      "linrand",
      "bilinrand",
      "sum3rand",
      "distort",
      "softclip",
      "coin",
      "even",
      "odd",
      "rectWindow",
      "hanWindow",
      "welWindow",
      "triWindow",
      "scurve",
      "ramp",
      "isPositive",
      "isNegative",
      "isStrictlyPositive",
      "rho",
      "theta",
      // ...
      "not",
      // "ref",
      "degrad",
      "raddeg",
    ].forEach(function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;

        instance = this.createInstance();
        this.stub(instance, "composeUnaryOp", sc.test.func);

        test = instance[methodName]();
        expect(instance.composeUnaryOp).to.be.calledWith($.Symbol(methodName));
        expect(instance.composeUnaryOp).to.be.calledLastIn(test);
      }));
    });

    it("#ref", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "composeUnaryOp", sc.test.func);

      test = instance.ref();
      expect(instance.composeUnaryOp).to.be.calledWith($$("\\asRef"));
      expect(instance.composeUnaryOp).to.be.calledLastIn(test);
    }));

    [
      "+",
      "-",
      "*",
      "/",
      "div",
      "mod",
      "pow",
      "min",
      "max",
      "<",
      "<=",
      ">",
      ">=",
      "bitAnd",
      "bitOr",
      "bitXor",
      "bitHammingDistance",
      "lcm",
      "gcd",
      "round",
      "roundUp",
      "trunc",
      "atan2",
      "hypot",
      "hypotApx",
      "leftShift",
      "rightShift",
      "unsignedRightShift",
      "ring1",
      "ring2",
      "ring3",
      "ring4",
      "difsqr",
      "sumsqr",
      "sqrsum",
      "sqrdif",
      "absdif",
      "thresh",
      "amclip",
      "scaleneg",
      "clip2",
      "fold2",
      "wrap2",
      "excess",
      "firstArg",
      "rrand",
      "exprand",
      "@",
      // ...
      "||",
      "&&",
      "xor",
      "nand",
    ].forEach(function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;
        var $function, $adverb;

        $function = $$();
        $adverb   = $$();

        instance = this.createInstance();
        this.stub(instance, "composeBinaryOp", sc.test.func);

        test = instance[methodName]($function, $adverb);
        expect(instance.composeBinaryOp).to.be.calledWith(
          $.Symbol(methodName), $function, $adverb
        );
        expect(instance.composeBinaryOp).to.be.calledLastIn(test);
      }));
    });
    it("#rotate", sinon.test(function() {
      var instance, test;
      var $function;

      $function = $$();

      instance = this.createInstance();
      this.stub(instance, "composeBinaryOp", sc.test.func);

      test = instance.rotate($function);
      expect(instance.composeBinaryOp).to.be.calledWith(
        $$("\\rotate"), $function
      );
      expect(instance.composeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#dist", sinon.test(function() {
      var instance, test;
      var $function;

      $function = $$();

      instance = this.createInstance();
      this.stub(instance, "composeBinaryOp", sc.test.func);

      test = instance.dist($function);
      expect(instance.composeBinaryOp).to.be.calledWith(
        $$("\\dist"), $function
      );
      expect(instance.composeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#real", function() {
      var instance = this.createInstance();
      expect(instance.real).to.be.nop;
    });
    it("#imag", function() {
      testCase(this, [
        [ null, [], $.Float(0.0) ]
      ]);
    });
    it("#clip", sinon.test(function() {
      var instance, test;
      var $lo, $hi;

      $lo = $$();
      $hi = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.clip($lo, $hi);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("clip");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $lo, $hi ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#wrap", sinon.test(function() {
      var instance, test;
      var $lo, $hi;

      $lo = $$();
      $hi = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.wrap($lo, $hi);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("wrap");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $lo, $hi ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#fold", sinon.test(function() {
      var instance, test;
      var $lo, $hi;

      $lo = $$();
      $hi = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.fold($lo, $hi);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("fold");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $lo, $hi ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#blend", sinon.test(function() {
      var instance, test;
      var $that, $blendFrac;

      $that      = $$();
      $blendFrac = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.blend($that, $blendFrac);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("blend");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $that, $blendFrac ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#linlin", sinon.test(function() {
      var instance, test;
      var $inMin, $inMax, $outMin, $outMax, $clip;

      $inMin  = $$();
      $inMax  = $$();
      $outMin = $$();
      $outMax = $$();
      $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.linlin($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("linlin");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $inMin, $inMax, $outMin, $outMax, $clip ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#linexp", sinon.test(function() {
      var instance, test;
      var $inMin, $inMax, $outMin, $outMax, $clip;

      $inMin  = $$();
      $inMax  = $$();
      $outMin = $$();
      $outMax = $$();
      $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.linexp($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("linexp");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $inMin, $inMax, $outMin, $outMax, $clip ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#explin", sinon.test(function() {
      var instance, test;
      var $inMin, $inMax, $outMin, $outMax, $clip;

      $inMin  = $$();
      $inMax  = $$();
      $outMin = $$();
      $outMax = $$();
      $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.explin($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("explin");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $inMin, $inMax, $outMin, $outMax, $clip ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#expexp", sinon.test(function() {
      var instance, test;
      var $inMin, $inMax, $outMin, $outMax, $clip;

      $inMin  = $$();
      $inMax  = $$();
      $outMin = $$();
      $outMax = $$();
      $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.expexp($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("expexp");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $inMin, $inMax, $outMin, $outMax, $clip ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#lincurve", sinon.test(function() {
      var instance, test;
      var $inMin, $inMax, $outMin, $outMax, $curve, $clip;

      $inMin  = $$();
      $inMax  = $$();
      $outMin = $$();
      $outMax = $$();
      $curve  = $$();
      $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.lincurve($inMin, $inMax, $outMin, $outMax, $curve, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("lincurve");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#curvelin", sinon.test(function() {
      var instance, test;
      var $inMin, $inMax, $outMin, $outMax, $curve, $clip;

      $inMin  = $$();
      $inMax  = $$();
      $outMin = $$();
      $outMax = $$();
      $curve  = $$();
      $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.curvelin($inMin, $inMax, $outMin, $outMax, $curve, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("curvelin");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#bilin", sinon.test(function() {
      var instance, test;
      var $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip;

      $inCenter  = $$();
      $inMin     = $$();
      $inMax     = $$();
      $outCenter = $$();
      $outMin    = $$();
      $outMax    = $$();
      $clip      = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.bilin($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("bilin");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#biexp", sinon.test(function() {
      var instance, test;
      var $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip;

      $inCenter  = $$();
      $inMin     = $$();
      $inMax     = $$();
      $outCenter = $$();
      $outMin    = $$();
      $outMax    = $$();
      $clip      = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.biexp($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("biexp");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#moddif", sinon.test(function() {
      var instance, test;
      var $function, $mod;

      $function = $$();
      $mod      = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.moddif($function, $mod);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("moddif");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $function, $mod ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#degreeToKey", sinon.test(function() {
      var instance, test;
      var $scale          = $$();
      var $stepsPerOctave = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func);

      test = instance.degreeToKey($scale, $stepsPerOctave);
      expect(instance.composeNAryOp.args[0][0])
        .to.be.a("SCSymbol").that.equal("degreeToKey");
      expect(instance.composeNAryOp.args[0][1])
        .to.be.a("SCArray").that.eqls([ $scale, $stepsPerOctave ]);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#applyTo", sinon.test(function() {
      var instance, test;
      var $arg1, $arg2;

      $arg1 = $$();
      $arg2 = $$();

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func);

      test = instance.applyTo($arg1, $arg2);
      expect(instance.value).to.be.calledWith($arg1, $arg2);
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it.skip("#<>", function() {
    });
    it.skip("#sampled", function() {
    });
    it("#asUGenInput", sinon.test(function() {
      var instance, test;
      var $for;

      $for = $$();

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func);

      test = instance.asUGenInput($for);
      expect(instance.value).to.be.calledWith($for);
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it("asAudioRateInput", sinon.test(function() {
      var instance, test, spy, rate;
      var $result;

      spy = this.spy(sc.test.func);
      $result = $$({
        rate: function() {
          return $.Symbol(rate);
        }
      });
      this.stub(sc.lang.klass, "get").withArgs("K2A").returns($$({
        ar: spy
      }));

      instance = this.createInstance();
      this.stub(instance, "value", function() {
        return $result;
      });

      rate = "audio";
      test = instance.asAudioRateInput();
      expect(test).to.equal($result);
      expect(spy).to.be.not.called;
      spy.reset();

      rate = "control";
      test = instance.asAudioRateInput();
      expect(spy).to.be.calledWith($result);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#asControlInput", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func);

      test = instance.asControlInput();
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it("#isValidUGenInput", function() {
      testCase(this, [
        [ null, [], true ]
      ]);
    });
  });

  describe("SCUnaryOpFunction", function() {
    var SCUnaryOpFunction;
    before(function() {
      SCUnaryOpFunction = $("UnaryOpFunction");
      this.createInstance = function() {
        var instance;

        instance = $$(function($a, $b) {
          return $a ["+"] ($b);
        });
        instance = instance.neg();

        return instance;
      };
    });
    it("#value", function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a + b }.neg ");

      test = instance.value($$(10), $$(100));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it("#valueArray", function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a + b }.neg ");

      test = instance.valueArray($$([ 10, 100 ]));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it.skip("#valueEnvir", function() {
    });
    it.skip("#valueArrayEnvir", function() {
    });
    it("#functionPerformList", sinon.test(function() {
      var test, instance;
      var $selector, $arglist;

      $selector = $$();
      $arglist  = $$();

      instance = this.createInstance("{|a, b| a + b }.neg");
      this.stub(instance, "performList", sc.test.func);

      test = instance.functionPerformList($selector, $arglist);
      expect(instance.performList).to.be.calledWith($selector, $arglist);
      expect(instance.performList).to.be.calledLastIn(test);
    }));
  });

  describe("SCBinaryOpFunction", function() {
    var SCBinaryOpFunction;
    before(function() {
      SCBinaryOpFunction = $("BinaryOpFunction");
      this.createInstance = function() {
        var instance;

        instance = $$(function($a, $b) {
          return $a ["+"] ($b);
        });
        instance = instance ["*"] ($$(-1));

        return instance;
      };
    });
    it("#value", function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a * b} * -1");

      test = instance.value($$(10), $$(100));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it("#valueArray", function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a * b} * -1");

      test = instance.valueArray($$([ 10, 100 ]));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it.skip("#valueEnvir", function() {
    });
    it.skip("#valueArrayEnvir", function() {
    });
    it("#functionPerformList", sinon.test(function() {
      var test, instance;
      var $selector, $arglist;

      $selector = $$();
      $arglist  = $$();

      instance = this.createInstance("{|a, b| a * b} * -1");
      this.stub(instance, "performList", sc.test.func);

      test = instance.functionPerformList($selector, $arglist);
      expect(instance.performList).to.be.calledWith($selector, $arglist);
      expect(instance.performList).to.be.calledLastIn(test);
    }));
  });

  describe("SCNAryOpFunction", function() {
    var SCNAryOpFunction;
    before(function() {
      SCNAryOpFunction = $("NAryOpFunction");
      this.createInstance = function() {
        var instance;

        instance = $$(function($a, $b) {
          return $a ["+"] ($b);
        });
        instance = instance.wrap($$(-199), $$(20));

        return instance;
      };
    });
    it("#value", function() {
      var test, instance;

      instance = this.createInstance("{|a, b| a + b}.wrap(-199, 20)");

      test = instance.value($$(10), $$(100));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it("#valueArray", function() {
      var test, instance;

      instance = this.createInstance("{|a, b| a + b}.wrap(-199, 20)");

      test = instance.valueArray($$([ 10, 100 ]));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it.skip("#valueEnvir", function() {
    });
    it.skip("#valueArrayEnvir", function() {
    });
    it("#functionPerformList", sinon.test(function() {
      var test, instance;
      var $selector, $arglist;

      $selector = $$();
      $arglist  = $$();

      instance = this.createInstance("{|a, b| a + b}.wrap(-199, 20)");
      this.stub(instance, "performList", sc.test.func);

      test = instance.functionPerformList($selector, $arglist);
      expect(instance.performList).to.be.calledWith($selector, $arglist);
      expect(instance.performList).to.be.calledLastIn(test);
    }));
  });

  describe("SCFunctionList", function() {
    var SCFunctionList;
    var $int10, $int20, $int5;
    before(function() {
      SCFunctionList = $("FunctionList");
      this.createInstance = function() {
        var instance = SCFunctionList.new($$([
          function($a, $b) {
            return $a ["+"] ($b);
          },
          function($a, $b) {
            return $a ["-"] ($b);
          },
          function($a, $b) {
            return $a ["*"] ($b);
          },
          function($a, $b) {
            return $a ["/"] ($b);
          },
        ]));
        return instance;
      };
      $int10 = $$(10);
      $int20 = $$(20);
      $int5  = $$(5);
    });
    describe("operate function list", function() {
      var instance;
      var $arg1, $arg2, $arg3, $arg4;
      before(function() {
        instance = this.createInstance();

        $arg1 = $$();
        $arg2 = $$();
        $arg3 = $$();
        $arg4 = $$();
      });
      it("<>array", function() {
        var test;

        test = instance.array_($$([ $arg1, $arg2 ]));
        expect(test).to.be.equal(instance);
        expect(instance.array()).to.be.a("SCArray").that.eqls([
          $arg1, $arg2
        ]);
      });
      it("#addFunc", function() {
        var test;

        test = instance.addFunc($arg3);
        expect(test).to.be.equal(instance);
        expect(instance.array()).to.be.a("SCArray").that.eqls([
          $arg1, $arg2, $arg3
        ]);
      });
      it("#replaceFunc", function() {
        var test;

        test = instance.replaceFunc($arg2, $arg4);
        expect(test).to.be.equal(instance);
        expect(instance.array()).to.be.a("SCArray").that.eqls([
          $arg1, $arg4, $arg3
        ]);
      });
      it("#removeFunc", function() {
        var test;

        test = instance.removeFunc($arg4);
        expect(test).to.be.equal(instance);
        expect(instance.array()).to.be.a("SCArray").that.eqls([
          $arg1, $arg3
        ]);

        test = instance.removeFunc($arg1);
        expect(test).to.equal($arg3);
      });
    });
    it("#addFunc.failed", function() {
      var instance = this.createInstance().flop();
      expect(function() {
        instance.addFunc();
      }).to.throw("cannot add a function to a flopped FunctionList");
    });
    it("#value", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.value($$([ $int10, $int20 ]), $int5);
      expect(test).to.be.a("SCArray").that.eqls([
        [ 15, 25 ], [ 5, 15 ], [ 50, 100 ], [ 2, 4 ]
      ]);
    });
    it("#value.flopped", function() {
      var instance, test;

      instance = this.createInstance();
      instance = instance.flop();

      test = instance.value($$([ $int10, $int20 ]), $int5);
      expect(test).to.be.a("SCArray").that.eqls([
        [ 15, 5, 50, 2 ], [ 25, 15, 100, 4 ]
      ]);
    });
    it("#valueArray", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.valueArray($$([
        [ $int10, $int20 ], $int5
      ]));
      expect(test).to.be.a("SCArray").that.eqls([
        [ 15, 25 ], [ 5, 15 ], [ 50, 100 ], [ 2, 4 ]
      ]);
    });
    it("#valueArray.flopped", function() {
      var instance, test;

      instance = this.createInstance();
      instance = instance.flop();

      test = instance.valueArray($$([
        [ $int10, $int20 ], $int5
      ]));
      expect(test).to.be.a("SCArray").that.eqls([
        [ 15, 5, 50, 2 ], [ 25, 15, 100, 4 ]
      ]);
    });
    it.skip("#valueEnvir", function() {
    });
    it.skip("#valueArrayEnvir", function() {
    });
    it("#do", sinon.test(function() {
      var instance, test;
      var $elem1, $elem2, $function;

      $elem1 = $$();
      $elem2 = $$();
      $function = $$({ value: this.spy() });

      instance = this.createInstance();
      instance.array_($$([ $elem1, $elem2 ]));

      test = instance.do($function);
      expect(test).to.equal(instance);
      expect($function.value).to.callCount(2);
      expect($function.value.args[0][0]).to.equal($elem1);
      expect($function.value.args[1][0]).to.equal($elem2);
    }));
    it("#flop", function() {
      var instance, test;
      var $array;

      instance = this.createInstance();
      $array = instance.array();
      expect(instance.flopped()).to.be.a("SCBoolean").that.is.false;

      test = instance.flop();
      expect(test).to.equal(instance);
      expect($array).to.not.equal(instance.array());
      expect(instance.flopped()).to.be.a("SCBoolean").that.is.true;

      $array = instance.array();
      test = instance.flop();
      expect(test).to.equal(instance);
      expect($array).to.equal(instance.array());
      expect(instance.flopped()).to.be.a("SCBoolean").that.is.true;
    });
    it.skip("#envirFlop", function() {
    });
    it("#storeArgs", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.storeArgs();

      expect(test).to.be.a("SCArray").that.eqls([
        instance._$array.valueOf()
      ]);
    });
  });
})();

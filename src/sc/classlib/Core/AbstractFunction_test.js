(function() {
  "use strict";

  require("./AbstractFunction");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var SCFunctionList = $("FunctionList");
  var $int10 = $$(10);
  var $int20 = $$(20);
  var $int5  = $$(5);

  describe("SCAbstractFunction", function() {
    before(function() {
      this.createInstance = function(func) {
        var instance = $.Func(func);
        return $$(instance, "AbstractFunction" + this.test.title);
      };
    });

    it("#composeUnaryOp", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var SCUnaryOpFunction$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("UnaryOpFunction").returns($$({
        new: SCUnaryOpFunction$new
      }));

      test = instance.composeUnaryOp($aSelector);
      expect(SCUnaryOpFunction$new).to.be.calledWith($aSelector, instance);
      expect(SCUnaryOpFunction$new).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $something = $$();
      var $adverb    = $$();
      var SCBinaryOpFunction$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("BinaryOpFunction").returns($$({
        new: SCBinaryOpFunction$new
      }));

      test = instance.composeBinaryOp($aSelector, $something, $adverb);
      expect(SCBinaryOpFunction$new).to.be.calledWith($aSelector, instance, $something, $adverb);
      expect(SCBinaryOpFunction$new).to.be.calledLastIn(test);
    }));
    it("#reverseComposeBinaryOp", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $something = $$();
      var $adverb    = $$();
      var SCBinaryOpFunction$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("BinaryOpFunction").returns($$({
        new: SCBinaryOpFunction$new
      }));

      test = instance.reverseComposeBinaryOp($aSelector, $something, $adverb);
      expect(SCBinaryOpFunction$new).to.be.calledWith($aSelector, $something, instance, $adverb);
      expect(SCBinaryOpFunction$new).to.be.calledLastIn(test);
    }));
    it("#composeNAryOp", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $anArgList = $$();
      var SCNAryOpFunction$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("NAryOpFunction").returns($$({
        new: SCNAryOpFunction$new
      }));

      test = instance.composeNAryOp($aSelector, $anArgList);
      expect(SCNAryOpFunction$new).to.be.calledWith($aSelector, instance, $anArgList);
      expect(SCNAryOpFunction$new).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSimpleNumber", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $aNumber   = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func());

      test = instance.performBinaryOpOnSimpleNumber($aSelector, $aNumber, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aNumber, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSignal", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $aSignal   = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func());

      test = instance.performBinaryOpOnSignal($aSelector, $aSignal, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aSignal, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnComplex", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $aComplex  = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func());

      test = instance.performBinaryOpOnComplex($aSelector, $aComplex, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aComplex, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSeqColl", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $aSeqColl  = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "reverseComposeBinaryOp", sc.test.func());

      test = instance.performBinaryOpOnSeqColl($aSelector, $aSeqColl, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aSeqColl, $adverb);
      expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
    }));

    _.each([
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
    ], function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;

        instance = this.createInstance();
        this.stub(instance, "composeUnaryOp", sc.test.func());

        test = instance[methodName]();
        expect(instance.composeUnaryOp).to.be.calledWith($.Symbol(methodName));
        expect(instance.composeUnaryOp).to.be.calledLastIn(test);
      }));
    });

    it("#ref", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "composeUnaryOp", sc.test.func());

      test = instance.ref();
      expect(instance.composeUnaryOp).to.be.calledWith($$("\\asRef"));
      expect(instance.composeUnaryOp).to.be.calledLastIn(test);
    }));

    _.each([
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
    ], function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;
        var $function = $$();
        var $adverb   = $$();

        instance = this.createInstance();
        this.stub(instance, "composeBinaryOp", sc.test.func());

        test = instance[methodName]($function, $adverb);
        expect(instance.composeBinaryOp).to.be.calledWith(
          $.Symbol(methodName), $function, $adverb
        );
        expect(instance.composeBinaryOp).to.be.calledLastIn(test);
      }));
    });
    it("#rotate", sinon.test(function() {
      var instance, test;
      var $function = $$();

      instance = this.createInstance();
      this.stub(instance, "composeBinaryOp", sc.test.func());

      test = instance.rotate($function);
      expect(instance.composeBinaryOp).to.be.calledWith(
        $$("\\rotate"), $function
      );
      expect(instance.composeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#dist", sinon.test(function() {
      var instance, test;
      var $function = $$();

      instance = this.createInstance();
      this.stub(instance, "composeBinaryOp", sc.test.func());

      test = instance.dist($function);
      expect(instance.composeBinaryOp).to.be.calledWith(
        $$("\\dist"), $function
      );
      expect(instance.composeBinaryOp).to.be.calledLastIn(test);
    }));
    it("#real", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.real).to.doNothing;
    });
    it("#imag", function() {
      testCase(this, [
        [ null, [], $.Float(0.0) ]
      ]);
    });
    it("#clip", sinon.test(function() {
      var instance, test;
      var $lo = $$();
      var $hi = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.clip($lo, $hi);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\clip", [ $lo, $hi ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#wrap", sinon.test(function() {
      var instance, test;
      var $lo = $$();
      var $hi = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.wrap($lo, $hi);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\wrap", [ $lo, $hi ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#fold", sinon.test(function() {
      var instance, test;
      var $lo = $$();
      var $hi = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.fold($lo, $hi);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\fold", [ $lo, $hi ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#blend", sinon.test(function() {
      var instance, test;
      var $that      = $$();
      var $blendFrac = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.blend($that, $blendFrac);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\blend", [ $that, $blendFrac ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#linlin", sinon.test(function() {
      var instance, test;
      var $inMin  = $$();
      var $inMax  = $$();
      var $outMin = $$();
      var $outMax = $$();
      var $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.linlin($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\linlin", [ $inMin, $inMax, $outMin, $outMax, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#linexp", sinon.test(function() {
      var instance, test;
      var $inMin  = $$();
      var $inMax  = $$();
      var $outMin = $$();
      var $outMax = $$();
      var $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.linexp($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\linexp", [ $inMin, $inMax, $outMin, $outMax, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#explin", sinon.test(function() {
      var instance, test;
      var $inMin  = $$();
      var $inMax  = $$();
      var $outMin = $$();
      var $outMax = $$();
      var $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.explin($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\explin", [ $inMin, $inMax, $outMin, $outMax, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#expexp", sinon.test(function() {
      var instance, test;
      var $inMin  = $$();
      var $inMax  = $$();
      var $outMin = $$();
      var $outMax = $$();
      var $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.expexp($inMin, $inMax, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\expexp", [ $inMin, $inMax, $outMin, $outMax, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#lincurve", sinon.test(function() {
      var instance, test;
      var $inMin  = $$();
      var $inMax  = $$();
      var $outMin = $$();
      var $outMax = $$();
      var $curve  = $$();
      var $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.lincurve($inMin, $inMax, $outMin, $outMax, $curve, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\lincurve", [ $inMin, $inMax, $outMin, $outMax, $curve, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#curvelin", sinon.test(function() {
      var instance, test;
      var $inMin  = $$();
      var $inMax  = $$();
      var $outMin = $$();
      var $outMax = $$();
      var $curve  = $$();
      var $clip   = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.curvelin($inMin, $inMax, $outMin, $outMax, $curve, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\curvelin", [ $inMin, $inMax, $outMin, $outMax, $curve, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#bilin", sinon.test(function() {
      var instance, test;
      var $inCenter  = $$();
      var $inMin     = $$();
      var $inMax     = $$();
      var $outCenter = $$();
      var $outMin    = $$();
      var $outMax    = $$();
      var $clip      = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.bilin($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\bilin", [ $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#biexp", sinon.test(function() {
      var instance, test;
      var $inCenter  = $$();
      var $inMin     = $$();
      var $inMax     = $$();
      var $outCenter = $$();
      var $outMin    = $$();
      var $outMax    = $$();
      var $clip      = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.biexp($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\biexp", [ $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#moddif", sinon.test(function() {
      var instance, test;
      var $function = $$();
      var $mod      = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.moddif($function, $mod);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\moddif", [ $function, $mod ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#degreeToKey", sinon.test(function() {
      var instance, test;
      var $scale          = $$();
      var $stepsPerOctave = $$();

      instance = this.createInstance();
      this.stub(instance, "composeNAryOp", sc.test.func());

      test = instance.degreeToKey($scale, $stepsPerOctave);
      expect(instance.composeNAryOp.args[0]).to.eql($$([
        "\\degreeToKey", [ $scale, $stepsPerOctave ]
      ])._);
      expect(instance.composeNAryOp).to.be.calledLastIn(test);
    }));
    it("#applyTo", sinon.test(function() {
      var instance, test;
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

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
      var $for = $$();

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

      test = instance.asUGenInput($for);
      expect(instance.value).to.be.calledWith($for);
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it("#asAudioRateInput", sinon.test(function() {
      var instance, test;
      var $result = $$({
        rate: function() {
          return $.Symbol(rate);
        }
      });
      var SCK2A$ar = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("K2A").returns($$({
        ar: SCK2A$ar
      }));
      this.stub(instance, "value", function() {
        return $result;
      });

      var rate;

      rate = "audio";
      test = instance.asAudioRateInput();
      expect(test).to.equal($result);
      expect(SCK2A$ar).to.be.not.called;
      SCK2A$ar.reset();

      rate = "control";
      test = instance.asAudioRateInput();
      expect(SCK2A$ar).to.be.calledWith($result);
      expect(SCK2A$ar).to.be.calledLastIn(test);
    }));
    it("#asControlInput", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

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
    before(function() {
      this.createInstance = function() {
        var instance;

        instance = $$(function($a, $b) {
          return $a ["+"] ($b);
        }, "a; b");
        instance = instance.neg();

        return instance;
      };
    });
    it("#value", function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a + b }.neg");

      test = instance.value($$(10), $$(100));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it("#valueArray", function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a + b }.neg");

      test = instance.valueArray($$([ 10, 100 ]));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    });
    it("#valueEnvir", sc.test(function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a + b }.neg");

      $.Environment("b", $$(100));

      test = instance.valueEnvir($$(10));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    }));
    it("#valueArrayEnvir", sc.test(function() {
      var instance, test;

      instance = this.createInstance("{|a, b| a + b }.neg");

      $.Environment("b", $$(100));

      test = instance.valueArrayEnvir($$([ 10 ]));
      expect(test).to.be.a("SCInteger").that.equals(-110);
    }));
    it("#functionPerformList", sinon.test(function() {
      var test, instance;
      var $selector, $arglist;

      $selector = $$();
      $arglist  = $$();

      instance = this.createInstance("{|a, b| a + b }.neg");
      this.stub(instance, "performList", sc.test.func());

      test = instance.functionPerformList($selector, $arglist);
      expect(instance.performList).to.be.calledWith($selector, $arglist);
      expect(instance.performList).to.be.calledLastIn(test);
    }));
  });

  describe("SCBinaryOpFunction", function() {
    before(function() {
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
      var $selector = $$();
      var $arglist  = $$();

      instance = this.createInstance("{|a, b| a * b} * -1");
      this.stub(instance, "performList", sc.test.func());

      test = instance.functionPerformList($selector, $arglist);
      expect(instance.performList).to.be.calledWith($selector, $arglist);
      expect(instance.performList).to.be.calledLastIn(test);
    }));
  });

  describe("SCNAryOpFunction", function() {
    before(function() {
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
      var $selector = $$();
      var $arglist  = $$();

      instance = this.createInstance("{|a, b| a + b}.wrap(-199, 20)");
      this.stub(instance, "performList", sc.test.func());

      test = instance.functionPerformList($selector, $arglist);
      expect(instance.performList).to.be.calledWith($selector, $arglist);
      expect(instance.performList).to.be.calledLastIn(test);
    }));
  });

  describe("SCFunctionList", function() {
    before(function() {
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
      var instance;

      instance = this.createInstance().flop();
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
      var $elem1 = $$();
      var $elem2 = $$();
      var func = this.spy();
      var $function = $$(func);

      instance = this.createInstance();
      instance.array_($$([ $elem1, $elem2 ]));

      test = instance.do($function);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.eql($$([ $elem1, 0 ])._);
      expect(func.args[1]).to.eql($$([ $elem2, 1 ])._);
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

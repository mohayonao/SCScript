"use strict";

require("./AbstractFunction");

var testCase = sc.test.testCase;

var $SC = sc.lang.$SC;

describe("SCAbstractFunction", function() {
  var SCAbstractFunction;
  before(function() {
    SCAbstractFunction = $SC.Class("AbstractFunction");
    this.createInstance = function(func) {
      var instance = $SC.Function(func || function() {});
      var testMethod = this.test.title.substr(1);
      sc.test.setSingletonMethod(instance, "AbstractFunction", testMethod);
      return instance;
    };
  });

  it("#composeUnaryOp", sinon.test(function() {
    var instance, test, spy;
    var $aSelector;

    spy = this.spy(sc.test.func);
    $aSelector = sc.test.object();
    this.stub($SC, "Class").withArgs("UnaryOpFunction").returns(sc.test.object({
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
    $aSelector = sc.test.object();
    $something = sc.test.object();
    $adverb    = sc.test.object();
    this.stub($SC, "Class").withArgs("BinaryOpFunction").returns(sc.test.object({
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
    $aSelector = sc.test.object();
    $something = sc.test.object();
    $adverb    = sc.test.object();
    this.stub($SC, "Class").withArgs("BinaryOpFunction").returns(sc.test.object({
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
    $aSelector = sc.test.object();
    $anArgList = sc.test.object();
    this.stub($SC, "Class").withArgs("NAryOpFunction").returns(sc.test.object({
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

    $aSelector = sc.test.object();
    $aNumber   = sc.test.object();
    $adverb    = sc.test.object();

    instance = this.createInstance();
    this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

    test = instance.performBinaryOpOnSimpleNumber($aSelector, $aNumber, $adverb);
    expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aNumber, $adverb);
    expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
  }));
  it("#performBinaryOpOnSignal", sinon.test(function() {
    var instance, test;
    var $aSelector, $aSignal, $adverb;

    $aSelector = sc.test.object();
    $aSignal   = sc.test.object();
    $adverb    = sc.test.object();

    instance = this.createInstance();
    this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

    test = instance.performBinaryOpOnSignal($aSelector, $aSignal, $adverb);
    expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aSignal, $adverb);
    expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
  }));
  it("#performBinaryOpOnComplex", sinon.test(function() {
    var instance, test;
    var $aSelector, $aComplex, $adverb;

    $aSelector = sc.test.object();
    $aComplex  = sc.test.object();
    $adverb    = sc.test.object();

    instance = this.createInstance();
    this.stub(instance, "reverseComposeBinaryOp", sc.test.func);

    test = instance.performBinaryOpOnComplex($aSelector, $aComplex, $adverb);
    expect(instance.reverseComposeBinaryOp).to.be.calledWith($aSelector, $aComplex, $adverb);
    expect(instance.reverseComposeBinaryOp).to.be.calledLastIn(test);
  }));
  it("#performBinaryOpOnSeqColl", sinon.test(function() {
    var instance, test;
    var $aSelector, $aSeqColl, $adverb;

    $aSelector = sc.test.object();
    $aSeqColl  = sc.test.object();
    $adverb    = sc.test.object();

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
      expect(instance.composeUnaryOp).to.be.calledWith($SC.Symbol(methodName));
      expect(instance.composeUnaryOp).to.be.calledLastIn(test);
    }));
  });

  it("#ref", sinon.test(function() {
    var instance, test;

    instance = this.createInstance();
    this.stub(instance, "composeUnaryOp", sc.test.func);

    test = instance.ref();
    expect(instance.composeUnaryOp).to.be.calledWith($SC.Symbol("asRef"));
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

      $function = sc.test.object();
      $adverb   = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "composeBinaryOp", sc.test.func);

      test = instance[methodName]($function, $adverb);
      expect(instance.composeBinaryOp).to.be.calledWith(
        $SC.Symbol(methodName), $function, $adverb
      );
      expect(instance.composeBinaryOp).to.be.calledLastIn(test);
    }));
  });
  it("#rotate", sinon.test(function() {
    var instance, test;
    var $function;

    $function = sc.test.object();

    instance = this.createInstance();
    this.stub(instance, "composeBinaryOp", sc.test.func);

    test = instance.rotate($function);
    expect(instance.composeBinaryOp).to.be.calledWith(
      $SC.Symbol("rotate"), $function
    );
    expect(instance.composeBinaryOp).to.be.calledLastIn(test);
  }));
  it("#dist", sinon.test(function() {
    var instance, test;
    var $function;

    $function = sc.test.object();

    instance = this.createInstance();
    this.stub(instance, "composeBinaryOp", sc.test.func);

    test = instance.dist($function);
    expect(instance.composeBinaryOp).to.be.calledWith(
      $SC.Symbol("dist"), $function
    );
    expect(instance.composeBinaryOp).to.be.calledLastIn(test);
  }));
  it("#real", function() {
    var instance = this.createInstance();
    expect(instance.real).to.be.nop;
  });
  it("#imag", function() {
    testCase(this, [
      [ null, [], $SC.Float(0.0) ]
    ]);
  });
  it("#clip", sinon.test(function() {
    var instance, test;
    var $lo, $hi;

    $lo = sc.test.object();
    $hi = sc.test.object();

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

    $lo = sc.test.object();
    $hi = sc.test.object();

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

    $lo = sc.test.object();
    $hi = sc.test.object();

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

    $that      = sc.test.object();
    $blendFrac = sc.test.object();

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

    $inMin  = sc.test.object();
    $inMax  = sc.test.object();
    $outMin = sc.test.object();
    $outMax = sc.test.object();
    $clip   = sc.test.object();

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

    $inMin  = sc.test.object();
    $inMax  = sc.test.object();
    $outMin = sc.test.object();
    $outMax = sc.test.object();
    $clip   = sc.test.object();

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

    $inMin  = sc.test.object();
    $inMax  = sc.test.object();
    $outMin = sc.test.object();
    $outMax = sc.test.object();
    $clip   = sc.test.object();

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

    $inMin  = sc.test.object();
    $inMax  = sc.test.object();
    $outMin = sc.test.object();
    $outMax = sc.test.object();
    $clip   = sc.test.object();

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

    $inMin  = sc.test.object();
    $inMax  = sc.test.object();
    $outMin = sc.test.object();
    $outMax = sc.test.object();
    $curve  = sc.test.object();
    $clip   = sc.test.object();

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

    $inMin  = sc.test.object();
    $inMax  = sc.test.object();
    $outMin = sc.test.object();
    $outMax = sc.test.object();
    $curve  = sc.test.object();
    $clip   = sc.test.object();

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

    $inCenter  = sc.test.object();
    $inMin     = sc.test.object();
    $inMax     = sc.test.object();
    $outCenter = sc.test.object();
    $outMin    = sc.test.object();
    $outMax    = sc.test.object();
    $clip      = sc.test.object();

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

    $inCenter  = sc.test.object();
    $inMin     = sc.test.object();
    $inMax     = sc.test.object();
    $outCenter = sc.test.object();
    $outMin    = sc.test.object();
    $outMax    = sc.test.object();
    $clip      = sc.test.object();

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

    $function = sc.test.object();
    $mod      = sc.test.object();

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
    var $scale          = sc.test.object();
    var $stepsPerOctave = sc.test.object();

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

    $arg1 = sc.test.object();
    $arg2 = sc.test.object();

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

    $for = sc.test.object();

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
    $result = sc.test.object({
      rate: function() {
        return $SC.Symbol(rate);
      }
    });
    this.stub($SC, "Class").withArgs("K2A").returns(sc.test.object({
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
    SCUnaryOpFunction = $SC.Class("UnaryOpFunction");
    this.createInstance = function() {
      var instance;

      instance = $SC.Function(function($a, $b) {
        return $a ["+"] ($b);
      });
      instance = instance.neg();

      return instance;
    };
  });
  it("#value", function() {
    var instance, test;

    instance = this.createInstance("{|a, b| a + b }.neg ");

    test = instance.value($SC.Integer(10), $SC.Integer(100));
    expect(test).to.be.a("SCInteger").that.equals(-110);
  });
  it("#valueArray", function() {
    var instance, test;

    instance = this.createInstance("{|a, b| a + b }.neg ");

    test = instance.valueArray($SC.Array([
      $SC.Integer(10), $SC.Integer(100)
    ]));
    expect(test).to.be.a("SCInteger").that.equals(-110);
  });
  it.skip("#valueEnvir", function() {
  });
  it.skip("#valueArrayEnvir", function() {
  });
  it("#functionPerformList", sinon.test(function() {
    var test, instance;
    var $selector, $arglist;

    $selector = sc.test.object();
    $arglist  = sc.test.object();

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
    SCBinaryOpFunction = $SC.Class("BinaryOpFunction");
    this.createInstance = function() {
      var instance;

      instance = $SC.Function(function($a, $b) {
        return $a ["+"] ($b);
      });
      instance = instance ["*"] ($SC.Integer(-1));

      return instance;
    };
  });
  it("#value", function() {
    var instance, test;

    instance = this.createInstance("{|a, b| a * b} * -1");

    test = instance.value($SC.Integer(10), $SC.Integer(100));
    expect(test).to.be.a("SCInteger").that.equals(-110);
  });
  it("#valueArray", function() {
    var instance, test;

    instance = this.createInstance("{|a, b| a * b} * -1");

    test = instance.valueArray($SC.Array([
      $SC.Integer(10), $SC.Integer(100)
    ]));
    expect(test).to.be.a("SCInteger").that.equals(-110);
  });
  it.skip("#valueEnvir", function() {
  });
  it.skip("#valueArrayEnvir", function() {
  });
  it("#functionPerformList", sinon.test(function() {
    var test, instance;
    var $selector, $arglist;

    $selector = sc.test.object();
    $arglist  = sc.test.object();

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
    SCNAryOpFunction = $SC.Class("NAryOpFunction");
    this.createInstance = function() {
      var instance;

      instance = $SC.Function(function($a, $b) {
        return $a ["+"] ($b);
      });
      instance = instance.wrap($SC.Integer(-199), $SC.Integer(20));

      return instance;
    };
  });
  it("#value", function() {
    var test, instance;

    instance = this.createInstance("{|a, b| a + b}.wrap(-199, 20)");

    test = instance.value($SC.Integer(10), $SC.Integer(100));
    expect(test).to.be.a("SCInteger").that.equals(-110);
  });
  it("#valueArray", function() {
    var test, instance;

    instance = this.createInstance("{|a, b| a + b}.wrap(-199, 20)");

    test = instance.valueArray($SC.Array([
      $SC.Integer(10), $SC.Integer(100)
    ]));
    expect(test).to.be.a("SCInteger").that.equals(-110);
  });
  it.skip("#valueEnvir", function() {
  });
  it.skip("#valueArrayEnvir", function() {
  });
  it("#functionPerformList", sinon.test(function() {
    var test, instance;
    var $selector, $arglist;

    $selector = sc.test.object();
    $arglist  = sc.test.object();

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
    SCFunctionList = $SC.Class("FunctionList");
    this.createInstance = function() {
      var instance = SCFunctionList.new($SC.Array([
        $SC.Function(function($a, $b) {
          return $a ["+"] ($b);
        }),
        $SC.Function(function($a, $b) {
          return $a ["-"] ($b);
        }),
        $SC.Function(function($a, $b) {
          return $a ["*"] ($b);
        }),
        $SC.Function(function($a, $b) {
          return $a ["/"] ($b);
        }),
      ]));
      return instance;
    };
    $int10 = $SC.Integer(10);
    $int20 = $SC.Integer(20);
    $int5  = $SC.Integer(5);
  });
  describe("operate function list", function() {
    var instance;
    var $arg1, $arg2, $arg3, $arg4;
    before(function() {
      instance = this.createInstance();

      $arg1 = sc.test.object();
      $arg2 = sc.test.object();
      $arg3 = sc.test.object();
      $arg4 = sc.test.object();
    });
    it("#<>array", function() {
      var test;

      test = instance.array_($SC.Array([ $arg1, $arg2 ]));
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

    test = instance.value($SC.Array([ $int10, $int20 ]), $int5);
    expect(test).to.be.a("SCArray").that.eqls([
      [ 15, 25 ], [ 5, 15 ], [ 50, 100 ], [ 2, 4 ]
    ]);
  });
  it("#value.flopped", function() {
    var instance, test;

    instance = this.createInstance();
    instance = instance.flop();

    test = instance.value($SC.Array([ $int10, $int20 ]), $int5);
    expect(test).to.be.a("SCArray").that.eqls([
      [ 15, 5, 50, 2 ], [ 25, 15, 100, 4 ]
    ]);
  });
  it("#valueArray", function() {
    var instance, test;

    instance = this.createInstance();

    test = instance.valueArray($SC.Array([
      $SC.Array([ $int10, $int20 ]), $int5
    ]));
    expect(test).to.be.a("SCArray").that.eqls([
      [ 15, 25 ], [ 5, 15 ], [ 50, 100 ], [ 2, 4 ]
    ]);
  });
  it("#valueArray.flopped", function() {
    var instance, test;

    instance = this.createInstance();
    instance = instance.flop();

    test = instance.valueArray($SC.Array([
      $SC.Array([ $int10, $int20 ]), $int5
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

    $elem1 = sc.test.object();
    $elem2 = sc.test.object();
    $function = sc.test.object({ value: this.spy() });

    instance = this.createInstance();
    instance.array_($SC.Array([ $elem1, $elem2 ]));

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
      instance.$array.valueOf()
    ]);
  });
});

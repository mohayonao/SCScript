"use strict";

require("./SimpleNumber");

var testCase = sc.test.testCase;

var $SC = sc.lang.$SC;

describe("SCSimpleNumber", function() {
  var SCSimpleNumber;
  before(function() {
    SCSimpleNumber = $SC.Class("SimpleNumber");
    this.createInstance = function(value) {
      var instance = $SC.Float(typeof value === "undefined" ? 0 : value);
      var testMethod = this.test.title.substr(1);
      sc.test.setSingletonMethod(instance, "SimpleNumber", testMethod);
      return instance;
    };
  });
  it("#__bool__", function() {
    var instance, test;

    instance = this.createInstance(1);
    test = instance.__bool__();
    expect(test).to.be.a("JSBoolean").that.is.true;

    instance = this.createInstance(0);
    test = instance.__bool__();
    expect(test).to.be.a("JSBoolean").that.is.false;
  });
  it("#__dec__", function() {
    var instance, test;

    instance = $SC.Float(1);
    test = instance.__dec__();
    expect(test).to.be.a("SCFloat").that.equals(0);

    instance = $SC.Integer(1);
    test = instance.__dec__();
    expect(test).to.be.a("SCInteger").that.equals(0);
  });
  it("#__inc__", function() {
    var instance, test;

    instance = $SC.Float(1);
    test = instance.__inc__();
    expect(test).to.be.a("SCFloat").that.equals(2);

    instance = $SC.Integer(1);
    test = instance.__inc__();
    expect(test).to.be.a("SCInteger").that.equals(2);
  });
  it("#__int__", function() {
    var instance, test;

    instance = this.createInstance(2014.0322);
    test = instance.__int__();
    expect(test).to.be.a("JSNumber").that.equals(2014);

    instance = $SC.Float(Infinity);
    test = instance.__int__();
    expect(test).to.be.a("JSNumber").that.equals(Infinity);
  });
  it("#__num__", function() {
    var instance, test;

    instance = $SC.Integer(2014);
    test = instance.__num__();
    expect(test).to.be.a("JSNumber").that.equals(2014);
  });
  it("#isValidUGenInput", function() {
    testCase(this, [
      [ 100, [], true  ],
      [ NaN, [], false ],
    ]);
  });
  it("#numChannels", function() {
    testCase(this, [
      [ 100, [], $SC.Integer(1) ],
    ]);
  });
  it("#magnitude", sinon.test(function() {
    var instance, test;

    instance = this.createInstance(-10);
    this.stub(instance, "abs", sc.test.func);

    test = instance.magnitude();
    expect(instance.abs).to.be.calledLastIn(test);
  }));
  it("#angle", function() {
    testCase(this, [
      [ -2, [], Math.PI ],
      [ -1, [], Math.PI ],
      [  0, [], $SC.Float(0.0) ],
      [  1, [], $SC.Float(0.0) ],
      [  2, [], $SC.Float(0.0) ],
    ]);
  });
  it("#neg", function() {
    testCase(this, [
      [ -3.14, [],  3.14 ],
      [ -0.14, [],  0.14 ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], -0.14 ],
      [  3.14, [], -3.14 ],
    ]);
  });
  it("#abs", function() {
    testCase(this, [
      [ -3.14, [], 3.14 ],
      [ -0.14, [], 0.14 ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], 0.14 ],
      [  3.14, [], 3.14 ],
    ]);
  });
  it("#ceil", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(-3.0) ],
      [ -0.14, [], $SC.Float( 0.0) ],
      [  0.00, [], $SC.Float( 0.0) ],
      [  0.14, [], $SC.Float( 1.0) ],
      [  3.14, [], $SC.Float( 4.0) ],
    ]);
  });
  it("#floor", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(-4.0) ],
      [ -0.14, [], $SC.Float(-1.0) ],
      [  0.00, [], $SC.Float( 0.0) ],
      [  0.14, [], $SC.Float( 0.0) ],
      [  3.14, [], $SC.Float( 3.0) ],
    ]);
  });
  it("#frac", function() {
    testCase(this, [
      [ -3.14, [], 0.86 ],
      [ -0.14, [], 0.86 ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], 0.14 ],
      [  3.14, [], 0.14 ],
    ], { closeTo: 1e-6 });
  });
  it("#sign", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(-1.0) ],
      [ -0.14, [], $SC.Float(-1.0) ],
      [  0.00, [], $SC.Float(0.0)  ],
      [  0.14, [], $SC.Float(+1.0) ],
      [  3.14, [], $SC.Float(+1.0) ],
    ]);
  });
  it("#squared", function() {
    testCase(this, [
      [ -3.14, [], 9.8596 ],
      [ -0.14, [], 0.0196 ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], 0.0196 ],
      [  3.14, [], 9.8596 ],
    ], { closeTo: 1e-6 });
  });
  it("#cubed", function() {
    testCase(this, [
      [ -3.14, [], -30.959144 ],
      [ -0.14, [],  -0.002744 ],
      [  0.00, [],   $SC.Float(0.0) ],
      [  0.14, [],   0.002744 ],
      [  3.14, [],  30.959144 ],
    ], { closeTo: 1e-6 });
  });
  it("#sqrt", function() {
    testCase(this, [
      [ -3.14, [], NaN ],
      [ -0.14, [], NaN ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], 0.37416573867739 ],
      [  3.14, [], 1.7720045146669  ],
    ], { closeTo: 1e-6 });
  });
  it("#exp", function() {
    testCase(this, [
      [ -3.14, [],  0.043282797901966 ],
      [ -0.14, [],  0.86935823539881  ],
      [  0.00, [],  $SC.Float(1.0) ],
      [  0.14, [],  1.1502737988572   ],
      [  3.14, [], 23.103866858722    ],
    ], { closeTo: 1e-6 });
  });
  it("#reciprocal", function() {
    testCase(this, [
      [ -3.14, [], -0.31847133757962 ],
      [ -0.14, [], -7.1428571428571  ],
      [  0.00, [],  Infinity ],
      [  0.14, [],  7.1428571428571  ],
      [  3.14, [],  0.31847133757962 ],
    ], { closeTo: 1e-6 });
  });
  it("#midicps", function() {
    testCase(this, [
      [ -3.14, [], 6.819628010454  ],
      [ -0.14, [], 8.1099501517038 ],
      [  0.00, [], 8.1757989156437 ],
      [  0.14, [], 8.2421823388147 ],
      [  3.14, [], 9.8016618804682 ],
    ], { closeTo: 1e-6 });
  });
  it("#cpsmidi", function() {
    testCase(this, [
      [ -3.14, [], -16.567141852893 ],
      [ -0.14, [], -70.414331774901 ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -70.414331774901 ],
      [  3.14, [], -16.567141852893 ],
    ], { closeTo: 1e-6 });
  });
  it("#midiratio", function() {
    testCase(this, [
      [ -3.14, [], 0.83412374507037 ],
      [ -0.14, [], 0.99194589242971 ],
      [  0.00, [], $SC.Float(1.0) ],
      [  0.14, [], 1.0081195029202  ],
      [  3.14, [], 1.1988628856449  ],
    ], { closeTo: 1e-6 });
  });
  it("#ratiomidi", function() {
    testCase(this, [
      [ -3.14, [],  19.809174709403 ],
      [ -0.14, [], -34.038015212605 ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -34.038015212605 ],
      [  3.14, [],  19.809174709403 ],
    ], { closeTo: 1e-6 });
  });
  it("#ampdb", function() {
    testCase(this, [
      [ -3.14, [], NaN ],
      [ -0.14, [], NaN ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -17.077439286435  ],
      [  3.14, [],   9.9385929614643 ],
    ], { closeTo: 1e-6 });
  });
  it("#dbamp", function() {
    testCase(this, [
      [ -3.14, [], 0.69662651411077 ],
      [ -0.14, [], 0.98401110576113 ],
      [  0.00, [], $SC.Float(1.0) ],
      [  0.14, [], 1.0162486928707  ],
      [  3.14, [], 1.4354894333537  ],
    ], { closeTo: 1e-6 });
  });
  it("#octcps", function() {
    testCase(this, [
      [ -3.14, [],   1.854923531492 ],
      [ -0.14, [],  14.839388251936 ],
      [  0.00, [],  16.351597831287 ],
      [  0.14, [],  18.017909303052 ],
      [  3.14, [], 144.14327442442  ],
    ], { closeTo: 1e-6 });
  });
  it("#cpsoct", function() {
    testCase(this, [
      [ -3.14, [], -2.3805951544251 ],
      [ -0.14, [], -6.8678609812591 ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -6.8678609812591 ],
      [  3.14, [], -2.3805951544251 ],
    ], { closeTo: 1e-6 });
  });
  it("#log", function() {
    testCase(this, [
      [ -3.14, [], NaN ],
      [ -0.14, [], NaN ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -1.9661128563728 ],
      [  3.14, [],  1.1442227999202 ],
    ], { closeTo: 1e-6 });
  });
  it("#log2", function() {
    testCase(this, [
      [ -3.14, [],  1.6507645591169 ],
      [ -0.14, [], -2.8365012677171 ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -2.8365012677171 ],
      [  3.14, [],  1.6507645591169 ],
    ], { closeTo: 1e-6 });
  });
  it("#log10", function() {
    testCase(this, [
      [ -3.14, [], NaN ],
      [ -0.14, [], NaN ],
      [  0.00, [], -Infinity ],
      [  0.14, [], -0.85387196432176 ],
      [  3.14, [],  0.49692964807321 ],
    ], { closeTo: 1e-6 });
  });
  it("#sin", function() {
    testCase(this, [
      [ -3.14, [], -0.0015926529164868 ],
      [ -0.14, [], -0.13954311464424   ],
      [  0.00, [],  $SC.Float(0.0) ],
      [  0.14, [],  0.13954311464424   ],
      [  3.14, [],  0.0015926529164868 ],
    ], { closeTo: 1e-6 });
  });
  it("#cos", function() {
    testCase(this, [
      [ -3.14, [], -0.99999873172754 ],
      [ -0.14, [],  0.99021599621264 ],
      [  0.00, [],  $SC.Float(1.0) ],
      [  0.14, [],  0.99021599621264 ],
      [  3.14, [], -0.99999873172754 ],
    ], { closeTo: 1e-6 });
  });
  it("#tan", function() {
    testCase(this, [
      [ -3.14, [],  0.0015926549364072 ],
      [ -0.14, [], -0.14092189499863   ],
      [  0.00, [],  $SC.Float(0.0) ],
      [  0.14, [],  0.14092189499863   ],
      [  3.14, [], -0.0015926549364072 ],
    ], { closeTo: 1e-6 });
  });
  it("#asin", function() {
    testCase(this, [
      [ -3.14, [],  NaN ],
      [ -0.14, [], -0.14046141470986 ],
      [  0.00, [],  $SC.Float(0.0) ],
      [  0.14, [],  0.14046141470986 ],
      [  3.14, [],  NaN ],
    ], { closeTo: 1e-6 });
  });
  it("#acos", function() {
    testCase(this, [
      [ -3.14, [],  NaN ],
      [ -0.14, [], 1.7112577415048 ],
      [  0.00, [], 1.5707963267949 ],
      [  0.14, [], 1.430334912085  ],
      [  3.14, [],  NaN ],
    ], { closeTo: 1e-6 });
  });
  it("#atan", function() {
    testCase(this, [
      [ -3.14, [], -1.2624806645995  ],
      [ -0.14, [], -0.13909594148207 ],
      [  0.00, [],  $SC.Float(0.0) ],
      [  0.14, [],  0.13909594148207 ],
      [  3.14, [],  1.2624806645995  ],
    ], { closeTo: 1e-6 });
  });
  it("#sinh", function() {
    testCase(this, [
      [ -3.14, [], -11.53029203041    ],
      [ -0.14, [],  -0.14045778172921 ],
      [  0.00, [],   $SC.Float(0.0) ],
      [  0.14, [],   0.14045778172921 ],
      [  3.14, [],  11.53029203041    ],
    ], { closeTo: 1e-6 });
  });
  it("#cosh", function() {
    testCase(this, [
      [ -3.14, [], 11.573574828312 ],
      [ -0.14, [],  1.009816017128 ],
      [  0.00, [],  $SC.Float(1.0) ],
      [  0.14, [],  1.009816017128 ],
      [  3.14, [], 11.573574828312 ],
    ], { closeTo: 1e-6 });
  });
  it("#tanh", function() {
    testCase(this, [
      [ -3.14, [], -0.99626020494583 ],
      [ -0.14, [], -0.13909244787846 ],
      [  0.00, [],  $SC.Float(0.0) ],
      [  0.14, [],  0.13909244787846 ],
      [  3.14, [],  0.99626020494583 ],
    ], { closeTo: 1e-6 });
  });
  it("#rand", function() {
    testCase(this, [
      [ $SC.Float(1.0), [], 0.85755145549774 ],
      [ $SC.Float(1.0), [], 0.07253098487854 ],
      [ $SC.Float(1.0), [], 0.15391707420349 ],
      [ $SC.Float(1.0), [], 0.53926873207092 ],
      [ $SC.Float(1.0), [], 0.37802028656006 ],
    ], { closeTo: 1e-6, randSeed: 0 });
  });
  it("#rand2", function() {
    testCase(this, [
      [ $SC.Float(1.0), [],  0.71510291099548  ],
      [ $SC.Float(1.0), [], -0.85493803024292  ],
      [ $SC.Float(1.0), [], -0.69216585159302  ],
      [ $SC.Float(1.0), [],  0.078537464141846 ],
      [ $SC.Float(1.0), [], -0.24395942687988  ],
    ], { closeTo: 1e-6, randSeed: 0 });
  });
  it("#linrand", function() {
    testCase(this, [
      [ $SC.Float(1.0), [], 0.072531029582024 ],
      [ $SC.Float(1.0), [], 0.15391716198064  ],
      [ $SC.Float(1.0), [], 0.35834928182885  ],
      [ $SC.Float(1.0), [], 0.63415864156559  ],
      [ $SC.Float(1.0), [], 0.09632418397814  ],
    ], { closeTo: 1e-6, randSeed: 0 });
  });
  it("#bilinrand", function() {
    testCase(this, [
      [ $SC.Float(1.0), [],  0.78502050461248  ],
      [ $SC.Float(1.0), [], -0.38535162992775  ],
      [ $SC.Float(1.0), [],  0.019671033602208 ],
      [ $SC.Float(1.0), [], -0.19013617071323  ],
      [ $SC.Float(1.0), [], -0.84007759438828  ],
    ], { closeTo: 1e-6, randSeed: 0 });
  });
  it("#sum3rand", function() {
    testCase(this, [
      [ $SC.Float(1.0), [], -0.27733351630056  ],
      [ $SC.Float(1.0), [], -0.14957440729592  ],
      [ $SC.Float(1.0), [],  0.036518425233295 ],
      [ $SC.Float(1.0), [],  0.28168726307454  ],
      [ $SC.Float(1.0), [], -0.052895963684095 ],
    ], { closeTo: 1e-6, randSeed: 0 });
  });
  it("#distort", function() {
    testCase(this, [
      [ -3.14, [], -0.75845410628019 ],
      [ -0.14, [], -0.12280701754386 ],
      [  0.00, [],  $SC.Float(0.0) ],
      [  0.14, [],  0.12280701754386 ],
      [  3.14, [],  0.75845410628019 ],
    ], { closeTo: 1e-6 });
  });
  it("#softclip", function() {
    testCase(this, [
      [ -3.14, [], -0.9203821656051 ],
      [ -0.14, [], -0.14 ],
      [  0.00, [],  $SC.Float(0.00) ],
      [  0.14, [],  0.14 ],
      [  3.14, [],  0.9203821656051 ],
    ], { closeTo: 1e-6 });
  });
  it("#coin", function() {
    testCase(this, [
      [ 0.5, [], false ],
      [ 0.5, [], true  ],
      [ 0.5, [], true  ],
      [ 0.5, [], false ],
      [ 0.5, [], true  ],
      [ 0.5, [], true  ],
      [ 0.5, [], false ],
      [ 0.5, [], false ],
      [ 0.5, [], true  ],
      [ 0.5, [], false ],
    ], { randSeed: 0 });
  });
  it("#isPositive", function() {
    testCase(this, [
      [ -1, [], false ],
      [  0, [], true  ],
      [ +1, [], true  ],
    ]);
  });
  it("#isNegative", function() {
    testCase(this, [
      [ -1, [], true  ],
      [  0, [], false ],
      [ +1, [], false ],
    ]);
  });
  it("#isStrictlyPositive", function() {
    testCase(this, [
      [ -1, [], false ],
      [  0, [], false ],
      [ +1, [], true  ],
    ]);
  });
  it("#isNaN", function() {
    testCase(this, [
      [ NaN     , [], true  ],
      [ Infinity, [], false ],
      [ 0       , [], false ],
    ]);
  });
  it("#asBoolean", function() {
    testCase(this, [
      [ -1, [], false ],
      [  0, [], false ],
      [ +1, [], true  ],
    ]);
  });
  it("#booleanValue", function() {
    testCase(this, [
      [ -1, [], false ],
      [  0, [], false ],
      [ +1, [], true  ],
    ]);
  });
  it("#binaryValue", function() {
    testCase(this, [
      [ -2, [], 0 ],
      [ -1, [], 0 ],
      [  0, [], 0 ],
      [ +1, [], 1 ],
      [ +2, [], 1 ],
    ]);
  });
  it("#rectWindow", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(0.0) ],
      [ -0.14, [], $SC.Float(0.0) ],
      [  0.00, [], $SC.Float(1.0) ],
      [  0.14, [], $SC.Float(1.0) ],
      [  3.14, [], $SC.Float(0.0) ],
    ]);
  });
  it("#hanWindow", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(0.0) ],
      [ -0.14, [], $SC.Float(0.0) ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], $SC.Float(0.18128800512566) ],
      [  3.14, [], $SC.Float(0.0) ],
    ], { closeTo: 1e-6 });
  });
  it("#welWindow", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(0.0) ],
      [ -0.14, [], $SC.Float(0.0) ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], $SC.Float(0.42577929156507) ],
      [  3.14, [], $SC.Float(0.0) ],
    ], { closeTo: 1e-6 });
  });
  it("#triWindow", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(0.0)  ],
      [ -0.14, [], $SC.Float(0.0)  ],
      [  0.00, [], $SC.Float(0.0)  ],
      [  0.14, [], $SC.Float(0.28) ],
      [  3.14, [], $SC.Float(0.0)  ],
      [  0.80, [], $SC.Float(0.40) ],
    ], { closeTo: 1e-6 });
  });
  it("#scurve", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(0.0) ],
      [ -0.14, [], $SC.Float(0.0) ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], $SC.Float(0.053312) ],
      [  3.14, [], $SC.Float(1.0) ],
    ], { closeTo: 1e-6 });
  });
  it("#ramp", function() {
    testCase(this, [
      [ -3.14, [], $SC.Float(0.0) ],
      [ -0.14, [], $SC.Float(0.0) ],
      [  0.00, [], $SC.Float(0.0) ],
      [  0.14, [], $SC.Float(0.14) ],
      [  3.14, [], $SC.Float(1.0) ],
    ]);
  });
  it("#bitTest", function() {
    testCase(this, [
      [ 11, [ 0 ], true  ],
      [ 11, [ 1 ], true  ],
      [ 11, [ 2 ], false ],
      [ 11, [ 3 ], true  ],
    ]);
  });
  it("#==", function() {
    testCase(this, [
      [ $SC.Integer(10), [ $SC.Integer(10) ], true ],
      [ $SC.Integer(10), [ $SC.Float(10.0) ], true ],
      [ $SC.Float(10.0), [ $SC.Integer(10) ], true ],
      [ $SC.Float(10.0), [ $SC.Float(10.0) ], true ],
      [ $SC.Float(10.0), [ $SC.Float(10.5) ], false ],
    ]);
  });
  it("#!=", function() {
    testCase(this, [
      [ $SC.Integer(10), [ $SC.Integer(10) ], false ],
      [ $SC.Integer(10), [ $SC.Float(10.0) ], false ],
      [ $SC.Float(10.0), [ $SC.Integer(10) ], false ],
      [ $SC.Float(10.0), [ $SC.Float(10.0) ], false ],
      [ $SC.Float(10.0), [ $SC.Float(10.5) ], true  ],
    ]);
  });
  it("#<", function() {
    testCase(this, [
      [ 10, [ 20 ], true  ],
      [ 20, [ 20 ], false ],
      [ 30, [ 20 ], false ],
      [ 10, [ "20" ], true  ],
      [ 20, [ "20" ], false ],
      [ 30, [ "20" ], false ],
      [ 10, [ "\\12" ], false ],
      [ 20, [ [ 10, 20, 30 ] ], [ false, false, true ] ],
    ]);
  });
  it("#>", function() {
    testCase(this, [
      [ 10, [ 20 ], false ],
      [ 20, [ 20 ], false ],
      [ 30, [ 20 ], true  ],
    ]);
  });
  it("#<=", function() {
    testCase(this, [
      [ 10, [ 20 ], true  ],
      [ 20, [ 20 ], true  ],
      [ 30, [ 20 ], false ],
    ]);
  });
  it("#>=", function() {
    testCase(this, [
      [ 10, [ 20 ], false ],
      [ 20, [ 20 ], true  ],
      [ 30, [ 20 ], true  ],
    ]);
  });
  it("#equalWithPrecision", function() {
    testCase(this, [
      [ 10, [ 10.01       ], false ],
      [ 10, [ 10.01, 0.02 ], true  ],
    ]);
  });
  it.skip("#hash", function() {
  });
  it("#asInteger", function() {
    testCase(this, [
      [ $SC.Integer(10), [], $SC.Integer(10) ],
      [ $SC.Float(10.5), [], $SC.Integer(10) ],
    ]);
  });
  it("#asFloat", function() {
    testCase(this, [
      [ $SC.Integer(10), [], $SC.Float(10.0) ],
      [ $SC.Float(10.5), [], $SC.Float(10.5) ],
    ]);
  });
  it.skip("#asComplex", function() {
  });
  it.skip("#asRect", function() {
  });
  it("#degrad", function() {
    testCase(this, [
      [ 180, [], Math.PI ],
    ]);
  });
  it("#raddeg", function() {
    testCase(this, [
      [ Math.PI, [], $SC.Float(180) ]
    ]);
  });
  it.skip("#performBinaryOpOnSimpleNumber", function() {
  });
  it.skip("#performBinaryOpOnComplex", function() {
  });
  it.skip("#performBinaryOpOnSignal", function() {
  });
  it("#nextPowerOfTwo", function() {
    testCase(this, [
      [ 50, [], $SC.Float(64) ],
    ]);
  });
  it("#nextPowerOf", function() {
    testCase(this, [
      [ 50, [ 2 ], $SC.Float(64) ],
      [ 50, [ 3 ], $SC.Float(81) ],
    ]);
  });
  it("#nextPowerOfThree", function() {
    testCase(this, [
      [ 50, [], $SC.Float(81) ],
    ]);
  });
  it("#previousPowerOf", function() {
    testCase(this, [
      [ 50, [ 2 ], $SC.Float(32) ],
      [ 50, [ 3 ], $SC.Float(27) ],
    ]);
  });
  it("#quantize", function() {
    testCase(this, [
      [ 0.25, [ 1.0, 0.30, 0.50 ], 0.125  ],
      [ 0.25, [ 1.0, 0.30, 0.25 ], 0.1875 ],
      [ 0.25, [ 0.5, 0.30, 0.50 ], 0.375  ],
      [ 0.25, [ 1.0, 0.15, 0.50 ], 0.25   ],
    ]);
  });
  it("#linlin", function() {
    testCase(this, [
      [ -0.2, [ 0, 2, 440, 880 ], 440 ],
      [ +0.2, [ 0, 2, 440, 880 ], $SC.Float(484) ],
      [ +1.8, [ 0, 2, 440, 880 ], $SC.Float(836) ],
      [ +2.2, [ 0, 2, 440, 880 ], 880 ],
      [ -0.2, [ 0, 2, 440, 880, "\\min" ], 440 ],
      [ +2.2, [ 0, 2, 440, 880, "\\min" ], $SC.Float(924) ],
      [ -0.2, [ 0, 2, 440, 880, "\\max" ], $SC.Float(396) ],
      [ +2.2, [ 0, 2, 440, 880, "\\max" ], 880 ],
    ]);
  });
  it("#linexp", function() {
    testCase(this, [
      [ -0.2, [ 0, 2, 440, 880 ], 440 ],
      [ +0.2, [ 0, 2, 440, 880 ], 471.580323515969 ],
      [ +1.8, [ 0, 2, 440, 880 ], 821.0690325523905 ],
      [ +2.2, [ 0, 2, 440, 880 ], 880 ],
      [ -0.2, [ 0, 2, 440, 880, "\\min" ], 440 ],
      [ +2.2, [ 0, 2, 440, 880, "\\min" ], 943.160647031938 ],
      [ -0.2, [ 0, 2, 440, 880, "\\max" ], 410.53451627619523 ],
      [ +2.2, [ 0, 2, 440, 880, "\\max" ], 880 ],
    ]);
  });
  it("#explin", function() {
    testCase(this, [
      [ -0.2, [ 0.001, 2, 440, 880 ], 440 ],
      [ +0.2, [ 0.001, 2, 440, 880 ], 746.7082696679656 ],
      [ +1.8, [ 0.001, 2, 440, 880 ], 873.900904907516 ],
      [ +2.2, [ 0.001, 2, 440, 880 ], 880 ],
      [ -0.2, [ 0.001, 2, 440, 880, "\\min" ], 440 ],
      [ +2.2, [ 0.001, 2, 440, 880, "\\min" ], 885.5173026278289 ],
      [ -0.2, [ 0.001, 2, 440, 880, "\\max" ], $SC.Float(NaN) ],
      [ +2.2, [ 0.001, 2, 440, 880, "\\max" ], 880 ],
    ]);
  });
  it("#expexp", function() {
    testCase(this, [
      [ -0.2, [ 0.001, 2, 440, 880 ], 440 ],
      [ +0.2, [ 0.001, 2, 440, 880 ], 713.3290723193618 ],
      [ +1.8, [ 0.001, 2, 440, 880 ], 871.5853480704831 ],
      [ +2.2, [ 0.001, 2, 440, 880 ], 880 ],
      [ -0.2, [ 0.001, 2, 440, 880, "\\min" ], 440 ],
      [ +2.2, [ 0.001, 2, 440, 880, "\\min" ], 887.6819413311385 ],
      [ -0.2, [ 0.001, 2, 440, 880, "\\max" ], $SC.Float(NaN) ],
      [ +2.2, [ 0.001, 2, 440, 880, "\\max" ], 880 ],
    ]);
  });
  it("#lincurve", function() {
    testCase(this, [
      [ -0.2, [ 0, 2, 440, 880 ], 440 ],
      [ +0.2, [ 0, 2, 440, 880 ], 587.765601134882 ],
      [ +1.8, [ 0, 2, 440, 880 ], 875.9624937273331 ],
      [ +2.2, [ 0, 2, 440, 880 ], 880 ],
      [ -0.2, [ 0, 2, 440, 880, -4, "\\min" ], 440 ],
      [ +2.2, [ 0, 2, 440, 880, -4, "\\min" ], 882.7064213905633 ],
      [ -0.2, [ 0, 2, 440, 880, -4, "\\max" ], 219.55962676517413 ],
      [ +2.2, [ 0, 2, 440, 880, -4, "\\max" ], 880 ],
      [ +1.8, [ 0, 2, 440, 880, 0.0001 ], $SC.Float(836) ],
    ]);
  });
  it("#curvelin", function() {
    testCase(this, [
      [ -0.2, [ 0, 2, 440, 880 ], 440 ],
      [ +0.2, [ 0, 2, 440, 880 ], 451.36602638842083 ],
      [ +1.8, [ 0, 2, 440, 880 ], 676.5000781660218 ],
      [ +2.2, [ 0, 2, 440, 880 ], 880 ],
      [ -0.2, [ 0, 2, 440, 880, -4, "\\min" ], 440 ],
      [ +2.2, [ 0, 2, 440, 880, -4, "\\min" ], $SC.Float(NaN) ],
      [ -0.2, [ 0, 2, 440, 880, -4, "\\max" ], 429.699189262898 ],
      [ +2.2, [ 0, 2, 440, 880, -4, "\\max" ], 880 ],
      [ +1.8, [ 0, 2, 440, 880, 0.0001 ], $SC.Float(836) ],
    ]);
  });
  it("#bilin", function() {
    testCase(this, [
      [ -0.2, [ 0.5, 0, 2, 554, 440, 880 ], 440 ],
      [ +0.2, [ 0.5, 0, 2, 554, 440, 880 ], 485.6 ],
      [ +1.8, [ 0.5, 0, 2, 554, 440, 880 ], 836.5333333333333 ],
      [ +2.2, [ 0.5, 0, 2, 554, 440, 880 ], 880 ],
      [ -0.2, [ 0.5, 0, 2, 554, 440, 880, "\\min" ], 440 ],
      [ +2.2, [ 0.5, 0, 2, 554, 440, 880, "\\min" ], 923.4666666666667 ],
      [ -0.2, [ 0.5, 0, 2, 554, 440, 880, "\\max" ], 394.4 ],
      [ +2.2, [ 0.5, 0, 2, 554, 440, 880, "\\max" ], 880 ],
    ]);
  });
  it("#biexp", function() {
    testCase(this, [
      [ -0.2, [ 0.5, 0.001, 2, 554, 440, 880 ], 440 ],
      [ +0.2, [ 0.5, 0.001, 2, 554, 440, 880 ], 537.1916764855737 ],
      [ +1.8, [ 0.5, 0.001, 2, 554, 440, 880 ], 855.2234957684568 ],
      [ +2.2, [ 0.5, 0.001, 2, 554, 440, 880 ], 880 ],
      [ -0.2, [ 0.5, 0.001, 2, 554, 440, 880, "\\min" ], 440 ],
      [ +2.2, [ 0.5, 0.001, 2, 554, 440, 880, "\\min" ], 902.4130743712394 ],
      [ -0.2, [ 0.5, 0.001, 2, 554, 440, 880, "\\max" ], $SC.Float(NaN) ],
      [ +2.2, [ 0.5, 0.001, 2, 554, 440, 880, "\\max" ], 880 ],
    ]);
  });
  it("#moddif", function() {
    testCase(this, [
      [ 0.75, [] , 0.25 ],
    ]);
  });
  it("#lcurve", function() {
    testCase(this, [
      [ 0.5, [], 0.62245933120185 ],
      [ 0.5, [ 1, 2, 3, 4 ], 0.8957778033431 ],
    ], { closeTo: 1e-6 });
  });
  it("#gauss", function() {
    testCase(this, [
      [ 1.0, [ 1 ], 1.2439947641865 ],
    ], { closeTo: 1e-6, randSeed: 0 });
  });
  it("#gaussCurve", function() {
    testCase(this, [
      [ 1.0, [], 0.60653065971263 ]
    ], { closeTo: 1e-6 });
  });
  it.skip("#asPoint", function() {
  });
  it.skip("#asWarp", function() {
  });
  it("#wait", sinon.test(function() {
    var instance, test;

    instance = this.createInstance();
    this.stub(instance, "yield", sc.test.func);

    test = instance.wait();
    expect(instance.yield).to.be.calledLastIn(test);
  }));
  it.skip("#waitUntil", function() {
  });
  it.skip("#sleep", function() {
  });
  it.skip("#printOn", function() {
  });
  it.skip("#storeOn", function() {
  });
  it("#rate", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.rate();
    expect(test).to.be.a("SCSymbol").that.equals("scalar");
  });
  it("#asAudioRateInput", sinon.test(function() {
    var instance, test, spy1, spy2;

    spy1 = this.spy(sc.test.func);
    spy2 = this.spy(sc.test.func);
    this.stub($SC, "Class")
      .withArgs("Silent").returns(sc.test.object({ ar: spy1 }))
      .withArgs("DC"    ).returns(sc.test.object({ ar: spy2 }));

    instance = this.createInstance(0);
    test = instance.asAudioRateInput();
    expect(spy1).to.be.calledLastIn(test);
    expect(spy2).to.be.not.called;
    spy1.reset();
    spy2.reset();

    instance = this.createInstance(1);
    test = instance.asAudioRateInput();
    expect(spy1).to.be.not.called;
    expect(spy2).to.be.calledWith(instance);
    expect(spy2).to.be.calledLastIn(test);
  }));
  it("#madd", function() {
    testCase(this, [
      [ 0.5, [ 2, 10 ], $SC.Float(11.0) ],
    ]);
  });
  it("#lag", function() {
    var instance = this.createInstance();
    expect(instance.lag).to.be.nop;
  });
  it("#lag2", function() {
    var instance = this.createInstance();
    expect(instance.lag2).to.be.nop;
  });
  it("#lag3", function() {
    var instance = this.createInstance();
    expect(instance.lag3).to.be.nop;
  });
  it("#lagud", function() {
    var instance = this.createInstance();
    expect(instance.lagud).to.be.nop;
  });
  it("#lag2ud", function() {
    var instance = this.createInstance();
    expect(instance.lag2ud).to.be.nop;
  });
  it("#lag3ud", function() {
    var instance = this.createInstance();
    expect(instance.lag3ud).to.be.nop;
  });
  it.skip("#writeInputSpec", function() {
  });
  it("#series", function() {
    testCase(this, [
      [ 10, [ 13, 20 ], [ 10, 13, 16, 19 ] ],
      [ 10, [ null, 13 ], [ 10, 11, 12, 13 ] ],
      [ 13, [ null, 10 ], [ 13, 12, 11, 10 ] ],
    ]);
  });
  it.skip("#seriesIter", function() {
  });
  it.skip("#degreeToKey", function() {
  });
  it.skip("#keyToDegree", function() {
  });
  it.skip("#nearestInList", function() {
  });
  it.skip("#nearestInScale", function() {
  });
  it.skip("#partition", function() {
  });
  it.skip("#nextTimeOnGrid", function() {
  });
  it.skip("#playAndDelta", function() {
  });
  it.skip("#asQuant", function() {
  });
  it.skip("#asTimeString", function() {
  });
  it.skip("#asFraction", function() {
  });
  it.skip("#asBufWithValues", function() {
  });
  it.skip("#schedBundleArrayOnClock", function() {
  });
  it("#shallowCopy", function() {
    var instance = this.createInstance();
    expect(instance.shallowCopy).to.be.nop;
  });
});

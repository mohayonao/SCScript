(function() {
  "use strict";

  require("./Integer");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  var SCInteger = $("Integer");

  describe("SCInteger", function() {
    before(function() {
      this.createInstance = function(value) {
        return $.Integer(typeof value === "undefined" ? 0 : value);
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_INT);
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance(2014);

      test = instance.valueOf();
      expect(test).to.be.a("JSNumber").that.equals(2014);
    });
    it("#toString", function() {
      var instance, test;

      instance = this.createInstance(1);

      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("1");
    });
    it(".new", function() {
      expect(function() {
        SCInteger.new();
      }).to.throw("should use literal");
    });
    it("#isInteger", function() {
      testCase(this, [
        [ 1       , [], true  ],
        [ Infinity, [], false ],
      ]);
    });
    it("#hash", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.hash();
      expect(test).to.be.a("SCInteger");
    });
    it("#+", function() {
      testCase(this, [
        [ 10, [ 20 ], 30 ],
        [ 10, [ $.Float(20.0) ], $.Float(30.0) ],
        [ 10, [ "20" ], "10 20" ],
      ]);
    });
    it("#-", function() {
      testCase(this, [
        [ 10, [ 20 ], -10 ],
        [ 10, [ $.Float(20.0) ], $.Float(-10.0) ],
      ]);
    });
    it("#*", function() {
      testCase(this, [
        [ 10, [ 20 ], 200 ],
        [ 10, [ $.Float(20.0) ], $.Float(200.0) ],
      ]);
    });
    it("#/", function() {
      testCase(this, [
        [ 10, [ 20 ], 0.5 ],
        [ 10, [ $.Float(20.0) ], 0.5 ],
      ]);
    });
    it("#mod", function() {
      testCase(this, [
        [ 30, [ 20 ], 10 ],
        [ 30, [ $.Float(20.0) ], $.Float(10) ],
      ]);
    });
    it("#div", function() {
      testCase(this, [
        [ 10, [ 20 ], 0 ],
        [ 10, [ $.Float(20.0) ], 0 ],
      ]);
    });
    it("#max", function() {
      testCase(this, [
        [ 10, [ 20 ], 20 ],
        [ 10, [ $.Float(0.0) ], $.Float(10.0) ],
      ]);
    });
    it("#min", function() {
      testCase(this, [
        [ 10, [ 20 ], 10 ],
        [ 10, [ $.Float(20.0) ], $.Float(10.0) ],
      ]);
    });
    it("#bitAnd", function() {
      testCase(this, [
        [ 123, [ 456 ], 72 ],
        [ 123, [ $.Float(456.0) ], $.Float(72.0) ],
      ]);
    });
    it("#bitOr", function() {
      testCase(this, [
        [ 123, [ 456 ], 507 ],
        [ 123, [ $.Float(456.0) ], $.Float(507.0) ],
      ]);
    });
    it("#bitXor", function() {
      testCase(this, [
        [ 123, [ 456 ], 435 ],
        [ 123, [ $.Float(456.0) ], $.Float(435.0) ],
      ]);
    });
    it("#lcm", function() {
      testCase(this, [
        [ 123, [ 456 ], 18696 ],
        [ 123, [ $.Float(456.0) ], $.Float(18696.0) ],
      ]);
    });
    it("#gcd", function() {
      testCase(this, [
        [ 123, [ 456 ], 3 ],
        [ 123, [ $.Float(456.0) ], $.Float(3.0) ],
      ]);
    });
    it("#round", function() {
      testCase(this, [
        [ 123, [ 25 ], 125 ],
        [ 123, [ $.Float(25.0) ], $.Float(125.0) ],
      ]);
    });
    it("#roundUp", function() {
      testCase(this, [
        [ 123, [ 25 ], 125 ],
        [ 123, [ $.Float(25.0) ], $.Float(125.0) ],
      ]);
    });
    it("#trunc", function() {
      testCase(this, [
        [ 123, [ 25 ], 100 ],
        [ 123, [ $.Float(25.0) ], $.Float(100.0) ],
      ]);
    });
    it("#atan2", function() {
      testCase(this, [
        [ 1, [ 2 ], 0.46364760900081 ],
        [ 1, [ $.Float(2.0) ], 0.46364760900081 ],
      ], { closeTo: 1e-6 });
    });
    it("#hypot", function() {
      testCase(this, [
        [ 1, [ 2 ], 2.2360679774998 ],
        [ 1, [ $.Float(2.0) ], 2.2360679774998 ],
      ], { closeTo: 1e-6 });
    });
    it("#hypotApx", function() {
      testCase(this, [
        [ 1, [ 2 ], 2.5857864320278 ],
        [ 1, [ $.Float(2.0) ], 2.5857864320278 ],
      ], { closeTo: 1e-6 });
    });
    it("#leftShift", function() {
      testCase(this, [
        [ 11, [ 2 ], 44 ],
        [ 11, [ $.Float(2.0) ], $.Float(44.0) ],
      ]);
    });
    it("#rightShift", function() {
      testCase(this, [
        [ 11, [ 2 ], 2 ],
        [ 11, [ $.Float(2.0) ], $.Float(2.0) ],
      ]);
    });
    it("#unsignedRightShift", function() {
      testCase(this, [
        [ 11, [ 2 ], 2 ],
        [ 11, [ $.Float(2.0) ], $.Float(2.0) ],
      ]);
    });
    it("#ring1", function() {
      testCase(this, [
        [ 10, [ 20 ], 210 ],
        [ 10, [ $.Float(20.0) ], $.Float(210.0) ],
      ]);
    });
    it("#ring2", function() {
      testCase(this, [
        [ 10, [ 20 ], 230 ],
        [ 10, [ $.Float(20.0) ], $.Float(230.0) ],
      ]);
    });
    it("#ring3", function() {
      testCase(this, [
        [ 10, [ 20 ], 2000 ],
        [ 10, [ $.Float(20.0) ], $.Float(2000.0) ],
      ]);
    });
    it("#ring4", function() {
      testCase(this, [
        [ 10, [ 20 ], -2000 ],
        [ 10, [ $.Float(20.0) ], $.Float(-2000.0) ],
      ]);
    });
    it("#difsqr", function() {
      testCase(this, [
        [ 10, [ 20 ], -300 ],
        [ 10, [ $.Float(20.0) ], $.Float(-300.0) ],
      ]);
    });
    it("#sumsqr", function() {
      testCase(this, [
        [ 10, [ 20 ], 500 ],
        [ 10, [ $.Float(20.0) ], $.Float(500.0) ],
      ]);
    });
    it("#sqrdif", function() {
      testCase(this, [
        [ 10, [ 20 ], 100 ],
        [ 10, [ $.Float(20.0) ], $.Float(100.0) ],
      ]);
    });
    it("#absdif", function() {
      testCase(this, [
        [ 10, [ 20 ], 10 ],
        [ 10, [ $.Float(20.0) ], $.Float(10.0) ],
      ]);
    });
    it("#thresh", function() {
      testCase(this, [
        [ 10, [ 20 ], 0 ],
        [ 10, [ $.Float(20.0) ], 0 ],
      ]);
    });
    it("#amclip", function() {
      testCase(this, [
        [ 10, [ 20 ], 200 ],
        [ 10, [ $.Float(20.0) ], $.Float(200.0) ],
      ]);
    });
    it("#scaleneg", function() {
      testCase(this, [
        [ 10, [ 20 ], 10 ],
        [ 10, [ $.Float(20.0) ], $.Float(10.0) ],
      ]);
    });
    it("#clip2", function() {
      testCase(this, [
        [ 12, [ 3 ], 3 ],
        [ 12, [ $.Float(3.0) ], $.Float(3.0) ],
      ]);
    });
    it("#wrap2", function() {
      testCase(this, [
        [ 12, [ 3 ], -2 ],
        [ 12, [ $.Float(3.0) ], $.Float(0.0) ],
        [ 12, [ [ 3 ] ], [ -2 ] ],
      ]);
    });
    it("#fold2", function() {
      testCase(this, [
        [ 12, [ 3 ], 0 ],
        [ 12, [ $.Float(3.0) ], $.Float(0.0) ],
      ]);
    });
    it("#excess", function() {
      testCase(this, [
        [ 12, [ 3 ], 9 ],
        [ 12, [ $.Float(3.0) ], $.Float(9.0) ],
      ]);
    });
    it("#firstArg", function() {
      testCase(this, [
        [ 12, [ 3 ], 12 ],
        [ 12, [ $.Float(3.0) ], 12 ],
      ]);
    });
    it("#rrand", function() {
      testCase(this, [
        [ 10, [ 20 ], 19 ],
        [ 10, [ $.Float(20.0) ], 10.725309848785 ],
        [ 10, [ [ 20 ] ], [ 12 ] ],
      ], { closeTo: 1e-6, randSeed: 0 });
    });
    it("#exprand", function() {
      testCase(this, [
        [ 10, [ 20 ], 18.119605359594 ],
        [ 10, [ $.Float(20.0) ], 10.515598977718 ],
      ], { closeTo: 1e-6, randSeed: 0 });
    });
    it("#clip", function() {
      testCase(this, [
        [ -10, [ -1, 2 ], -1 ],
        [  10, [ -1, 2 ],  2 ],
        [   0, [ "\\a" ], "\\a" ],
        [   0, [ 0, "\\a" ], "\\a" ],
        [   0, [ -1.5, +1.5 ], $.Float(0.0) ],
      ]);
    });
    it("#wrap", function() {
      testCase(this, [
        [ -20, [ -1, 2 ],  0 ],
        [ -15, [ -1, 2 ],  1 ],
        [ -10, [ -1, 2 ],  2 ],
        [  -5, [ -1, 2 ], -1 ],
        [  -4, [ -1, 2 ],  0 ],
        [  -3, [ -1, 2 ],  1 ],
        [  -2, [ -1, 2 ],  2 ],
        [  -1, [ -1, 2 ], -1 ],
        [   0, [ -1, 2 ],  0 ],
        [   1, [ -1, 2 ],  1 ],
        [   2, [ -1, 2 ],  2 ],
        [   3, [ -1, 2 ], -1 ],
        [   4, [ -1, 2 ],  0 ],
        [   5, [ -1, 2 ],  1 ],
        [  10, [ -1, 2 ],  2 ],
        [  15, [ -1, 2 ], -1 ],
        [  20, [ -1, 2 ],  0 ],
        [   0, [ "\\a" ], "\\a" ],
        [   0, [ 0, "\\a" ], "\\a" ],
        [   2, [ -1, $.Float(2.0) ], $.Float(-1.0) ],
      ]);
    });
    it("#fold", function() {
      testCase(this, [
        [ -10, [ -1, 2 ],  2 ],
        [  10, [ -1, 2 ],  0 ],
        [   0, [ "\\a" ], "\\a" ],
        [   0, [ 0, "\\a" ], "\\a" ],
        [   2, [ -1, $.Float(2.0) ], $.Float(2.0) ],
      ]);
    });
    it("#even", function() {
      testCase(this, [
        [ -2, [], true  ],
        [ -1, [], false ],
        [  0, [], true  ],
        [  1, [], false ],
        [  2, [], true  ],
      ]);
    });
    it("#odd", function() {
      testCase(this, [
        [ -2, [], false ],
        [ -1, [], true  ],
        [  0, [], false ],
        [  1, [], true  ],
        [  2, [], false ],
      ]);
    });
    it("#xrand", function() {
      testCase(this, [
        [ 10, [], 8 ],
        [ 10, [], 1 ],
        [ 10, [], 2 ],
        [ 10, [ 5 ], 0 ],
        [ 10, [ 5 ], 9 ],
        [ 10, [ [ 0 ] ], [ 4 ] ],
      ], { randSeed: 0 });
    });
    it("#xrand2", function() {
      testCase(this, [
        [ 10, [],  7 ],
        [ 10, [], -9 ],
        [ 10, [], -7 ],
        [ 10, [], 10 ],
        [ 10, [ -3 ], 10 ],
      ], { randSeed: 0 });
    });
    it("#degreeToKey", sinon.test(function() {
      var instance, test;
      var $scale, $stepsPerOctave;

      $scale = $$({
        performDegreeToKey: this.spy(sc.test.func())
      });
      $stepsPerOctave = $$();

      instance = this.createInstance();

      test = instance.degreeToKey($scale, $stepsPerOctave);
      expect($scale.performDegreeToKey).to.be.calledWith(instance, $stepsPerOctave);
      expect($scale.performDegreeToKey).to.be.calledLastIn(test);
    }));
    it("#do", sinon.test(function() {
      var instance, test, iter;
      var $function;

      iter = {};
      $function = $$();

      this.stub(iterator, "integer$do", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.do($function);
      expect(iterator.integer$do).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#generate", sinon.test(function() {
      var instance, test;
      var $function;

      $function = $$({ value: this.spy() });

      instance = this.createInstance();
      test = instance.generate($function);

      expect($function.value).to.be.calledWith(instance);
      expect($function.value).to.be.calledLastIn(test);
    }));
    it("#collectAs", function() {
      testCase(this, [
        {
          source: 5,
          args: [ function($i) {
            return $i.__inc__();
          } ],
          result: [ 1, 2, 3, 4, 5 ]
        },
        {
          source: 5,
          args: [ function($i) {
            return $i.__dec__();
          }, $("Array") ],
          result: [ -1, 0, 1, 2, 3 ]
        },
      ]);
    });
    it("#collect", sinon.test(function() {
      var instance, test;
      var $function;

      $function = $$();

      instance = this.createInstance();
      this.stub(instance, "collectAs", sc.test.func());

      test = instance.collect($function);
      expect(instance.collectAs.args[0]).to.eql($$([ $function, $("Array") ])._);
      expect(instance.collectAs).to.be.calledLastIn(test);
    }));
    it("#reverseDo", sinon.test(function() {
      var instance, test, iter;
      var $function;

      iter = {};
      $function = $$();

      this.stub(iterator, "integer$reverseDo", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.reverseDo($function);
      expect(iterator.integer$reverseDo).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#for", sinon.test(function() {
      var instance, test, iter;
      var $endval, $function;

      iter = {};
      $endval   = $$();
      $function = $$();

      this.stub(iterator, "integer$for", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.for($endval, $function);
      expect(iterator.integer$for).to.be.calledWith(instance, $endval);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#forBy", sinon.test(function() {
      var instance, test;
      var iter = {};
      var $endval   = $$();
      var $stepval  = $$();
      var $function = $$();

      this.stub(iterator, "integer$forBy", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();
      test = instance.forBy($endval, $stepval, $function);
      expect(iterator.integer$forBy).to.be.calledWith(instance, $endval, $stepval);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#to", sinon.test(function() {
      var instance, test, spy;
      var $hi, $step;

      spy = this.spy(sc.test.func());
      $hi = $$();
      $step = $$();
      this.stub(sc.lang.klass, "get").withArgs("Interval").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.to($hi, $step);
      expect(spy).to.be.calledWith(instance, $hi, $step);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#asAscii", function() {
      testCase(this, [
        [ 48, [], "$0" ],
      ]);
    });
    it.skip("#asUnicode", function() {
    });
    it("#asDigit", function() {
      testCase(this, [
        [  0, [], "$0" ],
        [  9, [], "$9" ],
        [ 10, [], "$A" ],
        [ 35, [], "$Z" ],
        [ 55, [], new Error("asDigit must be 0 <= this <= 35") ],
      ]);
    });
    it("#asBinaryDigits", function() {
      testCase(this, [
        {
          source: 123,
          args: [],
          result: [ 0, 1, 1, 1, 1, 0, 1, 1 ]
        },
      ]);
    });
    it("#asDigits", function() {
      testCase(this, [
        {
          source: 123,
          args: [],
          result: [ 1, 2, 3 ]
        },
        {
          source: 123,
          args: [ 16 ],
          result: [ 7, 11 ]
        },
        {
          source: 123,
          args: [ 3, 3 ],
          result: [ 1, 2, 0 ]
        },
        {
          source: 123,
          args: [ 2.5 ],
          result: [ 0, 2, 2, 1.5, 1.5, 0.5 ]
        },
      ]);
    });
    it.skip("#nextPowerOfTwo", function() {
    });
    it.skip("#isPowerOfTwo", function() {
    });
    it.skip("#leadingZeroes", function() {
    });
    it.skip("#trailingZeroes", function() {
    });
    it.skip("#numBits", function() {
    });
    it.skip("#log2Ceil", function() {
    });
    it.skip("#grayCode", function() {
    });
    it.skip("#setBit", function() {
    });
    it.skip("#nthPrime", function() {
    });
    it.skip("#prevPrime", function() {
    });
    it.skip("#nextPrime", function() {
    });
    it.skip("#indexOfPrime", function() {
    });
    it.skip("#isPrime", function() {
    });
    it.skip("#exit", function() {
    });
    it.skip("#asStringToBase", function() {
    });
    it.skip("#asBinaryString", function() {
    });
    it.skip("#asHexString", function() {
    });
    it.skip("#asIPString", function() {
    });
    it.skip("#archiveAsCompileString", function() {
    });
    it("#geom", function() {
      testCase(this, [
        {
          source: 5,
          args: [ 2, 4 ],
          result: [ 2, 8, 32, 128, 512 ]
        }
      ]);
    });
    it("#fib", function() {
      testCase(this, [
        {
          source: 10,
          result: [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]
        }
      ]);
    });
    it.skip("#factors", function() {
    });
    it.skip("#pidRunning", function() {
    });
    it.skip("#factorial", function() {
    });
    it.skip("#isCaps", function() {
    });
    it.skip("#isShift", function() {
    });
    it.skip("#isCtrl", function() {
    });
    it.skip("#isAlt", function() {
    });
    it.skip("#isCmd", function() {
    });
    it.skip("#isNumPad", function() {
    });
    it.skip("#isHelp", function() {
    });
    it.skip("#isFun", function() {
    });
    it("#bitNot", function() {
      var instance, test;

      instance = this.createInstance(1);

      test = instance.bitNot();
      expect(test).to.be.a("SCInteger").that.equals(-2);
    });
  });
})();

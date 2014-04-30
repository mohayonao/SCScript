(function() {
  "use strict";

  require("./Float");

  var testCase = sc.test.testCase;

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  describe("SCFloat", function() {
    var SCFloat;
    before(function() {
      SCFloat = $SC("Float");
      this.createInstance = function(value) {
        return $SC.Float(typeof value === "undefined" ? 0 : value);
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.C.TAG_FLOAT);
    });
    it("#__num__", function() {
      var instance, test;

      instance = this.createInstance(2014.0326);

      test = instance.__num__();
      expect(test).to.be.a("JSNumber").that.equals(2014.0326);
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance(2014.0322);

      test = instance.valueOf();
      expect(test).to.be.a("JSNumber").that.equals(2014.0322);
    });
    it("#toString", function() {
      var instance, test;
      [
        [ 1.5, "1.5" ],
        [ 1.0, "1" ],
        [  Infinity, "inf"  ],
        [ -Infinity, "-inf" ],
        [ NaN      , "nan"  ],
      ].forEach(function(items) {
        instance = this.createInstance(items[0]);
        test = instance.toString();
        expect(test).with_message("@{0}.toString()", items)
          .to.be.a("JSString").that.equals(items[1]);
      }, this);
    });
    it(".new", function() {
      expect(function() {
        SCFloat.new();
      }).to.throw("should use literal");
    });
    it("#isFloat", function() {
      testCase(this, [
        [ 0.0, [], true ]
      ]);
    });
    it("#asFloat", function() {
      var instance = this.createInstance(0);
      expect(instance.asFloat).to.be.nop;
    });
    it("#+", function() {
      testCase(this, [
        [ 10.5, [ 1 ], 11.5 ],
        [ 10.5, [ 0.5 ], $SC.Float(11.0) ],
        [ 10.5, [ "1" ], "10.5 1" ],
      ]);
    });
    it("#-", function() {
      testCase(this, [
        [ 10.5, [ 1 ], 9.5 ],
        [ 10.5, [ 0.5 ], $SC.Float(10.0) ],
      ]);
    });
    it("#*", function() {
      testCase(this, [
        [ 10.5, [ 2 ], $SC.Float(21.0) ],
        [ 10.5, [ 1.5 ], 15.75 ],
      ]);
    });
    it("#/", function() {
      testCase(this, [
        [ 10.5, [ 2 ], 5.25 ],
        [ 10.5, [ 1.5 ], $SC.Float(7.0) ],
      ]);
    });
    it("#mod", function() {
      testCase(this, [
        [ 10.5, [ 2 ], 0.5 ],
        [ 10.5, [ 1.5 ], $SC.Float(0.0) ],
      ]);
    });
    it("#div", function() {
      testCase(this, [
        [ 10.5, [ 2 ], $SC.Integer(5) ],
        [ 10.5, [ 1.5 ], $SC.Integer(7) ],
      ]);
    });
    it("#max", function() {
      testCase(this, [
        [ 10.5, [ 20 ], $SC.Float(20.0) ],
        [ 10.5, [ 1.5 ], 10.5 ],
      ]);
    });
    it("#min", function() {
      testCase(this, [
        [ 10.5, [ 10 ], $SC.Float(10.0) ],
        [ 10.5, [ 1.5 ], 1.5 ],
      ]);
    });
    it("#bitAnd", function() {
      testCase(this, [
        [ 123.5, [ 456 ], $SC.Float(72.0) ],
        [ 123.5, [ $SC.Float(456.5) ], $SC.Float(72.0) ],
      ]);
    });
    it("#bitOr", function() {
      testCase(this, [
        [ 123.5, [ 456 ], $SC.Float(507.0) ],
        [ 123.5, [ $SC.Float(456.0) ], $SC.Float(507.0) ],
      ]);
    });
    it("#bitXor", function() {
      testCase(this, [
        [ 123.5, [ 456 ], $SC.Float(435.0) ],
        [ 123.5, [ $SC.Float(456.5) ], $SC.Float(435.0) ],
      ]);
    });
    it("#lcm", function() {
      testCase(this, [
        [ 123.5, [ 456 ], $SC.Float(18696.0) ],
        [ 123.5, [ $SC.Float(456.5) ], $SC.Float(18696.0) ],
      ]);
    });
    it("#gcd", function() {
      testCase(this, [
        [ 123.5, [ 456 ], $SC.Float(3.0) ],
        [ 123.5, [ $SC.Float(456.5) ], $SC.Float(3.0) ],
      ]);
    });
    it("#round", function() {
      testCase(this, [
        [ 123.5, [ 25 ], $SC.Float(125.0) ],
        [ 123.5, [ 25.5 ], 127.5 ],
      ]);
    });
    it("#roundUp", function() {
      testCase(this, [
        [ 123.5, [ 25 ], $SC.Float(125.0) ],
        [ 123.5, [ 25.5 ], 127.5 ],
      ]);
    });
    it("#trunc", function() {
      testCase(this, [
        [ 123.5, [ 25 ], $SC.Float(100.0) ],
        [ 123.5, [ 25.5 ], $SC.Float(102.0) ],
      ]);
    });
    it("#atan2", function() {
      testCase(this, [
        [ 1, [ 2 ], 0.46364760900081 ],
        [ 1, [ $SC.Float(2.0) ], 0.46364760900081 ],
      ], { closeTo: 1e-6 });
    });
    it("#hypot", function() {
      testCase(this, [
        [ 1, [ 2 ], 2.2360679774998 ],
        [ 1, [ $SC.Float(2.0) ], 2.2360679774998 ],
      ], { closeTo: 1e-6 });
    });
    it("#hypotApx", function() {
      testCase(this, [
        [ 1, [ 2 ], 2.5857864320278 ],
        [ 1, [ $SC.Float(2.0) ], 2.5857864320278 ],
      ], { closeTo: 1e-6 });
    });
    it("#leftShift", function() {
      testCase(this, [
        [ 11.5, [ 2 ], $SC.Float(44.0) ],
        [ 11.5, [ 2.5 ], $SC.Float(44.0) ],
      ]);
    });
    it("#rightShift", function() {
      testCase(this, [
        [ 11.5, [ 2 ], $SC.Float(2.0) ],
        [ 11.5, [ 2.5 ], $SC.Float(2.0) ],
      ]);
    });
    it("#unsignedRightShift", function() {
      testCase(this, [
        [ 11.5, [ 2 ], $SC.Float(2.0) ],
        [ 11.5, [ 2.5 ], $SC.Float(2.0) ],
      ]);
    });
    it("#ring1", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 4.5 ],
        [ 1.5, [ 2.5 ], 5.25 ],
      ]);
    });
    it("#ring2", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 6.5 ],
        [ 1.5, [ 2.5 ], 7.75 ],
      ]);
    });
    it("#ring3", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 4.5 ],
        [ 1.5, [ 2.5 ], 5.625 ],
      ]);
    });
    it("#ring4", function() {
      testCase(this, [
        [ 1.5, [ 2 ], -1.5 ],
        [ 1.5, [ 2.5 ], -3.75 ],
      ]);
    });
    it("#difsqr", function() {
      testCase(this, [
        [ 1.5, [ 2 ], -1.75 ],
        [ 1.5, [ 2.5 ], $SC.Float(-4.0) ],
      ]);
    });
    it("#sumsqr", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 6.25 ],
        [ 1.5, [ 2.5 ], 8.5 ],
      ]);
    });
    it("#sqrdif", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 0.25 ],
        [ 1.5, [ 2.5 ], $SC.Float(1.0) ],
      ]);
    });
    it("#absdif", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 0.5 ],
        [ 1.5, [ 2.5 ], $SC.Float(1.0) ],
      ]);
    });
    it("#thresh", function() {
      testCase(this, [
        [ 1.5, [ 2 ], $SC.Float(0.0) ],
        [ 1.5, [ 2.5 ], $SC.Float(0.0) ],
      ]);
    });
    it("#amclip", function() {
      testCase(this, [
        [ 1.5, [ 2 ], $SC.Float(3.0) ],
        [ 1.5, [ 2.5 ], 3.75 ],
      ]);
    });
    it("#scaleneg", function() {
      testCase(this, [
        [ 1.5, [ 2 ], 1.5 ],
        [ 1.5, [ 2.5 ], 1.5 ],
      ]);
    });
    it("#clip2", function() {
      testCase(this, [
        [ 12.3, [ 4 ], $SC.Float(4.0) ],
        [ 12.3, [ 4.5 ], 4.5 ],
      ]);
    });
    it("#wrap2", function() {
      testCase(this, [
        [ 12.3, [ 4 ], -3.7 ],
        [ 12.3, [ 4.5 ], 3.3 ],
      ], { closeTo: 1e-6 });
    });
    it("#fold2", function() {
      testCase(this, [
        [ 12.3, [ 4 ], -3.7 ],
        [ 12.3, [ 4.5 ], -3.3 ],
      ], { closeTo: 1e-6 });
    });
    it("#excess", function() {
      testCase(this, [
        [ 12.3, [ 4 ], 8.3 ],
        [ 12.3, [ 4.5 ], 7.8 ],
      ], { closeTo: 1e-6 });
    });
    it("#firstArg", function() {
      testCase(this, [
        [ 12.3, [ 4 ], 12.3 ],
        [ 12.3, [ 4.5 ], 12.3 ],
      ]);
    });
    it("#rrand", function() {
      testCase(this, [
        [ 12.3, [ 4 ], 5.1823229193687 ],
        [ 12.3, [ 4.5 ], 11.734258317947 ],
      ], { closeTo: 1e-6, randSeed: 0 });
    });
    it("#exprand", function() {
      testCase(this, [
        [ 12.3, [ 4 ], 4.6941047877121 ],
        [ 12.3, [ 4.5 ], 11.434873057617 ],
      ], { closeTo: 1e-6, randSeed: 0 });
    });
    it("#clip", function() {
      testCase(this, [
        [ +0.0, [ -0.2, -0.2 ], -0.2 ],
        [ -0.2, [ -0.2, +0.2 ], -0.2 ],
        [ +0.2, [ -0.2, +0.2 ], +0.2 ],
        [ +1.0, [ -0.8, +0.8 ], +0.8 ],
        [ +3.0, [ -0.8, +0.8 ], +0.8 ],
        [ -1.0, [ -0.8, +0.8 ], -0.8 ],
        [ -3.0, [ -0.8, +0.8 ], -0.8 ],
        [ -0.0, [ -0.8, +0.8 ], $SC.Float(-0.0) ],
        [ +9.1, [ -0.2, +0.2 ], +0.2 ],
        [ +0.0, [ "\\a" ], "\\a" ],
        [ +0.0, [ 0, "\\a" ], "\\a" ],
      ]);
    });
    it("#wrap", function() {
      testCase(this, [
        [ +0.0, [ -0.2, -0.2 ], -0.2 ],
        [ -0.2, [ -0.2, +0.2 ], -0.2 ],
        [ +0.2, [ -0.2, +0.2 ], -0.2 ],
        [ +1.0, [ -0.8, +0.8 ], -0.6 ],
        [ +3.0, [ -0.8, +0.8 ], -0.2 ],
        [ -1.0, [ -0.8, +0.8 ], +0.6 ],
        [ -3.0, [ -0.8, +0.8 ], +0.2 ],
        [ -0.0, [ -0.8, +0.8 ], $SC.Float(-0.0) ],
        [ +9.1, [ -0.2, +0.2 ], -0.1 ],
        [ +0.0, [ "\\a" ], "\\a" ],
        [ +0.0, [ 0, "\\a" ], "\\a" ],
      ], { closeTo: 1e-6 });
    });
    it("#fold", function() {
      testCase(this, [
        [ +0.0, [ -0.2, -0.2 ], -0.2 ],
        [ -0.2, [ -0.2, +0.2 ], -0.2 ],
        [ +0.2, [ -0.2, +0.2 ], +0.2 ],
        [ +1.0, [ -0.8, +0.8 ], +0.6 ],
        [ +3.0, [ -0.8, +0.8 ], -0.2 ],
        [ -1.0, [ -0.8, +0.8 ], -0.6 ],
        [ -3.0, [ -0.8, +0.8 ], +0.2 ],
        [ -0.2, [ -0.8, +0.8 ], -0.2 ],
        [ +9.1, [ -0.2, +0.2 ], +0.1 ],
        [ +0.0, [ "\\a" ], "\\a" ],
        [ +0.0, [ 0, "\\a" ], "\\a" ],
      ], { closeTo: 1e-6 });
    });
    it("#as32Bits", function() {
      testCase(this, [
        [ 3.14, [], $SC.Integer(1078523331) ]
      ]);
    });
    it("#high32Bits", function() {
      testCase(this, [
        [ 3.14, [], $SC.Integer(1074339512) ]
      ]);
    });
    it("#low32Bits", function() {
      testCase(this, [
        [ 3.14, [], $SC.Integer(1374389535) ]
      ]);
    });
    it(".from32Bits", function() {
      testCase(this, [
        [ null, [ 1074339512 ], $SC.Float(2.1424999237060547) ]
      ]);
    });
    it(".from64Bits", function() {
      testCase(this, [
        [ null, [ 1074339512, 1374389535 ], $SC.Float(3.14) ]
      ]);
    });
    it("#do", sinon.test(function() {
      var instance, test, iter;
      var $function;

      iter = [];
      $function = sc.test.object();
      this.stub(iterator, "float$do", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.do($function);
      expect(iterator.float$do).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#reverseDo", sinon.test(function() {
      var instance, test, iter;
      var $function;

      iter = {};
      $function = sc.test.object();

      this.stub(iterator, "float$reverseDo", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.reverseDo($function);
      expect(iterator.float$reverseDo).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#bitNot", function() {
      var instance, test;

      instance = this.createInstance(1);

      test = instance.bitNot();
      expect(test).to.be.a("SCFloat").that.is.closeTo(1.0000009536743, 1e-6);
    });
  });
})();

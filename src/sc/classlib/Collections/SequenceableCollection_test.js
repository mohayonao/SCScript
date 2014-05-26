(function() {
  "use strict";

  require("./SequenceableCollection");

  var testCase = sc.test.testCase;

  var $ = sc.lang.$;

  describe("SCSequenceableCollection", function() {
    var SCSequenceableCollection, SCArray;
    before(function() {
      SCSequenceableCollection = $("SequenceableCollection");
      SCArray = $("Array");
      this.createInstance = function(source, immutable) {
        var instance = $.Array((source||[]).map(sc.test.encode), !!immutable);
        var testMethod = this.test.title.substr(1);
        sc.test.setSingletonMethod(instance, "SequenceableCollection", testMethod);
        return instance;
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = SCSequenceableCollection.new();

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it("#|@|", sinon.test(function() {
      var instance, test;
      var $index;

      $index = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "clipAt", sc.test.func);

      test = instance ["|@|"] ($index);
      expect(instance.clipAt).to.be.calledWith($index);
      expect(instance.clipAt).to.be.calledLastIn(test);
    }));
    it("#@@", sinon.test(function() {
      var instance, test;
      var $index;

      $index = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "wrapAt", sc.test.func);

      test = instance ["@@"] ($index);
      expect(instance.wrapAt).to.be.calledWith($index);
      expect(instance.wrapAt).to.be.calledLastIn(test);
    }));
    it("#@|@", sinon.test(function() {
      var instance, test;
      var $index;

      $index = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "foldAt", sc.test.func);

      test = instance ["@|@"] ($index);
      expect(instance.foldAt).to.be.calledWith($index);
      expect(instance.foldAt).to.be.calledLastIn(test);
    }));
    it(".series", function() {
      var test = SCSequenceableCollection.series.call(
        SCArray, $.Integer(6), $.Integer(2), $.Integer(4)
      );
      expect(test).to.be.a("SCArray").to.eqls([
        2, 6, 10, 14, 18, 22
      ]);
    });
    it(".geom", function() {
      var test = SCSequenceableCollection.geom.call(
        SCArray, $.Integer(6), $.Integer(2), $.Integer(4)
      );
      expect(test).to.be.a("SCArray").to.eqls([
        2, 8, 32, 128, 512, 2048
      ]);
    });
    it(".fib", function() {
      var test = SCSequenceableCollection.fib.call(
        SCArray, $.Integer(6)
      );
      expect(test).to.be.a("SCArray").to.eqls([
        1.0, 1.0, 2.0, 3.0, 5.0, 8.0
      ]);
    });
    it.skip(".rand", function() {
    });
    it.skip(".rand2", function() {
    });
    it.skip(".linrand", function() {
    });
    it(".interpolation", function() {
      var test;

      test = SCSequenceableCollection.interpolation.call(
        SCArray, $.Integer(1)
      );
      expect(test).to.be.a("SCArray").to.eqls([ 0.0 ]);

      test = SCSequenceableCollection.interpolation.call(
        SCArray, $.Integer(5)
      );
      expect(test).to.be.a("SCArray").to.eqls([
        0.0, 0.25, 0.5, 0.75, 1.0
      ]);
    });
    it("#++", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30 ],
          args  : [ [ 40, 50, 60 ] ],
          result: [ 10, 20, 30, 40, 50, 60 ]
        }
      ]);
    });
    it.skip("#+++", function() {
    });
    it("#asSequenceableCollection", function() {
      var instance = this.createInstance();
      expect(instance.asSequenceableCollection).to.be.nop;
    });
    it("#choose", function() {
      testCase(this, [
        [ [ 1, 2, 3, 4, 5 ], [], 5 ],
        [ [ 1, 2, 3, 4, 5 ], [], 1 ],
        [ [ 1, 2, 3, 4, 5 ], [], 1 ],
        [ [ 1, 2, 3, 4, 5 ], [], 3 ],
        [ [ 1, 2, 3, 4, 5 ], [], 2 ],
      ], { randSeed: 0 });
    });
    it("#wchoose", function() {
      testCase(this, [
        [ [ 1, 2, 3, 4, 5 ], [ [ 0.1, 0.2, 0.3, 0.4 ] ], 4 ],
        [ [ 1, 2, 3, 4, 5 ], [ [ 0.1, 0.2, 0.3, 0.4 ] ], 1 ],
        [ [ 1, 2, 3, 4, 5 ], [ [ 0.1, 0.2, 0.3, 0.4 ] ], 2 ],
        [ [ 1, 2, 3, 4, 5 ], [ [ 0.1, 0.2, 0.3, 0.4 ] ], 3 ],
        [ [ 1, 2, 3, 4, 5 ], [ [ 0.1, 0.2, 0.3, 0.4 ] ], 3 ],
      ], { randSeed: 0 });
    });
    it("#==", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30 ],
          args  : [ [ 10, 20, 30 ] ],
          result: true
        },
        {
          source: [ 10, 20, 30 ],
          args  : [ [ 10, 20, $.Float(30.0) ] ],
          result: true
        },
        {
          source: [ 10, 20, 30 ],
          args  : [ [ 10, 10, 30 ] ],
          result: false
        },
        {
          source: [ 10, 20, 30, 40 ],
          args  : [ [ 10, 20, 30 ] ],
          result: false
        },
        {
          source: [ 10, 20, 30 ],
          args  : [ $.String("102030") ],
          result: false
        },
      ]);
    });
    it.skip("#hash", function() {
    });
    it("#copyRange", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 1, 3 ],
          result: [ 20, 30, 40 ],
        },
      ]);
    });
    it("#keep", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 3 ],
          result: [ 10, 20, 30 ],
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ -3 ],
          result: [ 30, 40, 50 ],
        }
      ]);
    });
    it("#drop", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 3 ],
          result: [ 40, 50 ],
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ -3 ],
          result: [ 10, 20 ],
        }
      ]);
    });
    it("#copyToEnd", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 1 ],
          result: [ 20, 30, 40, 50 ]
        }
      ]);
    });
    it("#copyFromStart", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 1 ],
          result: [ 10, 20 ]
        }
      ]);
    });
    it("#indexOf", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50, 10, 20, 30, 40, 50 ],
          args  : [ 20 ],
          result: 1
        },
        {
          source: [ 10, 20, 30, 40, 50, 10, 20, 30, 40, 50 ],
          args  : [ 0 ],
          result: null
        },
      ]);
    });
    it.skip("#indexOfEqual", function() {
    });
    it("#indicesOfEqual", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50, 10, 20, 30, 40, 50 ],
          args  : [ 20 ],
          result: [ 1, 6 ]
        },
        {
          source: [ 10, 20, 30, 40, 50, 10, 20, 30, 40, 50 ],
          args  : [ 0 ],
          result: null
        },
      ]);
    });
    it("#find", function() {
      testCase(this, [
        {
          source: [ 0, 1, 1, 2, 3, 5, 8, 13 ],
          args  : [ [ 1, 2 ] ],
          result: 2
        },
        {
          source: [ 0, 1, 1, 2, 3, 5, 8, 13 ],
          args  : [ [ 1, 2 ], 3 ],
          result: null
        },
      ]);
    });
    it("#findAll", function() {
      testCase(this, [
        {
          source: [ 10, 20, 10, 20, 10, 20 ],
          args  : [ [ 20, 10 ] ],
          result: [ 1, 3 ]
        },
        {
          source: [ 10, 20, 10, 20, 10, 20 ],
          args  : [ [ 20, 10 ], 2 ],
          result: [ 3 ]
        },
        {
          source: [ 10, 20, 10, 20, 10, 20 ],
          args  : [ 0 ],
          result: null
        },
      ]);
    });
    it("#indexOfGreaterThan", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 25 ],
          result: 2
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 20 ],
          result: 2
        },
      ]);
    });
    it("#indexIn", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 60 ],
          result: 4
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 0 ],
          result: 0
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 22 ],
          result: 1
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 28 ],
          result: 2
        }
      ]);
    });
    it("#indexInBetween", function() {
      testCase(this, [
        {
          source: [],
          args  : [ 0 ],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 60 ],
          result: 4
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 5 ],
          result: 0
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 25 ],
          result: $.Float(1.5)
        },
      ]);
    });
    it("#isSeries", function() {
      testCase(this, [
        {
          source: [ 10 ],
          args  : [],
          result: true
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [],
          result: true
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 5 ],
          result: false
        },
      ]);
    });
    it("#resamp0", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 8 ],
          result: [ 10, 20, 20, 30, 30, 40, 40, 50 ]
        }
      ]);
    });
    it("#resamp1", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 8 ],
          result: [
            10,
            15.714285714285714,
            21.428571428571427,
            27.142857142857142,
            32.857142857142854,
            38.57142857142857,
            44.285714285714285,
            50
          ]
        }
      ]);
    });
    it("#remove", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 20 ],
          result: 20,
          after : [ 10, 30, 40, 50 ]
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 0 ],
          result: null
        },
      ]);
    });
    it("#removing", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 20 ],
          result: [ 10, 30, 40, 50 ]
        },
      ]);
    });
    it("#take", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 20 ],
          result: 20,
          after : [ 10, 50, 30, 40 ]
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 0 ],
          result: null
        },
      ]);
    });
    it("#lastIndex", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          result: 4
        },
      ]);
    });
    it("#middleIndex", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          result: 2
        },
        {
          source: [ 10, 20, 30, 40, 50, 60 ],
          result: 2
        },
      ]);
    });
    it("#first", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          result: 10
        },
      ]);
    });
    it("#last", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          result: 50
        },
      ]);
    });
    it("#middle", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          result: 30
        },
        {
          source: [ 10, 20, 30, 40, 50, 60 ],
          result: 30
        },
      ]);
    });
    it("#top", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          result: 50
        },
      ]);
    });
    it("#putFirst", function() {
      testCase(this, [
        {
          source: [],
          args  : [ 0 ],
          result: this,
          after : []
        },
        {
          source: [ 10, 20, 30 ],
          args  : [ 0 ],
          result: this,
          after : [ 0, 20, 30 ]
        },
      ]);
    });
    it("#putLast", function() {
      testCase(this, [
        {
          source: [],
          args  : [ 0 ],
          result: this,
          after : []
        },
        {
          source: [ 10, 20, 30 ],
          args  : [ 0 ],
          result: this,
          after : [ 10, 20, 0 ]
        },
      ]);
    });
    it("#obtain", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 1 ],
          result: 20
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 10, 0 ],
          result: 0
        },
      ]);
    });
    it("#instill", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 10, 100, 0 ],
          result: [ 10, 20, 30, 40, 50, 0, 0, 0, 0, 0, 100 ]
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 3, 100, 0 ],
          result: [ 10, 20, 30, 100, 50 ]
        },
      ]);
    });
    it("#pairsDo", sinon.test(function() {
      var instance, test;
      var $function;

      $function = sc.test.object({ value: this.spy() });

      instance = this.createInstance([ 10, 20, 30, 40 ]);

      test = instance.pairsDo($function);
      expect($function.value).to.callCount(2);
      expect($function.value.args[0]).js.to.eql([ 10, 20, 0 ]);
      expect($function.value.args[1]).js.to.eql([ 30, 40, 2 ]);
      expect(test).to.equal(instance);
    }));
    it("#keysValuesDo", sinon.test(function() {
      var instance, test;
      var $function;

      $function = sc.test.object();

      instance = this.createInstance([ 10, 20, 30, 40 ]);
      this.stub(instance, "pairsDo", sc.test.func);

      test = instance.keysValuesDo($function);
      expect(instance.pairsDo).to.be.calledWith($function);
      expect(instance.pairsDo).to.be.calledLastIn(test);
    }));
    it("#doAdjacentPairs", sinon.test(function() {
      var instance, test;
      var $function;

      $function = sc.test.object({
        value: this.spy()
      });

      instance = this.createInstance([ 10, 20, 30, 40 ]);

      test = instance.doAdjacentPairs($function);
      expect($function.value).to.callCount(3);
      expect($function.value.args[0]).js.to.eql([ 10, 20, 0 ]);
      expect($function.value.args[1]).js.to.eql([ 20, 30, 1 ]);
      expect($function.value.args[2]).js.to.eql([ 30, 40, 2 ]);
      expect(test).to.equal(instance);
    }));
    it("#separate", function() {
      testCase(this, [
        {
          source: [],
          result: [ [] ]
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ function($a) {
            return $.Boolean($a.valueOf() === 20);
          } ],
          result: [ [ 10, 20 ], [ 30, 40, 50 ] ]
        },
      ]);
    });
    it("#delimit", function() {
      testCase(this, [
        {
          source: [],
          result: [ [] ]
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ function($a) {
            return $.Boolean($a.valueOf() === 20);
          } ],
          result: [ [ 10 ], [ 30, 40, 50 ] ]
        },
      ]);
    });
    it("#clump", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ 2 ],
          result: [ [ 10, 20 ], [ 30, 40 ], [ 50 ] ]
        },
      ]);
    });
    it("#clumps", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ [ 2, 1 ] ],
          result: [ [ 10, 20 ], [ 30 ], [ 40, 50 ] ]
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ [ 2, 1, 3 ] ],
          result: [ [ 10, 20 ], [ 30 ], [ 40, 50 ] ]
        },
      ]);
    });
    it("#curdle", function() {
      var test, instance, i = 0;
      var $probability;

      $probability = sc.test.object({
        coin: function() {
          return $.Boolean(i++ === 2);
        }
      });

      instance = this.createInstance([ 10, 20, 30, 40, 50 ]);

      test = instance.curdle($probability);
      expect(test).to.be.a("SCArray").that.eqls([
        [ 10, 20, 30 ], [ 40, 50 ]
      ]);
    });
    it("#flatten", function() {
      testCase(this, [
        {
          source: [],
          args  : [ 0 ],
          result: this
        },
        {
          source: [ [ 10, 20 ], [ 30, [ 40, 50 ] ] ],
          result: [ 10, 20, 30, [ 40, 50 ] ]
        },
        {
          source: [ [ 10, 20 ], [ 30, [ 40, 50 ] ] ],
          args  : [ 2 ],
          result: [ 10, 20, 30, 40, 50 ]
        }
      ]);
    });
    it("#flat", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ [ 10, 20 ], [ 30, [ 40, 50 ] ] ],
          result: [ 10, 20, 30, 40, 50 ]
        },
        {
          source: [ [ 10, 20 ], [ 30, [ 40, 50 ] ] ],
          result: [ 10, 20, 30, 40, 50 ]
        }
      ]);
    });
    it("#flatIf", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ [ 10, 20 ], [ 30, [ 40, 50 ] ] ],
          args  : [ function($item) {
            return $.Boolean($item._[0].valueOf() === 30);
          } ],
          result: [ [ 10, 20 ], 30, [ 40, 50 ] ]
        },
      ]);
    });
    it("#flop", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ [ 10, 20 ], [ 30, 40, 50 ], 60 ],
          result: [ [ 10, 30, 60 ], [ 20, 40, 60 ], [ 10, 50, 60 ] ]
        },
      ]);
    });
    it("#flopWith", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ [ 10, 20, 30 ], [ 40, 50, 60 ] ],
          result: [ null, null, null ]
        },
        {
          source: [ [ 10, 20, 30 ], [ 40, 50, 60 ], 70 ],
          args  : [ function($a, $b, $c) {
            return $a ["+"] ($b) ["*"] ($c);
          } ],
          result: [ 3500, 4900, 6300 ]
        },
      ]);
    });
    it.skip("#flopTogether", function() {
    });
    it.skip("#flopDeep", function() {
    });
    it.skip("#wrapAtDepth", function() {
    });
    it.skip("#unlace", function() {
    });
    it.skip("#integrate", function() {
    });
    it.skip("#differentiate", function() {
    });
    it.skip("#convertDigits", function() {
    });
    it.skip("#hammingDistance", function() {
    });
    it.skip("#degreeToKey", function() {
    });
    it.skip("#keyToDegree", function() {
    });
    it.skip("#nearestInScale", function() {
    });
    it.skip("#nearestInList", function() {
    });
    it.skip("#transposeKey", function() {
    });
    it.skip("#mode", function() {
    });
    it.skip("#performDegreeToKey", function() {
    });
    it.skip("#performNearestInList", function() {
    });
    it.skip("#performNearestInScale", function() {
    });
    it.skip("#convertRhythm", function() {
    });
    it.skip("#sumRhythmDivisions", function() {
    });
    it.skip("#convertOneRhythm", function() {
    });
    it("#isSequenceableCollection", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isSequenceableCollection();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#containsSeqColl", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: false
        },
        {
          source: [ 1, 2, [ 3, 4, 5 ] ],
          result: true
        },
      ]);
    });

    [
      "neg",
      "bitNot",
      "abs",
      "ceil",
      "floor",
      "frac",
      "sign",
      "squared",
      "cubed",
      "sqrt",
      "exp",
      "reciprocal",
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
      "isPositive",
      "isNegative",
      "isStrictlyPositive",
      "rectWindow",
      "hanWindow",
      "welWindow",
      "triWindow",
      "scurve",
      "ramp",
      "asFloat",
      "asInteger",
      "nthPrime",
      "prevPrime",
      "nextPrime",
      "indexOfPrime",
      "real",
      "imag",
      "magnitude",
      "magnitudeApx",
      "phase",
      "angle",
      "rho",
      "theta",
      "degrad",
      "raddeg",
    ].forEach(function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;

        instance = this.createInstance();
        this.stub(instance, "performUnaryOp", sc.test.func);

        test = instance[methodName]();
        expect(instance.performUnaryOp.args[0]).js.to.eql([ methodName ]);
        expect(instance.performUnaryOp).to.be.calledLastIn(test);
      }));
    });

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
    ].forEach(function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;
        var $aNumber = sc.test.object(), $adverb = sc.test.object();

        instance = this.createInstance();
        this.stub(instance, "performBinaryOp", sc.test.func);

        test = instance[methodName]($aNumber, $adverb);
        expect(instance.performBinaryOp).to.callCount(1);
        expect(instance.performBinaryOp.args[0]).js.to.eql([ methodName, $aNumber, $adverb ]);
        expect(instance.performBinaryOp).to.be.calledLastIn(test);
      }));
    });

    it("#performUnaryOp", sinon.test(function() {
      var instance, test;
      var $elem, $aSelector, $returned;

      $elem = sc.test.object({
        perform: this.spy(function() {
          return $returned;
        })
      });
      $aSelector = sc.test.object();
      $returned = sc.test.object();

      instance = this.createInstance([ $elem ]);

      test = instance.performUnaryOp($aSelector);
      expect($elem.perform).to.callCount(1);
      expect($elem.perform).to.be.calledWith($aSelector);
      expect(test).to.be.a("SCArray").that.eqls([ $returned ]);
    }));
    it("#performBinaryOp", sinon.test(function() {
      var instance, test;
      var $aSelector, $theOperand, $adverb;

      $aSelector  = sc.test.object();
      $theOperand = sc.test.object({
        performBinaryOpOnSeqColl: this.spy(sc.test.func)
      });
      $adverb = sc.test.object();

      instance = this.createInstance();

      test = instance.performBinaryOp($aSelector, $theOperand, $adverb);
      expect($theOperand.performBinaryOpOnSeqColl).to.callCount(1);
      expect($theOperand.performBinaryOpOnSeqColl).to.be.calledWith($aSelector, instance, $adverb);
      expect($theOperand.performBinaryOpOnSeqColl).to.be.calledLastIn(test);
    }));
    it("#performBinaryOpOnSeqColl.nil", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ] ],
          result: [ 11, 22, 33, 44, 55 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30 ] ],
          result: [ 11, 22, 33, 14, 25 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ] ],
          result: [ 11, 22, 33, 41, 52 ]
        },
      ]);
    });
    it("#performBinaryOpOnSeqColl.int", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], 0 ],
          result: [ 11, 22, 33, 44, 55 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], -1 ],
          result: [
            [ 11, 21, 31, 41, 51 ],
            [ 12, 22, 32, 42, 52 ],
            [ 13, 23, 33, 43, 53 ],
            [ 14, 24, 34, 44, 54 ],
            [ 15, 25, 35, 45, 55 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], 1 ],
          result: [
            [ 11, 12, 13, 14, 15 ],
            [ 21, 22, 23, 24, 25 ],
            [ 31, 32, 33, 34, 35 ],
            [ 41, 42, 43, 44, 45 ],
            [ 51, 52, 53, 54, 55 ]
          ]
        },
      ]);
    });
    it("#performBinaryOpOnSeqColl.t", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], "\\t" ],
          result: [
            [ 11, 12, 13, 14, 15 ],
            [ 21, 22, 23, 24, 25 ],
            [ 31, 32, 33, 34, 35 ],
            [ 41, 42, 43, 44, 45 ],
            [ 51, 52, 53, 54, 55 ]
          ]
        },
      ]);
    });
    it("#performBinaryOpOnSeqColl.x", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], "\\x" ],
          result: [
            11, 12, 13, 14, 15,
            21, 22, 23, 24, 25,
            31, 32, 33, 34, 35,
            41, 42, 43, 44, 45,
            51, 52, 53, 54, 55
          ]
        },
      ]);
    });
    it("#performBinaryOpOnSeqColl.s", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], "\\s" ],
          result: [ 11, 22, 33, 44, 55 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30 ], "\\s" ],
          result: [ 11, 22, 33 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], "\\s" ],
          result: [ 11, 22, 33 ]
        },
      ]);
    });
    it("#performBinaryOpOnSeqColl.f", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], "\\f" ],
          result: [ 11, 22, 33, 44, 55 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ "\\+", [ 10, 20, 30 ], "\\f" ],
          result: [ 11, 22, 33, 24, 15 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ "\\+", [ 10, 20, 30, 40, 50 ], "\\f" ],
          result: [ 11, 22, 33, 42, 51 ]
        },
      ]);
    });
    it("#performBinaryOpOnSeqColl.error", function() {
      var instance;
      var $aSelector, $theOperand, $adverb;

      $aSelector  = $.Symbol("+");
      $theOperand = sc.test.object();
      $adverb     = $.Symbol("error");

      instance = this.createInstance();

      expect(function() {
        instance.performBinaryOpOnSeqColl($aSelector, $theOperand, $adverb);
      }).to.throw("unrecognized adverb");
    });
    it("#performBinaryOpOnSimpleNumber", sinon.test(function() {
      var instance, test;
      var $elem, $aSelector, $aNumber, $adverb, $returned;

      $elem      = sc.test.object();
      $aSelector = sc.test.object();
      $aNumber   = sc.test.object({
        perform: this.spy(function() {
          return $returned;
        })
      });
      $adverb   = sc.test.object();
      $returned = sc.test.object();

      instance = this.createInstance([ $elem ]);

      test = instance.performBinaryOpOnSimpleNumber($aSelector, $aNumber, $adverb);
      expect($aNumber.perform).to.callCount(1);
      expect($aNumber.perform).to.be.calledWith($aSelector, $elem, $adverb);
      expect(test).to.be.a("SCArray").that.eqls([ $returned ]);
    }));
    it("#performBinaryOpOnComplex", sinon.test(function() {
      var instance, test;
      var $elem, $aSelector, $aComplex, $adverb, $returned;

      $elem      = sc.test.object();
      $aSelector = sc.test.object();
      $aComplex  = sc.test.object({
        perform: this.spy(function() {
          return $returned;
        })
      });
      $adverb   = sc.test.object();
      $returned = sc.test.object();

      instance = this.createInstance([ $elem ]);

      test = instance.performBinaryOpOnComplex($aSelector, $aComplex, $adverb);
      expect($aComplex.perform).to.callCount(1);
      expect($aComplex.perform).to.be.calledWith($aSelector, $elem, $adverb);
      expect(test).to.be.a("SCArray").that.eqls([ $returned ]);
    }));
    it("#asFraction", sinon.test(function() {
      var instance, test;
      var $elem, $denominator, $fasterBetter, $returned;

      $elem = sc.test.object({
        asFraction: this.spy(function() {
          return $returned;
        })
      });
      $denominator  = sc.test.object();
      $fasterBetter = sc.test.object();
      $returned     = sc.test.object();

      instance = this.createInstance([ $elem ]);

      test = instance.asFraction($denominator, $fasterBetter);
      expect($elem.asFraction).to.callCount(1);
      expect($elem.asFraction).to.be.calledWith($denominator, $fasterBetter);
      expect(test).to.be.a("SCArray").that.eqls([ $returned ]);
    }));
    it.skip("#asPoint", function() {
    });
    it.skip("#asRect", function() {
    });
    it("#ascii", function() {
      testCase(this, [
        {
          source: [ $.Char("a"), $.Char("b"), $.Char("c") ],
          result: [ 97, 98, 99 ]
        },
      ]);
    });
    it("#rate", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 10 ],
          result: "\\scalar"
        },
        {
          source: [ 10, 20, 30 ],
          result: "\\scalar"
        },
      ]);
    });
    it("#multiChannelPerform", sinon.test(function() {
      var instance, test, spy;
      var $arg1, $arg2;

      spy = this.spy(sc.test.func);
      $arg1 = sc.test.object();
      $arg2 = sc.test.object();
      this.stub(sc.lang.klass.utils, "getMethod")
        .withArgs("Object", "multiChannelPerform").returns(spy);

      instance = this.createInstance();
      test = instance.multiChannelPerform($arg1, $arg2);
      expect(test).to.be.a("SCArray").to.eqls([]);
      expect(sc.lang.klass.utils.getMethod).to.be.not.called;

      instance = this.createInstance([ 1, 2, 3 ]);
      test = instance.multiChannelPerform($arg1, $arg2);
      expect(spy).to.be.calledWith($arg1, $arg2);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#multichannelExpandRef", function() {
      var instance = this.createInstance();
      expect(instance.multichannelExpandRef).to.be.nop;
    });

    [
      "clip",
      "wrap",
      "fold",
      "linlin",
      "linexp",
      "explin",
      "expexp",
      "lincurve",
      "curvelin",
      "bilin",
      "biexp",
      "moddif",
      "range",
      "exprange",
      "curverange",
      "unipolar",
      "bipolar",
      "lag",
      "lag2",
      "lag3",
      "lagud",
      "lag2ud",
      "lag3ud",
      "varlag",
      "slew",
      "blend",
      "checkBadValues",
      "prune",
    ].forEach(function(methodName) {
      it("#" + methodName, sinon.test(function() {
        var instance, test;
        var $arg1, $arg2, $arg3;

        $arg1 = sc.test.object();
        $arg2 = sc.test.object();
        $arg3 = sc.test.object();

        instance = this.createInstance();
        this.stub(instance, "multiChannelPerform", sc.test.func);

        test = instance[methodName]($arg1, $arg2, $arg3);
        expect(instance.multiChannelPerform.args[0]).js.to.eql([
          methodName, $arg1, $arg2, $arg3
        ]);
        expect(instance.multiChannelPerform).to.be.calledLastIn(test);
      }));
    });

    it.skip("#minNyquist", function() {
    });
    it("#sort", function() {
      testCase(this, [
        {
          source: [ 1, 5, 2, 4, 3 ],
          result: this,
          after : [ 1, 2, 3, 4, 5 ]
        },
        {
          source: [ 1, 5, 2, 4, 3 ],
          args: [ function($a, $b) {
            return $b ["<="] ($a);
          } ],
          result: this,
          after : [ 5, 4, 3, 2, 1 ]
        }
      ]);
    });
    it("#sortBy", function() {
      testCase(this, [
        {
          source: [ [ 9, 1 ], [ 2, 8 ], [ 5, 5 ], [ 7, 3 ], [ 4, 6 ] ],
          args  : [ 1 ],
          result: this,
          after : [ [ 9, 1 ], [ 7, 3 ], [ 5, 5 ], [ 4, 6 ], [ 2, 8 ] ]
        }
      ]);
    });
    it("#sortMap", function() {
      testCase(this, [
        {
          source: [ -5, 3, -2, 0, 1, 6, 4 ],
          args  : [ function($a) {
            return $a.abs();
          } ],
          result: this,
          after : [ 0, 1, -2, 3, 4, -5, 6 ]
        }
      ]);
    });
    it.skip("#sortedMedian", function() {
    });
    it.skip("#median", function() {
    });
    it.skip("#quickSort", function() {
    });
    it.skip("#order", function() {
    });
    it("#swap", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3, 4, 5 ]);
      test = instance.swap(
        $.Integer(1), $.Integer(3)
      );
      expect(test).to.equal(instance)
        .that.is.a("SCArray").and.eqls([ 1, 4, 3, 2, 5 ]);
    });
    it.skip("#quickSortRange", function() {
    });
    it.skip("#mergeSort", function() {
    });
    it.skip("#mergeSortTemp", function() {
    });
    it.skip("#mergeTemp", function() {
    });
    it.skip("#insertionSort", function() {
    });
    it.skip("#insertionSortRange", function() {
    });
    it.skip("#hoareMedian", function() {
    });
    it.skip("#hoareFind", function() {
    });
    it.skip("#hoarePartition", function() {
    });
    it.skip("#$streamContensts", function() {
    });
    it.skip("#$streamContenstsLimit", function() {
    });
    it("#wrapAt", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3, 4, 5 ]);

      test = instance.wrapAt(
        $.Integer(7)
      );
      expect(test).to.be.a("SCInteger").that.equals(3);
    });
    it("#wrapPut", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3, 4, 5 ]);

      test = instance.wrapPut(
        $.Integer(7), $.Integer(0)
      );
      expect(test).to.equals(instance)
        .that.is.a("SCArray").and.eqls([ 1, 2, 0, 4, 5 ]);
    });
    it("#reduce", function() {
      testCase(this, [
        {
          source: [ 3 ],
          args  : [ "\\*" ],
          result: 3
        },
        {
          source: [ 3, 4, 5, 6 ],
          args  : [ "\\*" ],
          result: 360
        },
      ]);
    });
    it("#join", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: "1234",
        },
        {
          source: [ 1, 2, 3, 4 ],
          args  : [ 0 ],
          result: "1020304",
        },
      ]);
    });
    it.skip("#nextTimeOnGrid", function() {
    });
    it.skip("#asQuant", function() {
    });
    it.skip("#schedBundleArrayOnClock", function() {
    });
  });
})();

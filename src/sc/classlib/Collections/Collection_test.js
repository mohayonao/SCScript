describe("Collections/Collection", function() {
  "use strict";

  var testCase = sc.test.testCase;
  var $$ = sc.test.object;
  var $  = sc.lang.$;
  var SCCollection = $("Collection");
  var SCArray = $("Array");
  var $int3 = $$(3);
  var $int10 = $$(10);
  var $int100 = $$(100);

  describe("SCCollection", function() {
    before(function() {
      this.createInstance = function(source, immutable) {
        var instance = $.Array((source||[]).map($$), !!immutable);
        return $$(instance, "Collection" + this.test.title);
      };
    });

    it("#valueOf", function() {
      var instance, test;

      instance = SCCollection.new();

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });

    it(".newFrom", function() {
      var test;
      var $aCollection = $$([ 1, 2, 3, 4, 5 ]);

      test = SCCollection.newFrom.call(SCArray, $aCollection);
      expect(test).to.be.a("SCArray").that.deep.equals([ 1, 2, 3, 4, 5 ]);
    });

    it(".with", function() {
      var test;
      var $arg1 = $$();
      var $arg2 = $$();
      var $arg3 = $$();

      test = SCCollection.with.call(SCArray, $arg1, $arg2, $arg3);
      expect(test).to.be.a("SCArray").that.deep.equals([ $arg1, $arg2, $arg3 ]);
    });

    it(".fill", function() {
      var test;

      test = SCCollection.fill.call(SCArray, $int3, $$(function($i) {
        return $i ["*"] ($$(100));
      }));
      expect(test).to.be.a("SCArray").that.deep.equals([ 0, 100, 200 ]);

      test = SCCollection.fill.call(SCArray, $$([ $int3, $int3 ]));
      expect(test).to.be.a("SCArray").that.deep.equals([
        [ null, null, null ], [ null, null, null ], [ null, null, null ]
      ]);
    });

    it(".fill2D", function() {
      var test;

      test = SCCollection.fill2D.call(SCArray, $int3, $int3, $$(function($i, $j) {
        return $i ["*"] ($int10) ["+"] ($j);
      }));
      expect(test).to.be.a("SCArray").that.deep.equals([
        [ 0, 1, 2 ], [ 10, 11, 12 ], [ 20, 21, 22 ]
      ]);
    });

    it(".fill3D", function() {
      var test;

      test = SCCollection.fill3D.call(
        SCArray, $int3, $int3, $int3, $$(function($i, $j, $k) {
          return $i ["*"] ($int100) ["+"] ($j ["*"] ($int10)) ["+"] ($k);
        })
      );
      expect(test).to.be.a("SCArray").that.deep.equals([
        [ [   0,   1,   2 ], [  10,  11,  12 ], [  20,  21 , 22 ] ],
        [ [ 100, 101, 102 ], [ 110, 111, 112 ], [ 120, 121, 122 ] ],
        [ [ 200, 201, 202 ], [ 210, 211, 212 ], [ 220, 221, 222 ] ]
      ]);
    });

    it(".fillND", function() {
      var test;

      test = SCCollection.fillND.call(SCArray, $$([ $int3, $int3 ]));
      expect(test).to.be.a("SCArray").that.deep.equals([
        [ null, null, null ], [ null, null, null ], [ null, null, null ]
      ]);
    });

    it("#@", sinon.test(function() {
      var instance, test;
      var $index = $$();

      instance = this.createInstance();
      this.stub(instance, "at", sc.test.func());

      test = instance ["@"] ($index);
      expect(instance.at).to.be.calledWith($index);
      expect(instance.at).to.be.calledLastIn(test);
    }));

    it("#==", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30 ],
          args: [ [ 10, 20, 30 ] ],
          result: true
        },
        // {
        //   source: [ 10, 20, 30 ],
        //   args: [ [ 10, 20, $.Float(30.0) ] ],
        //   result: true
        // },
        {
          source: [ 10, 20, 30 ],
          args: [ [ 10, 10, 30 ] ],
          result: false
        },
        {
          source: [ 10, 20, 30, 40 ],
          args: [ [ 10, 20, 30 ] ],
          result: false
        },
        {
          source: [ 10, 20, 30 ],
          args: [ $$("102030") ],
          result: false
        },
      ]);
    });
    it.skip("#hash", function() {
    });

    it("#species", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.species();
      expect(test).to.equal(SCArray);
    });

    it("#do", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.do.__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it.skip("#iter", function() {
    });

    it("#size", function() {
      testCase(this, [
        {
          source: [],
          result: 0
        },
        {
          source: [ 1, 2, 3 ],
          result: 3
        },
      ]);
    });

    it("#flatSize", function() {
      testCase(this, [
        {
          source: [],
          result: 0
        },
        {
          source: [ 1, 2, 3 ],
          result: 3
        },
        {
          source: [ 1, 2, [ 3, 4 ] ],
          result: 4
        },
      ]);
    });

    it("#isEmpty", function() {
      testCase(this, [
        {
          source: [],
          result: true
        },
        {
          source: [ 0 ],
          result: false
        },
      ]);
    });

    it("#notEmpty", function() {
      testCase(this, [
        {
          source: [],
          result: false
        },
        {
          source: [ 0 ],
          result: true
        },
      ]);
    });

    it("#asCollection", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.asCollection).to.doNothing;
    });

    it("#isCollection", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isCollection();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });

    it("#add", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.add.__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });

    it("#addAll", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30 ],
          args: [ [ 40, 50, 60 ] ],
          result: this,
          after: [ 10, 20, 30, 40, 50, 60 ]
        },
      ]);
    });

    it("#remove", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.remove.__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });

    it("#removeAll", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 10, 30 ] ],
          result: this,
          after: [ 20, 40, 50 ]
        },
      ]);
    });

    it("#removeEvery", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 10, 30 ] ],
          result: this,
          after: [ 20, 40, 50 ]
        },
      ]);
    });

    it("#removeAllSuchThat", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function($_) {
            return $$(($_.valueOf() % 20) === 0);
          } ],
          result: [ 20, 40 ],
          after: [ 10, 30, 50 ]
        },
      ]);
    });

    it("#atAll", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 1, 2, 3 ] ],
          result: [ 20, 30, 40 ],
        },
      ]);
    });

    it("#putEach", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 1, 2, 3 ], 0 ],
          result: this,
          after: [ 10, 0, 0, 0, 50 ],
        },
      ]);
    });

    it("#includes", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ 20 ],
          result: true,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ $.Float(20.0) ],
          result: false,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ 0 ],
          result: false,
        },
      ]);
    });

    it("#includesEqual", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ 20 ],
          result: true,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ $.Float(20.0) ],
          result: true,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ 0 ],
          result: false,
        },
      ]);
    });

    it("#includesAny", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 20, 40 ] ],
          result: true,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 20, 40, 60 ] ],
          result: true,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 0 ] ],
          result: false,
        },
      ]);
    });

    it("#includesAll", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 20, 40 ] ],
          result: true,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 20, 40, 60 ] ],
          result: false,
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [ 0 ] ],
          result: false,
        },
      ]);
    });

    it("#matchItem", sinon.test(function() {
      var instance, test;
      var $item = $$();

      instance = this.createInstance();
      this.stub(instance, "includes", sc.test.func());

      test = instance.matchItem($item);
      expect(instance.includes).to.be.calledWith($item);
      expect(instance.includes).to.be.calledLastIn(test);
    }));

    it("#collect", sinon.test(function() {
      var instance, test;
      var $function = $$();

      instance = this.createInstance();
      this.stub(instance, "collectAs", sc.test.func());

      test = instance.collect($function);
      expect(instance.collectAs).to.be.calledWith($function, SCArray);
      expect(instance.collectAs).to.be.calledLastIn(test);
    }));

    it("#select", sinon.test(function() {
      var instance, test;
      var $function = $$();

      instance = this.createInstance();
      this.stub(instance, "selectAs", sc.test.func());

      test = instance.select($function);
      expect(instance.selectAs).to.be.calledWith($function, SCArray);
      expect(instance.selectAs).to.be.calledLastIn(test);
    }));

    it("#reject", sinon.test(function() {
      var instance, test;
      var $function = $$();

      instance = this.createInstance();
      this.stub(instance, "rejectAs", sc.test.func());

      test = instance.reject($function);
      expect(instance.rejectAs).to.be.calledWith($function, SCArray);
      expect(instance.rejectAs).to.be.calledLastIn(test);
    }));

    it("#collectAs", function() {
      var instance, test;
      var $function = $$(function($elem, $i) {
        return $elem ["/"] ($$(10)) ["+"] ($i);
      });

      instance = this.createInstance([ 10, 20, 30, 40, 50 ]);

      test = instance.collectAs($function, instance.species());
      expect(test).to.be.a("SCArray").that.deep.equals([ 1, 3, 5, 7, 9 ]);
    });

    it("#selectAs", function() {
      var instance, test;
      var $function = $$(function($elem, $i) {
        return $$(($elem ["%"] ($i)) === $$(0));
      });

      instance = this.createInstance([ 10, 20, 30, 40, 50 ]);

      test = instance.selectAs($function, instance.species());
      expect(test).to.be.a("SCArray").that.deep.equals([ 10, 20, 30 ]);
    });

    it("#rejectAs", function() {
      var instance, test;
      var $function = $$(function($elem, $i) {
        return $$(($elem ["%"] ($i)) === $$(0));
      });

      instance = this.createInstance([ 10, 20, 30, 40, 50 ]);

      test = instance.rejectAs($function, instance.species());
      expect(test).to.be.a("SCArray").that.deep.equals([ 40, 50 ]);
    });

    it("#detect", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function($elem) {
            return $$($elem === $$(20));
          } ],
          result: 20
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function() {
            return $$(false);
          } ],
          result: null
        },
      ]);
    });

    it("#detectIndex", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function($elem) {
            return $$($elem === $$(20));
          } ],
          result: 1
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function() {
            return $$(false);
          } ],
          result: null
        },
      ]);
    });

    it("#doMsg", sinon.test(function() {
      var instance, test;
      var $elem1 = $$({ perform: this.spy() });
      var $elem2 = $$({ perform: this.spy() });
      var $elem3 = $$({ perform: this.spy() });
      var $selector = $$();
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);

      test = instance.doMsg($selector, $arg1, $arg2);
      expect($elem1.perform).to.be.calledWith($selector, $arg1, $arg2);
      expect($elem2.perform).to.be.calledWith($selector, $arg1, $arg2);
      expect($elem3.perform).to.be.calledWith($selector, $arg1, $arg2);
      expect(test).to.equal(instance);
    }));

    it("#collectMsg", sinon.test(function() {
      var instance, test;
      var $elem1 = $$(1);
      var $elem2 = $$(2);
      var $elem3 = $$(3);
      var $selector = $$("\\odd");
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);
      this.spy($elem1, "odd");
      this.spy($elem2, "odd");
      this.spy($elem3, "odd");

      test = instance.collectMsg($selector, $arg1, $arg2);
      expect($elem1.odd).to.be.calledWith($arg1, $arg2);
      expect($elem2.odd).to.be.calledWith($arg1, $arg2);
      expect($elem3.odd).to.be.calledWith($arg1, $arg2);
      expect(test).to.be.a("SCArray").that.deep.equals([ true, false, true ]);
    }));

    it("#selectMsg", sinon.test(function() {
      var instance, test;
      var $elem1 = $$(1);
      var $elem2 = $$(2);
      var $elem3 = $$(3);
      var $selector = $$("\\odd");
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);
      this.spy($elem1, "odd");
      this.spy($elem2, "odd");
      this.spy($elem3, "odd");

      test = instance.selectMsg($selector, $arg1, $arg2);
      expect($elem1.odd).to.be.calledWith($arg1, $arg2);
      expect($elem2.odd).to.be.calledWith($arg1, $arg2);
      expect($elem3.odd).to.be.calledWith($arg1, $arg2);
      expect(test).to.be.a("SCArray").that.deep.equals([ 1, 3 ]);
    }));

    it("#rejectMsg", sinon.test(function() {
      var instance, test;
      var $elem1 = $$(1);
      var $elem2 = $$(2);
      var $elem3 = $$(3);
      var $selector = $$("\\odd");
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);
      this.spy($elem1, "odd");
      this.spy($elem2, "odd");
      this.spy($elem3, "odd");

      test = instance.rejectMsg($selector, $arg1, $arg2);
      expect($elem1.odd).to.be.calledWith($arg1, $arg2);
      expect($elem2.odd).to.be.calledWith($arg1, $arg2);
      expect($elem3.odd).to.be.calledWith($arg1, $arg2);
      expect(test).to.be.a("SCArray").that.deep.equals([ 2 ]);
    }));

    it("#detectMsg", sinon.test(function() {
      var instance, test;
      var $elem1 = $$(-2);
      var $elem2 = $$(-1);
      var $elem3 = $$( 0);
      var $elem4 = $$( 1);
      var $elem5 = $$( 2);
      var $selector = $$("\\isPositive");
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance([ $elem1, $elem2, $elem3, $elem4, $elem5 ]);
      this.spy($elem1, "isPositive");
      this.spy($elem2, "isPositive");
      this.spy($elem3, "isPositive");

      test = instance.detectMsg($selector, $arg1, $arg2);
      expect($elem1.isPositive).to.be.calledWith($arg1, $arg2);
      expect($elem2.isPositive).to.be.calledWith($arg1, $arg2);
      expect($elem3.isPositive).to.be.calledWith($arg1, $arg2);
      expect(test).to.be.a("SCInteger").that.equals(0);
    }));

    it("#detectIndexMsg", sinon.test(function() {
      var instance, test;
      var $elem1 = $$(-2);
      var $elem2 = $$(-1);
      var $elem3 = $$( 0);
      var $elem4 = $$( 1);
      var $elem5 = $$( 2);
      var $selector = $$("\\isPositive");
      var $arg1 = $$();
      var $arg2 = $$();

      instance = this.createInstance([ $elem1, $elem2, $elem3, $elem4, $elem5 ]);
      this.spy($elem1, "isPositive");
      this.spy($elem2, "isPositive");
      this.spy($elem3, "isPositive");

      test = instance.detectIndexMsg($selector, $arg1, $arg2);
      expect($elem1.isPositive).to.be.calledWith($arg1, $arg2);
      expect($elem2.isPositive).to.be.calledWith($arg1, $arg2);
      expect($elem3.isPositive).to.be.calledWith($arg1, $arg2);
      expect(test).to.be.a("SCInteger").that.equals(2);
    }));

    it("#lastForWhich", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function($item) {
            return $$($item.valueOf() <= 20);
          } ],
          result: 20
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function() {
            return $$(false);
          } ],
          result: null
        },
      ]);
    });

    it("#lastIndexForWhich", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function($item) {
            return $$($item.valueOf() <= 20);
          } ],
          result: 1
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ function() {
            return $$(false);
          } ],
          result: null
        },
      ]);
    });

    it("#inject", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [], function($a, $b, $i) {
            return $a.add($b ["+"] ($i));
          } ],
          result: [ 10, 21, 32, 43, 54 ]
        },
      ]);
    });

    it("#injectr", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args: [ [], function($a, $b, $i) {
            return $a.add($b ["+"] ($i));
          } ],
          result: [ 50, 41, 32, 23, 14 ]
        },
      ]);
    });

    it("#count", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a.even();
          } ],
          result: 2
        }
      ]);
    });

    it("#occurrencesOf", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 1, 2, 3, 4, 5 ],
          args: [ 1 ],
          result: 2
        },
        {
          source: [ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ],
          args: [ [ 1 ] ],
          result: 1
        },
      ]);
    });

    it("#any", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a.even();
          } ],
          result: true
        },
        {
          source: [ 1, 3, 5, 7, 9 ],
          args: [ function($a) {
            return $a.even();
          } ],
          result: false
        },
      ]);
    });

    it("#every", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a.even();
          } ],
          result: false
        },
        {
          source: [ 1, 3, 5, 7, 9 ],
          args: [ function($a) {
            return $a.odd();
          } ],
          result: true
        },
      ]);
    });

    it("#sum", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: 15
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a ["*"] ( $$(10) );
          } ],
          result: 150
        },
      ]);
    });

    it("#mean", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: $.Float(3.0)
        },
      ]);
    });

    it("#product", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: 120
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a ["*"] ( $$(10) );
          } ],
          result: 12000000
        },
      ]);
    });

    it("#sumabs", function() {
      testCase(this, [
        {
          source: [ 1, -2, 3, -4, 5 ],
          result: 15
        },
        {
          source: [ [ 1, -1 ], [ -2, 2 ], [ 3, -3 ], [ -4, 4 ], [ 5, -5 ] ],
          result: 15
        },
      ]);
    });

    it("#maxItem", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ],
          args: [ function($a) {
            return $a.even().valueOf() ? $a : $$(0);
          } ],
          result: 4
        },
      ]);
    });

    it("#minItem", function() {
      testCase(this, [
        {
          source: [ 5, 4, 3, 2, 1, 1, 2, 3, 4, 5 ],
          result: 1
        },
        {
          source: [ 5, 4, 3, 2, 1, 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a.even().valueOf() ? $a : $$(10);
          } ],
          result: 2
        },
      ]);
    });

    it("#maxIndex", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ],
          args: [ function($a) {
            return $a.even().valueOf() ? $a : $$(0);
          } ],
          result: 3
        },
      ]);
    });

    it("#minIndex", function() {
      testCase(this, [
        {
          source: [ 5, 4, 3, 2, 1, 1, 2, 3, 4, 5 ],
          result: 4
        },
        {
          source: [ 5, 4, 3, 2, 1, 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a.even().valueOf() ? $a : $$(10);
          } ],
          result: 3
        },
      ]);
    });

    it("#maxValue", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5, 5, 4, 3, 2, 1 ],
          args: [ function($a) {
            return $a.even().valueOf() ? $a : $$(0);
          } ],
          result: 4
        },
      ]);
    });

    it("#minValue", function() {
      testCase(this, [
        {
          source: [ 5, 4, 3, 2, 1, 1, 2, 3, 4, 5 ],
          result: null
        },
        {
          source: [ 5, 4, 3, 2, 1, 1, 2, 3, 4, 5 ],
          args: [ function($a) {
            return $a.even().valueOf() ? $a : $$(10);
          } ],
          result: 2
        },
      ]);
    });

    it("#maxSizeAtDepth", function() {
      testCase(this, [
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 0 ],
          result: 3
        },
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 1 ],
          result: 3
        },
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 2 ],
          result: 6
        },
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 3 ],
          result: 1
        },
      ]);
    });

    it("#maxDepth", function() {
      testCase(this, [
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 0 ],
          result: 2
        },
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 1 ],
          result: 3
        },
      ]);
    });

    it("#deepCollect", function() {
      testCase(this, [
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ null, function($a) {
            return $a ["*"] ($$(10));
          } ],
          result: [ 10, [ 20, [ 30, 40, 50, 50, 40, 30 ], 20 ], 10 ],
        },
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ -2, function($a) {
            return $a ["*"] ($$(10));
          } ],
          result: [ 10, [ 20, [ 30, 40, 50, 50, 40, 30 ], 20 ], 10 ],
        },
        {
          source: [ 1, [ 2, [ 3, 4, 5, 5, 4, 3 ], 2 ], 1 ],
          args: [ 2, function($a) {
            return $a ["*"] ($$(10));
          } ],
          result: [ 10, [ 20, [ 30, 40, 50, 50, 40, 30 ], 20 ], 10 ],
        },
      ]);
    });
    describe("#deepDo", function() {
      var $function, $result;
      before(function() {
        $function = $$(function($x) {
          $result = $result.add($x);
        });
      });
      beforeEach(function() {
        $result = $$([]);
      });

      it("#deepDo.depth:nil", function() {
        var instance, test;

        instance = this.createInstance([ 1, [ 2, 3, 4 ], [ [ 5 ] ] ]);

        test = instance.deepDo($$(null), $function);
        expect(test).to.equal(instance);
        expect($result).to.be.a("SCArray")
          .that.deep.equals([ 1, 2, 3, 4, 5 ]);
      });

      it("#deepDo.depth:0", function() {
        var instance, test;

        instance = this.createInstance([ 1, [ 2, 3, 4 ], [ [ 5 ] ] ]);

        test = instance.deepDo($$(0), $function);
        expect(test).to.equal(instance);
        expect($result).to.be.a("SCArray")
          .that.deep.equals([ [ 1, [ 2, 3, 4 ], [ [ 5 ] ] ] ]);
      });

      it("#deepDo.depth:1", function() {
        var instance, test;

        instance = this.createInstance([ 1, [ 2, 3, 4 ], [ [ 5 ] ] ]);

        test = instance.deepDo($$(1), $function);
        expect(test).to.equal(instance);
        expect($result).to.be.a("SCArray")
          .that.deep.equals([ 1, [ 2, 3, 4 ], [ [ 5 ] ] ]);
      });

      it("#deepDo.depth:2", function() {
        var instance, test;

        instance = this.createInstance([ 1, [ 2, 3, 4 ], [ [ 5 ] ] ]);

        test = instance.deepDo($$(2), $function);
        expect(test).to.equal(instance);
        expect($result).to.be.a("SCArray")
          .that.deep.equals([ 1, 2, 3, 4, [ 5 ] ]);
      });
    });

    it("#invert", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: [ 5, 4, 3, 2, 1 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ -1 ],
          result: [ -3, -4, -5, -6, -7 ]
        },
      ]);
    });

    it("#sect", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ [ 2, 4, 6, 8 ] ],
          result: [ 2, 4 ]
        },
      ]);
    });

    it("#union", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ [ 2, 4, 6, 8 ] ],
          result: [ 1, 2, 3, 4, 5, 6, 8 ]
        },
      ]);
    });

    it("#difference", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ [ 2, 4, 6, 8 ] ],
          result: [ 1, 3, 5 ]
        },
      ]);
    });

    it("#symmetricDifference", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ [ 2, 4, 6, 8 ] ],
          result: [ 1, 3, 5, 6, 8 ]
        },
      ]);
    });

    it("#isSubsetOf", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ [ 0, 1, 2, 3, 4, 5, 6, 7 ] ],
          result: true
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args: [ [ 1, 2, 3 ] ],
          result: false
        },
      ]);
    });

    it("#asArray", sinon.test(function() {
      var instance, test;
      var $new = this.spy(function() {
        return $$({ addAll: $addAll });
      });
      var $addAll = this.spy(sc.test.func());

      instance = this.createInstance([ 1, 2, 3 ]);
      this.stub(SCArray, "new", $new);

      test = instance.asArray();
      expect($new.args[0]).to.deep.equal($$([ 3 ])._);
      expect($addAll).to.be.calledWith(instance);
      expect($addAll).to.be.calledLastIn(test);
    }));

    it("#asBag", sinon.test(function() {
      var instance, test;
      var $new = this.spy(function() {
        return $$({ addAll: $addAll });
      });
      var $addAll = this.spy(sc.test.func());

      instance = this.createInstance([ 1, 2, 3 ]);
      this.stub(sc.lang.klass, "get").withArgs("Bag").returns($$({
        new: $new
      }));

      test = instance.asBag();
      expect($new.args[0]).to.deep.equal($$([ 3 ])._);
      expect($addAll).to.be.calledWith(instance);
      expect($addAll).to.be.calledLastIn(test);
    }));

    it("#asList", sinon.test(function() {
      var instance, test;
      var $new = this.spy(function() {
        return $$({ addAll: $addAll });
      });
      var $addAll = this.spy(sc.test.func());

      instance = this.createInstance([ 1, 2, 3 ]);
      this.stub(sc.lang.klass, "get").withArgs("List").returns($$({
        new: $new
      }));

      test = instance.asList();
      expect($new.args[0]).to.deep.equal($$([ 3 ])._);
      expect($addAll).to.be.calledWith(instance);
      expect($addAll).to.be.calledLastIn(test);
    }));

    it("#asSet", sinon.test(function() {
      var instance, test;
      var $new = this.spy(function() {
        return $$({ addAll: $addAll });
      });
      var $addAll = this.spy(sc.test.func());

      instance = this.createInstance([ 1, 2, 3 ]);
      this.stub(sc.lang.klass, "get").withArgs("Set").returns($$({
        new: $new
      }));

      test = instance.asSet();
      expect($new.args[0]).to.deep.equal($$([ 3 ])._);
      expect($addAll).to.be.calledWith(instance);
      expect($addAll).to.be.calledLastIn(test);
    }));

    it("#asSortedList", sinon.test(function() {
      var instance, test;
      var $new = this.spy(function() {
        return $$({ addAll: $addAll });
      });
      var $addAll = this.spy(sc.test.func());
      var $function = $$();

      instance = this.createInstance([ 1, 2, 3 ]);
      this.stub(sc.lang.klass, "get").withArgs("SortedList").returns($$({
        new: $new
      }));

      test = instance.asSortedList($function);
      expect($new.args[0]).to.deep.equal($$([ 3, $function ])._);
      expect($addAll).to.be.calledWith(instance);
      expect($addAll).to.be.calledLastIn(test);
    }));
    it.skip("#powerset", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: [
            [  ], [ 1 ], [ 2 ], [ 1, 2 ], [ 3 ], [ 1, 3 ], [ 2, 3 ], [ 1, 2, 3 ]
          ]
        }
      ]);
    });
    it.skip("#flopDict", function() {
    });
    it.skip("#histo", function() {
    });
    it.skip("#printAll", function() {
    });
    it.skip("#printcsAll", function() {
    });
    it.skip("#dumpAll", function() {
    });
    it.skip("#printOn", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#storeItemsOn", function() {
    });
    it.skip("#printItemsOn", function() {
    });
    it.skip("#writeDef", function() {
    });
    it.skip("#writeInputSpec", function() {
    });
    it.skip("#case", function() {
    });
    it.skip("#makeEnvirValPairs", function() {
    });

    it("#asString", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3 ]);

      test = instance.asString();
      expect(test).to.be.a("SCString").that.equals("Array[ 1, 2, 3 ]");
    });
  });

});

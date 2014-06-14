(function() {
  "use strict";

  require("./ArrayedCollection");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  describe("SCArrayedCollection", function() {
    var SCArrayedCollection;
    before(function() {
      SCArrayedCollection = $("ArrayedCollection");
      this.createInstance = function(source, immutable) {
        var instance = $.Array((source || []).map($$), !!immutable);
        return $$(instance, "ArrayedCollection" + this.test.title);
      };
    });
    it("#__elem__", function() {
      var instance, test;
      var $obj;

      $obj = $$();

      instance = this.createInstance();

      test = instance.__elem__($obj);
      expect(test).to.equal($obj);
    });
    it.skip(".newClear", function() {
    });
    it.skip("#indexedSize", function() {
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
    it.skip("#maxSize", function() {
    });
    it("#swap", function() {
      testCase(this, [
        {
          source: [ 0, 1, 2, 3, 4 ],
          args  : [ 1, 2 ],
          result: this,
          after : [ 0, 2, 1, 3, 4 ]
        },
        {
          source: [ 0, 1, 2, 3, 4 ],
          args  : [ 1, 10 ],
          error : "out of index"
        },
        {
          source: [ 0, 1, 2, 3, 4 ],
          immutable: true,
          args  : [ 1, 2 ],
          error : "immutable"
        },
      ]);
    });
    it("#at", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -2 ],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -1 ],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 4 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5 ],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 0, 2, 4, 6 ] ],
          result: [ 1, 3, 5, null ]
        },
      ]);
    });
    it("#clipAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -2 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -1 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 4 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 0, 2, 4, 6 ] ],
          result: [ 1, 3, 5, 5 ]
        },
      ]);
    });
    it("#wrapAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -2 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -1 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 4 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: 2
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 0, 2, 4, 6 ] ],
          result: [ 1, 3, 5, 2 ]
        },
      ]);
    });
    it("#foldAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -2 ],
          result: 3
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -1 ],
          result: 2
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 4 ],
          result: 5
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: 3
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 0, 2, 4, 6 ] ],
          result: [ 1, 3, 5, 3 ]
        },
      ]);
    });
    it("#put", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 1, 100 ],
          result: this,
          after : [ 1, 100, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 1, 2 ], [ 10, 100 ] ],
          result: this,
          after : [ 1, [ 10, 100 ], [ 10, 100 ], 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 100, 100 ],
          error : "out of index"
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 100 ] ],
          error : "out of index"
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1, 100 ],
          error : "immutable"
        },
      ]);
    });
    it("#clipPut", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10, 100 ],
          result: this,
          after : [ 1, 2, 3, 4, 100 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 1, 2 ], [ 10, 100 ] ],
          result: this,
          after : [ 1, [ 10, 100 ], [ 10, 100 ], 4, 5 ]
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1, 100 ],
          error : "immutable"
        },
      ]);
    });
    it("#wrapPut", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10, 100 ],
          result: this,
          after : [ 100, 2, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 1, 2 ], [ 10, 100 ] ],
          result: this,
          after : [ 1, [ 10, 100 ], [ 10, 100 ], 4, 5 ]
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1, 100 ],
          error : "immutable"
        },
      ]);
    });
    it("#foldPut", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10, 100 ],
          result: this,
          after : [ 1, 2, 100, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 1, 2 ], [ 10, 100 ] ],
          result: this,
          after : [ 1, [ 10, 100 ], [ 10, 100 ], 4, 5 ]
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1, 100 ],
          error : "immutable"
        },
      ]);
    });
    it("#removeAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3,
          after : [ 1, 2, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 100 ],
          error : "out of index"
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1 ],
          error : "immutable"
        },
      ]);
    });
    it("#takeAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3,
          after : [ 1, 2, 5, 4 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 100 ],
          error : "out of index"
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1 ],
          error : "immutable"
        },
      ]);
    });
    it("#indexOf", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: null
        },
      ]);
    });
    it("#indexOfGreaterThan", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 2
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10 ],
          result: null
        },
      ]);
    });
    it("#takeThese", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ function($item) {
            return $item.odd();
          } ],
          result: this,
          after : [ 4, 2 ]
        },
        {
          source   : [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ function($item) {
            return $item.odd();
          } ],
          error : "immutable"
        },
      ]);
    });
    it("#replace", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 3, 0 ],
          result: [ 1, 2, 0, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ [ 2, 3, 4 ], 0 ],
          result: [ 1, 0, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 3, 0 ],
          error : "immutable"
        },
      ]);
    });
    it("#slotSize", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: 5
        }
      ]);
    });
    it("#slotAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: 3
        },
      ]);
    });
    it("#slotPut", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, 10 ],
          result: this,
          after : [ 1, 2, 10, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 2, 10 ],
          error : "immutable"
        },
      ]);
    });
    it("#slotKey", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 100 ],
          result: 100
        }
      ]);
    });
    it("#slotIndex", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 100 ],
          result: null
        }
      ]);
    });
    it("#getSlots", sinon.test(function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3 ]);
      this.stub(instance, "copy", sc.test.func());

      test = instance.getSlots();
      expect(instance.copy).to.be.calledLastIn(test);
    }));
    it("#setSlots", sinon.test(function() {
      var instance, test, spy;
      var $array;

      spy = this.spy(sc.test.func());
      $array = $$();

      instance = this.createInstance([ 1, 2, 3 ]);
      instance.overWrite = spy;

      test = instance.setSlots($array);
      expect(instance.overWrite).to.be.calledWith($array);
      expect(instance.overWrite).to.be.calledLastIn(test);
    }));
    it("#atModify", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, function($item, $index) {
            return $item.div($index);
          } ],
          result: this,
          after : [ 1, 2, (3/2)|0, 4, 5 ]
        }
      ]);
    });
    it("#atInc", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: this,
          after : [ 1, 2, 4, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, 7 ],
          result: this,
          after : [ 1, 2, 10, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 2 ],
          error : "immutable"
        },
      ]);
    });
    it("#atDec", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: this,
          after : [ 1, 2, 2, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, 3 ],
          result: this,
          after : [ 1, 2, 0, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 2 ],
          error : "immutable"
        },
      ]);
    });
    it("#isArray", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isArray();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#asArray", function() {
      var instance = this.createInstance();
      expect(instance.asArray).to.be.nop;
    });
    it("#copyRange", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, 4 ],
          result: [ 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, null ],
          result: [ 3, 4, 5, 6, 7, 8, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 0, 4 ],
          result: [ 1, 2, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, null ],
          result: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 4, 2 ],
          result: []
        },
      ]);
    });
    it("#copySeries", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, 4, 7 ],
          result: [ 3, 5, 7 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, 4, null ],
          result: [ 3, 5, 7, 9 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, null, 7 ],
          result: [ 3, 4, 5, 6, 7, 8 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, null, null ],
          result: [ 3, 4, 5, 6, 7, 8, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, 4, 7 ],
          result: [ 1, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, 4, null ],
          result: [ 1, 5, 9 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, null, 7 ],
          result: [ 1, 2, 3, 4, 5, 6, 7, 8 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, null, null ],
          result: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 7, 4, 2 ],
          result: [ 8, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 0, 0, 0 ],
          result: []
        },
      ]);
    });
    it("#putSeries", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, 4, 7, 0 ],
          result: this,
          after : [ 1, 2, 0, 4, 0, 6, 0, 8, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, 4, null, 0 ],
          result: this,
          after : [ 1, 2, 0, 4, 0, 6, 0, 8, 0, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, null, 7, 0 ],
          result: this,
          after : [ 1, 2, 0, 0, 0, 0, 0, 0, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 2, null, null, 0 ],
          result: this,
          after : [ 1, 2, 0, 0, 0, 0, 0, 0, 0, 0 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, 4, 7, 0 ],
          result: this,
          after : [ 0, 2, 3, 4, 0, 6, 7, 8, 9, 10 ],
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, 4, null, 0 ],
          result: this,
          after : [ 0, 2, 3, 4, 0, 6, 7, 8, 0, 10 ],
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, null, 7, 0 ],
          result: this,
          after : [ 0, 0, 0, 0, 0, 0, 0, 0, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ null, null, null, 0 ],
          result: this,
          after : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 7, 4, 2, 0 ],
          result: this,
          after : [ 1, 2, 3, 4, 0, 6, 7, 0, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          args  : [ 0, 0, 0 ],
          result: this,
          after : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
          immutable: true,
          args  : [ 2, 4, 7, 0 ],
          error : "immutable"
        },
      ]);
    });
    it("#add", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: this,
          after : [ 1, 2, 3, 4 ]
        },
        {
          source: [ 1, 2, 3 ],
          immutable: true,
          args  : [ 4 ],
          error : "immutable"
        },
      ]);
    });
    it("#addAll", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: this,
          after : [ 1, 2, 3, 4 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ [ 4, 5 ] ],
          result: this,
          after : [ 1, 2, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3 ],
          immutable: true,
          args  : [ 4 ],
          error : "immutable"
        },
      ]);
    });
    it("#putEach", function() {
      testCase(this, [
        {
          source: [ 10, 20, 30, 40, 50 ],
          args  : [ [ 1, 2, 3 ], 0 ],
          result: this,
          after : [ 10, 0, 0, 0, 50 ],
        },
        {
          source: [ 10, 20, 30, 40, 50 ],
          immutable: true,
          args  : [ [ 1, 2, 3 ], 0 ],
          error : "immutable"
        },
      ]);
    });
    it("#extend", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5, 0 ],
          result: [ 1, 2, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 3, 0 ],
          result: [ 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 8, 0 ],
          result: [ 1, 2, 3, 4, 5, 0, 0, 0 ]
        },
      ]);
    });
    it("#insert", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -1, 0 ],
          result: this,
          after : [ 0, 1, 2, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, 0 ],
          result: this,
          after : [ 1, 2, 0, 3, 4, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10, 0 ],
          result: this,
          after : [ 1, 2, 3, 4, 5, 0 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ -1, 0 ],
          error : "immutable"
        },
      ]);
    });
    it("#move", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 1, 4 ],
          result: this,
          after : [ 1, 3, 4, 5, 2 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 1, 4 ],
          error : "immutable"
        },
      ]);
    });
    it("#addFirst", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 0 ],
          result: [ 0, 1, 2, 3 ]
        },
      ]);
    });
    it("#addIfNotNil", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 0 ],
          result: [ 0, 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ null ],
          result: this
        },
      ]);
    });
    it("#pop", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: 4,
          after : [ 1, 2, 3 ]
        },
        {
          source: [],
          result: null,
          after : []
        },
        {
          source: [ 1, 2, 3, 4 ],
          immutable: true,
          error : "immutable"
        },
        {
          source: [],
          immutable: true,
          result: null,
        },
      ]);
    });
    it("#++", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: [ 1, 2, 3, 4 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ [ 4, 5, 6 ] ],
          result: [ 1, 2, 3, 4, 5, 6 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ null ],
          result: [ 1, 2, 3 ]
        },
      ]);
    });
    it.skip("#overWrite", function() {
    });
    it.skip("#grow", function() {
    });
    it.skip("#growClear", function() {
    });
    it("#seriesFill", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10, 20 ],
          result: this,
          after : [ 10, 30, 50, 70, 90 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 10, 20 ],
          error : "immutable"
        },
      ]);
    });
    it("#fill", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0 ],
          result: this,
          after : [ 0, 0, 0, 0, 0 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          immutable: true,
          args  : [ 0 ],
          error : "immutable"
        },
      ]);
    });
    it("#do", sinon.test(function() {
      var test, instance, iter;
      var $function;

      iter = {};
      $function = $$();
      this.stub(iterator, "array$do", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.do($function);
      expect(iterator.array$do).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#reverseDo", sinon.test(function() {
      var test, instance, iter;
      var $function;

      iter = {};
      $function = $$();
      this.stub(iterator, "array$reverseDo", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.reverseDo($function);
      expect(iterator.array$reverseDo).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#reverse", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: [ 5, 4, 3, 2, 1 ]
        }
      ]);
    });
    it("#windex", function() {
      testCase(this, [
        [ [ 0.1, 0.2, 0.3, 0.4 ], [], 3 ],
        [ [ 0.1, 0.2, 0.3, 0.4 ], [], 0 ],
        [ [ 0.1, 0.2, 0.3, 0.4 ], [], 1 ],
        [ [ 0.1, 0.2, 0.3, 0.4 ], [], 2 ],
        [ [ 0.1, 0.2, 0.3, 0.4 ], [], 2 ],
        [ [ 0 ], [], 0 ],
      ], { randSeed: 0 });
    });
    it("#normalizeSum", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: [ 0.1, 0.2, 0.30000000000000004, 0.4 ]
        }
      ]);
    });
    it("#normalize", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: [ 0, 0.5, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ -20, 10 ],
          result: [ -20, -5, 10 ]
        },
      ]);
    });
    it.skip("#asciiPlot", function() {
    });
    it.skip("#perfectShuffle", function() {
    });
    it.skip("#performInPlace", function() {
    });
    it("#clipExtend", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10 ],
          result: [ 1, 2, 3, 4, 5, 5, 5, 5, 5, 5 ]
        },
        {
          source: [],
          args  : [ 5 ],
          result: [ null, null, null, null, null ]
        },
      ]);
    });
    it("#rank", function() {
      testCase(this, [
        {
          source: [ 4, 7, 6, 8 ],
          result: 1
        },
        {
          source: [ [ 4, 7 ], [ 6, 8 ] ],
          result: 2
        },
      ]);
    });
    it("#shape", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: [ 4 ]
        },
        {
          source: [ [ 1, 2 ], [ 3, 4 ] ],
          result: [ 2, 2 ]
        },
      ]);
    });
    it("#reshape", function() {
      testCase(this, [
        {
          source: [ 4, 7, 6, 8 ],
          args  : [ 2, 2 ],
          result: [ [ 4, 7 ], [ 6, 8 ] ]
        },
        {
          source: [ 4, 7, 6, 8 ],
          args  : [ 2, 3 ],
          result: [ [ 4, 7, 6 ], [ 8, 4, 7 ] ]
        },
      ]);
    });
    it("#reshapeLike", function() {
      testCase(this, [
        {
          source: [ 4, 7, 6, 8 ],
          args  : [ [ 0 ] ],
          result: [ 4 ]
        },
        {
          source: [ 4, 7, 6, 8 ],
          args  : [ [ [ 0, 0, 0 ], 0 ] ],
          result: [ [ 4, 7, 6 ], 8 ]
        },
        {
          source: [ 4, 7, 6, 8 ],
          args  : [ [ 0, [ 0, [ 0, [ 0, [ 0 ] ] ] ] ] ],
          result: [ 4, [ 7, [ 6, [ 8, [ 4 ] ] ] ] ]
        },
      ]);
    });
    it.skip("#deepCollect", function() {
    });
    it.skip("#deepDo", function() {
    });
    it("#unbubble", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: this
        },
        {
          source: [ 1 ],
          result: 1
        },
        {
          source: [ [ 1 ] ],
          args  : [ -1, 2 ],
          result: 1
        },
        {
          source: [ [ 1, [ 2, [ 3 ] ] ] ],
          args  : [ 3, 0 ],
          result: [ [ 1, [ 2, 3 ] ] ]
        },
      ]);
    });
    it("#bubble", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: [ [ 1, 2, 3, 4, 5 ] ],
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0, 2 ],
          result: [ [ [ 1, 2, 3, 4, 5 ] ] ],
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, 2 ],
          result : [ [ [ 1 ] ], [ [ 2 ] ], [ [ 3 ] ], [ [ 4 ] ], [ [ 5 ] ] ],
        },
      ]);
    });
    it("#slice", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: [ 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ null ],
          result: [ 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ [ 1, 2 ] ],
          result: [ 2, 3 ]
        },
        {
          source: [ 1, 2, [ 3, 4, 5 ] ],
          args  : [ [ 1, 2 ], [ 1, 2 ] ],
          result: [ 2, [ 4, 5 ] ]
        },
      ]);
    });
    it(".iota", function() {
      testCase(this, [
        {
          source: null,
          args  : [ 3, 4 ],
          result: [ [ 0, 1, 2, 3 ], [ 4, 5, 6, 7 ], [ 8, 9, 10, 11 ] ]
        }
      ]);
    });
    it.skip("#asRandomTable", function() {
    });
    it.skip("#tableRand", function() {
    });
    it.skip("#msgSize", function() {
    });
    it.skip("#bundleSize", function() {
    });
    it("#includes", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: true
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ $.Float(2.0) ],
          result: false
        },
        {
          source: [ 1, [ 2, 3, 4, 5 ] ],
          args  : [ 2 ],
          result: false
        },
      ]);
    });
    it("#asString", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3 ]);

      test = instance.asString();
      expect(test).to.be.a("SCString").that.equals("[ 1, 2, 3 ]");
    });
  });

  describe("SCRawArray", function() {
    var SCRawArray;
    before(function() {
      SCRawArray = $("RawArray");
      this.createInstance = function(source) {
        var instance = $.String(source || "").copy();
        return $$(instance, "RawArray" + this.test.title);
      };
    });
    it("#archiveAsCompileString", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.archiveAsCompileString();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#archiveAsObject", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.archiveAsObject();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#rate", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.rate();
      expect(test).to.be.a("SCSymbol").that.equals("scalar");
    });
    it.skip("#readFromStream", function() {
    });
    it("#powerset", function() {
      testCase(this, [
        {
          source: "str",
          result: [
            [  ],
            [ "s" ],
            [ "t" ],
            [ "s", "t" ],
            [ "r" ],
            [ "s", "r" ],
            [ "t", "r" ],
            [ "s", "t", "r" ]
          ]
        }
      ]);
    });
  });

  describe("SCInt8Array", function() {
    var SCInt8Array;
    before(function() {
      SCInt8Array = $("Int8Array");
    });
    it("#valueOf", function() {
      var instance, test, expected;

      instance = SCInt8Array.newFrom($$([ 0, 255, 256 ]));
      test = instance.valueOf();

      expected = new Int8Array([ 0, -1, 0 ]);
      expect(test).to.eql(expected);
    });
  });

  describe("SCInt16Array", function() {
    var SCInt16Array;
    before(function() {
      SCInt16Array = $("Int16Array");
    });
    it("#valueOf", function() {
      var instance, test, expected;

      instance = SCInt16Array.newFrom($$([ 0, 65535, 65536 ]));
      test = instance.valueOf();

      expected = new Int16Array([ 0, -1, 0 ]);
      expect(test).to.eql(expected);
    });
  });

  describe("SCInt32Array", function() {
    var SCInt32Array;
    before(function() {
      SCInt32Array = $("Int32Array");
    });
    it("#valueOf", function() {
      var instance, test, expected;

      instance = SCInt32Array.newFrom($$([ 0, 4294967295, 4294967296 ]));
      test = instance.valueOf();

      expected = new Int32Array([ 0, -1, 0 ]);
      expect(test).to.eql(expected);
    });
  });

  describe("SCFloatArray", function() {
    var SCFloatArray;
    before(function() {
      SCFloatArray = $("FloatArray");
    });
    it("#valueOf", function() {
      var instance, test, expected;

      instance = SCFloatArray.newFrom($$([ 0, 0.5, -0.5 ]));
      test = instance.valueOf();

      expected = new Float32Array([ 0, 0.5, -0.5 ]);
      expect(test).to.eql(expected);
    });
  });

  describe("SCDoubleArray", function() {
    var SCDoubleArray;
    before(function() {
      SCDoubleArray = $("DoubleArray");
    });
    it("#valueOf", function() {
      var instance, test, expected;

      instance = SCDoubleArray.newFrom($$([ 0, 0.5, -0.5 ]));
      test = instance.valueOf();

      expected = new Float64Array([ 0, 0.5, -0.5 ]);
      expect(test).to.eql(expected);
    });
  });

})();

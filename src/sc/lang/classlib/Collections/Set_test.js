(function() {
  "use strict";

  require("./Set");

  var $ = sc.test.$;
  var testCase = sc.test.testCase;

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  describe("SCSet", function() {
    var SCSet;
    before(function() {
      SCSet = $SC("Set");
      this.createInstance = function(source) {
        source = $(source || []);
        return SCSet.newFrom(source);
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.eql([]);
    });
    it("#<>array", function() {
      var instance, test;
      var $value;

      $value = sc.test.object();

      instance = this.createInstance();

      test = instance.array_($value);
      expect(test).to.equal(instance);

      test = instance.array();
      expect(test).to.equal($value);
    });
    it("#<size", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2 ]);

      test = instance.size();
      expect(test).to.be.a("SCInteger").that.equals(2);

      instance.add($SC.Integer(0));
      test = instance.size();
      expect(test).to.be.a("SCInteger").that.equals(3);
    });
    it("#species", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.species();
      expect(test).to.equal(SCSet);
    });
    it.skip("#copy", function() {
    });
    it("#do", sinon.test(function() {
      var test, instance, iter;
      var $function;

      iter = {};
      $function = sc.test.object();
      this.stub(iterator, "set$do", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.do($function);
      expect(iterator.set$do).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#clear", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3, 1, 2, 3 ]);

      test = instance.clear();
      expect(test).to.equal(instance);
      expect(instance._array).to.be.a("SCArray").that.eqls([
        null, null, null, null, null, null,
        null, null, null, null, null, null,
      ]);
      expect(instance._size).to.be.a("SCInteger").that.equals(0);
    });
    it("#makeEmpty", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "clear", sc.test.func);

      test = instance.makeEmpty();
      expect(instance.clear).to.be.called;
      expect(test).to.equal(instance);
    }));
    it("#includes", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: true
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: false
        }
      ]);
    });
    it("#findMatch", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: 2
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: null
        }
      ]);
    });
    it("#add", function() {
      var instance;
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: this,
          after : [ 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: this,
          after : [ 1, 2, 3, 4 ]
        },
      ]);
      instance = this.createInstance();
      expect(function() {
        instance.add($SC.Nil());
      }).to.throw("A Set cannot contain nil");
    });
    it("#remove", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: this,
          after : [ 1, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: this,
          after : [ 1, 2, 3 ]
        },
      ]);
    });
    it("#choose", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 1, 2, 3, 4 ],
          result: 1
        }
      ], { randSeed: 0 });
    });
    it("#pop", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: 1,
          after : [ 2, 3 ]
        },
        {
          source: [],
          result: null,
          after : []
        }
      ]);
    });
    it("#unify", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: SCSet.newFrom($([ 1, 2, 3 ]))
        },
        {
          source: [ 1, [ 2, 3 ] ],
          result: SCSet.newFrom($([ 1, 2, 3 ]))
        },
      ]);
    });
    it("#sect", function() {
      var instance, test;
      var $set;

      instance = this.createInstance([ 1, 2, 3, 4, 5, 6 ]);
      $set     = SCSet.newFrom($([ 1, 3, 5, 7, 9 ]));

      test = instance.sect($set);
      expect(test.valueOf()).to.eqls([ 1, 3, 5 ]);
    });
    it("#union", function() {
      var instance, test;
      var $set;

      instance = this.createInstance([ 1, 2, 3, 4, 5, 6 ]);
      $set     = SCSet.newFrom($([ 1, 3, 5, 7, 9 ]));

      test = instance.union($set);
      expect(test.valueOf()).to.eqls([ 1, 2, 3, 4, 5, 6, 7, 9 ]);
    });
    it("#difference", function() {
      var instance, test;
      var $set;

      instance = this.createInstance([ 1, 2, 3, 4, 5, 6 ]);
      $set     = SCSet.newFrom($([ 1, 3, 5, 7, 9 ]));

      test = instance.difference($set);
      expect(test.valueOf()).to.eqls([ 2, 4, 6 ]);
    });
    it("#symmetricDifference", function() {
      var instance, test;
      var $set;

      instance = this.createInstance([ 1, 2, 3, 4, 5, 6 ]);
      $set     = SCSet.newFrom($([ 1, 3, 5, 7, 9 ]));

      test = instance.symmetricDifference($set);
      expect(test.valueOf()).to.eqls([ 2, 4, 6, 7, 9 ]);
    });
    it("#isSubsetOf", function() {
      var instance, test;
      var $set1, $set2;

      instance = this.createInstance([ 1, 2 ]);
      $set1    = SCSet.newFrom($([ 1, 2, 3 ]));
      $set2    = SCSet.newFrom($([ 0, 1 ]));

      test = instance.isSubsetOf($set1);
      expect(test).to.be.a("SCBoolean").that.is.true;

      test = instance.isSubsetOf($set2);
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#&", sinon.test(function() {
      var instance, test;
      var $that;

      $that = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "sect", sc.test.func);

      test = instance ["&"] ($that);
      expect(instance.sect).to.be.calledWith($that);
      expect(instance.sect).to.be.calledLastIn(test);
    }));
    it("#|", sinon.test(function() {
      var instance, test;
      var $that;

      $that = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "union", sc.test.func);

      test = instance ["|"] ($that);
      expect(instance.union).to.be.calledWith($that);
      expect(instance.union).to.be.calledLastIn(test);
    }));
    it("#-", sinon.test(function() {
      var instance, test;
      var $that;

      $that = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "difference", sc.test.func);

      test = instance ["-"] ($that);
      expect(instance.difference).to.be.calledWith($that);
      expect(instance.difference).to.be.calledLastIn(test);
    }));
    it("#--", sinon.test(function() {
      var instance, test;
      var $that;

      $that = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "symmetricDifference", sc.test.func);

      test = instance ["--"] ($that);
      expect(instance.symmetricDifference).to.be.calledWith($that);
      expect(instance.symmetricDifference).to.be.calledLastIn(test);
    }));
    it("#asSet", function() {
      var instance;
      instance = this.createInstance();
      expect(instance.asSet).to.be.nop;
    });
  });
})();

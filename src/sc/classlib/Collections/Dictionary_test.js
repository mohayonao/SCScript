(function() {
  "use strict";

  require("./Dictionary");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var SCDictionary = $("Dictionary");
  var SCIdentityDictionary = $("IdentityDictionary");
  var SCSet = $("Set");
  var SCArray = $("Array");
  var SCAssociation = $("Association");

  describe("SCDictionary", function() {
    before(function() {
      this.createInstance = function(list) {
        return SCDictionary.newFrom($$(list || []));
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.deep.equals({});
    });
    it("#$newFrom", function() {
      var instance;

      instance = SCDictionary.newFrom($$([ 1, 2, 3, 4, ]));
      expect(instance).to.be.a("SCDictionary").that.deep.equals({ 1:2, 3: 4 });
    });
    it("#at", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2 ],
          result: null
        },
        {
          source: [ $.Integer(0), $.Integer(1), $.Float(0.0), $.Float(1.0) ],
          args: [ $$(0) ],
          result: $.Float(1.0)
        },
      ]);
    });
    it("#atFail", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3, 0 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2, 0 ],
          result: 0
        }
      ]);
    });
    it("#matchAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2 ],
          result: null
        }
      ]);
    });
    it("#trueAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3 ],
          result: 4
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2 ],
          result: false
        }
      ]);
    });
    it("#add", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ SCAssociation.new($$(5), $$(6)) ],
          result: this,
          after: { 1: 2, 3: 4, 5: 6 }
        },
      ]);
    });
    it("#put", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3, null ],
          result: this,
          after: { 1: 2 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3, 5 ],
          result: this,
          after: { 1: 2, 3: 5 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 5, 6 ],
          result: this,
          after: { 1: 2, 3: 4, 5: 6 }
        },
      ]);
    });
    it("#putAll", function() {
      testCase(this, [
        {
          source: [ 1, 2 ],
          args: [ SCDictionary.newFrom($$( [ 1, 2, 3, 4, 5, 6 ] )) ],
          result: this,
          after: { 1: 2, 3: 4, 5: 6 }
        }
      ]);
    });
    it("#putPairs", function() {
      testCase(this, [
        {
          source: [ 1, 2 ],
          args: [ [ 1, 2, 3, 4, 5, 6 ] ],
          result: this,
          after: { 1: 2, 3: 4, 5: 6 }
        }
      ]);
    });
    it("#getPairs", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [],
          result: [ 1, 2, 3, 4 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args: [ [ 2, 3, 5 ] ],
          result: [ 3, 4, 5, 6 ]
        },
      ]);
    });
    it("#associationAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3 ],
          result: SCAssociation.new($$(3), $$(4))
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 4 ],
          result: SCAssociation.new($$(null), $$(null))
        },
      ]);
    });
    it("#associationAtFail", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 3, 0 ],
          result: SCAssociation.new($$(3), $$(4))
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 5, 0 ],
          result: 0
        },
      ]);
    });
    it("#keys", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: SCSet.newFrom($$([ 1, 3 ]))
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ SCArray ],
          result: [ 1, 3 ]
        },
      ]);
    });
    it("#values", sinon.test(function() {
      this.stub(sc.lang.klass, "get").withArgs("List").returns(SCArray);
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: [ 2, 4 ]
        },
      ]);
    }));
    it("#includes", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 1 ],
          result: false
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2 ],
          result: true
        },
      ]);
    });
    it("#includesKey", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 1 ],
          result: true
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2 ],
          result: false
        },
      ]);
    });
    it("#removeAt", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 1 ],
          result: 2,
          after: { 3: 4 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 5 ],
          result: null,
          after: { 1: 2, 3: 4 }
        },
      ]);
    });
    it("#removeAtFail", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 1, 0 ],
          result: 2,
          after: { 3: 4 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 5, 0 ],
          result: 0,
          after: { 1: 2, 3: 4 }
        },
      ]);
    });
    it("#remove", function() {
      var instance = this.createInstance();
      expect(instance.remove.__errorType).to.equal(sc.ERRID_SHOULD_NOT_IMPLEMENT);
    });
    it("#removeFail", function() {
      var instance = this.createInstance();
      expect(instance.removeFail.__errorType).to.equal(sc.ERRID_SHOULD_NOT_IMPLEMENT);
    });
    it("#keysValuesDo", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $function = $$(func);

      instance = this.createInstance([ 1, 2, 3, 4 ]);

      test = instance.keysValuesDo($function);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.deep.equal($$([ 1, 2, 0 ])._);
      expect(func.args[1]).to.deep.equal($$([ 3, 4, 1 ])._);
    }));
    it("#keysValuesChange", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ function($key, $value, $i) {
            return $$([ $key, $value, $i ]);
          } ],
          result: this,
          after: { 1: [ 1, 2, 0 ], 3: [ 3, 4, 1 ] }
        }
      ]);
    });
    it("#do", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $function = $$(func);

      instance = this.createInstance([ 1, 2, 3, 4 ]);

      test = instance.do($function);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.deep.equal($$([ 2, 0 ])._);
      expect(func.args[1]).to.deep.equal($$([ 4, 1 ])._);
    }));
    it("#keysDo", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $function = $$(func);

      instance = this.createInstance([ 1, 2, 3, 4 ]);

      test = instance.keysDo($function);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.deep.equal($$([ 1, 0 ])._);
      expect(func.args[1]).to.deep.equal($$([ 3, 1 ])._);
    }));
    it("#associationsDo", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $function = $$(func);

      instance = this.createInstance([ 1, 2, 3, 4 ]);

      test = instance.associationsDo($function);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.deep.equal($$([ SCAssociation.new($$(1), $$(2)), 0 ])._);
      expect(func.args[1]).to.deep.equal($$([ SCAssociation.new($$(3), $$(4)), 1 ])._);
    }));
    it("#pairsDo", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $function = $$(func);

      instance = this.createInstance([ 1, 2, 3, 4 ]);

      test = instance.pairsDo($function);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.deep.equal($$([ 1, 2, 0 ])._);
      expect(func.args[1]).to.deep.equal($$([ 3, 4, 1 ])._);
    }));
    it("#collect", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ function($elem, $key) {
            return $$([ $elem, $key ]);
          } ],
          result: { 1: [ 2, 1 ], 3: [ 4, 3 ] }
        },
      ]);
    });
    it("#select", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ function($elem, $key) {
            return $$($key.valueOf() === 1);
          } ],
          result: { 1: 2 }
        },
      ]);
    });
    it("#reject", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ function($elem, $key) {
            return $$($key.valueOf() === 1);
          } ],
          result: { 3: 4 }
        },
      ]);
    });
    it("#invert", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: { 2: 1, 4: 3 }
        },
        {
          source: [ 1, 2, 3, 4, 5, 2 ],
          result: { 4: 3, 2: 5 }
        },
      ]);
    });
    it("#merge", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [
            SCDictionary.newFrom($$([ 5, 6, 7, 8 ])),
            function($a, $b) {
              return $a ["+"] ($b);
            },
          ],
          result: { 1: 2, 3: 4, 5: 6, 7: 8 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [
            SCDictionary.newFrom($$([ 3, 4, 5, 6 ])),
            function($a, $b) {
              return $a ["+"] ($b);
            },
            false
          ],
          result: { 3: 8 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [
            SCDictionary.newFrom($$([ 1, 2, 3, 4 ])),
            function($a, $b) {
              return $a ["+"] ($b);
            },
            false
          ],
          result: { 1: 4, 3: 8 }
        },
      ]);
    });
    it.skip("#blend", function() {
    });
    it("#findKeyForValue", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 2 ],
          result: 1
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 1 ],
          result: null
        },
      ]);
    });
    it("#sortedKeysValuesDo", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $function = $$(func);
      var $sortFunc = $$(function($a, $b) {
        return $b ["<="] ($a);
      });

      instance = this.createInstance([ 1, 2, 3, 4 ]);

      test = instance.sortedKeysValuesDo($function, $sortFunc);
      expect(test).to.equal(instance);
      expect(func).to.callCount(2);
      expect(func.args[0]).to.deep.equal($$([ 3, 4, 0 ])._);
      expect(func.args[1]).to.deep.equal($$([ 1, 2, 1 ])._);
    }));
    it("#choose", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          result: 2
        },
      ], { randSeed: 0 });
    });
    it("#order", function() {
      testCase(this, [
        {
          source: [],
          result: null
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          result: [ 1, 3, 5 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args: [ function($a, $b) {
            return $b ["<="] ($a);
          } ],
          result: [ 5, 3, 1 ]
        }
      ]);
    });
    it("#powerset", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: [
            {},
            { 1: 2 },
            { 3: 4 },
            { 1: 2, 3: 4 }
          ]
        }
      ]);
    });
    it("#transformEvent", sinon.test(function() {
      var instance, test;
      var $event = $$({
        putAll: this.spy(sc.test.func())
      });

      instance = this.createInstance();

      test = instance.transformEvent($event);
      expect($event.putAll).to.be.calledWith(instance);
      expect($event.putAll).to.be.calledLastIn(test);
    }));
    it.skip("#embedInStream", function() {
    });
    it.skip("#asSortedArray", function() {
    });
    it.skip("#asKeyValuePairs", function() {
    });
    it.skip("#storeItemsOn", function() {
    });
    it.skip("#printItemsOn", function() {
    });
  });

  describe("SCIdentityDictionary", function() {
    before(function() {
      this.createInstance = function(list) {
        return SCIdentityDictionary.newFrom($$(list || []));
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.deep.equals({});
    });
    it("#at", function() {
      testCase(this, [
        {
          source: [ $$(0), $$(1), $.Float(0.0), $.Float(1.0) ],
          args: [ $$(0) ],
          result: $$(1)
        },
        {
          source: [ $$(0), $$(1), $.Float(0.0), $.Float(1.0) ],
          args: [ $.Float(0.0) ],
          result: $.Float(1.0)
        },
      ]);
    });
    it("#putGet", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 1, 0 ],
          result: 2,
          after: { 1: 0, 3: 4 }
        },
        {
          source: [ 1, 2, 3, 4 ],
          args: [ 5, 6 ],
          result: null,
          after: { 1: 2, 3: 4, 5: 6 }
        },
      ]);
    });
    it("#findKeyForValue", function() {
      testCase(this, [
        {
          source: [ $$(0), $$(1) ],
          args: [ $$(1) ],
          result: $$(0)
        },
        {
          source: [ $$(0), $$(1) ],
          args: [ $.Float(1.0) ],
          result: null
        },
      ]);
    });
    it.skip("#freezeAsParent", function() {
    });
    it.skip("#insertParent", function() {
    });
    it.skip("#storeItemsOn", function() {
    });
    it.skip("#doesNotUnderstand", function() {
    });
    it.skip("#nextTimeOnGrid", function() {
    });
    it.skip("#asQuant", function() {
    });
    it.skip("#timingOffset", function() {
    });
  });
})();

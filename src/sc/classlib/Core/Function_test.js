(function() {
  "use strict";

  require("./Function");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  var SCFunction = $("Function");

  describe("SCFunction", function() {
    before(function() {
      this.createInstance = function(func, def) {
        return $.Function(function() {
          return [ func || function() {} ];
        }, def);
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_FUNC);
    });
    it.skip("<def", function() {
    });
    it(".new", function() {
      expect(function() {
        SCFunction.new();
      }).to.throw("should use literal");
    });
    it("#isFunction", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isFunction();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it.skip("#isClosed", function() {
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
    it.skip("#checkCanArchive", function() {
    });
    it("#shallowCopy", function() {
      var instance = this.createInstance();
      expect(instance.shallowCopy).to.be.nop;
    });
    it("#choose", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

      test = instance.choose();
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it("#update", sinon.test(function() {
      var instance, test, spy;
      var $arg1, $arg2, $arg3;

      spy = this.spy(sc.test.func());
      $arg1 = $$();
      $arg2 = $$();
      $arg3 = $$();

      instance = this.createInstance(spy);

      test = instance.update($arg1, $arg2, $arg3);
      expect(spy).to.be.calledWith($arg1, $arg2, $arg3);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#value", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func());

      instance = this.createInstance(spy);

      test = instance.value(1, 2, 3);
      expect(spy).to.be.calledWith(1, 2, 3);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#valueArray", sinon.test(function() {
      var instance, test, spy;
      var $arg1, $arg2, $arg3;

      spy = this.spy(sc.test.func());
      $arg1 = $$();
      $arg2 = $$();
      $arg3 = $$();

      instance = this.createInstance(spy);
      test = instance.valueArray($arg1);

      expect(spy).to.be.calledWith($arg1);
      expect(spy).to.be.calledLastIn(test);
      spy.reset();

      test = instance.valueArray($$([ $arg1, $arg2, $arg3 ]));
      expect(spy).to.be.calledWith($arg1, $arg2, $arg3);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#valueEnvir", sinon.test(sc.test(function() {
      var instance, test, spy;
      var $arg1;

      spy = this.spy(sc.test.func());
      $arg1 = $$();

      instance = this.createInstance(spy, "a=1; b=2; c=3");
      $.Environment("c", $$(300));

      test = instance.valueEnvir($arg1);

      expect(spy.args[0]).that.eqls($$([ $arg1, 2, 300 ])._);
      expect(spy).to.be.calledLastIn(test);
    })));
    it("#valueArrayEnvir", sinon.test(sc.test(function() {
      var instance, test, spy;
      var $arg1, $arg2;

      spy = this.spy(sc.test.func());
      $arg1 = $$();
      $arg2 = $$(null);

      instance = this.createInstance(spy, "a=1; b=2; c=3");
      $.Environment("c", $$(300));

      test = instance.valueArrayEnvir($$([ $arg1, $arg2 ]));

      expect(spy.args[0]).that.eqls($$([ $arg1, null, 300 ])._);
      expect(spy).to.be.calledLastIn(test);
    })));
    it("#functionPerformList", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

      test = instance.functionPerformList($$("\\value"), $$([ 1, 2, 3 ]));
      expect(instance.value.args[0]).to.eql($$([ 1, 2, 3 ])._);
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it.skip("#valueWithEnvir", function() {
    });
    it.skip("#performWithEnvir", function() {
    });
    it.skip("#performKeyValuePairs", function() {
    });
    it.skip("#numArgs", function() {
    });
    it.skip("#numVars", function() {
    });
    it("#loop", sinon.test(function() {
      var instance, test, iter;

      iter = {};

      this.stub(iterator, "function$loop", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.loop();
      expect(iterator.function$loop).to.be.calledWith(undefined);
      expect(iterator.execute).to.be.calledWith(iter, instance);
      expect(test).to.equal(instance);
    }));
    it.skip("#block", function() {
    });
    it("#asRoutine", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asRoutine();
      expect(test).to.be.a("SCRoutine");
    });
    it("#dup", sinon.test(function() {
      var instance, test, spy;
      var $n;

      spy = this.spy(sc.test.func());
      $n = $$(3);
      this.stub($("Array"), "fill", spy);

      instance = this.createInstance();
      test = instance.dup($n);
      expect(spy).to.be.calledWith($n, instance);
      expect(spy).to.be.calledLastIn(test);
    }));
    it.skip("#sum", function() {
    });
    it.skip("#defer", function() {
    });
    it.skip("#thunk", function() {
    });
    it.skip("#transformEvent", function() {
    });
    it.skip("#set", function() {
    });
    it.skip("#get", function() {
    });
    it.skip("#fork", function() {
    });
    it.skip("#forkIfNeeded", function() {
    });
    it.skip("#awake", function() {
    });
    it.skip("#cmdPeriod", function() {
    });
    it.skip("#bench", function() {
    });
    it("#protect", sinon.test(function() {
      var instance, test;
      var spy, $handler;

      spy = this.spy();
      $handler = $$(spy);

      instance = this.createInstance(function() {
        return $$(1);
      });

      test = instance.protect($handler);
      expect(test).to.be.a("SCInteger").that.equals(1);
      expect(spy).to.be.called;
    }));
    it("#protect with error", sinon.test(function() {
      var instance, test;
      var spy, $handler;

      spy = this.spy();
      $handler = $$(spy);

      instance = this.createInstance(function() {
        throw new Error("error");
      });

      test = instance.protect($handler);
      expect(test).to.be.a("SCNil");
      expect(spy).to.be.called;
    }));
    it.skip("#handleError", function() {
    });
    it("#case", function() {
      testCase(this, [
        {
          source: function() {
            return $$(false);
          },
          args: [
            "\\ng",
            true, "\\ok"
          ],
          result: "\\ok"
        },
        {
          source: function() {
            return $$(false);
          },
          args: [
            "\\ng",
            false, "\\ok",
            "\\etc"
          ],
          result: "\\etc"
        },
        {
          source: function() {
            return $$(false);
          },
          args: [
            "\\ng",
            false, "\\ok",
          ],
          result: null
        },
      ]);
    });
    it("#r", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.r();
      expect(test).to.be.a("SCRoutine");
    });
    it("#p", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("Prout").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.p();
      expect(spy).to.be.calledWith(instance);
      expect(spy).to.be.calledLastIn(test);
    }));
    it.skip("#matchItem", function() {
    });
    it.skip("#performDegreeToKey", function() {
    });
    it("#flop", function() {
      var instance, test;

      instance = this.createInstance(function($a, $b) {
        return $a ["+"] ($b);
      });

      test = instance.flop();
      expect(test).to.be.a("SCFunction");

      test = test.value(
        $$([  1,  2     ]),
        $$([ 10, 20, 30 ])
      );
      expect(test).to.be.a("SCArray").that.eqls([ 11, 22, 31 ]);
    });
    it.skip("#envirFlop", function() {
    });
    it.skip("#makeFlopFunc", function() {
    });
    it.skip("#inEnvir", function() {
    });
    it("#while", sinon.test(function() {
      var instance, test, iter;
      var $body;

      iter = {};
      $body = $$();

      this.stub(iterator, "function$while", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.while($body);
      expect(iterator.function$while).to.be.calledWith(instance);
      expect(iterator.execute).to.be.calledWith(iter, $body);
      expect(test).to.equal(instance);
    }));
  });
})();

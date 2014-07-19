describe("Core/Function", function() {
  "use strict";

  var testCase = sc.test.testCase;
  var $$ = sc.test.object;
  var $  = sc.lang.$;
  var SCFunction = $("Function");
  var SCArray = $("Array");

  describe("SCFunction", function() {
    before(function() {
      this.createInstance = function(func, def) {
        return $.Function(function() {
          return [ func || function() {} ];
        }, def || null, 1, null);
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
      expect(SCFunction.new.__errorType).to.equal(sc.ERRID_SHOULD_USE_LITERALS);
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
      expect(instance.shallowCopy).to.doNothing;
    });

    it("#choose", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

      test = instance.choose();
      expect(instance.value).to.be.calledLastIn(test);
    }));

    it("#update", sinon.test(function() {
      var instance, test;
      var $arg1 = $$();
      var $arg2 = $$();
      var $arg3 = $$();
      var func = this.spy(sc.test.func());

      instance = this.createInstance(func);

      test = instance.update($arg1, $arg2, $arg3);
      expect(func).to.be.calledWith($arg1, $arg2, $arg3);
      expect(func).to.be.calledLastIn(test);
    }));

    it("#value", sinon.test(function() {
      var instance, test;
      var func = this.spy(sc.test.func());

      instance = this.createInstance(func);

      test = instance.value(1, 2, 3);
      expect(func).to.be.calledWith(1, 2, 3);
      expect(func).to.be.calledLastIn(test);
    }));

    it("#valueArray", sinon.test(function() {
      var instance, test;
      var $arg1 = $$();
      var $arg2 = $$();
      var $arg3 = $$();
      var func = this.spy(sc.test.func());

      instance = this.createInstance(func);
      test = instance.valueArray($arg1);

      expect(func).to.be.calledWith($arg1);
      expect(func).to.be.calledLastIn(test);
      func.reset();

      test = instance.valueArray($$([ $arg1, $arg2, $arg3 ]));
      expect(func).to.be.calledWith($arg1, $arg2, $arg3);
      expect(func).to.be.calledLastIn(test);
    }));

    it("#valueEnvir", sinon.test(sc.test(function() {
      var instance, test;
      var $arg1 = $$();
      var func = this.spy(sc.test.func());

      instance = this.createInstance(func, "a=1; b=2; c=3");
      $.Environment("c", $$(300));

      test = instance.valueEnvir($arg1);
      expect(func.args[0]).that.deep.equals($$([ $arg1, 2, 300 ])._);
      expect(func).to.be.calledLastIn(test);
    })));

    it("#valueArrayEnvir", sinon.test(sc.test(function() {
      var instance, test;
      var $arg1 = $$();
      var $arg2 = $$(null);
      var func = this.spy(sc.test.func());

      instance = this.createInstance(func, "a=1; b=2; c=3");
      $.Environment("c", $$(300));

      test = instance.valueArrayEnvir($$([ $arg1, $arg2 ]));

      expect(func.args[0]).that.deep.equals($$([ $arg1, null, 300 ])._);
      expect(func).to.be.calledLastIn(test);
    })));

    it("#functionPerformList", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

      test = instance.functionPerformList($$("\\value"), $$([ 1, 2, 3 ]));
      expect(instance.value.args[0]).to.deep.equal($$([ 1, 2, 3 ])._);
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
      var instance, test;
      var iter = {};

      instance = this.createInstance();
      this.stub(sc.lang.iterator, "function$loop", function() {
        return iter;
      });
      this.stub(sc.lang.iterator, "execute");

      test = instance.loop();
      expect(sc.lang.iterator.function$loop).to.be.calledWith(undefined);
      expect(sc.lang.iterator.execute).to.be.calledWith(iter, instance);
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
      var instance, test;
      var $n = $$(3);
      var SCArray$fill = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(SCArray, "fill", SCArray$fill);

      test = instance.dup($n);
      expect(SCArray$fill).to.be.calledWith($n, instance);
      expect(SCArray$fill).to.be.calledLastIn(test);
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
      var func = this.spy();
      var $handler = $$(func);

      instance = this.createInstance(function() {
        return $$(1);
      });

      test = instance.protect($handler);
      expect(test).to.be.a("SCInteger").that.equals(1);
      expect(func).to.be.called;
    }));

    it("#protect with error", sinon.test(function() {
      var instance, test;
      var func = this.spy();
      var $handler = $$(func);

      instance = this.createInstance(function() {
        throw new Error("error");
      });

      test = instance.protect($handler);
      expect(test).to.be.a("SCNil");
      expect(func).to.be.called;
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
      var instance, test;
      var SCProut$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Prout").returns($$({
        new: SCProut$new
      }));

      test = instance.p();
      expect(SCProut$new).to.be.calledWith(instance);
      expect(SCProut$new).to.be.calledLastIn(test);
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
      expect(test).to.be.a("SCArray").that.deep.equals([ 11, 22, 31 ]);
    });
    it.skip("#envirFlop", function() {
    });
    it.skip("#makeFlopFunc", function() {
    });
    it.skip("#inEnvir", function() {
    });

    it("#while", sinon.test(function() {
      var instance, test;
      var iter = {};
      var $body = $$();

      instance = this.createInstance();
      this.stub(sc.lang.iterator, "function$while", function() {
        return iter;
      });
      this.stub(sc.lang.iterator, "execute");

      test = instance.while($body);
      expect(sc.lang.iterator.function$while).to.be.calledWith(instance);
      expect(sc.lang.iterator.execute).to.be.calledWith(iter, $body);
      expect(test).to.equal(instance);
    }));
  });

});

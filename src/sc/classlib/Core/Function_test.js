(function() {
  "use strict";

  require("./Function");

  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  describe("SCFunction", function() {
    var SCFunction, SCObject;
    before(function() {
      SCFunction = $("Function");
      SCObject = $("Object");
      this.createInstance = function(func) {
        return $.Function(func || function() {
        });
      };
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
      this.stub(instance, "value", sc.test.func);

      test = instance.choose();
      expect(instance.value).to.be.calledLastIn(test);
    }));
    it("#update", sinon.test(function() {
      var instance, test, spy;
      var $arg1, $arg2, $arg3;

      spy = this.spy(sc.test.func);
      $arg1 = sc.test.object();
      $arg2 = sc.test.object();
      $arg3 = sc.test.object();

      instance = this.createInstance(spy);

      test = instance.update($arg1, $arg2, $arg3);
      expect(spy).to.be.calledWith($arg1, $arg2, $arg3);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#value", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func);

      instance = this.createInstance(spy);

      test = instance.value(1, 2, 3);
      expect(spy).to.be.calledWith(1, 2, 3);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#valueArray", sinon.test(function() {
      var instance, test, spy;
      var $arg1, $arg2, $arg3;

      spy = this.spy(sc.test.func);
      $arg1 = sc.test.object();
      $arg2 = sc.test.object();
      $arg3 = sc.test.object();

      instance = this.createInstance(spy);
      test = instance.valueArray($arg1);

      expect(spy).to.be.calledWith($arg1);
      expect(spy).to.be.calledLastIn(test);
      spy.reset();

      test = instance.valueArray($.Array([ $arg1, $arg2, $arg3 ]));
      expect(spy).to.be.calledWith($arg1, $arg2, $arg3);
      expect(spy).to.be.calledLastIn(test);
    }));
    it.skip("#valueEnvir", function() {
    });
    it.skip("#valueArrayEnvir", function() {
    });
    it.skip("#functionPerformList", function() {
    });
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
    it.skip("#loop", function() {
    });
    it.skip("#block", function() {
    });
    it("#asRoutine", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func);
      this.stub(sc.lang.klass, "get").withArgs("Routine").returns(sc.test.object({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.asRoutine();
      expect(spy).to.be.calledWith(instance);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#dup", sinon.test(function() {
      var instance, test, spy;
      var $n;

      spy = this.spy(sc.test.func);
      $n = $.Integer(3);
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
      $handler = $.Function(spy);

      instance = this.createInstance(function() {
        return $.Integer(1);
      });

      test = instance.protect($handler);
      expect(test).to.be.a("SCInteger").that.equals(1);
      expect(spy).to.be.called;
    }));
    it("#protect with error", sinon.test(function() {
      var instance, test;
      var spy, $handler;

      spy = this.spy();
      $handler = $.Function(spy);

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
            return $.False();
          },
          args: [
            "\\ng",
            true, "\\ok"
          ],
          result: "\\ok"
        },
        {
          source: function() {
            return $.False();
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
            return $.False();
          },
          args: [
            "\\ng",
            false, "\\ok",
          ],
          result: null
        },
      ]);
    });
    it("#r", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func);
      this.stub(sc.lang.klass, "get").withArgs("Routine").returns(sc.test.object({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.r();
      expect(spy).to.be.calledWith(instance);
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#p", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func);
      this.stub(sc.lang.klass, "get").withArgs("Prout").returns(sc.test.object({
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
        $.Array([ $.Integer( 1), $.Integer( 2)                  ]),
        $.Array([ $.Integer(10), $.Integer(20), $.Integer(30) ])
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
      $body = sc.test.object();

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

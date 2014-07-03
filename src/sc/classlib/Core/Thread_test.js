(function() {
  "use strict";

  require("./Thread");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var SCThread = $("Thread");
  var SCRoutine = $("Routine");

  describe("SCThread", function() {
    before(function() {
      this.createInstance = function(funcArray) {
        return SCThread.new($.Function(function() {
          return funcArray || [];
        }));
      };
    });
    it("<state", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.state();
      expect(test).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
    });
    it.skip("<primitiveError", function() {
    });
    it.skip("<primitiveIndex", function() {
    });
    it.skip("<beats", function() {
    });
    it.skip("<seconds", function() {
    });
    it.skip("<clock", function() {
    });
    it.skip("<nextBeat", function() {
    });
    it.skip("<>endBeat", function() {
    });
    it.skip("<>endValue", function() {
    });
    it.skip("<>exceptionHandler", function() {
    });
    it.skip(">threadPlayer", function() {
    });
    it.skip("<executingPath", function() {
    });
    it.skip("<oldExecutingPath", function() {
    });
    it.skip("#init", function() {
    });
    it("#copy", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.copy).to.doNothing;
    });
    it.skip("#clock_", function() {
    });
    it.skip("#seconds_", function() {
    });
    it.skip("#beats_", function() {
    });
    it.skip("#isPlaying", function() {
    });
    it.skip("#threadPlayer", function() {
    });
    it.skip("#findThreadPlayer", function() {
    });
    it(">randSeed", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.randSeed_($$(0));

      expect(test).to.equal(instance);

      test = instance.randData();
      expect(test).to.be.a("SCInt32Array").that.eqls(
        new Int32Array([ 204043952, -27998203, 716100824 ])
      );
    });
    it("<>randData", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.randData_($$([ 1, 2, 3 ]));

      test = instance.randData();
      expect(test).to.be.a("SCInt32Array").that.eqls(
        new Int32Array([ 1, 2, 3 ])
      );
    });
    it.skip("#failedPrimitiveName", function() {
    });
    it.skip("#handleError", function() {
    });
    it("#next", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.next).to.doNothing;
    });
    it("#value", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.value).to.doNothing;
    });
    it("#valueArray", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.valueArray).to.doNothing;
    });
    it.skip("#$primitiveError", function() {
    });
    it.skip("#$primitiveErrorString", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#archiveAsCompileString", function() {
    });
    it.skip("#checkCanArchive", function() {
    });
  });

  describe("SCRoutine", function() {
    before(function() {
      this.createInstance = function(funcArray) {
        return SCRoutine.new($.Function(function() {
          return funcArray || [];
        }));
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_ROUTINE);
    });
    it(".new", function() {
      var instance;

      instance = SCRoutine.new($.Func());
      expect(instance).to.be.a("SCRoutine");

      expect(function() {
        SCRoutine.new($$(1));
      }, "with not a function").to.throw("Thread.init failed");
    });
    it.skip(".run", function() {
    });
    it("#next", function() {
      var instance;
      var $inval = $$();

      instance = this.createInstance([
        function($inval) {
          return $inval.yield();
        },
        function() {
          return $$(1).yield();
        },
        function() {
          return $.Function(function() {
            return [
              function() {
                return $$(2).yield();
              },
              function() {
                return $$(3).yield();
              },
              $.NOP
            ];
          }).value();
        },
        function() {
          return $$(4).yield();
        },
        function() {
          return $$([ 5, 6, 7 ]).do($$(function($_) {
            return $_.yield();
          }));
        },
        $.NOP
      ]);

      expect(instance.next($inval), 0).to.equal($inval);
      expect(instance.next($inval), 1).to.be.a("SCInteger").that.equals(1);
      expect(instance.next($inval), 2).to.be.a("SCInteger").that.equals(2);
      expect(instance.next($inval), 3).to.be.a("SCInteger").that.equals(3);
      expect(instance.next($inval), 4).to.be.a("SCInteger").that.equals(4);
      expect(instance.next($inval), 5).to.be.a("SCInteger").that.equals(5);
      expect(instance.next($inval), 6).to.be.a("SCInteger").that.equals(6);
      expect(instance.next($inval), 7).to.be.a("SCInteger").that.equals(7);
      expect(instance.next($inval), 8).to.be.a("SCNil");
    });
    it("#value", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.value).to.equal(instance.next);
    });
    it("#resume", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.resume).to.equal(instance.next);
    });
    it("#run", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.run).to.equal(instance.next);
    });
    it("#valueArray", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.valueArray).to.equal(instance.value);
    });
    it("#reset", function() {
      var instance;

      instance = this.createInstance([
        function() {
          return $$([ 1, 2, 3 ]).do($$(function($_) {
            return $_.yield();
          }));
        }
      ]);

      expect(instance.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(instance.next() , 1).to.be.a("SCInteger").that.equals(1);
      expect(instance.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(instance.next() , 3).to.be.a("SCInteger").that.equals(2);
      expect(instance.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(instance.reset(), 5).to.equal(instance);
      expect(instance.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(instance.next() , 7).to.be.a("SCInteger").that.equals(1);
      expect(instance.state(), 8).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(instance.next() , 9).to.be.a("SCInteger").that.equals(2);
      expect(instance.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(instance.next() ,11).to.be.a("SCInteger").that.equals(3);
      expect(instance.state(),12).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(instance.next() ,13).to.be.a("SCNil");
      expect(instance.state(),14).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(instance.next() ,15).to.be.a("SCNil");
      expect(instance.reset(),16).to.equal(instance);
      expect(instance.state(),17).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(instance.next() ,18).to.be.a("SCInteger").that.equals(1);
    });
    it.skip("#stop", function() {
    });
    it.skip("#p", function() {
    });
    it.skip("#storeArgs", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#awake", function() {
    });
  });
})();

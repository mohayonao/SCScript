(function() {
  "use strict";

  require("./Thread");

  var $SC = sc.lang.$SC;

  describe("SCThread", function() {
    var SCThread;
    before(function() {
      SCThread = $SC("Thread");
      this.createInstance = function() {
        return SCThread.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("#<state", function() {
    });
    it.skip("#<parent", function() {
    });
    it.skip("#<primitiveError", function() {
    });
    it.skip("#<primitiveIndex", function() {
    });
    it.skip("#<beats", function() {
    });
    it.skip("#<seconds", function() {
    });
    it.skip("#<clock", function() {
    });
    it.skip("#<nextBeat", function() {
    });
    it.skip("#<>endBeat", function() {
    });
    it.skip("#<>endValue", function() {
    });
    it.skip("#<>exceptionHandler", function() {
    });
    it.skip("#>threadPlayer", function() {
    });
    it.skip("#<executingPath", function() {
    });
    it.skip("#<oldExecutingPath", function() {
    });
    it.skip("#init", function() {
    });
    it.skip("#copy", function() {
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
    it.skip("#randSeed_", function() {
    });
    it.skip("#randData_", function() {
    });
    it.skip("#randData", function() {
    });
    it.skip("#failedPrimitiveName", function() {
    });
    it.skip("#handleError", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#value", function() {
    });
    it.skip("#valueArray", function() {
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
    var SCRoutine;
    before(function() {
      SCRoutine = $SC("Routine");
      this.createInstance = function() {
        return SCRoutine.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip(".run", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#value", function() {
    });
    it.skip("#resume", function() {
    });
    it.skip("#run", function() {
    });
    it.skip("#valueArray", function() {
    });
    it.skip("#reset", function() {
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

(function() {
  "use strict";

  require("./Thread");

  var $ = sc.lang.$;

  describe("SCThread", function() {
    var SCThread;
    before(function() {
      SCThread = $("Thread");
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
    it("<state", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.state();
      expect(test).to.be.a("SCInteger").that.equals(sc.C.THREAD_STATE_INIT);
    });
    it.skip("<parent", function() {
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
      var instance = this.createInstance();
      expect(instance.copy).to.be.nop;
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
      test = instance.randSeed_($.Integer(0));

      expect(test).to.equal(instance);

      test = instance.randData();
      expect(test).to.be.a("SCInt32Array").that.eqls(
        new Int32Array([ 204043952, -27998203, 716100824 ])
      );
    });
    it("<>randData", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.randData_(sc.test.encode([ 1, 2, 3 ]));

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
      var instance = this.createInstance();
      expect(instance.next).to.be.nop;
    });
    it("#value", function() {
      var instance = this.createInstance();
      expect(instance.value).to.be.nop;
    });
    it("#valueArray", function() {
      var instance = this.createInstance();
      expect(instance.valueArray).to.be.nop;
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
      SCRoutine = $("Routine");
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

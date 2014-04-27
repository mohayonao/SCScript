(function() {
  "use strict";

  require("./Stream");

  var $SC = sc.lang.$SC;

  describe("SCStream", function() {
    var SCStream;
    before(function() {
      SCStream = $SC.Class("Stream");
      this.createInstance = function() {
        return SCStream.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("#parent", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#iter", function() {
    });
    it.skip("#value", function() {
    });
    it.skip("#valueArray", function() {
    });
    it.skip("#nextN", function() {
    });
    it.skip("#all", function() {
    });
    it.skip("#put", function() {
    });
    it.skip("#putN", function() {
    });
    it.skip("#putAll", function() {
    });
    it.skip("#do", function() {
    });
    it.skip("#subSample", function() {
    });
    it.skip("#loop", function() {
    });
    it.skip("#generate", function() {
    });
    it.skip("#collect", function() {
    });
    it.skip("#reject", function() {
    });
    it.skip("#select", function() {
    });
    it.skip("#dot", function() {
    });
    it.skip("#interlace", function() {
    });
    it.skip("#++", function() {
    });
    it.skip("#appendStream", function() {
    });
    it.skip("#collate", function() {
    });
    it.skip("#<>", function() {
    });
    it.skip("#composeUnaryOp", function() {
    });
    it.skip("#composeBinaryOp", function() {
    });
    it.skip("#reverseComposeBinaryOp", function() {
    });
    it.skip("#composeNAryOp", function() {
    });
    it.skip("#embedInStream", function() {
    });
    it.skip("#while", function() {
    });
    it.skip("#asEventStreamPlayer", function() {
    });
    it.skip("#play", function() {
    });
    it.skip("#trace", function() {
    });
    it.skip("#constrain", function() {
    });
    it.skip("#repeat", function() {
    });
  });

  describe("SCPauseStream", function() {
    var SCPauseStream;
    before(function() {
      SCPauseStream = $SC.Class("PauseStream");
      this.createInstance = function() {
        return SCPauseStream.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("#<stream", function() {
    });
    it.skip("#<originalStream", function() {
    });
    it.skip("#<clock", function() {
    });
    it.skip("#<nextBeat", function() {
    });
    it.skip("#<>streamHasEnded", function() {
    });
    it.skip("#isPlaying", function() {
    });
    it.skip("#play", function() {
    });
    it.skip("#reset", function() {
    });
    it.skip("#stop", function() {
    });
    it.skip("#prStop", function() {
    });
    it.skip("#removedFromScheduler", function() {
    });
    it.skip("#streamError", function() {
    });
    it.skip("#wasStopped", function() {
    });
    it.skip("#canPause", function() {
    });
    it.skip("#pause", function() {
    });
    it.skip("#resume", function() {
    });
    it.skip("#refresh", function() {
    });
    it.skip("#start", function() {
    });
    it.skip("#stream_", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#awake", function() {
    });
    it.skip("#threadPlayer", function() {
    });
  });

  describe("SCTask", function() {
    var SCTask;
    before(function() {
      SCTask = $SC.Class("Task");
      this.createInstance = function() {
        return SCTask.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("#storeArgs", function() {
    });
  });
})();

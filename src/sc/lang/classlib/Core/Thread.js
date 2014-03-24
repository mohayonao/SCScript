(function(sc) {
  "use strict";

  require("../Streams/Stream");

  function SCThread() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define("Thread", "Stream", {
    constructor: SCThread,
    NotYetImplemented: [
      "init",
      "copy",
      "clock_",
      "seconds_",
      "beats_",
      "isPlaying",
      "threadPlayer",
      "findThreadPlayer",
      "randSeed_",
      "randData_",
      "randData",
      "failedPrimitiveName",
      "handleError",
      "next",
      "value",
      "valueArray",
      "$primitiveError",
      "$primitiveErrorString",
      "storeOn",
      "archiveAsCompileString",
      "checkCanArchive",
    ]
  });

  function SCRoutine() {
    this.__initializeWith__("Thread");
  }

  sc.lang.klass.define("Routine", "Thread", {
    constructor: SCRoutine,
    NotYetImplemented: [
      "$run",
      "next",
      "value",
      "resume",
      "run",
      "valueArray",
      "reset",
      "stop",
      "prStop",
      "storeArgs",
      "storeOn",
      "awake",
      "prStart",
    ]
  });

})(sc);

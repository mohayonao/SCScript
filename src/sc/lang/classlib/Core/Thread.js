(function(sc) {
  "use strict";

  require("../Streams/Stream");

  sc.lang.klass.define("Thread", "Stream", {
    NotYetImplemented: [
      "$new",
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

  sc.lang.klass.define("Routine", "Thread", {
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

(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  function SCStream() {
    this.__initializeWith__("AbstractFunction");
  }

  sc.lang.klass.define("Stream", "AbstractFunction", {
    constructor: SCStream,
    NotYetImplemented: [
      "parent",
      "next",
      "iter",
      "value",
      "valueArray",
      "nextN",
      "all",
      "put",
      "putN",
      "putAll",
      "do",
      "subSample",
      "loop",
      "generate",
      "collect",
      "reject",
      "select",
      "dot",
      "interlace",
      "appendStream",
      "collate",
      "composeUnaryOp",
      "composeBinaryOp",
      "reverseComposeBinaryOp",
      "composeNAryOp",
      "embedInStream",
      "while",
      "asEventStreamPlayer",
      "play",
      "trace",
      "constrain",
      "repeat",
    ]
  });

  function SCPauseStream() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define("PauseStream", "Stream", {
    constructor: SCPauseStream,
    NotYetImplemented: [
      "isPlaying",
      "play",
      "reset",
      "stop",
      "prStop",
      "removedFromScheduler",
      "streamError",
      "wasStopped",
      "canPause",
      "pause",
      "resume",
      "refresh",
      "start",
      "stream_",
      "next",
      "awake",
      "threadPlayer",
    ]
  });

  function SCTask() {
    this.__initializeWith__("PauseStream");
  }

  sc.lang.klass.define("Task", "PauseStream", {
    constructor: SCTask,
    NotYetImplemented: [
      "storeArgs",
    ]
  });

})(sc);

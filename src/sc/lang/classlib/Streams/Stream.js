(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  sc.lang.klass.define("Stream", "AbstractFunction", {
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
      "while",
      "subSample",
      "loop",
      "generate",
      "while",
      "collect",
      "reject",
      "while",
      "select",
      "while",
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

  sc.lang.klass.define("PauseStream", "Stream", {
    NotYetImplemented: [
      "$new",
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

  sc.lang.klass.define("Task", "PauseStream", {
    NotYetImplemented: [
      "$new",
      "storeArgs",
    ]
  });

})(sc);

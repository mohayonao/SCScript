SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  function SCStream() {
    this.__initializeWith__("AbstractFunction");
  }

  sc.lang.klass.define(SCStream, "Stream : AbstractFunction", function() {
    // TODO: implements parent
    // TODO: implements next
    // TODO: implements iter
    // TODO: implements value
    // TODO: implements valueArray
    // TODO: implements nextN
    // TODO: implements all
    // TODO: implements put
    // TODO: implements putN
    // TODO: implements putAll
    // TODO: implements do
    // TODO: implements subSample
    // TODO: implements loop
    // TODO: implements generate
    // TODO: implements collect
    // TODO: implements reject
    // TODO: implements select
    // TODO: implements dot
    // TODO: implements interlace
    // TODO: implements ++
    // TODO: implements appendStream
    // TODO: implements collate
    // TODO: implements <>
    // TODO: implements composeUnaryOp
    // TODO: implements composeBinaryOp
    // TODO: implements reverseComposeBinaryOp
    // TODO: implements composeNAryOp
    // TODO: implements embedInStream
    // TODO: implements while
    // TODO: implements asEventStreamPlayer
    // TODO: implements play
    // TODO: implements trace
    // TODO: implements constrain
    // TODO: implements repeat
  });

  function SCPauseStream() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define(SCPauseStream, "PauseStream : Stream", function() {
    // TODO: implements stream
    // TODO: implements originalStream
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements streamHasEnded
    // TODO: implements streamHasEnded_

    // TODO: implements isPlaying
    // TODO: implements play
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements prStop
    // TODO: implements removedFromScheduler
    // TODO: implements streamError
    // TODO: implements wasStopped
    // TODO: implements canPause
    // TODO: implements pause
    // TODO: implements resume
    // TODO: implements refresh
    // TODO: implements start
    // TODO: implements stream_
    // TODO: implements next
    // TODO: implements awake
    // TODO: implements threadPlayer
  });

  function SCTask() {
    this.__initializeWith__("PauseStream");
  }

  sc.lang.klass.define(SCTask, "Task : PauseStream", function() {
    // TODO: implements storeArgs
  });

});

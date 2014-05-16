SCScript.install(function(sc) {
  "use strict";

  require("../Streams/Stream");

  function SCThread() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define(SCThread, "Thread : Stream", function() {
    // TODO: implements state
    // TODO: implements parent
    // TODO: implements primitiveError
    // TODO: implements primitiveIndex
    // TODO: implements beats
    // TODO: implements seconds
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements endBeat
    // TODO: implements endBeat_
    // TODO: implements endValue
    // TODO: implements endValue_
    // TODO: implements exceptionHandler
    // TODO: implements exceptionHandler_
    // TODO: implements threadPlayer_
    // TODO: implements executingPath
    // TODO: implements oldExecutingPath

    // TODO: implements init
    // TODO: implements copy
    // TODO: implements clock_
    // TODO: implements seconds_
    // TODO: implements beats_
    // TODO: implements isPlaying
    // TODO: implements threadPlayer
    // TODO: implements findThreadPlayer
    // TODO: implements randSeed_
    // TODO: implements randData_
    // TODO: implements randData
    // TODO: implements failedPrimitiveName
    // TODO: implements handleError
    // TODO: implements next
    // TODO: implements value
    // TODO: implements valueArray
    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  function SCRoutine() {
    this.__initializeWith__("Thread");
  }

  sc.lang.klass.define(SCRoutine, "Routine : Thread", function() {
    // TODO: implements $run
    // TODO: implements next
    // TODO: implements value
    // TODO: implements resume
    // TODO: implements run
    // TODO: implements valueArray
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });

});

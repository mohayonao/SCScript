SCScript.install(function(sc) {
  "use strict";

  require("../Streams/Stream");

  var $    = sc.lang.$;
  var fn   = sc.lang.fn;
  var main = sc.lang.main;
  var klass = sc.lang.klass;
  var random = sc.libs.random;

  klass.define("Thread : Stream", function(spec, utils) {
    spec.constructor = function SCThread() {
      this.__super__("Stream");
    };
    utils.setProperty(spec, "<", "parent");

    spec.$new = fn(function($func) {
      return this.__super__("new")._init($func);
    }, "func");

    spec._init = function($func) {
      if ($func.__tag !== sc.TAG_FUNC) {
        throw new Error("Thread.init failed");
      }
      this._bytecode = $func._bytecode.setOwner(this);
      this._state    = sc.STATE_INIT;
      this._parent   = null;
      this._randgen  = new random.RandGen((Math.random() * 4294967295) >>> 0);
      return this;
    };

    spec.state = function() {
      return $.Integer(this._state);
    };

    // TODO: implements primitiveError
    // TODO: implements primitiveIndex
    // TODO: implements beats
    // TODO: implements beats_
    // TODO: implements seconds
    // TODO: implements seconds_
    // TODO: implements clock
    // TODO: implements clock_
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

    spec.copy = utils.nop;

    // spec.isPlaying = function() {
    //   return $.Boolean(this._state._ === 5);
    // };

    // TODO: implements threadPlayer
    // TODO: implements findThreadPlayer

    spec.randSeed_ = fn(function($seed) {
      this._randgen.setSeed($seed.__int__() >>> 0);
      return this;
    }, "seed");

    spec.randData_ = fn(function($data) {
      this._randgen.x = $data.at($.Integer(0)).__int__();
      this._randgen.y = $data.at($.Integer(1)).__int__();
      this._randgen.z = $data.at($.Integer(2)).__int__();
      return this;
    }, "data");

    spec.randData = function() {
      return $("Int32Array").newFrom($.Array([
        $.Integer(this._randgen.x),
        $.Integer(this._randgen.y),
        $.Integer(this._randgen.z),
      ]));
    };

    // TODO: implements failedPrimitiveName
    // TODO: implements handleError

    spec.next = utils.nop;
    spec.value = utils.nop;
    spec.valueArray = utils.nop;
    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  klass.define("Routine : Thread", function(spec, utils) {
    var $nil = utils.$nil;

    spec.__tag = sc.TAG_ROUTINE;

    spec.constructor = function SCRoutine() {
      this.__super__("Thread");
    };

    spec.$new = function($func) {
      return this.__super__("new", [ $func ]);
    };

    // TODO: implements $run

    var routine$resume = function($inval) {
      if (this._state === sc.STATE_DONE) {
        return $nil;
      }

      this._parent = main.$currentThread;
      main.$currentThread = this;

      this._state = sc.STATE_RUNNING;
      this._bytecode.runAsRoutine([ $inval || $nil ]);
      this._state = this._bytecode.state;

      main.$currentThread = this._parent;
      this._parent = null;

      return this._bytecode.result || $nil;
    };

    spec.next   = routine$resume;
    spec.value  = routine$resume;
    spec.resume = routine$resume;
    spec.run    = routine$resume;
    spec.valueArray = routine$resume;

    spec.reset = function() {
      this._state = sc.STATE_INIT;
      this._bytecode.reset();
      return this;
    };
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });
});

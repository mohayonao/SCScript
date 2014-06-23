SCScript.install(function(sc) {
  "use strict";

  require("../Streams/Stream");

  var $ = sc.lang.$;
  var $nil = $.nil;
  var random = sc.libs.random;

  sc.lang.klass.refine("Thread", function(builder) {
    builder.addProperty("<", "parent");

    builder.addClassMethod("new", {
      args: "func"
    }, function($func) {
      return this.__super__("new")._init($func);
    });

    builder.addMethod("_init", function($func) {
      if ($func.__tag !== sc.TAG_FUNC) {
        throw new Error("Thread.init failed");
      }
      this._bytecode = $func._bytecode.setOwner(this);
      this._state    = sc.STATE_INIT;
      this._parent   = null;
      this._randgen  = new random.RandGen((Math.random() * 4294967295) >>> 0);
      return this;
    });

    builder.addMethod("state", function() {
      return $.Integer(this._state);
    });

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

    builder.addMethod("copy");

    // TODO: implements isPlaying
    // TODO: implements threadPlayer
    // TODO: implements findThreadPlayer

    builder.addMethod("randSeed_", {
      args: "seed"
    }, function($seed) {
      this._randgen.setSeed($seed.__int__() >>> 0);
      return this;
    });

    builder.addMethod("randData_", {
      args: "data"
    }, function($data) {
      this._randgen.x = $data.at($.Integer(0)).__int__();
      this._randgen.y = $data.at($.Integer(1)).__int__();
      this._randgen.z = $data.at($.Integer(2)).__int__();
      return this;
    });

    builder.addMethod("randData", function() {
      return $("Int32Array").newFrom($.Array([
        $.Integer(this._randgen.x),
        $.Integer(this._randgen.y),
        $.Integer(this._randgen.z),
      ]));
    });

    // TODO: implements failedPrimitiveName
    // TODO: implements handleError

    builder.addMethod("next");
    builder.addMethod("value");
    builder.addMethod("valueArray");
    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  sc.lang.klass.refine("Routine", function(builder) {
    builder.addClassMethod("new", function($func) {
      return this.__super__("new", [ $func ]);
    });

    // TODO: implements $run

    var routine$resume = function($inval) {
      if (this._state === sc.STATE_DONE) {
        return this._$doneValue || $nil;
      }

      this._parent = sc.lang.main.getCurrentThread();
      sc.lang.main.setCurrentThread(this);

      this._state = sc.STATE_RUNNING;
      this._bytecode.runAsRoutine([ $inval || $nil ]);
      this._state = this._bytecode.state;

      if (this._state === sc.STATE_DONE) {
        this._$doneValue = this._bytecode.result;
      }

      sc.lang.main.setCurrentThread(this._parent);
      this._parent = null;

      return this._bytecode.result || $nil;
    };

    builder.addMethod("next", routine$resume);
    builder.addMethod("value", routine$resume);
    builder.addMethod("resume", routine$resume);
    builder.addMethod("run", routine$resume);
    builder.addMethod("valueArray", routine$resume);

    builder.addMethod("reset", function() {
      this._state = sc.STATE_INIT;
      this._bytecode.reset();
      return this;
    });
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });
});

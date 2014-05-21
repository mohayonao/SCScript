SCScript.install(function(sc) {
  "use strict";

  require("../Streams/Stream");

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var random = sc.libs.random;

  sc.lang.klass.refine("Thread", function(spec, utils) {
    var $nil   = utils.$nil;

    spec._init = function() {
      this._state   = sc.C.THREAD_STATE_INIT;
      this._randgen = new random.RandGen((Math.random() * 4294967295) >>> 0);
    };

    spec.state = function() {
      return $SC.Integer(this._state);
    };

    // spec.parent = function() {
    //   return this._parent;
    // };

    // spec.primitiveError = function() {
    //   return this._primitiveError;
    // };

    // spec.primitiveIndex = function() {
    //   return this._primitiveIndex;
    // };

    // spec.beats = function() {
    //   return this._beats;
    // };

    // spec.beats_ = fn(function($inBeats) {
    //   this._beats   = $inBeats;
    //   this._seconds = this._clock.beats2secs($inBeats);
    //   return this;
    // }, "inBeats");

    // spec.seconds = function() {
    //   return this._seconds;
    // };

    // spec.seconds_ = fn(function($inSeconds) {
    //   this._seconds = $inSeconds;
    //   this._beats   = this._clock.secs2beats($inSeconds);
    //   return this;
    // }, "inSeconds");

    // spec.clock = function() {
    //   return this._clock;
    // };

    // spec.clock_ = fn(function($inClock) {
    //   this._clock = $inClock;
    //   this._beats = this._clock.secs2beats(this._seconds);
    //   return this;
    // }, "inClock");

    // spec.nextBeat = function() {
    //   return this._nextBeat;
    // };

    // spec.endBeat = function() {
    //   return this._endBeat;
    // };

    // spec.endBeat_ = function($value) {
    //   this._endBeat = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.endValue = function() {
    //   return this._endValue;
    // };

    // spec.endValue_ = function($value) {
    //   this._endValue = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.exceptionHandler = function() {
    //   return this._exceptionHandler;
    // };

    // spec.exceptionHandler_ = function($value) {
    //   this._exceptionHandler = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.threadPlayer_ = function($value) {
    //   this._threadPlayer = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.executingPath = function() {
    //   return this._executingPath;
    // };

    // spec.oldExecutingPath = function() {
    //   return this._oldExecutingPath;
    // };

    // TODO: implements init

    spec.copy = utils.nop;

    // spec.isPlaying = function() {
    //   return $SC.Boolean(this._state._ === 5);
    // };

    // spec.threadPlayer = function() {
    //   if (this._threadPlayer !== $nil) {
    //     return this.findThreadPlayer();
    //   }
    //   return $nil;
    // };

    // TODO: implements findThreadPlayer

    spec.randSeed_ = fn(function($seed) {
      var seed;

      if ($seed === $nil) {
        seed = Math.random() * 4294967295;
      } else {
        seed = $seed.__int__();
      }
      this._randgen.setSeed(seed >>> 0);

      return this;
    }, "seed");

    spec.randData_ = fn(function($data) {
      this._randgen.x = $data.at($SC.Integer(0)).__int__();
      this._randgen.y = $data.at($SC.Integer(1)).__int__();
      this._randgen.z = $data.at($SC.Integer(2)).__int__();
      return this;
    }, "data");

    spec.randData = function() {
      return $SC("Int32Array").newFrom($SC.Array([
        $SC.Integer(this._randgen.x),
        $SC.Integer(this._randgen.y),
        $SC.Integer(this._randgen.z),
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

  sc.lang.klass.refine("Routine", function() {
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

(function(sc) {
  "use strict";

  require("./klass");
  require("./dollarSC");
  require("../libs/random");

  var main = {};

  var $SC = sc.lang.$SC;
  var random = sc.libs.random;

  var $process, $interpreter;
  var $mainThread;

  main.run = function(fn) {
    if (!initialize.done) {
      initialize();
    }
    return fn($interpreter, $SC);
  };

  function initialize() {
    var Process, Interpreter, Thread;

    Process     = $SC("Process")._Spec;
    Interpreter = $SC("Interpreter")._Spec;
    Thread      = $SC("Thread")._Spec;

    $process     = new Process();
    $interpreter = new Interpreter();
    $mainThread  = new Thread();

    $process._$interpreter = $interpreter;
    // $interpreter._$s = SCServer.default();

    main.$thread   = $mainThread;
    random.current = $mainThread._randgen;

    // TODO:
    // SoundSystem.addThread($mainThread);
    // SoundSystem.start();

    initialize.done = true;
  }

  $SC.thisProcess = function() {
    return $process;
  };

  $SC.thisThread = function() {
    return main.$thread;
  };

  sc.lang.main = main;

})(sc);

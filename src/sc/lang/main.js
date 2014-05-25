(function(sc) {
  "use strict";

  require("./klass");
  require("./dollarSC");
  require("../libs/random");

  var main = {};

  var $SC = sc.lang.$SC;
  var random = sc.libs.random;

  main.$currentEnv = null;

  main.run = function(fn) {
    if (!initialize.done) {
      initialize();
    }
    return fn($SC);
  };

  function initialize() {
    var $process;

    $process = $SC("Main").new();
    $process._$interpreter = $SC("Interpreter").new();
    $process._$mainThread  = $SC("Thread").new();

    main.$currentEnv = $SC("Environment").new();

    // $interpreter._$s = SCServer.default();

    random.current = $process._$mainThread._randgen;

    // TODO:
    // SoundSystem.addProcess($process);
    // SoundSystem.start();

    initialize.done = true;

    main.$process = $process;
  }

  $SC.Environment = function(key, $value) {
    if ($value) {
      main.$currentEnv.put($SC.Symbol(key), $value);
      return $value;
    }
    return main.$currentEnv.at($SC.Symbol(key));
  };

  $SC.This = function() {
    return main.$process.interpreter();
  };

  $SC.ThisProcess = function() {
    return main.$process;
  };

  $SC.ThisThread = function() {
    return main.$process.mainThread();
  };

  sc.lang.main = main;

})(sc);

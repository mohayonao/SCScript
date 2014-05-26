(function(sc) {
  "use strict";

  require("./klass");
  require("./dollar");
  require("../libs/random");

  var main = {};

  var $ = sc.lang.$;
  var random = sc.libs.random;

  main.$currentEnv = null;

  main.run = function(fn) {
    if (!initialize.done) {
      initialize();
    }
    return fn($);
  };

  function initialize() {
    var $process;

    $process = $("Main").new();
    $process._$interpreter = $("Interpreter").new();
    $process._$mainThread  = $("Thread").new();

    main.$currentEnv = $("Environment").new();

    // $interpreter._$s = SCServer.default();

    random.current = $process._$mainThread._randgen;

    // TODO:
    // SoundSystem.addProcess($process);
    // SoundSystem.start();

    initialize.done = true;

    main.$process = $process;
  }

  $.Environment = function(key, $value) {
    if ($value) {
      main.$currentEnv.put($.Symbol(key), $value);
      return $value;
    }
    return main.$currentEnv.at($.Symbol(key));
  };

  $.This = function() {
    return main.$process.interpreter();
  };

  $.ThisProcess = function() {
    return main.$process;
  };

  $.ThisThread = function() {
    return main.$process.mainThread();
  };

  sc.lang.main = main;

})(sc);

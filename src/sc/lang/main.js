(function(sc) {
  "use strict";

  require("./klass");
  require("./dollar");
  require("../libs/random");

  var main = {};

  var $ = sc.lang.$;
  var random = sc.libs.random;

  var $currentEnvir = null;
  var $currentThread = {};

  main.run = function(func) {
    if (!initialize.done) {
      initialize();
    }
    return func($);
  };

  function initialize() {
    var $process;

    $process = $("Main").new();
    $process._$interpreter = $("Interpreter").new();
    $process._$mainThread  = $("Thread").new($.Func());

    $currentEnvir = $("Environment").new();
    $currentThread = $process._$mainThread;

    // $interpreter._$s = SCServer.default();

    random.current = $process._$mainThread._randgen;

    // TODO:
    // SoundSystem.addProcess($process);
    // SoundSystem.start();

    initialize.done = true;

    main.$process = $process;
  }

  main.setCurrentEnvir = function($envir) {
    $currentEnvir = $envir;
  };

  main.getCurrentEnvir = function() {
    return $currentEnvir;
  };

  main.setCurrentThread = function($thread) {
    $currentThread = $thread;
  };

  main.getCurrentThread = function() {
    return $currentThread;
  };

  $.addProperty("Environment", function(key, $value) {
    if ($value) {
      $currentEnvir.put($.Symbol(key), $value);
      return $value;
    }
    return $currentEnvir.at($.Symbol(key));
  });

  $.addProperty("This", function() {
    return main.$process.interpreter();
  });

  $.addProperty("ThisProcess", function() {
    return main.$process;
  });

  $.addProperty("ThisThread", function() {
    return $currentThread;
  });

  sc.lang.main = main;
})(sc);

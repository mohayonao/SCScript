(function(sc) {
  "use strict";

  require("./dollar");

  var main = {};

  var $ = sc.lang.$;
  var random = sc.libs.random;

  var $process = null;
  var $currentEnvir = null;
  var $currentThread = {};

  main.run = function(func) {
    if (!$process) {
      initialize();
    }
    return func($);
  };

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

  function initialize() {
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
  }

  $.addProperty("Environment", function(key, $value) {
    if ($value) {
      $currentEnvir.put($.Symbol(key), $value);
      return $value;
    }
    return $currentEnvir.at($.Symbol(key));
  });

  $.addProperty("This", function() {
    return $process.interpreter();
  });

  $.addProperty("ThisProcess", function() {
    return $process;
  });

  $.addProperty("ThisThread", function() {
    return $currentThread;
  });

  sc.lang.main = main;
})(sc);

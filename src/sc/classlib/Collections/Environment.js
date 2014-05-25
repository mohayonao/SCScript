SCScript.install(function(sc) {
  "use strict";

  require("./Dictionary");

  var fn   = sc.lang.fn;
  var main = sc.lang.main;

  sc.lang.klass.refine("Environment", function(spec, utils) {
    var $nil = utils.$nil;

    var envStack = [];

    spec.$make = function($function) {
      return this.new().make($function);
    };

    spec.$use = function($function) {
      return this.new().use($function);
    };

    spec.make = fn(function($function) {
      var $saveEnvir;

      $saveEnvir = main.$currentEnv;
      try {
        $function.value(this);
      } catch (e) {}
      main.$currentEnv = $saveEnvir;

      return this;
    }, "function");

    spec.use = fn(function($function) {
      var $result, $saveEnvir;

      $saveEnvir = main.$currentEnv;
      try {
        $result = $function.value(this);
      } catch (e) {}
      main.$currentEnv = $saveEnvir;

      return $result || /* istanbul ignore next */ $nil;
    }, "function");

    spec.eventAt = fn(function($key) {
      return this.at($key);
    }, "key");

    spec.composeEvents = fn(function($event) {
      return this.copy().putAll($event);
    }, "event");

    spec.$pop = function() {
      if (envStack.length) {
        main.$currentEnv = envStack.pop();
      }
      return this;
    };

    spec.$push = fn(function($envir) {
      envStack.push(main.$currentEnv);
      main.$currentEnv = $envir;
      return this;
    }, "envir");

    spec.pop = function() {
      return this.class().pop();
    };

    spec.push = function() {
      return this.class().push(this);
    };

    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });

});

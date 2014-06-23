SCScript.install(function(sc) {
  "use strict";

  require("./Dictionary");

  var $ = sc.lang.$;
  var $nil = $.nil;
  var main = sc.lang.main;

  sc.lang.klass.refine("Environment", function(builder) {
    var envStack = [];

    builder.addClassMethod("make",function($function) {
      return this.new().make($function);
    });

    builder.addClassMethod("use", function($function) {
      return this.new().use($function);
    });

    builder.addMethod("make", {
      args: "function"
    }, function($function) {
      var $saveEnvir;

      $saveEnvir = main.$currentEnv;
      main.$currentEnv = this;
      try {
        $function.value(this);
      } catch (e) {}
      main.$currentEnv = $saveEnvir;

      return this;
    });

    builder.addMethod("use", {
      args: "function"
    }, function($function) {
      var $result, $saveEnvir;

      $saveEnvir = main.$currentEnv;
      main.$currentEnv = this;
      try {
        $result = $function.value(this);
      } catch (e) {}
      main.$currentEnv = $saveEnvir;

      return $result || /* istanbul ignore next */ $nil;
    });

    builder.addMethod("eventAt", {
      args: "key"
    }, function($key) {
      return this.at($key);
    });

    builder.addMethod("composeEvents", {
      args: "event"
    }, function($event) {
      return this.copy().putAll($event);
    });

    builder.addClassMethod("pop", function() {
      if (envStack.length) {
        main.$currentEnv = envStack.pop();
      }
      return this;
    });

    builder.addClassMethod("push", {
      args: "envir"
    }, function($envir) {
      envStack.push(main.$currentEnv);
      main.$currentEnv = $envir;
      return this;
    });

    builder.addMethod("pop", function() {
      return this.class().pop();
    });

    builder.addMethod("push", function() {
      return this.class().push(this);
    });
    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });
});

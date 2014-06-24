SCScript.install(function(sc) {
  "use strict";

  require("./Dictionary");

  var $ = sc.lang.$;
  var $nil = $.nil;

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

      $saveEnvir = sc.lang.main.getCurrentEnvir();
      sc.lang.main.setCurrentEnvir(this);
      try {
        $function.value(this);
      } catch (e) {}
      sc.lang.main.setCurrentEnvir($saveEnvir);

      return this;
    });

    builder.addMethod("use", {
      args: "function"
    }, function($function) {
      var $result, $saveEnvir;

      $saveEnvir = sc.lang.main.getCurrentEnvir();
      sc.lang.main.setCurrentEnvir(this);
      try {
        $result = $function.value(this);
      } catch (e) {}
      sc.lang.main.setCurrentEnvir($saveEnvir);

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
        sc.lang.main.setCurrentEnvir(envStack.pop());
      }
      return this;
    });

    builder.addClassMethod("push", {
      args: "envir"
    }, function($envir) {
      envStack.push(sc.lang.main.getCurrentEnvir());
      sc.lang.main.setCurrentEnvir($envir);
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

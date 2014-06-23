SCScript.install(function(sc) {
  "use strict";

  require("./AbstractFunction");

  var $ = sc.lang.$;
  var $nil = $.nil;
  var iterator = sc.lang.iterator;
  var bytecode = sc.lang.bytecode;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  sc.lang.klass.refine("Function", function(builder, _) {
    // TODO: implements def
    builder.addClassMethod("new", function() {
      throw new Error("Function.new is illegal, should use literal.");
    });

    builder.addMethod("isFunction", sc.TRUE);

    // TODO: implements isClosed

    builder.addMethod("archiveAsCompileString", sc.TRUE);
    builder.addMethod("archiveAsObject", sc.TRUE);

    // TODO: implements checkCanArchive

    builder.addMethod("shallowCopy");

    var function$run = function(bytecode, args) {
      return bytecode.reset().run(args);
    };

    builder.addMethod("choose", function() {
      return this.value();
    });

    builder.addMethod("update", function() {
      return function$run(this._bytecode, arguments);
    });

    builder.addMethod("value", function() {
      return function$run(this._bytecode, arguments);
    });

    builder.addMethod("valueArray", function($args) {
      return function$run(this._bytecode, $args.asArray()._);
    });

    var envir = function(func, args) {
      return func._argNames.map(function(name, i) {
        var val;
        if (this[i]) {
          return this[i];
        }
        val = $.Environment(name);
        if (val !== $nil) {
          return val;
        }
      }, args);
    };

    builder.addMethod("valueEnvir", function() {
      return function$run(this._bytecode, envir(this._bytecode, arguments));
    });

    builder.addMethod("valueArrayEnvir", function($args) {
      return function$run(this._bytecode, envir(this._bytecode, $args.asArray()._));
    });

    builder.addMethod("functionPerformList", {
      args: "selector; arglist"
    }, function($selector, $arglist) {
      return this[$selector.__str__()].apply(this, $arglist.asArray()._);
    });

    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs

    builder.addMethod("loop", function() {
      iterator.execute(
        iterator.function$loop(),
        this
      );
      return this;
    });

    // TODO: implements block

    builder.addMethod("asRoutine", function() {
      return SCRoutine.new(this);
    });

    builder.addMethod("dup", {
      args: "n=2"
    }, function($n) {
      return SCArray.fill($n, this);
    });

    // TODO: implements sum
    // TODO: implements defer
    // TODO: implements thunk
    // TODO: implements transformEvent
    // TODO: implements set
    // TODO: implements get
    // TODO: implements fork
    // TODO: implements forkIfNeeded
    // TODO: implements awake
    // TODO: implements cmdPeriod
    // TODO: implements bench

    builder.addMethod("protect", function($handler) {
      var result;
      var current = bytecode.current;

      try {
        result = this.value();
      } catch (e) {
        result = null;
      }
      bytecode.current = current;

      $handler.value();

      return result || $nil;
    });

    // TODO: implements try
    // TODO: implements prTry

    // TODO: implements handleError

    builder.addMethod("case", function() {
      var args, i, imax;

      args = _.toArray(arguments);
      args.unshift(this);

      for (i = 0, imax = args.length >> 1; i < imax; ++i) {
        if (args[i * 2].value().__bool__()) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    });

    builder.addMethod("r", function() {
      return SCRoutine.new(this);
    });

    builder.addMethod("p", function() {
      return $("Prout").new(this);
    });

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    builder.addMethod("flop", function() {
      var $this = this;

      return $.Func(function() {
        var $$args = $.Array(_.toArray(arguments));
        return $$args.flop().collect($.Func(function($_) {
          return $this.valueArray($_);
        }));
      });
    });

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    builder.addMethod("while", {
      args: "body"
    }, function($body) {
      iterator.execute(
        iterator.function$while(this),
        $body
      );
      return this;
    });
  });
});

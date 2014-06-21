SCScript.install(function(sc) {
  "use strict";

  require("./AbstractFunction");

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;
  var bytecode = sc.lang.bytecode;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  sc.lang.klass.refine("Function", function(spec, utils) {
    var $nil = utils.$nil;

    // TODO: implements def

    spec.$new = function() {
      throw new Error("Function.new is illegal, should use literal.");
    };

    spec.isFunction = utils.alwaysReturn$true;

    // TODO: implements isClosed

    spec.archiveAsCompileString = utils.alwaysReturn$true;
    spec.archiveAsObject = utils.alwaysReturn$true;

    // TODO: implements checkCanArchive

    spec.shallowCopy = utils.nop;

    var function$run = function(bytecode, args) {
      return bytecode.reset().run(args);
    };

    spec.choose = function() {
      return this.value();
    };

    spec.update = function() {
      return function$run(this._bytecode, arguments);
    };

    spec.value = function() {
      return function$run(this._bytecode, arguments);
    };

    spec.valueArray = function($args) {
      return function$run(this._bytecode, $args.asArray()._);
    };

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

    spec.valueEnvir = function() {
      return function$run(this._bytecode, envir(this._bytecode, arguments));
    };

    spec.valueArrayEnvir = function($args) {
      return function$run(this._bytecode, envir(this._bytecode, $args.asArray()._));
    };

    spec.functionPerformList = fn(function($selector, $arglist) {
      return this[$selector.__str__()].apply(this, $arglist.asArray()._);
    }, "selector; arglist");

    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs

    spec.loop = function() {
      iterator.execute(
        iterator.function$loop(),
        this
      );
      return this;
    };

    // TODO: implements block

    spec.asRoutine = function() {
      return SCRoutine.new(this);
    };

    spec.dup = fn(function($n) {
      return SCArray.fill($n, this);
    }, "n=2");

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

    spec.protect = function($handler) {
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
    };

    // TODO: implements try
    // TODO: implements prTry

    // TODO: implements handleError

    spec.case = function() {
      var args, i, imax;

      args = slice.call(arguments);
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
    };

    spec.r = function() {
      return SCRoutine.new(this);
    };

    spec.p = function() {
      return $("Prout").new(this);
    };

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    spec.flop = function() {
      var $this = this;

      return $.Func(function() {
        var $$args = $.Array(slice.call(arguments));
        return $$args.flop().collect($.Func(function($_) {
          return $this.valueArray($_);
        }));
      });
    };

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    spec.while = fn(function($body) {
      iterator.execute(
        iterator.function$while(this),
        $body
      );
      return this;
    }, "body");
  });
});

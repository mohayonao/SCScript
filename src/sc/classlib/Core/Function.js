SCScript.install(function(sc) {
  "use strict";

  require("./AbstractFunction");

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Function", function(spec, utils) {
    var $nil = utils.$nil;
    var SCArray = $("Array");

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

    spec.choose = function() {
      return this.value();
    };

    spec.update = function() {
      return this._.resume(arguments);
    };

    spec.value = function() {
      return this._.resume(arguments);
    };

    spec.valueArray = function($args) {
      return this._.resume($args.asArray()._);
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
      var args = envir(this._, arguments);
      return this._.resume(args);
    };

    spec.valueArrayEnvir = function($args) {
      var args = envir(this._, $args.asArray()._);
      return this._.resume(args);
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
    // TODO: implements loop
    // TODO: implements block

    spec.asRoutine = function() {
      return $("Routine").new(this);
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
      var $result;

      try {
        $result = this.value();
      } catch (e) {
        $result = null;
      } finally {
        $handler.value();
      }

      return $result || $nil;
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
      return $("Routine").new(this);
    };

    spec.p = function() {
      return $("Prout").new(this);
    };

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    spec.flop = function() {
      var $this = this;

      return $.Function(function() {
        return [ function() {
          var $$args = $.Array(slice.call(arguments));
          return $$args.flop().collect($.Function(function() {
            return [ function($_) {
              return $this.valueArray($_);
            } ];
          }));
        } ];
      });
    };

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    spec.while = fn(function($body) {
      sc.lang.iterator.execute(
        sc.lang.iterator.function$while(this),
        $body
      );
      return this;
    }, "body");

    spec.state = function() {
      return $.Integer(this._.state());
    };
  });

});

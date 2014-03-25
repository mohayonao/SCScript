(function(sc) {
  "use strict";

  require("./AbstractFunction");

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Function", function(spec, utils) {
    var bool = utils.bool;
    var SCArray = $SC.Class("Array");

    // TODO: implements def

    spec.$new = function() {
      throw new Error("Function.new is illegal, should use literal.");
    };

    spec.isFunction = utils.alwaysReturn$True;

    // TODO: implements isClosed

    spec.archiveAsCompileString = utils.alwaysReturn$True;
    spec.archiveAsObject = utils.alwaysReturn$True;

    // TODO: implements checkCanArchive

    spec.shallowCopy = utils.nop;

    spec.choose = function() {
      return this.value();
    };

    spec.update = function() {
      return this._.apply(this, arguments);
    };

    spec.value = function() {
      return this._.apply(this, arguments);
    };

    spec.valueArray = function($args) {
      $args = utils.defaultValue$Nil($args);
      return this._.apply(this, $args.asArray()._);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir
    // TODO: implements functionPerformList
    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs
    // TODO: implements loop
    // TODO: implements block

    spec.asRoutine = function() {
      return $SC.Class("Routine").new(this);
    };

    spec.dup = function($n) {
      $n = utils.defaultValue$Integer($n, 2);
      return SCArray.fill($n, this);
    };

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
    // TODO: implements protect
    // TODO: implements try
    // TODO: implements prTry
    // TODO: implements handleError

    spec.case = function() {
      var args, i, imax;

      args = slice.call(arguments);
      args.unshift(this);

      for (i = 0, imax = args.length >> 1; i < imax; ++i) {
        if (bool(args[i * 2].value())) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return utils.nilInstance;
    };

    spec.r = function() {
      return $SC.Class("Routine").new(this);
    };

    spec.p = function() {
      return $SC.Class("Prout").new(this);
    };

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    spec.flop = function() {
      var $this = this;
      // if(def.argNames.isNil) { ^this };
      return $SC.Function(function() {
        var $$args = $SC.Array(slice.call(arguments));
        return $$args.flop().collect($SC.Function(function($_) {
          return $this.valueArray($_);
        }));
      });
    };

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    spec.while = function($body) {
      $body = utils.defaultValue$Nil($body);

      sc.lang.iterator.execute(
        sc.lang.iterator.function$while(this),
        $body
      );

      return this;
    };
  });

})(sc);

SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $     = sc.lang.$;
  var fn    = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.define("Pattern : AbstractFunction", function(spec, utils) {
    var $false = utils.$false;

    spec.constructor = function SCPattern() {
      this.__super__("AbstractFunction");
    };

    spec["++"] = function($aPattern) {
      return $("Pseq").new($.Array([ this, $aPattern ]));
    };

    spec["<>"] = function($aPattern) {
      return $("Pchain").new(this, $aPattern);
    };

    spec.play = fn(function($clock, $protoEvent, $quant) {
      return this.asEventStreamPlayer($protoEvent).play($clock, $false, $quant);
    }, "clock; protoEvent; quant");

    spec.asStream = function() {
      var $this = this;
      return $("Routine").new($.Function(function() {
        return [ function($inval) {
          return $this.embedInStream($inval);
        } ];
      }));
    };

    spec.iter = function() {
      return this.asStream();
    };

    spec.streamArg = function() {
      return this.asStream();
    };

    spec.asEventStreamPlayer = fn(function($protoEvent) {
      return $("EventStreamPlayer").new(this.asStream(), $protoEvent);
    }, "protoEvent");

    spec.embedInStream = fn(function($inval) {
      return this.asStream().embedInStream($inval);
    }, "inval");

    spec.do = function($function) {
      return this.asStream().do($function);
    };

    spec.collect = function($function) {
      return $("Pcollect").new($function, this);
    };

    spec.select = function($function) {
      return $("Pselect").new($function, this);
    };

    spec.reject = function($function) {
      return $("Preject").new($function, this);
    };

    spec.composeUnaryOp = function($operator) {
      return $("Punop").new($operator, this);
    };

    spec.composeBinaryOp = function($operator, $pattern, $adverb) {
      return $("Pbinop").new($operator, this, $pattern, $adverb);
    };

    spec.reverseComposeBinaryOp = function($operator, $pattern, $adverb) {
      return $("Pbinop").new($operator, $pattern, this, $adverb);
    };

    spec.composeNAryOp = function($selector, $argList) {
      return $("Pnaryop").new($selector, this, $argList);
    };

    spec.mtranspose = function($n) {
      return $("Paddp").new($.Symbol("mtranspose"), $n, this);
    };

    spec.ctranspose = function($n) {
      return $("Paddp").new($.Symbol("ctranspose"), $n, this);
    };

    spec.gtranspose = function($n) {
      return $("Paddp").new($.Symbol("gtranspose"), $n, this);
    };

    spec.detune = function($n) {
      return $("Paddp").new($.Symbol("detune"), $n, this);
    };

    spec.scaleDur = function($x) {
      return $("Pmulp").new($.Symbol("dur"), $x, this);
    };

    spec.addDur = function($x) {
      return $("Paddp").new($.Symbol("dur"), $x, this);
    };

    spec.stretch = function($x) {
      return $("Pmulp").new($.Symbol("stretch"), $x, this);
    };

    spec.lag = function($t) {
      return $("Plag").new($t, this);
    };

    spec.legato = function($x) {
      return $("Pmulp").new($.Symbol("legato"), $x, this);
    };

    spec.db = function($db) {
      return $("Paddp").new($.Symbol("db"), $db, this);
    };

    spec.clump = function($n) {
      return $("Pclump").new($n, this);
    };

    spec.flatten = function($n) {
      return $("Pflatten").new($n, this);
    };

    spec.repeat = function($n) {
      return $("Pn").new(this, $n);
    };

    spec.keep = function($n) {
      return $("Pfin").new($n, this);
    };

    spec.drop = function($n) {
      return $("Pdrop").new($n, this);
    };

    spec.stutter = function($n) {
      return $("Pstutter").new($n, this);
    };

    spec.finDur = function($dur, $tolerance ) {
      return $("Pfindur").new($dur, this, $tolerance);
    };

    spec.fin = function($n) {
      return $("Pfin").new($n, this);
    };

    spec.trace = function($key, $printStream, $prefix) {
      return $("Ptrace").new(this, $key, $printStream, $prefix);
    };

    spec.differentiate = function() {
      return $("Pdiff").new(this);
    };
    // TODO: implements integrate
    // TODO: implements record
  });

  klass.define("Pseries : Pattern", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCPseries() {
      this.__super__("Pattern");
    };
    utils.setProperty(spec, "<>", "start");
    utils.setProperty(spec, "<>", "step");
    utils.setProperty(spec, "<>", "length");

    spec.$new = fn(function($start, $step, $length) {
      return utils.newCopyArgs(this, {
        start: $start,
        step: $step,
        length: $length
      });
    }, "start=0; step=1; length=inf");

    // TODO: implements storeArgs

    spec.embedInStream = fn(function($inval) {
      var counter, length;
      var $cur, $stepStr;

      counter = 0;
      length  = this._$length.__int__();

      $cur     = this._$start;
      $stepStr = this._$step.asStream();

      $.Function(function() {
        return [ function() {
          return $.Boolean(counter < length);
        } ];
      }).while($.Function(function() {
        var $stepVal;
        return [
          function() {
            $stepVal = $stepStr.next($inval);

            if ($stepVal === $nil) {
              this.break();
            }
          },
          function() {
            var $outval;

            $outval = $cur;
            $cur = $cur.$("+", [ $stepVal ]);
            counter += 1;
            $inval   = $outval.yield();
            return $inval;
          },
          $.NOP
        ];
      }));

      return $inval;
    }, "inval");
  });

  klass.define("Pgeom : Pattern", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCPgeom() {
      this.__super__("Pattern");
    };
    utils.setProperty(spec, "<>", "start");
    utils.setProperty(spec, "<>", "grow");
    utils.setProperty(spec, "<>", "length");

    spec.$new = fn(function($start, $grow, $length) {
      return utils.newCopyArgs(this, {
        start: $start,
        grow: $grow,
        length: $length
      });
    }, "start=0; grow=1; length=inf");

    // TODO: implements storeArgs

    spec.embedInStream = fn(function($inval) {
      var counter, length;
      var $cur, $growStr;

      counter = 0;
      length  = this._$length.__int__();

      $cur     = this._$start;
      $growStr = this._$grow.asStream();

      $.Function(function() {
        return [ function() {
          return $.Boolean(counter < length);
        } ];
      }).while($.Function(function() {
        var $growVal;
        return [
          function() {
            $growVal = $growStr.next($inval);

            if ($growVal === $nil) {
              this.break();
            }
          },
          function() {
            var $outval;

            $outval = $cur;
            $cur = $cur.$("*", [ $growVal ]);
            counter += 1;
            $inval   = $outval.yield();
            return $inval;
          },
          $.NOP
        ];
      }));

      return $inval;
    }, "inval");
  });
});

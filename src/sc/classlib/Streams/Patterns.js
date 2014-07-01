SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $ = sc.lang.$;
  var $false = $.false;
  var SCRoutine = $("Routine");

  sc.lang.klass.define("Pattern : AbstractFunction", function(builder) {
    builder.addMethod("++", function($aPattern) {
      return $("Pseq").new($.Array([ this, $aPattern ]));
    });

    builder.addMethod("<>", function($aPattern) {
      return $("Pchain").new(this, $aPattern);
    });

    builder.addMethod("play", {
      args: "clock; protoEvent; quant"
    }, function($clock, $protoEvent, $quant) {
      return this.asEventStreamPlayer($protoEvent).play($clock, $false, $quant);
    });

    builder.addMethod("asStream", function() {
      var $this = this;
      return SCRoutine.new($.Func(function($inval) {
        return $this.embedInStream($inval);
      }));
    });

    builder.addMethod("iter", function() {
      return this.asStream();
    });

    builder.addMethod("streamArg", function() {
      return this.asStream();
    });

    builder.addMethod("asEventStreamPlayer", {
      args: "protoEvent"
    }, function($protoEvent) {
      return $("EventStreamPlayer").new(this.asStream(), $protoEvent);
    });

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      return this.asStream().embedInStream($inval);
    });

    builder.addMethod("do", function($function) {
      return this.asStream().do($function);
    });

    builder.addMethod("collect", function($function) {
      return $("Pcollect").new($function, this);
    });

    builder.addMethod("select", function($function) {
      return $("Pselect").new($function, this);
    });

    builder.addMethod("reject", function($function) {
      return $("Preject").new($function, this);
    });

    builder.addMethod("composeUnaryOp", function($operator) {
      return $("Punop").new($operator, this);
    });

    builder.addMethod("composeBinaryOp", function($operator, $pattern, $adverb) {
      return $("Pbinop").new($operator, this, $pattern, $adverb);
    });

    builder.addMethod("reverseComposeBinaryOp", function($operator, $pattern, $adverb) {
      return $("Pbinop").new($operator, $pattern, this, $adverb);
    });

    builder.addMethod("composeNAryOp", function($selector, $argList) {
      return $("Pnaryop").new($selector, this, $argList);
    });

    builder.addMethod("mtranspose", function($n) {
      return $("Paddp").new($.Symbol("mtranspose"), $n, this);
    });

    builder.addMethod("ctranspose", function($n) {
      return $("Paddp").new($.Symbol("ctranspose"), $n, this);
    });

    builder.addMethod("gtranspose", function($n) {
      return $("Paddp").new($.Symbol("gtranspose"), $n, this);
    });

    builder.addMethod("detune", function($n) {
      return $("Paddp").new($.Symbol("detune"), $n, this);
    });

    builder.addMethod("scaleDur", function($x) {
      return $("Pmulp").new($.Symbol("dur"), $x, this);
    });

    builder.addMethod("addDur", function($x) {
      return $("Paddp").new($.Symbol("dur"), $x, this);
    });

    builder.addMethod("stretch", function($x) {
      return $("Pmulp").new($.Symbol("stretch"), $x, this);
    });

    builder.addMethod("lag", function($t) {
      return $("Plag").new($t, this);
    });

    builder.addMethod("legato", function($x) {
      return $("Pmulp").new($.Symbol("legato"), $x, this);
    });

    builder.addMethod("db", function($db) {
      return $("Paddp").new($.Symbol("db"), $db, this);
    });

    builder.addMethod("clump", function($n) {
      return $("Pclump").new($n, this);
    });

    builder.addMethod("flatten", function($n) {
      return $("Pflatten").new($n, this);
    });

    builder.addMethod("repeat", function($n) {
      return $("Pn").new(this, $n);
    });

    builder.addMethod("keep", function($n) {
      return $("Pfin").new($n, this);
    });

    builder.addMethod("drop", function($n) {
      return $("Pdrop").new($n, this);
    });

    builder.addMethod("stutter", function($n) {
      return $("Pstutter").new($n, this);
    });

    builder.addMethod("finDur", function($dur, $tolerance ) {
      return $("Pfindur").new($dur, this, $tolerance);
    });

    builder.addMethod("fin", function($n) {
      return $("Pfin").new($n, this);
    });

    builder.addMethod("trace", function($key, $printStream, $prefix) {
      return $("Ptrace").new(this, $key, $printStream, $prefix);
    });

    builder.addMethod("differentiate", function() {
      return $("Pdiff").new(this);
    });
    // TODO: implements integrate
    // TODO: implements record
  });

  sc.lang.klass.define("Pseries : Pattern", function(builder, _) {
    var $nil = $.nil;

    builder.addProperty("<>", "start");
    builder.addProperty("<>", "step");
    builder.addProperty("<>", "length");

    builder.addClassMethod("new", {
      args: "start=0; step=1; length=inf"
    }, function($start, $step, $length) {
      return _.newCopyArgs(this, {
        start: $start,
        step: $step,
        length: $length
      });
    });

    // TODO: implements storeArgs

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      var counter, length;
      var $cur, $stepStr;

      counter = 0;
      length  = this._$length.__int__();

      $cur     = this._$start;
      $stepStr = this._$step.asStream();

      $.Func(function() {
        return $.Boolean(counter < length);
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
    });
  });

  sc.lang.klass.define("Pgeom : Pattern", function(builder, _) {
    var $nil = $.nil;

    builder.addProperty("<>", "start");
    builder.addProperty("<>", "grow");
    builder.addProperty("<>", "length");

    builder.addClassMethod("new", {
      args: "start=0; grow=1; length=inf"
    }, function($start, $grow, $length) {
      return _.newCopyArgs(this, {
        start: $start,
        grow: $grow,
        length: $length
      });
    });

    // TODO: implements storeArgs

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      var counter, length;
      var $cur, $growStr;

      counter = 0;
      length  = this._$length.__int__();

      $cur     = this._$start;
      $growStr = this._$grow.asStream();

      $.Func(function() {
        return $.Boolean(counter < length);
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
    });
  });
});

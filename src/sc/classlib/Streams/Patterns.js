(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $     = sc.lang.$;
  var fn    = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.define("Pattern : AbstractFunction", function(spec) {
    spec.constructor = function SCPattern() {
      this.__super__("AbstractFunction");
    };

    // TODO: implements ++
    // TODO: implements <>
    // TODO: implements play

    spec.asStream = function() {
      var $this = this;
      return $("Routine").new($.Function(function() {
        return [ function($inval) {
          return $this.embedInStream($inval);
        } ];
      }));
    };

    // TODO: implements iter
    // TODO: implements streamArg
    // TODO: implements asEventStreamPlayer
    // TODO: implements embedInStream
    // TODO: implements do
    // TODO: implements collect
    // TODO: implements select
    // TODO: implements reject
    // TODO: implements composeUnaryOp
    // TODO: implements composeBinaryOp
    // TODO: implements reverseComposeBinaryOp
    // TODO: implements composeNAryOp
    // TODO: implements mtranspose
    // TODO: implements ctranspose
    // TODO: implements gtranspose
    // TODO: implements detune
    // TODO: implements scaleDur
    // TODO: implements addDur
    // TODO: implements stretch
    // TODO: implements lag
    // TODO: implements legato
    // TODO: implements db
    // TODO: implements clump
    // TODO: implements flatten
    // TODO: implements repeat
    // TODO: implements keep
    // TODO: implements drop
    // TODO: implements stutter
    // TODO: implements finDur
    // TODO: implements fin
    // TODO: implements trace
    // TODO: implements differentiate
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
      return this._newCopyArgs({
        start : $start,
        step  : $step,
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
          }
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
      return this._newCopyArgs({
        start : $start,
        grow  : $grow,
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
          }
        ];
      }));

      return $inval;
    }, "inval");
  });

})(sc);

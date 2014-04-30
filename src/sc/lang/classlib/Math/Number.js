(function(sc) {
  "use strict";

  require("./Magnitude");

  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  sc.lang.klass.refine("Number", function(spec, utils) {
    spec.isNumber = utils.alwaysReturn$true;

    spec["+"] = function() {
      return this._subclassResponsibility("+");
    };

    spec["-"] = function() {
      return this._subclassResponsibility("-");
    };

    spec["*"] = function() {
      return this._subclassResponsibility("*");
    };

    spec["/"] = function() {
      return this._subclassResponsibility("/");
    };

    spec.mod = function() {
      return this._subclassResponsibility("mod");
    };

    spec.div = function() {
      return this._subclassResponsibility("div");
    };

    spec.pow = function() {
      return this._subclassResponsibility("pow");
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      var $this = this;
      $aSeqColl = utils.defaultValue$Nil($aSeqColl);

      return $aSeqColl.collect($SC.Function(function($item) {
        return $item.perform($aSelector, $this, $adverb);
      }));
    };

    // TODO: implements performBinaryOpOnPoint

    spec.rho = utils.nop;

    spec.theta = function() {
      return $SC.Float(0.0);
    };

    spec.real = utils.nop;

    spec.imag = function() {
      return $SC.Float(0.0);
    };

    // TODO: implements @
    // TODO: implements complex
    // TODO: implements polar

    spec.for = function($endValue, $function) {
      iterator.execute(
        iterator.number$for(this, $endValue),
        $function
      );
      return this;
    };

    spec.forBy = function($endValue, $stepValue, $function) {
      iterator.execute(
        iterator.number$forBy(this, $endValue, $stepValue),
        $function
      );
      return this;
    };

    spec.forSeries = function($second, $last, $function) {
      iterator.execute(
        iterator.number$forSeries(this, $second, $last),
        $function
      );
      return this;
    };
  });

})(sc);

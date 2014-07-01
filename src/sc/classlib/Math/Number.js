SCScript.install(function(sc) {
  "use strict";

  require("./Magnitude");

  var $ = sc.lang.$;

  sc.lang.klass.refine("Number", function(builder) {
    builder.addMethod("isNumber", sc.TRUE);

    builder.subclassResponsibility("+");
    builder.subclassResponsibility("-");
    builder.subclassResponsibility("*");
    builder.subclassResponsibility("/");
    builder.subclassResponsibility("mod");
    builder.subclassResponsibility("div");
    builder.subclassResponsibility("pow");

    builder.addMethod("performBinaryOpOnSeqColl", function($aSelector, $aSeqColl, $adverb) {
      var $this = this;

      return $aSeqColl.$("collect", [ $.Func(function($item) {
        return $item.perform($aSelector, $this, $adverb);
      }) ]);
    });

    // TODO: implements performBinaryOpOnPoint

    builder.addMethod("rho");

    builder.addMethod("theta", function() {
      return $.Float(0.0);
    });

    builder.addMethod("real");

    builder.addMethod("imag", function() {
      return $.Float(0.0);
    });

    // TODO: implements @
    // TODO: implements complex
    // TODO: implements polar

    builder.addMethod("for", {
      args: "endValue; function"
    }, function($endValue, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.number$for(this, $endValue),
        $function
      );
      return this;
    });

    builder.addMethod("forBy", {
      args: "endValue; stepValue; function"
    }, function($endValue, $stepValue, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.number$forBy(this, $endValue, $stepValue),
        $function
      );
      return this;
    });

    builder.addMethod("forSeries", {
      args: "second; last; function"
    }, function($second, $last, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.number$forSeries(this, $second, $last),
        $function
      );
      return this;
    });
  });
});

SCScript.install(function(sc) {
  "use strict";

  require("../Core/Object");

  var $ = sc.lang.$;

  sc.lang.klass.refine("Magnitude", function(builder) {
    builder.addMethod("==", function($aMagnitude) {
      return $.Boolean(this.valueOf() === $aMagnitude.valueOf());
    });

    builder.addMethod("!=", function($aMagnitude) {
      return $.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    });

    builder.addMethod("<", function($aMagnitude) {
      return $.Boolean(this < $aMagnitude);
    });

    builder.addMethod(">", function($aMagnitude) {
      return $.Boolean(this > $aMagnitude);
    });

    builder.addMethod("<=", function($aMagnitude) {
      return $.Boolean(this <= $aMagnitude);
    });

    builder.addMethod(">=", function($aMagnitude) {
      return $.Boolean(this >= $aMagnitude);
    });

    builder.addMethod("exclusivelyBetween", {
      args: "lo; hi"
    }, function($lo, $hi) {
      var value = this.valueOf(), lo = $lo.valueOf(), hi = $hi.valueOf();
      return $.Boolean(lo < value && value < hi);
    });

    builder.addMethod("inclusivelyBetween", {
      args: "lo; hi"
    }, function($lo, $hi) {
      var value = this.valueOf(), lo = $lo.valueOf(), hi = $hi.valueOf();
      return $.Boolean(lo <= value && value <= hi);
    });

    builder.addMethod("min", {
      args: "aMagnitude"
    }, function($aMagnitude) {
      return this.valueOf() <= $aMagnitude.valueOf() ? this : $aMagnitude;
    });

    builder.addMethod("max", {
      args: "aMagnitude"
    }, function($aMagnitude) {
      return this.valueOf() >= $aMagnitude.valueOf() ? this : $aMagnitude;
    });

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
      var value = this.valueOf();
      return value <= $lo.valueOf() ? $lo : value >= $hi.valueOf() ? $hi : this;
    });
  });
});

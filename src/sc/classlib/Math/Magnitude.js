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
      return $.Boolean($lo < this && this < $hi);
    });

    builder.addMethod("inclusivelyBetween", {
      args: "lo; hi"
    }, function($lo, $hi) {
      return $.Boolean($lo <= this && this <= $hi);
    });

    builder.addMethod("min", {
      args: "aMagnitude"
    }, function($aMagnitude) {
      return this <= $aMagnitude ? this : $aMagnitude;
    });

    builder.addMethod("max", {
      args: "aMagnitude"
    }, function($aMagnitude) {
      return this >= $aMagnitude ? this : $aMagnitude;
    });

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
      return this <= $lo ? $lo : this >= $hi ? $hi : this;
    });
  });
});

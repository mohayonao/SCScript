SCScript.install(function(sc) {
  "use strict";

  require("../Core/Object");

  var $ = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Magnitude", function(spec) {
    spec["=="] = function($aMagnitude) {
      return $.Boolean(this.valueOf() === $aMagnitude.valueOf());
    };

    spec["!="] = function($aMagnitude) {
      return $.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    };

    spec["<"] = function($aMagnitude) {
      return $.Boolean(this < $aMagnitude);
    };

    spec[">"] = function($aMagnitude) {
      return $.Boolean(this > $aMagnitude);
    };

    spec["<="] = function($aMagnitude) {
      return $.Boolean(this <= $aMagnitude);
    };

    spec[">="] = function($aMagnitude) {
      return $.Boolean(this >= $aMagnitude);
    };

    spec.exclusivelyBetween = fn(function($lo, $hi) {
      return $.Boolean($lo < this && this < $hi);
    }, "lo; hi");

    spec.inclusivelyBetween = fn(function($lo, $hi) {
      return $.Boolean($lo <= this && this <= $hi);
    }, "lo; hi");

    spec.min = fn(function($aMagnitude) {
      return this <= $aMagnitude ? this : $aMagnitude;
    }, "aMagnitude");

    spec.max = fn(function($aMagnitude) {
      return this >= $aMagnitude ? this : $aMagnitude;
    }, "aMagnitude");

    spec.clip = fn(function($lo, $hi) {
      return this <= $lo ? $lo : this >= $hi ? $hi : this;
    }, "lo; hi");
  });
});

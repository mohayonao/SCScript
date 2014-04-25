(function(sc) {
  "use strict";

  require("../Core/Object");

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Magnitude", function(spec, utils) {
    spec["=="] = function($aMagnitude) {
      return $SC.Boolean(this.valueOf() === $aMagnitude.valueOf());
    };

    spec["!="] = function($aMagnitude) {
      return $SC.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    };

    spec.hash = function() {
      return this._subclassResponsibility("hash");
    };

    spec["<"] = function($aMagnitude) {
      return $SC.Boolean(this < $aMagnitude);
    };

    spec[">"] = function($aMagnitude) {
      return $SC.Boolean(this > $aMagnitude);
    };

    spec["<="] = function($aMagnitude) {
      return $SC.Boolean(this <= $aMagnitude);
    };

    spec[">="] = function($aMagnitude) {
      return $SC.Boolean(this >= $aMagnitude);
    };

    spec.exclusivelyBetween = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);
      return $SC.Boolean($lo < this && this < $hi);
    };

    spec.inclusivelyBetween = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);
      return $SC.Boolean($lo <= this && this <= $hi);
    };

    spec.min = function($aMagnitude) {
      $aMagnitude = utils.defaultValue$Nil($aMagnitude);
      return this <= $aMagnitude ? this : $aMagnitude;
    };

    spec.max = function($aMagnitude) {
      $aMagnitude = utils.defaultValue$Nil($aMagnitude);
      return this >= $aMagnitude ? this : $aMagnitude;
    };

    spec.clip = function($lo, $hi) {
      $lo = utils.defaultValue$Nil($lo);
      $hi = utils.defaultValue$Nil($hi);
      return this <= $lo ? $lo : this >= $hi ? $hi : this;
    };
  });

})(sc);

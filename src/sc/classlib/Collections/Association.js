SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  sc.lang.klass.define("Association : Magnitude", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

    spec.constructor = function SCAssociation() {
      this.__super__("Magnitude");
    };

    spec.valueOf = function() {
      return this._$key.valueOf();
    };

    spec.key = function() {
      return this._$key;
    };

    spec.key_ = function($value) {
      this._$key = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.value = function() {
      return this._$value;
    };

    spec.value_ = function($value) {
      this._$value = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.$new = function($key, $value) {
      return this._newCopyArgs({
        key: $key,
        value: $value
      });
    };

    spec["=="] = function($anAssociation) {
      if ($anAssociation.key) {
        return this._$key ["=="] ($anAssociation.$("key"));
      }
      return $false;
    };

    spec.hash = function() {
      return this._$key.hash();
    };

    spec["<"] = function($anAssociation) {
      return this._$key.$("<", [ $anAssociation.$("key") ]);
    };

    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements embedInStream
    // TODO: implements transformEvent

  });

});

SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $SC = sc.lang.$SC;

  function SCAssociation(args) {
    this.__initializeWith__("Magnitude");
    this._key   = args.shift() || $SC.Nil();
    this._value = args.shift() || $SC.Nil();
  }

  sc.lang.klass.define(SCAssociation, "Association : Magnitude", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

    spec.valueOf = function() {
      return this._key.valueOf();
    };

    spec.key = function() {
      return this._key;
    };

    spec.key_ = function($value) {
      this._key = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.value = function() {
      return this._value;
    };

    spec.value_ = function($value) {
      this._value = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec["=="] = function($anAssociation) {
      if ($anAssociation.key) {
        return this._key ["=="] ($anAssociation.key());
      }
      return $false;
    };

    spec.hash = function() {
      return this._key.hash();
    };

    spec["<"] = function($anAssociation) {
      return this._key ["<"] ($anAssociation.key());
    };

    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements embedInStream
    // TODO: implements transformEvent

  });

});

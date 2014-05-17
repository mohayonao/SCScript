SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $SC = sc.lang.$SC;

  function SCAssociation(args) {
    this.__initializeWith__("Magnitude");
    this._$key   = args.shift() || $SC.Nil();
    this._$value = args.shift() || $SC.Nil();
  }

  sc.lang.klass.define(SCAssociation, "Association : Magnitude", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

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

    spec["=="] = function($anAssociation) {
      if ($anAssociation.key) {
        return this._$key ["=="] ($anAssociation.key());
      }
      return $false;
    };

    spec.hash = function() {
      return this._$key.hash();
    };

    spec["<"] = function($anAssociation) {
      return this._$key ["<"] ($anAssociation.key());
    };

    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements embedInStream
    // TODO: implements transformEvent

  });

});

SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  sc.lang.klass.define("Association : Magnitude", function(spec, utils) {
    var $false = utils.$false;

    utils.setProperty(spec, "<>", "key");
    utils.setProperty(spec, "<>", "value");

    spec.valueOf = function() {
      return this._$key.valueOf();
    };

    spec.$new = function($key, $value) {
      return utils.newCopyArgs(this, {
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

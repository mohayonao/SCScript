SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $ = sc.lang.$;
  var $false = $.false;

  sc.lang.klass.refine("Association", function(builder, _) {
    builder.addProperty("<>", "key");
    builder.addProperty("<>", "value");

    builder.addMethod("valueOf", function() {
      return this._$key.valueOf();
    });

    builder.addClassMethod("new", function($key, $value) {
      return _.newCopyArgs(this, {
        key: $key,
        value: $value
      });
    });

    builder.addMethod("==", function($anAssociation) {
      if ($anAssociation.key) {
        return this._$key ["=="] ($anAssociation.$("key"));
      }
      return $false;
    });

    builder.addMethod("hash", function() {
      return this._$key.hash();
    });

    builder.addMethod("<", function($anAssociation) {
      return this._$key.$("<", [ $anAssociation.$("key") ]);
    });
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements embedInStream
    // TODO: implements transformEvent
  });
});

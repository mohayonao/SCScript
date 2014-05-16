SCScript.install(function(sc) {
  "use strict";

  require("./Dictionary");

  function SCEnvironment() {
    this.__initializeWith__("IdentityDictionary");
  }

  sc.lang.klass.define(SCEnvironment, "Environment : IdentityDictionary", function() {
    // TODO: implements $make
    // TODO: implements $use
    // TODO: implements make
    // TODO: implements use
    // TODO: implements eventAt
    // TODO: implements composeEvents
    // TODO: implements $pop
    // TODO: implements $push
    // TODO: implements pop
    // TODO: implements push
    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });

});

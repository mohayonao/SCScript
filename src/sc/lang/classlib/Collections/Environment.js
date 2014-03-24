(function(sc) {
  "use strict";

  require("./Dictionary");

  function SCEnvironment() {
    this.__initializeWith__("IdentityDictionary");
  }

  sc.lang.klass.define("Environment", "IdentityDictionary", {
    constructor: SCEnvironment,
    NotYetImplemented: [
      "$make",
      "$use",
      "make",
      "use",
      "eventAt",
      "composeEvents",
      "$pop",
      "$push",
      "pop",
      "push",
      "linkDoc",
      "unlinkDoc",
    ]
  });

})(sc);

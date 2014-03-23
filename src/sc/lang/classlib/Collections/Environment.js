(function(sc) {
  "use strict";

  require("./Dictionary");

  sc.lang.klass.define("Environment", "IdentityDictionary", {
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

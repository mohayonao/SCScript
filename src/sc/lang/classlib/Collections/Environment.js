(function(sc) {
  "use strict";

  require("./Dictionary");

  sc.lang.klass.define("Environment", "IdentityDictionary", {
    NotYetImplemented: [
      "$make",
      "$use",
      "make",
      "protect",
      "use",
      "protect",
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

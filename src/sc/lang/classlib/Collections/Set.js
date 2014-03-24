(function(sc) {
  "use strict";

  require("./Collection");

  function SCSet() {
    this.__initializeWith__("Collection");
  }

  sc.lang.klass.define("Set", "Collection", {
    constructor: SCSet,
    NotYetImplemented: [
      "species",
      "copy",
      "do",
      "clear",
      "makeEmpty",
      "includes",
      "findMatch",
      "add",
      "remove",
      "choose",
      "pop",
      "powerset",
      "unify",
      "sect",
      "union",
      "difference",
      "symmetricDifference",
      "isSubsetOf",
      "initSet",
      "putCheck",
      "fullCheck",
      "grow",
      "noCheckAdd",
      "scanFor",
      "fixCollisionsFrom",
      "keyAt",
      "asSet",
    ]
  });

})(sc);

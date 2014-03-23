(function(sc) {
  "use strict";

  require("./Collection");

  sc.lang.klass.define("Set", "Collection", {
    NotYetImplemented: [
      // "$new",
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

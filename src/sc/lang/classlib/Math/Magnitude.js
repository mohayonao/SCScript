(function(sc) {
  "use strict";

  require("../Core/Object");

  function SCMagnitude() {
    this.__initializeWith__("Object");
  }

  sc.lang.klass.define("Magnitude", "Object", {
    constructor: SCMagnitude,
    NotYetImplemented: [
      "hash",
      "exclusivelyBetween",
      "inclusivelyBetween",
      "min",
      "max",
      "clip",
    ]
  });

})(sc);

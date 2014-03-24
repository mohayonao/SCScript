(function(sc) {
  "use strict";

  require("./Magnitude");

  function SCNumber() {
    this.__initializeWith__("Magnitude");
  }

  sc.lang.klass.define("Number", "Magnitude", {
    constructor: SCNumber,
    NotYetImplemented: [
      "isNumber",
      "mod",
      "div",
      "pow",
      "performBinaryOpOnSeqColl",
      "performBinaryOpOnPoint",
      "rho",
      "theta",
      "real",
      "imag",
      "complex",
      "polar",
      "for",
      "forBy",
      "forSeries",
    ]
  });

})(sc);

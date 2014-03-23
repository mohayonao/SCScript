(function(sc) {
  "use strict";

  require("./Magnitude");

  sc.lang.klass.define("Number", "Magnitude", {
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

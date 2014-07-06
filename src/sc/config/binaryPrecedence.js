(function(sc) {
  "use strict";

  require("./config");

  var defaults = {
    "?": 1,
    "??": 1,
    "!?": 1,
    "->": 2,
    "||": 3,
    "&&": 4,
    "|": 5,
    "&": 6,
    "==": 7,
    "!=": 7,
    "===": 7,
    "!==": 7,
    "<": 8,
    ">": 8,
    "<=": 8,
    ">=": 8,
    "<<": 9,
    ">>": 9,
    "+>>": 9,
    "+": 10,
    "-": 10,
    "*": 11,
    "/": 11,
    "%": 11,
    "!": 12
  };

  sc.config.add("binaryPrecedence", {}, function(value) {
    if (typeof value === "boolean") {
      return value ? defaults : {};
    }
    if (value && typeof value === "object") {
      return value;
    }
    throw new Error("Config 'binaryPrecedence' must be a boolean or an object.");
  });
})(sc);

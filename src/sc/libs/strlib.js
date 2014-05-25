(function(sc) {
  "use strict";

  require("./sc");

  var strlib = {};

  strlib.article = function(name) {
    if (/^[AEIOU]/i.test(name)) {
      return "an";
    }
    return "a";
  };

  sc.libs.strlib = strlib;

})(sc);

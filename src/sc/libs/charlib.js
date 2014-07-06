(function(sc) {
  "use strict";

  require("./libs");

  sc.libs.charlib = {
    isAlpha: function(ch) {
      return ("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z");
    },
    isNumber: function(ch) {
      return "0" <= ch && ch <= "9";
    },
    toNumber: function(ch) {
      var n = ch.charCodeAt(0);

      if (48 <= n && n <= 57) {
        return n - 48;
      }
      if (65 <= n && n <= 90) {
        return n - 55;
      }
      if (97 <= n && n <= 122) {
        return n - 87;
      }

      return NaN;
    }
  };
})(sc);

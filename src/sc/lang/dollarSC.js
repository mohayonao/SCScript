(function(sc) {
  "use strict";

  require("./sc");

  sc.lang.$SC = function(name) {
    return sc.lang.klass.get(name);
  };

})(sc);

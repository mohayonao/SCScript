(function(sc) {
  "use strict";

  require("./sc");

  sc.lang.$ = function(name) {
    return sc.lang.klass.get(name);
  };

  sc.lang.$.NOP = null;
  sc.lang.$.DoNothing = function() {
    return this;
  };
})(sc);

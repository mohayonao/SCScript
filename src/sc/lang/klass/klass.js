(function(sc) {
  "use strict";

  require("../sc");

  var klass = {
    classes: {}
  };

  klass.get = function(name) {
    if (!klass.classes[name]) {
      throw new Error("Class not defined: " + name);
    }
    return klass.classes[name];
  };

  klass.exists = function(name) {
    return !!klass.classes[name];
  };

  sc.lang.klass = klass;
})(sc);

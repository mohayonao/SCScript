(function(sc) {
  "use strict";

  require("../lang");

  var klass = {
    _classes: {}
  };

  klass.get = function(name) {
    if (!klass._classes[name]) {
      throw new Error("Class not defined: " + name);
    }
    return klass._classes[name];
  };

  klass.exists = function(name) {
    return !!klass._classes[name];
  };

  sc.lang.klass = klass;
})(sc);

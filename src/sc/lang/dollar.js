(function(sc) {
  "use strict";

  require("./sc");

  var $ = function(name) {
    return sc.lang.klass.get(name);
  };

  $.addProperty = function(name, payload) {
    $[name] = payload;
  };

  $.addProperty("NOP", null);
  $.addProperty("DoNothing", function() {
    return this;
  });

  sc.lang.$ = $;
})(sc);

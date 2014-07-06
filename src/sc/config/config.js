(function(sc) {
  "use strict";

  require("../libs/");

  var strlib = sc.libs.strlib;

  var values = {};
  var setter = {};

  sc.config = {
    add: function(name, defaultValue, func) {
      values[name] = typeof defaultValue !== "undefined" ? defaultValue : null;
      if (typeof func === "function") {
        setter[name] = func;
      }
    },
    set: function(name, value) {
      if (values.hasOwnProperty(name)) {
        value = setter[name] ? setter[name](value) : value;
        return (values[name] = value);
      }
      throw new Error(
        strlib.format("Config '#{0}' is not found.", name)
      );
    },
    get: function(name) {
      if (values.hasOwnProperty(name)) {
        return values[name];
      }
      throw new Error(
        strlib.format("Config '#{0}' is not found.", name)
      );
    }
  };
})(sc);

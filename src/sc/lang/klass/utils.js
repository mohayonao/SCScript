(function(sc) {
  "use strict";

  require("./klass");
  require("./constructors");

  var slice = Array.prototype.slice;
  var $nil = sc.lang.$.nil;

  sc.lang.klass.utils = {
    toArray: function(args) {
      return slice.call(args);
    },
    newCopyArgs: function(that, dict) {
      var instance = new that.__Spec();
      Object.keys(dict).forEach(function(key) {
        instance["_$" + key] = dict[key] || $nil;
      });
      return instance;
    }
  };
})(sc);

(function(sc) {
  "use strict";

  require("./klass");
  require("./constructors");

  var $nil = sc.lang.$.nil;

  sc.lang.klass.utils = {
    newCopyArgs: function(that, dict) {
      var instance = new that.__Spec();
      Object.keys(dict).forEach(function(key) {
        instance["_$" + key] = dict[key] || $nil;
      });
      return instance;
    }
  };
})(sc);

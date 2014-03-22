(function(sc) {
  "use strict";

  require("../../klass");
  require("../../dollarSC");

  sc.lang.klass.refine("Object", {
    js: function() {
      return this._raw;
    },
    __tag__: function() {
      return sc.C.TAG_OBJ;
    },
    __num__: function() {
      return 0;
    },
    __str__: function() {
      return this._class._name;
    }
  });

})(sc);

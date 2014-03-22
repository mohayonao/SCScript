(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $SC = sc.lang.$SC;

  var instances = {};

  function Integer(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("SimpleNumber");
    this._class = $SC.Class("Integer");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Integer", "SimpleNumber", {
    constructor: Integer,
    $new: function() {
      throw new Error("Integer.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_INT;
    }
  });

  $SC.Integer = function(value) {
    if (!global.isFinite(value)) {
      return $SC.Float(+value);
    }
    return new Integer(value|0);
  };

})(sc);

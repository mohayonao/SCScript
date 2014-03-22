(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;

  var instances = {};

  function Symbol(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Object");
    this._class = $SC.Class("Symbol");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Symbol", "Object", {
    constructor: Symbol,
    $new: function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    },
    __str__: function() {
      return this._raw;
    }
  });

  $SC.Symbol = function(value) {
    return new Symbol(String(value));
  };

})(sc);

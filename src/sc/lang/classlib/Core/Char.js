(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $SC = sc.lang.$SC;

  var instances = {};

  function Char(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Magnitude");
    this._class = $SC.Class("Char");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Char", "Magnitude", {
    constructor: Char,
    $new: function() {
      throw new Error("Char.new is illegal, should use literal.");
    },
    __str__: function() {
      return this._raw;
    }
  });

  $SC.Char = function(value) {
    return new Char(String(value).charAt(0));
  };

})(sc);

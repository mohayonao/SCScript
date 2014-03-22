(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var jsString = global.String;
  var $SC = sc.lang.$SC;

  var instances = {};

  function String(value) {
    if (instances[value]) {
      return instances[value];
    }
    // TODO: array?
    this.__initializeWith__("RawArray");
    this._class = $SC.Class("String");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("String", "RawArray", {
    constructor: String,
    $new: function() {
      throw new Error("String.new is illegal, should use literal.");
    },
    __str__: function() {
      return this._raw;
    }
  });

  $SC.String = function(value) {
    return new String(jsString(value)); // jshint ignore: line
  };

})(sc);

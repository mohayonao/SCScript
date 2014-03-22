(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var $SC = sc.lang.$SC;

  function Array(value) {
    this.__initializeWith__("ArrayedCollection");
    this._class = $SC.Class("Array");
    this._raw = value || [];
  }

  sc.lang.klass.define("Array", "ArrayedCollection", {
    constructor: Array
  });

  $SC.Array = function(value) {
    return new Array(value);
  };

})(sc);

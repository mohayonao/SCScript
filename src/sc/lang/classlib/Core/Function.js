(function(sc) {
  "use strict";

  require("./AbstractFunction");

  var $SC = sc.lang.$SC;

  function Function(value) {
    this.__initializeWith__("AbstractFunction");
    this._class = $SC.Class("Function");
    this._raw = value;
  }

  sc.lang.klass.define("Function", "AbstractFunction", {
    constructor: Function,
    $new: function() {
      throw new Error("Function.new is illegal, should use literal.");
    },
  });

  $SC.Function = function(value) {
    return new Function(value); // jshint ignore: line
  };

})(sc);

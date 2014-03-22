(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;

  var nilInstance = null;

  function Nil() {
    if (nilInstance) {
      return nilInstance;
    }
    this.__initializeWith__("Object");
    this._class = $SC.Class("Nil");
    this._raw = null;
    nilInstance = this;
  }

  sc.lang.klass.define("Nil", "Object", {
    constructor: Nil,
    $new: function() {
      throw new Error("Nil.new is illegal, should use literal.");
    }
  });

  $SC.Nil = function() {
    return new Nil();
  };

})(sc);

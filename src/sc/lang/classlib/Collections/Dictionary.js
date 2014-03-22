(function(sc) {
  "use strict";

  require("./Set");

  var $SC = sc.lang.$SC;

  function Dictionary(value) {
    this.__initializeWith__("Set");
    this._class = $SC.Class("Dictionary");
    this._raw = value || {};
  }

  sc.lang.klass.define("Dictionary", "Set", {
    constructor: Dictionary
  });

  sc.lang.klass.define("IdentityDictionary", "Dictionary");

  $SC.Dictionary = function(value) {
    return new Dictionary(value);
  };

})(sc);

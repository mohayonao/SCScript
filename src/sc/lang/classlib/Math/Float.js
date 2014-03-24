(function(sc) {
  "use strict";

  require("./SimpleNumber");

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCFloat() {
    this.__initializeWith__("SimpleNumber");
    this._class = $SC.Class("Float");
    this._raw = 0.0;
  }

  sc.lang.klass.define("Float", "SimpleNumber", {
    constructor: SCFloat,
    $new: function() {
      throw new Error("Float.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_FLOAT;
    },
    NotYetImplemented: [
      "isFloat",
      "asFloat",
      "clip",
      "wrap",
      "fold",
      "coin",
      "xrand2",
      "as32Bits",
      "high32Bits",
      "low32Bits",
      "$from32Bits",
      "$from64Bits",
      "do",
      "reverseDo",
      "asStringPrec",
      "archiveAsCompileString",
      "storeOn",
      "switch",
    ]
  });

  $SC.Float = function(value) {
    var instance;

    value = +value;

    if (!instances.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._raw = value;
      instances[value] = instance;
    }

    return instances[value];
  };

})(sc);

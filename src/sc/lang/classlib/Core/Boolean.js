(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;

  var trueInstance = null;
  var falseInstance = null;

  function SCBoolean() {
    this.__initializeWith__("Object");
  }

  sc.lang.klass.define("Boolean", "Object", {
    constructor: SCBoolean,
    $new: function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    },
    NotYetImplemented: [
      "xor",
      "if",
      "not",
      "and",
      "or",
      "nand",
      "asInteger",
      "binaryValue",
      "asBoolean",
      "booleanValue",
      "keywordWarnings",
      "trace",
      "printOn",
      "storeOn",
      "archiveAsCompileString",
      "while",
    ]
  });

  function SCTrue() {
    if (trueInstance) {
      return trueInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("True");
    this._raw = true;
    trueInstance = this;
  }

  sc.lang.klass.define("True", "Boolean", {
    constructor: SCTrue,
    $new: function() {
      throw new Error("True.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_TRUE;
    },
    NotYetImplemented: [
      "if",
      "not",
      "and",
      "or",
      "nand",
      "asInteger",
      "binaryValue",
    ]
  });

  function SCFalse() {
    if (falseInstance) {
      return falseInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("False");
    this._raw = false;
    falseInstance = this;
  }

  sc.lang.klass.define("False", "Boolean", {
    constructor: SCFalse,
    $new: function() {
      throw new Error("False.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_FALSE;
    },
    NotYetImplemented: [
      "if",
      "not",
      "and",
      "or",
      "nand",
      "asInteger",
      "binaryValue",
    ]
  });

  $SC.Boolean = function(value) {
    return value ? $SC.True() : $SC.False();
  };

  $SC.True = function() {
    return new SCTrue();
  };

  $SC.False = function() {
    return new SCFalse();
  };

})(sc);

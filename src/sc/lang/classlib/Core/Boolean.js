(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;

  var trueInstance = null;
  var falseInstance = null;

  function True() {
    if (trueInstance) {
      return trueInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("True");
    this._raw = true;
    trueInstance = this;
  }

  function False() {
    if (falseInstance) {
      return falseInstance;
    }
    this.__initializeWith__("Boolean");
    this._class = $SC.Class("False");
    this._raw = false;
    falseInstance = this;
  }

  sc.lang.klass.define("Boolean", "Object", {
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

  sc.lang.klass.define("True", "Boolean", {
    constructor: True,
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

  sc.lang.klass.define("False", "Boolean", {
    constructor: False,
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
    return new True();
  };

  $SC.False = function() {
    return new False();
  };

})(sc);

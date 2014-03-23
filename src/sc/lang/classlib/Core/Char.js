(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCChar(value) {
    if (instances[value]) {
      return instances[value];
    }
    this.__initializeWith__("Magnitude");
    this._class = $SC.Class("Char");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("Char", "Magnitude", {
    constructor: SCChar,
    $new: function() {
      throw new Error("Char.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_CHAR;
    },
    __str__: function() {
      return this._raw;
    },
    NotYetImplemented: [
      "hash",
      "ascii",
      "digit",
      "asAscii",
      "asUnicode",
      "toUpper",
      "toLower",
      "isAlpha",
      "isAlphaNum",
      "isPrint",
      "isPunct",
      "isControl",
      "isSpace",
      "isVowel",
      "isDecDigit",
      "isUpper",
      "isLower",
      "isFileSafe",
      "isPathSeparator",
      "$bullet",
      "printOn",
      "storeOn",
      "archiveAsCompileString",
    ]
  });

  $SC.Char = function(value) {
    return new SCChar(String(value).charAt(0));
  };

})(sc);

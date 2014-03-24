(function(sc) {
  "use strict";

  require("./Set");

  var $SC = sc.lang.$SC;

  function SCDictionary() {
    this.__initializeWith__("Set");
    this._class = $SC.Class("Dictionary");
    this._raw = {};
  }

  sc.lang.klass.define("Dictionary", "Set", {
    constructor: SCDictionary,
    NotYetImplemented: [
      "$newFrom",
      "at",
      "atFail",
      "matchAt",
      "trueAt",
      "add",
      "put",
      "putAll",
      "putPairs",
      "getPairs",
      "associationAt",
      "associationAtFail",
      "keys",
      "values",
      "includes",
      "includesKey",
      "removeAt",
      "removeAtFail",
      "remove",
      "removeFail",
      "keysValuesDo",
      "keysValuesChange",
      "do",
      "keysDo",
      "associationsDo",
      "pairsDo",
      "collect",
      "select",
      "reject",
      "invert",
      "merge",
      "blend",
      "findKeyForValue",
      "sortedKeysValuesDo",
      "choose",
      "order",
      "powerset",
      "transformEvent",
      "embedInStream",
      "asSortedArray",
      "asKeyValuePairs",
      "keysValuesArrayDo",
      "grow",
      "fixCollisionsFrom",
      "scanFor",
      "storeItemsOn",
      "printItemsOn",
    ]
  });

  function IdentityDictionary() {
    this.__initializeWith__("Dictionary");
  }

  sc.lang.klass.define("IdentityDictionary", "Dictionary", {
    constructor: IdentityDictionary,
    NotYetImplemented: [
      "at",
      "put",
      "putGet",
      "includesKey",
      "findKeyForValue",
      "scanFor",
      "freezeAsParent",
      "insertParent",
      "storeItemsOn",
      "doesNotUnderstand",
      "nextTimeOnGrid",
      "asQuant",
      "timingOffset",
    ]
  });

  $SC.Dictionary = function(value) {
    var instance = new SCDictionary();
    instance._raw = value;
    return instance;
  };

})(sc);

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
    constructor: Dictionary,
    NotYetImplemented: [
      // "$new",
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

  sc.lang.klass.define("IdentityDictionary", "Dictionary", {
    NotYetImplemented: [
      "$new",
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
    return new Dictionary(value);
  };

})(sc);

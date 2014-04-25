(function(sc) {
  "use strict";

  require("./Set");

  function SCDictionary() {
    this.__initializeWith__("Set");
    this._ = {};
  }

  sc.lang.klass.define(SCDictionary, "Dictionary : Set", function() {
    // TODO: implements $newFrom
    // TODO: implements at
    // TODO: implements atFail
    // TODO: implements matchAt
    // TODO: implements trueAt
    // TODO: implements add
    // TODO: implements put
    // TODO: implements putAll
    // TODO: implements putPairs
    // TODO: implements getPairs
    // TODO: implements associationAt
    // TODO: implements associationAtFail
    // TODO: implements keys
    // TODO: implements values
    // TODO: implements includes
    // TODO: implements includesKey
    // TODO: implements removeAt
    // TODO: implements removeAtFail
    // TODO: implements remove
    // TODO: implements removeFail
    // TODO: implements keysValuesDo
    // TODO: implements keysValuesChange
    // TODO: implements do
    // TODO: implements keysDo
    // TODO: implements associationsDo
    // TODO: implements pairsDo
    // TODO: implements collect
    // TODO: implements select
    // TODO: implements reject
    // TODO: implements invert
    // TODO: implements merge
    // TODO: implements blend
    // TODO: implements findKeyForValue
    // TODO: implements sortedKeysValuesDo
    // TODO: implements choose
    // TODO: implements order
    // TODO: implements powerset
    // TODO: implements transformEvent
    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs
    // TODO: implements keysValuesArrayDo
    // TODO: implements grow
    // TODO: implements fixCollisionsFrom
    // TODO: implements scanFor
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
  });

  function SCIdentityDictionary() {
    this.__initializeWith__("Dictionary");
  }

  sc.lang.klass.define(SCIdentityDictionary, "IdentityDictionary : Dictionary", function() {
    // TODO: implements at
    // TODO: implements put
    // TODO: implements putGet
    // TODO: implements includesKey
    // TODO: implements findKeyForValue
    // TODO: implements scanFor
    // TODO: implements freezeAsParent
    // TODO: implements insertParent
    // TODO: implements storeItemsOn
    // TODO: implements doesNotUnderstand
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements timingOffset
  });

})(sc);

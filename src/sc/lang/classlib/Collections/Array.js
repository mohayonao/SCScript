(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var $SC = sc.lang.$SC;

  function Array(value) {
    this.__initializeWith__("ArrayedCollection");
    this._class = $SC.Class("Array");
    this._raw = value || [];
  }

  sc.lang.klass.define("Array", "ArrayedCollection", {
    constructor: Array,
    NotYetImplemented: [
      "$with",
      "reverse",
      "scramble",
      "mirror",
      "mirror1",
      "mirror2",
      "stutter",
      "rotate",
      "pyramid",
      "pyramidg",
      "sputter",
      "while",
      "lace",
      "permute",
      "allTuples",
      "wrapExtend",
      "foldExtend",
      "clipExtend",
      "slide",
      "containsSeqColl",
      "unlace",
      "prUnlace",
      "interlace",
      "deinterlace",
      "flop",
      "multiChannelExpand",
      "envirPairs",
      "shift",
      "powerset",
      "source",
      "asUGenInput",
      "asControlInput",
      "isValidUGenInput",
      "numChannels",
      "poll",
      "dpoll",
      "envAt",
      "$newClear2D",
      "$new2D",
      "at2D",
      "put2D",
      "fill2D",
      "atIdentityHash",
      "atIdentityHashInPairs",
      "asSpec",
      "fork",
      "madd",
      "asRawOSC",
      "printOn",
      "storeOn",
      "prUnarchive",
    ]
  });

  $SC.Array = function(value) {
    return new Array(value);
  };

})(sc);

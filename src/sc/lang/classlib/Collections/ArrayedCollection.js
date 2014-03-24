(function(sc) {
  "use strict";

  require("./SequenceableCollection");

  function SCArrayedCollection() {
    this.__initializeWith__("SequenceableCollection");
  }

  sc.lang.klass.define("ArrayedCollection", "SequenceableCollection", {
    constructor: SCArrayedCollection,
    NotYetImplemented: [
      "$newClear",
      "indexedSize",
      "size",
      "maxSize",
      "swap",
      "at",
      "clipAt",
      "wrapAt",
      "foldAt",
      "put",
      "clipPut",
      "wrapPut",
      "foldPut",
      "removeAt",
      "takeAt",
      "indexOf",
      "indexOfGreaterThan",
      "takeThese",
      "replace",
      "slotSize",
      "slotAt",
      "slotPut",
      "slotKey",
      "slotIndex",
      "getSlots",
      "setSlots",
      "atModify",
      "atInc",
      "atDec",
      "isArray",
      "asArray",
      "copyRange",
      "copySeries",
      "putSeries",
      "add",
      "addAll",
      "putEach",
      "extend",
      "insert",
      "move",
      "addFirst",
      "addIfNotNil",
      "pop",
      "overWrite",
      "grow",
      "growClear",
      "seriesFill",
      "fill",
      "do",
      "reverseDo",
      "reverse",
      "windex",
      "normalizeSum",
      "normalize",
      "asciiPlot",
      "perfectShuffle",
      "performInPlace",
      "clipExtend",
      "rank",
      "shape",
      "reshape",
      "reshapeLike",
      "deepCollect",
      "deepDo",
      "unbubble",
      "bubble",
      "slice",
      "$iota",
      "asRandomTable",
      "tableRand",
      "msgSize",
      "bundleSize",
      "clumpBundles",
      "prBundleSize",
      "includes",
    ]
  });

  function SCRawArray() {
    this.__initializeWith__("ArrayedCollection");
  }

  sc.lang.klass.define("RawArray", "ArrayedCollection", {
    constructor: SCRawArray,
    NotYetImplemented: [
      "archiveAsCompileString",
      "archiveAsObject",
      "rate",
      "readFromStream",
      "powerset",
    ]
  });

})(sc);

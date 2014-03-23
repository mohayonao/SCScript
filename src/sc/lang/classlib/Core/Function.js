(function(sc) {
  "use strict";

  require("./AbstractFunction");

  var $SC = sc.lang.$SC;

  function SCFunction(value) {
    this.__initializeWith__("AbstractFunction");
    this._class = $SC.Class("Function");
    this._raw = value;
  }

  sc.lang.klass.define("Function", "AbstractFunction", {
    constructor: SCFunction,
    $new: function() {
      throw new Error("Function.new is illegal, should use literal.");
    },
    NotYetImplemented: [
      "isFunction",
      "isClosed",
      "storeOn",
      "archiveAsCompileString",
      "archiveAsObject",
      "checkCanArchive",
      "shallowCopy",
      "choose",
      "update",
      "value",
      "valueArray",
      "valueEnvir",
      "valueArrayEnvir",
      "functionPerformList",
      "valueWithEnvir",
      "performWithEnvir",
      "performKeyValuePairs",
      "numArgs",
      "numVars",
      "varArgs",
      "loop",
      "loop",
      "block",
      "block",
      "try",
      "asRoutine",
      "dup",
      "sum",
      "defer",
      "thunk",
      "transformEvent",
      "set",
      "get",
      "fork",
      "forkIfNeeded",
      "awake",
      "cmdPeriod",
      "bench",
      "protect",
      "try",
      "prTry",
      "handleError",
      "case",
      "matchItem",
      "performDegreeToKey",
      "flop",
      "envirFlop",
      "makeFlopFunc",
      "inEnvir",
    ]
  });

  $SC.Function = function(value) {
    return new SCFunction(value); // jshint ignore: line
  };

})(sc);

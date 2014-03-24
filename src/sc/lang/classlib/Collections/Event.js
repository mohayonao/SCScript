(function(sc) {
  "use strict";

  require("./Environment");

  function SCEvent() {
    this.__initializeWith__("Environment");
  }

  sc.lang.klass.define("Event", "Environment", {
    constructor: SCEvent,
    NotYetImplemented: [
      "$default",
      "$silent",
      "$addEventType",
      "next",
      "delta",
      "play",
      "isRest",
      "isPlaying_",
      "isRunning_",
      "playAndDelta",
      "synchWithQuant",
      "asControlInput",
      "asUGenInput",
      "printOn",
      "storeOn",
      // "$initClass",
      "$makeDefaultSynthDef",
      "$makeParentEvents",
    ]
  });

})(sc);

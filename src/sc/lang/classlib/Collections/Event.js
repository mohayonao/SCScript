(function(sc) {
  "use strict";

  require("./Environment");

  sc.lang.klass.define("Event", "Environment", {
    NotYetImplemented: [
      "$new",
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
      "$initClass",
      "$makeDefaultSynthDef",
      "$makeParentEvents",
    ]
  });

})(sc);

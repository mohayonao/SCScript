(function(sc) {
  "use strict";

  require("./Object");

  function SCRef() {
    this.__initializeWith__("Object");
  }

  sc.lang.klass.define("Ref", "Object", {
    constructor: SCRef,
    NotYetImplemented: [
      "set",
      "get",
      "dereference",
      "asRef",
      "valueArray",
      "valueEnvir",
      "valueArrayEnvir",
      "next",
      "embedInStream",
      "asUGenInput",
      "printOn",
      "storeOn",
      "at",
      "put",
      "seq",
      "asControlInput",
      "asBufWithValues",
      "multichannelExpandRef",
    ]
  });

})(sc);

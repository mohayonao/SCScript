(function(sc) {
  "use strict";

  require("./Object");

  sc.lang.klass.define("Ref", "Object", {
    NotYetImplemented: [
      "$new",
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

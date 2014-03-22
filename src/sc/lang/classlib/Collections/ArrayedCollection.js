(function(sc) {
  "use strict";

  require("./SequenceableCollection");

  sc.lang.klass.define("ArrayedCollection", "SequenceableCollection");

  sc.lang.klass.define("RawArray", "ArrayedCollection");

})(sc);

(function(sc) {
  "use strict";

  require("../Streams/Stream");

  sc.lang.klass.define("Thread", "Stream");

  sc.lang.klass.define("Routine", "Thread");

})(sc);

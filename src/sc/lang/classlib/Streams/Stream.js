(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  sc.lang.klass.define("Stream", "AbstractFunction");

  sc.lang.klass.define("PauseStream", "Stream");

  sc.lang.klass.define("Task", "PauseStream");

})(sc);

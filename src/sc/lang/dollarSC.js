(function(sc) {
  "use strict";

  require("./sc");

  sc.lang.$SC = function(msg, rcv, args) {
      var method;

      method = rcv[msg];
      if (method) {
        return method.apply(rcv, args);
      }

      throw new Error(String(rcv) + " cannot understand message '" + msg + "'");
  };

})(sc);

(function(global) {
"use strict";

var sc = { VERSION: "0.0.2" };

// src/sc/sc.js
(function(sc) {

  sc.lang = {};
  sc.lang.$SC = {};

  function SCScript(fn) {
    return fn(sc.lang.$SC);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  SCScript.VERSION = sc.VERSION;

  global.SCScript = sc.SCScript = SCScript;

})(sc);

// src/sc/lang/dollarSC.js
(function(sc) {

  sc.lang.$SC = function(msg, rcv, args) {
      var method;

      method = rcv[msg];
      if (method) {
        return method.apply(rcv, args);
      }

      throw new Error(String(rcv) + " cannot understand message '" + msg + "'");
  };

})(sc);

})(this.self||global);

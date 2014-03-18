(function(global) {
"use strict";

var sc = { VERSION: "0.0.0" };

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

})(this.self||global);

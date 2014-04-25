(function(sc) {
  "use strict";

  sc.lang = {};
  sc.lang.$SC = {};
  sc.libs = {};

  function SCScript(fn) {
    return fn(sc.lang.$SC);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  SCScript.VERSION = sc.VERSION;

  global.SCScript = sc.SCScript = SCScript;

})(sc);

(function(sc) {
  "use strict";

  sc.lang = {};
  sc.libs = {};

  function SCScript(fn) {
    return sc.lang.main.run(fn);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  // istanbul ignore next
  SCScript.stdout = function(msg) {
    console.log(msg);
  };

  // istanbul ignore next
  SCScript.stderr = function(msg) {
    console.error(msg);
  };

  SCScript.VERSION = sc.VERSION;

  global.SCScript = sc.SCScript = SCScript;

})(sc);

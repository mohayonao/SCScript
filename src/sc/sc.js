(function(sc) {
  "use strict";

  function SCScript(fn) {
    return sc.lang.main.run(fn);
  }

  SCScript.VERSION = sc.VERSION;

  SCScript.install = function(installer) {
    installer(sc);
    return SCScript;
  };

  SCScript.stdout = function(msg) {
    console.log(msg);
    return SCScript;
  };

  SCScript.stderr = function(msg) {
    console.error(msg);
    return SCScript;
  };

  SCScript.tokenize = function(source, opts) {
    return sc.lang.compiler.tokenize(source, opts);
  };

  SCScript.parse = function(source, opts) {
    return sc.lang.compiler.parse(source, opts);
  };

  SCScript.compile = function(source, opts) {
    return sc.lang.compiler.compile(source, opts);
  };

  global.SCScript = sc.SCScript = SCScript;
})(sc);

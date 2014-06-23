(function(sc) {
  "use strict";

  sc.lang = {};
  sc.libs = {};

  function SCScript(fn) {
    return sc.lang.main.run(fn);
  }

  SCScript.VERSION = sc.VERSION;

  SCScript.install = function(installer) {
    installer(sc);
  };

  /* istanbul ignore next */
  SCScript.stdout = function(msg) {
    console.log(msg);
  };

  /* istanbul ignore next */
  SCScript.stderr = function(msg) {
    console.error(msg);
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

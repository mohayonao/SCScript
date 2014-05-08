(function(sc) {
  "use strict";

  require("./Object");

  var fn  = sc.lang.fn;

  sc.lang.klass.refine("Class", {
    // TODO: implements superclass
    // TODO: implements asClass
    // TODO: implements initClass
    // TODO: implements $initClassTree
    // TODO: implements $allClasses
    // TODO: implements findMethod
    // TODO: implements findRespondingMethodFor
    // TODO: implements findOverriddenMethod
    // TODO: implements superclassesDo
    // TODO: implements while
    // TODO: implements dumpByteCodes
    // TODO: implements dumpClassSubtree
    // TODO: implements dumpInterface
    // TODO: implements asString
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements hasHelpFile
    // TODO: implements helpFilePath
    // TODO: implements help
    // TODO: implements openHelpFile
    // TODO: implements shallowCopy
    // TODO: implements openCodeFile
    // TODO: implements classVars
    // TODO: implements inspectorClass
    // TODO: implements findReferences
    // TODO: implements $findAllReferences
    // TODO: implements allSubclasses
    // TODO: implements superclasses
  });

  sc.lang.klass.refine("Interpreter", function(spec, utils) {
    var $nil = utils.$nil;

    (function() {
      var i, ch;

      function getter(name) {
        return function() {
          return this["_" + name] || $nil;
        };
      }

      function setter(name) {
        return fn(function(value) {
          this["_" + name] = value;
          return this;
        }, "value");
      }

      for (i = 97; i <= 122; i++) {
        ch = String.fromCharCode(i);
        spec[ch] = getter(ch);
        spec[ch + "_"] = setter(ch);
      }
    })();

    spec.$new = function() {
      throw new Error("Interpreter.new is illegal.");
    };

    spec.clearAll = function() {
      var i;
      for (i = 97; i <= 122; i++) {
        this["_" + String.fromCharCode(i)] = $nil;
      }
      return this;
    };
  });

})(sc);

SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;
  var klass = sc.lang.klass;

  klass.refine("Class", function(spec) {
    spec.class = function() {
      if (this._isMetaClass) {
        return $SC("Class");
      }
      return $SC("Meta_" + this._name);
    };

    spec.name = function() {
      return $SC.String(this._name);
    };

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


  klass.define("Process", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCProcess() {
      this.__super__("Object");
      this._$interpreter = $nil;
      this._$mainThread  = $nil;
    };

    spec.interpreter = function() {
      return this._$interpreter;
    };

    spec.mainThread = function() {
      return this._$mainThread;
    };
  });

  klass.define("Main : Process", function(spec) {
    spec.constructor = function SCMain() {
      this.__super__("Process");
    };
  });


  klass.define("Interpreter", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCInterpreter() {
      this.__super__("Object");
      for (var i = 97; i <= 122; i++) {
        this["_$" + String.fromCharCode(i)] = $nil;
      }
      // this._$s = $SC("Server").default(); // in SCMain
    };

    (function() {
      var i, ch;

      function getter(name) {
        return function() {
          return this["_$" + name];
        };
      }

      function setter(name) {
        return function($value) {
          this["_$" + name] = $value || /* istanbul ignore next */ $nil;
          return this;
        };
      }

      for (i = 97; i <= 122; i++) {
        ch = String.fromCharCode(i);
        spec[ch] = getter(ch);
        spec[ch + "_"] = setter(ch);
      }
    })();

    spec.clearAll = function() {
      var i;
      for (i = 97; i <= 122; i++) {
        this["_$" + String.fromCharCode(i)] = $nil;
      }
      return this;
    };
  });

});

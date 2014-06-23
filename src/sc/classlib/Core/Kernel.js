SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Class", function(builder) {
    builder.addMethod("toString", function() {
      return String(this.__className);
    });

    builder.addMethod("class", function() {
      if (this.__isMetaClass) {
        return $("Class");
      }
      return $("Meta_" + this.__className);
    });

    builder.addMethod("name", function() {
      return $.String(this.__className);
    });

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

    builder.addMethod("[]", function($anArray) {
      var $newCollection;
      var array, i, imax;

      $newCollection = this.new($anArray.size());

      array = $anArray._;
      for (i = 0, imax = array.length; i < imax; ++i) {
        $newCollection.$("add", [ array[i] ]);
      }

      return $newCollection;
    });
  });

  sc.lang.klass.define("Process", function(builder) {
    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._$interpreter = $nil;
      this._$mainThread  = $nil;
    });

    builder.addMethod("interpreter", function() {
      return this._$interpreter;
    });

    builder.addMethod("mainThread", function() {
      return this._$mainThread;
    });
  });

  sc.lang.klass.define("Main : Process");

  sc.lang.klass.define("Interpreter", function(builder) {
    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._$ = {};
    });

    (function() {
      var i, ch;

      function getter(name) {
        return function() {
          return this._$[name] || /* istanbul ignore next */ $nil;
        };
      }

      function setter(name) {
        return function($value) {
          this._$[name] = $value || /* istanbul ignore next */ $nil;
          return this;
        };
      }

      for (i = 97; i <= 122; i++) {
        ch = String.fromCharCode(i);
        builder.addMethod(ch, getter(ch));
        builder.addMethod(ch + "_", setter(ch));
      }
    })();

    builder.addMethod("clearAll", function() {
      this._$ = {};
      return this;
    });
  });
});

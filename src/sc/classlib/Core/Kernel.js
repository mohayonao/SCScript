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
    builder.addProperty("<>", "a");
    builder.addProperty("<>", "b");
    builder.addProperty("<>", "c");
    builder.addProperty("<>", "d");
    builder.addProperty("<>", "e");
    builder.addProperty("<>", "f");
    builder.addProperty("<>", "g");
    builder.addProperty("<>", "h");
    builder.addProperty("<>", "i");
    builder.addProperty("<>", "j");
    builder.addProperty("<>", "k");
    builder.addProperty("<>", "l");
    builder.addProperty("<>", "m");
    builder.addProperty("<>", "n");
    builder.addProperty("<>", "o");
    builder.addProperty("<>", "p");
    builder.addProperty("<>", "q");
    builder.addProperty("<>", "r");
    builder.addProperty("<>", "s");
    builder.addProperty("<>", "t");
    builder.addProperty("<>", "u");
    builder.addProperty("<>", "v");
    builder.addProperty("<>", "w");
    builder.addProperty("<>", "x");
    builder.addProperty("<>", "y");
    builder.addProperty("<>", "z");

    builder.addMethod("__init__", function() {
      this.__super__("__init__");
    });

    builder.addMethod("clearAll", function() {
      for (var i = 97; i <= 122; i++) {
        this["_$" + String.fromCharCode(i)] = null;
      }
      return this;
    });
  });
});

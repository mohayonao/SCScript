(function(sc) {
  "use strict";

  require("./Object");

  sc.lang.klass.refine("Class", {
    NotYetImplemented: [
      "superclass",
      "asClass",
      "initClass",
      "$initClassTree",
      "$allClasses",
      "findMethod",
      "findRespondingMethodFor",
      "findOverriddenMethod",
      "superclassesDo",
      "while",
      "dumpByteCodes",
      "dumpClassSubtree",
      "dumpInterface",
      "asString",
      "printOn",
      "storeOn",
      "archiveAsCompileString",
      "hasHelpFile",
      "helpFilePath",
      "help",
      "openHelpFile",
      "shallowCopy",
      "openCodeFile",
      "classVars",
      "inspectorClass",
      "findReferences",
      "$findAllReferences",
      "allSubclasses",
      "superclasses",
    ]
  });

})(sc);

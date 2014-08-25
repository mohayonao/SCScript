SCScript.install(function(sc) {
  "use strict";

  require("./UGen");

  sc.lang.klass.define("BasicOpUGen : UGen", function() {
    // TODO: implements operator
    // TODO: implements operator_
    // TODO: implements argNamesInputsOffset
    // TODO: implements argNameForInputAt
    // TODO: implements dumpArgs
    // TODO: implements dumpName
  });

  sc.lang.klass.define("UnaryOpUGen : BasicOpUGen", function() {
    // TODO: implements $new
    // TODO: implements init
    // TODO: implements optimizeGraph
  });

  sc.lang.klass.define("BinaryOpUGen : BasicOpUGen", function() {
    // TODO: implements operator
    // TODO: implements operator_
    // TODO: implements argNamesInputsOffset
    // TODO: implements argNameForInputAt
    // TODO: implements dumpArgs
    // TODO: implements dumpName
  });

  sc.lang.klass.define("MulAdd : BasicOpUGen", function() {
    // TODO: implements $new
    // TODO: implements $new1
    // TODO: implements $canBeMulAdd
    // TODO: implements init
  });

  sc.lang.klass.define("Sum3 : BasicOpUGen", function() {
    // TODO: implements $new
    // TODO: implements $new1
  });

  sc.lang.klass.define("Sum4 : BasicOpUGen", function() {
    // TODO: implements $new
    // TODO: implements $new1
  });

});

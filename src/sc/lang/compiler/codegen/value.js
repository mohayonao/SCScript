(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("ValueMethodEvaluator", function(node) {
    this.state.calledSegmentedMethod = true;
    return [ "this.push(), ", this.generate(node.expr) ];
  });

  CodeGen.addGenerateMethod("ValueMethodResult", function() {
    return "this.shift()";
  });
})(sc);

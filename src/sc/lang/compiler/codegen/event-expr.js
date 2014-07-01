(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("EventExpression", function(node) {
    return [
      "$.Event(", this.insertArrayElement(node.elements), ")"
    ];
  });
})(sc);

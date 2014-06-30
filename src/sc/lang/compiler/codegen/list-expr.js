(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("ListExpression", function(node) {
    var result;

    result = [
      "$.Array(",
      this.insertArrayElement(node.elements),
    ];

    if (node.immutable) {
      result.push(", ", "true");
    }

    result.push(")");

    return result;
  });
})(sc);

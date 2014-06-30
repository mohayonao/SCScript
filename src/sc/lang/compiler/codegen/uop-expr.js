(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("UnaryExpression", function(node) {
    if (node.operator === "`") {
      return [ "$.Ref(", this.generate(node.arg), ")" ];
    }
    throw new Error("Unknown UnaryExpression: " + node.operator);
  });
})(sc);

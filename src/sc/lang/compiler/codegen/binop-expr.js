(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("BinaryExpression", function(node) {
    var operator = node.operator;

    if (operator === "===" || operator === "!==") {
      return generateEqualityOperator(this, node);
    }

    return generateBinaryExpression(this, node);
  });

  function generateEqualityOperator(that, node) {
    return [
      "$.Boolean(",
      that.generate(node.left), node.operator, that.generate(node.right),
      ")"
    ];
  }

  function generateBinaryExpression(that, node) {
    var result = [
      that.generate(node.left),
      ".$('" + node.operator + "',[", that.generate(node.right)
    ];

    if (node.adverb) {
      result.push(",", that.generate(node.adverb));
    }
    result.push("])");

    return result;
  }
})(sc);

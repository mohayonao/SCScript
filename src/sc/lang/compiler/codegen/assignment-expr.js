(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("AssignmentExpression", function(node) {
    if (Array.isArray(node.left)) {
      return generateDestructuringAssignment(this, node);
    }
    return generateSimpleAssignment(this, node);
  });

  function generateSimpleAssignment(that, node) {
    var result = [];

    var opts = { right: node.right, used: false };

    result.push(that.generate(node.left, opts));

    if (!opts.used) {
      result.push(node.operator, that.generate(opts.right));
    }

    return result;
  }

  function generateDestructuringAssignment(that, node) {
    return that.useTemporaryVariable(function(tempVar) {
      var elements = node.left;
      var operator = node.operator;

      var result = [ "(" + tempVar + "=", that.generate(node.right), "," ];

      result.push(that.interpose(elements, ",", function(item, i) {
        return generateAssign(
          that, item, operator, tempVar + ".$('at',[$.Integer(" + i + ")])"
        );
      }));

      if (node.remain) {
        result.push(",", generateAssign(
          that, node.remain, operator,
          tempVar + ".$('copyToEnd',[$.Integer(" + elements.length + ")])"
        ));
      }

      result.push(",", tempVar + ")");

      return result;
    });
  }

  function generateAssign(that, left, operator, right) {
    var opts = { right: right, used: false };
    var result = [ that.generate(left, opts) ];

    if (!opts.used) {
      result.push(operator, right);
    }

    return result;
  }
})(sc);

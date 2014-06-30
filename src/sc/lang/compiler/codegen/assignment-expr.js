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
      result.push(" " + node.operator + " ", that.generate(opts.right));
    }

    return result;
  }

  function generateDestructuringAssignment(that, node) {
    return that.scope.useTemporaryVariable(function(tempVar) {
      var elements = node.left;
      var operator = node.operator;

      var assignments = that.withIndent(function() {
        var result, lastUsedIndex;

        lastUsedIndex = elements.length;

        result = [
          that.stitchWith(elements, ",\n", function(item, i) {
            return that.addIndent(generateAssign(
              that, item, operator, tempVar + ".$('at', [ $.Integer(" + i + ") ])"
            ));
          })
        ];

        if (node.remain) {
          result.push(",\n", that.addIndent(generateAssign(
            that, node.remain, operator,
            tempVar + ".$('copyToEnd', [ $.Integer(" + lastUsedIndex + ") ])"
          )));
        }

        return result;
      });

      return [
        "(" + tempVar + " = ", that.generate(node.right), ",\n",
        assignments , ",\n",
        that.addIndent(tempVar + ")")
      ];
    });
  }

  function generateAssign(that, left, operator, right) {
    var result = [];
    var opts;

    opts = { right: right, used: false };

    result.push(that.generate(left, opts));

    if (!opts.used) {
      result.push(" " + operator + " ", right);
    }

    return result;
  }
})(sc);

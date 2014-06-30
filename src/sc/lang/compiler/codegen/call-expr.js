(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("CallExpression", function(node) {
    if (node.segmented) {
      this.state.calledSegmentedMethod = true;
    }

    if (node.args.expand) {
      return generateExpandCall(this, node);
    }

    return generateSimpleCall(this, node);
  });

  function generateSimpleCall(that, node) {
    var args;
    var list;
    var hasActualArgument;
    var result;

    list = node.args.list;
    hasActualArgument = !!list.length;

    if (node.stamp === "=") {
      result = that.useTemporaryVariable(function(tempVar) {
        return [
          "(" + tempVar + " = ", that.generate(list[0]), ", ",
          that.generate(node.callee), ".$('" + node.method.name + "', [ " + tempVar + " ]), ",
          tempVar + ")"
        ];
      });
    } else {
      if (list.length || node.args.keywords) {
        args = [
          that.stitchWith(list, ", ", function(item) {
            return that.generate(item);
          }),
          that.insertKeyValueElement(node.args.keywords, hasActualArgument)
        ];
        result = [
          that.generate(node.callee), ".$('" + node.method.name + "', [ ", args, " ])"
        ];
      } else {
        result = [
          that.generate(node.callee), ".$('" + node.method.name + "')"
        ];
      }
    }

    return result;
  }

  function generateExpandCall(that, node) {
    return that.useTemporaryVariable(function(tempVar) {
      return [
        "(" + tempVar + " = ",
        that.generate(node.callee),
        ", " + tempVar + ".$('" + node.method.name + "', ",
        that.insertArrayElement(node.args.list), ".concat(",
        that.generate(node.args.expand), ".$('asArray')._",
        that.insertKeyValueElement(node.args.keywords, true),
        ")))"
      ];
    });
  }
})(sc);

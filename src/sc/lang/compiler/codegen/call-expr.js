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
    var list = node.args.list;

    if (node.stamp === "=") {
      return that.useTemporaryVariable(function(tempVar) {
        return [
          "(" + tempVar + "=", that.generate(list[0]), ",",
          that.generate(node.callee), ".$('" + node.method.name + "',[" + tempVar + "]), ",
          tempVar + ")"
        ];
      });
    }

    if (list.length || node.args.keywords) {
      var hasActualArgument = !!list.length;
      var args = [
        that.interpose(list, ",", function(item) {
          return that.generate(item);
        }),
        insertKeyValueElement(that, node.args.keywords, hasActualArgument)
      ];
      return [
        that.generate(node.callee), ".$('" + node.method.name + "',[", args, "])"
      ];
    }

    return [
      that.generate(node.callee), ".$('" + node.method.name + "')"
    ];
  }

  function generateExpandCall(that, node) {
    return that.useTemporaryVariable(function(tempVar) {
      return [
        "(" + tempVar + "=",
        that.generate(node.callee),
        "," + tempVar + ".$('" + node.method.name + "',",
        that.insertArrayElement(node.args.list), ".concat(",
        that.generate(node.args.expand), ".$('asArray')._",
        insertKeyValueElement(that, node.args.keywords, true),
        ")))"
      ];
    });
  }

  function insertKeyValueElement(that, keyValues, withComma) {
    var result = [];

    if (keyValues) {
      if (withComma) {
        result.push(",");
      }
      result.push(
        "{", that.interpose(Object.keys(keyValues), ",", function(key) {
          return [ key, ":", that.generate(keyValues[key]) ];
        }), "}"
      );
    }

    return result;
  }
})(sc);

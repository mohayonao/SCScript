(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  CodeGen.addGenerateMethod("Identifier", function(node, opts) {
    var name = node.name;

    if (strlib.isClassName(name)) {
      return "$('" + name + "')";
    }

    if (this.scope.find(name)) {
      return name.replace(/^(?![_$])/, "$");
    }

    if (name.length === 1) {
      return generateInterpreterVariable(this, node, opts);
    }

    this.throwError(null, Message.VariableNotDefined, name);
  });

  function generateInterpreterVariable(that, node, opts) {
    var name;

    if (opts) {
      // setter
      name = that.scope.useTemporaryVariable(function(tempVar) {
        return [
          "(" + tempVar + " = ", that.generate(opts.right),
          ", $.This().$('" + node.name + "_', [ " + tempVar + " ]), " + tempVar + ")"
        ];
      });
      opts.used = true;
    } else {
      // getter
      name = "$.This().$('" + node.name + "')";
    }

    return name;
  }
})(sc);

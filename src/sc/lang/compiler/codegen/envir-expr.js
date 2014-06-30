(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("EnvironmentExpression", function(node, opts) {
    var result;

    if (opts) {
      // setter
      result = [ "$.Environment('" + node.id.name + "', ", this.generate(opts.right), ")" ];
      opts.used = true;
    } else {
      // getter
      result = "$.Environment('" + node.id.name + "')";
    }

    return result;
  });
})(sc);

(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("EnvironmentExpression", function(node, opts) {
    if (!opts) {
      // getter
      return "$.Environment('" + node.id.name + "')";
    }

    // setter
    opts.used = true;
    return [ "$.Environment('" + node.id.name + "',", this.generate(opts.right), ")" ];
  });
})(sc);

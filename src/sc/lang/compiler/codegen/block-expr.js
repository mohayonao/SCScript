(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("BlockExpression", function(node) {
    var body = this.withFunction([], function() {
      return this.generateStatements(node.body);
    });

    return [ "(", body, ")()" ];
  });
})(sc);

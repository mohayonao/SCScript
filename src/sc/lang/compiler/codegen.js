(function(sc) {
  "use strict";

  require("./compiler");
  require("./codegen/installer");

  var CodeGen = sc.lang.compiler.CodeGen;

  function compile(ast, opts) {
    return new CodeGen(opts).compile(ast);
  }

  sc.lang.compiler.codegen = { compile: compile };
})(sc);

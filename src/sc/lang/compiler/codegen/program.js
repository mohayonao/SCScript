(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("Program", function(node) {
    if (!node.body.length) {
      return [];
    }

    var body = this.withFunction([ "" ], function() { // "" compiled as $
      return this.generateStatements(node.body);
    });

    var result = [ "(", body, ")" ];

    if (!this.opts.bare) {
      result = [ "SCScript", result, ";" ];
    }

    return result;
  });
})(sc);

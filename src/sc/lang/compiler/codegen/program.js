(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("Program", function(node) {
    if (!node.body.length) {
      return [];
    }

    var body = this.withFunction([ "" ], function() { // "" compiled as $
      return generateStatements(this, node.body);
    });

    var result = [ "(", body, ")" ];

    if (!this.opts.bare) {
      result = [ "SCScript", result, ";" ];
    }

    return result;
  });

  function generateStatements(that, elements) {
    var lastIndex = elements.length - 1;

    return that.stitchWith(elements, "\n", function(item, i) {
      var stmt = that.generate(item);

      if (i === lastIndex) {
        stmt = [ "return ", stmt ];
      }

      return [ that.addIndent(stmt), ";" ];
    });
  }
})(sc);

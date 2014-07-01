(function(sc) {
  "use strict";

  require("./codegen");

  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("VariableDeclaration", function(node) {
    var scope = this.state.syncBlockScope;

    return this.stitchWith(node.declarations, ", ", function(item) {
      this.scope.add("var", item.id.name, scope);

      var result = [ this.generate(item.id) ];

      if (item.init) {
        result.push(" = ", this.generate(item.init));
      } else {
        result.push(" = $.Nil()");
      }

      return result;
    });
  });
})(sc);

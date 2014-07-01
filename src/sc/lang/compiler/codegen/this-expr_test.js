(function() {
  "use strict";

  require("./installer");

  var CodeGen = sc.lang.compiler.CodeGen;
  var Node = sc.lang.compiler.Node;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("ThisExpression", function() {
      it("work", function() {
        var codegen = new CodeGen();
        var node = Node.createThisExpression("this");

        var test = codegen.generate(node);

        expect(test).to.equal("$.This()");
      });
    });
  });
})();

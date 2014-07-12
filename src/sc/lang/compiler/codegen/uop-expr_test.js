(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var CodeGen = sc.lang.compiler.CodeGen;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("UnaryExpression", function() {
      sc.test.codegen().each([
        {
          code: "`a0",
          expected: "$.Ref($a0)",
          ast: {
            type: Syntax.UnaryExpression,
            operator: "`",
            arg: {
              type: Syntax.Identifier,
              name: "a0"
            }
          },
          before: function(codegen) {
            codegen.scope.add("var", "a0");
          }
        }
      ]);
      it("throw error if undefined unary operator", function() {
        var codegen = new CodeGen();
        expect(function() {
          codegen.generate({
            type: Syntax.UnaryExpression,
            operator: "+",
            arg: {
              type: Syntax.Identifier,
              name: "a0"
            }
          });
        }).to.throw("Unknown UnaryExpression: +");
      });
    });
  });
})();

describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var CodeGen = sc.lang.compiler.CodeGen;

  describe("Program", function() {
    sc.test.codegen().each([
      {
        code: "<empty>",
        expected: "",
        ast: {
          type: Syntax.Program,
          body: []
        }
      },
      {
        code: "nil; nil",
        expected: "SCScript(function($) { $.Nil(); return $.Nil(); });",
        ast: {
          type: Syntax.Program,
          body: [
            {
              type: Syntax.Literal,
              value: "nil",
              valueType: Token.NilLiteral
            },
            {
              type: Syntax.Literal,
              value: "nil",
              valueType: Token.NilLiteral
            }
          ]
        }
      },
    ]);

    it("bare option", function() {
      var codegen = new CodeGen(null, { bare: true });
      var test = codegen.generate({
        type: Syntax.Program,
        body: [
          {
            type: Syntax.Literal,
            value: "nil",
            valueType: Token.NilLiteral
          }
        ]
      }).replace(/[\s\n]+/g, " ");
      expect(test).to.equal("(function($){return $.Nil();})");
    });
  });
});

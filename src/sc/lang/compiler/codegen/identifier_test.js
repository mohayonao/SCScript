describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var CodeGen = sc.lang.compiler.CodeGen;
  var strlib = sc.libs.strlib;

  describe("Identifier", function() {
    sc.test.codegen().each([
      {
        code: "a",
        expected: "$.This().$('a')",
        ast: {
          type: Syntax.Identifier,
          name: "a"
        }
      },
      {
        code: "a0",
        expected: "$a0",
        ast: {
          type: Syntax.Identifier,
          name: "a0"
        },
        before: function(codegen) {
          codegen.scope.add("var", "a0");
        }
      },
      {
        code: "Object",
        expected: "$('Object')",
        ast: {
          type: Syntax.Identifier,
          name: "Object"
        }
      },
      {
        code: "a = 10",
        expected: "(_ref0 = $.Integer(10), $.This().$('a_', [ _ref0 ]), _ref0)",
        ast: {
          type: Syntax.AssignmentExpression,
          left: {
            type: Syntax.Identifier,
            name: "a"
          },
          right: {
            type: Syntax.Literal,
            value: "10",
            valueType: Token.IntegerLiteral
          }
        }
      },
    ]);
    it("throw error if not declared", function() {
      var codegen = new CodeGen();
      expect(function() {
        codegen.generate({
          type: Syntax.Identifier,
          name: "notDefinedVariable"
        });
      }).to.throw(strlib.format(Message.VariableNotDefined, "notDefinedVariable"));
    });
  });
});

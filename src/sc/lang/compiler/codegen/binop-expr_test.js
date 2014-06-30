(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("BinaryExpression", function() {
      sc.test.codegen().each([
        {
          code: "1 + 2",
          expected: "$.Integer(1).$('+', [ $.Integer(2) ])",
          ast: {
            type: Syntax.BinaryExpression,
            operator: "+",
            left: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral
            },
            right: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral
            }
          }
        },
        {
          code: "1 +.f 2",
          expected: "$.Integer(1).$('+', [ $.Integer(2), $.Symbol('f') ])",
          ast: {
            type: Syntax.BinaryExpression,
            operator: "+",
            left: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral
            },
            right: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral
            },
            adverb: {
              type: Syntax.Literal,
              value: "f",
              valueType: Token.SymbolLiteral
            }
          }
        },
        {
          code: "1 !== 2",
          expected: "$.Boolean($.Integer(1) !== $.Integer(2))",
          ast: {
            type: Syntax.BinaryExpression,
            operator: "!==",
            left: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral
            },
            right: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral
            }
          }
        },
      ]);
    });
  });
})();

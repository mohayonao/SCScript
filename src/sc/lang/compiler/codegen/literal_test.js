describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("Literal", function() {
    sc.test.codegen().each([
      {
        code: "nil",
        expected: "$.Nil()",
        ast: {
          type: Syntax.Literal,
          value: "nil",
          valueType: Token.NilLiteral
        }
      },
      {
        code: "true",
        expected: "$.True()",
        ast: {
          type: Syntax.Literal,
          value: "true",
          valueType: Token.TrueLiteral
        }
      },
      {
        code: "false",
        expected: "$.False()",
        ast: {
          type: Syntax.Literal,
          value: "false",
          valueType: Token.FalseLiteral
        }
      },
      {
        code: "10",
        expected: "$.Integer(10)",
        ast: {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral
        }
      },
      {
        code: "10.0",
        expected: "$.Float(10.0)",
        ast: {
          type: Syntax.Literal,
          value: "10.0",
          valueType: Token.FloatLiteral
        }
      },
      {
        code: "\\10",
        expected: "$.Symbol('10')",
        ast: {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.SymbolLiteral
        }
      },
      {
        code: '"10"',
        expected: "$.String('10')",
        ast: {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.StringLiteral
        }
      },
      {
        code: "$a",
        expected: "$.Char('a')",
        ast: {
          type: Syntax.Literal,
          value: "a",
          valueType: Token.CharLiteral
        }
      },
    ]);
  });
});

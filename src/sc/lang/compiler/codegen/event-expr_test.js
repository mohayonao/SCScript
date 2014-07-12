describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("EventExpression", function() {
    sc.test.codegen().each([
      {
        code: "(a:10, b:20)",
        expected: "$.Event([ $.Symbol('a'), $.Integer(10), $.Symbol('b'), $.Integer(20), ])",
        ast: {
          type: Syntax.EventExpression,
          elements: [
            {
              type: Syntax.Literal,
              value: "a",
              valueType: Token.SymbolLiteral
            },
            {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral
            },
            {
              type: Syntax.Literal,
              value: "b",
              valueType: Token.SymbolLiteral
            },
            {
              type: Syntax.Literal,
              value: "20",
              valueType: Token.IntegerLiteral
            }
          ]
        }
      }
    ]);
  });

});

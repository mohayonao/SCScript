(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("AssignmentExpression", function() {
      sc.test.codegen().each([
        {
          code: "a = 10",
          expected: "(_ref0 = $.Integer(10), $.This().$('a_', [ _ref0 ]), _ref0)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
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
        {
          code: "a0 = 10",
          expected: "$a0 = $.Integer(10)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a0"
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral
            }
          },
        },
        {
          code: "a0 = a1 = 10",
          expected: "$a0 = $a1 = $.Integer(10)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a0"
            },
            right: {
              type: Syntax.AssignmentExpression,
              operator: "=",
              left: {
                type: Syntax.Identifier,
                name: "a1"
              },
              right: {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral
              }
            }
          },
        },
        {
          code: "#a0, a1 = a2",
          expected: "(_ref0 = $a2, " +
                     "  $a0 = _ref0.$('at', [ $.Integer(0) ]), " +
                     "  $a1 = _ref0.$('at', [ $.Integer(1) ]), " +
                     "_ref0)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a0"
              },
              {
                type: Syntax.Identifier,
                name: "a1"
              }
            ],
            right: {
              type: Syntax.Identifier,
              name: "a2"
            }
          }
        },
        {
          code: "#a0, a1 = #a2, a3 = a4",
          expected: "(_ref0 = " +
                    "  (_ref1 = $a4, " +
                    "    $a2 = _ref1.$('at', [ $.Integer(0) ]), " +
                    "    $a3 = _ref1.$('at', [ $.Integer(1) ]), " +
                    "  _ref1), " +
                    "  $a0 = _ref0.$('at', [ $.Integer(0) ]), " +
                    "  $a1 = _ref0.$('at', [ $.Integer(1) ]), " +
                    "_ref0)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a0"
              },
              {
                type: Syntax.Identifier,
                name: "a1"
              }
            ],
            right: {
              type: Syntax.AssignmentExpression,
              operator: "=",
              left: [
                {
                  type: Syntax.Identifier,
                  name: "a2"
                },
                {
                  type: Syntax.Identifier,
                  name: "a3"
                }
              ],
              right: {
                type: Syntax.Identifier,
                name: "a4"
              }
            }
          }
        },
        {
          code: "#a0...a1 = a2",
          expected: "(_ref0 = $a2, " +
                    "$a0 = _ref0.$('at', [ $.Integer(0) ]), " +
                    "$a1 = _ref0.$('copyToEnd', [ $.Integer(1) ]), " +
                    "_ref0)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a0"
              }
            ],
            remain: {
              type: Syntax.Identifier,
              name: "a1"
            },
            right: {
              type: Syntax.Identifier,
              name: "a2"
            }
          }
        },
        {
          code: "#a, b = c",
          expected: "(_ref0 = $.This().$('c'), " +
                    "  (_ref1 = _ref0.$('at', [ $.Integer(0) ]), " +
                    "    $.This().$('a_', [ _ref1 ]), _ref1), " +
                    "  (_ref1 = _ref0.$('at', [ $.Integer(1) ]), " +
                    "    $.This().$('b_', [ _ref1 ]), _ref1), " +
                    "_ref0)",
          ast: {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a"
              },
              {
                type: Syntax.Identifier,
                name: "b"
              }
            ],
            right: {
              type: Syntax.Identifier,
              name: "c"
            }
          }
        },
      ]);
    });
  });
})();

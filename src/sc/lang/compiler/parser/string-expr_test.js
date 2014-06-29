(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseStringExpression", function() {
      sc.test.compile(this.title).each({
        '"str"': sc.test.OK,
        '"#{freq}hz"': sc.test.OK,
        '"ab" "cd" "ef"': sc.test.OK,
        '"ab" "#{cd}"': sc.test.OK,
        '"#{ab}" "cd"': sc.test.OK,
        "'sym'": Message.UnexpectedSymbol,
      });
      sc.test.parse(this.title).each({
        '"str"': {
          type: Syntax.Literal,
          value: "str",
          valueType: Token.StringLiteral,
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        '"#{freq}hz"': {
          type: Syntax.BinaryExpression,
          operator: "++",
          left: {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "freq"
            },
            method: {
              type: Syntax.Identifier,
              name: "asString"
            },
            args: {
              list: []
            }
          },
          right: {
            type: Syntax.Literal,
            value: "hz",
            valueType: Token.StringLiteral
          },
          range: [ 0, 11 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 11 },
          }
        },
        '"ab" "cd" "ef"': {
          type: Syntax.Literal,
          value: "abcdef",
          valueType: Token.StringLiteral,
          range: [ 0, 14 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 14 },
          }
        },
        '"ab" "#{cd}"': {
          type: Syntax.BinaryExpression,
          operator: "++",
          left: {
            type: Syntax.Literal,
            value: "ab",
            valueType: Token.StringLiteral
          },
          right: {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "cd"
            },
            method: {
              type: Syntax.Identifier,
              name: "asString"
            },
            args: {
              list: []
            }
          },
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        },
        '"#{ab}" "cd"': {
          type: Syntax.BinaryExpression,
          operator: "++",
          left: {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "ab"
            },
            method: {
              type: Syntax.Identifier,
              name: "asString"
            },
            args: {
              list: []
            }
          },
          right: {
            type: Syntax.Literal,
            value: "cd",
            valueType: Token.StringLiteral
          },
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 },
          }
        }
      });
    });
  });
})();

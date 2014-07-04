(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parsePrimaryExpression", function() {
      sc.test.compile(this.title).each({
        "()": sc.test.OK,
        "{}": sc.test.OK,
        "[]": sc.test.OK,
        "#[]": sc.test.OK,
        "#{}": sc.test.OK,
        "`0": sc.test.OK,
        "~a": sc.test.OK,
        "this ": sc.test.OK,
        "freq ": sc.test.OK,
        '"str"': sc.test.OK,
        "nil ": sc.test.OK,
        "+1": strlib.format(Message.UnexpectedToken, "+"),
      });
      sc.test.parse(this.title).each({
        "()": {
          type: Syntax.EventExpression,
          elements: [],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "{}": {
          type: Syntax.FunctionExpression,
          body: [],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "[]": {
          type: Syntax.ListExpression,
          elements: [],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "#[]": {
          type: Syntax.ListExpression,
          immutable: true,
          elements: [],
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        },
        "#{}": {
          type: Syntax.FunctionExpression,
          closed: true,
          body: [],
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        },
        "`0": {
          type: Syntax.UnaryExpression,
          operator: "`",
          arg: {
            type: Syntax.Literal,
            value: "0",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            }
          },
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "~a": {
          type: Syntax.EnvironmentExpression,
          id: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            }
          },
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "this ": {
          type: Syntax.ThisExpression,
          name: "this",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 },
          }
        },
        "freq ": {
          type: Syntax.Identifier,
          name: "freq",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 },
          }
        },
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
        "nil ": {
          type: Syntax.Literal,
          value: "nil",
          valueType: Token.NilLiteral,
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        }
      });
    });
    describe("parsePrimaryArgExpression", function() {
      sc.test.compile(this.title).each({
        "#[]": sc.test.OK,
        "nil ": sc.test.OK,
        "true ": sc.test.OK,
        "false ": sc.test.OK,
        "0 ": sc.test.OK,
        "0.0": sc.test.OK,
        "'sym'": sc.test.OK,
        "$a ": sc.test.OK,
        "a ": Message.UnexpectedIdentifier,
        "#{}": strlib.format(Message.UnexpectedToken, "{"),
      });
      sc.test.parse(this.title).each({
        "#[]": {
          type: Syntax.ListExpression,
          immutable: true,
          elements: [],
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        },
        "nil ": {
          type: Syntax.Literal,
          value: "nil",
          valueType: Token.NilLiteral,
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        },
        "true ": {
          type: Syntax.Literal,
          value: "true",
          valueType: Token.TrueLiteral,
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 },
          }
        },
        "false ": {
          type: Syntax.Literal,
          value: "false",
          valueType: Token.FalseLiteral,
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "0 ": {
          type: Syntax.Literal,
          value: "0",
          valueType: Token.IntegerLiteral,
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 },
          }
        },
        "0.0": {
          type: Syntax.Literal,
          value: "0.0",
          valueType: Token.FloatLiteral,
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 },
          }
        },
        "'sym'": {
          type: Syntax.Literal,
          value: "sym",
          valueType: Token.SymbolLiteral,
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 },
          }
        },
        "$a ": {
          type: Syntax.Literal,
          value: "a",
          valueType: Token.CharLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
      });
    });
  });
})();

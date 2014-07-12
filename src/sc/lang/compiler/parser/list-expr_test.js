describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseListExpression", function() {
    sc.test.compile(this.title).each({
      "[1, 2]": sc.test.OK,
      "[a: 2]": sc.test.OK,
      "[1: 2]": sc.test.OK,
      "(1, 2)": strlib.format(Message.UnexpectedToken, "("),
    });

    sc.test.parse(this.title).each({
      "[1, 2]": {
        type: Syntax.ListExpression,
        elements: [
          {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            }
          },
          {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 },
        }
      },
      "[a: 2]": {
        type: Syntax.ListExpression,
        elements: [
          {
            type: Syntax.Literal,
            value: "a",
            valueType: Token.SymbolLiteral,
            range: [ 1, 3 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 3 },
            }
          },
          {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 },
        }
      },
      "[1: 2]": {
        type: Syntax.ListExpression,
        elements: [
          {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            }
          },
          {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 },
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 },
        }
      }
    });
  });

  describe("parseImmutableListExpression", function() {
    sc.test.compile(this.title).each({
      "#[1, 2]": sc.test.OK,
      "#[ 0, #[ 1, 2 ] ]": strlib.format(Message.UnexpectedToken, "#"),
      "[1, 2]": strlib.format(Message.UnexpectedToken, "["),
    });

    sc.test.parse(this.title).each({
      "#[1, 2]": {
        type: Syntax.ListExpression,
        elements: [
          {
            type: Syntax.Literal,
            value: "1",
            valueType: Token.IntegerLiteral,
            range: [ 2, 3 ],
            loc: {
              start: { line: 1, column: 2 },
              end: { line: 1, column: 3 },
            }
          },
          {
            type: Syntax.Literal,
            value: "2",
            valueType: Token.IntegerLiteral,
            range: [ 5, 6 ],
            loc: {
              start: { line: 1, column: 5 },
              end: { line: 1, column: 6 },
            }
          }
        ],
        immutable: true,
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 7 },
        }
      },
    });
  });
});

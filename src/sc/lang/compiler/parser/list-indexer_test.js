describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseListIndexer", function() {
    sc.test.compile(this.title).each({
      "[1]": sc.test.OK,
      "[..]": sc.test.OK,
      "[..10]": sc.test.OK,
      "[1..]": sc.test.OK,
      "[1,5]": sc.test.OK,
      "[1,5..]": sc.test.OK,
      "[1..10]": sc.test.OK,
      "[1,5..10]": sc.test.OK,
      "[]": strlib.format(Message.UnexpectedToken, "]"),
      "[1": strlib.format(Message.UnexpectedEOS),
      "[,5..10]": strlib.format(Message.UnexpectedToken, ","),
      "(1)": strlib.format(Message.UnexpectedToken, "("),
    });

    sc.test.parse(this.title).each({
      "[1]": [
        {
          type: Syntax.Literal,
          value: "1",
          valueType: Token.IntegerLiteral,
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 },
          }
        }
      ],
      "[..]": [
        null,
        null,
        null
      ],
      "[..10]": [
        null,
        null,
        {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 3, 5 ],
          loc: {
            start: { line: 1, column: 3 },
            end: { line: 1, column: 5 },
          }
        }
      ],
      "[1..]": [
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
        null,
        null
      ],
      "[1,5]": [
        {
          type: Syntax.Literal,
          value: "1",
          valueType: Token.IntegerLiteral,
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 },
          }
        }
      ],
      "[1,5..]": [
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
          value: "5",
          valueType: Token.IntegerLiteral,
          range: [ 3, 4 ],
          loc: {
            start: { line: 1, column: 3 },
            end: { line: 1, column: 4 },
          }
        },
        null
      ],
      "[1..10]": [
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
        null,
        {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 4, 6 ],
          loc: {
            start: { line: 1, column: 4 },
            end: { line: 1, column: 6 },
          }
        }
      ],
      "[1,5..10]": [
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
          value: "5",
          valueType: Token.IntegerLiteral,
          range: [ 3, 4 ],
          loc: {
            start: { line: 1, column: 3 },
            end: { line: 1, column: 4 },
          }
        },
        {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 6, 8 ],
          loc: {
            start: { line: 1, column: 6 },
            end: { line: 1, column: 8 },
          }
        }
      ]
    });
  });
});

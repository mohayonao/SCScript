(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseExpression", function() {
      sc.test.compile(this.title).each({
        "10 ": sc.test.OK,
        ";": strlib.format(Message.UnexpectedToken, ";"),
      });
      sc.test.parse(this.title).each({
        "10 ": {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        }
      });
    });
    describe("parseExpressions", function() {
      sc.test.compile(this.title).each({
        "10;": sc.test.OK,
        "10 ]": sc.test.OK,
        "10;]": sc.test.OK,
        "10; 20": sc.test.OK,
        ";": strlib.format(Message.UnexpectedToken, ";"),
        "]": strlib.format(Message.UnexpectedToken, "]"),
      });
      sc.test.parse(this.title).each({
        "10;": {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "10 ]": {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "10;]": {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "10; 20": [
          {
            type: Syntax.Literal,
            value: "10",
            valueType: Token.IntegerLiteral,
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 },
            }
          },
          {
            type: Syntax.Literal,
            value: "20",
            valueType: Token.IntegerLiteral,
            range: [ 4, 6 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 6 },
            }
          }
        ]
      });
    });
  });
})();

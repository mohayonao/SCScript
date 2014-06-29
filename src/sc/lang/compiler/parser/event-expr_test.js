(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseEventExpression", function() {
      sc.test.compile(this.title).each({
        "(a: 1, b :2)": sc.test.OK,
        "(1)": strlib.format(Message.UnexpectedToken, ")"),
        "(..1)": strlib.format(Message.UnexpectedToken, ".."),
      });
      sc.test.parse(this.title).each({
        "(a: 1, b :2)": {
          type: Syntax.EventExpression,
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
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 },
              }
            },
            {
              type: Syntax.Identifier,
              name: "b",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 },
              }
            },
            {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
              range: [ 10, 11 ],
              loc: {
                start: { line: 1, column: 10 },
                end: { line: 1, column: 11 },
              }
            }
          ],
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

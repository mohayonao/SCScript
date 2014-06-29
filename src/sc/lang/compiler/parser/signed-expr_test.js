(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseSignedExpression", function() {
      sc.test.compile(this.title).each({
        "a ": sc.test.OK,
        "-a": sc.test.OK,
        "-1": sc.test.OK,
        "-1.0": sc.test.OK,
        "+": strlib.format(Message.UnexpectedToken, "+"),
      });
      sc.test.parse(this.title).each({
        "a ": {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        "-a": {
          type: Syntax.CallExpression,
          callee: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          },
          method: {
            type: Syntax.Identifier,
            name: "neg",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 }
            }
          },
          args: {
            list: []
          },
          stamp: ".",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
        "-1": {
          type: Syntax.Literal,
          value: "-1",
          valueType: Token.IntegerLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
        "-1.0": {
          type: Syntax.Literal,
          value: "-1.0",
          valueType: Token.FloatLiteral,
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
      });
    });
  });
})();

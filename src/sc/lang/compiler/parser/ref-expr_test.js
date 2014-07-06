(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseRefExpression", function() {
      sc.test.compile(this.title).each({
        "`a": sc.test.OK,
        "`a.b": sc.test.OK,
        "a ": strlib.format(Message.UnexpectedIdentifier),
      });
      sc.test.parse(this.title).each({
        "`a": {
          type: Syntax.UnaryExpression,
          operator: "`",
          arg: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          },
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
        "`a.b": { // `(a.b)
          type: Syntax.UnaryExpression,
          operator: "`",
          arg: {
            type: Syntax.CallExpression,
            stamp: "(",
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
              name: "b",
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 }
              }
            },
            args: {
              list: []
            },
            range: [ 1, 4 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 4 }
            }
          },
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

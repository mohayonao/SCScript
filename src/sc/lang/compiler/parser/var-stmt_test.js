(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseVariableStatement", function() {
      sc.test.compile(this.title).each({
        "var a;": sc.test.OK,
        "var a, b;": sc.test.OK,
        "var a=0, b=0;": sc.test.OK,
        "var a=0": strlib.format(Message.UnexpectedEOS),
        "var a,a": strlib.format(Message.Redeclaration, "var", "a"),
      });
      sc.test.parse(this.title).each({
        "var a;": {
          type: Syntax.VariableDeclaration,
          kind: "var",
          declarations: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 }
                }
              },
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 }
              }
            }
          ],
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
        "var a, b;": {
          type: Syntax.VariableDeclaration,
          kind: "var",
          declarations: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 }
                }
              },
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 }
              }
            },
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "b",
                range: [ 7, 8 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 8 }
                }
              },
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 }
              }
            }
          ],
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 }
          }
        },
        "var a=0, b=0;": {
          type: Syntax.VariableDeclaration,
          kind: "var",
          declarations: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 5 }
                }
              },
              init: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 7 }
                }
              },
              range: [ 4, 7 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 7 }
              }
            },
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "b",
                range: [ 9, 10 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end: { line: 1, column: 10 }
                }
              },
              init: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              },
              range: [ 9, 12 ],
              loc: {
                start: { line: 1, column: 9 },
                end: { line: 1, column: 12 }
              }
            }
          ],
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 }
          }
        }
      });
    });
  });
})();

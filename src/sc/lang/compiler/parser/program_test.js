(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseProgram", function() {
      sc.test.compile(this.title).each({
        "10 ": sc.test.OK,
        "var a;": sc.test.OK,
      });
      sc.test.parse(this.title).each({
        "10 ": {
          type: Syntax.Program,
          body: [
            {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 2 }
              }
            }
          ],
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        },
        "var a;": {
          type: Syntax.Program,
          body: [
            {
              type: Syntax.VariableDeclaration,
              declarations: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 },
                    }
                  },
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 },
                  }
                }
              ],
              kind: "var",
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
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
        "(var a;)": {
          type: Syntax.Program,
          body: [
            {
              type: Syntax.VariableDeclaration,
              declarations: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                    range: [ 5, 6 ],
                    loc: {
                      start: { line: 1, column: 5 },
                      end: { line: 1, column: 6 },
                    }
                  },
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 6 },
                  }
                }
              ],
              kind: "var",
              range: [ 1, 6 ],
              loc: {
                start: { line: 1, column: 1 },
                end: { line: 1, column: 6 },
              }
            }
          ],
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 },
          }
        }
      });
    });
  });
})();

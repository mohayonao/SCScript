(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseProgram", function() {
      it("parse", function() {
        _.chain({
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
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseProgram(), items[0]).to.eql(items[1]);
        });
      });
    });
  });
})();

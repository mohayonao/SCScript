(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseRefExpression", function() {
      it("parse", function() {
        _.chain({
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
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseRefExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "a ": "unexpected identifier",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseRefExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseHashedExpression", function() {
      it("parse", function() {
        _.chain({
          "#[]": {
            type: Syntax.ListExpression,
            elements: [],
            immutable: true,
            range: [ 0, 3 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 3 },
            }
          },
          "#{}": {
            type: Syntax.FunctionExpression,
            body: [],
            closed: true,
            range: [ 0, 3 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 3 },
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseHashedExpression(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "#()": "unexpected token #",
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseHashedExpression();
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

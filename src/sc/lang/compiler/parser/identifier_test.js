(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseIdentifier", function() {
      it("parse", function() {
        _.chain({
          "value ": {
            type: Syntax.Identifier,
            name: "value",
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 }
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseIdentifier(), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "1234 ": "unexpected number",
          "_ ": "unexpected identifier"
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseIdentifier();
          }).to.throw(items[1]);
        });
      });
    });
    describe("parsePrimaryIdentifier", function() {
      it("parse", function() {
        _.chain({
          "value ": {
            type: Syntax.Identifier,
            name: "value",
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 }
            }
          },
          "_ ": {
            type: Syntax.Identifier,
            name: "$_0",
            range: [ 0, 1 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 }
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parsePrimaryIdentifier(), items[0]).to.eql(items[1]);
        });
      });
    });
    describe("parseIdentifier( variable: true)", function() {
      it("parse", function() {
        _.chain({
          "value ": {
            type: Syntax.Identifier,
            name: "value",
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 }
            }
          }
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(p.parseIdentifier({ variable: true }), items[0]).to.eql(items[1]);
        });
      });
      it("error", function() {
        _.chain({
          "_ ": "unexpected identifier",
          "Object ": "unexpected identifier"
        }).pairs().each(function(items) {
          var p = new Parser(null, new Lexer(items[0], { loc: true, range: true } ));
          expect(function() {
            p.parseIdentifier({ variable: true });
          }).to.throw(items[1]);
        });
      });
    });
  });
})();

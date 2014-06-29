(function() {
  "use strict";

  require("./lexer");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var Lexer = sc.lang.compiler.Lexer;
  var Marker = sc.lang.compiler.Marker;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Lexer", function() {
    it("Lexer", function() {
      var lexer, token, test;

      lexer = new Lexer("a = 0");
      test = lexer.getLocItems();

      expect(test).to.eql([ 0, 1, 0 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("a");
      expect(test).to.eql([ 1, 1, 1 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("=");
      expect(test).to.eql([ 3, 1, 3 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("0");
      expect(test).to.eql([ 5, 1, 5 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("<EOF>");
      expect(test).to.eql([ 5, 1, 5 ]);
    });
    it("throw error from Lexer", function() {
      var lexer = new Lexer();
      expect(function() {
        lexer.throwError({
          range: [ 0, 0 ],
          lineNumber: 1,
          lintStart: 0
        }, "ERROR");
      }).to.throw("ERROR");
    });

    it("lex / unlex", function() {
      var lexer = new Lexer("a = 0");
      var token, saved;

      token = lexer.lex();
      expect(token, 1).to.eql({
        type: Token.Identifier,
        value: "a",
        lineNumber: 1,
        lineStart: 0,
        range: [ 0, 1 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 1 }
        }
      });

      token = lexer.lex();
      expect(token, 2).to.eql({
        type: Token.Punctuator,
        value: "=",
        lineNumber: 1,
        lineStart: 0,
        range: [ 2, 3 ],
        loc: {
          start: { line: 1, column: 2 },
          end: { line: 1, column: 3 }
        }
      });

      token = lexer.lex();
      expect(token, 3).to.eql({
        type: Token.IntegerLiteral,
        value: "0",
        lineNumber: 1,
        lineStart: 0,
        range: [ 4, 5 ],
        loc: {
          start: { line: 1, column: 4 },
          end: { line: 1, column: 5 }
        }
      });
      saved = token;

      lexer.unlex(token);

      token = lexer.lex();
      expect(token, 4).to.eql({
        type: Token.IntegerLiteral,
        value: "0",
        lineNumber: 1,
        lineStart: 0,
        range: [ 4, 5 ],
        loc: {
          start: { line: 1, column: 4 },
          end: { line: 1, column: 5 }
        }
      });
    });
    it("createMarker", sinon.test(function() {
      this.stub(Marker, "create", sc.test.func());

      var lexer = new Lexer("a = 0");
      var test = lexer.createMarker(12345);

      expect(Marker.create).to.be.calledWith(lexer, 12345);
      expect(Marker.create).to.be.calledLastIn(test);
    }));
    describe("tokeninze", function() {
      _.chain({
        "": [],
        "    \n\t": [],
        "// single line comment\n": [],
        "/*\n/* / * */\n*/": [],
        "$a ": [
          { type: Token.CharLiteral, value: "a" }
        ],
        "\\a": [
          { type: Token.SymbolLiteral, value: "a" }
        ],
        "'a'": [
          { type: Token.SymbolLiteral, value: "a" }
        ],
        '"a"': [
          { type: Token.StringLiteral, value: "a" }
        ],
        "_ ": [
          { type: Token.Identifier, value: "_" }
        ],
        "a ": [
          { type: Token.Identifier, value: "a" }
        ],
        "A ": [
          { type: Token.Identifier, value: "A" }
        ],
        "0 ": [
          { type: Token.IntegerLiteral, value: "0" }
        ],
        "+ ": [
          { type: Token.Punctuator, value: "+" }
        ],
      }).pairs().each(function(items) {
        var code = items[0], expected = items[1];
        it(code, function() {
          var lexer = new Lexer(code);
          var tokens = lexer.tokenize();
          expect(tokens).to.eql(expected);
        });
      });
      it("with location", function() {
        var code = "\n\t0";
        var expected = [
          {
            type: Token.IntegerLiteral,
            value: "0",
            range: [ 2, 3 ],
            loc: {
              start: { line: 2, column: 1 },
              end: { line: 2, column: 2 },
            }
          }
        ];
        var lexer = new Lexer(code, { range: true, loc: true });
        var tokens = lexer.tokenize();
        expect(tokens).to.eql(expected);
      });
      it("error", function() {
        var code = "0 '";
        var lexer = new Lexer(code);
        expect(function() {
          lexer.tokenize();
        }).to.throw(strlib.format(Message.UnexpectedToken, "'"));
      });
    });
  });
})();

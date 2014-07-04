(function() {
  "use strict";

  require("./");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var Parser = sc.lang.compiler.Parser;
  var Lexer = sc.lang.compiler.Lexer;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    it("parse", sinon.test(function() {
      var parser = new Parser(null, new Lexer(""));
      this.stub(parser, "parseProgram");

      parser.parse();

      expect(parser.parseProgram).called;
    }));
    it("lex", sinon.test(function() {
      var lexer = new Lexer("");
      var parser = new Parser(null, lexer);
      this.stub(lexer, "lex", sc.test.func());

      var test = parser.lex();

      expect(lexer.lex).to.be.calledLastIn(test);
    }));
    it("unlex", sinon.test(function() {
      var lexer = new Lexer("");
      var parser = new Parser(null, lexer);
      this.stub(lexer, "unlex", sc.test.func());

      var token = Math.random();
      var test = parser.unlex(token);

      expect(lexer.unlex).to.be.calledWith(token);
      expect(test).to.be.equal(parser);
    }));
    it("expect", function() {
      var lexer = new Lexer(".");
      var parser = new Parser(null, lexer);

      var test = parser.expect(".");

      expect(test).to.be.a("object");
    });
    it("expect not match", function() {
      var lexer = new Lexer(";");
      var parser = new Parser(null, lexer);

      expect(function() {
        parser.expect(".");
      }).to.throw(strlib.format(Message.UnexpectedToken, ";"));
    });
    it("match", function() {
      var lexer = new Lexer("@ - @");
      var parser = new Parser(null, lexer);

      expect(parser.match("-"), 1).to.be.false;
      expect(parser.match("-"), 2).to.be.false;
      expect(parser.match("@"), 3).to.be.true;
      expect(parser.match("@"), 4).to.be.true;
      parser.lex();
      expect(parser.match("@"), 5).to.be.false;
      expect(parser.match("@"), 6).to.be.false;
      expect(parser.match("-"), 7).to.be.true;
      expect(parser.match("-"), 8).to.be.true;
      parser.lex();
      expect(parser.match("-"), 9).to.be.false;
      expect(parser.match("-"),10).to.be.false;
      expect(parser.match("@"),11).to.be.true;
      expect(parser.match("@"),12).to.be.true;
    });
    it("matchAny", function() {
      var lexer = new Lexer("<@ - @>");
      var parser = new Parser(null, lexer);

      expect(parser.matchAny([ "<", "@", "-" ]), 1).to.be.null;
      expect(parser.matchAny([ "<@", "-"     ]), 2).to.equal("<@");
    });
    it("createMarker", sinon.test(function() {
      var lexer = new Lexer("");
      var parser = new Parser(null, lexer);
      this.stub(lexer, "createMarker", sc.test.func());

      var node = Math.random();
      var test = parser.createMarker(node);

      expect(lexer.createMarker).to.be.calledWith(node);
      expect(lexer.createMarker).to.be.calledLastIn(test);
    }));
    it("hasNextToken", function() {
      var lexer = new Lexer("1 + 2");
      var parser = new Parser(null, lexer);

      expect(parser.hasNextToken(), 1).to.be.true;
      parser.lex();

      expect(parser.hasNextToken(), 2).to.be.true;
      parser.lex();

      expect(parser.hasNextToken(), 3).to.be.true;
      parser.lex();

      expect(parser.hasNextToken(), 4).to.be.false;
    });
    it("throwUnexpected", function() {
      var lexer = new Lexer("");
      var parser = new Parser(null, lexer);
      expect(function() {
        parser.throwUnexpected({ type: Token.EOF });
      }).to.throw(strlib.format(Message.UnexpectedEOS));
      expect(function() {
        parser.throwUnexpected({ type: Token.FloatLiteral });
      }).to.throw(strlib.format(Message.UnexpectedNumber));
      expect(function() {
        parser.throwUnexpected({ type: Token.IntegerLiteral });
      }).to.throw(strlib.format(Message.UnexpectedNumber));
      expect(function() {
        parser.throwUnexpected({ type: Token.CharLiteral });
      }).to.throw(strlib.format(Message.UnexpectedLiteral, "char"));
      expect(function() {
        parser.throwUnexpected({ type: Token.SymbolLiteral });
      }).to.throw(strlib.format(Message.UnexpectedLiteral, "symbol"));
      expect(function() {
        parser.throwUnexpected({ type: Token.StringLiteral });
      }).to.throw(strlib.format(Message.UnexpectedLiteral, "string"));
      expect(function() {
        parser.throwUnexpected({ type: Token.TrueLiteral });
      }).to.throw(strlib.format(Message.UnexpectedLiteral, "true"));
      expect(function() {
        parser.throwUnexpected({ type: Token.FalseLiteral });
      }).to.throw(strlib.format(Message.UnexpectedLiteral, "false"));
      expect(function() {
        parser.throwUnexpected({ type: Token.NilLiteral });
      }).to.throw(strlib.format(Message.UnexpectedLiteral, "nil"));
      expect(function() {
        parser.throwUnexpected({ type: Token.Keyword });
      }).to.throw(strlib.format(Message.UnexpectedKeyword));
      expect(function() {
        parser.throwUnexpected({ type: Token.Label });
      }).to.throw(strlib.format(Message.UnexpectedLabel));
      expect(function() {
        parser.throwUnexpected({ type: Token.Identifier });
      }).to.throw(strlib.format(Message.UnexpectedIdentifier));
      expect(function() {
        parser.throwUnexpected({ type: Token.Punctuator, value: "!" });
      }).to.throw(strlib.format(Message.UnexpectedToken, "!"));
    });
    it("addToScope / withScope", function() {
      var lexer = new Lexer("");
      var parser = new Parser(null, lexer);
      parser.addToScope("arg", "a");
      expect(function() {
        parser.addToScope("var", "a");
      }).to.throw(strlib.format(Message.VariableAlreadyDeclared, "a"));
      expect(function() {
        parser.addToScope("arg", "a");
      }).to.throw(strlib.format(Message.ArgumentAlreadyDeclared, "a"));
      parser.withScope(function() {
        expect(function() {
          parser.addToScope("var", "a");
        }).to.not.throw();
      });
    });
    it("sub parser", function() {
      var lexer = new Lexer("");
      var parser1 = new Parser(null, lexer);
      var parser2 = new Parser(parser1);
      expect(parser2.state).to.equal(parser1.state);
      expect(parser2.lexer).to.equal(parser1.lexer);
    });
  });
})();

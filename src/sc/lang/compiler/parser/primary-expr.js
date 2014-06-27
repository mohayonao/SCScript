(function(sc) {
  "use strict";

  require("./interpolate-string");
  require("./parser");
  require("./parentheses");
  require("./braces");
  require("./expression");
  require("./ref-expr");
  require("./envir-expr");
  require("./this-expr");
  require("./primary-expr");
  require("./hashed-expr");
  require("./literal");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Lexer = sc.lang.compiler.Lexer;
  var InterpolateString = sc.lang.compiler.InterpolateString;
  var Parser = sc.lang.compiler.Parser;

  /*
    PrimaryExpression :
      ( ... )
      { ... }
      [ ... ]
      ~ ...
      ` ...
      Keyword
      Identifier
      StringLiteral
      ArgumentableValue
  */
  Parser.addParseMethod("PrimaryExpression", function() {
    var stamp = this.matchAny([ "(", "{", "[", "#", "`", "~" ]) || this.lookahead.type;

    switch (stamp) {
    case "(":
      return this.parseParentheses();
    case "{":
      return this.parseBraces();
    case "[":
      return this.parseListExpression();
    case "`":
      return this.parseRefExpression();
    case "~":
      return this.parseEnvironmentExpression();
    case Token.Keyword:
      return this.parseThisExpression();
    case Token.Identifier:
      return this.parsePrimaryIdentifier();
    case Token.StringLiteral:
      return this.parseStringExpression();
    }

    return this.parsePrimaryArgExpression();
  });

  /*
    PrimaryArgExpression :
      HashedExpression
      CharLiteral
      FloatLiteral
      FalseLiteral
      IntegerLiteral
      NilLiteral
      SymbolLiteral
      TrueLiteral
  */
  Parser.addParseMethod("PrimaryArgExpression", function() {
    var marker = this.createMarker();

    var stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;

    var expr;
    switch (stamp) {
    case "#":
      expr = this.parseHashedExpression();
      break;
    case Token.CharLiteral:
    case Token.FloatLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.NilLiteral:
    case Token.SymbolLiteral:
    case Token.TrueLiteral:
      expr = this.parseLiteral();
      break;
    }

    if (!expr) {
      expr = {};
      this.throwUnexpected(this.lex());
    }

    return marker.update().apply(expr);
  });

  Parser.addParseMethod("StringExpression", function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(null, new Lexer(code, {})).parseExpression();
    }

    return Node.createLiteral(token);
  });
})(sc);

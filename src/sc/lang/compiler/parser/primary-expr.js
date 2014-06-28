(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Parser = sc.lang.compiler.Parser;

  /*
    PrimaryExpression :
      ( ... )
      { ... }
      ListExpression
      HashedExpression
      RefExpression
      EnvironmentExpression
      ThisExpression
      PrimaryIdentifier
      StringExpression
      PrimaryArgExpression
  */
  Parser.addParseMethod("PrimaryExpression", function() {
    switch (this.matchAny([ "(", "{", "[", "#", "`", "~" ])) {
    case "(": return this.parseParentheses();
    case "{": return this.parseBraces();
    case "[": return this.parseListExpression();
    case "#": return this.parseHashedExpression();
    case "`": return this.parseRefExpression();
    case "~": return this.parseEnvironmentExpression();
    }

    switch (this.lookahead.type) {
    case Token.Keyword:       return this.parseThisExpression();
    case Token.Identifier:    return this.parsePrimaryIdentifier();
    case Token.StringLiteral: return this.parseStringExpression();
    }

    return this.parsePrimaryArgExpression();
  });

  /*
    PrimaryArgExpression :
      ImmutableListExpression
      NilLiteral
      TrueLiteral
      FalseLiteral
      IntegerLiteral
      FloatLiteral
      SymbolLiteral
      CharLiteral
  */
  Parser.addParseMethod("PrimaryArgExpression", function() {
    if (this.match("#")) {
      return this.parseImmutableListExpression();
    }

    switch (this.lookahead.type) {
    case Token.NilLiteral:
    case Token.TrueLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.FloatLiteral:
    case Token.SymbolLiteral:
    case Token.CharLiteral:
      return this.parseLiteral();
    }

    return this.throwUnexpected(this.lex());
  });
})(sc);

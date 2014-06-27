(function(sc) {
  "use strict";

  require("./base-parser");

  var Token = sc.lang.compiler.Token;
  var BaseParser = sc.lang.compiler.BaseParser;

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
  BaseParser.addParseMethod("PrimaryExpression", function() {
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
  BaseParser.addParseMethod("PrimaryArgExpression", function() {
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
})(sc);

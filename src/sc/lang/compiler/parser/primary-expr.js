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
  BaseParser.addMethod("parsePrimaryExpression", function() {
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

    return this.parseArgumentableValue(stamp);
  });
})(sc);

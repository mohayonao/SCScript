(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;

  /*
    HashedExpression :
      ImmutableListExpression
      ClosedFunctionExpression
  */
  Parser.addParseMethod("HashedExpression", function() {
    var token = this.expect("#");

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      return this.unlex(token).parseImmutableListExpression();
    case "{":
      return this.unlex(token).parseClosedFunctionExpression();
    }
    this.throwUnexpected(this.lookahead);

    return {};
  });
})(sc);

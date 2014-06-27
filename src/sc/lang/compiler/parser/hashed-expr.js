(function(sc) {
  "use strict";

  require("./base-parser");

  var BaseParser = sc.lang.compiler.BaseParser;

  /*
    HashedExpression :
      ImmutableListExpression
      ClosedFunctionExpression
  */
  BaseParser.addParseMethod("HashedExpression", function() {
    var lookahead = this.lookahead;

    var token = this.expect("#");

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      return this.unlex(token).parseImmutableListExpression(lookahead);
    case "{":
      return this.unlex(token).parseClosedFunctionExpression();
    }
    this.throwUnexpected(this.lookahead);

    return {};
  });
})(sc);

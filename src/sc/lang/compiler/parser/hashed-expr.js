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

    if (this.match("[")) {
      return this.unlex(token).parseImmutableListExpression();
    }
    if (this.match("{")) {
      return this.unlex(token).parseClosedFunctionExpression();
    }

    return this.throwUnexpected(token);
  });
})(sc);

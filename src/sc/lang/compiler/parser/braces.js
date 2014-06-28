(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;

  /*
    Braces :
      { : GeneratorExpression }
      {   FunctionExpression  }
  */
  Parser.addParseMethod("Braces", function(opts) {
    opts = opts || {};
    var token = this.expect("{");
    var colon = this.match(":");

    this.unlex(token);

    if (colon && !opts.blockList) {
      return this.parseGeneratorExpression();
    }

    return this.parseFunctionExpression(opts);
  });
})(sc);

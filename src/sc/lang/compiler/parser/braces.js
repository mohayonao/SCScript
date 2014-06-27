(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;

  /*
    Braces :
      { : GeneratorInitialiser }
      {   FunctionExpression   }
  */
  Parser.addParseMethod("Braces", function(opts) {
    opts = opts || /* istanbul ignore next */ {};
    var marker = this.createMarker();

    var token = this.expect("{");
    var matchColon = this.match(":");
    this.unlex(token);

    var expr;
    if (!opts.blockList && matchColon) {
      expr = this.parseGeneratorExpression();
    } else {
      expr = this.parseFunctionExpression(opts);
    }

    return marker.update().apply(expr);
  });
})(sc);

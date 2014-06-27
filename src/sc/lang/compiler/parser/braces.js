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
    if (!opts.blocklist && matchColon) {
      expr = this.parseGeneratorExpression();
    } else {
      expr = this.parseFunctionExpression({
        closed: this.state.closedFunction,
        blocklist: opts.blocklist
      });
    }

    return marker.update().apply(expr);
  });
})(sc);

(function(sc) {
  "use strict";

  require("./base-parser");

  var BaseParser = sc.lang.compiler.BaseParser;

  /*
    Braces :
      { : GeneratorInitialiser }
      {   FunctionExpression   }
  */
  BaseParser.addMethod("parseBraces", function(opts) {
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

(function(sc) {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./marker");
  require("./node");
  require("./parser/parser");
  require("./parser/program");

  var Lexer = sc.lang.compiler.lexer;
  var Parser = sc.lang.compiler.Parser;

  var parse = function(source, opts) {
    opts = opts || /* istanbul ignore next */ {};

    var parser = new Parser(null, new Lexer(source, opts));
    var ast = parser.parseProgram();

    if (!!opts.tolerant && typeof parser.lexer.errors !== "undefined") {
      ast.errors = parser.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = { parse: parse };
})(sc);

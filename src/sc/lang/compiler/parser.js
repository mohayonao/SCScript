(function(sc) {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./marker");
  require("./parser/installer");

  var Lexer = sc.lang.compiler.Lexer;
  var Parser = sc.lang.compiler.Parser;

  var parse = function(source, opts) {
    opts = opts || {};
    return new Parser(null, new Lexer(source, opts)).parseProgram();
  };

  sc.lang.compiler.parser = { parse: parse };
})(sc);

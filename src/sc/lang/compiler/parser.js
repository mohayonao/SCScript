(function(sc) {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./marker");
  require("./node");
  require("./parser/base-parser");
  require("./parser/program");
  require("./parser/expression");
  require("./parser/partial-expr");
  require("./parser/left-hand-side-expr");
  require("./parser/primary-expr");
  require("./parser/function-expr");
  require("./parser/assignment-expr");
  require("./parser/binop-expr");
  require("./parser/envir-expr");
  require("./parser/ref-expr");
  require("./parser/this-expr");
  require("./parser/list-expr");
  require("./parser/list-indexer");
  require("./parser/event-expr");
  require("./parser/series-expr");
  require("./parser/generator-expr");
  require("./parser/signed-expr");
  require("./parser/hashed-expr");
  require("./parser/identifier");
  require("./parser/label");
  require("./parser/literal");
  require("./parser/parentheses");
  require("./parser/braces");

  var Lexer = sc.lang.compiler.lexer;
  var BaseParser = sc.lang.compiler.BaseParser;

  var parse = function(source, opts) {
    opts = opts || /* istanbul ignore next */ {};

    var parser = new BaseParser(null, new Lexer(source, opts));
    var ast = parser.parseProgram();

    if (!!opts.tolerant && typeof parser.lexer.errors !== "undefined") {
      ast.errors = parser.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = { parse: parse };
})(sc);

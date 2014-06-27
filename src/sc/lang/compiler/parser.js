(function(sc) {
  "use strict";

  require("./compiler");
  require("./lexer");
  require("./marker");
  require("./node");
  require("./interpolate-string");
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
  require("./parser/hashed-expr");
  require("./parser/identifier");
  require("./parser/parentheses");
  require("./parser/braces");

  var Lexer = sc.lang.compiler.lexer;
  var Node = sc.lang.compiler.Node;
  var InterpolateString = sc.lang.compiler.InterpolateString;
  var BaseParser = sc.lang.compiler.BaseParser;
  var BinaryExpressionParser = sc.lang.compiler.BinaryExpressionParser;

  function Parser(source, opts) {
    opts = opts || /* istanbul ignore next */ {};

    BaseParser.call(this, null, new Lexer(source, opts));
    this.opts = opts;

    var binaryPrecedence;
    if (this.opts.binaryPrecedence) {
      if (typeof this.opts.binaryPrecedence === "object") {
        binaryPrecedence = this.opts.binaryPrecedence;
      } else {
        binaryPrecedence = BinaryExpressionParser.binaryPrecedenceDefaults;
      }
    }

    this.state.binaryPrecedence = binaryPrecedence || {};
  }
  sc.libs.extend(Parser, BaseParser);

  Parser.prototype.parse = function() {
    return this.parseProgram();
  };

  // TODO: move
  BaseParser.addMethod("parseStringExpression", function() {
    var token = this.lex();

    if (InterpolateString.hasInterpolateString(token.value)) {
      var code = new InterpolateString(token.value).toCompiledString();
      return new Parser(code, {}).parseExpression();
    }

    return Node.createLiteral(token);
  });

  var parse = function(source, opts) {
    opts = opts || /* istanbul ignore next */ {};

    var instance = new Parser(source, opts);
    var ast = instance.parse();

    if (!!opts.tolerant && typeof instance.lexer.errors !== "undefined") {
      ast.errors = instance.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = { parse: parse };
})(sc);

(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("GeneratorExpression", function() {
    return new GeneratorExpressionParser(this).parse();
  });

  function GeneratorExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(GeneratorExpressionParser, Parser);

  GeneratorExpressionParser.prototype.parse = function() {
    this.expect("{");
    this.expect(":"); // TODO: ;

    var expr = this.parseExpressions();
    var clauses = this.parseClauses().concat(expr);

    this.expect("}");

    return compile(clauses);
  };

  GeneratorExpressionParser.prototype.parseClauses = function() {
    var elements = [];

    while (this.match(",")) {
      this.lex();
      elements.push(this.parseClause());
    }

    return elements;
  };

  GeneratorExpressionParser.prototype.parseClause = function() {
    if (this.match("var")) {
      return this.parseVarClause();
    }
    if (this.match(":")) {
      this.lex();
      if (this.match(":")) {
        this.lex();
        return this.parseSideEffectClause();
      }
      return this.parseTerminationClause();
    }

    return this.parseClauseStartsWithIdentifier();
  };

  GeneratorExpressionParser.prototype.parseClauseStartsWithIdentifier = function() {
    var lookahead = this.lookahead;
    var first  = this.parseIdentifierIf();
    var second = this.parseIdentifierIf();

    if (this.match("<-")) {
      this.lex();
      return this.parseGeneratorClause([ first, second ]);
    }

    this.unlex(lookahead);
    return this.parseGuardClause();
  };

  GeneratorExpressionParser.prototype.parseIdentifierIf = function() {
    if (this.lookahead.type === Token.Identifier) {
      return this.parseIdentifier();
    }
    return null;
  };

  GeneratorExpressionParser.prototype.parseGeneratorClause = function(args) {
    return {
      type: "generator",
      args: args,
      expr: this.parseExpressions()
    };
  };

  GeneratorExpressionParser.prototype.parseGuardClause = function() {
    return {
      type: "guard",
      expr: this.parseExpressions()
    };
  };

  GeneratorExpressionParser.prototype.parseVarClause = function() {
    this.lex();
    return {
      type: "value",
      expr: this.parseDeclarator({
        type: "var",
        delegate: function() {
          return this.parseBinaryExpression();
        }
      })
    };
  };

  GeneratorExpressionParser.prototype.parseTerminationClause = function() {
    var token = this.lex();
    if (token.type !== Token.Identifier || token.value !== "while") {
      this.throwUnexpected(token);
    }

    return {
      type: "termination",
      expr: this.parseExpressions()
    };
  };

  GeneratorExpressionParser.prototype.parseSideEffectClause = function() {
    return {
      type: "drop",
      expr: this.parseExpressions()
    };
  };

  function compile(clauses) {
    return Node.createCallExpression(
      Node.createFunctionExpression(null, [ next(clauses) ], {}),
      Node.createIdentifier("r")
    );
  }

  function next(clauses) {
    var clause = clauses.shift();

    if (clauses.length === 0) {
      return Node.createCallExpression(
        clause, Node.createIdentifier("yield")
      );
    }

    return creator[clause.type](clause, clauses);
  }

  function createCallExpression(callee, method, args) {
    return Node.createCallExpression(
      callee, Node.createIdentifier(method), { list: args }
    );
  }

  function createFunctionExpression(args, body) {
    return Node.createFunctionExpression(args, [ body ], {});
  }

  var creator = {
    generator: function(clause, clauses) {
      // expr.do { |args| <next> }
      var args = {
        list: clause.args.filter(function(node) {
          return node !== null;
        }).map(function(node) {
          return Node.createVariableDeclarator(node);
        })
      };
      return createCallExpression(clause.expr, "do", [
        createFunctionExpression(args, next(clauses))
      ]);
    },
    value: function(clause, clauses) {
      // { <next> }.value(expr)
      var args = {
        list: [ Node.createVariableDeclarator(clause.expr.id) ]
      };
      return createCallExpression(
        createFunctionExpression(args, next(clauses)),
        "value", [ clause.expr.init ]
      );
    },
    guard: function(clause, clauses) {
      // expr.if { <next> }
      return createCallExpression(
        clause.expr,
        "if",
        [ createFunctionExpression(null, next(clauses)) ]
      );
    },
    drop: function(clause, clauses) {
      // expr; <next>
      return [ clause.expr, next(clauses) ];
    },
    termination: function(clause, clauses) {
      // expr.if { <next } { nil.alwaysYield }
      var nil$alwaysYield = createCallExpression(
        Node.createLiteral({ type: Token.NilLiteral, value: "nil" }),
        "alwaysYield", []
      );
      return createCallExpression(
        clause.expr,
        "if",
        [
          createFunctionExpression(null, next(clauses)),
          createFunctionExpression(null, nil$alwaysYield)
        ]
      );
    }
  };
})(sc);

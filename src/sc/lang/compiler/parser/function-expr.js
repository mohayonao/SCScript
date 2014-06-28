(function(sc) {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    FunctionExpression :
      { FunctionParameterDeclaration(opt) FunctionBody(opt) }

    FunctionParameterDeclaration :
         | FunctionParameter |
      args FunctionParameter ;

    FunctionParameter :
      FunctionParameterElements
      FunctionParameterElements ... Identifier
                                ... Identifier

    FunctionParameterElements :
      FunctionParameterElement
      FunctionParameterElements , FunctionParameterElement

    FunctionParameterElement :
      Identifier
      Identifier = parsePrimaryArgExpression
  */
  Parser.addParseMethod("FunctionExpression", function(opts) {
    return new FunctionExpressionParser(this).parse(opts);
  });

  /*
    FunctionBody :
      VariableStatements(opt) SourceElements(opt)

    VariableStatements :
      VariableStatement
      VariableStatements VariableStatement

    VariableStatement :
      var VariableDeclarationList ;

    VariableDeclarationList :
      VariableDeclaration
      VariableDeclarationList , VariableDeclaration

    VariableDeclaration :
      Identifier
      Identifier = AssignmentExpression

    SourceElements :
      Expression
      SourceElements ; Expression
  */
  Parser.addParseMethod("FunctionBody", function() {
    return new FunctionExpressionParser(this).parseFunctionBody();
  });

  /*
    ClosedFunctionExpression :
      # FunctionExpression
  */
  Parser.addParseMethod("ClosedFunctionExpression", function() {
    var marker = this.createMarker();
    this.expect("#");

    var expr = this.parseFunctionExpression({ closed: true });

    return marker.update().apply(expr, true);
  });

  function FunctionExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(FunctionExpressionParser, Parser);

  FunctionExpressionParser.prototype.parse = function(opts) {
    opts = opts || {};

    var marker = this.createMarker();

    this.expect("{");

    var node = this.withScope(function() {
      var args = this.parseFunctionParameterDeclaration();
      var body = this.parseFunctionBody();
      return Node.createFunctionExpression(args, body, opts);
    });

    this.expect("}");

    return marker.update().apply(node);
  };

  FunctionExpressionParser.prototype.parseFunctionParameterDeclaration = function() {
    if (this.match("|")) {
      return this.parseFunctionParameter("|");
    }
    if (this.match("arg")) {
      return this.parseFunctionParameter(";");
    }
    return null;
  };

  FunctionExpressionParser.prototype.parseFunctionParameter = function(sentinel) {
    this.lex();

    var args = {
      list: this.parseFunctionParameterElements(sentinel)
    };

    if (this.match("...")) {
      this.lex();
      args.remain = this.parseIdentifier({ variable: true });
      this.scope.add("arg", args.remain.name);
    }

    this.expect(sentinel);

    return args;
  };

  FunctionExpressionParser.prototype.parseFunctionParameterElements = function(sentinel) {
    var elements = [];

    if (!this.match("...")) {
      while (this.hasNextToken()) {
        elements.push(this.parseFunctionParameterElement());
        if (this.matchAny([ sentinel, "..." ]) || (sentinel === ";" && !this.match(","))) {
          break;
        }
        if (this.match(",")) {
          this.lex();
        }
      }
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseFunctionParameterElement = function() {
    var node = this.parseDeclaration("arg", function() {
      return this.parsePrimaryArgExpression();
    });

    if (node.init && !isValidArgumentValue(node.init)) {
      this.throwUnexpected(this.lookahead);
    }

    return node;
  };

  FunctionExpressionParser.prototype.parseFunctionBody = function() {
    return this.parseVariableStatements().concat(this.parseSourceElements());
  };

  FunctionExpressionParser.prototype.parseVariableStatements = function() {
    var elements = [];

    while (this.match("var")) {
      elements.push(this.parseVariableStatement());
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseVariableStatement = function() {
    var marker = this.createMarker();

    this.lex(); // var

    var declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarationList(), "var"
    );
    declaration = marker.update().apply(declaration);

    this.expect(";");

    return declaration;
  };

  FunctionExpressionParser.prototype.parseVariableDeclarationList = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclaration());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.hasNextToken());

    return list;
  };

  FunctionExpressionParser.prototype.parseVariableDeclaration = function() {
    return this.parseDeclaration("var", function() {
      return this.parseAssignmentExpression();
    });
  };

  FunctionExpressionParser.prototype.parseSourceElements = function() {
    var elements = [];

    while (this.hasNextToken() && !this.matchAny([ "}", ")" ])) {
      elements.push(this.parseExpression());
      if (this.matchAny([ "}", ")" ])) {
        break;
      }
      if (this.hasNextToken()) {
        this.expect(";");
      }
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseDeclaration = function(type, delegate) {
    var marker = this.createMarker();

    var identifier = this.parseIdentifier({ variable: true });
    this.scope.add(type, identifier.name);

    var initialValue = this.parseInitialiser(delegate);

    return marker.update().apply(
      Node.createVariableDeclarator(identifier, initialValue)
    );
  };

  FunctionExpressionParser.prototype.parseInitialiser = function(delegate) {
    if (!this.match("=")) {
      return null;
    }
    this.lex();
    return delegate.call(this);
  };

  function isValidArgumentValue(node) {
    if (node.type === Syntax.Literal) {
      return true;
    }
    return node.type === Syntax.ListExpression && node.immutable;
  }
})(sc);

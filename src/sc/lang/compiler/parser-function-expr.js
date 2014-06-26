(function(sc) {
  "use strict";

  require("./compiler");
  require("./node");
  require("./parser-base");

  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  /*
    FunctionExpression :
      { FunctionArgumentDefinition(opt) FunctionBody(opt) }

    FunctionArgumentDefinition :
         | FunctionArguments |
      args FunctionArguments ;

    FunctionArguments :
      FunctionArgumentList
      FunctionArgumentList ... VariableIdentifier
                           ... VariableIdentifier

    FunctionArgumentList :
      FunctionArgumentElement
      FunctionArgumentList , FunctionArgumentElement

    FunctionArgumentElement :
      VariableIdentifier
      VariableIdentifier = ArgumentableValue

    FunctionBody :
      VariableDeclarations(opt) SourceElements(opt)

    VariableDeclarations :
      VariableDeclaration
      VariableDeclarations VariableDeclaration

    VariableDeclaration :
      var VariableDeclarationList ;

    VariableDeclarationList :
      VariableDeclarationElement
      VariableDeclarationList , VariableDeclarationElement

    VariableDeclarationElement :
      VariableIdentifier
      VariableIdentifier = AssignmentExpression

    SourceElements :
      Expression
      SourceElements ; Expression

  */

  function FunctionExpressionParser(parent) {
    BaseParser.call(this, parent.lexer, parent.state, parent.scope);
    this.parent = parent;
  }
  sc.libs.extend(FunctionExpressionParser, BaseParser);

  FunctionExpressionParser.prototype.parse = function(closed, blocklist) {
    this.expect("{");

    var node = this.withScope(function() {
      var args = this.parseFunctionArgumentDefinition();
      var body = this.parseFunctionBody("}");
      return Node.createFunctionExpression(args, body, closed, false, blocklist);
    });

    this.expect("}");

    return node;
  };

  FunctionExpressionParser.prototype.parseFunctionArgumentDefinition = function() {
    if (this.match("|")) {
      return this.parseFunctionArguments("|");
    }
    if (this.match("arg")) {
      return this.parseFunctionArguments(";");
    }
    return null;
  };

  FunctionExpressionParser.prototype.parseFunctionArguments = function(expect) {
    var args = { list: [] };

    this.lex();

    args.list = this.parseFunctionArgumentList(expect);

    if (this.match("...")) {
      this.lex();
      args.remain = this.parent.parseVariableIdentifier();
      this.scope.add("arg", args.remain.name);
    }

    this.expect(expect);

    return args;
  };

  FunctionExpressionParser.prototype.parseFunctionArgumentList = function(expect) {
    var elements = [];

    if (!this.match("...")) {
      do {
        elements.push(this.parseFunctionArgumentElement());
        if ((expect !== "|" && !this.match(",")) || this.matchAny([ expect, "..." ])) {
          break;
        }
        if (this.match(",")) {
          this.lex();
        }
      } while (this.hasNextToken());
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseFunctionArgumentElement = function() {
    var node = this._parseArgVarElement("arg", function() {
      return this.parent.parseArgumentableValue();
    });

    if (node.init && !isValidArgumentValue(node.init)) {
      this.throwUnexpected(this.lookahead);
    }

    return node;
  };

  FunctionExpressionParser.prototype.parseFunctionBody = function(match) {
    return this.parseVariableDeclarations().concat(this.parseSourceElements(match));
  };

  FunctionExpressionParser.prototype.parseVariableDeclarations = function() {
    var elements = [];

    while (this.match("var")) {
      elements.push(this.parseVariableDeclaration());
    }

    return elements;
  };

  FunctionExpressionParser.prototype.parseVariableDeclaration = function() {
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
      list.push(this.parseVariableDeclarationElement());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.hasNextToken());

    return list;
  };

  FunctionExpressionParser.prototype.parseVariableDeclarationElement = function() {
    return this._parseArgVarElement("var", function() {
      return this.parent.parseAssignmentExpression();
    });
  };

  FunctionExpressionParser.prototype.parseSourceElements = function(match) {
    var elements = [];

    while (this.hasNextToken() && !this.match(match)) {
      elements.push(this.parseExpression());
      if (this.hasNextToken() && !this.match(match)) {
        this.expect(";");
      } else {
        break;
      }
    }

    return elements;
  };

  FunctionExpressionParser.prototype._parseArgVarElement = function(type, func) {
    var marker = this.createMarker();

    var id = this.parent.parseVariableIdentifier();
    this.scope.add(type, id.name);

    var init = null;
    if (this.match("=")) {
      this.lex();
      init = func.call(this);
    }

    var declarator = Node.createVariableDeclarator(id, init);

    return marker.update().apply(declarator);
  };

  function isValidArgumentValue(node) {
    if (node.type === Syntax.Literal) {
      return true;
    }
    if (node.type === Syntax.ListExpression) {
      return node.elements.every(function(node) {
        return node.type === Syntax.Literal;
      });
    }

    return false;
  }

  sc.lang.compiler.FunctionExpressionParser = FunctionExpressionParser;
})(sc);

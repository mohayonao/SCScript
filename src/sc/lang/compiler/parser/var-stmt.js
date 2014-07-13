(function(sc) {
  "use strict";

  require("./parser");

  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    VariableStatement :
      var VariableDeclarators ;

    VariableDeclarators :
      Declarator
      VariableDeclarators , Declarator
  */
  Parser.addParseMethod("VariableStatement", function(opts) {
    return new VariableStatementParser(this).parse(opts);
  });

  /*
    Declarator :
      Identifier
      Identifier = AssignmentExpression
  */
  Parser.addParseMethod("Declarator", function(opts) {
    return new DeclaratorParser(this).parse(opts);
  });

  function VariableStatementParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(VariableStatementParser, Parser);

  VariableStatementParser.prototype.parse = function() {
    var marker = this.createMarker();

    this.lex(); // var

    var declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarators(), "var"
    );
    declaration = marker.update().apply(declaration);

    this.expect(";");

    return declaration;
  };

  VariableStatementParser.prototype.parseVariableDeclarators = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclarator());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.hasNextToken());

    return list;
  };

  VariableStatementParser.prototype.parseVariableDeclarator = function() {
    return this.parseDeclarator({
      type: "var",
      delegate: function() {
        return this.parseAssignmentExpression();
      }
    });
  };

  function DeclaratorParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(DeclaratorParser, Parser);

  DeclaratorParser.prototype.parse = function(opts) {
    var marker = this.createMarker();

    var identifier = this.parseIdentifier({ variable: true });
    this.addToScope(opts.type, identifier.name);

    var initialValue = this.parseInitialiser(opts.delegate);

    return marker.update().apply(
      Node.createVariableDeclarator(identifier, initialValue)
    );
  };

  DeclaratorParser.prototype.parseInitialiser = function(delegate) {
    if (!this.match("=")) {
      return null;
    }
    this.lex();

    return delegate.call(this);
  };
})(sc);

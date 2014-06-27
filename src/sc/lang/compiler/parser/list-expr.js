(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    ListExpression :
      [ ListElements(opts) ]

    ListElements :
      ListElement
      ListElements , ListElement

    ListElement :
      Expression : Expression
      Expression
  */
  Parser.addParseMethod("ListExpression", function() {
    return new ListExpressionParser(this).parse();
  });

  /*
    ImmutableListExpression :
      # ListExpression
  */
  Parser.addParseMethod("ImmutableListExpression", function() {
    if (this.state.immutableList) {
      this.throwUnexpected(this.lookahead);
    }

    var expr;
    this.state.immutableList = true;
    this.expect("#");
    expr = this.parseListExpression();
    this.state.immutableList = false;

    return expr;
  });

  function ListExpressionParser(parent) {
    Parser.call(this, parent);
    this.parent = parent;
  }
  sc.libs.extend(ListExpressionParser, Parser);

  ListExpressionParser.prototype.parse = function() {
    this.expect("[");

    var elements = this.parseListElements();

    this.expect("]");

    return Node.createListExpression(elements, this.state.immutableList);
  };

  ListExpressionParser.prototype.parseListElements = function() {
    var elements = [];
    var innerElements = this.state.innerElements;

    this.state.innerElements = true;

    while (this.hasNextToken() && !this.match("]")) {
      elements = elements.concat(this.parseListElement());
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return elements;
  };

  ListExpressionParser.prototype.parseListElement = function() {
    var elements = [];

    if (this.lookahead.type === Token.Label) {
      elements.push(this.parseLabel(), this.parseExpression());
    } else {
      elements.push(this.parseExpression());
      if (this.match(":")) {
        this.lex();
        elements.push(this.parseExpression());
      }
    }

    return elements;
  };
})(sc);

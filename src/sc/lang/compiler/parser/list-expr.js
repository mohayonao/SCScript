(function(sc) {
  "use strict";

  require("./base-parser");

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
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addMethod("parseListExpression", function() {
    return new ListExpressionParser(this).parse();
  });

  function ListExpressionParser(parent) {
    BaseParser.call(this, parent.lexer, parent.state);
    this.parent = parent;
  }
  sc.libs.extend(ListExpressionParser, BaseParser);

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

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
      Label         Expressions
      Expressions : Expressions
      Expressions
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
    var marker = this.createMarker();

    this.expect("#");

    this.state.immutableList = true;
    var expr = this.parseListExpression();
    this.state.immutableList = false;

    return marker.update().apply(expr, true);
  });

  function ListExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(ListExpressionParser, Parser);

  ListExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    this.expect("[");

    var elements = this.parseListElements();

    this.expect("]");

    return marker.update().apply(
      Node.createListExpression(elements, this.state.immutableList)
    );
  };

  ListExpressionParser.prototype.parseListElements = function() {
    var innerElements = this.state.innerElements;
    this.state.innerElements = true;

    var elements = [];
    while (this.hasNextToken() && !this.match("]")) {
      elements.push.apply(elements, this.parseListElement());
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return elements;
  };

  ListExpressionParser.prototype.parseListElement = function() {
    if (this.lookahead.type === Token.Label) {
      return [ this.parseLabelAsSymbol(), this.parseExpressions() ];
    }

    var elements = [ this.parseExpressions() ];
    if (this.match(":")) {
      this.lex();
      elements.push(this.parseExpressions());
    }

    return elements;
  };
})(sc);

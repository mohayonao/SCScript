(function(sc) {
  "use strict";

  require("./base-parser");

  var Token = sc.lang.compiler.Token;
  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addParseMethod("BinaryExpression", function() {
    return new BinaryExpressionParser(this).parse();
  });

  function BinaryExpressionParser(parent) {
    BaseParser.call(this, parent);

    // TODO: fix (this.binaryPrecedence = sc.config.binaryPrecedence)
    var binaryPrecedence;
    if (sc.config.binaryPrecedence) {
      if (typeof sc.config.binaryPrecedence === "object") {
        binaryPrecedence = sc.config.binaryPrecedence;
      } else {
        binaryPrecedence = sc.lang.compiler.binaryPrecedenceDefaults;
      }
    }

    this.binaryPrecedence = binaryPrecedence || {};
  }
  sc.libs.extend(BinaryExpressionParser, BaseParser);

  BinaryExpressionParser.prototype.parse = function(node) {
    var marker = this.createMarker();
    var left   = this.parseLeftHandSideExpression(node);
    var operator = this.lookahead;

    var prec = calcBinaryPrecedence(operator, this.binaryPrecedence);
    if (prec === 0) {
      if (node) {
        return this.parseLeftHandSideExpression(node);
      }
      return left;
    }
    this.lex();

    operator.prec   = prec;
    operator.adverb = this.parseAdverb();

    return this.sortByBinaryPrecedence(left, operator, marker);
  };

  // TODO: fix to read easily
  BinaryExpressionParser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var markers = [ marker, this.createMarker() ];
    var right = this.parseLeftHandSideExpression();

    var stack = [ left, operator, right ];

    var prec, expr;
    while ((prec = calcBinaryPrecedence(this.lookahead, this.binaryPrecedence)) > 0) {
      prec = sortByBinaryPrecedence(prec, stack, markers);

      // Shift.
      var token = this.lex();
      token.prec = prec;
      token.adverb = this.parseAdverb();

      stack.push(token);

      markers.push(this.createMarker());
      expr = this.parseLeftHandSideExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    var i = stack.length - 1;
    expr = stack[i];
    markers.pop();
    while (i > 1) {
      expr = Node.createBinaryExpression(stack[i - 1], stack[i - 2], expr);
      i -= 2;
      marker = markers.pop();
      marker.update().apply(expr);
    }

    return expr;
  };

  /* TODO: ???
    Adverb :
      . PrimaryExpression
  */
  BinaryExpressionParser.prototype.parseAdverb = function() {
    if (!this.match(".")) {
      return null;
    }

    this.lex();

    var lookahead = this.lookahead;
    var adverb = this.parsePrimaryExpression();

    if (adverb.type === Syntax.Literal) {
      return adverb;
    }

    if (adverb.type === Syntax.Identifier) {
      adverb.type = Syntax.Literal;
      adverb.value = adverb.name;
      adverb.valueType = Token.SymbolLiteral;
      delete adverb.name;
      return adverb;
    }

    this.throwUnexpected(lookahead);

    return null;
  };

  function calcBinaryPrecedence(token, binaryPrecedence) {
    var prec = 0;

    switch (token.type) {
    case Token.Punctuator:
      if (token.value !== "=") {
        if (binaryPrecedence.hasOwnProperty(token.value)) {
          prec = binaryPrecedence[token.value];
        } else if (/^[-+*\/%<=>!?&|@]+$/.test(token.value)) {
          prec = 255;
        }
      }
      break;
    case Token.Label:
      prec = 255;
      break;
    }

    return prec;
  }

  function sortByBinaryPrecedence(prec, stack, markers) {
    // Reduce: make a binary expression from the three topmost entries.
    while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
      var right    = stack.pop();
      var operator = stack.pop();
      var left     = stack.pop();
      var expr = Node.createBinaryExpression(operator, left, right);
      markers.pop();

      var marker = markers.pop();
      marker.update().apply(expr);

      stack.push(expr);

      markers.push(marker);
    }

    return prec;
  }
})(sc);

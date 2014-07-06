(function(sc) {
  "use strict";

  require("./parser");

  var Token = sc.lang.compiler.Token;
  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    BinaryExpression :
      CallExpression BinaryExpressionOperator BinaryExpressionAdverb(opts) BinaryExpression

    BinaryExpressionOperator :
      /[-+*\/%<=>!?&|@]+/
      LabelLiteral

    BinaryExpressionAdverb :
      . Identifier
      . IntegerLiteral
  */
  Parser.addParseMethod("BinaryExpression", function() {
    return new BinaryExpressionParser(this).parse();
  });

  function BinaryExpressionParser(parent) {
    Parser.call(this, parent);
    this.binaryPrecedence = sc.config.get("binaryPrecedence");
  }
  sc.libs.extend(BinaryExpressionParser, Parser);

  BinaryExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();

    var expr = this.parseCallExpression();

    var prec = this.calcBinaryPrecedence(this.lookahead);
    if (prec === 0) {
      return expr;
    }

    var operator = this.parseBinaryExpressionOperator(prec);

    return this.sortByBinaryPrecedence(expr, operator, marker);
  };

  BinaryExpressionParser.prototype.calcBinaryPrecedence = function(token) {
    if (token.type === Token.Label) {
      return 255;
    }

    if (token.type === Token.Punctuator) {
      var operator = token.value;
      if (operator === "=") {
        return 0;
      }
      if (isBinaryOperator(operator)) {
        return this.binaryPrecedence[operator] || 255;
      }
    }

    return 0;
  };

  BinaryExpressionParser.prototype.parseBinaryExpressionOperator = function(prec) {
    var operator = this.lex();
    operator.prec = prec;
    operator.adverb = this.parseBinaryExpressionAdverb();
    return operator;
  };

  BinaryExpressionParser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var markerStack = [ marker, this.createMarker() ];
    var exprOpStack = [ left, operator, this.parseCallExpression() ];

    var prec;
    while ((prec = this.calcBinaryPrecedence(this.lookahead)) > 0) {
      sortByBinaryPrecedence(prec, exprOpStack, markerStack);

      operator = this.parseBinaryExpressionOperator(prec);

      markerStack.push(this.createMarker());
      exprOpStack.push(operator, this.parseCallExpression());
    }

    return reduceBinaryExpressionStack(exprOpStack, markerStack);
  };

  BinaryExpressionParser.prototype.parseBinaryExpressionAdverb = function() {
    if (!this.match(".")) {
      return null;
    }

    this.lex();

    var lookahead = this.lookahead;
    var adverb = this.parsePrimaryExpression();

    if (isInteger(adverb)) {
      return adverb;
    }

    if (isAdverb(adverb)) {
      return this.createMarker(adverb).update().apply(
        Node.createLiteral({ type: Token.SymbolLiteral, value: adverb.name })
      );
    }

    return this.throwUnexpected(lookahead);
  };

  function sortByBinaryPrecedence(prec, exprOpStack, markerStack) {
    while (isNeedSort(prec, exprOpStack)) {
      var right    = exprOpStack.pop();
      var operator = exprOpStack.pop();
      var left     = exprOpStack.pop();
      markerStack.pop();
      exprOpStack.push(peek(markerStack).update().apply(
        Node.createBinaryExpression(operator, left, right)
      ));
    }
  }

  function reduceBinaryExpressionStack(exprOpStack, markerStack) {
    markerStack.pop();

    var expr = exprOpStack.pop();
    while (exprOpStack.length) {
      expr = markerStack.pop().update().apply(
        Node.createBinaryExpression(exprOpStack.pop(), exprOpStack.pop(), expr)
      );
    }

    return expr;
  }

  function peek(stack) {
    return stack[stack.length - 1];
  }

  function isNeedSort(prec, exprOpStack) {
    return exprOpStack.length > 2 && prec <= exprOpStack[exprOpStack.length - 2].prec;
  }

  function isBinaryOperator(operator) {
    return (/^[-+*\/%<=>!?&|@]+$/).test(operator);
  }

  function isInteger(node) {
    return node.valueType === Token.IntegerLiteral;
  }

  function isAdverb(node) {
    if (node.type === Syntax.Identifier) {
      return (/^[a-z]$/).test(node.name.charAt(0));
    }
    return false;
  }
})(sc);

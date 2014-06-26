(function(sc) {
  "use strict";

  require("./compiler");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  function BaseParser(lexer, state) {
    this.lexer = lexer;
    this.state = state || {
      closedFunction: false,
      disallowGenerator: false,
      innerElements: false,
      immutableList: false,
      underscore: []
    };
  }

  Object.defineProperty(BaseParser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  BaseParser.prototype.lex = function() {
    return this.lexer.lex();
  };

  BaseParser.prototype.unlex = function(token) {
    return this.lexer.unlex(token);
  };

  BaseParser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
    return token;
  };

  BaseParser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  BaseParser.prototype.matchAny = function(list) {
    var value = this.lexer.lookahead.value;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }
    return null;
  };

  BaseParser.prototype.createMarker = function(node) {
    return this.lexer.createMarker(node);
  };

  BaseParser.prototype.hasNextToken = function() {
    return this.lookahead.type !== Token.EOF;
  };

  BaseParser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  BaseParser.prototype.throwUnexpected = function(token) {
    switch (token.type) {
    case Token.EOF:
      this.throwError(token, Message.UnexpectedEOS);
      break;
    case Token.FloatLiteral:
    case Token.IntegerLiteral:
      this.throwError(token, Message.UnexpectedNumber);
      break;
    case Token.CharLiteral:
    case Token.StringLiteral:
    case Token.SymbolLiteral:
      this.throwError(token, Message.UnexpectedLiteral, token.type.toLowerCase());
      break;
    case Token.Identifier:
      this.throwError(token, Message.UnexpectedIdentifier);
      break;
    default:
      this.throwError(token, Message.UnexpectedToken, token.value);
      break;
    }
  };

  BaseParser.prototype.parseExpressions = function() {
    return this.parent.parseExpressions();
  };

  BaseParser.prototype.parseExpression = function() {
    return this.parent.parseExpression();
  };

  sc.lang.compiler.BaseParser = BaseParser;
})(sc);

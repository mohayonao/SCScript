(function(sc) {
  "use strict";

  require("../compiler");
  require("../scope");
  require("../node");
  require("../interpolate-string");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  var Scope = sc.lang.compiler.scope({
    begin: function() {
      var declared = this.getDeclaredVariable();
      this.stack.push({
        vars: {},
        args: {},
        declared: declared
      });
    }
  });

  function BaseParser(parent, lexer) {
    if (parent) {
      this.parent = parent;
      this.lexer = parent.lexer;
      this.state = parent.state;
      this.scope = parent.scope;
    } else {
      this.parent = null;
      this.lexer = lexer;
      this.state = {
        closedFunction: false,
        disallowGenerator: false,
        innerElements: false,
        immutableList: false,
        underscore: []
      };
      this.scope = new Scope(this);
    }
  }

  BaseParser.addMethod = function(methodName, method) {
    BaseParser.prototype[methodName] = method;
  };

  Object.defineProperty(BaseParser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  BaseParser.prototype.lex = function() {
    return this.lexer.lex();
  };

  BaseParser.prototype.unlex = function(token) {
    this.lexer.unlex(token);
    return this;
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

  BaseParser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
  };

  /*
    ArgumentableValue :
      PrimaryHashedExpression (TODO: -> # HashedListExpression)
      CharLiteral
      FloatLiteral
      FalseLiteral
      IntegerLiteral
      NilLiteral
      SymbolLiteral
      TrueLiteral
  */
  BaseParser.prototype.parseArgumentableValue = function() {
    var marker = this.createMarker();

    var stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;

    var expr;
    switch (stamp) {
    case "#":
      expr = this.parseHashedExpression();
      break;
    case Token.CharLiteral:
    case Token.FloatLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.NilLiteral:
    case Token.SymbolLiteral:
    case Token.TrueLiteral:
      expr = this.parseLiteral();
      break;
    }

    if (!expr) {
      expr = {};
      this.throwUnexpected(this.lex());
    }

    return marker.update().apply(expr);
  };

  sc.lang.compiler.BaseParser = BaseParser;
})(sc);

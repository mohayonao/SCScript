(function(sc) {
  "use strict";

  require("../compiler");
  require("../node");

  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  function Parser(parent, lexer) {
    if (!parent) {
      initialize(this, lexer);
    } else {
      this.parent = parent;
      this.lexer = parent.lexer;
      this.state = parent.state;
    }
  }

  function initialize(that, lexer) {
    that.parent = null;
    that.lexer = lexer;
    that.state = {
      innerElements: false,
      immutableList: false,
      declared: {},
      underscore: []
    };
  }

  Parser.addParseMethod = function(name, method) {
    Parser.prototype["parse" + name] = method;
  };

  Object.defineProperty(Parser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  Parser.prototype.lex = function() {
    return this.lexer.lex();
  };

  Parser.prototype.unlex = function(token) {
    this.lexer.unlex(token);
    return this;
  };

  Parser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
    return token;
  };

  Parser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  Parser.prototype.matchAny = function(list) {
    var value = this.lexer.lookahead.value;
    for (var i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }
    return null;
  };

  Parser.prototype.createMarker = function(node) {
    return this.lexer.createMarker(node);
  };

  Parser.prototype.hasNextToken = function() {
    return this.lookahead.type !== Token.EOF;
  };

  Parser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  Parser.prototype.throwUnexpected = function(token) {
    switch (token.type) {
    case Token.EOF:
      return this.throwError(token, Message.UnexpectedEOS);
    case Token.FloatLiteral:
    case Token.IntegerLiteral:
      return this.throwError(token, Message.UnexpectedNumber);
    case Token.CharLiteral:
    case Token.StringLiteral:
    case Token.SymbolLiteral:
      return this.throwError(token, Message.UnexpectedLiteral, token.type.toLowerCase());
    case Token.Identifier:
      return this.throwError(token, Message.UnexpectedIdentifier);
    }
    return this.throwError(token, Message.UnexpectedToken, token.value);
  };

  Parser.prototype.addToScope = function(type, name) {
    if (this.state.declared[name]) {
      var tmpl = (type === "var") ?
        Message.VariableAlreadyDeclared : Message.ArgumentAlreadyDeclared;
      this.throwError({}, tmpl, name);
    }
    this.state.declared[name] = true;
  };

  Parser.prototype.withScope = function(func) {
    var result;

    var declared = this.state.declared;

    this.state.declared = {};
    result = func.call(this);
    this.state.declared = declared;

    return result;
  };

  sc.lang.compiler.Parser = Parser;
})(sc);

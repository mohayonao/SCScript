(function(sc) {
  "use strict";

  require("./compiler");
  require("./marker");
  require("./lexer/identifier");
  require("./lexer/string");
  require("./lexer/number");
  require("./lexer/punctuator");
  require("./lexer/comment");

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Token    = sc.lang.compiler.Token;
  var Message  = sc.lang.compiler.Message;
  var Marker = sc.lang.compiler.Marker;
  var lexIdentifier = sc.lang.compiler.lexIdentifier;
  var lexString = sc.lang.compiler.lexString;
  var lexNumber = sc.lang.compiler.lexNumber;
  var lexPunctuator = sc.lang.compiler.lexPunctuator;
  var lexComment = sc.lang.compiler.lexComment;

  function Lexer(source, opts) {
    /* istanbul ignore next */
    if (typeof source !== "string") {
      if (typeof source === "undefined") {
        source = "";
      }
      source = String(source);
    }
    this.source = source.replace(/\r\n?/g, "\n");
    this.opts = opts = opts || /* istanbul ignore next */ {};

    this.length = source.length;
    this.errors = null;

    this.index = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart = 0;

    this.lookahead = this.advance();

    this.index = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart = 0;
  }

  Object.defineProperty(Lexer.prototype, "columnNumber", {
    get: function() {
      return this.index - this.lineStart;
    }
  });

  Lexer.prototype.tokenize = function() {
    var tokens = [];

    while (true) {
      var token = this.collectToken();
      if (token.type === Token.EOF) {
        break;
      }
      tokens.push(token);
    }

    return tokens;
  };

  Lexer.prototype.collectToken = function() {
    var token = this.advance();

    var result = {
      type: token.type,
      value: token.value
    };

    if (this.opts.range) {
      result.range = token.range;
    }
    if (this.opts.loc) {
      result.loc = token.loc;
    }

    return result;
  };

  Lexer.prototype.lex = function() {
    var token = this.lookahead;

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    this.lookahead = this.advance();

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    return token;
  };

  Lexer.prototype.unlex = function(token) {
    this.lookahead = token;
    this.index = token.range[0];
    this.lineNumber = token.lineNumber;
    this.lineStart = token.lineStart;
  };

  Lexer.prototype.advance = function() {
    this.skipComment();

    if (this.length <= this.index) {
      return this.EOFToken();
    }

    var lineNumber = this.lineNumber;
    var columnNumber = this.columnNumber;

    var token = this.scan();

    token.loc = {
      start: { line: lineNumber, column: columnNumber },
      end: { line: this.lineNumber, column: this.columnNumber }
    };

    return token;
  };

  Lexer.prototype.createMarker = function(node) {
    return Marker.create(this, node);
  };

  Lexer.prototype.skipComment = function() {
    var source = this.source;
    var length = this.length;

    while (this.index < length) {
      var ch1 = source.charAt(this.index);
      var ch2 = source.charAt(this.index + 1);

      if (ch1 === " " || ch1 === "\t") {
        this.index += 1;
      } else if (ch1 === "\n") {
        this.index += 1;
        this.lineNumber += 1;
        this.lineStart = this.index;
      } else if (ch1 === "/" && (ch2 === "/" || ch2 === "*")) {
        this.scanWithFunc(lexComment);
      } else {
        break;
      }
    }
  };

  Lexer.prototype.scan = function() {
    return this.scanWithFunc(this.selectScanner());
  };

  Lexer.prototype.selectScanner = function() {
    var ch = this.source.charAt(this.index);

    if (ch === "\\" || ch === "'" || ch === '"' || ch === "$") {
      return lexString;
    }

    if (ch === "_" || strlib.isAlpha(ch)) {
      return lexIdentifier;
    }

    if (strlib.isNumber(ch)) {
      return lexNumber;
    }

    return lexPunctuator;
  };

  Lexer.prototype.scanWithFunc = function(func) {
    var start = this.index;
    var token = func(this.source, this.index);
    if (token.error) {
      return this.throwError({}, Message.UnexpectedToken, token.value);
    }
    this.index += token.length;
    if (token.line) {
      var value = token.value;
      this.lineStart = this.index - (value.length - value.lastIndexOf("\n") - 1);
      this.lineNumber += token.line;
    }
    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.makeToken = function(type, value, start) {
    return {
      type: type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart: this.lineStart,
      range: [ start, this.index ]
    };
  };

  Lexer.prototype.EOFToken = function() {
    return this.makeToken(Token.EOF, "<EOF>", this.index);
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.index, this.lineNumber, this.columnNumber ];
  };

  Lexer.prototype.throwError = function(token, messageFormat) {
    var message = strlib.format(messageFormat, slice.call(arguments, 2));

    var index, lineNumber, column;
    if (typeof token.lineNumber === "number") {
      index      = token.range[0];
      lineNumber = token.lineNumber;
      column     = token.range[0] - token.lineStart + 1;
    } else {
      index      = this.index;
      lineNumber = this.lineNumber;
      column     = index - this.lineStart + 1;
    }

    var error = new Error("Line " + lineNumber + ": " + message);
    error.index       = index;
    error.lineNumber  = lineNumber;
    error.column      = column;
    error.description = message;

    throw error;
  };

  sc.lang.compiler.Lexer = Lexer;
})(sc);

(function(sc) {
  "use strict";

  require("./compiler");

  var Token    = sc.lang.compiler.Token;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;

  function Lexer(source, opts) {
    /* istanbul ignore next */
    if (typeof source !== "string") {
      if (typeof source === "undefined") {
        source = "";
      }
      source = String(source);
    }
    source = source.replace(/\r\n?/g, "\n");

    opts = opts || /* istanbul ignore next */ {};

    this.source = source;
    this.opts   = opts;
    this.length = source.length;
    this.index  = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart  = 0;
    this.reverted   = null;
    this.errors     = opts.tolerant ? [] : null;

    this.peek();
  }

  function char2num(ch) {
    var n = ch.charCodeAt(0);

    if (48 <= n && n <= 57) {
      return n - 48;
    }
    if (65 <= n && n <= 90) {
      return n - 55;
    }
    return n - 87; // if (97 <= n && n <= 122)
  }

  function isAlpha(ch) {
    return ("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z");
  }

  function isNumber(ch) {
    return "0" <= ch && ch <= "9";
  }

  Lexer.prototype.tokenize = function() {
    var tokens, token;

    tokens = [];

    while (true) {
      token = this.collectToken();
      if (token.type === Token.EOF) {
        break;
      }
      tokens.push(token);
    }

    return tokens;
  };

  Lexer.prototype.collectToken = function() {
    var loc, token, t;

    this.skipComment();

    loc = {
      start: {
        line: this.lineNumber,
        column: this.index - this.lineStart
      }
    };

    token = this.advance();

    loc.end = {
      line: this.lineNumber,
      column: this.index - this.lineStart
    };

    t = {
      type: token.type,
      value: token.value
    };

    if (this.opts.range) {
      t.range = token.range;
    }
    if (this.opts.loc) {
      t.loc = loc;
    }

    return t;
  };

  Lexer.prototype.skipComment = function() {
    var source = this.source;
    var length = this.length;
    var index = this.index;
    var ch;

    LOOP: while (index < length) {
      ch = source.charAt(index);

      if (ch === " " || ch === "\t") {
        index += 1;
        continue;
      }

      if (ch === "\n") {
        index += 1;
        this.lineNumber += 1;
        this.lineStart = index;
        continue;
      }

      if (ch === "/") {
        ch = source.charAt(index + 1);
        if (ch === "/") {
          index = this.skipLineComment(index + 2);
          continue;
        }
        if (ch === "*") {
          index = this.skipBlockComment(index + 2);
          continue;
        }
      }

      break;
    }

    this.index = index;
  };

  Lexer.prototype.skipLineComment = function(index) {
    var source = this.source;
    var length = this.length;
    var ch;

    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
        break;
      }
    }

    return index;
  };

  Lexer.prototype.skipBlockComment = function(index) {
    var source = this.source;
    var length = this.length;
    var ch, depth;

    depth = 1;
    while (index < length) {
      ch = source.charAt(index);

      if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else {
        ch = ch + source.charAt(index + 1);
        if (ch === "/*") {
          depth += 1;
          index += 1;
        } else if (ch === "*/") {
          depth -= 1;
          index += 1;
          if (depth === 0) {
            return index + 1;
          }
        }
      }

      index += 1;
    }
    this.throwError({}, Message.UnexpectedToken, "ILLEGAL");

    return index;
  };

  Lexer.prototype.advance = function() {
    var ch, token;

    this.skipComment();

    if (this.length <= this.index) {
      return this.EOFToken();
    }

    ch = this.source.charAt(this.index);

    if (ch === "\\") {
      return this.scanSymbolLiteral();
    }
    if (ch === "'") {
      return this.scanQuotedLiteral(Token.SymbolLiteral, ch);
    }

    if (ch === "$") {
      return this.scanCharLiteral();
    }

    if (ch === '"') {
      return this.scanQuotedLiteral(Token.StringLiteral, ch);
    }

    if (ch === "_") {
      return this.scanUnderscore();
    }

    if (ch === "-") {
      token = this.scanNegativeNumericLiteral();
      if (token) {
        return token;
      }
    }

    if (isAlpha(ch)) {
      return this.scanIdentifier();
    }

    if (isNumber(ch)) {
      return this.scanNumericLiteral();
    }

    return this.scanPunctuator();
  };

  Lexer.prototype.peek = function() {
    var index, lineNumber, lineStart;

    index      = this.index;
    lineNumber = this.lineNumber;
    lineStart  = this.lineStart;

    this.lookahead = this.advance();

    this.index      = index;
    this.lineNumber = lineNumber;
    this.lineStart  = lineStart;
  };

  Lexer.prototype.lex = function(saved) {
    var that = this;
    var token = this.lookahead;

    if (saved) {
      saved = [
        this.lookahead,
        this.index,
        this.lineNumber,
        this.lineStart
      ];
    }

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    this.lookahead = this.advance();

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    if (saved) {
      token.revert = function() {
        that.lookahead  = saved[0];
        that.index      = saved[1];
        that.lineNumber = saved[2];
        that.lineStart  = saved[3];
      };
    }

    return token;
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

  Lexer.prototype.scanCharLiteral = function() {
    var start, value;

    start = this.index;
    value = this.source.charAt(this.index + 1);

    this.index += 2;

    return this.makeToken(Token.CharLiteral, value, start);
  };

  Lexer.prototype.scanIdentifier = function() {
    var source = this.source.slice(this.index);
    var start = this.index;
    var value, type;

    value = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(source)[0];

    this.index += value.length;

    if (this.source.charAt(this.index) === ":") {
      this.index += 1;
      return this.makeToken(Token.Label, value, start);
    } else if (this.isKeyword(value)) {
      type = Token.Keyword;
    } else {
      switch (value) {
      case "inf":
        type = Token.FloatLiteral;
        value = "Infinity";
        break;
      case "pi":
        type = Token.FloatLiteral;
        value = String(Math.PI);
        break;
      case "nil":
        type = Token.NilLiteral;
        value = "nil";
        break;
      case "true":
        type = Token.TrueLiteral;
        break;
      case "false":
        type = Token.FalseLiteral;
        break;
      default:
        type = Token.Identifier;
        break;
      }
    }

    return this.makeToken(type, value, start);
  };

  Lexer.prototype.scanNumericLiteral = function(neg) {
    return this.scanNAryNumberLiteral(neg) ||
      this.scanHexNumberLiteral(neg) ||
      this.scanAccidentalNumberLiteral(neg) ||
      this.scanDecimalNumberLiteral(neg);
  };

  Lexer.prototype.scanNegativeNumericLiteral = function() {
    var token, ch1, ch2, ch3;
    var start, value = null;

    start = this.index;
    ch1 = this.source.charAt(this.index + 1);

    if (isNumber(ch1)) {
      this.index += 1;
      token = this.scanNumericLiteral(true);
      token.range[0] = start;
      return token;
    }

    ch2 = this.source.charAt(this.index + 2);
    ch3 = this.source.charAt(this.index + 3);

    if (ch1 + ch2 === "pi") {
      this.index += 3;
      value = String(-Math.PI);
    } else if (ch1 + ch2 + ch3 === "inf") {
      this.index += 4;
      value = "-Infinity";
    }

    if (value !== null) {
      return this.makeToken(Token.FloatLiteral, value, start);
    }

    return null;
  };

  var makeNumberToken = function(type, value, neg, pi) {
    if (neg) {
      value *= -1;
    }

    if (pi) {
      type = Token.FloatLiteral;
      value = value * Math.PI;
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    } else {
      value = String(value);
    }

    return {
      type: type,
      value: value
    };
  };

  Lexer.prototype.scanNAryNumberLiteral = function(neg) {
    var re, start, items;
    var base, integer, frac, pi;
    var value, type;
    var token;

    re = /^(\d+)r((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+)(?:\.((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+))?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    base    = items[1].replace(/^0+(?=\d)/g, "")|0;
    integer = items[2].replace(/(^0+(?=\d)|_)/g, "");
    frac    = items[3] && items[3].replace(/_/g, "");

    if (!frac && base < 26 && integer.substr(-2) === "pi") {
      integer = integer.slice(0, -2);
      pi = true;
    }

    type  = Token.IntegerLiteral;
    value = this.calcNBasedInteger(integer, base);

    if (frac) {
      type = Token.FloatLiteral;
      value += this.calcNBasedFrac(frac, base);
    }

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.char2num = function(ch, base) {
    var x = char2num(ch, base);
    if (x >= base) {
      this.throwError({}, Message.UnexpectedToken, ch);
    }
    return x;
  };

  Lexer.prototype.calcNBasedInteger = function(integer, base) {
    var value, i, imax;

    for (i = value = 0, imax = integer.length; i < imax; ++i) {
      value *= base;
      value += this.char2num(integer[i], base);
    }

    return value;
  };

  Lexer.prototype.calcNBasedFrac = function(frac, base) {
    var value, i, imax;

    for (i = value = 0, imax = frac.length; i < imax; ++i) {
      value += this.char2num(frac[i], base) * Math.pow(base, -(i + 1));
    }

    return value;
  };

  Lexer.prototype.scanHexNumberLiteral = function(neg) {
    var re, start, items;
    var integer, pi;
    var value, type;
    var token;

    re = /^(0x(?:[\da-fA-F](?:_(?=[\da-fA-F]))?)+)(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    integer = items[1].replace(/_/g, "");
    pi      = !!items[2];

    type  = Token.IntegerLiteral;
    value = +integer;

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanAccidentalNumberLiteral = function(neg) {
    var re, start, items;
    var integer, accidental, cents;
    var sign, value;
    var token;

    re = /^(\d+)([bs]+)(\d*)/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    integer    = items[1];
    accidental = items[2];
    sign = (accidental.charAt(0) === "s") ? +1 : -1;

    if (items[3] === "") {
      cents = Math.min(accidental.length * 0.1, 0.4);
    } else {
      cents = Math.min(items[3] * 0.001, 0.499);
    }
    value = +integer + (sign * cents);

    token = makeNumberToken(Token.FloatLiteral, value, neg, false);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanDecimalNumberLiteral = function(neg) {
    var re, start, items, integer, frac, pi;
    var value, type;
    var token;

    re = /^((?:\d(?:_(?=\d))?)+((?:\.(?:\d(?:_(?=\d))?)+)?(?:e[-+]?(?:\d(?:_(?=\d))?)+)?))(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    integer = items[1];
    frac    = items[2];
    pi      = items[3];

    type  = (frac || pi) ? Token.FloatLiteral : Token.IntegerLiteral;
    value = +integer.replace(/(^0+(?=\d)|_)/g, "");

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanPunctuator = function() {
    var re, start, items;

    re = /^(\.{1,3}|[(){}[\]:;,~#`]|[-+*\/%<=>!?&|@]+)/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (items) {
      this.index += items[0].length;
      return this.makeToken(Token.Punctuator, items[0], start);
    }

    this.throwError({}, Message.UnexpectedToken, this.source.charAt(this.index));

    this.index = this.length;

    return this.EOFToken();
  };

  Lexer.prototype.scanQuotedLiteral = function(type, quote) {
    var start, value;
    start = this.index;
    value = this._scanQuotedLiteral(quote);
    return value ? this.makeToken(type, value, start) : this.EOFToken();
  };

  Lexer.prototype._scanQuotedLiteral = function(quote) {
    var source, length, index, start, value, ch;

    source = this.source;
    length = this.length;
    index  = this.index + 1;
    start  = index;
    value  = null;

    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === quote) {
        value = source.substr(start, index - start - 1).replace(/\n/g, "\\n");
        break;
      } else if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else if (ch === "\\") {
        index += 1;
      }
    }

    this.index = index;

    if (!value) {
      this.throwError({}, Message.UnexpectedToken, "ILLEGAL");
    }

    return value;
  };

  Lexer.prototype.scanSymbolLiteral = function() {
    var re, start, items;
    var value;

    re = /^\\([a-zA-Z_]\w*|\d+)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    value = items[1] || "";

    this.index += items[0].length;

    return this.makeToken(Token.SymbolLiteral, value, start);
  };

  Lexer.prototype.scanUnderscore = function() {
    var start = this.index;

    this.index += 1;

    return this.makeToken(Token.Identifier, "_", start);
  };

  Lexer.prototype.isKeyword = function(value) {
    return !!Keywords[value] || false;
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.index, this.lineNumber, this.index - this.lineStart ];
  };

  Lexer.prototype.throwError = function(token, messageFormat) {
    var args, message;
    var error, index, lineNumber, column;
    var prev;

    args = Array.prototype.slice.call(arguments, 2);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    if (typeof token.lineNumber === "number") {
      index      = token.range[0];
      lineNumber = token.lineNumber;
      column     = token.range[0] - token.lineStart + 1;
    } else {
      index      = this.index;
      lineNumber = this.lineNumber;
      column     = index - this.lineStart + 1;
    }

    error = new Error("Line " + lineNumber + ": " + message);
    error.index       = index;
    error.lineNumber  = lineNumber;
    error.column      = column;
    error.description = message;

    if (this.errors) {
      prev = this.errors[this.errors.length - 1];
      if (!(prev && error.index <= prev.index)) {
        this.errors.push(error);
      }
    } else {
      throw error;
    }
  };

  sc.lang.compiler.lexer = Lexer;
})(sc);

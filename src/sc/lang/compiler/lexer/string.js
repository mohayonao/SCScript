(function(sc) {
  "use strict";

  require("./lexer");

  var Token = sc.lang.compiler.Token;
  var Lexer = sc.lang.compiler.Lexer;

  Lexer.addLexMethod("String", function(source, index) {
    return new StringLexer(source, index).scan();
  });

  function StringLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  StringLexer.prototype.scan = function() {
    return this.scanSymbolLiteral() ||
      this.scanQuotedSymbolLiteral() ||
      this.scanStringLiteral() ||
      this.scanCharLiteral();
  };

  StringLexer.prototype.match = function(re) {
    return re.exec(this.source.slice(this.index));
  };

  StringLexer.prototype.scanCharLiteral = function() {
    var source = this.source;
    var index  = this.index;

    if (source.charAt(index) !== "$") {
      return;
    }

    var value = source.charAt(index + 1) || "";

    return makeStringToken(Token.CharLiteral, value, 1);
  };

  StringLexer.prototype.scanSymbolLiteral = function() {
    var items = this.match(/^\\([a-zA-Z_]\w*|\d+)?/);

    if (!items) {
      return;
    }

    var value = items[1] || "";

    return makeStringToken(Token.SymbolLiteral, value, 1);
  };

  StringLexer.prototype.scanQuotedSymbolLiteral = function() {
    var source = this.source;
    var index  = this.index;

    if (source.charAt(index) !== "'") {
      return;
    }

    var value = "";
    var pad = 2;
    for (var i = index + 1, imax = source.length; i < imax; ++i) {
      var ch = source.charAt(i);
      if (ch === "'") {
        return makeStringToken(Token.SymbolLiteral, value, pad);
      }
      if (ch === "\n") {
        break;
      }
      if (ch === "\\") {
        pad += 1;
      } else {
        value += ch;
      }
    }

    return makeErrorToken("'" + value);
  };

  StringLexer.prototype.scanStringLiteral = function() {
    var source = this.source;
    var index  = this.index;

    if (source.charAt(index) !== '"') {
      return;
    }

    var value = "";
    var pad = 2, line = 0;
    for (var i = index + 1, imax = source.length; i < imax; ++i) {
      var ch = source.charAt(i);
      if (ch === '"') {
        return makeStringToken(Token.StringLiteral, value, pad, line);
      } else if (ch === "\n") {
        line += 1;
        value += "\\n";
        pad -= 1;
      } else if (ch === "\\") {
        value += "\\" + source.charAt(++i);
      } else {
        value += ch;
      }
    }

    return makeErrorToken('"' + value, line);
  };

  function makeStringToken(type, value, pad, line) {
    return {
      type: type,
      value: value,
      length: value.length + pad,
      line: line|0
    };
  }

  function makeErrorToken(value, line) {
    return {
      error: true,
      value: value,
      length: value.length,
      line: line|0
    };
  }
})(sc);

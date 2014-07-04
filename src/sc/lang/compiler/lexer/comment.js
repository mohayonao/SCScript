(function(sc) {
  "use strict";

  require("./lexer");

  var Token = sc.lang.compiler.Token;
  var Lexer = sc.lang.compiler.Lexer;

  Lexer.addLexMethod("Comment", function(source, index) {
    return new CommentLexer(source, index).scan();
  });

  function CommentLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  CommentLexer.prototype.scan = function() {
    var source = this.source;
    var index = this.index;
    var op = source.charAt(index) + source.charAt(index + 1);
    if (op === "//") {
      return this.scanSingleLineComment();
    }
    if (op === "/*") {
      return this.scanMultiLineComment();
    }
  };

  CommentLexer.prototype.scanSingleLineComment = function() {
    var source = this.source;
    var index = this.index;
    var length = source.length;

    var value = "";
    var line = 0;
    while (index < length) {
      var ch = source.charAt(index++);
      value += ch;
      if (ch === "\n") {
        line = 1;
        break;
      }
    }

    return makeCommentToken(Token.SingleLineComment, value, line);
  };

  CommentLexer.prototype.scanMultiLineComment = function() {
    var source = this.source;
    var index = this.index;
    var length = source.length;

    var value = "";
    var line = 0, depth = 0;
    while (index < length) {
      var ch1 = source.charAt(index);
      var ch2 = source.charAt(index + 1);
      value += ch1;

      if (ch1 === "\n") {
        line += 1;
      } else if (ch1 === "/" && ch2 === "*") {
        depth += 1;
        index += 1;
        value += ch2;
      } else if (ch1 === "*" && ch2 === "/") {
        depth -= 1;
        index += 1;
        value += ch2;
        if (depth === 0) {
          return makeCommentToken(Token.MultiLineComment, value, line);
        }
      }

      index += 1;
    }

    return { error: true, value: "ILLEGAL", length: length, line: line };
  };

  function makeCommentToken(type, value, line) {
    return {
      type: type,
      value: value,
      length: value.length,
      line: line|0
    };
  }
})(sc);

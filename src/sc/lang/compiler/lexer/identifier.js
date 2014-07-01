(function(sc) {
  "use strict";

  require("./compiler");

  var Token = sc.lang.compiler.Token;
  var Keywords = sc.lang.compiler.Keywords;

  function IdentifierLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  var re = /^(_|[a-zA-Z][a-zA-Z0-9_]*)/;

  IdentifierLexer.prototype.scan = function() {
    var source = this.source;
    var index  = this.index;

    var value = re.exec(source.slice(index))[0];
    var length = value.length;

    var type;
    if (source.charAt(index + length) === ":") {
      type = Token.Label;
      length += 1;
    } else if (isKeyword(value)) {
      type = Token.Keyword;
    } else if (value === "inf") {
      type = Token.FloatLiteral;
      value = "Infinity";
    } else if (value === "pi") {
      type = Token.FloatLiteral;
      value = String(Math.PI);
    } else if (value === "nil") {
      type = Token.NilLiteral;
    } else if (value === "true") {
      type = Token.TrueLiteral;
    } else if (value === "false") {
      type = Token.FalseLiteral;
    } else {
      type = Token.Identifier;
    }

    return { type: type, value: value, length: length };
  };

  function isKeyword(value) {
    return Keywords.hasOwnProperty(value);
  }

  sc.lang.compiler.lexIdentifier = function(source, index) {
    return new IdentifierLexer(source, index).scan();
  };
})(sc);

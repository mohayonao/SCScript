(function(sc) {
  "use strict";

  require("./compiler");

  var Token = sc.lang.compiler.Token;

  function PunctuatorLexer(source, index) {
    this.source = source;
    this.index = index;
  }

  var re = /^(\.{1,3}|[(){}[\]:;,~#`]|[-+*\/%<=>!?&|@]+)/;

  PunctuatorLexer.prototype.scan = function() {
    var source = this.source;
    var index  = this.index;

    var items = re.exec(source.slice(index));

    if (items) {
      return {
        type: Token.Punctuator, value: items[0], length: items[0].length
      };
    }

    return { error: true, value: source.charAt(index), length: 1 };
  };

  sc.lang.compiler.lexPunctuator = function(source, index) {
    return new PunctuatorLexer(source, index).scan();
  };
})(sc);

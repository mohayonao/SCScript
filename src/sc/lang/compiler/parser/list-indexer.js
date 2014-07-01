(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;

  Parser.addParseMethod("ListIndexer", function() {
    return new ListIndexerParser(this).parse();
  });

  function ListIndexerParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(ListIndexerParser, Parser);

  ListIndexerParser.prototype.parse = function() {
    this.expect("[");

    var items;
    if (this.match("..")) {
      // [.. ???
      this.lex();
      items = this.parseListIndexerWithoutFirst();
    } else {
      // [first ???
      items = this.parseListIndexerWithFirst();
    }

    this.expect("]");

    return items;
  };

  ListIndexerParser.prototype.parseListIndexerWithFirst = function() {
    var first = this.parseExpressions();

    if (this.match("..")) {
      this.lex();
      // [first.. ???
      return this.parseListIndexerWithFirstWithoutSecond(first);
    }

    if (this.match(",")) {
      this.lex();
      // [first, second ???
      return this.parseListIndexerWithFirstAndSecond(first, this.parseExpressions());
    }

    // [first]
    return [ first ];
  };

  ListIndexerParser.prototype.parseListIndexerWithoutFirst = function() {
    // [..last]
    if (!this.match("]")) {
      return [ null, null, this.parseExpressions() ];
    }

    // [..]
    return [ null, null, null ];
  };

  ListIndexerParser.prototype.parseListIndexerWithFirstWithoutSecond = function(first) {
    // [first..last]
    if (!this.match("]")) {
      return [ first, null, this.parseExpressions() ];
    }

    // [first..]
    return [ first, null, null ];
  };

  ListIndexerParser.prototype.parseListIndexerWithFirstAndSecond = function(first, second) {
    if (this.match("..")) {
      this.lex();
      // [first, second..last]
      if (!this.match("]")) {
        return [ first, second, this.parseExpressions() ];
      }
      // [first, second..]
      return [ first, second, null ];
    }

    // [first, second] (the second is ignored)
    return [ first ];
  };
})(sc);

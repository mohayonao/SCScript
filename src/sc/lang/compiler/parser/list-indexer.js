(function(sc) {
  "use strict";

  require("./base-parser");
  require("./expression");

  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addParseMethod("ListIndexer", function() {
    return new ListIndexerParser(this).parse();
  });

  function ListIndexerParser(parent) {
    BaseParser.call(this, parent);
    this.parent = parent;
  }
  sc.libs.extend(ListIndexerParser, BaseParser);

  ListIndexerParser.prototype.parse = function() {
    var node = null;

    this.expect("[");

    if (!this.match("]")) {
      if (this.match("..")) {
        // [..last] / [..]
        node = this.parseListIndexerWithoutFirst();
      } else {
        // [first] / [first..last] / [first, second..last]
        node = this.parseListIndexerWithFirst();
      }
    }

    this.expect("]");

    if (node === null) {
      this.throwUnexpected({ value: "]" });
    }

    return node;
  };

  ListIndexerParser.prototype.parseListIndexerWithoutFirst = function() {
    var last;

    this.expect("..");

    if (!this.match("]")) {
      last = this.parseExpressions();

      // [..last]
      return [ null, null, last ];
    }

    // [..]
    return [ null, null, null ];
  };

  ListIndexerParser.prototype.parseListIndexerWithFirst = function() {
    if (this.match(",")) {
      this.throwUnexpected(this.lookahead);
    }

    var first = this.parseExpressions();

    if (this.match("..")) {
      return this.parseListIndexerWithoutSecond(first);
    } else if (this.match(",")) {
      return this.parseListIndexerWithSecond(first);
    }

    // [first]
    return [ first ];
  };

  ListIndexerParser.prototype.parseListIndexerWithoutSecond = function(first) {
    this.expect("..");

    var last = null;
    if (!this.match("]")) {
      last = this.parseExpressions();
    }

    // [first..last]
    return [ first, null, last ];
  };

  ListIndexerParser.prototype.parseListIndexerWithSecond = function(first) {
    this.expect(",");

    var second = this.parseExpressions();
    var last = null;
    if (this.match("..")) {
      this.lex();
      if (!this.match("]")) {
        last = this.parseExpressions();
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    // [first, second..last]
    return [ first, second, last ];
  };
})(sc);

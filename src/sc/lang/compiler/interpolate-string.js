(function(sc) {
  "use strict";

  require("./compiler");

  function InterpolateString(str) {
    this.str = str;
  }

  InterpolateString.hasInterpolateString = function(str) {
    return /(^|[^\x5c])#\{/.test(str);
  };

  InterpolateString.prototype.toCompiledString = function() {
    return toCompiledString(this.str);
  };

  function toCompiledString(str) {
    var len = str.length;
    var items = [];

    var index1 = 0;
    var code;
    do {
      var index2 = findString(str, index1);
      if (index2 >= len) {
        break;
      }
      code = str.substr(index1, index2 - index1);
      if (code) {
        items.push('"' + code + '"');
      }

      index1 = index2 + 2;
      index2 = findExpression(str, index1, items);

      code = str.substr(index1, index2 - index1);
      if (code) {
        items.push("(" + code + ").asString");
      }

      index1 = index2 + 1;
    } while (index1 < len);

    if (index1 < len) {
      items.push('"' + str.substr(index1) + '"');
    }

    return items.join("++");
  }

  function findString(str, index) {
    var len = str.length;

    while (index < len) {
      switch (str.charAt(index)) {
      case "#":
        if (str.charAt(index + 1) === "{") {
          return index;
        }
        break;
      case "\\":
        index += 1;
        break;
      }
      index += 1;
    }

    return index;
  }

  function findExpression(str, index) {
    var len = str.length;

    var depth = 0;
    while (index < len) {
      switch (str.charAt(index)) {
      case "}":
        if (depth === 0) {
          return index;
        }
        depth -= 1;
        break;
      case "{":
        depth += 1;
        break;
      }
      index += 1;
    }

    return index;
  }

  sc.lang.compiler.InterpolateString = InterpolateString;
})(sc);

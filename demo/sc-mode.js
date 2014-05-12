(function(global, mod) {
  "use strict";

  if (typeof exports === "object" && typeof module === "object") { // CommonJS
    mod(require("../../lib/codemirror"));
  } else if (typeof global.define === "function" && global.define.amd) { // AMD
    global.define(["../../lib/codemirror"], mod);
  } else { // Plain browser env
    mod(global.CodeMirror);
  }

})(this.self || global, function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("SCScript", function() {

    function tokenComment(stream) {
      var prev, ch, depth;

      depth = 1;
      while (!!(ch = stream.next())) {
        if (prev === "*" && ch === "/") {
          depth -= 1;
          if (depth === 0) {
            break;
          }
        } else if (prev === "/" && ch === "*") {
          depth += 1;
        }
        prev = ch;
      }
    }

    return {
      token: function(stream) {
        var ch;

        if (stream.match(/var|arg|const|this(Thread|Process|Function|FunctionDef)?/)) {
          return "keyword";
        }

        if (stream.match(/[a-z]\w*/)) {
          return "atom";
        }

        if (stream.match(/[A-Z]\w*/)) {
          return "class";
        }

        if (stream.match(/[a-z]\w*:/)) {
          return "symbol";
        }

        if (stream.match(/\d+r\w+(\.\w+)?/i)) {
          return "number";
        }

        if (stream.match(/[\d_]+(\.[\d_]+)?([eE]-?[\d_]+)?(pi)?/)) {
          return "number";
        }

        if (stream.match(/\\\w+/i)) {
          return "symbol";
        }

        if (stream.match(/'.*?'/)) {
          return "symbol";
        }

        ch = stream.next();

        if (ch === "/") {
          if (stream.eat("*")) {
            tokenComment(stream);
            return "comment";
          } else if (stream.eat("/")) {
            stream.skipToEnd();
            return "comment";
          }
        }

        return "atom";
      }
    };
  });
});

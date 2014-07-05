"use strict";

var nodeREPL = require("repl");
var vm = require("vm");
var SCScript = require("./scscript");

function isSCObject(obj) {
  return obj && typeof obj._ !== "undefined";
}

function toString(obj) {
  if (isSCObject(obj)) {
    return obj.toString();
  }
  return obj;
}

var replOptions = {
  prompt: "scsc> ",
  eval: function(input, context, filename, callback) {
    // Node's REPL sends the input ending with a newline and then wrapped in
    // parens. Unwrap all that.
    input = input.replace(/^\(([\s\S]*)\n\)$/m, "$1");

    try {
      var js = SCScript.compile(input, { loc: true, range: true });
      var result;
      if (context === global) {
        result = vm.runInThisContext(js, filename);
      } else {
        result = vm.runInContext(js, context, filename);
      }
      callback(null, toString(result.valueOf()));
    } catch (err) {
      callback(err);
    }
  }
};

function countCodeDepth(code) {
  var tokens = SCScript.tokenize(code).filter(function(token) {
    return token.type === "Punctuator";
  });

  var depth = 0;

  for (var i = 0, imax = tokens.length; i < imax; ++i) {
    if ([ "(", "{", "[" ].indexOf(tokens[i].value) !== -1) {
      depth += 1;
    }
    if ([ "]", "}", ")" ].indexOf(tokens[i].value) !== -1) {
      depth -= 1;
    }
    if (depth < 0) {
      return -1;
    }
  }

  return depth;
}

function addMultilineHandler(repl) {
  var rli = repl.rli;
  var buffer = "";

  var nodeLineListener = rli.listeners("line")[0];
  rli.removeListener("line", nodeLineListener);

  rli.on("line", function(line) {
    buffer += line;

    var depth = countCodeDepth(buffer);

    if (depth === 0) {
      rli.setPrompt(replOptions.prompt);
      nodeLineListener(buffer);
      buffer = "";
      return;
    }

    if (depth > 0) {
      rli.setPrompt("... ");
      return rli.prompt(true);
    }

    buffer = "";
    rli.setPrompt(replOptions.prompt);
    return rli.prompt(true);
  });
}

module.exports = {
  start: function() {
    var repl = nodeREPL.start(replOptions);
    repl.on("exit", function() {
      repl.outputStream.write("\n");
    });
    addMultilineHandler(repl);
  }
};

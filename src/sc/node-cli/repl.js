"use strict";

var nodeREPL  = require("repl");
var sushiREPL = require("sushi-repl");
var vm = require("vm");
var SCScript = require("./scscript");

function isObject(obj) {
  return obj && obj.constructor === Object;
}

function isSCObject(obj) {
  return obj && typeof obj._ !== "undefined";
}

var formatter = {
  SCObject: function(value) {
    return {
      inspect: function() {
        return "\x1B[35m" + value.__className + "\x1B[39m";
      }
    };
  },
  Array: function(value) {
    return value.map(formatter.Value);
  },
  Object: function(value) {
    var dict = {};
    Object.keys(value).forEach(function(key) {
      dict[key] = formatter.Value(value[key]);
    });
    return dict;
  },
  Value: function(value) {
    if (isSCObject(value)) {
      return formatter.SCObject(value);
    }
    if (Array.isArray(value)) {
      return formatter.Array(value);
    }
    if (isObject(value)) {
      return formatter.Object(value);
    }
    return value;
  }
};

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
      callback(null, formatter.Value(result.valueOf()));
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = {
  start: function(opts) {
    if (opts.sushi) {
      replOptions.writer = sushiREPL.writer;
    }
    var repl = nodeREPL.start(replOptions);
    repl.on("exit", function() {
      repl.outputStream.write("\n");
    });
  }
};

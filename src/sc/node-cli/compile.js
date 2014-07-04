"use strict";

var fs = require("fs");
var vm = require("vm");
var path = require("path");
var SCScript = require("./scscript");

function println(obj) {
  if (typeof obj === "object") {
    obj = JSON.stringify(obj, null, 2);
  }
  process.stdout.write(obj + "\n");
}

function showTokens(code) {
  println(SCScript.tokenize(code));
}

function showNodes(code) {
  println(SCScript.parse(code));
}

function writeFile(filepath, js, opts) {
  if (opts.print) {
    return println(js);
  }
  var dirname  = path.resolve(opts.output || ".");
  var filename = path.basename(filepath || "a.js");

  fs.writeFile(path.join(dirname, filename), js, { encoding: "utf-8" });
}

function compile(filepath, code, opts) {
  try {
    if (opts.tokens) {
      return showTokens(code);
    }
    if (opts.nodes) {
      return showNodes(code);
    }

    var js = SCScript.compile(code, { loc: true, range: true });

    if (opts.compile) {
      return writeFile(filepath, js, opts);
    }

    var result = vm.runInThisContext(js);

    println(result.valueOf());
  } catch (e) {
    throw e;
  }
}

module.exports = {
  stdio: function(opts) {
    var code = "";
    var stdin = process.openStdin();
    stdin.on("data", function(buffer) {
      if (buffer) {
        code += buffer.toString();
      }
    });
    stdin.on("end", function() {
      compile(null, code, opts);
    });
  },
  eval: function(code, opts) {
    process.nextTick(function() {
      compile(null, code, opts);
    });
  },
  file: function(filepath, opts) {
    fs.exists(filepath, function(exists) {
      if (exists) {
        fs.readFile(filepath, function(err, data) {
          if (!err) {
            compile(filepath, data.toString(), opts);
          }
        });
      }
    });
  }
};

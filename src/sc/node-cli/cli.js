"use strict";

var options = require("./options");

function main(argv) {
  var opts = options.parse(argv);
  var args = opts._;

  if (opts.help) {
    return require("./help").show();
  }

  if (opts.version) {
    return require("./version").show();
  }

  if (opts.interactive) {
    return require("./repl").start(opts);
  }

  if (opts.stdio) {
    return require("./compile").stdio(opts);
  }

  /* jshint evil: true */
  if (opts.eval) {
    return require("./compile").eval(args[0], opts);
  }
  /* jshint evil: false */

  if (args.length === 0) {
    return require("./repl").start(opts);
  }

  require("./compile").file(args[0], opts);
}

main(process.argv);

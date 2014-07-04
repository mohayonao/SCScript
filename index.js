"use strict";

var fs = require("fs");

var pkg = JSON.parse(fs.readFileSync("./package.json"));
var saved = global.sc;

module.exports = global.sc = { VERSION: pkg.version };

require("./src/const");
require("./src/sc/");
require("./src/sc/classlib/");

if (typeof saved !== "undefined") {
  global.sc = saved;
} else {
  delete global.sc;
}

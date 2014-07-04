"use strict";

var saved = global.sc;
var pkg = require("../package.json");

global.sc = { VERSION: pkg.version };

require("./const");
require("./sc/");
require("./sc/classlib/");

module.exports = sc.SCScript;

if (typeof saved !== "undefined") {
  global.sc = saved;
} else {
  delete global.sc;
}

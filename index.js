"use strict";

var fs = require("fs");

var pkg = JSON.parse(fs.readFileSync("./package.json"));
var saved = global.sc;

module.exports = global.sc = { VERSION: pkg.version };

require("./src/sc/sc");
require("./src/sc/installer");

if (typeof saved !== "undefined") {
  global.sc = saved;
} else {
  delete global.sc;
}

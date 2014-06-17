"use strict";

var ORDER    = { undefined: 1, libs: 2, lang: 3, classlib: 4, server: 5 };
var DIRNAME  = 1;
var FILENAME = 2;

var re     = /^src\/sc\/(?:(.+?)\/)?(.+)\.js$/;

var order = function(dirname) {
  return ORDER[dirname] || Infinity;
};

var depth = function(filepath) {
  return filepath.split("/").length;
};

var byFilePath = function(a, b) {
  var cond = 0;

  a = re.exec(a);
  b = re.exec(b);

  cond = cond || order(a[DIRNAME]) - order(b[DIRNAME]);
  cond = cond || depth(a[FILENAME]) - depth(b[FILENAME]);
  cond = cond || a[FILENAME] < b[FILENAME] ? -1 : +1;

  return cond;
};

module.exports = {
  byFilePath: byFilePath
};

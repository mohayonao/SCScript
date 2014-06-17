"use strict";

var clearCache = function() {
  Object.keys(require.cache).forEach(function(filepath) {
    if (!/\/node_modules\//.test(filepath)) {
      delete require.cache[filepath];
    }
  });
};

module.exports = {
  clearCache: clearCache
};

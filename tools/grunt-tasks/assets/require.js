"use strict";

var _ = require("underscore");

var clearCache = function() {
  _.chain(require.cache).keys().each(function(filepath) {
    if (!/\/node_modules\//.test(filepath)) {
      delete require.cache[filepath];
    }
  });
};

module.exports = {
  clearCache: clearCache
};

"use strict";

var options = require("./options");

module.exports = {
  show: function() {
    console.log(options.generateHelp());
  }
};

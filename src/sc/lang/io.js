(function(sc) {
  "use strict";

  require("./sc");

  var io = {};

  var SCScript = sc.SCScript;
  var buffer   = "";

  io.post = function(msg) {
    var items;

    items  = (buffer + msg).split("\n");
    buffer = items.pop();

    items.forEach(function(msg) {
      SCScript.stdout(msg);
    });
  };

  io.warn = function(msg) {
    SCScript.stderr(msg);
  };

  sc.lang.io = io;

})(sc);

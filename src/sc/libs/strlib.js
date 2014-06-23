(function(sc) {
  "use strict";

  require("./sc");

  var slice = [].slice;
  var strlib = {};

  strlib.article = function(name) {
    if (/^[AEIOU]/i.test(name)) {
      return "an";
    }
    return "a";
  };

  strlib.isClassName = function (name) {
    var ch = name.charCodeAt(0);
    return 0x41 <= ch && ch <= 0x5a;
  };

  strlib.format = function(fmt, list) {
    var msg = fmt;
    if (Array.isArray(list)) {
      list.forEach(function(value, index) {
        msg = msg.replace(
          new RegExp("@\\{" + index + "\\}", "g"), String(value)
        );
      });
    }
    slice.call(arguments, 1).forEach(function(value, index) {
      msg = msg.replace(
        new RegExp("#\\{" + index + "\\}", "g"), String(value)
      );
    });
    return msg;
  };

  sc.libs.strlib = strlib;
})(sc);

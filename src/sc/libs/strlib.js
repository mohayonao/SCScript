(function(sc) {
  "use strict";

  require("./libs");

  var slice = [].slice;
  var strlib = {};

  strlib.article = function(name) {
    if (/^[AEIOU]/i.test(name)) {
      return "an";
    }
    return "a";
  };

  strlib.isClassName = function(name) {
    var ch = name.charCodeAt(0);
    return 0x41 <= ch && ch <= 0x5a;
  };

  function formatWithList(fmt, list) {
    var msg = fmt;
    list.forEach(function(value, index) {
      msg = msg.replace(
        new RegExp("#\\{" + index + "\\}", "g"), String(value)
      );
    });
    return msg;
  }

  function formatWithDict(fmt, dict) {
    var msg = fmt;
    Object.keys(dict).forEach(function(key) {
      if (/^\w+$/.test(key)) {
        msg = msg.replace(
          new RegExp("#\\{" + key + "\\}", "g"), String(dict[key])
        );
      }
    });
    return msg;
  }

  strlib.format = function(fmt, arg) {
    if (Array.isArray(arg)) {
      return formatWithList(fmt, arg);
    }
    if (arg && arg.constructor === Object) {
      return formatWithDict(fmt, arg);
    }
    return formatWithList(fmt, slice.call(arguments, 1));
  };

  sc.libs.strlib = strlib;
})(sc);

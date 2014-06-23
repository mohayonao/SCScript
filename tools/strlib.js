/* jshint freeze: false */
"use strict";

String.format = function(fmt, list) {
  var msg = fmt;
  if (Array.isArray(list)) {
    list.forEach(function(value, index) {
      msg = msg.replace(
        new RegExp("@\\{" + index + "\\}", "g"), String(value)
      );
    });
  }
  [].slice.call(arguments, 1).forEach(function(value, index) {
    msg = msg.replace(
      new RegExp("#\\{" + index + "\\}", "g"), String(value)
    );
  });
  return msg;
};

String.prototype.repeat = function(n) {
  var str = "";
  while (n-- > 0) {
    str += String(this);
  }
  return str;
};

String.prototype.rightAlign = function(len, ch) {
  ch = ch || " ";
  return (ch.repeat(len) + String(this)).substr(-len);
};

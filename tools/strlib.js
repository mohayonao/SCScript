"use strict";

var slice = [].slice;

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

String.format = function(fmt, arg) {
  if (Array.isArray(arg)) {
    return formatWithList(fmt, arg);
  }
  if (arg && arg.constructor === Object) {
    return formatWithDict(fmt, arg);
  }
  return formatWithList(fmt, slice.call(arguments, 1));
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

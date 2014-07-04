(function(sc) {
  "use strict";

  require("./lang");
  require("./dollar");

  var slice = [].slice;
  var $ = sc.lang.$;

  var fn = function(func, def) {
    var argItems, argNames, argVals;
    var remain, wrapper;

    if (!def) {
      return func;
    }

    argItems = def.split(/\s*;\s*/);
    if (argItems[argItems.length - 1].charAt(0) === "*") {
      remain = !!argItems.pop();
    }

    argNames = new Array(argItems.length);
    argVals  = new Array(argItems.length);

    argItems.forEach(function(items, i) {
      items = items.split("=");
      argNames[i] = items[0].trim();
      argVals [i] = getDefaultValue(items[1] || "nil");
    });

    wrapper = function() {
      var given, args;

      given = slice.call(arguments);
      args  = argVals.slice();

      if (isDictionary(given[given.length - 1])) {
        setKeywordArguments(args, argNames, given.pop());
      }

      copy(args, given, Math.min(argNames.length, given.length));

      if (remain) {
        args.push($.Array(given.slice(argNames.length)));
      }

      return func.apply(this, args);
    };

    wrapper._argNames = argNames;
    wrapper._argVals  = argVals;

    return wrapper;
  };

  function isDictionary(obj) {
    return !!(obj && obj.constructor === Object);
  }

  function copy(args, given, length) {
    for (var i = 0; i < length; ++i) {
      if (given[i]) {
        args[i] = given[i];
      }
    }
  }

  function _getDefaultValue(value) {
    var ch;

    switch (value) {
    case "nil":
      return $.Nil();
    case "true":
      return $.True();
    case "false":
      return $.False();
    case "inf":
      return $.Float(Infinity);
    case "-inf":
      return $.Float(-Infinity);
    }

    ch = value.charAt(0);
    switch (ch) {
    case "$":
      return $.Char(value.charAt(1));
    case "\\":
      return $.Symbol(value.substr(1));
    }

    if (value.indexOf(".") !== -1) {
      return $.Float(+value);
    }

    return $.Integer(+value);
  }

  function getDefaultValue(value) {
    if (value.charAt(0) === "[") {
      return $.Array(value.slice(1, -2).split(",").map(function(value) {
        return _getDefaultValue(value.trim());
      }));
    }
    return _getDefaultValue(value);
  }

  function setKeywordArguments(args, argNames, dict) {
    Object.keys(dict).forEach(function(key) {
      var index = argNames.indexOf(key);
      if (index !== -1) {
        args[index] = dict[key];
      }
    });
  }

  sc.lang.fn = fn;
})(sc);

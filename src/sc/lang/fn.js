(function(sc) {
  "use strict";

  require("./dollarSC");
  require("./compiler");
  require("./parser");

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var _getDefaultValue = function(value) {
    var ch;

    switch (value) {
    case "nil":
      return $SC.Nil();
    case "true":
      return $SC.True();
    case "false":
      return $SC.False();
    case "inf":
      return $SC.Float(Infinity);
    case "-inf":
      return $SC.Float(-Infinity);
    }

    ch = value.charAt(0);
    switch (ch) {
    case "$":
      return $SC.Char(value.charAt(1));
    case "\\":
      return $SC.Symbol(value.substr(1));
    }

    if (value.indexOf(".") !== -1) {
      return $SC.Float(+value);
    }

    return $SC.Integer(+value);
  };

  var getDefaultValue = function(value) {
    if (value.charAt(0) === "[") {
      return $SC.Array(value.slice(1, -2).split(",").map(function(value) {
        return _getDefaultValue(value.trim());
      }));
    }
    return _getDefaultValue(value);
  };

  var fn = function(func, def) {
    var argItems, argNames, argVals;
    var remain, wrapper;

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
        args.push($SC.Array(given.slice(argNames.length)));
      }

      return func.apply(this, args);
    };

    wrapper._argNames = argNames;
    wrapper._argVals  = argVals;

    return wrapper;
  };

  var isDictionary = function(obj) {
    return !!(obj && obj.constructor === Object);
  };

  var copy = function(args, given, length) {
    for (var i = 0; i < length; ++i) {
      if (given[i]) {
        args[i] = given[i];
      }
    }
  };

  var setKeywordArguments = function(args, argNames, dict) {
    Object.keys(dict).forEach(function(key) {
      var index = argNames.indexOf(key);
      if (index !== -1) {
        args[index] = dict[key];
      }
    });
  };

  sc.lang.fn = fn;

})(sc);

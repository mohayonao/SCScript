(function(sc) {
  "use strict";

  require("./dollarSC");

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var fn = function(func, def) {
    var argNames, remain, wrapper;

    argNames = def.split(/\s*,\s*/);
    if (argNames[argNames.length - 1].charAt(0) === "*") {
      remain = !!argNames.pop();
    }

    wrapper = function() {
      var given, args;
      var i, imax;

      given = slice.call(arguments);
      args  = new Array(argNames.length);

      if (isDictionary(given[given.length - 1])) {
        setKeywordArguments(args, argNames, given.pop());
      }

      for (i = 0, imax = Math.min(argNames.length, given.length); i < imax; ++i) {
        args[i] = given[i];
      }

      if (remain) {
        args.push($SC.Array(given.slice(argNames.length)));
      }

      return func.apply(this, args);
    };

    return wrapper;
  };

  var isDictionary = function(obj) {
    return !!(obj && obj.constructor === Object);
  };

  var setKeywordArguments = function(args, argNames, dict) {
    var keys, name, index;
    var i, imax;

    keys = Object.keys(dict);
    for (i = 0, imax = keys.length; i < imax; ++i) {
      name  = keys[i];
      index = argNames.indexOf(name);
      if (index !== -1) {
        args[index] = dict[name];
      }
    }
  };

  sc.lang.fn = fn;

})(sc);

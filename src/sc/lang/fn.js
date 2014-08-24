(function(sc) {
  "use strict";

  require("./lang");
  require("./dollar");

  var slice = [].slice;
  var $ = sc.lang.$;

  sc.lang.fn = function(func, def) {
    return compile(def).wrap(func);
  };

  var compile = sc.lang.fn.compile = function(def) {
    if (def === null) {
      return nopTransducer;
    }

    var defItems = getDefItems(def);

    function transduce(given) {
      var args  = defItems.vals.slice();

      if (isDictionary(peek(given))) {
        setKeywordArguments(args, defItems.names, given.pop());
      }

      copy(args, given, Math.min(defItems.names.length, given.length));

      if (defItems.remain) {
        args.push($.Array(given.slice(defItems.names.length)));
      }

      return args;
    }

    return build(transduce, defItems.names, defItems.vals, function(func) {
      var wrapped = function() {
        return func.apply(this, transduce(slice.call(arguments)));
      };

      wrapped.transduce = transduce;

      return wrapped;
    });
  };

  var nopTransducer = (function() {
    function transduce(given) {
      return given;
    }

    return build(transduce, [], [], function(func) {
      func.transduce = transduce;
      return func;
    });
  })();

  function build(transduce, names, vals, wrap) {
    transduce.wrap = wrap;
    transduce.names = names;
    transduce.vals = vals;

    return transduce;
  }

  function getDefItems(def) {
    var items = def.split(/\s*;\s*/);
    var remain = peek(items).charAt(0) === "*" ? !!items.pop() : false;
    var names  = new Array(items.length);
    var vals   = new Array(items.length);

    items.forEach(function(items, i) {
      items = items.split("=");
      names[i] = items[0].trim();
      vals [i] = getDefaultValue(items[1] || "nil");
    });

    return { names: names, vals: vals, remain: remain };
  }

  function peek(list) {
    return list[list.length - 1];
  }

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

  function getDefaultValue(value) {
    if (value.charAt(0) === "[") {
      return $.Array(value.slice(1, -2).split(",").map(function(value) {
        return getDefaultValue(value.trim());
      }));
    }
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

    var ch = value.charAt(0);
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

  function setKeywordArguments(args, argNames, dict) {
    Object.keys(dict).forEach(function(key) {
      var index = argNames.indexOf(key);
      if (index !== -1) {
        args[index] = dict[key];
      }
    });
  }
})(sc);

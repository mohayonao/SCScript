/* globals _: true, it: true, expect: true, esprima: true, escodegen: true */
(function(sc) {
  "use strict";

  require("../src/sc/");
  require("../src/sc/classlib/");

  var $ = sc.lang.$;

  var SCObject = $("Object");
  var SCEnvironment = $("Environment");
  var SCPseq = $("Pseq");
  var SCRoutine = $("Routine");

  function nth(list, index) {
    return list[index];
  }

  function first(list) {
    return nth(list, 0);
  }

  function second(list) {
    return nth(list, 1);
  }

  function third(list) {
    return nth(list, 2);
  }

  function isNaN(num) {
    return typeof num === "number" && global.isNaN(num);
  }

  function isFinite(num) {
    return typeof num === "number" && global.isFinite(num);
  }

  function isDictionary(obj) {
    return _.isObject(obj) && obj.constructor === Object;
  }

  function isInteger(obj) {
    return _.isNumber(obj) && Math.floor(obj) === Math.ceil(obj);
  }

  function isChar(obj) {
    return _.isString(obj) && /^\$.$/.test(obj);
  }

  function isSymbol(obj) {
    return _.isString(obj) && obj.charAt(0) === "\\";
  }

  function isSCObject(obj) {
    return _.isObject(obj) && typeof obj._ !== "undefined";
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function js(str) {
    return ast2js(js2ast(str));
  }

  function js2ast(js) {
    return esprima.parse(js);
  }

  function ast2js(ast) {
    return escodegen.generate(ast);
  }

  function toString(obj) {
    var str = JSON.stringify(obj) || (typeof obj);

    if (str.length > 2) {
      str = str.replace(/([{[,])/g, "$1 ").replace(/([\]}])/g, " $1");
    }

    return str;
  }

  function typeOf(obj, guess) {
    if (isSCObject(obj)) {
      if (obj.__tag === sc.TAG_BOOL) {
        return "SCBoolean";
      }
      return "SC" + obj.__className;
    }

    if (guess) {
      return typeOf(toSCObject(obj));
    }

    if (_.isNull(obj)) {
      return "JSNull";
    }

    if (_.isArray(obj)) {
      return "JSArray";
    }

    return "JS" + capitalize(typeof obj);
  }

  function toSCObject(obj, opts) {
    var $ = sc.lang.$;

    if (isSCObject(obj)) {
      return obj;
    }

    if (_.isArray(obj)) {
      return $.Array(obj.map(toSCObject));
    }

    if (_.isNull(obj)) {
      return $.Nil();
    }

    if (_.isUndefined(obj)) {
      return undefined;
    }

    if (isInteger(obj)) {
      return $.Integer(obj);
    }

    if (_.isNumber(obj)) {
      return $.Float(obj);
    }

    if (_.isBoolean(obj)) {
      return $.Boolean(obj);
    }

    if (isChar(obj)) {
      return $.Char(obj.charAt(1));
    }

    if (isSymbol(obj)) {
      return $.Symbol(obj.substr(1));
    }

    if (_.isString(obj)) {
      return $.String(obj);
    }

    if (_.isFunction(obj)) {
      return $.Function(function() {
        return [ obj ];
      }, typeof opts === "string" ? opts : undefined);
    }

    return obj;
  }

  sc.test = function(callback) {
    return function() {
      SCEnvironment.new().push();
      callback.apply(this);
      SCEnvironment.pop();
    };
  };

  sc.test.testCase = function(context, cases, opts) {
    opts = opts || {};

    var methodName    = context.test.title;
    var isClassMethod = methodName.charAt(0) === ".";

    methodName = methodName.substr(1).replace(/\..*$/, "");

    if (isInteger(opts.randSeed)) {
      sc.libs.random.setSeed(opts.randSeed);
    }

    cases.forEach(function(items) {
      var source, args, result, error;

      if (Array.isArray(items)) {
        source = first(items);
        args   = second(items);
        result = third(items);
        if (result instanceof Error) {
          error = result.message;
        }
      } else {
        source = items.source;
        args   = items.args || [];
        result = items.result;
        error  = items.error;
      }

      var desc = sc.libs.strlib.format(
        "#{0}.#{1}(#{2})", toString(source), methodName, toString(args).slice(2, -2)
      );

      var instance;
      if (isClassMethod) {
        instance = context.createInstance().class();
      } else {
        instance = context.createInstance(source, !!items.immutable);
      }

      if (error) {
        return expect(function() {
          instance[methodName].apply(instance, args.map(toSCObject));
        }).to.throw(error);
      }

      var test = instance[methodName].apply(instance, args.map(toSCObject));

      if (result === context) {
        // expect to return this like `function() { return this; }`
        expect(test, desc).to.equal(instance);
      } else {
        var expected = toSCObject(result);
        var type     = typeOf(expected);

        if (result) {
          result = result.valueOf();
          if (type === "SCSymbol" && isSymbol(result)) {
            result = result.substr(1);
          } else if (type === "SCChar" && isChar(result)) {
            result = result.substr(1);
          }
        }

        var expects = expect(test, desc);

        switch (type) {
        case "SCInteger":
        case "SCSymbol":
        case "SCChar":
        case "SCNil":
        case "SCBoolean":
        case "SCString":
          expects.to.a(type).that.equals(result);
          break;
        case "SCFloat":
          expects = expects.to.a("SCFloat");
          if (isFinite(result) && opts.closeTo) {
            expects.that.is.closeTo(result, opts.closeTo);
          } else if (isNaN(result)) {
            expects.that.is.NaN; // jshint ignore: line
          } else {
            expects.that.equals(result);
          }
          break;
        case "SCArray":
          expects.to.a("SCArray").that.deep.equals(result);
          break;
        case "SCFunction":
          expects.to.equal(result);
          break;
        default:
          expect(test.valueOf(), desc).to.eql(result);
        }
      }

      // test for destructive
      var raw   = instance.valueOf();
      var after = items.after || null;

      if (_.isNull(after) && _.isArray(raw)) {
        after = source.valueOf().slice().map(function(a) {
          return a && a.valueOf();
        });
      }

      if (after) {
        expect(raw, desc + ": after").to.deep.equal(after);
      }
    });
  };

  function setUniqMethod(instance, className, methodName) {
    if (setUniqMethod.prev) {
      delete setUniqMethod.prev.instance[setUniqMethod.prev.methodName];
      setUniqMethod.prev = null;
    }

    var method = sc.lang.klass._classes[className].__Spec.prototype[methodName];

    Object.defineProperty(instance, methodName, { value: method, configurable: true });

    setUniqMethod.prev = { instance: instance, methodName: methodName };
  }

  function createSCObjectFrom(defaults) {
    var instance = SCObject.new();

    _.chain(defaults).keys().each(function(key) {
      Object.defineProperty(instance, key, { value: defaults[key] });
    });

    return instance;
  }

  sc.test.object = function(source, opts) {
    var instance;

    if (isSCObject(source)) {
      instance = source;
    } else if (_.isUndefined(source) || isDictionary(source)) {
      instance = createSCObjectFrom(source);
    } else {
      instance = toSCObject(source, opts);
    }

    var matches = /^([A-Z]\w*)#([a-z]\w*|[-+*\/%<=>!?&|@]+)/.exec(opts);
    if (matches) {
      setUniqMethod(instance, second(matches), third(matches));
    }

    instance.__testid = instance.__hash;

    return instance;
  };

  sc.test.func = function() {
    var seed = Math.random();

    function func() {
      return seed;
    }
    func.__seed = seed;

    return func;
  };

  sc.test.routine = function(source, opts) {
    if (_.isArray(source)) {
      if (!_.isEmpty(source)) {
        return SCPseq.new(toSCObject(source), toSCObject(opts || 1)).asStream();
      }
      return SCRoutine.new(toSCObject(function() {
        return toSCObject(source).do(toSCObject(function($_) {
          return $_.yield();
        }));
      }));
    }
  };

  sc.test.OK   = "@OK";
  sc.test.PASS = "@PASS";

  sc.test.compile = function(methodName, opts) {

    function func(items) {
      var code     = first(items);
      var expected = second(items);

      if (expected === sc.test.PASS) {
        return;
      }

      var chain, desc;
      if (expected === sc.test.OK) {
        chain    = "not";
        desc     = "ok";
        expected = null;
      } else {
        chain = "to";
        desc  = "throw " + expected;
      }

      it(code + ": " + desc, function() {
        var lexer  = new sc.lang.compiler.Lexer(code);
        var parser = new sc.lang.compiler.Parser(null, lexer);

        expect(function() {
          parser[methodName](opts);
        }).to[chain].throw(expected);
      });
    }

    func.each = function(suites) {
      return _.each(_.pairs(suites), func);
    };

    return func;
  };

  sc.test.parse = function(methodName, opts) {

    function func(items) {
      var code     = first(items);
      var expected = second(items);

      it(code, function() {
        var lexer  = new sc.lang.compiler.Lexer(code, { loc: true, range: true });
        var parser = new sc.lang.compiler.Parser(null, lexer);
        var ast = parser[methodName](opts);

        expect(ast).to.eql(expected);
      });
    }

    func.each = function(suites) {
      return _.each(_.pairs(suites), func);
    };

    return func;
  };

  sc.test.codegen = function() {

    function func(items) {
      var code = items.code;
      var ast = items.ast;
      var expected = items.expected;
      var before   = items.before;

      it(code, function() {
        var codegen = new sc.lang.compiler.CodeGen();

        if (before) {
          before(codegen);
        }

        var compiled = codegen.generate(ast);

        expect(js(compiled)).to.equal(js(expected));
      });
    }

    func.each = function(suites) {
      return _.each(suites, func);
    };

    return func;
  };

  // chai extending
  global.chai.use(function(chai, utils) {
    var Assertion = chai.Assertion;

    Assertion.overwriteChainableMethod("a", function(_super) {
      return function(type) {
        if (!/^(SC|JS)/.test(String(type))) {
          return _super.apply(this, arguments);
        }

        var object = utils.flag(this, "object");
        var actual = typeOf(object);

        this.assert(
          actual === type,
          "expected " + actual + " to be a " + type,
          "expected " + actual + " not to be a " + type
        );

        if (isSCObject(object)) {
          object = object.valueOf();
        }

        return new Assertion(object, utils.flag(this, "message"));
      };
    }, function() {
      return function() {
        return this;
      };
    });

    Assertion.addMethod("clsTo", function(expected, delta, msg) {
      var actual = utils.flag(this, "object");

      if (![ actual, expected ].every(Array.isArray)) {
        return this.closeTo(expected, delta, msg);
      }

      msg = msg || "";
      for (var i = 0, imax = Math.max(actual.length, expected.length); i < imax; ++i) {
        new Assertion(actual[i]).deep.closeTo(expected[i], delta, msg + "[" + i + "]");
      }

      return this;
    });

    Assertion.overwriteMethod("closeTo", function(_super) {
      return function(expected, delta, msg) {
        var actual = utils.flag(this, "object");

        if ( utils.flag(this, "deep") && [ actual, expected ].every(Array.isArray) ) {
          return this.clsTo(expected, delta, msg);
        }

        return _super.apply(this, arguments);
      };
    });

    Assertion.addMethod("withMessage", function() {
      utils.flag(this, "message", sc.libs.strlib.format.apply(null, arguments));
    });

    Assertion.addMethod("calledLastIn", function(seed) {
      var expected = utils.flag(this, "object").__seed;
      this.assert(
        seed === expected || (seed && seed.__seed === expected),
        "expected #{this} to be called last",
        "expected #{this} to be not called last",
        this.negate ? false : true
      );
    });

    Assertion.addProperty("doNothing", function() {
      this.assert(
        utils.flag(this, "object") === sc.lang.$.DoNothing,
        "expected #{this} to do nothing",
        "expected #{this} to not do nothing",
        this.negate ? false : true
      );
    });

    Assertion.addProperty("NaN", function() {
      this.assert(
        isNaN(utils.flag(this, "object")),
        "expected #{this} to be NaN",
        "expected #{this} to be not NaN",
        this.negate ? false : true
      );
    });
  });
})(sc);

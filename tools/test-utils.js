/* globals _: true, it: true, expect: true, esprima: true */
(function(sc) {
  "use strict";

  require("../src/sc/");
  require("../src/sc/classlib/");

  var $ = sc.lang.$;

  var SCEnvironment = $("Environment");
  var SCPseq = $("Pseq");
  var SCRoutine = $("Routine");

  sc.test = function(callback) {
    return function() {
      SCEnvironment.new().push();
      callback.apply(this);
      SCEnvironment.pop();
    };
  };

  function toSCObject(obj, opts) {
    var $ = sc.lang.$;

    if (isSCObject(obj)) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return $.Array(obj.map(toSCObject));
    }
    if (obj === null) {
      return $.Nil();
    }
    if (typeof obj === "undefined") {
      return undefined;
    }
    if (typeof obj === "number") {
      if ((obj|0) === obj) {
        return $.Integer(obj);
      } else {
        return $.Float(obj);
      }
    }
    if (typeof obj === "boolean") {
      return $.Boolean(obj);
    }
    if (typeof obj === "string") {
      if (obj.length === 2 && obj.charAt(0) === "$") {
        return $.Char(obj.charAt(1));
      }
      if (obj.charAt(0) === "\\") {
        return $.Symbol(obj.substr(1));
      }
      return $.String(obj);
    }
    if (typeof obj === "function") {
      return $.Function(function() {
        return [ obj ];
      }, typeof opts === "string" ? opts : undefined);
    }

    return obj;
  }

  function toString(obj) {
    var str = JSON.stringify(obj) || (typeof obj);
    if (str.length > 2) {
      str = str.replace(/([{[,])/g, "$1 ").replace(/([\]}])/g, " $1");
    }
    return str;
  }

  function isDictionary(obj) {
    return obj && obj.constructor === Object;
  }

  function isSCObject(obj) {
    return obj && typeof obj._ !== "undefined";
  }

  function typeOf(obj, guess) {
    var type;

    if (isSCObject(obj)) {
      if (obj.__tag === sc.TAG_BOOL) {
        return "SCBoolean";
      }
      return "SC" + obj.__className;
    }

    if (guess) {
      return typeOf(toSCObject(obj));
    }

    if (obj === null) {
      return "JSNull";
    }

    if (Array.isArray(obj)) {
      return "JSArray";
    }

    type = typeof obj;
    return "JS" + type.charAt(0).toUpperCase() + type.slice(1);
  }

  sc.test.testCase = function(context, cases, opts) {
    var expect = global.expect;
    var methodName    = context.test.title;
    var isClassMethod = (methodName.charAt(0) === ".");

    opts = opts || {};
    methodName = methodName.substr(1).replace(/\..*$/, "");

    if (typeof opts.randSeed === "number") {
      sc.libs.random.setSeed(opts.randSeed);
    }

    cases.forEach(function(items) {
      var instance, test, raw, desc, expected;
      var source, args, result, error, type;

      if (Array.isArray(items)) {
        source = items[0];
        args   = items[1];
        result = items[2];
        if (result instanceof Error) {
          error = result.message;
        }
      } else {
        source = items.source;
        args   = items.args || [];
        result = items.result;
        error  = items.error;
      }

      desc = sc.libs.strlib.format(
        "#{0}.#{1}(#{2})", toString(source), methodName, toString(args).slice(2, -2)
      );

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

      test = instance[methodName].apply(instance, args.map(toSCObject));
      if (result === context) {
        // expect to return this like `function() { return this; }`
        expect(test).withMessage(desc).to.equal(instance);
      } else {
        expected = toSCObject(result);
        type     = typeOf(expected);
        if (result) {
          result   = result.valueOf();
          if (type === "SCSymbol" && result.charAt(0) === "\\") {
            result = result.substr(1);
          } else if (type === "SCChar" && result.charAt(0) === "$") {
            result = result.substr(1);
          }
        }
        switch (type) {
        case "SCInteger":
        case "SCSymbol":
        case "SCChar":
        case "SCNil":
        case "SCBoolean":
        case "SCString":
          expect(test).withMessage(desc)
            .to.a(type).that.equals(result);
          break;
        case "SCFloat":
          if (isFinite(result) && opts.closeTo) {
            expect(test).withMessage(desc)
              .to.a("SCFloat").that.is.closeTo(result, opts.closeTo);
          } else if (isNaN(result)) {
            expect(test).withMessage(desc)
              .to.a("SCFloat").that.is.nan; // jshint ignore: line
          } else { // Infinity
            expect(test).withMessage(desc)
              .to.a("SCFloat").that.equals(result);
          }
          break;
        case "SCArray":
          expect(test).withMessage(desc)
            .to.a("SCArray").that.eqls(result);
          break;
        case "SCFunction":
          expect(test).withMessage(desc)
            .to.equal(result);
          break;
        default:
          expect(test.valueOf()).withMessage(desc).to.eql(result);
        }
      }

      // test for destructive
      raw = instance.valueOf();
      if (Array.isArray(raw)) {
        if (items.after) {
          expect(raw).withMessage(desc + ": after").to.eql(items.after);
        } else {
          expect(raw).withMessage(desc + ": after").to.eql(
            source.valueOf().slice().map(function(x) {
              return x && x.valueOf();
            })
          );
        }
      } else if (isDictionary(raw)) {
        if (items.after) {
          expect(raw).withMessage(desc + ": after").to.eql(items.after);
        }
      }
    });
  };

  var prev = null;
  function setSingletonMethod(instance, className, methodName) {
    var method;

    if (prev) {
      delete prev.instance[prev.methodName];
      prev = null;
    }

    method = sc.lang.klass._classes[className].__Spec.prototype[methodName];
    Object.defineProperty(instance, methodName, {
      value: method, configurable: true
    });
    prev = {
      instance: instance, methodName: methodName
    };
  }

  sc.test.object = function(source, opts) {
    var instance, matches;

    if (isSCObject(source)) {
      instance = source;
      matches = /^([A-Z]\w*)#([a-z]\w*|[-+*\/%<=>!?&|@]+)/.exec(opts);
      if (matches) {
        setSingletonMethod(instance, matches[1], matches[2]);
      }
    } else if (typeof source === "undefined") {
      instance = sc.lang.klass._classes.Object.new();
    } else if (isDictionary(source)) {
      instance = sc.lang.klass._classes.Object.new();
      Object.keys(source).forEach(function(key) {
        Object.defineProperty(instance, key, {
          value: source[key]
        });
      });
    } else {
      instance = toSCObject(source, opts);
    }
    instance.__testid = instance.__hash;

    return instance;
  };

  sc.test.func = function() {
    var seed, fn;

    seed = Math.random();
    fn = function() {
      return seed;
    };
    fn.__seed = seed;

    return fn;
  };

  sc.test.routine = function(source, opts) {
    if (Array.isArray(source)) {
      if (source.length) {
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
    var func = function(items) {
      var code = items[0], expected = items[1];
      var chain, desc;
      if (expected === sc.test.PASS) {
        return;
      }
      if (expected === sc.test.OK) {
        chain = "not";
        desc = "ok";
        expected = null;
      } else {
        chain = "to";
        desc = "throw " + expected;
      }
      it(code + ": " + desc, function() {
        var lexer  = new sc.lang.compiler.Lexer(code);
        var parser = new sc.lang.compiler.Parser(null, lexer);
        expect(function() {
          parser[methodName](opts);
        }).to[chain].throw(expected);
      });
    };
    func.each = function(suites) {
      return _.each(_.pairs(suites), func);
    };
    return func;
  };

  sc.test.parse = function(methodName, opts) {
    var func = function(items) {
      var code = items[0], expected = items[1];
      it(code, function() {
        var lexer  = new sc.lang.compiler.Lexer(code, { loc: true, range: true });
        var parser = new sc.lang.compiler.Parser(null, lexer);
        var ast = parser[methodName](opts);
        expect(ast).to.eql(expected);
      });
    };
    func.each = function(suites) {
      return _.each(_.pairs(suites), func);
    };
    return func;
  };

  sc.test.codegen = function() {
    var func = function(items) {
      var code = items.code;
      var ast = items.ast;
      var expected = items.expected;
      var before   = items.before;
      it(code, function() {
        var expectedAST = esprima.parse(expected);
        var codegen = new sc.lang.compiler.CodeGen();
        if (before) {
          before(codegen);
        }
        var compiled  = codegen.generate(ast);
        var actualAST = esprima.parse(compiled);
        expect(actualAST).to.eql(expectedAST);
      });
    };
    func.each = function(suites) {
      return _.each(suites, func);
    };
    return func;
  };

  // for chai
  global.chai.use(function(chai, utils) {
    var assert$proto = chai.Assertion.prototype;

    utils.overwriteChainableMethod(assert$proto, "a", function(_super) {
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
        if (object && typeof object._ !== "undefined") {
          object = object.valueOf();
        }

        return new chai.Assertion(object, utils.flag(this, "message"));
      };
    }, function() {
      return function() {
        return this;
      };
    });

    utils.overwriteMethod(assert$proto, "closeTo", function(_super) {
      return function(expected, delta, msg) {
        if (utils.flag(this, "deep")) {
          return this.clsTo(expected, delta, msg);
        }
        return _super.apply(this, arguments);
      };
    });

    utils.addMethod(assert$proto, "clsTo", function(expected, delta, msg) {
      var obj = utils.flag(this, "object");
      if (!Array.isArray(obj) || !Array.isArray(expected)) {
        return this.closeTo(expected, delta, msg);
      }
      msg = msg || "";
      for (var i = 0, imax = Math.max(obj.length, expected.length); i < imax; ++i) {
        new chai.Assertion(obj[i]).closeTo(expected[i], delta, msg + "[" + i + "]");
      }
      return this;
    });

    utils.addMethod(assert$proto, "withMessage", function() {
      utils.flag(this, "message", sc.libs.strlib.format.apply(null, arguments));
    });

    utils.addMethod(assert$proto, "calledLastIn", function(seed) {
      var expected = utils.flag(this, "object").__seed;
      this.assert(
        seed === expected || (seed && seed.__seed === expected),
        "expected #{this} to be called last",
        "expected #{this} to be not called last",
        this.negate ? false : true
      );
    });

    utils.addProperty(assert$proto, "doNothing", function() {
      this.assert(
        utils.flag(this, "object") === sc.lang.$.DoNothing,
        "expected #{this} to do nothing",
        "expected #{this} to not do nothing",
        this.negate ? false : true
      );
    });

    utils.addProperty(assert$proto, "NaN", function() {
      var num = utils.flag(this, "object");
      this.assert(
        typeof num === "number" && isNaN(num),
        "expected #{this} to be NaN",
        "expected #{this} to be not NaN",
        this.negate ? false : true
      );
    });
  });
})(sc);

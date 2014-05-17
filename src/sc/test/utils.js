(function(sc) {
  "use strict";

  sc.test = {};

  require("../lang/installer");

  require("../classlib/Collections/Array");
  require("../classlib/Collections/Association");
  require("../classlib/Collections/String");
  require("../classlib/Core/Boolean");
  require("../classlib/Core/Char");
  require("../classlib/Core/Function");
  require("../classlib/Core/Nil");
  require("../classlib/Core/Symbol");
  require("../classlib/Math/Integer");
  require("../classlib/Math/Float");

  sc.lang.klass.refine("Object", function(spec) {

    spec.toJSON = function() {
      var value;

      value = this.valueOf();
      if (value === this) {
        value = typeOf(this) + "(" + (this.__testid || 0) + ")";
      } else {
        value = typeOf(this) + "(" + value + ")";
      }

      return JSON.stringify(value);
    };

  });

  var encode = function(a) {
    var $SC = sc.lang.$SC;

    if (Array.isArray(a)) {
      return $SC.Array(a.map(encode));
    }
    if (a === null) {
      return $SC.Nil();
    }
    if (typeof a === "undefined") {
      return undefined;
    }
    if (typeof a._ !== "undefined") {
      return a;
    }
    if (typeof a === "number") {
      if ((a|0) === a) {
        return $SC.Integer(a);
      } else {
        return $SC.Float(a);
      }
    }
    if (typeof a === "boolean") {
      return $SC.Boolean(a);
    }
    if (typeof a === "string") {
      if (a.length === 2 && a.charAt(0) === "$") {
        return $SC.Char(a.charAt(1));
      }
      if (a.charAt(0) === "\\") {
        return $SC.Symbol(a.substr(1));
      }
      return $SC.String(a);
    }

    if (typeof a === "function") {
      return $SC.Function(a);
    }

    return a;
  };
  sc.test.$ = encode;

  var s = function(obj) {
    var str = JSON.stringify(obj) || (typeof obj);
    if (str.length > 2) {
      str = str.replace(/([{[,])/g, "$1 ").replace(/([\]}])/g, " $1");
    }
    return str;
  };

  var isDictionary = function(obj) {
    return obj && obj.constructor === Object;
  };

  var isSCObject = function(obj) {
    return obj && typeof obj._ !== "undefined";
  };

  var typeOf = function(obj, guess) {
    var type;

    if (isSCObject(obj)) {
      switch (obj.__tag) {
      case sc.C.TAG_FALSE: return "SCBoolean";
      case sc.C.TAG_TRUE: return "SCBoolean";
      }
      return "SC" + obj.__className;
    }

    if (guess) {
      return typeOf(encode(obj));
    }

    if (obj === null) {
      return "JSNull";
    }

    if (Array.isArray(obj)) {
      return "JSArray";
    }

    type = typeof obj;
    return "JS" + type.charAt(0).toUpperCase() + type.slice(1);
  };

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

      desc = sc.test.desc(
        "#{0}.#{1}(#{2})", s(source), methodName, s(args).slice(2, -2)
      );

      if (isClassMethod) {
        instance = context.createInstance().class();
      } else {
        instance = context.createInstance(source, !!items.immutable);
      }

      if (error) {
        return expect(function() {
          instance[methodName].apply(instance, args.map(encode));
        }).to.throw(error);
      }

      test = instance[methodName].apply(instance, args.map(encode));
      if (result === context) {
        // expect to return this like `function() { return this; }`
        expect(test).with_message(desc).to.equal(instance);
      } else {
        expected = encode(result);
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
          expect(test).with_message(desc)
            .to.a(type).that.equals(result);
          break;
        case "SCFloat":
          if (isFinite(result) && opts.closeTo) {
            expect(test).with_message(desc)
              .to.a("SCFloat").that.is.closeTo(result, opts.closeTo);
          } else if (isNaN(result)) {
            expect(test).with_message(desc)
              .to.a("SCFloat").that.is.nan; // jshint ignore: line
          } else { // Infinity
            expect(test).with_message(desc)
              .to.a("SCFloat").that.equals(result);
          }
          break;
        case "SCArray":
          expect(test).with_message(desc)
            .to.a("SCArray").that.eqls(result);
          break;
        case "SCFunction":
          expect(test).with_message(desc)
            .to.equal(result);
          break;
        default:
          expect(test.valueOf()).with_message(desc).to.eql(result);
        }
      }

      // test for destructive
      raw = instance.valueOf();
      if (Array.isArray(raw)) {
        if (items.after) {
          expect(raw).with_message(desc + ": after").to.eql(items.after);
        } else {
          expect(raw).with_message(desc + ": after").to.eql(
            source.valueOf().slice().map(function(x) {
              return x && x.valueOf();
            })
          );
        }
      } else if (isDictionary(raw)) {
        if (items.after) {
          expect(raw).with_message(desc + ": after").to.eql(items.after);
        }
      }
    });
  };

  sc.test.desc = function(fmt, list) {
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

  var prev = null;

  sc.test.setSingletonMethod = function(instance, className, methodName) {
    var method;

    if (prev) {
      delete prev.instance[prev.methodName];
      prev = null;
    }

    method = sc.lang.klass.classes[className]._Spec.prototype[methodName];
    Object.defineProperty(instance, methodName, {
      value: method, configurable: true
    });
    prev = {
      instance: instance, methodName: methodName
    };
    return instance;
  };

  sc.test.object = function(properties) {
    var instance = sc.lang.klass.classes.Object.new();

    if (properties) {
      Object.keys(properties).forEach(function(key) {
        Object.defineProperty(instance, key, {
          value: properties[key]
        });
      });
    }
    instance.__testid = instance.__hash;

    return instance;
  };

  Object.defineProperty(sc.test, "func", {
    get: function() {
      var seed, fn;

      seed = Math.random();
      fn = function() {
        return seed;
      };
      fn.__seed = seed;

      return fn;
    }
  });

  sc.test.funcWith = function(func) {
    var seed, fn;

    seed = Math.random();
    fn = function() {
      var ret = func.apply(null, arguments);
      if (ret) {
        Object.defineProperty(ret, "__seed", {
          value: seed
        });
      }
      return ret;
    };
    fn.__seed = seed;

    return fn;
  };

  // for chai
  global.chai.use(function(chai, utils) {
    var assertion_proto = chai.Assertion.prototype;

    utils.overwriteChainableMethod(assertion_proto, "a", function(_super) {
      return function(type, msg) {
        var object, actual, article;

        if (/^(SC|JS)/.test(String(type))) {
          if (msg) {
            utils.flag(this, "message", msg);
          } else {
            msg = utils.flag(this, "message");
          }
          object = utils.flag(this, "object");
          actual = typeOf(object);
          article = ~[
            "A", "E", "I", "O", "U"
          ].indexOf(type.charAt(0)) ? "an " : "a ";
          this.assert(
            actual === type,
            "expected " + actual + " to be " + article + type,
            "expected " + actual + " not to be " + actual + type
          );
          if (object && typeof object._ !== "undefined") {
            object = object.valueOf();
          }
          return new chai.Assertion(object, msg);
        } else {
          return _super.apply(this, arguments);
        }
      };
    }, function() {
      return function() {
        return this;
      };
    });

    utils.addMethod(assertion_proto, "with_message", function() {
      utils.flag(this, "message", sc.test.desc.apply(null, arguments));
    });

    utils.addMethod(assertion_proto, "expect", function(val, message) {
      message = message || utils.flag(this, "message");
      return new chai.Assertion(val, message);
    });

    utils.addMethod(assertion_proto, "calledLastIn", function(seed) {
      var expected = utils.flag(this, "object").__seed;
      this.assert(
        seed === expected || (seed && seed.__seed === expected),
        "expected #{this} to be called last",
        "expected #{this} to be not called last",
        this.negate ? false : true
      );
    });

    utils.addProperty(assertion_proto, "js", function() {
      var obj = utils.flag(this, "object");
      if (Array.isArray(obj)) {
        utils.flag(this, "object", obj.map(function(x) {
          return x.valueOf();
        }));
      }
    });

    utils.addProperty(assertion_proto, "nop", function() {
      this.assert(
        utils.flag(this, "object") === sc.lang.klass.utils.nop,
        "expected #{this} to be nop",
        "expected #{this} to be not nop",
        this.negate ? false : true
      );
    });

    utils.addProperty(assertion_proto, "nan", function() {
      this.assert(
        isNaN(utils.flag(this, "object")),
        "expected #{this} to be NaN",
        "expected #{this} to be not NaN",
        this.negate ? false : true
      );
    });
  });

})(sc);

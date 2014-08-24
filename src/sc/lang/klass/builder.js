(function(sc) {
  "use strict";

  require("./klass");
  require("../dollar");
  require("../fn");

  var $ = sc.lang.$;
  var fn = sc.lang.fn;
  var strlib = sc.libs.strlib;

  function Builder(constructor) {
    this._className = constructor.prototype.__className;
    this._constructor = constructor;
    this._classMethods    = constructor.metaClass.__MetaSpec.prototype;
    this._instanceMethods = constructor.prototype;
  }

  Builder.prototype.init = function(defaults) {
    if (defaults) {
      Object.keys(defaults).forEach(function(name) {
        if (name !== "constructor") {
          this._instanceMethods[name] = defaults[name];
        }
      }, this);
    }
    return this;
  };

  Builder.prototype.addClassMethod = function(name, opts, func) {
    return addMethod(this, this._classMethods, name, opts, func);
  };

  Builder.prototype.addMethod = function(name, opts, func) {
    return addMethod(this, this._instanceMethods, name, opts, func);
  };

  Builder.prototype.addProperty = function(type, name) {
    var attrName = "_$" + name;

    if (type.indexOf("<") === 0) {
      this.addMethod(name, {}, function() {
        return this[attrName] || $.nil;
      });
    }
    if (type.indexOf(">") === type.length - 1) {
      this.addMethod(name + "_", {}, function($_) {
        this[attrName] = $_ || $.nil;
        return this;
      });
    }

    return this;
  };

  function createErrorFunc(errorType, message) {
    var func = function() {
      var errMsg = strlib.format("RECEIVER #{0}: #{1}", this.__className, message);
      throw new Error(errMsg);
    };
    func.__errorType = errorType;
    return func;
  }

  Builder.prototype.subclassResponsibility = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      sc.ERRID_SUBCLASS_RESPONSIBILITY,
      strlib.format("Message '#{0}' should have been implemented by this subclass.", methodName)
    ));
  };

  Builder.prototype.doesNotUnderstand = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      sc.ERRID_DOES_NOT_UNDERSTAND,
      strlib.format("Message '#{0}' is not understood.", methodName)
    ));
  };

  Builder.prototype.shouldNotImplement = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      sc.ERRID_SHOULD_NOT_IMPLEMENT,
      strlib.format("Message '#{0}' not valid for this subclass.", methodName)
    ));
  };

  Builder.prototype.notYetImplemented = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      sc.ERRID_NOT_YET_IMPLEMENTED,
      strlib.format("Message '#{0}' is not yet implemented.", methodName)
    ));
  };

  Builder.prototype.notSupported = function(methodName) {
    return this.addMethod(methodName, {}, createErrorFunc(
      sc.ERRID_NOT_SUPPORTED,
      strlib.format("Message '#{0}' is not supported.", methodName)
    ));
  };

  Builder.prototype.shouldUseLiterals = function(methodName) {
    return this.addClassMethod(methodName, {}, createErrorFunc(
      sc.ERRID_SHOULD_USE_LITERALS,
      strlib.format("Message '#{0}' is ILLEGAL, should use literals instead.", methodName)
    ));
  };

  function bond(that, methods) {
    return methods === that._classMethods ? "." : "#";
  }

  function throwErrorIfAlreadyExists(that, methods, methodName) {
    if (methods.hasOwnProperty(methodName)) {
      throw new Error(strlib.format(
        "#{0} is already defined", (that._className + bond(that, methods) + methodName)
      ));
    }
  }

  function choose(type) {
    switch (type) {
    case sc.TRUE : return $.True;
    case sc.FALSE: return $.False;
    }
    return $.DoNothing;
  }

  function addMethod(that, methods, name, opts, func) {
    throwErrorIfAlreadyExists(that, methods, name);
    if (typeof opts === "function") {
      func = opts;
      opts = {};
    } else if (typeof func !== "function") {
      func = choose(opts);
      opts = {};
    }
    methods[name] = fn(func, opts.args || null);
    return that;
  }

  sc.lang.klass.Builder = Builder;
})(sc);

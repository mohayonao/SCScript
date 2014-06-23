(function(sc) {
  "use strict";

  require("./klass");
  require("../dollar");
  require("../fn");
  require("../../libs/strlib");

  var $ = sc.lang.$;
  var fn = sc.lang.fn;
  var format = sc.libs.strlib.format;

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
    this._throwErrorIfAlreadyExists(this._classMethods, name, ".");
    addMethod(this._classMethods, name, opts, func);
    return this;
  };

  Builder.prototype.addMethod = function(name, opts, func) {
    this._throwErrorIfAlreadyExists(this._instanceMethods, name, "#");
    addMethod(this._instanceMethods, name, opts, func);
    return this;
  };

  Builder.prototype.addProperty = function(type, name) {
    var attrName = "_$" + name;

    if (type === "<>" || type === "<") {
      this.addMethod(name, {}, function() {
        return this[attrName] || $.Nil();
      });
    }
    if (type === "<>" || type === ">") {
      this.addMethod(name + "_", {}, function($_) {
        this[attrName] = $_ || $.Nil();
        return this;
      });
    }
    return this;
  };

  Builder.prototype.subclassResponsibility = function(methodName) {
    var func = function() {
      var errMsg = format(
        "RECEIVER #{0}: '#{1}' should have been implemented by this subclass",
        this.__className, methodName
      );
      throw new Error(errMsg);
    };
    func.__errorType = "subclassResponsibility";
    return this.addMethod(methodName, {}, func);
  };

  Builder.prototype.doesNotUnderstand = function(methodName) {
    var func = function() {
      var errMsg = format(
        "RECEIVER #{0}: '#{1}' not understood",
        this.__className, methodName
      );
      throw new Error(errMsg);
    };
    func.__errorType = "doesNotUnderstand";
    return this.addMethod(methodName, {}, func);
  };

  Builder.prototype.shouldNotImplement = function(methodName) {
    var func = function() {
      var errMsg = format(
        "RECEIVER #{0}: '#{1}' not valid for this subclass",
        this.__className, methodName
      );
      throw new Error(errMsg);
    };
    func.__errorType = "shouldNotImplement";
    return this.addMethod(methodName, {}, func);
  };

  Builder.prototype.notYetImplemented = function(methodName) {
    var func = function() {
      var errMsg = format(
        "RECEIVER #{0}: '#{1}' is not yet implemented",
        this.__className, methodName
      );
      throw new Error(errMsg);
    };
    func.__errorType = "notYetImplemented";
    return this.addMethod(methodName, {}, func);
  };

  Builder.prototype.notSupported = function(methodName) {
    var func = function() {
      var errMsg = format(
        "RECEIVER #{0}: '#{1}' is not supported",
        this.__className, methodName
      );
      throw new Error(errMsg);
    };
    func.__errorType = "notSupported";
    return this.addMethod(methodName, {}, func);
  };

  Builder.prototype._throwErrorIfAlreadyExists = function(methods, methodName, bond) {
    if (methods.hasOwnProperty(methodName)) {
      throw new Error(format(
        "#{0} is already defined", (this._className + bond + methodName)
      ));
    }
  };

  function choose(type) {
    switch (type) {
    case sc.TRUE : return $.True;
    case sc.FALSE: return $.False;
    }
    return $.DoNothing;
  }

  function addMethod(methods, name, opts, func) {
    if (typeof opts === "function") {
      func = opts;
      opts = {};
    } else if (typeof func !== "function") {
      func = choose(opts);
      opts = {};
    }
    methods[name] = fn(func, opts.args);
  }

  sc.lang.klass.Builder = Builder;
})(sc);

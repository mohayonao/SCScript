(function(sc) {
  "use strict";

  require("./klass");
  require("./constructors");

  var $     = sc.lang.$;
  var klass = sc.lang.klass;
  var strlib = sc.libs.strlib;
  var q = strlib.quote;

  var $nil = $.Nil();

  var utils = {
    $nil: $nil,
    $true: $.True(),
    $false: $.False(),
    $int0: $.Integer(0),
    $int1: $.Integer(1),
    nop: function() {
      return this;
    },
    alwaysReturn$nil: $.Nil,
    alwaysReturn$true: $.True,
    alwaysReturn$false: $.False,
    alwaysReturn$int0: function() {
      return utils.$int0;
    },
    alwaysReturn$int1: function() {
      return utils.$int1;
    },
    subclassResponsibility: function(methodName) {
      var func = function() {
        var errMsg = "RECEIVER " + this.__className + ": " +
          q(methodName) + " should have been implemented by this subclass";
        throw new Error(errMsg);
      };
      func.__errorType = "subclassResponsibility";
      return func;
    },
    doesNotUnderstand: function(methodName) {
      var func = function() {
        var errMsg = "RECEIVER " + this.__className + ": " +
          q(methodName) + " not understood";
        throw new Error(errMsg);
      };
      func.__errorType = "doesNotUnderstand";
      return func;
    },
    shouldNotImplement: function(methodName) {
      var func = function() {
        var errMsg = "RECEIVER " + this.__className + ": " +
          q(methodName) + " not valid for this subclass";
        throw new Error(errMsg);
      };
      func.__errorType = "shouldNotImplement";
      return func;
    },
    notYetImplemented: function(methodName) {
      var func = function() {
        var errMsg = "RECEIVER " + this.__className + ": " +
          q(methodName) + " is not yet implemented";
        throw new Error(errMsg);
      };
      func.__errorType = "notYetImplemented";
      return func;
    },
    notSupported: function(methodName) {
      var func = function() {
        var errMsg = "RECEIVER " + this.__className + ": " +
          q(methodName) + " is not supported";
        throw new Error(errMsg);
      };
      func.__errorType = "notSupported";
      return func;
    },
    newCopyArgs: function(that, dict) {
      var instance;

      instance = new that.__Spec();
      Object.keys(dict).forEach(function(key) {
        instance["_$" + key] = dict[key] || $.Nil();
      });

      return instance;
    },
    setProperty: function(spec, type, name) {
      var attrName;

      attrName = "_$" + name;

      if (type === "<>" || type === "<") {
        spec[name] = function() {
          return this[attrName] || $nil;
        };
      }
      if (type === "<>" || type === ">") {
        spec[name + "_"] = function($value) {
          this[attrName] = $value || $nil;
          return this;
        };
      }
    }
  };

  klass.utils = utils;
})(sc);

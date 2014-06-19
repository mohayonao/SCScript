(function(sc) {
  "use strict";

  require("./klass");
  require("./constructors");

  var $     = sc.lang.$;
  var klass = sc.lang.klass;

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
    newCopyArgs: function(that, dict) {
      var instance;

      instance = new that.__Spec();
      Object.keys(dict).forEach(function(key) {
        instance["_$" + key] = dict[key] || $.Nil();
      });

      return instance;
    },
    getMethod: function(className, methodName) {
      return klass.get(className).__Spec.prototype[methodName];
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

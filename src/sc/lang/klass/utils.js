(function(sc) {
  "use strict";

  require("./klass");
  require("./constructors");

  var $     = sc.lang.$;
  var klass = sc.lang.klass;

  var utils = {
    BOOL: function(a) {
      return a.__bool__();
    },
    $nil  : $.Nil(),
    $true : $.True(),
    $false: $.False(),
    $int_0: $.Integer(0),
    $int_1: $.Integer(1),
    nop: function() {
      return this;
    },
    alwaysReturn$nil  : $.Nil,
    alwaysReturn$true : $.True,
    alwaysReturn$false: $.False,
    alwaysReturn$int_0: function() {
      return utils.$int_0;
    },
    alwaysReturn$int_1: function() {
      return utils.$int_1;
    },
    getMethod: function(className, methodName) {
      return klass.get(className).__Spec.prototype[methodName];
    }
  };

  klass.utils = utils;

})(sc);

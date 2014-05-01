(function(sc) {
  "use strict";

  require("./sc");
  require("./dollarSC");
  require("./klass");
  require("./klass-constructors");

  var $SC = sc.lang.$SC;
  var klass = sc.lang.klass;

  var utils = {
    BOOL: function(a) {
      return a.__bool__();
    },
    $nil  : $SC.Nil(),
    $true : $SC.True(),
    $false: $SC.False(),
    $int_0: $SC.Integer(0),
    $int_1: $SC.Integer(1),
    nop: function() {
      return this;
    },
    alwaysReturn$nil  : $SC.Nil,
    alwaysReturn$true : $SC.True,
    alwaysReturn$false: $SC.False,
    alwaysReturn$int_0: function() {
      return utils.$int_0;
    },
    alwaysReturn$int_1: function() {
      return utils.$int_1;
    },
    defaultValue$Nil: function($obj) {
      return $obj || utils.$nil;
    },
    defaultValue$Boolean: function($obj, value) {
      return $obj || $SC.Boolean(value);
    },
    defaultValue$Integer: function($obj, value) {
      return $obj || $SC.Integer(value);
    },
    defaultValue$Float: function($obj, value) {
      return $obj || $SC.Float(value);
    },
    defaultValue$Symbol: function($obj, value) {
      return $obj || $SC.Symbol(value);
    },
    getMethod: function(className, methodName) {
      return klass.get(className)._Spec.prototype[methodName];
    }
  };

  klass.utils = utils;

})(sc);

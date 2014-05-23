(function(sc) {
  "use strict";

  require("./klass");
  require("./constructors");

  var $SC   = sc.lang.$SC;
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
    getMethod: function(className, methodName) {
      return klass.get(className).__Spec.prototype[methodName];
    }
  };

  klass.utils = utils;

})(sc);

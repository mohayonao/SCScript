(function(sc) {
  "use strict";

  require("./Object");

  var $SC = sc.lang.$SC;

  function SCRef(args) {
    this.__initializeWith__("Object");
    this._value = args[0] || $SC.Nil();
  }

  sc.lang.klass.define(SCRef, "Ref : AbstractFunction", function(spec, utils) {
    spec.valueOf = function() {
      return this._value.valueOf();
    };

    spec.value = function() {
      return this._value;
    };

    spec.value_ = function($value) {
      this._value = $value;
      return this;
    };

    // $new

    spec.set = function($thing) {
      $thing = utils.defaultValue$Nil($thing);
      this._value = $thing;
      return this;
    };

    spec.get = function() {
      return this._value;
    };

    spec.dereference = spec.value;

    spec.asRef = utils.nop;

    spec.valueArray = spec.value;

    spec.valueEnvir = spec.value;

    spec.valueArrayEnvir = spec.value;

    spec.next = spec.value;

    spec.asUGenInput = utils.nop;

    // TODO: implements printOn
    // TODO: implements storeOn

    spec.at = function($key) {
      return this._value.at($key);
    };

    spec.put = function($key, $val) {
      return this._value.put($key, $val);
    };

    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });

})(sc);

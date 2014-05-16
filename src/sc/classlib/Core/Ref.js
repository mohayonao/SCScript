SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var fn  = sc.lang.fn;

  sc.lang.klass.refine("Ref", function(spec, utils) {
    spec.valueOf = function() {
      return this._value.valueOf();
    };

    spec.value = function() {
      return this._value;
    };

    spec.value_ = fn(function($value) {
      this._value = $value;
      return this;
    }, "value");

    // $new

    spec.set = fn(function($thing) {
      this._value = $thing;
      return this;
    }, "thing");

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

});

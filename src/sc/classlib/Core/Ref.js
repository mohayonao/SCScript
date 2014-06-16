SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var fn = sc.lang.fn;

  sc.lang.klass.refine("Ref", function(spec, utils) {
    utils.setProperty(spec, "<>", "value");

    spec.$new = function($thing) {
      return this.__super__("new").value_($thing);
    };

    spec.valueOf = function() {
      return this._$value.valueOf();
    };

    // $new

    spec.set = fn(function($thing) {
      this._$value = $thing;
      return this;
    }, "thing");

    spec.get = function() {
      return this._$value;
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
      return this._$value.at($key);
    };

    spec.put = function($key, $val) {
      return this._$value.put($key, $val);
    };

    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });

});

SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  sc.lang.klass.refine("Ref", function(builder) {
    builder.addProperty("<>", "value");

    builder.addClassMethod("new", function($thing) {
      return this.__super__("new").value_($thing);
    });

    builder.addMethod("valueOf", function() {
      return this._$value.valueOf();
    });

    // $new

    builder.addMethod("set", {
      args: "thing"
    }, function($thing) {
      this._$value = $thing;
      return this;
    });

    builder.addMethod("get", function() {
      return this._$value;
    });

    builder.addMethod("dereference", function() {
      return this.value();
    });

    builder.addMethod("asRef");

    builder.addMethod("valueArray", function() {
      return this.value();
    });

    builder.addMethod("valueEnvir", function() {
      return this.value();
    });

    builder.addMethod("valueArrayEnvir", function() {
      return this.value();
    });

    builder.addMethod("next", function() {
      return this.value();
    });

    builder.addMethod("asUGenInput");

    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("at", function($key) {
      return this._$value.at($key);
    });

    builder.addMethod("put", function($key, $val) {
      return this._$value.put($key, $val);
    });
    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });
});

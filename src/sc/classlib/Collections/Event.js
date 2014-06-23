SCScript.install(function(sc) {
  "use strict";

  require("./Environment");

  var $ = sc.lang.$;
  var $nil = $.nil;
  var format = sc.libs.strlib.format;

  sc.lang.klass.refine("Event", function(builder) {
    // TODO: implements $default
    // TODO: implements $silent
    // TODO: implements $addEventType
    // TODO: implements next
    // TODO: implements delta
    // TODO: implements play
    // TODO: implements isRest
    // TODO: implements isPlaying_
    // TODO: implements isRunning_
    // TODO: implements playAndDelta
    // TODO: implements synchWithQuant
    // TODO: implements asControlInput
    // TODO: implements asUGenInput
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements $initClass
    // TODO: implements $makeDefaultSynthDef
    // TODO: implements $makeParentEvents
    builder.addMethod("__attr__", function(methodName, args) {
      var $value;

      if (methodName.charAt(methodName.length - 1) === "_") {
        // setter
        methodName = methodName.substr(0, methodName.length - 1);
        if (this[methodName]) {
          sc.lang.io.warn(format(
            "WARNING: '#{0}' exists a method name, so you can't use it as pseudo-method",
            methodName
          ));
        }
        $value = args[0] || /* istanbul ignore next */ $nil;
        this.put($.Symbol(methodName), $value);
        return $value;
      }

      // getter
      return this.at($.Symbol(methodName));
    });
  });
});

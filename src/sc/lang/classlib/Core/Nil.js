(function(sc) {
  "use strict";

  require("./Object");

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Nil", function(spec, utils) {
    var $nil = utils.$nil;

    spec.__num__ = function() {
      return 0;
    };

    spec.__bool__ = function() {
      return false;
    };

    spec.__sym__ = function() {
      return "nil";
    };

    spec.toString = function() {
      return "nil";
    };

    spec.$new = function() {
      throw new Error("Nil.new is illegal, should use literal.");
    };

    spec.isNil = utils.alwaysReturn$true;
    spec.notNil = utils.alwaysReturn$false;

    spec["?"] = function($obj) {
      return $obj;
    };

    spec["??"] = function($obj) {
      return $obj.value();
    };

    spec["!?"] = utils.nop;

    spec.asBoolean = utils.alwaysReturn$false;
    spec.booleanValue = utils.alwaysReturn$false;

    spec.push = function($function) {
      $function = utils.defaultValue$Nil($function);
      return $function.value();
    };

    spec.appendStream = function($stream) {
      $stream = utils.defaultValue$Nil($stream);
      return $stream;
    };

    spec.pop = utils.nop;
    spec.source = utils.nop;
    spec.source_ = utils.nop;

    spec.rate = utils.nop;
    spec.numChannels = utils.nop;
    spec.isPlaying = utils.alwaysReturn$false;

    spec.do = utils.nop;
    spec.reverseDo = utils.nop;
    spec.pairsDo = utils.nop;
    spec.collect = utils.nop;
    spec.select = utils.nop;
    spec.reject = utils.nop;
    spec.detect = utils.nop;
    spec.collectAs = utils.nop;
    spec.selectAs = utils.nop;
    spec.rejectAs = utils.nop;

    spec.dependants = function() {
      return $SC("IdentitySet").new();
    };

    spec.changed = utils.nop;
    spec.addDependant = utils.nop;
    spec.removeDependant = utils.nop;
    spec.release = utils.nop;
    spec.update = utils.nop;

    spec.transformEvent = function($event) {
      $event = utils.defaultValue$Nil($event);
      return $event;
    };

    spec.awake = utils.alwaysReturn$nil;

    spec.play = utils.nop;

    spec.nextTimeOnGrid = function($clock) {
      $clock = utils.defaultValue$Nil($clock);

      if ($clock === $nil) {
        return $clock;
      }

      return $SC.Function(function() {
        return $clock.nextTimeOnGrid();
      });
    };

    spec.asQuant = function() {
      return $SC("Quant").default();
    };

    spec.swapThisGroup = utils.nop;
    spec.performMsg = utils.nop;

    spec.printOn = function($stream) {
      $stream = utils.defaultValue$Nil($stream);
      $stream.putAll($SC.String("nil"));
      return this;
    };

    spec.storeOn = function($stream) {
      $stream = utils.defaultValue$Nil($stream);
      $stream.putAll($SC.String("nil"));
      return this;
    };

    spec.matchItem = utils.alwaysReturn$true;

    spec.add = function($value) {
      $value = utils.defaultValue$Nil($value);
      return $SC.Array([ $value ]);
    };

    spec.addAll = function($array) {
      $array = utils.defaultValue$Nil($array);
      return $array.asArray();
    };

    spec["++"] = function($array) {
      $array = utils.defaultValue$Nil($array);
      return $array.asArray();
    };

    spec.asCollection = function() {
      return $SC.Array();
    };

    spec.remove = utils.nop;

    spec.set = utils.nop;

    spec.get = function($prevVal) {
      $prevVal = utils.defaultValue$Nil($prevVal);
      return $prevVal;
    };

    spec.addFunc = function() {
      var functions = slice.call(arguments);
      if (functions.length <= 1) {
        return functions[0];
      }
      return $SC("FunctionList").new($SC.Array(functions));
    };

    spec.removeFunc = utils.nop;

    spec.replaceFunc = utils.nop;
    spec.seconds_ = utils.nop;
    spec.throw = utils.nop;

    // TODO: implements handleError

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    spec.asSpec = function() {
      return $SC("ControlSpec").new();
    };

    spec.superclassesDo = utils.nop;

    spec.shallowCopy = utils.nop;
  });

})(sc);

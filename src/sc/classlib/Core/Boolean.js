SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Boolean", function(spec, utils) {
    spec.__bool__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    };

    spec.xor = function($bool) {
      return $.Boolean(this === $bool).not();
    };

    // TODO: implements if
    // TODO: implements nop
    // TODO: implements &&
    // TODO: implements ||
    // TODO: implements and
    // TODO: implements or
    // TODO: implements nand
    // TODO: implements asInteger
    // TODO: implements binaryValue

    spec.asBoolean = utils.nop;
    spec.booleanValue = utils.nop;

    // TODO: implements keywordWarnings
    // TODO: implements trace
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    spec.while = function() {
      var msg = "While was called with a fixed (unchanging) Boolean as the condition. ";
      msg += "Please supply a Function instead.";
      throw new Error(msg);
    };

    spec.shallowCopy = utils.nop;
  });

  sc.lang.klass.refine("True", function(spec, utils) {
    spec.$new = function() {
      throw new Error("True.new is illegal, should use literal.");
    };

    spec.if = fn(function($trueFunc) {
      return $trueFunc.value();
    }, "trueFunc");

    spec.not = utils.alwaysReturn$false;

    spec["&&"] = function($that) {
      return $that.value();
    };

    spec["||"] = utils.nop;

    spec.and = fn(function($that) {
      return $that.value();
    }, "that");

    spec.or = spec["||"];

    spec.nand = fn(function($that) {
      return $that.value().$("not");
    }, "that");

    spec.asInteger = utils.alwaysReturn$int_1;
    spec.binaryValue = utils.alwaysReturn$int_1;
  });

  sc.lang.klass.refine("False", function(spec, utils) {
    spec.$new = function() {
      throw new Error("False.new is illegal, should use literal.");
    };

    spec.if = fn(function($trueFunc, $falseFunc) {
      return $falseFunc.value();
    }, "trueFunc; falseFunc");

    spec.not = utils.alwaysReturn$true;

    spec["&&"] = utils.nop;

    spec["||"] = function($that) {
      return $that.value();
    };

    spec.and = utils.nop;

    spec.or = fn(function($that) {
      return $that.value();
    }, "that");

    spec.nand = utils.alwaysReturn$true;
    spec.asInteger = utils.alwaysReturn$int_0;
    spec.binaryValue = utils.alwaysReturn$int_0;
  });
});

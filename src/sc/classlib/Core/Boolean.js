SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $ = sc.lang.$;
  var $int0 = $.int0;
  var $int1 = $.int1;

  sc.lang.klass.refine("Boolean", function(builder) {
    builder.addMethod("__bool__", function() {
      return this._;
    });

    builder.addMethod("toString", function() {
      return String(this._);
    });

    builder.shouldUseLiterals("new");

    builder.addMethod("xor", function($bool) {
      return $.Boolean(this === $bool).not();
    });

    // TODO: implements if
    // TODO: implements nop
    // TODO: implements &&
    // TODO: implements ||
    // TODO: implements and
    // TODO: implements or
    // TODO: implements nand
    // TODO: implements asInteger
    // TODO: implements binaryValue

    builder.addMethod("asBoolean");
    builder.addMethod("booleanValue");

    // TODO: implements keywordWarnings
    // TODO: implements trace
    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("archiveAsCompileString", sc.TRUE);

    builder.addMethod("while", function() {
      var msg = "While was called with a fixed (unchanging) Boolean as the condition. ";
      msg += "Please supply a Function instead.";
      throw new Error(msg);
    });

    builder.addMethod("shallowCopy");
  });

  sc.lang.klass.refine("True", function(builder) {
    builder.addMethod("if", {
      args: "trueFunc"
    }, function($trueFunc) {
      return $trueFunc.value();
    });

    builder.addMethod("not", sc.FALSE);

    builder.addMethod("&&", function($that) {
      return $that.value();
    });

    builder.addMethod("||");

    builder.addMethod("and", {
      args: "that"
    }, function($that) {
      return $that.value();
    });

    builder.addMethod("or");

    builder.addMethod("nand", {
      args: "that"
    }, function($that) {
      return $that.value().$("not");
    });

    builder.addMethod("asInteger", function() {
      return $int1;
    });

    builder.addMethod("binaryValue", function() {
      return $int1;
    });
  });

  sc.lang.klass.refine("False", function(builder) {
    builder.addMethod("if", {
      args: "trueFunc; falseFunc"
    }, function($trueFunc, $falseFunc) {
      return $falseFunc.value();
    });

    builder.addMethod("not", sc.TRUE);

    builder.addMethod("&&");

    builder.addMethod("||", function($that) {
      return $that.value();
    });

    builder.addMethod("and");

    builder.addMethod("or", {
      args: "that"
    }, function($that) {
      return $that.value();
    });

    builder.addMethod("nand", sc.TRUE);

    builder.addMethod("asInteger", function() {
      return $int0;
    });

    builder.addMethod("binaryValue", function() {
      return $int0;
    });
  });
});

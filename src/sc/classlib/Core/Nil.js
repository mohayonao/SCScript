SCScript.install(function(sc) {
  "use strict";

  require("./Object");

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Nil", function(builder, _) {
    builder.addMethod("__num__", function() {
      return 0;
    });

    builder.addMethod("__bool__", function() {
      return false;
    });

    builder.addMethod("__sym__", function() {
      return "nil";
    });

    builder.addMethod("toString", function() {
      return "nil";
    });

    builder.shouldUseLiterals("new");

    builder.addMethod("isNil", sc.TRUE);
    builder.addMethod("notNil", sc.FALSE);

    builder.addMethod("?", function($obj) {
      return $obj;
    });

    builder.addMethod("??", function($obj) {
      return $obj.value();
    });

    builder.addMethod("!?");

    builder.addMethod("asBoolean", sc.FALSE);
    builder.addMethod("booleanValue", sc.FALSE);

    builder.addMethod("push", {
      args: "function"
    }, function($function) {
      return $function.value();
    });

    builder.addMethod("appendStream", {
      args: "stream"
    }, function($stream) {
      return $stream;
    });

    builder.addMethod("pop");
    builder.addMethod("source");
    builder.addMethod("source_");

    builder.addMethod("rate");
    builder.addMethod("numChannels");
    builder.addMethod("isPlaying", sc.FALSE);

    builder.addMethod("do");
    builder.addMethod("reverseDo");
    builder.addMethod("pairsDo");
    builder.addMethod("collect");
    builder.addMethod("select");
    builder.addMethod("reject");
    builder.addMethod("detect");
    builder.addMethod("collectAs");
    builder.addMethod("selectAs");
    builder.addMethod("rejectAs");

    builder.addMethod("dependants", function() {
      return $("IdentitySet").new();
    });

    builder.addMethod("changed");
    builder.addMethod("addDependant");
    builder.addMethod("removeDependant");
    builder.addMethod("release");
    builder.addMethod("update");

    builder.addMethod("transformEvent", {
      args: "event"
    }, function($event) {
      return $event;
    });

    builder.addMethod("awake");

    builder.addMethod("play");

    builder.addMethod("nextTimeOnGrid", {
      args: "clock"
    }, function($clock) {
      if ($clock === $nil) {
        return $clock;
      }
      return $.Func(function() {
        return $clock.$("nextTimeOnGrid");
      });
    });

    builder.addMethod("asQuant", function() {
      return $("Quant").default();
    });

    builder.addMethod("swapThisGroup");
    builder.addMethod("performMsg");

    builder.addMethod("printOn", {
      args: "stream"
    }, function($stream) {
      $stream.putAll($.String("nil"));
      return this;
    });

    builder.addMethod("storeOn", {
      args: "stream"
    }, function($stream) {
      $stream.putAll($.String("nil"));
      return this;
    });

    builder.addMethod("matchItem", sc.TRUE);

    builder.addMethod("add", {
      args: "value"
    }, function($value) {
      return $.Array([ $value ]);
    });

    builder.addMethod("addAll", {
      args: "array"
    }, function($array) {
      return $array.asArray();
    });

    builder.addMethod("++", function($array) {
      return $array.asArray();
    });

    builder.addMethod("asCollection", function() {
      return $.Array();
    });

    builder.addMethod("remove");

    builder.addMethod("set");

    builder.addMethod("get", {
      args: "prevVal"
    }, function($prevVal) {
      return $prevVal;
    });

    builder.addMethod("addFunc", function() {
      var functions = _.toArray(arguments);
      if (functions.length <= 1) {
        return functions[0];
      }
      return $("FunctionList").new($.Array(functions));
    });

    builder.addMethod("removeFunc");

    builder.addMethod("replaceFunc");
    builder.addMethod("seconds_");
    builder.addMethod("throw");

    // TODO: implements handleError

    builder.addMethod("archiveAsCompileString", sc.TRUE);

    builder.addMethod("asSpec", function() {
      return $("ControlSpec").new();
    });

    builder.addMethod("superclassesDo");
    builder.addMethod("shallowCopy");
  });
});

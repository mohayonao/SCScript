SCScript.install(function(sc) {
  "use strict";

  require("./Patterns");

  var $ = sc.lang.$;

  sc.lang.klass.define("ListPattern : Pattern", function(builder) {
    builder.addProperty("<>", "list");
    builder.addProperty("<>", "repeats");

    builder.addClassMethod("new", {
      args: "list; repeats=1"
    }, function($list, $repeats) {
      if ($list.size().__int__() > 0) {
        return this.__super__("new").list_($list).repeats_($repeats);
      }
      throw new Error("ListPattern (" + this.__className + ") requires a non-empty collection.");
    });

    builder.addMethod("copy", function() {
      return this.__super__("copy").list_(this._$list.copy());
    });
    // TODO: implements storeArgs
  });

  sc.lang.klass.define("Pseq : ListPattern", function(builder) {
    builder.addProperty("<>", "offset");

    builder.addClassMethod("new", {
      args: "list; repeats=1; offset=0"
    }, function($list, $repeats, $offset) {
      return this.__super__("new", [ $list, $repeats ]).offset_($offset);
    });

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      var $list, $offset, $repeats;

      $list    = this._$list;
      $offset  = this._$offset;
      $repeats = this._$repeats;

      $repeats.value($inval).do($.Func(function() {
        var $offsetValue = $offset.value($inval);
        return $list.size().do($.Func(function($_, $i) { // TODO: reverseDo?
          var $item  = $list.wrapAt($i.$("+", [ $offsetValue ]));
          $inval = $item.embedInStream($inval);
          return $inval;
        }));
      }));

      return $inval;
    });
    // TODO: implements storeArgs
  });
});

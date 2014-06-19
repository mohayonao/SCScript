SCScript.install(function(sc) {
  "use strict";

  require("./Patterns");

  var $     = sc.lang.$;
  var fn    = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.define("ListPattern : Pattern", function(spec, utils) {
    spec.constructor = function SCListPattern() {
      this.__super__("Pattern");
    };
    utils.setProperty(spec, "<>", "list");
    utils.setProperty(spec, "<>", "repeats");

    spec.$new = fn(function($list, $repeats) {
      if ($list.size().__int__() > 0) {
        return this.__super__("new").list_($list).repeats_($repeats);
      }
      throw new Error("ListPattern (" + this._name + ") requires a non-empty collection.");
    }, "list; repeats=1");

    spec.copy = function() {
      return this.__super__("copy").list_(this._$list.copy());
    };
    // TODO: implements storeArgs
  });

  klass.define("Pseq : ListPattern", function(spec, utils) {
    spec.constructor = function SCPseq() {
      this.__super__("ListPattern");
    };
    utils.setProperty(spec, "<>", "offset");

    spec.$new = fn(function($list, $repeats, $offset) {
      return this.__super__("new", [ $list, $repeats ]).offset_($offset);
    }, "list; repeats=1; offset=0");

    spec.embedInStream = fn(function($inval) {
      var $list, $offset, $repeats;

      $list    = this._$list;
      $offset  = this._$offset;
      $repeats = this._$repeats;

      $repeats.value($inval).do($.Function(function() {
        var $offsetValue;
        return [ function() {
          $offsetValue = $offset.value($inval);
          return $list.size().do($.Function(function() { // TODO: reverseDo?
            var $item;
            return [ function($_, $i) {
              $item  = $list.wrapAt($i.$("+", [ $offsetValue ]));
              $inval = $item.embedInStream($inval);
            } ];
          }));
        } ];
      }));

      return $inval;
    }, "inval");
    // TODO: implements storeArgs
  });
});

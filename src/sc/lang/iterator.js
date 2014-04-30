(function(sc) {
  "use strict";

  require("./sc");
  require("./dollarSC");
  require("./klass");

  var iterator = {};
  var $SC = sc.lang.$SC;
  var utils = sc.lang.klass.utils;

  var bool = function(a) {
    return a.__bool__();
  };

  var __stop__ = function() {
    return null;
  };

  var nop_iter = {
    next: __stop__
  };

  var one_shot_iter = function(value) {
    var iter = {
      next: function() {
        iter.next = __stop__;
        return value;
      }
    };
    return iter;
  };

  // TODO: async function
  iterator.execute = function(iter, $function) {
    var $item, ret, i = 0;
    $function = utils.defaultValue$Nil($function);

    while (($item = iter.next()) !== null) {
      if (Array.isArray($item)) {
        ret = $function.value($item[0], $item[1]);
      } else {
        ret = $function.value($item, $SC.Integer(i++));
      }
      if (ret === sc.C.LOOP_BREAK) {
        break;
      }
    }
  };

  iterator.object$do = one_shot_iter;

  iterator.function$while = function($function) {
    var $nil = utils.nilInstance;
    var iter = {
      next: function() {
        if (bool($function.value())) {
          return [ $nil, $nil ];
        }
        iter.next = __stop__;
        return null;
      }
    };

    return iter;
  };

  var sc_incremental_iter = function($start, $end, $step) {
    var $i = $start, iter = {
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i > $end) {
          iter.next = __stop__;
        }
        return $ret;
      }
    };
    return iter;
  };

  var sc_decremental_iter = function($start, $end, $step) {
    var $i = $start, iter = {
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i < $end) {
          iter.next = __stop__;
        }
        return $ret;
      }
    };
    return iter;
  };

  var sc_numeric_iter = function($start, $end, $step) {
    if ($start.valueOf() === $end.valueOf()) {
      return one_shot_iter($start);
    } else if ($start < $end && $step > 0) {
      return sc_incremental_iter($start, $end, $step);
    } else if ($start > $end && $step < 0) {
      return sc_decremental_iter($start, $end, $step);
    }
    return nop_iter;
  };

  iterator.number$do = function($end) {
    var $start, $step;

    $start = utils.int0Instance;
    $end   = $end.__dec__();
    $step  = utils.int1Instance;

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = utils.int0Instance;
    $step  = $SC.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;
    $end = utils.defaultValue$Nil($end);

    $step = ($start <= $end) ? utils.int1Instance : $SC.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    $end  = utils.defaultValue$Nil($end);
    $step = utils.defaultValue$Nil($step);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $end, $step;

    $second = utils.defaultValue$Nil($second);
    $end    = utils.defaultValue$Nil($last);
    $step   = $second ["-"] ($start);

    return sc_numeric_iter($start, $end, $step);
  };

  var js_incremental_iter = function(start, end, step, type) {
    var i = start, iter = {
      next: function() {
        var ret = i;
        i += step;
        if (i > end) {
          iter.next = __stop__;
        }
        return type(ret);
      }
    };
    return iter;
  };

  var js_decremental_iter = function(start, end, step, type) {
    var i = start, iter = {
      next: function() {
        var ret = i;
        i += step;
        if (i < end) {
          iter.next = __stop__;
        }
        return type(ret);
      }
    };
    return iter;
  };

  var js_numeric_iter = function(start, end, step, type) {
    if (start === end) {
      return one_shot_iter(type(start));
    } else if (start < end && step > 0) {
      return js_incremental_iter(start, end, step, type);
    } else if (start > end && step < 0) {
      return js_decremental_iter(start, end, step, type);
    }
    return nop_iter;
  };

  var js_numeric_iter$do = function($endval, type) {
    var end = type($endval.__num__()).valueOf();
    return js_numeric_iter(0, end - 1, +1, type);
  };

  var js_numeric_iter$reverseDo = function($startval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = (start|0) - start;
    return js_numeric_iter(start - 1, end, -1, type);
  };

  var js_numeric_iter$for = function($startval, $endval, type) {
    $startval = utils.defaultValue$Nil($startval);
    $endval   = utils.defaultValue$Nil($endval);

    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forBy = function($startval, $endval, $stepval, type) {
    $endval  = utils.defaultValue$Nil($endval);
    $stepval = utils.defaultValue$Nil($stepval);

    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forSeries = function($startval, $second, $last, type) {
    $second = utils.defaultValue$Nil($second);
    $last   = utils.defaultValue$Nil($last);

    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return js_numeric_iter(start, end, step, type);
  };

  iterator.integer$do = function($endval) {
    return js_numeric_iter$do($endval, $SC.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $SC.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $SC.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $SC.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $SC.Integer);
  };

  iterator.float$do = function($endval) {
    return js_numeric_iter$do($endval, $SC.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $SC.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $SC.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $SC.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $SC.Float);
  };

  var list_iter = function(list) {
    var i = 0, iter = {
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          iter.next = __stop__;
        }
        return $ret;
      }
    };
    return iter;
  };

  var js_array_iter = function(list) {
    if (list.length) {
      return list_iter(list);
    }
    return nop_iter;
  };

  iterator.array$do = function($array) {
    return js_array_iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js_array_iter($array._.slice().reverse());
  };

  sc.lang.iterator = iterator;

})(sc);

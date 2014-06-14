(function(sc) {
  "use strict";

  require("./sc");
  require("./dollar");
  require("./klass/utils");

  var iterator = {};
  var $      = sc.lang.$;
  var utils  = sc.lang.klass.utils;
  var $nil   = utils.$nil;
  var $int_0 = utils.$int_0;
  var $int_1 = utils.$int_1;

  var __stop__ = function() {
    return null;
  };

  var nop_iter = function(iter) {
    iter.hasNext = false;
    iter.next    = __stop__;
    return iter;
  };
  nop_iter.clone = function() {
    return nop_iter;
  };
  nop_iter(nop_iter);

  var one_shot_iter = function(value) {
    var iter = {
      hasNext: true,
      next: function() {
        nop_iter(iter);
        return [ value, $int_0 ];
      },
      clone: function() {
        return one_shot_iter(value);
      }
    };
    return iter;
  };

  iterator.execute = function(iter, $function) {
    if (iter.hasNext) {
      $function._.setIterator(iter).resume();
    }
  };

  iterator.object$do = one_shot_iter;

  iterator.function$while = function($function) {
    var bytecode, iter;

    bytecode = $function._;

    iter = {
      hasNext: true,
      next: function() {
        if (!bytecode.reset().resume().__bool__()) {
          nop_iter(iter);
          return null;
        }
        if (bytecode.stopIter()) {
          nop_iter(iter);
        }
        return [ $nil, $nil ];
      },
      clone: function() {
        return iterator.function$while($function);
      }
    };

    return iter;
  };

  var sc_incremental_iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i > $end) {
          nop_iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc_incremental_iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc_decremental_iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i < $end) {
          nop_iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc_decremental_iter($start, $end, $step);
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

    $start = $int_0;
    $end   = $end.__dec__();
    $step  = $int_1;

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = $int_0;
    $step  = $.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;

    $step = ($start <= $end) ? $int_1 : $.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $step;

    $step   = $second ["-"] ($start);

    return sc_numeric_iter($start, $last, $step);
  };

  var js_incremental_iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i > end) {
          nop_iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js_incremental_iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js_decremental_iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i < end) {
          nop_iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js_decremental_iter(start, end, step, type);
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
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forBy = function($startval, $endval, $stepval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forSeries = function($startval, $second, $last, type) {
    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return js_numeric_iter(start, end, step, type);
  };

  iterator.integer$do = function($endval) {
    return js_numeric_iter$do($endval, $.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $.Integer);
  };

  iterator.float$do = function($endval) {
    return js_numeric_iter$do($endval, $.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $.Float);
  };

  var list_iter = function(list) {
    var i = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          nop_iter(iter);
        }
        return [ $ret, $.Integer(i - 1) ];
      },
      clone: function() {
        return list_iter(list);
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

  iterator.set$do = function($set) {
    return js_array_iter($set._$array._.filter(function($elem) {
      return $elem !== $nil;
    }));
  };

  sc.lang.iterator = iterator;

})(sc);

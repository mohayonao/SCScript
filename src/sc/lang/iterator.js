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

  iterator.object$do = function($obj) {
    var iter = {
      next: function() {
        iter.next = __stop__;
        return $obj;
      }
    };
    return iter;
  };

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

  var sc_numeric_iter = function($start, $end, $step) {
    var iter, $i = $start;

    if (bool($i ["=="] ($end))) {
      iter = {
        next: function() {
          iter.next = __stop__;
          return $start;
        }
      };
    } else if ($i < $end && $step > 0) {
      iter = {
        next: function() {
          var $ret = $i;
          $i = $i ["+"] ($step);
          if ($i > $end) {
            iter.next = __stop__;
          }
          return $ret;
        }
      };
    } else if ($i > $end && $step < 0) {
      iter = {
        next: function() {
          var $ret = $i;
          $i = $i ["+"] ($step);
          if ($i < $end) {
            iter.next = __stop__;
          }
          return $ret;
        }
      };
    } else {
      iter = {
        next: __stop__
      };
    }

    return iter;
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

  var js_numeric_iter = function(start, end, step, type) {
    var iter, i = start;

    if (i === end) {
      iter = {
        next: function() {
          iter.next = __stop__;
          return type(start);
        }
      };
    } else if (i < end && step > 0) {
      iter = {
        next: function() {
          var ret = i;
          i += step;
          if (i > end) {
            iter.next = __stop__;
          }
          return type(ret);
        }
      };
    } else if (i > end && step < 0) {
      iter = {
        next: function() {
          var ret = i;
          i += step;
          if (i < end) {
            iter.next = __stop__;
          }
          return type(ret);
        }
      };
    } else {
      iter = {
        next: __stop__
      };
    }

    return iter;
  };

  iterator.integer$do = function($endval) {
    var end = $endval.__int__();
    return js_numeric_iter(0, end - 1, +1, $SC.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    var start = $startval.__int__();
    return js_numeric_iter(start - 1, 0, -1, $SC.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    $endval = utils.defaultValue$Nil($endval);

    var start = $startval.__int__();
    var end   = $endval  .__int__();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, $SC.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    $endval  = utils.defaultValue$Nil($endval);
    $stepval = utils.defaultValue$Nil($stepval);

    var start = $startval.__int__();
    var end   = $endval  .__int__();
    var step  = $stepval .__int__();

    return js_numeric_iter(start, end, step, $SC.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    $second = utils.defaultValue$Nil($second);
    $last   = utils.defaultValue$Nil($last);

    var start  = $startval.__int__();
    var second = $second  .__int__();
    var end    = $last    .__int__();
    var step   = second - start;

    return js_numeric_iter(start, end, step, $SC.Integer);
  };

  iterator.float$do = function($endval) {
    var end = $endval.__num__();
    return js_numeric_iter(0, end - 1, +1, $SC.Float);
  };

  iterator.float$reverseDo = function($startval) {
    var start = $startval.__num__();
    var end   = (start|0) - start;
    return js_numeric_iter(start - 1, end, -1, $SC.Float);
  };

  iterator.float$for = function($startval, $endval) {
    $endval = utils.defaultValue$Nil($endval);

    var start = $startval.__num__();
    var end   = $endval  .__num__();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, $SC.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    $endval  = utils.defaultValue$Nil($endval);
    $stepval = utils.defaultValue$Nil($stepval);

    var start = $startval.__num__();
    var end   = $endval  .__num__();
    var step  = $stepval .__num__();

    return js_numeric_iter(start, end, step, $SC.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    $second = utils.defaultValue$Nil($second);
    $last   = utils.defaultValue$Nil($last);

    var start  = $startval.__num__();
    var second = $second  .__num__();
    var end    = $last    .__num__();
    var step = second - start;

    return js_numeric_iter(start, end, step, $SC.Float);
  };

  var js_array_iter = function(list) {
    var iter, index = 0;

    if (list.length) {
      iter = {
        next: function() {
          var $ret = list[index++];
          if (index >= list.length) {
            iter.next = __stop__;
          }
          return $ret;
        }
      };
    } else {
      iter = {
        next: __stop__
      };
    }

    return iter;
  };


  iterator.array$do = function($array) {
    return js_array_iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js_array_iter($array._.slice().reverse());
  };

  sc.lang.iterator = iterator;

})(sc);

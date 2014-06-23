(function(sc) {
  "use strict";

  require("./sc");
  require("./dollar");
  require("./klass/utils");

  var iterator = {};
  var $     = sc.lang.$;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var $int1 = $.int1;

  var __stop__ = function() {
    return null;
  };

  var nop$iter = function(iter) {
    iter.hasNext = false;
    iter.next    = __stop__;
    return iter;
  };
  nop$iter.clone = function() {
    return nop$iter;
  };
  nop$iter(nop$iter);

  var once$iter = function(value) {
    var iter = {
      hasNext: true,
      next: function() {
        nop$iter(iter);
        return [ value, $int0 ];
      },
      clone: function() {
        return once$iter(value);
      }
    };
    return iter;
  };

  iterator.execute = function(iter, $function) {
    $function._bytecode.setIterator(iter).run();
  };

  iterator.object$do = once$iter;

  iterator.function$while = function($function) {
    var bytecode, iter;

    bytecode = $function._bytecode;

    iter = {
      hasNext: true,
      next: function() {
        if (!bytecode.runAsFunction().__bool__()) {
          nop$iter(iter);
          return null;
        }
        return [ $nil, $nil ];
      },
      clone: function() {
        return iterator.function$while($function);
      }
    };

    return iter;
  };

  iterator.function$loop = function() {
    var iter = {
      hasNext: true,
      next: function() {
        return [ $nil, $nil ];
      },
      clone: function() {
        return iter;
      }
    };
    return iter;
  };

  var sc$incremental$iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i > $end) {
          nop$iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc$incremental$iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc$decremental$iter = function($start, $end, $step) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i < $end) {
          nop$iter(iter);
        }
        return [ $ret, $.Integer(j++) ];
      },
      clone: function() {
        return sc$decremental$iter($start, $end, $step);
      }
    };
    return iter;
  };

  var sc$numeric$iter = function($start, $end, $step) {
    if ($start.valueOf() === $end.valueOf()) {
      return once$iter($start);
    } else if ($start < $end && $step > 0) {
      return sc$incremental$iter($start, $end, $step);
    } else if ($start > $end && $step < 0) {
      return sc$decremental$iter($start, $end, $step);
    }
    return nop$iter;
  };

  iterator.number$do = function($end) {
    var $start, $step;

    $start = $int0;
    $end   = $end.__dec__();
    $step  = $int1;

    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = $int0;
    $step  = $.Integer(-1);

    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;

    $step = ($start <= $end) ? $int1 : $.Integer(-1);

    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    return sc$numeric$iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $step;

    $step   = $second ["-"] ($start);

    return sc$numeric$iter($start, $last, $step);
  };

  var js$incremental$iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i > end) {
          nop$iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js$incremental$iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js$decremental$iter = function(start, end, step, type) {
    var i = start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var ret = i;
        i += step;
        if (i < end) {
          nop$iter(iter);
        }
        return [ type(ret), $.Integer(j++) ];
      },
      clone: function() {
        return js$decremental$iter(start, end, step, type);
      }
    };
    return iter;
  };

  var js$numeric$iter = function(start, end, step, type) {
    if (start === end) {
      return once$iter(type(start));
    } else if (start < end && step > 0) {
      return js$incremental$iter(start, end, step, type);
    } else if (start > end && step < 0) {
      return js$decremental$iter(start, end, step, type);
    }
    return nop$iter;
  };

  var js$numeric$iter$do = function($endval, type) {
    var end = type($endval.__num__()).valueOf();
    return js$numeric$iter(0, end - 1, +1, type);
  };

  var js$numeric$iter$reverseDo = function($startval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = (start|0) - start;
    return js$numeric$iter(start - 1, end, -1, type);
  };

  var js$numeric$iter$for = function($startval, $endval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return js$numeric$iter(start, end, step, type);
  };

  var js$numeric$iter$forBy = function($startval, $endval, $stepval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return js$numeric$iter(start, end, step, type);
  };

  var js$numeric$iter$forSeries = function($startval, $second, $last, type) {
    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return js$numeric$iter(start, end, step, type);
  };

  iterator.integer$do = function($endval) {
    return js$numeric$iter$do($endval, $.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return js$numeric$iter$reverseDo($startval, $.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return js$numeric$iter$for($startval, $endval, $.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return js$numeric$iter$forBy($startval, $endval, $stepval, $.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return js$numeric$iter$forSeries($startval, $second, $last, $.Integer);
  };

  iterator.float$do = function($endval) {
    return js$numeric$iter$do($endval, $.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return js$numeric$iter$reverseDo($startval, $.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return js$numeric$iter$for($startval, $endval, $.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return js$numeric$iter$forBy($startval, $endval, $stepval, $.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return js$numeric$iter$forSeries($startval, $second, $last, $.Float);
  };

  var list$iter = function(list) {
    var i = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          nop$iter(iter);
        }
        return [ $ret, $.Integer(i - 1) ];
      },
      clone: function() {
        return list$iter(list);
      }
    };
    return iter;
  };

  var js$array$iter = function(list) {
    if (list.length) {
      return list$iter(list);
    }
    return nop$iter;
  };

  iterator.array$do = function($array) {
    return js$array$iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js$array$iter($array._.slice().reverse());
  };

  iterator.set$do = function($set) {
    return js$array$iter($set._$array._.filter(function($elem) {
      return $elem !== $nil;
    }));
  };

  sc.lang.iterator = iterator;
})(sc);

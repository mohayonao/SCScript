(function(sc) {
  "use strict";

  require("./lang");
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

  function toNOPIterator(iter) {
    iter.hasNext = false;
    iter.next    = __stop__;
    return iter;
  }
  toNOPIterator.clone = function() {
    return toNOPIterator;
  };
  toNOPIterator(toNOPIterator);

  function makeStepIterator($start, $end, $step, cond, stepper, type) {
    var $i = $start, j = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = $i;
        $i = stepper($i, $step);
        if (cond($i, $end)) {
          toNOPIterator(iter);
        }
        return [ type ? type($ret) : $ret, $.Integer(j++) ];
      },
      clone: function() {
        return makeStepIterator($start, $end, $step, cond, stepper, type);
      }
    };
    return iter;
  }

  function makeSCStepIterator($start, $end, $step, cond) {
    return makeStepIterator($start, $end, $step, cond, function($i, $step) {
      return $i ["+"] ($step);
    }, null);
  }

  function makeSCIncrmentalIterator($start, $end, $step) {
    return makeSCStepIterator($start, $end, $step, function($i, $end) {
      return $i > $end;
    });
  }

  function makeSCDecrementalIterator($start, $end, $step) {
    return makeSCStepIterator($start, $end, $step, function($i, $end) {
      return $i < $end;
    });
  }

  function makeSCNumericIterator($start, $end, $step) {
    if ($start.valueOf() === $end.valueOf()) {
      return once$iter($start);
    } else if ($start < $end && $step > 0) {
      return makeSCIncrmentalIterator($start, $end, $step);
    } else if ($start > $end && $step < 0) {
      return makeSCDecrementalIterator($start, $end, $step);
    }
    return toNOPIterator;
  }

  function makeJSNumericIterator$do($endval, type) {
    var end = type($endval.__num__()).valueOf();

    return makeJSNumericIterator(0, end - 1, +1, type);
  }

  function makeJSNumericIterator$reverseDo($startval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = (start|0) - start;

    return makeJSNumericIterator(start - 1, end, -1, type);
  }

  function makeJSNumericIterator$for($startval, $endval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return makeJSNumericIterator(start, end, step, type);
  }

  function makeJSNumericIterator$forBy($startval, $endval, $stepval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return makeJSNumericIterator(start, end, step, type);
  }

  function makeJSNumericIterator$forSeries($startval, $second, $last, type) {
    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return makeJSNumericIterator(start, end, step, type);
  }

  function makeListIterator(list) {
    var i = 0, iter = {
      hasNext: true,
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          toNOPIterator(iter);
        }
        return [ $ret, $.Integer(i - 1) ];
      },
      clone: function() {
        return makeListIterator(list);
      }
    };
    return iter;
  }

  function makeJSArrayIterator(list) {
    if (list.length) {
      return makeListIterator(list);
    }
    return toNOPIterator;
  }

  var once$iter = function(value) {
    var iter = {
      hasNext: true,
      next: function() {
        toNOPIterator(iter);
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
          toNOPIterator(iter);
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

  iterator.number$do = function($end) {
    var $start, $step;

    $start = $int0;
    $end   = $end.__dec__();
    $step  = $int1;

    return makeSCNumericIterator($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = $int0;
    $step  = $.Integer(-1);

    return makeSCNumericIterator($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;

    $step = ($start <= $end) ? $int1 : $.Integer(-1);

    return makeSCNumericIterator($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    return makeSCNumericIterator($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $step;

    $step   = $second ["-"] ($start);

    return makeSCNumericIterator($start, $last, $step);
  };

  function makeJSStepIterator(start, end, step, type, cond) {
    return makeStepIterator(start, end, step, cond, function(i, step) {
      return i + step;
    }, type);
  }

  function makeJSIncrementalIterator(start, end, step, type) {
    return makeJSStepIterator(start, end, step, type, function(i, end) {
      return i > end;
    });
  }

  function makeJSDecrementalIterator(start, end, step, type) {
    return makeJSStepIterator(start, end, step, type, function(i, end) {
      return i < end;
    });
  }

  function makeJSNumericIterator(start, end, step, type) {
    if (start === end) {
      return once$iter(type(start));
    } else if (start < end && step > 0) {
      return makeJSIncrementalIterator(start, end, step, type);
    } else if (start > end && step < 0) {
      return makeJSDecrementalIterator(start, end, step, type);
    }
    return toNOPIterator;
  }

  iterator.integer$do = function($endval) {
    return makeJSNumericIterator$do($endval, $.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return makeJSNumericIterator$reverseDo($startval, $.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return makeJSNumericIterator$for($startval, $endval, $.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return makeJSNumericIterator$forBy($startval, $endval, $stepval, $.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return makeJSNumericIterator$forSeries($startval, $second, $last, $.Integer);
  };

  iterator.float$do = function($endval) {
    return makeJSNumericIterator$do($endval, $.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return makeJSNumericIterator$reverseDo($startval, $.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return makeJSNumericIterator$for($startval, $endval, $.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return makeJSNumericIterator$forBy($startval, $endval, $stepval, $.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return makeJSNumericIterator$forSeries($startval, $second, $last, $.Float);
  };

  iterator.array$do = function($array) {
    return makeJSArrayIterator($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return makeJSArrayIterator($array._.slice().reverse());
  };

  iterator.set$do = function($set) {
    return makeJSArrayIterator($set._$array._.filter(function($elem) {
      return $elem !== $nil;
    }));
  };

  sc.lang.iterator = iterator;
})(sc);

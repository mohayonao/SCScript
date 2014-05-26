SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.define("Stream", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var SCArray = $("Array");

    spec.constructor = function SCStream() {
      this.__super__("AbstractFunction");
    };

    spec.parent = function() {
      return $nil;
    };

    spec.next = function() {
      return this._subclassResponsibility("next");
    };

    spec.iter = utils.nop;

    spec.value = fn(function($inval) {
      return this.next($inval);
    }, "inval");

    spec.valueArray = function() {
      return this.next();
    };

    spec.nextN = fn(function($n, $inval) {
      var $this = this;
      return SCArray.fill($n, $.Function(function() {
        return $this.next($inval);
      }));
    }, "n; inval");

    spec.all = fn(function($inval) {
      var $array;

      $array = $nil;
      this.do($.Function(function($item) {
        $array = $array.add($item);
      }), $inval);

      return $array;
    }, "inval");

    spec.put = function() {
      return this._subclassResponsibility("put");
    };

    spec.putN = fn(function($n, $item) {
      var $this = this;
      $n.do($.Function(function() {
        $this.put($item);
      }));
      return this;
    }, "n; item");

    spec.putAll = fn(function($aCollection) {
      var $this = this;
      $aCollection.do($.Function(function($item) {
        $this.put($item);
      }));
      return this;
    }, "aCollection");

    spec.do = fn(function($function, $inval) {
      var $this = this;
      var $item, $i;

      $i = $int_0;
      $.Function(function() {
        $item = $this.next($inval);
        return $item.notNil();
      }).while($.Function(function() { // TODO: use SegFunction
        $function.value($item, $i);
        $i = $i.__inc__();
        return $i;
      }));

      return this;
    }, "function; inval");

    spec.subSample = fn(function($offset, $skipSize) {
      var $this = this;
      var SCRoutine = $("Routine");

      return SCRoutine.new($.Function(function() {
        $offset.do($.Function(function() {
          $this.next();
        }));
        $.Function(function() {
          $this.next().yield();
          $skipSize.do($.Function(function() {
            $this.next();
          }));
        }).loop();
      }));
    }, "offset=0; skipSize=0");

    spec.generate = fn(function($function) {
      var $this = this;
      var $item, $i;

      $i = $int_0;
      $.Function(function() {
        $item = $this.next($item);
        return $item.notNil();
      }).while($.Function(function() { // TODO: use SegFunction
        $function.value($item, $i);
        $i = $i.__inc__();
        return $i;
      }));

      return this;
    }, "function");

    spec.collect = fn(function($argCollectFunc) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Function(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        if ($nextval !== $nil) {
          return $argCollectFunc.value($nextval, $inval);
        }
        return $nil;
      });
      $resetFunc = $.Function(function() {
        return $this.reset();
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "argCollectFunc");

    spec.reject = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Function(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        $.Function(function() {
          return $nextval.notNil().and($.Function(function() {
            return $function.value($nextval, $inval);
          }));
        }).while($.Function(function() { // TODO: use SegFunction
          $nextval = $this.next($inval);
          return $nextval;
        }));

        return $nextval;
      });
      $resetFunc = $.Function(function() {
        return $this.reset();
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.select = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Function(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        $.Function(function() {
          return $nextval.notNil().and($.Function(function() {
            return $function.value($nextval, $inval).not();
          }));
        }).while($.Function(function() { // TODO: use SegFunction
          $nextval = $this.next($inval);
          return $nextval;
        }));

        return $nextval;
      });
      $resetFunc = $.Function(function() {
        return $this.reset();
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.dot = fn(function($function, $stream) {
      var $this = this;

      return $("FuncStream").new($.Function(function($inval) {
        var $x, $y;

        $x = $this.next($inval);
        $y = $stream.next($inval);

        if ($x !== $nil && $y !== $nil) {
          return $function.value($x, $y, $inval);
        }

        return $nil;
      }), $.Function(function() {
        $this.reset();
        return $stream.reset();
      }));
    }, "function; stream");

    spec.interlace = fn(function($function, $stream) {
      var $this = this;
      var $nextx, $nexty;

      $nextx = this.next();
      $nexty = $stream.next();

      return $("FuncStream").new($.Function(function($inval) {
        var $val;

        if ($nextx === $nil) {
          if ($nextx === $nil) {
            return $nil;
          } else {
            $val = $nexty;
            $nexty = $stream.next($inval);
            return $val;
          }
        } else {
          if ($nexty === $nil ||
              $function.value($nextx, $nexty, $inval).__bool__()) {
            $val   = $nextx;
            $nextx = $this.next($inval);
            return $val;
          } else {
            $val   = $nexty;
            $nexty = $stream.next($inval);
            return $val;
          }
        }
      }), $.Function(function() {
        $this.reset();
        $stream.reset();
        $nextx = $this.next();
        $nexty = $stream.next();
        return $nexty;
      }));
    }, "function; stream");

    spec["++"] = function($stream) {
      return this.appendStream($stream);
    };

    spec.appendStream = fn(function($stream) {
      var $this = this;
      var $reset;

      $reset = $false;
      return $("Routine").new($.Function(function($inval) {
        if ($reset.__bool__()) {
          $this.reset();
          $stream.reset();
        }
        $reset = $true;
        $inval = $this.embedInStream($inval);
        return $stream.embedInStream($inval);
      }));
    }, "stream");

    spec.collate = fn(function($stream) {
      return this.interlace($.Function(function($x, $y) {
        return $x ["<"] ($y);
      }), $stream);
    }, "stream");

    spec["<>"] = function($obj) {
      return $("Pchain").new(this, $obj).asStream();
    };

    spec.composeUnaryOp = fn(function($argSelector) {
      return $("UnaryOpStream").new($argSelector, this);
    }, "argSelector");

    spec.composeBinaryOp = fn(function($argSelector, $argStream, $adverb) {
      if ($adverb === $nil) {
        return $("BinaryOpStream").new(
          $argSelector, this, $argStream.asStream()
        );
      }
      if ($adverb.__sym__() === "x") {
        return $("BinaryOpXStream").new(
          $argSelector, this, $argStream.asStream()
        );
      }

      return $nil;
    }, "argSelector; argStream; adverb");

    spec.reverseComposeBinaryOp = fn(function($argSelector, $argStream, $adverb) {
      if ($adverb === $nil) {
        return $("BinaryOpStream").new(
          $argSelector, $argStream.asStream(), this
        );
      }
      if ($adverb.__sym__() === "x") {
        return $("BinaryOpXStream").new(
          $argSelector, $argStream.asStream(), this
        );
      }

      return $nil;
    }, "argSelector; argStream; adverb");

    spec.composeNAryOp = fn(function($argSelector, $anArgList) {
      return $("NAryOpStream").new(
        $argSelector, this, $anArgList.collect($.Function(function($_) {
          return $_.asStream();
        }))
      );
    }, "argStream; anArgList");

    spec.embedInStream = fn(function($inval) {
      var $this = this;
      var $outval;

      $.Function(function() {
        $outval = $this.value($inval);
        return $outval.notNil();
      }).while($.Function(function() { // TODO: use SegFunction
        $inval = $outval.yield();
        return $inval;
      }));

      return $inval;
    }, "inval");

    spec.asEventStreamPlayer = fn(function($protoEvent) {
      return $("EventStreamPlayer").new(this, $protoEvent);
    }, "protoEvent");

    spec.play = fn(function($clock, $quant) {
      if ($clock === $nil) {
        $clock = $("TempoClock").default();
      }
      $clock.play(this, $quant.asQuant());
      return this;
    }, "clock; quant");

    // TODO: implements trace

    spec.repeat = fn(function($repeats) {
      var $this = this;

      return $.Function(function($inval) {
        return $repeats.value($inval).do($.Function(function() {
          $inval = $this.reset().embedInStream($inval);
          return $inval;
        }));
      }).r();
    }, "repeats=inf");

  });

  sc.lang.klass.define("PauseStream : Stream", function(spec) {
    spec.constructor = function SCPauseStream() {
      this.__super__("Stream");
    };

    // TODO: implements stream
    // TODO: implements originalStream
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements streamHasEnded
    // TODO: implements streamHasEnded_

    // TODO: implements isPlaying
    // TODO: implements play
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements prStop
    // TODO: implements removedFromScheduler
    // TODO: implements streamError
    // TODO: implements wasStopped
    // TODO: implements canPause
    // TODO: implements pause
    // TODO: implements resume
    // TODO: implements refresh
    // TODO: implements start
    // TODO: implements stream_
    // TODO: implements next
    // TODO: implements awake
    // TODO: implements threadPlayer
  });

  sc.lang.klass.define("Task : PauseStream", function(spec) {
    spec.constructor = function SCTask() {
      this.__super__("PauseStream");
    };

    // TODO: implements storeArgs
  });

});

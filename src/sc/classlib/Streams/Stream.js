SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;

  sc.lang.klass.define("Stream", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var SCArray = $SC("Array");

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
      return SCArray.fill($n, $SC.Function(function() {
        return $this.next($inval);
      }));
    }, "n; inval");

    spec.all = fn(function($inval) {
      var $array;

      $array = $nil;
      this.do($SC.Function(function($item) {
        $array = $array.add($item);
      }), $inval);

      return $array;
    }, "inval");

    spec.put = function() {
      return this._subclassResponsibility("put");
    };

    spec.putN = fn(function($n, $item) {
      var $this = this;
      $n.do($SC.Function(function() {
        $this.put($item);
      }));
      return this;
    }, "n; item");

    spec.putAll = fn(function($aCollection) {
      var $this = this;
      $aCollection.do($SC.Function(function($item) {
        $this.put($item);
      }));
      return this;
    }, "aCollection");

    spec.do = fn(function($function, $inval) {
      var $this = this;
      var $item, $i;

      $i = $int_0;
      $SC.Function(function() {
        $item = $this.next($inval);
        return $item.notNil();
      }).while($SC.Function(function() { // TODO: use SegFunction
        $function.value($item, $i);
        $i = $i.__inc__();
        return $i;
      }));

      return this;
    }, "function; inval");

    spec.subSample = fn(function($offset, $skipSize) {
      var $this = this;
      var SCRoutine = $SC("Routine");

      return SCRoutine.new($SC.Function(function() {
        $offset.do($SC.Function(function() {
          $this.next();
        }));
        $SC.Function(function() {
          $this.next().yield();
          $skipSize.do($SC.Function(function() {
            $this.next();
          }));
        }).loop();
      }));
    }, "offset=0; skipSize=0");

    spec.generate = fn(function($function) {
      var $this = this;
      var $item, $i;

      $i = $int_0;
      $SC.Function(function() {
        $item = $this.next($item);
        return $item.notNil();
      }).while($SC.Function(function() { // TODO: use SegFunction
        $function.value($item, $i);
        $i = $i.__inc__();
        return $i;
      }));

      return this;
    }, "function");

    spec.collect = fn(function($argCollectFunc) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $SC.Function(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        if ($nextval !== $nil) {
          return $argCollectFunc.value($nextval, $inval);
        }
        return $nil;
      });
      $resetFunc = $SC.Function(function() {
        return $this.reset();
      });

      return $SC("FuncStream").new($nextFunc, $resetFunc);
    }, "argCollectFunc");

    spec.reject = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $SC.Function(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        $SC.Function(function() {
          return $nextval.notNil().and($SC.Function(function() {
            return $function.value($nextval, $inval);
          }));
        }).while($SC.Function(function() { // TODO: use SegFunction
          $nextval = $this.next($inval);
          return $nextval;
        }));

        return $nextval;
      });
      $resetFunc = $SC.Function(function() {
        return $this.reset();
      });

      return $SC("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.select = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $SC.Function(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        $SC.Function(function() {
          return $nextval.notNil().and($SC.Function(function() {
            return $function.value($nextval, $inval).not();
          }));
        }).while($SC.Function(function() { // TODO: use SegFunction
          $nextval = $this.next($inval);
          return $nextval;
        }));

        return $nextval;
      });
      $resetFunc = $SC.Function(function() {
        return $this.reset();
      });

      return $SC("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.dot = fn(function($function, $stream) {
      var $this = this;

      return $SC("FuncStream").new($SC.Function(function($inval) {
        var $x, $y;

        $x = $this.next($inval);
        $y = $stream.next($inval);

        if ($x !== $nil && $y !== $nil) {
          return $function.value($x, $y, $inval);
        }

        return $nil;
      }), $SC.Function(function() {
        $this.reset();
        return $stream.reset();
      }));
    }, "function; stream");

    spec.interlace = fn(function($function, $stream) {
      var $this = this;
      var $nextx, $nexty;

      $nextx = this.next();
      $nexty = $stream.next();

      return $SC("FuncStream").new($SC.Function(function($inval) {
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
              BOOL($function.value($nextx, $nexty, $inval))) {
            $val   = $nextx;
            $nextx = $this.next($inval);
            return $val;
          } else {
            $val   = $nexty;
            $nexty = $stream.next($inval);
            return $val;
          }
        }
      }), $SC.Function(function() {
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
      return $SC("Routine").new($SC.Function(function($inval) {
        if (BOOL($reset)) {
          $this.reset();
          $stream.reset();
        }
        $reset = $true;
        $inval = $this.embedInStream($inval);
        return $stream.embedInStream($inval);
      }));
    }, "stream");

    spec.collate = fn(function($stream) {
      return this.interlace($SC.Function(function($x, $y) {
        return $x ["<"] ($y);
      }), $stream);
    }, "stream");

    spec["<>"] = function($obj) {
      return $SC("Pchain").new(this, $obj).asStream();
    };

    spec.composeUnaryOp = fn(function($argSelector) {
      return $SC("UnaryOpStream").new($argSelector, this);
    }, "argSelector");

    spec.composeBinaryOp = fn(function($argSelector, $argStream, $adverb) {
      if ($adverb === $nil) {
        return $SC("BinaryOpStream").new(
          $argSelector, this, $argStream.asStream()
        );
      }
      if ($adverb.__sym__() === "x") {
        return $SC("BinaryOpXStream").new(
          $argSelector, this, $argStream.asStream()
        );
      }

      return $nil;
    }, "argSelector; argStream; adverb");

    spec.reverseComposeBinaryOp = fn(function($argSelector, $argStream, $adverb) {
      if ($adverb === $nil) {
        return $SC("BinaryOpStream").new(
          $argSelector, $argStream.asStream(), this
        );
      }
      if ($adverb.__sym__() === "x") {
        return $SC("BinaryOpXStream").new(
          $argSelector, $argStream.asStream(), this
        );
      }

      return $nil;
    }, "argSelector; argStream; adverb");

    spec.composeNAryOp = fn(function($argSelector, $anArgList) {
      return $SC("NAryOpStream").new(
        $argSelector, this, $anArgList.collect($SC.Function(function($_) {
          return $_.asStream();
        }))
      );
    }, "argStream; anArgList");

    spec.embedInStream = fn(function($inval) {
      var $this = this;
      var $outval;

      $SC.Function(function() {
        $outval = $this.value($inval);
        return $outval.notNil();
      }).while($SC.Function(function() { // TODO: use SegFunction
        $inval = $outval.yield();
        return $inval;
      }));

      return $inval;
    }, "inval");

    spec.asEventStreamPlayer = fn(function($protoEvent) {
      return $SC("EventStreamPlayer").new(this, $protoEvent);
    }, "protoEvent");

    spec.play = fn(function($clock, $quant) {
      if ($clock === $nil) {
        $clock = $SC("TempoClock").default();
      }
      $clock.play(this, $quant.asQuant());
      return this;
    }, "clock; quant");

    // TODO: implements trace

    spec.repeat = fn(function($repeats) {
      var $this = this;

      return $SC.Function(function($inval) {
        return $repeats.value($inval).do($SC.Function(function() {
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

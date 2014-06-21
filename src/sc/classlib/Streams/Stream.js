SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var klass = sc.lang.klass;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  klass.refine("Stream", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int0  = utils.$int0;

    spec.parent = function() {
      return $nil;
    };

    spec.next = utils.subclassResponsibility("next");
    spec.iter = utils.nop;

    spec.value = fn(function($inval) {
      return this.next($inval);
    }, "inval");

    spec.valueArray = function() {
      return this.next();
    };

    spec.nextN = fn(function($n, $inval) {
      var $this = this;
      return SCArray.fill($n, $.Func(function() {
        return $this.next($inval);
      }));
    }, "n; inval");

    spec.all = fn(function($inval) {
      var $array;

      $array = $nil;
      this.do($.Func(function($item) {
        $array = $array.add($item);
        return $array;
      }), $inval);

      return $array;
    }, "inval");

    spec.put = utils.subclassResponsibility("put");

    spec.putN = fn(function($n, $item) {
      var $this = this;
      $n.do($.Func(function() {
        return $this.put($item);
      }));
      return this;
    }, "n; item");

    spec.putAll = fn(function($aCollection) {
      var $this = this;
      $aCollection.do($.Func(function($item) {
        return $this.put($item);
      }));
      return this;
    }, "aCollection");

    spec.do = fn(function($function, $inval) {
      var $this = this;
      var $item, $i;

      $i = $int0;
      $.Func(function() {
        $item = $this.next($inval);
        return $item.notNil();
      }).while($.Func(function() {
        $function.value($item, $i);
        $i = $i.__inc__();
        return $i;
      }));

      return this;
    }, "function; inval");

    spec.subSample = fn(function($offset, $skipSize) {
      var $this = this;
      return SCRoutine.new($.Func(function() {
        var offset, i;

        offset = $offset.__int__();
        for (i = 0; i < offset; ++i) {
          $this.next();
        }

        return $.Function(function() {
          return [
            function() {
              return $this.next().yield();
            },
            function() {
              var skipSize, i;

              skipSize = $skipSize.__int__();
              for (i = 0; i < skipSize; ++i) {
                $this.next();
              }
            },
            $.NOP
          ];
        }).loop();
      }));
    }, "offset=0; skipSize=0");

    spec.generate = fn(function($function) {
      var $this = this;
      var $item, $i;

      $i = $int0;
      $.Func(function() {
        $item = $this.next($item);
        return $item.notNil();
      }).while($.Func(function() {
        $function.value($item, $i);
        $i = $i.__inc__();
        return $i;
      }));

      return this;
    }, "function");

    spec.collect = fn(function($argCollectFunc) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Func(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        if ($nextval !== $nil) {
          return $argCollectFunc.value($nextval, $inval);
        }
        return $nil;
      });
      $resetFunc = $.Func(function() {
        return $this.reset();
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "argCollectFunc");

    spec.reject = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Func(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        $.Func(function() {
          return $nextval.notNil().and($.Func(function() {
            return $function.value($nextval, $inval);
          }));
        }).while($.Func(function() {
          $nextval = $this.next($inval);
          return $nextval;
        }));

        return $nextval;
      });
      $resetFunc = $.Func(function() {
        return $this.reset();
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.select = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Func(function($inval) {
        var $nextval;

        $nextval = $this.next($inval);
        $.Func(function() {
          return $nextval.notNil().and($.Func(function() {
            return $function.value($nextval, $inval).not();
          }));
        }).while($.Func(function() {
          $nextval = $this.next($inval);
          return $nextval;
        }));

        return $nextval;
      });
      $resetFunc = $.Func(function() {
        return $this.reset();
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.dot = fn(function($function, $stream) {
      var $this = this;

      return $("FuncStream").new($.Func(function($inval) {
        var $x, $y;

        $x = $this.next($inval);
        $y = $stream.next($inval);

        if ($x !== $nil && $y !== $nil) {
          return $function.value($x, $y, $inval);
        }

        return $nil;
      }), $.Func(function() {
        $this.reset();
        return $stream.reset();
      }));
    }, "function; stream");

    spec.interlace = fn(function($function, $stream) {
      var $this = this;
      var $nextx, $nexty;

      $nextx = this.next();
      $nexty = $stream.next();

      return $("FuncStream").new($.Func(function($inval) {
        var $val;

        if ($nextx === $nil) {
          if ($nexty === $nil) {
            return $nil;
          }
          $val = $nexty;
          $nexty = $stream.next($inval);
          return $val;
        }
        if ($nexty === $nil ||
          $function.value($nextx, $nexty, $inval).__bool__()) {
          $val   = $nextx;
          $nextx = $this.next($inval);
          return $val;
        }
        $val   = $nexty;
        $nexty = $stream.next($inval);
        return $val;
      }), $.Func(function() {
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
      return SCRoutine.new($.Function(function() {
        var $inval;
        return [
          function(_arg0) {
            $inval = _arg0;
            if ($reset.__bool__()) {
              $this.reset();
              $stream.reset();
            }
            $reset = $true;
            $inval = $this.embedInStream($inval);
            return $inval;
          },
          function() {
            return $stream.embedInStream($inval);
          },
          $.NOP
        ];
      }));
    }, "stream");

    spec.collate = fn(function($stream) {
      return this.interlace($.Func(function($x, $y) {
        return $x.$("<", [ $y ]);
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
        $argSelector, this, $anArgList.collect($.Func(function($_) {
          return $_.asStream();
        }))
      );
    }, "argStream; anArgList");

    spec.embedInStream = fn(function($inval) {
      var $this = this;
      var $outval;

      $.Func(function() {
        $outval = $this.value($inval);
        return $outval.notNil();
      }).while($.Func(function() {
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

      return $.Func(function($inval) {
        return $repeats.value($inval).do($.Func(function() {
          $inval = $this.reset().embedInStream($inval);
          return $inval;
        }));
      }).r();
    }, "repeats=inf");
  });

  klass.define("OneShotStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function() {
      this.__super__("Stream");
      this._once = true;
    };

    spec.$new = function($value) {
      return utils.newCopyArgs(this, {
        value: $value
      });
    };

    spec.next = function() {
      if (this._once) {
        this._once = false;
        return this._$value;
      }
      return $nil;
    };

    spec.reset = function() {
      this._once = true;
      return this;
    };
    // TODO: implements storeArgs
  });

  // EmbedOnce

  klass.define("FuncStream : Stream", function(spec, utils) {
    utils.setProperty(spec, "<>", "envir");

    spec.$new = function($nextFunc, $resetFunc) {
      return utils.newCopyArgs(this, {
        nextFunc: $nextFunc,
        resetFunc: $resetFunc,
        envir: sc.lang.main.$currentEnv
      });
    };

    spec.next = fn(function($inval) {
      var $this = this;
      return this._$envir.use($.Func(function() {
        return $this._$nextFunc.value($inval).processRest($inval);
      }));
    }, "inval");

    spec.reset = function() {
      var $this = this;
      return this._$envir.use($.Func(function() {
        return $this._$resetFunc.value();
      }));
    };
    // TODO: implements storeArgs
  });

  // StreamClutch
  // CleanupStream

  klass.define("PauseStream : Stream", function() {
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

  klass.define("Task : PauseStream", function() {
    // TODO: implements storeArgs
  });
});

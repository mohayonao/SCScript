SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int0  = $.int0;
  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  sc.lang.klass.refine("Stream", function(builder) {
    builder.addMethod("parent", function() {
      return $nil;
    });

    builder.subclassResponsibility("next");
    builder.addMethod("iter");

    builder.addMethod("value", {
      args: "inval"
    }, function($inval) {
      return this.next($inval);
    });

    builder.addMethod("valueArray", function() {
      return this.next();
    });

    builder.addMethod("nextN", {
      args: "n; inval"
    }, function($n, $inval) {
      var $this = this;
      return SCArray.fill($n, $.Func(function() {
        return $this.next($inval);
      }));
    });

    builder.addMethod("all", {
      args: "inval"
    }, function($inval) {
      var $array;

      $array = $nil;
      this.do($.Func(function($item) {
        $array = $array.add($item);
        return $array;
      }), $inval);

      return $array;
    });

    builder.subclassResponsibility("put");

    builder.addMethod("putN", {
      args: "n; item"
    }, function($n, $item) {
      var $this = this;
      $n.do($.Func(function() {
        return $this.put($item);
      }));
      return this;
    });

    builder.addMethod("putAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this;
      $aCollection.do($.Func(function($item) {
        return $this.put($item);
      }));
      return this;
    });

    builder.addMethod("do", {
      args: "function; inval"
    }, function($function, $inval) {
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
    });

    builder.addMethod("subSample", {
      args: "offset=0; skipSize=0"
    }, function($offset, $skipSize) {
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
            }
          ];
        }, null, 2, null).loop();
      }));
    });

    builder.addMethod("generate", {
      args: "function"
    }, function($function) {
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
    });

    builder.addMethod("collect", {
      args: "argCollectFunc"
    }, function($argCollectFunc) {
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
    });

    builder.addMethod("reject", {
      args: "function"
    }, function($function) {
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
    });

    builder.addMethod("select", {
      args: "function"
    }, function($function) {
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
    });

    builder.addMethod("dot", {
      args: "function; stream"
    }, function($function, $stream) {
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
    });

    builder.addMethod("interlace", {
      args:  "function; stream"
    }, function($function, $stream) {
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
    });

    builder.addMethod("++", function($stream) {
      return this.appendStream($stream);
    });

    builder.addMethod("appendStream", {
      args: "stream"
    }, function($stream) {
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
          }
        ];
      }, null, 2, null));
    });

    builder.addMethod("collate", {
      args: "stream"
    }, function($stream) {
      return this.interlace($.Func(function($x, $y) {
        return $x.$("<", [ $y ]);
      }), $stream);
    });

    builder.addMethod("<>", function($obj) {
      return $("Pchain").new(this, $obj).asStream();
    });

    builder.addMethod("composeUnaryOp", {
      args: "argSelector"
    }, function($argSelector) {
      return $("UnaryOpStream").new($argSelector, this);
    });

    builder.addMethod("composeBinaryOp", {
      args: "argSelector; argStream; adverb"
    }, function($argSelector, $argStream, $adverb) {
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
    });

    builder.addMethod("reverseComposeBinaryOp", {
      args: "argSelector; argStream; adverb"
    }, function($argSelector, $argStream, $adverb) {
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
    });

    builder.addMethod("composeNAryOp", {
      args: "argSelector; anArgList"
    }, function($argSelector, $anArgList) {
      return $("NAryOpStream").new(
        $argSelector, this, $anArgList.collect($.Func(function($_) {
          return $_.asStream();
        }))
      );
    });

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
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
    });

    builder.addMethod("asEventStreamPlayer", {
      args: "protoEvent"
    }, function($protoEvent) {
      return $("EventStreamPlayer").new(this, $protoEvent);
    });

    builder.addMethod("play", {
      args: "clock; quant"
    }, function($clock, $quant) {
      if ($clock === $nil) {
        $clock = $("TempoClock").default();
      }
      $clock.play(this, $quant.asQuant());
      return this;
    });

    // TODO: implements trace

    builder.addMethod("repeat", {
      args: "repeats=inf"
    }, function($repeats) {
      var $this = this;

      return $.Func(function($inval) {
        return $repeats.value($inval).do($.Func(function() {
          $inval = $this.reset().embedInStream($inval);
          return $inval;
        }));
      }).r();
    });
  });

  sc.lang.klass.define("OneShotStream : Stream", function(builder, _) {
    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._once = true;
    });

    builder.addClassMethod("new", function($value) {
      return _.newCopyArgs(this, {
        value: $value
      });
    });

    builder.addMethod("next", function() {
      if (this._once) {
        this._once = false;
        return this._$value;
      }
      return $nil;
    });

    builder.addMethod("reset", function() {
      this._once = true;
      return this;
    });
    // TODO: implements storeArgs
  });

  // EmbedOnce

  sc.lang.klass.define("FuncStream : Stream", function(builder, _) {
    builder.addProperty("<>", "envir");

    builder.addClassMethod("new", function($nextFunc, $resetFunc) {
      return _.newCopyArgs(this, {
        nextFunc: $nextFunc,
        resetFunc: $resetFunc,
        envir: sc.lang.main.getCurrentEnvir()
      });
    });

    builder.addMethod("next", {
      args: "inval"
    }, function($inval) {
      var $this = this;
      return this._$envir.use($.Func(function() {
        return $this._$nextFunc.value($inval).processRest($inval);
      }));
    });

    builder.addMethod("reset", function() {
      var $this = this;
      return this._$envir.use($.Func(function() {
        return $this._$resetFunc.value();
      }));
    });
    // TODO: implements storeArgs
  });

  // StreamClutch
  // CleanupStream

  sc.lang.klass.define("PauseStream : Stream", function() {
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

  sc.lang.klass.define("Task : PauseStream", function() {
    // TODO: implements storeArgs
  });
});

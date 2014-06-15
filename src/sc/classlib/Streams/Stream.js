SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.define("Stream : AbstractFunction", function(spec, utils) {
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
        return [ function() {
          return $this.next($inval);
        } ];
      }));
    }, "n; inval");

    spec.all = fn(function($inval) {
      var $array;

      $array = $nil;
      this.do($.Function(function() {
        return [ function($item) {
          $array = $array.add($item);
        } ];
      }), $inval);

      return $array;
    }, "inval");

    spec.put = function() {
      return this._subclassResponsibility("put");
    };

    spec.putN = fn(function($n, $item) {
      var $this = this;
      $n.do($.Function(function() {
        return [ function() {
          $this.put($item);
        } ];
      }));
      return this;
    }, "n; item");

    spec.putAll = fn(function($aCollection) {
      var $this = this;
      $aCollection.do($.Function(function() {
        return [ function($item) {
          $this.put($item);
        } ];
      }));
      return this;
    }, "aCollection");

    spec.do = fn(function($function, $inval) {
      var $this = this;
      var $item, $i;

      $i = $int_0;
      $.Function(function() {
        return [ function() {
          $item = $this.next($inval);
          return $item.notNil();
        } ];
      }).while($.Function(function() {
        return [ function() {
          $function.value($item, $i);
          $i = $i.__inc__();
          return $i;
        } ];
      }));

      return this;
    }, "function; inval");

    spec.subSample = fn(function($offset, $skipSize) {
      var $this = this;
      var SCRoutine = $("Routine");

      return SCRoutine.new($.Function(function() {
        return [ function() {
          $offset.do($.Function(function() {
            return [ function() {
              $this.next();
            } ];
          }));
          $.Function(function() {
            return [ function() {
              $this.next().yield();
              $skipSize.do($.Function(function() {
                return [ function() {
                  $this.next();
                } ];
              }));
            } ];
          }).loop();
        } ];
      }));
    }, "offset=0; skipSize=0");

    spec.generate = fn(function($function) {
      var $this = this;
      var $item, $i;

      $i = $int_0;
      $.Function(function() {
        return [ function() {
          $item = $this.next($item);
          return $item.notNil();
        } ];
      }).while($.Function(function() {
        return [ function() {
          $function.value($item, $i);
          $i = $i.__inc__();
          return $i;
        } ];
      }));

      return this;
    }, "function");

    spec.collect = fn(function($argCollectFunc) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Function(function() {
        return [ function($inval) {
          var $nextval;

          $nextval = $this.next($inval);
          if ($nextval !== $nil) {
            return $argCollectFunc.value($nextval, $inval);
          }
          return $nil;
        } ];
      });
      $resetFunc = $.Function(function() {
        return [ function() {
          return $this.reset();
        } ];
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "argCollectFunc");

    spec.reject = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Function(function() {
        return [ function($inval) {
          var $nextval;

          $nextval = $this.next($inval);
          $.Function(function() {
            return [ function() {
              return $nextval.notNil().and($.Function(function() {
                return [ function() {
                  return $function.value($nextval, $inval);
                } ];
              }));
            } ];
          }).while($.Function(function() {
            return [ function() {
              $nextval = $this.next($inval);
              return $nextval;
            } ];
          }));

          return $nextval;
        } ];
      });
      $resetFunc = $.Function(function() {
        return [ function() {
          return $this.reset();
        } ];
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.select = fn(function($function) {
      var $this = this;
      var $nextFunc, $resetFunc;

      $nextFunc = $.Function(function() {
        return [ function($inval) {
          var $nextval;

          $nextval = $this.next($inval);
          $.Function(function() {
            return [ function() {
              return $nextval.notNil().and($.Function(function() {
                return [ function() {
                  return $function.value($nextval, $inval).not();
                } ];
              }));
            } ];
          }).while($.Function(function() {
            return [ function() {
              $nextval = $this.next($inval);
              return $nextval;
            } ];
          }));

          return $nextval;
        } ];
      });
      $resetFunc = $.Function(function() {
        return [ function() {
          return $this.reset();
        } ];
      });

      return $("FuncStream").new($nextFunc, $resetFunc);
    }, "function");

    spec.dot = fn(function($function, $stream) {
      var $this = this;

      return $("FuncStream").new($.Function(function() {
        return [ function($inval) {
          var $x, $y;

          $x = $this.next($inval);
          $y = $stream.next($inval);

          if ($x !== $nil && $y !== $nil) {
            return $function.value($x, $y, $inval);
          }

          return $nil;
        } ];
      }), $.Function(function() {
        return [ function() {
          $this.reset();
          return $stream.reset();
        } ];
      }));
    }, "function; stream");

    spec.interlace = fn(function($function, $stream) {
      var $this = this;
      var $nextx, $nexty;

      $nextx = this.next();
      $nexty = $stream.next();

      return $("FuncStream").new($.Function(function() {
        return [ function($inval) {
          var $val;

          if ($nextx === $nil) {
            if ($nexty === $nil) {
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
        } ];
      }), $.Function(function() {
        return [ function() {
          $this.reset();
          $stream.reset();
          $nextx = $this.next();
          $nexty = $stream.next();
          return $nexty;
        } ];
      }));
    }, "function; stream");

    spec["++"] = function($stream) {
      return this.appendStream($stream);
    };

    spec.appendStream = fn(function($stream) {
      var $this = this;
      var $reset;

      $reset = $false;
      return $("Routine").new($.Function(function() {
        var $inval;
        return [ function(_arg0) {
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
        } ];
      }));
    }, "stream");

    spec.collate = fn(function($stream) {
      return this.interlace($.Function(function() {
        return [ function($x, $y) {
          return $x.$("<", [ $y ]);
        } ];
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
        $argSelector, this, $anArgList.collect($.Function(function() {
          return [ function($_) {
            return $_.asStream();
          } ];
        }))
      );
    }, "argStream; anArgList");

    spec.embedInStream = fn(function($inval) {
      var $this = this;
      var $outval;

      $.Function(function() {
        return [ function() {
          $outval = $this.value($inval);
          return $outval.notNil();
        } ];
      }).while($.Function(function() {
        return [ function() {
          $inval = $outval.yield();
          return $inval;
        } ];
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

      return $.Function(function() {
        return [ function($inval) {
          return $repeats.value($inval).do($.Function(function() {
            return [ function() {
              $inval = $this.reset().embedInStream($inval);
              return $inval;
            } ];
          }));
        } ];
      }).r();
    }, "repeats=inf");

  });

  klass.define("OneShotStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function OneShotStream() {
      this.__super__("Stream");
      this._once = true;
    };

    spec.$new = function($value) {
      return this._newCopyArgs({
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
    var $nil = utils.$nil;

    spec.constructor = function SCFuncStream() {
      this.__super__("Stream");
    };

    spec.envir = function() {
      return this._$envir;
    };

    spec.envir_ = function($value) {
      this._$envir = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.$new = function($nextFunc, $resetFunc) {
      return this._newCopyArgs({
        nextFunc : $nextFunc,
        resetFunc: $resetFunc,
        envir    : sc.lang.main.$currentEnv
      });
    };

    spec.next = fn(function($inval) {
      var $this = this;
      return this._$envir.use($.Function(function() {
        return [ function() {
          return $this._$nextFunc.value($inval).processRest($inval);
        } ];
      }));
    }, "inval");

    spec.reset = function() {
      var $this = this;
      return this._$envir.use($.Function(function() {
        return [ function() {
          return $this._$resetFunc.value();
        } ];
      }));
    };

    // TODO: implements storeArgs

  });

  // StreamClutch
  // CleanupStream

  klass.define("PauseStream : Stream", function(spec) {
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

  klass.define("Task : PauseStream", function(spec) {
    spec.constructor = function SCTask() {
      this.__super__("PauseStream");
    };

    // TODO: implements storeArgs
  });

});

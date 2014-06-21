SCScript.install(function(sc) {
  "use strict";

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var q  = sc.libs.strlib.quote;
  var bytecode = sc.lang.bytecode;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");
  var SCAssociation = $("Association");

  sc.lang.klass.refine("Object", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int1  = utils.$int1;

    spec.__num__ = function() {
      throw new Error(this.__className + " cannot be converted to a Number.");
    };

    spec.__int__ = function() {
      return this.__num__()|0;
    };

    spec.__bool__ = function() {
      throw new Error(this.__className + " cannot be converted to a Boolean.");
    };

    spec.__sym__ = function() {
      throw new Error(this.__className + " cannot be converted to a Symbol.");
    };

    spec.__str__ = function() {
      return String(this);
    };

    // TODO: implements $new
    // TODO: implements $newCopyArgs

    spec.$newFrom = utils.doesNotUnderstand("newFrom");

    // TODO: implements dump

    spec.post = function() {
      this.asString().post();
      return this;
    };

    spec.postln = function() {
      this.asString().postln();
      return this;
    };

    spec.postc = function() {
      this.asString().postc();
      return this;
    };

    spec.postcln = function() {
      this.asString().postcln();
      return this;
    };

    // TODO: implements postcs
    // TODO: implements totalFree
    // TODO: implements largestFreeBlock
    // TODO: implements gcDumpGrey
    // TODO: implements gcDumpSet
    // TODO: implements gcInfo
    // TODO: implements gcSanity
    // TODO: implements canCallOS

    spec.size = utils.alwaysReturn$int0;
    spec.indexedSize = utils.alwaysReturn$int0;
    spec.flatSize = utils.alwaysReturn$int1;

    spec.do = function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.object$do(this),
        $function
      );

      return this;
    };

    spec.generate = fn(function($function, $state) {
      this.do($function);

      return $state;
    }, "function; state");

    spec.class = function() {
      return this.__class;
    };

    spec.isKindOf = function($aClass) {
      return $.Boolean(this instanceof $aClass.__Spec);
    };

    spec.isMemberOf = function($aClass) {
      return $.Boolean(this.__class === $aClass);
    };

    var respondsTo = function($this, $aSymbol) {
      return typeof $this[
        $aSymbol ? $aSymbol.__sym__() : /* istanbul ignore next */ ""
      ] === "function";
    };

    spec.respondsTo = function($aSymbol) {
      var $this = this;
      if ($aSymbol && $aSymbol.isSequenceableCollection().__bool__()) {
        return $.Boolean($aSymbol.asArray()._.every(function($aSymbol) {
          return $.Boolean(respondsTo($this, $aSymbol)).__bool__();
        }));
      }
      return $.Boolean(respondsTo(this, $aSymbol));
    };

    var performMsg = function($this, msg) {
      var selector, method;

      selector = msg[0] ? msg[0].__sym__() : /* istanbul ignore next */ "";
      method = $this[selector];

      if (method) {
        return method.apply($this, msg.slice(1));
      }

      throw new Error("Message " + q(selector) + " not understood.");
    };

    spec.performMsg = function($msg) {
      return performMsg(this, $msg ? $msg.asArray()._ : /* istanbul ignore next */ []);
    };

    spec.perform = function() {
      return performMsg(this, slice.call(arguments));
    };

    spec.performList = function($selector, $arglist) {
      return performMsg(this, [ $selector ].concat(
        $arglist ? $arglist.asArray()._ : /* istanbul ignore next */ []
      ));
    };

    spec.functionPerformList = utils.nop;

    // TODO: implements superPerform
    // TODO: implements superPerformList

    spec.tryPerform = function($selector) {
      if (respondsTo(this, $selector)) {
        return performMsg(this, slice.call(arguments));
      }
      return $nil;
    };

    spec.multiChannelPerform = function($selector) {
      var list, items, length, i, args, $obj, iter;
      items = [ this ].concat(slice.call(arguments, 1));
      length = Math.max.apply(null, items.map(function($_) {
        return $_.size().__int__();
      }));
      iter = function($_) {
        return $_.wrapAt ? $_.wrapAt($.Integer(i)) : $_;
      };
      list = new Array(length);
      for (i = 0; i < length; ++i) {
        args = items.map(iter);
        $obj = args[0];
        args[0] = $selector;
        list[i] = performMsg($obj, args);
      }
      return $.Array(list);
    };

    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs

    var copy = function(obj) {
      var copied = obj;

      if (Array.isArray(obj)) {
        copied = obj.slice();
      } else if (obj && obj.constructor === Object) {
        copied = {};
        Object.keys(obj).forEach(function(key) {
          copied[key] = obj[key];
        });
      }

      return copied;
    };

    spec.copy = function() {
      return this.shallowCopy();
    };

    // TODO: implements contentsCopy

    spec.shallowCopy = function() {
      var a = new this.__Spec([]);

      Object.keys(this).forEach(function(key) {
        a[key] = copy(this[key]);
      }, this);

      if (this._ === this) {
        a._ = a;
      }

      return a;
    };

    // TODO: implements copyImmutable
    // TODO: implements deepCopy

    spec.dup = fn(function($n) {
      var $this = this;
      var array, i, n;

      if ($n.isSequenceableCollection().__bool__()) {
        return SCArray.fillND($n, $.Function(function() {
          return [ function() {
            return $this.copy();
          } ];
        }));
      }

      n = $n.__int__();
      array = new Array(n);
      for (i = 0; i < n; ++i) {
        array[i] = this.copy();
      }

      return $.Array(array);
    }, "n=2");

    spec["!"] = function($n) {
      return this.dup($n);
    };

    spec.poll = function() {
      return this.value();
    };

    spec.value = utils.nop;
    spec.valueArray = utils.nop;
    spec.valueEnvir = utils.nop;
    spec.valueArrayEnvir = utils.nop;

    spec["=="] = function($obj) {
      return this ["==="] ($obj);
    };

    spec["!="] = function($obj) {
      return (this ["=="] ($obj)).not();
    };

    spec["==="] = function($obj) {
      return $.Boolean(this === $obj);
    };

    spec["!=="] = function($obj) {
      return $.Boolean(this !== $obj);
    };

    spec.equals = fn(function($that, $properties) {
      var $this = this;
      if (this === $that) {
        return $true;
      }
      if (this.respondsTo($properties).__bool__() && $that.respondsTo($properties).__bool__()) {
        return $.Boolean($properties.asArray()._.every(function($_) {
          return performMsg($this, [ $_ ]) ["=="] (performMsg($that, [ $_ ])).__bool__();
        }));
      }
      return this ["=="] ($that);
    }, "that; properties");

    // TODO: implements compareObject
    // TODO: implements instVarHash

    spec.basicHash = function() {
      return $.Integer(this.__hash);
    };

    spec.hash = function() {
      return $.Integer(this.__hash);
    };

    spec.identityHash = function() {
      return $.Integer(this.__hash);
    };

    spec["->"] = function($obj) {
      return SCAssociation.new(this, $obj);
    };

    spec.next = utils.nop;
    spec.reset = utils.nop;

    spec.first = fn(function($inval) {
      this.reset();
      return this.next($inval);
    }, "inval");

    spec.iter = function() {
      return $("OneShotStream").new(this);
    };

    spec.stop = utils.nop;
    spec.free = utils.nop;
    spec.clear = utils.nop;
    spec.removedFromScheduler = utils.nop;
    spec.isPlaying = utils.alwaysReturn$false;

    spec.embedInStream = function() {
      return this.yield();
    };

    spec.cyc = fn(function($n) {
      var $this = this;
      return SCRoutine.new($.Function(function() {
        var $inval;
        return [
          function(_arg0) {
            $inval = _arg0;
            return $n.do($.Function(function() {
              return [
                function() {
                  $inval = $this.embedInStream($inval);
                  return $inval;
                },
                function() {
                  return $this.reset();
                },
                $.NOP
              ];
            }));
          },
          function() {
            $inval = null;
          }
        ];
      }));
    }, "n=inf");

    spec.fin = fn(function($n) {
      var $this = this;
      return SCRoutine.new($.Function(function() {
        var $inval;
        return [
          function(_arg0) {
            var $item;
            $inval = _arg0;
            return $n.do($.Function(function() {
              return [
                function() {
                  $item = $this.next($inval);
                  return $item;
                },
                function() {
                  if ($item === $nil) {
                    $nil.alwaysYield();
                  }
                  return $nil;
                },
                function() {
                  $inval = $item.yield();
                  return $inval;
                },
                $.NOP
              ];
            }));
          },
          function() {
            $inval = null;
          }
        ];
      }));
    }, "n=1");

    spec.repeat = fn(function($repeats) {
      return $("Pn").new(this, $repeats).asStream();
    }, "repeats=inf");

    spec.loop = function() {
      return this.repeat($.Float(Infinity));
    };

    spec.asStream = utils.nop;

    spec.streamArg = fn(function($embed) {
      var $this = this;
      if ($embed === $true) {
        return SCRoutine.new($.Function(function() {
          var $inval;
          return [
            function(_arg) {
              $inval = _arg;
              return $this.embedInStream($inval);
            },
            function() {
              $inval = null;
            }
          ];
        }));
      } else {
        return SCRoutine.new($.Function(function() {
          return [ function() {
            return $.Function(function() {
              return [ function() {
                return $this.yield();
              } ];
            }).loop();
          } ];
        }));
      }
    }, "embed=false");

    spec.eventAt = utils.alwaysReturn$nil;

    spec.composeEvents = fn(function($event) {
      return $event.copy();
    }, "event");

    spec.finishEvent = utils.nop;
    spec.atLimit = utils.alwaysReturn$false;
    spec.isRest = utils.alwaysReturn$false;
    spec.threadPlayer = utils.nop;
    spec.threadPlayer_ = utils.nop;
    spec["?"] = utils.nop;
    spec["??"] = utils.nop;

    spec["!?"] = function($obj) {
      return $obj.value(this);
    };

    spec.isNil = utils.alwaysReturn$false;
    spec.notNil = utils.alwaysReturn$true;
    spec.isNumber = utils.alwaysReturn$false;
    spec.isInteger = utils.alwaysReturn$false;
    spec.isFloat = utils.alwaysReturn$false;
    spec.isSequenceableCollection = utils.alwaysReturn$false;
    spec.isCollection = utils.alwaysReturn$false;
    spec.isArray = utils.alwaysReturn$false;
    spec.isString = utils.alwaysReturn$false;
    spec.containsSeqColl = utils.alwaysReturn$false;
    spec.isValidUGenInput = utils.alwaysReturn$false;
    spec.isException = utils.alwaysReturn$false;
    spec.isFunction = utils.alwaysReturn$false;

    spec.matchItem = fn(function($item) {
      return this ["==="] ($item);
    }, "item");

    spec.trueAt = utils.alwaysReturn$false;

    spec.falseAt = fn(function($key) {
      return this.trueAt($key).not();
    }, "key");

    // TODO: implements pointsTo
    // TODO: implements mutable
    // TODO: implements frozen
    // TODO: implements halt
    // TODO: implements primitiveFailed
    // TODO: implements reportError
    // TODO: implements subclassResponsibility
    // TODO: implements doesNotUnderstand
    // TODO: implements shouldNotImplement
    // TODO: implements outOfContextReturn
    // TODO: implements immutableError
    // TODO: implements deprecated
    // TODO: implements mustBeBoolean
    // TODO: implements notYetImplemented
    // TODO: implements dumpBackTrace
    // TODO: implements getBackTrace
    // TODO: implements throw

    spec.species = function() {
      return this.class();
    };

    spec.asCollection = function() {
      return $.Array([ this ]);
    };

    spec.asSymbol = function() {
      return this.asString().asSymbol();
    };

    spec.asString = function() {
      return $.String(String(this));
    };

    // TODO: implements asCompileString
    // TODO: implements cs
    // TODO: implements printClassNameOn
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeParamsOn
    // TODO: implements simplifyStoreArgs
    // TODO: implements storeArgs
    // TODO: implements storeModifiersOn

    spec.as = fn(function($aSimilarClass) {
      return $aSimilarClass.newFrom(this);
    }, "aSimilarClass");

    spec.dereference = utils.nop;

    spec.reference = function() {
      return $.Ref(this);
    };

    spec.asRef = function() {
      return $.Ref(this);
    };

    spec.asArray = function() {
      return this.asCollection().asArray();
    };

    spec.asSequenceableCollection = function() {
      return this.asArray();
    };

    spec.rank = utils.alwaysReturn$int0;

    spec.deepCollect = fn(function($depth, $function, $index, $rank) {
      return $function.value(this, $index, $rank);
    }, "depth; function; index; rank");

    spec.deepDo = fn(function($depth, $function, $index, $rank) {
      $function.value(this, $index, $rank);
      return this;
    }, "depth; function; index; rank");

    spec.slice = utils.nop;
    spec.shape = utils.alwaysReturn$nil;
    spec.unbubble = utils.nop;

    spec.bubble = fn(function($depth, $levels) {
      var levels, a;

      levels = $levels.__int__();
      if (levels <= 1) {
        a = [ this ];
      } else {
        a = [
          this.bubble($depth, $.Integer(levels - 1))
        ];
      }

      return $.Array(a);
    }, "depth; levels");

    spec.obtain = fn(function($index, $default) {
      if ($index.__num__() === 0) {
        return this;
      } else {
        return $default;
      }
    }, "index; defaults");

    spec.instill = fn(function($index, $item, $default) {
      if ($index.__num__() === 0) {
        return $item;
      } else {
        return this.asArray().instill($index, $item, $default);
      }
    }, "index; item; default");

    spec.addFunc = fn(function($$functions) {
      return $("FunctionList").new(this ["++"] ($$functions));
    }, "*functions");

    spec.removeFunc = function($function) {
      if (this === $function) {
        return $nil;
      }
      return this;
    };

    spec.replaceFunc = fn(function($find, $replace) {
      if (this === $find) {
        return $replace;
      }
      return this;
    }, "find; replace");

    // TODO: implements addFuncTo
    // TODO: implements removeFuncFrom

    spec.while = fn(function($body) {
      var $this = this;

      $.Function(function() {
        return [ function() {
          return $this.value();
        } ];
      }).while($.Function(function() {
        return [ function() {
          return $body.value();
        } ];
      }));

      return this;
    }, "body");

    spec.switch = function() {
      var args, i, imax;

      args = slice.call(arguments);
      for (i = 0, imax = args.length >> 1; i < imax; i++) {
        if (this ["=="] (args[i * 2]).__bool__()) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    };

    spec.yield = function() {
      bytecode.yield(this.value());
      return $nil;
    };

    spec.alwaysYield = function() {
      bytecode.alwaysYield(this.value());
      return $nil;
    };

    spec.yieldAndReset = function($reset) {
      if (!$reset || $reset === $true) {
        bytecode.yieldAndReset(this.value());
      } else {
        bytecode.yield(this.value());
      }
      return $nil;
    };

    // TODO: implements idle
    // TODO: implements $initClass
    // TODO: implements dependants
    // TODO: implements changed
    // TODO: implements addDependant
    // TODO: implements removeDependant
    // TODO: implements release
    // TODO: implements releaseDependants
    // TODO: implements update
    // TODO: implements addUniqueMethod
    // TODO: implements removeUniqueMethods
    // TODO: implements removeUniqueMethod
    // TODO: implements inspect
    // TODO: implements inspectorClass
    // TODO: implements inspector
    // TODO: implements crash
    // TODO: implements stackDepth
    // TODO: implements dumpStack
    // TODO: implements dumpDetailedBackTrace
    // TODO: implements freeze

    spec["&"] = function($that) {
      return this.$("bitAnd", [ $that ]);
    };

    spec["|"] = function($that) {
      return this.$("bitOr", [ $that ]);
    };

    spec["%"] = function($that) {
      return this.$("mod", [ $that ]);
    };

    spec["**"] = function($that) {
      return this.$("pow", [ $that ]);
    };

    spec["<<"] = function($that) {
      return this.$("leftShift", [ $that ]);
    };

    spec[">>"] = function($that) {
      return this.$("rightShift", [ $that ]);
    };

    spec["+>>"] = function($that) {
      return this.$("unsignedRightShift" , [ $that ]);
    };

    spec["<!"] = function($that) {
      return this.$("firstArg", [ $that ]);
    };

    spec.asInt = function() {
      return this.asInteger();
    };

    spec.blend = fn(function($that, $blendFrac) {
      return this.$("+", [ $blendFrac.$("*", [ $that.$("-", [ this ]) ]) ]);
    }, "that; blendFrac=0.5");

    spec.blendAt = fn(function($index, $method) {
      var $iMin;

      $iMin = $index.$("roundUp", [ $int1 ]).asInteger().__dec__();
      return this.perform($method, $iMin).blend(
        this.perform($method, $iMin.__inc__()),
        $index.$("absdif", [ $iMin ])
      );
    }, "index; method=\\clipAt");

    spec.blendPut = fn(function($index, $val, $method) {
      var $iMin, $ratio;

      $iMin = $index.$("floor").asInteger();
      $ratio = $index.$("absdif", [ $iMin ]);
      this.perform($method, $iMin, $val.$("*", [ $int1 ["-"] ($ratio) ]));
      this.perform($method, $iMin.__inc__(), $val.$("*", [ $ratio ]));

      return this;
    }, "index; val; method=\\wrapPut");

    spec.fuzzyEqual = fn(function($that, $precision) {
      return $.Float(0.0).max(
        $.Float(1.0) ["-"] (
          this.$("-", [ $that ]).$("abs").$("/", [ $precision ])
        )
      );
    }, "that; precision=1.0");

    spec.isUGen = utils.alwaysReturn$false;
    spec.numChannels = utils.alwaysReturn$int1;

    spec.pair = fn(function($that) {
      return $.Array([ this, $that ]);
    }, "that");

    spec.pairs = fn(function($that) {
      var $list;

      $list = $.Array();
      this.asArray().do($.Function(function() {
        return [ function($a) {
          $that.asArray().do($.Function(function() {
            return [ function($b) {
              $list = $list.add($a.asArray() ["++"] ($b));
            } ];
          }));
        } ];
      }));

      return $list;
    }, "that");

    spec.awake = fn(function($beats) {
      return this.next($beats);
    }, "beats");

    spec.beats_ = utils.nop;
    spec.clock_ = utils.nop;

    spec.performBinaryOpOnSomething = function($aSelector) {
      var aSelector;

      aSelector = $aSelector.__sym__();
      if (aSelector === "==") {
        return $false;
      }
      if (aSelector === "!=") {
        return $true;
      }

      throw new Error("binary operator " + q(aSelector) + " failed.");
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    };

    spec.performBinaryOpOnSignal  = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnComplex = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnSeqColl = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnUGen    = spec.performBinaryOpOnSimpleNumber;

    // TODO: implements writeDefFile

    spec.isInputUGen = utils.alwaysReturn$false;
    spec.isOutputUGen = utils.alwaysReturn$false;
    spec.isControlUGen = utils.alwaysReturn$false;
    spec.source = utils.nop;
    spec.asUGenInput = utils.nop;
    spec.asControlInput = utils.nop;

    spec.asAudioRateInput = function() {
      if (this.rate().__sym__() !== "audio") {
        return $("K2A").ar(this);
      }
      return this;
    };

    // TODO: implements slotSize
    // TODO: implements slotAt
    // TODO: implements slotPut
    // TODO: implements slotKey
    // TODO: implements slotIndex
    // TODO: implements slotsDo
    // TODO: implements slotValuesDo
    // TODO: implements getSlots
    // TODO: implements setSlots
    // TODO: implements instVarSize
    // TODO: implements instVarAt
    // TODO: implements instVarPut
    // TODO: implements writeArchive
    // TODO: implements $readArchive
    // TODO: implements asArchive
    // TODO: implements initFromArchive
    // TODO: implements archiveAsCompileString
    // TODO: implements archiveAsObject
    // TODO: implements checkCanArchive
    // TODO: implements writeTextArchive
    // TODO: implements $readTextArchive
    // TODO: implements asTextArchive
    // TODO: implements getContainedObjects
    // TODO: implements writeBinaryArchive
    // TODO: implements $readBinaryArchive
    // TODO: implements asBinaryArchive
    // TODO: implements genNext
    // TODO: implements genCurrent
    // TODO: implements $classRedirect
    // TODO: implements help

    spec.processRest = utils.nop;

    spec["[]"] = function($index) {
      return this.$("at", [ $index ]);
    };

    spec["[]_"] = function($index, $value) {
      return this.$("put", [ $index, $value ]);
    };

    spec["[..]"] = function($first, $second, $last) {
      return this.$("copySeries", [ $first, $second, $last ]);
    };

    spec["[..]_"] = function($first, $second, $last, $value) {
      return this.$("putSeries", [ $first, $second, $last, $value ]);
    };
  });
});

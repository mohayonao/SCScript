SCScript.install(function(sc) {
  "use strict";

  var slice = [].slice;
  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int0  = $.int0;
  var $int1  = $.int1;
  var strlib = sc.libs.strlib;
  var q      = strlib.quote;
  var bytecode = sc.lang.bytecode;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");
  var SCAssociation = $("Association");

  sc.lang.klass.refine("Object", function(builder) {
    builder.addMethod("valueOf", function() {
      return this._;
    });

    builder.addMethod("toString", function() {
      return String(strlib.article(this.__className) + " " + this.__className);
    });

    builder.addMethod("toJSON", function() {
      return JSON.stringify({ class: this.__className, hash: this.__hash });
    });

    builder.addMethod("__num__", function() {
      throw new Error(this.__className + " cannot be converted to a Number.");
    });

    builder.addMethod("__int__", function() {
      return this.__num__()|0;
    });

    builder.addMethod("__bool__", function() {
      throw new Error(this.__className + " cannot be converted to a Boolean.");
    });

    builder.addMethod("__sym__", function() {
      throw new Error(this.__className + " cannot be converted to a Symbol.");
    });

    builder.addMethod("__str__", function() {
      return String(this);
    });

    // TODO: implements $new
    // TODO: implements $newCopyArgs

    builder.doesNotUnderstand("newFrom");

    // TODO: implements dump

    builder.addMethod("post", function() {
      this.asString().post();
      return this;
    });

    builder.addMethod("postln", function() {
      this.asString().postln();
      return this;
    });

    builder.addMethod("postc", function() {
      this.asString().postc();
      return this;
    });

    builder.addMethod("postcln", function() {
      this.asString().postcln();
      return this;
    });

    // TODO: implements postcs
    // TODO: implements totalFree
    // TODO: implements largestFreeBlock
    // TODO: implements gcDumpGrey
    // TODO: implements gcDumpSet
    // TODO: implements gcInfo
    // TODO: implements gcSanity
    // TODO: implements canCallOS

    builder.addMethod("size", function() {
      return $int0;
    });

    builder.addMethod("indexedSize", function() {
      return $int0;
    });

    builder.addMethod("flatSize", function() {
      return $int1;
    });

    builder.addMethod("do", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.object$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("generate", {
      args: "function; state"
    }, function($function, $state) {
      this.do($function);
      return $state;
    });

    builder.addMethod("class", function() {
      return this.__class;
    });

    builder.addMethod("isKindOf", function($aClass) {
      return $.Boolean(this instanceof $aClass.__Spec);
    });

    builder.addMethod("isMemberOf", function($aClass) {
      return $.Boolean(this.__class === $aClass);
    });

    var respondsTo = function($this, $aSymbol) {
      return typeof $this[
        $aSymbol ? $aSymbol.__sym__() : /* istanbul ignore next */ ""
      ] === "function";
    };

    builder.addMethod("respondsTo", function($aSymbol) {
      var $this = this;
      if ($aSymbol && $aSymbol.isSequenceableCollection().__bool__()) {
        return $.Boolean($aSymbol.asArray()._.every(function($aSymbol) {
          return $.Boolean(respondsTo($this, $aSymbol)).__bool__();
        }));
      }
      return $.Boolean(respondsTo(this, $aSymbol));
    });

    var performMsg = function($this, msg) {
      var selector, method;

      selector = msg[0] ? msg[0].__sym__() : /* istanbul ignore next */ "";
      method = $this[selector];

      if (method) {
        return method.apply($this, msg.slice(1));
      }

      throw new Error("Message " + q(selector) + " not understood.");
    };

    builder.addMethod("performMsg", function($msg) {
      return performMsg(this, $msg ? $msg.asArray()._ : /* istanbul ignore next */ []);
    });

    builder.addMethod("perform", function() {
      return performMsg(this, slice.call(arguments));
    });

    builder.addMethod("performList", function($selector, $arglist) {
      return performMsg(this, [ $selector ].concat(
        $arglist ? $arglist.asArray()._ : /* istanbul ignore next */ []
      ));
    });

    builder.addMethod("functionPerformList");

    // TODO: implements superPerform
    // TODO: implements superPerformList

    builder.addMethod("tryPerform", function($selector) {
      if (respondsTo(this, $selector)) {
        return performMsg(this, slice.call(arguments));
      }
      return $nil;
    });

    builder.addMethod("multiChannelPerform", function($selector) {
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
    });

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

    builder.addMethod("copy", function() {
      return this.shallowCopy();
    });

    // TODO: implements contentsCopy

    builder.addMethod("shallowCopy", function() {
      var a = new this.__Spec([]);

      Object.keys(this).forEach(function(key) {
        a[key] = copy(this[key]);
      }, this);

      if (this._ === this) {
        a._ = a;
      }

      return a;
    });

    // TODO: implements copyImmutable
    // TODO: implements deepCopy

    builder.addMethod("dup", {
      args: "n=2"
    }, function($n) {
      var $this = this;
      var array, i, n;

      if ($n.isSequenceableCollection().__bool__()) {
        return SCArray.fillND($n, $.Func(function() {
          return $this.copy();
        }));
      }

      n = $n.__int__();
      array = new Array(n);
      for (i = 0; i < n; ++i) {
        array[i] = this.copy();
      }

      return $.Array(array);
    });

    builder.addMethod("!", function($n) {
      return this.dup($n);
    });

    builder.addMethod("poll", function() {
      return this.value();
    });

    builder.addMethod("value");
    builder.addMethod("valueArray");
    builder.addMethod("valueEnvir");
    builder.addMethod("valueArrayEnvir");

    builder.addMethod("==", function($obj) {
      return this ["==="] ($obj);
    });

    builder.addMethod("!=", function($obj) {
      return (this ["=="] ($obj)).not();
    });

    builder.addMethod("===", function($obj) {
      return $.Boolean(this === $obj);
    });

    builder.addMethod("!==", function($obj) {
      return $.Boolean(this !== $obj);
    });

    builder.addMethod("equals", {
      args: "that; properties"
    }, function($that, $properties) {
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
    });

    // TODO: implements compareObject
    // TODO: implements instVarHash

    builder.addMethod("basicHash", function() {
      return $.Integer(this.__hash);
    });

    builder.addMethod("hash", function() {
      return $.Integer(this.__hash);
    });

    builder.addMethod("identityHash", function() {
      return $.Integer(this.__hash);
    });

    builder.addMethod("->", function($obj) {
      return SCAssociation.new(this, $obj);
    });

    builder.addMethod("next");
    builder.addMethod("reset");

    builder.addMethod("first", {
      args: "inval"
    }, function($inval) {
      this.reset();
      return this.next($inval);
    });

    builder.addMethod("iter", function() {
      return $("OneShotStream").new(this);
    });

    builder.addMethod("stop");
    builder.addMethod("free");
    builder.addMethod("clear");
    builder.addMethod("removedFromScheduler");
    builder.addMethod("isPlaying", sc.FALSE);

    builder.addMethod("embedInStream", function() {
      return this.yield();
    });

    builder.addMethod("cyc", {
      args: "n=inf"
    }, function($n) {
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
    });

    builder.addMethod("fin", {
      args: "n=1"
    }, function($n) {
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
    });

    builder.addMethod("repeat", {
      args: "repeats=inf"
    }, function($repeats) {
      return $("Pn").new(this, $repeats).asStream();
    });

    builder.addMethod("loop", function() {
      return this.repeat($.Float(Infinity));
    });

    builder.addMethod("asStream");

    builder.addMethod("streamArg", {
      args: "embed=false"
    }, function($embed) {
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
        return SCRoutine.new($.Func(function() {
          return $.Func(function() {
            return $this.yield();
          }).loop();
        }));
      }
    });

    builder.addMethod("eventAt", function() {
      return $nil;
    });

    builder.addMethod("composeEvents", {
      args: "event"
    }, function($event) {
      return $event.copy();
    });

    builder.addMethod("finishEvent");
    builder.addMethod("atLimit", sc.FALSE);
    builder.addMethod("isRest", sc.FALSE);
    builder.addMethod("threadPlayer");
    builder.addMethod("threadPlayer_");
    builder.addMethod("?");
    builder.addMethod("??");

    builder.addMethod("!?", function($obj) {
      return $obj.value(this);
    });

    builder.addMethod("isNil", sc.FALSE);
    builder.addMethod("notNil", sc.TRUE);
    builder.addMethod("isNumber", sc.FALSE);
    builder.addMethod("isInteger", sc.FALSE);
    builder.addMethod("isFloat", sc.FALSE);
    builder.addMethod("isSequenceableCollection", sc.FALSE);
    builder.addMethod("isCollection", sc.FALSE);
    builder.addMethod("isArray", sc.FALSE);
    builder.addMethod("isString", sc.FALSE);
    builder.addMethod("containsSeqColl", sc.FALSE);
    builder.addMethod("isValidUGenInput", sc.FALSE);
    builder.addMethod("isException", sc.FALSE);
    builder.addMethod("isFunction", sc.FALSE);

    builder.addMethod("matchItem", {
      args: "item"
    }, function($item) {
      return this ["==="] ($item);
    });

    builder.addMethod("trueAt", sc.FALSE);

    builder.addMethod("falseAt", {
      args: "key"
    }, function($key) {
      return this.trueAt($key).not();
    });

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

    builder.addMethod("species", function() {
      return this.class();
    });

    builder.addMethod("asCollection", function() {
      return $.Array([ this ]);
    });

    builder.addMethod("asSymbol", function() {
      return this.asString().asSymbol();
    });

    builder.addMethod("asString", function() {
      return $.String(String(this));
    });

    // TODO: implements asCompileString
    // TODO: implements cs
    // TODO: implements printClassNameOn
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeParamsOn
    // TODO: implements simplifyStoreArgs
    // TODO: implements storeArgs
    // TODO: implements storeModifiersOn

    builder.addMethod("as", {
      args: "aSimilarClass"
    }, function($aSimilarClass) {
      return $aSimilarClass.newFrom(this);
    });

    builder.addMethod("dereference");

    builder.addMethod("reference", function() {
      return $.Ref(this);
    });

    builder.addMethod("asRef", function() {
      return $.Ref(this);
    });

    builder.addMethod("asArray", function() {
      return this.asCollection().asArray();
    });

    builder.addMethod("asSequenceableCollection", function() {
      return this.asArray();
    });

    builder.addMethod("rank", function() {
      return $int0;
    });

    builder.addMethod("deepCollect", {
      args: "depth; function; index; rank"
    }, function($depth, $function, $index, $rank) {
      return $function.value(this, $index, $rank);
    });

    builder.addMethod("deepDo", {
      args: "depth; function; index; rank"
    }, function($depth, $function, $index, $rank) {
      $function.value(this, $index, $rank);
      return this;
    });

    builder.addMethod("slice");

    builder.addMethod("shape", function() {
      return $nil;
    });

    builder.addMethod("unbubble");

    builder.addMethod("bubble", {
      args: "depth; levels"
    }, function($depth, $levels) {
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
    });

    builder.addMethod("obtain", {
      args: "index; default"
    }, function($index, $default) {
      if ($index.__num__() === 0) {
        return this;
      } else {
        return $default;
      }
    });

    builder.addMethod("instill", {
      args: "index; item; default"
    }, function($index, $item, $default) {
      if ($index.__num__() === 0) {
        return $item;
      } else {
        return this.asArray().instill($index, $item, $default);
      }
    });

    builder.addMethod("addFunc", {
      args: "*functions"
    }, function($$functions) {
      return $("FunctionList").new(this ["++"] ($$functions));
    });

    builder.addMethod("removeFunc", function($function) {
      if (this === $function) {
        return $nil;
      }
      return this;
    });

    builder.addMethod("replaceFunc", {
      args: "find; replace"
    }, function($find, $replace) {
      if (this === $find) {
        return $replace;
      }
      return this;
    });

    // TODO: implements addFuncTo
    // TODO: implements removeFuncFrom

    builder.addMethod("while", {
      args: "body"
    }, function($body) {
      var $this = this;

      $.Func(function() {
        return $this.value();
      }).while($.Func(function() {
        return $body.value();
      }));

      return this;
    });

    builder.addMethod("switch", function() {
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
    });

    builder.addMethod("yield", function() {
      bytecode.yield(this.value());
      return $nil;
    });

    builder.addMethod("alwaysYield", function() {
      bytecode.alwaysYield(this.value());
      return $nil;
    });

    builder.addMethod("yieldAndReset", function($reset) {
      if (!$reset || $reset === $true) {
        bytecode.yieldAndReset(this.value());
      } else {
        bytecode.yield(this.value());
      }
      return $nil;
    });

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

    builder.addMethod("&", function($that) {
      return this.$("bitAnd", [ $that ]);
    });

    builder.addMethod("|", function($that) {
      return this.$("bitOr", [ $that ]);
    });

    builder.addMethod("%", function($that) {
      return this.$("mod", [ $that ]);
    });

    builder.addMethod("**", function($that) {
      return this.$("pow", [ $that ]);
    });

    builder.addMethod("<<", function($that) {
      return this.$("leftShift", [ $that ]);
    });

    builder.addMethod(">>", function($that) {
      return this.$("rightShift", [ $that ]);
    });

    builder.addMethod("+>>", function($that) {
      return this.$("unsignedRightShift" , [ $that ]);
    });

    builder.addMethod("<!", function($that) {
      return this.$("firstArg", [ $that ]);
    });

    builder.addMethod("asInt", function() {
      return this.asInteger();
    });

    builder.addMethod("blend", {
      args: "that; blendFrac=0.5"
    }, function($that, $blendFrac) {
      return this.$("+", [ $blendFrac.$("*", [ $that.$("-", [ this ]) ]) ]);
    });

    builder.addMethod("blendAt", {
      args: "index; method=\\clipAt"
    }, function($index, $method) {
      var $iMin;

      $iMin = $index.$("roundUp", [ $int1 ]).asInteger().__dec__();
      return this.perform($method, $iMin).blend(
        this.perform($method, $iMin.__inc__()),
        $index.$("absdif", [ $iMin ])
      );
    });

    builder.addMethod("blendPut", {
      args: "index; val; method=\\wrapPut"
    }, function($index, $val, $method) {
      var $iMin, $ratio;

      $iMin = $index.$("floor").asInteger();
      $ratio = $index.$("absdif", [ $iMin ]);
      this.perform($method, $iMin, $val.$("*", [ $int1 ["-"] ($ratio) ]));
      this.perform($method, $iMin.__inc__(), $val.$("*", [ $ratio ]));

      return this;
    });

    builder.addMethod("fuzzyEqual", {
      args: "that; precision=1.0"
    }, function($that, $precision) {
      return $.Float(0.0).max(
        $.Float(1.0) ["-"] (
          this.$("-", [ $that ]).$("abs").$("/", [ $precision ])
        )
      );
    });

    builder.addMethod("isUGen", sc.FALSE);

    builder.addMethod("numChannels", function() {
      return $int1;
    });

    builder.addMethod("pair", {
      args: "that"
    }, function($that) {
      return $.Array([ this, $that ]);
    });

    builder.addMethod("pairs", {
      args: "that"
    }, function($that) {
      var $list;

      $list = $.Array();
      this.asArray().do($.Func(function($a) {
        return $that.asArray().do($.Func(function($b) {
          $list = $list.add($a.asArray() ["++"] ($b));
          return $list;
        }));
      }));

      return $list;
    });

    builder.addMethod("awake", {
      args: "beats"
    }, function($beats) {
      return this.next($beats);
    });

    builder.addMethod("beats_");
    builder.addMethod("clock_");

    builder.addMethod("performBinaryOpOnSomething", function($aSelector) {
      var aSelector;

      aSelector = $aSelector.__sym__();
      if (aSelector === "==") {
        return $false;
      }
      if (aSelector === "!=") {
        return $true;
      }

      throw new Error("binary operator " + q(aSelector) + " failed.");
    });

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    });
    builder.addMethod("performBinaryOpOnSignal", function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    });
    builder.addMethod("performBinaryOpOnComplex", function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    });
    builder.addMethod("performBinaryOpOnSeqColl", function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    });
    builder.addMethod("performBinaryOpOnUGen", function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    });

    // TODO: implements writeDefFile

    builder.addMethod("isInputUGen", sc.FALSE);
    builder.addMethod("isOutputUGen", sc.FALSE);
    builder.addMethod("isControlUGen", sc.FALSE);
    builder.addMethod("source");
    builder.addMethod("asUGenInput");
    builder.addMethod("asControlInput");

    builder.addMethod("asAudioRateInput", function() {
      if (this.rate().__sym__() !== "audio") {
        return $("K2A").ar(this);
      }
      return this;
    });

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

    builder.addMethod("processRest");

    builder.addMethod("[]", function($index) {
      return this.$("at", [ $index ]);
    });

    builder.addMethod("[]_", function($index, $value) {
      return this.$("put", [ $index, $value ]);
    });

    builder.addMethod("[..]", function($first, $second, $last) {
      return this.$("copySeries", [ $first, $second, $last ]);
    });

    builder.addMethod("[..]_", function($first, $second, $last, $value) {
      return this.$("putSeries", [ $first, $second, $last, $value ]);
    });
  });
});

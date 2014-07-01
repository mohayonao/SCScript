// src/sc/classlib/Core/Object.js
SCScript.install(function(sc) {
  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int0  = $.int0;
  var $int1  = $.int1;
  var strlib = sc.libs.strlib;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");
  var SCAssociation = $("Association");

  sc.lang.klass.refine("Object", function(builder, _) {
    builder.addMethod("valueOf", function() {
      return this._;
    });

    builder.addMethod("toString", function() {
      return String(sc.libs.strlib.article(this.__className) + " " + this.__className);
    });

    builder.addMethod("toJSON", function() {
      return JSON.stringify({ class: this.__className, hash: this.__hash });
    });

    builder.addMethod("__num__", function() {
      throw new Error(strlib.format("#{0} cannot be converted to a Number.", this.__className));
    });

    builder.addMethod("__int__", function() {
      return this.__num__()|0;
    });

    builder.addMethod("__bool__", function() {
      throw new Error(strlib.format("#{0} cannot be converted to a Boolean.", this.__className));
    });

    builder.addMethod("__sym__", function() {
      throw new Error(strlib.format("#{0} cannot be converted to a Symbol.", this.__className));
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

      throw new Error(strlib.format("Message '#{0}' not understood.", selector));
    };

    builder.addMethod("performMsg", function($msg) {
      return performMsg(this, $msg ? $msg.asArray()._ : /* istanbul ignore next */ []);
    });

    builder.addMethod("perform", function() {
      return performMsg(this, _.toArray(arguments));
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
        return performMsg(this, _.toArray(arguments));
      }
      return $nil;
    });

    builder.addMethod("multiChannelPerform", function($selector) {
      var list, items, length, i, args, $obj, iter;
      items = [ this ].concat(_.toArray(arguments).slice(1));
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
    builder.addMethod("isPlaying", 4);

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
    builder.addMethod("atLimit", 4);
    builder.addMethod("isRest", 4);
    builder.addMethod("threadPlayer");
    builder.addMethod("threadPlayer_");
    builder.addMethod("?");
    builder.addMethod("??");

    builder.addMethod("!?", function($obj) {
      return $obj.value(this);
    });

    builder.addMethod("isNil", 4);
    builder.addMethod("notNil", 3);
    builder.addMethod("isNumber", 4);
    builder.addMethod("isInteger", 4);
    builder.addMethod("isFloat", 4);
    builder.addMethod("isSequenceableCollection", 4);
    builder.addMethod("isCollection", 4);
    builder.addMethod("isArray", 4);
    builder.addMethod("isString", 4);
    builder.addMethod("containsSeqColl", 4);
    builder.addMethod("isValidUGenInput", 4);
    builder.addMethod("isException", 4);
    builder.addMethod("isFunction", 4);

    builder.addMethod("matchItem", {
      args: "item"
    }, function($item) {
      return this ["==="] ($item);
    });

    builder.addMethod("trueAt", 4);

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

      args = _.toArray(arguments);
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
      sc.lang.bytecode.yield(this.value());
      return $nil;
    });

    builder.addMethod("alwaysYield", function() {
      sc.lang.bytecode.alwaysYield(this.value());
      return $nil;
    });

    builder.addMethod("yieldAndReset", function($reset) {
      if (!$reset || $reset === $true) {
        sc.lang.bytecode.yieldAndReset(this.value());
      } else {
        sc.lang.bytecode.yield(this.value());
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

    builder.addMethod("isUGen", 4);

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

      throw new Error(strlib.format("binary operator '#{0}' failed.", aSelector));
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

    builder.addMethod("isInputUGen", 4);
    builder.addMethod("isOutputUGen", 4);
    builder.addMethod("isControlUGen", 4);
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
  });
});

// src/sc/classlib/Core/AbstractFunction.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $int0 = $.int0;

  sc.lang.klass.refine("AbstractFunction", function(builder) {
    builder.addMethod("composeUnaryOp", function($aSelector) {
      return $("UnaryOpFunction").new($aSelector, this);
    });

    builder.addMethod("composeBinaryOp", function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    });

    builder.addMethod("reverseComposeBinaryOp", function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    });

    builder.addMethod("composeNAryOp", function($aSelector, $anArgList) {
      return $("NAryOpFunction").new($aSelector, this, $anArgList);
    });

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector, $aNumber, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aNumber, $adverb);
    });

    builder.addMethod("performBinaryOpOnSignal", function($aSelector, $aSignal, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSignal, $adverb);
    });

    builder.addMethod("performBinaryOpOnComplex", function($aSelector, $aComplex, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aComplex, $adverb);
    });

    builder.addMethod("performBinaryOpOnSeqColl", function($aSelector, $aSeqColl, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSeqColl, $adverb);
    });

    builder.addMethod("neg", function() {
      return this.composeUnaryOp($.Symbol("neg"));
    });

    builder.addMethod("reciprocal", function() {
      return this.composeUnaryOp($.Symbol("reciprocal"));
    });

    builder.addMethod("bitNot", function() {
      return this.composeUnaryOp($.Symbol("bitNot"));
    });

    builder.addMethod("abs", function() {
      return this.composeUnaryOp($.Symbol("abs"));
    });

    builder.addMethod("asFloat", function() {
      return this.composeUnaryOp($.Symbol("asFloat"));
    });

    builder.addMethod("asInteger", function() {
      return this.composeUnaryOp($.Symbol("asInteger"));
    });

    builder.addMethod("ceil", function() {
      return this.composeUnaryOp($.Symbol("ceil"));
    });

    builder.addMethod("floor", function() {
      return this.composeUnaryOp($.Symbol("floor"));
    });

    builder.addMethod("frac", function() {
      return this.composeUnaryOp($.Symbol("frac"));
    });

    builder.addMethod("sign", function() {
      return this.composeUnaryOp($.Symbol("sign"));
    });

    builder.addMethod("squared", function() {
      return this.composeUnaryOp($.Symbol("squared"));
    });

    builder.addMethod("cubed", function() {
      return this.composeUnaryOp($.Symbol("cubed"));
    });

    builder.addMethod("sqrt", function() {
      return this.composeUnaryOp($.Symbol("sqrt"));
    });

    builder.addMethod("exp", function() {
      return this.composeUnaryOp($.Symbol("exp"));
    });

    builder.addMethod("midicps", function() {
      return this.composeUnaryOp($.Symbol("midicps"));
    });

    builder.addMethod("cpsmidi", function() {
      return this.composeUnaryOp($.Symbol("cpsmidi"));
    });

    builder.addMethod("midiratio", function() {
      return this.composeUnaryOp($.Symbol("midiratio"));
    });

    builder.addMethod("ratiomidi", function() {
      return this.composeUnaryOp($.Symbol("ratiomidi"));
    });

    builder.addMethod("ampdb", function() {
      return this.composeUnaryOp($.Symbol("ampdb"));
    });

    builder.addMethod("dbamp", function() {
      return this.composeUnaryOp($.Symbol("dbamp"));
    });

    builder.addMethod("octcps", function() {
      return this.composeUnaryOp($.Symbol("octcps"));
    });

    builder.addMethod("cpsoct", function() {
      return this.composeUnaryOp($.Symbol("cpsoct"));
    });

    builder.addMethod("log", function() {
      return this.composeUnaryOp($.Symbol("log"));
    });

    builder.addMethod("log2", function() {
      return this.composeUnaryOp($.Symbol("log2"));
    });

    builder.addMethod("log10", function() {
      return this.composeUnaryOp($.Symbol("log10"));
    });

    builder.addMethod("sin", function() {
      return this.composeUnaryOp($.Symbol("sin"));
    });

    builder.addMethod("cos", function() {
      return this.composeUnaryOp($.Symbol("cos"));
    });

    builder.addMethod("tan", function() {
      return this.composeUnaryOp($.Symbol("tan"));
    });

    builder.addMethod("asin", function() {
      return this.composeUnaryOp($.Symbol("asin"));
    });

    builder.addMethod("acos", function() {
      return this.composeUnaryOp($.Symbol("acos"));
    });

    builder.addMethod("atan", function() {
      return this.composeUnaryOp($.Symbol("atan"));
    });

    builder.addMethod("sinh", function() {
      return this.composeUnaryOp($.Symbol("sinh"));
    });

    builder.addMethod("cosh", function() {
      return this.composeUnaryOp($.Symbol("cosh"));
    });

    builder.addMethod("tanh", function() {
      return this.composeUnaryOp($.Symbol("tanh"));
    });

    builder.addMethod("rand", function() {
      return this.composeUnaryOp($.Symbol("rand"));
    });

    builder.addMethod("rand2", function() {
      return this.composeUnaryOp($.Symbol("rand2"));
    });

    builder.addMethod("linrand", function() {
      return this.composeUnaryOp($.Symbol("linrand"));
    });

    builder.addMethod("bilinrand", function() {
      return this.composeUnaryOp($.Symbol("bilinrand"));
    });

    builder.addMethod("sum3rand", function() {
      return this.composeUnaryOp($.Symbol("sum3rand"));
    });

    builder.addMethod("distort", function() {
      return this.composeUnaryOp($.Symbol("distort"));
    });

    builder.addMethod("softclip", function() {
      return this.composeUnaryOp($.Symbol("softclip"));
    });

    builder.addMethod("coin", function() {
      return this.composeUnaryOp($.Symbol("coin"));
    });

    builder.addMethod("even", function() {
      return this.composeUnaryOp($.Symbol("even"));
    });

    builder.addMethod("odd", function() {
      return this.composeUnaryOp($.Symbol("odd"));
    });

    builder.addMethod("rectWindow", function() {
      return this.composeUnaryOp($.Symbol("rectWindow"));
    });

    builder.addMethod("hanWindow", function() {
      return this.composeUnaryOp($.Symbol("hanWindow"));
    });

    builder.addMethod("welWindow", function() {
      return this.composeUnaryOp($.Symbol("welWindow"));
    });

    builder.addMethod("triWindow", function() {
      return this.composeUnaryOp($.Symbol("triWindow"));
    });

    builder.addMethod("scurve", function() {
      return this.composeUnaryOp($.Symbol("scurve"));
    });

    builder.addMethod("ramp", function() {
      return this.composeUnaryOp($.Symbol("ramp"));
    });

    builder.addMethod("isPositive", function() {
      return this.composeUnaryOp($.Symbol("isPositive"));
    });

    builder.addMethod("isNegative", function() {
      return this.composeUnaryOp($.Symbol("isNegative"));
    });

    builder.addMethod("isStrictlyPositive", function() {
      return this.composeUnaryOp($.Symbol("isStrictlyPositive"));
    });

    builder.addMethod("rho", function() {
      return this.composeUnaryOp($.Symbol("rho"));
    });

    builder.addMethod("theta", function() {
      return this.composeUnaryOp($.Symbol("theta"));
    });

    builder.addMethod("rotate", function($function) {
      return this.composeBinaryOp($.Symbol("rotate"), $function);
    });

    builder.addMethod("dist", function($function) {
      return this.composeBinaryOp($.Symbol("dist"), $function);
    });

    builder.addMethod("+", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("+"), $function, $adverb);
    });

    builder.addMethod("-", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("-"), $function, $adverb);
    });

    builder.addMethod("*", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("*"), $function, $adverb);
    });

    builder.addMethod("/", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("/"), $function, $adverb);
    });

    builder.addMethod("div", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("div"), $function, $adverb);
    });

    builder.addMethod("mod", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("mod"), $function, $adverb);
    });

    builder.addMethod("pow", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("pow"), $function, $adverb);
    });

    builder.addMethod("min", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("min"), $function, $adverb);
    });

    builder.addMethod("max", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("max"), $function, $adverb);
    });

    builder.addMethod("<", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<"), $function, $adverb);
    });

    builder.addMethod("<=", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<="), $function, $adverb);
    });

    builder.addMethod(">", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">"), $function, $adverb);
    });

    builder.addMethod(">=", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">="), $function, $adverb);
    });

    builder.addMethod("bitAnd", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitAnd"), $function, $adverb);
    });

    builder.addMethod("bitOr", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitOr"), $function, $adverb);
    });

    builder.addMethod("bitXor", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitXor"), $function, $adverb);
    });

    builder.addMethod("bitHammingDistance", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitHammingDistance"), $function, $adverb);
    });

    builder.addMethod("lcm", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("lcm"), $function, $adverb);
    });

    builder.addMethod("gcd", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("gcd"), $function, $adverb);
    });

    builder.addMethod("round", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("round"), $function, $adverb);
    });

    builder.addMethod("roundUp", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("roundUp"), $function, $adverb);
    });

    builder.addMethod("trunc", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("trunc"), $function, $adverb);
    });

    builder.addMethod("atan2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("atan2"), $function, $adverb);
    });

    builder.addMethod("hypot", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypot"), $function, $adverb);
    });

    builder.addMethod("hypotApx", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypotApx"), $function, $adverb);
    });

    builder.addMethod("leftShift", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("leftShift"), $function, $adverb);
    });

    builder.addMethod("rightShift", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rightShift"), $function, $adverb);
    });

    builder.addMethod("unsignedRightShift", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("unsignedRightShift"), $function, $adverb);
    });

    builder.addMethod("ring1", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring1"), $function, $adverb);
    });

    builder.addMethod("ring2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring2"), $function, $adverb);
    });

    builder.addMethod("ring3", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring3"), $function, $adverb);
    });

    builder.addMethod("ring4", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring4"), $function, $adverb);
    });

    builder.addMethod("difsqr", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("difsqr"), $function, $adverb);
    });

    builder.addMethod("sumsqr", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sumsqr"), $function, $adverb);
    });

    builder.addMethod("sqrsum", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrsum"), $function, $adverb);
    });

    builder.addMethod("sqrdif", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrdif"), $function, $adverb);
    });

    builder.addMethod("absdif", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("absdif"), $function, $adverb);
    });

    builder.addMethod("thresh", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("thresh"), $function, $adverb);
    });

    builder.addMethod("amclip", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("amclip"), $function, $adverb);
    });

    builder.addMethod("scaleneg", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("scaleneg"), $function, $adverb);
    });

    builder.addMethod("clip2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("clip2"), $function, $adverb);
    });

    builder.addMethod("fold2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("fold2"), $function, $adverb);
    });

    builder.addMethod("wrap2", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("wrap2"), $function, $adverb);
    });

    builder.addMethod("excess", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("excess"), $function, $adverb);
    });

    builder.addMethod("firstArg", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("firstArg"), $function, $adverb);
    });

    builder.addMethod("rrand", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rrand"), $function, $adverb);
    });

    builder.addMethod("exprand", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("exprand"), $function, $adverb);
    });

    builder.addMethod("@", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("@"), $function, $adverb);
    });

    builder.addMethod("real");

    builder.addMethod("imag", function() {
      return $.Float(0.0);
    });

    builder.addMethod("||", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("||"), $function, $adverb);
    });

    builder.addMethod("&&", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("&&"), $function, $adverb);
    });

    builder.addMethod("xor", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("xor"), $function, $adverb);
    });

    builder.addMethod("nand", function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("nand"), $function, $adverb);
    });

    builder.addMethod("not", function() {
      return this.composeUnaryOp($.Symbol("not"));
    });

    builder.addMethod("ref", function() {
      return this.composeUnaryOp($.Symbol("asRef"));
    });

    builder.addMethod("clip", function($lo, $hi) {
      return this.composeNAryOp($.Symbol("clip"), $.Array([ $lo, $hi ]));
    });

    builder.addMethod("wrap", function($lo, $hi) {
      return this.composeNAryOp($.Symbol("wrap"), $.Array([ $lo, $hi ]));
    });

    builder.addMethod("fold", function($lo, $hi) {
      return this.composeNAryOp($.Symbol("fold"), $.Array([ $lo, $hi ]));
    });

    builder.addMethod("blend", {
      args: "that; blendFrac=0.5"
    }, function($that, $blendFrac) {
      return this.composeNAryOp(
        $.Symbol("blend"), $.Array([ $that, $blendFrac ])
      );
    });

    builder.addMethod("linlin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linlin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("linexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("explin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("explin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("expexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("expexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    });

    builder.addMethod("lincurve", {
      args: "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("lincurve"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    });

    builder.addMethod("curvelin", {
      args: "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("curvelin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    });

    builder.addMethod("bilin", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("bilin"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    });

    builder.addMethod("biexp", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("biexp"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    });

    builder.addMethod("moddif", {
      args: "function; mod"
    }, function($function, $mod) {
      return this.composeNAryOp(
        $.Symbol("moddif"), $.Array([ $function, $mod ])
      );
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return this.composeNAryOp(
        $.Symbol("degreeToKey"), $.Array([ $scale, $stepsPerOctave ])
      );
    });

    builder.addMethod("degrad", function() {
      return this.composeUnaryOp($.Symbol("degrad"));
    });

    builder.addMethod("raddeg", function() {
      return this.composeUnaryOp($.Symbol("raddeg"));
    });

    builder.addMethod("applyTo", function() {
      return this.value.apply(this, arguments);
    });

    // TODO: implements <>
    // TODO: implements sampled

    builder.addMethod("asUGenInput", function($for) {
      return this.value($for);
    });

    builder.addMethod("asAudioRateInput", function($for) {
      var $result;

      $result = this.value($for);

      if ($result.rate().__sym__() !== "audio") {
        return $("K2A").ar($result);
      }

      return $result;
    });

    builder.addMethod("asControlInput", function() {
      return this.value();
    });

    builder.addMethod("isValidUGenInput", 3);
  });

  sc.lang.klass.define("UnaryOpFunction : AbstractFunction", function(builder, _) {
    builder.addClassMethod("new", function($selector, $a) {
      return _.newCopyArgs(this, {
        selector: $selector,
        a: $a
      });
    });

    builder.addMethod("value", function() {
      var $a = this._$a;
      return $a.value.apply($a, arguments).perform(this._$selector);
    });

    builder.addMethod("valueArray", function($args) {
      return this._$a.valueArray($args).perform(this._$selector);
    });

    builder.addMethod("valueEnvir", function() {
      var $a = this._$a;
      return $a.valueEnvir.apply($a, arguments).perform(this._$selector);
    });

    builder.addMethod("valueArrayEnvir", function($args) {
      return this._$a.valueArrayEnvir($args).perform(this._$selector);
    });

    builder.addMethod("functionPerformList", function($selector, $arglist) {
      return this.performList($selector, $arglist);
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpFunction : AbstractFunction", function(builder, _) {
    builder.addClassMethod("new", function($selector, $a, $b, $adverb) {
      return _.newCopyArgs(this, {
        selector: $selector,
        a: $a,
        b: $b,
        adverb: $adverb
      });
    });

    builder.addMethod("value", function() {
      return this._$a.value.apply(this._$a, arguments)
        .perform(this._$selector, this._$b.value.apply(this._$b, arguments), this._$adverb);
    });

    builder.addMethod("valueArray", function($args) {
      return this._$a.valueArray($args)
        .perform(this._$selector, this._$b.valueArray($args, arguments), this._$adverb);
    });

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    builder.addMethod("functionPerformList", function($selector, $arglist) {
      return this.performList($selector, $arglist);
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("NAryOpFunction : AbstractFunction", function(builder, _) {
    builder.addClassMethod("new", function($selector, $a, $arglist) {
      return _.newCopyArgs(this, {
        selector: $selector,
        a: $a,
        arglist: $arglist
      });
    });

    builder.addMethod("value", function() {
      var args = arguments;
      return this._$a.value.apply(this._$a, args)
        .performList(this._$selector, this._$arglist.collect($.Func(function($_) {
          return $_.value.apply($_, args);
        })));
    });

    builder.addMethod("valueArray", function($args) {
      return this._$a.valueArray($args)
        .performList(this._$selector, this._$arglist.collect($.Func(function($_) {
          return $_.valueArray($args);
        })));
    });

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    builder.addMethod("functionPerformList", function($selector, _$arglist) {
      return this.performList($selector, _$arglist);
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("FunctionList : AbstractFunction", function(builder, _) {
    builder.addProperty("<>", "array");

    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._flopped = false;
    });

    builder.addClassMethod("new", function($functions) {
      return _.newCopyArgs(this, {
        array: $functions
      });
    });

    builder.addMethod("flopped", function() {
      return $.Boolean(this._flopped);
    });

    builder.addMethod("addFunc", {
      args: "*functions"
    }, function($$functions) {
      if (this._flopped) {
        throw new Error("cannot add a function to a flopped FunctionList");
      }

      this._$array = this._$array.addAll($$functions);

      return this;
    });

    builder.addMethod("removeFunc", function($function) {
      this._$array.remove($function);

      if (this._$array.size() < 2) {
        return this._$array.at($int0);
      }

      return this;
    });

    builder.addMethod("replaceFunc", function($find, $replace) {
      this._$array = this._$array.replace($find, $replace);
      return this;
    });

    builder.addMethod("value", function() {
      var $res, args = arguments;

      $res = this._$array.collect($.Func(function($_) {
        return $_.value.apply($_, args);
      }));

      return this._flopped ? $res.flop() : $res;
    });

    builder.addMethod("valueArray", function($args) {
      var $res;

      $res = this._$array.collect($.Func(function($_) {
        return $_.valueArray($args);
      }));

      return this._flopped ? $res.flop() : $res;
    });

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    builder.addMethod("do", function($function) {
      this._$array.do($function);
      return this;
    });

    builder.addMethod("flop", function() {
      if (!this._flopped) {
        this._$array = this._$array.collect($.Func(function($_) {
          return $_.$("flop");
        }));
      }
      this._flopped = true;

      return this;
    });

    // TODO: implements envirFlop

    builder.addMethod("storeArgs", function() {
      return $.Array([ this._$array ]);
    });
  });
});

// src/sc/classlib/Streams/Stream.js
SCScript.install(function(sc) {

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
            },
            $.NOP
          ];
        }).loop();
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
          },
          $.NOP
        ];
      }));
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

// src/sc/classlib/Streams/Patterns.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $false = $.false;
  var SCRoutine = $("Routine");

  sc.lang.klass.define("Pattern : AbstractFunction", function(builder) {
    builder.addMethod("++", function($aPattern) {
      return $("Pseq").new($.Array([ this, $aPattern ]));
    });

    builder.addMethod("<>", function($aPattern) {
      return $("Pchain").new(this, $aPattern);
    });

    builder.addMethod("play", {
      args: "clock; protoEvent; quant"
    }, function($clock, $protoEvent, $quant) {
      return this.asEventStreamPlayer($protoEvent).play($clock, $false, $quant);
    });

    builder.addMethod("asStream", function() {
      var $this = this;
      return SCRoutine.new($.Func(function($inval) {
        return $this.embedInStream($inval);
      }));
    });

    builder.addMethod("iter", function() {
      return this.asStream();
    });

    builder.addMethod("streamArg", function() {
      return this.asStream();
    });

    builder.addMethod("asEventStreamPlayer", {
      args: "protoEvent"
    }, function($protoEvent) {
      return $("EventStreamPlayer").new(this.asStream(), $protoEvent);
    });

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      return this.asStream().embedInStream($inval);
    });

    builder.addMethod("do", function($function) {
      return this.asStream().do($function);
    });

    builder.addMethod("collect", function($function) {
      return $("Pcollect").new($function, this);
    });

    builder.addMethod("select", function($function) {
      return $("Pselect").new($function, this);
    });

    builder.addMethod("reject", function($function) {
      return $("Preject").new($function, this);
    });

    builder.addMethod("composeUnaryOp", function($operator) {
      return $("Punop").new($operator, this);
    });

    builder.addMethod("composeBinaryOp", function($operator, $pattern, $adverb) {
      return $("Pbinop").new($operator, this, $pattern, $adverb);
    });

    builder.addMethod("reverseComposeBinaryOp", function($operator, $pattern, $adverb) {
      return $("Pbinop").new($operator, $pattern, this, $adverb);
    });

    builder.addMethod("composeNAryOp", function($selector, $argList) {
      return $("Pnaryop").new($selector, this, $argList);
    });

    builder.addMethod("mtranspose", function($n) {
      return $("Paddp").new($.Symbol("mtranspose"), $n, this);
    });

    builder.addMethod("ctranspose", function($n) {
      return $("Paddp").new($.Symbol("ctranspose"), $n, this);
    });

    builder.addMethod("gtranspose", function($n) {
      return $("Paddp").new($.Symbol("gtranspose"), $n, this);
    });

    builder.addMethod("detune", function($n) {
      return $("Paddp").new($.Symbol("detune"), $n, this);
    });

    builder.addMethod("scaleDur", function($x) {
      return $("Pmulp").new($.Symbol("dur"), $x, this);
    });

    builder.addMethod("addDur", function($x) {
      return $("Paddp").new($.Symbol("dur"), $x, this);
    });

    builder.addMethod("stretch", function($x) {
      return $("Pmulp").new($.Symbol("stretch"), $x, this);
    });

    builder.addMethod("lag", function($t) {
      return $("Plag").new($t, this);
    });

    builder.addMethod("legato", function($x) {
      return $("Pmulp").new($.Symbol("legato"), $x, this);
    });

    builder.addMethod("db", function($db) {
      return $("Paddp").new($.Symbol("db"), $db, this);
    });

    builder.addMethod("clump", function($n) {
      return $("Pclump").new($n, this);
    });

    builder.addMethod("flatten", function($n) {
      return $("Pflatten").new($n, this);
    });

    builder.addMethod("repeat", function($n) {
      return $("Pn").new(this, $n);
    });

    builder.addMethod("keep", function($n) {
      return $("Pfin").new($n, this);
    });

    builder.addMethod("drop", function($n) {
      return $("Pdrop").new($n, this);
    });

    builder.addMethod("stutter", function($n) {
      return $("Pstutter").new($n, this);
    });

    builder.addMethod("finDur", function($dur, $tolerance ) {
      return $("Pfindur").new($dur, this, $tolerance);
    });

    builder.addMethod("fin", function($n) {
      return $("Pfin").new($n, this);
    });

    builder.addMethod("trace", function($key, $printStream, $prefix) {
      return $("Ptrace").new(this, $key, $printStream, $prefix);
    });

    builder.addMethod("differentiate", function() {
      return $("Pdiff").new(this);
    });
    // TODO: implements integrate
    // TODO: implements record
  });

  sc.lang.klass.define("Pseries : Pattern", function(builder, _) {
    var $nil = $.nil;

    builder.addProperty("<>", "start");
    builder.addProperty("<>", "step");
    builder.addProperty("<>", "length");

    builder.addClassMethod("new", {
      args: "start=0; step=1; length=inf"
    }, function($start, $step, $length) {
      return _.newCopyArgs(this, {
        start: $start,
        step: $step,
        length: $length
      });
    });

    // TODO: implements storeArgs

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      var counter, length;
      var $cur, $stepStr;

      counter = 0;
      length  = this._$length.__int__();

      $cur     = this._$start;
      $stepStr = this._$step.asStream();

      $.Func(function() {
        return $.Boolean(counter < length);
      }).while($.Function(function() {
        var $stepVal;
        return [
          function() {
            $stepVal = $stepStr.next($inval);

            if ($stepVal === $nil) {
              this.break();
            }
          },
          function() {
            var $outval;

            $outval = $cur;
            $cur = $cur.$("+", [ $stepVal ]);
            counter += 1;
            $inval   = $outval.yield();
            return $inval;
          },
          $.NOP
        ];
      }));

      return $inval;
    });
  });

  sc.lang.klass.define("Pgeom : Pattern", function(builder, _) {
    var $nil = $.nil;

    builder.addProperty("<>", "start");
    builder.addProperty("<>", "grow");
    builder.addProperty("<>", "length");

    builder.addClassMethod("new", {
      args: "start=0; grow=1; length=inf"
    }, function($start, $grow, $length) {
      return _.newCopyArgs(this, {
        start: $start,
        grow: $grow,
        length: $length
      });
    });

    // TODO: implements storeArgs

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      var counter, length;
      var $cur, $growStr;

      counter = 0;
      length  = this._$length.__int__();

      $cur     = this._$start;
      $growStr = this._$grow.asStream();

      $.Func(function() {
        return $.Boolean(counter < length);
      }).while($.Function(function() {
        var $growVal;
        return [
          function() {
            $growVal = $growStr.next($inval);

            if ($growVal === $nil) {
              this.break();
            }
          },
          function() {
            var $outval;

            $outval = $cur;
            $cur = $cur.$("*", [ $growVal ]);
            counter += 1;
            $inval   = $outval.yield();
            return $inval;
          },
          $.NOP
        ];
      }));

      return $inval;
    });
  });
});

// src/sc/classlib/Streams/ListPatterns.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;

  sc.lang.klass.define("ListPattern : Pattern", function(builder) {
    builder.addProperty("<>", "list");
    builder.addProperty("<>", "repeats");

    builder.addClassMethod("new", {
      args: "list; repeats=1"
    }, function($list, $repeats) {
      if ($list.size().__int__() > 0) {
        return this.__super__("new").list_($list).repeats_($repeats);
      }
      throw new Error("ListPattern (" + this.__className + ") requires a non-empty collection.");
    });

    builder.addMethod("copy", function() {
      return this.__super__("copy").list_(this._$list.copy());
    });
    // TODO: implements storeArgs
  });

  sc.lang.klass.define("Pseq : ListPattern", function(builder) {
    builder.addProperty("<>", "offset");

    builder.addClassMethod("new", {
      args: "list; repeats=1; offset=0"
    }, function($list, $repeats, $offset) {
      return this.__super__("new", [ $list, $repeats ]).offset_($offset);
    });

    builder.addMethod("embedInStream", {
      args: "inval"
    }, function($inval) {
      var $list, $offset, $repeats;

      $list    = this._$list;
      $offset  = this._$offset;
      $repeats = this._$repeats;

      $repeats.value($inval).do($.Func(function() {
        var $offsetValue = $offset.value($inval);
        return $list.size().do($.Func(function($_, $i) { // TODO: reverseDo?
          var $item  = $list.wrapAt($i.$("+", [ $offsetValue ]));
          $inval = $item.embedInStream($inval);
          return $inval;
        }));
      }));

      return $inval;
    });
    // TODO: implements storeArgs
  });
});

// src/sc/classlib/Streams/BasicOpsStream.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.define("UnaryOpStream : Stream", function(builder, _) {
    builder.addClassMethod("new", function($operator, $a) {
      return _.newCopyArgs(this, {
        operator: $operator,
        a: $a
      });
    });

    builder.addMethod("next", {
      args: "inval"
    }, function($inval) {
      var $vala;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      return $vala.perform(this._$operator);
    });

    builder.addMethod("reset", function() {
      this._$a.reset();
      return this;
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpStream : Stream", function(builder, _) {
    builder.addClassMethod("new", function($operator, $a, $b) {
      return _.newCopyArgs(this, {
        operator: $operator,
        a: $a,
        b: $b
      });
    });

    builder.addMethod("next", {
      args: "inval"
    }, function($inval) {
      var $vala, $valb;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      $valb = this._$b.next($inval);
      if ($valb === $nil) {
        return $nil;
      }

      return $vala.perform(this._$operator, $valb);
    });

    builder.addMethod("reset", function() {
      this._$a.reset();
      this._$b.reset();
      return this;
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpXStream : Stream", function(builder, _) {
    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._$vala = $nil;
    });

    builder.addClassMethod("new", function($operator, $a, $b) {
      return _.newCopyArgs(this, {
        operator: $operator,
        a: $a,
        b: $b
      });
    });

    builder.addMethod("next", {
      args: "inval"
    }, function($inval) {
      var $valb;

      if (this._$vala === $nil) {
        this._$vala = this._$a.next($inval);
        if (this._$vala === $nil) {
          return $nil;
        }
        $valb = this._$b.next($inval);
        if ($valb === $nil) {
          return $nil;
        }
      } else {
        $valb = this._$b.next($inval);
        if ($valb === $nil) {
          this._$vala = this._$a.next($inval);
          if (this._$vala === $nil) {
            return $nil;
          }
          this._$b.reset();
          $valb = this._$b.next($inval);
          if ($valb === $nil) {
            return $nil;
          }
        }
      }

      return this._$vala.perform(this._$operator, $valb);
    });

    builder.addMethod("reset", function() {
      this._$vala = $nil;
      this._$a.reset();
      this._$b.reset();
      return this;
    });
    // TODO: implements storeOn
  });

  sc.lang.klass.define("NAryOpStream : Stream", function(builder, _) {
    var $nil = $.nil;

    builder.addClassMethod("new", function($operator, $a, $arglist) {
      return _.newCopyArgs(this, {
        operator: $operator,
        a: $a
      }).arglist_($arglist);
    });

    builder.addMethod("arglist_", function($list) {
      this._arglist = Array.isArray($list._) ? $list._ : /* istanbul ignore next */ [];
      this._isNumeric = this._arglist.every(function($item) {
        return $item.__tag === 3 || $item.isNumber().__bool__();
      });
      return this;
    });

    builder.addMethod("next", {
      args: "inval"
    }, function($inval) {
      var $vala, $break;
      var values;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      if (this._isNumeric) {
        values = this._arglist;
      } else {
        values = this._arglist.map(function($item) {
          var $res;

          $res = $item.next($inval);
          if ($res === $nil) {
            $break = $nil;
            return $nil;
          }

          return $res;
        });
        if ($break) {
          return $break;
        }
      }

      return $vala.perform.apply($vala, [ this._$operator ].concat(values));
    });

    builder.addMethod("reset", function() {
      this._$a.reset();
      this._arglist.forEach(function($item) {
        $item.reset();
      });
      return this;
    });
    // TODO: implements storeOn
  });
});

// src/sc/classlib/Math/Magnitude.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;

  sc.lang.klass.refine("Magnitude", function(builder) {
    builder.addMethod("==", function($aMagnitude) {
      return $.Boolean(this.valueOf() === $aMagnitude.valueOf());
    });

    builder.addMethod("!=", function($aMagnitude) {
      return $.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    });

    builder.addMethod("<", function($aMagnitude) {
      return $.Boolean(this < $aMagnitude);
    });

    builder.addMethod(">", function($aMagnitude) {
      return $.Boolean(this > $aMagnitude);
    });

    builder.addMethod("<=", function($aMagnitude) {
      return $.Boolean(this <= $aMagnitude);
    });

    builder.addMethod(">=", function($aMagnitude) {
      return $.Boolean(this >= $aMagnitude);
    });

    builder.addMethod("exclusivelyBetween", {
      args: "lo; hi"
    }, function($lo, $hi) {
      var value = this.valueOf(), lo = $lo.valueOf(), hi = $hi.valueOf();
      return $.Boolean(lo < value && value < hi);
    });

    builder.addMethod("inclusivelyBetween", {
      args: "lo; hi"
    }, function($lo, $hi) {
      var value = this.valueOf(), lo = $lo.valueOf(), hi = $hi.valueOf();
      return $.Boolean(lo <= value && value <= hi);
    });

    builder.addMethod("min", {
      args: "aMagnitude"
    }, function($aMagnitude) {
      return this.valueOf() <= $aMagnitude.valueOf() ? this : $aMagnitude;
    });

    builder.addMethod("max", {
      args: "aMagnitude"
    }, function($aMagnitude) {
      return this.valueOf() >= $aMagnitude.valueOf() ? this : $aMagnitude;
    });

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
      var value = this.valueOf();
      return value <= $lo.valueOf() ? $lo : value >= $hi.valueOf() ? $hi : this;
    });
  });
});

// src/sc/classlib/Math/Number.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;

  sc.lang.klass.refine("Number", function(builder) {
    builder.addMethod("isNumber", 3);

    builder.subclassResponsibility("+");
    builder.subclassResponsibility("-");
    builder.subclassResponsibility("*");
    builder.subclassResponsibility("/");
    builder.subclassResponsibility("mod");
    builder.subclassResponsibility("div");
    builder.subclassResponsibility("pow");

    builder.addMethod("performBinaryOpOnSeqColl", function($aSelector, $aSeqColl, $adverb) {
      var $this = this;

      return $aSeqColl.$("collect", [ $.Func(function($item) {
        return $item.perform($aSelector, $this, $adverb);
      }) ]);
    });

    // TODO: implements performBinaryOpOnPoint

    builder.addMethod("rho");

    builder.addMethod("theta", function() {
      return $.Float(0.0);
    });

    builder.addMethod("real");

    builder.addMethod("imag", function() {
      return $.Float(0.0);
    });

    // TODO: implements @
    // TODO: implements complex
    // TODO: implements polar

    builder.addMethod("for", {
      args: "endValue; function"
    }, function($endValue, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.number$for(this, $endValue),
        $function
      );
      return this;
    });

    builder.addMethod("forBy", {
      args: "endValue; stepValue; function"
    }, function($endValue, $stepValue, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.number$forBy(this, $endValue, $stepValue),
        $function
      );
      return this;
    });

    builder.addMethod("forSeries", {
      args: "second; last; function"
    }, function($second, $last, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.number$forSeries(this, $second, $last),
        $function
      );
      return this;
    });
  });
});

// src/sc/classlib/Math/SimpleNumber.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var $int1 = $.int1;
  var random = sc.libs.random;
  var strlib = sc.libs.strlib;

  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  function prOpSimpleNumber(selector, func) {
    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 1:
      case 2:
        return $.Boolean(func(this._, $aNumber._));
      }

      if ($aNumber.isSequenceableCollection().__bool__()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $.Symbol(selector), this, $adverb
        );
      }

      return $.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(builder) {
    builder.addMethod("__newFrom__", $.Float);

    builder.addMethod("__bool__", function() {
      return this._ !== 0;
    });

    builder.addMethod("__dec__", function() {
      return this.__newFrom__(this._ - 1);
    });

    builder.addMethod("__inc__", function() {
      return this.__newFrom__(this._ + 1);
    });

    builder.addMethod("__int__", function() {
      if (!isFinite(this._)) {
        return this._;
      }
      return this._|0;
    });

    builder.addMethod("__num__", function() {
      return this._;
    });

    builder.addMethod("isValidUGenInput", function() {
      return $.Boolean(!isNaN(this._));
    });

    builder.addMethod("numChannels", function() {
      return $int1;
    });

    builder.addMethod("magnitude", function() {
      return this.abs();
    });

    builder.addMethod("angle", function() {
      return $.Float(this._ >= 0 ? 0 : Math.PI);
    });

    builder.addMethod("neg", function() {
      return this.__newFrom__(-this._);
    });

    // bitNot: implemented by subclass

    builder.addMethod("abs", function() {
      return this.__newFrom__(Math.abs(this._));
    });

    builder.addMethod("ceil", function() {
      return this.__newFrom__(Math.ceil(this._));
    });

    builder.addMethod("floor", function() {
      return this.__newFrom__(Math.floor(this._));
    });

    builder.addMethod("frac", function() {
      var a = this._;

      if (a < 0) {
        return this.__newFrom__(1 + (a - (a|0)));
      }
      return this.__newFrom__(a - (a|0));
    });

    builder.addMethod("sign", function() {
      var a = this._;
      return this.__newFrom__(
        a > 0 ? 1 : a === 0 ? 0 : -1
      );
    });

    builder.addMethod("squared", function() {
      return this.__newFrom__(this._ * this._);
    });

    builder.addMethod("cubed", function() {
      return this.__newFrom__(this._ * this._ * this._);
    });

    builder.addMethod("sqrt", function() {
      return $.Float(Math.sqrt(this._));
    });

    builder.addMethod("exp", function() {
      return $.Float(Math.exp(this._));
    });

    builder.addMethod("reciprocal", function() {
      return $.Float(1 / this._);
    });

    builder.addMethod("midicps", function() {
      return $.Float(
        440 * Math.pow(2, (this._ - 69) * 1 / 12)
      );
    });

    builder.addMethod("cpsmidi", function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1 / 440) * Math.LOG2E * 12 + 69
      );
    });

    builder.addMethod("midiratio", function() {
      return $.Float(
        Math.pow(2, this._ * 1 / 12)
      );
    });

    builder.addMethod("ratiomidi", function() {
      return $.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    });

    builder.addMethod("ampdb", function() {
      return $.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    });

    builder.addMethod("dbamp", function() {
      return $.Float(
        Math.pow(10, this._ * 0.05)
      );
    });

    builder.addMethod("octcps", function() {
      return $.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    });

    builder.addMethod("cpsoct", function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1 / 440) * Math.LOG2E + 4.75
      );
    });

    builder.addMethod("log", function() {
      return $.Float(Math.log(this._));
    });

    builder.addMethod("log2", function() {
      return $.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    });

    builder.addMethod("log10", function() {
      return $.Float(Math.log(this._) * Math.LOG10E);
    });

    builder.addMethod("sin", function() {
      return $.Float(Math.sin(this._));
    });

    builder.addMethod("cos", function() {
      return $.Float(Math.cos(this._));
    });

    builder.addMethod("tan", function() {
      return $.Float(Math.tan(this._));
    });

    builder.addMethod("asin", function() {
      return $.Float(Math.asin(this._));
    });

    builder.addMethod("acos", function() {
      return $.Float(Math.acos(this._));
    });

    builder.addMethod("atan", function() {
      return $.Float(Math.atan(this._));
    });

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    builder.addMethod("sinh", function() {
      return $.Float(_sinh(this._));
    });

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    builder.addMethod("cosh", function() {
      return $.Float(_cosh(this._));
    });

    builder.addMethod("tanh", function() {
      return $.Float(_sinh(this._) / _cosh(this._));
    });

    builder.addMethod("rand", function() {
      return this.__newFrom__(
        random.next() * this._
      );
    });

    builder.addMethod("rand2", function() {
      return this.__newFrom__(
        (random.next() * 2 - 1) * this._
      );
    });

    builder.addMethod("linrand", function() {
      return this.__newFrom__(
        Math.min(random.next(), random.next()) * this._
      );
    });

    builder.addMethod("bilinrand", function() {
      return this.__newFrom__(
        (random.next() - random.next()) * this._
      );
    });

    builder.addMethod("sum3rand", function() {
      return this.__newFrom__(
        (random.next() + random.next() + random.next() - 1.5) * 2 / 3 * this._
      );
    });

    builder.addMethod("distort", function() {
      return $.Float(
        this._ / (1 + Math.abs(this._))
      );
    });

    builder.addMethod("softclip", function() {
      var a = this._, abs = Math.abs(a);
      return $.Float(abs <= 0.5 ? a : (abs - 0.25) / a);
    });

    builder.addMethod("coin", function() {
      return $.Boolean(random.next() < this._);
    });

    builder.addMethod("isPositive", function() {
      return $.Boolean(this._ >= 0);
    });

    builder.addMethod("isNegative", function() {
      return $.Boolean(this._ < 0);
    });

    builder.addMethod("isStrictlyPositive", function() {
      return $.Boolean(this._ > 0);
    });

    builder.addMethod("isNaN", function() {
      return $.Boolean(isNaN(this._));
    });

    builder.addMethod("asBoolean", function() {
      return $.Boolean(this._ > 0);
    });

    builder.addMethod("booleanValue", function() {
      return $.Boolean(this._ > 0);
    });

    builder.addMethod("binaryValue", function() {
      return this._ > 0 ? $int1 : $int0;
    });

    builder.addMethod("rectWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(1);
    });

    builder.addMethod("hanWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    });

    builder.addMethod("welWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(Math.sin(a * Math.PI));
    });

    builder.addMethod("triWindow", function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      if (a < 0.5) {
        return $.Float(2 * a);
      }
      return $.Float(-2 * a + 2);
    });

    builder.addMethod("scurve", function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a * a * (3 - 2 * a));
    });

    builder.addMethod("ramp", function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a);
    });

    // +: implemented by subclass
    // -: implemented by subclass
    // *: implemented by subclass
    // /: implemented by subclass
    // mod: implemented by subclass
    // div: implemented by subclass
    // pow: implemented by subclass
    // min: implemented by subclass
    // max: implemented by subclass
    // bitAnd: implemented by subclass
    // bitOr : implemented by subclass
    // bitXor: implemented by subclass

    builder.addMethod("bitTest", function($bit) {
      return $.Boolean(
        this.bitAnd($int1.leftShift($bit)).__num__() !== 0
      );
    });

    // lcm     : implemented by subclass
    // gcd     : implemented by subclass
    // round   : implemented by subclass
    // roundUp : implemented by subclass
    // trunc   : implemented by subclass
    // atan2   : implemented by subclass
    // hypot   : implemented by subclass
    // hypotApx: implemented by subclass
    // leftShift         : implemented by subclass
    // rightShift        : implemented by subclass
    // unsignedRightShift: implemented by subclass
    // ring1 : implemented by subclass
    // ring2 : implemented by subclass
    // ring3 : implemented by subclass
    // ring4 : implemented by subclass
    // difsqr: implemented by subclass
    // sumsqr: implemented by subclass
    // sqrsum: implemented by subclass
    // sqrdif: implemented by subclass
    // absdif: implemented by subclass
    // thresh: implemented by subclass
    // amclip: implemented by subclass
    // clip2 : implemented by subclass
    // fold2 : implemented by subclass
    // wrap2 : implemented by subclass
    // excess: implemented by subclass
    // firstArg: implemented by subclass
    // rrand   : implemented by subclass
    // exprand : implemented by subclass

    builder.addMethod("==", function($aNumber) {
      return $.Boolean(this._ === $aNumber._);
    });

    builder.addMethod("!=", function($aNumber) {
      return $.Boolean(this._ !== $aNumber._);
    });

    builder.addMethod("<", prOpSimpleNumber("<", function(a, b) {
      return a < b;
    }));

    builder.addMethod(">", prOpSimpleNumber(">", function(a, b) {
      return a > b;
    }));

    builder.addMethod("<=", prOpSimpleNumber("<=", function(a, b) {
      return a <= b;
    }));

    builder.addMethod(">=", prOpSimpleNumber(">=", function(a, b) {
      return a >= b;
    }));

    builder.addMethod("equalWithPrecision", {
      args: "that; precision=0.0001"
    }, function($that, $precision) {
      return this.absdif($that) ["<"] ($precision);
    });

    builder.addMethod("asInteger", function() {
      return $.Integer(this._);
    });

    builder.addMethod("asFloat", function() {
      return $.Float(this._);
    });

    // TODO: implements asComplex
    // TODO: implements asRect

    builder.addMethod("degrad", function() {
      return $.Float(this._ * Math.PI / 180);
    });

    builder.addMethod("raddeg", function() {
      return $.Float(this._ * 180 / Math.PI);
    });

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector) {
      throw new Error(strlib.format("binary operator '#{0}' failed", $aSelector.__sym__()));
    });

    // TODO: implements performBinaryOpOnComplex

    builder.addMethod("performBinaryOpOnSignal", function($aSelector) {
      throw new Error(strlib.format("binary operator '#{0}' failed", $aSelector.__sym__()));
    });

    builder.addMethod("nextPowerOfTwo", function() {
      return $.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    });

    builder.addMethod("nextPowerOf", {
      args: "base"
    }, function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil()
      );
    });

    builder.addMethod("nextPowerOfThree", function() {
      return $.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    });

    builder.addMethod("previousPowerOf", {
      args: "base"
    }, function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil().__dec__()
      );
    });

    builder.addMethod("quantize", {
      args: "quantum=1.0; tolerance=0.05; strength=1.0"
    }, function($quantum, $tolerance, $strength) {
      var $round, $diff;

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength.$("*", [ $diff ]));
      }

      return this;
    });

    builder.addMethod("linlin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    });

    builder.addMethod("linexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    });

    builder.addMethod("explin", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    });

    builder.addMethod("expexp", {
      args: "inMin; inMax; outMin; outMax; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    });

    builder.addMethod("lincurve", {
      args: "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax"
    }, function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.__num__()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $outMax ["-"] ($outMin) ["/"] ($.Float(1.0) ["-"] ($grow));
          $b = $outMin ["+"] ($a);
          $scaled = (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin));

          $res = $b ["-"] ($a ["*"] ($grow.pow($scaled)));
        }
      }

      return $res;
    });

    builder.addMethod("curvelin", {
      args: "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax"
    },function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.__num__()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $inMax ["-"] ($inMin) ["/"] ($.Float(1.0) ["-"] ($grow));
          $b = $inMin ["+"] ($a);

          $res = ((($b ["-"] (this)) ["/"] ($a)).log()
                  ["*"] ($outMax ["-"] ($outMin)) ["/"] ($curve) ["+"] ($outMin));
        }
      }

      return $res;
    });

    builder.addMethod("bilin", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.linlin($inCenter, $inMax, $outCenter, $outMax, $.Symbol("none"));
        } else {
          $res = this.linlin($inMin, $inCenter, $outMin, $outCenter, $.Symbol("none"));
        }
      }

      return $res;
    });

    builder.addMethod("biexp", {
      args: "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax"
    }, function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = getClippedValue(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.explin($inCenter, $inMax, $outCenter, $outMax, $.Symbol("none"));
        } else {
          $res = this.explin($inMin, $inCenter, $outMin, $outCenter, $.Symbol("none"));
        }
      }

      return $res;
    });

    builder.addMethod("moddif", {
      args: "aNumber=0.0; mod=1.0"
    }, function($aNumber, $mod) {
      var $diff, $modhalf;

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod.$("*", [ $.Float(0.5) ]);

      return $modhalf.$("-", [ $diff.absdif($modhalf) ]);
    });

    builder.addMethod("lcurve", {
      args: "a=1.0; m=0.0; n=1.0; tau=1.0"
    }, function($a, $m, $n, $tau) {
      var $rTau, $x;

      $x = this.neg();

      if ($tau.__num__() === 1.0) {
        // a * (m * exp(x) + 1) / (n * exp(x) + 1)
        return $a.$("*", [
          $m.$("*", [ $x.exp() ]).__inc__()
        ]).$("/", [
          $n.$("*", [ $x.exp() ]).__inc__()
        ]);
      } else {
        $rTau = $tau.reciprocal();
        return $a.$("*", [
          $m.$("*", [ $x.exp() ]) ["*"] ($rTau).__inc__()
        ]).$("/", [
          $n.$("*", [ $x.exp() ]) ["*"] ($rTau).__inc__()
        ]);
      }
    });

    builder.addMethod("gauss", {
      args: "standardDeviation"
    }, function($standardDeviation) {
      // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($.Float(-2.0) ["*"] ($.Float(1.0).rand().log()).sqrt() ["*"] (
        $.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    });

    builder.addMethod("gaussCurve", {
      args: "a=1.0; b=0.0; c=1.0"
    }, function($a, $b, $c) {
      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a.$("*", [ ((
        (this ["-"] ($b).squared()) ["/"] ($.Float(-2.0) ["*"] ($c.$("squared")))
      ).exp()) ]);
    });

    // TODO: implements asPoint
    // TODO: implements asWarp

    builder.addMethod("wait", function() {
      return this.yield();
    });

    // TODO: implements waitUntil
    // TODO: implements sleep
    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("rate", function() {
      return $.Symbol("scalar");
    });

    builder.addMethod("asAudioRateInput", function() {
      if (this._ === 0) {
        return $("Silent").ar();
      }
      return $("DC").ar(this);
    });

    builder.addMethod("madd", {
      args: "mul; add"
    }, function($mul, $add) {
      return (this ["*"] ($mul)) ["+"] ($add);
    });

    builder.addMethod("lag");
    builder.addMethod("lag2");
    builder.addMethod("lag3");
    builder.addMethod("lagud");
    builder.addMethod("lag2ud");
    builder.addMethod("lag3ud");
    builder.addMethod("varlag");
    builder.addMethod("slew");

    // TODO: implements writeInputSpec

    builder.addMethod("series", {
      args: "second; last"
    }, function($second, $last) {
      var $step;
      var last, step, size;

      if ($second === $nil) {
        if (this.__num__() < $last.__num__()) {
          $second = this.__inc__();
        } else {
          $second = this.__dec__();
        }
      }
      $step = $second ["-"] (this);

      last = $last.__num__();
      step = $step.__num__();
      size = (Math.floor((last - this._) / step + 0.001)|0) + 1;

      return SCArray.series($.Integer(size), this, $step);
    });

    builder.addMethod("seriesIter", {
      args: "second; last"
    }, function($second, $last) {
      var first, second, last, step;
      var $newFrom = this.__newFrom__;

      first = this.__num__();
      if ($second === $nil) {
        last = ($last !== $nil) ? $last.__num__() : Infinity;
        step = first < last ? 1 : -1;
      } else {
        second = $second.__num__();
        last = ($last !== $nil) ? $last.__num__() : (
          $second < first ? -Infinity : Infinity
        );
        step = second - first;
      }
      return SCRoutine.new($.Function(function() {
        var val, $cond;
        $cond = $.Func(step < 0 ? function() {
          return $.Boolean(val >= last);
        } : function() {
          return $.Boolean(val <= last);
        });
        return [ function() {
          val = first;
          return $cond.while($.Func(function() {
            $newFrom(val).yield();
            val += step;
            return $nil;
          }));
        } ];
      }));
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      var $scaleDegree, $accidental;
      $scaleDegree = this.round($int1).asInteger();
      $accidental  = (this ["-"] ($scaleDegree)) ["*"] ($.Float(10.0));
      return $scale.performDegreeToKey($scaleDegree, $stepsPerOctave, $accidental);
    });

    builder.addMethod("keyToDegree", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return $scale.performKeyToDegree(this, $stepsPerOctave);
    });

    builder.addMethod("nearestInList", {
      args: "list"
    }, function($list) {
      return $list.performNearestInList(this);
    });

    builder.addMethod("nearestInScale", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return $scale.performNearestInScale(this, $stepsPerOctave);
    });

    builder.addMethod("partition", {
      args: "parts=2; min=1"
    }, function($parts, $min) {
      var $n = this ["-"] ($min.__dec__() ["*"] ($parts));
      return $int1.series(null, $n.__dec__()).scramble().keep($parts.__dec__())
        .sort().add($n).differentiate() ["+"] ($min.__dec__());
    });

    builder.addMethod("nextTimeOnGrid", {
      args: "clock"
    }, function($clock) {
      return $clock.nextTimeOnGrid(this, $int0);
    });

    builder.addMethod("playAndDelta");

    builder.addMethod("asQuant", function() {
      return $("Quant").new(this);
    });

    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    builder.addMethod("shallowCopy");
  });

  function getClippedValue($this, $inMin, $inMax, $outMin, $outMax, $clip) {
    switch ($clip.__sym__()) {
    case "minmax":
      if ($this <= $inMin) {
        return $outMin;
      }
      if ($this >= $inMax) {
        return $outMax;
      }
      break;
    case "min":
      if ($this <= $inMin) {
        return $outMin;
      }
      break;
    case "max":
      if ($this >= $inMax) {
        return $outMax;
      }
      break;
    }

    return null;
  }
});

// src/sc/classlib/Math/Integer.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil  = $.nil;
  var $int1 = $.int1;
  var mathlib = sc.libs.mathlib;
  var SCArray = $("Array");

  var bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 1:
        return type1(func(this._, $aNumber._));
      case 2:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol(selector), this, $adverb
      );
    };
  };

  sc.lang.klass.refine("Integer", function(builder) {
    builder.addMethod("__newFrom__", $.Integer);

    builder.addMethod("__int__", function() {
      return this._;
    });

    builder.addMethod("toString", function() {
      return String("" + this._);
    });

    builder.addClassMethod("new", function() {
      throw new Error("Integer.new is illegal, should use literal.");
    });

    builder.addMethod("isInteger", 3);

    builder.addMethod("hash", function() {
      return $.Float(this._).hash();
    });

    builder.addMethod("+", bop("+", $.Integer, $.Float));
    builder.addMethod("-", bop("-", $.Integer, $.Float));
    builder.addMethod("*", bop("*", $.Integer, $.Float));
    builder.addMethod("/", bop("/", $.Float, $.Float));
    builder.addMethod("mod", bop("mod", $.Integer, $.Float));
    builder.addMethod("div", bop("div", $.Integer, $.Integer));
    builder.addMethod("pow", bop("pow", $.Float, $.Float));
    builder.addMethod("min", bop("min", $.Integer, $.Float));
    builder.addMethod("max", bop("max", $.Integer, $.Float));
    builder.addMethod("bitAnd", bop("bitAnd", $.Integer, $.Float));
    builder.addMethod("bitOr", bop("bitOr", $.Integer, $.Float));
    builder.addMethod("bitXor", bop("bitXor", $.Integer, $.Float));
    builder.addMethod("lcm", bop("lcm", $.Integer, $.Float));
    builder.addMethod("gcd", bop("gcd", $.Integer, $.Float));
    builder.addMethod("round", bop("round", $.Integer, $.Float));
    builder.addMethod("roundUp", bop("roundUp", $.Integer, $.Float));
    builder.addMethod("trunc", bop("trunc", $.Integer, $.Float));
    builder.addMethod("atan2", bop("atan2", $.Float, $.Float));
    builder.addMethod("hypot", bop("hypot", $.Float, $.Float));
    builder.addMethod("hypotApx", bop("hypotApx", $.Float, $.Float));
    builder.addMethod("leftShift", bop("leftShift", $.Integer, $.Float));
    builder.addMethod("rightShift", bop("rightShift", $.Integer, $.Float));
    builder.addMethod("unsignedRightShift", bop("unsignedRightShift", $.Integer, $.Float));
    builder.addMethod("ring1", bop("ring1", $.Integer, $.Float));
    builder.addMethod("ring2", bop("ring2", $.Integer, $.Float));
    builder.addMethod("ring3", bop("ring3", $.Integer, $.Float));
    builder.addMethod("ring4", bop("ring4", $.Integer, $.Float));
    builder.addMethod("difsqr", bop("difsqr", $.Integer, $.Float));
    builder.addMethod("sumsqr", bop("sumsqr", $.Integer, $.Float));
    builder.addMethod("sqrsum", bop("sqrsum", $.Integer, $.Float));
    builder.addMethod("sqrdif", bop("sqrdif", $.Integer, $.Float));
    builder.addMethod("absdif", bop("absdif", $.Integer, $.Float));
    builder.addMethod("thresh", bop("thresh", $.Integer, $.Integer));
    builder.addMethod("amclip", bop("amclip", $.Integer, $.Float));
    builder.addMethod("scaleneg", bop("scaleneg", $.Integer, $.Float));
    builder.addMethod("clip2", bop("clip2", $.Integer, $.Float));
    builder.addMethod("fold2", bop("fold2", $.Integer, $.Float));
    builder.addMethod("excess", bop("excess", $.Integer, $.Float));
    builder.addMethod("firstArg", bop("firstArg", $.Integer, $.Integer));
    builder.addMethod("exprand", bop("exprand", $.Float, $.Float));

    builder.addMethod("wrap2", function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 1:
        return $.Integer(mathlib.iwrap(this._, -$aNumber._, $aNumber._));
      case 2:
        return $.Float(mathlib.wrap2(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol("wrap2"), this, $adverb
      );
    });

    builder.addMethod("rrand", function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 1:
        return $.Integer(Math.round(mathlib.rrand(this._, $aNumber._)));
      case 2:
        return $.Float(mathlib.rrand(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol("rrand"), this, $adverb
      );
    });

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _ClipInt -->
      if ($lo.__tag === 3) {
        return $lo;
      }
      if ($hi.__tag === 3) {
        return $hi;
      }
      if ($lo.__tag === 1 && $hi.__tag === 1) {
        return $.Integer(
          mathlib.clip(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    });

    builder.addMethod("wrap", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === 3) {
        return $lo;
      }
      if ($hi.__tag === 3) {
        return $hi;
      }
      if ($lo.__tag === 1 && $hi.__tag === 1) {
        return $.Integer(
          mathlib.iwrap(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    });

    builder.addMethod("fold", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _FoldInt -->
      if ($lo.__tag === 3) {
        return $lo;
      }
      if ($hi.__tag === 3) {
        return $hi;
      }
      if ($lo.__tag === 1 && $hi.__tag === 1) {
        return $.Integer(
          mathlib.ifold(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    });

    builder.addMethod("even", function() {
      return $.Boolean(!(this._ & 1));
    });

    builder.addMethod("odd", function() {
      return $.Boolean(!!(this._ & 1));
    });

    builder.addMethod("xrand", {
      args: "exclude=0"
    }, function($exclude) {
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int1)) ["%"] (this);
    });

    builder.addMethod("xrand2", {
      args: "exclude=0"
    }, function($exclude) {
      var raw, res;

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $.Integer(res);
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return $scale.performDegreeToKey(this, $stepsPerOctave);
    });

    builder.addMethod("do", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.integer$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("generate", function($function) {
      $function.value(this);
      return this;
    });

    builder.addMethod("collectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;
      var i, imax;

      if ($class === $nil) {
        $class = SCArray;
      }

      $res = $class.new(this);
      for (i = 0, imax = this._; i < imax; ++i) {
        $res.add($function.value($.Integer(i)));
      }

      return $res;
    });

    builder.addMethod("collect", function($function) {
      return this.collectAs($function, SCArray);
    });

    builder.addMethod("reverseDo", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.integer$reverseDo(this),
        $function
      );
      return this;
    });

    builder.addMethod("for", {
      args: "endval; function"
    }, function($endval, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.integer$for(this, $endval),
        $function
      );
      return this;
    });

    builder.addMethod("forBy", {
      args: "endval; stepval; function"
    }, function($endval, $stepval, $function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    });

    builder.addMethod("to", {
      args: "hi; step=1"
    }, function($hi, $step) {
      return $("Interval").new(this, $hi, $step);
    });

    builder.addMethod("asAscii", function() {
      // <-- _AsAscii -->
      return $.Char(String.fromCharCode(this._|0));
    });

    builder.addMethod("asUnicode");

    builder.addMethod("asDigit", function() {
      var c;

      // <!-- _AsAscii -->
      c = this._;
      if (0 <= c && c <= 9) {
        return $.Char(String(c));
      }
      if (10 <= c && c <= 35) {
        return $.Char(String.fromCharCode(c + 55));
      }

      throw new Error("Integer: asDigit must be 0 <= this <= 35");
    });

    builder.addMethod("asBinaryDigits", {
      args: "numDigits=8"
    }, function($numDigits) {
      var raw, array, numDigits, i;

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($.Integer((raw >> i) & 1));
      }

      return $.Array(array);
    });

    builder.addMethod("asDigits", {
      args: "base=10; numDigits"
    }, function($base, $numDigits) {
      var $num;
      var array, numDigits, i;

      $num = this;
      if ($numDigits === $nil) {
        $numDigits = (
          this.log() ["/"] ($base.log() ["+"] ($.Float(1e-10)))
        ).asInteger().__inc__();
      }

      array = [];
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($num ["%"] ($base));
        $num = $num.div($base);
      }

      return $.Array(array);
    });

    // TODO: implements nextPowerOfTwo
    // TODO: implements isPowerOfTwo
    // TODO: implements leadingZeroes
    // TODO: implements trailingZeroes
    // TODO: implements numBits
    // TODO: implements log2Ceil
    // TODO: implements grayCode
    // TODO: implements setBit
    // TODO: implements nthPrime
    // TODO: implements prevPrime
    // TODO: implements nextPrime
    // TODO: implements indexOfPrime
    // TODO: implements isPrime
    // TODO: implements exit
    // TODO: implements asStringToBase
    // TODO: implements asBinaryString
    // TODO: implements asHexString
    // TODO: implements asIPString
    // TODO: implements archiveAsCompileString

    builder.addMethod("geom", {
      args: "start; grow"
    }, function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    });

    builder.addMethod("fib", {
      args: "a=0.0; b=1.0"
    }, function($a, $b) {
      return SCArray.fib(this, $a, $b);
    });

    // TODO: implements factors
    // TODO: implements pidRunning
    // TODO: implements factorial
    // TODO: implements isCaps
    // TODO: implements isShift
    // TODO: implements isCtrl
    // TODO: implements isAlt
    // TODO: implements isCmd
    // TODO: implements isNumPad
    // TODO: implements isHelp
    // TODO: implements isFun

    builder.addMethod("bitNot", function() {
      return $.Integer(~this._);
    });
  });
});

// src/sc/classlib/Math/Float.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var mathlib = sc.libs.mathlib;

  var bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 1:
        return type1(func(this._, $aNumber._));
      case 2:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol(selector), this, $adverb
      );
    };
  };

  sc.lang.klass.refine("Float", function(builder) {
    builder.addMethod("toString", function() {
      var raw = this._;

      if (raw === Infinity) {
        return "inf";
      }
      if (raw === -Infinity) {
        return "-inf";
      }
      if (isNaN(raw)) {
        return "nan";
      }

      return String(this._);
    });

    builder.addClassMethod("new", function() {
      throw new Error("Float.new is illegal, should use literal.");
    });

    builder.addMethod("isFloat", 3);
    builder.addMethod("asFloat");

    builder.addMethod("+", bop("+", $.Float, $.Float));
    builder.addMethod("-", bop("-", $.Float, $.Float));
    builder.addMethod("*", bop("*", $.Float, $.Float));
    builder.addMethod("/", bop("/", $.Float, $.Float));
    builder.addMethod("mod", bop("mod", $.Float, $.Float));
    builder.addMethod("div", bop("div", $.Integer, $.Integer));
    builder.addMethod("pow", bop("pow", $.Float, $.Float));
    builder.addMethod("min", bop("min", $.Float, $.Float));
    builder.addMethod("max", bop("max", $.Float, $.Float));
    builder.addMethod("bitAnd", bop("bitAnd", $.Float, $.Float));
    builder.addMethod("bitOr", bop("bitOr", $.Float, $.Float));
    builder.addMethod("bitXor", bop("bitXor", $.Float, $.Float));
    builder.addMethod("lcm", bop("lcm", $.Float, $.Float));
    builder.addMethod("gcd", bop("gcd", $.Float, $.Float));
    builder.addMethod("round", bop("round", $.Float, $.Float));
    builder.addMethod("roundUp", bop("roundUp", $.Float, $.Float));
    builder.addMethod("trunc", bop("trunc", $.Float, $.Float));
    builder.addMethod("atan2", bop("atan2", $.Float, $.Float));
    builder.addMethod("hypot", bop("hypot", $.Float, $.Float));
    builder.addMethod("hypotApx", bop("hypotApx", $.Float, $.Float));
    builder.addMethod("leftShift", bop("leftShift", $.Float, $.Float));
    builder.addMethod("rightShift", bop("rightShift", $.Float, $.Float));
    builder.addMethod("unsignedRightShift", bop("unsignedRightShift", $.Float, $.Float));
    builder.addMethod("ring1", bop("ring1", $.Float, $.Float));
    builder.addMethod("ring2", bop("ring2", $.Float, $.Float));
    builder.addMethod("ring3", bop("ring3", $.Float, $.Float));
    builder.addMethod("ring4", bop("ring4", $.Float, $.Float));
    builder.addMethod("difsqr", bop("difsqr", $.Float, $.Float));
    builder.addMethod("sumsqr", bop("sumsqr", $.Float, $.Float));
    builder.addMethod("sqrsum", bop("sqrsum", $.Float, $.Float));
    builder.addMethod("sqrdif", bop("sqrdif", $.Float, $.Float));
    builder.addMethod("absdif", bop("absdif", $.Float, $.Float));
    builder.addMethod("thresh", bop("thresh", $.Float, $.Float));
    builder.addMethod("amclip", bop("amclip", $.Float, $.Float));
    builder.addMethod("scaleneg", bop("scaleneg", $.Float, $.Float));
    builder.addMethod("clip2", bop("clip2", $.Float, $.Float));
    builder.addMethod("fold2", bop("fold2", $.Float, $.Float));
    builder.addMethod("wrap2", bop("wrap2", $.Float, $.Float));
    builder.addMethod("excess", bop("excess", $.Float, $.Float));
    builder.addMethod("firstArg", bop("firstArg", $.Float, $.Float));
    builder.addMethod("rrand", bop("rrand", $.Float, $.Float));
    builder.addMethod("exprand", bop("exprand", $.Float, $.Float));

    builder.addMethod("clip", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _ClipFloat -->
      if ($lo.__tag === 3) {
        return $lo;
      }
      if ($hi.__tag === 3) {
        return $hi;
      }

      return $.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    });

    builder.addMethod("wrap", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === 3) {
        return $lo;
      }
      if ($hi.__tag === 3) {
        return $hi;
      }

      return $.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    });

    builder.addMethod("fold", {
      args: "lo; hi"
    }, function($lo, $hi) {
      // <-- _FoldFloat -->
      if ($lo.__tag === 3) {
        return $lo;
      }
      if ($hi.__tag === 3) {
        return $hi;
      }

      return $.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    });

    // TODO: implements coin
    // TODO: implements xrand2

    builder.addMethod("as32Bits", function() {
      // <-- _As32Bits -->
      return $.Integer(
        new Int32Array(
          new Float32Array([ this._ ]).buffer
        )[0]
      );
    });

    builder.addMethod("high32Bits", function() {
      // <-- _High32Bits -->
      return $.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[1]
      );
    });

    builder.addMethod("low32Bits", function() {
      // <-- _Low32Bits -->
      return $.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[0]
      );
    });

    builder.addClassMethod("from32Bits", {
      args: "word"
    }, function($word) {
      // <-- _From32Bits -->
      return $.Float(
        new Float32Array(
          new Int32Array([ $word.__num__() ]).buffer
        )[0]
      );
    });

    builder.addClassMethod("from64Bits", {
      args: "hiWord; loWord"
    }, function($hiWord, $loWord) {
      // <-- _From64Bits -->
      return $.Float(
        new Float64Array(
          new Int32Array([ $loWord.__num__(), $hiWord.__num__() ]).buffer
        )[0]
      );
    });

    builder.addMethod("do", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.float$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("reverseDo", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.float$reverseDo(this),
        $function
      );
      return this;
    });

    // TODO: implements asStringPrec
    // TODO: implements archiveAsCompileString
    // TODO: implements storeOn
    // TODO: implements switch

    builder.addMethod("bitNot",function() {
      var f64 = new Float64Array([ this._ ]);
      var i32 = new Int32Array(f64.buffer);
      i32[0] = ~i32[0];
      return $.Float(f64[0]);
    });
  });
});

// src/sc/classlib/Core/Thread.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;
  var random = sc.libs.random;

  sc.lang.klass.refine("Thread", function(builder) {
    builder.addProperty("<", "parent");

    builder.addClassMethod("new", {
      args: "func"
    }, function($func) {
      return init(this.__super__("new"), $func);
    });

    function init($this, $func) {
      if ($func.__tag !== 8) {
        throw new Error("Thread.init failed");
      }
      $this._bytecode = $func._bytecode.setOwner($this);
      $this._state    = 0;
      $this._parent   = null;
      $this._randgen  = new random.RandGen((Math.random() * 4294967295) >>> 0);
      return $this;
    }

    builder.addMethod("state", function() {
      return $.Integer(this._state);
    });

    // TODO: implements primitiveError
    // TODO: implements primitiveIndex
    // TODO: implements beats
    // TODO: implements beats_
    // TODO: implements seconds
    // TODO: implements seconds_
    // TODO: implements clock
    // TODO: implements clock_
    // TODO: implements nextBeat
    // TODO: implements endBeat
    // TODO: implements endBeat_
    // TODO: implements endValue
    // TODO: implements endValue_
    // TODO: implements exceptionHandler
    // TODO: implements exceptionHandler_
    // TODO: implements threadPlayer_
    // TODO: implements executingPath
    // TODO: implements oldExecutingPath
    // TODO: implements init

    builder.addMethod("copy");

    // TODO: implements isPlaying
    // TODO: implements threadPlayer
    // TODO: implements findThreadPlayer

    builder.addMethod("randSeed_", {
      args: "seed"
    }, function($seed) {
      this._randgen.setSeed($seed.__int__() >>> 0);
      return this;
    });

    builder.addMethod("randData_", {
      args: "data"
    }, function($data) {
      this._randgen.x = $data.at($.Integer(0)).__int__();
      this._randgen.y = $data.at($.Integer(1)).__int__();
      this._randgen.z = $data.at($.Integer(2)).__int__();
      return this;
    });

    builder.addMethod("randData", function() {
      return $("Int32Array").newFrom($.Array([
        $.Integer(this._randgen.x),
        $.Integer(this._randgen.y),
        $.Integer(this._randgen.z),
      ]));
    });

    // TODO: implements failedPrimitiveName
    // TODO: implements handleError

    builder.addMethod("next");
    builder.addMethod("value");
    builder.addMethod("valueArray");
    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  sc.lang.klass.refine("Routine", function(builder) {
    builder.addClassMethod("new", function($func) {
      return this.__super__("new", [ $func ]);
    });

    // TODO: implements $run

    var routine$resume = function($inval) {
      if (this._state === 6) {
        return this._$doneValue || $nil;
      }

      this._parent = sc.lang.main.getCurrentThread();
      sc.lang.main.setCurrentThread(this);

      this._state = 3;
      this._bytecode.runAsRoutine([ $inval || $nil ]);
      this._state = this._bytecode.state;

      if (this._state === 6) {
        this._$doneValue = this._bytecode.result;
      }

      sc.lang.main.setCurrentThread(this._parent);
      this._parent = null;

      return this._bytecode.result || $nil;
    };

    builder.addMethod("next", routine$resume);
    builder.addMethod("value", routine$resume);
    builder.addMethod("resume", routine$resume);
    builder.addMethod("run", routine$resume);
    builder.addMethod("valueArray", routine$resume);

    builder.addMethod("reset", function() {
      this._state = 0;
      this._bytecode.reset();
      return this;
    });
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });
});

// src/sc/classlib/Core/Symbol.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Symbol", function(builder) {
    builder.addMethod("__sym__", function() {
      return this._;
    });

    builder.addMethod("__str__", function() {
      return this._;
    });

    builder.addClassMethod("new", function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    });

    builder.addMethod("asSymbol");

    builder.addMethod("asInteger", function() {
      var m = /^[-+]?\d+/.exec(this._);
      return $.Integer(m ? m[0]|0 : 0);
    });

    builder.addMethod("asFloat", function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this._);
      return $.Float(m ? +m[0] : 0);
    });

    builder.addMethod("ascii", function() {
      return this.asString().ascii();
    });

    // TODO: implements asCompileString

    builder.addMethod("asClass", function() {
      if (sc.lang.klass.exists(this._)) {
        return sc.lang.klass.get(this._);
      }
      return $nil;
    });

    builder.addMethod("asSetter", function() {
      var matches = /^([a-z]\w{0,255}?)_?$/.exec(this._);
      if (matches) {
        return $.Symbol(matches[1] + "_");
      }
      throw new Error("Cannot convert class names or primitive names to setters.");
    });

    builder.addMethod("asGetter", function() {
      return $.Symbol(this._.replace(/_$/, ""));
    });

    builder.addMethod("asSpec", function() {
      return $("Spec").specs().at(this);
    });

    builder.addMethod("asWarp", function($spec) {
      return $("Warp").warps().at(this).new($spec);
    });

    builder.addMethod("asTuning", function() {
      return $("Tuning").at(this);
    });

    builder.addMethod("asScale", function() {
      return $("Scale").at(this);
    });

    builder.addMethod("isSetter", function() {
      return $.Boolean(/^[a-z]\w*_$/.test(this._));
    });

    builder.addMethod("isClassName", function() {
      return $.Boolean(/^[A-Z]\w*$/.test(this._));
    });

    builder.addMethod("isMetaClassName", function() {
      return $.Boolean(/^Meta_[A-Z]\w*$/.test(this._));
    });

    builder.addMethod("isPrefix", {
      args: "other"
    }, function($other) {
      if ($other.__tag === 3) {
        return $.Boolean(this._.indexOf($other._) === 0);
      }
      return this;
    });

    builder.addMethod("isPrimitiveName", function() {
      return $.Boolean(this._.charAt(0) === "_");
    });

    builder.addMethod("isPrimitive", 4);

    builder.addMethod("isMap", function() {
      return $.Boolean(/^[ac]\d/.test(this._));
    });

    builder.addMethod("isRest", function() {
      return $.Boolean(!/^[ac]\d/.test(this._));
    });

    builder.addMethod("envirGet", function() {
      return $.Environment(this._);
    });

    builder.addMethod("envirPut", function($aValue) {
      $aValue = $aValue || /* istanbul ignore next */ $nil;
      return $.Environment(this._, $aValue);
    });

    builder.addMethod("blend");

    builder.addMethod("++", {
      args: "aString"
    }, function($aString) {
      return $.String(this._ + $aString.__str__(), true);
    });

    builder.addMethod("asBinOpString", function() {
      if (/^[a-z]\w*$/.exec(this._)) {
        return $.String(this._ + ":", true);
      }
      return this;
    });

    builder.addMethod("applyTo", {
      args: "firstArg; *args"
    }, function($firstArg, $$args) {
      return $firstArg.perform.apply($firstArg, [ this ].concat($$args._));
    });

    builder.addMethod("performBinaryOpOnSomething");
    builder.addMethod("neg");
    builder.addMethod("bitNot");
    builder.addMethod("abs");
    builder.addMethod("ceil");
    builder.addMethod("floor");
    builder.addMethod("frac");
    builder.addMethod("sign");
    builder.addMethod("sqrt");
    builder.addMethod("exp");
    builder.addMethod("midicps");
    builder.addMethod("cpsmidi");
    builder.addMethod("midiratio");
    builder.addMethod("ratiomidi");
    builder.addMethod("ampdb");
    builder.addMethod("dbamp");
    builder.addMethod("octcps");
    builder.addMethod("cpsoct");
    builder.addMethod("log");
    builder.addMethod("log2");
    builder.addMethod("log10");
    builder.addMethod("sin");
    builder.addMethod("cos");
    builder.addMethod("tan");
    builder.addMethod("asin");
    builder.addMethod("acos");
    builder.addMethod("atan");
    builder.addMethod("sinh");
    builder.addMethod("cosh");
    builder.addMethod("tanh");
    builder.addMethod("rand");
    builder.addMethod("rand2");
    builder.addMethod("linrand");
    builder.addMethod("bilinrand");
    builder.addMethod("sum3rand");
    builder.addMethod("distort");
    builder.addMethod("softclip");
    builder.addMethod("coin");
    builder.addMethod("even");
    builder.addMethod("odd");
    builder.addMethod("rectWindow");
    builder.addMethod("hanWindow");
    builder.addMethod("welWindow");
    builder.addMethod("triWindow");
    builder.addMethod("scurve");
    builder.addMethod("ramp");
    builder.addMethod("+");
    builder.addMethod("-");
    builder.addMethod("*");
    builder.addMethod("/");
    builder.addMethod("mod");
    builder.addMethod("min");
    builder.addMethod("max");
    builder.addMethod("bitAnd");
    builder.addMethod("bitOr");
    builder.addMethod("bitXor");
    builder.addMethod("bitHammingDistance");
    // TODO: Implements hammingDistance
    builder.addMethod("lcm");
    builder.addMethod("gcd");
    builder.addMethod("round");
    builder.addMethod("roundUp");
    builder.addMethod("trunc");
    builder.addMethod("atan2");
    builder.addMethod("hypot");
    builder.addMethod("hypotApx");
    builder.addMethod("pow");
    builder.addMethod("leftShift");
    builder.addMethod("rightShift");
    builder.addMethod("unsignedRightShift");
    builder.addMethod("rrand");
    builder.addMethod("exprand");

    builder.addMethod("<", function($aNumber) {
      return $.Boolean($aNumber.__tag === 3 && this._ < $aNumber._);
    });

    builder.addMethod(">", function($aNumber) {
      return $.Boolean($aNumber.__tag === 3 && this._ > $aNumber._);
    });

    builder.addMethod("<=", function($aNumber) {
      return $.Boolean($aNumber.__tag === 3 && this._ <= $aNumber._);
    });

    builder.addMethod(">=", function($aNumber) {
      return $.Boolean($aNumber.__tag === 3 && this._ >= $aNumber._);
    });

    builder.addMethod("degreeToKey");
    builder.addMethod("degrad");
    builder.addMethod("raddeg");
    builder.addMethod("doNumberOp");
    builder.addMethod("doComplexOp");
    builder.addMethod("doSignalOp");

    builder.addMethod("doListOp", {
      args: "aSelector; aList"
    }, function($aSelector, $aList) {
      var $this = this;
      $aList.do($.Func(function($item) {
        return $item.perform($aSelector, $this);
      }));
      return this;
    });

    // TODO: Implements primitiveIndex
    // TODO: Implements specialIndex
    // TODO: Implements printOn
    // TODO: Implements storeOn
    // TODO: Implements codegen_UGenCtorArg

    builder.addMethod("archiveAsCompileString", 3);

    // TODO: Implements kr
    // TODO: Implements ir
    // TODO: Implements tr
    // TODO: Implements ar
    // TODO: Implements matchOSCAddressPattern
    // TODO: Implements help

    builder.addMethod("asString", function() {
      return $.String(this._);
    });

    builder.addMethod("shallowCopy");

    builder.addMethod("performBinaryOpOnSimpleNumber");
  });
});

// src/sc/classlib/Core/Ref.js
SCScript.install(function(sc) {

  sc.lang.klass.refine("Ref", function(builder) {
    builder.addProperty("<>", "value");

    builder.addClassMethod("new", function($thing) {
      return this.__super__("new").value_($thing);
    });

    builder.addMethod("valueOf", function() {
      return this._$value.valueOf();
    });

    // $new

    builder.addMethod("set", {
      args: "thing"
    }, function($thing) {
      this._$value = $thing;
      return this;
    });

    builder.addMethod("get", function() {
      return this._$value;
    });

    builder.addMethod("dereference", function() {
      return this.value();
    });

    builder.addMethod("asRef");

    builder.addMethod("valueArray", function() {
      return this.value();
    });

    builder.addMethod("valueEnvir", function() {
      return this.value();
    });

    builder.addMethod("valueArrayEnvir", function() {
      return this.value();
    });

    builder.addMethod("next", function() {
      return this.value();
    });

    builder.addMethod("asUGenInput");

    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("at", function($key) {
      return this._$value.at($key);
    });

    builder.addMethod("put", function($key, $val) {
      return this._$value.put($key, $val);
    });
    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });
});

// src/sc/classlib/Core/Nil.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Nil", function(builder, _) {
    builder.addMethod("__num__", function() {
      return 0;
    });

    builder.addMethod("__bool__", function() {
      return false;
    });

    builder.addMethod("__sym__", function() {
      return "nil";
    });

    builder.addMethod("toString", function() {
      return "nil";
    });

    builder.addClassMethod("new", function() {
      throw new Error("Nil.new is illegal, should use literal.");
    });

    builder.addMethod("isNil", 3);
    builder.addMethod("notNil", 4);

    builder.addMethod("?", function($obj) {
      return $obj;
    });

    builder.addMethod("??", function($obj) {
      return $obj.value();
    });

    builder.addMethod("!?");

    builder.addMethod("asBoolean", 4);
    builder.addMethod("booleanValue", 4);

    builder.addMethod("push", {
      args: "function"
    }, function($function) {
      return $function.value();
    });

    builder.addMethod("appendStream", {
      args: "stream"
    }, function($stream) {
      return $stream;
    });

    builder.addMethod("pop");
    builder.addMethod("source");
    builder.addMethod("source_");

    builder.addMethod("rate");
    builder.addMethod("numChannels");
    builder.addMethod("isPlaying", 4);

    builder.addMethod("do");
    builder.addMethod("reverseDo");
    builder.addMethod("pairsDo");
    builder.addMethod("collect");
    builder.addMethod("select");
    builder.addMethod("reject");
    builder.addMethod("detect");
    builder.addMethod("collectAs");
    builder.addMethod("selectAs");
    builder.addMethod("rejectAs");

    builder.addMethod("dependants", function() {
      return $("IdentitySet").new();
    });

    builder.addMethod("changed");
    builder.addMethod("addDependant");
    builder.addMethod("removeDependant");
    builder.addMethod("release");
    builder.addMethod("update");

    builder.addMethod("transformEvent", {
      args: "event"
    }, function($event) {
      return $event;
    });

    builder.addMethod("awake");

    builder.addMethod("play");

    builder.addMethod("nextTimeOnGrid", {
      args: "clock"
    }, function($clock) {
      if ($clock === $nil) {
        return $clock;
      }
      return $.Func(function() {
        return $clock.$("nextTimeOnGrid");
      });
    });

    builder.addMethod("asQuant", function() {
      return $("Quant").default();
    });

    builder.addMethod("swapThisGroup");
    builder.addMethod("performMsg");

    builder.addMethod("printOn", {
      args: "stream"
    }, function($stream) {
      $stream.putAll($.String("nil"));
      return this;
    });

    builder.addMethod("storeOn", {
      args: "stream"
    }, function($stream) {
      $stream.putAll($.String("nil"));
      return this;
    });

    builder.addMethod("matchItem", 3);

    builder.addMethod("add", {
      args: "value"
    }, function($value) {
      return $.Array([ $value ]);
    });

    builder.addMethod("addAll", {
      args: "array"
    }, function($array) {
      return $array.asArray();
    });

    builder.addMethod("++", function($array) {
      return $array.asArray();
    });

    builder.addMethod("asCollection", function() {
      return $.Array();
    });

    builder.addMethod("remove");

    builder.addMethod("set");

    builder.addMethod("get", {
      args: "prevVal"
    }, function($prevVal) {
      return $prevVal;
    });

    builder.addMethod("addFunc", function() {
      var functions = _.toArray(arguments);
      if (functions.length <= 1) {
        return functions[0];
      }
      return $("FunctionList").new($.Array(functions));
    });

    builder.addMethod("removeFunc");

    builder.addMethod("replaceFunc");
    builder.addMethod("seconds_");
    builder.addMethod("throw");

    // TODO: implements handleError

    builder.addMethod("archiveAsCompileString", 3);

    builder.addMethod("asSpec", function() {
      return $("ControlSpec").new();
    });

    builder.addMethod("superclassesDo");
    builder.addMethod("shallowCopy");
  });
});

// src/sc/classlib/Core/Kernel.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Class", function(builder) {
    builder.addMethod("toString", function() {
      return String(this.__className);
    });

    builder.addMethod("class", function() {
      if (this.__isMetaClass) {
        return $("Class");
      }
      return $("Meta_" + this.__className);
    });

    builder.addMethod("name", function() {
      return $.String(this.__className);
    });

    // TODO: implements superclass
    // TODO: implements asClass
    // TODO: implements initClass
    // TODO: implements $initClassTree
    // TODO: implements $allClasses
    // TODO: implements findMethod
    // TODO: implements findRespondingMethodFor
    // TODO: implements findOverriddenMethod
    // TODO: implements superclassesDo
    // TODO: implements while
    // TODO: implements dumpByteCodes
    // TODO: implements dumpClassSubtree
    // TODO: implements dumpInterface
    // TODO: implements asString
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements hasHelpFile
    // TODO: implements helpFilePath
    // TODO: implements help
    // TODO: implements openHelpFile
    // TODO: implements shallowCopy
    // TODO: implements openCodeFile
    // TODO: implements classVars
    // TODO: implements inspectorClass
    // TODO: implements findReferences
    // TODO: implements $findAllReferences
    // TODO: implements allSubclasses
    // TODO: implements superclasses

    builder.addMethod("[]", function($anArray) {
      var $newCollection;
      var array, i, imax;

      $newCollection = this.new($anArray.size());

      array = $anArray._;
      for (i = 0, imax = array.length; i < imax; ++i) {
        $newCollection.$("add", [ array[i] ]);
      }

      return $newCollection;
    });
  });

  sc.lang.klass.define("Process", function(builder) {
    builder.addMethod("__init__", function() {
      this.__super__("__init__");
      this._$interpreter = $nil;
      this._$mainThread  = $nil;
    });

    builder.addMethod("interpreter", function() {
      return this._$interpreter;
    });

    builder.addMethod("mainThread", function() {
      return this._$mainThread;
    });
  });

  sc.lang.klass.define("Main : Process");

  sc.lang.klass.define("Interpreter", function(builder) {
    builder.addProperty("<>", "a");
    builder.addProperty("<>", "b");
    builder.addProperty("<>", "c");
    builder.addProperty("<>", "d");
    builder.addProperty("<>", "e");
    builder.addProperty("<>", "f");
    builder.addProperty("<>", "g");
    builder.addProperty("<>", "h");
    builder.addProperty("<>", "i");
    builder.addProperty("<>", "j");
    builder.addProperty("<>", "k");
    builder.addProperty("<>", "l");
    builder.addProperty("<>", "m");
    builder.addProperty("<>", "n");
    builder.addProperty("<>", "o");
    builder.addProperty("<>", "p");
    builder.addProperty("<>", "q");
    builder.addProperty("<>", "r");
    builder.addProperty("<>", "s");
    builder.addProperty("<>", "t");
    builder.addProperty("<>", "u");
    builder.addProperty("<>", "v");
    builder.addProperty("<>", "w");
    builder.addProperty("<>", "x");
    builder.addProperty("<>", "y");
    builder.addProperty("<>", "z");

    builder.addMethod("__init__", function() {
      this.__super__("__init__");
    });

    builder.addMethod("clearAll", function() {
      for (var i = 97; i <= 122; i++) {
        this["_$" + String.fromCharCode(i)] = null;
      }
      return this;
    });
  });
});

// src/sc/classlib/Core/Function.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;
  var SCArray = $("Array");
  var SCRoutine = $("Routine");

  sc.lang.klass.refine("Function", function(builder, _) {
    // TODO: implements def
    builder.addClassMethod("new", function() {
      throw new Error("Function.new is illegal, should use literal.");
    });

    builder.addMethod("isFunction", 3);

    // TODO: implements isClosed

    builder.addMethod("archiveAsCompileString", 3);
    builder.addMethod("archiveAsObject", 3);

    // TODO: implements checkCanArchive

    builder.addMethod("shallowCopy");

    var function$run = function(bytecode, args) {
      return bytecode.reset().run(args);
    };

    builder.addMethod("choose", function() {
      return this.value();
    });

    builder.addMethod("update", function() {
      return function$run(this._bytecode, arguments);
    });

    builder.addMethod("value", function() {
      return function$run(this._bytecode, arguments);
    });

    builder.addMethod("valueArray", function($args) {
      return function$run(this._bytecode, $args.asArray()._);
    });

    var envir = function(func, args) {
      return func._argNames.map(function(name, i) {
        var val;
        if (this[i]) {
          return this[i];
        }
        val = $.Environment(name);
        if (val !== $nil) {
          return val;
        }
      }, args);
    };

    builder.addMethod("valueEnvir", function() {
      return function$run(this._bytecode, envir(this._bytecode, arguments));
    });

    builder.addMethod("valueArrayEnvir", function($args) {
      return function$run(this._bytecode, envir(this._bytecode, $args.asArray()._));
    });

    builder.addMethod("functionPerformList", {
      args: "selector; arglist"
    }, function($selector, $arglist) {
      return this[$selector.__str__()].apply(this, $arglist.asArray()._);
    });

    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs

    builder.addMethod("loop", function() {
      sc.lang.iterator.execute(
        sc.lang.iterator.function$loop(),
        this
      );
      return this;
    });

    // TODO: implements block

    builder.addMethod("asRoutine", function() {
      return SCRoutine.new(this);
    });

    builder.addMethod("dup", {
      args: "n=2"
    }, function($n) {
      return SCArray.fill($n, this);
    });

    // TODO: implements sum
    // TODO: implements defer
    // TODO: implements thunk
    // TODO: implements transformEvent
    // TODO: implements set
    // TODO: implements get
    // TODO: implements fork
    // TODO: implements forkIfNeeded
    // TODO: implements awake
    // TODO: implements cmdPeriod
    // TODO: implements bench

    builder.addMethod("protect", function($handler) {
      var result;
      var current = sc.lang.bytecode.getCurrent();

      try {
        result = this.value();
      } catch (e) {
        result = null;
      }
      sc.lang.bytecode.setCurrent(current);

      $handler.value();

      return result || $nil;
    });

    // TODO: implements try
    // TODO: implements prTry

    // TODO: implements handleError

    builder.addMethod("case", function() {
      var args, i, imax;

      args = _.toArray(arguments);
      args.unshift(this);

      for (i = 0, imax = args.length >> 1; i < imax; ++i) {
        if (args[i * 2].value().__bool__()) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    });

    builder.addMethod("r", function() {
      return SCRoutine.new(this);
    });

    builder.addMethod("p", function() {
      return $("Prout").new(this);
    });

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    builder.addMethod("flop", function() {
      var $this = this;

      return $.Func(function() {
        var $$args = $.Array(_.toArray(arguments));
        return $$args.flop().collect($.Func(function($_) {
          return $this.valueArray($_);
        }));
      });
    });

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    builder.addMethod("while", {
      args: "body"
    }, function($body) {
      sc.lang.iterator.execute(
        sc.lang.iterator.function$while(this),
        $body
      );
      return this;
    });
  });
});

// src/sc/classlib/Core/Char.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;

  sc.lang.klass.refine("Char", function(builder) {
    builder.addMethod("__str__", function() {
      return this._;
    });

    builder.addClassMethod("nl", function() {
      return $.Char("\n");
    });

    builder.addClassMethod("ff", function() {
      return $.Char("\f");
    });

    builder.addClassMethod("tab", function() {
      return $.Char("\t");
    });

    builder.addClassMethod("space", function() {
      return $.Char(" ");
    });

    builder.addClassMethod("comma", function() {
      return $.Char(",");
    });

    builder.addClassMethod("new", function() {
      throw new Error("Char.new is illegal, should use literal.");
    });

    // TODO: implements hash

    builder.addMethod("ascii", function() {
      return $.Integer(this._.charCodeAt(0));
    });

    builder.addMethod("digit", function() {
      var ascii = this._.charCodeAt(0);
      if (0x30 <= ascii && ascii <= 0x39) {
        return $.Integer(ascii - 0x30);
      }
      if (0x41 <= ascii && ascii <= 0x5a) {
        return $.Integer(ascii - 0x37);
      }
      if (0x61 <= ascii && ascii <= 0x7a) {
        return $.Integer(ascii - 0x57);
      }
      throw new Error("digitValue failed");
    });

    builder.addMethod("asAscii");

    builder.addMethod("asUnicode", function() {
      return this.ascii();
    });

    builder.addMethod("toUpper", function() {
      return $.Char(this._.toUpperCase());
    });

    builder.addMethod("toLower", function() {
      return $.Char(this._.toLowerCase());
    });

    builder.addMethod("isAlpha", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    });

    builder.addMethod("isAlphaNum", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39) ||
                         (0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    });

    builder.addMethod("isPrint", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e));
    });

    builder.addMethod("isPunct", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x21 <= ascii && ascii <= 0x2f) ||
                         (0x3a <= ascii && ascii <= 0x40) ||
                         (0x5b <= ascii && ascii <= 0x60) ||
                         (0x7b <= ascii && ascii <= 0x7e));
    });

    builder.addMethod("isControl", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x00 <= ascii && ascii <= 0x1f) || ascii === 0x7f);
    });

    builder.addMethod("isSpace", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x09 <= ascii && ascii <= 0x0d) || ascii === 0x20);
    });

    builder.addMethod("isVowl", function() {
      var ch = this._.charAt(0).toUpperCase();
      return $.Boolean("AEIOU".indexOf(ch) !== -1);
    });

    builder.addMethod("isDecDigit", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39));
    });

    builder.addMethod("isUpper", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a));
    });

    builder.addMethod("isLower", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x61 <= ascii && ascii <= 0x7a));
    });

    builder.addMethod("isFileSafe", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e) &&
                         ascii !== 0x2f && // 0x2f is '/'
                         ascii !== 0x3a && // 0x3a is ':'
                         ascii !== 0x22);  // 0x22 is '"'
    });

    builder.addMethod("isPathSeparator", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean(ascii === 0x2f);
    });

    builder.addMethod("<", function($aChar) {
      return $.Boolean(this.ascii() < $aChar.ascii());
    });

    builder.addMethod("++", function($that) {
      return $.String(this._ + $that.__str__());
    });

    // TODO: implements $bullet
    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("archiveAsCompileString", function() {
      return $.True();
    });

    builder.addMethod("asString", function() {
      return $.String(this._);
    });

    builder.addMethod("shallowCopy");
  });
});

// src/sc/classlib/Core/Boolean.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $int0 = $.int0;
  var $int1 = $.int1;

  sc.lang.klass.refine("Boolean", function(builder) {
    builder.addMethod("__bool__", function() {
      return this._;
    });

    builder.addMethod("toString", function() {
      return String(this._);
    });

    builder.addClassMethod("new", function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    });

    builder.addMethod("xor", function($bool) {
      return $.Boolean(this === $bool).not();
    });

    // TODO: implements if
    // TODO: implements nop
    // TODO: implements &&
    // TODO: implements ||
    // TODO: implements and
    // TODO: implements or
    // TODO: implements nand
    // TODO: implements asInteger
    // TODO: implements binaryValue

    builder.addMethod("asBoolean");
    builder.addMethod("booleanValue");

    // TODO: implements keywordWarnings
    // TODO: implements trace
    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("archiveAsCompileString", 3);

    builder.addMethod("while", function() {
      var msg = "While was called with a fixed (unchanging) Boolean as the condition. ";
      msg += "Please supply a Function instead.";
      throw new Error(msg);
    });

    builder.addMethod("shallowCopy");
  });

  sc.lang.klass.refine("True", function(builder) {
    builder.addClassMethod("new", function() {
      throw new Error("True.new is illegal, should use literal.");
    });

    builder.addMethod("if", {
      args: "trueFunc"
    }, function($trueFunc) {
      return $trueFunc.value();
    });

    builder.addMethod("not", 4);

    builder.addMethod("&&", function($that) {
      return $that.value();
    });

    builder.addMethod("||");

    builder.addMethod("and", {
      args: "that"
    }, function($that) {
      return $that.value();
    });

    builder.addMethod("or");

    builder.addMethod("nand", {
      args: "that"
    }, function($that) {
      return $that.value().$("not");
    });

    builder.addMethod("asInteger", function() {
      return $int1;
    });

    builder.addMethod("binaryValue", function() {
      return $int1;
    });
  });

  sc.lang.klass.refine("False", function(builder) {
    builder.addClassMethod("new", function() {
      throw new Error("False.new is illegal, should use literal.");
    });

    builder.addMethod("if", {
      args: "trueFunc; falseFunc"
    }, function($trueFunc, $falseFunc) {
      return $falseFunc.value();
    });

    builder.addMethod("not", 3);

    builder.addMethod("&&");

    builder.addMethod("||", function($that) {
      return $that.value();
    });

    builder.addMethod("and");

    builder.addMethod("or", {
      args: "that"
    }, function($that) {
      return $that.value();
    });

    builder.addMethod("nand", 3);

    builder.addMethod("asInteger", function() {
      return $int0;
    });

    builder.addMethod("binaryValue", function() {
      return $int0;
    });
  });
});

// src/sc/classlib/Collections/Collection.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int0  = $.int0;
  var $int1  = $.int1;
  var SCArray = $("Array");

  sc.lang.klass.refine("Collection", function(builder) {
    builder.addClassMethod("newFrom", {
      args: "aCollection"
    }, function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.do($.Func(function($item) {
        return $newCollection.add($item);
      }));

      return $newCollection;
    });

    builder.addClassMethod("with", {
      args: "*args"
    }, function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    });

    builder.addClassMethod("fill", {
      args: "size; function"
    }, function($size, $function) {
      var $obj;
      var size, i;

      if ($size.isSequenceableCollection().__bool__()) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($.Integer(i)));
      }

      return $obj;
    });

    builder.addClassMethod("fill2D", {
      args: "rows; cols; function"
    }, function($rows, $cols, $function) {
      var $this = this, $obj, $obj2, $row, $col;
      var rows, cols, i, j;

      $obj = this.new($rows);

      rows = $rows.__int__();
      cols = $cols.__int__();

      for (i = 0; i < rows; ++i) {
        $row = $.Integer(i);
        $obj2 = $this.new($cols);
        for (j = 0; j < cols; ++j) {
          $col = $.Integer(j);
          $obj2 = $obj2.add($function.value($row, $col));
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    });

    builder.addClassMethod("fill3D", {
      args: "planes; rows; cols; function"
    }, function($planes, $rows, $cols, $function) {
      var $this = this, $obj, $obj2, $obj3, $plane, $row, $col;
      var planes, rows, cols, i, j, k;

      $obj = this.new($planes);

      planes = $planes.__int__();
      rows   = $rows  .__int__();
      cols   = $cols  .__int__();

      for (i = 0; i < planes; ++i) {
        $plane = $.Integer(i);
        $obj2 = $this.new($rows);
        for (j = 0; j < rows; ++j) {
          $row = $.Integer(j);
          $obj3 = $this.new($cols);
          for (k = 0; k < cols; ++k) {
            $col = $.Integer(k);
            $obj3 = $obj3.add($function.value($plane, $row, $col));
          }
          $obj2 = $obj2.add($obj3);
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    });

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.$("first");
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($.Func(function($i) {
          return $obj.add($function.valueArray($args.put($argIndex, $i)));
        }));
      } else {
        $dimensions = $dimensions.$("drop", [ $int1 ]);
        $n.do($.Func(function($i) {
          $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
          return $obj;
        }));
      }

      return $obj;
    };

    builder.addClassMethod("fillND", {
      args: "dimensions; function"
    }, function($dimensions, $function) {
      return fillND(this, $dimensions, $function, $.Array([]));
    });

    builder.addMethod("@", function($index) {
      return this.at($index);
    });

    builder.addMethod("==", function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($.Func(function($item) {
        if (!$aCollection.$("includes", [ $item ]).__bool__()) {
          $res = $false;
          this.break();
        }
        return $nil;
      }));

      return $res || $true;
    });

    // TODO: implements hash

    builder.addMethod("species", function() {
      return SCArray;
    });

    builder.subclassResponsibility("do");

    // TODO: implements iter

    builder.addMethod("size", function() {
      var tally = 0;

      this.do($.Func(function() {
        tally += 1;
        return $nil;
      }));

      return $.Integer(tally);
    });

    builder.addMethod("flatSize", function() {
      return this.sum($.Func(function($_) {
        return $_.$("flatSize");
      }));
    });

    builder.addMethod("isEmpty", function() {
      return $.Boolean(this.size().__int__() === 0);
    });

    builder.addMethod("notEmpty", function() {
      return $.Boolean(this.size().__int__() !== 0);
    });

    builder.addMethod("asCollection");
    builder.addMethod("isCollection", 3);

    builder.subclassResponsibility("add");

    builder.addMethod("addAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this;

      $aCollection.asCollection().do($.Func(function($item) {
        return $this.add($item);
      }));

      return this;
    });

    builder.subclassResponsibility("remove");

    builder.addMethod("removeAll", {
      args: "list"
    }, function($list) {
      var $this = this;

      $list.do($.Func(function($item) {
        return $this.remove($item);
      }));

      return this;
    });

    builder.addMethod("removeEvery", {
      args: "list"
    }, function($list) {
      this.removeAllSuchThat($.Func(function($_) {
        return $list.$("includes", [ $_ ]);
      }));
      return this;
    });

    builder.addMethod("removeAllSuchThat", function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($.Func(function($item) {
        if ($function.value($item).__bool__()) {
          $this.remove($item);
          $removedItems = $removedItems.add($item);
        }
        return $nil;
      }));

      return $removedItems;
    });

    builder.addMethod("atAll", {
      args: "keys"
    }, function($keys) {
      var $this = this;

      return $keys.$("collect", [ $.Func(function($index) {
        return $this.at($index);
      }) ]);
    });

    builder.addMethod("putEach", {
      args: "keys; values"
    }, function($keys, $values) {
      var keys, values, i, imax;

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    });

    builder.addMethod("includes", {
      args: "item1"
    }, function($item1) {
      var $res = null;

      this.do($.Func(function($item2) {
        if ($item1 === $item2) {
          $res = $true;
          this.break();
        }
        return $nil;
      }));

      return $res || $false;
    });

    builder.addMethod("includesEqual", {
      args: "item1"
    }, function($item1) {
      var $res = null;

      this.do($.Func(function($item2) {
        if ($item1 ["=="] ($item2).__bool__()) {
          $res = $true;
          this.break();
        }
        return $nil;
      }));

      return $res || $false;
    });

    builder.addMethod("includesAny", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Func(function($item) {
        if ($this.includes($item).__bool__()) {
          $res = $true;
          this.break();
        }
        return $nil;
      }));

      return $res || $false;
    });

    builder.addMethod("includesAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Func(function($item) {
        if (!$this.includes($item).__bool__()) {
          $res = $false;
          this.break();
        }
        return $nil;
      }));

      return $res || $true;
    });

    builder.addMethod("matchItem", {
      args: "item"
    }, function($item) {
      return this.includes($item);
    });

    builder.addMethod("collect", function($function) {
      return this.collectAs($function, this.species());
    });

    builder.addMethod("select", function($function) {
      return this.selectAs($function, this.species());
    });

    builder.addMethod("reject", function($function) {
      return this.rejectAs($function, this.species());
    });

    builder.addMethod("collectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Func(function($elem, $i) {
        return $res.add($function.value($elem, $i));
      }));

      return $res;
    });

    builder.addMethod("selectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $res.add($elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("rejectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Func(function($elem, $i) {
        if (!$function.value($elem, $i).__bool__()) {
          $res = $res.add($elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("detect", function($function) {
      var $res = null;

      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $elem;
          this.break();
        }
        return $nil;
      }));

      return $res || $nil;
    });

    builder.addMethod("detectIndex", function($function) {
      var $res = null;

      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $i;
          this.break();
        }
        return $nil;
      }));
      return $res || $nil;
    });

    builder.addMethod("doMsg", function() {
      var args = arguments;
      this.do($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
      return this;
    });

    builder.addMethod("collectMsg", function() {
      var args = arguments;
      return this.collect($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
    });

    builder.addMethod("selectMsg", function() {
      var args = arguments;
      return this.select($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
    });

    builder.addMethod("rejectMsg", function() {
      var args = arguments;
      return this.reject($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
    });

    builder.addMethod("detectMsg", {
      args: "selector; *args"
    }, function($selector, $$args) {
      return this.detect($.Func(function($item) {
        return $item.performList($selector, $$args);
      }));
    });

    builder.addMethod("detectIndexMsg", {
      args: "selector; *args"
    }, function($selector, $$args) {
      return this.detectIndex($.Func(function($item) {
        return $item.performList($selector, $$args);
      }));
    });

    builder.addMethod("lastForWhich", function($function) {
      var $res = null;
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $elem;
        } else {
          this.break();
        }
        return $nil;
      }));
      return $res || $nil;
    });

    builder.addMethod("lastIndexForWhich", function($function) {
      var $res = null;
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $i;
        } else {
          this.break();
        }
        return $nil;
      }));
      return $res || $nil;
    });

    builder.addMethod("inject", {
      args: "thisValue; function"
    }, function($thisValue, $function) {
      var $nextValue;
      $nextValue = $thisValue;
      this.do($.Func(function($item, $i) {
        $nextValue = $function.value($nextValue, $item, $i);
        return $nextValue;
      }));
      return $nextValue;
    });

    builder.addMethod("injectr", {
      args: "thisValue; function"
    }, function($thisValue, $function) {
      var $this = this, size, $nextValue;
      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($.Func(function($item, $i) {
        $item = $this.at($.Integer(--size));
        $nextValue = $function.value($nextValue, $item, $i);
        return $nextValue;
      }));
      return $nextValue;
    });

    builder.addMethod("count", function($function) {
      var sum = 0;
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          sum++;
        }
        return $nil;
      }));
      return $.Integer(sum);
    });

    builder.addMethod("occurrencesOf", {
      args: "obj"
    }, function($obj) {
      var sum = 0;
      this.do($.Func(function($elem) {
        if ($elem ["=="] ($obj).__bool__()) {
          sum++;
        }
        return $nil;
      }));
      return $.Integer(sum);
    });

    builder.addMethod("any", function($function) {
      var $res = null;
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $true;
          this.break();
        }
        return $nil;
      }));
      return $res || $false;
    });

    builder.addMethod("every", function($function) {
      var $res = null;
      this.do($.Func(function($elem, $i) {
        if (!$function.value($elem, $i).__bool__()) {
          $res = $false;
          this.break();
        }
        return $nil;
      }));
      return $res || $true;
    });

    builder.addMethod("sum", {
      args: "function"
    }, function($function) {
      var $sum;
      $sum = $int0;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          $sum = $sum ["+"] ($elem);
          return $sum;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          $sum = $sum ["+"] ($function.value($elem, $i));
          return $sum;
        }));
      }
      return $sum;
    });

    builder.addMethod("mean", function($function) {
      return this.sum($function) ["/"] (this.size());
    });

    builder.addMethod("product", {
      args: "function"
    }, function($function) {
      var $product;
      $product = $int1;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          $product = $product ["*"] ($elem);
          return $product;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          $product = $product ["*"] ($function.value($elem, $i));
          return $product;
        }));
      }
      return $product;
    });

    builder.addMethod("sumabs", function() {
      var $sum;
      $sum = $int0;
      this.do($.Func(function($elem) {
        if ($elem.isSequenceableCollection().__bool__()) {
          $elem = $elem.at($int0);
        }
        $sum = $sum ["+"] ($elem.abs());
        return $sum;
      }));
      return $sum;
    });

    builder.addMethod("maxItem", {
      args: "function"
    }, function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          if ($maxElement === $nil) {
            $maxElement = $elem;
          } else if ($elem > $maxElement) {
            $maxElement = $elem;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxElement = $elem;
            }
          }
          return $nil;
        }));
      }

      return $maxElement;
    });

    builder.addMethod("minItem", {
      args: "function"
    }, function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          if ($minElement === $nil) {
            $minElement = $elem;
          } else if ($elem < $minElement) {
            $minElement = $elem;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          var $val;
          if ($minValue === $nil) {
            $minValue = $function.value($elem, $i);
            $minElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $minValue) {
              $minValue = $val;
              $minElement = $elem;
            }
          }
          return $nil;
        }));
      }

      return $minElement;
    });

    builder.addMethod("maxIndex", {
      args: "function"
    }, function($function) {
      var $maxValue, $maxIndex;

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $maxIndex = $index;
          } else if ($elem > $maxValue) {
            $maxValue = $elem;
            $maxIndex = $index;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxIndex = $i;
            }
          }
          return $nil;
        }));
      }

      return $maxIndex;
    });

    builder.addMethod("minIndex", {
      args: "function"
    }, function($function) {
      var $maxValue, $minIndex;

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $minIndex = $index;
          } else if ($elem < $maxValue) {
            $maxValue = $elem;
            $minIndex = $index;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $minIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $maxValue) {
              $maxValue = $val;
              $minIndex = $i;
            }
          }
          return $nil;
        }));
      }

      return $minIndex;
    });

    builder.addMethod("maxValue", {
      args: "function"
    }, function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($.Func(function($elem, $i) {
        var $val;
        if ($maxValue === $nil) {
          $maxValue = $function.value($elem, $i);
          $maxElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val > $maxValue) {
            $maxValue = $val;
            $maxElement = $elem;
          }
        }
        return $nil;
      }));

      return $maxValue;
    });

    builder.addMethod("minValue", {
      args: "function"
    }, function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      this.do($.Func(function($elem, $i) {
        var $val;
        if ($minValue === $nil) {
          $minValue = $function.value($elem, $i);
          $minElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val < $minValue) {
            $minValue = $val;
            $minElement = $elem;
          }
        }
        return $nil;
      }));

      return $minValue;
    });

    builder.addMethod("maxSizeAtDepth", {
      args: "rank"
    }, function($rank) {
      var rank, maxsize = 0;

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($.Func(function($sublist) {
        var sz;
        if ($sublist.isCollection().__bool__()) {
          sz = $sublist.maxSizeAtDepth($.Integer(rank - 1));
        } else {
          sz = 1;
        }
        if (sz > maxsize) {
          maxsize = sz;
        }
        return $nil;
      }));

      return $.Integer(maxsize);
    });

    builder.addMethod("maxDepth", {
      args: "max=1"
    }, function($max) {
      var $res;

      $res = $max;
      this.do($.Func(function($elem) {
        if ($elem.isCollection().__bool__()) {
          $res = $res.max($elem.maxDepth($max.__inc__()));
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("deepCollect", {
      args: "depth=1; function; index=0; rank=0"
    }, function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($.Func(function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($.Func(function($item, $i) {
        return $item.deepCollect($depth, $function, $i, $rank);
      }));
    });

    builder.addMethod("deepDo", {
      args: "depth=1; function; index=0; rank=0"
    }, function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($.Func(function($item, $i) {
          return $item.deepDo($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($.Func(function($item, $i) {
        return $item.deepDo($depth, $function, $i, $rank);
      }));
    });

    builder.addMethod("invert", {
      args: "axis"
    }, function($axis) {
      var $index;

      if (this.isEmpty().__bool__()) {
        return this.species().new();
      }
      if ($axis !== $nil) {
        $index = $axis.$("*", [ $.Integer(2) ]);
      } else {
        $index = this.minItem().$("+", [ this.maxItem() ]);
      }

      return $index ["-"] (this);
    });

    builder.addMethod("sect", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.species().new();
      this.do($.Func(function($item) {
        if ($that.$("includes", [ $item ]).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("union", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.copy();
      $that.do($.Func(function($item) {
        if (!$result.includes($item).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("difference", {
      args: "that"
    }, function($that) {
      return this.copy().removeAll($that);
    });

    builder.addMethod("symmetricDifference", {
      args: "that"
    }, function($that) {
      var $this = this, $result;

      $result = this.species().new();
      $this.do($.Func(function($item) {
        if (!$that.includes($item).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));
      $that.do($.Func(function($item) {
        if (!$this.includes($item).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("isSubsetOf", {
      args: "that"
    }, function($that) {
      return $that.$("includesAll", [ this ]);
    });

    builder.addMethod("asArray", function() {
      return SCArray.new(this.size()).addAll(this);
    });

    builder.addMethod("asBag", function() {
      return $("Bag").new(this.size()).addAll(this);
    });

    builder.addMethod("asList", function() {
      return $("List").new(this.size()).addAll(this);
    });

    builder.addMethod("asSet", function() {
      return $("Set").new(this.size()).addAll(this);
    });

    builder.addMethod("asSortedList", function($function) {
      return $("SortedList").new(this.size(), $function).addAll(this);
    });

    // TODO: implements powerset
    // TODO: implements flopDict
    // TODO: implements histo
    // TODO: implements printAll
    // TODO: implements printcsAll
    // TODO: implements dumpAll
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
    // TODO: implements writeDef
    // TODO: implements writeInputSpec
    // TODO: implements case
    // TODO: implements makeEnvirValPairs

    builder.addMethod("asString", function() {
      var items = [];
      this.do($.Func(function($elem) {
        items.push($elem.__str__());
        return $nil;
      }));
      return $.String(
        this.__className + "[ " + items.join(", ") + " ]"
      );
    });
  });
});

// src/sc/classlib/Collections/SequenceableCollection.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int0  = $.int0;
  var $int1  = $.int1;
  var strlib = sc.libs.strlib;

  sc.lang.klass.refine("SequenceableCollection", function(builder, _) {
    builder.addMethod("|@|", function($index) {
      return this.clipAt($index);
    });

    builder.addMethod("@@", function($index) {
      return this.wrapAt($index);
    });

    builder.addMethod("@|@", function($index) {
      return this.foldAt($index);
    });

    builder.addClassMethod("series", {
      args: "size; start=0; step=1"
    }, function($size, $start, $step) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start.$("+", [ $step.$("*", [ $.Integer(i) ]) ]));
      }

      return $obj;
    });

    builder.addClassMethod("geom", {
      args: "size; start; grow"
    }, function($size, $start, $grow) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start);
        $start = $start.$("*", [ $grow ]);
      }

      return $obj;
    });

    builder.addClassMethod("fib", {
      args: "size; a=0.0; b=1.0"
    }, function($size, $a, $b) {
      var $obj, $temp, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($b);
        $temp = $b;
        $b = $a.$("+", [ $b ]);
        $a = $temp;
      }

      return $obj;
    });

    builder.addClassMethod("rand", {
      args: "size; minVal=0.0; maxVal=1.0"
    }, function($size, $minVal, $maxVal) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($minVal.rrand($maxVal));
      }

      return $obj;
    });

    builder.addClassMethod("exprand", {
      args: "size; minVal=0.0; maxVal=1.0"
    }, function($size, $minVal, $maxVal) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($minVal.exprand($maxVal));
      }

      return $obj;
    });

    builder.addClassMethod("rand2", {
      args: "size; val=1.0"
    }, function($size, $val) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($val.rand2());
      }

      return $obj;
    });

    builder.addClassMethod("linrand", {
      args: "size; minVal; maxVal"
    }, function($size, $minVal, $maxVal) {
      var $obj, i, imax;
      var $range;

      $range = $maxVal ["-"] ($minVal);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($minVal ["+"] ($range.linrand()));
      }

      return $obj;
    });

    builder.addClassMethod("interpolation", {
      args: "size; start=0.0; end=1.0"
    }, function($size, $start, $end) {
      var $obj, $step, i, imax;

      $obj = this.new($size);
      if ($size.__int__() === 1) {
        return $obj.add($start);
      }

      $step = ($end.$("-", [ $start ])).$("/", [ $size.__dec__() ]);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start.$("+", [ $.Integer(i) ["*"] ($step) ]));
      }

      return $obj;
    });

    builder.addMethod("++", function($aSequenceableCollection) {
      var $newlist;

      $newlist = this.species().new(this.size() ["+"] ($aSequenceableCollection.size()));
      $newlist = $newlist.addAll(this).addAll($aSequenceableCollection);

      return $newlist;
    });

    // TODO: implements +++

    builder.addMethod("asSequenceableCollection");

    builder.addMethod("choose", function() {
      return this.at(this.size().rand());
    });

    builder.addMethod("wchoose", {
      args: "weights"
    }, function($weights) {
      return this.at($weights.$("windex"));
    });

    builder.addMethod("==", function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($.Func(function($item, $i) {
        if ($item ["!="] ($aCollection.$("at", [ $i ])).__bool__()) {
          $res = $false;
          this.break();
        }
        return $nil;
      }));

      return $res || $true;
    });

    // TODO: implements hash

    builder.addMethod("copyRange", {
      args: "start; end"
    }, function($start, $end) {
      var $newColl, i, end;

      i = $start.__int__();
      end = $end.__int__();
      $newColl = this.species().new($.Integer(end - i));
      while (i <= end) {
        $newColl.add(this.at($.Integer(i++)));
      }

      return $newColl;
    });

    builder.addMethod("keep", {
      args: "n"
    }, function($n) {
      var n, size;

      n = $n.__int__();
      if (n >= 0) {
        return this.copyRange($int0, $.Integer(n - 1));
      }
      size = this.size().__int__();

      return this.copyRange($.Integer(size + n), $.Integer(size - 1));
    });

    builder.addMethod("drop", {
      args: "n"
    }, function($n) {
      var n, size;

      n = $n.__int__();
      size = this.size().__int__();
      if (n >= 0) {
        return this.copyRange($n, $.Integer(size - 1));
      }

      return this.copyRange($int0, $.Integer(size + n - 1));
    });

    builder.addMethod("copyToEnd", {
      args: "start"
    }, function($start) {
      return this.copyRange($start, $.Integer(this.size().__int__() - 1));
    });

    builder.addMethod("copyFromStart", {
      args: "end"
    }, function($end) {
      return this.copyRange($int0, $end);
    });

    builder.addMethod("indexOf", {
      args: "item"
    }, function($item) {
      var $ret = null;

      this.do($.Func(function($elem, $i) {
        if ($item === $elem) {
          $ret = $i;
          this.break();
        }
        return $nil;
      }));

      return $ret || $nil;
    });

    builder.addMethod("indicesOfEqual", {
      args: "item"
    }, function($item) {
      var indices = [];

      this.do($.Func(function($elem, $i) {
        if ($item === $elem) {
          indices.push($i);
        }
        return $nil;
      }));

      return indices.length ? $.Array(indices) : $nil;
    });

    builder.addMethod("find", {
      args: "sublist; offset=0"
    }, function($sublist, $offset) {
      var $subSize1, $first, $index;
      var size, offset, i, imax;

      $subSize1 = $sublist.size().__dec__();
      $first = $sublist.first();

      size   = this.size().__int__();
      offset = $offset.__int__();
      for (i = 0, imax = size - offset; i < imax; ++i) {
        $index = $.Integer(i + offset);
        if (this.at($index) ["=="] ($first).__bool__()) {
          if (this.copyRange($index, $index ["+"] ($subSize1)) ["=="] ($sublist).__bool__()) {
            return $index;
          }
        }
      }

      return $nil;
    });

    builder.addMethod("findAll", {
      args: "arr; offset=0"
    }, function($arr, $offset) {
      var $this = this, $indices, $i;

      $indices = $nil;
      $i = $int0;

      while (($i = $this.find($arr, $offset)) !== $nil) {
        $indices = $indices.add($i);
        $offset = $i.__inc__();
      }

      return $indices;
    });

    builder.addMethod("indexOfGreaterThan", {
      args: "val"
    }, function($val) {
      return this.detectIndex($.Func(function($item) {
        return $.Boolean($item > $val);
      }));
    });

    builder.addMethod("indexIn", {
      args: "val"
    }, function($val) {
      var $i, $j;

      $j = this.indexOfGreaterThan($val);
      if ($j === $nil) {
        return this.size().__dec__();
      }
      if ($j === $int0) {
        return $j;
      }

      $i = $j.__dec__();

      if ($val.$("-", [ this.at($i) ]) < this.at($j).$("-", [ $val ])) {
        return $i;
      }

      return $j;
    });

    builder.addMethod("indexInBetween", {
      args: "val"
    }, function($val) {
      var $a, $b, $div, $i;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }
      $i = this.indexOfGreaterThan($val);

      if ($i === $nil) {
        return this.size().__dec__();
      }
      if ($i === $int0) {
        return $i;
      }

      $a = this.at($i.__dec__());
      $b = this.at($i);
      $div = $b.$("-", [ $a ]);

      // if ($div ["=="] ($int0).__bool__()) {
      //   return $i;
      // }

      return $val.$("-", [ $a ]).$("/", [ $div ]).$("+", [ $i.__dec__() ]);
    });

    builder.addMethod("isSeries", {
      args: "step"
    }, function($step) {
      var $res = null;

      if (this.size() <= 1) {
        return $true;
      }
      this.doAdjacentPairs($.Func(function($a, $b) {
        var $diff = $b.$("-", [ $a ]);
        if ($step === $nil) {
          $step = $diff;
        } else if ($step ["!="] ($diff).__bool__()) {
          $res = $false;
          this.break();
        }
        return $nil;
      }));

      return $res || $true;
    });

    builder.addMethod("resamp0", {
      args: "newSize"
    }, function($newSize) {
      var $this = this, $factor;

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int1)
      );

      return this.species().fill($newSize, $.Func(function($i) {
        return $this.at($i ["*"] ($factor).round($.Float(1.0)).asInteger());
      }));
    });

    builder.addMethod("resamp1", {
      args: "newSize"
    }, function($newSize) {
      var $this = this, $factor;

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int1)
      );

      return this.species().fill($newSize, $.Func(function($i) {
        return $this.blendAt($i ["*"] ($factor));
      }));
    });

    builder.addMethod("remove", {
      args: "item"
    }, function($item) {
      var $index;

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.removeAt($index);
      }

      return $nil;
    });

    builder.addMethod("removing", {
      args: "item"
    }, function($item) {
      var $coll;

      $coll = this.copy();
      $coll.remove($item);

      return $coll;
    });

    builder.addMethod("take", {
      args: "item"
    }, function($item) {
      var $index;

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.takeAt($index);
      }

      return $nil;
    });

    builder.addMethod("lastIndex", function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $.Integer(size - 1);
      }

      return $nil;
    });

    builder.addMethod("middleIndex", function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $.Integer((size - 1) >> 1);
      }

      return $nil;
    });

    builder.addMethod("first", function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($int0);
      }

      return $nil;
    });

    builder.addMethod("last", function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($.Integer(size - 1));
      }

      return $nil;
    });

    builder.addMethod("middle", function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($.Integer((size - 1) >> 1));
      }

      return $nil;
    });

    builder.addMethod("top", function() {
      return this.last();
    });

    builder.addMethod("putFirst", {
      args: "obj"
    }, function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($int0, $obj);
      }

      return this;
    });

    builder.addMethod("putLast", {
      args: "obj"
    }, function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($.Integer(size - 1), $obj);
      }

      return this;
    });

    builder.addMethod("obtain", {
      args: "index; default"
    }, function($index, $default) {
      var $res;

      $res = this.at($index);
      if ($res === $nil) {
        $res = $default;
      }

      return $res;
    });

    builder.addMethod("instill", {
      args: "index; item; default"
    }, function($index, $item, $default) {
      var $res;

      if ($index.__num__() >= this.size()) {
        $res = this.extend($index.__inc__(), $default);
      } else {
        $res = this.copy();
      }

      return $res.put($index, $item);
    });

    builder.addMethod("pairsDo", function($function) {
      var $this = this, $int2 = $.Integer(2);

      $int0.forBy(this.size() ["-"] ($int2), $int2, $.Func(function($i) {
        return $function.value($this.at($i), $this.at($i.__inc__()), $i);
      }));

      return this;
    });

    builder.addMethod("keysValuesDo", function($function) {
      return this.pairsDo($function);
    });

    builder.addMethod("doAdjacentPairs", function($function) {
      var $i;
      var size, i, imax;

      size = this.size().__int__();
      for (i = 0, imax = size - 1; i < imax; ++i) {
        $i = $.Integer(i);
        $function.value(this.at($i), this.at($i.__inc__()), $i);
      }

      return this;
    });

    builder.addMethod("separate", {
      args: "function=true"
    }, function($function) {
      var $this = this, $list, $sublist;

      $list = $.Array();
      $sublist = this.species().new();
      this.doAdjacentPairs($.Func(function($a, $b, $i) {
        $sublist = $sublist.add($a);
        if ($function.value($a, $b, $i).__bool__()) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        }
        return $nil;
      }));
      if (this.notEmpty().__bool__()) {
        $sublist = $sublist.add(this.last());
      }
      $list = $list.add($sublist);

      return $list;
    });

    builder.addMethod("delimit", function($function) {
      var $this = this, $list, $sublist;

      $list = $.Array();
      $sublist = this.species().new();
      this.do($.Func(function($item, $i) {
        if ($function.value($item, $i).__bool__()) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        } else {
          $sublist = $sublist.add($item);
        }
        return $nil;
      }));
      $list = $list.add($sublist);

      return $list;
    });

    builder.addMethod("clump", {
      args: "groupSize"
    }, function($groupSize) {
      var $this = this, $list, $sublist;

      $list = $.Array();
      $sublist = this.species().new($groupSize);
      this.do($.Func(function($item) {
        $sublist.add($item);
        if ($sublist.size() >= $groupSize) {
          $list.add($sublist);
          $sublist = $this.species().new($groupSize);
        }
        return $nil;
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    });

    builder.addMethod("clumps", {
      args: "groupSizeList"
    }, function($groupSizeList) {
      var $this = this, $list, $subSize, $sublist, i = 0;

      $list = $.Array();
      $subSize = $groupSizeList.at($int0);
      $sublist = this.species().new($subSize);
      this.do($.Func(function($item) {
        $sublist = $sublist.add($item);
        if ($sublist.size() >= $subSize) {
          $list = $list.add($sublist);
          $subSize = $groupSizeList.$("wrapAt", [ $.Integer(++i) ]);
          $sublist = $this.species().new($subSize);
        }
        return $nil;
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    });

    builder.addMethod("curdle", {
      args: "probability"
    }, function($probability) {
      return this.separate($.Func(function() {
        return $probability.$("coin");
      }));
    });

    builder.addMethod("flatten", {
      args: "numLevels=1"
    }, function($numLevels) {
      return flatten(this, $numLevels.__num__());
    });

    function flatten($this, numLevels) {
      var $list;

      if (numLevels <= 0) {
        return $this;
      }
      numLevels = numLevels - 1;

      $list = $this.species().new();
      $this.do($.Func(function($item) {
        if ($item.flatten) {
          $list = $list.addAll(flatten($item, numLevels));
        } else {
          $list = $list.add($item);
        }
        return $nil;
      }));

      return $list;
    }

    builder.addMethod("flat", function() {
      return flat(this, this.species().new(this.flatSize()));
    });

    function flat($this, $list) {
      $this.do($.Func(function($item) {
        if ($item.flat) {
          $list = flat($item, $list);
        } else {
          $list = $list.add($item);
        }
        return $nil;
      }));
      return $list;
    }

    builder.addMethod("flatIf", function($func) {
      return flatIf(this, $func);
    });

    function flatIf($this, $func) {
      var $list;

      $list = $this.species().new($this.size());
      $this.do($.Func(function($item, $i) {
        if ($item.flatIf && $func.value($item, $i).__bool__()) {
          $list = $list.addAll(flatIf($item, $func));
        } else {
          $list = $list.add($item);
        }
        return $nil;
      }));

      return $list;
    }

    builder.addMethod("flop", function() {
      var $this = this, $list, $size, $maxsize;

      $size = this.size();
      $maxsize = $int0;
      this.do($.Func(function($sublist) {
        var $sz;
        if ($sublist.isSequenceableCollection().__bool__()) {
          $sz = $sublist.size();
        } else {
          $sz = $int1;
        }
        if ($sz > $maxsize) {
          $maxsize = $sz;
        }
        return $nil;
      }));

      $list = this.species().fill($maxsize, $.Func(function() {
        return $this.species().new($size);
      }));

      this.do($.Func(function($isublist) {
        if ($isublist.isSequenceableCollection().__bool__()) {
          $list.do($.Func(function($jsublist, $j) {
            return $jsublist.add($isublist.wrapAt($j));
          }));
        } else {
          $list.do($.Func(function($jsublist) {
            return $jsublist.add($isublist);
          }));
        }
        return $nil;
      }));

      return $list;
    });

    builder.addMethod("flopWith", {
      args: "func"
    }, function($func) {
      var $this = this, $maxsize;

      $maxsize = this.maxValue($.Func(function($sublist) {
        if ($sublist.isSequenceableCollection().__bool__()) {
          return $sublist.size();
        }
        return $int1;
      }));

      return this.species().fill($maxsize, $.Func(function($i) {
        return $func.valueArray($this.collect($.Func(function($sublist) {
          if ($sublist.isSequenceableCollection().__bool__()) {
            return $sublist.wrapAt($i);
          }
          return $sublist;
        })));
      }));
    });

    builder.addMethod("flopTogether", function() {
      var $standIn, $minus1, $looper;
      var array, maxSize = 0;

      array = [ this ].concat(_.toArray(arguments));
      array.forEach(function($sublist) {
        $sublist.do($.Func(function($each) {
          var size = $each.size();
          if (maxSize < size) {
            maxSize = size;
          }
          return $nil;
        }));
      });

      $standIn = $int0.dup($.Integer(maxSize));
      $minus1  = $.Integer(-1);
      $looper  = $.Func(function($each) {
        return $each.drop($minus1);
      });

      return $.Array(array.map(function($sublist) {
        return $sublist.add($standIn);
      })).collect($.Func(function($sublist) {
        return $sublist.flop().collect($looper);
      }));
    });

    builder.addMethod("flopDeep", {
      args: "rank"
    }, function($rank) {
      var $this = this;
      var $size, $maxsize;

      if ($rank === $nil) {
        $rank = this.maxDepth().__dec__();
      }
      if ($rank.__int__() <= 1) {
        return this.flop();
      }

      $size = this.size();
      $maxsize = this.maxSizeAtDepth($rank);

      return this.species().fill($maxsize, $.Func(function($i) {
        return $this.wrapAtDepth($rank, $i);
      }));
    });

    builder.addMethod("wrapAtDepth", {
      args: "rank; index"
    }, function($rank, $index) {
      if ($rank === $int0) {
        return this.wrapAt($index);
      }
      return this.collect($.Func(function($item) {
        if ($item.isSequenceableCollection().__bool__()) {
          return $item.wrapAtDepth($rank.__dec__(), $index);
        }
        return $item;
      }));
    });

    builder.addMethod("unlace", {
      args: "numlists; clumpSize=1; clip=false"
    }, function($numlists, $clumpSize, $clip) {
      var $this = this;
      var $size, $list, $self, $sublist;

      $size = (this.size() ["+"] ($numlists.__dec__())).div($numlists);
      $list = this.species().fill($numlists, $.Func(function() {
        return $this.species().new($size);
      }));
      if ($clip.__bool__()) {
        $self = this.keep(this.size().trunc($clumpSize ["*"] ($numlists)));
      } else {
        $self = this;
      }
      $self.do($.Func(function($item, $i) {
        $sublist = $list.at($i.div($clumpSize) ["%"] ($numlists));
        return $sublist.add($item);
      }));
      return $list;
    });

    builder.addMethod("integrate", function() {
      var $list, $sum;

      $sum = $int0;

      $list = this.class().new(this.size());
      this.do($.Func(function($item) {
        $sum = $sum ["+"] ($item);
        return $list.add( $sum );
      }));

      return $list;
    });

    builder.addMethod("differentiate", function() {
      var $list, $prev;

      $prev = $int0;

      $list = this.class().new(this.size());
      this.do($.Func(function($item) {
        $list.add($item ["-"] ($prev));
        $prev = $item;
        return $item;
      }));

      return $list;
    });

    builder.addMethod("convertDigits", {
      args: "base=10"
    }, function($base) {
      var $lastIndex;

      $lastIndex = this.lastIndex();
      return this.sum($.Func(function($x, $i) {
        if ($x.__int__() >= $base.__int__()) {
          throw new Error("digit too large for base");
        }
        return $base ["**"] ($lastIndex ["-"] ($i)) ["*"] ($x);
      })).asInteger();
    });

    builder.addMethod("hammingDistance", {
      args: "that"
    }, function($that) {
      var count;

      count = Math.max(0, $that.size().__int__() - this.size().__int__());
      this.do($.Func(function($elem, $i) {
        if ($elem ["!="] ($that.at($i)).__bool__()) {
          count += 1;
        }
        return $nil;
      }));

      return $.Integer(count);
    });

    builder.addMethod("degreeToKey", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return this.collect($.Func(function($scaleDegree) {
        return $scaleDegree.degreeToKey($scale, $stepsPerOctave);
      }));
    });

    builder.addMethod("keyToDegree", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      return this.collect($.Func(function($val) {
        return $val.keyToDegree($scale, $stepsPerOctave);
      }));
    });

    builder.addMethod("nearestInScale", {
      args: "scale; stepsPerOctave=12"
    }, function($scale, $stepsPerOctave) {
      var $root, $key;
      $root = this.trunc($stepsPerOctave);
      $key = this ["%"] ($stepsPerOctave);
      return $key.nearestInList($scale) ["+"] ($root);
    });

    builder.addMethod("nearestInList", {
      args: "list"
    }, function($list) {
      return this.collect($.Func(function($item) {
        return $list.at($list.indexIn($item));
      }));
    });

    builder.addMethod("transposeKey", {
      args: "amount; octave=12"
    }, function($amount, $octave) {
      return ((this ["+"] ($amount)) ["%"] ($octave)).sort();
    });

    builder.addMethod("mode", {
      args: "degree; octave=12"
    }, function($degree, $octave) {
      return (this.rotate($degree.neg()) ["-"] (this.wrapAt($degree))) ["%"] ($octave);
    });

    builder.addMethod("performDegreeToKey", {
      args: "scaleDegree; stepsPerOctave=12; accidental=0"
    }, function($scaleDegree, $stepsPerOctave, $accidental) {
      var $baseKey;

      $baseKey = (
        $stepsPerOctave ["*"] ($scaleDegree.div(this.size()))
      ) ["+"] (this.wrapAt($scaleDegree));
      if ($accidental.__num__() === 0) {
        return $baseKey;
      }
      return $baseKey ["+"] ($accidental ["*"] ($stepsPerOctave ["/"] ($.Float(12.0))));
    });

    builder.addMethod("performKeyToDegree", {
      args: "degree; stepsPerOctave=12"
    }, function($degree, $stepsPerOctave) {
      var $n, $key;

      $n = $degree.div($stepsPerOctave) ["*"] (this.size());
      $key = $degree ["%"] ($stepsPerOctave);
      return this.indexInBetween($key) ["+"] ($n);
    });

    builder.addMethod("performNearestInList", {
      args: "degree"
    }, function($degree) {
      return this.at(this.indexIn($degree));
    });

    builder.addMethod("performNearestInScale", {
      args: "degree; stepsPerOctave=12"
    }, function($degree, $stepsPerOctave) {
      var $root, $key;
      $root = $degree.trunc($stepsPerOctave);
      $key  = $degree ["%"] ($stepsPerOctave);
      return $key.nearestInList(this) ["+"] ($root);
    });

    // TODO: implements convertRhythm
    // TODO: implements sumRhythmDivisions
    // TODO: implements convertOneRhythm

    builder.addMethod("isSequenceableCollection", 3);

    builder.addMethod("containsSeqColl", function() {
      return this.any($.Func(function($_) {
        return $_.isSequenceableCollection();
      }));
    });

    builder.addMethod("neg", function() {
      return this.performUnaryOp($.Symbol("neg"));
    });

    builder.addMethod("bitNot", function() {
      return this.performUnaryOp($.Symbol("bitNot"));
    });

    builder.addMethod("abs", function() {
      return this.performUnaryOp($.Symbol("abs"));
    });

    builder.addMethod("ceil", function() {
      return this.performUnaryOp($.Symbol("ceil"));
    });

    builder.addMethod("floor", function() {
      return this.performUnaryOp($.Symbol("floor"));
    });

    builder.addMethod("frac", function() {
      return this.performUnaryOp($.Symbol("frac"));
    });

    builder.addMethod("sign", function() {
      return this.performUnaryOp($.Symbol("sign"));
    });

    builder.addMethod("squared", function() {
      return this.performUnaryOp($.Symbol("squared"));
    });

    builder.addMethod("cubed", function() {
      return this.performUnaryOp($.Symbol("cubed"));
    });

    builder.addMethod("sqrt", function() {
      return this.performUnaryOp($.Symbol("sqrt"));
    });

    builder.addMethod("exp", function() {
      return this.performUnaryOp($.Symbol("exp"));
    });

    builder.addMethod("reciprocal", function() {
      return this.performUnaryOp($.Symbol("reciprocal"));
    });

    builder.addMethod("midicps", function() {
      return this.performUnaryOp($.Symbol("midicps"));
    });

    builder.addMethod("cpsmidi", function() {
      return this.performUnaryOp($.Symbol("cpsmidi"));
    });

    builder.addMethod("midiratio", function() {
      return this.performUnaryOp($.Symbol("midiratio"));
    });

    builder.addMethod("ratiomidi", function() {
      return this.performUnaryOp($.Symbol("ratiomidi"));
    });

    builder.addMethod("ampdb", function() {
      return this.performUnaryOp($.Symbol("ampdb"));
    });

    builder.addMethod("dbamp", function() {
      return this.performUnaryOp($.Symbol("dbamp"));
    });

    builder.addMethod("octcps", function() {
      return this.performUnaryOp($.Symbol("octcps"));
    });

    builder.addMethod("cpsoct", function() {
      return this.performUnaryOp($.Symbol("cpsoct"));
    });

    builder.addMethod("log", function() {
      return this.performUnaryOp($.Symbol("log"));
    });

    builder.addMethod("log2", function() {
      return this.performUnaryOp($.Symbol("log2"));
    });

    builder.addMethod("log10", function() {
      return this.performUnaryOp($.Symbol("log10"));
    });

    builder.addMethod("sin", function() {
      return this.performUnaryOp($.Symbol("sin"));
    });

    builder.addMethod("cos", function() {
      return this.performUnaryOp($.Symbol("cos"));
    });

    builder.addMethod("tan", function() {
      return this.performUnaryOp($.Symbol("tan"));
    });

    builder.addMethod("asin", function() {
      return this.performUnaryOp($.Symbol("asin"));
    });

    builder.addMethod("acos", function() {
      return this.performUnaryOp($.Symbol("acos"));
    });

    builder.addMethod("atan", function() {
      return this.performUnaryOp($.Symbol("atan"));
    });

    builder.addMethod("sinh", function() {
      return this.performUnaryOp($.Symbol("sinh"));
    });

    builder.addMethod("cosh", function() {
      return this.performUnaryOp($.Symbol("cosh"));
    });

    builder.addMethod("tanh", function() {
      return this.performUnaryOp($.Symbol("tanh"));
    });

    builder.addMethod("rand", function() {
      return this.performUnaryOp($.Symbol("rand"));
    });

    builder.addMethod("rand2", function() {
      return this.performUnaryOp($.Symbol("rand2"));
    });

    builder.addMethod("linrand", function() {
      return this.performUnaryOp($.Symbol("linrand"));
    });

    builder.addMethod("bilinrand", function() {
      return this.performUnaryOp($.Symbol("bilinrand"));
    });

    builder.addMethod("sum3rand", function() {
      return this.performUnaryOp($.Symbol("sum3rand"));
    });

    builder.addMethod("distort", function() {
      return this.performUnaryOp($.Symbol("distort"));
    });

    builder.addMethod("softclip", function() {
      return this.performUnaryOp($.Symbol("softclip"));
    });

    builder.addMethod("coin", function() {
      return this.performUnaryOp($.Symbol("coin"));
    });

    builder.addMethod("even", function() {
      return this.performUnaryOp($.Symbol("even"));
    });

    builder.addMethod("odd", function() {
      return this.performUnaryOp($.Symbol("odd"));
    });

    builder.addMethod("isPositive", function() {
      return this.performUnaryOp($.Symbol("isPositive"));
    });

    builder.addMethod("isNegative", function() {
      return this.performUnaryOp($.Symbol("isNegative"));
    });

    builder.addMethod("isStrictlyPositive", function() {
      return this.performUnaryOp($.Symbol("isStrictlyPositive"));
    });

    builder.addMethod("rectWindow", function() {
      return this.performUnaryOp($.Symbol("rectWindow"));
    });

    builder.addMethod("hanWindow", function() {
      return this.performUnaryOp($.Symbol("hanWindow"));
    });

    builder.addMethod("welWindow", function() {
      return this.performUnaryOp($.Symbol("welWindow"));
    });

    builder.addMethod("triWindow", function() {
      return this.performUnaryOp($.Symbol("triWindow"));
    });

    builder.addMethod("scurve", function() {
      return this.performUnaryOp($.Symbol("scurve"));
    });

    builder.addMethod("ramp", function() {
      return this.performUnaryOp($.Symbol("ramp"));
    });

    builder.addMethod("asFloat", function() {
      return this.performUnaryOp($.Symbol("asFloat"));
    });

    builder.addMethod("asInteger", function() {
      return this.performUnaryOp($.Symbol("asInteger"));
    });

    builder.addMethod("nthPrime", function() {
      return this.performUnaryOp($.Symbol("nthPrime"));
    });

    builder.addMethod("prevPrime", function() {
      return this.performUnaryOp($.Symbol("prevPrime"));
    });

    builder.addMethod("nextPrime", function() {
      return this.performUnaryOp($.Symbol("nextPrime"));
    });

    builder.addMethod("indexOfPrime", function() {
      return this.performUnaryOp($.Symbol("indexOfPrime"));
    });

    builder.addMethod("real", function() {
      return this.performUnaryOp($.Symbol("real"));
    });

    builder.addMethod("imag", function() {
      return this.performUnaryOp($.Symbol("imag"));
    });

    builder.addMethod("magnitude", function() {
      return this.performUnaryOp($.Symbol("magnitude"));
    });

    builder.addMethod("magnitudeApx", function() {
      return this.performUnaryOp($.Symbol("magnitudeApx"));
    });

    builder.addMethod("phase", function() {
      return this.performUnaryOp($.Symbol("phase"));
    });

    builder.addMethod("angle", function() {
      return this.performUnaryOp($.Symbol("angle"));
    });

    builder.addMethod("rho", function() {
      return this.performUnaryOp($.Symbol("rho"));
    });

    builder.addMethod("theta", function() {
      return this.performUnaryOp($.Symbol("theta"));
    });

    builder.addMethod("degrad", function() {
      return this.performUnaryOp($.Symbol("degrad"));
    });

    builder.addMethod("raddeg", function() {
      return this.performUnaryOp($.Symbol("raddeg"));
    });

    builder.addMethod("+", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("+"), $aNumber, $adverb);
    });

    builder.addMethod("-", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("-"), $aNumber, $adverb);
    });

    builder.addMethod("*", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("*"), $aNumber, $adverb);
    });

    builder.addMethod("/", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("/"), $aNumber, $adverb);
    });

    builder.addMethod("div", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("div"), $aNumber, $adverb);
    });

    builder.addMethod("mod", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("mod"), $aNumber, $adverb);
    });

    builder.addMethod("pow", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("pow"), $aNumber, $adverb);
    });

    builder.addMethod("min", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("min"), $aNumber, $adverb);
    });

    builder.addMethod("max", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("max"), $aNumber, $adverb);
    });

    builder.addMethod("<", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("<"), $aNumber, $adverb);
    });

    builder.addMethod("<=", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("<="), $aNumber, $adverb);
    });

    builder.addMethod(">", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol(">"), $aNumber, $adverb);
    });

    builder.addMethod(">=", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol(">="), $aNumber, $adverb);
    });

    builder.addMethod("bitAnd", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitAnd"), $aNumber, $adverb);
    });

    builder.addMethod("bitOr", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitOr"), $aNumber, $adverb);
    });

    builder.addMethod("bitXor", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitXor"), $aNumber, $adverb);
    });

    builder.addMethod("bitHammingDistance", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitHammingDistance"), $aNumber, $adverb);
    });

    builder.addMethod("lcm", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("lcm"), $aNumber, $adverb);
    });

    builder.addMethod("gcd", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("gcd"), $aNumber, $adverb);
    });

    builder.addMethod("round", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("round"), $aNumber, $adverb);
    });

    builder.addMethod("roundUp", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("roundUp"), $aNumber, $adverb);
    });

    builder.addMethod("trunc", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("trunc"), $aNumber, $adverb);
    });

    builder.addMethod("atan2", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("atan2"), $aNumber, $adverb);
    });

    builder.addMethod("hypot", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("hypot"), $aNumber, $adverb);
    });

    builder.addMethod("hypotApx", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("hypotApx"), $aNumber, $adverb);
    });

    builder.addMethod("leftShift", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("leftShift"), $aNumber, $adverb);
    });

    builder.addMethod("rightShift", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("rightShift"), $aNumber, $adverb);
    });

    builder.addMethod("unsignedRightShift", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("unsignedRightShift"), $aNumber, $adverb);
    });

    builder.addMethod("ring1", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring1"), $aNumber, $adverb);
    });

    builder.addMethod("ring2", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring2"), $aNumber, $adverb);
    });

    builder.addMethod("ring3", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring3"), $aNumber, $adverb);
    });

    builder.addMethod("ring4", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring4"), $aNumber, $adverb);
    });

    builder.addMethod("difsqr", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("difsqr"), $aNumber, $adverb);
    });

    builder.addMethod("sumsqr", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("sumsqr"), $aNumber, $adverb);
    });

    builder.addMethod("sqrsum", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("sqrsum"), $aNumber, $adverb);
    });

    builder.addMethod("sqrdif", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("sqrdif"), $aNumber, $adverb);
    });

    builder.addMethod("absdif", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("absdif"), $aNumber, $adverb);
    });

    builder.addMethod("thresh", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("thresh"), $aNumber, $adverb);
    });

    builder.addMethod("amclip", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("amclip"), $aNumber, $adverb);
    });

    builder.addMethod("scaleneg", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("scaleneg"), $aNumber, $adverb);
    });

    builder.addMethod("clip2", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("clip2"), $aNumber, $adverb);
    });

    builder.addMethod("fold2", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("fold2"), $aNumber, $adverb);
    });

    builder.addMethod("wrap2", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("wrap2"), $aNumber, $adverb);
    });

    builder.addMethod("excess", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("excess"), $aNumber, $adverb);
    });

    builder.addMethod("firstArg", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("firstArg"), $aNumber, $adverb);
    });

    builder.addMethod("rrand", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("rrand"), $aNumber, $adverb);
    });

    builder.addMethod("exprand", function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("exprand"), $aNumber, $adverb);
    });

    builder.addMethod("performUnaryOp", function($aSelector) {
      return this.collect($.Func(function($item) {
        return $item.perform($aSelector);
      }));
    });

    builder.addMethod("performBinaryOp", function($aSelector, $theOperand, $adverb) {
      return $theOperand.performBinaryOpOnSeqColl($aSelector, this, $adverb);
    });

    builder.addMethod("performBinaryOpOnSeqColl", function($aSelector, $theOperand, $adverb) {
      var adverb;

      if ($adverb === $nil || !$adverb) {
        return _performBinaryOpOnSeqColl$adverb$nil(
          this, $aSelector, $theOperand
        );
      }
      if ($adverb.isInteger().__bool__()) {
        return _performBinaryOpOnSeqColl$adverb$int(
          this, $aSelector, $theOperand, $adverb.__int__()
        );
      }

      adverb = $adverb.__sym__();
      if (adverb === "t") {
        return _performBinaryOpOnSeqColl$adverb$t(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "x") {
        return _performBinaryOpOnSeqColl$adverb$x(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "s") {
        return _performBinaryOpOnSeqColl$adverb$s(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "f") {
        return _performBinaryOpOnSeqColl$adverb$f(
          this, $aSelector, $theOperand
        );
      }

      throw new Error(strlib.format(
        "unrecognized adverb: '#{0}' for operator '#{1}'", adverb, $aSelector
      ));
    });

    function _performBinaryOpOnSeqColl$adverb$nil($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().max($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $.Integer(i);
        $newList.add(
          $theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i))
        );
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl$adverb$int($this, $aSelector, $theOperand, adverb) {
      var $size, $newList, $i;
      var size, i;

      if (adverb === 0) {
        $size = $this.size().max($theOperand.size());
        $newList = $this.species().new($size);

        size = $size.__int__();
        for (i = 0; i < size; ++i) {
          $i = $.Integer(i);
          $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
        }
      } else if (adverb > 0) {
        $newList = $theOperand.collect($.Func(function($item) {
          return $item.perform($aSelector, $this, $.Integer(adverb - 1));
        }));
      } else {
        $newList = $this.collect($.Func(function($item) {
          return $theOperand.perform($aSelector, $item, $.Integer(adverb + 1));
        }));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl$adverb$t($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $theOperand.size();
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $.Integer(i);
        $newList.add($theOperand.at($i).perform($aSelector, $this));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl$adverb$x($this, $aSelector, $theOperand) {
      var $size, $newList;

      $size = $theOperand.size() ["*"] ($this.size());
      $newList = $this.species().new($size);
      $theOperand.do($.Func(function($a) {
        return $this.do($.Func(function($b) {
          return $newList.add($a.perform($aSelector, $b));
        }));
      }));

      return $newList;
    }

    function _performBinaryOpOnSeqColl$adverb$s($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().min($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $.Integer(i);
        $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl$adverb$f($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().max($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $.Integer(i);
        $newList.add($theOperand.foldAt($i).perform($aSelector, $this.foldAt($i)));
      }

      return $newList;
    }

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector, $aNumber, $adverb) {
      return this.collect($.Func(function($item) {
        return $aNumber.perform($aSelector, $item, $adverb);
      }));
    });

    builder.addMethod("performBinaryOpOnComplex", function($aSelector, $aComplex, $adverb) {
      return this.collect($.Func(function($item) {
        return $aComplex.perform($aSelector, $item, $adverb);
      }));
    });

    builder.addMethod("asFraction", function($denominator, $fasterBetter) {
      return this.collect($.Func(function($item) {
        return $item.$("asFraction", [ $denominator, $fasterBetter ] );
      }));
    });

    // TODO: implements asPoint
    // TODO: implements asRect

    builder.addMethod("ascii", function() {
      return this.collect($.Func(function($item) {
        return $item.$("ascii");
      }));
    });

    builder.addMethod("rate", function() {
      if (this.size().__int__() === 1) {
        return this.first().$("rate");
      }
      return this.collect($.Func(function($item) {
        return $item.$("rate");
      })).minItem();
    });

    builder.addMethod("multiChannelPerform", function() {
      if (this.size().__int__() > 0) {
        return this.__super__("multiChannelPerform", arguments);
      }
      return this.class().new();
    });

    builder.addMethod("multichannelExpandRef");

    builder.addMethod("clip", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("clip") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("wrap", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("wrap") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("fold", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("fold") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("linlin", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("linlin") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("linexp", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("linexp") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("explin", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("explin") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("expexp", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("expexp") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lincurve", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lincurve") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("curvelin", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("curvelin") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("bilin", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("bilin") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("biexp", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("biexp") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("moddif", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("moddif") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("range", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("range") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("exprange", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("exprange") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("curverange", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("curverange") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("unipolar", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("unipolar") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("bipolar", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("bipolar") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lag", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lag2", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag2") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lag3", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag3") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lagud", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lagud") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lag2ud", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag2ud") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("lag3ud", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag3ud") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("varlag", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("varlag") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("slew", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("slew") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("blend", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("blend") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("checkBadValues", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("checkBadValues") ].concat(_.toArray(arguments))
      );
    });

    builder.addMethod("prune", function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("prune") ].concat(_.toArray(arguments))
      );
    });

    // TODO: implements minNyquist

    builder.addMethod("sort", {
      args: "function"
    }, function($function) {
      if ($function === $nil) {
        $function = $.Func(function($a, $b) {
          return $a.$("<=", [ $b ]);
        });
      }
      this.__sort__($function);
      return this;
    });

    builder.addMethod("sortBy", {
      args: "key"
    }, function($key) {
      return this.sort($.Func(function($a, $b) {
        return $a.$("at", [ $key ]).$("<=", [ $b.$("at", [ $key ]) ]);
      }));
    });

    builder.addMethod("sortMap", {
      args: "function"
    }, function($function) {
      return this.sort($.Func(function($a, $b) {
        return $function.value($a).$("<=", [ $function.value($b) ]);
      }));
    });

    // TODO: implements sortedMedian
    // TODO: implements median
    // TODO: implements quickSort
    // TODO: implements order

    builder.addMethod("swap", {
      args: "i; j"
    }, function($i, $j) {
      var $temp;

      $temp = this.at($i);
      this.put($i, this.at($j));
      this.put($j, $temp);

      return this;
    });

    // TODO: implements quickSortRange
    // TODO: implements mergeSort
    // TODO: implements mergeSortTemp
    // TODO: implements mergeTemp
    // TODO: implements insertionSort
    // TODO: implements insertionSortRange
    // TODO: implements hoareMedian
    // TODO: implements hoareFind
    // TODO: implements hoarePartition
    // TODO: implements $streamContensts
    // TODO: implements $streamContenstsLimit

    builder.addMethod("wrapAt", {
      args: "index"
    }, function($index) {
      $index = $index.$("%", [ this.size() ]);
      return this.at($index);
    });

    builder.addMethod("wrapPut", {
      args: "index; value"
    }, function($index, $value) {
      $index = $index.$("%", [ this.size() ]);
      return this.put($index, $value);
    });

    builder.addMethod("reduce", {
      args: "operator"
    }, function($operator) {
      var once;
      var $result;

      if (this.size().__int__() === 1) {
        return this.at($int0);
      }

      once = true;
      $result = $nil;
      this.doAdjacentPairs($.Func(function($a, $b) {
        if (once) {
          once = false;
          $result = $operator.applyTo($a, $b);
        } else {
          $result = $operator.applyTo($result, $b);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("join", {
      args: "joiner"
    }, function($joiner) {
      var items, joiner;

      items = [];
      this.do($.Func(function($item) {
        items.push($item.__str__());
        return $nil;
      }));

      joiner = ($joiner === $nil) ? "" : $joiner.__str__();

      return $.String(items.join(joiner), true);
    });
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements schedBundleArrayOnClock
  });
});

// src/sc/classlib/Collections/ArrayedCollection.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var random  = sc.libs.random;
  var mathlib = sc.libs.mathlib;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var $int1 = $.int1;

  sc.lang.klass.refine("ArrayedCollection", function(builder, _) {
    builder.addMethod("valueOf", function() {
      return this._.map(function(elem) {
        return elem.valueOf();
      });
    });

    builder.addMethod("__elem__", function(item) {
      return item || $nil;
    });

    function throwIfImmutable($this) {
      if ($this.__immutable) {
        throw new Error("Attempted write to immutable object.");
      }
    }

    builder.addClassMethod("newClear", {
      args: "indexedSize=0"
    }, function($indexedSize) {
      var $obj;
      var array, indexedSize, i;

      $obj = this.new();

      indexedSize = $indexedSize.__int__();
      array = new Array(indexedSize);
      for (i = 0; i < indexedSize; ++i) {
        array[i] = $obj.__elem__();
      }
      $obj._ = array;

      return $obj;
    });

    // TODO: implements indexedSize

    builder.addMethod("size", function() {
      return $.Integer(this._.length);
    });

    // TODO: implements maxSize

    builder.addMethod("swap", {
      args: "a; b"
    }, function($a, $b) {
      var raw = this._;
      var a, b, len, tmp;

      throwIfImmutable(this);

      a = $a.__int__();
      b = $b.__int__();
      len = raw.length;

      if (a < 0 || len <= a || b < 0 || len <= b) {
        throw new Error("out of index");
      }

      tmp = raw[b];
      raw[b] = raw[a];
      raw[a] = tmp;

      return this;
    });

    builder.addMethod("at", {
      args: "index"
    }, function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            return $nil;
          }
          return this._[i];
        }, this));
      }

      i = $index.__int__();

      return this._[i] || $nil;
    });

    builder.addMethod("clipAt", {
      args: "index"
    }, function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          i = mathlib.clipIndex($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.clipIndex($index.__int__(), this._.length);

      return this._[i];
    });

    builder.addMethod("wrapAt", {
      args: "index"
    }, function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          var i = mathlib.wrapIndex($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.wrapIndex($index.__int__(), this._.length);

      return this._[i];
    });

    builder.addMethod("foldAt", {
      args: "index"
    }, function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          var i = mathlib.foldIndex($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.foldIndex($index.__int__(), this._.length);

      return this._[i];
    });

    builder.addMethod("put", {
      args: "index; item"
    }, function($index, $item) {
      var i;

      throwIfImmutable(this);

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          var i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            throw new Error("out of index");
          }
          this._[i] = this.__elem__($item);
        }, this);
      } else {
        i = $index.__int__();
        if (i < 0 || this._.length <= i) {
          throw new Error("out of index");
        }
        this._[i] = this.__elem__($item);
      }

      return this;
    });

    builder.addMethod("clipPut", {
      args: "index; item"
    }, function($index, $item) {
      throwIfImmutable(this);

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.clipIndex($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.clipIndex($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    });

    builder.addMethod("wrapPut", {
      args: "index; item"
    }, function($index, $item) {
      throwIfImmutable(this);

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.wrapIndex($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.wrapIndex($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    });

    builder.addMethod("foldPut", {
      args: "index; item"
    }, function($index, $item) {
      throwIfImmutable(this);

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.foldIndex($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.foldIndex($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    });

    builder.addMethod("removeAt", {
      args: "index"
    }, function($index) {
      var raw = this._;
      var index;

      throwIfImmutable(this);

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      return raw.splice(index, 1)[0];
    });

    builder.addMethod("takeAt", {
      args: "index"
    }, function($index) {
      var raw = this._;
      var index, ret, instead;

      throwIfImmutable(this);

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      ret = raw[index];
      instead = raw.pop();
      if (index !== raw.length) {
        raw[index] = instead;
      }

      return ret;
    });

    builder.addMethod("indexOf", {
      args: "item"
    }, function($item) {
      var index = this._.indexOf($item);
      return index === -1 ? $nil : $.Integer(index);
    });

    builder.addMethod("indexOfGreaterThan", {
      args: "val"
    }, function($val) {
      var raw = this._;
      var val, i, imax = raw.length;

      val = $val.__num__();
      for (i = 0; i < imax; ++i) {
        if (raw[i].__num__() > val) {
          return $.Integer(i);
        }
      }

      return $nil;
    });

    builder.addMethod("takeThese", {
      args: "func"
    }, function($func) {
      var raw = this._;
      var i = 0, $i;

      $i = $.Integer(i);
      while (i < raw.length) {
        if ($func.value(raw[i], $i).__bool__()) {
          this.takeAt($i);
        } else {
          $i = $.Integer(++i);
        }
      }

      return this;
    });

    builder.addMethod("replace", {
      args: "find; replace"
    }, function($find, $replace) {
      var $index, $out, $array;

      throwIfImmutable(this);

      $out     = $.Array();
      $array   = this;
      $find    = $find.asArray();
      $replace = $replace.asArray();
      $.Func(function() {
        return ($index = $array.find($find)).notNil();
      }).while($.Func(function() {
        $out = $out ["++"] ($array.keep($index)) ["++"] ($replace);
        $array = $array.drop($index ["+"] ($find.size()));
        return $array;
      }));

      return $out ["++"] ($array);
    });

    builder.addMethod("slotSize", function() {
      return this.size();
    });

    builder.addMethod("slotAt", function($index) {
      return this.at($index);
    });

    builder.addMethod("slotPut", function($index, $value) {
      return this.put($index, $value);
    });

    builder.addMethod("slotKey", function($index) {
      return $index;
    });

    builder.addMethod("slotIndex", function() {
      return $nil;
    });

    builder.addMethod("getSlots", function() {
      return this.copy();
    });

    builder.addMethod("setSlots", function($array) {
      return this.overWrite($array);
    });

    builder.addMethod("atModify", {
      args: "index; function"
    }, function($index, $function) {
      this.put($index, $function.value(this.at($index), $index));
      return this;
    });

    builder.addMethod("atInc", {
      args: "index; inc=1"
    }, function($index, $inc) {
      this.put($index, this.at($index).$("+", [ $inc ]));
      return this;
    });

    builder.addMethod("atDec", {
      args: "index; dec=1"
    }, function($index, $dec) {
      this.put($index, this.at($index).$("-", [ $dec ]));
      return this;
    });

    builder.addMethod("isArray", 3);
    builder.addMethod("asArray");

    builder.addMethod("copyRange", {
      args: "start; end"
    }, function($start, $end) {
      var start, end, instance, raw;

      if ($start === $nil) {
        start = 0;
      } else {
        start = $start.__int__();
      }
      if ($end === $nil) {
        end = this._.length;
      } else {
        end = $end.__int__();
      }
      raw = this._.slice(start, end + 1);

      instance = new this.__Spec([]);
      instance._ = raw;
      return instance;
    });

    builder.addMethod("copySeries", {
      args: "first; second; last"
    }, function($first, $second, $last) {
      var i, first, second, last, step, instance, raw;

      raw = [];
      if ($first === $nil) {
        first = 0;
      } else {
        first = $first.__int__();
      }
      if ($second === $nil) {
        second = first + 1;
      } else {
        second = $second.__int__();
      }
      if ($last === $nil) {
        last = Infinity;
      } else {
        last = $last.__int__();
      }
      last = Math.max(0, Math.min(last, this._.length - 1));
      step = second - first;

      if (step > 0) {
        for (i = first; i <= last; i += step) {
          raw.push(this._[i]);
        }
      } else if (step < 0) {
        for (i = first; i >= last; i += step) {
          raw.push(this._[i]);
        }
      }

      instance = new this.__Spec([]);
      instance._ = raw;
      return instance;
    });

    builder.addMethod("putSeries", {
      args: "first; second; last; value"
    }, function($first, $second, $last, $value) {
      var i, first, second, last, step;

      throwIfImmutable(this);

      if ($first === $nil) {
        first = 0;
      } else {
        first = $first.__int__();
      }
      if ($second === $nil) {
        second = first + 1;
      } else {
        second = $second.__int__();
      }
      if ($last === $nil) {
        last = Infinity;
      } else {
        last = $last.__int__();
      }
      last = Math.max(0, Math.min(last, this._.length - 1));
      step = second - first;

      $value = this.__elem__($value);

      if (step > 0) {
        for (i = first; i <= last; i += step) {
          this._[i] = $value;
        }
      } else if (step < 0) {
        for (i = first; i >= last; i += step) {
          this._[i] = $value;
        }
      }

      return this;
    });

    builder.addMethod("add", {
      args: "item"
    }, function($item) {
      throwIfImmutable(this);
      this._.push(this.__elem__($item));

      return this;
    });

    builder.addMethod("addAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this;

      throwIfImmutable(this);

      if ($aCollection.isCollection().__bool__()) {
        $aCollection.do($.Func(function($item) {
          return $this._.push($this.__elem__($item));
        }));
      } else {
        this.add($aCollection);
      }

      return this;
    });

    builder.addMethod("putEach", {
      args: "keys; values"
    }, function($keys, $values) {
      var keys, values, i, imax;

      throwIfImmutable(this);

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], this.__elem__(values[i % values.length]));
      }

      return this;
    });

    builder.addMethod("extend", {
      args: "size; item"
    }, function($size, $item) {
      var instance, raw, size, i;

      raw  = this._.slice();
      size = $size.__int__();
      if (raw.length > size) {
        raw.splice(size);
      } else if (raw.length < size) {
        for (i = size - raw.length; i--; ) {
          raw.push(this.__elem__($item));
        }
      }

      instance = new this.__Spec([]);
      instance._ = raw;
      return instance;
    });

    builder.addMethod("insert", {
      args: "index; item"
    }, function($index, $item) {
      var index;

      throwIfImmutable(this);

      index = Math.max(0, $index.__int__());
      this._.splice(index, 0, this.__elem__($item));

      return this;
    });

    builder.addMethod("move", function($fromIndex, $toIndex) {
      return this.insert($toIndex, this.removeAt($fromIndex));
    });

    builder.addMethod("addFirst", {
      args: "item"
    }, function($item) {
      var instance, raw;

      raw = this._.slice();
      raw.unshift(this.__elem__($item));

      instance = new this.__Spec([]);
      instance._ = raw;
      return instance;
    });

    builder.addMethod("addIfNotNil", {
      args: "item"
    }, function($item) {
      if ($item === $nil) {
        return this;
      }
      return this.addFirst(this.__elem__($item));
    });

    builder.addMethod("pop", function() {
      if (this._.length === 0) {
        return $nil;
      }
      throwIfImmutable(this);
      return this._.pop();
    });

    builder.addMethod("++", function($anArray) {
      var instance, raw;

      raw = this._.slice();

      instance = new this.__Spec([]);
      instance._ = raw;
      if ($anArray !== $nil) {
        instance.addAll($anArray);
      }
      return instance;
    });

    // TODO: implements overWrite
    // TODO: implements grow
    // TODO: implements growClear

    builder.addMethod("seriesFill", {
      args: "start; step"
    }, function($start, $step) {
      var i, imax;

      for (i = 0, imax = this._.length; i < imax; ++i) {
        this.put($.Integer(i), $start);
        $start = $start.$("+", [ $step ]);
      }

      return this;
    });

    builder.addMethod("fill", {
      args: "value"
    }, function($value) {
      var raw, i, imax;

      throwIfImmutable(this);

      $value = this.__elem__($value);

      raw = this._;
      for (i = 0, imax = raw.length; i < imax; ++i) {
        raw[i] = $value;
      }

      return this;
    });

    builder.addMethod("do", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.array$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("reverseDo", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.array$reverseDo(this),
        $function
      );
      return this;
    });

    builder.addMethod("reverse", function() {
      var $res = this.copy();
      $res._.reverse();
      return $res;
    });

    builder.addMethod("windex", function() {
      var raw = this._;
      var x, r, i, imax;

      // <-- _ArrayWindex -->
      x = 0;
      r = random.next();
      for (i = 0, imax = raw.length; i < imax; ++i) {
        x += raw[i].__num__();
        if (x >= r) {
          return $.Integer(i);
        }
      }

      return $int0;
    });

    builder.addMethod("normalizeSum", function() {
      return this ["*"] (this.sum().reciprocal());
    });

    builder.addMethod("normalize", {
      args: "min=0.0; max=1.0"
    }, function($min, $max) {
      var $minItem, $maxItem;

      $minItem = this.minItem();
      $maxItem = this.maxItem();
      return this.collect($.Func(function($el) {
        return $el.$("linlin", [ $minItem, $maxItem, $min, $max ]);
      }));
    });

    // TODO: implements asciiPlot
    // TODO: implements perfectShuffle
    // TODO: implements performInPlace

    builder.addMethod("clipExtend", {
      args: "length"
    }, function($length) {
      var last = this._[this._.length - 1] || $nil;
      return this.extend($length, last);
    });

    builder.addMethod("rank", function() {
      return $int1 ["+"] (this.first().rank());
    });

    builder.addMethod("shape", function() {
      return $.Array([ this.size() ]) ["++"] (this.at($int0).$("shape"));
    });

    builder.addMethod("reshape", function() {
      var $result;
      var shape, size, i, imax;

      shape = _.toArray(arguments);

      size = 1;
      for (i = 0, imax = shape.length; i < imax; ++i) {
        size *= shape[i].__int__();
      }

      $result = this.flat().wrapExtend($.Integer(size));
      for (i = imax - 1; i >= 1; --i) {
        $result = $result.clump(shape[i]);
      }

      return $result;
    });

    builder.addMethod("reshapeLike", {
      args: "another; indexing=\\wrapAt"
    }, function($another, $indexing) {
      var $index, $flat;

      $index = $int0;
      $flat  = this.flat();

      return $another.deepCollect($.Integer(0x7FFFFFFF), $.Func(function() {
        var $item = $flat.perform($indexing, $index);
        $index = $index.__inc__();
        return $item;
      }));
    });

    // TODO: implements deepCollect
    // TODO: implements deepDo

    builder.addMethod("unbubble", {
      args: "depth=0; levels=1"
    }, function($depth, $levels) {
      if ($depth.__num__() <= 0) {
        if (this.size().__int__() > 1) {
          return this;
        }
        if ($levels.__int__() <= 1) {
          return this.at($int0);
        }
        return this.at($int0).unbubble($depth, $levels.__dec__());
      }

      return this.collect($.Func(function($item) {
        return $item.unbubble($depth.__dec__());
      }));
    });

    builder.addMethod("bubble", {
      args: "depth=0; levels=1"
    }, function($depth, $levels) {
      if ($depth.__int__() <= 0) {
        if ($levels.__int__() <= 1) {
          return $.Array([ this ]);
        }
        return $.Array([ this.bubble($depth, $levels.__dec__()) ]);
      }

      return this.collect($.Func(function($item) {
        return $item.bubble($depth.__dec__(), $levels);
      }));
    });

    builder.addMethod("slice", {
      args: "*cuts"
    }, function($$cuts) {
      var $firstCut, $list;
      var lenOfCuts, cuts;

      lenOfCuts = $$cuts.size().__int__();
      if (lenOfCuts === 0) {
        return this.copy();
      }

      $firstCut = $$cuts.at($int0);
      if ($firstCut === $nil) {
        $list = this.copy();
      } else {
        $list = this.at($firstCut.asArray());
      }

      if (lenOfCuts === 1) {
        return $list.unbubble();
      }

      cuts = $$cuts._.slice(1);
      return $list.collect($.Func(function($item) {
        return $item.$("slice", cuts);
      })).unbubble();
    });

    builder.addClassMethod("iota", function() {
      var $a;
      var args, product, i, imax, a;

      args = arguments;

      product = 1;
      for (i = 0, imax = args.length; i < imax; ++i) {
        product *= args[i].__int__();
      }

      a = new Array(product);
      for (i = 0; i < product; ++i) {
        a[i] = $.Integer(i);
      }

      $a = $.Array(a);
      return $a.reshape.apply($a, args);
    });

    // TODO: implements asRandomTable
    // TODO: implements tableRand
    // TODO: implements msgSize
    // TODO: implements bundleSize
    // TODO: implements clumpBundles

    builder.addMethod("includes", function($item) {
      return $.Boolean(this._.indexOf($item) !== -1);
    });

    builder.addMethod("asString", function() {
      return $.String("[ " + this._.map(function($elem) {
        return $elem.asString().__str__();
      }).join(", ") + " ]");
    });

    /* istanbul ignore next */
    builder.addMethod("__sort__", function($function) {
      throwIfImmutable(this);
      this._.sort(function($a, $b) {
        return $function.value($a, $b).__bool__() ? -1 : 1;
      });
    });
  });

  sc.lang.klass.refine("RawArray", function(builder) {
    var SCArray = $("Array");

    builder.addMethod("archiveAsCompileString", 3);
    builder.addMethod("archiveAsObject", 3);

    builder.addMethod("rate", function() {
      return $.Symbol("scalar");
    });

    // TODO: implements readFromStream

    builder.addMethod("powerset", function() {
      return this.as(SCArray).powerset();
    });
  });

  sc.lang.klass.define("Int8Array : RawArray", function(builder) {
    var int8 = new Int8Array(1);

    builder.addMethod("valueOf", function() {
      return new Int8Array(this._.map(function($elem) {
        return $elem.__int__();
      }));
    });

    builder.addMethod("__elem__", function(item) {
      int8[0] = item ? item.__int__() : 0;
      return $.Integer(int8[0]);
    });
  });

  sc.lang.klass.define("Int16Array : RawArray", function(builder) {
    var int16 = new Int16Array(1);

    builder.addMethod("valueOf", function() {
      return new Int16Array(this._.map(function($elem) {
        return $elem.__int__();
      }));
    });

    builder.addMethod("__elem__", function(item) {
      int16[0] = item ? item.__int__() : 0;
      return $.Integer(int16[0]);
    });
  });

  sc.lang.klass.define("Int32Array : RawArray", function(builder) {
    var int32 = new Int32Array(1);

    builder.addMethod("valueOf", function() {
      return new Int32Array(this._.map(function($elem) {
        return $elem.__int__();
      }));
    });

    builder.addMethod("__elem__", function(item) {
      int32[0] = item ? item.__int__() : 0;
      return $.Integer(int32[0]);
    });
  });

  sc.lang.klass.define("FloatArray : RawArray", function(builder) {
    var float32 = new Float32Array(1);

    builder.addMethod("valueOf", function() {
      return new Float32Array(this._.map(function($elem) {
        return $elem.__num__();
      }));
    });

    builder.addMethod("__elem__", function(item) {
      float32[0] = item ? item.__num__() : 0;
      return $.Float(float32[0]);
    });
  });

  sc.lang.klass.define("DoubleArray : RawArray", function(builder) {
    var float64 = new Float64Array(1);

    builder.addMethod("valueOf", function() {
      return new Float64Array(this._.map(function($elem) {
        return $elem.__num__();
      }));
    });

    builder.addMethod("__elem__", function(item) {
      float64[0] = item ? item.__num__() : 0;
      return $.Float(float64[0]);
    });
  });
});

// src/sc/classlib/Collections/String.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var $nil   = $.nil;
  var $false = $.false;
  var $space = $.Char(" ");

  sc.lang.klass.refine("String", function(builder) {
    builder.addMethod("__str__", function() {
      return this.valueOf();
    });

    builder.addMethod("__elem__", function($item) {
      if (!$item) {
        return $space;
      }
      if ($item.__tag !== 4) {
        throw new TypeError("Wrong type.");
      }
      return $item;
    });

    builder.addMethod("valueOf", function() {
      return this._.map(function(elem) {
        return elem.__str__();
      }).join("");
    });

    builder.addMethod("toString", function() {
      return this.valueOf();
    });

    // TODO: implements unixCmdActions
    // TODO: implements unixCmdActions_
    // TODO: implements $initClass
    // TODO: implements $doUnixCmdAction
    // TODO: implements unixCmd
    // TODO: implements unixCmdGetStdOut

    builder.addMethod("asSymbol", function() {
      return $.Symbol(this.__str__());
    });

    builder.addMethod("asInteger", function() {
      var m = /^[-+]?\d+/.exec(this.__str__());
      return $.Integer(m ? m[0]|0 : 0);
    });

    builder.addMethod("asFloat", function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this.__str__());
      return $.Float(m ? +m[0] : 0);
    });

    builder.addMethod("ascii", function() {
      var raw = this.__str__();
      var a, i, imax;

      a = new Array(raw.length);
      for (i = 0, imax = a.length; i < imax; ++i) {
        a[i] = $.Integer(raw.charCodeAt(i));
      }

      return $.Array(a);
    });

    // TODO: implements stripRTF
    // TODO: implements stripHTML
    // TODO: implements $scDir

    builder.addMethod("compare", {
      args: "aString; ignoreCase=false"
    }, function($aString, $ignoreCase) {
      var araw, braw, length, i, a, b, cmp, func;

      if ($aString.__tag !== 7) {
        return $nil;
      }

      araw = this._;
      braw = $aString._;
      length = Math.min(araw.length, braw.length);

      if ($ignoreCase.__bool__()) {
        func = function(ch) {
          return ch.toLowerCase();
        };
      } else {
        func = function(ch) {
          return ch;
        };
      }
      for (i = 0; i < length; i++) {
        a = func(araw[i]._).charCodeAt(0);
        b = func(braw[i]._).charCodeAt(0);
        cmp = a - b;
        if (cmp !== 0) {
          return $.Integer(cmp < 0 ? -1 : +1);
        }
      }

      if (araw.length < braw.length) {
        cmp = -1;
      } else if (araw.length > braw.length) {
        cmp = 1;
      }

      return $.Integer(cmp);
    });

    builder.addMethod("<", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() < 0
      );
    });

    builder.addMethod(">", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() > 0
      );
    });

    builder.addMethod("<=", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() <= 0
      );
    });

    builder.addMethod(">=", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() >= 0
      );
    });

    builder.addMethod("==", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() === 0
      );
    });

    builder.addMethod("!=", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() !== 0
      );
    });

    // TODO: implements hash

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector, $aNumber) {
      return $aNumber.asString().perform($aSelector, this);
    });

    builder.addMethod("performBinaryOpOnComplex", function($aSelector, $aComplex) {
      return $aComplex.asString().perform($aSelector, this);
    });

    builder.addMethod("multiChannelPerform", function() {
      throw new Error("String:multiChannelPerform. Cannot expand strings.");
    });

    builder.addMethod("isString", 3);

    builder.addMethod("asString");

    builder.addMethod("asCompileString", function() {
      return $.String("\"" + this.__str__() + "\"");
    });

    builder.addMethod("species", function() {
      return $("String");
    });

    builder.addMethod("postln", function() {
      sc.lang.io.post(this.__str__() + "\n");
      return this;
    });

    builder.addMethod("post", function() {
      sc.lang.io.post(this.__str__());
      return this;
    });

    builder.addMethod("postcln", function() {
      sc.lang.io.post("// " + this.__str__() + "\n");
      return this;
    });

    builder.addMethod("postc", function() {
      sc.lang.io.post("// " + this.__str__());
      return this;
    });

    // TODO: implements postf
    // TODO: implements format
    // TODO: implements matchRegexp
    // TODO: implements fformat
    // TODO: implements die
    // TODO: implements error
    // TODO: implements warn
    // TODO: implements inform

    builder.addMethod("++", function($anObject) {
      return $.String(
        this.toString() + $anObject.asString().toString()
      );
    });

    builder.addMethod("+", function($anObject) {
      return $.String(
        this.toString() + " " + $anObject.asString().toString()
      );
    });
    // TODO: implements catArgs
    // TODO: implements scatArgs
    // TODO: implements ccatArgs
    // TODO: implements catList
    // TODO: implements scatList
    // TODO: implements ccatList
    // TODO: implements split
    // TODO: implements containsStringAt
    // TODO: implements icontainsStringAt
    // TODO: implements contains
    // TODO: implements containsi
    // TODO: implements findRegexp
    // TODO: implements findAllRegexp
    // TODO: implements find
    // TODO: implements findBackwards
    // TODO: implements endsWith
    // TODO: implements beginsWith
    // TODO: implements findAll
    // TODO: implements replace
    // TODO: implements escapeChar
    // TODO: implements shellQuote
    // TODO: implements quote
    // TODO: implements tr
    // TODO: implements insert
    // TODO: implements wrapExtend
    // TODO: implements zeroPad
    // TODO: implements padLeft
    // TODO: implements padRight
    // TODO: implements underlined
    // TODO: implements scramble
    // TODO: implements rotate
    // TODO: implements compile
    // TODO: implements interpret
    // TODO: implements interpretPrint
    // TODO: implements $readNew
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements inspectorClass
    // TODO: implements standardizePath
    // TODO: implements realPath
    // TODO: implements withTrailingSlash
    // TODO: implements withoutTrailingSlash
    // TODO: implements absolutePath
    // TODO: implements pathMatch
    // TODO: implements load
    // TODO: implements loadPaths
    // TODO: implements loadRelative
    // TODO: implements resolveRelative
    // TODO: implements include
    // TODO: implements exclude
    // TODO: implements basename
    // TODO: implements dirname
    // TODO: implements splittext
    // TODO: implements +/+
    // TODO: implements asRelativePath
    // TODO: implements asAbsolutePath
    // TODO: implements systemCmd
    // TODO: implements gethostbyname
    // TODO: implements getenv
    // TODO: implements setenv
    // TODO: implements unsetenv
    // TODO: implements codegen_UGenCtorArg
    // TODO: implements ugenCodeString
    // TODO: implements asSecs
    // TODO: implements speak
    // TODO: implements toLower
    // TODO: implements toUpper
    // TODO: implements mkdir
    // TODO: implements parseYAML
    // TODO: implements parseYAMLFile
  });
});

// src/sc/classlib/Collections/Set.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var SCArray = $("Array");

  sc.lang.klass.refine("Set", function(builder) {
    builder.addProperty("<>", "array");

    builder.addClassMethod("new", {
      args: "n=2"
    }, function($n) {
      $n = $.Integer(Math.max($n.__int__(), 2) * 2);
      return this.__super__("new").initSet($n);
    });

    builder.addMethod("valueOf", function() {
      return this._$array._.filter(function($elem) {
        return $elem !== $nil;
      }).map(function($elem) {
        return $elem.valueOf();
      });
    });

    builder.addMethod("size", function() {
      return $.Integer(this._size);
    });

    builder.addMethod("species", function() {
      return this.class();
    });

    builder.addMethod("copy", function() {
      return this.shallowCopy().array_(this._$array.copy());
    });

    builder.addMethod("do", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.set$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("clear", function() {
      this._$array.fill();
      this._size = 0;
      return this;
    });

    builder.addMethod("makeEmpty", function() {
      this.clear();
      return this;
    });

    builder.addMethod("includes", {
      args: "item"
    }, function($item) {
      return this._$array.at(this.scanFor($item)).notNil();
    });

    builder.addMethod("findMatch", {
      args: "item"
    }, function($item) {
      return this._$array.at(this.scanFor($item));
    });

    builder.addMethod("add", {
      args: "item"
    }, function($item) {
      var $index;

      if ($item === $nil) {
        throw new Error("A Set cannot contain nil.");
      }

      $index = this.scanFor($item);
      if (this._$array.at($index) === $nil) {
        this.putCheck($index, $item);
      }

      return this;
    });

    builder.addMethod("remove", {
      args: "item"
    }, function($item) {
      var $index;

      $index = this.scanFor($item);
      if (this._$array.at($index) !== $nil) {
        this._$array.put($index, $nil);
        this._size -= 1;
        // this.fixCollisionsFrom($index);
      }

      return this;
    });

    builder.addMethod("choose", function() {
      var $val;
      var $size, $array;

      if (this._size <= 0) {
        return $nil;
      }

      $array = this._$array;
      $size  = $array.size();

      do {
        $val = $array.at($size.rand());
      } while ($val === $nil);

      return $val;
    });

    builder.addMethod("pop", function() {
      var $index, $val;
      var $array, $size;

      $index = $int0;
      $array = this._$array;
      $size  = $array.size();

      while ($index < $size && ($val = $array.at($index)) === $nil) {
        $index = $index.__inc__();
      }

      if ($index < $size) {
        this.remove($val);
        return $val;
      }

      return $nil;
    });

    // TODO: implements powerset

    builder.addMethod("unify", function() {
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($x) {
        $result.addAll($x);
      });

      return $result;
    });

    builder.addMethod("sect", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($item) {
        if ($item !== $nil && $that.$("includes", [ $item ]).__bool__()) {
          $result.add($item);
        }
      });

      return $result;
    });

    builder.addMethod("union", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.species().new();

      $result.addAll(this);
      $result.addAll($that);

      return $result;
    });

    builder.addMethod("difference", {
      args: "that"
    }, function($that) {
      return this.copy().removeAll($that);
    });

    builder.addMethod("symmetricDifference", {
      args: "that"
    }, function($that) {
      var $this = this;
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($item) {
        if ($item !== $nil && !$that.$("includes", [ $item ]).__bool__()) {
          $result.add($item);
        }
      });
      $that.do($.Func(function($item) {
        if (!$this.includes($item).__bool__()) {
          $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("isSubsetOf", {
      args: "that"
    },function($that) {
      return $that.$("includesAll", [ this ]);
    });

    builder.addMethod("&", function($that) {
      return this.sect($that);
    });

    builder.addMethod("|", function($that) {
      return this.union($that);
    });

    builder.addMethod("-", function($that) {
      return this.difference($that);
    });

    builder.addMethod("--", function($that) {
      return this.symmetricDifference($that);
    });

    builder.addMethod("asSet");

    builder.addMethod("initSet", function($n) {
      this._$array = SCArray.newClear($n);
      this._size   = 0;
      return this;
    });

    builder.addMethod("putCheck", function($index, $item) {
      this._$array.put($index, $item);
      this._size += 1;
      this.fullCheck();
      return this;
    });

    builder.addMethod("fullCheck", function() {
      if (this._$array.size().__int__() < this._size * 2) {
        this.grow();
      }
    });

    builder.addMethod("grow", function() {
      var array, i, imax;
      array = this._$array._;
      for (i = array.length, imax = i * 2; i < imax; ++i) {
        array[i] = $nil;
      }
    });

    /* istanbul ignore next */
    builder.addMethod("scanFor", function($obj) {
      var array, index;

      array = this._$array._;

      index = array.indexOf($obj);
      if (index !== -1) {
        return $.Integer(index);
      }

      index = array.indexOf($nil);
      if (index !== -1) {
        return $.Integer(index);
      }

      return $.Integer(-1);
    });
    // TODO: implements fixCollisionsFrom
    // TODO: implements keyAt
  });
});

// src/sc/classlib/Collections/Association.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $false = $.false;

  sc.lang.klass.refine("Association", function(builder, _) {
    builder.addProperty("<>", "key");
    builder.addProperty("<>", "value");

    builder.addMethod("valueOf", function() {
      return this._$key.valueOf();
    });

    builder.addClassMethod("new", function($key, $value) {
      return _.newCopyArgs(this, {
        key: $key,
        value: $value
      });
    });

    builder.addMethod("==", function($anAssociation) {
      if ($anAssociation.key) {
        return this._$key ["=="] ($anAssociation.$("key"));
      }
      return $false;
    });

    builder.addMethod("hash", function() {
      return this._$key.hash();
    });

    builder.addMethod("<", function($anAssociation) {
      return this._$key.$("<", [ $anAssociation.$("key") ]);
    });
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements embedInStream
    // TODO: implements transformEvent
  });
});

// src/sc/classlib/Collections/Dictionary.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int1  = $.int1;
  var SCSet = $("Set");
  var SCArray = $("Array");
  var SCAssociation = $("Association");

  function incrementSize($this) {
    $this._size += 1;
    if ($this._$array.size().__inc__() < $this._size * 4) {
      $this.grow();
    }
  }

  sc.lang.klass.refine("Dictionary", function(builder, _) {
    builder.addClassMethod("new", {
      args: "n=8"
    }, function($n) {
      return this.__super__("new", [ $n ]);
    });

    builder.addMethod("valueOf", function() {
      var obj;
      var array, i, imax;

      obj = {};

      array = this._$array._;
      for (i = 0, imax = array.length; i < imax; i += 2) {
        if (array[i] !== $nil) {
          obj[array[i].valueOf()] = array[i + 1].valueOf();
        }
      }

      return obj;
    });

    builder.addClassMethod("newFrom", {
      args: "aCollection"
    }, function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.$("keysValuesDo", [ $.Func(function($k, $v) {
        return $newCollection.put($k, $v);
      }) ]);

      return $newCollection;
    });

    builder.addMethod("at", {
      args: "key"
    }, function($key) {
      return this._$array.at(this.scanFor($key).__inc__());
    });

    builder.addMethod("atFail", {
      args: "key; function"
    }, function($key, $function) {
      var $val;

      $val = this.at($key);
      if ($val === $nil) {
        $val = $function.value();
      }

      return $val;
    });

    builder.addMethod("matchAt", {
      args: "key"
    }, function($key) {
      var ret = null;

      this.keysValuesDo($.Func(function($k, $v) {
        if ($k.matchItem($key).__bool__()) {
          ret = $v;
          this.break();
        }
        return $nil;
      }));

      return ret || $nil;
    });

    builder.addMethod("trueAt", {
      args: "key"
    }, function($key) {
      var $ret;

      $ret = this.at($key);

      return $ret !== $nil ? $ret : $false;
    });

    builder.addMethod("add", {
      args: "anAssociation"
    }, function($anAssociation) {
      this.put($anAssociation.$("key"), $anAssociation.$("value"));
      return this;
    });

    builder.addMethod("put", {
      args: "key; value"
    }, function($key, $value) {
      var $array, $index;

      if ($value === $nil) {
        this.removeAt($key);
      } else {
        $array = this._$array;
        $index = this.scanFor($key);
        $array.put($index.__inc__(), $value);
        if ($array.at($index) === $nil) {
          $array.put($index, $key);
          incrementSize(this);
        }
      }

      return this;
    });

    builder.addMethod("putAll", function() {
      var $this = this;
      var $loopfunc;

      $loopfunc = $.Func(function($key, $value) {
        return $this.put($key, $value);
      });

      _.toArray(arguments).forEach(function($dict) {
        $dict.keysValuesDo($loopfunc);
      }, this);

      return this;
    });

    builder.addMethod("putPairs", {
      args: "args"
    }, function($args) {
      var $this = this;

      $args.$("pairsDo", [ $.Func(function($key, $val) {
        return $this.put($key, $val);
      }) ]);

      return this;
    });

    builder.addMethod("getPairs", {
      args: "args"
    }, function($args) {
      var $this = this;
      var $result;

      if ($args === $nil) {
        $args = this.keys();
      }

      $result = $nil;
      $args.do($.Func(function($key) {
        var $val;
        $val = $this.at($key);
        if ($val !== $nil) {
          $result = $result.add($key).add($val);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("associationAt", {
      args: "key"
    }, function($key) {
      var $res;
      var array, index;

      array = this._$array._;
      index = this.scanFor($key).__int__();

      /* istanbul ignore else */
      if (index >= 0) {
        $res = SCAssociation.new(array[index], array[index + 1]);
      }

      return $res || /* istanbul ignore next */ $nil;
    });

    builder.addMethod("associationAtFail", {
      args: "argKey; function"
    }, function($argKey, $function) {
      var $index, $key;

      $index = this.scanFor($argKey);
      $key   = this._$array.at($index);

      if ($key === $nil) {
        return $function.value();
      }

      return SCAssociation.new($key, this._$array.at($index.__inc__()));
    });

    builder.addMethod("keys", {
      args: "species"
    }, function($species) {
      var $set;

      if ($species === $nil) {
        $species = SCSet;
      }

      $set = $species.new(this.size());
      this.keysDo($.Func(function($key) {
        return $set.add($key);
      }));

      return $set;
    });

    builder.addMethod("values", function() {
      var $list;

      $list = $("List").new(this.size());
      this.do($.Func(function($value) {
        return $list.add($value);
      }));

      return $list;
    });

    builder.addMethod("includes", {
      args: "item1"
    }, function($item1) {
      var $ret = null;

      this.do($.Func(function($item2) {
        if ($item1 ["=="] ($item2).__bool__()) {
          $ret = $true;
          this.break();
        }
        return $nil;
      }));

      return $ret || $false;
    });

    builder.addMethod("includesKey", {
      args: "key"
    }, function($key) {
      return this.at($key).notNil();
    });

    builder.addMethod("removeAt", {
      args: "key"
    }, function($key) {
      var $array;
      var $val, $index, $atKeyIndex;

      $array = this._$array;
      $index = this.scanFor($key);
      $atKeyIndex = $array.at($index);
      if ($atKeyIndex === $nil) {
        return $nil;
      }

      $val = $array.at($index.__inc__());
      $array.put($index, $nil);
      $array.put($index.__inc__(), $nil);

      this._size -= 1;

      // this.fixCollisionsFrom($index);

      return $val;
    });

    builder.addMethod("removeAtFail", {
      args: "key; function"
    }, function($key, $function) {
      var $array;
      var $val, $index, $atKeyIndex;

      $array = this._$array;
      $index = this.scanFor($key);
      $atKeyIndex = $array.at($index);

      if ($atKeyIndex === $nil) {
        return $function.value();
      }

      $val = $array.at($index.__inc__());
      $array.put($index, $nil);
      $array.put($index.__inc__(), $nil);

      this._size -= 1;

      // this.fixCollisionsFrom($index);

      return $val;
    });

    builder.shouldNotImplement("remove");
    builder.shouldNotImplement("removeFail");

    builder.addMethod("keysValuesDo", {
      args: "function"
    }, function($function) {
      this.keysValuesArrayDo(this._$array, $function);
      return this;
    });

    builder.addMethod("keysValuesChange", {
      args: "function"
    }, function($function) {
      var $this = this;

      this.keysValuesDo($.Func(function($key, $value, $i) {
        return $this.put($key, $function.value($key, $value, $i));
      }));

      return this;
    });

    builder.addMethod("do", {
      args: "function"
    },  function($function) {
      this.keysValuesDo($.Func(function($key, $value, $i) {
        return $function.value($value, $i);
      }));
      return this;
    });

    builder.addMethod("keysDo", {
      args: "function"
    },  function($function) {
      this.keysValuesDo($.Func(function($key, $val, $i) {
        return $function.value($key, $i);
      }));
      return this;
    });

    builder.addMethod("associationsDo", {
      args: "function"
    },  function($function) {
      this.keysValuesDo($.Func(function($key, $val, $i) {
        var $assoc = SCAssociation.new($key, $val);
        return $function.value($assoc, $i);
      }));
      return this;
    });

    builder.addMethod("pairsDo", {
      args: "function"
    },  function($function) {
      this.keysValuesArrayDo(this._$array, $function);
      return this;
    });

    builder.addMethod("collect", {
      args: "function"
    },  function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $elem) {
        return $res.put($key, $function.value($elem, $key));
      }));

      return $res;
    });

    builder.addMethod("select", {
      args: "function"
    },  function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $elem) {
        if ($function.value($elem, $key).__bool__()) {
          $res.put($key, $elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("reject", {
      args: "function"
    },  function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $elem) {
        if (!$function.value($elem, $key).__bool__()) {
          $res.put($key, $elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("invert", function() {
      var $dict;

      $dict = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $val) {
        return $dict.put($val, $key);
      }));

      return $dict;
    });

    builder.addMethod("merge", {
      args: "that; func; fill=true"
    }, function($that, $func, $fill) {
      var $this = this;
      var $commonKeys, $myKeys, $otherKeys;
      var $res;

      $res = this.class().new();

      $myKeys    = this.keys();
      $otherKeys = $that.keys();

      if ($myKeys ["=="] ($otherKeys).__bool__()) {
        $commonKeys = $myKeys;
      } else {
        $commonKeys = $myKeys.sect($otherKeys);
      }

      $commonKeys.do($.Func(function($key) {
        return $res.put($key, $func.value($this.at($key), $that.at($key), $key));
      }));

      if ($fill.__bool__()) {
        $myKeys.difference($otherKeys).do($.Func(function($key) {
          return $res.put($key, $this.at($key));
        }));
        $otherKeys.difference($myKeys).do($.Func(function($key) {
          return $res.put($key, $that.at($key));
        }));
      }

      return $res;
    });

    // TODO: implements blend

    builder.addMethod("findKeyForValue", {
      args: "argValue"
    }, function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._$array, $.Func(function($key, $val) {
        if ($argValue ["=="] ($val).__bool__()) {
          $ret = $key;
          this.break();
        }
        return $nil;
      }));

      return $ret || $nil;
    });

    builder.addMethod("sortedKeysValuesDo", {
      args: "function; sortFunc"
    }, function($function, $sortFunc) {
      var $this = this;
      var $keys;

      $keys = this.keys(SCArray);
      $keys.sort($sortFunc);

      $keys.do($.Func(function($key, $i) {
        return $function.value($key, $this.at($key), $i);
      }));

      return this;
    });

    builder.addMethod("choose", function() {
      var $array;
      var $size, $index;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }

      $array = this._$array;
      $size  = $array.size() [">>"] ($int1);

      do {
        $index = $size.rand() ["<<"] ($int1);
      } while ($array.at($index) === $nil);

      return $array.at($index.__inc__());
    });

    builder.addMethod("order", {
      args: "func"
    }, function($func) {
      var $assoc;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }

      $assoc = $nil;
      this.keysValuesDo($.Func(function($key, $val) {
        $assoc = $assoc.add($key.$("->", [ $val ]));
        return $assoc;
      }));

      return $assoc.sort($func).collect($.Func(function($_) {
        return $_.$("key");
      }));
    });

    builder.addMethod("powerset", function() {
      var $this = this;
      var $keys, $class;

      $keys  = this.keys().asArray().powerset();
      $class = this.class();

      return $keys.collect($.Func(function($list) {
        var $dict;

        $dict = $class.new();
        $list.do($.Func(function($key) {
          return $dict.put($key, $this.at($key));
        }));

        return $dict;
      }));
    });

    builder.addMethod("transformEvent", {
      args: "event"
    }, function($event) {
      return $event.$("putAll", [ this ]);
    });

    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs

    builder.addMethod("keysValuesArrayDo", function($argArray, $function) {
      var $key, $val;
      var array, j, i, imax;

      array = this._$array._;
      for (i = j = 0, imax = array.length; i < imax; i += 2, ++j) {
        $key = array[i];
        if ($key !== $nil) {
          $val = $argArray.$("at", [ $.Integer(i + 1) ]);
          $function.value($key, $val, $.Integer(j));
        }
      }
    });

    // TODO: implements grow
    // TODO: implements fixCollisionsFrom

    /* istanbul ignore next */
    builder.addMethod("scanFor", function($argKey) {
      var array, i, imax;
      var $elem;

      array = this._$array._;
      imax  = array.length;

      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem ["=="] ($argKey).__bool__()) {
          return $.Integer(i);
        }
      }
      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $nil) {
          return $.Integer(i);
        }
      }

      return $.Integer(-2);
    });

    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
  });

  sc.lang.klass.refine("IdentityDictionary", function(builder) {
    builder.addProperty("<>", "proto");
    builder.addProperty("<>", "parent");
    builder.addProperty("<>", "know");

    builder.addClassMethod("new", {
      args: "n=8; proto; parent; know=false"
    }, function($n, $proto, $parent, $know) {
      return this.__super__("new", [ $n ])
        .proto_($proto).parent_($parent).know_($know);
    });

    builder.addMethod("putGet", {
      args: "key; value"
    }, function($key, $value) {
      var $array, $index, $prev;

      $array = this._$array;
      $index = this.scanFor($key);
      $prev  = $array.at($index.__inc__());
      $array.put($index.__inc__(), $value);
      if ($array.at($index) === $nil) {
        $array.put($index, $key);
        incrementSize(this);
      }

      return $prev;
    });

    builder.addMethod("findKeyForValue", {
      args: "argValue"
    }, function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._$array, $.Func(function($key, $val) {
        if ($argValue === $val) {
          $ret = $key;
          this.break();
        }
        return $nil;
      }));

      return $ret || $nil;
    });

    /* istanbul ignore next */
    builder.addMethod("scanFor", function($argKey) {
      var array, i, imax;
      var $elem;

      array = this._$array._;
      imax  = array.length;

      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $argKey) {
          return $.Integer(i);
        }
      }
      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $nil) {
          return $.Integer(i);
        }
      }

      return $.Integer(-2);
    });
    // TODO: implements freezeAsParent
    // TODO: implements insertParent
    // TODO: implements storeItemsOn
    // TODO: implements doesNotUnderstand
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements timingOffset
  });
});

// src/sc/classlib/Collections/Environment.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;

  sc.lang.klass.refine("Environment", function(builder) {
    var envStack = [];

    builder.addClassMethod("make",function($function) {
      return this.new().make($function);
    });

    builder.addClassMethod("use", function($function) {
      return this.new().use($function);
    });

    builder.addMethod("make", {
      args: "function"
    }, function($function) {
      var $saveEnvir;

      $saveEnvir = sc.lang.main.getCurrentEnvir();
      sc.lang.main.setCurrentEnvir(this);
      try {
        $function.value(this);
      } catch (e) {}
      sc.lang.main.setCurrentEnvir($saveEnvir);

      return this;
    });

    builder.addMethod("use", {
      args: "function"
    }, function($function) {
      var $result, $saveEnvir;

      $saveEnvir = sc.lang.main.getCurrentEnvir();
      sc.lang.main.setCurrentEnvir(this);
      try {
        $result = $function.value(this);
      } catch (e) {}
      sc.lang.main.setCurrentEnvir($saveEnvir);

      return $result || /* istanbul ignore next */ $nil;
    });

    builder.addMethod("eventAt", {
      args: "key"
    }, function($key) {
      return this.at($key);
    });

    builder.addMethod("composeEvents", {
      args: "event"
    }, function($event) {
      return this.copy().putAll($event);
    });

    builder.addClassMethod("pop", function() {
      if (envStack.length) {
        sc.lang.main.setCurrentEnvir(envStack.pop());
      }
      return this;
    });

    builder.addClassMethod("push", {
      args: "envir"
    }, function($envir) {
      envStack.push(sc.lang.main.getCurrentEnvir());
      sc.lang.main.setCurrentEnvir($envir);
      return this;
    });

    builder.addMethod("pop", function() {
      return this.class().pop();
    });

    builder.addMethod("push", function() {
      return this.class().push(this);
    });
    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });
});

// src/sc/classlib/Collections/Event.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var $nil = $.nil;
  var strlib = sc.libs.strlib;

  sc.lang.klass.refine("Event", function(builder) {
    // TODO: implements $default
    // TODO: implements $silent
    // TODO: implements $addEventType
    // TODO: implements next
    // TODO: implements delta
    // TODO: implements play
    // TODO: implements isRest
    // TODO: implements isPlaying_
    // TODO: implements isRunning_
    // TODO: implements playAndDelta
    // TODO: implements synchWithQuant
    // TODO: implements asControlInput
    // TODO: implements asUGenInput
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements $initClass
    // TODO: implements $makeDefaultSynthDef
    // TODO: implements $makeParentEvents
    builder.addMethod("__attr__", function(methodName, args) {
      var $value;

      if (methodName.charAt(methodName.length - 1) === "_") {
        // setter
        methodName = methodName.substr(0, methodName.length - 1);
        if (this[methodName]) {
          sc.lang.io.warn(strlib.format(
            "WARNING: '#{0}' exists a method name, so you can't use it as pseudo-method",
            methodName
          ));
        }
        $value = args[0] || /* istanbul ignore next */ $nil;
        this.put($.Symbol(methodName), $value);
        return $value;
      }

      // getter
      return this.at($.Symbol(methodName));
    });
  });
});

// src/sc/classlib/Collections/Array.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var random  = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  var SCArray = $("Array");
  var $nil = $.nil;

  sc.lang.klass.refine("Array", function(builder, _) {
    builder.addClassMethod("with", function() {
      return $.Array(_.toArray(arguments));
    });

    builder.addMethod("reverse", function() {
      return $.Array(this._.slice().reverse());
    });

    builder.addMethod("scramble", function() {
      var a, tmp, i, j, m;

      a = this._.slice();
      m = a.length;
      if (m > 1) {
        for (i = 0; m > 0; ++i, --m) {
          j = i + (random.next() * m)|0;
          tmp  = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
      }

      return $.Array(a);
    });

    builder.addMethod("mirror", function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror -->
      size = raw.length * 2 - 1;
      if (size < 2) {
        return $.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $.Array(a);
    });

    builder.addMethod("mirror1", function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror1 -->
      size = raw.length * 2 - 2;
      if (size < 2) {
        return $.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $.Array(a);
    });

    builder.addMethod("mirror2", function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror2 -->
      size = raw.length * 2;
      if (size < 2) {
        return $.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 1, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $.Array(a);
    });

    builder.addMethod("stutter", {
      args: "n=2"
    }, function($n) {
      var raw = this._;
      var n, a, i, j, imax, k;

      // <-- _ArrayStutter -->
      n = Math.max(0, $n.__int__());
      a = new Array(raw.length * n);
      for (i = 0, j = 0, imax = raw.length; i < imax; ++i) {
        for (k = 0; k < n; ++k, ++j) {
          a[j] = raw[i];
        }
      }

      return $.Array(a);
    });

    builder.addMethod("rotate", {
      args: "n=1"
    }, function($n) {
      var raw = this._;
      var n, a, size, i, j;

      // <-- _ArrayRotate -->
      n = $n.__int__();
      a = new Array(raw.length);
      size = a.length;
      n %= size;
      if (n < 0) {
        n += size;
      }
      for (i = 0, j = n; i < size; ++i) {
        a[j] = raw[i];
        if (++j >= size) {
          j = 0;
        }
      }

      return $.Array(a);
    });

    builder.addMethod("pyramid", {
      args: "patternType=1"
    }, function($patternType) {
      var patternType;
      var obj1, obj2, i, j, k, n, numslots, x;

      obj1 = this._;
      obj2 = [];

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      x = numslots = obj1.length;

      switch (patternType) {
      case 1:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 2:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 3:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 4:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 5:
        n = x * x;
        for (i = k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 6:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 7:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 8:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 9:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 10:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      }

      return $.Array(obj2);
    });

    builder.addMethod("pyramidg", {
      args: "patternType=1"
    }, function($patternType) {
      var raw = this._;
      var patternType;
      var list = [], lastIndex, i;

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      lastIndex = raw.length - 1;

      switch (patternType) {
      case 1:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 2:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        break;
      case 3:
        for (i = lastIndex; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 4:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 5:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 6:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        break;
      case 7:
        for (i = lastIndex; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 8:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 9:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 10:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      }

      return $.Array(list);
    });

    builder.addMethod("sputter", {
      args: "probability=0.25; maxlen=100"
    }, function($probability, $maxlen) {
      var list, prob, maxlen, i, length;

      list   = [];
      prob   = 1.0 - $probability.__num__();
      maxlen = $maxlen.__int__();
      i = 0;
      length = this._.length;
      while (i < length && list.length < maxlen) {
        list.push(this._[i]);
        if (random.next() < prob) {
          i += 1;
        }
      }

      return $.Array(list);
    });

    builder.addMethod("lace", {
      args: "length"
    }, function($length) {
      var raw = this._;
      var length, wrap = raw.length;
      var a, i, $item;

      if ($length === $nil) {
        $length = $.Integer(wrap);
      }

      length = $length.__int__();
      a = new Array(length);

      for (i = 0; i < length; ++i) {
        $item = raw[i % wrap];
        if (Array.isArray($item._)) {
          a[i] = $item._[ ((i / wrap)|0) % $item._.length ];
        } else {
          a[i] = $item;
        }
      }

      return $.Array(a);
    });

    builder.addMethod("permute", {
      args: "nthPermutation=0"
    }, function($nthPermutation) {
      var raw = this._;
      var obj1, obj2, size, $item;
      var nthPermutation, i, imax, j;

      obj1 = raw;
      obj2 = raw.slice();
      size = raw.length;
      nthPermutation = $nthPermutation.__int__();

      for (i = 0, imax = size - 1; i < imax; ++i) {
        j = i + nthPermutation % (size - i);
        nthPermutation = (nthPermutation / (size - i))|0;

        $item = obj2[i];
        obj2[i] = obj2[j];
        obj2[j] = $item;
      }

      return $.Array(obj2);
    });

    builder.addMethod("allTuples", {
      args: "maxTuples=16384"
    }, function($maxTuples) {
      var maxSize;
      var obj1, obj2, obj3, obj4, newSize, tupSize;
      var i, j, k;

      maxSize = $maxTuples.__int__();

      obj1 = this._;
      newSize = 1;
      tupSize = obj1.length;
      for (i = 0; i < tupSize; ++i) {
        if (Array.isArray(obj1[i]._)) {
          newSize *= obj1[i]._.length;
        }
      }
      newSize = Math.min(newSize, maxSize);

      obj2 = new Array(newSize);

      for (i = 0; i < newSize; ++i) {
        k = i;
        obj3 = new Array(tupSize);
        for (j = tupSize - 1; j >= 0; --j) {
          if (Array.isArray(obj1[j]._)) {
            obj4 = obj1[j]._;
            obj3[j] = obj4[k % obj4.length];
            k = (k / obj4.length)|0;
          } else {
            obj3[j] = obj1[j];
          }
        }
        obj2[i] = $.Array(obj3);
      }

      return $.Array(obj2);
    });

    builder.addMethod("wrapExtend", {
      args: "size"
    }, function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());
      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[i % raw.length];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    });

    builder.addMethod("foldExtend", {
      args: "size"
    }, function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[mathlib.foldIndex(i, raw.length)];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    });

    builder.addMethod("clipExtend", {
      args: "size"
    }, function($size) {
      var raw = this._;
      var size, a, i, imax, b;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0, imax = raw.length; i < imax; ++i) {
          a[i] = raw[i];
        }
        for (b = a[i - 1]; i < size; ++i) {
          a[i] = b;
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    });

    builder.addMethod("slide", {
      args: "windowLength=3; stepSize=1"
    }, function($windowLength, $stepSize) {
      var raw = this._;
      var windowLength, stepSize;
      var obj1, obj2, m, n, numwin, numslots;
      var i, j, h, k;

      windowLength = $windowLength.__int__();
      stepSize = $stepSize.__int__();
      obj1 = raw;
      obj2 = [];
      m = windowLength;
      n = stepSize;
      numwin = ((raw.length + n - m) / n)|0;
      numslots = numwin * m;

      for (i = h = k = 0; i < numwin; ++i, h += n) {
        for (j = h; j < m + h; ++j) {
          obj2[k++] = obj1[j];
        }
      }

      return $.Array(obj2);
    });

    builder.addMethod("containsSeqColl", function() {
      var raw = this._;
      var i, imax;

      for (i = 0, imax = raw.length; i < imax; ++i) {
        if (raw[i].isSequenceableCollection().__bool__()) {
          return $.True();
        }
      }

      return $.False();
    });

    builder.addMethod("unlace", {
      args: "clumpSize=2; numChan=1"
    }, function($clumpSize, $numChan) {
      var raw = this._;
      var clumpSize, numChan;
      var a, b, size, i, j, k;

      clumpSize = $clumpSize.__int__();
      numChan   = $numChan  .__int__();
      size = (raw.length / clumpSize)|0;
      size = size - (size % numChan);
      if (size) {
        a = new Array(clumpSize);
        for (i = 0; i < clumpSize; ++i) {
          b = new Array(size);
          for (j = 0; j < size; j += numChan) {
            for (k = 0; k < numChan; ++k) {
              b[j + k] = raw[i * numChan + k + j * clumpSize];
            }
          }
          a[i] = $.Array(b);
        }
      } else {
        a = [];
      }

      return $.Array(a);
    });

    // TODO: implements interlace
    // TODO: implements deinterlace

    builder.addMethod("flop", function() {
      return this.multiChannelExpand();
    });

    builder.addMethod("multiChannelExpand", function() {
      var raw = this._;
      var maxSize, size, obj1, obj2, obj3;
      var i, j;

      obj1 = raw;
      maxSize = obj1.reduce(function(len, $elem) {
        return Math.max(len, Array.isArray($elem._) ? $elem._.length : 1);
      }, 0);

      obj2 = new Array(maxSize);
      size = obj1.length;

      if (size === 0) {
        obj2[0] = $.Array([]);
      } else {
        for (i = 0; i < maxSize; ++i) {
          obj3 = new Array(size);
          for (j = 0; j < size; ++j) {
            if (Array.isArray(obj1[j]._)) {
              obj3[j] = obj1[j]._[i % obj1[j]._.length];
            } else {
              obj3[j] = obj1[j];
            }
          }
          obj2[i] = $.Array(obj3);
        }
      }

      return $.Array(obj2);
    });

    // TODO: implements envirPairs

    builder.addMethod("shift", {
      args: "n; filler=0.0"
    }, function($n, $filler) {
      var $fill, $remain;

      $fill = SCArray.fill($n.$("abs"), $filler);
      $remain = this.drop($n.$("neg"));

      if ($n < 0) {
        return $remain ["++"] ($fill);
      }

      return $fill ["++"] ($remain);
    });

    builder.addMethod("powerset", function() {
      var raw = this._;
      var arrSize, powersize;
      var result, elemArr, mod, i, j;

      arrSize   = this.size().__int__();
      powersize = Math.pow(2, arrSize);

      result = [];
      for (i = 0; i < powersize; ++i) {
        elemArr = [];
        for (j = 0; j < arrSize; ++j) {
          mod = Math.pow(2, j);
          if (((i / mod)|0) % 2) {
            elemArr.push(raw[j]);
          }
        }
        result[i] = $.Array(elemArr);
      }

      return $.Array(result);
    });

    // TODO: implements source

    builder.addMethod("asUGenInput", function($for) {
      return this.collect($.Func(function($_) {
        return $_.asUGenInput($for);
      }));
    });

    builder.addMethod("asAudioRateInput", function($for) {
      return this.collect($.Func(function($_) {
        return $_.asAudioRateInput($for);
      }));
    });

    builder.addMethod("asControlInput", function() {
      return this.collect($.Func(function($_) {
        return $_.asControlInput();
      }));
    });

    builder.addMethod("isValidUGenInput", 3);

    builder.addMethod("numChannels", function() {
      return this.size();
    });

    // TODO: implements poll
    // TODO: implements dpoll
    // TODO: implements evnAt
    // TODO: implements atIdentityHash
    // TODO: implements atIdentityHashInPairs
    // TODO: implements asSpec
    // TODO: implements fork

    builder.addMethod("madd", {
      args: "mul=1.0; add=0.0"
    }, function($mul, $add) {
      return $("MulAdd").new(this, $mul, $add);
    });
    // TODO: implements asRawOSC
    // TODO: implements printOn
    // TODO: implements storeOn
  });
});
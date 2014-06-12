// src/sc/classlib/Core/Object.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var bytecode = sc.lang.bytecode;

  sc.lang.klass.refine("Object", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_1 = utils.$int_1;
    var SCArray = $("Array");

    spec.__num__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__int__ = function() {
      return this.__num__()|0;
    };

    spec.__bool__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__sym__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__str__ = function() {
      return String(this);
    };

    // TODO: implements $new
    // TODO: implements $newCopyArgs

    spec.$newFrom = function() {
      return this._doesNotUnderstand("newFrom");
    };

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

    spec.size = utils.alwaysReturn$int_0;
    spec.indexedSize = utils.alwaysReturn$int_0;
    spec.flatSize = utils.alwaysReturn$int_1;

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

    spec.respondsTo = fn(function($aSymbol) {
      return $.Boolean(typeof this[$aSymbol.__sym__()] === "function");
    }, "aSymbol");

    // TODO: implements performMsg

    spec.perform = function($selector) {
      var selector, method;

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, slice.call(arguments, 1));
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.performList = function($selector, $arglist) {
      var selector, method;

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, $arglist.asArray()._);
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.functionPerformList = utils.nop;

    // TODO: implements superPerform
    // TODO: implements superPerformList
    // TODO: implements tryPerform
    // TODO: implements multiChannelPerform
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
      var $array, i, imax;

      if ($n.isSequenceableCollection().__bool__()) {
        return SCArray.fillND($n, $.Function(function() {
          return [ function() {
            return $this.copy();
          } ];
        }));
      }

      $array = SCArray.new($n);
      for (i = 0, imax = $n.__int__(); i < imax; ++i) {
        $array.add(this.copy());
      }

      return $array;
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

    // TODO: implements equals
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
      return $("Association").new(this, $obj);
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

    // TODO: implements cyc
    // TODO: implements fin
    // TODO: implements repeat
    // TODO: implements loop

    spec.asStream = utils.nop;

    // TODO: implements streamArg

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
    spec._subclassResponsibility = function(methodName) {
      throw new Error("RECEIVER " + String(this) + ": " +
                      "'" + methodName + "' should have been implemented by subclass");
    };

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

    spec.rank = utils.alwaysReturn$int_0;

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
      bytecode.yield(this);
      return this;
    };

    // TODO: implements alwaysYield
    // TODO: implements yieldAndReset
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

      $iMin = $index.$("roundUp", [ $int_1 ]).asInteger().__dec__();
      return this.perform($method, $iMin).blend(
        this.perform($method, $iMin.__inc__()),
        $index.$("absdif", [ $iMin ])
      );
    }, "index; method=\\clipAt");

    spec.blendPut = fn(function($index, $val, $method) {
      var $iMin, $ratio;

      $iMin = $index.$("floor").asInteger();
      $ratio = $index.$("absdif", [ $iMin ]);
      this.perform($method, $iMin, $val.$("*", [ $int_1 ["-"] ($ratio) ]));
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
    spec.numChannels = utils.alwaysReturn$int_1;

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

      throw new Error("binary operator '" + aSelector + "' failed.");
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

// src/sc/classlib/Core/AbstractFunction.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("AbstractFunction", function(spec, utils) {
    spec.composeUnaryOp = function($aSelector) {
      return $("UnaryOpFunction").new($aSelector, this);
    };

    spec.composeBinaryOp = function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    };

    spec.reverseComposeBinaryOp = function($aSelector, $something, $adverb) {
      return $("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    };

    spec.composeNAryOp = function($aSelector, $anArgList) {
      return $("NAryOpFunction").new($aSelector, this, $anArgList);
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aNumber, $adverb);
    };

    spec.performBinaryOpOnSignal = function($aSelector, $aSignal, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSignal, $adverb);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aComplex, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSeqColl, $adverb);
    };

    spec.neg = function() {
      return this.composeUnaryOp($.Symbol("neg"));
    };

    spec.reciprocal = function() {
      return this.composeUnaryOp($.Symbol("reciprocal"));
    };

    spec.bitNot = function() {
      return this.composeUnaryOp($.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.composeUnaryOp($.Symbol("abs"));
    };

    spec.asFloat = function() {
      return this.composeUnaryOp($.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.composeUnaryOp($.Symbol("asInteger"));
    };

    spec.ceil = function() {
      return this.composeUnaryOp($.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.composeUnaryOp($.Symbol("floor"));
    };

    spec.frac = function() {
      return this.composeUnaryOp($.Symbol("frac"));
    };

    spec.sign = function() {
      return this.composeUnaryOp($.Symbol("sign"));
    };

    spec.squared = function() {
      return this.composeUnaryOp($.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.composeUnaryOp($.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.composeUnaryOp($.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.composeUnaryOp($.Symbol("exp"));
    };

    spec.midicps = function() {
      return this.composeUnaryOp($.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.composeUnaryOp($.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.composeUnaryOp($.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.composeUnaryOp($.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.composeUnaryOp($.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.composeUnaryOp($.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.composeUnaryOp($.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.composeUnaryOp($.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.composeUnaryOp($.Symbol("log"));
    };

    spec.log2 = function() {
      return this.composeUnaryOp($.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.composeUnaryOp($.Symbol("log10"));
    };

    spec.sin = function() {
      return this.composeUnaryOp($.Symbol("sin"));
    };

    spec.cos = function() {
      return this.composeUnaryOp($.Symbol("cos"));
    };

    spec.tan = function() {
      return this.composeUnaryOp($.Symbol("tan"));
    };

    spec.asin = function() {
      return this.composeUnaryOp($.Symbol("asin"));
    };

    spec.acos = function() {
      return this.composeUnaryOp($.Symbol("acos"));
    };

    spec.atan = function() {
      return this.composeUnaryOp($.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.composeUnaryOp($.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.composeUnaryOp($.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.composeUnaryOp($.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.composeUnaryOp($.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.composeUnaryOp($.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.composeUnaryOp($.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.composeUnaryOp($.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.composeUnaryOp($.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.composeUnaryOp($.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.composeUnaryOp($.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.composeUnaryOp($.Symbol("coin"));
    };

    spec.even = function() {
      return this.composeUnaryOp($.Symbol("even"));
    };

    spec.odd = function() {
      return this.composeUnaryOp($.Symbol("odd"));
    };

    spec.rectWindow = function() {
      return this.composeUnaryOp($.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.composeUnaryOp($.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.composeUnaryOp($.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.composeUnaryOp($.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.composeUnaryOp($.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.composeUnaryOp($.Symbol("ramp"));
    };

    spec.isPositive = function() {
      return this.composeUnaryOp($.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.composeUnaryOp($.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.composeUnaryOp($.Symbol("isStrictlyPositive"));
    };

    spec.rho = function() {
      return this.composeUnaryOp($.Symbol("rho"));
    };

    spec.theta = function() {
      return this.composeUnaryOp($.Symbol("theta"));
    };

    spec.rotate = function($function) {
      return this.composeBinaryOp($.Symbol("rotate"), $function);
    };

    spec.dist = function($function) {
      return this.composeBinaryOp($.Symbol("dist"), $function);
    };

    spec["+"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("+"), $function, $adverb);
    };

    spec["-"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("-"), $function, $adverb);
    };

    spec["*"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("*"), $function, $adverb);
    };

    spec["/"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("/"), $function, $adverb);
    };

    spec.div = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("div"), $function, $adverb);
    };

    spec.mod = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("mod"), $function, $adverb);
    };

    spec.pow = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("pow"), $function, $adverb);
    };

    spec.min = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("min"), $function, $adverb);
    };

    spec.max = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("max"), $function, $adverb);
    };

    spec["<"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<"), $function, $adverb);
    };

    spec["<="] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("<="), $function, $adverb);
    };

    spec[">"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">"), $function, $adverb);
    };

    spec[">="] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol(">="), $function, $adverb);
    };

    spec.bitAnd = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitAnd"), $function, $adverb);
    };

    spec.bitOr = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitOr"), $function, $adverb);
    };

    spec.bitXor = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitXor"), $function, $adverb);
    };

    spec.bitHammingDistance = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("bitHammingDistance"), $function, $adverb);
    };

    spec.lcm = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("lcm"), $function, $adverb);
    };

    spec.gcd = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("gcd"), $function, $adverb);
    };

    spec.round = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("round"), $function, $adverb);
    };

    spec.roundUp = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("roundUp"), $function, $adverb);
    };

    spec.trunc = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("trunc"), $function, $adverb);
    };

    spec.atan2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("atan2"), $function, $adverb);
    };

    spec.hypot = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypot"), $function, $adverb);
    };

    spec.hypotApx = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("hypotApx"), $function, $adverb);
    };

    spec.leftShift = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("leftShift"), $function, $adverb);
    };

    spec.rightShift = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rightShift"), $function, $adverb);
    };

    spec.unsignedRightShift = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("unsignedRightShift"), $function, $adverb);
    };

    spec.ring1 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring1"), $function, $adverb);
    };

    spec.ring2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring2"), $function, $adverb);
    };

    spec.ring3 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring3"), $function, $adverb);
    };

    spec.ring4 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("ring4"), $function, $adverb);
    };

    spec.difsqr = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("difsqr"), $function, $adverb);
    };

    spec.sumsqr = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sumsqr"), $function, $adverb);
    };

    spec.sqrsum = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrsum"), $function, $adverb);
    };

    spec.sqrdif = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("sqrdif"), $function, $adverb);
    };

    spec.absdif = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("absdif"), $function, $adverb);
    };

    spec.thresh = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("thresh"), $function, $adverb);
    };

    spec.amclip = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("amclip"), $function, $adverb);
    };

    spec.scaleneg = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("scaleneg"), $function, $adverb);
    };

    spec.clip2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("clip2"), $function, $adverb);
    };

    spec.fold2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("fold2"), $function, $adverb);
    };

    spec.wrap2 = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("wrap2"), $function, $adverb);
    };

    spec.excess = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("excess"), $function, $adverb);
    };

    spec.firstArg = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("firstArg"), $function, $adverb);
    };

    spec.rrand = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("rrand"), $function, $adverb);
    };

    spec.exprand = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("exprand"), $function, $adverb);
    };

    spec["@"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("@"), $function, $adverb);
    };

    spec.real = utils.nop;
    spec.imag = function() {
      return $.Float(0.0);
    };

    spec["||"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("||"), $function, $adverb);
    };

    spec["&&"] = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("&&"), $function, $adverb);
    };

    spec.xor = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("xor"), $function, $adverb);
    };

    spec.nand = function($function, $adverb) {
      return this.composeBinaryOp($.Symbol("nand"), $function, $adverb);
    };

    spec.not = function() {
      return this.composeUnaryOp($.Symbol("not"));
    };

    spec.ref = function() {
      return this.composeUnaryOp($.Symbol("asRef"));
    };

    spec.clip = function($lo, $hi) {
      return this.composeNAryOp($.Symbol("clip"), $.Array([ $lo, $hi ]));
    };

    spec.wrap = function($lo, $hi) {
      return this.composeNAryOp($.Symbol("wrap"), $.Array([ $lo, $hi ]));
    };

    spec.fold = function($lo, $hi) {
      return this.composeNAryOp($.Symbol("fold"), $.Array([ $lo, $hi ]));
    };

    spec.blend = fn(function($that, $blendFrac) {
      return this.composeNAryOp(
        $.Symbol("blend"), $.Array([ $that, $blendFrac ])
      );
    }, "that; blendFrac=0.5");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linlin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("linexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("explin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("expexp"), $.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("lincurve"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $.Symbol("curvelin"), $.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("bilin"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $.Symbol("biexp"), $.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($function, $mod) {
      return this.composeNAryOp(
        $.Symbol("moddif"), $.Array([ $function, $mod ])
      );
    }, "function; mod");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return this.composeNAryOp(
        $.Symbol("degreeToKey"), $.Array([ $scale, $stepsPerOctave ])
      );
    }, "scale; stepsPerOctave=12");

    spec.degrad = function() {
      return this.composeUnaryOp($.Symbol("degrad"));
    };

    spec.raddeg = function() {
      return this.composeUnaryOp($.Symbol("raddeg"));
    };

    spec.applyTo = function() {
      return this.value.apply(this, arguments);
    };

    // TODO: implements <>
    // TODO: implements sampled

    spec.asUGenInput = function($for) {
      return this.value($for);
    };

    spec.asAudioRateInput = function($for) {
      var $result;

      $result = this.value($for);

      if ($result.rate().__sym__() !== "audio") {
        return $("K2A").ar($result);
      }

      return $result;
    };

    spec.asControlInput = function() {
      return this.value();
    };

    spec.isValidUGenInput = utils.alwaysReturn$true;
  });

  sc.lang.klass.define("UnaryOpFunction : AbstractFunction", function(spec) {
    spec.constructor = function SCUnaryOpFunction() {
      this.__super__("AbstractFunction");
    };

    spec.$new = function($selector, $a) {
      return this._newCopyArgs({
        selector: $selector,
        a       : $a
      });
    };

    spec.value = function() {
      var $a = this._$a;
      return $a.value.apply($a, arguments).perform(this._$selector);
    };

    spec.valueArray = function($args) {
      return this._$a.valueArray($args).perform(this._$selector);
    };

    spec.valueEnvir = function() {
      var $a = this._$a;
      return $a.valueEnvir.apply($a, arguments).perform(this._$selector);
    };

    spec.valueArrayEnvir = function($args) {
      return this._$a.valueArrayEnvir($args).perform(this._$selector);
    };

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpFunction : AbstractFunction", function(spec) {
    spec.constructor = function SCBinaryOpFunction() {
      this.__super__("AbstractFunction");
    };

    spec.$new = function($selector, $a, $b, $adverb) {
      return this._newCopyArgs({
        selector: $selector,
        a       : $a,
        b       : $b,
        adverb  : $adverb
      });
    };

    spec.value = function() {
      return this._$a.value.apply(this._$a, arguments)
        .perform(this._$selector, this._$b.value.apply(this._$b, arguments), this._$adverb);
    };

    spec.valueArray = function($args) {
      return this._$a.valueArray($args)
        .perform(this._$selector, this._$b.valueArray($args, arguments), this._$adverb);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  sc.lang.klass.define("NAryOpFunction : AbstractFunction", function(spec) {
    spec.constructor = function SCNAryOpFunction() {
      this.__super__("AbstractFunction");
    };

    spec.$new = function($selector, $a, $arglist) {
      return this._newCopyArgs({
        selector: $selector,
        a       : $a,
        arglist : $arglist
      });
    };

    spec.value = function() {
      var args = arguments;
      return this._$a.value.apply(this._$a, args)
        .performList(this._$selector, this._$arglist.collect($.Function(function() {
          return [ function($_) {
            return $_.value.apply($_, args);
          } ];
        })));
    };

    spec.valueArray = function($args) {
      return this._$a.valueArray($args)
        .performList(this._$selector, this._$arglist.collect($.Function(function() {
          return [ function($_) {
            return $_.valueArray($args);
          } ];
        })));
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, _$arglist) {
      return this.performList($selector, _$arglist);
    };

    // TODO: implements storeOn
  });

  sc.lang.klass.define("FunctionList : AbstractFunction", function(spec, utils) {
    var $int_0 = utils.$int_0;

    spec.constructor = function SCFunctionList() {
      this.__super__("AbstractFunction");
      this._flopped = false;
    };

    spec.$new = function($functions) {
      return this._newCopyArgs({
        array: $functions
      });
    };

    spec.array = function() {
      return this._$array;
    };

    spec.array_ = fn(function($value) {
      this._$array = $value;
      return this;
    }, "value");

    spec.flopped = function() {
      return $.Boolean(this._flopped);
    };

    spec.addFunc = fn(function($$functions) {
      if (this._flopped) {
        throw new Error("cannot add a function to a flopped FunctionList");
      }

      this._$array = this._$array.addAll($$functions);

      return this;
    }, "*functions");

    spec.removeFunc = function($function) {
      this._$array.remove($function);

      if (this._$array.size() < 2) {
        return this._$array.at($int_0);
      }

      return this;
    };

    spec.replaceFunc = function($find, $replace) {
      this._$array = this._$array.replace($find, $replace);
      return this;
    };

    spec.value = function() {
      var $res, args = arguments;

      $res = this._$array.collect($.Function(function() {
        return [ function($_) {
          return $_.value.apply($_, args);
        } ];
      }));

      return this._flopped ? $res.flop() : $res;
    };

    spec.valueArray = function($args) {
      var $res;

      $res = this._$array.collect($.Function(function() {
        return [ function($_) {
          return $_.valueArray($args);
        } ];
      }));

      return this._flopped ? $res.flop() : $res;
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.do = function($function) {
      this._$array.do($function);
      return this;
    };

    spec.flop = function() {
      if (!this._flopped) {
        this._$array = this._$array.collect($.Function(function() {
          return [ function($_) {
            return $_.$("flop");
          } ];
        }));
      }
      this._flopped = true;

      return this;
    };

    // TODO: implements envirFlop

    spec.storeArgs = function() {
      return $.Array([ this._$array ]);
    };

  });

});

// src/sc/classlib/Streams/Stream.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var klass = sc.lang.klass;

  klass.define("Stream", function(spec, utils) {
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
        return [ function($inval) {
          if ($reset.__bool__()) {
            $this.reset();
            $stream.reset();
          }
          $reset = $true;
          $inval = $this.embedInStream($inval);
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

// src/sc/classlib/Streams/BasicOpsStream.js
SCScript.install(function(sc) {

  var fn = sc.lang.fn;

  sc.lang.klass.define("UnaryOpStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCUnaryOpStream() {
      this.__super__("Stream");
    };

    spec.$new = function($operator, $a) {
      return this._newCopyArgs({
        operator: $operator,
        a       : $a
      });
    };

    spec.next = fn(function($inval) {
      var $vala;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      return $vala.perform(this._$operator);
    }, "inval");

    spec.reset = function() {
      this._$a.reset();
      return this;
    };

    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCBinaryOpStream() {
      this.__super__("Stream");
    };

    spec.$new = function($operator, $a, $b) {
      return this._newCopyArgs({
        operator: $operator,
        a       : $a,
        b       : $b
      });
    };

    spec.next = fn(function($inval) {
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
    }, "inval");

    spec.reset = function() {
      this._$a.reset();
      this._$b.reset();
      return this;
    };

    // TODO: implements storeOn
  });

  sc.lang.klass.define("BinaryOpXStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCBinaryOpXStream() {
      this.__super__("Stream");
      this._$vala     = $nil;
    };

    spec.$new = function($operator, $a, $b) {
      return this._newCopyArgs({
        operator: $operator,
        a       : $a,
        b       : $b
      });
    };

    spec.next = fn(function($inval) {
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
    }, "inval");

    spec.reset = function() {
      this._$vala = $nil;
      this._$a.reset();
      this._$b.reset();
      return this;
    };

    // TODO: implements storeOn
  });

  sc.lang.klass.define("NAryOpStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCNAryOpStream() {
      this.__super__("Stream");
    };

    spec.$new = function($operator, $a, $arglist) {
      return this._newCopyArgs({
        operator: $operator,
        a       : $a
      }).arglist_($arglist);
    };

    spec.arglist_ = function($list) {
      this._arglist = Array.isArray($list._) ? $list._ : /* istanbul ignore next */ [];
      this._isNumeric = this._arglist.every(function($item) {
        return $item.__tag === 1027 || $item.isNumber().__bool__();
      });
      return this;
    };

    spec.next = fn(function($inval) {
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
    }, "inval");

    spec.reset = function() {
      this._$a.reset();
      this._arglist.forEach(function($item) {
        $item.reset();
      });
      return this;
    };

    // TODO: implements storeOn
  });

});

// src/sc/classlib/Math/Magnitude.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Magnitude", function(spec) {
    spec["=="] = function($aMagnitude) {
      return $.Boolean(this.valueOf() === $aMagnitude.valueOf());
    };

    spec["!="] = function($aMagnitude) {
      return $.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    };

    spec["<"] = function($aMagnitude) {
      return $.Boolean(this < $aMagnitude);
    };

    spec[">"] = function($aMagnitude) {
      return $.Boolean(this > $aMagnitude);
    };

    spec["<="] = function($aMagnitude) {
      return $.Boolean(this <= $aMagnitude);
    };

    spec[">="] = function($aMagnitude) {
      return $.Boolean(this >= $aMagnitude);
    };

    spec.exclusivelyBetween = fn(function($lo, $hi) {
      return $.Boolean($lo < this && this < $hi);
    }, "lo; hi");

    spec.inclusivelyBetween = fn(function($lo, $hi) {
      return $.Boolean($lo <= this && this <= $hi);
    }, "lo; hi");

    spec.min = fn(function($aMagnitude) {
      return this <= $aMagnitude ? this : $aMagnitude;
    }, "aMagnitude");

    spec.max = fn(function($aMagnitude) {
      return this >= $aMagnitude ? this : $aMagnitude;
    }, "aMagnitude");

    spec.clip = fn(function($lo, $hi) {
      return this <= $lo ? $lo : this >= $hi ? $hi : this;
    }, "lo; hi");
  });

});

// src/sc/classlib/Math/Number.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;

  sc.lang.klass.refine("Number", function(spec, utils) {
    spec.isNumber = utils.alwaysReturn$true;

    spec["+"] = function() {
      return this._subclassResponsibility("+");
    };

    spec["-"] = function() {
      return this._subclassResponsibility("-");
    };

    spec["*"] = function() {
      return this._subclassResponsibility("*");
    };

    spec["/"] = function() {
      return this._subclassResponsibility("/");
    };

    spec.mod = function() {
      return this._subclassResponsibility("mod");
    };

    spec.div = function() {
      return this._subclassResponsibility("div");
    };

    spec.pow = function() {
      return this._subclassResponsibility("pow");
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      var $this = this;

      return $aSeqColl.$("collect", [ $.Function(function() {
        return [ function($item) {
          return $item.perform($aSelector, $this, $adverb);
        } ];
      }) ]);
    };

    // TODO: implements performBinaryOpOnPoint

    spec.rho = utils.nop;

    spec.theta = function() {
      return $.Float(0.0);
    };

    spec.real = utils.nop;

    spec.imag = function() {
      return $.Float(0.0);
    };

    // TODO: implements @
    // TODO: implements complex
    // TODO: implements polar

    spec.for = fn(function($endValue, $function) {
      iterator.execute(
        iterator.number$for(this, $endValue),
        $function
      );
      return this;
    }, "endValue; function");

    spec.forBy = fn(function($endValue, $stepValue, $function) {
      iterator.execute(
        iterator.number$forBy(this, $endValue, $stepValue),
        $function
      );
      return this;
    }, "endValue; stepValue; function");

    spec.forSeries = fn(function($second, $last, $function) {
      iterator.execute(
        iterator.number$forSeries(this, $second, $last),
        $function
      );
      return this;
    }, "second; last; function");
  });

});

// src/sc/classlib/Math/SimpleNumber.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var rand = sc.libs.random;

  function prOpSimpleNumber(selector, func) {
    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
      case 777:
        return $.Boolean(func(this._, $aNumber._));
      }

      if ($aNumber.isSequenceableCollection().valueOf()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $.Symbol(selector), this, $adverb
        );
      }

      return $.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;
    var SCArray = $("Array");

    spec.__newFrom__ = $.Float;

    spec.__bool__ = function() {
      return this._ !== 0;
    };

    spec.__dec__ = function() {
      return this.__newFrom__(this._ - 1);
    };

    spec.__inc__ = function() {
      return this.__newFrom__(this._ + 1);
    };

    spec.__int__ = function() {
      if (!isFinite(this._)) {
        return this._;
      }
      return this._|0;
    };

    spec.__num__ = function() {
      return this._;
    };

    spec.isValidUGenInput = function() {
      return $.Boolean(!isNaN(this._));
    };

    spec.numChannels = utils.alwaysReturn$int_1;

    spec.magnitude = function() {
      return this.abs();
    };

    spec.angle = function() {
      return $.Float(this._ >= 0 ? 0 : Math.PI);
    };

    spec.neg = function() {
      return this.__newFrom__(-this._);
    };

    // bitNot: implemented by subclass

    spec.abs = function() {
      return this.__newFrom__(Math.abs(this._));
    };

    spec.ceil = function() {
      return this.__newFrom__(Math.ceil(this._));
    };

    spec.floor = function() {
      return this.__newFrom__(Math.floor(this._));
    };

    spec.frac = function() {
      var a = this._;

      if (a < 0) {
        return this.__newFrom__(1 + (a - (a|0)));
      }
      return this.__newFrom__(a - (a|0));
    };

    spec.sign = function() {
      var a = this._;
      return this.__newFrom__(
        a > 0 ? 1 : a === 0 ? 0 : -1
      );
    };

    spec.squared = function() {
      return this.__newFrom__(this._ * this._);
    };

    spec.cubed = function() {
      return this.__newFrom__(this._ * this._ * this._);
    };

    spec.sqrt = function() {
      return $.Float(Math.sqrt(this._));
    };

    spec.exp = function() {
      return $.Float(Math.exp(this._));
    };

    spec.reciprocal = function() {
      return $.Float(1 / this._);
    };

    spec.midicps = function() {
      return $.Float(
        440 * Math.pow(2, (this._ - 69) * 1/12)
      );
    };

    spec.cpsmidi = function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E * 12 + 69
      );
    };

    spec.midiratio = function() {
      return $.Float(
        Math.pow(2, this._ * 1/12)
      );
    };

    spec.ratiomidi = function() {
      return $.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    };

    spec.ampdb = function() {
      return $.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    };

    spec.dbamp = function() {
      return $.Float(
        Math.pow(10, this._ * 0.05)
      );
    };

    spec.octcps = function() {
      return $.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    };

    spec.cpsoct = function() {
      return $.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E + 4.75
      );
    };

    spec.log = function() {
      return $.Float(Math.log(this._));
    };

    spec.log2 = function() {
      return $.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    };

    spec.log10 = function() {
      return $.Float(Math.log(this._) * Math.LOG10E);
    };

    spec.sin = function() {
      return $.Float(Math.sin(this._));
    };

    spec.cos = function() {
      return $.Float(Math.cos(this._));
    };

    spec.tan = function() {
      return $.Float(Math.tan(this._));
    };

    spec.asin = function() {
      return $.Float(Math.asin(this._));
    };

    spec.acos = function() {
      return $.Float(Math.acos(this._));
    };

    spec.atan = function() {
      return $.Float(Math.atan(this._));
    };

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    spec.sinh = function() {
      return $.Float(_sinh(this._));
    };

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    spec.cosh = function() {
      return $.Float(_cosh(this._));
    };

    spec.tanh = function() {
      return $.Float(_sinh(this._) / _cosh(this._));
    };

    spec.rand = function() {
      return this.__newFrom__(
        rand.next() * this._
      );
    };

    spec.rand2 = function() {
      return this.__newFrom__(
        (rand.next() * 2 - 1) * this._
      );
    };

    spec.linrand = function() {
      return this.__newFrom__(
        Math.min(rand.next(), rand.next()) * this._
      );
    };

    spec.bilinrand = function() {
      return this.__newFrom__(
        (rand.next() - rand.next()) * this._
      );
    };

    spec.sum3rand = function() {
      return this.__newFrom__(
        (rand.next() + rand.next() + rand.next() - 1.5) * 2/3 * this._
      );
    };

    spec.distort = function() {
      return $.Float(
        this._ / (1 + Math.abs(this._))
      );
    };

    spec.softclip = function() {
      var a = this._, abs_a = Math.abs(a);
      return $.Float(abs_a <= 0.5 ? a : (abs_a - 0.25) / a);
    };

    spec.coin = function() {
      return $.Boolean(rand.next() < this._);
    };

    spec.isPositive = function() {
      return $.Boolean(this._ >= 0);
    };

    spec.isNegative = function() {
      return $.Boolean(this._ < 0);
    };

    spec.isStrictlyPositive = function() {
      return $.Boolean(this._ > 0);
    };

    spec.isNaN = function() {
      return $.Boolean(isNaN(this._));
    };

    spec.asBoolean = function() {
      return $.Boolean(this._ > 0);
    };

    spec.booleanValue = function() {
      return $.Boolean(this._ > 0);
    };

    spec.binaryValue = function() {
      return this._ > 0 ? $int_1 : $int_0;
    };

    spec.rectWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(1);
    };

    spec.hanWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    };

    spec.welWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      return $.Float(Math.sin(a * Math.PI));
    };

    spec.triWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $.Float(0);
      }
      if (a < 0.5) {
        return $.Float(2 * a);
      }
      return $.Float(-2 * a + 2);
    };

    spec.scurve = function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a * a * (3 - 2 * a));
    };

    spec.ramp = function() {
      var a = this._;
      if (a <= 0) {
        return $.Float(0);
      }
      if (1 <= a) {
        return $.Float(1);
      }
      return $.Float(a);
    };

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

    spec.bitTest = function($bit) {
      return $.Boolean(
        this.bitAnd($int_1.leftShift($bit)).valueOf() !== 0
      );
    };

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

    spec["=="] = function($aNumber) {
      return $.Boolean(this._ === $aNumber._);
    };

    spec["!="] = function($aNumber) {
      return $.Boolean(this._ !== $aNumber._);
    };

    spec["<"] = prOpSimpleNumber("<", function(a, b) {
      return a < b;
    });
    spec[">"] = prOpSimpleNumber(">", function(a, b) {
      return a > b;
    });
    spec["<="] = prOpSimpleNumber("<=", function(a, b) {
      return a <= b;
    });
    spec[">="] = prOpSimpleNumber(">=", function(a, b) {
      return a >= b;
    });

    spec.equalWithPrecision = fn(function($that, $precision) {
      return this.absdif($that) ["<"] ($precision);
    }, "that; precision=0.0001");

    spec.asInteger = function() {
      return $.Integer(this._);
    };

    spec.asFloat = function() {
      return $.Float(this._);
    };

    // TODO: implements asComplex
    // TODO: implements asRect

    spec.degrad = function() {
      return $.Float(this._ * Math.PI / 180);
    };

    spec.raddeg = function() {
      return $.Float(this._ * 180 / Math.PI);
    };

    // TODO: implements performBinaryOpOnSimpleNumber
    // TODO: implements performBinaryOpOnComplex
    // TODO: implements performBinaryOpOnSignal

    spec.nextPowerOfTwo = function() {
      return $.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    };

    spec.nextPowerOf = fn(function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil()
      );
    }, "base");

    spec.nextPowerOfThree = function() {
      return $.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    };

    spec.previousPowerOf = fn(function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.$("log"))).ceil().__dec__()
      );
    }, "base");

    spec.quantize = fn(function($quantum, $tolerance, $strength) {
      var $round, $diff;

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength.$("*", [ $diff ]));
      }

      return this;
    }, "quantum=1.0; tolerance=0.05; strength=1.0");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
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
    }, "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
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
    }, "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.linlin($inCenter, $inMax, $outCenter, $outMax, $.Symbol("none"));
        } else {
          $res = this.linlin($inMin, $inCenter, $outMin, $outCenter, $.Symbol("none"));
        }
      }

      return $res;
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.explin($inCenter, $inMax, $outCenter, $outMax, $.Symbol("none"));
        } else {
          $res = this.explin($inMin, $inCenter, $outMin, $outCenter, $.Symbol("none"));
        }
      }

      return $res;
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($aNumber, $mod) {
      var $diff, $modhalf;

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod.$("*", [ $.Float(0.5) ]);

      return $modhalf.$("-", [ $diff.absdif($modhalf) ]);
    }, "aNumber=0.0; mod=1.0");

    spec.lcurve = fn(function($a, $m, $n, $tau) {
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
    }, "a=1.0; m=0.0; n=1.0; tau=1.0");

    spec.gauss = fn(function($standardDeviation) {
      // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($.Float(-2.0) ["*"] ($.Float(1.0).rand().log()).sqrt() ["*"] (
        $.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    }, "standardDeviation");

    spec.gaussCurve = fn(function($a, $b, $c) {
      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a.$("*", [ ((
        (this ["-"] ($b).squared()) ["/"] ($.Float(-2.0) ["*"] ($c.$("squared")))
      ).exp()) ]);
    }, "a=1.0; b=0.0; c=1.0");

    // TODO: implements asPoint
    // TODO: implements asWarp

    spec.wait = function() {
      return this.yield();
    };

    // TODO: implements waitUntil
    // TODO: implements sleep
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.rate = function() {
      return $.Symbol("scalar");
    };

    spec.asAudioRateInput = function() {
      if (this._ === 0) {
        return $("Silent").ar();
      }
      return $("DC").ar(this);
    };

    spec.madd = fn(function($mul, $add) {
      return (this ["*"] ($mul)) ["+"] ($add);
    }, "mul; add");

    spec.lag = utils.nop;
    spec.lag2 = utils.nop;
    spec.lag3 = utils.nop;
    spec.lagud = utils.nop;
    spec.lag2ud = utils.nop;
    spec.lag3ud = utils.nop;
    spec.varlag = utils.nop;
    spec.slew = utils.nop;

    // TODO: implements writeInputSpec

    spec.series = fn(function($second, $last) {
      var $step;
      var last, step, size;

      if ($second === $nil) {
        if (this.valueOf() < $last.valueOf()) {
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
    }, "second; last");

    // TODO: implements seriesIter
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInList
    // TODO: implements nearestInScale
    // TODO: implements partition
    // TODO: implements nextTimeOnGrid
    // TODO: implements playAndDelta
    // TODO: implements asQuant
    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    spec.shallowCopy = utils.nop;
  });

  function clip_for_map($this, $inMin, $inMax, $outMin, $outMax, $clip) {

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

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  var bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return type1(func(this._, $aNumber._));
      case 777:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol(selector), this, $adverb
      );
    };
  };

  sc.lang.klass.refine("Integer", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_1 = utils.$int_1;
    var SCArray = $("Array");

    spec.__newFrom__ = $.Integer;

    spec.__int__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String("" + this._);
    };

    spec.$new = function() {
      throw new Error("Integer.new is illegal, should use literal.");
    };

    spec.isInteger = utils.alwaysReturn$true;

    spec.hash = function() {
      return $.Float(this._).hash();
    };

    [
      [ "+", $.Integer, $.Float ],
      [ "-", $.Integer, $.Float ],
      [ "*", $.Integer, $.Float ],
      [ "/", $.Float  , $.Float ],
      [ "mod"     , $.Integer, $.Float   ],
      [ "div"     , $.Integer, $.Integer ],
      [ "pow"     , $.Float  , $.Float   ],
      [ "min"     , $.Integer, $.Float   ],
      [ "max"     , $.Integer, $.Float   ],
      [ "bitAnd"  , $.Integer, $.Float   ],
      [ "bitOr"   , $.Integer, $.Float   ],
      [ "bitXor"  , $.Integer, $.Float   ],
      [ "lcm"     , $.Integer, $.Float   ],
      [ "gcd"     , $.Integer, $.Float   ],
      [ "round"   , $.Integer, $.Float   ],
      [ "roundUp" , $.Integer, $.Float   ],
      [ "trunc"   , $.Integer, $.Float   ],
      [ "atan2"   , $.Float  , $.Float   ],
      [ "hypot"   , $.Float  , $.Float   ],
      [ "hypotApx", $.Float  , $.Float   ],
      [ "leftShift"         , $.Integer, $.Float ],
      [ "rightShift"        , $.Integer, $.Float ],
      [ "unsignedRightShift", $.Integer, $.Float ],
      [ "ring1"   , $.Integer, $.Float   ],
      [ "ring2"   , $.Integer, $.Float   ],
      [ "ring3"   , $.Integer, $.Float   ],
      [ "ring4"   , $.Integer, $.Float   ],
      [ "difsqr"  , $.Integer, $.Float   ],
      [ "sumsqr"  , $.Integer, $.Float   ],
      [ "sqrsum"  , $.Integer, $.Float   ],
      [ "sqrdif"  , $.Integer, $.Float   ],
      [ "absdif"  , $.Integer, $.Float   ],
      [ "thresh"  , $.Integer, $.Integer ],
      [ "amclip"  , $.Integer, $.Float   ],
      [ "scaleneg", $.Integer, $.Float   ],
      [ "clip2"   , $.Integer, $.Float   ],
      [ "fold2"   , $.Integer, $.Float   ],
      [ "excess"  , $.Integer, $.Float   ],
      [ "firstArg", $.Integer, $.Integer ],
      [ "rrand"   , $.Integer, $.Float   ],
      [ "exprand" , $.Float  , $.Float   ],
    ].forEach(function(items) {
      spec[items[0]] = bop.apply(null, items);
    });

    spec.wrap2 = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return $.Integer(mathlib.iwrap(this._, -$aNumber._, $aNumber._));
      case 777:
        return $.Float(mathlib.wrap2(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol("wrap2"), this, $adverb
      );
    };

    spec.rrand = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return $.Integer(Math.round(mathlib.rrand(this._, $aNumber._)));
      case 777:
        return $.Float(mathlib.rrand(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol("rrand"), this, $adverb
      );
    };

    spec.clip = fn(function($lo, $hi) {
      // <-- _ClipInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $.Integer(
          mathlib.clip(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.wrap = fn(function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $.Integer(
          mathlib.iwrap(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.fold = fn(function($lo, $hi) {
      // <-- _FoldInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $.Integer(
          mathlib.ifold(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.even = function() {
      return $.Boolean(!(this._ & 1));
    };

    spec.odd = function() {
      return $.Boolean(!!(this._ & 1));
    };

    spec.xrand = fn(function($exclude) {
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int_1)) ["%"] (this);
    }, "exclude=0");

    spec.xrand2 = fn(function($exclude) {
      var raw, res;

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $.Integer(res);
    }, "exclude=0");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return $scale.performDegreeToKey(this, $stepsPerOctave);
    }, "scale; stepsPerOctave=12");

    spec.do = function($function) {
      iterator.execute(
        iterator.integer$do(this),
        $function
      );
      return this;
    };

    spec.generate = function($function) {

      $function.value(this);

      return this;
    };

    spec.collectAs = fn(function($function, $class) {
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
    }, "function; class");

    spec.collect = function($function) {
      return this.collectAs($function, SCArray);
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.integer$reverseDo(this),
        $function
      );
      return this;
    };

    spec.for = fn(function($endval, $function) {
      iterator.execute(
        iterator.integer$for(this, $endval),
        $function
      );
      return this;
    }, "endval; function");

    spec.forBy = fn(function($endval, $stepval, $function) {
      iterator.execute(
        iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    }, "endval; stepval; function");

    spec.to = fn(function($hi, $step) {
      return $("Interval").new(this, $hi, $step);
    }, "hi; step=1");

    spec.asAscii = function() {
      // <-- _AsAscii -->
      return $.Char(String.fromCharCode(this._|0));
    };

    spec.asUnicode = utils.nop;

    spec.asDigit = function() {
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
    };

    spec.asBinaryDigits = fn(function($numDigits) {
      var raw, array, numDigits, i;

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($.Integer((raw >> i) & 1));
      }

      return $.Array(array);
    }, "numDigits=8");

    spec.asDigits = fn(function($base, $numDigits) {
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
    }, "base=10; numDigits");

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

    spec.geom = fn(function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    }, "start; grow");

    spec.fib = fn(function($a, $b) {
      return SCArray.fib(this, $a, $b);
    }, "a=0.0; b=1.0");

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

    spec.bitNot = function() {
      return $.Integer(~this._);
    };
  });

});

// src/sc/classlib/Math/Float.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  var bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return type1(func(this._, $aNumber._));
      case 777:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $.Symbol(selector), this, $adverb
      );
    };
  };

  sc.lang.klass.refine("Float", function(spec, utils) {
    spec.toString = function() {
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
    };

    spec.$new = function() {
      throw new Error("Float.new is illegal, should use literal.");
    };

    spec.isFloat = utils.alwaysReturn$true;
    spec.asFloat = utils.nop;

    [
      [ "+"  , $.Float, $.Float ],
      [ "-"  , $.Float, $.Float ],
      [ "*"  , $.Float, $.Float ],
      [ "/"  , $.Float, $.Float ],
      [ "mod"     , $.Float  , $.Float   ],
      [ "div"     , $.Integer, $.Integer ],
      [ "pow"     , $.Float  , $.Float   ],
      [ "min"     , $.Float  , $.Float   ],
      [ "max"     , $.Float  , $.Float   ],
      [ "bitAnd"  , $.Float  , $.Float   ],
      [ "bitOr"   , $.Float  , $.Float   ],
      [ "bitXor"  , $.Float  , $.Float   ],
      [ "lcm"     , $.Float  , $.Float   ],
      [ "gcd"     , $.Float  , $.Float   ],
      [ "round"   , $.Float  , $.Float   ],
      [ "roundUp" , $.Float  , $.Float   ],
      [ "trunc"   , $.Float  , $.Float   ],
      [ "atan2"   , $.Float  , $.Float   ],
      [ "hypot"   , $.Float  , $.Float   ],
      [ "hypotApx", $.Float  , $.Float   ],
      [ "leftShift"         , $.Float, $.Float ],
      [ "rightShift"        , $.Float, $.Float ],
      [ "unsignedRightShift", $.Float, $.Float ],
      [ "ring1"   , $.Float, $.Float ],
      [ "ring2"   , $.Float, $.Float ],
      [ "ring3"   , $.Float, $.Float ],
      [ "ring4"   , $.Float, $.Float ],
      [ "difsqr"  , $.Float, $.Float ],
      [ "sumsqr"  , $.Float, $.Float ],
      [ "sqrsum"  , $.Float, $.Float ],
      [ "sqrdif"  , $.Float, $.Float ],
      [ "absdif"  , $.Float, $.Float ],
      [ "thresh"  , $.Float, $.Float ],
      [ "amclip"  , $.Float, $.Float ],
      [ "scaleneg", $.Float, $.Float ],
      [ "clip2"   , $.Float, $.Float ],
      [ "fold2"   , $.Float, $.Float ],
      [ "wrap2"   , $.Float, $.Float ],
      [ "excess"  , $.Float, $.Float ],
      [ "firstArg", $.Float, $.Float ],
      [ "rrand"   , $.Float, $.Float ],
      [ "exprand" , $.Float, $.Float ],
    ].forEach(function(items) {
      spec[items[0]] = bop.apply(null, items);
    });

    spec.clip = fn(function($lo, $hi) {
      // <-- _ClipFloat -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.wrap = fn(function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.fold = fn(function($lo, $hi) {
      // <-- _FoldFloat -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    // TODO: implements coin
    // TODO: implements xrand2

    spec.as32Bits = function() {
      // <-- _As32Bits -->
      return $.Integer(
        new Int32Array(
          new Float32Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.high32Bits = function() {
      // <-- _High32Bits -->
      return $.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[1]
      );
    };

    spec.low32Bits = function() {
      // <-- _Low32Bits -->
      return $.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.$from32Bits = fn(function($word) {
      // <-- _From32Bits -->
      return $.Float(
        new Float32Array(
          new Int32Array([ $word.__num__() ]).buffer
        )[0]
      );
    }, "word");

    spec.$from64Bits = fn(function($hiWord, $loWord) {
      // <-- _From64Bits -->
      return $.Float(
        new Float64Array(
          new Int32Array([ $loWord.__num__(), $hiWord.__num__() ]).buffer
        )[0]
      );
    }, "hiWord; loWord");

    spec.do = function($function) {
      iterator.execute(
        iterator.float$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.float$reverseDo(this),
        $function
      );
      return this;
    };

    // TODO: implements asStringPrec
    // TODO: implements archiveAsCompileString
    // TODO: implements storeOn
    // TODO: implements switch

    spec.bitNot = function() {
      var f64 = new Float64Array([ this._ ]);
      var i32 = new Int32Array(f64.buffer);
      i32[0] = ~i32[0];
      return $.Float(f64[0]);
    };
  });

});

// src/sc/classlib/Core/Thread.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var random = sc.libs.random;

  sc.lang.klass.define("Thread", function(spec, utils) {

    spec.constructor = function SCThread() {
      this.__super__("Stream");
    };

    spec.$new = function($func) {
      return this.__super__("new")._init($func);
    };

    spec._init = function() {
      this._state   = 0;
      this._randgen = new random.RandGen((Math.random() * 4294967295) >>> 0);
      return this;
    };

    spec.state = function() {
      return $.Integer(this._state);
    };

    // spec.parent = function() {
    //   return this._parent;
    // };

    // spec.primitiveError = function() {
    //   return this._primitiveError;
    // };

    // spec.primitiveIndex = function() {
    //   return this._primitiveIndex;
    // };

    // spec.beats = function() {
    //   return this._beats;
    // };

    // spec.beats_ = fn(function($inBeats) {
    //   this._beats   = $inBeats;
    //   this._seconds = this._clock.beats2secs($inBeats);
    //   return this;
    // }, "inBeats");

    // spec.seconds = function() {
    //   return this._seconds;
    // };

    // spec.seconds_ = fn(function($inSeconds) {
    //   this._seconds = $inSeconds;
    //   this._beats   = this._clock.secs2beats($inSeconds);
    //   return this;
    // }, "inSeconds");

    // spec.clock = function() {
    //   return this._clock;
    // };

    // spec.clock_ = fn(function($inClock) {
    //   this._clock = $inClock;
    //   this._beats = this._clock.secs2beats(this._seconds);
    //   return this;
    // }, "inClock");

    // spec.nextBeat = function() {
    //   return this._nextBeat;
    // };

    // spec.endBeat = function() {
    //   return this._endBeat;
    // };

    // spec.endBeat_ = function($value) {
    //   this._endBeat = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.endValue = function() {
    //   return this._endValue;
    // };

    // spec.endValue_ = function($value) {
    //   this._endValue = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.exceptionHandler = function() {
    //   return this._exceptionHandler;
    // };

    // spec.exceptionHandler_ = function($value) {
    //   this._exceptionHandler = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.threadPlayer_ = function($value) {
    //   this._threadPlayer = $value || /* istanbul ignroe next */ $nil;
    //   return this;
    // };

    // spec.executingPath = function() {
    //   return this._executingPath;
    // };

    // spec.oldExecutingPath = function() {
    //   return this._oldExecutingPath;
    // };

    // TODO: implements init

    spec.copy = utils.nop;

    // spec.isPlaying = function() {
    //   return $.Boolean(this._state._ === 5);
    // };

    // spec.threadPlayer = function() {
    //   if (this._threadPlayer !== $nil) {
    //     return this.findThreadPlayer();
    //   }
    //   return $nil;
    // };

    // TODO: implements findThreadPlayer

    spec.randSeed_ = fn(function($seed) {
      this._randgen.setSeed($seed.__int__() >>> 0);
      return this;
    }, "seed");

    spec.randData_ = fn(function($data) {
      this._randgen.x = $data.at($.Integer(0)).__int__();
      this._randgen.y = $data.at($.Integer(1)).__int__();
      this._randgen.z = $data.at($.Integer(2)).__int__();
      return this;
    }, "data");

    spec.randData = function() {
      return $("Int32Array").newFrom($.Array([
        $.Integer(this._randgen.x),
        $.Integer(this._randgen.y),
        $.Integer(this._randgen.z),
      ]));
    };

    // TODO: implements failedPrimitiveName
    // TODO: implements handleError

    spec.next = utils.nop;
    spec.value = utils.nop;
    spec.valueArray = utils.nop;

    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  sc.lang.klass.define("Routine", function(spec) {

    spec.constructor = function SCRoutine() {
      this.__super__("Thread");
    };

    // TODO: implements $run
    // TODO: implements next
    // TODO: implements value
    // TODO: implements resume
    // TODO: implements run
    // TODO: implements valueArray
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });

});

// src/sc/classlib/Core/Symbol.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Symbol", function(spec, utils) {
    var $nil = utils.$nil;

    spec.__sym__ = function() {
      return this._;
    };

    spec.__str__ = function() {
      return this._;
    };

    spec.$new = function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    };

    spec.asSymbol = utils.nop;

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this._);
      return $.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this._);
      return $.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      return this.asString().ascii();
    };

    // TODO: implements asCompileString

    spec.asClass = function() {
      if (sc.lang.klass.exists(this._)) {
        return sc.lang.klass.get(this._);
      }
      return $nil;
    };

    // TODO: implements asSetter
    // TODO: implements asGetter
    // TODO: implements asSpec
    // TODO: implements asWarp
    // TODO: implements asTuning
    // TODO: implements asScale
    // TODO: implements isSetter
    // TODO: implements isClassName
    // TODO: implements isMetaClassName
    // TODO: implements isPrefix
    // TODO: implements isPrimitiveName
    // TODO: implements isPrimitive
    // TODO: implements isMap
    // TODO: implements isRest
    // TODO: implements envirGet
    // TODO: implements envirPut
    // TODO: implements blend
    // TODO: implements ++
    // TODO: implements asBinOpString

    spec.applyTo = fn(function($firstArg, $$args) {
      return $firstArg.perform.apply($firstArg, [ this ].concat($$args._));
    }, "first; *args");

    spec.performBinaryOpOnSomething = utils.nop;
    spec.neg = utils.nop;
    spec.bitNot = utils.nop;
    spec.abs = utils.nop;
    spec.ceil = utils.nop;
    spec.floor = utils.nop;
    spec.frac = utils.nop;
    spec.sign = utils.nop;
    spec.sqrt = utils.nop;
    spec.exp = utils.nop;
    spec.midicps = utils.nop;
    spec.cpsmidi = utils.nop;
    spec.midiratio = utils.nop;
    spec.ratiomidi = utils.nop;
    spec.ampdb = utils.nop;
    spec.dbamp = utils.nop;
    spec.octcps = utils.nop;
    spec.cpsoct = utils.nop;
    spec.log = utils.nop;
    spec.log2 = utils.nop;
    spec.log10 = utils.nop;
    spec.sin = utils.nop;
    spec.cos = utils.nop;
    spec.tan = utils.nop;
    spec.asin = utils.nop;
    spec.acos = utils.nop;
    spec.atan = utils.nop;
    spec.sinh = utils.nop;
    spec.cosh = utils.nop;
    spec.tanh = utils.nop;
    spec.rand = utils.nop;
    spec.rand2 = utils.nop;
    spec.linrand = utils.nop;
    spec.bilinrand = utils.nop;
    spec.sum3rand = utils.nop;
    spec.distort = utils.nop;
    spec.softclip = utils.nop;
    spec.coin = utils.nop;
    spec.even = utils.nop;
    spec.odd = utils.nop;
    spec.rectWindow = utils.nop;
    spec.hanWindow = utils.nop;
    spec.welWindow = utils.nop;
    spec.triWindow = utils.nop;
    spec.scurve = utils.nop;
    spec.ramp = utils.nop;
    spec["+"] = utils.nop;
    spec["-"] = utils.nop;
    spec["*"] = utils.nop;
    spec["/"] = utils.nop;
    spec.mod = utils.nop;
    spec.min = utils.nop;
    spec.max = utils.nop;
    spec.bitAnd = utils.nop;
    spec.bitOr = utils.nop;
    spec.bitXor = utils.nop;
    spec.bitHammingDistance = utils.nop;
    // TODO: Implements hammingDistance
    spec.lcm = utils.nop;
    spec.gcd = utils.nop;
    spec.round = utils.nop;
    spec.roundUp = utils.nop;
    spec.trunc = utils.nop;
    spec.atan2 = utils.nop;
    spec.hypot = utils.nop;
    spec.hypotApx = utils.nop;
    spec.pow = utils.nop;
    spec.leftShift = utils.nop;
    spec.rightShift = utils.nop;
    spec.unsignedRightShift = utils.nop;
    spec.rrand = utils.nop;
    spec.exprand = utils.nop;

    // TODO: Implements <
    // TODO: Implements >
    // TODO: Implements <=
    // TODO: Implements >=

    spec.degreeToKey = utils.nop;
    spec.degrad = utils.nop;
    spec.raddeg = utils.nop;
    spec.doNumberOp = utils.nop;
    spec.doComplexOp = utils.nop;
    spec.doSignalOp = utils.nop;

    // TODO: Implements doListOp
    // TODO: Implements primitiveIndex
    // TODO: Implements specialIndex
    // TODO: Implements printOn
    // TODO: Implements storeOn
    // TODO: Implements codegen_UGenCtorArg

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    // TODO: Implements kr
    // TODO: Implements ir
    // TODO: Implements tr
    // TODO: Implements ar
    // TODO: Implements matchOSCAddressPattern
    // TODO: Implements help

    spec.asString = function() {
      return $.String(this._);
    };

    spec.shallowCopy = utils.nop;

    spec.performBinaryOpOnSimpleNumber = utils.nop;
  });

});

// src/sc/classlib/Core/Ref.js
SCScript.install(function(sc) {

  var fn = sc.lang.fn;

  sc.lang.klass.refine("Ref", function(spec, utils) {
    spec.$new = function($thing) {
      return this.__super__("new").value_($thing);
    };

    spec.valueOf = function() {
      return this._$value.valueOf();
    };

    spec.value = function() {
      return this._$value;
    };

    spec.value_ = fn(function($value) {
      this._$value = $value;
      return this;
    }, "value");

    // $new

    spec.set = fn(function($thing) {
      this._$value = $thing;
      return this;
    }, "thing");

    spec.get = function() {
      return this._$value;
    };

    spec.dereference = spec.value;

    spec.asRef = utils.nop;

    spec.valueArray = spec.value;

    spec.valueEnvir = spec.value;

    spec.valueArrayEnvir = spec.value;

    spec.next = spec.value;

    spec.asUGenInput = utils.nop;

    // TODO: implements printOn
    // TODO: implements storeOn

    spec.at = function($key) {
      return this._$value.at($key);
    };

    spec.put = function($key, $val) {
      return this._$value.put($key, $val);
    };

    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });

});

// src/sc/classlib/Core/Nil.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Nil", function(spec, utils) {
    var $nil = utils.$nil;

    spec.__num__ = function() {
      return 0;
    };

    spec.__bool__ = function() {
      return false;
    };

    spec.__sym__ = function() {
      return "nil";
    };

    spec.toString = function() {
      return "nil";
    };

    spec.$new = function() {
      throw new Error("Nil.new is illegal, should use literal.");
    };

    spec.isNil = utils.alwaysReturn$true;
    spec.notNil = utils.alwaysReturn$false;

    spec["?"] = function($obj) {
      return $obj;
    };

    spec["??"] = function($obj) {
      return $obj.value();
    };

    spec["!?"] = utils.nop;

    spec.asBoolean = utils.alwaysReturn$false;
    spec.booleanValue = utils.alwaysReturn$false;

    spec.push = fn(function($function) {
      return $function.value();
    }, "function");

    spec.appendStream = fn(function($stream) {
      return $stream;
    }, "stream");

    spec.pop = utils.nop;
    spec.source = utils.nop;
    spec.source_ = utils.nop;

    spec.rate = utils.nop;
    spec.numChannels = utils.nop;
    spec.isPlaying = utils.alwaysReturn$false;

    spec.do = utils.nop;
    spec.reverseDo = utils.nop;
    spec.pairsDo = utils.nop;
    spec.collect = utils.nop;
    spec.select = utils.nop;
    spec.reject = utils.nop;
    spec.detect = utils.nop;
    spec.collectAs = utils.nop;
    spec.selectAs = utils.nop;
    spec.rejectAs = utils.nop;

    spec.dependants = function() {
      return $("IdentitySet").new();
    };

    spec.changed = utils.nop;
    spec.addDependant = utils.nop;
    spec.removeDependant = utils.nop;
    spec.release = utils.nop;
    spec.update = utils.nop;

    spec.transformEvent = fn(function($event) {
      return $event;
    }, "event");

    spec.awake = utils.alwaysReturn$nil;

    spec.play = utils.nop;

    spec.nextTimeOnGrid = fn(function($clock) {
      if ($clock === $nil) {
        return $clock;
      }
      return $.Function(function() {
        return [ function() {
          return $clock.$("nextTimeOnGrid");
        } ];
      });
    }, "clock");

    spec.asQuant = function() {
      return $("Quant").default();
    };

    spec.swapThisGroup = utils.nop;
    spec.performMsg = utils.nop;

    spec.printOn = fn(function($stream) {
      $stream.putAll($.String("nil"));
      return this;
    }, "stream");

    spec.storeOn = fn(function($stream) {
      $stream.putAll($.String("nil"));
      return this;
    }, "stream");

    spec.matchItem = utils.alwaysReturn$true;

    spec.add = fn(function($value) {
      return $.Array([ $value ]);
    }, "value");

    spec.addAll = fn(function($array) {
      return $array.asArray();
    }, "array");

    spec["++"] = function($array) {
      return $array.asArray();
    };

    spec.asCollection = function() {
      return $.Array();
    };

    spec.remove = utils.nop;

    spec.set = utils.nop;

    spec.get = fn(function($prevVal) {
      return $prevVal;
    }, "prevVal");

    spec.addFunc = function() {
      var functions = slice.call(arguments);
      if (functions.length <= 1) {
        return functions[0];
      }
      return $("FunctionList").new($.Array(functions));
    };

    spec.removeFunc = utils.nop;

    spec.replaceFunc = utils.nop;
    spec.seconds_ = utils.nop;
    spec.throw = utils.nop;

    // TODO: implements handleError

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    spec.asSpec = function() {
      return $("ControlSpec").new();
    };

    spec.superclassesDo = utils.nop;

    spec.shallowCopy = utils.nop;
  });

});

// src/sc/classlib/Core/Kernel.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;
  var klass = sc.lang.klass;

  klass.refine("Class", function(spec) {
    spec.class = function() {
      if (this._isMetaClass) {
        return $("Class");
      }
      return $("Meta_" + this._name);
    };

    spec.name = function() {
      return $.String(this._name);
    };

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

    spec["[]"] = function($anArray) {
      var $newCollection;
      var array, i, imax;

      $newCollection = this.new($anArray.size());

      array = $anArray._;
      for (i = 0, imax = array.length; i < imax; ++i) {
        $newCollection.$("add", [ array[i] ]);
      }

      return $newCollection;
    };
  });

  klass.define("Process", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCProcess() {
      this.__super__("Object");
      this._$interpreter = $nil;
      this._$mainThread  = $nil;
    };

    spec.interpreter = function() {
      return this._$interpreter;
    };

    spec.mainThread = function() {
      return this._$mainThread;
    };
  });

  klass.define("Main : Process", function(spec) {
    spec.constructor = function SCMain() {
      this.__super__("Process");
    };
  });

  klass.define("Interpreter", function(spec, utils) {
    var $nil = utils.$nil;

    spec.constructor = function SCInterpreter() {
      this.__super__("Object");
      this._$ = {};
    };

    (function() {
      var i, ch;

      function getter(name) {
        return function() {
          return this._$[name] || /* istanbul ignore next */ $nil;
        };
      }

      function setter(name) {
        return function($value) {
          this._$[name] = $value || /* istanbul ignore next */ $nil;
          return this;
        };
      }

      for (i = 97; i <= 122; i++) {
        ch = String.fromCharCode(i);
        spec[ch] = getter(ch);
        spec[ch + "_"] = setter(ch);
      }
    })();

    spec.clearAll = function() {
      this._$ = {};
      return this;
    };
  });

});

// src/sc/classlib/Core/Function.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Function", function(spec, utils) {
    var $nil = utils.$nil;
    var SCArray = $("Array");

    // TODO: implements def

    spec.$new = function() {
      throw new Error("Function.new is illegal, should use literal.");
    };

    spec.isFunction = utils.alwaysReturn$true;

    // TODO: implements isClosed

    spec.archiveAsCompileString = utils.alwaysReturn$true;
    spec.archiveAsObject = utils.alwaysReturn$true;

    // TODO: implements checkCanArchive

    spec.shallowCopy = utils.nop;

    spec.choose = function() {
      return this.value();
    };

    spec.update = function() {
      return this._.resume(arguments);
    };

    spec.value = function() {
      return this._.resume(arguments);
    };

    spec.valueArray = function($args) {
      return this._.resume($args.asArray()._);
    };

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

    spec.valueEnvir = function() {
      var args = envir(this._, arguments);
      return this._.resume(args);
    };

    spec.valueArrayEnvir = function($args) {
      var args = envir(this._, $args.asArray()._);
      return this._.resume(args);
    };

    spec.functionPerformList = fn(function($selector, $arglist) {
      return this[$selector.__str__()].apply(this, $arglist.asArray()._);
    }, "selector; arglist");

    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs
    // TODO: implements loop
    // TODO: implements block

    spec.asRoutine = function() {
      return $("Routine").new(this);
    };

    spec.dup = fn(function($n) {
      return SCArray.fill($n, this);
    }, "n=2");

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

    spec.protect = function($handler) {
      var $result;

      try {
        $result = this.value();
      } catch (e) {
        $result = null;
      } finally {
        $handler.value();
      }

      return $result || $nil;
    };

    // TODO: implements try
    // TODO: implements prTry

    // TODO: implements handleError

    spec.case = function() {
      var args, i, imax;

      args = slice.call(arguments);
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
    };

    spec.r = function() {
      return $("Routine").new(this);
    };

    spec.p = function() {
      return $("Prout").new(this);
    };

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    spec.flop = function() {
      var $this = this;

      return $.Function(function() {
        return [ function() {
          var $$args = $.Array(slice.call(arguments));
          return $$args.flop().collect($.Function(function() {
            return [ function($_) {
              return $this.valueArray($_);
            } ];
          }));
        } ];
      });
    };

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    spec.while = fn(function($body) {
      sc.lang.iterator.execute(
        sc.lang.iterator.function$while(this),
        $body
      );
      return this;
    }, "body");
  });

});

// src/sc/classlib/Core/Char.js
SCScript.install(function(sc) {

  var $ = sc.lang.$;

  sc.lang.klass.refine("Char", function(spec, utils) {
    spec.__str__ = function() {
      return this._;
    };

    spec.$nl = function() {
      return $.Char("\n");
    };

    spec.$ff = function() {
      return $.Char("\f");
    };

    spec.$tab = function() {
      return $.Char("\t");
    };

    spec.$space = function() {
      return $.Char(" ");
    };

    spec.$comma = function() {
      return $.Char(",");
    };

    spec.$new = function() {
      throw new Error("Char.new is illegal, should use literal.");
    };

    // TODO: implements hash

    spec.ascii = function() {
      return $.Integer(this._.charCodeAt(0));
    };

    spec.digit = function() {
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
    };

    spec.asAscii = utils.nop;

    spec.asUnicode = function() {
      return this.ascii();
    };

    spec.toUpper = function() {
      return $.Char(this._.toUpperCase());
    };

    spec.toLower = function() {
      return $.Char(this._.toLowerCase());
    };

    spec.isAlpha = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isAlphaNum = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39) ||
                         (0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isPrint = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e));
    };

    spec.isPunct = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x21 <= ascii && ascii <= 0x2f) ||
                         (0x3a <= ascii && ascii <= 0x40) ||
                         (0x5b <= ascii && ascii <= 0x60) ||
                         (0x7b <= ascii && ascii <= 0x7e));
    };

    spec.isControl = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x00 <= ascii && ascii <= 0x1f) || ascii === 0x7f);
    };

    spec.isSpace = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x09 <= ascii && ascii <= 0x0d) || ascii === 0x20);
    };

    spec.isVowl = function() {
      var ch = this._.charAt(0).toUpperCase();
      return $.Boolean("AEIOU".indexOf(ch) !== -1);
    };

    spec.isDecDigit = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39));
    };

    spec.isUpper = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a));
    };

    spec.isLower = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isFileSafe = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e) &&
                         ascii !== 0x2f && // 0x2f is '/'
                         ascii !== 0x3a && // 0x3a is ':'
                         ascii !== 0x22);  // 0x22 is '"'
    };

    spec.isPathSeparator = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean(ascii === 0x2f);
    };

    spec["<"] = function($aChar) {
      return $.Boolean(this.ascii() < $aChar.ascii());
    };

    spec["++"] = function($that) {
      return $.String(this._ + $that.__str__());
    };

    // TODO: implements $bullet
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = function() {
      return $.True();
    };

    spec.asString = function() {
      return $.String(this._);
    };

    spec.shallowCopy = utils.nop;
  });

});

// src/sc/classlib/Core/Boolean.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Boolean", function(spec, utils) {
    spec.__bool__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    };

    spec.xor = function($bool) {
      return $.Boolean(this === $bool).not();
    };

    // TODO: implements if
    // TODO: implements nop
    // TODO: implements &&
    // TODO: implements ||
    // TODO: implements and
    // TODO: implements or
    // TODO: implements nand
    // TODO: implements asInteger
    // TODO: implements binaryValue

    spec.asBoolean = utils.nop;
    spec.booleanValue = utils.nop;

    // TODO: implements keywordWarnings
    // TODO: implements trace
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    spec.while = function() {
      var msg = "While was called with a fixed (unchanging) Boolean as the condition. ";
      msg += "Please supply a Function instead.";
      throw new Error(msg);
    };

    spec.shallowCopy = utils.nop;
  });

  sc.lang.klass.refine("True", function(spec, utils) {
    spec.$new = function() {
      throw new Error("True.new is illegal, should use literal.");
    };

    spec.if = fn(function($trueFunc) {
      return $trueFunc.value();
    }, "trueFunc");

    spec.not = utils.alwaysReturn$false;

    spec["&&"] = function($that) {
      return $that.value();
    };

    spec["||"] = utils.nop;

    spec.and = fn(function($that) {
      return $that.value();
    }, "that");

    spec.or = spec["||"];

    spec.nand = fn(function($that) {
      return $that.value().$("not");
    }, "that");

    spec.asInteger = utils.alwaysReturn$int_1;
    spec.binaryValue = utils.alwaysReturn$int_1;
  });

  sc.lang.klass.refine("False", function(spec, utils) {
    spec.$new = function() {
      throw new Error("False.new is illegal, should use literal.");
    };

    spec.if = fn(function($trueFunc, $falseFunc) {
      return $falseFunc.value();
    }, "trueFunc; falseFunc");

    spec.not = utils.alwaysReturn$true;

    spec["&&"] = utils.nop;

    spec["||"] = function($that) {
      return $that.value();
    };

    spec.and = utils.nop;

    spec.or = fn(function($that) {
      return $that.value();
    }, "that");

    spec.nand = utils.alwaysReturn$true;
    spec.asInteger = utils.alwaysReturn$int_0;
    spec.binaryValue = utils.alwaysReturn$int_0;
  });

});

// src/sc/classlib/Collections/Collection.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Collection", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;
    var SCArray = $("Array");

    spec.$newFrom = fn(function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.do($.Function(function() {
        return [ function($item) {
          $newCollection.add($item);
        } ];
      }));

      return $newCollection;
    }, "aCollection");

    spec.$with = fn(function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    }, "*args");

    spec.$fill = fn(function($size, $function) {
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
    }, "size; function");

    spec.$fill2D = fn(function($rows, $cols, $function) {
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
    }, "rows; cols; function");

    spec.$fill3D = fn(function($planes, $rows, $cols, $function) {
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
    }, "planes; rows; cols; function");

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.$("first");
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int_0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($.Function(function() {
          return [ function($i) {
            $obj.add($function.valueArray($args.put($argIndex, $i)));
          } ];
        }));
      } else {
        $dimensions = $dimensions.$("drop", [ $int_1 ]);
        $n.do($.Function(function() {
          return [ function($i) {
            $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
          } ];
        }));
      }

      return $obj;
    };

    spec.$fillND = fn(function($dimensions, $function) {
      return fillND(this, $dimensions, $function, $.Array([]));
    }, "dimensions; function");

    spec["@"] = function($index) {
      return this.at($index);
    };

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($.Function(function() {
        return [ function($item) {
          if (!$aCollection.$("includes", [ $item ]).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    };

    // TODO: implements hash

    spec.species = function() {
      return SCArray;
    };

    spec.do = function() {
      return this._subclassResponsibility("do");
    };

    // TODO: implements iter

    spec.size = function() {
      var tally = 0;

      this.do($.Function(function() {
        return [ function() {
          tally++;
        } ];
      }));

      return $.Integer(tally);
    };

    spec.flatSize = function() {
      return this.sum($.Function(function() {
        return [ function($_) {
          return $_.$("flatSize");
        } ];
      }));
    };

    spec.isEmpty = function() {
      return $.Boolean(this.size().__int__() === 0);
    };

    spec.notEmpty = function() {
      return $.Boolean(this.size().__int__() !== 0);
    };

    spec.asCollection = utils.nop;
    spec.isCollection = utils.alwaysReturn$true;

    spec.add = function() {
      return this._subclassResponsibility("add");
    };

    spec.addAll = fn(function($aCollection) {
      var $this = this;

      $aCollection.asCollection().do($.Function(function() {
        return [ function($item) {
          return $this.add($item);
        } ];
      }));

      return this;
    }, "aCollection");

    spec.remove = function() {
      return this._subclassResponsibility("remove");
    };

    spec.removeAll = fn(function($list) {
      var $this = this;

      $list.do($.Function(function() {
        return [ function($item) {
          $this.remove($item);
        } ];
      }));

      return this;
    }, "list");

    spec.removeEvery = fn(function($list) {
      this.removeAllSuchThat($.Function(function() {
        return [ function($_) {
          return $list.$("includes", [ $_ ]);
        } ];
      }));
      return this;
    }, "list");

    spec.removeAllSuchThat = function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($.Function(function() {
        return [ function($item) {
          if ($function.value($item).__bool__()) {
            $this.remove($item);
            $removedItems = $removedItems.add($item);
          }
        } ];
      }));

      return $removedItems;
    };

    spec.atAll = fn(function($keys) {
      var $this = this;

      return $keys.$("collect", [ $.Function(function() {
        return [ function($index) {
          return $this.at($index);
        } ];
      }) ]);
    }, "keys");

    spec.putEach = fn(function($keys, $values) {
      var keys, values, i, imax;

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    }, "keys; values");

    spec.includes = fn(function($item1) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($item2) {
          if ($item1 === $item2) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    }, "item1");

    spec.includesEqual = fn(function($item1) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($item2) {
          if ($item1 ["=="] ($item2).__bool__()) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    }, "item1");

    spec.includesAny = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Function(function() {
        return [ function($item) {
          if ($this.includes($item).__bool__()) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    }, "aCollection");

    spec.includesAll = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Function(function() {
        return [ function($item) {
          if (!$this.includes($item).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    }, "aCollection");

    spec.matchItem = fn(function($item) {
      return this.includes($item);
    }, "item");

    spec.collect = function($function) {
      return this.collectAs($function, this.species());
    };

    spec.select = function($function) {
      return this.selectAs($function, this.species());
    };

    spec.reject = function($function) {
      return this.rejectAs($function, this.species());
    };

    spec.collectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Function(function() {
        return [ function($elem, $i) {
          return $res.add($function.value($elem, $i));
        } ];
      }));

      return $res;
    }, "function; class");

    spec.selectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $res.add($elem);
          }
        } ];
      }));

      return $res;
    }, "function; class");

    spec.rejectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if (!$function.value($elem, $i).__bool__()) {
            $res = $res.add($elem);
          }
        } ];
      }));

      return $res;
    }, "function; class");

    spec.detect = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $elem;
            this.break();
          }
        } ];
      }));

      return $res || $nil;
    };

    spec.detectIndex = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $i;
            this.break();
          }
        } ];
      }));
      return $res || $nil;
    };

    spec.doMsg = function() {
      var args = arguments;
      this.do($.Function(function() {
        return [ function($item) {
          $item.perform.apply($item, args);
        } ];
      }));
      return this;
    };

    spec.collectMsg = function() {
      var args = arguments;
      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.perform.apply($item, args);
        } ];
      }));
    };

    spec.selectMsg = function() {
      var args = arguments;
      return this.select($.Function(function() {
        return [ function($item) {
          return $item.perform.apply($item, args);
        } ];
      }));
    };

    spec.rejectMsg = function() {
      var args = arguments;
      return this.reject($.Function(function() {
        return [ function($item) {
          return $item.perform.apply($item, args);
        } ];
      }));
    };

    spec.detectMsg = fn(function($selector, $$args) {
      return this.detect($.Function(function() {
        return [ function($item) {
          return $item.performList($selector, $$args);
        } ];
      }));
    }, "selector; *args");

    spec.detectIndexMsg = fn(function($selector, $$args) {
      return this.detectIndex($.Function(function() {
        return [ function($item) {
          return $item.performList($selector, $$args);
        } ];
      }));
    }, "selector; *args");

    spec.lastForWhich = function($function) {
      var $res = null;
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $elem;
          } else {
            this.break();
          }
        } ];
      }));

      return $res || $nil;
    };

    spec.lastIndexForWhich = function($function) {
      var $res = null;
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $i;
          } else {
            this.break();
          }
        } ];
      }));

      return $res || $nil;
    };

    spec.inject = fn(function($thisValue, $function) {
      var $nextValue;

      $nextValue = $thisValue;
      this.do($.Function(function() {
        return [ function($item, $i) {
          $nextValue = $function.value($nextValue, $item, $i);
        } ];
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.injectr = fn(function($thisValue, $function) {
      var $this = this, size, $nextValue;

      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($.Function(function() {
        return [ function($item, $i) {
          $item = $this.at($.Integer(--size));
          $nextValue = $function.value($nextValue, $item, $i);
        } ];
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.count = function($function) {
      var sum = 0;
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            sum++;
          }
        } ];
      }));

      return $.Integer(sum);
    };

    spec.occurrencesOf = fn(function($obj) {
      var sum = 0;

      this.do($.Function(function() {
        return [ function($elem) {
          if ($elem ["=="] ($obj).__bool__()) {
            sum++;
          }
        } ];
      }));

      return $.Integer(sum);
    }, "obj");

    spec.any = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    };

    spec.every = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if (!$function.value($elem, $i).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    };

    spec.sum = fn(function($function) {
      var $sum;

      $sum = $int_0;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            $sum = $sum ["+"] ($elem);
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
            $sum = $sum ["+"] ($function.value($elem, $i));
          } ];
        }));
      }

      return $sum;
    }, "function");

    spec.mean = function($function) {
      return this.sum($function) ["/"] (this.size());
    };

    spec.product = fn(function($function) {
      var $product;

      $product = $int_1;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            $product = $product ["*"] ($elem);
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
            $product = $product ["*"] ($function.value($elem, $i));
          } ];
        }));
      }

      return $product;
    }, "function");

    spec.sumabs = function() {
      var $sum;

      $sum = $int_0;
      this.do($.Function(function() {
        return [ function($elem) {
          if ($elem.isSequenceableCollection().__bool__()) {
            $elem = $elem.at($int_0);
          }
          $sum = $sum ["+"] ($elem.abs());
        } ];
      }));

      return $sum;
    };

    spec.maxItem = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            if ($maxElement === $nil) {
              $maxElement = $elem;
            } else if ($elem > $maxElement) {
              $maxElement = $elem;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $maxElement;
    }, "function");

    spec.minItem = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            if ($minElement === $nil) {
              $minElement = $elem;
            } else if ($elem < $minElement) {
              $minElement = $elem;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $minElement;
    }, "function");

    spec.maxIndex = fn(function($function) {
      var $maxValue, $maxIndex;

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem, $index) {
            if ($maxValue === $nil) {
              $maxValue = $elem;
              $maxIndex = $index;
            } else if ($elem > $maxValue) {
              $maxValue = $elem;
              $maxIndex = $index;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $maxIndex;
    }, "function");

    spec.minIndex = fn(function($function) {
      var $maxValue, $minIndex;

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem, $index) {
            if ($maxValue === $nil) {
              $maxValue = $elem;
              $minIndex = $index;
            } else if ($elem < $maxValue) {
              $maxValue = $elem;
              $minIndex = $index;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $minIndex;
    }, "function");

    spec.maxValue = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($.Function(function() {
        return [ function($elem, $i) {
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
        } ];
      }));

      return $maxValue;
    }, "function");

    spec.minValue = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      this.do($.Function(function() {
        return [ function($elem, $i) {
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
        } ];
      }));

      return $minValue;
    }, "function");

    spec.maxSizeAtDepth = fn(function($rank) {
      var rank, maxsize = 0;

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($.Function(function() {
        return [ function($sublist) {
          var sz;
          if ($sublist.isCollection().__bool__()) {
            sz = $sublist.maxSizeAtDepth($.Integer(rank - 1));
          } else {
            sz = 1;
          }
          if (sz > maxsize) {
            maxsize = sz;
          }
        } ];
      }));

      return $.Integer(maxsize);
    }, "rank");

    spec.maxDepth = fn(function($max) {
      var $res;

      $res = $max;
      this.do($.Function(function() {
        return [ function($elem) {
          if ($elem.isCollection().__bool__()) {
            $res = $res.max($elem.maxDepth($max.__inc__()));
          }
        } ];
      }));

      return $res;
    }, "max=1");

    spec.deepCollect = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($.Function(function() {
          return [ function($item, $i) {
            return $item.deepCollect($depth, $function, $i, $rank);
          } ];
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($.Function(function() {
        return [ function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        } ];
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.deepDo = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($.Function(function() {
          return [ function($item, $i) {
            $item.deepDo($depth, $function, $i, $rank);
          } ];
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($.Function(function() {
        return [ function($item, $i) {
          $item.deepDo($depth, $function, $i, $rank);
        } ];
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.invert = fn(function($axis) {
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
    }, "axis");

    spec.sect = fn(function($that) {
      var $result;

      $result = this.species().new();
      this.do($.Function(function() {
        return [ function($item) {
          if ($that.$("includes", [ $item ]).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.union = fn(function($that) {
      var $result;

      $result = this.copy();
      $that.do($.Function(function() {
        return [ function($item) {
          if (!$result.includes($item).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.difference = fn(function($that) {
      return this.copy().removeAll($that);
    }, "that");

    spec.symmetricDifference = fn(function($that) {
      var $this = this, $result;

      $result = this.species().new();
      $this.do($.Function(function() {
        return [ function($item) {
          if (!$that.includes($item).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));
      $that.do($.Function(function() {
        return [ function($item) {
          if (!$this.includes($item).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.isSubsetOf = fn(function($that) {
      return $that.$("includesAll", [ this ]);
    }, "that");

    spec.asArray = function() {
      return SCArray.new(this.size()).addAll(this);
    };

    spec.asBag = function() {
      return $("Bag").new(this.size()).addAll(this);
    };

    spec.asList = function() {
      return $("List").new(this.size()).addAll(this);
    };

    spec.asSet = function() {
      return $("Set").new(this.size()).addAll(this);
    };

    spec.asSortedList = function($function) {
      return $("SortedList").new(this.size(), $function).addAll(this);
    };

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

    spec.asString = function() {
      var items = [];
      this.do($.Function(function() {
        return [ function($elem) {
          items.push($elem.__str__());
        } ];
      }));

      return $.String(
        this.__className + "[ " + items.join(", ") + " ]"
      );
    };
  });

});

// src/sc/classlib/Collections/SequenceableCollection.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("SequenceableCollection", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;

    spec["|@|"] = function($index) {
      return this.clipAt($index);
    };

    spec["@@"] = function($index) {
      return this.wrapAt($index);
    };

    spec["@|@"] = function($index) {
      return this.foldAt($index);
    };

    spec.$series = fn(function($size, $start, $step) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start.$("+", [ $step.$("*", [ $.Integer(i) ]) ]));
      }

      return $obj;
    }, "size; start=0; step=1");

    spec.$geom = fn(function($size, $start, $grow) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start);
        $start = $start.$("*", [ $grow ]);
      }

      return $obj;
    }, "size; start; grow");

    spec.$fib = fn(function($size, $a, $b) {
      var $obj, $temp, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($b);
        $temp = $b;
        $b = $a.$("+", [ $b ]);
        $a = $temp;
      }

      return $obj;
    }, "size; a=0.0; b=1.0");

    // TODO: implements $rand
    // TODO: implements $rand2
    // TODO: implements $linrand

    spec.$interpolation = fn(function($size, $start, $end) {
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
    }, "size; start=0.0; end=1.0");

    spec["++"] = function($aSequenceableCollection) {
      var $newlist;

      $newlist = this.species().new(this.size() ["+"] ($aSequenceableCollection.size()));
      $newlist = $newlist.addAll(this).addAll($aSequenceableCollection);

      return $newlist;
    };

    // TODO: implements +++

    spec.asSequenceableCollection = utils.nop;

    spec.choose = function() {
      return this.at(this.size().rand());
    };

    spec.wchoose = fn(function($weights) {
      return this.at($weights.$("windex"));
    }, "weights");

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($.Function(function() {
        return [ function($item, $i) {
          if ($item ["!="] ($aCollection.$("at", [ $i ])).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    };

    // TODO: implements hash

    spec.copyRange = fn(function($start, $end) {
      var $newColl, i, end;

      i = $start.__int__();
      end = $end.__int__();
      $newColl = this.species().new($.Integer(end - i));
      while (i <= end) {
        $newColl.add(this.at($.Integer(i++)));
      }

      return $newColl;
    }, "start; end");

    spec.keep = fn(function($n) {
      var n, size;

      n = $n.__int__();
      if (n >= 0) {
        return this.copyRange($int_0, $.Integer(n - 1));
      }
      size = this.size().__int__();

      return this.copyRange($.Integer(size + n), $.Integer(size - 1));
    }, "n");

    spec.drop = fn(function($n) {
      var n, size;

      n = $n.__int__();
      size = this.size().__int__();
      if (n >= 0) {
        return this.copyRange($n, $.Integer(size - 1));
      }

      return this.copyRange($int_0, $.Integer(size + n - 1));
    }, "n");

    spec.copyToEnd = fn(function($start) {
      return this.copyRange($start, $.Integer(this.size().__int__() - 1));
    }, "start");

    spec.copyFromStart = fn(function($end) {
      return this.copyRange($int_0, $end);
    }, "end");

    spec.indexOf = fn(function($item) {
      var $ret = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($item === $elem) {
            $ret = $i;
            this.break();
          }
        } ];
      }));

      return $ret || $nil;
    }, "item");

    spec.indicesOfEqual = fn(function($item) {
      var indices = [];

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($item === $elem) {
            indices.push($i);
          }
        } ];
      }));

      return indices.length ? $.Array(indices) : $nil;
    }, "item");

    spec.find = fn(function($sublist, $offset) {
      var $subSize_1, $first, $index;
      var size, offset, i, imax;

      $subSize_1 = $sublist.size().__dec__();
      $first = $sublist.first();

      size   = this.size().__int__();
      offset = $offset.__int__();
      for (i = 0, imax = size - offset; i < imax; ++i) {
        $index = $.Integer(i + offset);
        if (this.at($index) ["=="] ($first).__bool__()) {
          if (this.copyRange($index, $index ["+"] ($subSize_1)) ["=="] ($sublist).__bool__()) {
            return $index;
          }
        }
      }

      return $nil;
    }, "sublist; offset=0");

    spec.findAll = fn(function($arr, $offset) {
      var $this = this, $indices, $i;

      $indices = $nil;
      $i = $int_0;

      while (($i = $this.find($arr, $offset)) !== $nil) {
        $indices = $indices.add($i);
        $offset = $i.__inc__();
      }

      return $indices;
    }, "arr; offset=0");

    spec.indexOfGreaterThan = fn(function($val) {
      return this.detectIndex($.Function(function() {
        return [ function($item) {
          return $.Boolean($item > $val);
        } ];
      }));
    }, "val");

    spec.indexIn = fn(function($val) {
      var $i, $j;

      $j = this.indexOfGreaterThan($val);
      if ($j === $nil) {
        return this.size().__dec__();
      }
      if ($j === $int_0) {
        return $j;
      }

      $i = $j.__dec__();

      if ($val.$("-", [ this.at($i) ]) < this.at($j).$("-", [ $val ])) {
        return $i;
      }

      return $j;
    }, "val");

    spec.indexInBetween = fn(function($val) {
      var $a, $b, $div, $i;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }
      $i = this.indexOfGreaterThan($val);

      if ($i === $nil) {
        return this.size().__dec__();
      }
      if ($i === $int_0) {
        return $i;
      }

      $a = this.at($i.__dec__());
      $b = this.at($i);
      $div = $b.$("-", [ $a ]);

      // if ($div ["=="] ($int_0).__bool__()) {
      //   return $i;
      // }

      return $val.$("-", [ $a ]).$("/", [ $div ]).$("+", [ $i.__dec__() ]);
    }, "val");

    spec.isSeries = fn(function($step) {
      var $res = null;

      if (this.size() <= 1) {
        return $true;
      }
      this.doAdjacentPairs($.Function(function() {
        return [ function($a, $b) {
          var $diff = $b.$("-", [ $a ]);
          if ($step === $nil) {
            $step = $diff;
          } else if ($step ["!="] ($diff).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    }, "step");

    spec.resamp0 = fn(function($newSize) {
      var $this = this, $factor;

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int_1)
      );

      return this.species().fill($newSize, $.Function(function() {
        return [ function($i) {
          return $this.at($i ["*"] ($factor).round($.Float(1.0)).asInteger());
        } ];
      }));
    }, "newSize");

    spec.resamp1 = fn(function($newSize) {
      var $this = this, $factor;

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int_1)
      );

      return this.species().fill($newSize, $.Function(function() {
        return [ function($i) {
          return $this.blendAt($i ["*"] ($factor));
        } ];
      }));
    }, "newSize");

    spec.remove = fn(function($item) {
      var $index;

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.removeAt($index);
      }

      return $nil;
    }, "item");

    spec.removing = fn(function($item) {
      var $coll;

      $coll = this.copy();
      $coll.remove($item);

      return $coll;
    }, "item");

    spec.take = fn(function($item) {
      var $index;

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.takeAt($index);
      }

      return $nil;
    }, "item");

    spec.lastIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $.Integer(size - 1);
      }

      return $nil;
    };

    spec.middleIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $.Integer((size - 1) >> 1);
      }

      return $nil;
    };

    spec.first = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($int_0);
      }

      return $nil;
    };

    spec.last = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($.Integer(size - 1));
      }

      return $nil;
    };

    spec.middle = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($.Integer((size - 1) >> 1));
      }

      return $nil;
    };

    spec.top = function() {
      return this.last();
    };

    spec.putFirst = fn(function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($int_0, $obj);
      }

      return this;
    }, "obj");

    spec.putLast = fn(function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($.Integer(size - 1), $obj);
      }

      return this;
    }, "obj");

    spec.obtain = fn(function($index, $default) {
      var $res;

      $res = this.at($index);
      if ($res === $nil) {
        $res = $default;
      }

      return $res;
    }, "index; default");

    spec.instill = fn(function($index, $item, $default) {
      var $res;

      if ($index.__num__() >= this.size()) {
        $res = this.extend($index.__inc__(), $default);
      } else {
        $res = this.copy();
      }

      return $res.put($index, $item);
    }, "index; item; default");

    spec.pairsDo = function($function) {
      var $this = this, $int2 = $.Integer(2);

      $int_0.forBy(this.size() ["-"] ($int2), $int2, $.Function(function() {
        return [ function($i) {
          return $function.value($this.at($i), $this.at($i.__inc__()), $i);
        } ];
      }));

      return this;
    };

    spec.keysValuesDo = function($function) {
      return this.pairsDo($function);
    };

    spec.doAdjacentPairs = function($function) {
      var $i;
      var size, i, imax;

      size = this.size().__int__();
      for (i = 0, imax = size - 1; i < imax; ++i) {
        $i = $.Integer(i);
        $function.value(this.at($i), this.at($i.__inc__()), $i);
      }

      return this;
    };

    spec.separate = fn(function($function) {
      var $this = this, $list, $sublist;

      $list = $.Array();
      $sublist = this.species().new();
      this.doAdjacentPairs($.Function(function() {
        return [ function($a, $b, $i) {
          $sublist = $sublist.add($a);
          if ($function.value($a, $b, $i).__bool__()) {
            $list = $list.add($sublist);
            $sublist = $this.species().new();
          }
        } ];
      }));
      if (this.notEmpty().__bool__()) {
        $sublist = $sublist.add(this.last());
      }
      $list = $list.add($sublist);

      return $list;
    }, "function=true");

    spec.delimit = function($function) {
      var $this = this, $list, $sublist;

      $list = $.Array();
      $sublist = this.species().new();
      this.do($.Function(function() {
        return [ function($item, $i) {
          if ($function.value($item, $i).__bool__()) {
            $list = $list.add($sublist);
            $sublist = $this.species().new();
          } else {
            $sublist = $sublist.add($item);
          }
        } ];
      }));
      $list = $list.add($sublist);

      return $list;
    };

    spec.clump = fn(function($groupSize) {
      var $this = this, $list, $sublist;

      $list = $.Array();
      $sublist = this.species().new($groupSize);
      this.do($.Function(function() {
        return [ function($item) {
          $sublist.add($item);
          if ($sublist.size() >= $groupSize) {
            $list.add($sublist);
            $sublist = $this.species().new($groupSize);
          }
        } ];
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    }, "groupSize");

    spec.clumps = fn(function($groupSizeList) {
      var $this = this, $list, $subSize, $sublist, i = 0;

      $list = $.Array();
      $subSize = $groupSizeList.at($int_0);
      $sublist = this.species().new($subSize);
      this.do($.Function(function() {
        return [ function($item) {
          $sublist = $sublist.add($item);
          if ($sublist.size() >= $subSize) {
            $list = $list.add($sublist);
            $subSize = $groupSizeList.$("wrapAt", [ $.Integer(++i) ]);
            $sublist = $this.species().new($subSize);
          }
        } ];
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    }, "groupSizeList");

    spec.curdle = fn(function($probability) {
      return this.separate($.Function(function() {
        return [ function() {
          return $probability.$("coin");
        } ];
      }));
    }, "probability");

    spec.flatten = fn(function($numLevels) {
      return this._flatten($numLevels.__num__());
    }, "numLevels=1");

    spec._flatten = fn(function(numLevels) {
      var $list;

      if (numLevels <= 0) {
        return this;
      }
      numLevels = numLevels - 1;

      $list = this.species().new();
      this.do($.Function(function() {
        return [ function($item) {
          if ($item._flatten) {
            $list = $list.addAll($item._flatten(numLevels));
          } else {
            $list = $list.add($item);
          }
        } ];
      }));

      return $list;
    }, "numLevels");

    spec.flat = function() {
      return this._flat(this.species().new(this.flatSize()));
    };

    spec._flat = fn(function($list) {
      this.do($.Function(function() {
        return [ function($item) {
          if ($item._flat) {
            $list = $item._flat($list);
          } else {
            $list = $list.add($item);
          }
        } ];
      }));
      return $list;
    }, "list");

    spec.flatIf = fn(function($func) {
      return this._flatIf($func);
    }, "func");

    spec._flatIf = function($func) {
      var $list;

      $list = this.species().new(this.size());
      this.do($.Function(function() {
        return [ function($item, $i) {
          if ($item._flatIf && $func.value($item, $i).__bool__()) {
            $list = $list.addAll($item._flatIf($func));
          } else {
            $list = $list.add($item);
          }
        } ];
      }));

      return $list;
    };

    spec.flop = function() {
      var $this = this, $list, $size, $maxsize;

      $size = this.size();
      $maxsize = $int_0;
      this.do($.Function(function() {
        return [ function($sublist) {
          var $sz;
          if ($sublist.isSequenceableCollection().__bool__()) {
            $sz = $sublist.size();
          } else {
            $sz = $int_1;
          }
          if ($sz > $maxsize) {
            $maxsize = $sz;
          }
        } ];
      }));

      $list = this.species().fill($maxsize, $.Function(function() {
        return [ function() {
          return $this.species().new($size);
        } ];
      }));

      this.do($.Function(function() {
        return [ function($isublist) {
          if ($isublist.isSequenceableCollection().__bool__()) {
            $list.do($.Function(function() {
              return [ function($jsublist, $j) {
                $jsublist.add($isublist.wrapAt($j));
              } ];
            }));
          } else {
            $list.do($.Function(function() {
              return [ function($jsublist) {
                $jsublist.add($isublist);
              } ];
            }));
          }
        } ];
      }));

      return $list;
    };

    spec.flopWith = fn(function($func) {
      var $this = this, $maxsize;

      $maxsize = this.maxValue($.Function(function() {
        return [ function($sublist) {
          if ($sublist.isSequenceableCollection().__bool__()) {
            return $sublist.size();
          }
          return $int_1;
        } ];
      }));

      return this.species().fill($maxsize, $.Function(function() {
        return [ function($i) {
          return $func.valueArray($this.collect($.Function(function() {
            return [ function($sublist) {
              if ($sublist.isSequenceableCollection().__bool__()) {
                return $sublist.wrapAt($i);
              } else {
                return $sublist;
              }
            } ];
          })));
        } ];
      }));
    }, "func");

    // TODO: implements flopTogether
    // TODO: implements flopDeep
    // TODO: implements wrapAtDepth
    // TODO: implements unlace
    // TODO: implements integrate
    // TODO: implements differentiate
    // TODO: implements convertDigits
    // TODO: implements hammingDistance
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInScale
    // TODO: implements nearestInList
    // TODO: implements transposeKey
    // TODO: implements mode
    // TODO: implements performDegreeToKey
    // TODO: implements performNearestInList
    // TODO: implements performNearestInScale
    // TODO: implements convertRhythm
    // TODO: implements sumRhythmDivisions
    // TODO: implements convertOneRhythm

    spec.isSequenceableCollection = utils.alwaysReturn$true;

    spec.containsSeqColl = function() {
      return this.any($.Function(function() {
        return [ function($_) {
          return $_.isSequenceableCollection();
        } ];
      }));
    };

    spec.neg = function() {
      return this.performUnaryOp($.Symbol("neg"));
    };

    spec.bitNot = function() {
      return this.performUnaryOp($.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.performUnaryOp($.Symbol("abs"));
    };

    spec.ceil = function() {
      return this.performUnaryOp($.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.performUnaryOp($.Symbol("floor"));
    };

    spec.frac = function() {
      return this.performUnaryOp($.Symbol("frac"));
    };

    spec.sign = function() {
      return this.performUnaryOp($.Symbol("sign"));
    };

    spec.squared = function() {
      return this.performUnaryOp($.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.performUnaryOp($.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.performUnaryOp($.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.performUnaryOp($.Symbol("exp"));
    };

    spec.reciprocal = function() {
      return this.performUnaryOp($.Symbol("reciprocal"));
    };

    spec.midicps = function() {
      return this.performUnaryOp($.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.performUnaryOp($.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.performUnaryOp($.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.performUnaryOp($.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.performUnaryOp($.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.performUnaryOp($.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.performUnaryOp($.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.performUnaryOp($.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.performUnaryOp($.Symbol("log"));
    };

    spec.log2 = function() {
      return this.performUnaryOp($.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.performUnaryOp($.Symbol("log10"));
    };

    spec.sin = function() {
      return this.performUnaryOp($.Symbol("sin"));
    };

    spec.cos = function() {
      return this.performUnaryOp($.Symbol("cos"));
    };

    spec.tan = function() {
      return this.performUnaryOp($.Symbol("tan"));
    };

    spec.asin = function() {
      return this.performUnaryOp($.Symbol("asin"));
    };

    spec.acos = function() {
      return this.performUnaryOp($.Symbol("acos"));
    };

    spec.atan = function() {
      return this.performUnaryOp($.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.performUnaryOp($.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.performUnaryOp($.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.performUnaryOp($.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.performUnaryOp($.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.performUnaryOp($.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.performUnaryOp($.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.performUnaryOp($.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.performUnaryOp($.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.performUnaryOp($.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.performUnaryOp($.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.performUnaryOp($.Symbol("coin"));
    };

    spec.even = function() {
      return this.performUnaryOp($.Symbol("even"));
    };

    spec.odd = function() {
      return this.performUnaryOp($.Symbol("odd"));
    };

    spec.isPositive = function() {
      return this.performUnaryOp($.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.performUnaryOp($.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.performUnaryOp($.Symbol("isStrictlyPositive"));
    };

    spec.rectWindow = function() {
      return this.performUnaryOp($.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.performUnaryOp($.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.performUnaryOp($.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.performUnaryOp($.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.performUnaryOp($.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.performUnaryOp($.Symbol("ramp"));
    };

    spec.asFloat = function() {
      return this.performUnaryOp($.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.performUnaryOp($.Symbol("asInteger"));
    };

    spec.nthPrime = function() {
      return this.performUnaryOp($.Symbol("nthPrime"));
    };

    spec.prevPrime = function() {
      return this.performUnaryOp($.Symbol("prevPrime"));
    };

    spec.nextPrime = function() {
      return this.performUnaryOp($.Symbol("nextPrime"));
    };

    spec.indexOfPrime = function() {
      return this.performUnaryOp($.Symbol("indexOfPrime"));
    };

    spec.real = function() {
      return this.performUnaryOp($.Symbol("real"));
    };

    spec.imag = function() {
      return this.performUnaryOp($.Symbol("imag"));
    };

    spec.magnitude = function() {
      return this.performUnaryOp($.Symbol("magnitude"));
    };

    spec.magnitudeApx = function() {
      return this.performUnaryOp($.Symbol("magnitudeApx"));
    };

    spec.phase = function() {
      return this.performUnaryOp($.Symbol("phase"));
    };

    spec.angle = function() {
      return this.performUnaryOp($.Symbol("angle"));
    };

    spec.rho = function() {
      return this.performUnaryOp($.Symbol("rho"));
    };

    spec.theta = function() {
      return this.performUnaryOp($.Symbol("theta"));
    };

    spec.degrad = function() {
      return this.performUnaryOp($.Symbol("degrad"));

    };
    spec.raddeg = function() {
      return this.performUnaryOp($.Symbol("raddeg"));
    };

    spec["+"] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("+"), $aNumber, $adverb);
    };

    spec["-"] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("-"), $aNumber, $adverb);
    };

    spec["*"] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("*"), $aNumber, $adverb);
    };

    spec["/"] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("/"), $aNumber, $adverb);
    };

    spec.div = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("div"), $aNumber, $adverb);
    };

    spec.mod = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("mod"), $aNumber, $adverb);
    };

    spec.pow = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("pow"), $aNumber, $adverb);
    };

    spec.min = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("min"), $aNumber, $adverb);
    };

    spec.max = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("max"), $aNumber, $adverb);
    };

    spec["<"] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("<"), $aNumber, $adverb);
    };

    spec["<="] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("<="), $aNumber, $adverb);
    };

    spec[">"] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol(">"), $aNumber, $adverb);
    };

    spec[">="] = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol(">="), $aNumber, $adverb);
    };

    spec.bitAnd = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitAnd"), $aNumber, $adverb);
    };

    spec.bitOr = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitOr"), $aNumber, $adverb);
    };

    spec.bitXor = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitXor"), $aNumber, $adverb);
    };

    spec.bitHammingDistance = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("bitHammingDistance"), $aNumber, $adverb);
    };

    spec.lcm = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("lcm"), $aNumber, $adverb);
    };

    spec.gcd = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("gcd"), $aNumber, $adverb);
    };

    spec.round = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("round"), $aNumber, $adverb);
    };

    spec.roundUp = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("roundUp"), $aNumber, $adverb);
    };

    spec.trunc = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("trunc"), $aNumber, $adverb);
    };

    spec.atan2 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("atan2"), $aNumber, $adverb);
    };

    spec.hypot = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("hypot"), $aNumber, $adverb);
    };

    spec.hypotApx = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("hypotApx"), $aNumber, $adverb);
    };

    spec.leftShift = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("leftShift"), $aNumber, $adverb);
    };

    spec.rightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("rightShift"), $aNumber, $adverb);
    };

    spec.unsignedRightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("unsignedRightShift"), $aNumber, $adverb);
    };

    spec.ring1 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring1"), $aNumber, $adverb);
    };

    spec.ring2 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring2"), $aNumber, $adverb);
    };

    spec.ring3 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring3"), $aNumber, $adverb);
    };

    spec.ring4 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("ring4"), $aNumber, $adverb);
    };

    spec.difsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("difsqr"), $aNumber, $adverb);
    };

    spec.sumsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("sumsqr"), $aNumber, $adverb);
    };

    spec.sqrsum = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("sqrsum"), $aNumber, $adverb);
    };

    spec.sqrdif = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("sqrdif"), $aNumber, $adverb);
    };

    spec.absdif = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("absdif"), $aNumber, $adverb);
    };

    spec.thresh = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("thresh"), $aNumber, $adverb);
    };

    spec.amclip = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("amclip"), $aNumber, $adverb);
    };

    spec.scaleneg = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("scaleneg"), $aNumber, $adverb);
    };

    spec.clip2 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("clip2"), $aNumber, $adverb);
    };

    spec.fold2 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("fold2"), $aNumber, $adverb);
    };

    spec.wrap2 = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("wrap2"), $aNumber, $adverb);
    };

    spec.excess = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("excess"), $aNumber, $adverb);
    };

    spec.firstArg = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("firstArg"), $aNumber, $adverb);
    };

    spec.rrand = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("rrand"), $aNumber, $adverb);
    };

    spec.exprand = function($aNumber, $adverb) {
      return this.performBinaryOp($.Symbol("exprand"), $aNumber, $adverb);
    };

    spec.performUnaryOp = function($aSelector) {
      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.perform($aSelector);
        } ];
      }));
    };

    spec.performBinaryOp = function($aSelector, $theOperand, $adverb) {
      return $theOperand.performBinaryOpOnSeqColl($aSelector, this, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $theOperand, $adverb) {
      var adverb;

      if ($adverb === $nil || !$adverb) {
        return _performBinaryOpOnSeqColl_adverb_nil(
          this, $aSelector, $theOperand
        );
      }
      if ($adverb.isInteger().__bool__()) {
        return _performBinaryOpOnSeqColl_adverb_int(
          this, $aSelector, $theOperand, $adverb.valueOf()
        );
      }

      adverb = $adverb.__sym__();
      if (adverb === "t") {
        return _performBinaryOpOnSeqColl_adverb_t(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "x") {
        return _performBinaryOpOnSeqColl_adverb_x(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "s") {
        return _performBinaryOpOnSeqColl_adverb_s(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "f") {
        return _performBinaryOpOnSeqColl_adverb_f(
          this, $aSelector, $theOperand
        );
      }

      throw new Error(
        "unrecognized adverb: '" + adverb + "' for operator '" + String($aSelector) + "'"
      );
    };

    function _performBinaryOpOnSeqColl_adverb_nil($this, $aSelector, $theOperand) {
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

    function _performBinaryOpOnSeqColl_adverb_int($this, $aSelector, $theOperand, adverb) {
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

        $newList = $theOperand.collect($.Function(function() {
          return [ function($item) {
            return $item.perform($aSelector, $this, $.Integer(adverb - 1));
          } ];
        }));

      } else {

        $newList = $this.collect($.Function(function() {
          return [ function($item) {
            return $theOperand.perform($aSelector, $item, $.Integer(adverb + 1));
          } ];
        }));

      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_t($this, $aSelector, $theOperand) {
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

    function _performBinaryOpOnSeqColl_adverb_x($this, $aSelector, $theOperand) {
      var $size, $newList;

      $size = $theOperand.size() ["*"] ($this.size());
      $newList = $this.species().new($size);
      $theOperand.do($.Function(function() {
        return [ function($a) {
          $this.do($.Function(function() {
            return [ function($b) {
              $newList.add($a.perform($aSelector, $b));
            } ];
          }));
        } ];
      }));

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_s($this, $aSelector, $theOperand) {
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

    function _performBinaryOpOnSeqColl_adverb_f($this, $aSelector, $theOperand) {
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

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      return this.collect($.Function(function() {
        return [ function($item) {
          return $aNumber.perform($aSelector, $item, $adverb);
        } ];
      }));
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      return this.collect($.Function(function() {
        return [ function($item) {
          return $aComplex.perform($aSelector, $item, $adverb);
        } ];
      }));
    };

    spec.asFraction = function($denominator, $fasterBetter) {
      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.$("asFraction", [ $denominator, $fasterBetter ] );
        } ];
      }));
    };

    // TODO: implements asPoint
    // TODO: implements asRect

    spec.ascii = function() {
      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.$("ascii");
        } ];
      }));
    };

    spec.rate = function() {
      if (this.size().__int__() === 1) {
        return this.first().$("rate");
      }
      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.$("rate");
        } ];
      })).minItem();
    };

    spec.multiChannelPerform = function() {
      var method;

      if (this.size() > 0) {
        method = utils.getMethod("Object", "multiChannelPerform");
        return method.apply(this, arguments);
      }

      return this.class().new();
    };

    spec.multichannelExpandRef = utils.nop;

    spec.clip = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("clip") ].concat(slice.call(arguments))
      );
    };

    spec.wrap = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("wrap") ].concat(slice.call(arguments))
      );
    };

    spec.fold = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("fold") ].concat(slice.call(arguments))
      );
    };

    spec.linlin = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("linlin") ].concat(slice.call(arguments))
      );
    };

    spec.linexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("linexp") ].concat(slice.call(arguments))
      );
    };

    spec.explin = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("explin") ].concat(slice.call(arguments))
      );
    };

    spec.expexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("expexp") ].concat(slice.call(arguments))
      );
    };

    spec.lincurve = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lincurve") ].concat(slice.call(arguments))
      );
    };

    spec.curvelin = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("curvelin") ].concat(slice.call(arguments))
      );
    };

    spec.bilin = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("bilin") ].concat(slice.call(arguments))
      );
    };

    spec.biexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("biexp") ].concat(slice.call(arguments))
      );
    };

    spec.moddif = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("moddif") ].concat(slice.call(arguments))
      );
    };

    spec.range = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("range") ].concat(slice.call(arguments))
      );
    };

    spec.exprange = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("exprange") ].concat(slice.call(arguments))
      );
    };

    spec.curverange = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("curverange") ].concat(slice.call(arguments))
      );
    };

    spec.unipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("unipolar") ].concat(slice.call(arguments))
      );
    };

    spec.bipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("bipolar") ].concat(slice.call(arguments))
      );
    };

    spec.lag = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag") ].concat(slice.call(arguments))
      );
    };

    spec.lag2 = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag2") ].concat(slice.call(arguments))
      );
    };

    spec.lag3 = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag3") ].concat(slice.call(arguments))
      );
    };

    spec.lagud = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lagud") ].concat(slice.call(arguments))
      );
    };

    spec.lag2ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag2ud") ].concat(slice.call(arguments))
      );
    };

    spec.lag3ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("lag3ud") ].concat(slice.call(arguments))
      );
    };

    spec.varlag = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("varlag") ].concat(slice.call(arguments))
      );
    };

    spec.slew = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("slew") ].concat(slice.call(arguments))
      );
    };

    spec.blend = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("blend") ].concat(slice.call(arguments))
      );
    };

    spec.checkBadValues = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("checkBadValues") ].concat(slice.call(arguments))
      );
    };

    spec.prune = function() {
      return this.multiChannelPerform.apply(
        this, [ $.Symbol("prune") ].concat(slice.call(arguments))
      );
    };

    // TODO: implements minNyquist

    spec.sort = fn(function($function) {
      if ($function === $nil) {
        $function = $.Function(function() {
          return [ function($a, $b) {
            return $a.$("<=", [ $b ]);
          } ];
        });
      }
      this._sort($function);
      return this;
    }, "function");

    spec.sortBy = fn(function($key) {
      return this.sort($.Function(function() {
        return [ function($a, $b) {
          return $a.$("at", [ $key ]).$("<=", [ $b.$("at", [ $key ]) ]);
        } ];
      }));
    }, "key");

    spec.sortMap = fn(function($function) {
      return this.sort($.Function(function() {
        return [ function($a, $b) {
          return $function.value($a).$("<=", [ $function.value($b) ]);
        } ];
      }));
    }, "function");

    // spec._sort = function($function) {
    //   this.mergeSort($function);
    // };

    // TODO: implements sortedMedian
    // TODO: implements median
    // TODO: implements quickSort
    // TODO: implements order

    spec.swap = fn(function($i, $j) {
      var $temp;

      $temp = this.at($i);
      this.put($i, this.at($j));
      this.put($j, $temp);

      return this;
    }, "i; j");

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

    spec.wrapAt = fn(function($index) {
      $index = $index.$("%", [ this.size() ]);
      return this.at($index);
    }, "index");

    spec.wrapPut = fn(function($index, $value) {
      $index = $index.$("%", [ this.size() ]);
      return this.put($index, $value);
    }, "index; value");

    spec.reduce = fn(function($operator) {
      var once;
      var $result;

      if (this.size().__int__() === 1) {
        return this.at($int_0);
      }

      once = true;
      $result = $nil;
      this.doAdjacentPairs($.Function(function() {
        return [ function($a, $b) {
          if (once) {
            once = false;
            $result = $operator.applyTo($a, $b);
          } else {
            $result = $operator.applyTo($result, $b);
          }
        } ];
      }));

      return $result;
    }, "operator");

    spec.join = fn(function($joiner) {
      var items, joiner;

      items = [];
      this.do($.Function(function() {
        return [ function($item) {
          items.push($item.__str__());
        } ];
      }));

      joiner = ($joiner === $nil) ? "" : $joiner.__str__();

      return $.String(items.join(joiner), true);
    }, "joiner");

    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements schedBundleArrayOnClock
  });

});

// src/sc/classlib/Collections/ArrayedCollection.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;
  var rand     = sc.libs.random;
  var mathlib  = sc.libs.mathlib;

  sc.lang.klass.refine("ArrayedCollection", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.valueOf();
      });
    };

    spec.__elem__ = function(item) {
      return item;
    };

    spec._ThrowIfImmutable = function() {
      if (this.__immutable) {
        throw new Error("Attempted write to immutable object.");
      }
    };

    // TODO: implements $newClear
    // TODO: implements indexedSize

    spec.size = function() {
      return $.Integer(this._.length);
    };

    // TODO: implements maxSize

    spec.swap = fn(function($a, $b) {
      var raw = this._;
      var a, b, len, tmp;

      this._ThrowIfImmutable();

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
    }, "a; b");

    spec.at = fn(function($index) {
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
    }, "index");

    spec.clipAt = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          i = mathlib.clip_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.clip_idx($index.__int__(), this._.length);

      return this._[i];
    }, "index");

    spec.wrapAt = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          var i = mathlib.wrap_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.wrap_idx($index.__int__(), this._.length);

      return this._[i];
    }, "index");

    spec.foldAt = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $.Array($index._.map(function($index) {
          var i = mathlib.fold_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.fold_idx($index.__int__(), this._.length);

      return this._[i];
    }, "index");

    spec.put = fn(function($index, $item) {
      var i;

      this._ThrowIfImmutable();

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
    }, "index; item");

    spec.clipPut = fn(function($index, $item) {
      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.wrapPut = fn(function($index, $item) {
      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.foldPut = fn(function($index, $item) {
      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.removeAt = fn(function($index) {
      var raw = this._;
      var index;

      this._ThrowIfImmutable();

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      return raw.splice(index, 1)[0];
    }, "index");

    spec.takeAt = fn(function($index) {
      var raw = this._;
      var index, ret, instead;

      this._ThrowIfImmutable();

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
    }, "index");

    spec.indexOf = fn(function($item) {
      var index;

      index = this._.indexOf($item);
      return index === -1 ? $nil : $.Integer(index);
    }, "item");

    spec.indexOfGreaterThan = fn(function($val) {
      var raw = this._;
      var val, i, imax = raw.length;

      val = $val.__num__();
      for (i = 0; i < imax; ++i) {
        if (raw[i].__num__() > val) {
          return $.Integer(i);
        }
      }

      return $nil;
    }, "val");

    spec.takeThese = fn(function($func) {
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
    }, "func");

    spec.replace = fn(function($find, $replace) {
      var $index, $out, $array;

      this._ThrowIfImmutable();

      $out     = $.Array();
      $array   = this;
      $find    = $find.asArray();
      $replace = $replace.asArray();
      $.Function(function() {
        return [ function() {
          return ($index = $array.find($find)).notNil();
        } ];
      }).while($.Function(function() {
        return [ function() {
          $out = $out ["++"] ($array.keep($index)) ["++"] ($replace);
          $array = $array.drop($index ["+"] ($find.size()));
        } ];
      }));

      return $out ["++"] ($array);
    }, "find; replace");

    spec.slotSize = function() {
      return this.size();
    };

    spec.slotAt = function($index) {
      return this.at($index);
    };

    spec.slotPut = function($index, $value) {
      return this.put($index, $value);
    };

    spec.slotKey = function($index) {
      return $index;
    };

    spec.slotIndex = utils.alwaysReturn$nil;

    spec.getSlots = function() {
      return this.copy();
    };

    spec.setSlots = function($array) {
      return this.overWrite($array);
    };

    spec.atModify = fn(function($index, $function) {
      this.put($index, $function.value(this.at($index), $index));
      return this;
    }, "index; function");

    spec.atInc = fn(function($index, $inc) {
      this.put($index, this.at($index).$("+", [ $inc ]));
      return this;
    }, "index; inc=1");

    spec.atDec = fn(function($index, $dec) {
      this.put($index, this.at($index).$("-", [ $dec ]));
      return this;
    }, "index; dec=1");

    spec.isArray = utils.alwaysReturn$true;
    spec.asArray = utils.nop;

    spec.copyRange = fn(function($start, $end) {
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
    }, "start; end");

    spec.copySeries = fn(function($first, $second, $last) {
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
    }, "first; second; last");

    spec.putSeries = fn(function($first, $second, $last, $value) {
      var i, first, second, last, step;

      this._ThrowIfImmutable();

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
    }, "first; second; last; value");

    spec.add = fn(function($item) {
      this._ThrowIfImmutable();
      this._.push(this.__elem__($item));

      return this;
    }, "item");

    spec.addAll = fn(function($aCollection) {
      var $this = this;

      this._ThrowIfImmutable();

      if ($aCollection.isCollection().__bool__()) {
        $aCollection.do($.Function(function() {
          return [ function($item) {
            $this._.push($this.__elem__($item));
          } ];
        }));
      } else {
        this.add($aCollection);
      }

      return this;
    }, "aCollection");

    spec.putEach = fn(function($keys, $values) {
      var keys, values, i, imax;

      this._ThrowIfImmutable();

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], this.__elem__(values[i % values.length]));
      }

      return this;
    }, "keys; values");

    spec.extend = fn(function($size, $item) {
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
    }, "size; item");

    spec.insert = fn(function($index, $item) {
      var index;

      this._ThrowIfImmutable();

      index = Math.max(0, $index.__int__());
      this._.splice(index, 0, this.__elem__($item));

      return this;
    }, "index; item");

    spec.move = function($fromIndex, $toIndex) {
      return this.insert($toIndex, this.removeAt($fromIndex));
    };

    spec.addFirst = fn(function($item) {
      var instance, raw;

      raw = this._.slice();
      raw.unshift(this.__elem__($item));

      instance = new this.__Spec([]);
      instance._ = raw;
      return instance;
    }, "item");

    spec.addIfNotNil = fn(function($item) {
      if ($item === $nil) {
        return this;
      }

      return this.addFirst(this.__elem__($item));
    }, "item");

    spec.pop = function() {
      if (this._.length === 0) {
        return $nil;
      }
      this._ThrowIfImmutable();
      return this._.pop();
    };

    spec["++"] = function($anArray) {
      var instance, raw;

      raw = this._.slice();

      instance = new this.__Spec([]);
      instance._ = raw;
      if ($anArray !== $nil) {
        instance.addAll($anArray);
      }
      return instance;
    };

    // TODO: implements overWrite
    // TODO: implements grow
    // TODO: implements growClear

    spec.seriesFill = fn(function($start, $step) {
      var i, imax;

      for (i = 0, imax = this._.length; i < imax; ++i) {
        this.put($.Integer(i), $start);
        $start = $start.$("+", [ $step ]);
      }

      return this;
    }, "start; step");

    spec.fill = fn(function($value) {
      var raw, i, imax;

      this._ThrowIfImmutable();

      $value = this.__elem__($value);

      raw = this._;
      for (i = 0, imax = raw.length; i < imax; ++i) {
        raw[i] = $value;
      }

      return this;
    }, "value");

    spec.do = function($function) {
      iterator.execute(
        iterator.array$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.array$reverseDo(this),
        $function
      );
      return this;
    };

    spec.reverse = function() {
      var $res = this.copy();

      $res._.reverse();

      return $res;
    };

    spec.windex = function() {
      var raw = this._;
      var x, r, i, imax;

      // <-- _ArrayWindex -->
      x = 0;
      r = rand.next();
      for (i = 0, imax = raw.length; i < imax; ++i) {
        x += raw[i].__num__();
        if (x >= r) {
          return $.Integer(i);
        }
      }

      return $int_0;
    };

    spec.normalizeSum = function() {
      return this ["*"] (this.sum().reciprocal());
    };

    spec.normalize = fn(function($min, $max) {
      var $minItem, $maxItem;

      $minItem = this.minItem();
      $maxItem = this.maxItem();
      return this.collect($.Function(function() {
        return [ function($el) {
          return $el.$("linlin", [ $minItem, $maxItem, $min, $max ]);
        } ];
      }));
    }, "min=0.0; max=1.0");

    // TODO: implements asciiPlot
    // TODO: implements perfectShuffle
    // TODO: implements performInPlace

    spec.clipExtend = fn(function($length) {
      var last = this._[this._.length - 1] || $nil;
      return this.extend($length, last);
    }, "length");

    spec.rank = function() {
      return $int_1 ["+"] (this.first().rank());
    };

    spec.shape = function() {
      return $.Array([ this.size() ]) ["++"] (this.at($int_0).$("shape"));
    };

    spec.reshape = function() {
      var $result;
      var shape, size, i, imax;

      shape = slice.call(arguments);

      size = 1;
      for (i = 0, imax = shape.length; i < imax; ++i) {
        size *= shape[i].__int__();
      }

      $result = this.flat().wrapExtend($.Integer(size));
      for (i = imax - 1; i >= 1; --i) {
        $result = $result.clump(shape[i]);
      }

      return $result;
    };

    spec.reshapeLike = fn(function($another, $indexing) {
      var $index, $flat;

      $index = $int_0;
      $flat  = this.flat();

      return $another.deepCollect($.Integer(0x7FFFFFFF), $.Function(function() {
        return [ function() {
          var $item = $flat.perform($indexing, $index);
          $index = $index.__inc__();
          return $item;
        } ];
      }));
    }, "another; indexing=\\wrapAt");

    // TODO: implements deepCollect
    // TODO: implements deepDo

    spec.unbubble = fn(function($depth, $levels) {
      if ($depth.__num__() <= 0) {
        if (this.size().__int__() > 1) {
          return this;
        }
        if ($levels.__int__() <= 1) {
          return this.at($int_0);
        }
        return this.at($int_0).unbubble($depth, $levels.__dec__());
      }

      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.unbubble($depth.__dec__());
        } ];
      }));
    }, "depth=0; levels=1");

    spec.bubble = fn(function($depth, $levels) {
      if ($depth.__int__() <= 0) {
        if ($levels.__int__() <= 1) {
          return $.Array([ this ]);
        }
        return $.Array([ this.bubble($depth, $levels.__dec__()) ]);
      }

      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.bubble($depth.__dec__(), $levels);
        } ];
      }));
    }, "depth=0; levels=1");

    spec.slice = fn(function($$cuts) {
      var $firstCut, $list;
      var cuts_size, cuts;

      cuts_size = $$cuts.size().__int__();
      if (cuts_size === 0) {
        return this.copy();
      }

      $firstCut = $$cuts.at($int_0);
      if ($firstCut === $nil) {
        $list = this.copy();
      } else {
        $list = this.at($firstCut.asArray());
      }

      if (cuts_size === 1) {
        return $list.unbubble();
      }

      cuts = $$cuts._.slice(1);
      return $list.collect($.Function(function() {
        return [ function($item) {
          return $item.$("slice", cuts);
        } ];
      })).unbubble();
    }, "*cuts");

    spec.$iota = function() {
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
    };

    // TODO: implements asRandomTable
    // TODO: implements tableRand
    // TODO: implements msgSize
    // TODO: implements bundleSize
    // TODO: implements clumpBundles

    spec.includes = function($item) {
      return $.Boolean(this._.indexOf($item) !== -1);
    };

    spec.asString = function() {
      return $.String("[ " + this._.map(function($elem) {
        return $elem.asString().__str__();
      }).join(", ") + " ]");
    };

    /* istanbul ignore next */
    spec._sort = function($function) {
      this._ThrowIfImmutable();
      this._.sort(function($a, $b) {
        return $function.value($a, $b).__bool__() ? -1 : 1;
      });
    };
  });

  sc.lang.klass.refine("RawArray", function(spec, utils) {
    var SCArray = $("Array");

    spec.archiveAsCompileString = utils.alwaysReturn$true;
    spec.archiveAsObject = utils.alwaysReturn$true;

    spec.rate = function() {
      return $.Symbol("scalar");
    };

    // TODO: implements readFromStream

    spec.powerset = function() {
      return this.as(SCArray).powerset();
    };
  });

  sc.lang.klass.define("Int8Array : RawArray", function(spec) {
    var int8 = new Int8Array(1);

    spec.constructor = function SCInt8Array() {
      this.__super__("RawArray");
    };

    spec.valueOf = function() {
      return new Int8Array(this._.map(function($elem) {
        return $elem.__int__();
      }));
    };

    spec.__elem__ = function(item) {
      int8[0] = item.__int__();
      return $.Integer(int8[0]);
    };
  });

  sc.lang.klass.define("Int16Array : RawArray", function(spec) {
    var int16 = new Int16Array(1);

    spec.constructor = function SCInt16Array() {
      this.__super__("RawArray");
    };

    spec.valueOf = function() {
      return new Int16Array(this._.map(function($elem) {
        return $elem.__int__();
      }));
    };

    spec.__elem__ = function(item) {
      int16[0] = item.__int__();
      return $.Integer(int16[0]);
    };
  });

  sc.lang.klass.define("Int32Array : RawArray", function(spec) {
    var int32 = new Int32Array(1);

    spec.constructor = function SCInt32Array() {
      this.__super__("RawArray");
    };

    spec.valueOf = function() {
      return new Int32Array(this._.map(function($elem) {
        return $elem.__int__();
      }));
    };

    spec.__elem__ = function(item) {
      int32[0] = item.__int__();
      return $.Integer(int32[0]);
    };
  });

  sc.lang.klass.define("FloatArray : RawArray", function(spec) {
    var float32 = new Float32Array(1);

    spec.constructor = function SCFloatArray() {
      this.__super__("RawArray");
    };

    spec.valueOf = function() {
      return new Float32Array(this._.map(function($elem) {
        return $elem.__num__();
      }));
    };

    spec.__elem__ = function(item) {
      float32[0] = item.__num__();
      return $.Float(float32[0]);
    };
  });

  sc.lang.klass.define("DoubleArray : RawArray", function(spec) {
    var float64 = new Float64Array(1);

    spec.constructor = function SCDoubleArray() {
      this.__super__("RawArray");
    };

    spec.valueOf = function() {
      return new Float64Array(this._.map(function($elem) {
        return $elem.__num__();
      }));
    };

    spec.__elem__ = function(item) {
      float64[0] = item.__num__();
      return $.Float(float64[0]);
    };
  });

});

// src/sc/classlib/Collections/String.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var io = sc.lang.io;

  sc.lang.klass.refine("String", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

    spec.__str__ = function() {
      return this.valueOf();
    };

    spec.__elem__ = function($item) {
      if ($item.__tag !== 1028) {
        throw new TypeError("Wrong type.");
      }
      return $item;
    };

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.__str__();
      }).join("");
    };

    spec.toString = function() {
      return this.valueOf();
    };

    // TODO: implements unixCmdActions
    // TODO: implements unixCmdActions_
    // TODO: implements $initClass
    // TODO: implements $doUnixCmdAction
    // TODO: implements unixCmd
    // TODO: implements unixCmdGetStdOut

    spec.asSymbol = function() {
      return $.Symbol(this.__str__());
    };

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this.__str__());
      return $.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this.__str__());
      return $.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      var raw = this.__str__();
      var a, i, imax;

      a = new Array(raw.length);
      for (i = 0, imax = a.length; i < imax; ++i) {
        a[i] = $.Integer(raw.charCodeAt(i));
      }

      return $.Array(a);
    };

    // TODO: implements stripRTF
    // TODO: implements stripHTML
    // TODO: implements $scDir

    spec.compare = fn(function($aString, $ignoreCase) {
      var araw, braw, length, i, a, b, cmp, func;

      if ($aString.__tag !== 1034) {
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
    }, "aString; ignoreCase=false");

    spec["<"] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() < 0
      );
    };

    spec[">"] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() > 0
      );
    };

    spec["<="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() <= 0
      );
    };

    spec[">="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() >= 0
      );
    };

    spec["=="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() === 0
      );
    };

    spec["!="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() !== 0
      );
    };

    // TODO: implements hash

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber) {
      return $aNumber.asString().perform($aSelector, this);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex) {
      return $aComplex.asString().perform($aSelector, this);
    };

    spec.multiChannelPerform = function() {
      throw new Error("String:multiChannelPerform. Cannot expand strings.");
    };

    spec.isString = utils.alwaysReturn$true;

    spec.asString = utils.nop;

    spec.asCompileString = function() {
      return $.String("\"" + this.__str__() + "\"");
    };

    spec.species = function() {
      return $("String");
    };

    spec.postln = function() {
      io.post(this.__str__() + "\n");
      return this;
    };

    spec.post = function() {
      io.post(this.__str__());
      return this;
    };

    spec.postcln = function() {
      io.post("// " + this.__str__() + "\n");
      return this;
    };

    spec.postc = function() {
      io.post("// " + this.__str__());
      return this;
    };

    // TODO: implements postf
    // TODO: implements format
    // TODO: implements matchRegexp
    // TODO: implements fformat
    // TODO: implements die
    // TODO: implements error
    // TODO: implements warn
    // TODO: implements inform

    spec["++"] = function($anObject) {
      return $.String(
        this.toString() + $anObject.asString().toString()
      );
    };

    spec["+"] = function($anObject) {
      return $.String(
        this.toString() + " " + $anObject.asString().toString()
      );
    };

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

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var iterator = sc.lang.iterator;

  sc.lang.klass.refine("Set", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var SCArray = $("Array");

    spec.$new = fn(function($n) {
      $n = $.Integer(Math.max($n.__int__(), 2) * 2);
      return this.__super__("new").initSet($n);
    }, "n=2");

    spec.valueOf = function() {
      return this._$array._.filter(function($elem) {
        return $elem !== $nil;
      }).map(function($elem) {
        return $elem.valueOf();
      });
    };

    spec.array = function() {
      return this._$array;
    };

    spec.array_ = function($value) {
      this._$array = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.size = function() {
      return $.Integer(this._size);
    };

    spec.species = function() {
      return this.class();
    };

    spec.copy = function() {
      return this.shallowCopy().array_(this._$array.copy());
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.set$do(this),
        $function
      );
      return this;
    };

    spec.clear = function() {
      this._$array.fill();
      this._size = 0;
      return this;
    };

    spec.makeEmpty = function() {
      this.clear();
      return this;
    };

    spec.includes = fn(function($item) {
      return this._$array.at(this.scanFor($item)).notNil();
    }, "item");

    spec.findMatch = fn(function($item) {
      return this._$array.at(this.scanFor($item));
    }, "item");

    spec.add = fn(function($item) {
      var $index;

      if ($item === $nil) {
        throw new Error("A Set cannot contain nil.");
      }

      $index = this.scanFor($item);
      if (this._$array.at($index) === $nil) {
        this.putCheck($index, $item);
      }

      return this;
    }, "item");

    spec.remove = fn(function($item) {
      var $index;

      $index = this.scanFor($item);
      if (this._$array.at($index) !== $nil) {
        this._$array.put($index, $nil);
        this._size -= 1;
        // this.fixCollisionsFrom($index);
      }

      return this;
    }, "item");

    spec.choose = function() {
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
    };

    spec.pop = function() {
      var $index, $val;
      var $array, $size;

      $index = $int_0;
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
    };

    // TODO: implements powerset

    spec.unify = function() {
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($x) {
        $result.addAll($x);
      });

      return $result;
    };

    spec.sect = fn(function($that) {
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($item) {
        if ($item !== $nil && $that.$("includes", [ $item ]).__bool__()) {
          $result.add($item);
        }
      });

      return $result;
    }, "that");

    spec.union = fn(function($that) {
      var $result;

      $result = this.species().new();

      $result.addAll(this);
      $result.addAll($that);

      return $result;
    }, "that");

    spec.difference = fn(function($that) {
      return this.copy().removeAll($that);
    }, "that");

    spec.symmetricDifference = fn(function($that) {
      var $this = this;
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($item) {
        if ($item !== $nil && !$that.$("includes", [ $item ]).__bool__()) {
          $result.add($item);
        }
      });
      $that.do($.Function(function() {
        return [ function($item) {
          if (!$this.includes($item).__bool__()) {
            $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.isSubsetOf = fn(function($that) {
      return $that.$("includesAll", [ this ]);
    }, "that");

    spec["&"] = function($that) {
      return this.sect($that);
    };

    spec["|"] = function($that) {
      return this.union($that);
    };

    spec["-"] = function($that) {
      return this.difference($that);
    };

    spec["--"] = function($that) {
      return this.symmetricDifference($that);
    };

    spec.asSet = utils.nop;

    spec.initSet = function($n) {
      this._$array = SCArray.newClear($n);
      this._size   = 0;
      return this;
    };

    spec.putCheck = function($index, $item) {
      this._$array.put($index, $item);
      this._size += 1;
      this.fullCheck();
      return this;
    };

    spec.fullCheck = function() {
      if (this._$array.size().__int__() < this._size * 2) {
        this.grow();
      }
    };

    spec.grow = function() {
      var array, i, imax;
      array = this._$array._;
      for (i = array.length, imax = i * 2; i < imax; ++i) {
        array[i] = $nil;
      }
    };

    /* istanbul ignore next */
    spec.scanFor = function($obj) {
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
    };

    // TODO: implements fixCollisionsFrom
    // TODO: implements keyAt

  });

});

// src/sc/classlib/Collections/Association.js
SCScript.install(function(sc) {

  sc.lang.klass.define("Association : Magnitude", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

    spec.constructor = function SCAssociation() {
      this.__super__("Magnitude");
    };

    spec.valueOf = function() {
      return this._$key.valueOf();
    };

    spec.key = function() {
      return this._$key;
    };

    spec.key_ = function($value) {
      this._$key = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.value = function() {
      return this._$value;
    };

    spec.value_ = function($value) {
      this._$value = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.$new = function($key, $value) {
      return this._newCopyArgs({
        key: $key,
        value: $value
      });
    };

    spec["=="] = function($anAssociation) {
      if ($anAssociation.key) {
        return this._$key ["=="] ($anAssociation.$("key"));
      }
      return $false;
    };

    spec.hash = function() {
      return this._$key.hash();
    };

    spec["<"] = function($anAssociation) {
      return this._$key.$("<", [ $anAssociation.$("key") ]);
    };

    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements embedInStream
    // TODO: implements transformEvent

  });

});

// src/sc/classlib/Collections/Dictionary.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Dictionary", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_1 = utils.$int_1;
    var SCSet  = $("Set");
    var SCArray = $("Array");
    var SCAssociation = $("Association");

    spec.$new = fn(function($n) {
      return this.__super__("new", [ $n ]);
    }, "n=8");

    spec.valueOf = function() {
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
    };

    spec.$newFrom = fn(function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.$("keysValuesDo", [ $.Function(function() {
        return [ function($k, $v) {
          $newCollection.put($k, $v);
        } ];
      }) ]);

      return $newCollection;
    }, "aCollection");

    spec.at = fn(function($key) {
      return this._$array.at(this.scanFor($key).__inc__());
    }, "key");

    spec.atFail = fn(function($key, $function) {
      var $val;

      $val = this.at($key);
      if ($val === $nil) {
        $val = $function.value();
      }

      return $val;
    }, "key; function");

    spec.matchAt = fn(function($key) {
      var ret = null;

      this.keysValuesDo($.Function(function() {
        return [ function($k, $v) {
          if ($k.matchItem($key).__bool__()) {
            ret = $v;
            this.break();
          }
        } ];
      }));

      return ret || $nil;
    }, "key");

    spec.trueAt = fn(function($key) {
      var $ret;

      $ret = this.at($key);

      return $ret !== $nil ? $ret : $false;
    }, "key");

    spec.add = fn(function($anAssociation) {
      this.put($anAssociation.$("key"), $anAssociation.$("value"));
      return this;
    }, "anAssociation");

    spec.put = fn(function($key, $value) {
      var $array, $index;

      if ($value === $nil) {
        this.removeAt($key);
      } else {
        $array = this._$array;
        $index = this.scanFor($key);
        $array.put($index.__inc__(), $value);
        if ($array.at($index) === $nil) {
          $array.put($index, $key);
          this._incrementSize();
        }
      }

      return this;
    }, "key; value");

    spec.putAll = function() {
      var $this = this;
      var func;

      func = $.Function(function() {
        return [ function($key, $value) {
          $this.put($key, $value);
        } ];
      });

      slice.call(arguments).forEach(function($dict) {
        $dict.keysValuesDo(func);
      }, this);

      return this;
    };

    spec.putPairs = fn(function($args) {
      var $this = this;

      $args.$("pairsDo", [ $.Function(function() {
        return [ function($key, $val) {
          $this.put($key, $val);
        } ];
      }) ]);

      return this;
    }, "args");

    spec.getPairs = fn(function($args) {
      var $this = this;
      var $result;

      if ($args === $nil) {
        $args = this.keys();
      }

      $result = $nil;
      $args.do($.Function(function() {
        return [ function($key) {
          var $val;
          $val = $this.at($key);
          if ($val !== $nil) {
            $result = $result.add($key).add($val);
          }
        } ];
      }));

      return $result;
    }, "args");

    spec.associationAt = fn(function($key) {
      var $res;
      var array, index;

      array = this._$array._;
      index = this.scanFor($key).__int__();

      /* istanbul ignore else */
      if (index >= 0) {
        $res = SCAssociation.new(array[index], array[index + 1]);
      }

      return $res || /* istanbul ignore next */ $nil;
    }, "key");

    spec.associationAtFail = fn(function($argkey, $function) {
      var $index, $key;

      $index = this.scanFor($argkey);
      $key   = this._$array.at($index);

      if ($key === $nil) {
        return $function.value();
      }

      return SCAssociation.new($key, this._$array.at($index.__inc__()));
    }, "argKey; function");

    spec.keys = fn(function($species) {
      var $set;

      if ($species === $nil) {
        $species = SCSet;
      }

      $set = $species.new(this.size());
      this.keysDo($.Function(function() {
        return [ function($key) {
          $set.add($key);
        } ];
      }));

      return $set;
    }, "species");

    spec.values = function() {
      var $list;

      $list = $("List").new(this.size());
      this.do($.Function(function() {
        return [ function($value) {
          $list.add($value);
        } ];
      }));

      return $list;
    };

    spec.includes = fn(function($item1) {
      var $ret = null;

      this.do($.Function(function() {
        return [ function($item2) {
          if ($item1 ["=="] ($item2).__bool__()) {
            $ret = $true;
            this.break();
          }
        } ];
      }));

      return $ret || $false;
    }, "item1");

    spec.includesKey = fn(function($key) {
      return this.at($key).notNil();
    }, "key");

    spec.removeAt = fn(function($key) {
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
    }, "key");

    spec.removeAtFail = fn(function($key, $function) {
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
    }, "key; function");

    spec.remove = function() {
      throw new Error("shouldNotImplement");
    };

    spec.removeFail = function() {
      throw new Error("shouldNotImplement");
    };

    spec.keysValuesDo = fn(function($function) {
      this.keysValuesArrayDo(this._$array, $function);
      return this;
    }, "function");

    spec.keysValuesChange = fn(function($function) {
      var $this = this;

      this.keysValuesDo($.Function(function() {
        return [ function($key, $value, $i) {
          $this.put($key, $function.value($key, $value, $i));
        } ];
      }));

      return this;
    }, "function");

    spec.do = fn(function($function) {
      this.keysValuesDo($.Function(function() {
        return [ function($key, $value, $i) {
          $function.value($value, $i);
        } ];
      }));
      return this;
    }, "function");

    spec.keysDo = fn(function($function) {
      this.keysValuesDo($.Function(function() {
        return [ function($key, $val, $i) {
          $function.value($key, $i);
        } ];
      }));
      return this;
    }, "function");

    spec.associationsDo = fn(function($function) {
      this.keysValuesDo($.Function(function() {
        return [ function($key, $val, $i) {
          var $assoc = SCAssociation.new($key, $val);
          $function.value($assoc, $i);
        } ];
      }));
      return this;
    }, "function");

    spec.pairsDo = fn(function($function) {
      this.keysValuesArrayDo(this._$array, $function);
      return this;
    }, "function");

    spec.collect = fn(function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Function(function() {
        return [ function($key, $elem) {
          $res.put($key, $function.value($elem, $key));
        } ];
      }));

      return $res;
    }, "function");

    spec.select = fn(function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Function(function() {
        return [ function($key, $elem) {
          if ($function.value($elem, $key).__bool__()) {
            $res.put($key, $elem);
          }
        } ];
      }));

      return $res;
    }, "function");

    spec.reject = fn(function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Function(function() {
        return [ function($key, $elem) {
          if (!$function.value($elem, $key).__bool__()) {
            $res.put($key, $elem);
          }
        } ];
      }));

      return $res;
    }, "function");

    spec.invert = function() {
      var $dict;

      $dict = this.class().new(this.size());
      this.keysValuesDo($.Function(function() {
        return [ function($key, $val) {
          $dict.put($val, $key);
        } ];
      }));

      return $dict;
    };

    spec.merge = fn(function($that, $func, $fill) {
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

      $commonKeys.do($.Function(function() {
        return [ function($key) {
          $res.put($key, $func.value($this.at($key), $that.at($key), $key));
        } ];
      }));

      if ($fill.__bool__()) {
        $myKeys.difference($otherKeys).do($.Function(function() {
          return [ function($key) {
            $res.put($key, $this.at($key));
          } ];
        }));
        $otherKeys.difference($myKeys).do($.Function(function() {
          return [ function($key) {
            $res.put($key, $that.at($key));
          } ];
        }));
      }

      return $res;
    }, "that; func; fill=true");

    // TODO: implements blend

    spec.findKeyForValue = fn(function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._$array, $.Function(function() {
        return [ function($key, $val) {
          if ($argValue ["=="] ($val).__bool__()) {
            $ret = $key;
            this.break();
          }
        } ];
      }));

      return $ret || $nil;
    }, "argValue");

    spec.sortedKeysValuesDo = fn(function($function, $sortFunc) {
      var $this = this;
      var $keys;

      $keys = this.keys(SCArray);
      $keys.sort($sortFunc);

      $keys.do($.Function(function() {
        return [ function($key, $i) {
          $function.value($key, $this.at($key), $i);
        } ];
      }));

      return this;
    }, "$function; $sortFunc");

    spec.choose = function() {
      var $array;
      var $size, $index;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }

      $array = this._$array;
      $size  = $array.size() [">>"] ($int_1);

      do {
        $index = $size.rand() ["<<"] ($int_1);
      } while ($array.at($index) === $nil);

      return $array.at($index.__inc__());
    };

    spec.order = fn(function($func) {
      var $assoc;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }

      $assoc = $nil;
      this.keysValuesDo($.Function(function() {
        return [ function($key, $val) {
          $assoc = $assoc.add($key.$("->", [ $val ]));
        } ];
      }));

      return $assoc.sort($func).collect($.Function(function() {
        return [ function($_) {
          return $_.$("key");
        } ];
      }));
    }, "func");

    spec.powerset = function() {
      var $this = this;
      var $keys, $class;

      $keys  = this.keys().asArray().powerset();
      $class = this.class();

      return $keys.collect($.Function(function() {
        return [ function($list) {
          var $dict;

          $dict = $class.new();
          $list.do($.Function(function() {
            return [ function($key) {
              $dict.put($key, $this.at($key));
            } ];
          }));

          return $dict;
        } ];
      }));
    };

    spec.transformEvent = fn(function($event) {
      return $event.$("putAll", [ this ]);
    }, "event");

    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs

    spec.keysValuesArrayDo = function($argArray, $function) {
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
    };

    // TODO: implements grow
    // TODO: implements fixCollisionsFrom

    /* istanbul ignore next */
    spec.scanFor = function($argKey) {
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
    };

    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn

    spec._incrementSize = function() {
      this._size += 1;
      if (this._$array.size().__inc__() < this._size * 4) {
        this.grow();
      }
    };
  });

  sc.lang.klass.refine("IdentityDictionary", function(spec, utils) {
    var $nil = utils.$nil;

    spec.$new = fn(function($n, $proto, $parent, $know) {
      return this.__super__("new", [ $n ])
        .proto_($proto).parent_($parent).know_($know);
    }, "n=8; proto; parent; know=false");

    spec.proto = function() {
      return this._$proto;
    };

    spec.proto_ = function($value) {
      this._$proto = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.parent = function() {
      return this._$parent;
    };

    spec.parent_ = function($value) {
      this._$parent = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.know = function() {
      return this._$know;
    };

    spec.know_ = function($value) {
      this._$know = $value || /* istanbul ignore next */ $nil;
      return this;
    };

    spec.putGet = fn(function($key, $value) {
      var $array, $index, $prev;

      $array = this._$array;
      $index = this.scanFor($key);
      $prev  = $array.at($index.__inc__());
      $array.put($index.__inc__(), $value);
      if ($array.at($index) === $nil) {
        $array.put($index, $key);
        this._incrementSize();
      }

      return $prev;
    }, "key; value");

    spec.findKeyForValue = fn(function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._$array, $.Function(function() {
        return [ function($key, $val) {
          if ($argValue === $val) {
            $ret = $key;
            this.break();
          }
        } ];
      }));

      return $ret || $nil;
    }, "argValue");

    /* istanbul ignore next */
    spec.scanFor = function($argKey) {
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
    };

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

  var fn   = sc.lang.fn;
  var main = sc.lang.main;

  sc.lang.klass.refine("Environment", function(spec, utils) {
    var $nil = utils.$nil;

    var envStack = [];

    spec.$make = function($function) {
      return this.new().make($function);
    };

    spec.$use = function($function) {
      return this.new().use($function);
    };

    spec.make = fn(function($function) {
      var $saveEnvir;

      $saveEnvir = main.$currentEnv;
      main.$currentEnv = this;
      try {
        $function.value(this);
      } catch (e) {}
      main.$currentEnv = $saveEnvir;

      return this;
    }, "function");

    spec.use = fn(function($function) {
      var $result, $saveEnvir;

      $saveEnvir = main.$currentEnv;
      main.$currentEnv = this;
      try {
        $result = $function.value(this);
      } catch (e) {}
      main.$currentEnv = $saveEnvir;

      return $result || /* istanbul ignore next */ $nil;
    }, "function");

    spec.eventAt = fn(function($key) {
      return this.at($key);
    }, "key");

    spec.composeEvents = fn(function($event) {
      return this.copy().putAll($event);
    }, "event");

    spec.$pop = function() {
      if (envStack.length) {
        main.$currentEnv = envStack.pop();
      }
      return this;
    };

    spec.$push = fn(function($envir) {
      envStack.push(main.$currentEnv);
      main.$currentEnv = $envir;
      return this;
    }, "envir");

    spec.pop = function() {
      return this.class().pop();
    };

    spec.push = function() {
      return this.class().push(this);
    };

    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });

});

// src/sc/classlib/Collections/Event.js
SCScript.install(function(sc) {

  var $  = sc.lang.$;
  var io = sc.lang.io;

  sc.lang.klass.refine("Event", function(spec, utils) {
    var $nil = utils.$nil;

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

    spec._doesNotUnderstand = function(methodName, args) {
      var $value;

      if (methodName.charAt(methodName.length - 1) === "_") {
        // setter
        methodName = methodName.substr(0, methodName.length - 1);
        if (this[methodName]) {
          io.warn(
            "WARNING: '" + methodName + "' exists a method name, " +
              "so you can't use it as pseudo-method"
          );
        }
        $value = args[0] || /* istanbul ignore next */ $nil;
        this.put($.Symbol(methodName), $value);
        return $value;
      }

      // getter
      return this.at($.Symbol(methodName));
    };
  });

});

// src/sc/classlib/Collections/Array.js
SCScript.install(function(sc) {

  var slice = [].slice;
  var $     = sc.lang.$;
  var fn    = sc.lang.fn;
  var rand  = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  sc.lang.klass.refine("Array", function(spec, utils) {
    var $nil    = utils.$nil;
    var SCArray = $("Array");

    spec.$newClear = fn(function($indexedSize) {
      var array, indexedSize, i;

      indexedSize = $indexedSize.__int__();
      array = new Array(indexedSize);
      for (i = 0; i < indexedSize; ++i) {
        array[i] = $nil;
      }

      return $.Array(array);
    }, "indexedSize=0");

    spec.$with = function() {
      return $.Array(slice.call(arguments));
    };

    spec.reverse = function() {
      // <-- _ArrayReverse -->
      return $.Array(this._.slice().reverse());
    };

    spec.scramble = function() {
      var a, tmp, i, j, m;

      // <-- _ArrayScramble -->
      a = this._.slice();
      m = a.length;
      if (m > 1) {
        for (i = 0; m > 0; ++i, --m) {
          j = i + (rand.next() * m)|0;
          tmp  = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
      }

      return $.Array(a);
    };

    spec.mirror = function() {
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
    };

    spec.mirror1 = function() {
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
    };

    spec.mirror2 = function() {
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
    };

    spec.stutter = fn(function($n) {
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
    }, "n=2");

    spec.rotate = fn(function($n) {
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
    }, "n=1");

    spec.pyramid = fn(function($patternType) {
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
    }, "n=1");

    spec.pyramidg = fn(function($patternType) {
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
    }, "n=1");

    spec.sputter = fn(function($probability, $maxlen) {
      var list, prob, maxlen, i, length;

      list   = [];
      prob   = 1.0 - $probability.__num__();
      maxlen = $maxlen.__int__();
      i = 0;
      length = this._.length;
      while (i < length && list.length < maxlen) {
        list.push(this._[i]);
        if (rand.next() < prob) {
          i += 1;
        }
      }

      return $.Array(list);
    }, "probability=0.25; maxlen=100");

    spec.lace = fn(function($length) {
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
    }, "length");

    spec.permute = fn(function($nthPermutation) {
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
    }, "nthPermutation=0");

    spec.allTuples = fn(function($maxTuples) {
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
    }, "maxTuples=16384");

    spec.wrapExtend = fn(function($size) {
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
    }, "size");

    spec.foldExtend = fn(function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[mathlib.fold_idx(i, raw.length)];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    }, "size");

    spec.clipExtend = fn(function($size) {
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
    }, "size");

    spec.slide = fn(function($windowLength, $stepSize) {
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
    }, "windowLength=3; stepSize=1");

    spec.containsSeqColl = function() {
      var raw = this._;
      var i, imax;

      for (i = 0, imax = raw.length; i < imax; ++i) {
        if (raw[i].isSequenceableCollection().__bool__()) {
          return $.True();
        }
      }

      return $.False();
    };

    spec.unlace = fn(function($clumpSize, $numChan) {
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
    }, "clumpSize=2; numChan=1");

    // TODO: implements interlace
    // TODO: implements deinterlace

    spec.flop =  function() {
      return this.multiChannelExpand();
    };

    spec.multiChannelExpand = function() {
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
    };

    // TODO: implements envirPairs

    spec.shift = fn(function($n, $filler) {
      var $fill, $remain;

      $fill = SCArray.fill($n.$("abs"), $filler);
      $remain = this.drop($n.$("neg"));

      if ($n < 0) {
        return $remain ["++"] ($fill);
      }

      return $fill ["++"] ($remain);
    }, "n; fillter=0.0");

    spec.powerset = function() {
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
    };

    // TODO: implements source

    spec.asUGenInput = function($for) {
      return this.collect($.Function(function() {
        return [ function($_) {
          return $_.asUGenInput($for);
        } ];
      }));
    };

    spec.asAudioRateInput = function($for) {
      return this.collect($.Function(function() {
        return [ function($_) {
          return $_.asAudioRateInput($for);
        } ];
      }));
    };

    spec.asControlInput = function() {
      return this.collect($.Function(function() {
        return [ function($_) {
          return $_.asControlInput();
        } ];
      }));
    };

    spec.isValidUGenInput = utils.alwaysReturn$true;

    spec.numChannels = function() {
      return this.size();
    };

    // TODO: implements poll
    // TODO: implements dpoll
    // TODO: implements evnAt
    // TODO: implements atIdentityHash
    // TODO: implements atIdentityHashInPairs
    // TODO: implements asSpec
    // TODO: implements fork

    spec.madd = fn(function($mul, $add) {
      return $("MulAdd").new(this, $mul, $add);
    }, "mul=1.0; add=0.0");

    // TODO: implements asRawOSC
    // TODO: implements printOn
    // TODO: implements storeOn
  });

});
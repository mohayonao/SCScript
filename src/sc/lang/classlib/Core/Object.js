(function(sc) {
  "use strict";

  require("../../classlib");

  var slice = [].slice;
  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Object", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

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
    // TODO: implements post
    // TODO: implements postln
    // TODO: implements postc
    // TODO: implements postcln
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
      $function = utils.defaultValue$Nil($function);

      sc.lang.iterator.execute(
        sc.lang.iterator.object$do(this),
        $function
      );

      return this;
    };

    spec.generate = function($function, $state) {
      $state = utils.defaultValue$Nil($state);

      this.do($function);

      return $state;
    };

    // already defined: class
    // already defined: isKindOf
    // already defined: isMemberOf

    spec.respondsTo = function($aSymbol) {
      $aSymbol = utils.defaultValue$Nil($aSymbol);
      return $SC.Boolean(typeof this[$aSymbol.__sym__()] === "function");
    };

    // TODO: implements performMsg

    spec.perform = function($selector) {
      var selector, method;
      $selector = utils.defaultValue$Nil($selector);

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, slice.call(arguments, 1));
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.performList = function($selector, $arglist) {
      var selector, method;
      $selector = utils.defaultValue$Nil($selector);
      $arglist  = utils.defaultValue$Nil($arglist);

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
      var a = new this.__class._Spec();

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

    spec.dup = function($n) {
      var $this = this;
      var $array, i, imax;

      $n = utils.defaultValue$Integer($n, 2);
      if (BOOL($n.isSequenceableCollection())) {
        return SCArray.fillND($n, $SC.Function(function() {
          return $this.copy();
        }));
      }

      $array = SCArray.new($n);
      for (i = 0, imax = $n.__int__(); i < imax; ++i) {
        $array.add(this.copy());
      }

      return $array;
    };

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
      return $SC.Boolean(this === $obj);
    };

    spec["!=="] = function($obj) {
      return $SC.Boolean(this !== $obj);
    };

    // TODO: implements equals
    // TODO: implements compareObject
    // TODO: implements instVarHash
    // TODO: implements basicHash
    // TODO: implements hash
    // TODO: implements identityHash

    spec["->"] = function($obj) {
      return $SC("Association").new(this, $obj);
    };

    spec.next = utils.nop;
    spec.reset = utils.nop;

    spec.first = function($inval) {
      $inval = utils.defaultValue$Nil($inval);

      this.reset();
      return this.next($inval);
    };

    spec.iter = function() {
      return $SC("OneShotStream").new(this);
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

    spec.composeEvents = function($event) {
      $event = utils.defaultValue$Nil($event);
      return $event.copy();
    };

    spec.finishEvent = utils.nop;
    spec.atLimit = utils.alwaysReturn$false;
    spec.isRest = utils.alwaysReturn$false;
    spec.threadPlayer = utils.nop;
    spec.threadPlayer_ = utils.nop;
    spec["?"] = utils.nop;
    spec["??"] = utils.nop;

    spec["!?"] = function($obj) {
      $obj = utils.defaultValue$Nil($obj);
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

    spec.matchItem = function($item) {
      $item = utils.defaultValue$Nil($item);
      return this ["==="] ($item);
    };

    spec.trueAt = utils.alwaysReturn$false;

    spec.falseAt = function($key) {
      $key = utils.defaultValue$Nil($key);
      return this.trueAt($key).not();
    };

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
    spec._doesNotUnderstand = function(methodName) {
      throw new Error("RECEIVER " + this.__str__() + ": " +
                      "Message '" + methodName + "' not understood.");
    };

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
      return $SC.Array([ this ]);
    };

    spec.asSymbol = function() {
      return this.asString().asSymbol();
    };

    spec.asString = function() {
      return $SC.String(String(this));
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

    spec.as = function($aSimilarClass) {
      $aSimilarClass = utils.defaultValue$Nil($aSimilarClass);
      return $aSimilarClass.newFrom(this);
    };

    spec.dereference = utils.nop;

    spec.reference = function() {
      return $SC.Ref(this);
    };

    spec.asRef = function() {
      return $SC.Ref(this);
    };

    spec.asArray = function() {
      return this.asCollection().asArray();
    };

    spec.asSequenceableCollection = function() {
      return this.asArray();
    };

    spec.rank = utils.alwaysReturn$int_0;

    spec.deepCollect = function($depth, $function, $index, $rank) {
      $function = utils.defaultValue$Nil($function);
      return $function.value(this, $index, $rank);
    };

    spec.deepDo = function($depth, $function, $index, $rank) {
      $function = utils.defaultValue$Nil($function);
      $function.value(this, $index, $rank);
      return this;
    };

    spec.slice = utils.nop;
    spec.shape = utils.alwaysReturn$nil;
    spec.unbubble = utils.nop;

    spec.bubble = function($depth, $levels) {
      var levels, a;
      $levels = utils.defaultValue$Integer($levels, 1);

      levels = $levels.__int__();
      if (levels <= 1) {
        a = [ this ];
      } else {
        a = [
          this.bubble($depth, $SC.Integer(levels - 1))
        ];
      }

      return $SC.Array(a);
    };

    spec.obtain = function($index, $default) {
      $index   = utils.defaultValue$Nil($index);
      $default = utils.defaultValue$Nil($default);

      if ($index.__num__() === 0) {
        return this;
      } else {
        return $default;
      }
    };

    spec.instill = function($index, $item, $default) {
      $index = utils.defaultValue$Nil($index);
      $item  = utils.defaultValue$Nil($item);

      if ($index.__num__() === 0) {
        return $item;
      } else {
        return this.asArray().instill($index, $item, $default);
      }
    };

    spec.addFunc = fn(function($$functions) {
      return $SC("FunctionList").new(this ["++"] ($$functions));
    }, "*functions");

    spec.removeFunc = function($function) {
      if (this === $function) {
        return $nil;
      }
      return this;
    };

    spec.replaceFunc = function($find, $replace) {
      $replace = utils.defaultValue$Nil($replace);
      if (this === $find) {
        return $replace;
      }
      return this;
    };

    // TODO: implements addFuncTo
    // TODO: implements removeFuncFrom

    spec.while = function($body) {
      var $this = this;
      $body = utils.defaultValue$Nil($body);

      $SC.Function(function() {
        return $this.value();
      }).while($SC.Function(function() {
        return $body.value();
      }));

      return this;
    };

    spec.switch = function() {
      var args, i, imax;

      args = slice.call(arguments);
      for (i = 0, imax = args.length >> 1; i < imax; i++) {
        if (BOOL(this ["=="] (args[i * 2]))) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    };

    spec.yield = function() {
      // TODO: implements yield
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
      return this.bitAnd($that);
    };

    spec["|"] = function($that) {
      return this.bitOr($that);
    };

    spec["%"] = function($that) {
      return this.mod($that);
    };

    spec["**"] = function($that) {
      return this.pow($that);
    };

    spec["<<"] = function($that) {
      return this.leftShift($that);
    };

    spec[">>"] = function($that) {
      return this.rightShift($that);
    };

    spec["+>>"] = function($that) {
      return this.unsignedRightShift($that);
    };

    spec["<!"] = function($that) {
      return this.firstArg($that);
    };

    spec.asInt = function() {
      return this.asInteger();
    };

    spec.blend = function($that, $blendFrac) {
      $that      = utils.defaultValue$Nil($that);
      $blendFrac = utils.defaultValue$Float($blendFrac, 0.5);
      return this ["+"] ($blendFrac ["*"] ($that ["-"] (this)));
    };

    spec.blendAt = function($index, $method) {
      var $iMin;
      $index  = utils.defaultValue$Nil($index);
      $method = utils.defaultValue$Symbol($method, "clipAt");

      $iMin = $index.roundUp($int_1).asInteger().__dec__();
      return this.perform($method, $iMin).blend(
        this.perform($method, $iMin.__inc__()),
        $index.absdif($iMin)
      );
    };

    spec.blendPut = function($index, $val, $method) {
      var $iMin, $ratio;
      $index  = utils.defaultValue$Nil($index);
      $val    = utils.defaultValue$Nil($val);
      $method = utils.defaultValue$Symbol($method, "wrapPut");

      $iMin = $index.floor().asInteger();
      $ratio = $index.absdif($iMin);
      this.perform($method, $iMin, $val ["*"] ($int_1 ["-"] ($ratio)));
      this.perform($method, $iMin.__inc__(), $val ["*"] ($ratio));

      return this;
    };

    spec.fuzzyEqual = function($that, $precision) {
      $that      = utils.defaultValue$Nil($that);
      $precision = utils.defaultValue$Float($precision, 1.0);

      return $SC.Float(0.0).max(
        $SC.Float(1.0) ["-"] (
          (this ["-"] ($that).abs()) ["/"] ($precision)
        )
      );
    };

    spec.isUGen = utils.alwaysReturn$false;
    spec.numChannels = utils.alwaysReturn$int_1;

    spec.pair = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $SC.Array([ this, $that ]);
    };

    spec.pairs = function($that) {
      var $list;
      $that = utils.defaultValue$Nil($that);

      $list = $SC.Array();
      this.asArray().do($SC.Function(function($a) {
        $that.asArray().do($SC.Function(function($b) {
          $list = $list.add($a.asArray() ["++"] ($b));
        }));
      }));

      return $list;
    };

    spec.awake = function($beats) {
      return this.next($beats);
    };

    spec.beats_ = utils.nop;
    spec.clock_ = utils.nop;

    spec.performBinaryOpOnSomething = function($aSelector) {
      var aSelector;
      $aSelector = utils.defaultValue$Nil($aSelector);

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
        return $SC("K2A").ar(this);
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
  });

})(sc);

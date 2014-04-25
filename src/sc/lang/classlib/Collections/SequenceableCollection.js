(function(sc) {
  "use strict";

  require("./Collection");

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("SequenceableCollection", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;

    spec["|@|"] = function($index) {
      return this.clipAt($index);
    };

    spec["@@"] = function($index) {
      return this.wrapAt($index);
    };

    spec["@|@"] = function($index) {
      return this.foldAt($index);
    };

    spec.$series = function($size, $start, $step) {
      var $obj, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $start = utils.defaultValue$Integer($start, 0);
      $step  = utils.defaultValue$Integer($step, 1);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start ["+"] ($step ["*"] ($SC.Integer(i))));
      }

      return $obj;
    };

    spec.$geom = function($size, $start, $grow) {
      var $obj, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $start = utils.defaultValue$Nil($start);
      $grow  = utils.defaultValue$Nil($grow);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start);
        $start = $start ["*"] ($grow);
      }

      return $obj;
    };

    spec.$fib = function($size, $a, $b) {
      var $obj, $temp, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $a = utils.defaultValue$Float($a, 0.0);
      $b = utils.defaultValue$Float($b, 1.0);

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($b);
        $temp = $b;
        $b = $a ["+"] ($b);
        $a = $temp;
      }

      return $obj;
    };

    // TODO: implements $rand
    // TODO: implements $rand2
    // TODO: implements $linrand

    spec.$interpolation = function($size, $start, $end) {
      var $obj, $step, i, imax;
      $size  = utils.defaultValue$Nil($size);
      $start = utils.defaultValue$Float($start, 0.0);
      $end   = utils.defaultValue$Float($end  , 1.0);

      $obj = this.new($size);
      if ($size.__int__() === 1) {
        return $obj.add($start);
      }

      $step = ($end ["-"] ($start)) ["/"] ($size.__dec__());
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start ["+"] ($SC.Integer(i) ["*"] ($step)));
      }

      return $obj;
    };

    spec["++"] = function($aSequenceableCollection) {
      var $newlist;
      $aSequenceableCollection = utils.defaultValue$Nil($aSequenceableCollection);

      $newlist = this.species().new(this.size() ["+"] ($aSequenceableCollection.size()));
      $newlist = $newlist.addAll(this).addAll($aSequenceableCollection);

      return $newlist;
    };

    // TODO: implements +++

    spec.asSequenceableCollection = utils.nop;

    spec.choose = function() {
      return this.at(this.size().rand());
    };

    spec.wchoose = function($weights) {
      $weights = utils.defaultValue$Nil($weights);
      return this.at($weights.windex());
    };

    spec["=="] = function($aCollection) {
      var $res = null;
      $aCollection = utils.defaultValue$Nil($aCollection);

      if ($aCollection.class() !== this.class()) {
        return utils.falseInstance;
      }
      if (this.size() !== $aCollection.size()) {
        return utils.falseInstance;
      }
      this.do($SC.Function(function($item, $i) {
        if (bool($item ["!="] ($aCollection.at($i)))) {
          $res = utils.falseInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.trueInstance;
    };

    // TODO: implements hash

    spec.copyRange = function($start, $end) {
      var $newColl, i, end;
      $start = utils.defaultValue$Nil($start);
      $end   = utils.defaultValue$Nil($end);

      i = $start.__int__();
      end = $end.__int__();
      $newColl = this.species().new($SC.Integer(end - i));
      while (i <= end) {
        $newColl.add(this.at($SC.Integer(i++)));
      }

      return $newColl;
    };

    spec.keep = function($n) {
      var n, size;
      $n = utils.defaultValue$Nil($n);

      n = $n.__int__();
      if (n >= 0) {
        return this.copyRange($int0, $SC.Integer(n - 1));
      }
      size = this.size().__int__();

      return this.copyRange($SC.Integer(size + n), $SC.Integer(size - 1));
    };

    spec.drop = function($n) {
      var n, size;
      $n = utils.defaultValue$Nil($n);

      n = $n.__int__();
      size = this.size().__int__();
      if (n >= 0) {
        return this.copyRange($n, $SC.Integer(size - 1));
      }

      return this.copyRange($int0, $SC.Integer(size + n - 1));
    };

    spec.copyToEnd = function($start) {
      return this.copyRange($start, $SC.Integer(this.size().__int__() - 1));
    };

    spec.copyFromStart = function($end) {
      return this.copyRange($int0, $end);
    };

    spec.indexOf = function($item) {
      var $ret = null;
      $item = utils.defaultValue$Nil($item);

      this.do($SC.Function(function($elem, $i) {
        if ($item === $elem) {
          $ret = $i;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $ret || $nil;
    };

    spec.indicesOfEqual = function($item) {
      var indices = [];
      $item = utils.defaultValue$Nil($item);

      this.do($SC.Function(function($elem, $i) {
        if ($item === $elem) {
          indices.push($i);
        }
      }));

      return indices.length ? $SC.Array(indices) : $nil;
    };

    spec.find = function($sublist, $offset) {
      var $subSize_1, $first, $index;
      var size, offset, i, imax;
      $sublist = utils.defaultValue$Nil($sublist);
      $offset  = utils.defaultValue$Integer($offset, 0);

      $subSize_1 = $sublist.size().__dec__();
      $first = $sublist.first();

      size   = this.size().__int__();
      offset = $offset.__int__();
      for (i = 0, imax = size - offset; i < imax; ++i) {
        $index = $SC.Integer(i + offset);
        if (bool(this.at($index) ["=="] ($first))) {
          if (bool(this.copyRange($index, $index ["+"] ($subSize_1)) ["=="] ($sublist))) {
            return $index;
          }
        }
      }

      return $nil;
    };

    spec.findAll = function($arr, $offset) {
      var $this = this, $indices, $i;
      $arr    = utils.defaultValue$Nil($arr);
      $offset = utils.defaultValue$Integer($offset, 0);

      $indices = $nil;
      $i = $int0;

      while (($i = $this.find($arr, $offset)) !== $nil) {
        $indices = $indices.add($i);
        $offset = $i.__inc__();
      }

      return $indices;
    };

    spec.indexOfGreaterThan = function($val) {
      $val = utils.defaultValue$Nil($val);
      return this.detectIndex($SC.Function(function($item) {
        return $SC.Boolean($item > $val);
      }));
    };

    spec.indexIn = function($val) {
      var $i, $j;
      $val = utils.defaultValue$Nil($val);

      $j = this.indexOfGreaterThan($val);
      if ($j === $nil) {
        return this.size().__dec__();
      }
      if ($j === $int0) {
        return $j;
      }

      $i = $j.__dec__();

      if ($val ["-"] (this.at($i)) < this.at($j) ["-"] ($val)) {
        return $i;
      }

      return $j;
    };

    spec.indexInBetween = function($val) {
      var $a, $b, $div, $i;
      $val = utils.defaultValue$Nil($val);

      if (bool(this.isEmpty())) {
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
      $div = $b ["-"] ($a);

      // if (bool($div ["=="] ($int0))) {
      //   return $i;
      // }

      return (($val ["-"] ($a)) ["/"] ($div)) ["+"] ($i.__dec__());
    };

    spec.isSeries = function($step) {
      var $res = null;
      $step = utils.defaultValue$Nil($step);

      if (this.size() <= 1) {
        return utils.trueInstance;
      }
      this.doAdjacentPairs($SC.Function(function($a, $b) {
        var $diff = $b ["-"] ($a);
        if ($step === $nil) {
          $step = $diff;
        } else if (bool($step ["!="] ($diff))) {
          $res = utils.falseInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.trueInstance;
    };

    spec.resamp0 = function($newSize) {
      var $this = this, $factor;
      $newSize = utils.defaultValue$Nil($newSize);

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int1)
      );

      return this.species().fill($newSize, $SC.Function(function($i) {
        return $this.at($i ["*"] ($factor).round($SC.Float(1.0)).asInteger());
      }));
    };

    spec.resamp1 = function($newSize) {
      var $this = this, $factor;
      $newSize = utils.defaultValue$Nil($newSize);

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int1)
      );

      return this.species().fill($newSize, $SC.Function(function($i) {
        return $this.blendAt($i ["*"] ($factor));
      }));
    };

    spec.remove = function($item) {
      var $index;
      $item = utils.defaultValue$Nil($item);

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.removeAt($index);
      }

      return $nil;
    };

    spec.removing = function($item) {
      var $coll;
      $item = utils.defaultValue$Nil($item);

      $coll = this.copy();
      $coll.remove($item);

      return $coll;
    };

    spec.take = function($item) {
      var $index;
      $item = utils.defaultValue$Nil($item);

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.takeAt($index);
      }

      return $nil;
    };

    spec.lastIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $SC.Integer(size - 1);
      }

      return $nil;
    };

    spec.middleIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $SC.Integer((size - 1) >> 1);
      }

      return $nil;
    };

    spec.first = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($int0);
      }

      return $nil;
    };

    spec.last = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($SC.Integer(size - 1));
      }

      return $nil;
    };

    spec.middle = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($SC.Integer((size - 1) >> 1));
      }

      return $nil;
    };

    spec.top = function() {
      return this.last();
    };

    spec.putFirst = function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($int0, $obj);
      }

      return this;
    };

    spec.putLast = function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($SC.Integer(size - 1), $obj);
      }

      return this;
    };

    spec.obtain = function($index, $default) {
      var $res;
      $index   = utils.defaultValue$Nil($index);
      $default = utils.defaultValue$Nil($default);

      $res = this.at($index);
      if ($res === $nil) {
        $res = $default;
      }

      return $res;
    };

    spec.instill = function($index, $item, $default) {
      var $res;
      $index   = utils.defaultValue$Nil($index);
      $item    = utils.defaultValue$Nil($item);
      $default = utils.defaultValue$Nil($default);

      if ($index.__num__() >= this.size()) {
        $res = this.extend($index.__inc__(), $default);
      } else {
        $res = this.copy();
      }

      return $res.put($index, $item);
    };

    spec.pairsDo = function($function) {
      var $this = this, $int2 = $SC.Integer(2);
      $function = utils.defaultValue$Nil($function);

      $int0.forBy(this.size() ["-"] ($int2), $int2, $SC.Function(function($i) {
        return $function.value($this.at($i), $this.at($i.__inc__()), $i);
      }));

      return this;
    };

    spec.keysValuesDo = function($function) {
      return this.pairsDo($function);
    };

    spec.doAdjacentPairs = function($function) {
      var $i;
      var size, i, imax;
      $function = utils.defaultValue$Nil($function);

      size = this.size().__int__();
      for (i = 0, imax = size - 1; i < imax; ++i) {
        $i = $SC.Integer(i);
        $function.value(this.at($i), this.at($i.__inc__()), $i);
      }

      return this;
    };

    spec.separate = function($function) {
      var $this = this, $list, $sublist;
      $function = utils.defaultValue$Boolean($function, true);

      $list = $SC.Array();
      $sublist = this.species().new();
      this.doAdjacentPairs($SC.Function(function($a, $b, $i) {
        $sublist = $sublist.add($a);
        if (bool($function.value($a, $b, $i))) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        }
      }));
      if (bool(this.notEmpty())) {
        $sublist = $sublist.add(this.last());
      }
      $list = $list.add($sublist);

      return $list;
    };

    spec.delimit = function($function) {
      var $this = this, $list, $sublist;
      $function = utils.defaultValue$Nil($function);

      $list = $SC.Array();
      $sublist = this.species().new();
      this.do($SC.Function(function($item, $i) {
        if (bool($function.value($item, $i))) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        } else {
          $sublist = $sublist.add($item);
        }
      }));
      $list = $list.add($sublist);

      return $list;
    };

    spec.clump = function($groupSize) {
      var $this = this, $list, $sublist;
      $groupSize = utils.defaultValue$Nil($groupSize);

      $list = $SC.Array();
      $sublist = this.species().new($groupSize);
      this.do($SC.Function(function($item) {
        $sublist.add($item);
        if ($sublist.size() >= $groupSize) {
          $list.add($sublist);
          $sublist = $this.species().new($groupSize);
        }
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    };

    spec.clumps = function($groupSizeList) {
      var $this = this, $list, $subSize, $sublist, i = 0;
      $groupSizeList = utils.defaultValue$Nil($groupSizeList);

      $list = $SC.Array();
      $subSize = $groupSizeList.at($int0);
      $sublist = this.species().new($subSize);
      this.do($SC.Function(function($item) {
        $sublist = $sublist.add($item);
        if ($sublist.size() >= $subSize) {
          $list = $list.add($sublist);
          $subSize = $groupSizeList.wrapAt($SC.Integer(++i));
          $sublist = $this.species().new($subSize);
        }
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    };

    spec.curdle = function($probability) {
      $probability = utils.defaultValue$Nil($probability);
      return this.separate($SC.Function(function() {
        return $probability.coin();
      }));
    };

    spec.flatten = function($numLevels) {
      $numLevels = utils.defaultValue$Integer($numLevels, 1);
      return this._flatten($numLevels.__num__());
    };

    spec._flatten = function(numLevels) {
      var $list;

      if (numLevels <= 0) {
        return this;
      }
      numLevels = numLevels - 1;

      $list = this.species().new();
      this.do($SC.Function(function($item) {
        if ($item._flatten) {
          $list = $list.addAll($item._flatten(numLevels));
        } else {
          $list = $list.add($item);
        }
      }));

      return $list;
    };

    spec.flat = function() {
      return this._flat(this.species().new(this.flatSize()));
    };

    spec._flat = function($list) {
      this.do($SC.Function(function($item) {
        if ($item._flat) {
          $list = $item._flat($list);
        } else {
          $list = $list.add($item);
        }
      }));
      return $list;
    };

    spec.flatIf = function($func) {
      $func = utils.defaultValue$Nil($func);
      return this._flatIf($func);
    };

    spec._flatIf = function($func) {
      var $list;

      $list = this.species().new(this.size());
      this.do($SC.Function(function($item, $i) {
        if ($item._flatIf && bool($func.value($item, $i))) {
          $list = $list.addAll($item._flatIf($func));
        } else {
          $list = $list.add($item);
        }
      }));

      return $list;
    };

    spec.flop = function() {
      var $this = this, $list, $size, $maxsize;

      $size = this.size();
      $maxsize = $int0;
      this.do($SC.Function(function($sublist) {
        var $sz;
        if (bool($sublist.isSequenceableCollection())) {
          $sz = $sublist.size();
        } else {
          $sz = $int1;
        }
        if ($sz > $maxsize) {
          $maxsize = $sz;
        }
      }));

      $list = this.species().fill($maxsize, $SC.Function(function() {
        return $this.species().new($size);
      }));

      this.do($SC.Function(function($isublist) {
        if (bool($isublist.isSequenceableCollection())) {
          $list.do($SC.Function(function($jsublist, $j) {
            $jsublist.add($isublist.wrapAt($j));
          }));
        } else {
          $list.do($SC.Function(function($jsublist) {
            $jsublist.add($isublist);
          }));
        }
      }));

      return $list;
    };

    spec.flopWith = function($func) {
      var $this = this, $maxsize;
      $func = utils.defaultValue$Nil($func);

      $maxsize = this.maxValue($SC.Function(function($sublist) {
        if (bool($sublist.isSequenceableCollection())) {
          return $sublist.size();
        }
        return $int1;
      }));

      return this.species().fill($maxsize, $SC.Function(function($i) {
        return $func.valueArray($this.collect($SC.Function(function($sublist) {
          if (bool($sublist.isSequenceableCollection())) {
            return $sublist.wrapAt($i);
          } else {
            return $sublist;
          }
        })));
      }));
    };

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

    spec.isSequenceableCollection = utils.alwaysReturn$True;

    spec.containsSeqColl = function() {
      return this.any($SC.Function(function($_) {
        return $_.isSequenceableCollection();
      }));
    };

    spec.neg = function() {
      return this.performUnaryOp($SC.Symbol("neg"));
    };

    spec.bitNot = function() {
      return this.performUnaryOp($SC.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.performUnaryOp($SC.Symbol("abs"));
    };

    spec.ceil = function() {
      return this.performUnaryOp($SC.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.performUnaryOp($SC.Symbol("floor"));
    };

    spec.frac = function() {
      return this.performUnaryOp($SC.Symbol("frac"));
    };

    spec.sign = function() {
      return this.performUnaryOp($SC.Symbol("sign"));
    };

    spec.squared = function() {
      return this.performUnaryOp($SC.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.performUnaryOp($SC.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.performUnaryOp($SC.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.performUnaryOp($SC.Symbol("exp"));
    };

    spec.reciprocal = function() {
      return this.performUnaryOp($SC.Symbol("reciprocal"));
    };

    spec.midicps = function() {
      return this.performUnaryOp($SC.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.performUnaryOp($SC.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.performUnaryOp($SC.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.performUnaryOp($SC.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.performUnaryOp($SC.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.performUnaryOp($SC.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.performUnaryOp($SC.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.performUnaryOp($SC.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.performUnaryOp($SC.Symbol("log"));
    };

    spec.log2 = function() {
      return this.performUnaryOp($SC.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.performUnaryOp($SC.Symbol("log10"));
    };

    spec.sin = function() {
      return this.performUnaryOp($SC.Symbol("sin"));
    };

    spec.cos = function() {
      return this.performUnaryOp($SC.Symbol("cos"));
    };

    spec.tan = function() {
      return this.performUnaryOp($SC.Symbol("tan"));
    };

    spec.asin = function() {
      return this.performUnaryOp($SC.Symbol("asin"));
    };

    spec.acos = function() {
      return this.performUnaryOp($SC.Symbol("acos"));
    };

    spec.atan = function() {
      return this.performUnaryOp($SC.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.performUnaryOp($SC.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.performUnaryOp($SC.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.performUnaryOp($SC.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.performUnaryOp($SC.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.performUnaryOp($SC.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.performUnaryOp($SC.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.performUnaryOp($SC.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.performUnaryOp($SC.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.performUnaryOp($SC.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.performUnaryOp($SC.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.performUnaryOp($SC.Symbol("coin"));
    };

    spec.even = function() {
      return this.performUnaryOp($SC.Symbol("even"));
    };

    spec.odd = function() {
      return this.performUnaryOp($SC.Symbol("odd"));
    };

    spec.isPositive = function() {
      return this.performUnaryOp($SC.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.performUnaryOp($SC.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.performUnaryOp($SC.Symbol("isStrictlyPositive"));
    };

    spec.rectWindow = function() {
      return this.performUnaryOp($SC.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.performUnaryOp($SC.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.performUnaryOp($SC.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.performUnaryOp($SC.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.performUnaryOp($SC.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.performUnaryOp($SC.Symbol("ramp"));
    };

    spec.asFloat = function() {
      return this.performUnaryOp($SC.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.performUnaryOp($SC.Symbol("asInteger"));
    };

    spec.nthPrime = function() {
      return this.performUnaryOp($SC.Symbol("nthPrime"));
    };

    spec.prevPrime = function() {
      return this.performUnaryOp($SC.Symbol("prevPrime"));
    };

    spec.nextPrime = function() {
      return this.performUnaryOp($SC.Symbol("nextPrime"));
    };

    spec.indexOfPrime = function() {
      return this.performUnaryOp($SC.Symbol("indexOfPrime"));
    };

    spec.real = function() {
      return this.performUnaryOp($SC.Symbol("real"));
    };

    spec.imag = function() {
      return this.performUnaryOp($SC.Symbol("imag"));
    };

    spec.magnitude = function() {
      return this.performUnaryOp($SC.Symbol("magnitude"));
    };

    spec.magnitudeApx = function() {
      return this.performUnaryOp($SC.Symbol("magnitudeApx"));
    };

    spec.phase = function() {
      return this.performUnaryOp($SC.Symbol("phase"));
    };

    spec.angle = function() {
      return this.performUnaryOp($SC.Symbol("angle"));
    };

    spec.rho = function() {
      return this.performUnaryOp($SC.Symbol("rho"));
    };

    spec.theta = function() {
      return this.performUnaryOp($SC.Symbol("theta"));
    };

    spec.degrad = function() {
      return this.performUnaryOp($SC.Symbol("degrad"));

    };
    spec.raddeg = function() {
      return this.performUnaryOp($SC.Symbol("raddeg"));
    };

    spec["+"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("+"), $aNumber, $adverb);
    };

    spec["-"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("-"), $aNumber, $adverb);
    };

    spec["*"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("*"), $aNumber, $adverb);
    };

    spec["/"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("/"), $aNumber, $adverb);
    };

    spec.div = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("div"), $aNumber, $adverb);
    };

    spec.mod = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("mod"), $aNumber, $adverb);
    };

    spec.pow = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("pow"), $aNumber, $adverb);
    };

    spec.min = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("min"), $aNumber, $adverb);
    };

    spec.max = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("max"), $aNumber, $adverb);
    };

    spec["<"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("<"), $aNumber, $adverb);
    };

    spec["<="] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("<="), $aNumber, $adverb);
    };

    spec[">"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol(">"), $aNumber, $adverb);
    };

    spec[">="] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol(">="), $aNumber, $adverb);
    };

    spec.bitAnd = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitAnd"), $aNumber, $adverb);
    };

    spec.bitOr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitOr"), $aNumber, $adverb);
    };

    spec.bitXor = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitXor"), $aNumber, $adverb);
    };

    spec.bitHammingDistance = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitHammingDistance"), $aNumber, $adverb);
    };

    spec.lcm = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("lcm"), $aNumber, $adverb);
    };

    spec.gcd = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("gcd"), $aNumber, $adverb);
    };

    spec.round = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("round"), $aNumber, $adverb);
    };

    spec.roundUp = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("roundUp"), $aNumber, $adverb);
    };

    spec.trunc = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("trunc"), $aNumber, $adverb);
    };

    spec.atan2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("atan2"), $aNumber, $adverb);
    };

    spec.hypot = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("hypot"), $aNumber, $adverb);
    };

    spec.hypotApx = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("hypotApx"), $aNumber, $adverb);
    };

    spec.leftShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("leftShift"), $aNumber, $adverb);
    };

    spec.rightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("rightShift"), $aNumber, $adverb);
    };

    spec.unsignedRightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("unsignedRightShift"), $aNumber, $adverb);
    };

    spec.ring1 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring1"), $aNumber, $adverb);
    };

    spec.ring2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring2"), $aNumber, $adverb);
    };

    spec.ring3 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring3"), $aNumber, $adverb);
    };

    spec.ring4 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring4"), $aNumber, $adverb);
    };

    spec.difsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("difsqr"), $aNumber, $adverb);
    };

    spec.sumsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sumsqr"), $aNumber, $adverb);
    };

    spec.sqrsum = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sqrsum"), $aNumber, $adverb);
    };

    spec.sqrdif = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sqrdif"), $aNumber, $adverb);
    };

    spec.absdif = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("absdif"), $aNumber, $adverb);
    };

    spec.thresh = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("thresh"), $aNumber, $adverb);
    };

    spec.amclip = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("amclip"), $aNumber, $adverb);
    };

    spec.scaleneg = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("scaleneg"), $aNumber, $adverb);
    };

    spec.clip2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("clip2"), $aNumber, $adverb);
    };

    spec.fold2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("fold2"), $aNumber, $adverb);
    };

    spec.wrap2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("wrap2"), $aNumber, $adverb);
    };

    spec.excess = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("excess"), $aNumber, $adverb);
    };

    spec.firstArg = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("firstArg"), $aNumber, $adverb);
    };

    spec.rrand = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("rrand"), $aNumber, $adverb);
    };

    spec.exprand = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("exprand"), $aNumber, $adverb);
    };

    spec.performUnaryOp = function($aSelector) {
      return this.collect($SC.Function(function($item) {
        return $item.perform($aSelector);
      }));
    };

    spec.performBinaryOp = function($aSelector, $theOperand, $adverb) {
      $theOperand = utils.defaultValue$Nil($theOperand);
      return $theOperand.performBinaryOpOnSeqColl($aSelector, this, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $theOperand, $adverb) {
      var adverb;
      $aSelector  = utils.defaultValue$Nil($aSelector);
      $theOperand = utils.defaultValue$Nil($theOperand);
      $adverb     = utils.defaultValue$Nil($adverb);

      if ($adverb === $nil) {
        return _performBinaryOpOnSeqColl_adverb_nil(
          this, $aSelector, $theOperand
        );
      }
      if (bool($adverb.isInteger())) {
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
        $i = $SC.Integer(i);
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
          $i = $SC.Integer(i);
          $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
        }

      } else if (adverb > 0) {

        $newList = $theOperand.collect($SC.Function(function($item) {
          return $item.perform($aSelector, $this, $SC.Integer(adverb - 1));
        }));

      } else {

        $newList = $this.collect($SC.Function(function($item) {
          return $theOperand.perform($aSelector, $item, $SC.Integer(adverb + 1));
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
        $i = $SC.Integer(i);
        $newList.add($theOperand.at($i).perform($aSelector, $this));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_x($this, $aSelector, $theOperand) {
      var $size, $newList;

      $size = $theOperand.size() ["*"] ($this.size());
      $newList = $this.species().new($size);
      $theOperand.do($SC.Function(function($a) {
        $this.do($SC.Function(function($b) {
          $newList.add($a.perform($aSelector, $b));
        }));
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
        $i = $SC.Integer(i);
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
        $i = $SC.Integer(i);
        $newList.add($theOperand.foldAt($i).perform($aSelector, $this.foldAt($i)));
      }

      return $newList;
    }

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      $aNumber = utils.defaultValue$Nil($aNumber);
      return this.collect($SC.Function(function($item) {
        return $aNumber.perform($aSelector, $item, $adverb);
      }));
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      $aComplex = utils.defaultValue$Nil($aComplex);
      return this.collect($SC.Function(function($item) {
        return $aComplex.perform($aSelector, $item, $adverb);
      }));
    };

    spec.asFraction = function($denominator, $fasterBetter) {
      return this.collect($SC.Function(function($item) {
        return $item.asFraction($denominator, $fasterBetter);
      }));
    };

    // TODO: implements asPoint
    // TODO: implements asRect

    spec.ascii = function() {
      return this.collect($SC.Function(function($item) {
        return $item.ascii();
      }));
    };

    spec.rate = function() {
      if (this.size().__int__() === 1) {
        return this.first().rate();
      }
      return this.collect($SC.Function(function($item) {
        return $item.rate();
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
        this, [ $SC.Symbol("clip") ].concat(slice.call(arguments))
      );
    };

    spec.wrap = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("wrap") ].concat(slice.call(arguments))
      );
    };

    spec.fold = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("fold") ].concat(slice.call(arguments))
      );
    };

    spec.linlin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("linlin") ].concat(slice.call(arguments))
      );
    };

    spec.linexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("linexp") ].concat(slice.call(arguments))
      );
    };

    spec.explin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("explin") ].concat(slice.call(arguments))
      );
    };

    spec.expexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("expexp") ].concat(slice.call(arguments))
      );
    };

    spec.lincurve = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lincurve") ].concat(slice.call(arguments))
      );
    };

    spec.curvelin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("curvelin") ].concat(slice.call(arguments))
      );
    };

    spec.bilin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("bilin") ].concat(slice.call(arguments))
      );
    };

    spec.biexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("biexp") ].concat(slice.call(arguments))
      );
    };

    spec.moddif = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("moddif") ].concat(slice.call(arguments))
      );
    };

    spec.range = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("range") ].concat(slice.call(arguments))
      );
    };

    spec.exprange = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("exprange") ].concat(slice.call(arguments))
      );
    };

    spec.curverange = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("curverange") ].concat(slice.call(arguments))
      );
    };

    spec.unipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("unipolar") ].concat(slice.call(arguments))
      );
    };

    spec.bipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("bipolar") ].concat(slice.call(arguments))
      );
    };

    spec.lag = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag") ].concat(slice.call(arguments))
      );
    };

    spec.lag2 = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag2") ].concat(slice.call(arguments))
      );
    };

    spec.lag3 = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag3") ].concat(slice.call(arguments))
      );
    };

    spec.lagud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lagud") ].concat(slice.call(arguments))
      );
    };

    spec.lag2ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag2ud") ].concat(slice.call(arguments))
      );
    };

    spec.lag3ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag3ud") ].concat(slice.call(arguments))
      );
    };

    spec.varlag = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("varlag") ].concat(slice.call(arguments))
      );
    };

    spec.slew = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("slew") ].concat(slice.call(arguments))
      );
    };

    spec.blend = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("blend") ].concat(slice.call(arguments))
      );
    };

    spec.checkBadValues = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("checkBadValues") ].concat(slice.call(arguments))
      );
    };

    spec.prune = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("prune") ].concat(slice.call(arguments))
      );
    };

    // TODO: implements minNyquist
    // TODO: implements sort
    // TODO: implements sortBy
    // TODO: implements sortMap
    // TODO: implements sortedMedian
    // TODO: implements median
    // TODO: implements quickSort
    // TODO: implements order

    spec.swap = function($i, $j) {
      var $temp;
      $i = utils.defaultValue$Nil($i);
      $j = utils.defaultValue$Nil($j);

      $temp = this.at($i);
      this.put($i, this.at($j));
      this.put($j, $temp);

      return this;
    };

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

    spec.wrapAt = function($index) {
      $index = utils.defaultValue$Nil($index);
      $index = $index ["%"] (this.size());
      return this.at($index);
    };

    spec.wrapPut = function($index, $value) {
      $index = utils.defaultValue$Nil($index);
      $value = utils.defaultValue$Nil($value);
      $index = $index ["%"] (this.size());
      return this.put($index, $value);
    };


    // TODO: implements reduce
    // TODO: implements join
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements schedBundleArrayOnClock
  });

})(sc);

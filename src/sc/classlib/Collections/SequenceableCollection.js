SCScript.install(function(sc) {
  "use strict";

  require("./Collection");

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
            this.__break__();
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
            this.__break__();
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
            this.__break__();
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

SCScript.install(function(sc) {
  "use strict";

  require("./Collection");

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

    builder.addMethod("isSequenceableCollection", sc.TRUE);

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

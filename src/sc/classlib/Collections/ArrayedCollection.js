SCScript.install(function(sc) {
  "use strict";

  require("./SequenceableCollection");

  var slice = [].slice;
  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;
  var rand     = sc.libs.random;
  var mathlib  = sc.libs.mathlib;

  var $nil  = $.nil;
  var $int0 = $.int0;
  var $int1 = $.int1;

  sc.lang.klass.refine("ArrayedCollection", function(builder) {
    builder.addMethod("valueOf", function() {
      return this._.map(function(elem) {
        return elem.valueOf();
      });
    });

    builder.addMethod("__elem__", function(item) {
      return item || $nil;
    });

    builder.addMethod("_ThrowIfImmutable", function() {
      if (this.__immutable) {
        throw new Error("Attempted write to immutable object.");
      }
    });

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
    });

    builder.addMethod("clipPut", {
      args: "index; item"
    }, function($index, $item) {
      this._ThrowIfImmutable();

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
      this._ThrowIfImmutable();

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
      this._ThrowIfImmutable();

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

      this._ThrowIfImmutable();

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

      this._ThrowIfImmutable();

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

    builder.addMethod("isArray", sc.TRUE);
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
    });

    builder.addMethod("add", {
      args: "item"
    }, function($item) {
      this._ThrowIfImmutable();
      this._.push(this.__elem__($item));

      return this;
    });

    builder.addMethod("addAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this;

      this._ThrowIfImmutable();

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

      this._ThrowIfImmutable();

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

      this._ThrowIfImmutable();

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
      this._ThrowIfImmutable();
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

      this._ThrowIfImmutable();

      $value = this.__elem__($value);

      raw = this._;
      for (i = 0, imax = raw.length; i < imax; ++i) {
        raw[i] = $value;
      }

      return this;
    });

    builder.addMethod("do", function($function) {
      iterator.execute(
        iterator.array$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("reverseDo", function($function) {
      iterator.execute(
        iterator.array$reverseDo(this),
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
      r = rand.next();
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
    builder.addMethod("_sort", function($function) {
      this._ThrowIfImmutable();
      this._.sort(function($a, $b) {
        return $function.value($a, $b).__bool__() ? -1 : 1;
      });
    });
  });

  sc.lang.klass.refine("RawArray", function(builder) {
    var SCArray = $("Array");

    builder.addMethod("archiveAsCompileString", sc.TRUE);
    builder.addMethod("archiveAsObject", sc.TRUE);

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

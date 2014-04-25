(function(sc) {
  "use strict";

  require("./SequenceableCollection");

  var slice = [].slice;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var fn = sc.lang.fn;
  var rand = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  sc.lang.klass.refine("ArrayedCollection", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.valueOf();
      });
    };

    spec.__elem__ = function(item) {
      return item;
    };

    spec._ThrowIfImmutable = function() {
      if (this._immutable) {
        throw new Error("Attempted write to immutable object.");
      }
    };

    // TODO: implements $newClear
    // TODO: implements indexedSize

    spec.size = function() {
      return $SC.Integer(this._.length);
    };

    // TODO: implements maxSize

    spec.swap = function($a, $b) {
      var raw = this._;
      var a, b, len, tmp;
      $a = utils.defaultValue$Nil($a);
      $b = utils.defaultValue$Nil($b);

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
    };

    spec.at = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            return $nil;
          }
          return this._[i];
        }, this));
      }

      i = $index.__int__();

      return this._[i] || $nil;
    };

    spec.clipAt = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          i = mathlib.clip_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.clip_idx($index.__int__(), this._.length);

      return this._[i];
    };

    spec.wrapAt = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          var i = mathlib.wrap_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.wrap_idx($index.__int__(), this._.length);

      return this._[i];
    };

    spec.foldAt = function($index) {
      var i;
      $index = utils.defaultValue$Nil($index);

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          var i = mathlib.fold_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.fold_idx($index.__int__(), this._.length);

      return this._[i];
    };

    spec.put = function($index, $item) {
      var i;
      $index = utils.defaultValue$Nil($index);

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
    };

    spec.clipPut = function($index, $item) {
      $index = utils.defaultValue$Nil($index);
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    };

    spec.wrapPut = function($index, $item) {
      $index = utils.defaultValue$Nil($index);
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    };

    spec.foldPut = function($index, $item) {
      $index = utils.defaultValue$Nil($index);
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    };

    spec.removeAt = function($index) {
      var raw = this._;
      var index;
      $index = utils.defaultValue$Nil($index);

      this._ThrowIfImmutable();

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      return raw.splice(index, 1)[0];
    };

    spec.takeAt = function($index) {
      var raw = this._;
      var index, ret, instead;
      $index = utils.defaultValue$Nil($index);

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
    };

    spec.indexOf = function($item) {
      var index;
      $item = utils.defaultValue$Nil($item);

      index = this._.indexOf($item);
      return index === -1 ? $nil : $SC.Integer(index);
    };

    spec.indexOfGreaterThan = function($val) {
      var raw = this._;
      var val, i, imax = raw.length;
      $val = utils.defaultValue$Nil($val);

      val = $val.__num__();
      for (i = 0; i < imax; ++i) {
        if (raw[i].__num__() > val) {
          return $SC.Integer(i);
        }
      }

      return $nil;
    };

    spec.takeThese = function($func) {
      var raw = this._;
      var i = 0, $i;
      $func = utils.defaultValue$Nil($func);

      $i = $SC.Integer(i);
      while (i < raw.length) {
        if (bool($func.value(raw[i], $i))) {
          this.takeAt($i);
        } else {
          $i = $SC.Integer(++i);
        }
      }

      return this;
    };

    spec.replace = function($find, $replace) {
      var $index, $out, $array;
      $find    = utils.defaultValue$Nil($find);
      $replace = utils.defaultValue$Nil($replace);

      this._ThrowIfImmutable();

      $out     = $SC.Array();
      $array   = this;
      $find    = $find.asArray();
      $replace = $replace.asArray();
      $SC.Function(function() {
        return ($index = $array.find($find)).notNil();
      }).while($SC.Function(function() {
        $out = $out ["++"] ($array.keep($index)) ["++"] ($replace);
        $array = $array.drop($index ["+"] ($find.size()));
      }));

      return $out ["++"] ($array);
    };

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

    spec.slotIndex = utils.alwaysReturn$Nil;

    spec.getSlots = function() {
      return this.copy();
    };

    spec.setSlots = function($array) {
      $array = utils.defaultValue$Nil($array);
      return this.overWrite($array);
    };

    spec.atModify = function($index, $function) {
      this.put($index, $function.value(this.at($index), $index));
      return this;
    };

    spec.atInc = function($index, $inc) {
      $inc = utils.defaultValue$Integer($inc, 1);
      this.put($index, this.at($index) ["+"] ($inc));
      return this;
    };

    spec.atDec = function($index, $dec) {
      $dec = utils.defaultValue$Integer($dec, 1);
      this.put($index, this.at($index) ["-"] ($dec));
      return this;
    };

    spec.isArray = utils.alwaysReturn$True;
    spec.asArray = utils.nop;

    spec.copyRange = function($start, $end) {
      var start, end, instance, raw;
      $start = utils.defaultValue$Nil($start);
      $end = utils.defaultValue$Nil($end);

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

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    };

    spec.copySeries = function($first, $second, $last) {
      var i, first, second, last, step, instance, raw;
      $first = utils.defaultValue$Nil($first);
      $second = utils.defaultValue$Nil($second);
      $last = utils.defaultValue$Nil($last);

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

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    };

    spec.putSeries = function($first, $second, $last, $value) {
      var i, first, second, last, step;
      $first = utils.defaultValue$Nil($first);
      $second = utils.defaultValue$Nil($second);
      $last = utils.defaultValue$Nil($last);
      $value = utils.defaultValue$Nil($value);

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
    };

    spec.add = function($item) {
      $item = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();
      this._.push(this.__elem__($item));

      return this;
    };

    spec.addAll = function($aCollection) {
      var $this = this;
      $aCollection = utils.defaultValue$Nil($aCollection);

      this._ThrowIfImmutable();

      if ($aCollection.isSequenceableCollection().valueOf()) {
        $aCollection.do($SC.Function(function($item) {
          $this._.push($this.__elem__($item));
        }));
      } else {
        this.add($aCollection);
      }

      return this;
    };

    spec.putEach = function($keys, $values) {
      var keys, values, i, imax;
      $keys   = utils.defaultValue$Nil($keys);
      $values = utils.defaultValue$Nil($values);

      this._ThrowIfImmutable();

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], this.__elem__(values[i % values.length]));
      }

      return this;
    };

    spec.extend = function($size, $item) {
      var instance, raw, size, i;

      $size = utils.defaultValue$Nil($size);
      $item = utils.defaultValue$Nil($item);

      raw  = this._.slice();
      size = $size.__int__();
      if (raw.length > size) {
        raw.splice(size);
      } else if (raw.length < size) {
        for (i = size - raw.length; i--; ) {
          raw.push(this.__elem__($item));
        }
      }

      instance = new this.__Spec();
      instance._ = raw;
      return instance;

    };

    spec.insert = function($index, $item) {
      var index;
      $index = utils.defaultValue$Nil($index);
      $item  = utils.defaultValue$Nil($item);

      this._ThrowIfImmutable();

      index = Math.max(0, $index.__int__());
      this._.splice(index, 0, this.__elem__($item));

      return this;
    };

    spec.move = function($fromIndex, $toIndex) {
      return this.insert($toIndex, this.removeAt($fromIndex));
    };

    spec.addFirst = function($item) {
      var instance, raw;
      $item = utils.defaultValue$Nil($item);

      raw = this._.slice();
      raw.unshift(this.__elem__($item));

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    };

    spec.addIfNotNil = function($item) {
      $item = utils.defaultValue$Nil($item);

      if ($item === $nil) {
        return this;
      }

      return this.addFirst(this.__elem__($item));
    };

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

      instance = new this.__Spec();
      instance._ = raw;
      if ($anArray !== $nil) {
        instance.addAll($anArray);
      }
      return instance;
    };

    // TODO: implements overWrite
    // TODO: implements grow
    // TODO: implements growClear

    spec.seriesFill = function($start, $step) {
      var i, imax;
      $start = utils.defaultValue$Nil($start);
      $step  = utils.defaultValue$Nil($step);

      for (i = 0, imax = this._.length; i < imax; ++i) {
        this.put($SC.Integer(i), $start);
        $start = $start ["+"] ($step);
      }

      return this;
    };

    spec.fill = function($value) {
      var raw, i, imax;
      $value = utils.defaultValue$Nil($value);

      this._ThrowIfImmutable();

      $value = this.__elem__($value);

      raw = this._;
      for (i = 0, imax = raw.length; i < imax; ++i) {
        raw[i] = $value;
      }

      return this;
    };

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
          return $SC.Integer(i);
        }
      }

      return $int0;
    };

    spec.normalizeSum = function() {
      return this ["*"] (this.sum().reciprocal());
    };

    spec.normalize = function($min, $max) {
      var $minItem, $maxItem;
      $min = utils.defaultValue$Float($min, 0.0);
      $max = utils.defaultValue$Float($max, 1.0);

      $minItem = this.minItem();
      $maxItem = this.maxItem();
      return this.collect($SC.Function(function($el) {
        return $el.linlin($minItem, $maxItem, $min, $max);
      }));
    };

    // TODO: implements asciiPlot
    // TODO: implements perfectShuffle
    // TODO: implements performInPlace

    spec.clipExtend = function($length) {
      var last = this._[this._.length - 1] || $nil;
      return this.extend($length, last);
    };

    spec.rank = function() {
      return $int1 ["+"] (this.first().rank());
    };

    spec.shape = function() {
      return $SC.Array([ this.size() ]) ["++"] (this.at(0).shape());
    };

    spec.reshape = function() {
      var $result;
      var shape, size, i, imax;

      shape = slice.call(arguments);

      size = 1;
      for (i = 0, imax = shape.length; i < imax; ++i) {
        size *= shape[i].__int__();
      }

      $result = this.flat().wrapExtend($SC.Integer(size));
      for (i = imax - 1; i >= 1; --i) {
        $result = $result.clump(shape[i]);
      }

      return $result;
    };

    spec.reshapeLike = function($another, $indexing) {
      var $index, $flat;
      $another  = utils.defaultValue$Nil($another);
      $indexing = utils.defaultValue$Symbol($indexing, "wrapAt");

      $index = $int0;
      $flat  = this.flat();

      return $another.deepCollect($SC.Integer(0x7FFFFFFF), $SC.Function(function() {
        var $item = $flat.perform($indexing, $index);
        $index = $index.__inc__();
        return $item;
      }));
    };

    // TODO: implements deepCollect
    // TODO: implements deepDo

    spec.unbubble = function($depth, $levels) {
      $depth  = utils.defaultValue$Integer($depth , 0);
      $levels = utils.defaultValue$Integer($levels, 1);

      if ($depth.__num__() <= 0) {
        if (this.size().__int__() > 1) {
          return this;
        }
        if ($levels.__int__() <= 1) {
          return this.at(0);
        }
        return this.at(0).unbubble($depth, $levels.__dec__());
      }

      return this.collect($SC.Function(function($item) {
        return $item.unbubble($depth.__dec__());
      }));
    };

    spec.bubble = function($depth, $levels) {
      $depth  = utils.defaultValue$Integer($depth , 0);
      $levels = utils.defaultValue$Integer($levels, 1);

      if ($depth.__int__() <= 0) {
        if ($levels.__int__() <= 1) {
          return $SC.Array([ this ]);
        }
        return $SC.Array([ this.bubble($depth, $levels.__dec__()) ]);
      }

      return this.collect($SC.Function(function($item) {
        return $item.bubble($depth.__dec__(), $levels);
      }));
    };

    spec.slice = fn(function($$cuts) {
      var $firstCut, $list;
      var cuts_size, cuts;

      cuts_size = $$cuts.size().__int__();
      if (cuts_size === 0) {
        return this.copy();
      }

      $firstCut = $$cuts.at(0);
      if ($firstCut === $nil) {
        $list = this.copy();
      } else {
        $list = this.at($firstCut.asArray());
      }

      if (cuts_size === 1) {
        return $list.unbubble();
      }

      cuts = $$cuts._.slice(1);
      return $list.collect($SC.Function(function($item) {
        return $item.slice.apply($item, cuts);
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
        a[i] = $SC.Integer(i);
      }

      $a = $SC.Array(a);
      return $a.reshape.apply($a, args);
    };

    // TODO: implements asRandomTable
    // TODO: implements tableRand
    // TODO: implements msgSize
    // TODO: implements bundleSize
    // TODO: implements clumpBundles

    spec.includes = function($item) {
      return $SC.Boolean(this._.indexOf($item) !== -1);
    };
  });

  sc.lang.klass.refine("RawArray", function(spec, utils) {
    spec.archiveAsCompileString = utils.alwaysReturn$True;
    spec.archiveAsObject = utils.alwaysReturn$True;
    spec.rate = function() {
      return $SC.Symbol("scalar");
    };

    // TODO: implements readFromStream
    // TODO: implements powerset
  });

})(sc);

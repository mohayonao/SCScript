SCScript.install(function(sc) {
  "use strict";

  require("./SequenceableCollection");

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

SCScript.install(function(sc) {
  "use strict";

  require("./Collection");

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  sc.lang.klass.refine("Set", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var SCArray = $SC("Array");

    spec.$new = fn(function($n) {
      $n = $SC.Integer(Math.max($n.__int__(), 2) * 2);
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
      return $SC.Integer(this._size);
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
        if ($item !== $nil && BOOL($that.includes($item))) {
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
        if ($item !== $nil && !BOOL($that.includes($item))) {
          $result.add($item);
        }
      });
      $that.do($SC.Function(function($item) {
        if (!BOOL($this.includes($item))) {
          $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.isSubsetOf = fn(function($that) {
      return $that.includesAll(this);
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

    // istanbul ignore next
    spec.scanFor = function($obj) {
      var array, index;

      array = this._$array._;

      index = array.indexOf($obj);
      if (index !== -1) {
        return $SC.Integer(index);
      }

      index = array.indexOf($nil);
      if (index !== -1) {
        return $SC.Integer(index);
      }

      return $SC.Integer(-1);
    };

    // TODO: implements fixCollisionsFrom
    // TODO: implements keyAt

  });

});

SCScript.install(function(sc) {
  "use strict";

  require("./Collection");

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  function SCSet(args) {
    this.__initializeWith__("Collection");
    var n = 2;
    if (args && args[0]) {
      n = args[0].__int__();
    }
    this.initSet($SC.Integer(Math.max(n, 2) * 2));
  }

  sc.lang.klass.define(SCSet, "Set : Collection", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var SCArray = $SC("Array");

    spec.valueOf = function() {
      return this._array._.filter(function($elem) {
        return $elem !== $nil;
      }).map(function($elem) {
        return $elem.valueOf();
      });
    };

    spec.array = function() {
      return this._array;
    };

    spec.array_ = function($value) {
      this._array = $value;
      return this;
    };

    spec.size = function() {
      return this._size;
    };

    spec.species = function() {
      return this.class();
    };

    spec.copy = function() {
      return this.shallowCopy().array_(this._array.copy());
    };

    spec.do = function($function) {
      iterator.execute(
        iterator.set$do(this),
        $function
      );
      return this;
    };

    spec.clear = function() {
      this._array.fill();
      this._size = $int_0;
      return this;
    };

    spec.makeEmpty = function() {
      this.clear();
      return this;
    };

    spec.includes = fn(function($item) {
      return this._array.at(this.scanFor($item)).notNil();
    }, "item");

    spec.findMatch = fn(function($item) {
      return this._array.at(this.scanFor($item));
    }, "item");

    spec.add = fn(function($item) {
      var $index;

      if ($item === $nil) {
        throw new Error("A Set cannot contain nil.");
      }

      $index = this.scanFor($item);
      if (this._array.at($index) === $nil) {
        this.putCheck($index, $item);
      }

      return this;
    }, "item");

    spec.remove = fn(function($item) {
      var $index;

      $index = this.scanFor($item);
      if (this._array.at($index) !== $nil) {
        this._array.put($index, $nil);
        this._size = this._size.__dec__();
        // this.fixCollisionsFrom($index);
      }

      return this;
    }, "item");

    spec.choose = function() {
      var $val;
      var $size, $array;

      if (this._size.__int__() <= 0) {
        return $nil;
      }

      $array = this._array;
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
      $array = this._array;
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

      this._array._.forEach(function($x) {
        $result.addAll($x);
      });

      return $result;
    };

    spec.sect = fn(function($that) {
      var $result;

      $result = this.species().new();

      this._array._.forEach(function($item) {
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

      this._array._.forEach(function($item) {
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
      this._array = SCArray.newClear($n);
      this._size  = $int_0;
    };

    spec.putCheck = function($index, $item) {
      this._array.put($index, $item);
      this._size = this._size.__inc__();
      this.fullCheck();
      return this;
    };

    spec.fullCheck = function() {
      if (this._array.size().__int__() < this._size.__int__() * 2) {
        this.grow();
      }
    };

    spec.grow = function() {
      var $this = this;
      var oldElements;

      oldElements = this._array._;
      this._array = SCArray.newClear(
        $SC.Integer(this._array.size().__int__() * 2)
      );
      this._size = $int_0;

      oldElements.forEach(function($item) {
        if ($item !== $nil) {
          $this.noCheckAdd($item);
        }
      });
    };

    spec.noCheckAdd = function($item) {
      this._array.put(this.scanFor($item), $item);
      this._size = this._size.__inc__();
    };

    // istanbul ignore next
    spec.scanFor = function($obj) {
      var array, index;

      array = this._array._;

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

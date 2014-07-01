SCScript.install(function(sc) {
  "use strict";

  require("./Collection");

  var $ = sc.lang.$;
  var $nil  = $.nil;
  var $int0 = $.int0;
  var SCArray = $("Array");

  sc.lang.klass.refine("Set", function(builder) {
    builder.addProperty("<>", "array");

    builder.addClassMethod("new", {
      args: "n=2"
    }, function($n) {
      $n = $.Integer(Math.max($n.__int__(), 2) * 2);
      return this.__super__("new").initSet($n);
    });

    builder.addMethod("valueOf", function() {
      return this._$array._.filter(function($elem) {
        return $elem !== $nil;
      }).map(function($elem) {
        return $elem.valueOf();
      });
    });

    builder.addMethod("size", function() {
      return $.Integer(this._size);
    });

    builder.addMethod("species", function() {
      return this.class();
    });

    builder.addMethod("copy", function() {
      return this.shallowCopy().array_(this._$array.copy());
    });

    builder.addMethod("do", function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.set$do(this),
        $function
      );
      return this;
    });

    builder.addMethod("clear", function() {
      this._$array.fill();
      this._size = 0;
      return this;
    });

    builder.addMethod("makeEmpty", function() {
      this.clear();
      return this;
    });

    builder.addMethod("includes", {
      args: "item"
    }, function($item) {
      return this._$array.at(this.scanFor($item)).notNil();
    });

    builder.addMethod("findMatch", {
      args: "item"
    }, function($item) {
      return this._$array.at(this.scanFor($item));
    });

    builder.addMethod("add", {
      args: "item"
    }, function($item) {
      var $index;

      if ($item === $nil) {
        throw new Error("A Set cannot contain nil.");
      }

      $index = this.scanFor($item);
      if (this._$array.at($index) === $nil) {
        this.putCheck($index, $item);
      }

      return this;
    });

    builder.addMethod("remove", {
      args: "item"
    }, function($item) {
      var $index;

      $index = this.scanFor($item);
      if (this._$array.at($index) !== $nil) {
        this._$array.put($index, $nil);
        this._size -= 1;
        // this.fixCollisionsFrom($index);
      }

      return this;
    });

    builder.addMethod("choose", function() {
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
    });

    builder.addMethod("pop", function() {
      var $index, $val;
      var $array, $size;

      $index = $int0;
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
    });

    // TODO: implements powerset

    builder.addMethod("unify", function() {
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($x) {
        $result.addAll($x);
      });

      return $result;
    });

    builder.addMethod("sect", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($item) {
        if ($item !== $nil && $that.$("includes", [ $item ]).__bool__()) {
          $result.add($item);
        }
      });

      return $result;
    });

    builder.addMethod("union", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.species().new();

      $result.addAll(this);
      $result.addAll($that);

      return $result;
    });

    builder.addMethod("difference", {
      args: "that"
    }, function($that) {
      return this.copy().removeAll($that);
    });

    builder.addMethod("symmetricDifference", {
      args: "that"
    }, function($that) {
      var $this = this;
      var $result;

      $result = this.species().new();

      this._$array._.forEach(function($item) {
        if ($item !== $nil && !$that.$("includes", [ $item ]).__bool__()) {
          $result.add($item);
        }
      });
      $that.do($.Func(function($item) {
        if (!$this.includes($item).__bool__()) {
          $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("isSubsetOf", {
      args: "that"
    },function($that) {
      return $that.$("includesAll", [ this ]);
    });

    builder.addMethod("&", function($that) {
      return this.sect($that);
    });

    builder.addMethod("|", function($that) {
      return this.union($that);
    });

    builder.addMethod("-", function($that) {
      return this.difference($that);
    });

    builder.addMethod("--", function($that) {
      return this.symmetricDifference($that);
    });

    builder.addMethod("asSet");

    builder.addMethod("initSet", function($n) {
      this._$array = SCArray.newClear($n);
      this._size   = 0;
      return this;
    });

    builder.addMethod("putCheck", function($index, $item) {
      this._$array.put($index, $item);
      this._size += 1;
      this.fullCheck();
      return this;
    });

    builder.addMethod("fullCheck", function() {
      if (this._$array.size().__int__() < this._size * 2) {
        this.grow();
      }
    });

    builder.addMethod("grow", function() {
      var array, i, imax;
      array = this._$array._;
      for (i = array.length, imax = i * 2; i < imax; ++i) {
        array[i] = $nil;
      }
    });

    /* istanbul ignore next */
    builder.addMethod("scanFor", function($obj) {
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
    });
    // TODO: implements fixCollisionsFrom
    // TODO: implements keyAt
  });
});

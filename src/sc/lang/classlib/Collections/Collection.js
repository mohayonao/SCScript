(function(sc) {
  "use strict";

  require("../Core/Object");

  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Collection", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.$newFrom = fn(function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.do($SC.Function(function($item) {
        $newCollection.add($item);
      }));

      return $newCollection;
    }, "aCollection");

    spec.$with = fn(function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    }, "*args");

    spec.$fill = fn(function($size, $function) {
      var $obj;
      var size, i;

      if (BOOL($size.isSequenceableCollection())) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($SC.Integer(i)));
      }

      return $obj;
    }, "size; function");

    spec.$fill2D = fn(function($rows, $cols, $function) {
      var $this = this, $obj, $obj2, $row, $col;
      var rows, cols, i, j;

      $obj = this.new($rows);

      rows = $rows.__int__();
      cols = $cols.__int__();

      for (i = 0; i < rows; ++i) {
        $row = $SC.Integer(i);
        $obj2 = $this.new($cols);
        for (j = 0; j < cols; ++j) {
          $col = $SC.Integer(j);
          $obj2 = $obj2.add($function.value($row, $col));
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    }, "rows; cols; function");

    spec.$fill3D = fn(function($planes, $rows, $cols, $function) {
      var $this = this, $obj, $obj2, $obj3, $plane, $row, $col;
      var planes, rows, cols, i, j, k;

      $obj = this.new($planes);

      planes = $planes.__int__();
      rows   = $rows  .__int__();
      cols   = $cols  .__int__();

      for (i = 0; i < planes; ++i) {
        $plane = $SC.Integer(i);
        $obj2 = $this.new($rows);
        for (j = 0; j < rows; ++j) {
          $row = $SC.Integer(j);
          $obj3 = $this.new($cols);
          for (k = 0; k < cols; ++k) {
            $col = $SC.Integer(k);
            $obj3 = $obj3.add($function.value($plane, $row, $col));
          }
          $obj2 = $obj2.add($obj3);
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    }, "planes; rows; cols; function");

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.first();
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int_0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($SC.Function(function($i) {
          $obj.add($function.valueArray($args.put($argIndex, $i)));
        }));
      } else {
        $dimensions = $dimensions.drop($int_1);
        $n.do($SC.Function(function($i) {
          $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
        }));
      }

      return $obj;
    };

    spec.$fillND = fn(function($dimensions, $function) {
      return fillND(this, $dimensions, $function, $SC.Array([]));
    }, "dimensions; function");

    spec["@"] = function($index) {
      return this.at($index);
    };

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($SC.Function(function($item) {
        if (!BOOL($aCollection.includes($item))) {
          $res = $false;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $true;
    };

    // TODO: implements hash

    spec.species = function() {
      return SCArray;
    };

    spec.do = function() {
      return this._subclassResponsibility("do");
    };

    // TODO: implements iter

    spec.size = function() {
      var tally = 0;

      this.do($SC.Function(function() {
        tally++;
      }));

      return $SC.Integer(tally);
    };

    spec.flatSize = function() {
      return this.sum($SC.Function(function($_) {
        return $_.flatSize();
      }));
    };

    spec.isEmpty = function() {
      return $SC.Boolean(this.size().__int__() === 0);
    };

    spec.notEmpty = function() {
      return $SC.Boolean(this.size().__int__() !== 0);
    };

    spec.asCollection = utils.nop;
    spec.isCollection = utils.alwaysReturn$true;

    spec.add = function() {
      return this._subclassResponsibility("add");
    };

    spec.addAll = fn(function($aCollection) {
      var $this = this;

      $aCollection.asCollection().do($SC.Function(function($item) {
        return $this.add($item);
      }));

      return this;
    }, "aCollection");

    spec.remove = function() {
      return this._subclassResponsibility("remove");
    };

    spec.removeAll = fn(function($list) {
      var $this = this;

      $list.do($SC.Function(function($item) {
        $this.remove($item);
      }));

      return this;
    }, "list");

    spec.removeEvery = fn(function($list) {
      this.removeAllSuchThat($SC.Function(function($_) {
        return $list.includes($_);
      }));
      return this;
    }, "list");

    spec.removeAllSuchThat = function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($SC.Function(function($item) {
        if (BOOL($function.value($item))) {
          $this.remove($item);
          $removedItems = $removedItems.add($item);
        }
      }));

      return $removedItems;
    };

    spec.atAll = fn(function($keys) {
      var $this = this;

      return $keys.collect($SC.Function(function($index) {
        return $this.at($index);
      }));
    }, "keys");

    spec.putEach = fn(function($keys, $values) {
      var keys, values, i, imax;

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    }, "keys; values");

    spec.includes = fn(function($item1) {
      var $res = null;

      this.do($SC.Function(function($item2) {
        if ($item1 === $item2) {
          $res = $true;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $false;
    }, "item1");

    spec.includesEqual = fn(function($item1) {
      var $res = null;

      this.do($SC.Function(function($item2) {
        if (BOOL( $item1 ["=="] ($item2) )) {
          $res = $true;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $false;
    }, "item1");

    spec.includesAny = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($SC.Function(function($item) {
        if (BOOL($this.includes($item))) {
          $res = $true;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $false;
    }, "aCollection");

    spec.includesAll = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($SC.Function(function($item) {
        if (!BOOL($this.includes($item))) {
          $res = $false;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $true;
    }, "aCollection");

    spec.matchItem = fn(function($item) {
      return this.includes($item);
    }, "item");

    spec.collect = function($function) {
      return this.collectAs($function, this.species());
    };

    spec.select = function($function) {
      return this.selectAs($function, this.species());
    };

    spec.reject = function($function) {
      return this.rejectAs($function, this.species());
    };

    spec.collectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        return $res.add($function.value($elem, $i));
      }));

      return $res;
    }, "function; class");

    spec.selectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    }, "function; class");

    spec.rejectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (!BOOL($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    }, "function; class");

    spec.detect = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $elem;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $nil;
    };

    spec.detectIndex = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $i;
          return sc.C.LOOP_BREAK;
        }
      }));
      return $res || $nil;
    };

    spec.doMsg = function() {
      var args = arguments;
      this.do($SC.Function(function($item) {
        $item.perform.apply($item, args);
      }));
      return this;
    };

    spec.collectMsg = function() {
      var args = arguments;
      return this.collect($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.selectMsg = function() {
      var args = arguments;
      return this.select($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.rejectMsg = function() {
      var args = arguments;
      return this.reject($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.detectMsg = fn(function($selector, $$args) {
      return this.detect($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector; *args");

    spec.detectIndexMsg = fn(function($selector, $$args) {
      return this.detectIndex($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector; *args");

    spec.lastForWhich = function($function) {
      var $res = null;
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $elem;
        } else {
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $nil;
    };

    spec.lastIndexForWhich = function($function) {
      var $res = null;
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $i;
        } else {
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $nil;
    };

    spec.inject = fn(function($thisValue, $function) {
      var $nextValue;

      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.injectr = fn(function($thisValue, $function) {
      var $this = this, size, $nextValue;

      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $item = $this.at($SC.Integer(--size));
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.count = function($function) {
      var sum = 0;
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    };

    spec.occurrencesOf = fn(function($obj) {
      var sum = 0;

      this.do($SC.Function(function($elem) {
        if (BOOL($elem ["=="] ($obj))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    }, "obj");

    spec.any = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $true;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $false;
    };

    spec.every = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (!BOOL($function.value($elem, $i))) {
          $res = $false;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $true;
    };

    spec.sum = fn(function($function) {
      var $sum;

      $sum = $int_0;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          $sum = $sum ["+"] ($elem);
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          $sum = $sum ["+"] ($function.value($elem, $i));
        }));
      }

      return $sum;
    }, "function");

    spec.mean = function($function) {
      return this.sum($function) ["/"] (this.size());
    };

    spec.product = fn(function($function) {
      var $product;

      $product = $int_1;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          $product = $product ["*"] ($elem);
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          $product = $product ["*"] ($function.value($elem, $i));
        }));
      }

      return $product;
    }, "function");

    spec.sumabs = function() {
      var $sum;

      $sum = $int_0;
      this.do($SC.Function(function($elem) {
        if (BOOL($elem.isSequenceableCollection())) {
          $elem = $elem.at($int_0);
        }
        $sum = $sum ["+"] ($elem.abs());
      }));

      return $sum;
    };

    spec.maxItem = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          if ($maxElement === $nil) {
            $maxElement = $elem;
          } else if ($elem > $maxElement) {
            $maxElement = $elem;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxElement = $elem;
            }
          }
        }));
      }

      return $maxElement;
    }, "function");

    spec.minItem = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          if ($minElement === $nil) {
            $minElement = $elem;
          } else if ($elem < $minElement) {
            $minElement = $elem;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($minValue === $nil) {
            $minValue = $function.value($elem, $i);
            $minElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $minValue) {
              $minValue = $val;
              $minElement = $elem;
            }
          }
        }));
      }

      return $minElement;
    }, "function");

    spec.maxIndex = fn(function($function) {
      var $maxValue, $maxIndex;

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $maxIndex = $index;
          } else if ($elem > $maxValue) {
            $maxValue = $elem;
            $maxIndex = $index;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxIndex = $i;
            }
          }
        }));
      }

      return $maxIndex;
    }, "function");

    spec.minIndex = fn(function($function) {
      var $maxValue, $minIndex;

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $minIndex = $index;
          } else if ($elem < $maxValue) {
            $maxValue = $elem;
            $minIndex = $index;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $minIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $maxValue) {
              $maxValue = $val;
              $minIndex = $i;
            }
          }
        }));
      }

      return $minIndex;
    }, "function");

    spec.maxValue = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($SC.Function(function($elem, $i) {
        var $val;
        if ($maxValue === $nil) {
          $maxValue = $function.value($elem, $i);
          $maxElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val > $maxValue) {
            $maxValue = $val;
            $maxElement = $elem;
          }
        }
      }));

      return $maxValue;
    }, "function");

    spec.minValue = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      this.do($SC.Function(function($elem, $i) {
        var $val;
        if ($minValue === $nil) {
          $minValue = $function.value($elem, $i);
          $minElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val < $minValue) {
            $minValue = $val;
            $minElement = $elem;
          }
        }
      }));

      return $minValue;
    }, "function");

    spec.maxSizeAtDepth = fn(function($rank) {
      var rank, maxsize = 0;

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($SC.Function(function($sublist) {
        var sz;
        if (BOOL($sublist.isCollection())) {
          sz = $sublist.maxSizeAtDepth($SC.Integer(rank - 1));
        } else {
          sz = 1;
        }
        if (sz > maxsize) {
          maxsize = sz;
        }
      }));

      return $SC.Integer(maxsize);
    }, "rank");

    spec.maxDepth = fn(function($max) {
      var $res;

      $res = $max;
      this.do($SC.Function(function($elem) {
        if (BOOL($elem.isCollection())) {
          $res = $res.max($elem.maxDepth($max.__inc__()));
        }
      }));

      return $res;
    }, "max=1");

    spec.deepCollect = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($SC.Function(function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($SC.Function(function($item, $i) {
        return $item.deepCollect($depth, $function, $i, $rank);
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.deepDo = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($SC.Function(function($item, $i) {
          $item.deepDo($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($SC.Function(function($item, $i) {
        $item.deepDo($depth, $function, $i, $rank);
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.invert = fn(function($axis) {
      var $index;

      if (BOOL(this.isEmpty())) {
        return this.species().new();
      }
      if ($axis !== $nil) {
        $index = $axis ["*"] ($SC.Integer(2));
      } else {
        $index = this.minItem() ["+"] (this.maxItem());
      }

      return $index ["-"] (this);
    }, "axis");

    spec.sect = fn(function($that) {
      var $result;

      $result = this.species().new();
      this.do($SC.Function(function($item) {
        if (BOOL($that.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.union = fn(function($that) {
      var $result;

      $result = this.copy();
      $that.do($SC.Function(function($item) {
        if (!BOOL($result.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.difference = fn(function($that) {
      return this.copy().removeAll($that);
    }, "that");

    spec.symmetricDifference = fn(function($that) {
      var $this = this, $result;

      $result = this.species().new();
      $this.do($SC.Function(function($item) {
        if (!BOOL($that.includes($item))) {
          $result = $result.add($item);
        }
      }));
      $that.do($SC.Function(function($item) {
        if (!BOOL($this.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.isSubsetOf = fn(function($that) {
      return $that.includesAll(this);
    }, "that");

    spec.asArray = function() {
      return SCArray.new(this.size()).addAll(this);
    };

    spec.asBag = function() {
      return $SC("Bag").new(this.size()).addAll(this);
    };

    spec.asList = function() {
      return $SC("List").new(this.size()).addAll(this);
    };

    spec.asSet = function() {
      return $SC("Set").new(this.size()).addAll(this);
    };

    spec.asSortedList = function($function) {
      return $SC("SortedList").new(this.size(), $function).addAll(this);
    };

    // TODO: implements powerset
    // TODO: implements flopDict
    // TODO: implements histo
    // TODO: implements printAll
    // TODO: implements printcsAll
    // TODO: implements dumpAll
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
    // TODO: implements writeDef
    // TODO: implements writeInputSpec
    // TODO: implements case
    // TODO: implements makeEnvirValPairs

    spec.asString = function() {
      var items = [];
      this.do($SC.Function(function($elem) {
        items.push($elem.__str__());
      }));

      return $SC.String(
        this.__className + "[ " + items.join(", ") + " ]"
      );
    };
  });

})(sc);

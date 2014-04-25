(function(sc) {
  "use strict";

  require("../Core/Object");

  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Collection", function(spec, utils) {
    var bool = utils.bool;
    var $nil = utils.nilInstance;
    var $int0 = utils.int0Instance;
    var $int1 = utils.int1Instance;
    var SCArray = $SC.Class("Array");

    spec.$newFrom = function($aCollection) {
      var $newCollection;
      $aCollection = utils.defaultValue$Nil($aCollection);

      $newCollection = this.new($aCollection.size());
      $aCollection.do($SC.Function(function($item) {
        $newCollection.add($item);
      }));

      return $newCollection;
    };

    spec.$with = fn(function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    }, "*args");

    spec.$fill = function($size, $function) {
      var $obj;
      var size, i;
      $size     = utils.defaultValue$Nil($size);
      $function = utils.defaultValue$Nil($function);

      if (bool($size.isSequenceableCollection())) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($SC.Integer(i)));
      }

      return $obj;
    };

    spec.$fill2D = function($rows, $cols, $function) {
      var $this = this, $obj, $obj2, $row, $col;
      var rows, cols, i, j;
      $rows     = utils.defaultValue$Nil($rows);
      $cols     = utils.defaultValue$Nil($cols);
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.$fill3D = function($planes, $rows, $cols, $function) {
      var $this = this, $obj, $obj2, $obj3, $plane, $row, $col;
      var planes, rows, cols, i, j, k;
      $planes   = utils.defaultValue$Nil($planes);
      $rows     = utils.defaultValue$Nil($rows);
      $cols     = utils.defaultValue$Nil($cols);
      $function = utils.defaultValue$Nil($function);

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
    };

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.first();
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($SC.Function(function($i) {
          $obj.add($function.valueArray($args.put($argIndex, $i)));
        }));
      } else {
        $dimensions = $dimensions.drop($int1);
        $n.do($SC.Function(function($i) {
          $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
        }));
      }

      return $obj;
    };

    spec.$fillND = function($dimensions, $function) {
      $dimensions = utils.defaultValue$Nil($dimensions);
      $function   = utils.defaultValue$Nil($function);
      return fillND(this, $dimensions, $function, $SC.Array([]));
    };

    spec["@"] = function($index) {
      return this.at($index);
    };

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return utils.falseInstance;
      }
      if (this.size() !== $aCollection.size()) {
        return utils.falseInstance;
      }
      this.do($SC.Function(function($item) {
        if (!bool($aCollection.includes($item))) {
          $res = utils.falseInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.trueInstance;
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
    spec.isCollection = utils.alwaysReturn$True;

    spec.add = function() {
      return this._subclassResponsibility("add");
    };

    spec.addAll = function($aCollection) {
      var $this = this;

      $aCollection = utils.defaultValue$Nil($aCollection);
      $aCollection.asCollection().do($SC.Function(function($item) {
        return $this.add($item);
      }));

      return this;
    };

    spec.remove = function() {
      return this._subclassResponsibility("remove");
    };

    spec.removeAll = function($list) {
      var $this = this;

      $list = utils.defaultValue$Nil($list);
      $list.do($SC.Function(function($item) {
        $this.remove($item);
      }));

      return this;
    };

    spec.removeEvery = function($list) {
      this.removeAllSuchThat($SC.Function(function($_) {
        return $list.includes($_);
      }));
      return this;
    };

    spec.removeAllSuchThat = function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($SC.Function(function($item) {
        if (bool($function.value($item))) {
          $this.remove($item);
          $removedItems = $removedItems.add($item);
        }
      }));

      return $removedItems;
    };

    spec.atAll = function($keys) {
      var $this = this;

      return $keys.collect($SC.Function(function($index) {
        return $this.at($index);
      }));
    };

    spec.putEach = function($keys, $values) {
      var keys, values, i, imax;
      $keys   = utils.defaultValue$Nil($keys);
      $values = utils.defaultValue$Nil($values);

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    };

    spec.includes = function($item1) {
      var $res = null;
      $item1 = utils.defaultValue$Nil($item1);

      this.do($SC.Function(function($item2) {
        if ($item1 === $item2) {
          $res = utils.trueInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.includesEqual = function($item1) {
      var $res = null;
      $item1 = utils.defaultValue$Nil($item1);

      this.do($SC.Function(function($item2) {
        if (bool( $item1 ["=="] ($item2) )) {
          $res = utils.trueInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.includesAny = function($aCollection) {
      var $this = this, $res = null;
      $aCollection = utils.defaultValue$Nil($aCollection);

      $aCollection.do($SC.Function(function($item) {
        if (bool($this.includes($item))) {
          $res = utils.trueInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.includesAll = function($aCollection) {
      var $this = this, $res = null;
      $aCollection = utils.defaultValue$Nil($aCollection);

      $aCollection.do($SC.Function(function($item) {
        if (!bool($this.includes($item))) {
          $res = utils.falseInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.trueInstance;
    };

    spec.matchItem = function($item) {
      return this.includes($item);
    };

    spec.collect = function($function) {
      return this.collectAs($function, this.species());
    };

    spec.select = function($function) {
      return this.selectAs($function, this.species());
    };

    spec.reject = function($function) {
      return this.rejectAs($function, this.species());
    };

    spec.collectAs = function($function, $class) {
      var $res;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        return $res.add($function.value($elem, $i));
      }));

      return $res;
    };

    spec.selectAs = function($function, $class) {
      var $res;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    };

    spec.rejectAs = function($function, $class) {
      var $res;
      $function = utils.defaultValue$Nil($function);
      $class    = utils.defaultValue$Nil($class);

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (!bool($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    };

    spec.detect = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $elem;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $nil;
    };

    spec.detectIndex = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $i;
          return sc.C.LOOP_BREAK;
        }
      }));
      return $res || $nil;
    };

    spec.doMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      this.do($SC.Function(function($item) {
        $item.perform.apply($item, args);
      }));
      return this;
    };

    spec.collectMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      return this.collect($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.selectMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      return this.select($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.rejectMsg = function($selector) {
      var args = arguments;
      args[0] = utils.defaultValue$Nil($selector);
      return this.reject($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.detectMsg = fn(function($selector, $$args) {
      $selector = utils.defaultValue$Nil($selector);

      return this.detect($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector,*args");

    spec.detectIndexMsg = fn(function($selector, $$args) {
      $selector = utils.defaultValue$Nil($selector);

      return this.detectIndex($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector,*args");

    spec.lastForWhich = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $elem;
        } else {
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $nil;
    };

    spec.lastIndexForWhich = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = $i;
        } else {
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || $nil;
    };

    spec.inject = function($thisValue, $function) {
      var $nextValue;
      $thisValue = utils.defaultValue$Nil($thisValue);
      $function  = utils.defaultValue$Nil($function);

      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    };

    spec.injectr = function($thisValue, $function) {
      var $this = this, size, $nextValue;
      $thisValue = utils.defaultValue$Nil($thisValue);
      $function  = utils.defaultValue$Nil($function);

      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $item = $this.at($SC.Integer(--size));
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    };

    spec.count = function($function) {
      var sum = 0;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    };

    spec.occurrencesOf = function($obj) {
      var sum = 0;
      $obj = utils.defaultValue$Nil($obj);

      this.do($SC.Function(function($elem) {
        if (bool($elem ["=="] ($obj))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    };

    spec.any = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (bool($function.value($elem, $i))) {
          $res = utils.trueInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.falseInstance;
    };

    spec.every = function($function) {
      var $res = null;
      $function = utils.defaultValue$Nil($function);

      this.do($SC.Function(function($elem, $i) {
        if (!bool($function.value($elem, $i))) {
          $res = utils.falseInstance;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $res || utils.trueInstance;
    };

    spec.sum = function($function) {
      var $sum;
      $function = utils.defaultValue$Nil($function);

      $sum = $int0;
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
    };

    spec.mean = function($function) {
      return this.sum($function) ["/"] (this.size());
    };

    spec.product = function($function) {
      var $product;
      $function = utils.defaultValue$Nil($function);

      $product = $int1;
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
    };

    spec.sumabs = function() {
      var $sum;

      $sum = $int0;
      this.do($SC.Function(function($elem) {
        if (bool($elem.isSequenceableCollection())) {
          $elem = $elem.at($int0);
        }
        $sum = $sum ["+"] ($elem.abs());
      }));

      return $sum;
    };

    spec.maxItem = function($function) {
      var $maxValue, $maxElement;
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.minItem = function($function) {
      var $minValue, $minElement;
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.maxIndex = function($function) {
      var $maxValue, $maxIndex;
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.minIndex = function($function) {
      var $maxValue, $minIndex;
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.maxValue = function($function) {
      var $maxValue, $maxElement;
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.minValue = function($function) {
      var $minValue, $minElement;
      $function = utils.defaultValue$Nil($function);

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
    };

    spec.maxSizeAtDepth = function($rank) {
      var rank, maxsize = 0;
      $rank = utils.defaultValue$Nil($rank);

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($SC.Function(function($sublist) {
        var sz;
        if (bool($sublist.isCollection())) {
          sz = $sublist.maxSizeAtDepth($SC.Integer(rank - 1));
        } else {
          sz = 1;
        }
        if (sz > maxsize) {
          maxsize = sz;
        }
      }));

      return $SC.Integer(maxsize);
    };

    spec.maxDepth = function($max) {
      var $res;
      $max = utils.defaultValue$Integer($max, 1);

      $res = $max;
      this.do($SC.Function(function($elem) {
        if (bool($elem.isCollection())) {
          $res = $res.max($elem.maxDepth($max.__inc__()));
        }
      }));

      return $res;
    };

    spec.deepCollect = function($depth, $function, $index, $rank) {
      $depth    = utils.defaultValue$Integer($depth, 1);
      $function = utils.defaultValue$Nil($function);
      $index    = utils.defaultValue$Integer($index, 0);
      $rank     = utils.defaultValue$Integer($rank, 0);

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
    };

    spec.deepDo = function($depth, $function, $index, $rank) {
      $depth    = utils.defaultValue$Integer($depth, 1);
      $function = utils.defaultValue$Nil($function);
      $index    = utils.defaultValue$Integer($index, 0);
      $rank     = utils.defaultValue$Integer($rank, 0);

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
    };

    spec.invert = function($axis) {
      var $index;
      $axis = utils.defaultValue$Nil($axis);

      if (bool(this.isEmpty())) {
        return this.species().new();
      }
      if ($axis !== $nil) {
        $index = $axis ["*"] ($SC.Integer(2));
      } else {
        $index = this.minItem() ["+"] (this.maxItem());
      }

      return $index ["-"] (this);
    };

    spec.sect = function($that) {
      var $result;
      $that = utils.defaultValue$Nil($that);

      $result = this.species().new();
      this.do($SC.Function(function($item) {
        if (bool($that.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    };

    spec.union = function($that) {
      var $result;
      $that = utils.defaultValue$Nil($that);

      $result = this.copy();
      $that.do($SC.Function(function($item) {
        if (!bool($result.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    };

    spec.difference = function($that) {
      return this.copy().removeAll($that);
    };

    spec.symmetricDifference = function($that) {
      var $this = this, $result;
      $that = utils.defaultValue$Nil($that);

      $result = this.species().new();
      $this.do($SC.Function(function($item) {
        if (!bool($that.includes($item))) {
          $result = $result.add($item);
        }
      }));
      $that.do($SC.Function(function($item) {
        if (!bool($this.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    };

    spec.isSubsetOf = function($that) {
      $that = utils.defaultValue$Nil($that);
      return $that.includesAll(this);
    };

    spec.asArray = function() {
      return SCArray.new(this.size()).addAll(this);
    };

    spec.asBag = function() {
      return $SC.Class("Bag").new(this.size()).addAll(this);
    };

    spec.asList = function() {
      return $SC.Class("List").new(this.size()).addAll(this);
    };

    spec.asSet = function() {
      return $SC.Class("Set").new(this.size()).addAll(this);
    };

    spec.asSortedList = function($function) {
      return $SC.Class("SortedList").new(this.size(), $function).addAll(this);
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
  });

})(sc);

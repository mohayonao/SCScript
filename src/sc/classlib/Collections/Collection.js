SCScript.install(function(sc) {
  "use strict";

  require("../Core/Object");

  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int0  = $.int0;
  var $int1  = $.int1;
  var SCArray = $("Array");

  sc.lang.klass.refine("Collection", function(builder) {
    builder.addClassMethod("newFrom", {
      args: "aCollection"
    }, function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.do($.Func(function($item) {
        return $newCollection.add($item);
      }));

      return $newCollection;
    });

    builder.addClassMethod("with", {
      args: "*args"
    }, function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    });

    builder.addClassMethod("fill", {
      args: "size; function"
    }, function($size, $function) {
      var $obj;
      var size, i;

      if ($size.isSequenceableCollection().__bool__()) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($.Integer(i)));
      }

      return $obj;
    });

    builder.addClassMethod("fill2D", {
      args: "rows; cols; function"
    }, function($rows, $cols, $function) {
      var $this = this, $obj, $obj2, $row, $col;
      var rows, cols, i, j;

      $obj = this.new($rows);

      rows = $rows.__int__();
      cols = $cols.__int__();

      for (i = 0; i < rows; ++i) {
        $row = $.Integer(i);
        $obj2 = $this.new($cols);
        for (j = 0; j < cols; ++j) {
          $col = $.Integer(j);
          $obj2 = $obj2.add($function.value($row, $col));
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    });

    builder.addClassMethod("fill3D", {
      args: "planes; rows; cols; function"
    }, function($planes, $rows, $cols, $function) {
      var $this = this, $obj, $obj2, $obj3, $plane, $row, $col;
      var planes, rows, cols, i, j, k;

      $obj = this.new($planes);

      planes = $planes.__int__();
      rows   = $rows  .__int__();
      cols   = $cols  .__int__();

      for (i = 0; i < planes; ++i) {
        $plane = $.Integer(i);
        $obj2 = $this.new($rows);
        for (j = 0; j < rows; ++j) {
          $row = $.Integer(j);
          $obj3 = $this.new($cols);
          for (k = 0; k < cols; ++k) {
            $col = $.Integer(k);
            $obj3 = $obj3.add($function.value($plane, $row, $col));
          }
          $obj2 = $obj2.add($obj3);
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    });

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.$("first");
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($.Func(function($i) {
          return $obj.add($function.valueArray($args.put($argIndex, $i)));
        }));
      } else {
        $dimensions = $dimensions.$("drop", [ $int1 ]);
        $n.do($.Func(function($i) {
          $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
          return $obj;
        }));
      }

      return $obj;
    };

    builder.addClassMethod("fillND", {
      args: "dimensions; function"
    }, function($dimensions, $function) {
      return fillND(this, $dimensions, $function, $.Array([]));
    });

    builder.addMethod("@", function($index) {
      return this.at($index);
    });

    builder.addMethod("==", function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($.Function(function(_) {
        return [ function($item) {
          if (!$aCollection.$("includes", [ $item ]).__bool__()) {
            $res = $false;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));

      return $res || $true;
    });

    // TODO: implements hash

    builder.addMethod("species", function() {
      return SCArray;
    });

    builder.subclassResponsibility("do");

    // TODO: implements iter

    builder.addMethod("size", function() {
      var tally = 0;

      this.do($.Func(function() {
        tally += 1;
        return $nil;
      }));

      return $.Integer(tally);
    });

    builder.addMethod("flatSize", function() {
      return this.sum($.Func(function($_) {
        return $_.$("flatSize");
      }));
    });

    builder.addMethod("isEmpty", function() {
      return $.Boolean(this.size().__int__() === 0);
    });

    builder.addMethod("notEmpty", function() {
      return $.Boolean(this.size().__int__() !== 0);
    });

    builder.addMethod("asCollection");
    builder.addMethod("isCollection", sc.TRUE);

    builder.subclassResponsibility("add");

    builder.addMethod("addAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this;

      $aCollection.asCollection().do($.Func(function($item) {
        return $this.add($item);
      }));

      return this;
    });

    builder.subclassResponsibility("remove");

    builder.addMethod("removeAll", {
      args: "list"
    }, function($list) {
      var $this = this;

      $list.do($.Func(function($item) {
        return $this.remove($item);
      }));

      return this;
    });

    builder.addMethod("removeEvery", {
      args: "list"
    }, function($list) {
      this.removeAllSuchThat($.Func(function($_) {
        return $list.$("includes", [ $_ ]);
      }));
      return this;
    });

    builder.addMethod("removeAllSuchThat", function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($.Func(function($item) {
        if ($function.value($item).__bool__()) {
          $this.remove($item);
          $removedItems = $removedItems.add($item);
        }
        return $nil;
      }));

      return $removedItems;
    });

    builder.addMethod("atAll", {
      args: "keys"
    }, function($keys) {
      var $this = this;

      return $keys.$("collect", [ $.Func(function($index) {
        return $this.at($index);
      }) ]);
    });

    builder.addMethod("putEach", {
      args: "keys; values"
    }, function($keys, $values) {
      var keys, values, i, imax;

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    });

    builder.addMethod("includes", {
      args: "item1"
    }, function($item1) {
      var $res = null;

      this.do($.Function(function(_) {
        return [ function($item2) {
          if ($item1 === $item2) {
            $res = $true;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));

      return $res || $false;
    });

    builder.addMethod("includesEqual", {
      args: "item1"
    }, function($item1) {
      var $res = null;

      this.do($.Function(function(_) {
        return [ function($item2) {
          if ($item1 ["=="] ($item2).__bool__()) {
            $res = $true;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));

      return $res || $false;
    });

    builder.addMethod("includesAny", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Function(function(_) {
        return [ function($item) {
          if ($this.includes($item).__bool__()) {
            $res = $true;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));

      return $res || $false;
    });

    builder.addMethod("includesAll", {
      args: "aCollection"
    }, function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Function(function(_) {
        return [ function($item) {
          if (!$this.includes($item).__bool__()) {
            $res = $false;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));

      return $res || $true;
    });

    builder.addMethod("matchItem", {
      args: "item"
    }, function($item) {
      return this.includes($item);
    });

    builder.addMethod("collect", function($function) {
      return this.collectAs($function, this.species());
    });

    builder.addMethod("select", function($function) {
      return this.selectAs($function, this.species());
    });

    builder.addMethod("reject", function($function) {
      return this.rejectAs($function, this.species());
    });

    builder.addMethod("collectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Func(function($elem, $i) {
        return $res.add($function.value($elem, $i));
      }));

      return $res;
    });

    builder.addMethod("selectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          $res = $res.add($elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("rejectAs", {
      args: "function; class"
    }, function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Func(function($elem, $i) {
        if (!$function.value($elem, $i).__bool__()) {
          $res = $res.add($elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("detect", function($function) {
      var $res = null;

      this.do($.Function(function(_) {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $elem;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));

      return $res || $nil;
    });

    builder.addMethod("detectIndex", function($function) {
      var $res = null;

      this.do($.Function(function(_) {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $i;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));
      return $res || $nil;
    });

    builder.addMethod("doMsg", function() {
      var args = arguments;
      this.do($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
      return this;
    });

    builder.addMethod("collectMsg", function() {
      var args = arguments;
      return this.collect($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
    });

    builder.addMethod("selectMsg", function() {
      var args = arguments;
      return this.select($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
    });

    builder.addMethod("rejectMsg", function() {
      var args = arguments;
      return this.reject($.Func(function($item) {
        return $item.perform.apply($item, args);
      }));
    });

    builder.addMethod("detectMsg", {
      args: "selector; *args"
    }, function($selector, $$args) {
      return this.detect($.Func(function($item) {
        return $item.performList($selector, $$args);
      }));
    });

    builder.addMethod("detectIndexMsg", {
      args: "selector; *args"
    }, function($selector, $$args) {
      return this.detectIndex($.Func(function($item) {
        return $item.performList($selector, $$args);
      }));
    });

    builder.addMethod("lastForWhich", function($function) {
      var $res = null;
      this.do($.Function(function(_) {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $elem;
          } else {
            _.break();
          }
          return $nil;
        } ];
      }, null, null));
      return $res || $nil;
    });

    builder.addMethod("lastIndexForWhich", function($function) {
      var $res = null;
      this.do($.Function(function(_) {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $i;
          } else {
            _.break();
          }
          return $nil;
        } ];
      }, null, null));
      return $res || $nil;
    });

    builder.addMethod("inject", {
      args: "thisValue; function"
    }, function($thisValue, $function) {
      var $nextValue;
      $nextValue = $thisValue;
      this.do($.Func(function($item, $i) {
        $nextValue = $function.value($nextValue, $item, $i);
        return $nextValue;
      }));
      return $nextValue;
    });

    builder.addMethod("injectr", {
      args: "thisValue; function"
    }, function($thisValue, $function) {
      var $this = this, size, $nextValue;
      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($.Func(function($item, $i) {
        $item = $this.at($.Integer(--size));
        $nextValue = $function.value($nextValue, $item, $i);
        return $nextValue;
      }));
      return $nextValue;
    });

    builder.addMethod("count", function($function) {
      var sum = 0;
      this.do($.Func(function($elem, $i) {
        if ($function.value($elem, $i).__bool__()) {
          sum++;
        }
        return $nil;
      }));
      return $.Integer(sum);
    });

    builder.addMethod("occurrencesOf", {
      args: "obj"
    }, function($obj) {
      var sum = 0;
      this.do($.Func(function($elem) {
        if ($elem ["=="] ($obj).__bool__()) {
          sum++;
        }
        return $nil;
      }));
      return $.Integer(sum);
    });

    builder.addMethod("any", function($function) {
      var $res = null;
      this.do($.Function(function(_) {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $true;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));
      return $res || $false;
    });

    builder.addMethod("every", function($function) {
      var $res = null;
      this.do($.Function(function(_) {
        return [ function($elem, $i) {
          if (!$function.value($elem, $i).__bool__()) {
            $res = $false;
            _.break();
          }
          return $nil;
        } ];
      }, null, null));
      return $res || $true;
    });

    builder.addMethod("sum", {
      args: "function"
    }, function($function) {
      var $sum;
      $sum = $int0;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          $sum = $sum ["+"] ($elem);
          return $sum;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          $sum = $sum ["+"] ($function.value($elem, $i));
          return $sum;
        }));
      }
      return $sum;
    });

    builder.addMethod("mean", function($function) {
      return this.sum($function) ["/"] (this.size());
    });

    builder.addMethod("product", {
      args: "function"
    }, function($function) {
      var $product;
      $product = $int1;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          $product = $product ["*"] ($elem);
          return $product;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
          $product = $product ["*"] ($function.value($elem, $i));
          return $product;
        }));
      }
      return $product;
    });

    builder.addMethod("sumabs", function() {
      var $sum;
      $sum = $int0;
      this.do($.Func(function($elem) {
        if ($elem.isSequenceableCollection().__bool__()) {
          $elem = $elem.at($int0);
        }
        $sum = $sum ["+"] ($elem.abs());
        return $sum;
      }));
      return $sum;
    });

    builder.addMethod("maxItem", {
      args: "function"
    }, function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          if ($maxElement === $nil) {
            $maxElement = $elem;
          } else if ($elem > $maxElement) {
            $maxElement = $elem;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
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
          return $nil;
        }));
      }

      return $maxElement;
    });

    builder.addMethod("minItem", {
      args: "function"
    }, function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem) {
          if ($minElement === $nil) {
            $minElement = $elem;
          } else if ($elem < $minElement) {
            $minElement = $elem;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
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
          return $nil;
        }));
      }

      return $minElement;
    });

    builder.addMethod("maxIndex", {
      args: "function"
    }, function($function) {
      var $maxValue, $maxIndex;

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $maxIndex = $index;
          } else if ($elem > $maxValue) {
            $maxValue = $elem;
            $maxIndex = $index;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
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
          return $nil;
        }));
      }

      return $maxIndex;
    });

    builder.addMethod("minIndex", {
      args: "function"
    }, function($function) {
      var $maxValue, $minIndex;

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($.Func(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $minIndex = $index;
          } else if ($elem < $maxValue) {
            $maxValue = $elem;
            $minIndex = $index;
          }
          return $nil;
        }));
      } else {
        this.do($.Func(function($elem, $i) {
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
          return $nil;
        }));
      }

      return $minIndex;
    });

    builder.addMethod("maxValue", {
      args: "function"
    }, function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($.Func(function($elem, $i) {
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
        return $nil;
      }));

      return $maxValue;
    });

    builder.addMethod("minValue", {
      args: "function"
    }, function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      this.do($.Func(function($elem, $i) {
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
        return $nil;
      }));

      return $minValue;
    });

    builder.addMethod("maxSizeAtDepth", {
      args: "rank"
    }, function($rank) {
      var rank, maxsize = 0;

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($.Func(function($sublist) {
        var sz;
        if ($sublist.isCollection().__bool__()) {
          sz = $sublist.maxSizeAtDepth($.Integer(rank - 1));
        } else {
          sz = 1;
        }
        if (sz > maxsize) {
          maxsize = sz;
        }
        return $nil;
      }));

      return $.Integer(maxsize);
    });

    builder.addMethod("maxDepth", {
      args: "max=1"
    }, function($max) {
      var $res;

      $res = $max;
      this.do($.Func(function($elem) {
        if ($elem.isCollection().__bool__()) {
          $res = $res.max($elem.maxDepth($max.__inc__()));
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("deepCollect", {
      args: "depth=1; function; index=0; rank=0"
    }, function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($.Func(function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($.Func(function($item, $i) {
        return $item.deepCollect($depth, $function, $i, $rank);
      }));
    });

    builder.addMethod("deepDo", {
      args: "depth=1; function; index=0; rank=0"
    }, function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($.Func(function($item, $i) {
          return $item.deepDo($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($.Func(function($item, $i) {
        return $item.deepDo($depth, $function, $i, $rank);
      }));
    });

    builder.addMethod("invert", {
      args: "axis"
    }, function($axis) {
      var $index;

      if (this.isEmpty().__bool__()) {
        return this.species().new();
      }
      if ($axis !== $nil) {
        $index = $axis.$("*", [ $.Integer(2) ]);
      } else {
        $index = this.minItem().$("+", [ this.maxItem() ]);
      }

      return $index ["-"] (this);
    });

    builder.addMethod("sect", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.species().new();
      this.do($.Func(function($item) {
        if ($that.$("includes", [ $item ]).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("union", {
      args: "that"
    }, function($that) {
      var $result;

      $result = this.copy();
      $that.do($.Func(function($item) {
        if (!$result.includes($item).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));

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
      var $this = this, $result;

      $result = this.species().new();
      $this.do($.Func(function($item) {
        if (!$that.includes($item).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));
      $that.do($.Func(function($item) {
        if (!$this.includes($item).__bool__()) {
          $result = $result.add($item);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("isSubsetOf", {
      args: "that"
    }, function($that) {
      return $that.$("includesAll", [ this ]);
    });

    builder.addMethod("asArray", function() {
      return SCArray.new(this.size()).addAll(this);
    });

    builder.addMethod("asBag", function() {
      return $("Bag").new(this.size()).addAll(this);
    });

    builder.addMethod("asList", function() {
      return $("List").new(this.size()).addAll(this);
    });

    builder.addMethod("asSet", function() {
      return $("Set").new(this.size()).addAll(this);
    });

    builder.addMethod("asSortedList", function($function) {
      return $("SortedList").new(this.size(), $function).addAll(this);
    });

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

    builder.addMethod("asString", function() {
      var items = [];
      this.do($.Func(function($elem) {
        items.push($elem.__str__());
        return $nil;
      }));
      return $.String(
        this.__className + "[ " + items.join(", ") + " ]"
      );
    });
  });
});

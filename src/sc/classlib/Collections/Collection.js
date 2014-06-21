SCScript.install(function(sc) {
  "use strict";

  require("../Core/Object");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Collection", function(spec, utils) {
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int0  = utils.$int0;
    var $int1  = utils.$int1;
    var SCArray = $("Array");

    spec.$newFrom = fn(function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.do($.Function(function() {
        return [ function($item) {
          $newCollection.add($item);
        } ];
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

      if ($size.isSequenceableCollection().__bool__()) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($.Integer(i)));
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
        $row = $.Integer(i);
        $obj2 = $this.new($cols);
        for (j = 0; j < cols; ++j) {
          $col = $.Integer(j);
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
    }, "planes; rows; cols; function");

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.$("first");
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($.Function(function() {
          return [ function($i) {
            $obj.add($function.valueArray($args.put($argIndex, $i)));
          } ];
        }));
      } else {
        $dimensions = $dimensions.$("drop", [ $int1 ]);
        $n.do($.Function(function() {
          return [ function($i) {
            $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
          } ];
        }));
      }

      return $obj;
    };

    spec.$fillND = fn(function($dimensions, $function) {
      return fillND(this, $dimensions, $function, $.Array([]));
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
      this.do($.Function(function() {
        return [ function($item) {
          if (!$aCollection.$("includes", [ $item ]).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    };

    // TODO: implements hash

    spec.species = function() {
      return SCArray;
    };

    spec.do = utils.subclassResponsibility("do");

    // TODO: implements iter

    spec.size = function() {
      var tally = 0;

      this.do($.Function(function() {
        return [ function() {
          tally++;
        } ];
      }));

      return $.Integer(tally);
    };

    spec.flatSize = function() {
      return this.sum($.Function(function() {
        return [ function($_) {
          return $_.$("flatSize");
        } ];
      }));
    };

    spec.isEmpty = function() {
      return $.Boolean(this.size().__int__() === 0);
    };

    spec.notEmpty = function() {
      return $.Boolean(this.size().__int__() !== 0);
    };

    spec.asCollection = utils.nop;
    spec.isCollection = utils.alwaysReturn$true;

    spec.add = utils.subclassResponsibility("add");

    spec.addAll = fn(function($aCollection) {
      var $this = this;

      $aCollection.asCollection().do($.Function(function() {
        return [ function($item) {
          return $this.add($item);
        } ];
      }));

      return this;
    }, "aCollection");

    spec.remove = utils.subclassResponsibility("remove");

    spec.removeAll = fn(function($list) {
      var $this = this;

      $list.do($.Function(function() {
        return [ function($item) {
          $this.remove($item);
        } ];
      }));

      return this;
    }, "list");

    spec.removeEvery = fn(function($list) {
      this.removeAllSuchThat($.Function(function() {
        return [ function($_) {
          return $list.$("includes", [ $_ ]);
        } ];
      }));
      return this;
    }, "list");

    spec.removeAllSuchThat = function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($.Function(function() {
        return [ function($item) {
          if ($function.value($item).__bool__()) {
            $this.remove($item);
            $removedItems = $removedItems.add($item);
          }
        } ];
      }));

      return $removedItems;
    };

    spec.atAll = fn(function($keys) {
      var $this = this;

      return $keys.$("collect", [ $.Function(function() {
        return [ function($index) {
          return $this.at($index);
        } ];
      }) ]);
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

      this.do($.Function(function() {
        return [ function($item2) {
          if ($item1 === $item2) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    }, "item1");

    spec.includesEqual = fn(function($item1) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($item2) {
          if ($item1 ["=="] ($item2).__bool__()) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    }, "item1");

    spec.includesAny = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Function(function() {
        return [ function($item) {
          if ($this.includes($item).__bool__()) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    }, "aCollection");

    spec.includesAll = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($.Function(function() {
        return [ function($item) {
          if (!$this.includes($item).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
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
      this.do($.Function(function() {
        return [ function($elem, $i) {
          return $res.add($function.value($elem, $i));
        } ];
      }));

      return $res;
    }, "function; class");

    spec.selectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $res.add($elem);
          }
        } ];
      }));

      return $res;
    }, "function; class");

    spec.rejectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if (!$function.value($elem, $i).__bool__()) {
            $res = $res.add($elem);
          }
        } ];
      }));

      return $res;
    }, "function; class");

    spec.detect = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $elem;
            this.break();
          }
        } ];
      }));

      return $res || $nil;
    };

    spec.detectIndex = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $i;
            this.break();
          }
        } ];
      }));
      return $res || $nil;
    };

    spec.doMsg = function() {
      var args = arguments;
      this.do($.Function(function() {
        return [ function($item) {
          $item.perform.apply($item, args);
        } ];
      }));
      return this;
    };

    spec.collectMsg = function() {
      var args = arguments;
      return this.collect($.Function(function() {
        return [ function($item) {
          return $item.perform.apply($item, args);
        } ];
      }));
    };

    spec.selectMsg = function() {
      var args = arguments;
      return this.select($.Function(function() {
        return [ function($item) {
          return $item.perform.apply($item, args);
        } ];
      }));
    };

    spec.rejectMsg = function() {
      var args = arguments;
      return this.reject($.Function(function() {
        return [ function($item) {
          return $item.perform.apply($item, args);
        } ];
      }));
    };

    spec.detectMsg = fn(function($selector, $$args) {
      return this.detect($.Function(function() {
        return [ function($item) {
          return $item.performList($selector, $$args);
        } ];
      }));
    }, "selector; *args");

    spec.detectIndexMsg = fn(function($selector, $$args) {
      return this.detectIndex($.Function(function() {
        return [ function($item) {
          return $item.performList($selector, $$args);
        } ];
      }));
    }, "selector; *args");

    spec.lastForWhich = function($function) {
      var $res = null;
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $elem;
          } else {
            this.break();
          }
        } ];
      }));

      return $res || $nil;
    };

    spec.lastIndexForWhich = function($function) {
      var $res = null;
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $i;
          } else {
            this.break();
          }
        } ];
      }));

      return $res || $nil;
    };

    spec.inject = fn(function($thisValue, $function) {
      var $nextValue;

      $nextValue = $thisValue;
      this.do($.Function(function() {
        return [ function($item, $i) {
          $nextValue = $function.value($nextValue, $item, $i);
        } ];
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.injectr = fn(function($thisValue, $function) {
      var $this = this, size, $nextValue;

      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($.Function(function() {
        return [ function($item, $i) {
          $item = $this.at($.Integer(--size));
          $nextValue = $function.value($nextValue, $item, $i);
        } ];
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.count = function($function) {
      var sum = 0;
      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            sum++;
          }
        } ];
      }));

      return $.Integer(sum);
    };

    spec.occurrencesOf = fn(function($obj) {
      var sum = 0;

      this.do($.Function(function() {
        return [ function($elem) {
          if ($elem ["=="] ($obj).__bool__()) {
            sum++;
          }
        } ];
      }));

      return $.Integer(sum);
    }, "obj");

    spec.any = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if ($function.value($elem, $i).__bool__()) {
            $res = $true;
            this.break();
          }
        } ];
      }));

      return $res || $false;
    };

    spec.every = function($function) {
      var $res = null;

      this.do($.Function(function() {
        return [ function($elem, $i) {
          if (!$function.value($elem, $i).__bool__()) {
            $res = $false;
            this.break();
          }
        } ];
      }));

      return $res || $true;
    };

    spec.sum = fn(function($function) {
      var $sum;

      $sum = $int0;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            $sum = $sum ["+"] ($elem);
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
            $sum = $sum ["+"] ($function.value($elem, $i));
          } ];
        }));
      }

      return $sum;
    }, "function");

    spec.mean = function($function) {
      return this.sum($function) ["/"] (this.size());
    };

    spec.product = fn(function($function) {
      var $product;

      $product = $int1;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            $product = $product ["*"] ($elem);
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
            $product = $product ["*"] ($function.value($elem, $i));
          } ];
        }));
      }

      return $product;
    }, "function");

    spec.sumabs = function() {
      var $sum;

      $sum = $int0;
      this.do($.Function(function() {
        return [ function($elem) {
          if ($elem.isSequenceableCollection().__bool__()) {
            $elem = $elem.at($int0);
          }
          $sum = $sum ["+"] ($elem.abs());
        } ];
      }));

      return $sum;
    };

    spec.maxItem = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            if ($maxElement === $nil) {
              $maxElement = $elem;
            } else if ($elem > $maxElement) {
              $maxElement = $elem;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $maxElement;
    }, "function");

    spec.minItem = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem) {
            if ($minElement === $nil) {
              $minElement = $elem;
            } else if ($elem < $minElement) {
              $minElement = $elem;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $minElement;
    }, "function");

    spec.maxIndex = fn(function($function) {
      var $maxValue, $maxIndex;

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem, $index) {
            if ($maxValue === $nil) {
              $maxValue = $elem;
              $maxIndex = $index;
            } else if ($elem > $maxValue) {
              $maxValue = $elem;
              $maxIndex = $index;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $maxIndex;
    }, "function");

    spec.minIndex = fn(function($function) {
      var $maxValue, $minIndex;

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($.Function(function() {
          return [ function($elem, $index) {
            if ($maxValue === $nil) {
              $maxValue = $elem;
              $minIndex = $index;
            } else if ($elem < $maxValue) {
              $maxValue = $elem;
              $minIndex = $index;
            }
          } ];
        }));
      } else {
        this.do($.Function(function() {
          return [ function($elem, $i) {
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
          } ];
        }));
      }

      return $minIndex;
    }, "function");

    spec.maxValue = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($.Function(function() {
        return [ function($elem, $i) {
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
        } ];
      }));

      return $maxValue;
    }, "function");

    spec.minValue = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      this.do($.Function(function() {
        return [ function($elem, $i) {
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
        } ];
      }));

      return $minValue;
    }, "function");

    spec.maxSizeAtDepth = fn(function($rank) {
      var rank, maxsize = 0;

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($.Function(function() {
        return [ function($sublist) {
          var sz;
          if ($sublist.isCollection().__bool__()) {
            sz = $sublist.maxSizeAtDepth($.Integer(rank - 1));
          } else {
            sz = 1;
          }
          if (sz > maxsize) {
            maxsize = sz;
          }
        } ];
      }));

      return $.Integer(maxsize);
    }, "rank");

    spec.maxDepth = fn(function($max) {
      var $res;

      $res = $max;
      this.do($.Function(function() {
        return [ function($elem) {
          if ($elem.isCollection().__bool__()) {
            $res = $res.max($elem.maxDepth($max.__inc__()));
          }
        } ];
      }));

      return $res;
    }, "max=1");

    spec.deepCollect = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($.Function(function() {
          return [ function($item, $i) {
            return $item.deepCollect($depth, $function, $i, $rank);
          } ];
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($.Function(function() {
        return [ function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        } ];
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.deepDo = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($.Function(function() {
          return [ function($item, $i) {
            $item.deepDo($depth, $function, $i, $rank);
          } ];
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($.Function(function() {
        return [ function($item, $i) {
          $item.deepDo($depth, $function, $i, $rank);
        } ];
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.invert = fn(function($axis) {
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
    }, "axis");

    spec.sect = fn(function($that) {
      var $result;

      $result = this.species().new();
      this.do($.Function(function() {
        return [ function($item) {
          if ($that.$("includes", [ $item ]).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.union = fn(function($that) {
      var $result;

      $result = this.copy();
      $that.do($.Function(function() {
        return [ function($item) {
          if (!$result.includes($item).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.difference = fn(function($that) {
      return this.copy().removeAll($that);
    }, "that");

    spec.symmetricDifference = fn(function($that) {
      var $this = this, $result;

      $result = this.species().new();
      $this.do($.Function(function() {
        return [ function($item) {
          if (!$that.includes($item).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));
      $that.do($.Function(function() {
        return [ function($item) {
          if (!$this.includes($item).__bool__()) {
            $result = $result.add($item);
          }
        } ];
      }));

      return $result;
    }, "that");

    spec.isSubsetOf = fn(function($that) {
      return $that.$("includesAll", [ this ]);
    }, "that");

    spec.asArray = function() {
      return SCArray.new(this.size()).addAll(this);
    };

    spec.asBag = function() {
      return $("Bag").new(this.size()).addAll(this);
    };

    spec.asList = function() {
      return $("List").new(this.size()).addAll(this);
    };

    spec.asSet = function() {
      return $("Set").new(this.size()).addAll(this);
    };

    spec.asSortedList = function($function) {
      return $("SortedList").new(this.size(), $function).addAll(this);
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
      this.do($.Function(function() {
        return [ function($elem) {
          items.push($elem.__str__());
        } ];
      }));

      return $.String(
        this.__className + "[ " + items.join(", ") + " ]"
      );
    };
  });
});

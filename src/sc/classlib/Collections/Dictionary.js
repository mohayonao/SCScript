SCScript.install(function(sc) {
  "use strict";

  require("./Association");
  require("./Set");

  var slice = [].slice;
  var fn    = sc.lang.fn;
  var $SC   = sc.lang.$SC;

  function SCDictionary(args) {
    var n = 8;
    if (args && args[0]) {
      n = args[0].__int__();
    }
    this.__initializeWith__("Set", [ $SC.Integer(n) ]);
    this._ = {};
  }

  sc.lang.klass.define(SCDictionary, "Dictionary : Set", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_1 = utils.$int_1;
    var SCSet  = $SC("Set");
    var SCArray = $SC("Array");
    var SCAssociation = $SC("Association");

    spec.valueOf = function() {
      var obj;
      var array, i, imax;

      obj = {};

      array = this._array._;
      for (i = 0, imax = array.length; i < imax; i += 2) {
        if (array[i] !== $nil) {
          obj[array[i].valueOf()] = array[i + 1].valueOf();
        }
      }

      return obj;
    };

    spec.$newFrom = fn(function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.keysValuesDo($SC.Function(function($k, $v) {
        $newCollection.put($k, $v);
      }));

      return $newCollection;
    }, "aCollection");

    spec.at = fn(function($key) {
      return this._array.at(this.scanFor($key).__inc__());
    }, "key");

    spec.atFail = fn(function($key, $function) {
      var $val;

      $val = this.at($key);
      if ($val === $nil) {
        $val = $function.value();
      }

      return $val;
    }, "key; function");

    spec.matchAt = fn(function($key) {
      var ret = null;

      this.keysValuesDo($SC.Function(function($k, $v) {
        if (BOOL($k.matchItem($key))) {
          ret = $v;
          return sc.C.LOOP_BREAK;
        }
      }));

      return ret || $nil;
    }, "key");

    spec.trueAt = fn(function($key) {
      var $ret;

      $ret = this.at($key);

      return $ret !== $nil ? $ret : $false;
    }, "key");

    spec.add = fn(function($anAssociation) {
      this.put($anAssociation.key(), $anAssociation.value());
      return this;
    }, "anAssociation");

    spec.put = fn(function($key, $value) {
      var $array, $index;

      if ($value === $nil) {
        this.removeAt($key);
      } else {
        $array = this._array;
        $index = this.scanFor($key);
        $array.put($index.__inc__(), $value);
        if ($array.at($index) === $nil) {
          $array.put($index, $key);
          this._size = this._size.__inc__();
          if ($array.size().__inc__() < this._size.__inc__() * 4) {
            this.grow();
          }
        }
      }

      return this;
    }, "key; value");

    spec.putAll = function() {
      var $this = this;
      var func;

      func = $SC.Function(function($key, $value) {
        $this.put($key, $value);
      });

      slice.call(arguments).forEach(function($dict) {
        $dict.keysValuesDo(func);
      }, this);

      return this;
    };

    spec.putPairs = fn(function($args) {
      var $this = this;

      $args.pairsDo($SC.Function(function($key, $val) {
        $this.put($key, $val);
      }));

      return this;
    }, "args");

    spec.getPairs = fn(function($args) {
      var $this = this;
      var $result;

      if ($args === $nil) {
        $args = this.keys();
      }

      $result = $nil;
      $args.do($SC.Function(function($key) {
        var $val;
        $val = $this.at($key);
        if ($val !== $nil) {
          $result = $result.add($key).add($val);
        }
      }));

      return $result;
    }, "args");

    spec.associationAt = fn(function($key) {
      var $res;
      var array, index;

      array = this._array._;
      index = this.scanFor($key).__int__();

      // istanbul ignore else
      if (index >= 0) {
        $res = SCAssociation.new(array[index], array[index + 1]);
      }

      return $res || /* istanbul ignore next */ $nil;
    }, "key");

    spec.associationAtFail = fn(function($argkey, $function) {
      var $index, $key;

      $index = this.scanFor($argkey);
      $key   = this._array.at($index);

      if ($key === $nil) {
        return $function.value();
      }

      return SCAssociation.new($key, this._array.at($index.__inc__()));
    }, "argKey; function");

    spec.keys = fn(function($species) {
      var $set;

      if ($species === $nil) {
        $species = SCSet;
      }

      $set = $species.new(this._size);
      this.keysDo($SC.Function(function($key) {
        $set.add($key);
      }));

      return $set;
    }, "species");

    spec.values = function() {
      var $list;

      $list = $SC("List").new(this._size);
      this.do($SC.Function(function($value) {
        $list.add($value);
      }));

      return $list;
    };

    spec.includes = fn(function($item1) {
      var $ret = null;

      this.do($SC.Function(function($item2) {
        if (BOOL($item1 ["=="] ($item2))) {
          $ret = $true;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $ret || $false;
    }, "item1");

    spec.includesKey = fn(function($key) {
      return this.at($key).notNil();
    }, "key");

    spec.removeAt = fn(function($key) {
      var $array;
      var $val, $index, $atKeyIndex;

      $array = this._array;
      $index = this.scanFor($key);
      $atKeyIndex = $array.at($index);
      if ($atKeyIndex === $nil) {
        return $nil;
      }

      $val = $array.at($index.__inc__());
      $array.put($index, $nil);
      $array.put($index.__inc__(), $nil);

      this._size = this._size.__dec__();

      // this.fixCollisionsFrom($index);

      return $val;
    }, "key");

    spec.removeAtFail = fn(function($key, $function) {
      var $array;
      var $val, $index, $atKeyIndex;

      $array = this._array;
      $index = this.scanFor($key);
      $atKeyIndex = $array.at($index);

      if ($atKeyIndex === $nil) {
        return $function.value();
      }

      $val = $array.at($index.__inc__());
      $array.put($index, $nil);
      $array.put($index.__inc__(), $nil);

      this._size = this._size.__dec__();

      // this.fixCollisionsFrom($index);

      return $val;
    }, "key; function");

    spec.remove = function() {
      throw new Error("shouldNotImplement");
    };

    spec.removeFail = function() {
      throw new Error("shouldNotImplement");
    };

    spec.keysValuesDo = fn(function($function) {
      this.keysValuesArrayDo(this._array, $function);
      return this;
    }, "function");

    spec.keysValuesChange = fn(function($function) {
      var $this = this;

      this.keysValuesDo($SC.Function(function($key, $value, $i) {
        $this.put($key, $function.value($key, $value, $i));
      }));

      return this;
    }, "function");

    spec.do = fn(function($function) {
      this.keysValuesDo($SC.Function(function($key, $value, $i) {
        $function.value($value, $i);
      }));
      return this;
    }, "function");

    spec.keysDo = fn(function($function) {
      this.keysValuesDo($SC.Function(function($key, $val, $i) {
        $function.value($key, $i);
      }));
      return this;
    }, "function");

    spec.associationsDo = fn(function($function) {
      this.keysValuesDo($SC.Function(function($key, $val, $i) {
        var $assoc = SCAssociation.new($key, $val);
        $function.value($assoc, $i);
      }));
      return this;
    }, "function");

    spec.pairsDo = fn(function($function) {
      this.keysValuesArrayDo(this._array, $function);
      return this;
    }, "function");

    spec.collect = fn(function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($SC.Function(function($key, $elem) {
        $res.put($key, $function.value($elem, $key));
      }));

      return $res;
    }, "function");

    spec.select = fn(function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($SC.Function(function($key, $elem) {
        if (BOOL($function.value($elem, $key))) {
          $res.put($key, $elem);
        }
      }));

      return $res;
    }, "function");

    spec.reject = fn(function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($SC.Function(function($key, $elem) {
        if (!BOOL($function.value($elem, $key))) {
          $res.put($key, $elem);
        }
      }));

      return $res;
    }, "function");

    spec.invert = function() {
      var $dict;

      $dict = this.class().new(this.size());
      this.keysValuesDo($SC.Function(function($key, $val) {
        $dict.put($val, $key);
      }));

      return $dict;
    };

    spec.merge = fn(function($that, $func, $fill) {
      var $this = this;
      var $commonKeys, $myKeys, $otherKeys;
      var $res;

      $res = this.class().new();

      $myKeys    = this.keys();
      $otherKeys = $that.keys();

      if (BOOL($myKeys ["=="] ($otherKeys))) {
        $commonKeys = $myKeys;
      } else {
        $commonKeys = $myKeys.sect($otherKeys);
      }

      $commonKeys.do($SC.Function(function($key) {
        $res.put($key, $func.value($this.at($key), $that.at($key), $key));
      }));

      if (BOOL($fill)) {
        $myKeys.difference($otherKeys).do($SC.Function(function($key) {
          $res.put($key, $this.at($key));
        }));
        $otherKeys.difference($myKeys).do($SC.Function(function($key) {
          $res.put($key, $that.at($key));
        }));
      }

      return $res;
    }, "that; func; fill=true");

    // TODO: implements blend

    spec.findKeyForValue = fn(function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._array, $SC.Function(function($key, $val) {
        if (BOOL($argValue ["=="] ($val))) {
          $ret = $key;
          return sc.C.LOOP_BREAK;
        }
      }));

      return $ret || $nil;
    }, "argValue");

    spec.sortedKeysValuesDo = fn(function($function, $sortFunc) {
      var $this = this;
      var $keys;

      $keys = this.keys(SCArray);
      $keys.sort($sortFunc);

      $keys.do($SC.Function(function($key, $i) {
        $function.value($key, $this.at($key), $i);
      }));

      return this;
    }, "$function; $sortFunc");

    spec.choose = function() {
      var $array;
      var $size, $index;

      if (BOOL(this.isEmpty())) {
        return $nil;
      }

      $array = this._array;
      $size  = $array.size() [">>"] ($int_1);

      do {
        $index = $size.rand() ["<<"] ($int_1);
      } while ($array.at($index) === $nil);

      return $array.at($index.__inc__());
    };

    spec.order = fn(function($func) {
      var $assoc;

      if (BOOL(this.isEmpty())) {
        return $nil;
      }

      $assoc = $nil;
      this.keysValuesDo($SC.Function(function($key, $val) {
        $assoc = $assoc.add($key ["->"] ($val));
      }));

      return $assoc.sort($func).collect($SC.Function(function($_) {
        return $_.key();
      }));
    }, "func");

    spec.powerset = function() {
      var $this = this;
      var $keys, $class;

      $keys  = this.keys().asArray().powerset();
      $class = this.class();

      return $keys.collect($SC.Function(function($list) {
        var $dict;

        $dict = $class.new();
        $list.do($SC.Function(function($key) {
          $dict.put($key, $this.at($key));
        }));

        return $dict;
      }));
    };

    spec.transformEvent = fn(function($event) {
      return $event.putAll(this);
    }, "event");

    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs

    spec.keysValuesArrayDo = function($argArray, $function) {
      var $key, $val;
      var array, j, i, imax;

      array = this._array._;
      for (i = j = 0, imax = array.length; i < imax; i += 2, ++j) {
        $key = array[i];
        if ($key !== $nil) {
          $val = $argArray.at($SC.Integer(i + 1));
          $function.value($key, $val, $SC.Integer(j));
        }
      }
    };

    // TODO: implements grow
    // TODO: implements fixCollisionsFrom

    // istanbul ignore next
    spec.scanFor = function($argKey) {
      var array, i, imax;
      var $elem;

      array = this._array._;
      imax  = array.length;

      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if (BOOL($elem ["=="] ($argKey))) {
          return $SC.Integer(i);
        }
      }
      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $nil) {
          return $SC.Integer(i);
        }
      }

      return $SC.Integer(-2);
    };

    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
  });

  function SCIdentityDictionary() {
    this.__initializeWith__("Dictionary");
  }

  sc.lang.klass.define(SCIdentityDictionary, "IdentityDictionary : Dictionary", function() {
    // TODO: implements at
    // TODO: implements put
    // TODO: implements putGet
    // TODO: implements includesKey
    // TODO: implements findKeyForValue
    // TODO: implements scanFor
    // TODO: implements freezeAsParent
    // TODO: implements insertParent
    // TODO: implements storeItemsOn
    // TODO: implements doesNotUnderstand
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements timingOffset
  });

});

SCScript.install(function(sc) {
  "use strict";

  require("./Association");
  require("./Set");

  var slice = [].slice;
  var $ = sc.lang.$;
  var $nil   = $.nil;
  var $true  = $.true;
  var $false = $.false;
  var $int1  = $.int1;
  var SCSet = $("Set");
  var SCArray = $("Array");
  var SCAssociation = $("Association");

  sc.lang.klass.refine("Dictionary", function(builder) {
    builder.addClassMethod("new", {
      args: "n=8"
    }, function($n) {
      return this.__super__("new", [ $n ]);
    });

    builder.addMethod("valueOf", function() {
      var obj;
      var array, i, imax;

      obj = {};

      array = this._$array._;
      for (i = 0, imax = array.length; i < imax; i += 2) {
        if (array[i] !== $nil) {
          obj[array[i].valueOf()] = array[i + 1].valueOf();
        }
      }

      return obj;
    });

    builder.addClassMethod("newFrom", {
      args: "aCollection"
    }, function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.$("keysValuesDo", [ $.Func(function($k, $v) {
        return $newCollection.put($k, $v);
      }) ]);

      return $newCollection;
    });

    builder.addMethod("at", {
      args: "key"
    }, function($key) {
      return this._$array.at(this.scanFor($key).__inc__());
    });

    builder.addMethod("atFail", {
      args: "key; function"
    }, function($key, $function) {
      var $val;

      $val = this.at($key);
      if ($val === $nil) {
        $val = $function.value();
      }

      return $val;
    });

    builder.addMethod("matchAt", {
      args: "key"
    }, function($key) {
      var ret = null;

      this.keysValuesDo($.Func(function($k, $v) {
        if ($k.matchItem($key).__bool__()) {
          ret = $v;
          this.break();
        }
        return $nil;
      }));

      return ret || $nil;
    });

    builder.addMethod("trueAt", {
      args: "key"
    }, function($key) {
      var $ret;

      $ret = this.at($key);

      return $ret !== $nil ? $ret : $false;
    });

    builder.addMethod("add", {
      args: "anAssociation"
    }, function($anAssociation) {
      this.put($anAssociation.$("key"), $anAssociation.$("value"));
      return this;
    });

    builder.addMethod("put", {
      args: "key; value"
    }, function($key, $value) {
      var $array, $index;

      if ($value === $nil) {
        this.removeAt($key);
      } else {
        $array = this._$array;
        $index = this.scanFor($key);
        $array.put($index.__inc__(), $value);
        if ($array.at($index) === $nil) {
          $array.put($index, $key);
          this._incrementSize();
        }
      }

      return this;
    });

    builder.addMethod("putAll", function() {
      var $this = this;
      var $loopfunc;

      $loopfunc = $.Func(function($key, $value) {
        return $this.put($key, $value);
      });

      slice.call(arguments).forEach(function($dict) {
        $dict.keysValuesDo($loopfunc);
      }, this);

      return this;
    });

    builder.addMethod("putPairs", {
      args: "args"
    }, function($args) {
      var $this = this;

      $args.$("pairsDo", [ $.Func(function($key, $val) {
        return $this.put($key, $val);
      }) ]);

      return this;
    });

    builder.addMethod("getPairs", {
      args: "args"
    }, function($args) {
      var $this = this;
      var $result;

      if ($args === $nil) {
        $args = this.keys();
      }

      $result = $nil;
      $args.do($.Func(function($key) {
        var $val;
        $val = $this.at($key);
        if ($val !== $nil) {
          $result = $result.add($key).add($val);
        }
        return $nil;
      }));

      return $result;
    });

    builder.addMethod("associationAt", {
      args: "key"
    }, function($key) {
      var $res;
      var array, index;

      array = this._$array._;
      index = this.scanFor($key).__int__();

      /* istanbul ignore else */
      if (index >= 0) {
        $res = SCAssociation.new(array[index], array[index + 1]);
      }

      return $res || /* istanbul ignore next */ $nil;
    });

    builder.addMethod("associationAtFail", {
      args: "argKey; function"
    }, function($argKey, $function) {
      var $index, $key;

      $index = this.scanFor($argKey);
      $key   = this._$array.at($index);

      if ($key === $nil) {
        return $function.value();
      }

      return SCAssociation.new($key, this._$array.at($index.__inc__()));
    });

    builder.addMethod("keys", {
      args: "species"
    }, function($species) {
      var $set;

      if ($species === $nil) {
        $species = SCSet;
      }

      $set = $species.new(this.size());
      this.keysDo($.Func(function($key) {
        return $set.add($key);
      }));

      return $set;
    });

    builder.addMethod("values", function() {
      var $list;

      $list = $("List").new(this.size());
      this.do($.Func(function($value) {
        return $list.add($value);
      }));

      return $list;
    });

    builder.addMethod("includes", {
      args: "item1"
    }, function($item1) {
      var $ret = null;

      this.do($.Func(function($item2) {
        if ($item1 ["=="] ($item2).__bool__()) {
          $ret = $true;
          this.break();
        }
        return $nil;
      }));

      return $ret || $false;
    });

    builder.addMethod("includesKey", {
      args: "key"
    }, function($key) {
      return this.at($key).notNil();
    });

    builder.addMethod("removeAt", {
      args: "key"
    }, function($key) {
      var $array;
      var $val, $index, $atKeyIndex;

      $array = this._$array;
      $index = this.scanFor($key);
      $atKeyIndex = $array.at($index);
      if ($atKeyIndex === $nil) {
        return $nil;
      }

      $val = $array.at($index.__inc__());
      $array.put($index, $nil);
      $array.put($index.__inc__(), $nil);

      this._size -= 1;

      // this.fixCollisionsFrom($index);

      return $val;
    });

    builder.addMethod("removeAtFail", {
      args: "key; function"
    }, function($key, $function) {
      var $array;
      var $val, $index, $atKeyIndex;

      $array = this._$array;
      $index = this.scanFor($key);
      $atKeyIndex = $array.at($index);

      if ($atKeyIndex === $nil) {
        return $function.value();
      }

      $val = $array.at($index.__inc__());
      $array.put($index, $nil);
      $array.put($index.__inc__(), $nil);

      this._size -= 1;

      // this.fixCollisionsFrom($index);

      return $val;
    });

    builder.shouldNotImplement("remove");
    builder.shouldNotImplement("removeFail");

    builder.addMethod("keysValuesDo", {
      args: "function"
    }, function($function) {
      this.keysValuesArrayDo(this._$array, $function);
      return this;
    });

    builder.addMethod("keysValuesChange", {
      args: "function"
    }, function($function) {
      var $this = this;

      this.keysValuesDo($.Func(function($key, $value, $i) {
        return $this.put($key, $function.value($key, $value, $i));
      }));

      return this;
    });

    builder.addMethod("do", {
      args: "function"
    },  function($function) {
      this.keysValuesDo($.Func(function($key, $value, $i) {
        return $function.value($value, $i);
      }));
      return this;
    });

    builder.addMethod("keysDo", {
      args: "function"
    },  function($function) {
      this.keysValuesDo($.Func(function($key, $val, $i) {
        return $function.value($key, $i);
      }));
      return this;
    });

    builder.addMethod("associationsDo", {
      args: "function"
    },  function($function) {
      this.keysValuesDo($.Func(function($key, $val, $i) {
        var $assoc = SCAssociation.new($key, $val);
        return $function.value($assoc, $i);
      }));
      return this;
    });

    builder.addMethod("pairsDo", {
      args: "function"
    },  function($function) {
      this.keysValuesArrayDo(this._$array, $function);
      return this;
    });

    builder.addMethod("collect", {
      args: "function"
    },  function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $elem) {
        return $res.put($key, $function.value($elem, $key));
      }));

      return $res;
    });

    builder.addMethod("select", {
      args: "function"
    },  function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $elem) {
        if ($function.value($elem, $key).__bool__()) {
          $res.put($key, $elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("reject", {
      args: "function"
    },  function($function) {
      var $res;

      $res = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $elem) {
        if (!$function.value($elem, $key).__bool__()) {
          $res.put($key, $elem);
        }
        return $nil;
      }));

      return $res;
    });

    builder.addMethod("invert", function() {
      var $dict;

      $dict = this.class().new(this.size());
      this.keysValuesDo($.Func(function($key, $val) {
        return $dict.put($val, $key);
      }));

      return $dict;
    });

    builder.addMethod("merge", {
      args: "that; func; fill=true"
    }, function($that, $func, $fill) {
      var $this = this;
      var $commonKeys, $myKeys, $otherKeys;
      var $res;

      $res = this.class().new();

      $myKeys    = this.keys();
      $otherKeys = $that.keys();

      if ($myKeys ["=="] ($otherKeys).__bool__()) {
        $commonKeys = $myKeys;
      } else {
        $commonKeys = $myKeys.sect($otherKeys);
      }

      $commonKeys.do($.Func(function($key) {
        return $res.put($key, $func.value($this.at($key), $that.at($key), $key));
      }));

      if ($fill.__bool__()) {
        $myKeys.difference($otherKeys).do($.Func(function($key) {
          return $res.put($key, $this.at($key));
        }));
        $otherKeys.difference($myKeys).do($.Func(function($key) {
          return $res.put($key, $that.at($key));
        }));
      }

      return $res;
    });

    // TODO: implements blend

    builder.addMethod("findKeyForValue", {
      args: "argValue"
    }, function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._$array, $.Func(function($key, $val) {
        if ($argValue ["=="] ($val).__bool__()) {
          $ret = $key;
          this.break();
        }
        return $nil;
      }));

      return $ret || $nil;
    });

    builder.addMethod("sortedKeysValuesDo", {
      args: "function; sortFunc"
    }, function($function, $sortFunc) {
      var $this = this;
      var $keys;

      $keys = this.keys(SCArray);
      $keys.sort($sortFunc);

      $keys.do($.Func(function($key, $i) {
        return $function.value($key, $this.at($key), $i);
      }));

      return this;
    });

    builder.addMethod("choose", function() {
      var $array;
      var $size, $index;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }

      $array = this._$array;
      $size  = $array.size() [">>"] ($int1);

      do {
        $index = $size.rand() ["<<"] ($int1);
      } while ($array.at($index) === $nil);

      return $array.at($index.__inc__());
    });

    builder.addMethod("order", {
      args: "func"
    }, function($func) {
      var $assoc;

      if (this.isEmpty().__bool__()) {
        return $nil;
      }

      $assoc = $nil;
      this.keysValuesDo($.Func(function($key, $val) {
        $assoc = $assoc.add($key.$("->", [ $val ]));
        return $assoc;
      }));

      return $assoc.sort($func).collect($.Func(function($_) {
        return $_.$("key");
      }));
    });

    builder.addMethod("powerset", function() {
      var $this = this;
      var $keys, $class;

      $keys  = this.keys().asArray().powerset();
      $class = this.class();

      return $keys.collect($.Func(function($list) {
        var $dict;

        $dict = $class.new();
        $list.do($.Func(function($key) {
          return $dict.put($key, $this.at($key));
        }));

        return $dict;
      }));
    });

    builder.addMethod("transformEvent", {
      args: "event"
    }, function($event) {
      return $event.$("putAll", [ this ]);
    });

    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs

    builder.addMethod("keysValuesArrayDo", function($argArray, $function) {
      var $key, $val;
      var array, j, i, imax;

      array = this._$array._;
      for (i = j = 0, imax = array.length; i < imax; i += 2, ++j) {
        $key = array[i];
        if ($key !== $nil) {
          $val = $argArray.$("at", [ $.Integer(i + 1) ]);
          $function.value($key, $val, $.Integer(j));
        }
      }
    });

    // TODO: implements grow
    // TODO: implements fixCollisionsFrom

    /* istanbul ignore next */
    builder.addMethod("scanFor", function($argKey) {
      var array, i, imax;
      var $elem;

      array = this._$array._;
      imax  = array.length;

      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem ["=="] ($argKey).__bool__()) {
          return $.Integer(i);
        }
      }
      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $nil) {
          return $.Integer(i);
        }
      }

      return $.Integer(-2);
    });

    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn

    builder.addMethod("_incrementSize", function() {
      this._size += 1;
      if (this._$array.size().__inc__() < this._size * 4) {
        this.grow();
      }
    });
  });

  sc.lang.klass.refine("IdentityDictionary", function(builder) {
    builder.addProperty("<>", "proto");
    builder.addProperty("<>", "parent");
    builder.addProperty("<>", "know");

    builder.addClassMethod("new", {
      args: "n=8; proto; parent; know=false"
    }, function($n, $proto, $parent, $know) {
      return this.__super__("new", [ $n ])
        .proto_($proto).parent_($parent).know_($know);
    });

    builder.addMethod("putGet", {
      args: "key; value"
    }, function($key, $value) {
      var $array, $index, $prev;

      $array = this._$array;
      $index = this.scanFor($key);
      $prev  = $array.at($index.__inc__());
      $array.put($index.__inc__(), $value);
      if ($array.at($index) === $nil) {
        $array.put($index, $key);
        this._incrementSize();
      }

      return $prev;
    });

    builder.addMethod("findKeyForValue", {
      args: "argValue"
    }, function($argValue) {
      var $ret = null;

      this.keysValuesArrayDo(this._$array, $.Func(function($key, $val) {
        if ($argValue === $val) {
          $ret = $key;
          this.break();
        }
        return $nil;
      }));

      return $ret || $nil;
    });

    /* istanbul ignore next */
    builder.addMethod("scanFor", function($argKey) {
      var array, i, imax;
      var $elem;

      array = this._$array._;
      imax  = array.length;

      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $argKey) {
          return $.Integer(i);
        }
      }
      for (i = 0; i < imax; i += 2) {
        $elem = array[i];
        if ($elem === $nil) {
          return $.Integer(i);
        }
      }

      return $.Integer(-2);
    });
    // TODO: implements freezeAsParent
    // TODO: implements insertParent
    // TODO: implements storeItemsOn
    // TODO: implements doesNotUnderstand
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements timingOffset
  });
});

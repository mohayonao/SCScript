SCScript.install(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var slice = [].slice;
  var $     = sc.lang.$;
  var rand  = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  var SCArray = $("Array");
  var $nil = $.nil;

  sc.lang.klass.refine("Array", function(builder) {
    builder.addClassMethod("with", function() {
      return $.Array(slice.call(arguments));
    });

    builder.addMethod("reverse", function() {
      return $.Array(this._.slice().reverse());
    });

    builder.addMethod("scramble", function() {
      var a, tmp, i, j, m;

      a = this._.slice();
      m = a.length;
      if (m > 1) {
        for (i = 0; m > 0; ++i, --m) {
          j = i + (rand.next() * m)|0;
          tmp  = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
      }

      return $.Array(a);
    });

    builder.addMethod("mirror", function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror -->
      size = raw.length * 2 - 1;
      if (size < 2) {
        return $.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $.Array(a);
    });

    builder.addMethod("mirror1", function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror1 -->
      size = raw.length * 2 - 2;
      if (size < 2) {
        return $.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $.Array(a);
    });

    builder.addMethod("mirror2", function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror2 -->
      size = raw.length * 2;
      if (size < 2) {
        return $.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 1, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $.Array(a);
    });

    builder.addMethod("stutter", {
      args: "n=2"
    }, function($n) {
      var raw = this._;
      var n, a, i, j, imax, k;

      // <-- _ArrayStutter -->
      n = Math.max(0, $n.__int__());
      a = new Array(raw.length * n);
      for (i = 0, j = 0, imax = raw.length; i < imax; ++i) {
        for (k = 0; k < n; ++k, ++j) {
          a[j] = raw[i];
        }
      }

      return $.Array(a);
    });

    builder.addMethod("rotate", {
      args: "n=1"
    }, function($n) {
      var raw = this._;
      var n, a, size, i, j;

      // <-- _ArrayRotate -->
      n = $n.__int__();
      a = new Array(raw.length);
      size = a.length;
      n %= size;
      if (n < 0) {
        n += size;
      }
      for (i = 0, j = n; i < size; ++i) {
        a[j] = raw[i];
        if (++j >= size) {
          j = 0;
        }
      }

      return $.Array(a);
    });

    builder.addMethod("pyramid", {
      args: "n=1"
    }, function($patternType) {
      var patternType;
      var obj1, obj2, i, j, k, n, numslots, x;

      obj1 = this._;
      obj2 = [];

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      x = numslots = obj1.length;

      switch (patternType) {
      case 1:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 2:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 3:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 4:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 5:
        n = x * x;
        for (i = k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 6:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 7:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 8:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 9:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 10:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      }

      return $.Array(obj2);
    });

    builder.addMethod("pyramidg", {
      args: "n=1"
    }, function($patternType) {
      var raw = this._;
      var patternType;
      var list = [], lastIndex, i;

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      lastIndex = raw.length - 1;

      switch (patternType) {
      case 1:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 2:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        break;
      case 3:
        for (i = lastIndex; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 4:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 5:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 6:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        break;
      case 7:
        for (i = lastIndex; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      case 8:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 9:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 10:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($.Array(raw.slice(0, i + 1)));
        }
        break;
      }

      return $.Array(list);
    });

    builder.addMethod("sputter", {
      args: "probability=0.25; maxlen=100"
    }, function($probability, $maxlen) {
      var list, prob, maxlen, i, length;

      list   = [];
      prob   = 1.0 - $probability.__num__();
      maxlen = $maxlen.__int__();
      i = 0;
      length = this._.length;
      while (i < length && list.length < maxlen) {
        list.push(this._[i]);
        if (rand.next() < prob) {
          i += 1;
        }
      }

      return $.Array(list);
    });

    builder.addMethod("lace", {
      args: "length"
    }, function($length) {
      var raw = this._;
      var length, wrap = raw.length;
      var a, i, $item;

      if ($length === $nil) {
        $length = $.Integer(wrap);
      }

      length = $length.__int__();
      a = new Array(length);

      for (i = 0; i < length; ++i) {
        $item = raw[i % wrap];
        if (Array.isArray($item._)) {
          a[i] = $item._[ ((i / wrap)|0) % $item._.length ];
        } else {
          a[i] = $item;
        }
      }

      return $.Array(a);
    });

    builder.addMethod("permute", {
      args: "nthPermutation=0"
    }, function($nthPermutation) {
      var raw = this._;
      var obj1, obj2, size, $item;
      var nthPermutation, i, imax, j;

      obj1 = raw;
      obj2 = raw.slice();
      size = raw.length;
      nthPermutation = $nthPermutation.__int__();

      for (i = 0, imax = size - 1; i < imax; ++i) {
        j = i + nthPermutation % (size - i);
        nthPermutation = (nthPermutation / (size - i))|0;

        $item = obj2[i];
        obj2[i] = obj2[j];
        obj2[j] = $item;
      }

      return $.Array(obj2);
    });

    builder.addMethod("allTuples", {
      args: "maxTuples=16384"
    }, function($maxTuples) {
      var maxSize;
      var obj1, obj2, obj3, obj4, newSize, tupSize;
      var i, j, k;

      maxSize = $maxTuples.__int__();

      obj1 = this._;
      newSize = 1;
      tupSize = obj1.length;
      for (i = 0; i < tupSize; ++i) {
        if (Array.isArray(obj1[i]._)) {
          newSize *= obj1[i]._.length;
        }
      }
      newSize = Math.min(newSize, maxSize);

      obj2 = new Array(newSize);

      for (i = 0; i < newSize; ++i) {
        k = i;
        obj3 = new Array(tupSize);
        for (j = tupSize - 1; j >= 0; --j) {
          if (Array.isArray(obj1[j]._)) {
            obj4 = obj1[j]._;
            obj3[j] = obj4[k % obj4.length];
            k = (k / obj4.length)|0;
          } else {
            obj3[j] = obj1[j];
          }
        }
        obj2[i] = $.Array(obj3);
      }

      return $.Array(obj2);
    });

    builder.addMethod("wrapExtend", {
      args: "size"
    }, function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());
      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[i % raw.length];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    });

    builder.addMethod("foldExtend", {
      args: "size"
    }, function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[mathlib.foldIndex(i, raw.length)];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    });

    builder.addMethod("clipExtend", {
      args: "size"
    }, function($size) {
      var raw = this._;
      var size, a, i, imax, b;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0, imax = raw.length; i < imax; ++i) {
          a[i] = raw[i];
        }
        for (b = a[i - 1]; i < size; ++i) {
          a[i] = b;
        }
      } else {
        a = raw.slice(0, size);
      }

      return $.Array(a);
    });

    builder.addMethod("slide", {
      args: "windowLength=3; stepSize=1"
    }, function($windowLength, $stepSize) {
      var raw = this._;
      var windowLength, stepSize;
      var obj1, obj2, m, n, numwin, numslots;
      var i, j, h, k;

      windowLength = $windowLength.__int__();
      stepSize = $stepSize.__int__();
      obj1 = raw;
      obj2 = [];
      m = windowLength;
      n = stepSize;
      numwin = ((raw.length + n - m) / n)|0;
      numslots = numwin * m;

      for (i = h = k = 0; i < numwin; ++i, h += n) {
        for (j = h; j < m + h; ++j) {
          obj2[k++] = obj1[j];
        }
      }

      return $.Array(obj2);
    });

    builder.addMethod("containsSeqColl", function() {
      var raw = this._;
      var i, imax;

      for (i = 0, imax = raw.length; i < imax; ++i) {
        if (raw[i].isSequenceableCollection().__bool__()) {
          return $.True();
        }
      }

      return $.False();
    });

    builder.addMethod("unlace", {
      args: "clumpSize=2; numChan=1"
    }, function($clumpSize, $numChan) {
      var raw = this._;
      var clumpSize, numChan;
      var a, b, size, i, j, k;

      clumpSize = $clumpSize.__int__();
      numChan   = $numChan  .__int__();
      size = (raw.length / clumpSize)|0;
      size = size - (size % numChan);
      if (size) {
        a = new Array(clumpSize);
        for (i = 0; i < clumpSize; ++i) {
          b = new Array(size);
          for (j = 0; j < size; j += numChan) {
            for (k = 0; k < numChan; ++k) {
              b[j + k] = raw[i * numChan + k + j * clumpSize];
            }
          }
          a[i] = $.Array(b);
        }
      } else {
        a = [];
      }

      return $.Array(a);
    });

    // TODO: implements interlace
    // TODO: implements deinterlace

    builder.addMethod("flop", function() {
      return this.multiChannelExpand();
    });

    builder.addMethod("multiChannelExpand", function() {
      var raw = this._;
      var maxSize, size, obj1, obj2, obj3;
      var i, j;

      obj1 = raw;
      maxSize = obj1.reduce(function(len, $elem) {
        return Math.max(len, Array.isArray($elem._) ? $elem._.length : 1);
      }, 0);

      obj2 = new Array(maxSize);
      size = obj1.length;

      if (size === 0) {
        obj2[0] = $.Array([]);
      } else {
        for (i = 0; i < maxSize; ++i) {
          obj3 = new Array(size);
          for (j = 0; j < size; ++j) {
            if (Array.isArray(obj1[j]._)) {
              obj3[j] = obj1[j]._[i % obj1[j]._.length];
            } else {
              obj3[j] = obj1[j];
            }
          }
          obj2[i] = $.Array(obj3);
        }
      }

      return $.Array(obj2);
    });

    // TODO: implements envirPairs

    builder.addMethod("shift", {
      args: "n; fillter=0.0"
    }, function($n, $filler) {
      var $fill, $remain;

      $fill = SCArray.fill($n.$("abs"), $filler);
      $remain = this.drop($n.$("neg"));

      if ($n < 0) {
        return $remain ["++"] ($fill);
      }

      return $fill ["++"] ($remain);
    });

    builder.addMethod("powerset", function() {
      var raw = this._;
      var arrSize, powersize;
      var result, elemArr, mod, i, j;

      arrSize   = this.size().__int__();
      powersize = Math.pow(2, arrSize);

      result = [];
      for (i = 0; i < powersize; ++i) {
        elemArr = [];
        for (j = 0; j < arrSize; ++j) {
          mod = Math.pow(2, j);
          if (((i / mod)|0) % 2) {
            elemArr.push(raw[j]);
          }
        }
        result[i] = $.Array(elemArr);
      }

      return $.Array(result);
    });

    // TODO: implements source

    builder.addMethod("asUGenInput", function($for) {
      return this.collect($.Func(function($_) {
        return $_.asUGenInput($for);
      }));
    });

    builder.addMethod("asAudioRateInput", function($for) {
      return this.collect($.Func(function($_) {
        return $_.asAudioRateInput($for);
      }));
    });

    builder.addMethod("asControlInput", function() {
      return this.collect($.Func(function($_) {
        return $_.asControlInput();
      }));
    });

    builder.addMethod("isValidUGenInput", sc.TRUE);

    builder.addMethod("numChannels", function() {
      return this.size();
    });

    // TODO: implements poll
    // TODO: implements dpoll
    // TODO: implements evnAt
    // TODO: implements atIdentityHash
    // TODO: implements atIdentityHashInPairs
    // TODO: implements asSpec
    // TODO: implements fork

    builder.addMethod("madd", {
      args: "mul=1.0; add=0.0"
    }, function($mul, $add) {
      return $("MulAdd").new(this, $mul, $add);
    });
    // TODO: implements asRawOSC
    // TODO: implements printOn
    // TODO: implements storeOn
  });
});

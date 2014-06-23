(function(sc) {
  "use strict";

  require("./define");
  require("../bytecode");

  var $ = sc.lang.$;
  var define = sc.lang.klass.define;

  var SCNil = define("Nil", {
    __tag: sc.TAG_NIL
  });

  var SCSymbol = define("Symbol", {
    __tag: sc.TAG_SYM
  });

  define("Boolean", {
    __tag: sc.TAG_BOOL
  });

  var SCTrue  = define("True  : Boolean");
  var SCFalse = define("False : Boolean");

  define("Magnitude");

  var SCChar = define("Char : Magnitude", {
    __tag: sc.TAG_CHAR
  });

  define("Number : Magnitude");
  define("SimpleNumber : Number");

  var SCInteger = define("Integer : SimpleNumber", {
    __tag: sc.TAG_INT
  });

  var SCFloat = define("Float : SimpleNumber", {
    __tag: sc.TAG_FLOAT
  });

  define("Association : Magnitude");
  define("Collection");
  define("SequenceableCollection : Collection");

  define("ArrayedCollection : SequenceableCollection", {
    constructor: function SCArrayedCollection() {
      this.__super__("SequenceableCollection");
      this._ = [];
    }
  });

  define("RawArray : ArrayedCollection");

  var SCArray = define("Array : ArrayedCollection");

  var SCString = define("String : RawArray", {
    __tag: sc.TAG_STR
  });

  define("Set : Collection");
  define("Dictionary : Set");
  define("IdentityDictionary : Dictionary");
  define("Environment : IdentityDictionary");

  define("Event : Environment", {
    constructor: function SCEvent() {
      this.__super__("Environment");
    }
  });

  define("AbstractFunction");

  var SCFunction = define("Function : AbstractFunction", {
    __tag: sc.TAG_FUNC
  });

  define("Stream : AbstractFunction");
  define("Thread : Stream");
  define("Routine : Thread", {
    __tag: sc.TAG_ROUTINE
  });

  var SCRef = define("Ref : AbstractFunction");

  // $
  var $nil = (function() {
    var instance = new SCNil();
    instance._ = null;
    return instance;
  })();
  var $true = (function() {
    var instance = new SCTrue();
    instance._ = true;
    return instance;
  })();
  var $false = (function() {
    var instance = new SCFalse();
    instance._ = false;
    return instance;
  })();
  var $integers = {};
  var $floats   = {};
  var $symbols  = {};
  var $chars    = {};

  $.Nil = function() {
    return $nil;
  };

  $.Boolean = function(value) {
    return value ? $true : $false;
  };

  $.True = function() {
    return $true;
  };

  $.False = function() {
    return $false;
  };

  $.Integer = function(value) {
    var instance;

    if (!global.isFinite(value)) {
      return $.Float(+value);
    }

    value = value|0;

    if (!$integers.hasOwnProperty(value)) {
      instance = new SCInteger();
      instance._ = value;
      $integers[value] = instance;
    }

    return $integers[value];
  };

  $.Float = function(value) {
    var instance;

    value = +value;

    if (!$floats.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._ = value;
      $floats[value] = instance;
    }

    return $floats[value];
  };

  $.Symbol = function(value) {
    var instance;
    value = String(value);
    if (!$symbols.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._ = value;
      $symbols[value] = instance;
    }
    return $symbols[value];
  };

  $.Char = function(value) {
    var instance;

    value = String(value).charAt(0);

    if (!$chars.hasOwnProperty(value)) {
      instance = new SCChar();
      instance._ = value;
      $chars[value] = instance;
    }

    return $chars[value];
  };

  $.Array = function(value, immutable) {
    var instance = new SCArray();
    instance._ = value || [];
    instance.__immutable = !!immutable;
    return instance;
  };

  $.String = function(value, mutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($.Char);
    instance.__immutable = !mutable;
    return instance;
  };

  $.Event = function(value) {
    var instance, i, imax, j;
    i = imax = j = value;
    instance = $("Event").new();
    for (i = j = 0, imax = value.length >> 1; i < imax; ++i) {
      instance.put(value[j++], value[j++]);
    }
    return instance;
  };

  $.Function = function(value, def) {
    var instance = new SCFunction();
    instance._bytecode = sc.lang.bytecode.create(value, def).setOwner(instance);
    return instance;
  };

  $.Func = function(func) {
    return $.Function(function() {
      return [ func ];
    });
  };

  $.Ref = function(value) {
    var instance = new SCRef();
    instance._$value = value;
    return instance;
  };

  $.nil = $nil;
  $.true = $true;
  $.false = $false;
  $.int0 = $.Integer(0);
  $.int1 = $.Integer(1);
})(sc);

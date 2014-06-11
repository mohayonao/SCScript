(function(sc) {
  "use strict";

  require("./klass");
  require("../fn");

  var $     = sc.lang.$;
  var fn    = sc.lang.fn;
  var klass = sc.lang.klass;

  var $nil, $true, $false;
  var $symbols, $chars, $integers, $floats;

  function SCNil() {
    this.__super__("Object");
    this._ = null;
  }
  klass.define("Nil", {
    constructor: SCNil,
    __tag: sc.C.TAG_NIL
  });

  function SCSymbol() {
    this.__super__("Object");
    this._ = "";
  }
  klass.define("Symbol", {
    constructor: SCSymbol,
    __tag: sc.C.TAG_SYM
  });

  function SCBoolean() {
    this.__super__("Object");
  }
  klass.define("Boolean", {
    constructor: SCBoolean
  });

  function SCTrue() {
    this.__super__("Boolean");
    this._ = true;
  }
  klass.define("True : Boolean", {
    constructor: SCTrue,
    __tag: sc.C.TAG_TRUE
  });

  function SCFalse() {
    this.__super__("Boolean");
    this._ = false;
  }
  klass.define("False : Boolean", {
    constructor: SCFalse,
    __tag: sc.C.TAG_FALSE
  });

  klass.define("Magnitude", {
    constructor: function SCMagnitude() {
      this.__super__("Object");
    }
  });

  function SCChar() {
    this.__super__("Magnitude");
    this._ = "\0";
  }
  klass.define("Char : Magnitude", {
    constructor: SCChar,
    __tag: sc.C.TAG_CHAR
  });

  klass.define("Number : Magnitude", {
    constructor: function SCNumber() {
      this.__super__("Magnitude");
    }
  });

  klass.define("SimpleNumber : Number", {
    constructor: function SCSimpleNumber() {
      this.__super__("Number");
    }
  });

  function SCInteger() {
    this.__super__("SimpleNumber");
    this._ = 0;
  }
  klass.define("Integer : SimpleNumber", {
    constructor: SCInteger,
    __tag: sc.C.TAG_INT
  });

  function SCFloat() {
    this.__super__("SimpleNumber");
    this._ = 0.0;
  }
  klass.define("Float : SimpleNumber", {
    constructor: SCFloat,
    __tag: sc.C.TAG_FLOAT
  });

  klass.define("Collection", {
    constructor: function SCCollection() {
      this.__super__("Object");
    }
  });

  klass.define("SequenceableCollection : Collection", {
    constructor: function SCSequenceableCollection() {
      this.__super__("Collection");
    }
  });

  klass.define("ArrayedCollection : SequenceableCollection", {
    constructor: function SCArrayedCollection() {
      this.__super__("SequenceableCollection");
      this.__immutable = false;
      this._ = [];
    }
  });

  klass.define("RawArray : ArrayedCollection", {
    constructor: function SCRawArray() {
      this.__super__("ArrayedCollection");
    }
  });

  function SCArray() {
    this.__super__("ArrayedCollection");
  }
  klass.define("Array : ArrayedCollection", {
    constructor: SCArray,
    __tag: sc.C.TAG_ARRAY
  });

  function SCString() {
    this.__super__("RawArray");
  }
  klass.define("String : RawArray", {
    constructor: SCString,
    __tag: sc.C.TAG_STR
  });

  klass.define("Set : Collection", {
    constructor: function SCSet() {
      this.__super__("Collection");
    }
  });

  klass.define("Dictionary : Set", {
    constructor: function SCDictionary() {
      this.__super__("Set");
    }
  });

  klass.define("IdentityDictionary : Dictionary", {
    constructor: function SCIdentityDictionary() {
      this.__super__("Dictionary");
    }
  });

  klass.define("Environment : IdentityDictionary", {
    constructor: function SCEnvironment() {
      this.__super__("IdentityDictionary");
    }
  });

  klass.define("Event : Environment", {
    constructor: function SCEvent() {
      this.__super__("Environment");
    }
  });

  klass.define("AbstractFunction", {
    constructor: function SCAbstractFunction() {
      this.__super__("Object");
    }
  });

  function SCFunction() {
    this.__super__("AbstractFunction");
    /* istanbul ignore next */
    this._ = function() {};
  }
  klass.define("Function : AbstractFunction", {
    constructor: SCFunction,
    __tag: sc.C.TAG_FUNCTION
  });

  function SCRef() {
    this.__super__("Object");
  }
  klass.define("Ref : AbstractFunction", {
    constructor: SCRef
  });

  // $
  $nil      = new SCNil();
  $true     = new SCTrue();
  $false    = new SCFalse();
  $integers = {};
  $floats   = {};
  $symbols  = {};
  $chars    = {};

  $.Nil = function() {
    return $nil;
  };

  $.Boolean = function($value) {
    return $value ? $true : $false;
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
    var func = value(); // TODO: fix later
    if (func.length === 0) {
      func[0] = function() {
        return $.Nil();
      };
    }
    func = func[0];
    instance._ = def ? fn(func, def) : func;
    return instance;
  };

  $.Ref = function(value) {
    var instance = new SCRef();
    instance._$value = value;
    return instance;
  };

})(sc);

(function(sc) {
  "use strict";

  require("./klass");
  require("../fn");

  var $SC    = sc.lang.$SC;
  var fn     = sc.lang.fn;
  var klass  = sc.lang.klass;

  var $nil, $true, $false;
  var $symbols, $chars, $integers, $floats;

  function SCProcess() {
    this.__initializeWith__("Object");
    this._$interpreter = $nil;
    this._$mainThread  = $nil; // ???
  }
  klass.define(SCProcess, "Process");

  function SCInterpreter() {
    this.__initializeWith__("Object");
    for (var i = 97; i <= 122; i++) {
      this["_$" + String.fromCharCode(i)] = $nil;
    }
    // this._$s = $SC("Server").default(); // in SCMain
  }
  klass.define(SCInterpreter, "Interpreter");

  function SCNil() {
    this.__initializeWith__("Object");
    this._ = null;
  }
  klass.define(SCNil, "Nil", {
    __tag: sc.C.TAG_NIL
  });

  function SCSymbol() {
    this.__initializeWith__("Object");
    this._ = "";
  }
  klass.define(SCSymbol, "Symbol", {
    __tag: sc.C.TAG_SYM
  });

  function SCBoolean() {
    this.__initializeWith__("Object");
  }
  klass.define(SCBoolean, "Boolean");

  function SCTrue() {
    this.__initializeWith__("Boolean");
    this._ = true;
  }
  klass.define(SCTrue, "True : Boolean", {
    __tag: sc.C.TAG_TRUE
  });

  function SCFalse() {
    this.__initializeWith__("Boolean");
    this._ = false;
  }
  klass.define(SCFalse, "False : Boolean", {
    __tag: sc.C.TAG_FALSE
  });

  function SCMagnitude() {
    this.__initializeWith__("Object");
  }
  klass.define(SCMagnitude, "Magnitude");

  function SCChar() {
    this.__initializeWith__("Magnitude");
    this._ = "\0";
  }
  klass.define(SCChar, "Char : Magnitude", {
    __tag: sc.C.TAG_CHAR
  });

  function SCNumber() {
    this.__initializeWith__("Magnitude");
  }
  klass.define(SCNumber, "Number : Magnitude");

  function SCSimpleNumber() {
    this.__initializeWith__("Number");
  }
  klass.define(SCSimpleNumber, "SimpleNumber : Number");

  function SCInteger() {
    this.__initializeWith__("SimpleNumber");
    this._ = 0;
  }
  klass.define(SCInteger, "Integer : SimpleNumber", {
    __tag: sc.C.TAG_INT
  });

  function SCFloat() {
    this.__initializeWith__("SimpleNumber");
    this._ = 0.0;
  }
  klass.define(SCFloat, "Float : SimpleNumber", {
    __tag: sc.C.TAG_FLOAT
  });

  function SCCollection() {
    this.__initializeWith__("Object");
  }
  klass.define(SCCollection, "Collection");

  function SCSequenceableCollection() {
    this.__initializeWith__("Collection");
  }
  klass.define(SCSequenceableCollection, "SequenceableCollection : Collection");

  function SCArrayedCollection() {
    this.__initializeWith__("SequenceableCollection");
    this.__immutable = false;
    this._ = [];
  }
  klass.define(SCArrayedCollection, "ArrayedCollection : SequenceableCollection");

  function SCRawArray() {
    this.__initializeWith__("ArrayedCollection");
  }
  klass.define(SCRawArray, "RawArray : ArrayedCollection");

  function SCArray() {
    this.__initializeWith__("ArrayedCollection");
  }
  klass.define(SCArray, "Array : ArrayedCollection", {
    __tag: sc.C.TAG_ARRAY
  });

  function SCString() {
    this.__initializeWith__("RawArray");
  }
  klass.define(SCString, "String : RawArray", {
    __tag: sc.C.TAG_STR
  });

  function SCAbstractFunction() {
    this.__initializeWith__("Object");
  }
  klass.define(SCAbstractFunction, "AbstractFunction");

  function SCFunction() {
    this.__initializeWith__("AbstractFunction");
    // istanbul ignore next
    this._ = function() {};
  }
  klass.define(SCFunction, "Function : AbstractFunction", {
    __tag: sc.C.TAG_FUNCTION
  });

  function SCRef(args) {
    this.__initializeWith__("Object");
    this._value = args[0] || /* istanbul ignore next */ $nil;
  }
  sc.lang.klass.define(SCRef, "Ref : AbstractFunction");

  function SCStream() {
    this.__initializeWith__("AbstractFunction");
  }
  sc.lang.klass.define(SCStream, "Stream : AbstractFunction");

  function SCThread() {
    this.__initializeWith__("Stream");
    if (this._init) {
      this._init();
    }
  }
  sc.lang.klass.define(SCThread, "Thread : Stream");

  function SCRoutine() {
    this.__initializeWith__("Thread");
  }
  sc.lang.klass.define(SCRoutine, "Routine : Thread");

  // $SC
  $nil      = new SCNil();
  $true     = new SCTrue();
  $false    = new SCFalse();
  $integers = {};
  $floats   = {};
  $symbols  = {};
  $chars    = {};

  $SC.Nil = function() {
    return $nil;
  };

  $SC.Boolean = function($value) {
    return $value ? $true : $false;
  };

  $SC.True = function() {
    return $true;
  };

  $SC.False = function() {
    return $false;
  };

  $SC.Integer = function(value) {
    var instance;

    if (!global.isFinite(value)) {
      return $SC.Float(+value);
    }

    value = value|0;

    if (!$integers.hasOwnProperty(value)) {
      instance = new SCInteger();
      instance._ = value;
      $integers[value] = instance;
    }

    return $integers[value];
  };

  $SC.Float = function(value) {
    var instance;

    value = +value;

    if (!$floats.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._ = value;
      $floats[value] = instance;
    }

    return $floats[value];
  };

  $SC.Symbol = function(value) {
    var instance;
    if (!$symbols.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._ = value;
      $symbols[value] = instance;
    }
    return $symbols[value];
  };

  $SC.Char = function(value) {
    var instance;

    value = String(value).charAt(0);

    if (!$chars.hasOwnProperty(value)) {
      instance = new SCChar();
      instance._ = value;
      $chars[value] = instance;
    }

    return $chars[value];
  };


  $SC.Array = function(value, immutable) {
    var instance = new SCArray();
    instance._ = value || [];
    instance.__immutable = !!immutable;
    return instance;
  };

  $SC.String = function(value, mutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($SC.Char);
    instance.__immutable = !mutable;
    return instance;
  };

  $SC.Function = function(value, def) {
    var instance = new SCFunction();
    instance._ = def ? fn(value, def) : value;
    return instance;
  };

  $SC.Ref = function(value) {
    return new SCRef([ value ]);
  };

})(sc);

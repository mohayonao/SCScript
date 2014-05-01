(function(sc) {
  "use strict";

  require("./sc");
  require("./klass");
  require("./dollarSC");

  var $SC = sc.lang.$SC;
  var klass = sc.lang.klass;

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
    this._immutable = false;
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

  function SCString(value) {
    this.__initializeWith__("RawArray");
    this._ = value;
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

  // $SC
  var $nil      = new SCNil();
  var $true     = new SCTrue();
  var $false    = new SCFalse();
  var $integers = {};
  var $floats   = {};
  var $symbols  = {};
  var $chars    = {};

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
    instance._immutable = !!immutable;
    return instance;
  };

  $SC.String = function(value, immutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($SC.Char);
    instance._immutable = !!immutable;
    return instance;
  };

  $SC.Function = function(value) {
    var instance = new SCFunction();
    instance._ = value;
    return instance;
  };

})(sc);

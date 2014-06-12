(function(sc) {
  "use strict";

  require("./dollar");
  require("./fn");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  var bytecode = { current: null };

  function Bytecode(initializer, def) {
    this._initializer = initializer;
    this._def   = def;
    this._code  = [];
    this._vals  = [];
    this._state = sc.C.STATE_INIT;
    this._iter  = null;
    this._pushed = false;
    this._parent = null;
    this._child  = null;
    this.init(initializer);
  }

  Bytecode.prototype.init = function() {
    var code = this._initializer();
    if (this._def && code.length) {
      code[0] = fn(code[0], this._def);
      this._argNames = code[0]._argNames;
      this._argVals  = code[0]._argVals;
    } else {
      this._argNames = [];
      this._argVals  = [];
    }
    this._code  = code;
    this._index = 0;

    return this;
  };

  Bytecode.prototype.setIterator = function(iter) {
    this._iter = iter;
    return this;
  };

  Bytecode.prototype.resume = function(args) {
    var result;
    var code, length, index, iter;

    if (this._child) {
      return this._child.resume(args);
    }

    if (bytecode.current && !this._parent) {
      this._parent = bytecode.current;
      this._parent._child = this;
      this._parent._state = sc.C.STATE_SUSPENDED;
    }

    code   = this._code;
    length = code.length;
    index  = this._index;
    iter   = this._iter;

    bytecode.current = this;

    this._state = sc.C.STATE_RUNNING;
    while (index < length) {
      if (iter) {
        args = iter.next();
        if (args === null) {
          this._state = sc.C.STATE_DONE;
          break;
        }
      }

      result = code[index].apply(this, args);

      if (!iter) {
        index += 1;
        if (index === length) {
          this._state = sc.C.STATE_DONE;
        }
      }

      if (this._state !== sc.C.STATE_RUNNING) {
        break;
      }
    }
    result = result || /* istanbul ignore next */ $.Nil();

    bytecode.current = null;

    if (this._state === sc.C.STATE_DONE) {
      this._index = 0;
      this._state = sc.C.STATE_DONE;
      this._iter  = null;
      if (this._parent) {
        if (this._parent._pushed) {
          this._parent.put(result, true);
        }
        this._parent._child = null;
        this._parent._state = sc.C.STATE_RUNNING;
      }
      this._parent = null;
    } else {
      this._index = index;
    }

    return result;
  };

  Bytecode.prototype.push = function($value) {
    this._vals.push($value);
    this._pushed = true;
    return $value;
  };

  Bytecode.prototype.shift = function() {
    this._pushed = false;
    return this._vals.shift();
  };

  Bytecode.prototype.put = function($value) {
    this._vals[this._vals.length - 1] = $value;
  };

  Bytecode.prototype.break = function() {
    this._state = sc.C.STATE_DONE;
  };

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  bytecode.yield = function() {
    var that = bytecode.current;

    that._state = sc.C.STATE_SUSPENDED;
  };

  sc.lang.bytecode = bytecode;

})(sc);

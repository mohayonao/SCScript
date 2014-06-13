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
    this._code   = code;
    this._length = code.length;
    return this.reset();
  };

  Bytecode.prototype.reset = function() {
    this._state    = this._length ? sc.C.STATE_INIT : sc.C.STATE_DONE;
    this._index    = 0;
    this._iter     = null;
    this._yield    = null;
    this._yielded  = false;
    this._pushed   = false;
    this._parent   = null;
    this._child    = null;
    this._stopIter = false;
    return this;
  };

  Bytecode.prototype.setIterator = function(iter) {
    this._iter = iter;
    return this;
  };

  Bytecode.prototype.setParent = function(parent) {
    this._parent = parent;
    parent._child = this;
  };

  Bytecode.prototype.resume = function(args) {
    var result;
    var code, length, iter;

    if (this._child) {
      return this._child.resume(args);
    }

    if (bytecode.current) {
      this.setParent(bytecode.current);
    }

    code   = this._code;
    length = this._length;
    iter   = this._iter;

    bytecode.current = this;

    while (this._index < length) {
      if (iter && this._index === 0) {
        this.stopIter(false);
        args = iter.next();
        if (args === null) {
          this._state = sc.C.STATE_PENDING;
          break;
        }
      }
      if (iter && !iter.hasNext) {
        iter = null;
      }

      this._yield = null;
      this._state = sc.C.STATE_RUNNING;
      result = code[this._index].apply(this, args);
      if (this._yielded) {
        result = this._yield;
      }

      this._index += 1;
      if (this._index >= length) {
        if (!iter) {
          this._state = sc.C.STATE_PENDING;
        } else {
          this._index = 0;
        }
      }

      if (this._state !== sc.C.STATE_RUNNING) {
        break;
      }
    }
    result = result || $.Nil();

    bytecode.current = null;

    if (this._state === sc.C.STATE_PENDING) {
      this.next(result);
    }

    return result;
  };

  Bytecode.prototype.next = function($value) {
    if (this._child) {
      this._state = sc.C.STATE_SUSPENDED;
      return;
    }
    if (this._index < this._length) {
      return;
    }
    this._index = 0;
    this._state = sc.C.STATE_DONE;
    if (this._iter) {
      this._iter = this._iter.clone();
      this.stopIter(true);
    }
    if (this._parent) {
      if (this._parent._pushed) {
        this._parent.put($value);
      }
      this._parent._child = null;
      this._parent.next($value);
    }
    this._parent = null;
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
    this._state = sc.C.STATE_LOOP_BREAK;
    this._index = Infinity;
  };

  Bytecode.prototype.yield = function($value) {
    this._state = sc.C.STATE_SUSPENDED;
    this._yield   = $value;
    this._yielded = true;
    if (this._parent) {
      this._parent.yield($value);
    }
  };

  Bytecode.prototype.state = function() {
    return this._state;
  };

  Bytecode.prototype.stopIter = function(value) {
    if (typeof value === "boolean") {
      this._stopIter = value;
      if (this._parent) {
        this._parent.stopIter(value);
      }
    }
    return this._stopIter;
  };

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  bytecode.yield = function($value) {
    bytecode.current.yield($value);
  };

  sc.lang.bytecode = bytecode;

})(sc);

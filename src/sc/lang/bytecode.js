(function(sc) {
  "use strict";

  require("./lang");
  require("./dollar");
  require("./fn");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var current = null;

  function insideOfARoutine() {
    return sc.lang.main.getCurrentThread().__tag === sc.TAG_ROUTINE;
  }

  function Bytecode(initializer, def) {
    this._initializer = initializer;
    this._def  = def;
    this._code = [];
    this._vals = [];
    this._$owner = null;
    this._init(initializer);
  }

  Bytecode.prototype._init = function() {
    var code = this._initializer();
    if (this._def && code[0]) {
      code[0] = fn(code[0], this._def);
      this._argNames = code[0]._argNames;
      this._argVals  = code[0]._argVals;
    } else {
      this._argNames = [];
      this._argVals  = [];
    }
    if (code.length > 1) {
      this._freeFunc = code.pop();
    }
    this._code   = code;
    this._length = code.length;
    return this.reset();
  };

  Bytecode.prototype.reset = function() {
    this.state   = sc.STATE_INIT;
    this.result  = null;
    this._index  = 0;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this;
  };

  Bytecode.prototype.free = function() {
    if (this._freeFunc) {
      this._freeFunc();
    }
    return this;
  };

  Bytecode.prototype.setOwner = function($owner) {
    this._$owner = $owner;
    return this;
  };

  Bytecode.prototype.setIterator = function(iter) {
    this._iter = iter;
    return this;
  };

  Bytecode.prototype.setParent = function(parent) {
    if (parent && parent !== this) {
      this._parent  = parent;
      parent._child = this;
    }
  };

  Bytecode.prototype.run = function(args) {
    if (insideOfARoutine()) {
      return this.runAsRoutine(args);
    } else if (this._iter) {
      return this.runAsFunctionWithIter();
    } else {
      return this.runAsFunction(args);
    }
  };

  Bytecode.prototype.runAsFunction = function(args) {
    var result;
    var i, code, length;

    code   = this._code;
    length = this._length;

    this._parent = current;

    current = this;
    this.state = sc.STATE_RUNNING;

    for (i = 0; i < length; ++i) {
      result = this.update(code[i].apply(this, args));
      if (this.state === sc.STATE_BREAK) {
        this._iter = null;
        break;
      }
    }
    if (this._freeFunc) {
      this._freeFunc();
    }

    current = this._parent;
    this._parent = null;

    this.state = sc.STATE_INIT;

    return result || $.Nil();
  };

  Bytecode.prototype.runAsFunctionWithIter = function() {
    var items;

    while (this._iter && (items = this._iter.next()) !== null) {
      this.runAsFunction(items);
    }

    this._iter = null;
  };

  Bytecode.prototype.runAsRoutine = function(args) {
    var result;

    this.setParent(current);

    current = this;

    if (this._child) {
      result = this._child.runAsRoutine(args);
      if (this.state === sc.STATE_RUNNING) {
        result = null;
      }
    }

    if (!result) {
      result = this._runAsRoutine(args);
    }

    current = this._parent;

    this.advance();

    return this.result ? $.Nil() : result;
  };

  Bytecode.prototype._runAsRoutine = function(args) {
    var result;
    var code, length, iter;

    code   = this._code;
    length = this._length;
    iter   = this._iter;

    this.state  = sc.STATE_RUNNING;
    this.result = null;
    while (this._index < length) {
      if (iter && this._index === 0) {
        args = iter.next();
        if (args === null) {
          this.state  = sc.STATE_SUSPENDED;
          this._index = length;
          break;
        }
      }
      if (iter && !iter.hasNext) {
        iter = null;
      }

      result = this.update(code[this._index].apply(this, args));

      this._index += 1;
      if (this._index >= length) {
        if (iter) {
          this._index = 0;
        } else {
          this.state = sc.STATE_SUSPENDED;
        }
      }

      if (this.state !== sc.STATE_RUNNING) {
        break;
      }
    }

    return result;
  };

  Bytecode.prototype.advance = function() {
    if (this.state === sc.STATE_INIT) {
      this.free();
      return;
    }
    if (this._child || this._index < this._length) {
      this.state = sc.STATE_SUSPENDED;
      return;
    }
    if (!this.result) {
      this.state = sc.STATE_DONE;
      this.free();
    }
    if (this._parent) {
      if (this.state === sc.STATE_DONE) {
        this._parent.state = sc.STATE_RUNNING;
      } else {
        this._parent.state = sc.STATE_SUSPENDED;
        this.free();
      }
      this._parent.purge();
    }
  };

  Bytecode.prototype.purge = function() {
    if (this._child) {
      this._child._parent = null;
      this._child = null;
    }
    return this;
  };

  Bytecode.prototype.push = function() {
    this._vals.push(null);
  };

  Bytecode.prototype.shift = function() {
    if (this._vals.length) {
      return this._vals.shift();
    }
    return this._parent.shift();
  };

  Bytecode.prototype.update = function($value) {
    if (this._vals.length) {
      this._vals[this._vals.length - 1] = $value;
    } else if (this._parent) {
      this._parent.update($value);
    }
    return $value;
  };

  Bytecode.prototype.break = function() {
    this.state  = sc.STATE_BREAK;
    this._index = this._length;
    return this;
  };

  Bytecode.prototype.yield = function($value) {
    this.state  = sc.STATE_SUSPENDED;
    this.result = $value;
    if (this._parent && this._$owner.__tag === sc.TAG_FUNC) {
      this._parent.yield($value);
    }
    return this;
  };

  Bytecode.prototype.yieldAndReset = function($value) {
    this.state   = sc.STATE_INIT;
    this.result  = $value;
    if (this._parent && this._$owner.__tag === sc.TAG_FUNC) {
      this._parent.yieldAndReset($value);
    }
    this._index  = 0;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this;
  };

  Bytecode.prototype.alwaysYield = function($value) {
    this.state   = sc.STATE_DONE;
    this.result  = $value;
    if (this._parent && this._$owner.__tag === sc.TAG_FUNC) {
      this._parent.alwaysYield($value);
    }
    this._index  = this._length;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this.free();
  };

  var throwIfOutsideOfRoutine = function() {
    if (!insideOfARoutine()) {
      current = null;
      throw new Error("yield was called outside of a Routine.");
    }
  };

  var bytecode = {};

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  bytecode.yield = function($value) {
    throwIfOutsideOfRoutine();
    return current.yield($value).purge();
  };

  bytecode.alwaysYield = function($value) {
    throwIfOutsideOfRoutine();
    return current.alwaysYield($value);
  };

  bytecode.yieldAndReset = function($value) {
    throwIfOutsideOfRoutine();
    return current.yieldAndReset($value);
  };

  bytecode.setCurrent = function(bytecode) {
    current = bytecode;
  };

  bytecode.getCurrent = function() {
    return current;
  };

  sc.lang.bytecode = bytecode;
})(sc);

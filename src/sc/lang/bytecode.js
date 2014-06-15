(function(sc) {
  "use strict";

  require("./dollar");
  require("./fn");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  var bytecode = { current: null };

  function insideOfARoutine() {
    return sc.lang.main.$currentThread.__tag === sc.TAG_ROUTINE;
  }

  function Bytecode(initializer, def) {
    this._initializer = initializer;
    this._def  = def;
    this._code = [];
    this._vals = [];
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
    this.state   = sc.STATE_INIT;
    this.result  = null;
    this._index  = 0;
    this._iter   = null;
    this._parent = null;
    this._child  = null;
    return this;
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

    this._parent = bytecode.current;

    bytecode.current = this;
    this.state = sc.STATE_RUNNING;

    for (i = 0; i < length; ++i) {
      result = code[i].apply(this, args);
      if (this.state === sc.STATE_BREAK) {
        this._iter = null;
        break;
      }
    }

    bytecode.current = this._parent;
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
    var code, length, iter;
    var skip;

    this.setParent(bytecode.current);

    bytecode.current = this;

    if (this._child) {
      result = this._child.runAsRoutine(args);
      if (this.state === sc.STATE_SUSPENDED) {
        skip = true;
      }
    }

    if (!skip) {
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

        result = code[this._index].apply(this, args);

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
    }

    bytecode.current = this._parent;

    this.advance();

    return this.result ? $.Nil() : result;
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

  Bytecode.prototype.advance = function() {
    if (this._child || this._index < this._length) {
      this.state = sc.STATE_SUSPENDED;
      return;
    }
    if (!this.result) {
      this.state = sc.STATE_DONE;
    }
    if (this._parent) {
      this._parent._child = null;
      if (this.state === sc.STATE_DONE) {
        this._parent.state = sc.STATE_RUNNING;
      } else {
        this._parent.state = sc.STATE_SUSPENDED;
      }
      this._parent = null;
    }
  };

  Bytecode.prototype.push = function($value) {
    this._vals.push($value);
    return $value;
  };

  Bytecode.prototype.shift = function() {
    if (this._vals.length) {
      return this._vals.shift();
    } else {
      return this._parent.shift();
    }
  };

  Bytecode.prototype.break = function() {
    this.state  = sc.STATE_BREAK;
    this._index = this._length;
  };

  Bytecode.prototype.yield = function($value) {
    this.state  = sc.STATE_SUSPENDED;
    this.result = $value;
    if (this._parent) {
      this._parent.yield($value);
    }
  };

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  bytecode.yield = function($value) {
    if (!insideOfARoutine()) {
      bytecode.current = null;
      throw new Error("yield was called outside of a Routine.");
    }
    bytecode.current.yield($value);
  };

  sc.lang.bytecode = bytecode;

})(sc);

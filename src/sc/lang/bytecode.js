(function(sc) {
  "use strict";

  require("./lang");
  require("./dollar");
  require("./fn");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  function Bytecode(initializer, def, localVars) {
    var code = initializer(this);

    this.transduce = fn.compile(def);

    if (code[0]) {
      code[0] = this.transduce.wrap(code[0]);
    }
    if (localVars !== null) {
      this._free = code.pop();
    }

    this.state   = sc.STATE_INIT;
    this.result  = null;
    this.address = 0;
    this.iter    = null;
    this.parent  = null;
    this.child   = null;
    this._code   = code;
    this._length = code.length;
    this._vals = [];
    this._$owner = null;
  }
  Bytecode.current = null;

  Bytecode.prototype.init = function($owner) {
    this._$owner = $owner;
    return this.reset();
  };

  Bytecode.prototype.free = function() {
    if (this._free) {
      this._free();
    }
    return this;
  };

  Bytecode.prototype.ready = function() {
    this.state  = sc.STATE_RUNNING;
    this.result = null;
    return this.purgeChild();
  };

  Bytecode.prototype.reset = function() {
    this.state   = sc.STATE_INIT;
    this.address = 0;
    this.iter    = null;
    this.child   = null;
    return this;
  };

  Bytecode.prototype.break = function() {
    this.state   = sc.STATE_BREAK;
    this.address = this._length;
    return this;
  };

  Bytecode.prototype.suspend = function() {
    this.state = sc.STATE_SUSPENDED;
    return this;
  };

  Bytecode.prototype.loop = function() {
    if (this.iter === null) {
      return this.suspend();
    }
    this.address = 0;
    return this;
  };

  Bytecode.prototype.done = function(state) {
    this.state   = state || sc.STATE_DONE;
    this.address = this._length;
    this.iter    = null;
    this.child   = null;
    return this.free();
  };

  Bytecode.prototype.setIterator = function(iter) {
    this.iter = iter;
    return this;
  };

  Bytecode.prototype.setParent = function(parent) {
    if (parent && parent !== this) {
      this.parent  = parent;
      parent.child = this;
    }
  };

  Bytecode.prototype.run = function(args) {
    if (insideOfARoutine()) {
      return this.runAsRoutine(args);
    } else if (this.iter !== null) {
      return this.runAsFunctionWithIter();
    } else {
      return this.runAsFunction(args);
    }
  };

  Bytecode.prototype.runAsFunction = function(args) {
    var code   = this._code;
    var length = this._length;

    this.parent = Bytecode.current;

    Bytecode.current = this;
    this.state = sc.STATE_RUNNING;

    var result = null;
    for (var i = 0; i < length; ++i) {
      result = this.update(code[i].apply(null, args));
      if (this.state !== sc.STATE_RUNNING) {
        this.iter = null;
        break;
      }
    }
    this.free();

    Bytecode.current = this.parent;
    this.parent = null;

    this.state = sc.STATE_INIT;

    return result || $.Nil();
  };

  Bytecode.prototype.runAsFunctionWithIter = function() {
    var items;

    while (this.iter && (items = this.iter.next()) !== null) {
      this.runAsFunction(items);
    }

    this.iter = null;
  };

  Bytecode.prototype.runAsRoutine = function(args) {
    this.setParent(Bytecode.current);

    Bytecode.current = this;

    var result = null;
    if (this.child) {
      result = this.child.runAsRoutine(args);
      if (this.state === sc.STATE_RUNNING) {
        result = null;
      }
    }

    if (!result) {
      result = this._runAsRoutine(args);
    }

    Bytecode.current = this.parent;

    this.advance();

    return this.result ? $.Nil() : result;
  };

  Bytecode.prototype._runAsRoutine = function(args) {
    var code   = this._code;
    var length = this._length;

    this.ready();

    var result = null;
    while (this.address < length) {
      if (this.iter !== null) {
        if (this.address === 0) {
          args = this.iter.next();
          if (args === null) {
            this.break();
            break;
          }
        }
        if (!this.iter.hasNext) {
          this.iter = null;
        }
      }

      result = this.update(code[this.address].apply(null, args));

      this.address += 1;
      if (this.address >= length) {
        this.loop();
      }

      if (this.state !== sc.STATE_RUNNING) {
        break;
      }
    }

    return result;
  };

  Bytecode.prototype.advance = function() {
    if (this.state === sc.STATE_INIT) {
      return this.free();
    }
    if (this.child !== null || this.address < this._length) {
      return this.suspend();
    }
    if (this.result === null) {
      this.done();
    }
    if (this.parent !== null) {
      if (this.state === sc.STATE_DONE) {
        this.parent.ready();
      } else {
        this.parent.suspend().purgeChild();
        this.done(sc.STATE_SUSPENDED);
      }
    }
  };

  Bytecode.prototype.purgeChild = function() {
    if (this.child !== null) {
      this.child.parent = null;
      this.child = null;
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
    return this.parent.shift();
  };

  Bytecode.prototype.update = function($value) {
    if (this._vals.length) {
      this._vals[this._vals.length - 1] = $value;
    } else if (this.parent) {
      this.parent.update($value);
    }
    return $value;
  };

  Bytecode.prototype.yield = function($value) {
    this.bubble(function(parent) {
      parent.yield($value);
    });
    this.result = $value;
    return this.suspend();
  };

  Bytecode.prototype.yieldAndReset = function($value) {
    this.bubble(function(parent) {
      parent.yieldAndReset($value);
    });
    this.result = $value;
    return this.reset();
  };

  Bytecode.prototype.alwaysYield = function($value) {
    this.bubble(function(parent) {
      parent.alwaysYield($value);
    });
    this.result = $value;
    return this.purgeChild().done();
  };

  Bytecode.prototype.bubble = function(callback) {
    if (this.parent && this._$owner.__tag === sc.TAG_FUNC) {
      callback(this.parent);
    }
  };

  function insideOfARoutine() {
    return sc.lang.main.getCurrentThread().__tag === sc.TAG_ROUTINE;
  }

  function throwIfOutsideOfRoutine() {
    if (!insideOfARoutine()) {
      Bytecode.current = null;
      throw new Error("yield was called outside of a Routine.");
    }
  }

  sc.lang.bytecode = {
    create: function(initializer, def, length, localVars) {
      return new Bytecode(initializer, def, length, localVars);
    },
    yield: function($value) {
      throwIfOutsideOfRoutine();
      return Bytecode.current.yield($value).purgeChild();
    },
    alwaysYield: function($value) {
      throwIfOutsideOfRoutine();
      return Bytecode.current.alwaysYield($value);
    },
    yieldAndReset: function($value) {
      throwIfOutsideOfRoutine();
      return Bytecode.current.yieldAndReset($value);
    },
    setCurrent: function(bytecode) {
      Bytecode.current = bytecode;
    },
    getCurrent: function() {
      return Bytecode.current;
    }
  };
})(sc);

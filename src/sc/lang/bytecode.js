(function(sc) {
  "use strict";

  require("./dollar");
  require("./fn");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;

  var bytecode = {};

  function Bytecode(initializer, def) {
    this._initializer = initializer;
    this._def   = def;
    this._code  = [];
    this._break = false;
    this.init(initializer);
  }

  Bytecode.prototype.init = function() {
    var code = this._initializer();
    if (code.length === 0) {
      code[0] = function() {
        return $.Nil();
      };
    }
    if (this._def) {
      code[0] = fn(code[0], this._def);
      this._argNames = code[0]._argNames;
      this._argVals  = code[0]._argVals;
    } else {
      this._argNames = [];
      this._argVals  = [];
    }
    this._code = code;
  };

  Bytecode.prototype.resume = function(args) {
    var result;

    this._break = false;
    result = this._code[0].apply(this, args);

    if (this._break) {
      result = sc.C.LOOP_BREAK;
    }

    return result || /* istanbul ignore next */ $.Nil();
  };

  Bytecode.prototype.__break__ = function() {
    this._break = true;
    return sc.C.LOOP_BREAK;
  };

  bytecode.create = function(initializer, def) {
    return new Bytecode(initializer, def);
  };

  sc.lang.bytecode = bytecode;

})(sc);

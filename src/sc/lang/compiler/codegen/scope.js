(function(sc) {
  "use strict";

  require("../compiler");

  function Scope(codegen) {
    this.stack = [];
    this.codegen = codegen;
  }

  Scope.prototype.add = function(type, id, opts) {
    opts = opts || {};

    var peek = this.stack[this.stack.length - 1];
    var scope, vars, args, declared, stmt, indent;

    scope = opts.scope;
    if (scope) {
      vars = scope.vars;
      args = scope.args;
      declared = scope.declared;
      stmt = scope.stmt;
      indent = scope.indent;
    } else {
      vars = peek.vars;
      args = peek.args;
      declared = peek.declared;
      stmt = peek.stmt;
      indent = peek.indent;
    }

    switch (type) {
    case "var":
      if (!vars[id]) {
        this.added(stmt, id, indent, peek, opts);
        vars[id] = true;
        delete declared[id];
      }
      break;
    case "arg":
      args[id] = true;
      delete declared[id];
      break;
    }
  };

  Scope.prototype.added = function(stmt, id, indent, peek, opts) {
    if (stmt.vars.length === 0) {
      this._addNewVariableStatement(stmt, id, indent);
    } else {
      this._appendVariable(stmt, id);
    }
    if (opts.scope) {
      peek.declared[id] = true;
    }
  };

  Scope.prototype.begin = function(stream, args) {
    var declared = this.getDeclaredVariable();
    var stmt = { head: [], vars: [], tail: [] };
    var i, imax;

    this.stack.push({
      vars: {},
      args: {},
      declared: declared,
      indent: this.codegen.base,
      stmt: stmt
    });

    for (i = 0, imax = args.length; i < imax; i++) {
      this.add("arg", args[i]);
    }

    stream.push(stmt.head, stmt.vars, stmt.tail);
  };

  Scope.prototype.end = function() {
    this.stack.pop();
  };

  Scope.prototype.getDeclaredVariable = function() {
    var peek = this.stack[this.stack.length - 1];
    var declared = {};

    if (peek) {
      Array.prototype.concat.apply([], [
        peek.declared, peek.args, peek.vars
      ].map(Object.keys)).forEach(function(key) {
        declared[key] = true;
      });
    }

    return declared;
  };

  Scope.prototype.find = function(id) {
    var peek = this.stack[this.stack.length - 1];
    return peek.vars[id] || peek.args[id] || peek.declared[id];
  };

  Scope.prototype.peek = function() {
    return this.stack[this.stack.length - 1];
  };

  Scope.prototype.useTemporaryVariable = function(func) {
    var result;
    var tempVarId = (this._tempVarId | 0);
    var tempName  = "_ref" + tempVarId;

    this.add("var", tempName, { init: false });

    this._tempVarId = tempVarId + 1;
    result = func.call(this.codegen, tempName);
    this._tempVarId = Math.max(0, tempVarId);

    return result;
  };

  Scope.prototype._addNewVariableStatement = function(stmt, id, indent) {
    stmt.head.push(indent, "var ");
    stmt.vars.push($id(id));
    stmt.tail.push(";", "\n");
  };

  Scope.prototype._appendVariable = function(stmt, id) {
    stmt.vars.push(", ", $id(id));
  };

  var $id = function(id) {
    var ch = id.charAt(0);

    if (ch !== "_" && ch !== "$") {
      id = "$" + id;
    }

    return id;
  };

  sc.lang.compiler.Scope = Scope;
})(sc);

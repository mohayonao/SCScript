(function(sc) {
  "use strict";

  require("./compiler");

  var Message = sc.lang.compiler.Message;

  function Scope(methods) {
    var f = function(parent) {
      this.parent = parent;
      this.stack  = [];
    };

    function F() {}
    F.prototype = Scope;
    f.prototype = new F();

    Object.keys(methods).forEach(function(key) {
      f.prototype[key] = methods[key];
    });

    return f;
  }

  Scope.add = function(type, id, opts) {
    var peek = this.stack[this.stack.length - 1];
    var scope, vars, args, declared, stmt, indent;

    opts = opts || {};

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

    if (args[id]) {
      this.parent.throwError({}, Message.ArgumentAlreadyDeclared, id);
    }

    if (vars[id] && id.charAt(0) !== "_") {
      this.parent.throwError({}, Message.VariableAlreadyDeclared, id);
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

  Scope.added = function() {
  };

  Scope.end = function() {
    this.stack.pop();
  };

  Scope.getDeclaredVariable = function() {
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

  Scope.find = function(id) {
    var peek = this.stack[this.stack.length - 1];
    return peek.vars[id] || peek.args[id] || peek.declared[id];
  };

  Scope.peek = function() {
    return this.stack[this.stack.length - 1];
  };

  sc.lang.compiler.scope = Scope;
})(sc);

(function(sc) {
  "use strict";

  require("./compiler");

  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  function Scope(error) {
    this.stack = [];
    this.error = error || function() {};
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

    if (args[id]) {
      this.error(strlib.format(Message.ArgumentAlreadyDeclared, id));
    }

    if (vars[id] && id.charAt(0) !== "_") {
      this.error(strlib.format(Message.ArgumentAlreadyDeclared, id));
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

  Scope.prototype.added = function() {};

  Scope.prototype.begin = function() {
    var declared = this.getDeclaredVariable();
    this.stack.push({
      vars: {},
      args: {},
      declared: declared
    });
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

  sc.lang.compiler.Scope = Scope;
})(sc);

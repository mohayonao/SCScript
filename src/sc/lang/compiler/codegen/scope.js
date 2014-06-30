(function(sc) {
  "use strict";

  require("../compiler");

  function Scope(codegen) {
    this.codegen = codegen;
    this.stack = [];
    this.tempVarId = 0;
    this.begin();
  }

  var delegate = {
    var: function addToVariable(scope, name) {
      if (!scope.vars[name]) {
        addVariableToStatement(scope, name);
      }
      scope.vars[name] = true;
    },
    arg: function addToArguments(scope, name) {
      scope.args[name] = true;
    }
  };

  Scope.prototype.add = function(type, name, scope) {
    delegate[type](scope || this.peek(), name);
    return this;
  };

  Scope.prototype.begin = function() {
    this.stack.unshift({
      vars: {},
      args: {},
      indent: "",
      stmt: { head: [], vars: [], tail: [] }
    });
    return this;
  };

  Scope.prototype.end = function() {
    this.stack.shift();
    return this;
  };

  Scope.prototype.toVariableStatement = function() {
    var stmt = this.peek().stmt;
    return [ stmt.head, stmt.vars, stmt.tail ];
  };

  Scope.prototype.setIndent = function(indent) {
    this.peek().indent = indent;
    return this;
  };

  Scope.prototype.peek = function() {
    return this.stack[0];
  };

  Scope.prototype.find = function(name) {
    return this.stack.some(function(scope) {
      return scope.vars[name] || scope.args[name];
    });
  };

  Scope.prototype.useTemporaryVariable = function(func) {
    var result;
    var tempName = "_ref" + this.tempVarId;

    this.add("var", tempName);

    this.tempVarId += 1;
    result = func.call(this.codegen, tempName);
    this.tempVarId -= 1;

    return result;
  };

  function addVariableToStatement(scope, name) {
    var stmt = scope.stmt;
    if (stmt.vars.length) {
      stmt.vars.push(", ");
    } else {
      stmt.head.push(scope.indent, "var ");
      stmt.tail.push(";\n");
    }
    stmt.vars.push(name.replace(/^(?![_$])/, "$"));
  }

  sc.lang.compiler.Scope = Scope;
})(sc);

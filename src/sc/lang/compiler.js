(function(sc) {
  "use strict";

  require("./sc");

  var compiler = {};

  compiler.Token = {
    CharLiteral: "Char",
    EOF: "<EOF>",
    FalseLiteral: "False",
    FloatLiteral: "Float",
    Identifier: "Identifier",
    IntegerLiteral: "Integer",
    Keyword: "Keyword",
    Label: "Label",
    NilLiteral: "Nil",
    Punctuator: "Punctuator",
    StringLiteral: "String",
    SymbolLiteral: "Symbol",
    TrueLiteral: "True"
  };

  compiler.Syntax = {
    AssignmentExpression: "AssignmentExpression",
    BinaryExpression: "BinaryExpression",
    BlockExpression: "BlockExpression",
    CallExpression: "CallExpression",
    FunctionExpression: "FunctionExpression",
    GlobalExpression: "GlobalExpression",
    Identifier: "Identifier",
    ListExpression: "ListExpression",
    Label: "Label",
    Literal: "Literal",
    ObjectExpression: "ObjectExpression",
    Program: "Program",
    ThisExpression: "ThisExpression",
    UnaryExpression: "UnaryExpression",
    VariableDeclaration: "VariableDeclaration",
    VariableDeclarator: "VariableDeclarator"
  };

  var Message = compiler.Message = {
    ArgumentAlreadyDeclared: "argument '%0' already declared",
    InvalidLHSInAssignment: "invalid left-hand side in assignment",
    NotImplemented: "not implemented %0",
    UnexpectedEOS: "unexpected end of input",
    UnexpectedIdentifier: "unexpected identifier",
    UnexpectedChar: "unexpected char",
    UnexpectedLabel: "unexpected label",
    UnexpectedNumber: "unexpected number",
    UnexpectedString: "unexpected string",
    UnexpectedSymbol: "unexpected symbol",
    UnexpectedToken: "unexpected token %0",
    VariableAlreadyDeclared: "variable '%0' already declared",
    VariableNotDefined: "variable '%0' not defined"
  };

  compiler.Keywords = {
    var: "keyword",
    arg: "keyword",
    const: "keyword",
    this: "function",
    thisThread: "function",
    thisProcess: "function",
    thisFunction: "function",
    thisFunctionDef: "function",
  };

  var Scope = (function() {
    function Scope() {}

    Scope.prototype.add = function(type, id, scope) {
      var peek = this.stack[this.stack.length - 1];
      var vars, args, declared, stmt, indent;

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
          this.add_delegate(stmt, id, indent, peek, scope);
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

    Scope.prototype.add_delegate = function() {
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

    Scope.inheritWith = function(methods) {
      var f = function(parent) {
        this.parent = parent;
        this.stack  = [];
      };

      function F() {}
      F.prototype = Scope.prototype;
      f.prototype = new F();

      Object.keys(methods).forEach(function(key) {
        f.prototype[key] = methods[key];
      });

      return f;
    };

    return Scope;
  })();

  compiler.Scope = Scope;

  sc.lang.compiler = compiler;

})(sc);

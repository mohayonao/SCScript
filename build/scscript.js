(function(global) {
"use strict";

var sc = { VERSION: "0.0.24" };

// src/sc/sc.js
(function(sc) {

  sc.lang = {};
  sc.lang.$SC = {};
  sc.libs = {};

  function SCScript(fn) {
    return fn(sc.lang.klass.$interpreter, sc.lang.$SC);
  }

  SCScript.install = function(installer) {
    installer(sc);
  };

  // istanbul ignore next
  SCScript.stdout = function(msg) {
    console.log(msg);
  };

  // istanbul ignore next
  SCScript.stderr = function(msg) {
    console.error(msg);
  };

  SCScript.VERSION = sc.VERSION;

  global.SCScript = sc.SCScript = SCScript;

})(sc);

// src/sc/lang/compiler/compiler.js
(function(sc) {

  var compiler = {
    Token: {
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
    },
    Syntax: {
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
    },
    Message: {
      ArgumentAlreadyDeclared: "argument '%0' already declared",
      InvalidLHSInAssignment: "invalid left-hand side in assignment",
      NotImplemented: "not implemented %0",
      UnexpectedEOS: "unexpected end of input",
      UnexpectedIdentifier: "unexpected identifier",
      UnexpectedNumber: "unexpected number",
      UnexpectedLiteral: "unexpected %0",
      UnexpectedToken: "unexpected token %0",
      VariableAlreadyDeclared: "variable '%0' already declared",
      VariableNotDefined: "variable '%0' not defined"
    },
    Keywords: {
      var: "keyword",
      arg: "keyword",
      const: "keyword",
      this: "function",
      thisThread: "function",
      thisProcess: "function",
      thisFunction: "function",
      thisFunctionDef: "function",
    }
  };

  sc.lang.compiler = compiler;

  var SCScript = sc.SCScript;

  SCScript.tokenize = function(source, opts) {
    return new compiler.lexer(source, opts).tokenize();
  };

  SCScript.parse = function(source, opts) {
    return compiler.parser.parse(source, opts);
  };

  SCScript.compile = function(source, opts) {
    return compiler.codegen.compile(SCScript.parse(source, opts), opts);
  };

})(sc);

// src/sc/lang/compiler/scope.js
(function(sc) {

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

  Scope.add = function(type, id, scope) {
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

  Scope.add_delegate = function() {
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

// src/sc/lang/compiler/codegen.js
(function(sc) {

  var codegen = {};
  var Syntax  = sc.lang.compiler.Syntax;
  var Token   = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var SegmentedMethod = {
    idle : true,
    sleep: true,
    wait : true,
    yield: true
  };

  var Scope = sc.lang.compiler.scope({
    add_delegate: function(stmt, id, indent, peek, scope) {
      if (stmt.vars.length === 0) {
        this._addNewVariableStatement(stmt, id, indent);
      } else {
        this._appendVariable(stmt, id);
      }
      if (scope) {
        peek.declared[id] = true;
      }
    },
    _addNewVariableStatement: function(stmt, id, indent) {
      stmt.head.push(indent, "var ");
      stmt.vars.push($id(id));
      if (id.charAt(0) !== "_") {
        stmt.vars.push(" = $SC.Nil()");
      }
      stmt.tail.push(";", "\n");
    },
    _appendVariable: function(stmt, id) {
      stmt.vars.push(
        ", ", $id(id)
      );
      if (id.charAt(0) !== "_") {
        stmt.vars.push(" = $SC.Nil()");
      }
    },
    begin: function(stream, args) {
      var declared = this.getDeclaredVariable();
      var stmt = { head: [], vars: [], tail: [] };
      var i, imax;

      this.stack.push({
        vars    : {},
        args    : {},
        declared: declared,
        indent  : this.parent.base,
        stmt    : stmt
      });

      for (i = 0, imax = args.length; i < imax; i++) {
        this.add("arg", args[i]);
      }

      stream.push(stmt.head, stmt.vars, stmt.tail);
    },
    begin_ref: function() {
      var refId   = (this._refId | 0);
      var refName = "_ref" + refId;
      this.add("var", refName);
      this._refId = refId + 1;
      return refName;
    },
    end_ref: function() {
      var refId = (this._refId | 0) - 1;
      this._refId = Math.max(0, refId);
    }
  });

  function CodeGen(opts) {
    this.opts = opts || {};
    this.base = "";
    this.state = {
      calledSegmentedMethod: false,
      syncBlockScope: null
    };
    this.scope = new Scope(this);
    if (typeof this.opts.bare === "undefined") {
      this.opts.bare = false;
    }
  }

  CodeGen.prototype.toSourceNodeWhenNeeded = function(generated) {
    if (Array.isArray(generated)) {
      return this.flattenToString(generated);
    }
    return generated;
  };

  CodeGen.prototype.flattenToString = function(list) {
    var i, imax, e, result = "";
    for (i = 0, imax = list.length; i < imax; ++i) {
      e = list[i];
      result += Array.isArray(e) ? this.flattenToString(e) : e;
    }
    return result;
  };

  CodeGen.prototype.addIndent = function(stmt) {
    return [ this.base, stmt ];
  };

  CodeGen.prototype.generate = function(node, opts) {
    var result;

    if (Array.isArray(node)) {
      result = [
        "(", this.stitchWith(node, ", ", function(item) {
          return this.generate(item, opts);
        }), ")"
      ];
    } else if (node && node.type) {
      result = this[node.type](node, opts);
      result = this.toSourceNodeWhenNeeded(result, node);
    } else if (typeof node === "string") {
      result = $id(node);
    } else {
      result = node;
    }

    return result;
  };

  CodeGen.prototype.withFunction = function(args, fn) {
    var result;
    var argItems, base, body;

    argItems = this.stitchWith(args, ", ", function(item) {
      return this.generate(item);
    });

    result = [ "function(", argItems, ") {\n" ];

    base = this.base;
    this.base += "  ";

    this.scope.begin(result, args);

    body = fn.call(this);

    if (body.length) {
      result.push(body);
    } else {
      result.push(this.base, "return $SC.Nil();");
    }

    this.scope.end();

    this.base = base;

    result.push("\n", this.base, "}");

    return result;
  };

  CodeGen.prototype.withIndent = function(fn) {
    var base, result;

    base = this.base;
    this.base += "  ";
    result = fn.call(this);
    this.base = base;

    return result;
  };

  CodeGen.prototype.insertArrayElement = function(elements) {
    var result, items;

    result = [ "[", "]" ];

    if (elements.length) {
      items = this.withIndent(function() {
        return this.stitchWith(elements, "\n", function(item) {
          return [ this.base, this.generate(item), "," ];
        });
      });
      result.splice(1, 0, "\n", items, "\n", this.base);
    }

    return result;
  };

  CodeGen.prototype.insertKeyValueElement = function(keyValues, with_comma) {
    var result = [];

    if (keyValues) {
      if (with_comma) {
        result.push(", ");
      }
      result.push(
        "{ ", this.stitchWith(Object.keys(keyValues), ", ", function(key) {
          return [ key, ": ", this.generate(keyValues[key]) ];
        }), " }"
      );
    }

    return result;
  };

  CodeGen.prototype.stitchWith = function(elements, bond, fn) {
    var result, item;
    var count, i, imax;

    result = [];
    for (i = count = 0, imax = elements.length; i < imax; ++i) {
      if (count) {
        result.push(bond);
      }

      item = fn.call(this, elements[i], i);

      if (typeof item !== "undefined") {
        result.push(item);
        count += 1;
      }
    }

    return result;
  };

  CodeGen.prototype.throwError = function(obj, messageFormat) {
    var args, message;

    args = Array.prototype.slice.call(arguments, 2);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    throw new Error(message);
  };

  CodeGen.prototype.AssignmentExpression = function(node) {
    if (Array.isArray(node.left)) {
      return this._DestructuringAssignment(node);
    }

    return this._SimpleAssignment(node);
  };

  CodeGen.prototype._SimpleAssignment = function(node) {
    var result = [];
    var opts;

    opts = { right: node.right, used: false };

    result.push(this.generate(node.left, opts));

    if (!opts.used) {
      result.push(" " + node.operator + " ", this.generate(opts.right));
    }

    return result;
  };

  CodeGen.prototype._DestructuringAssignment = function(node) {
    var elements = node.left;
    var operator = node.operator;
    var assignments;
    var result;
    var ref;

    ref = this.scope.begin_ref();

    assignments = this.withIndent(function() {
      var result, lastUsedIndex;

      lastUsedIndex = elements.length;

      result = [
        this.stitchWith(elements, ",\n", function(item, i) {
          return this.addIndent(this._Assign(
            item, operator, ref + ".at($SC.Integer(" + i + "))"
          ));
        })
      ];

      if (node.remain) {
        result.push(",\n", this.addIndent(this._Assign(
          node.remain, operator, ref + ".copyToEnd($SC.Integer(" + lastUsedIndex + "))"
        )));
      }

      return result;
    });

    result = [
      "(" + ref + " = ", this.generate(node.right), ",\n",
      assignments , ",\n",
      this.addIndent(ref + ")")
    ];

    this.scope.end_ref();

    return result;
  };

  CodeGen.prototype._Assign = function(left, operator, right) {
    var result = [];
    var opts;

    opts = { right: right, used: false };

    result.push(this.generate(left, opts));

    if (!opts.used) {
      result.push(" " + operator + " ", right);
    }

    return result;
  };

  CodeGen.prototype.BinaryExpression = function(node) {
    var operator = node.operator;

    if (operator === "===" || operator === "!==") {
      return this._EqualityOperator(node);
    }

    return this._BinaryExpression(node);
  };

  CodeGen.prototype._EqualityOperator = function(node) {
    return [
      "$SC.Boolean(",
      this.generate(node.left), " " + node.operator + " ", this.generate(node.right),
      ")"
    ];
  };

  CodeGen.prototype._BinaryExpression = function(node) {
    var result, operator, ch;

    result   = [ this.generate(node.left) ];
    operator = node.operator;

    ch = operator.charCodeAt(0);

    if (0x61 <= ch && ch <= 0x7a) {
      result.push(".", operator);
    } else {
      result.push(" ['", operator, "'] ");
    }

    result.push("(", this.generate(node.right));
    if (node.adverb) {
      result.push(", ", this.generate(node.adverb));
    }
    result.push(")");

    return result;
  };

  CodeGen.prototype.BlockExpression = function(node) {
    var body = this.withFunction([], function() {
      return this._Statements(node.body);
    });

    return [ "(", body, ")()" ];
  };

  CodeGen.prototype.CallExpression = function(node) {
    if (isSegmentedMethod(node)) {
      this.state.calledSegmentedMethod = true;
    }

    if (node.args.expand) {
      return this._ExpandCall(node);
    }

    return this._SimpleCall(node);
  };

  CodeGen.prototype._SimpleCall = function(node) {
    var args;
    var list;
    var hasActualArgument;
    var result;
    var ref;

    list = node.args.list;
    hasActualArgument = !!list.length;

    if (node.stamp === "=") {
      ref = this.scope.begin_ref();
      result = [
        "(" + ref + " = ", this.generate(list[0]), ", ",
        this.generate(node.callee), ".", node.method.name, "(" + ref + "), ",
        ref + ")"
      ];
      this.scope.end_ref();
    } else {
      args = [
        this.stitchWith(list, ", ", function(item) {
          return this.generate(item);
        }),
        this.insertKeyValueElement(node.args.keywords, hasActualArgument)
      ];
      result = [
        this.generate(node.callee), ".", node.method.name, "(", args, ")"
      ];
    }

    return result;
  };

  CodeGen.prototype._ExpandCall = function(node) {
    var result;
    var ref;

    ref = this.scope.begin_ref();

    result = [
      "(" + ref + " = ",
      this.generate(node.callee),
      ", " + ref + "." + node.method.name + ".apply(" + ref + ", ",
      this.insertArrayElement(node.args.list), ".concat(",
      this.generate(node.args.expand), ".asArray()._",
      this.insertKeyValueElement(node.args.keywords, true),
      ")))"
    ];

    this.scope.end_ref();

    return result;
  };

  CodeGen.prototype.GlobalExpression = function(node) {
    return "$SC.Global." + node.id.name;
  };

  CodeGen.prototype.FunctionExpression = function(node) {
    var fn, info;

    info = getInformationOfFunction(node);

    if (!isSegmentedBlock(node)) {
      fn = CodeGen.prototype._SimpleFunction;
    } else {
      fn = CodeGen.prototype._SegmentedFunction;
    }

    return [
      fn.call(this, node, info.args),
      this._FunctionMetadata(info), ")"
    ];
  };

  var format_argument = function(node) {
    switch (node.valueType) {
    case Token.NilLiteral   : return "nil";
    case Token.TrueLiteral  : return "true";
    case Token.FalseLiteral : return "false";
    case Token.CharLiteral  : return "$" + node.value;
    case Token.SymbolLiteral: return "\\" + node.value;
    }
    switch (node.value) {
    case "Infinity" : return "inf";
    case "-Infinity": return "-inf";
    }
    return node.value;
  };

  CodeGen.prototype._FunctionMetadata = function(info) {
    var keys, vals;
    var args, result;

    keys = info.keys;
    vals = info.vals;

    if (keys.length === 0 && !info.remain && !info.closed) {
      return [];
    }

    args = this.stitchWith(keys, "; ", function(item, i) {
      var result = [ keys[i] ];

      if (vals[i]) {
        if (vals[i].type === Syntax.ListExpression) {
          result.push("=[ ", this.stitchWith(vals[i].elements, ", ", function(item) {
            return format_argument(item);
          }), " ]");
        } else {
          result.push("=", format_argument(vals[i]));
        }
      }

      return result;
    });

    result = [ ", '", args ];

    if (info.remain) {
      if (keys.length) {
        result.push("; ");
      }
      result.push("*" + info.remain);
    }
    result.push("'");

    if (info.closed) {
      result.push(", true");
    }

    return result;
  };

  CodeGen.prototype._SimpleFunction = function(node, args) {
    var body;

    body = this.withFunction(args, function() {
      return this._Statements(node.body);
    });

    return [ "$SC.Function(", body ];
  };

  CodeGen.prototype._SegmentedFunction = function(node, args) {
    var fargs, body, assignArguments;

    fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    assignArguments = function(item, i) {
      return "$" + args[i] + " = " + fargs[i];
    };

    body = this.withFunction([], function() {
      var result = [];
      var fragments = [], syncBlockScope;
      var elements = node.body;
      var i, imax;
      var functionBodies;

      for (i = 0, imax = args.length; i < imax; ++i) {
        this.scope.add("var", args[i]);
      }

      syncBlockScope = this.state.syncBlockScope;
      this.state.syncBlockScope = this.scope.peek();

      functionBodies = this.withIndent(function() {
        var fragments = [];
        var i = 0, imax = elements.length;
        var lastIndex = imax - 1;

        fragments.push("\n");

        var loop = function() {
          var fragments = [];
          var stmt;
          var count = 0;

          while (i < imax) {
            if (i === 0) {
              if (args.length) {
                stmt = this.stitchWith(args, "; ", assignArguments);
                fragments.push([ this.addIndent(stmt), ";", "\n" ]);
              }
            } else if (count) {
              fragments.push("\n");
            }

            this.state.calledSegmentedMethod = false;
            stmt = this.generate(elements[i]);

            if (stmt.length) {
              if (i === lastIndex || this.state.calledSegmentedMethod) {
                stmt = [ "return ", stmt ];
              }
              fragments.push([ this.addIndent(stmt), ";" ]);
              count += 1;
            }

            i += 1;
            if (this.state.calledSegmentedMethod) {
              break;
            }
          }

          return fragments;
        };

        while (i < imax) {
          if (i) {
            fragments.push(",", "\n", this.addIndent(this.withFunction([], loop)));
          } else {
            fragments.push(this.addIndent(this.withFunction(fargs, loop)));
          }
        }

        fragments.push("\n");

        return fragments;
      });

      fragments.push("return [", functionBodies, this.addIndent("];"));

      result.push([ this.addIndent(fragments) ]);

      this.state.syncBlockScope = syncBlockScope;

      return result;
    });

    return [ "$SC.SegFunction(", body ];
  };

  CodeGen.prototype.Identifier = function(node, opts) {
    var name = node.name;

    if (isClassName(name)) {
      return "$SC('" + name + "')";
    }

    if (this.scope.find(name)) {
      return $id(name);
    }

    if (name.length === 1) {
      return this._InterpreterVariable(node, opts);
    }

    this.throwError(null, Message.VariableNotDefined, name);
  };

  CodeGen.prototype._InterpreterVariable = function(node, opts) {
    var name, ref;

    if (opts) {
      // setter
      ref = this.scope.begin_ref();
      name = [
        "(" + ref + " = ", this.generate(opts.right),
        ", $this." + node.name + "_(" + ref + "), " + ref + ")"
      ];
      opts.used = true;
      this.scope.end_ref();
    } else {
      // getter
      name = "$this." + node.name + "()";
    }

    return name;
  };

  CodeGen.prototype.ListExpression = function(node) {
    var result;

    result = [
      "$SC.Array(",
      this.insertArrayElement(node.elements),
    ];

    if (node.immutable) {
      result.push(", ", "true");
    }

    result.push(")");

    return result;
  };

  CodeGen.prototype.Literal = function(node) {
    switch (node.valueType) {
    case Token.IntegerLiteral:
      return "$SC.Integer(" + node.value + ")";
    case Token.FloatLiteral:
      return "$SC.Float(" + node.value + ")";
    case Token.CharLiteral:
      return "$SC.Char('" + node.value + "')";
    case Token.SymbolLiteral:
      return "$SC.Symbol('" + node.value + "')";
    case Token.StringLiteral:
      return "$SC.String('" + node.value + "')";
    case Token.TrueLiteral:
      return "$SC.True()";
    case Token.FalseLiteral:
      return "$SC.False()";
    }

    return "$SC.Nil()";
  };

  CodeGen.prototype.ObjectExpression = function(node) {
    return [
      "$SC.Event(", this.insertArrayElement(node.elements), ")"
    ];
  };

  CodeGen.prototype.Program = function(node) {
    var result, body;

    if (node.body.length) {
      body = this.withFunction([ "this", "SC" ], function() {
        return this._Statements(node.body);
      });

      result = [ "(", body, ")" ];

      if (!this.opts.bare) {
        result = [ "SCScript", result, ";" ];
      }
    } else {
      result = [];
    }

    return result;
  };

  CodeGen.prototype.ThisExpression = function(node) {
    if (node.name === "this") {
      return "$this";
    }

    return [ "$this." + node.name + "()" ];
  };

  CodeGen.prototype.UnaryExpression = function(node) {
    /* istanbul ignore else */
    if (node.operator === "`") {
      return [ "$SC.Ref(", this.generate(node.arg), ")" ];
    }

    /* istanbul ignore next */
    throw new Error("Unknown UnaryExpression: " + node.operator);
  };

  CodeGen.prototype.VariableDeclaration = function(node) {
    var scope = this.state.syncBlockScope;

    return this.stitchWith(node.declarations, ", ", function(item) {
      this.scope.add("var", item.id.name, scope);

      if (!item.init) {
        return;
      }

      return [ this.generate(item.id), " = ", this.generate(item.init) ];
    });
  };

  CodeGen.prototype._Statements = function(elements) {
    var lastIndex = elements.length - 1;

    return this.stitchWith(elements, "\n", function(item, i) {
      var stmt;

      stmt = this.generate(item);

      if (stmt.length === 0) {
        return;
      }

      if (i === lastIndex) {
        stmt = [ "return ", stmt ];
      }

      return [ this.addIndent(stmt), ";" ];
    });
  };

  var $id = function(id) {
    var ch = id.charAt(0);

    if (ch !== "_" && ch !== "$") {
      id = "$" + id;
    }

    return id;
  };

  var getInformationOfFunction = function(node) {
    var args = [];
    var keys, vals, remain;
    var list, i, imax;

    keys = [];
    vals = [];
    remain = null;

    if (node.args) {
      list = node.args.list;
      for (i = 0, imax = list.length; i < imax; ++i) {
        args.push(list[i].id.name);
        keys.push(list[i].id.name);
        vals.push(list[i].init);
      }
      if (node.args.remain) {
        remain = node.args.remain.name;
        args.push(remain);
      }
    }

    if (node.partial) {
      keys = [];
    }

    return {
      args  : args,
      keys  : keys,
      vals  : vals,
      remain: remain,
      closed: node.closed
    };
  };

  var isClassName = function(name) {
    var ch0 = name.charAt(0);
    return "A" <= ch0 && ch0 <= "Z";
  };

  var isNode = function(node, key) {
    return key !== "range" && key !== "loc" && typeof node[key] === "object";
  };

  var isSegmentedBlock = function(node) {
    if (isSegmentedMethod(node)) {
      return true;
    }
    return Object.keys(node).some(function(key) {
      if (isNode(node, key)) {
        return isSegmentedBlock(node[key]);
      }
      return false;
    });
  };

  var isSegmentedMethod = function(node) {
    return node.type === Syntax.CallExpression && !!SegmentedMethod[node.method.name];
  };

  codegen.compile = function(ast, opts) {
    return new CodeGen(opts).generate(ast);
  };

  sc.lang.compiler.codegen = codegen;

})(sc);

// src/sc/lang/compiler/node.js
(function(sc) {

  var Syntax = sc.lang.compiler.Syntax;

  var Node = {
    createAssignmentExpression: function(operator, left, right, remain) {
      var node = {
        type: Syntax.AssignmentExpression,
        operator: operator,
        left: left,
        right: right
      };
      if (remain) {
        node.remain = remain;
      }
      return node;
    },
    createBinaryExpression: function(operator, left, right) {
      var node = {
        type: Syntax.BinaryExpression,
        operator: operator.value,
        left: left,
        right: right
      };
      if (operator.adverb) {
        node.adverb = operator.adverb;
      }
      return node;
    },
    createBlockExpression: function(body) {
      return {
        type: Syntax.BlockExpression,
        body: body
      };
    },
    createCallExpression: function(callee, method, args, stamp) {
      var node;

      node = {
        type: Syntax.CallExpression,
        callee: callee,
        method: method,
        args  : args,
      };

      if (stamp) {
        node.stamp = stamp;
      }

      return node;
    },
    createGlobalExpression: function(id) {
      return {
        type: Syntax.GlobalExpression,
        id: id
      };
    },
    createFunctionExpression: function(args, body, closed, partial, blocklist) {
      var node;

      node = {
        type: Syntax.FunctionExpression,
        body: body
      };
      if (args) {
        node.args = args;
      }
      if (closed) {
        node.closed = true;
      }
      if (partial) {
        node.partial = true;
      }
      if (blocklist) {
        node.blocklist = true;
      }
      return node;
    },
    createIdentifier: function(name) {
      return {
        type: Syntax.Identifier,
        name: name
      };
    },
    createLabel: function(name) {
      return {
        type: Syntax.Label,
        name: name
      };
    },
    createListExpression: function(elements, immutable) {
      var node = {
        type: Syntax.ListExpression,
        elements: elements
      };
      if (immutable) {
        node.immutable = !!immutable;
      }
      return node;
    },
    createLiteral: function(token) {
      return {
        type: Syntax.Literal,
        value: token.value,
        valueType: token.type
      };
    },
    createObjectExpression: function(elements) {
      return {
        type: Syntax.ObjectExpression,
        elements: elements
      };
    },
    createProgram: function(body) {
      return {
        type: Syntax.Program,
        body: body
      };
    },
    createThisExpression: function(name) {
      return {
        type: Syntax.ThisExpression,
        name: name
      };
    },
    createUnaryExpression: function(operator, arg) {
      return {
        type: Syntax.UnaryExpression,
        operator: operator,
        arg: arg
      };
    },
    createVariableDeclaration: function(declarations, kind) {
      return {
        type: Syntax.VariableDeclaration,
        declarations: declarations,
        kind: kind
      };
    },
    createVariableDeclarator: function(id, init) {
      var node = {
        type: Syntax.VariableDeclarator,
        id: id
      };
      if (init) {
        node.init = init;
      }
      return node;
    }
  };

  sc.lang.compiler.node = Node;

})(sc);

// src/sc/lang/compiler/marker.js
(function(sc) {

  function Marker(lexer, locItems) {
    this.lexer = lexer;
    this.startLocItems = locItems;
    this.endLocItems   = null;
  }

  Marker.create = function(lexer, node) {
    var locItems;

    if (!lexer.opts.loc && !lexer.opts.range) {
      return nopMarker;
    }

    if (node) {
      locItems = [ node.range[0], node.loc.start.line, node.loc.start.column ];
    } else {
      lexer.skipComment();
      locItems = lexer.getLocItems();
    }

    return new Marker(lexer, locItems);
  };

  Marker.prototype.update = function(node) {
    var locItems;

    if (node) {
      locItems = [ node.range[1], node.loc.end.line, node.loc.end.column ];
    } else {
      locItems = this.lexer.getLocItems();
    }
    this.endLocItems = locItems;

    return this;
  };

  Marker.prototype.apply = function(node, force) {
    var startLocItems, endLocItems;

    if (Array.isArray(node)) {
      return node;
    }

    if (force || !node.range || !node.loc) {
      startLocItems = this.startLocItems;
      if (this.endLocItems) {
        endLocItems = this.endLocItems;
      } else {
        endLocItems = this.startLocItems;
      }
      /* istanbul ignore else */
      if (this.lexer.opts.range) {
        node.range = [ startLocItems[0], endLocItems[0] ];
      }
      /* istanbul ignore else */
      if (this.lexer.opts.loc) {
        node.loc = {
          start: {
            line  : startLocItems[1],
            column: startLocItems[2]
          },
          end: {
            line  : endLocItems[1],
            column: endLocItems[2]
          }
        };
      }
    }

    return node;
  };

  var nopMarker = {
    apply: function(node) {
      return node;
    },
    update: function() {
      return this;
    }
  };

  sc.lang.compiler.marker = Marker;

})(sc);

// src/sc/lang/compiler/lexer.js
(function(sc) {

  var Token    = sc.lang.compiler.Token;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;

  function Lexer(source, opts) {
    /* istanbul ignore next */
    if (typeof source !== "string") {
      if (typeof source === "undefined") {
        source = "";
      }
      source = String(source);
    }
    source = source.replace(/\r\n?/g, "\n");

    opts = opts || /* istanbul ignore next */ {};

    this.source = source;
    this.opts   = opts;
    this.length = source.length;
    this.index  = 0;
    this.lineNumber = this.length ? 1 : 0;
    this.lineStart  = 0;
    this.reverted   = null;
    this.errors     = opts.tolerant ? [] : null;

    this.peek();
  }

  function char2num(ch) {
    var n = ch.charCodeAt(0);

    if (48 <= n && n <= 57) {
      return n - 48;
    }
    if (65 <= n && n <= 90) {
      return n - 55;
    }
    return n - 87; // if (97 <= n && n <= 122)
  }

  function isAlpha(ch) {
    return ("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z");
  }

  function isNumber(ch) {
    return "0" <= ch && ch <= "9";
  }

  Lexer.prototype.tokenize = function() {
    var tokens, token;

    tokens = [];

    while (true) {
      token = this.collectToken();
      if (token.type === Token.EOF) {
        break;
      }
      tokens.push(token);
    }

    return tokens;
  };

  Lexer.prototype.collectToken = function() {
    var loc, token, t;

    this.skipComment();

    loc = {
      start: {
        line  : this.lineNumber,
        column: this.index - this.lineStart
      }
    };

    token = this.advance();

    loc.end = {
      line  : this.lineNumber,
      column: this.index - this.lineStart
    };

    t = {
      type : token.type,
      value: token.value
    };

    if (this.opts.range) {
      t.range = token.range;
    }
    if (this.opts.loc) {
      t.loc = loc;
    }

    return t;
  };

  Lexer.prototype.skipComment = function() {
    var source = this.source;
    var length = this.length;
    var index = this.index;
    var ch;

    LOOP: while (index < length) {
      ch = source.charAt(index);

      if (ch === " " || ch === "\t") {
        index += 1;
        continue;
      }

      if (ch === "\n") {
        index += 1;
        this.lineNumber += 1;
        this.lineStart = index;
        continue;
      }

      if (ch === "/") {
        ch = source.charAt(index + 1);
        if (ch === "/") {
          index = this.skipLineComment(index + 2);
          continue;
        }
        if (ch === "*") {
          index = this.skipBlockComment(index + 2);
          continue;
        }
      }

      break;
    }

    this.index = index;
  };

  Lexer.prototype.skipLineComment = function(index) {
    var source = this.source;
    var length = this.length;
    var ch;

    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
        break;
      }
    }

    return index;
  };

  Lexer.prototype.skipBlockComment = function(index) {
    var source = this.source;
    var length = this.length;
    var ch, depth;

    depth = 1;
    while (index < length) {
      ch = source.charAt(index);

      if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else {
        ch = ch + source.charAt(index + 1);
        if (ch === "/*") {
          depth += 1;
          index += 1;
        } else if (ch === "*/") {
          depth -= 1;
          index += 1;
          if (depth === 0) {
            return index + 1;
          }
        }
      }

      index += 1;
    }
    this.throwError({}, Message.UnexpectedToken, "ILLEGAL");

    return index;
  };

  Lexer.prototype.advance = function() {
    var ch, token;

    this.skipComment();

    if (this.length <= this.index) {
      return this.EOFToken();
    }

    ch = this.source.charAt(this.index);

    if (ch === "\\") {
      return this.scanSymbolLiteral();
    }
    if (ch === "'") {
      return this.scanQuotedLiteral(Token.SymbolLiteral, ch);
    }

    if (ch === "$") {
      return this.scanCharLiteral();
    }

    if (ch === '"') {
      return this.scanQuotedLiteral(Token.StringLiteral, ch);
    }

    if (ch === "_") {
      return this.scanUnderscore();
    }

    if (ch === "-") {
      token = this.scanNegativeNumericLiteral();
      if (token) {
        return token;
      }
    }

    if (isAlpha(ch)) {
      return this.scanIdentifier();
    }

    if (isNumber(ch)) {
      return this.scanNumericLiteral();
    }

    return this.scanPunctuator();
  };

  Lexer.prototype.peek = function() {
    var index, lineNumber, lineStart;

    index      = this.index;
    lineNumber = this.lineNumber;
    lineStart  = this.lineStart;

    this.lookahead = this.advance();

    this.index      = index;
    this.lineNumber = lineNumber;
    this.lineStart  = lineStart;
  };

  Lexer.prototype.lex = function(saved) {
    var that = this;
    var token = this.lookahead;

    if (saved) {
      saved = [
        this.lookahead,
        this.index,
        this.lineNumber,
        this.lineStart
      ];
    }

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    this.lookahead = this.advance();

    this.index      = token.range[1];
    this.lineNumber = token.lineNumber;
    this.lineStart  = token.lineStart;

    if (saved) {
      token.revert = function() {
        that.lookahead  = saved[0];
        that.index      = saved[1];
        that.lineNumber = saved[2];
        that.lineStart  = saved[3];
      };
    }

    return token;
  };

  Lexer.prototype.makeToken = function(type, value, start) {
    return {
      type : type,
      value: value,
      lineNumber: this.lineNumber,
      lineStart : this.lineStart,
      range: [ start, this.index ]
    };
  };

  Lexer.prototype.EOFToken = function() {
    return this.makeToken(Token.EOF, "<EOF>", this.index);
  };

  Lexer.prototype.scanCharLiteral = function() {
    var start, value;

    start = this.index;
    value = this.source.charAt(this.index + 1);

    this.index += 2;

    return this.makeToken(Token.CharLiteral, value, start);
  };

  Lexer.prototype.scanIdentifier = function() {
    var source = this.source.slice(this.index);
    var start = this.index;
    var value, type;

    value = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(source)[0];

    this.index += value.length;

    if (this.source.charAt(this.index) === ":") {
      this.index += 1;
      return this.makeToken(Token.Label, value, start);
    } else if (this.isKeyword(value)) {
      type = Token.Keyword;
    } else {
      switch (value) {
      case "inf":
        type = Token.FloatLiteral;
        value = "Infinity";
        break;
      case "pi":
        type = Token.FloatLiteral;
        value = String(Math.PI);
        break;
      case "nil":
        type = Token.NilLiteral;
        value = "null";
        break;
      case "true":
        type = Token.TrueLiteral;
        break;
      case "false":
        type = Token.FalseLiteral;
        break;
      default:
        type = Token.Identifier;
        break;
      }
    }

    return this.makeToken(type, value, start);
  };

  Lexer.prototype.scanNumericLiteral = function(neg) {
    return this.scanNAryNumberLiteral(neg) ||
      this.scanHexNumberLiteral(neg) ||
      this.scanDecimalNumberLiteral(neg);
  };

  Lexer.prototype.scanNegativeNumericLiteral = function() {
    var token, ch1, ch2, ch3;
    var start, value = null;

    start = this.index;
    ch1 = this.source.charAt(this.index + 1);

    if (isNumber(ch1)) {
      this.index += 1;
      token = this.scanNumericLiteral(true);
      token.range[0] = start;
      return token;
    }

    ch2 = this.source.charAt(this.index + 2);
    ch3 = this.source.charAt(this.index + 3);

    if (ch1 + ch2 === "pi") {
      this.index += 3;
      value = String(-Math.PI);
    } else if (ch1 + ch2 + ch3 === "inf") {
      this.index += 4;
      value = "-Infinity";
    }

    if (value !== null) {
      return this.makeToken(Token.FloatLiteral, value, start);
    }

    return null;
  };

  var makeNumberToken = function(type, value, neg, pi) {
    if (neg) {
      value *= -1;
    }

    if (pi) {
      type = Token.FloatLiteral;
      value = value * Math.PI;
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    } else {
      value = String(value);
    }

    return {
      type : type,
      value: value
    };
  };

  Lexer.prototype.scanNAryNumberLiteral = function(neg) {
    var re, start, items;
    var base, integer, frac, pi;
    var value, type;
    var token;

    re = /^(\d+)r((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+)(?:\.((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+))?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    base    = items[1].replace(/^0+(?=\d)/g, "")|0;
    integer = items[2].replace(/(^0+(?=\d)|_)/g, "");
    frac    = items[3] && items[3].replace(/_/g, "");

    if (!frac && base < 26 && integer.substr(-2) === "pi") {
      integer = integer.slice(0, -2);
      pi = true;
    }

    type  = Token.IntegerLiteral;
    value = this.calcNBasedInteger(integer, base);

    if (frac) {
      type = Token.FloatLiteral;
      value += this.calcNBasedFrac(frac, base);
    }

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.char2num = function(ch, base) {
    var x = char2num(ch, base);
    if (x >= base) {
      this.throwError({}, Message.UnexpectedToken, ch);
    }
    return x;
  };

  Lexer.prototype.calcNBasedInteger = function(integer, base) {
    var value, i, imax;

    for (i = value = 0, imax = integer.length; i < imax; ++i) {
      value *= base;
      value += this.char2num(integer[i], base);
    }

    return value;
  };

  Lexer.prototype.calcNBasedFrac = function(frac, base) {
    var value, i, imax;

    for (i = value = 0, imax = frac.length; i < imax; ++i) {
      value += this.char2num(frac[i], base) * Math.pow(base, -(i + 1));
    }

    return value;
  };

  Lexer.prototype.scanHexNumberLiteral = function(neg) {
    var re, start, items;
    var integer, pi;
    var value, type;
    var token;

    re = /^(0x(?:[\da-fA-F](?:_(?=[\da-fA-F]))?)+)(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (!items) {
      return;
    }

    integer = items[1].replace(/_/g, "");
    pi      = !!items[2];

    type  = Token.IntegerLiteral;
    value = +integer;

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanDecimalNumberLiteral = function(neg) {
    var re, start, items, integer, frac, pi;
    var value, type;
    var token;

    re = /^((?:\d(?:_(?=\d))?)+((?:\.(?:\d(?:_(?=\d))?)+)?(?:e[-+]?(?:\d(?:_(?=\d))?)+)?))(pi)?/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    integer = items[1];
    frac    = items[2];
    pi      = items[3];

    type  = (frac || pi) ? Token.FloatLiteral : Token.IntegerLiteral;
    value = +integer.replace(/(^0+(?=\d)|_)/g, "");

    token = makeNumberToken(type, value, neg, pi);

    this.index += items[0].length;

    return this.makeToken(token.type, token.value, start);
  };

  Lexer.prototype.scanPunctuator = function() {
    var re, start, items;

    re = /^(\.{1,3}|[(){}[\]:;,~#`]|[-+*\/%<=>!?&|@]+)/;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    if (items) {
      this.index += items[0].length;
      return this.makeToken(Token.Punctuator, items[0], start);
    }

    this.throwError({}, Message.UnexpectedToken, this.source.charAt(this.index));

    this.index = this.length;

    return this.EOFToken();
  };

  Lexer.prototype.scanQuotedLiteral = function(type, quote) {
    var start, value;
    start = this.index;
    value = this._scanQuotedLiteral(quote);
    return value ? this.makeToken(type, value, start) : this.EOFToken();
  };

  Lexer.prototype._scanQuotedLiteral = function(quote) {
    var source, length, index, start, value, ch;

    source = this.source;
    length = this.length;
    index  = this.index + 1;
    start  = index;
    value  = null;

    while (index < length) {
      ch = source.charAt(index);
      index += 1;
      if (ch === quote) {
        value = source.substr(start, index - start - 1).replace(/\n/g, "\\n");
        break;
      } else if (ch === "\n") {
        this.lineNumber += 1;
        this.lineStart = index;
      } else if (ch === "\\") {
        index += 1;
      }
    }

    this.index = index;

    if (!value) {
      this.throwError({}, Message.UnexpectedToken, "ILLEGAL");
    }

    return value;
  };

  Lexer.prototype.scanSymbolLiteral = function() {
    var re, start, items;
    var value;

    re = /^\\([a-z_]\w*)?/i;
    start = this.index;
    items = re.exec(this.source.slice(this.index));

    value = items[1];

    this.index += items[0].length;

    return this.makeToken(Token.SymbolLiteral, value, start);
  };

  Lexer.prototype.scanUnderscore = function() {
    var start = this.index;

    this.index += 1;

    return this.makeToken(Token.Identifier, "_", start);
  };

  Lexer.prototype.isKeyword = function(value) {
    return !!Keywords[value] || false;
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.index, this.lineNumber, this.index - this.lineStart ];
  };

  Lexer.prototype.throwError = function(token, messageFormat) {
    var args, message;
    var error, index, lineNumber, column;
    var prev;

    args = Array.prototype.slice.call(arguments, 2);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    if (typeof token.lineNumber === "number") {
      index      = token.range[0];
      lineNumber = token.lineNumber;
      column     = token.range[0] - token.lineStart + 1;
    } else {
      index      = this.index;
      lineNumber = this.lineNumber;
      column     = index - this.lineStart + 1;
    }

    error = new Error("Line " + lineNumber + ": " + message);
    error.index       = index;
    error.lineNumber  = lineNumber;
    error.column      = column;
    error.description = message;

    if (this.errors) {
      prev = this.errors[this.errors.length - 1];
      if (!(prev && error.index <= prev.index)) {
        this.errors.push(error);
      }
    } else {
      throw error;
    }
  };

  sc.lang.compiler.lexer = Lexer;

})(sc);

// src/sc/lang/compiler/parser.js
(function(sc) {

  var parser = {};

  var Token    = sc.lang.compiler.Token;
  var Syntax   = sc.lang.compiler.Syntax;
  var Message  = sc.lang.compiler.Message;
  var Keywords = sc.lang.compiler.Keywords;
  var Lexer    = sc.lang.compiler.lexer;
  var Marker   = sc.lang.compiler.marker;
  var Node     = sc.lang.compiler.node;

  var binaryPrecedenceDefaults = {
    "?"  : 1,
    "??" : 1,
    "!?" : 1,
    "->" : 2,
    "||" : 3,
    "&&" : 4,
    "|"  : 5,
    "&"  : 6,
    "==" : 7,
    "!=" : 7,
    "===": 7,
    "!==": 7,
    "<"  : 8,
    ">"  : 8,
    "<=" : 8,
    ">=" : 8,
    "<<" : 9,
    ">>" : 9,
    "+>>": 9,
    "+"  : 10,
    "-"  : 10,
    "*"  : 11,
    "/"  : 11,
    "%"  : 11,
    "!"  : 12,
  };

  var Scope = sc.lang.compiler.scope({
    begin: function() {
      var declared = this.getDeclaredVariable();

      this.stack.push({
        vars: {},
        args: {},
        declared: declared
      });
    }
  });

  function SCParser(source, opts) {
    var binaryPrecedence;

    this.opts  = opts || /* istanbul ignore next */ {};
    this.lexer = new Lexer(source, opts);
    this.scope = new Scope(this);
    this.state = {
      closedFunction: false,
      disallowGenerator: false,
      innerElements: false,
      immutableList: false,
      underscore: []
    };

    if (this.opts.binaryPrecedence) {
      if (typeof this.opts.binaryPrecedence === "object") {
        binaryPrecedence = this.opts.binaryPrecedence;
      } else {
        binaryPrecedence = binaryPrecedenceDefaults;
      }
    }

    this.binaryPrecedence = binaryPrecedence || {};
  }

  Object.defineProperty(SCParser.prototype, "lookahead", {
    get: function() {
      return this.lexer.lookahead;
    }
  });

  SCParser.prototype.lex = function() {
    return this.lexer.lex();
  };

  SCParser.prototype.expect = function(value) {
    var token = this.lexer.lex();
    if (token.type !== Token.Punctuator || token.value !== value) {
      this.throwUnexpected(token, value);
    }
  };

  SCParser.prototype.match = function(value) {
    return this.lexer.lookahead.value === value;
  };

  SCParser.prototype.matchAny = function(list) {
    var value, i, imax;

    value = this.lexer.lookahead.value;
    for (i = 0, imax = list.length; i < imax; ++i) {
      if (list[i] === value) {
        return value;
      }
    }

    return null;
  };

  SCParser.prototype.throwError = function() {
    return this.lexer.throwError.apply(this.lexer, arguments);
  };

  SCParser.prototype.throwUnexpected = function(token) {
    switch (token.type) {
    case Token.EOF:
      this.throwError(token, Message.UnexpectedEOS);
      break;
    case Token.FloatLiteral:
    case Token.IntegerLiteral:
      this.throwError(token, Message.UnexpectedNumber);
      break;
    case Token.CharLiteral:
    case Token.StringLiteral:
    case Token.SymbolLiteral:
      this.throwError(token, Message.UnexpectedLiteral, token.type.toLowerCase());
      break;
    case Token.Identifier:
      this.throwError(token, Message.UnexpectedIdentifier);
      break;
    default:
      this.throwError(token, Message.UnexpectedToken, token.value);
      break;
    }
  };

  SCParser.prototype.withScope = function(fn) {
    var result;

    this.scope.begin();
    result = fn.call(this);
    this.scope.end();

    return result;
  };

  SCParser.prototype.parse = function() {
    return this.parseProgram();
  };

  // 1. Program
  SCParser.prototype.parseProgram = function() {
    var node, marker;

    marker = Marker.create(this.lexer);

    node = this.withScope(function() {
      var body;

      body = this.parseFunctionBody("");
      if (body.length === 1 && body[0].type === Syntax.BlockExpression) {
        body = body[0].body;
      }

      return Node.createProgram(body);
    });

    return marker.update().apply(node);
  };

  // 2. Function
  // 2.1 Function Expression
  SCParser.prototype.parseFunctionExpression = function(closed, blocklist) {
    var node;

    node = this.withScope(function() {
      var args, body;

      if (this.match("|")) {
        args = this.parseFunctionArgument("|");
      } else if (this.match("arg")) {
        args = this.parseFunctionArgument(";");
      }
      body = this.parseFunctionBody("}");

      return Node.createFunctionExpression(args, body, closed, false, blocklist);
    });

    return node;
  };

  // 2.2 Function Argument
  SCParser.prototype.parseFunctionArgument = function(expect) {
    var args = { list: [] };

    this.lex();

    if (!this.match("...")) {
      do {
        args.list.push(this.parseFunctionArgumentElement());
        if (!this.match(",")) {
          break;
        }
        this.lex();
      } while (this.lookahead.type !== Token.EOF);
    }

    if (this.match("...")) {
      this.lex();
      args.remain = this.parseVariableIdentifier();
      this.scope.add("arg", args.remain.name);
    }

    this.expect(expect);

    return args;
  };

  SCParser.prototype._parseArgVarElement = function(type, method) {
    var init = null, id;
    var marker, declarator;

    marker = Marker.create(this.lexer);

    id = this.parseVariableIdentifier();
    this.scope.add(type, id.name);

    if (this.match("=")) {
      this.lex();
      init = this[method]();
    }

    declarator = Node.createVariableDeclarator(id, init);

    return marker.update().apply(declarator);
  };

  SCParser.prototype.parseFunctionArgumentElement = function() {
    var node = this._parseArgVarElement("arg", "parseArgumentableValue");

    if (node.init && !isValidArgumentValue(node.init)) {
      this.throwUnexpected(this.lookahead);
    }

    return node;
  };

  // 2.3 Function Body
  SCParser.prototype.parseFunctionBody = function(match) {
    var elements = [];

    while (this.match("var")) {
      elements.push(this.parseVariableDeclaration());
    }

    while (this.lookahead.type !== Token.EOF && !this.match(match)) {
      elements.push(this.parseExpression());
      if (this.lookahead.type !== Token.EOF && !this.match(match)) {
        this.expect(";");
      } else {
        break;
      }
    }

    return elements;
  };

  // 3. Variable Declarations
  SCParser.prototype.parseVariableDeclaration = function() {
    var declaration;
    var marker;

    marker = Marker.create(this.lexer);

    this.lex(); // var

    declaration = Node.createVariableDeclaration(
      this.parseVariableDeclarationList(), "var"
    );

    declaration = marker.update().apply(declaration);

    this.expect(";");

    return declaration;
  };

  SCParser.prototype.parseVariableDeclarationList = function() {
    var list = [];

    do {
      list.push(this.parseVariableDeclarationElement());
      if (!this.match(",")) {
        break;
      }
      this.lex();
    } while (this.lookahead.type !== Token.EOF);

    return list;
  };

  SCParser.prototype.parseVariableDeclarationElement = function() {
    return this._parseArgVarElement("var", "parseAssignmentExpression");
  };

  // 4. Expression
  SCParser.prototype.parseExpression = function(node) {
    return this.parseAssignmentExpression(node);
  };

  // 4.1 Expressions
  SCParser.prototype.parseExpressions = function(node) {
    var nodes = [];

    if (node) {
      nodes.push(node);
      this.lex();
    }

    while (this.lookahead.type !== Token.EOF && !this.matchAny([ ",", ")", "]", ".." ])) {
      var marker;

      marker = Marker.create(this.lexer);
      node   = this.parseAssignmentExpression();
      node   = marker.update().apply(node);

      nodes.push(node);

      if (this.match(";")) {
        this.lex();
      }
    }

    if (nodes.length === 0) {
      this.throwUnexpected(this.lookahead);
    }

    return nodes.length === 1 ? nodes[0] : nodes;
  };

  // 4.2 Assignment Expression
  SCParser.prototype.parseAssignmentExpression = function(node) {
    var token, marker;

    if (node) {
      return this.parsePartialExpression(node);
    }

    marker = Marker.create(this.lexer);

    if (this.match("#")) {
      token = this.lexer.lex(true);
      if (this.matchAny([ "[", "{" ])) {
        token.revert();
      } else {
        node = this.parseDestructuringAssignmentExpression();
      }
    }

    if (!node) {
      node = this.parseSimpleAssignmentExpression();
    }

    return marker.update().apply(node);
  };

  SCParser.prototype.parseDestructuringAssignmentExpression = function() {
    var node, left, right, token;

    left = this.parseDestructuringAssignmentLeft();
    token = this.lookahead;
    this.expect("=");

    right = this.parseAssignmentExpression();
    node = Node.createAssignmentExpression(
      token.value, left.list, right, left.remain
    );

    return node;
  };

  SCParser.prototype.parseSimpleAssignmentExpression = function() {
    var node, left, right, token, methodName, marker;

    node = left = this.parsePartialExpression();

    if (this.match("=")) {
      if (node.type === Syntax.CallExpression) {
        marker = Marker.create(this.lexer, left);

        token = this.lex();
        right = this.parseAssignmentExpression();
        methodName = renameGetterToSetter(left.method.name);
        left.method.name = methodName;
        left.args.list   = node.args.list.concat(right);
        if (methodName.charAt(methodName.length - 1) === "_") {
          left.stamp = "=";
        }
        node = marker.update().apply(left, true);
      } else {
        if (!isLeftHandSide(left)) {
          this.throwError(left, Message.InvalidLHSInAssignment);
        }

        token = this.lex();
        right = this.parseAssignmentExpression();
        node  = Node.createAssignmentExpression(
          token.value, left, right
        );
      }
    }

    return node;
  };

  SCParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = { list: [] }, element;

    do {
      element = this.parseLeftHandSideExpression();
      if (!isLeftHandSide(element)) {
        this.throwError(element, Message.InvalidLHSInAssignment);
      }
      params.list.push(element);
      if (this.match(",")) {
        this.lex();
      } else if (this.match("...")) {
        this.lex();
        params.remain = this.parseLeftHandSideExpression();
        if (!isLeftHandSide(params.remain)) {
          this.throwError(params.remain, Message.InvalidLHSInAssignment);
        }
        break;
      }
    } while (this.lookahead.type !== Token.EOF && !this.match("="));

    return params;
  };

  // 4.3 Partial Expression
  SCParser.prototype.parsePartialExpression = function(node) {
    var underscore, x, y;

    if (this.state.innerElements) {
      node = this.parseBinaryExpression(node);
    } else {
      underscore = this.state.underscore;
      this.state.underscore = [];

      node = this.parseBinaryExpression(node);

      if (this.state.underscore.length) {
        node = this.withScope(function() {
          var args, i, imax;

          args = new Array(this.state.underscore.length);
          for (i = 0, imax = args.length; i < imax; ++i) {
            x = this.state.underscore[i];
            y = Node.createVariableDeclarator(x);
            args[i] = Marker.create(this.lexer, x).update(x).apply(y);
            this.scope.add("arg", this.state.underscore[i].name);
          }

          return Node.createFunctionExpression(
            { list: args }, [ node ], false, true, false
          );
        });
      }

      this.state.underscore = underscore;
    }

    return node;
  };

  // 4.4 Conditional Expression
  // 4.5 Binary Expression
  SCParser.prototype.parseBinaryExpression = function(node) {
    var marker, left, token, prec;

    marker = Marker.create(this.lexer);
    left   = this.parseUnaryExpression(node);
    token  = this.lookahead;

    prec = calcBinaryPrecedence(token, this.binaryPrecedence);
    if (prec === 0) {
      if (node) {
        return this.parseUnaryExpression(node);
      }
      return left;
    }
    this.lex();

    token.prec   = prec;
    token.adverb = this.parseAdverb();

    return this.sortByBinaryPrecedence(left, token, marker);
  };

  SCParser.prototype.sortByBinaryPrecedence = function(left, operator, marker) {
    var expr;
    var prec, token;
    var markers, i;
    var right, stack;

    markers = [ marker, Marker.create(this.lexer) ];
    right = this.parseUnaryExpression();

    stack = [ left, operator, right ];

    while ((prec = calcBinaryPrecedence(this.lookahead, this.binaryPrecedence)) > 0) {
      // Reduce: make a binary expression from the three topmost entries.
      while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
        right    = stack.pop();
        operator = stack.pop();
        left     = stack.pop();
        expr = Node.createBinaryExpression(operator, left, right);
        markers.pop();

        marker = markers.pop();
        marker.update().apply(expr);

        stack.push(expr);

        markers.push(marker);
      }

      // Shift.
      token = this.lex();
      token.prec = prec;
      token.adverb = this.parseAdverb();

      stack.push(token);

      markers.push(Marker.create(this.lexer));
      expr = this.parseUnaryExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    i = stack.length - 1;
    expr = stack[i];
    markers.pop();
    while (i > 1) {
      expr = Node.createBinaryExpression(stack[i - 1], stack[i - 2], expr);
      i -= 2;
      marker = markers.pop();
      marker.update().apply(expr);
    }

    return expr;
  };

  SCParser.prototype.parseAdverb = function() {
    var adverb, lookahead;

    if (this.match(".")) {
      this.lex();

      lookahead = this.lookahead;
      adverb = this.parsePrimaryExpression();

      if (adverb.type === Syntax.Literal) {
        return adverb;
      }

      if (adverb.type === Syntax.Identifier) {
        adverb.type = Syntax.Literal;
        adverb.value = adverb.name;
        adverb.valueType = Token.SymbolLiteral;
        delete adverb.name;
        return adverb;
      }

      this.throwUnexpected(lookahead);
    }

    return null;
  };

  // 4.6 Unary Expressions
  SCParser.prototype.parseUnaryExpression = function(node) {
    var token, expr;
    var marker;

    marker = Marker.create(this.lexer);

    if (this.match("`")) {
      token = this.lex();
      expr = this.parseUnaryExpression();
      expr = Node.createUnaryExpression(token.value, expr);
    } else {
      expr = this.parseLeftHandSideExpression(node);
    }

    return marker.update().apply(expr);
  };

  // 4.7 LeftHandSide Expressions
  SCParser.prototype.parseLeftHandSideExpression = function(node) {
    var marker, expr, prev, lookahead;
    var blocklist, stamp;

    marker = Marker.create(this.lexer);
    expr   = this.parsePrimaryExpression(node);

    blocklist = false;

    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      lookahead = this.lookahead;
      if ((prev === "{" && (stamp !== "#" && stamp !== "{")) || (prev === "(" && stamp === "(")) {
        this.throwUnexpected(lookahead);
      }
      switch (stamp) {
      case "(":
        expr = this.parseLeftHandSideParenthesis(expr);
        break;
      case "#":
        expr = this.parseLeftHandSideClosedBrace(expr);
        break;
      case "{":
        expr = this.parseLeftHandSideBrace(expr);
        break;
      case "[":
        expr = this.parseLeftHandSideBracket(expr);
        break;
      case ".":
        expr = this.parseLeftHandSideDot(expr);
        break;
      }
      marker.update().apply(expr, true);

      prev = stamp;
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideParenthesis = function(expr) {
    if (isClassName(expr)) {
      return this.parseLeftHandSideClassNew(expr);
    }

    return this.parseLeftHandSideMethodCall(expr);
  };

  SCParser.prototype.parseLeftHandSideClassNew = function(expr) {
    var method, args;

    method = Node.createIdentifier("new");
    method = Marker.create(this.lexer).apply(method);

    args   = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, "(");
  };

  SCParser.prototype.parseLeftHandSideMethodCall = function(expr) {
    var method, args, lookahead;

    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    lookahead = this.lookahead;
    args      = this.parseCallArgument();

    method = expr;
    expr   = args.list.shift();

    if (!expr) {
      if (args.expand) {
        expr = args.expand;
        delete args.expand;
      } else {
        this.throwUnexpected(lookahead);
      }
    }

    // max(0, 1) -> 0.max(1)
    return Node.createCallExpression(expr, method, args, "(");
  };

  SCParser.prototype.parseLeftHandSideClosedBrace = function(expr) {
    this.lex();
    if (!this.match("{")) {
      this.throwUnexpected(this.lookahead);
    }

    this.state.closedFunction = true;
    expr = this.parseLeftHandSideBrace(expr);
    this.state.closedFunction = false;

    return expr;
  };

  SCParser.prototype.parseLeftHandSideBrace = function(expr) {
    var method, lookahead, disallowGenerator, node;

    if (expr.type === Syntax.CallExpression && expr.stamp && expr.stamp !== "(") {
      this.throwUnexpected(this.lookahead);
    }
    if (expr.type === Syntax.Identifier) {
      if (isClassName(expr)) {
        method = Node.createIdentifier("new");
        method = Marker.create(this.lexer).apply(method);
        expr   = Node.createCallExpression(expr, method, { list: [] }, "{");
      } else {
        expr = Node.createCallExpression(null, expr, { list: [] });
      }
    }
    lookahead = this.lookahead;
    disallowGenerator = this.state.disallowGenerator;
    this.state.disallowGenerator = true;
    node = this.parseBraces(true);
    this.state.disallowGenerator = disallowGenerator;

    // TODO: refactoring
    if (expr.callee === null) {
      expr.callee = node;
      node = expr;
    } else {
      expr.args.list.push(node);
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideBracket = function(expr) {
    if (expr.type === Syntax.CallExpression && expr.stamp === "(") {
      this.throwUnexpected(this.lookahead);
    }

    if (isClassName(expr)) {
      expr = this.parseLeftHandSideNewFrom(expr);
    } else {
      expr = this.parseLeftHandSideListAt(expr);
    }

    return expr;
  };

  SCParser.prototype.parseLeftHandSideNewFrom = function(expr) {
    var node, method;
    var marker;

    method = Node.createIdentifier("newFrom");
    method = Marker.create(this.lexer).apply(method);

    marker = Marker.create(this.lexer);
    node = this.parseListInitialiser();
    node = marker.update().apply(node);

    return Node.createCallExpression(expr, method, { list: [ node ] }, "[");
  };

  SCParser.prototype.parseLeftHandSideListAt = function(expr) {
    var indexes, method;

    method = Node.createIdentifier("at");
    method = Marker.create(this.lexer).apply(method);

    indexes = this.parseListIndexer();
    if (indexes) {
      if (indexes.length === 3) {
        method.name = "copySeries";
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createCallExpression(expr, method, { list: indexes }, "[");
  };

  SCParser.prototype.parseLeftHandSideDot = function(expr) {
    var method, args;

    this.lex();

    if (this.match("(")) {
      // expr.()
      return this.parseLeftHandSideDotValue(expr);
    } else if (this.match("[")) {
      // expr.[0]
      return this.parseLeftHandSideDotBracket(expr);
    }

    method = this.parseProperty();
    if (this.match("(")) {
      // expr.method(args)
      args = this.parseCallArgument();
      return Node.createCallExpression(expr, method, args);
    }

    // expr.method
    return Node.createCallExpression(expr, method, { list: [] });
  };

  SCParser.prototype.parseLeftHandSideDotValue = function(expr) {
    var method, args;

    method = Node.createIdentifier("value");
    method = Marker.create(this.lexer).apply(method);

    args   = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, ".");
  };

  SCParser.prototype.parseLeftHandSideDotBracket = function(expr) {
    var method, marker;

    marker = Marker.create(this.lexer, expr);

    method = Node.createIdentifier("value");
    method = Marker.create(this.lexer).apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, ".");
    expr = marker.update().apply(expr);

    return this.parseLeftHandSideListAt(expr);
  };

  SCParser.prototype.parseCallArgument = function() {
    var args, node, hasKeyword, lookahead;

    args = { list: [] };
    hasKeyword = false;

    this.expect("(");

    while (this.lookahead.type !== Token.EOF && !this.match(")")) {
      lookahead = this.lookahead;
      if (!hasKeyword) {
        if (this.match("*")) {
          this.lex();
          args.expand = this.parseExpressions();
          hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          this.parseCallArgumentKeyword(args);
          hasKeyword = true;
        } else {
          node = this.parseExpressions();
          args.list.push(node);
        }
      } else {
        if (lookahead.type !== Token.Label) {
          this.throwUnexpected(lookahead);
        }
        this.parseCallArgumentKeyword(args);
      }
      if (this.match(")")) {
        break;
      }
      this.expect(",");
    }

    this.expect(")");

    return args;
  };

  SCParser.prototype.parseCallArgumentKeyword = function(args) {
    var key, value;

    key = this.lex().value;
    value = this.parseExpressions();
    if (!args.keywords) {
      args.keywords = {};
    }
    args.keywords[key] = value;
  };

  SCParser.prototype.parseListIndexer = function() {
    var node = null;

    this.expect("[");

    if (!this.match("]")) {
      if (this.match("..")) {
        // [..last] / [..]
        node = this.parseListIndexerWithoutFirst();
      } else {
        // [first] / [first..last] / [first, second..last]
        node = this.parseListIndexerWithFirst();
      }
    }

    this.expect("]");

    if (node === null) {
      this.throwUnexpected({ value: "]" });
    }

    return node;
  };

  SCParser.prototype.parseListIndexerWithoutFirst = function() {
    var last;

    this.lex();

    if (!this.match("]")) {
      last = this.parseExpressions();

      // [..last]
      return [ null, null, last ];
    }

    // [..]
    return [ null, null, null ];
  };

  SCParser.prototype.parseListIndexerWithFirst = function() {
    var first = null;

    if (!this.match(",")) {
      first = this.parseExpressions();
    } else {
      this.throwUnexpected(this.lookahead);
    }

    if (this.match("..")) {
      return this.parseListIndexerWithoutSecond(first);
    } else if (this.match(",")) {
      return this.parseListIndexerWithSecond(first);
    }

    // [first]
    return [ first ];
  };

  SCParser.prototype.parseListIndexerWithoutSecond = function(first) {
    var last = null;

    this.lex();

    if (!this.match("]")) {
      last = this.parseExpressions();
    }

    // [first..last]
    return [ first, null, last ];
  };

  SCParser.prototype.parseListIndexerWithSecond = function(first) {
    var second, last = null;

    this.lex();

    second = this.parseExpressions();
    if (this.match("..")) {
      this.lex();
      if (!this.match("]")) {
        last = this.parseExpressions();
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    // [first, second..last]
    return [ first, second, last ];
  };

  SCParser.prototype.parseProperty = function() {
    var token, id;
    var marker;

    marker = Marker.create(this.lexer);
    token = this.lex();

    if (token.type !== Token.Identifier || isClassName(token)) {
      this.throwUnexpected(token);
    }

    id = Node.createIdentifier(token.value);

    return marker.update().apply(id);
  };

  // 4.8 Primary Expressions
  SCParser.prototype.parseArgumentableValue = function() {
    var expr, stamp;
    var marker;

    marker = Marker.create(this.lexer);

    stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;

    switch (stamp) {
    case "#":
      expr = this.parsePrimaryHashedExpression();
      break;
    case Token.CharLiteral:
    case Token.FloatLiteral:
    case Token.FalseLiteral:
    case Token.IntegerLiteral:
    case Token.NilLiteral:
    case Token.SymbolLiteral:
    case Token.TrueLiteral:
      expr = Node.createLiteral(this.lex());
      break;
    }

    if (!expr) {
      expr = {};
      this.throwUnexpected(this.lex());
    }

    return marker.update().apply(expr);
  };

  SCParser.prototype.parsePrimaryExpression = function(node) {
    var expr, stamp;
    var marker;

    if (node) {
      return node;
    }

    marker = Marker.create(this.lexer);

    if (this.match("~")) {
      this.lex();
      expr = Node.createGlobalExpression(this.parseIdentifier());
    } else {
      stamp = this.matchAny([ "(", "{", "[", "#" ]) || this.lookahead.type;
      switch (stamp) {
      case "(":
        expr = this.parseParentheses();
        break;
      case "{":
        expr = this.parseBraces();
        break;
      case "[":
        expr = this.parseListInitialiser();
        break;
      case Token.Keyword:
        expr = this.parsePrimaryKeywordExpression();
        break;
      case Token.Identifier:
        expr = this.parsePrimaryIdentifier();
        break;
      case Token.StringLiteral:
        expr = this.parsePrimaryStringExpression();
        break;
      default:
        expr = this.parseArgumentableValue(stamp);
        break;
      }
    }

    return marker.update().apply(expr);
  };

  SCParser.prototype.parsePrimaryHashedExpression = function() {
    var expr, lookahead;

    lookahead = this.lookahead;

    this.lex();

    switch (this.matchAny([ "[", "{" ])) {
    case "[":
      expr = this.parsePrimaryImmutableListExpression(lookahead);
      break;
    case "{":
      expr = this.parsePrimaryClosedFunctionExpression();
      break;
    default:
      expr = {};
      this.throwUnexpected(this.lookahead);
      break;
    }

    return expr;
  };

  SCParser.prototype.parsePrimaryImmutableListExpression = function(lookahead) {
    var expr;

    if (this.state.immutableList) {
      this.throwUnexpected(lookahead);
    }

    this.state.immutableList = true;
    expr = this.parseListInitialiser();
    this.state.immutableList = false;

    return expr;
  };

  SCParser.prototype.parsePrimaryClosedFunctionExpression = function() {
    var expr, disallowGenerator, closedFunction;

    disallowGenerator = this.state.disallowGenerator;
    closedFunction    = this.state.closedFunction;

    this.state.disallowGenerator = true;
    this.state.closedFunction    = true;
    expr = this.parseBraces();
    this.state.closedFunction    = closedFunction;
    this.state.disallowGenerator = disallowGenerator;

    return expr;
  };

  SCParser.prototype.parsePrimaryKeywordExpression = function() {
    if (Keywords[this.lookahead.value] === "keyword") {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createThisExpression(this.lex().value);
  };

  SCParser.prototype.parsePrimaryIdentifier = function() {
    var expr, lookahead;

    lookahead = this.lookahead;

    expr = this.parseIdentifier();

    if (expr.name === "_") {
      expr.name = "$_" + this.state.underscore.length.toString();
      this.state.underscore.push(expr);
    }

    return expr;
  };

  SCParser.prototype.isInterpolatedString = function(value) {
    var re = /(^|[^\x5c])#\{/;
    return re.test(value);
  };

  SCParser.prototype.parsePrimaryStringExpression = function() {
    var token;

    token = this.lex();

    if (this.isInterpolatedString(token.value)) {
      return this.parseInterpolatedString(token.value);
    }

    return Node.createLiteral(token);
  };

  SCParser.prototype.parseInterpolatedString = function(value) {
    var len, items;
    var index1, index2, code, parser;

    len = value.length;
    items = [];

    index1 = 0;

    do {
      index2 = findString$InterpolatedString(value, index1);
      if (index2 >= len) {
        break;
      }
      code = value.substr(index1, index2 - index1);
      if (code) {
        items.push('"' + code + '"');
      }

      index1 = index2 + 2;
      index2 = findExpression$InterpolatedString(value, index1, items);

      code = value.substr(index1, index2 - index1);
      if (code) {
        items.push("(" + code + ").asString");
      }

      index1 = index2 + 1;
    } while (index1 < len);

    if (index1 < len) {
      items.push('"' + value.substr(index1) + '"');
    }

    code = items.join("++");
    parser = new SCParser(code, {});

    return parser.parseExpression();
  };

  // ( ... )
  SCParser.prototype.parseParentheses = function() {
    var marker, expr, generator;

    marker = Marker.create(this.lexer);

    this.expect("(");

    if (this.match(":")) {
      this.lex();
      generator = true;
    }

    if (this.lookahead.type === Token.Label) {
      expr = this.parseObjectInitialiser();
    } else if (this.match("var")) {
      expr = this.withScope(function() {
        var body;
        body = this.parseFunctionBody(")");
        return Node.createBlockExpression(body);
      });
    } else if (this.match("..")) {
      expr = this.parseSeriesInitialiser(null, generator);
    } else if (this.match(")")) {
      expr = Node.createObjectExpression([]);
    } else {
      expr = this.parseParenthesesGuess(generator, marker);
    }

    this.expect(")");

    marker.update().apply(expr);

    return expr;
  };

  SCParser.prototype.parseParenthesesGuess = function(generator) {
    var node, expr;

    node = this.parseExpression();
    if (this.matchAny([ ",", ".." ])) {
      expr = this.parseSeriesInitialiser(node, generator);
    } else if (this.match(":")) {
      expr = this.parseObjectInitialiser(node);
    } else if (this.match(";")) {
      expr = this.parseExpressions(node);
      if (this.matchAny([ ",", ".." ])) {
        expr = this.parseSeriesInitialiser(expr, generator);
      }
    } else {
      expr = this.parseExpression(node);
    }

    return expr;
  };

  SCParser.prototype.parseObjectInitialiser = function(node) {
    var elements = [], innerElements;

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    if (node) {
      this.expect(":");
    } else {
      node = this.parseLabelAsSymbol();
    }
    elements.push(node, this.parseExpression());

    if (this.match(",")) {
      this.lex();
    }

    while (this.lookahead.type !== Token.EOF && !this.match(")")) {
      if (this.lookahead.type === Token.Label) {
        node = this.parseLabelAsSymbol();
      } else {
        node = this.parseExpression();
        this.expect(":");
      }
      elements.push(node, this.parseExpression());
      if (!this.match(")")) {
        this.expect(",");
      }
    }

    this.state.innerElements = innerElements;

    return Node.createObjectExpression(elements);
  };

  SCParser.prototype.parseSeriesInitialiser = function(node, generator) {
    var method, innerElements;
    var items = [];

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    method = Node.createIdentifier(generator ? "seriesIter" : "series");
    method = Marker.create(this.lexer).apply(method);

    if (node === null) {
      // (..), (..last)
      items = this.parseSeriesInitialiserWithoutFirst(generator);
    } else {
      items = this.parseSeriesInitialiserWithFirst(node, generator);
    }

    this.state.innerElements = innerElements;

    return Node.createCallExpression(items.shift(), method, { list: items });
  };

  SCParser.prototype.parseSeriesInitialiserWithoutFirst = function(generator) {
    var first, last = null;

    // (..last)
    first = {
      type: Syntax.Literal,
      value: "0",
      valueType: Token.IntegerLiteral
    };
    first = Marker.create(this.lexer).apply(first);

    this.expect("..");
    if (this.match(")")) {
      if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    } else {
      last = this.parseExpressions();
    }

    return [ first, null, last ];
  };

  SCParser.prototype.parseSeriesInitialiserWithFirst = function(node, generator) {
    var first, second = null, last = null;

    first = node;
    if (this.match(",")) {
      // (first, second .. last)
      this.lex();
      second = this.parseExpressions();
      if (Array.isArray(second) && second.length === 0) {
        this.throwUnexpected(this.lookahead);
      }
      this.expect("..");
      if (!this.match(")")) {
        last = this.parseExpressions();
      } else if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    } else {
      // (first..last)
      this.lex();
      if (!this.match(")")) {
        last = this.parseExpressions();
      } else if (!generator) {
        this.throwUnexpected(this.lookahead);
      }
    }

    return [ first, second, last ];
  };

  SCParser.prototype.parseListInitialiser = function() {
    var elements, innerElements;

    elements = [];

    innerElements = this.state.innerElements;
    this.state.innerElements = true;

    this.expect("[");

    while (this.lookahead.type !== Token.EOF && !this.match("]")) {
      if (this.lookahead.type === Token.Label) {
        elements.push(this.parseLabelAsSymbol(), this.parseExpression());
      } else {
        elements.push(this.parseExpression());
        if (this.match(":")) {
          this.lex();
          elements.push(this.parseExpression());
        }
      }
      if (!this.match("]")) {
        this.expect(",");
      }
    }

    this.expect("]");

    this.state.innerElements = innerElements;

    return Node.createListExpression(elements, this.state.immutableList);
  };

  // { ... }
  SCParser.prototype.parseBraces = function(blocklist) {
    var expr;
    var marker;

    marker = Marker.create(this.lexer);

    this.expect("{");

    if (this.match(":")) {
      if (!this.state.disallowGenerator) {
        this.lex();
        expr = this.parseGeneratorInitialiser();
      } else {
        expr = {};
        this.throwUnexpected(this.lookahead);
      }
    } else {
      expr = this.parseFunctionExpression(this.state.closedFunction, blocklist);
    }

    this.expect("}");

    return marker.update().apply(expr);
  };

  SCParser.prototype.parseGeneratorInitialiser = function() {
    this.lexer.throwError({}, Message.NotImplemented, "generator literal");

    this.parseExpression();
    this.expect(",");

    while (this.lookahead.type !== Token.EOF && !this.match("}")) {
      this.parseExpression();
      if (!this.match("}")) {
        this.expect(",");
      }
    }

    return Node.createLiteral({ value: "null", valueType: Token.NilLiteral });
  };

  SCParser.prototype.parseLabel = function() {
    var label, marker;

    marker = Marker.create(this.lexer);

    label = Node.createLabel(this.lex().value);

    return marker.update().apply(label);
  };

  SCParser.prototype.parseLabelAsSymbol = function() {
    var marker, label, node;

    marker = Marker.create(this.lexer);

    label = this.parseLabel();
    node  = {
      type: Syntax.Literal,
      value: label.name,
      valueType: Token.SymbolLiteral
    };

    node = marker.update().apply(node);

    return node;
  };

  SCParser.prototype.parseIdentifier = function() {
    var expr;
    var marker;

    marker = Marker.create(this.lexer);

    if (this.lookahead.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    expr = this.lex();
    expr = Node.createIdentifier(expr.value);

    return marker.update().apply(expr);
  };

  SCParser.prototype.parseVariableIdentifier = function() {
    var token, value, ch;
    var id, marker;

    marker = Marker.create(this.lexer);

    token = this.lex();
    value = token.value;

    if (token.type !== Token.Identifier) {
      this.throwUnexpected(token);
    } else {
      ch = value.charAt(0);
      if (("A" <= ch && ch <= "Z") || ch === "_") {
        this.throwUnexpected(token);
      }
    }

    id = Node.createIdentifier(value);

    return marker.update().apply(id);
  };

  var renameGetterToSetter = function(methodName) {
    switch (methodName) {
    case "at"        : return "put";
    case "copySeries": return "putSeries";
    }
    return methodName + "_";
  };

  var calcBinaryPrecedence = function(token, binaryPrecedence) {
    var prec = 0;

    switch (token.type) {
    case Token.Punctuator:
      if (token.value !== "=") {
        if (binaryPrecedence.hasOwnProperty(token.value)) {
          prec = binaryPrecedence[token.value];
        } else if (/^[-+*\/%<=>!?&|@]+$/.test(token.value)) {
          prec = 255;
        }
      }
      break;
    case Token.Label:
      prec = 255;
      break;
    }

    return prec;
  };

  var isClassName = function(node) {
    var name, ch;

    if (node.type === Syntax.Identifier) {
      name = node.value || node.name;
      ch = name.charAt(0);
      return "A" <= ch && ch <= "Z";
    }

    return false;
  };

  var isLeftHandSide = function(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.GlobalExpression:
      return true;
    }
    return false;
  };

  var isValidArgumentValue = function(node) {
    if (node.type === Syntax.Literal) {
      return true;
    }
    if (node.type === Syntax.ListExpression) {
      return node.elements.every(function(node) {
        return node.type === Syntax.Literal;
      });
    }

    return false;
  };

  var findString$InterpolatedString = function(value, index) {
    var len, ch;

    len = value.length;

    while (index < len) {
      ch = value.charAt(index);
      if (ch === "#") {
        if (value.charAt(index + 1) === "{") {
          break;
        }
      } else if (ch === "\\") {
        index += 1;
      }
      index += 1;
    }

    return index;
  };

  var findExpression$InterpolatedString = function(value, index) {
    var len, depth, ch;

    len = value.length;

    depth = 0;
    while (index < len) {
      ch = value.charAt(index);
      if (ch === "}") {
        if (depth === 0) {
          break;
        }
        depth -= 1;
      } else if (ch === "{") {
        depth += 1;
      }
      index += 1;
    }

    return index;
  };

  parser.parse = function(source, opts) {
    var instance, ast;

    opts = opts || /* istanbul ignore next */ {};

    instance = new SCParser(source, opts);
    ast = instance.parse();

    if (!!opts.tolerant && typeof instance.lexer.errors !== "undefined") {
      ast.errors = instance.lexer.errors;
    }

    return ast;
  };

  sc.lang.compiler.parser = parser;

})(sc);

// src/sc/libs/random.js
(function(sc) {

  var random = {};

  function RandGen(seed) {
    this.setSeed(seed);
  }

  RandGen.prototype.setSeed = function(seed) {
    if (typeof seed !== "number") {
      seed = Date.now();
    }
    seed += ~(seed <<  15);
    seed ^=   seed >>> 10;
    seed +=   seed <<  3;
    seed ^=   seed >>> 6;
    seed += ~(seed <<  11);
    seed ^=   seed >>> 16;

    this.x = 1243598713 ^ seed;
    this.y = 3093459404 ^ seed;
    this.z = 1821928721 ^ seed;

    return this;
  };

  RandGen.prototype.trand = function() {
    this.x = ((this.x & 4294967294) << 12) ^ (((this.x << 13) ^ this.x) >>> 19);
    this.y = ((this.y & 4294967288) <<  4) ^ (((this.y <<  2) ^ this.y) >>> 25);
    this.z = ((this.z & 4294967280) << 17) ^ (((this.z <<  3) ^ this.z) >>> 11);
    return this.x ^ this.y ^ this.z;
  };

  RandGen.prototype.next = function() {
    return (this.trand() >>> 0) / 4294967296;
  };

  RandGen.prototype.RandGen = RandGen;

  random = {
    RandGen: RandGen,
    current: new RandGen(),
    next: function() {
      return random.current.next();
    },
    setSeed: function(seed) {
      return random.current.setSeed(seed);
    }
  };

  sc.libs.random = random;

})(sc);

// src/sc/libs/mathlib.js
(function(sc) {

  var rand = sc.libs.random;
  var mathlib = {};

  mathlib.rand = function(a) {
    return rand.next() * a;
  };

  mathlib["+"] = function(a, b) {
    return a + b;
  };

  mathlib["-"] = function(a, b) {
    return a - b;
  };

  mathlib["*"] = function(a, b) {
    return a * b;
  };

  mathlib["/"] = function(a, b) {
    return a / b;
  };

  mathlib.mod = function(a, b) {
    if (a === 0 || b === 0) {
      return 0;
    }
    if ((a > 0 && b < 0) || (a < 0 && b > 0)) {
      return b + a % b;
    }
    return a % b;
  };

  mathlib.div = function(a, b) {
    if (b === 0) {
      return a|0;
    }
    return (a / b)|0;
  };

  mathlib.pow = function(a, b) {
    return Math.pow(a, b);
  };

  mathlib.min = Math.min;
  mathlib.max = Math.max;

  mathlib.bitAnd = function(a, b) {
    return a & b;
  };

  mathlib.bitOr = function(a, b) {
    return a | b;
  };

  mathlib.bitXor = function(a, b) {
    return a ^ b;
  };

  var gcd = function(a, b) {
    var t;

    a = a|0;
    b = b|0;

    while (b !== 0) {
      t = a % b;
      a = b;
      b = t;
    }

    return Math.abs(a);
  };

  mathlib.lcm = function(a, b) {
    if (a === 0 && b === 0) {
      return 0;
    }
    return Math.abs((a|0) * (b|0)) / gcd(a, b);
  };

  mathlib.gcd = function(a, b) {
    return gcd(a, b);
  };

  mathlib.round = function(a, b) {
    return b === 0 ? a : Math.round(a / b) * b;
  };

  mathlib.roundUp = function(a, b) {
    return b === 0 ? a : Math.ceil(a / b) * b;
  };

  mathlib.trunc = function(a, b) {
    return b === 0 ? a : Math.floor(a / b) * b;
  };

  mathlib.atan2 = Math.atan2;

  mathlib.hypot = function(a, b) {
    return Math.sqrt((a * a) + (b * b));
  };

  mathlib.hypotApx = function(a, b) {
    var x = Math.abs(a);
    var y = Math.abs(b);
    var minxy = Math.min(x, y);
    return x + y - (Math.sqrt(2) - 1) * minxy;
  };

  mathlib.leftShift = function(a, b) {
    if (b < 0) {
      return a >> -b;
    }
    return a << b;
  };

  mathlib.rightShift = function(a, b) {
    if (b < 0) {
      return a << -b;
    }
    return a >> b;
  };

  mathlib.unsignedRightShift = function(a, b) {
    if (b < 0) {
      return (a << -b) >>> 0;
    }
    return a >>> b;
  };

  mathlib.ring1 = function(a, b) {
    return a * b + a;
  };

  mathlib.ring2 = function(a, b) {
    return a * b + a + b;
  };

  mathlib.ring3 = function(a, b) {
    return a * a * b;
  };

  mathlib.ring4 = function(a, b) {
    return a * a * b - a * b * b;
  };

  mathlib.difsqr = function(a, b) {
    return a * a - b * b;
  };

  mathlib.sumsqr = function(a, b) {
    return a * a + b * b;
  };

  mathlib.sqrsum = function(a, b) {
    return (a + b) * (a + b);
  };

  mathlib.sqrdif = function(a, b) {
    return (a - b) * (a - b);
  };

  mathlib.absdif = function(a, b) {
    return Math.abs(a - b);
  };

  mathlib.thresh = function(a, b) {
    return a < b ? 0 : a;
  };

  mathlib.amclip = function(a, b) {
    return a * 0.5 * (b + Math.abs(b));
  };

  mathlib.scaleneg = function(a, b) {
    b = 0.5 * b + 0.5;
    return (Math.abs(a) - a) * b + a;
  };

  mathlib.clip2 = function(a, b) {
    return Math.max(-b, Math.min(a, b));
  };

  mathlib.fold2 = function(a, b) {
    var x, c, range, range2;

    if (b === 0) {
      return 0;
    }

    x = a + b;
    if (a >= b) {
      a = b + b - a;
      if (a >= -b) {
        return a;
      }
    } else if (a < -b) {
      a = -b - b - a;
      if (a < b) {
        return a;
      }
    } else {
      return a;
    }

    range  = b + b;
    range2 = range + range;
    c = x - range2 * Math.floor(x / range2);

    if (c >= range) {
      c = range2 - c;
    }

    return c - b;
  };

  mathlib.wrap2 = function(a, b) {
    var range;

    if (b === 0) {
      return 0;
    }

    if (a >= b) {
      range = b + b;
      a -= range;
      if (a < b) {
        return a;
      }
    } else if (a < -b) {
      range = b + b;
      a += range;
      if (a >= -b) {
        return a;
      }
    } else {
      return a;
    }

    return a - range * Math.floor((a + b) / range);
  };

  mathlib.excess = function(a, b) {
    return a - Math.max(-b, Math.min(a, b));
  };

  mathlib.firstArg = function(a) {
    return a;
  };

  mathlib.rrand = function(a, b) {
    return a + rand.next() * (b - a);
  };

  mathlib.exprand = function(a, b) {
    return a * Math.exp(Math.log(b / a) * rand.next());
  };

  mathlib.clip = function(val, lo, hi) {
    return Math.max(lo, Math.min(val, hi));
  };

  mathlib.iwrap = function(val, lo, hi) {
    var range;

    range = hi - lo + 1;
    val -= range * Math.floor((val - lo) / range);

    return val;
  };

  mathlib.wrap = function(val, lo, hi) {
    var range;

    if (hi === lo) {
      return lo;
    }

    range = (hi - lo);
    if (val >= hi) {
      val -= range;
      if (val < hi) {
        return val;
      }
    } else if (val < lo) {
      val += range;
      if (val >= lo) {
        return val;
      }
    } else {
      return val;
    }

    return val - range * Math.floor((val - lo) / range);
  };

  mathlib.ifold = function(val, lo, hi) {
    var x, range1, range2;

    range1 = hi - lo;
    range2 = range1 * 2;
    x = val - lo;
    x -= range2 * Math.floor(x / range2);

    if (x >= range1) {
      return range2 - x + lo;
    }

    return x + lo;
  };

  mathlib.fold = function(val, lo, hi) {
    var x, range1, range2;

    if (hi === lo) {
      return lo;
    }

    if (val >= hi) {
      val = (hi * 2) - val;
      if (val >= lo) {
        return val;
      }
    } else if (val < lo) {
      val = (lo * 2) - val;
      if (val < hi) {
        return val;
      }
    } else {
      return val;
    }

    range1 = hi - lo;
    range2 = range1 * 2;
    x = val - lo;
    x -= range2 * Math.floor(x / range2);

    if (x >= range1) {
      return range2 - x + lo;
    }

    return x + lo;
  };

  mathlib.clip_idx = function(index, len) {
    return Math.max(0, Math.min(index, len - 1));
  };

  mathlib.wrap_idx = function(index, len) {
    index = index % len;
    if (index < 0) {
      index += len;
    }
    return index;
  };

  mathlib.fold_idx = function(index, len) {
    var len2 = len * 2 - 2;

    index = (index|0) % len2;
    if (index < 0) {
      index += len2;
    }
    if (len <= index) {
      return len2 - index;
    }
    return index;
  };

  sc.libs.mathlib = mathlib;

})(sc);

// src/sc/lang/io.js
(function(sc) {

  var io = {};

  var SCScript = sc.SCScript;
  var buffer   = "";

  io.post = function(msg) {
    var items;

    items  = (buffer + msg).split("\n");
    buffer = items.pop();

    items.forEach(function(msg) {
      SCScript.stdout(msg);
    });
  };

  sc.lang.io = io;

})(sc);

// src/sc/lang/dollarSC.js
(function(sc) {

  var $SC = function(name) {
    return sc.lang.klass.get(name);
  };

  /* istanbul ignore next */
  var shouldBeImplementedInClassLib = function() {};

  $SC.Class = shouldBeImplementedInClassLib;
  $SC.Integer = shouldBeImplementedInClassLib;
  $SC.Float = shouldBeImplementedInClassLib;
  $SC.Char = shouldBeImplementedInClassLib;
  $SC.Array = shouldBeImplementedInClassLib;
  $SC.String = shouldBeImplementedInClassLib;
  $SC.Function = shouldBeImplementedInClassLib;
  $SC.Ref = shouldBeImplementedInClassLib;
  $SC.Symbol = shouldBeImplementedInClassLib;
  $SC.Boolean = shouldBeImplementedInClassLib;
  $SC.True = shouldBeImplementedInClassLib;
  $SC.False = shouldBeImplementedInClassLib;
  $SC.Nil = shouldBeImplementedInClassLib;

  sc.lang.$SC = $SC;

})(sc);

// src/sc/lang/fn.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var _getDefaultValue = function(value) {
    var ch;

    switch (value) {
    case "nil":
      return $SC.Nil();
    case "true":
      return $SC.True();
    case "false":
      return $SC.False();
    case "inf":
      return $SC.Float(Infinity);
    case "-inf":
      return $SC.Float(-Infinity);
    }

    ch = value.charAt(0);
    switch (ch) {
    case "$":
      return $SC.Char(value.charAt(1));
    case "\\":
      return $SC.Symbol(value.substr(1));
    }

    if (value.indexOf(".") !== -1) {
      return $SC.Float(+value);
    }

    return $SC.Integer(+value);
  };

  var getDefaultValue = function(value) {
    if (value.charAt(0) === "[") {
      return $SC.Array(value.slice(1, -2).split(",").map(function(value) {
        return _getDefaultValue(value.trim());
      }));
    }
    return _getDefaultValue(value);
  };

  var fn = function(func, def) {
    var argItems, argNames, argVals;
    var remain, wrapper;

    argItems = def.split(/\s*;\s*/);
    if (argItems[argItems.length - 1].charAt(0) === "*") {
      remain = !!argItems.pop();
    }

    argNames = new Array(argItems.length);
    argVals  = new Array(argItems.length);

    argItems.forEach(function(items, i) {
      items = items.split("=");
      argNames[i] = items[0].trim();
      argVals [i] = getDefaultValue(items[1] || "nil");
    });

    wrapper = function() {
      var given, args;

      given = slice.call(arguments);
      args  = argVals.slice();

      if (isDictionary(given[given.length - 1])) {
        setKeywordArguments(args, argNames, given.pop());
      }

      copy(args, given, Math.min(argNames.length, given.length));

      if (remain) {
        args.push($SC.Array(given.slice(argNames.length)));
      }

      return func.apply(this, args);
    };

    wrapper._argNames = argNames;
    wrapper._argVals  = argVals;

    return wrapper;
  };

  var isDictionary = function(obj) {
    return !!(obj && obj.constructor === Object);
  };

  var copy = function(args, given, length) {
    for (var i = 0; i < length; ++i) {
      if (given[i]) {
        args[i] = given[i];
      }
    }
  };

  var setKeywordArguments = function(args, argNames, dict) {
    Object.keys(dict).forEach(function(key) {
      var index = argNames.indexOf(key);
      if (index !== -1) {
        args[index] = dict[key];
      }
    });
  };

  sc.lang.fn = fn;

})(sc);

// src/sc/lang/klass/klass.js
(function(sc) {

  var slice = [].slice;
  var $SC = sc.lang.$SC;

  var klass       = {};
  var metaClasses = {};
  var classes     = klass.classes = {};

  var createClassInstance = function(MetaSpec) {
    var instance = new SCClass();
    instance._MetaSpec = MetaSpec;
    return instance;
  };

  var extend = function(constructor, superMetaClass) {
    function F() {}
    F.prototype = superMetaClass._Spec.prototype;
    constructor.prototype = new F();

    function Meta_F() {}
    Meta_F.prototype = superMetaClass._MetaSpec.prototype;

    function MetaSpec() {}
    MetaSpec.prototype = new Meta_F();

    constructor.metaClass = createClassInstance(MetaSpec);
  };

  var def = function(className, constructor, fn, opts) {
    var classMethods, instanceMethods, setMethod, spec;

    classMethods    = constructor.metaClass._MetaSpec.prototype;
    instanceMethods = constructor.prototype;

    setMethod = function(methods, methodName, func) {
      var bond;
      if (methods.hasOwnProperty(methodName) && !opts.force) {
        bond = methods === classMethods ? "." : "#";
        throw new Error(
          "sc.lang.klass.refine: " +
            className + bond + methodName + " is already defined."
        );
      }
      methods[methodName] = func;
    };

    if (typeof fn === "function") {
      fn(spec = {}, klass.utils);
    } else {
      spec = fn;
    }

    Object.keys(spec).forEach(function(methodName) {
      if (methodName.charCodeAt(0) === 0x24) { // u+0024 is '$'
        setMethod(classMethods, methodName.substr(1), spec[methodName]);
      } else {
        setMethod(instanceMethods, methodName, spec[methodName]);
      }
    });
  };

  var throwIfInvalidArgument = function(constructor, className) {
    if (typeof constructor !== "function") {
      throw new Error(
        "sc.lang.klass.define: " +
          "first argument must be a constructor, but got: " + typeof(constructor)
      );
    }

    if (typeof className !== "string") {
      throw new Error(
        "sc.lang.klass.define: " +
          "second argument must be a string, but got: " + String(className)
      );
    }
  };

  var throwIfInvalidClassName = function(className, superClassName) {
    var ch0 = className.charCodeAt(0);

    if (ch0 < 0x41 || 0x5a < ch0) { // faster test than !/^[A-Z]/.test(className)
      throw new Error(
        "sc.lang.klass.define: " +
          "classname should be CamelCase, but got '" + className + "'"
      );
    }

    if (metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.define: " +
          "class '" + className + "' is already registered."
      );
    }

    if (className !== "Object") {
      if (!metaClasses.hasOwnProperty(superClassName)) {
        throw new Error(
          "sc.lang.klass.define: " +
            "superclass '" + superClassName + "' is not registered."
        );
      }
    }
  };

  var buildClass = function(className, constructor) {
    var newClass, metaClass;

    metaClass = constructor.metaClass;

    newClass = new metaClass._MetaSpec();
    newClass._name = className;
    newClass._Spec = constructor;
    constructor.prototype.__class = newClass;
    constructor.prototype.__Spec  = constructor;
    constructor.prototype.__className = className;

    metaClass._Spec = constructor;
    metaClass._isMetaClass = true;
    metaClass._name = "Meta_" + className;

    classes["Meta_" + className] = metaClass;
    classes[className] = newClass;

    if (newClass.initClass) {
      newClass.initClass();
    }

    metaClasses[className] = metaClass;
  };

  klass.define = function(constructor, className, fn) {
    var items, superClassName;

    throwIfInvalidArgument(constructor, className);

    items = className.split(":");
    className      = items[0].trim();
    superClassName = (items[1] || "Object").trim();

    throwIfInvalidClassName(className, superClassName);

    if (className !== "Object") {
      extend(constructor, metaClasses[superClassName]);
    }

    fn = fn || {};

    def(className, constructor, fn, {});

    buildClass(className, constructor);
  };

  klass.refine = function(className, fn, opts) {
    var constructor;

    if (!metaClasses.hasOwnProperty(className)) {
      throw new Error(
        "sc.lang.klass.refine: " +
          "class '" + className + "' is not registered."
      );
    }

    constructor = metaClasses[className]._Spec;

    def(className, constructor, fn, opts || {});
  };

  klass.get = function(name) {
    if (!classes[name]) {
      throw new Error(
        "sc.lang.klass.get: " +
          "class '" + name + "' is not registered."
      );
    }
    return classes[name];
  };

  klass.exists = function(name) {
    return !!classes[name];
  };

  // basic classes
  function SCObject() {
    this._ = this;
  }

  function SCClass() {
    this._ = this;
    this._name = "Class";
    this._Spec = null;
    this._isMetaClass = false;
  }

  SCObject.metaClass = createClassInstance(function() {});
  klass.define(SCObject, "Object", {
    __tag: 1,
    __initializeWith__: function(className, args) {
      metaClasses[className]._Spec.apply(this, args);
    },
    $initClass: function() {}
  });

  klass.define(SCClass, "Class");

  SCObject.metaClass._MetaSpec.prototype = classes.Class = createClassInstance();
  classes.Class._Spec = SCClass;
  classes.Object = new SCObject.metaClass._MetaSpec();
  classes.Object._name = "Object";
  classes.Object._Spec = SCObject.metaClass._Spec;
  classes.Object._Spec.prototype.__class = classes.Object;
  classes.Object._Spec.prototype.__Spec = classes.Object._Spec;

  klass.refine("Object", function(spec) {
    spec.$new = function() {
      if (this._Spec === SCClass) {
        return $SC.Nil();
      }
      return new this._Spec(slice.call(arguments));
    };

    spec.class = function() {
      return this.__class;
    };

    spec.isClass = function() {
      return $SC.False();
    };

    spec.isKindOf = function($aClass) {
      return $SC.Boolean(this instanceof $aClass._Spec);
    };

    spec.isMemberOf = function($aClass) {
      return $SC.Boolean(this.__class === $aClass);
    };

    spec.toString = function() {
      var name = this.__class._name;
      if (/^[AEIOU]/.test(name)) {
        return String("an " + name);
      } else {
        return String("a " + name);
      }
    };

    spec.valueOf = function() {
      return this._;
    };
  });

  klass.refine("Class", function(spec) {
    spec.name = function() {
      return $SC.String(this._name);
    };

    spec.class = function() {
      if (this._isMetaClass) {
        return classes.Class;
      }
      return $SC("Meta_" + this._name);
    };

    spec.isClass = function() {
      return $SC.True();
    };

    spec.toString = function() {
      return String(this._name);
    };
  });

  sc.lang.klass = klass;

})(sc);

// src/sc/lang/klass/constructors.js
(function(sc) {

  var $SC   = sc.lang.$SC;
  var fn    = sc.lang.fn;
  var klass = sc.lang.klass;

  function SCNil() {
    this.__initializeWith__("Object");
    this._ = null;
  }
  klass.define(SCNil, "Nil", {
    __tag: 773
  });

  function SCSymbol() {
    this.__initializeWith__("Object");
    this._ = "";
  }
  klass.define(SCSymbol, "Symbol", {
    __tag: 1027
  });

  function SCBoolean() {
    this.__initializeWith__("Object");
  }
  klass.define(SCBoolean, "Boolean");

  function SCTrue() {
    this.__initializeWith__("Boolean");
    this._ = true;
  }
  klass.define(SCTrue, "True : Boolean", {
    __tag: 775
  });

  function SCFalse() {
    this.__initializeWith__("Boolean");
    this._ = false;
  }
  klass.define(SCFalse, "False : Boolean", {
    __tag: 774
  });

  function SCMagnitude() {
    this.__initializeWith__("Object");
  }
  klass.define(SCMagnitude, "Magnitude");

  function SCChar() {
    this.__initializeWith__("Magnitude");
    this._ = "\0";
  }
  klass.define(SCChar, "Char : Magnitude", {
    __tag: 1028
  });

  function SCNumber() {
    this.__initializeWith__("Magnitude");
  }
  klass.define(SCNumber, "Number : Magnitude");

  function SCSimpleNumber() {
    this.__initializeWith__("Number");
  }
  klass.define(SCSimpleNumber, "SimpleNumber : Number");

  function SCInteger() {
    this.__initializeWith__("SimpleNumber");
    this._ = 0;
  }
  klass.define(SCInteger, "Integer : SimpleNumber", {
    __tag: 770
  });

  function SCFloat() {
    this.__initializeWith__("SimpleNumber");
    this._ = 0.0;
  }
  klass.define(SCFloat, "Float : SimpleNumber", {
    __tag: 777
  });

  function SCCollection() {
    this.__initializeWith__("Object");
  }
  klass.define(SCCollection, "Collection");

  function SCSequenceableCollection() {
    this.__initializeWith__("Collection");
  }
  klass.define(SCSequenceableCollection, "SequenceableCollection : Collection");

  function SCArrayedCollection() {
    this.__initializeWith__("SequenceableCollection");
    this._immutable = false;
    this._ = [];
  }
  klass.define(SCArrayedCollection, "ArrayedCollection : SequenceableCollection");

  function SCRawArray() {
    this.__initializeWith__("ArrayedCollection");
  }
  klass.define(SCRawArray, "RawArray : ArrayedCollection");

  function SCArray() {
    this.__initializeWith__("ArrayedCollection");
  }
  klass.define(SCArray, "Array : ArrayedCollection", {
    __tag: 11
  });

  function SCString(value) {
    this.__initializeWith__("RawArray");
    this._ = value;
  }
  klass.define(SCString, "String : RawArray", {
    __tag: 1034
  });

  function SCAbstractFunction() {
    this.__initializeWith__("Object");
  }
  klass.define(SCAbstractFunction, "AbstractFunction");

  function SCFunction() {
    this.__initializeWith__("AbstractFunction");
    // istanbul ignore next
    this._ = function() {};
  }
  klass.define(SCFunction, "Function : AbstractFunction", {
    __tag: 12
  });

  function SCRef(args) {
    this.__initializeWith__("Object");
    this._value = args[0] || /* istanbul ignore next */ $nil;
  }
  sc.lang.klass.define(SCRef, "Ref : AbstractFunction");

  function SCInterpreter() {
    this.__initializeWith__("Object");
  }
  klass.define(SCInterpreter, "Interpreter");

  // $SC
  var $nil      = new SCNil();
  var $true     = new SCTrue();
  var $false    = new SCFalse();
  var $integers = {};
  var $floats   = {};
  var $symbols  = {};
  var $chars    = {};

  $SC.Nil = function() {
    return $nil;
  };

  $SC.Boolean = function($value) {
    return $value ? $true : $false;
  };

  $SC.True = function() {
    return $true;
  };

  $SC.False = function() {
    return $false;
  };

  $SC.Integer = function(value) {
    var instance;

    if (!global.isFinite(value)) {
      return $SC.Float(+value);
    }

    value = value|0;

    if (!$integers.hasOwnProperty(value)) {
      instance = new SCInteger();
      instance._ = value;
      $integers[value] = instance;
    }

    return $integers[value];
  };

  $SC.Float = function(value) {
    var instance;

    value = +value;

    if (!$floats.hasOwnProperty(value)) {
      instance = new SCFloat();
      instance._ = value;
      $floats[value] = instance;
    }

    return $floats[value];
  };

  $SC.Symbol = function(value) {
    var instance;
    if (!$symbols.hasOwnProperty(value)) {
      instance = new SCSymbol();
      instance._ = value;
      $symbols[value] = instance;
    }
    return $symbols[value];
  };

  $SC.Char = function(value) {
    var instance;

    value = String(value).charAt(0);

    if (!$chars.hasOwnProperty(value)) {
      instance = new SCChar();
      instance._ = value;
      $chars[value] = instance;
    }

    return $chars[value];
  };

  $SC.Array = function(value, immutable) {
    var instance = new SCArray();
    instance._ = value || [];
    instance._immutable = !!immutable;
    return instance;
  };

  $SC.String = function(value, immutable) {
    var instance = new SCString();
    instance._ = String(value).split("").map($SC.Char);
    instance._immutable = !!immutable;
    return instance;
  };

  $SC.Function = function(value, def) {
    var instance = new SCFunction();
    instance._ = def ? fn(value, def) : value;
    return instance;
  };

  $SC.Ref = function(value) {
    return new SCRef([ value ]);
  };

  sc.lang.klass.$interpreter = new SCInterpreter();

})(sc);

// src/sc/lang/klass/utils.js
(function(sc) {

  var $SC   = sc.lang.$SC;
  var klass = sc.lang.klass;

  var utils = {
    BOOL: function(a) {
      return a.__bool__();
    },
    $nil  : $SC.Nil(),
    $true : $SC.True(),
    $false: $SC.False(),
    $int_0: $SC.Integer(0),
    $int_1: $SC.Integer(1),
    nop: function() {
      return this;
    },
    alwaysReturn$nil  : $SC.Nil,
    alwaysReturn$true : $SC.True,
    alwaysReturn$false: $SC.False,
    alwaysReturn$int_0: function() {
      return utils.$int_0;
    },
    alwaysReturn$int_1: function() {
      return utils.$int_1;
    },
    getMethod: function(className, methodName) {
      return klass.get(className)._Spec.prototype[methodName];
    }
  };

  klass.utils = utils;

})(sc);

// src/sc/lang/iterator.js
(function(sc) {

  var iterator = {};
  var $SC   = sc.lang.$SC;
  var utils = sc.lang.klass.utils;
  var $nil   = utils.$nil;
  var $int_0 = utils.$int_0;
  var $int_1 = utils.$int_1;
  var BOOL   = utils.BOOL;

  var __stop__ = function() {
    return null;
  };

  var nop_iter = {
    next: __stop__
  };

  var one_shot_iter = function(value) {
    var iter = {
      next: function() {
        iter.next = __stop__;
        return value;
      }
    };
    return iter;
  };

  // TODO: async function
  iterator.execute = function(iter, $function) {
    var $item, ret, i = 0;

    while (($item = iter.next()) !== null) {
      if (Array.isArray($item)) {
        ret = $function.value($item[0], $item[1]);
      } else {
        ret = $function.value($item, $SC.Integer(i++));
      }
      if (ret === 65535) {
        break;
      }
    }
  };

  iterator.object$do = one_shot_iter;

  iterator.function$while = function($function) {
    var iter = {
      next: function() {
        if (BOOL($function.value())) {
          return [ $nil, $nil ];
        }
        iter.next = __stop__;
        return null;
      }
    };

    return iter;
  };

  var sc_incremental_iter = function($start, $end, $step) {
    var $i = $start, iter = {
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i > $end) {
          iter.next = __stop__;
        }
        return $ret;
      }
    };
    return iter;
  };

  var sc_decremental_iter = function($start, $end, $step) {
    var $i = $start, iter = {
      next: function() {
        var $ret = $i;
        $i = $i ["+"] ($step);
        if ($i < $end) {
          iter.next = __stop__;
        }
        return $ret;
      }
    };
    return iter;
  };

  var sc_numeric_iter = function($start, $end, $step) {
    if ($start.valueOf() === $end.valueOf()) {
      return one_shot_iter($start);
    } else if ($start < $end && $step > 0) {
      return sc_incremental_iter($start, $end, $step);
    } else if ($start > $end && $step < 0) {
      return sc_decremental_iter($start, $end, $step);
    }
    return nop_iter;
  };

  iterator.number$do = function($end) {
    var $start, $step;

    $start = $int_0;
    $end   = $end.__dec__();
    $step  = $int_1;

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$reverseDo = function($start) {
    var $end, $step;

    $start = $start.__dec__();
    $end   = $int_0;
    $step  = $SC.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$for = function($start, $end) {
    var $step;

    $step = ($start <= $end) ? $int_1 : $SC.Integer(-1);

    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forBy = function($start, $end, $step) {
    return sc_numeric_iter($start, $end, $step);
  };

  iterator.number$forSeries = function($start, $second, $last) {
    var $step;

    $step   = $second ["-"] ($start);

    return sc_numeric_iter($start, $last, $step);
  };

  var js_incremental_iter = function(start, end, step, type) {
    var i = start, iter = {
      next: function() {
        var ret = i;
        i += step;
        if (i > end) {
          iter.next = __stop__;
        }
        return type(ret);
      }
    };
    return iter;
  };

  var js_decremental_iter = function(start, end, step, type) {
    var i = start, iter = {
      next: function() {
        var ret = i;
        i += step;
        if (i < end) {
          iter.next = __stop__;
        }
        return type(ret);
      }
    };
    return iter;
  };

  var js_numeric_iter = function(start, end, step, type) {
    if (start === end) {
      return one_shot_iter(type(start));
    } else if (start < end && step > 0) {
      return js_incremental_iter(start, end, step, type);
    } else if (start > end && step < 0) {
      return js_decremental_iter(start, end, step, type);
    }
    return nop_iter;
  };

  var js_numeric_iter$do = function($endval, type) {
    var end = type($endval.__num__()).valueOf();
    return js_numeric_iter(0, end - 1, +1, type);
  };

  var js_numeric_iter$reverseDo = function($startval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = (start|0) - start;
    return js_numeric_iter(start - 1, end, -1, type);
  };

  var js_numeric_iter$for = function($startval, $endval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = (start <= end) ? +1 : -1;

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forBy = function($startval, $endval, $stepval, type) {
    var start = type($startval.__num__()).valueOf();
    var end   = type($endval  .__num__()).valueOf();
    var step  = type($stepval .__num__()).valueOf();

    return js_numeric_iter(start, end, step, type);
  };

  var js_numeric_iter$forSeries = function($startval, $second, $last, type) {
    var start  = type($startval.__num__()).valueOf();
    var second = type($second  .__num__()).valueOf();
    var end    = type($last    .__num__()).valueOf();
    var step = second - start;

    return js_numeric_iter(start, end, step, type);
  };

  iterator.integer$do = function($endval) {
    return js_numeric_iter$do($endval, $SC.Integer);
  };

  iterator.integer$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $SC.Integer);
  };

  iterator.integer$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $SC.Integer);
  };

  iterator.integer$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $SC.Integer);
  };

  iterator.integer$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $SC.Integer);
  };

  iterator.float$do = function($endval) {
    return js_numeric_iter$do($endval, $SC.Float);
  };

  iterator.float$reverseDo = function($startval) {
    return js_numeric_iter$reverseDo($startval, $SC.Float);
  };

  iterator.float$for = function($startval, $endval) {
    return js_numeric_iter$for($startval, $endval, $SC.Float);
  };

  iterator.float$forBy = function($startval, $endval, $stepval) {
    return js_numeric_iter$forBy($startval, $endval, $stepval, $SC.Float);
  };

  iterator.float$forSeries = function($startval, $second, $last) {
    return js_numeric_iter$forSeries($startval, $second, $last, $SC.Float);
  };

  var list_iter = function(list) {
    var i = 0, iter = {
      next: function() {
        var $ret = list[i++];
        if (i >= list.length) {
          iter.next = __stop__;
        }
        return $ret;
      }
    };
    return iter;
  };

  var js_array_iter = function(list) {
    if (list.length) {
      return list_iter(list);
    }
    return nop_iter;
  };

  iterator.array$do = function($array) {
    return js_array_iter($array._.slice());
  };

  iterator.array$reverseDo = function($array) {
    return js_array_iter($array._.slice().reverse());
  };

  sc.lang.iterator = iterator;

})(sc);

// src/sc/lang/classlib.js
(function(sc) {

  sc.lang.classlib = {};

})(sc);

// src/sc/lang/classlib/Core/Object.js
(function(sc) {

  var slice = [].slice;
  var fn    = sc.lang.fn;
  var $SC   = sc.lang.$SC;

  sc.lang.klass.refine("Object", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.__num__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__int__ = function() {
      return this.__num__()|0;
    };

    spec.__bool__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__sym__ = function() {
      throw new Error("Wrong Type");
    };

    spec.__str__ = function() {
      return String(this);
    };

    // TODO: implements $new
    // TODO: implements $newCopyArgs

    spec.$newFrom = function() {
      return this._doesNotUnderstand("newFrom");
    };

    // TODO: implements dump

    spec.post = function() {
      this.asString().post();
      return this;
    };

    spec.postln = function() {
      this.asString().postln();
      return this;
    };

    spec.postc = function() {
      this.asString().postc();
      return this;
    };

    spec.postcln = function() {
      this.asString().postcln();
      return this;
    };

    // TODO: implements postcs
    // TODO: implements totalFree
    // TODO: implements largestFreeBlock
    // TODO: implements gcDumpGrey
    // TODO: implements gcDumpSet
    // TODO: implements gcInfo
    // TODO: implements gcSanity
    // TODO: implements canCallOS

    spec.size = utils.alwaysReturn$int_0;
    spec.indexedSize = utils.alwaysReturn$int_0;
    spec.flatSize = utils.alwaysReturn$int_1;

    spec.do = function($function) {
      sc.lang.iterator.execute(
        sc.lang.iterator.object$do(this),
        $function
      );

      return this;
    };

    spec.generate = fn(function($function, $state) {
      this.do($function);

      return $state;
    }, "function; state");

    // already defined: class
    // already defined: isKindOf
    // already defined: isMemberOf

    spec.respondsTo = fn(function($aSymbol) {
      return $SC.Boolean(typeof this[$aSymbol.__sym__()] === "function");
    }, "aSymbol");

    // TODO: implements performMsg

    spec.perform = function($selector) {
      var selector, method;

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, slice.call(arguments, 1));
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.performList = function($selector, $arglist) {
      var selector, method;

      selector = $selector.__sym__();
      method = this[selector];

      if (method) {
        return method.apply(this, $arglist.asArray()._);
      }

      throw new Error("Message '" + selector + "' not understood.");
    };

    spec.functionPerformList = utils.nop;

    // TODO: implements superPerform
    // TODO: implements superPerformList
    // TODO: implements tryPerform
    // TODO: implements multiChannelPerform
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs

    var copy = function(obj) {
      var copied = obj;

      if (Array.isArray(obj)) {
        copied = obj.slice();
      } else if (obj && obj.constructor === Object) {
        copied = {};
        Object.keys(obj).forEach(function(key) {
          copied[key] = obj[key];
        });
      }

      return copied;
    };

    spec.copy = function() {
      return this.shallowCopy();
    };

    // TODO: implements contentsCopy

    spec.shallowCopy = function() {
      var a = new this.__class._Spec();

      Object.keys(this).forEach(function(key) {
        a[key] = copy(this[key]);
      }, this);

      if (this._ === this) {
        a._ = a;
      }

      return a;
    };

    // TODO: implements copyImmutable
    // TODO: implements deepCopy

    spec.dup = fn(function($n) {
      var $this = this;
      var $array, i, imax;

      if (BOOL($n.isSequenceableCollection())) {
        return SCArray.fillND($n, $SC.Function(function() {
          return $this.copy();
        }));
      }

      $array = SCArray.new($n);
      for (i = 0, imax = $n.__int__(); i < imax; ++i) {
        $array.add(this.copy());
      }

      return $array;
    }, "n=2");

    spec["!"] = function($n) {
      return this.dup($n);
    };

    spec.poll = function() {
      return this.value();
    };

    spec.value = utils.nop;
    spec.valueArray = utils.nop;
    spec.valueEnvir = utils.nop;
    spec.valueArrayEnvir = utils.nop;

    spec["=="] = function($obj) {
      return this ["==="] ($obj);
    };

    spec["!="] = function($obj) {
      return (this ["=="] ($obj)).not();
    };

    spec["==="] = function($obj) {
      return $SC.Boolean(this === $obj);
    };

    spec["!=="] = function($obj) {
      return $SC.Boolean(this !== $obj);
    };

    // TODO: implements equals
    // TODO: implements compareObject
    // TODO: implements instVarHash
    // TODO: implements basicHash
    // TODO: implements hash
    // TODO: implements identityHash

    spec["->"] = function($obj) {
      return $SC("Association").new(this, $obj);
    };

    spec.next = utils.nop;
    spec.reset = utils.nop;

    spec.first = fn(function($inval) {
      this.reset();
      return this.next($inval);
    }, "inval");

    spec.iter = function() {
      return $SC("OneShotStream").new(this);
    };

    spec.stop = utils.nop;
    spec.free = utils.nop;
    spec.clear = utils.nop;
    spec.removedFromScheduler = utils.nop;
    spec.isPlaying = utils.alwaysReturn$false;

    spec.embedInStream = function() {
      return this.yield();
    };

    // TODO: implements cyc
    // TODO: implements fin
    // TODO: implements repeat
    // TODO: implements loop

    spec.asStream = utils.nop;

    // TODO: implements streamArg

    spec.eventAt = utils.alwaysReturn$nil;

    spec.composeEvents = fn(function($event) {
      return $event.copy();
    }, "event");

    spec.finishEvent = utils.nop;
    spec.atLimit = utils.alwaysReturn$false;
    spec.isRest = utils.alwaysReturn$false;
    spec.threadPlayer = utils.nop;
    spec.threadPlayer_ = utils.nop;
    spec["?"] = utils.nop;
    spec["??"] = utils.nop;

    spec["!?"] = function($obj) {
      return $obj.value(this);
    };

    spec.isNil = utils.alwaysReturn$false;
    spec.notNil = utils.alwaysReturn$true;
    spec.isNumber = utils.alwaysReturn$false;
    spec.isInteger = utils.alwaysReturn$false;
    spec.isFloat = utils.alwaysReturn$false;
    spec.isSequenceableCollection = utils.alwaysReturn$false;
    spec.isCollection = utils.alwaysReturn$false;
    spec.isArray = utils.alwaysReturn$false;
    spec.isString = utils.alwaysReturn$false;
    spec.containsSeqColl = utils.alwaysReturn$false;
    spec.isValidUGenInput = utils.alwaysReturn$false;
    spec.isException = utils.alwaysReturn$false;
    spec.isFunction = utils.alwaysReturn$false;

    spec.matchItem = fn(function($item) {
      return this ["==="] ($item);
    }, "item");

    spec.trueAt = utils.alwaysReturn$false;

    spec.falseAt = fn(function($key) {
      return this.trueAt($key).not();
    }, "key");

    // TODO: implements pointsTo
    // TODO: implements mutable
    // TODO: implements frozen
    // TODO: implements halt
    // TODO: implements primitiveFailed
    // TODO: implements reportError
    // TODO: implements subclassResponsibility
    spec._subclassResponsibility = function(methodName) {
      throw new Error("RECEIVER " + String(this) + ": " +
                      "'" + methodName + "' should have been implemented by subclass");
    };

    // TODO: implements doesNotUnderstand
    spec._doesNotUnderstand = function(methodName) {
      throw new Error("RECEIVER " + this.__str__() + ": " +
                      "Message '" + methodName + "' not understood.");
    };

    // TODO: implements shouldNotImplement
    // TODO: implements outOfContextReturn
    // TODO: implements immutableError
    // TODO: implements deprecated
    // TODO: implements mustBeBoolean
    // TODO: implements notYetImplemented
    // TODO: implements dumpBackTrace
    // TODO: implements getBackTrace
    // TODO: implements throw

    spec.species = function() {
      return this.class();
    };

    spec.asCollection = function() {
      return $SC.Array([ this ]);
    };

    spec.asSymbol = function() {
      return this.asString().asSymbol();
    };

    spec.asString = function() {
      return $SC.String(String(this));
    };

    // TODO: implements asCompileString
    // TODO: implements cs
    // TODO: implements printClassNameOn
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeParamsOn
    // TODO: implements simplifyStoreArgs
    // TODO: implements storeArgs
    // TODO: implements storeModifiersOn

    spec.as = fn(function($aSimilarClass) {
      return $aSimilarClass.newFrom(this);
    }, "aSimilarClass");

    spec.dereference = utils.nop;

    spec.reference = function() {
      return $SC.Ref(this);
    };

    spec.asRef = function() {
      return $SC.Ref(this);
    };

    spec.asArray = function() {
      return this.asCollection().asArray();
    };

    spec.asSequenceableCollection = function() {
      return this.asArray();
    };

    spec.rank = utils.alwaysReturn$int_0;

    spec.deepCollect = fn(function($depth, $function, $index, $rank) {
      return $function.value(this, $index, $rank);
    }, "depth; function; index; rank");

    spec.deepDo = fn(function($depth, $function, $index, $rank) {
      $function.value(this, $index, $rank);
      return this;
    }, "depth; function; index; rank");

    spec.slice = utils.nop;
    spec.shape = utils.alwaysReturn$nil;
    spec.unbubble = utils.nop;

    spec.bubble = fn(function($depth, $levels) {
      var levels, a;

      levels = $levels.__int__();
      if (levels <= 1) {
        a = [ this ];
      } else {
        a = [
          this.bubble($depth, $SC.Integer(levels - 1))
        ];
      }

      return $SC.Array(a);
    }, "depth; levels");

    spec.obtain = fn(function($index, $default) {
      if ($index.__num__() === 0) {
        return this;
      } else {
        return $default;
      }
    }, "index; defaults");

    spec.instill = fn(function($index, $item, $default) {
      if ($index.__num__() === 0) {
        return $item;
      } else {
        return this.asArray().instill($index, $item, $default);
      }
    }, "index; item; default");

    spec.addFunc = fn(function($$functions) {
      return $SC("FunctionList").new(this ["++"] ($$functions));
    }, "*functions");

    spec.removeFunc = function($function) {
      if (this === $function) {
        return $nil;
      }
      return this;
    };

    spec.replaceFunc = fn(function($find, $replace) {
      if (this === $find) {
        return $replace;
      }
      return this;
    }, "find; replace");

    // TODO: implements addFuncTo
    // TODO: implements removeFuncFrom

    spec.while = fn(function($body) {
      var $this = this;

      $SC.Function(function() {
        return $this.value();
      }).while($SC.Function(function() {
        return $body.value();
      }));

      return this;
    }, "body");

    spec.switch = function() {
      var args, i, imax;

      args = slice.call(arguments);
      for (i = 0, imax = args.length >> 1; i < imax; i++) {
        if (BOOL(this ["=="] (args[i * 2]))) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    };

    spec.yield = function() {
      // TODO: implements yield
    };

    // TODO: implements alwaysYield
    // TODO: implements yieldAndReset
    // TODO: implements idle
    // TODO: implements $initClass
    // TODO: implements dependants
    // TODO: implements changed
    // TODO: implements addDependant
    // TODO: implements removeDependant
    // TODO: implements release
    // TODO: implements releaseDependants
    // TODO: implements update
    // TODO: implements addUniqueMethod
    // TODO: implements removeUniqueMethods
    // TODO: implements removeUniqueMethod
    // TODO: implements inspect
    // TODO: implements inspectorClass
    // TODO: implements inspector
    // TODO: implements crash
    // TODO: implements stackDepth
    // TODO: implements dumpStack
    // TODO: implements dumpDetailedBackTrace
    // TODO: implements freeze

    spec["&"] = function($that) {
      return this.bitAnd($that);
    };

    spec["|"] = function($that) {
      return this.bitOr($that);
    };

    spec["%"] = function($that) {
      return this.mod($that);
    };

    spec["**"] = function($that) {
      return this.pow($that);
    };

    spec["<<"] = function($that) {
      return this.leftShift($that);
    };

    spec[">>"] = function($that) {
      return this.rightShift($that);
    };

    spec["+>>"] = function($that) {
      return this.unsignedRightShift($that);
    };

    spec["<!"] = function($that) {
      return this.firstArg($that);
    };

    spec.asInt = function() {
      return this.asInteger();
    };

    spec.blend = fn(function($that, $blendFrac) {
      return this ["+"] ($blendFrac ["*"] ($that ["-"] (this)));
    }, "that; blendFrac=0.5");

    spec.blendAt = fn(function($index, $method) {
      var $iMin;

      $iMin = $index.roundUp($int_1).asInteger().__dec__();
      return this.perform($method, $iMin).blend(
        this.perform($method, $iMin.__inc__()),
        $index.absdif($iMin)
      );
    }, "index; method=\\clipAt");

    spec.blendPut = fn(function($index, $val, $method) {
      var $iMin, $ratio;

      $iMin = $index.floor().asInteger();
      $ratio = $index.absdif($iMin);
      this.perform($method, $iMin, $val ["*"] ($int_1 ["-"] ($ratio)));
      this.perform($method, $iMin.__inc__(), $val ["*"] ($ratio));

      return this;
    }, "index; val; method=\\wrapPut");

    spec.fuzzyEqual = fn(function($that, $precision) {
      return $SC.Float(0.0).max(
        $SC.Float(1.0) ["-"] (
          (this ["-"] ($that).abs()) ["/"] ($precision)
        )
      );
    }, "that; precision=1.0");

    spec.isUGen = utils.alwaysReturn$false;
    spec.numChannels = utils.alwaysReturn$int_1;

    spec.pair = fn(function($that) {
      return $SC.Array([ this, $that ]);
    }, "that");

    spec.pairs = fn(function($that) {
      var $list;

      $list = $SC.Array();
      this.asArray().do($SC.Function(function($a) {
        $that.asArray().do($SC.Function(function($b) {
          $list = $list.add($a.asArray() ["++"] ($b));
        }));
      }));

      return $list;
    }, "that");

    spec.awake = fn(function($beats) {
      return this.next($beats);
    }, "beats");

    spec.beats_ = utils.nop;
    spec.clock_ = utils.nop;

    spec.performBinaryOpOnSomething = function($aSelector) {
      var aSelector;

      aSelector = $aSelector.__sym__();
      if (aSelector === "==") {
        return $false;
      }
      if (aSelector === "!=") {
        return $true;
      }

      throw new Error("binary operator '" + aSelector + "' failed.");
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $thig, $adverb) {
      return this.performBinaryOpOnSomething($aSelector, $thig, $adverb);
    };

    spec.performBinaryOpOnSignal  = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnComplex = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnSeqColl = spec.performBinaryOpOnSimpleNumber;
    spec.performBinaryOpOnUGen    = spec.performBinaryOpOnSimpleNumber;

    // TODO: implements writeDefFile

    spec.isInputUGen = utils.alwaysReturn$false;
    spec.isOutputUGen = utils.alwaysReturn$false;
    spec.isControlUGen = utils.alwaysReturn$false;
    spec.source = utils.nop;
    spec.asUGenInput = utils.nop;
    spec.asControlInput = utils.nop;

    spec.asAudioRateInput = function() {
      if (this.rate().__sym__() !== "audio") {
        return $SC("K2A").ar(this);
      }
      return this;
    };

    // TODO: implements slotSize
    // TODO: implements slotAt
    // TODO: implements slotPut
    // TODO: implements slotKey
    // TODO: implements slotIndex
    // TODO: implements slotsDo
    // TODO: implements slotValuesDo
    // TODO: implements getSlots
    // TODO: implements setSlots
    // TODO: implements instVarSize
    // TODO: implements instVarAt
    // TODO: implements instVarPut
    // TODO: implements writeArchive
    // TODO: implements $readArchive
    // TODO: implements asArchive
    // TODO: implements initFromArchive
    // TODO: implements archiveAsCompileString
    // TODO: implements archiveAsObject
    // TODO: implements checkCanArchive
    // TODO: implements writeTextArchive
    // TODO: implements $readTextArchive
    // TODO: implements asTextArchive
    // TODO: implements getContainedObjects
    // TODO: implements writeBinaryArchive
    // TODO: implements $readBinaryArchive
    // TODO: implements asBinaryArchive
    // TODO: implements genNext
    // TODO: implements genCurrent
    // TODO: implements $classRedirect
    // TODO: implements help
  });

})(sc);

// src/sc/lang/classlib/Core/AbstractFunction.js
(function(sc) {

  var $SC   = sc.lang.$SC;
  var fn    = sc.lang.fn;
  var utils = sc.lang.klass.utils;
  var $nil  = utils.$nil;

  sc.lang.klass.refine("AbstractFunction", function(spec, utils) {
    spec.composeUnaryOp = function($aSelector) {
      return $SC("UnaryOpFunction").new($aSelector, this);
    };

    spec.composeBinaryOp = function($aSelector, $something, $adverb) {
      return $SC("BinaryOpFunction").new($aSelector, this, $something, $adverb);
    };

    spec.reverseComposeBinaryOp = function($aSelector, $something, $adverb) {
      return $SC("BinaryOpFunction").new($aSelector, $something, this, $adverb);
    };

    spec.composeNAryOp = function($aSelector, $anArgList) {
      return $SC("NAryOpFunction").new($aSelector, this, $anArgList);
    };

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aNumber, $adverb);
    };

    spec.performBinaryOpOnSignal = function($aSelector, $aSignal, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSignal, $adverb);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aComplex, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      return this.reverseComposeBinaryOp($aSelector, $aSeqColl, $adverb);
    };

    spec.neg = function() {
      return this.composeUnaryOp($SC.Symbol("neg"));
    };

    spec.reciprocal = function() {
      return this.composeUnaryOp($SC.Symbol("reciprocal"));
    };

    spec.bitNot = function() {
      return this.composeUnaryOp($SC.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.composeUnaryOp($SC.Symbol("abs"));
    };

    spec.asFloat = function() {
      return this.composeUnaryOp($SC.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.composeUnaryOp($SC.Symbol("asInteger"));
    };

    spec.ceil = function() {
      return this.composeUnaryOp($SC.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.composeUnaryOp($SC.Symbol("floor"));
    };

    spec.frac = function() {
      return this.composeUnaryOp($SC.Symbol("frac"));
    };

    spec.sign = function() {
      return this.composeUnaryOp($SC.Symbol("sign"));
    };

    spec.squared = function() {
      return this.composeUnaryOp($SC.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.composeUnaryOp($SC.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.composeUnaryOp($SC.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.composeUnaryOp($SC.Symbol("exp"));
    };

    spec.midicps = function() {
      return this.composeUnaryOp($SC.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.composeUnaryOp($SC.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.composeUnaryOp($SC.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.composeUnaryOp($SC.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.composeUnaryOp($SC.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.composeUnaryOp($SC.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.composeUnaryOp($SC.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.composeUnaryOp($SC.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.composeUnaryOp($SC.Symbol("log"));
    };

    spec.log2 = function() {
      return this.composeUnaryOp($SC.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.composeUnaryOp($SC.Symbol("log10"));
    };

    spec.sin = function() {
      return this.composeUnaryOp($SC.Symbol("sin"));
    };

    spec.cos = function() {
      return this.composeUnaryOp($SC.Symbol("cos"));
    };

    spec.tan = function() {
      return this.composeUnaryOp($SC.Symbol("tan"));
    };

    spec.asin = function() {
      return this.composeUnaryOp($SC.Symbol("asin"));
    };

    spec.acos = function() {
      return this.composeUnaryOp($SC.Symbol("acos"));
    };

    spec.atan = function() {
      return this.composeUnaryOp($SC.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.composeUnaryOp($SC.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.composeUnaryOp($SC.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.composeUnaryOp($SC.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.composeUnaryOp($SC.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.composeUnaryOp($SC.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.composeUnaryOp($SC.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.composeUnaryOp($SC.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.composeUnaryOp($SC.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.composeUnaryOp($SC.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.composeUnaryOp($SC.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.composeUnaryOp($SC.Symbol("coin"));
    };

    spec.even = function() {
      return this.composeUnaryOp($SC.Symbol("even"));
    };

    spec.odd = function() {
      return this.composeUnaryOp($SC.Symbol("odd"));
    };

    spec.rectWindow = function() {
      return this.composeUnaryOp($SC.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.composeUnaryOp($SC.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.composeUnaryOp($SC.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.composeUnaryOp($SC.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.composeUnaryOp($SC.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.composeUnaryOp($SC.Symbol("ramp"));
    };

    spec.isPositive = function() {
      return this.composeUnaryOp($SC.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.composeUnaryOp($SC.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.composeUnaryOp($SC.Symbol("isStrictlyPositive"));
    };

    spec.rho = function() {
      return this.composeUnaryOp($SC.Symbol("rho"));
    };

    spec.theta = function() {
      return this.composeUnaryOp($SC.Symbol("theta"));
    };

    spec.rotate = function($function) {
      return this.composeBinaryOp($SC.Symbol("rotate"), $function);
    };

    spec.dist = function($function) {
      return this.composeBinaryOp($SC.Symbol("dist"), $function);
    };

    spec["+"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("+"), $function, $adverb);
    };

    spec["-"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("-"), $function, $adverb);
    };

    spec["*"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("*"), $function, $adverb);
    };

    spec["/"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("/"), $function, $adverb);
    };

    spec.div = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("div"), $function, $adverb);
    };

    spec.mod = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("mod"), $function, $adverb);
    };

    spec.pow = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("pow"), $function, $adverb);
    };

    spec.min = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("min"), $function, $adverb);
    };

    spec.max = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("max"), $function, $adverb);
    };

    spec["<"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("<"), $function, $adverb);
    };

    spec["<="] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("<="), $function, $adverb);
    };

    spec[">"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol(">"), $function, $adverb);
    };

    spec[">="] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol(">="), $function, $adverb);
    };

    spec.bitAnd = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitAnd"), $function, $adverb);
    };

    spec.bitOr = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitOr"), $function, $adverb);
    };

    spec.bitXor = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitXor"), $function, $adverb);
    };

    spec.bitHammingDistance = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("bitHammingDistance"), $function, $adverb);
    };

    spec.lcm = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("lcm"), $function, $adverb);
    };

    spec.gcd = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("gcd"), $function, $adverb);
    };

    spec.round = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("round"), $function, $adverb);
    };

    spec.roundUp = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("roundUp"), $function, $adverb);
    };

    spec.trunc = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("trunc"), $function, $adverb);
    };

    spec.atan2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("atan2"), $function, $adverb);
    };

    spec.hypot = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("hypot"), $function, $adverb);
    };

    spec.hypotApx = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("hypotApx"), $function, $adverb);
    };

    spec.leftShift = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("leftShift"), $function, $adverb);
    };

    spec.rightShift = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("rightShift"), $function, $adverb);
    };

    spec.unsignedRightShift = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("unsignedRightShift"), $function, $adverb);
    };

    spec.ring1 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring1"), $function, $adverb);
    };

    spec.ring2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring2"), $function, $adverb);
    };

    spec.ring3 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring3"), $function, $adverb);
    };

    spec.ring4 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("ring4"), $function, $adverb);
    };

    spec.difsqr = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("difsqr"), $function, $adverb);
    };

    spec.sumsqr = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("sumsqr"), $function, $adverb);
    };

    spec.sqrsum = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("sqrsum"), $function, $adverb);
    };

    spec.sqrdif = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("sqrdif"), $function, $adverb);
    };

    spec.absdif = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("absdif"), $function, $adverb);
    };

    spec.thresh = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("thresh"), $function, $adverb);
    };

    spec.amclip = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("amclip"), $function, $adverb);
    };

    spec.scaleneg = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("scaleneg"), $function, $adverb);
    };

    spec.clip2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("clip2"), $function, $adverb);
    };

    spec.fold2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("fold2"), $function, $adverb);
    };

    spec.wrap2 = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("wrap2"), $function, $adverb);
    };

    spec.excess = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("excess"), $function, $adverb);
    };

    spec.firstArg = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("firstArg"), $function, $adverb);
    };

    spec.rrand = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("rrand"), $function, $adverb);
    };

    spec.exprand = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("exprand"), $function, $adverb);
    };

    spec["@"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("@"), $function, $adverb);
    };

    spec.real = utils.nop;
    spec.imag = function() {
      return $SC.Float(0.0);
    };

    spec["||"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("||"), $function, $adverb);
    };

    spec["&&"] = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("&&"), $function, $adverb);
    };

    spec.xor = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("xor"), $function, $adverb);
    };

    spec.nand = function($function, $adverb) {
      return this.composeBinaryOp($SC.Symbol("nand"), $function, $adverb);
    };

    spec.not = function() {
      return this.composeUnaryOp($SC.Symbol("not"));
    };

    spec.ref = function() {
      return this.composeUnaryOp($SC.Symbol("asRef"));
    };

    spec.clip = function($lo, $hi) {
      return this.composeNAryOp($SC.Symbol("clip"), $SC.Array([ $lo, $hi ]));
    };

    spec.wrap = function($lo, $hi) {
      return this.composeNAryOp($SC.Symbol("wrap"), $SC.Array([ $lo, $hi ]));
    };

    spec.fold = function($lo, $hi) {
      return this.composeNAryOp($SC.Symbol("fold"), $SC.Array([ $lo, $hi ]));
    };

    spec.blend = fn(function($that, $blendFrac) {
      return this.composeNAryOp(
        $SC.Symbol("blend"), $SC.Array([ $that, $blendFrac ])
      );
    }, "that; blendFrac=0.5");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("linlin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("linexp"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("explin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("expexp"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $clip ])
      );
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("lincurve"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("curvelin"), $SC.Array([ $inMin, $inMax, $outMin, $outMax, $curve, $clip ])
      );
    }, "inMin=0; inMax=1; outMin=1; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("bilin"), $SC.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      return this.composeNAryOp(
        $SC.Symbol("biexp"), $SC.Array([
          $inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip
        ])
      );
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($function, $mod) {
      return this.composeNAryOp(
        $SC.Symbol("moddif"), $SC.Array([ $function, $mod ])
      );
    }, "function; mod");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return this.composeNAryOp(
        $SC.Symbol("degreeToKey"), $SC.Array([ $scale, $stepsPerOctave ])
      );
    }, "scale; stepsPerOctave=12");

    spec.degrad = function() {
      return this.composeUnaryOp($SC.Symbol("degrad"));
    };

    spec.raddeg = function() {
      return this.composeUnaryOp($SC.Symbol("raddeg"));
    };

    spec.applyTo = function() {
      return this.value.apply(this, arguments);
    };

    // TODO: implements <>
    // TODO: implements sampled

    spec.asUGenInput = function($for) {
      return this.value($for);
    };

    spec.asAudioRateInput = function($for) {
      var $result;

      $result = this.value($for);

      if ($result.rate().__sym__() !== "audio") {
        return $SC("K2A").ar($result);
      }

      return $result;
    };

    spec.asControlInput = function() {
      return this.value();
    };

    spec.isValidUGenInput = utils.alwaysReturn$true;
  });

  function SCUnaryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = args[0] || /* istanbul ignore next */ $nil;
    this.$a        = args[1] || /* istanbul ignore next */ $nil;
  }

  sc.lang.klass.define(SCUnaryOpFunction, "UnaryOpFunction : AbstractFunction", function(spec) {

    spec.value = function() {
      var $a = this.$a;
      return $a.value.apply($a, arguments).perform(this.$selector);
    };

    spec.valueArray = function($args) {
      return this.$a.valueArray($args).perform(this.$selector);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  function SCBinaryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = args[0] || /* istanbul ignore next */ $nil;
    this.$a        = args[1] || /* istanbul ignore next */ $nil;
    this.$b        = args[2] || /* istanbul ignore next */ $nil;
    this.$adverb   = args[3] || /* istanbul ignore next */ $nil;
  }

  sc.lang.klass.define(SCBinaryOpFunction, "BinaryOpFunction : AbstractFunction", function(spec) {

    spec.value = function() {
      return this.$a.value.apply(this.$a, arguments)
        .perform(this.$selector, this.$b.value.apply(this.$b, arguments), this.$adverb);
    };

    spec.valueArray = function($args) {
      return this.$a.valueArray($args)
        .perform(this.$selector, this.$b.valueArray($args, arguments), this.$adverb);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  function SCNAryOpFunction(args) {
    this.__initializeWith__("AbstractFunction");
    this.$selector = args[0] || /* istanbul ignore next */ $nil;
    this.$a        = args[1] || /* istanbul ignore next */ $nil;
    this.$arglist  = args[2] || /* istanbul ignore next */ $nil;
  }

  sc.lang.klass.define(SCNAryOpFunction, "NAryOpFunction : AbstractFunction", function(spec) {

    spec.value = function() {
      var args = arguments;
      return this.$a.value.apply(this.$a, args)
        .performList(this.$selector, this.$arglist.collect($SC.Function(function($_) {
          return $_.value.apply($_, args);
        })));
    };

    spec.valueArray = function($args) {
      return this.$a.valueArray($args)
        .performList(this.$selector, this.$arglist.collect($SC.Function(function($_) {
          return $_.valueArray($args);
        })));
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.functionPerformList = function($selector, $arglist) {
      return this.performList($selector, $arglist);
    };

    // TODO: implements storeOn
  });

  function SCFunctionList(args) {
    this.__initializeWith__("AbstractFunction");
    this.$array   = args[0] || /* istanbul ignore next */ $nil;
    this._flopped = false;
  }

  sc.lang.klass.define(SCFunctionList, "FunctionList : AbstractFunction", function(spec, utils) {
    var $int_0 = utils.$int_0;

    spec.array = function() {
      return this.$array;
    };

    spec.array_ = fn(function($value) {
      this.$array = $value;
      return this;
    }, "value");

    spec.flopped = function() {
      return $SC.Boolean(this._flopped);
    };

    spec.addFunc = fn(function($$functions) {
      if (this._flopped) {
        throw new Error("cannot add a function to a flopped FunctionList");
      }

      this.$array = this.$array.addAll($$functions);

      return this;
    }, "*functions");

    spec.removeFunc = function($function) {
      this.$array.remove($function);

      if (this.$array.size() < 2) {
        return this.$array.at($int_0);
      }

      return this;
    };

    spec.replaceFunc = function($find, $replace) {
      this.$array = this.$array.replace($find, $replace);
      return this;
    };

    spec.value = function() {
      var $res, args = arguments;

      $res = this.$array.collect($SC.Function(function($_) {
        return $_.value.apply($_, args);
      }));

      return this._flopped ? $res.flop() : $res;
    };

    spec.valueArray = function($args) {
      var $res;

      $res = this.$array.collect($SC.Function(function($_) {
        return $_.valueArray($args);
      }));

      return this._flopped ? $res.flop() : $res;
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir

    spec.do = function($function) {
      this.$array.do($function);
      return this;
    };

    spec.flop = function() {
      if (!this._flopped) {
        this.$array = this.$array.collect($SC.Function(function($_) {
          return $_.flop();
        }));
      }
      this._flopped = true;

      return this;
    };

    // TODO: implements envirFlop

    spec.storeArgs = function() {
      return $SC.Array([ this.$array ]);
    };

  });

})(sc);

// src/sc/lang/classlib/Streams/Stream.js
(function(sc) {

  function SCStream() {
    this.__initializeWith__("AbstractFunction");
  }

  sc.lang.klass.define(SCStream, "Stream : AbstractFunction", function() {
    // TODO: implements parent
    // TODO: implements next
    // TODO: implements iter
    // TODO: implements value
    // TODO: implements valueArray
    // TODO: implements nextN
    // TODO: implements all
    // TODO: implements put
    // TODO: implements putN
    // TODO: implements putAll
    // TODO: implements do
    // TODO: implements subSample
    // TODO: implements loop
    // TODO: implements generate
    // TODO: implements collect
    // TODO: implements reject
    // TODO: implements select
    // TODO: implements dot
    // TODO: implements interlace
    // TODO: implements ++
    // TODO: implements appendStream
    // TODO: implements collate
    // TODO: implements <>
    // TODO: implements composeUnaryOp
    // TODO: implements composeBinaryOp
    // TODO: implements reverseComposeBinaryOp
    // TODO: implements composeNAryOp
    // TODO: implements embedInStream
    // TODO: implements while
    // TODO: implements asEventStreamPlayer
    // TODO: implements play
    // TODO: implements trace
    // TODO: implements constrain
    // TODO: implements repeat
  });

  function SCPauseStream() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define(SCPauseStream, "PauseStream : Stream", function() {
    // TODO: implements stream
    // TODO: implements originalStream
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements streamHasEnded
    // TODO: implements streamHasEnded_

    // TODO: implements isPlaying
    // TODO: implements play
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements prStop
    // TODO: implements removedFromScheduler
    // TODO: implements streamError
    // TODO: implements wasStopped
    // TODO: implements canPause
    // TODO: implements pause
    // TODO: implements resume
    // TODO: implements refresh
    // TODO: implements start
    // TODO: implements stream_
    // TODO: implements next
    // TODO: implements awake
    // TODO: implements threadPlayer
  });

  function SCTask() {
    this.__initializeWith__("PauseStream");
  }

  sc.lang.klass.define(SCTask, "Task : PauseStream", function() {
    // TODO: implements storeArgs
  });

})(sc);

// src/sc/lang/classlib/Math/Magnitude.js
(function(sc) {

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Magnitude", function(spec) {
    spec["=="] = function($aMagnitude) {
      return $SC.Boolean(this.valueOf() === $aMagnitude.valueOf());
    };

    spec["!="] = function($aMagnitude) {
      return $SC.Boolean(this.valueOf() !== $aMagnitude.valueOf());
    };

    spec.hash = function() {
      return this._subclassResponsibility("hash");
    };

    spec["<"] = function($aMagnitude) {
      return $SC.Boolean(this < $aMagnitude);
    };

    spec[">"] = function($aMagnitude) {
      return $SC.Boolean(this > $aMagnitude);
    };

    spec["<="] = function($aMagnitude) {
      return $SC.Boolean(this <= $aMagnitude);
    };

    spec[">="] = function($aMagnitude) {
      return $SC.Boolean(this >= $aMagnitude);
    };

    spec.exclusivelyBetween = fn(function($lo, $hi) {
      return $SC.Boolean($lo < this && this < $hi);
    }, "lo; hi");

    spec.inclusivelyBetween = fn(function($lo, $hi) {
      return $SC.Boolean($lo <= this && this <= $hi);
    }, "lo; hi");

    spec.min = fn(function($aMagnitude) {
      return this <= $aMagnitude ? this : $aMagnitude;
    }, "aMagnitude");

    spec.max = fn(function($aMagnitude) {
      return this >= $aMagnitude ? this : $aMagnitude;
    }, "aMagnitude");

    spec.clip = fn(function($lo, $hi) {
      return this <= $lo ? $lo : this >= $hi ? $hi : this;
    }, "lo; hi");
  });

})(sc);

// src/sc/lang/classlib/Math/Number.js
(function(sc) {

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;

  sc.lang.klass.refine("Number", function(spec, utils) {
    spec.isNumber = utils.alwaysReturn$true;

    spec["+"] = function() {
      return this._subclassResponsibility("+");
    };

    spec["-"] = function() {
      return this._subclassResponsibility("-");
    };

    spec["*"] = function() {
      return this._subclassResponsibility("*");
    };

    spec["/"] = function() {
      return this._subclassResponsibility("/");
    };

    spec.mod = function() {
      return this._subclassResponsibility("mod");
    };

    spec.div = function() {
      return this._subclassResponsibility("div");
    };

    spec.pow = function() {
      return this._subclassResponsibility("pow");
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $aSeqColl, $adverb) {
      var $this = this;

      return $aSeqColl.collect($SC.Function(function($item) {
        return $item.perform($aSelector, $this, $adverb);
      }));
    };

    // TODO: implements performBinaryOpOnPoint

    spec.rho = utils.nop;

    spec.theta = function() {
      return $SC.Float(0.0);
    };

    spec.real = utils.nop;

    spec.imag = function() {
      return $SC.Float(0.0);
    };

    // TODO: implements @
    // TODO: implements complex
    // TODO: implements polar

    spec.for = fn(function($endValue, $function) {
      iterator.execute(
        iterator.number$for(this, $endValue),
        $function
      );
      return this;
    }, "endValue; function");

    spec.forBy = fn(function($endValue, $stepValue, $function) {
      iterator.execute(
        iterator.number$forBy(this, $endValue, $stepValue),
        $function
      );
      return this;
    }, "endValue; stepValue; function");

    spec.forSeries = fn(function($second, $last, $function) {
      iterator.execute(
        iterator.number$forSeries(this, $second, $last),
        $function
      );
      return this;
    }, "second; last; function");
  });

})(sc);

// src/sc/lang/classlib/Math/SimpleNumber.js
(function(sc) {

  var fn   = sc.lang.fn;
  var $SC  = sc.lang.$SC;
  var rand = sc.libs.random;

  function prOpSimpleNumber(selector, func) {
    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
      case 777:
        return $SC.Boolean(func(this._, $aNumber._));
      }

      if ($aNumber.isSequenceableCollection().valueOf()) {
        return $aNumber.performBinaryOpOnSimpleNumber(
          $SC.Symbol(selector), this, $adverb
        );
      }

      return $SC.False();
    };
  }

  sc.lang.klass.refine("SimpleNumber", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.__newFrom__ = $SC.Float;

    spec.__bool__ = function() {
      return this._ !== 0;
    };

    spec.__dec__ = function() {
      return this.__newFrom__(this._ - 1);
    };

    spec.__inc__ = function() {
      return this.__newFrom__(this._ + 1);
    };

    spec.__int__ = function() {
      if (!isFinite(this._)) {
        return this._;
      }
      return this._|0;
    };

    spec.__num__ = function() {
      return this._;
    };

    spec.isValidUGenInput = function() {
      return $SC.Boolean(!isNaN(this._));
    };

    spec.numChannels = utils.alwaysReturn$int_1;

    spec.magnitude = function() {
      return this.abs();
    };

    spec.angle = function() {
      return $SC.Float(this._ >= 0 ? 0 : Math.PI);
    };

    spec.neg = function() {
      return this.__newFrom__(-this._);
    };

    // bitNot: implemented by subclass

    spec.abs = function() {
      return this.__newFrom__(Math.abs(this._));
    };

    spec.ceil = function() {
      return this.__newFrom__(Math.ceil(this._));
    };

    spec.floor = function() {
      return this.__newFrom__(Math.floor(this._));
    };

    spec.frac = function() {
      var a = this._;

      if (a < 0) {
        return this.__newFrom__(1 + (a - (a|0)));
      }
      return this.__newFrom__(a - (a|0));
    };

    spec.sign = function() {
      var a = this._;
      return this.__newFrom__(
        a > 0 ? 1 : a === 0 ? 0 : -1
      );
    };

    spec.squared = function() {
      return this.__newFrom__(this._ * this._);
    };

    spec.cubed = function() {
      return this.__newFrom__(this._ * this._ * this._);
    };

    spec.sqrt = function() {
      return $SC.Float(Math.sqrt(this._));
    };

    spec.exp = function() {
      return $SC.Float(Math.exp(this._));
    };

    spec.reciprocal = function() {
      return $SC.Float(1 / this._);
    };

    spec.midicps = function() {
      return $SC.Float(
        440 * Math.pow(2, (this._ - 69) * 1/12)
      );
    };

    spec.cpsmidi = function() {
      return $SC.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E * 12 + 69
      );
    };

    spec.midiratio = function() {
      return $SC.Float(
        Math.pow(2, this._ * 1/12)
      );
    };

    spec.ratiomidi = function() {
      return $SC.Float(
        Math.log(Math.abs(this._)) * Math.LOG2E * 12
      );
    };

    spec.ampdb = function() {
      return $SC.Float(
        Math.log(this._) * Math.LOG10E * 20
      );
    };

    spec.dbamp = function() {
      return $SC.Float(
        Math.pow(10, this._ * 0.05)
      );
    };

    spec.octcps = function() {
      return $SC.Float(
        440 * Math.pow(2, this._ - 4.75)
      );
    };

    spec.cpsoct = function() {
      return $SC.Float(
        Math.log(Math.abs(this._) * 1/440) * Math.LOG2E + 4.75
      );
    };

    spec.log = function() {
      return $SC.Float(Math.log(this._));
    };

    spec.log2 = function() {
      return $SC.Float(Math.log(Math.abs(this._)) * Math.LOG2E);
    };

    spec.log10 = function() {
      return $SC.Float(Math.log(this._) * Math.LOG10E);
    };

    spec.sin = function() {
      return $SC.Float(Math.sin(this._));
    };

    spec.cos = function() {
      return $SC.Float(Math.cos(this._));
    };

    spec.tan = function() {
      return $SC.Float(Math.tan(this._));
    };

    spec.asin = function() {
      return $SC.Float(Math.asin(this._));
    };

    spec.acos = function() {
      return $SC.Float(Math.acos(this._));
    };

    spec.atan = function() {
      return $SC.Float(Math.atan(this._));
    };

    function _sinh(a) {
      return (Math.pow(Math.E, a) - Math.pow(Math.E, -a)) * 0.5;
    }

    spec.sinh = function() {
      return $SC.Float(_sinh(this._));
    };

    function _cosh(a) {
      return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) * 0.5;
    }

    spec.cosh = function() {
      return $SC.Float(_cosh(this._));
    };

    spec.tanh = function() {
      return $SC.Float(_sinh(this._) / _cosh(this._));
    };

    spec.rand = function() {
      return this.__newFrom__(
        rand.next() * this._
      );
    };

    spec.rand2 = function() {
      return this.__newFrom__(
        (rand.next() * 2 - 1) * this._
      );
    };

    spec.linrand = function() {
      return this.__newFrom__(
        Math.min(rand.next(), rand.next()) * this._
      );
    };

    spec.bilinrand = function() {
      return this.__newFrom__(
        (rand.next() - rand.next()) * this._
      );
    };

    spec.sum3rand = function() {
      return this.__newFrom__(
        (rand.next() + rand.next() + rand.next() - 1.5) * 2/3 * this._
      );
    };

    spec.distort = function() {
      return $SC.Float(
        this._ / (1 + Math.abs(this._))
      );
    };

    spec.softclip = function() {
      var a = this._, abs_a = Math.abs(a);
      return $SC.Float(abs_a <= 0.5 ? a : (abs_a - 0.25) / a);
    };

    spec.coin = function() {
      return $SC.Boolean(rand.next() < this._);
    };

    spec.isPositive = function() {
      return $SC.Boolean(this._ >= 0);
    };

    spec.isNegative = function() {
      return $SC.Boolean(this._ < 0);
    };

    spec.isStrictlyPositive = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.isNaN = function() {
      return $SC.Boolean(isNaN(this._));
    };

    spec.asBoolean = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.booleanValue = function() {
      return $SC.Boolean(this._ > 0);
    };

    spec.binaryValue = function() {
      return this._ > 0 ? $int_1 : $int_0;
    };

    spec.rectWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(1);
    };

    spec.hanWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(0.5 - 0.5 * Math.cos(a * 2 * Math.PI));
    };

    spec.welWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      return $SC.Float(Math.sin(a * Math.PI));
    };

    spec.triWindow = function() {
      var a = this._;
      if (a < 0 || 1 < a) {
        return $SC.Float(0);
      }
      if (a < 0.5) {
        return $SC.Float(2 * a);
      }
      return $SC.Float(-2 * a + 2);
    };

    spec.scurve = function() {
      var a = this._;
      if (a <= 0) {
        return $SC.Float(0);
      }
      if (1 <= a) {
        return $SC.Float(1);
      }
      return $SC.Float(a * a * (3 - 2 * a));
    };

    spec.ramp = function() {
      var a = this._;
      if (a <= 0) {
        return $SC.Float(0);
      }
      if (1 <= a) {
        return $SC.Float(1);
      }
      return $SC.Float(a);
    };

    // +: implemented by subclass
    // -: implemented by subclass
    // *: implemented by subclass
    // /: implemented by subclass
    // mod: implemented by subclass
    // div: implemented by subclass
    // pow: implemented by subclass
    // min: implemented by subclass
    // max: implemented by subclass
    // bitAnd: implemented by subclass
    // bitOr : implemented by subclass
    // bitXor: implemented by subclass

    spec.bitTest = function($bit) {
      return $SC.Boolean(
        this.bitAnd($int_1.leftShift($bit)).valueOf() !== 0
      );
    };

    // lcm     : implemented by subclass
    // gcd     : implemented by subclass
    // round   : implemented by subclass
    // roundUp : implemented by subclass
    // trunc   : implemented by subclass
    // atan2   : implemented by subclass
    // hypot   : implemented by subclass
    // hypotApx: implemented by subclass
    // leftShift         : implemented by subclass
    // rightShift        : implemented by subclass
    // unsignedRightShift: implemented by subclass
    // ring1 : implemented by subclass
    // ring2 : implemented by subclass
    // ring3 : implemented by subclass
    // ring4 : implemented by subclass
    // difsqr: implemented by subclass
    // sumsqr: implemented by subclass
    // sqrsum: implemented by subclass
    // sqrdif: implemented by subclass
    // absdif: implemented by subclass
    // thresh: implemented by subclass
    // amclip: implemented by subclass
    // clip2 : implemented by subclass
    // fold2 : implemented by subclass
    // wrap2 : implemented by subclass
    // excess: implemented by subclass
    // firstArg: implemented by subclass
    // rrand   : implemented by subclass
    // exprand : implemented by subclass

    spec["=="] = function($aNumber) {
      return $SC.Boolean(this._ === $aNumber._);
    };

    spec["!="] = function($aNumber) {
      return $SC.Boolean(this._ !== $aNumber._);
    };

    spec["<"] = prOpSimpleNumber("<", function(a, b) {
      return a < b;
    });
    spec[">"] = prOpSimpleNumber(">", function(a, b) {
      return a > b;
    });
    spec["<="] = prOpSimpleNumber("<=", function(a, b) {
      return a <= b;
    });
    spec[">="] = prOpSimpleNumber(">=", function(a, b) {
      return a >= b;
    });

    spec.equalWithPrecision = fn(function($that, $precision) {
      return this.absdif($that) ["<"] ($precision);
    }, "that; precision=0.0001");

    // TODO: implements hash

    spec.asInteger = function() {
      return $SC.Integer(this._);
    };

    spec.asFloat = function() {
      return $SC.Float(this._);
    };

    // TODO: implements asComplex
    // TODO: implements asRect

    spec.degrad = function() {
      return $SC.Float(this._ * Math.PI / 180);
    };

    spec.raddeg = function() {
      return $SC.Float(this._ * 180 / Math.PI);
    };

    // TODO: implements performBinaryOpOnSimpleNumber
    // TODO: implements performBinaryOpOnComplex
    // TODO: implements performBinaryOpOnSignal

    spec.nextPowerOfTwo = function() {
      return $SC.Float(
        Math.pow(2, Math.ceil(Math.log(this._) / Math.log(2)))
      );
    };

    spec.nextPowerOf = fn(function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.log())).ceil()
      );
    }, "base");

    spec.nextPowerOfThree = function() {
      return $SC.Float(
        Math.pow(3, Math.ceil(Math.log(this._) / Math.log(3)))
      );
    };

    spec.previousPowerOf = fn(function($base) {
      return $base.pow(
        (this.log() ["/"] ($base.log())).ceil().__dec__()
      );
    }, "base");

    spec.quantize = fn(function($quantum, $tolerance, $strength) {
      var $round, $diff;

      $round = this.round($quantum);
      $diff = $round ["-"] (this);

      if ($diff.abs() < $tolerance) {
        return this ["+"] ($strength ["*"] ($diff));
      }

      return this;
    }, "quantum=1.0; tolerance=0.05; strength=1.0");

    spec.linlin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (this-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
        $res = ((this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
              ["*"] ($outMax ["-"] ($outMin)) ["+"] ($outMin));
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.linexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, (this-inMin)/(inMax-inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin))
        ) ["*"] ($outMin);
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.explin = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // (((Math.log(this/inMin)) / (Math.log(inMax/inMin))) * (outMax-outMin)) + outMin;
        $res = ((this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
                 ["*"] ($outMax ["-"] ($outMin))) ["+"] ($outMin));
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.expexp = fn(function($inMin, $inMax, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        // Math.pow(outMax/outMin, Math.log(this/inMin) / Math.log(inMax/inMin)) * outMin;
        $res = $outMax ["/"] ($outMin).pow(
          this ["/"] ($inMin).log() ["/"] ($inMax ["/"] ($inMin).log())
        ) ["*"] ($outMin);
      }

      return $res;
    }, "inMin; inMax; outMin; outMax; clip=\\minmax");

    spec.lincurve = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b, $scaled;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $outMax ["-"] ($outMin) ["/"] ($SC.Float(1.0) ["-"] ($grow));
          $b = $outMin ["+"] ($a);
          $scaled = (this ["-"] ($inMin)) ["/"] ($inMax ["-"] ($inMin));

          $res = $b ["-"] ($a ["*"] ($grow.pow($scaled)));
        }
      }

      return $res;
    }, "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax");

    spec.curvelin = fn(function($inMin, $inMax, $outMin, $outMax, $curve, $clip) {
      var $res = null, $grow, $a, $b;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (Math.abs($curve.valueOf()) < 0.001) {
          $res = this.linlin($inMin, $inMax, $outMin, $outMax);
        } else {
          $grow = $curve.exp();
          $a = $inMax ["-"] ($inMin) ["/"] ($SC.Float(1.0) ["-"] ($grow));
          $b = $inMin ["+"] ($a);

          $res = ((($b ["-"] (this)) ["/"] ($a)).log()
                  ["*"] ($outMax ["-"] ($outMin)) ["/"] ($curve) ["+"] ($outMin));
        }
      }

      return $res;
    }, "inMin=0; inMax=1; outMin=0; outMax=1; curve=-4; clip=\\minmax");

    spec.bilin = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.linlin($inCenter, $inMax, $outCenter, $outMax, $SC.Symbol("none"));
        } else {
          $res = this.linlin($inMin, $inCenter, $outMin, $outCenter, $SC.Symbol("none"));
        }
      }

      return $res;
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.biexp = fn(function($inCenter, $inMin, $inMax, $outCenter, $outMin, $outMax, $clip) {
      var $res = null;

      $res = clip_for_map(this, $inMin, $inMax, $outMin, $outMax, $clip);

      if ($res === null) {
        if (this >= $inCenter) {
          $res = this.explin($inCenter, $inMax, $outCenter, $outMax, $SC.Symbol("none"));
        } else {
          $res = this.explin($inMin, $inCenter, $outMin, $outCenter, $SC.Symbol("none"));
        }
      }

      return $res;
    }, "inCenter; inMin; inMax; outCenter; outMin; outMax; clip=\\minmax");

    spec.moddif = fn(function($aNumber, $mod) {
      var $diff, $modhalf;

      $diff = this.absdif($aNumber) ["%"] ($mod);
      $modhalf = $mod ["*"] ($SC.Float(0.5));

      return $modhalf ["-"] ($diff.absdif($modhalf));
    }, "aNumber=0.0; mod=1.0");

    spec.lcurve = fn(function($a, $m, $n, $tau) {
      var $rTau, $x;

      $x = this.neg();

      if ($tau.__num__() === 1.0) {
        // a * (m * exp(x) + 1) / (n * exp(x) + 1)
        return $a ["*"] (
          $m ["*"] ($x.exp()).__inc__()
        ) ["/"] (
          $n ["*"] ($x.exp()).__inc__()
        );
      } else {
        $rTau = $tau.reciprocal();
        return $a ["*"] (
          $m ["*"] ($x.exp()) ["*"] ($rTau).__inc__()
        ) ["/"] (
          $n ["*"] ($x.exp()) ["*"] ($rTau).__inc__()
        );
      }
    }, "a=1.0; m=0.0; n=1.0; tau=1.0");

    spec.gauss = fn(function($standardDeviation) {
      // ^((((-2*log(1.0.rand)).sqrt * sin(2pi.rand)) * standardDeviation) + this)
      return ($SC.Float(-2.0) ["*"] ($SC.Float(1.0).rand().log()).sqrt() ["*"] (
        $SC.Float(2 * Math.PI).rand().sin()
      ) ["*"] ($standardDeviation)) ["+"] (this);
    }, "standardDeviation");

    spec.gaussCurve = fn(function($a, $b, $c) {
      // ^a * (exp(squared(this - b) / (-2.0 * squared(c))))
      return $a ["*"] ((
        (this ["-"] ($b).squared()) ["/"] ($SC.Float(-2.0) ["*"] ($c.squared()))
      ).exp());
    }, "a=1.0; b=0.0; c=1.0");

    // TODO: implements asPoint
    // TODO: implements asWarp

    spec.wait = function() {
      return this.yield();
    };

    // TODO: implements waitUntil
    // TODO: implements sleep
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.rate = function() {
      return $SC.Symbol("scalar");
    };

    spec.asAudioRateInput = function() {
      if (this._ === 0) {
        return $SC("Silent").ar();
      }
      return $SC("DC").ar(this);
    };

    spec.madd = fn(function($mul, $add) {
      return (this ["*"] ($mul)) ["+"] ($add);
    }, "mul; add");

    spec.lag = utils.nop;
    spec.lag2 = utils.nop;
    spec.lag3 = utils.nop;
    spec.lagud = utils.nop;
    spec.lag2ud = utils.nop;
    spec.lag3ud = utils.nop;
    spec.varlag = utils.nop;
    spec.slew = utils.nop;

    // TODO: implements writeInputSpec

    spec.series = fn(function($second, $last) {
      var $step;
      var last, step, size;

      if ($second === $nil) {
        if (this.valueOf() < $last.valueOf()) {
          $second = this.__inc__();
        } else {
          $second = this.__dec__();
        }
      }
      $step = $second ["-"] (this);

      last = $last.__num__();
      step = $step.__num__();
      size = (Math.floor((last - this._) / step + 0.001)|0) + 1;

      return SCArray.series($SC.Integer(size), this, $step);
    }, "second; last");

    // TODO: implements seriesIter
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInList
    // TODO: implements nearestInScale
    // TODO: implements partition
    // TODO: implements nextTimeOnGrid
    // TODO: implements playAndDelta
    // TODO: implements asQuant
    // TODO: implements asTimeString
    // TODO: implements asFraction
    // TODO: implements asBufWithValues
    // TODO: implements schedBundleArrayOnClock

    spec.shallowCopy = utils.nop;
  });

  function clip_for_map($this, $inMin, $inMax, $outMin, $outMax, $clip) {

    switch ($clip.__sym__()) {
    case "minmax":
      if ($this <= $inMin) {
        return $outMin;
      }
      if ($this >= $inMax) {
        return $outMax;
      }
      break;
    case "min":
      if ($this <= $inMin) {
        return $outMin;
      }
      break;
    case "max":
      if ($this >= $inMax) {
        return $outMax;
      }
      break;
    }

    return null;
  }

})(sc);

// src/sc/lang/classlib/Math/bop.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var mathlib = sc.libs.mathlib;

  sc.lang.classlib.bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return type1(func(this._, $aNumber._));
      case 777:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol(selector), this, $adverb
      );
    };
  };

})(sc);

// src/sc/lang/classlib/Math/Integer.js
(function(sc) {

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  sc.lang.klass.refine("Integer", function(spec, utils) {
    var $nil   = utils.$nil;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.__newFrom__ = $SC.Integer;

    spec.__int__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String("" + this._);
    };

    spec.$new = function() {
      throw new Error("Integer.new is illegal, should use literal.");
    };

    spec.isInteger = utils.alwaysReturn$true;

    // TODO: implements hash

    [
      [ "+", $SC.Integer, $SC.Float ],
      [ "-", $SC.Integer, $SC.Float ],
      [ "*", $SC.Integer, $SC.Float ],
      [ "/", $SC.Float  , $SC.Float ],
      [ "mod"     , $SC.Integer, $SC.Float   ],
      [ "div"     , $SC.Integer, $SC.Integer ],
      [ "pow"     , $SC.Float  , $SC.Float   ],
      [ "min"     , $SC.Integer, $SC.Float   ],
      [ "max"     , $SC.Integer, $SC.Float   ],
      [ "bitAnd"  , $SC.Integer, $SC.Float   ],
      [ "bitOr"   , $SC.Integer, $SC.Float   ],
      [ "bitXor"  , $SC.Integer, $SC.Float   ],
      [ "lcm"     , $SC.Integer, $SC.Float   ],
      [ "gcd"     , $SC.Integer, $SC.Float   ],
      [ "round"   , $SC.Integer, $SC.Float   ],
      [ "roundUp" , $SC.Integer, $SC.Float   ],
      [ "trunc"   , $SC.Integer, $SC.Float   ],
      [ "atan2"   , $SC.Float  , $SC.Float   ],
      [ "hypot"   , $SC.Float  , $SC.Float   ],
      [ "hypotApx", $SC.Float  , $SC.Float   ],
      [ "leftShift"         , $SC.Integer, $SC.Float ],
      [ "rightShift"        , $SC.Integer, $SC.Float ],
      [ "unsignedRightShift", $SC.Integer, $SC.Float ],
      [ "ring1"   , $SC.Integer, $SC.Float   ],
      [ "ring2"   , $SC.Integer, $SC.Float   ],
      [ "ring3"   , $SC.Integer, $SC.Float   ],
      [ "ring4"   , $SC.Integer, $SC.Float   ],
      [ "difsqr"  , $SC.Integer, $SC.Float   ],
      [ "sumsqr"  , $SC.Integer, $SC.Float   ],
      [ "sqrsum"  , $SC.Integer, $SC.Float   ],
      [ "sqrdif"  , $SC.Integer, $SC.Float   ],
      [ "absdif"  , $SC.Integer, $SC.Float   ],
      [ "thresh"  , $SC.Integer, $SC.Integer ],
      [ "amclip"  , $SC.Integer, $SC.Float   ],
      [ "scaleneg", $SC.Integer, $SC.Float   ],
      [ "clip2"   , $SC.Integer, $SC.Float   ],
      [ "fold2"   , $SC.Integer, $SC.Float   ],
      [ "excess"  , $SC.Integer, $SC.Float   ],
      [ "firstArg", $SC.Integer, $SC.Integer ],
      [ "rrand"   , $SC.Integer, $SC.Float   ],
      [ "exprand" , $SC.Float  , $SC.Float   ],
    ].forEach(function(items) {
      spec[items[0]] = sc.lang.classlib.bop.apply(null, items);
    });

    spec.wrap2 = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return $SC.Integer(mathlib.iwrap(this._, -$aNumber._, $aNumber._));
      case 777:
        return $SC.Float(mathlib.wrap2(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol("wrap2"), this, $adverb
      );
    };

    spec.rrand = function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case 770:
        return $SC.Integer(Math.round(mathlib.rrand(this._, $aNumber._)));
      case 777:
        return $SC.Float(mathlib.rrand(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol("rrand"), this, $adverb
      );
    };

    spec.clip = fn(function($lo, $hi) {
      // <-- _ClipInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $SC.Integer(
          mathlib.clip(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.wrap = fn(function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $SC.Integer(
          mathlib.iwrap(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.fold = fn(function($lo, $hi) {
      // <-- _FoldInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }
      if ($lo.__tag === 770 && $hi.__tag === 770) {
        return $SC.Integer(
          mathlib.ifold(this._, $lo.__int__(), $hi.__int__())
        );
      }

      return $SC.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.even = function() {
      return $SC.Boolean(!(this._ & 1));
    };

    spec.odd = function() {
      return $SC.Boolean(!!(this._ & 1));
    };

    spec.xrand = fn(function($exclude) {
      return ($exclude ["+"] (this.__dec__().rand()) ["+"] ($int_1)) ["%"] (this);
    }, "exclude=0");

    spec.xrand2 = fn(function($exclude) {
      var raw, res;

      raw = this._;
      res = (mathlib.rand((2 * raw))|0) - raw;

      if (res === $exclude._) {
        return this;
      }

      return $SC.Integer(res);
    }, "exclude=0");

    spec.degreeToKey = fn(function($scale, $stepsPerOctave) {
      return $scale.performDegreeToKey(this, $stepsPerOctave);
    }, "scale; stepsPerOctave=12");

    spec.do = function($function) {
      iterator.execute(
        iterator.integer$do(this),
        $function
      );
      return this;
    };

    spec.generate = function($function) {

      $function.value(this);

      return this;
    };

    spec.collectAs = fn(function($function, $class) {
      var $res;
      var i, imax;

      if ($class === $nil) {
        $class = SCArray;
      }

      $res = $class.new(this);
      for (i = 0, imax = this._; i < imax; ++i) {
        $res.add($function.value($SC.Integer(i)));
      }

      return $res;
    }, "function; class");

    spec.collect = function($function) {
      return this.collectAs($function, SCArray);
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.integer$reverseDo(this),
        $function
      );
      return this;
    };

    spec.for = fn(function($endval, $function) {
      iterator.execute(
        iterator.integer$for(this, $endval),
        $function
      );
      return this;
    }, "endval; function");

    spec.forBy = fn(function($endval, $stepval, $function) {
      iterator.execute(
        iterator.integer$forBy(this, $endval, $stepval),
        $function
      );
      return this;
    }, "endval; stepval; function");

    spec.to = fn(function($hi, $step) {
      return $SC("Interval").new(this, $hi, $step);
    }, "hi; step=1");

    spec.asAscii = function() {
      // <-- _AsAscii -->
      return $SC.Char(String.fromCharCode(this._|0));
    };

    spec.asUnicode = utils.nop;

    spec.asDigit = function() {
      var c;

      // <!-- _AsAscii -->
      c = this._;
      if (0 <= c && c <= 9) {
        return $SC.Char(String(c));
      }
      if (10 <= c && c <= 35) {
        return $SC.Char(String.fromCharCode(c + 55));
      }

      throw new Error("Integer: asDigit must be 0 <= this <= 35");
    };

    spec.asBinaryDigits = fn(function($numDigits) {
      var raw, array, numDigits, i;

      raw = this._;
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($SC.Integer((raw >> i) & 1));
      }

      return $SC.Array(array);
    }, "numDigits=8");

    spec.asDigits = fn(function($base, $numDigits) {
      var $num;
      var array, numDigits, i;

      $num = this;
      if ($numDigits === $nil) {
        $numDigits = (
          this.log() ["/"] ($base.log() ["+"] ($SC.Float(1e-10)))
        ).asInteger().__inc__();
      }

      array = [];
      numDigits = $numDigits.__int__();
      array = new Array(numDigits);
      for (i = 0; i < numDigits; ++i) {
        array.unshift($num ["%"] ($base));
        $num = $num.div($base);
      }

      return $SC.Array(array);
    }, "base=10; numDigits");

    // TODO: implements nextPowerOfTwo
    // TODO: implements isPowerOfTwo
    // TODO: implements leadingZeroes
    // TODO: implements trailingZeroes
    // TODO: implements numBits
    // TODO: implements log2Ceil
    // TODO: implements grayCode
    // TODO: implements setBit
    // TODO: implements nthPrime
    // TODO: implements prevPrime
    // TODO: implements nextPrime
    // TODO: implements indexOfPrime
    // TODO: implements isPrime
    // TODO: implements exit
    // TODO: implements asStringToBase
    // TODO: implements asBinaryString
    // TODO: implements asHexString
    // TODO: implements asIPString
    // TODO: implements archiveAsCompileString

    spec.geom = fn(function($start, $grow) {
      return SCArray.geom(this, $start, $grow);
    }, "start; grow");

    spec.fib = fn(function($a, $b) {
      return SCArray.fib(this, $a, $b);
    }, "a=0.0; b=1.0");

    // TODO: implements factors
    // TODO: implements pidRunning
    // TODO: implements factorial
    // TODO: implements isCaps
    // TODO: implements isShift
    // TODO: implements isCtrl
    // TODO: implements isAlt
    // TODO: implements isCmd
    // TODO: implements isNumPad
    // TODO: implements isHelp
    // TODO: implements isFun

    spec.bitNot = function() {
      return $SC.Integer(~this._);
    };
  });

})(sc);

// src/sc/lang/classlib/Math/Float.js
(function(sc) {

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var mathlib  = sc.libs.mathlib;

  sc.lang.klass.refine("Float", function(spec, utils) {
    spec.toString = function() {
      var raw = this._;

      if (raw === Infinity) {
        return "inf";
      }
      if (raw === -Infinity) {
        return "-inf";
      }
      if (isNaN(raw)) {
        return "nan";
      }

      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Float.new is illegal, should use literal.");
    };

    spec.isFloat = utils.alwaysReturn$true;
    spec.asFloat = utils.nop;

    [
      [ "+"  , $SC.Float, $SC.Float ],
      [ "-"  , $SC.Float, $SC.Float ],
      [ "*"  , $SC.Float, $SC.Float ],
      [ "/"  , $SC.Float, $SC.Float ],
      [ "mod"     , $SC.Float  , $SC.Float   ],
      [ "div"     , $SC.Integer, $SC.Integer ],
      [ "pow"     , $SC.Float  , $SC.Float   ],
      [ "min"     , $SC.Float  , $SC.Float   ],
      [ "max"     , $SC.Float  , $SC.Float   ],
      [ "bitAnd"  , $SC.Float  , $SC.Float   ],
      [ "bitOr"   , $SC.Float  , $SC.Float   ],
      [ "bitXor"  , $SC.Float  , $SC.Float   ],
      [ "lcm"     , $SC.Float  , $SC.Float   ],
      [ "gcd"     , $SC.Float  , $SC.Float   ],
      [ "round"   , $SC.Float  , $SC.Float   ],
      [ "roundUp" , $SC.Float  , $SC.Float   ],
      [ "trunc"   , $SC.Float  , $SC.Float   ],
      [ "atan2"   , $SC.Float  , $SC.Float   ],
      [ "hypot"   , $SC.Float  , $SC.Float   ],
      [ "hypotApx", $SC.Float  , $SC.Float   ],
      [ "leftShift"         , $SC.Float, $SC.Float ],
      [ "rightShift"        , $SC.Float, $SC.Float ],
      [ "unsignedRightShift", $SC.Float, $SC.Float ],
      [ "ring1"   , $SC.Float, $SC.Float ],
      [ "ring2"   , $SC.Float, $SC.Float ],
      [ "ring3"   , $SC.Float, $SC.Float ],
      [ "ring4"   , $SC.Float, $SC.Float ],
      [ "difsqr"  , $SC.Float, $SC.Float ],
      [ "sumsqr"  , $SC.Float, $SC.Float ],
      [ "sqrsum"  , $SC.Float, $SC.Float ],
      [ "sqrdif"  , $SC.Float, $SC.Float ],
      [ "absdif"  , $SC.Float, $SC.Float ],
      [ "thresh"  , $SC.Float, $SC.Float ],
      [ "amclip"  , $SC.Float, $SC.Float ],
      [ "scaleneg", $SC.Float, $SC.Float ],
      [ "clip2"   , $SC.Float, $SC.Float ],
      [ "fold2"   , $SC.Float, $SC.Float ],
      [ "wrap2"   , $SC.Float, $SC.Float ],
      [ "excess"  , $SC.Float, $SC.Float ],
      [ "firstArg", $SC.Float, $SC.Float ],
      [ "rrand"   , $SC.Float, $SC.Float ],
      [ "exprand" , $SC.Float, $SC.Float ],
    ].forEach(function(items) {
      spec[items[0]] = sc.lang.classlib.bop.apply(null, items);
    });

    spec.clip = fn(function($lo, $hi) {
      // <-- _ClipFloat -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $SC.Float(
        mathlib.clip(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.wrap = fn(function($lo, $hi) {
      // <-- _WrapInt -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $SC.Float(
        mathlib.wrap(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    spec.fold = fn(function($lo, $hi) {
      // <-- _FoldFloat -->
      if ($lo.__tag === 1027) {
        return $lo;
      }
      if ($hi.__tag === 1027) {
        return $hi;
      }

      return $SC.Float(
        mathlib.fold(this._, $lo.__num__(), $hi.__num__())
      );
    }, "lo; hi");

    // TODO: implements coin
    // TODO: implements xrand2

    spec.as32Bits = function() {
      // <-- _As32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float32Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.high32Bits = function() {
      // <-- _High32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[1]
      );
    };

    spec.low32Bits = function() {
      // <-- _Low32Bits -->
      return $SC.Integer(
        new Int32Array(
          new Float64Array([ this._ ]).buffer
        )[0]
      );
    };

    spec.$from32Bits = fn(function($word) {
      // <-- _From32Bits -->
      return $SC.Float(
        new Float32Array(
          new Int32Array([ $word.__num__() ]).buffer
        )[0]
      );
    }, "word");

    spec.$from64Bits = fn(function($hiWord, $loWord) {
      // <-- _From64Bits -->
      return $SC.Float(
        new Float64Array(
          new Int32Array([ $loWord.__num__(), $hiWord.__num__() ]).buffer
        )[0]
      );
    }, "hiWord; loWord");

    spec.do = function($function) {
      iterator.execute(
        iterator.float$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.float$reverseDo(this),
        $function
      );
      return this;
    };

    // TODO: implements asStringPrec
    // TODO: implements archiveAsCompileString
    // TODO: implements storeOn
    // TODO: implements switch

    spec.bitNot = function() {
      var f64 = new Float64Array([ this._ ]);
      var i32 = new Int32Array(f64.buffer);
      i32[0] = ~i32[0];
      return $SC.Float(f64[0]);
    };
  });

})(sc);

// src/sc/lang/classlib/Core/Thread.js
(function(sc) {

  function SCThread() {
    this.__initializeWith__("Stream");
  }

  sc.lang.klass.define(SCThread, "Thread : Stream", function() {
    // TODO: implements state
    // TODO: implements parent
    // TODO: implements primitiveError
    // TODO: implements primitiveIndex
    // TODO: implements beats
    // TODO: implements seconds
    // TODO: implements clock
    // TODO: implements nextBeat
    // TODO: implements endBeat
    // TODO: implements endBeat_
    // TODO: implements endValue
    // TODO: implements endValue_
    // TODO: implements exceptionHandler
    // TODO: implements exceptionHandler_
    // TODO: implements threadPlayer_
    // TODO: implements executingPath
    // TODO: implements oldExecutingPath

    // TODO: implements init
    // TODO: implements copy
    // TODO: implements clock_
    // TODO: implements seconds_
    // TODO: implements beats_
    // TODO: implements isPlaying
    // TODO: implements threadPlayer
    // TODO: implements findThreadPlayer
    // TODO: implements randSeed_
    // TODO: implements randData_
    // TODO: implements randData
    // TODO: implements failedPrimitiveName
    // TODO: implements handleError
    // TODO: implements next
    // TODO: implements value
    // TODO: implements valueArray
    // TODO: implements $primitiveError
    // TODO: implements $primitiveErrorString
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements checkCanArchive
  });

  function SCRoutine() {
    this.__initializeWith__("Thread");
  }

  sc.lang.klass.define(SCRoutine, "Routine : Thread", function() {
    // TODO: implements $run
    // TODO: implements next
    // TODO: implements value
    // TODO: implements resume
    // TODO: implements run
    // TODO: implements valueArray
    // TODO: implements reset
    // TODO: implements stop
    // TODO: implements p
    // TODO: implements storeArgs
    // TODO: implements storeOn
    // TODO: implements awake
  });

})(sc);

// src/sc/lang/classlib/Core/Symbol.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Symbol", function(spec, utils) {
    var $nil = utils.$nil;

    spec.__sym__ = function() {
      return this._;
    };

    spec.__str__ = function() {
      return this._;
    };

    spec.$new = function() {
      throw new Error("Symbol.new is illegal, should use literal.");
    };

    spec.asSymbol = utils.nop;

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this._);
      return $SC.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this._);
      return $SC.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      return this.asString().ascii();
    };

    // TODO: implements asCompileString

    spec.asClass = function() {
      if (sc.lang.klass.exists(this._)) {
        return sc.lang.klass.get(this._);
      }
      return $nil;
    };

    // TODO: implements asSetter
    // TODO: implements asGetter
    // TODO: implements asSpec
    // TODO: implements asWarp
    // TODO: implements asTuning
    // TODO: implements asScale
    // TODO: implements isSetter
    // TODO: implements isClassName
    // TODO: implements isMetaClassName
    // TODO: implements isPrefix
    // TODO: implements isPrimitiveName
    // TODO: implements isPrimitive
    // TODO: implements isMap
    // TODO: implements isRest
    // TODO: implements envirGet
    // TODO: implements envirPut
    // TODO: implements blend
    // TODO: implements ++
    // TODO: implements asBinOpString
    // TODO: implements applyTo
    // TODO: implements performBinaryOpOnSomething

    spec.neg = utils.nop;
    spec.bitNot = utils.nop;
    spec.abs = utils.nop;
    spec.ceil = utils.nop;
    spec.floor = utils.nop;
    spec.frac = utils.nop;
    spec.sign = utils.nop;
    spec.sqrt = utils.nop;
    spec.exp = utils.nop;
    spec.midicps = utils.nop;
    spec.cpsmidi = utils.nop;
    spec.midiratio = utils.nop;
    spec.ratiomidi = utils.nop;
    spec.ampdb = utils.nop;
    spec.dbamp = utils.nop;
    spec.octcps = utils.nop;
    spec.cpsoct = utils.nop;
    spec.log = utils.nop;
    spec.log2 = utils.nop;
    spec.log10 = utils.nop;
    spec.sin = utils.nop;
    spec.cos = utils.nop;
    spec.tan = utils.nop;
    spec.asin = utils.nop;
    spec.acos = utils.nop;
    spec.atan = utils.nop;
    spec.sinh = utils.nop;
    spec.cosh = utils.nop;
    spec.tanh = utils.nop;
    spec.rand = utils.nop;
    spec.rand2 = utils.nop;
    spec.linrand = utils.nop;
    spec.bilinrand = utils.nop;
    spec.sum3rand = utils.nop;
    spec.distort = utils.nop;
    spec.softclip = utils.nop;
    spec.coin = utils.nop;
    spec.even = utils.nop;
    spec.odd = utils.nop;
    spec.rectWindow = utils.nop;
    spec.hanWindow = utils.nop;
    spec.welWindow = utils.nop;
    spec.triWindow = utils.nop;
    spec.scurve = utils.nop;
    spec.ramp = utils.nop;
    spec["+"] = utils.nop;
    spec["-"] = utils.nop;
    spec["*"] = utils.nop;
    spec["/"] = utils.nop;
    spec.mod = utils.nop;
    spec.min = utils.nop;
    spec.max = utils.nop;
    spec.bitAnd = utils.nop;
    spec.bitOr = utils.nop;
    spec.bitXor = utils.nop;
    spec.bitHammingDistance = utils.nop;
    // TODO: Implements hammingDistance
    spec.lcm = utils.nop;
    spec.gcd = utils.nop;
    spec.round = utils.nop;
    spec.roundUp = utils.nop;
    spec.trunc = utils.nop;
    spec.atan2 = utils.nop;
    spec.hypot = utils.nop;
    spec.hypotApx = utils.nop;
    spec.pow = utils.nop;
    spec.leftShift = utils.nop;
    spec.rightShift = utils.nop;
    spec.unsignedRightShift = utils.nop;
    spec.rrand = utils.nop;
    spec.exprand = utils.nop;

    // TODO: Implements <
    // TODO: Implements >
    // TODO: Implements <=
    // TODO: Implements >=

    spec.degreeToKey = utils.nop;
    spec.degrad = utils.nop;
    spec.raddeg = utils.nop;
    spec.doNumberOp = utils.nop;
    spec.doComplexOp = utils.nop;
    spec.doSignalOp = utils.nop;

    // TODO: Implements doListOp
    // TODO: Implements primitiveIndex
    // TODO: Implements specialIndex
    // TODO: Implements printOn
    // TODO: Implements storeOn
    // TODO: Implements codegen_UGenCtorArg

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    // TODO: Implements kr
    // TODO: Implements ir
    // TODO: Implements tr
    // TODO: Implements ar
    // TODO: Implements matchOSCAddressPattern
    // TODO: Implements help

    spec.asString = function() {
      return $SC.String(this._);
    };

    spec.shallowCopy = utils.nop;

    spec.performBinaryOpOnSimpleNumber = utils.nop;
  });

})(sc);

// src/sc/lang/classlib/Core/Ref.js
(function(sc) {

  var fn  = sc.lang.fn;

  sc.lang.klass.refine("Ref", function(spec, utils) {
    spec.valueOf = function() {
      return this._value.valueOf();
    };

    spec.value = function() {
      return this._value;
    };

    spec.value_ = fn(function($value) {
      this._value = $value;
      return this;
    }, "value");

    // $new

    spec.set = fn(function($thing) {
      this._value = $thing;
      return this;
    }, "thing");

    spec.get = function() {
      return this._value;
    };

    spec.dereference = spec.value;

    spec.asRef = utils.nop;

    spec.valueArray = spec.value;

    spec.valueEnvir = spec.value;

    spec.valueArrayEnvir = spec.value;

    spec.next = spec.value;

    spec.asUGenInput = utils.nop;

    // TODO: implements printOn
    // TODO: implements storeOn

    spec.at = function($key) {
      return this._value.at($key);
    };

    spec.put = function($key, $val) {
      return this._value.put($key, $val);
    };

    // TODO: implements seq
    // TODO: implements asControlInput
    // TODO: implements asBufWithValues
    // TODO: implements multichannelExpandRef
  });

})(sc);

// src/sc/lang/classlib/Core/Nil.js
(function(sc) {

  var slice = [].slice;
  var fn    = sc.lang.fn;
  var $SC   = sc.lang.$SC;

  sc.lang.klass.refine("Nil", function(spec, utils) {
    var $nil = utils.$nil;

    spec.__num__ = function() {
      return 0;
    };

    spec.__bool__ = function() {
      return false;
    };

    spec.__sym__ = function() {
      return "nil";
    };

    spec.toString = function() {
      return "nil";
    };

    spec.$new = function() {
      throw new Error("Nil.new is illegal, should use literal.");
    };

    spec.isNil = utils.alwaysReturn$true;
    spec.notNil = utils.alwaysReturn$false;

    spec["?"] = function($obj) {
      return $obj;
    };

    spec["??"] = function($obj) {
      return $obj.value();
    };

    spec["!?"] = utils.nop;

    spec.asBoolean = utils.alwaysReturn$false;
    spec.booleanValue = utils.alwaysReturn$false;

    spec.push = fn(function($function) {
      return $function.value();
    }, "function");

    spec.appendStream = fn(function($stream) {
      return $stream;
    }, "stream");

    spec.pop = utils.nop;
    spec.source = utils.nop;
    spec.source_ = utils.nop;

    spec.rate = utils.nop;
    spec.numChannels = utils.nop;
    spec.isPlaying = utils.alwaysReturn$false;

    spec.do = utils.nop;
    spec.reverseDo = utils.nop;
    spec.pairsDo = utils.nop;
    spec.collect = utils.nop;
    spec.select = utils.nop;
    spec.reject = utils.nop;
    spec.detect = utils.nop;
    spec.collectAs = utils.nop;
    spec.selectAs = utils.nop;
    spec.rejectAs = utils.nop;

    spec.dependants = function() {
      return $SC("IdentitySet").new();
    };

    spec.changed = utils.nop;
    spec.addDependant = utils.nop;
    spec.removeDependant = utils.nop;
    spec.release = utils.nop;
    spec.update = utils.nop;

    spec.transformEvent = fn(function($event) {
      return $event;
    }, "event");

    spec.awake = utils.alwaysReturn$nil;

    spec.play = utils.nop;

    spec.nextTimeOnGrid = fn(function($clock) {
      if ($clock === $nil) {
        return $clock;
      }
      return $SC.Function(function() {
        return $clock.nextTimeOnGrid();
      });
    }, "clock");

    spec.asQuant = function() {
      return $SC("Quant").default();
    };

    spec.swapThisGroup = utils.nop;
    spec.performMsg = utils.nop;

    spec.printOn = fn(function($stream) {
      $stream.putAll($SC.String("nil"));
      return this;
    }, "stream");

    spec.storeOn = fn(function($stream) {
      $stream.putAll($SC.String("nil"));
      return this;
    }, "stream");

    spec.matchItem = utils.alwaysReturn$true;

    spec.add = fn(function($value) {
      return $SC.Array([ $value ]);
    }, "value");

    spec.addAll = fn(function($array) {
      return $array.asArray();
    }, "array");

    spec["++"] = function($array) {
      return $array.asArray();
    };

    spec.asCollection = function() {
      return $SC.Array();
    };

    spec.remove = utils.nop;

    spec.set = utils.nop;

    spec.get = fn(function($prevVal) {
      return $prevVal;
    }, "prevVal");

    spec.addFunc = function() {
      var functions = slice.call(arguments);
      if (functions.length <= 1) {
        return functions[0];
      }
      return $SC("FunctionList").new($SC.Array(functions));
    };

    spec.removeFunc = utils.nop;

    spec.replaceFunc = utils.nop;
    spec.seconds_ = utils.nop;
    spec.throw = utils.nop;

    // TODO: implements handleError

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    spec.asSpec = function() {
      return $SC("ControlSpec").new();
    };

    spec.superclassesDo = utils.nop;

    spec.shallowCopy = utils.nop;
  });

})(sc);

// src/sc/lang/classlib/Core/Kernel.js
(function(sc) {

  var fn  = sc.lang.fn;

  sc.lang.klass.refine("Class", {
    // TODO: implements superclass
    // TODO: implements asClass
    // TODO: implements initClass
    // TODO: implements $initClassTree
    // TODO: implements $allClasses
    // TODO: implements findMethod
    // TODO: implements findRespondingMethodFor
    // TODO: implements findOverriddenMethod
    // TODO: implements superclassesDo
    // TODO: implements while
    // TODO: implements dumpByteCodes
    // TODO: implements dumpClassSubtree
    // TODO: implements dumpInterface
    // TODO: implements asString
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements archiveAsCompileString
    // TODO: implements hasHelpFile
    // TODO: implements helpFilePath
    // TODO: implements help
    // TODO: implements openHelpFile
    // TODO: implements shallowCopy
    // TODO: implements openCodeFile
    // TODO: implements classVars
    // TODO: implements inspectorClass
    // TODO: implements findReferences
    // TODO: implements $findAllReferences
    // TODO: implements allSubclasses
    // TODO: implements superclasses
  });

  sc.lang.klass.refine("Interpreter", function(spec, utils) {
    var $nil = utils.$nil;

    (function() {
      var i, ch;

      function getter(name) {
        return function() {
          return this["_" + name] || $nil;
        };
      }

      function setter(name) {
        return fn(function(value) {
          this["_" + name] = value;
          return this;
        }, "value");
      }

      for (i = 97; i <= 122; i++) {
        ch = String.fromCharCode(i);
        spec[ch] = getter(ch);
        spec[ch + "_"] = setter(ch);
      }
    })();

    spec.$new = function() {
      throw new Error("Interpreter.new is illegal.");
    };

    spec.clearAll = function() {
      var i;
      for (i = 97; i <= 122; i++) {
        this["_" + String.fromCharCode(i)] = $nil;
      }
      return this;
    };
  });

})(sc);

// src/sc/lang/classlib/Core/Function.js
(function(sc) {

  var slice = [].slice;
  var fn    = sc.lang.fn;
  var $SC   = sc.lang.$SC;

  sc.lang.klass.refine("Function", function(spec, utils) {
    var BOOL = utils.BOOL;
    var $nil = utils.$nil;
    var SCArray = $SC("Array");

    // TODO: implements def

    spec.$new = function() {
      throw new Error("Function.new is illegal, should use literal.");
    };

    spec.isFunction = utils.alwaysReturn$true;

    // TODO: implements isClosed

    spec.archiveAsCompileString = utils.alwaysReturn$true;
    spec.archiveAsObject = utils.alwaysReturn$true;

    // TODO: implements checkCanArchive

    spec.shallowCopy = utils.nop;

    spec.choose = function() {
      return this.value();
    };

    spec.update = function() {
      return this._.apply(this, arguments);
    };

    spec.value = function() {
      return this._.apply(this, arguments);
    };

    spec.valueArray = function($args) {
      return this._.apply(this, $args.asArray()._);
    };

    // TODO: implements valueEnvir
    // TODO: implements valueArrayEnvir
    // TODO: implements functionPerformList
    // TODO: implements valueWithEnvir
    // TODO: implements performWithEnvir
    // TODO: implements performKeyValuePairs
    // TODO: implements numArgs
    // TODO: implements numVars
    // TODO: implements varArgs
    // TODO: implements loop
    // TODO: implements block

    spec.asRoutine = function() {
      return $SC("Routine").new(this);
    };

    spec.dup = fn(function($n) {
      return SCArray.fill($n, this);
    }, "n=2");

    // TODO: implements sum
    // TODO: implements defer
    // TODO: implements thunk
    // TODO: implements transformEvent
    // TODO: implements set
    // TODO: implements get
    // TODO: implements fork
    // TODO: implements forkIfNeeded
    // TODO: implements awake
    // TODO: implements cmdPeriod
    // TODO: implements bench
    // TODO: implements protect
    // TODO: implements try
    // TODO: implements prTry
    // TODO: implements handleError

    spec.case = function() {
      var args, i, imax;

      args = slice.call(arguments);
      args.unshift(this);

      for (i = 0, imax = args.length >> 1; i < imax; ++i) {
        if (BOOL(args[i * 2].value())) {
          return args[i * 2 + 1].value();
        }
      }

      if (args.length % 2 === 1) {
        return args[args.length - 1].value();
      }

      return $nil;
    };

    spec.r = function() {
      return $SC("Routine").new(this);
    };

    spec.p = function() {
      return $SC("Prout").new(this);
    };

    // TODO: implements matchItem
    // TODO: implements performDegreeToKey

    spec.flop = function() {
      var $this = this;
      // if(def.argNames.isNil) { ^this };
      return $SC.Function(function() {
        var $$args = $SC.Array(slice.call(arguments));
        return $$args.flop().collect($SC.Function(function($_) {
          return $this.valueArray($_);
        }));
      });
    };

    // TODO: implements envirFlop
    // TODO: implements makeFlopFunc
    // TODO: implements inEnvir

    spec.while = fn(function($body) {
      sc.lang.iterator.execute(
        sc.lang.iterator.function$while(this),
        $body
      );
      return this;
    }, "body");
  });

})(sc);

// src/sc/lang/classlib/Core/Char.js
(function(sc) {

  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Char", function(spec, utils) {
    spec.__str__ = function() {
      return this._;
    };

    spec.$nl = function() {
      return $SC.Char("\n");
    };

    spec.$ff = function() {
      return $SC.Char("\f");
    };

    spec.$tab = function() {
      return $SC.Char("\t");
    };

    spec.$space = function() {
      return $SC.Char(" ");
    };

    spec.$comma = function() {
      return $SC.Char(",");
    };

    spec.$new = function() {
      throw new Error("Char.new is illegal, should use literal.");
    };

    // TODO: implements hash

    spec.ascii = function() {
      return $SC.Integer(this._.charCodeAt(0));
    };

    spec.digit = function() {
      var ascii = this._.charCodeAt(0);
      if (0x30 <= ascii && ascii <= 0x39) {
        return $SC.Integer(ascii - 0x30);
      }
      if (0x41 <= ascii && ascii <= 0x5a) {
        return $SC.Integer(ascii - 0x37);
      }
      if (0x61 <= ascii && ascii <= 0x7a) {
        return $SC.Integer(ascii - 0x57);
      }
      throw new Error("digitValue failed");
    };

    spec.asAscii = utils.nop;

    spec.asUnicode = function() {
      return this.ascii();
    };

    spec.toUpper = function() {
      return $SC.Char(this._.toUpperCase());
    };

    spec.toLower = function() {
      return $SC.Char(this._.toLowerCase());
    };

    spec.isAlpha = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isAlphaNum = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x30 <= ascii && ascii <= 0x39) ||
                         (0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isPrint = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x20 <= ascii && ascii <= 0x7e));
    };

    spec.isPunct = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x21 <= ascii && ascii <= 0x2f) ||
                         (0x3a <= ascii && ascii <= 0x40) ||
                         (0x5b <= ascii && ascii <= 0x60) ||
                         (0x7b <= ascii && ascii <= 0x7e));
    };

    spec.isControl = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x00 <= ascii && ascii <= 0x1f) || ascii === 0x7f);
    };

    spec.isSpace = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x09 <= ascii && ascii <= 0x0d) || ascii === 0x20);
    };

    spec.isVowl = function() {
      var ch = this._.charAt(0).toUpperCase();
      return $SC.Boolean("AEIOU".indexOf(ch) !== -1);
    };

    spec.isDecDigit = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x30 <= ascii && ascii <= 0x39));
    };

    spec.isUpper = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x41 <= ascii && ascii <= 0x5a));
    };

    spec.isLower = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isFileSafe = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean((0x20 <= ascii && ascii <= 0x7e) &&
                         ascii !== 0x2f && // 0x2f is '/'
                         ascii !== 0x3a && // 0x3a is ':'
                         ascii !== 0x22);  // 0x22 is '"'
    };

    spec.isPathSeparator = function() {
      var ascii = this._.charCodeAt(0);
      return $SC.Boolean(ascii === 0x2f);
    };

    spec["<"] = function($aChar) {
      return $SC.Boolean(this.ascii() < $aChar.ascii());
    };

    spec["++"] = function($that) {
      return $SC.String(this._ + $that.__str__());
    };

    // TODO: implements $bullet
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = function() {
      return $SC.True();
    };

    spec.asString = function() {
      return $SC.String(this._);
    };

    spec.shallowCopy = utils.nop;
  });

})(sc);

// src/sc/lang/classlib/Core/Boolean.js
(function(sc) {

  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("Boolean", function(spec, utils) {
    spec.__bool__ = function() {
      return this._;
    };

    spec.toString = function() {
      return String(this._);
    };

    spec.$new = function() {
      throw new Error("Boolean.new is illegal, should use literal.");
    };

    spec.xor = function($bool) {
      return $SC.Boolean(this === $bool).not();
    };

    // TODO: implements if
    // TODO: implements nop
    // TODO: implements &&
    // TODO: implements ||
    // TODO: implements and
    // TODO: implements or
    // TODO: implements nand
    // TODO: implements asInteger
    // TODO: implements binaryValue

    spec.asBoolean = utils.nop;
    spec.booleanValue = utils.nop;

    // TODO: implements keywordWarnings
    // TODO: implements trace
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = utils.alwaysReturn$true;

    spec.while = function() {
      var msg = "While was called with a fixed (unchanging) Boolean as the condition. ";
      msg += "Please supply a Function instead.";
      throw new Error(msg);
    };

    spec.shallowCopy = utils.nop;
  });

  sc.lang.klass.refine("True", function(spec, utils) {
    spec.$new = function() {
      throw new Error("True.new is illegal, should use literal.");
    };

    spec.if = fn(function($trueFunc) {
      return $trueFunc.value();
    }, "trueFunc");

    spec.not = utils.alwaysReturn$false;

    spec["&&"] = function($that) {
      return $that.value();
    };

    spec["||"] = utils.nop;

    spec.and = fn(function($that) {
      return $that.value();
    }, "that");

    spec.or = spec["||"];

    spec.nand = fn(function($that) {
      return $that.value().not();
    }, "that");

    spec.asInteger = utils.alwaysReturn$int_1;
    spec.binaryValue = utils.alwaysReturn$int_1;
  });

  sc.lang.klass.refine("False", function(spec, utils) {
    spec.$new = function() {
      throw new Error("False.new is illegal, should use literal.");
    };

    spec.if = fn(function($trueFunc, $falseFunc) {
      return $falseFunc.value();
    }, "trueFunc; falseFunc");

    spec.not = utils.alwaysReturn$true;

    spec["&&"] = utils.nop;

    spec["||"] = function($that) {
      return $that.value();
    };

    spec.and = utils.nop;

    spec.or = fn(function($that) {
      return $that.value();
    }, "that");

    spec.nand = utils.alwaysReturn$true;
    spec.asInteger = utils.alwaysReturn$int_0;
    spec.binaryValue = utils.alwaysReturn$int_0;
  });

})(sc);

// src/sc/lang/classlib/Collections/Collection.js
(function(sc) {

  var $SC = sc.lang.$SC;
  var fn = sc.lang.fn;

  sc.lang.klass.refine("Collection", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;
    var SCArray = $SC("Array");

    spec.$newFrom = fn(function($aCollection) {
      var $newCollection;

      $newCollection = this.new($aCollection.size());
      $aCollection.do($SC.Function(function($item) {
        $newCollection.add($item);
      }));

      return $newCollection;
    }, "aCollection");

    spec.$with = fn(function($$args) {
      var $newColl;

      $newColl = this.new($$args.size());
      $newColl.addAll($$args);

      return $newColl;
    }, "*args");

    spec.$fill = fn(function($size, $function) {
      var $obj;
      var size, i;

      if (BOOL($size.isSequenceableCollection())) {
        return this.fillND($size, $function);
      }

      $obj = this.new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $obj.add($function.value($SC.Integer(i)));
      }

      return $obj;
    }, "size; function");

    spec.$fill2D = fn(function($rows, $cols, $function) {
      var $this = this, $obj, $obj2, $row, $col;
      var rows, cols, i, j;

      $obj = this.new($rows);

      rows = $rows.__int__();
      cols = $cols.__int__();

      for (i = 0; i < rows; ++i) {
        $row = $SC.Integer(i);
        $obj2 = $this.new($cols);
        for (j = 0; j < cols; ++j) {
          $col = $SC.Integer(j);
          $obj2 = $obj2.add($function.value($row, $col));
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    }, "rows; cols; function");

    spec.$fill3D = fn(function($planes, $rows, $cols, $function) {
      var $this = this, $obj, $obj2, $obj3, $plane, $row, $col;
      var planes, rows, cols, i, j, k;

      $obj = this.new($planes);

      planes = $planes.__int__();
      rows   = $rows  .__int__();
      cols   = $cols  .__int__();

      for (i = 0; i < planes; ++i) {
        $plane = $SC.Integer(i);
        $obj2 = $this.new($rows);
        for (j = 0; j < rows; ++j) {
          $row = $SC.Integer(j);
          $obj3 = $this.new($cols);
          for (k = 0; k < cols; ++k) {
            $col = $SC.Integer(k);
            $obj3 = $obj3.add($function.value($plane, $row, $col));
          }
          $obj2 = $obj2.add($obj3);
        }
        $obj = $obj.add($obj2);
      }

      return $obj;
    }, "planes; rows; cols; function");

    var fillND = function($this, $dimensions, $function, $args) {
      var $n, $obj, $argIndex;

      $n = $dimensions.first();
      $obj = $this.new($n);
      $argIndex = $args.size();
      $args = $args ["++"] ($int_0);

      if ($dimensions.size().__int__() <= 1) {
        $n.do($SC.Function(function($i) {
          $obj.add($function.valueArray($args.put($argIndex, $i)));
        }));
      } else {
        $dimensions = $dimensions.drop($int_1);
        $n.do($SC.Function(function($i) {
          $obj = $obj.add(fillND($this, $dimensions, $function, $args.put($argIndex, $i)));
        }));
      }

      return $obj;
    };

    spec.$fillND = fn(function($dimensions, $function) {
      return fillND(this, $dimensions, $function, $SC.Array([]));
    }, "dimensions; function");

    spec["@"] = function($index) {
      return this.at($index);
    };

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($SC.Function(function($item) {
        if (!BOOL($aCollection.includes($item))) {
          $res = $false;
          return 65535;
        }
      }));

      return $res || $true;
    };

    // TODO: implements hash

    spec.species = function() {
      return SCArray;
    };

    spec.do = function() {
      return this._subclassResponsibility("do");
    };

    // TODO: implements iter

    spec.size = function() {
      var tally = 0;

      this.do($SC.Function(function() {
        tally++;
      }));

      return $SC.Integer(tally);
    };

    spec.flatSize = function() {
      return this.sum($SC.Function(function($_) {
        return $_.flatSize();
      }));
    };

    spec.isEmpty = function() {
      return $SC.Boolean(this.size().__int__() === 0);
    };

    spec.notEmpty = function() {
      return $SC.Boolean(this.size().__int__() !== 0);
    };

    spec.asCollection = utils.nop;
    spec.isCollection = utils.alwaysReturn$true;

    spec.add = function() {
      return this._subclassResponsibility("add");
    };

    spec.addAll = fn(function($aCollection) {
      var $this = this;

      $aCollection.asCollection().do($SC.Function(function($item) {
        return $this.add($item);
      }));

      return this;
    }, "aCollection");

    spec.remove = function() {
      return this._subclassResponsibility("remove");
    };

    spec.removeAll = fn(function($list) {
      var $this = this;

      $list.do($SC.Function(function($item) {
        $this.remove($item);
      }));

      return this;
    }, "list");

    spec.removeEvery = fn(function($list) {
      this.removeAllSuchThat($SC.Function(function($_) {
        return $list.includes($_);
      }));
      return this;
    }, "list");

    spec.removeAllSuchThat = function($function) {
      var $this = this, $removedItems, $copy;

      $removedItems = this.class().new();
      $copy = this.copy();
      $copy.do($SC.Function(function($item) {
        if (BOOL($function.value($item))) {
          $this.remove($item);
          $removedItems = $removedItems.add($item);
        }
      }));

      return $removedItems;
    };

    spec.atAll = fn(function($keys) {
      var $this = this;

      return $keys.collect($SC.Function(function($index) {
        return $this.at($index);
      }));
    }, "keys");

    spec.putEach = fn(function($keys, $values) {
      var keys, values, i, imax;

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], values[i % values.length]);
      }

      return this;
    }, "keys; values");

    spec.includes = fn(function($item1) {
      var $res = null;

      this.do($SC.Function(function($item2) {
        if ($item1 === $item2) {
          $res = $true;
          return 65535;
        }
      }));

      return $res || $false;
    }, "item1");

    spec.includesEqual = fn(function($item1) {
      var $res = null;

      this.do($SC.Function(function($item2) {
        if (BOOL( $item1 ["=="] ($item2) )) {
          $res = $true;
          return 65535;
        }
      }));

      return $res || $false;
    }, "item1");

    spec.includesAny = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($SC.Function(function($item) {
        if (BOOL($this.includes($item))) {
          $res = $true;
          return 65535;
        }
      }));

      return $res || $false;
    }, "aCollection");

    spec.includesAll = fn(function($aCollection) {
      var $this = this, $res = null;

      $aCollection.do($SC.Function(function($item) {
        if (!BOOL($this.includes($item))) {
          $res = $false;
          return 65535;
        }
      }));

      return $res || $true;
    }, "aCollection");

    spec.matchItem = fn(function($item) {
      return this.includes($item);
    }, "item");

    spec.collect = function($function) {
      return this.collectAs($function, this.species());
    };

    spec.select = function($function) {
      return this.selectAs($function, this.species());
    };

    spec.reject = function($function) {
      return this.rejectAs($function, this.species());
    };

    spec.collectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        return $res.add($function.value($elem, $i));
      }));

      return $res;
    }, "function; class");

    spec.selectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    }, "function; class");

    spec.rejectAs = fn(function($function, $class) {
      var $res;

      $res = $class.new(this.size());
      this.do($SC.Function(function($elem, $i) {
        if (!BOOL($function.value($elem, $i))) {
          $res = $res.add($elem);
        }
      }));

      return $res;
    }, "function; class");

    spec.detect = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $elem;
          return 65535;
        }
      }));

      return $res || $nil;
    };

    spec.detectIndex = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $i;
          return 65535;
        }
      }));
      return $res || $nil;
    };

    spec.doMsg = function() {
      var args = arguments;
      this.do($SC.Function(function($item) {
        $item.perform.apply($item, args);
      }));
      return this;
    };

    spec.collectMsg = function() {
      var args = arguments;
      return this.collect($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.selectMsg = function() {
      var args = arguments;
      return this.select($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.rejectMsg = function() {
      var args = arguments;
      return this.reject($SC.Function(function($item) {
        return $item.perform.apply($item, args);
      }));
    };

    spec.detectMsg = fn(function($selector, $$args) {
      return this.detect($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector; *args");

    spec.detectIndexMsg = fn(function($selector, $$args) {
      return this.detectIndex($SC.Function(function($item) {
        return $item.performList($selector, $$args);
      }));
    }, "selector; *args");

    spec.lastForWhich = function($function) {
      var $res = null;
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $elem;
        } else {
          return 65535;
        }
      }));

      return $res || $nil;
    };

    spec.lastIndexForWhich = function($function) {
      var $res = null;
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $i;
        } else {
          return 65535;
        }
      }));

      return $res || $nil;
    };

    spec.inject = fn(function($thisValue, $function) {
      var $nextValue;

      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.injectr = fn(function($thisValue, $function) {
      var $this = this, size, $nextValue;

      size = this.size().__int__();
      $nextValue = $thisValue;
      this.do($SC.Function(function($item, $i) {
        $item = $this.at($SC.Integer(--size));
        $nextValue = $function.value($nextValue, $item, $i);
      }));

      return $nextValue;
    }, "thisValue; function");

    spec.count = function($function) {
      var sum = 0;
      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    };

    spec.occurrencesOf = fn(function($obj) {
      var sum = 0;

      this.do($SC.Function(function($elem) {
        if (BOOL($elem ["=="] ($obj))) {
          sum++;
        }
      }));

      return $SC.Integer(sum);
    }, "obj");

    spec.any = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (BOOL($function.value($elem, $i))) {
          $res = $true;
          return 65535;
        }
      }));

      return $res || $false;
    };

    spec.every = function($function) {
      var $res = null;

      this.do($SC.Function(function($elem, $i) {
        if (!BOOL($function.value($elem, $i))) {
          $res = $false;
          return 65535;
        }
      }));

      return $res || $true;
    };

    spec.sum = fn(function($function) {
      var $sum;

      $sum = $int_0;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          $sum = $sum ["+"] ($elem);
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          $sum = $sum ["+"] ($function.value($elem, $i));
        }));
      }

      return $sum;
    }, "function");

    spec.mean = function($function) {
      return this.sum($function) ["/"] (this.size());
    };

    spec.product = fn(function($function) {
      var $product;

      $product = $int_1;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          $product = $product ["*"] ($elem);
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          $product = $product ["*"] ($function.value($elem, $i));
        }));
      }

      return $product;
    }, "function");

    spec.sumabs = function() {
      var $sum;

      $sum = $int_0;
      this.do($SC.Function(function($elem) {
        if (BOOL($elem.isSequenceableCollection())) {
          $elem = $elem.at($int_0);
        }
        $sum = $sum ["+"] ($elem.abs());
      }));

      return $sum;
    };

    spec.maxItem = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          if ($maxElement === $nil) {
            $maxElement = $elem;
          } else if ($elem > $maxElement) {
            $maxElement = $elem;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxElement = $elem;
            }
          }
        }));
      }

      return $maxElement;
    }, "function");

    spec.minItem = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem) {
          if ($minElement === $nil) {
            $minElement = $elem;
          } else if ($elem < $minElement) {
            $minElement = $elem;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($minValue === $nil) {
            $minValue = $function.value($elem, $i);
            $minElement = $elem;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $minValue) {
              $minValue = $val;
              $minElement = $elem;
            }
          }
        }));
      }

      return $minElement;
    }, "function");

    spec.maxIndex = fn(function($function) {
      var $maxValue, $maxIndex;

      $maxValue = $nil;
      $maxIndex = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $maxIndex = $index;
          } else if ($elem > $maxValue) {
            $maxValue = $elem;
            $maxIndex = $index;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $maxIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val > $maxValue) {
              $maxValue = $val;
              $maxIndex = $i;
            }
          }
        }));
      }

      return $maxIndex;
    }, "function");

    spec.minIndex = fn(function($function) {
      var $maxValue, $minIndex;

      $maxValue = $nil;
      $minIndex = $nil;
      if ($function === $nil) {
        this.do($SC.Function(function($elem, $index) {
          if ($maxValue === $nil) {
            $maxValue = $elem;
            $minIndex = $index;
          } else if ($elem < $maxValue) {
            $maxValue = $elem;
            $minIndex = $index;
          }
        }));
      } else {
        this.do($SC.Function(function($elem, $i) {
          var $val;
          if ($maxValue === $nil) {
            $maxValue = $function.value($elem, $i);
            $minIndex = $i;
          } else {
            $val = $function.value($elem, $i);
            if ($val < $maxValue) {
              $maxValue = $val;
              $minIndex = $i;
            }
          }
        }));
      }

      return $minIndex;
    }, "function");

    spec.maxValue = fn(function($function) {
      var $maxValue, $maxElement;

      $maxValue   = $nil;
      $maxElement = $nil;
      this.do($SC.Function(function($elem, $i) {
        var $val;
        if ($maxValue === $nil) {
          $maxValue = $function.value($elem, $i);
          $maxElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val > $maxValue) {
            $maxValue = $val;
            $maxElement = $elem;
          }
        }
      }));

      return $maxValue;
    }, "function");

    spec.minValue = fn(function($function) {
      var $minValue, $minElement;

      $minValue   = $nil;
      $minElement = $nil;
      this.do($SC.Function(function($elem, $i) {
        var $val;
        if ($minValue === $nil) {
          $minValue = $function.value($elem, $i);
          $minElement = $elem;
        } else {
          $val = $function.value($elem, $i);
          if ($val < $minValue) {
            $minValue = $val;
            $minElement = $elem;
          }
        }
      }));

      return $minValue;
    }, "function");

    spec.maxSizeAtDepth = fn(function($rank) {
      var rank, maxsize = 0;

      rank = $rank.__num__();
      if (rank === 0) {
        return this.size();
      }

      this.do($SC.Function(function($sublist) {
        var sz;
        if (BOOL($sublist.isCollection())) {
          sz = $sublist.maxSizeAtDepth($SC.Integer(rank - 1));
        } else {
          sz = 1;
        }
        if (sz > maxsize) {
          maxsize = sz;
        }
      }));

      return $SC.Integer(maxsize);
    }, "rank");

    spec.maxDepth = fn(function($max) {
      var $res;

      $res = $max;
      this.do($SC.Function(function($elem) {
        if (BOOL($elem.isCollection())) {
          $res = $res.max($elem.maxDepth($max.__inc__()));
        }
      }));

      return $res;
    }, "max=1");

    spec.deepCollect = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.collect($SC.Function(function($item, $i) {
          return $item.deepCollect($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        return $function.value(this, $index, $rank);
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.collect($SC.Function(function($item, $i) {
        return $item.deepCollect($depth, $function, $i, $rank);
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.deepDo = fn(function($depth, $function, $index, $rank) {
      if ($depth === $nil) {
        $rank = $rank.__inc__();
        return this.do($SC.Function(function($item, $i) {
          $item.deepDo($depth, $function, $i, $rank);
        }));
      }
      if ($depth.__num__() <= 0) {
        $function.value(this, $index, $rank);
        return this;
      }
      $depth = $depth.__dec__();
      $rank  = $rank.__inc__();

      return this.do($SC.Function(function($item, $i) {
        $item.deepDo($depth, $function, $i, $rank);
      }));
    }, "depth=1; function; index=0; rank=0");

    spec.invert = fn(function($axis) {
      var $index;

      if (BOOL(this.isEmpty())) {
        return this.species().new();
      }
      if ($axis !== $nil) {
        $index = $axis ["*"] ($SC.Integer(2));
      } else {
        $index = this.minItem() ["+"] (this.maxItem());
      }

      return $index ["-"] (this);
    }, "axis");

    spec.sect = fn(function($that) {
      var $result;

      $result = this.species().new();
      this.do($SC.Function(function($item) {
        if (BOOL($that.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.union = fn(function($that) {
      var $result;

      $result = this.copy();
      $that.do($SC.Function(function($item) {
        if (!BOOL($result.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.difference = fn(function($that) {
      return this.copy().removeAll($that);
    }, "that");

    spec.symmetricDifference = fn(function($that) {
      var $this = this, $result;

      $result = this.species().new();
      $this.do($SC.Function(function($item) {
        if (!BOOL($that.includes($item))) {
          $result = $result.add($item);
        }
      }));
      $that.do($SC.Function(function($item) {
        if (!BOOL($this.includes($item))) {
          $result = $result.add($item);
        }
      }));

      return $result;
    }, "that");

    spec.isSubsetOf = fn(function($that) {
      return $that.includesAll(this);
    }, "that");

    spec.asArray = function() {
      return SCArray.new(this.size()).addAll(this);
    };

    spec.asBag = function() {
      return $SC("Bag").new(this.size()).addAll(this);
    };

    spec.asList = function() {
      return $SC("List").new(this.size()).addAll(this);
    };

    spec.asSet = function() {
      return $SC("Set").new(this.size()).addAll(this);
    };

    spec.asSortedList = function($function) {
      return $SC("SortedList").new(this.size(), $function).addAll(this);
    };

    // TODO: implements powerset
    // TODO: implements flopDict
    // TODO: implements histo
    // TODO: implements printAll
    // TODO: implements printcsAll
    // TODO: implements dumpAll
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
    // TODO: implements writeDef
    // TODO: implements writeInputSpec
    // TODO: implements case
    // TODO: implements makeEnvirValPairs

    spec.asString = function() {
      var items = [];
      this.do($SC.Function(function($elem) {
        items.push($elem.__str__());
      }));

      return $SC.String(
        this.__className + "[ " + items.join(", ") + " ]"
      );
    };
  });

})(sc);

// src/sc/lang/classlib/Collections/SequenceableCollection.js
(function(sc) {

  var slice = [].slice;
  var fn    = sc.lang.fn;
  var $SC   = sc.lang.$SC;

  sc.lang.klass.refine("SequenceableCollection", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $true  = utils.$true;
    var $false = utils.$false;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;

    spec["|@|"] = function($index) {
      return this.clipAt($index);
    };

    spec["@@"] = function($index) {
      return this.wrapAt($index);
    };

    spec["@|@"] = function($index) {
      return this.foldAt($index);
    };

    spec.$series = fn(function($size, $start, $step) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start ["+"] ($step ["*"] ($SC.Integer(i))));
      }

      return $obj;
    }, "size; start=0; step=1");

    spec.$geom = fn(function($size, $start, $grow) {
      var $obj, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start);
        $start = $start ["*"] ($grow);
      }

      return $obj;
    }, "size; start; grow");

    spec.$fib = fn(function($size, $a, $b) {
      var $obj, $temp, i, imax;

      $obj = this.new($size);
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($b);
        $temp = $b;
        $b = $a ["+"] ($b);
        $a = $temp;
      }

      return $obj;
    }, "size; a=0.0; b=1.0");

    // TODO: implements $rand
    // TODO: implements $rand2
    // TODO: implements $linrand

    spec.$interpolation = fn(function($size, $start, $end) {
      var $obj, $step, i, imax;

      $obj = this.new($size);
      if ($size.__int__() === 1) {
        return $obj.add($start);
      }

      $step = ($end ["-"] ($start)) ["/"] ($size.__dec__());
      for (i = 0, imax = $size.__int__(); i < imax; ++i) {
        $obj.add($start ["+"] ($SC.Integer(i) ["*"] ($step)));
      }

      return $obj;
    }, "size; start=0.0; end=1.0");

    spec["++"] = function($aSequenceableCollection) {
      var $newlist;

      $newlist = this.species().new(this.size() ["+"] ($aSequenceableCollection.size()));
      $newlist = $newlist.addAll(this).addAll($aSequenceableCollection);

      return $newlist;
    };

    // TODO: implements +++

    spec.asSequenceableCollection = utils.nop;

    spec.choose = function() {
      return this.at(this.size().rand());
    };

    spec.wchoose = fn(function($weights) {
      return this.at($weights.windex());
    }, "weights");

    spec["=="] = function($aCollection) {
      var $res = null;

      if ($aCollection.class() !== this.class()) {
        return $false;
      }
      if (this.size() !== $aCollection.size()) {
        return $false;
      }
      this.do($SC.Function(function($item, $i) {
        if (BOOL($item ["!="] ($aCollection.at($i)))) {
          $res = $false;
          return 65535;
        }
      }));

      return $res || $true;
    };

    // TODO: implements hash

    spec.copyRange = fn(function($start, $end) {
      var $newColl, i, end;

      i = $start.__int__();
      end = $end.__int__();
      $newColl = this.species().new($SC.Integer(end - i));
      while (i <= end) {
        $newColl.add(this.at($SC.Integer(i++)));
      }

      return $newColl;
    }, "start; end");

    spec.keep = fn(function($n) {
      var n, size;

      n = $n.__int__();
      if (n >= 0) {
        return this.copyRange($int_0, $SC.Integer(n - 1));
      }
      size = this.size().__int__();

      return this.copyRange($SC.Integer(size + n), $SC.Integer(size - 1));
    }, "n");

    spec.drop = fn(function($n) {
      var n, size;

      n = $n.__int__();
      size = this.size().__int__();
      if (n >= 0) {
        return this.copyRange($n, $SC.Integer(size - 1));
      }

      return this.copyRange($int_0, $SC.Integer(size + n - 1));
    }, "n");

    spec.copyToEnd = fn(function($start) {
      return this.copyRange($start, $SC.Integer(this.size().__int__() - 1));
    }, "start");

    spec.copyFromStart = fn(function($end) {
      return this.copyRange($int_0, $end);
    }, "end");

    spec.indexOf = fn(function($item) {
      var $ret = null;

      this.do($SC.Function(function($elem, $i) {
        if ($item === $elem) {
          $ret = $i;
          return 65535;
        }
      }));

      return $ret || $nil;
    }, "item");

    spec.indicesOfEqual = fn(function($item) {
      var indices = [];

      this.do($SC.Function(function($elem, $i) {
        if ($item === $elem) {
          indices.push($i);
        }
      }));

      return indices.length ? $SC.Array(indices) : $nil;
    }, "item");

    spec.find = fn(function($sublist, $offset) {
      var $subSize_1, $first, $index;
      var size, offset, i, imax;

      $subSize_1 = $sublist.size().__dec__();
      $first = $sublist.first();

      size   = this.size().__int__();
      offset = $offset.__int__();
      for (i = 0, imax = size - offset; i < imax; ++i) {
        $index = $SC.Integer(i + offset);
        if (BOOL(this.at($index) ["=="] ($first))) {
          if (BOOL(this.copyRange($index, $index ["+"] ($subSize_1)) ["=="] ($sublist))) {
            return $index;
          }
        }
      }

      return $nil;
    }, "sublist; offset=0");

    spec.findAll = fn(function($arr, $offset) {
      var $this = this, $indices, $i;

      $indices = $nil;
      $i = $int_0;

      while (($i = $this.find($arr, $offset)) !== $nil) {
        $indices = $indices.add($i);
        $offset = $i.__inc__();
      }

      return $indices;
    }, "arr; offset=0");

    spec.indexOfGreaterThan = fn(function($val) {
      return this.detectIndex($SC.Function(function($item) {
        return $SC.Boolean($item > $val);
      }));
    }, "val");

    spec.indexIn = fn(function($val) {
      var $i, $j;

      $j = this.indexOfGreaterThan($val);
      if ($j === $nil) {
        return this.size().__dec__();
      }
      if ($j === $int_0) {
        return $j;
      }

      $i = $j.__dec__();

      if ($val ["-"] (this.at($i)) < this.at($j) ["-"] ($val)) {
        return $i;
      }

      return $j;
    }, "val");

    spec.indexInBetween = fn(function($val) {
      var $a, $b, $div, $i;

      if (BOOL(this.isEmpty())) {
        return $nil;
      }
      $i = this.indexOfGreaterThan($val);

      if ($i === $nil) {
        return this.size().__dec__();
      }
      if ($i === $int_0) {
        return $i;
      }

      $a = this.at($i.__dec__());
      $b = this.at($i);
      $div = $b ["-"] ($a);

      // if (BOOL($div ["=="] ($int_0))) {
      //   return $i;
      // }

      return (($val ["-"] ($a)) ["/"] ($div)) ["+"] ($i.__dec__());
    }, "val");

    spec.isSeries = fn(function($step) {
      var $res = null;

      if (this.size() <= 1) {
        return $true;
      }
      this.doAdjacentPairs($SC.Function(function($a, $b) {
        var $diff = $b ["-"] ($a);
        if ($step === $nil) {
          $step = $diff;
        } else if (BOOL($step ["!="] ($diff))) {
          $res = $false;
          return 65535;
        }
      }));

      return $res || $true;
    }, "step");

    spec.resamp0 = fn(function($newSize) {
      var $this = this, $factor;

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int_1)
      );

      return this.species().fill($newSize, $SC.Function(function($i) {
        return $this.at($i ["*"] ($factor).round($SC.Float(1.0)).asInteger());
      }));
    }, "newSize");

    spec.resamp1 = fn(function($newSize) {
      var $this = this, $factor;

      $factor = (
        this.size().__dec__()
      ) ["/"] (
        ($newSize.__dec__()).max($int_1)
      );

      return this.species().fill($newSize, $SC.Function(function($i) {
        return $this.blendAt($i ["*"] ($factor));
      }));
    }, "newSize");

    spec.remove = fn(function($item) {
      var $index;

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.removeAt($index);
      }

      return $nil;
    }, "item");

    spec.removing = fn(function($item) {
      var $coll;

      $coll = this.copy();
      $coll.remove($item);

      return $coll;
    }, "item");

    spec.take = fn(function($item) {
      var $index;

      $index = this.indexOf($item);
      if ($index !== $nil) {
        return this.takeAt($index);
      }

      return $nil;
    }, "item");

    spec.lastIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $SC.Integer(size - 1);
      }

      return $nil;
    };

    spec.middleIndex = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return $SC.Integer((size - 1) >> 1);
      }

      return $nil;
    };

    spec.first = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($int_0);
      }

      return $nil;
    };

    spec.last = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($SC.Integer(size - 1));
      }

      return $nil;
    };

    spec.middle = function() {
      var size = this.size().__int__();

      if (size > 0) {
        return this.at($SC.Integer((size - 1) >> 1));
      }

      return $nil;
    };

    spec.top = function() {
      return this.last();
    };

    spec.putFirst = fn(function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($int_0, $obj);
      }

      return this;
    }, "obj");

    spec.putLast = fn(function($obj) {
      var size = this.size().__int__();

      if (size > 0) {
        return this.put($SC.Integer(size - 1), $obj);
      }

      return this;
    }, "obj");

    spec.obtain = fn(function($index, $default) {
      var $res;

      $res = this.at($index);
      if ($res === $nil) {
        $res = $default;
      }

      return $res;
    }, "index; default");

    spec.instill = fn(function($index, $item, $default) {
      var $res;

      if ($index.__num__() >= this.size()) {
        $res = this.extend($index.__inc__(), $default);
      } else {
        $res = this.copy();
      }

      return $res.put($index, $item);
    }, "index; item; default");

    spec.pairsDo = function($function) {
      var $this = this, $int2 = $SC.Integer(2);

      $int_0.forBy(this.size() ["-"] ($int2), $int2, $SC.Function(function($i) {
        return $function.value($this.at($i), $this.at($i.__inc__()), $i);
      }));

      return this;
    };

    spec.keysValuesDo = function($function) {
      return this.pairsDo($function);
    };

    spec.doAdjacentPairs = function($function) {
      var $i;
      var size, i, imax;

      size = this.size().__int__();
      for (i = 0, imax = size - 1; i < imax; ++i) {
        $i = $SC.Integer(i);
        $function.value(this.at($i), this.at($i.__inc__()), $i);
      }

      return this;
    };

    spec.separate = fn(function($function) {
      var $this = this, $list, $sublist;

      $list = $SC.Array();
      $sublist = this.species().new();
      this.doAdjacentPairs($SC.Function(function($a, $b, $i) {
        $sublist = $sublist.add($a);
        if (BOOL($function.value($a, $b, $i))) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        }
      }));
      if (BOOL(this.notEmpty())) {
        $sublist = $sublist.add(this.last());
      }
      $list = $list.add($sublist);

      return $list;
    }, "function=true");

    spec.delimit = function($function) {
      var $this = this, $list, $sublist;

      $list = $SC.Array();
      $sublist = this.species().new();
      this.do($SC.Function(function($item, $i) {
        if (BOOL($function.value($item, $i))) {
          $list = $list.add($sublist);
          $sublist = $this.species().new();
        } else {
          $sublist = $sublist.add($item);
        }
      }));
      $list = $list.add($sublist);

      return $list;
    };

    spec.clump = fn(function($groupSize) {
      var $this = this, $list, $sublist;

      $list = $SC.Array();
      $sublist = this.species().new($groupSize);
      this.do($SC.Function(function($item) {
        $sublist.add($item);
        if ($sublist.size() >= $groupSize) {
          $list.add($sublist);
          $sublist = $this.species().new($groupSize);
        }
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    }, "groupSize");

    spec.clumps = fn(function($groupSizeList) {
      var $this = this, $list, $subSize, $sublist, i = 0;

      $list = $SC.Array();
      $subSize = $groupSizeList.at($int_0);
      $sublist = this.species().new($subSize);
      this.do($SC.Function(function($item) {
        $sublist = $sublist.add($item);
        if ($sublist.size() >= $subSize) {
          $list = $list.add($sublist);
          $subSize = $groupSizeList.wrapAt($SC.Integer(++i));
          $sublist = $this.species().new($subSize);
        }
      }));
      if ($sublist.size() > 0) {
        $list = $list.add($sublist);
      }

      return $list;
    }, "groupSizeList");

    spec.curdle = fn(function($probability) {
      return this.separate($SC.Function(function() {
        return $probability.coin();
      }));
    }, "probability");

    spec.flatten = fn(function($numLevels) {
      return this._flatten($numLevels.__num__());
    }, "numLevels=1");

    spec._flatten = fn(function(numLevels) {
      var $list;

      if (numLevels <= 0) {
        return this;
      }
      numLevels = numLevels - 1;

      $list = this.species().new();
      this.do($SC.Function(function($item) {
        if ($item._flatten) {
          $list = $list.addAll($item._flatten(numLevels));
        } else {
          $list = $list.add($item);
        }
      }));

      return $list;
    }, "numLevels");

    spec.flat = function() {
      return this._flat(this.species().new(this.flatSize()));
    };

    spec._flat = fn(function($list) {
      this.do($SC.Function(function($item) {
        if ($item._flat) {
          $list = $item._flat($list);
        } else {
          $list = $list.add($item);
        }
      }));
      return $list;
    }, "list");

    spec.flatIf = fn(function($func) {
      return this._flatIf($func);
    }, "func");

    spec._flatIf = function($func) {
      var $list;

      $list = this.species().new(this.size());
      this.do($SC.Function(function($item, $i) {
        if ($item._flatIf && BOOL($func.value($item, $i))) {
          $list = $list.addAll($item._flatIf($func));
        } else {
          $list = $list.add($item);
        }
      }));

      return $list;
    };

    spec.flop = function() {
      var $this = this, $list, $size, $maxsize;

      $size = this.size();
      $maxsize = $int_0;
      this.do($SC.Function(function($sublist) {
        var $sz;
        if (BOOL($sublist.isSequenceableCollection())) {
          $sz = $sublist.size();
        } else {
          $sz = $int_1;
        }
        if ($sz > $maxsize) {
          $maxsize = $sz;
        }
      }));

      $list = this.species().fill($maxsize, $SC.Function(function() {
        return $this.species().new($size);
      }));

      this.do($SC.Function(function($isublist) {
        if (BOOL($isublist.isSequenceableCollection())) {
          $list.do($SC.Function(function($jsublist, $j) {
            $jsublist.add($isublist.wrapAt($j));
          }));
        } else {
          $list.do($SC.Function(function($jsublist) {
            $jsublist.add($isublist);
          }));
        }
      }));

      return $list;
    };

    spec.flopWith = fn(function($func) {
      var $this = this, $maxsize;

      $maxsize = this.maxValue($SC.Function(function($sublist) {
        if (BOOL($sublist.isSequenceableCollection())) {
          return $sublist.size();
        }
        return $int_1;
      }));

      return this.species().fill($maxsize, $SC.Function(function($i) {
        return $func.valueArray($this.collect($SC.Function(function($sublist) {
          if (BOOL($sublist.isSequenceableCollection())) {
            return $sublist.wrapAt($i);
          } else {
            return $sublist;
          }
        })));
      }));
    }, "func");

    // TODO: implements flopTogether
    // TODO: implements flopDeep
    // TODO: implements wrapAtDepth
    // TODO: implements unlace
    // TODO: implements integrate
    // TODO: implements differentiate
    // TODO: implements convertDigits
    // TODO: implements hammingDistance
    // TODO: implements degreeToKey
    // TODO: implements keyToDegree
    // TODO: implements nearestInScale
    // TODO: implements nearestInList
    // TODO: implements transposeKey
    // TODO: implements mode
    // TODO: implements performDegreeToKey
    // TODO: implements performNearestInList
    // TODO: implements performNearestInScale
    // TODO: implements convertRhythm
    // TODO: implements sumRhythmDivisions
    // TODO: implements convertOneRhythm

    spec.isSequenceableCollection = utils.alwaysReturn$true;

    spec.containsSeqColl = function() {
      return this.any($SC.Function(function($_) {
        return $_.isSequenceableCollection();
      }));
    };

    spec.neg = function() {
      return this.performUnaryOp($SC.Symbol("neg"));
    };

    spec.bitNot = function() {
      return this.performUnaryOp($SC.Symbol("bitNot"));
    };

    spec.abs = function() {
      return this.performUnaryOp($SC.Symbol("abs"));
    };

    spec.ceil = function() {
      return this.performUnaryOp($SC.Symbol("ceil"));
    };

    spec.floor = function() {
      return this.performUnaryOp($SC.Symbol("floor"));
    };

    spec.frac = function() {
      return this.performUnaryOp($SC.Symbol("frac"));
    };

    spec.sign = function() {
      return this.performUnaryOp($SC.Symbol("sign"));
    };

    spec.squared = function() {
      return this.performUnaryOp($SC.Symbol("squared"));
    };

    spec.cubed = function() {
      return this.performUnaryOp($SC.Symbol("cubed"));
    };

    spec.sqrt = function() {
      return this.performUnaryOp($SC.Symbol("sqrt"));
    };

    spec.exp = function() {
      return this.performUnaryOp($SC.Symbol("exp"));
    };

    spec.reciprocal = function() {
      return this.performUnaryOp($SC.Symbol("reciprocal"));
    };

    spec.midicps = function() {
      return this.performUnaryOp($SC.Symbol("midicps"));
    };

    spec.cpsmidi = function() {
      return this.performUnaryOp($SC.Symbol("cpsmidi"));
    };

    spec.midiratio = function() {
      return this.performUnaryOp($SC.Symbol("midiratio"));
    };

    spec.ratiomidi = function() {
      return this.performUnaryOp($SC.Symbol("ratiomidi"));
    };

    spec.ampdb = function() {
      return this.performUnaryOp($SC.Symbol("ampdb"));
    };

    spec.dbamp = function() {
      return this.performUnaryOp($SC.Symbol("dbamp"));
    };

    spec.octcps = function() {
      return this.performUnaryOp($SC.Symbol("octcps"));
    };

    spec.cpsoct = function() {
      return this.performUnaryOp($SC.Symbol("cpsoct"));
    };

    spec.log = function() {
      return this.performUnaryOp($SC.Symbol("log"));
    };

    spec.log2 = function() {
      return this.performUnaryOp($SC.Symbol("log2"));
    };

    spec.log10 = function() {
      return this.performUnaryOp($SC.Symbol("log10"));
    };

    spec.sin = function() {
      return this.performUnaryOp($SC.Symbol("sin"));
    };

    spec.cos = function() {
      return this.performUnaryOp($SC.Symbol("cos"));
    };

    spec.tan = function() {
      return this.performUnaryOp($SC.Symbol("tan"));
    };

    spec.asin = function() {
      return this.performUnaryOp($SC.Symbol("asin"));
    };

    spec.acos = function() {
      return this.performUnaryOp($SC.Symbol("acos"));
    };

    spec.atan = function() {
      return this.performUnaryOp($SC.Symbol("atan"));
    };

    spec.sinh = function() {
      return this.performUnaryOp($SC.Symbol("sinh"));
    };

    spec.cosh = function() {
      return this.performUnaryOp($SC.Symbol("cosh"));
    };

    spec.tanh = function() {
      return this.performUnaryOp($SC.Symbol("tanh"));
    };

    spec.rand = function() {
      return this.performUnaryOp($SC.Symbol("rand"));
    };

    spec.rand2 = function() {
      return this.performUnaryOp($SC.Symbol("rand2"));
    };

    spec.linrand = function() {
      return this.performUnaryOp($SC.Symbol("linrand"));
    };

    spec.bilinrand = function() {
      return this.performUnaryOp($SC.Symbol("bilinrand"));
    };

    spec.sum3rand = function() {
      return this.performUnaryOp($SC.Symbol("sum3rand"));
    };

    spec.distort = function() {
      return this.performUnaryOp($SC.Symbol("distort"));
    };

    spec.softclip = function() {
      return this.performUnaryOp($SC.Symbol("softclip"));
    };

    spec.coin = function() {
      return this.performUnaryOp($SC.Symbol("coin"));
    };

    spec.even = function() {
      return this.performUnaryOp($SC.Symbol("even"));
    };

    spec.odd = function() {
      return this.performUnaryOp($SC.Symbol("odd"));
    };

    spec.isPositive = function() {
      return this.performUnaryOp($SC.Symbol("isPositive"));
    };

    spec.isNegative = function() {
      return this.performUnaryOp($SC.Symbol("isNegative"));
    };

    spec.isStrictlyPositive = function() {
      return this.performUnaryOp($SC.Symbol("isStrictlyPositive"));
    };

    spec.rectWindow = function() {
      return this.performUnaryOp($SC.Symbol("rectWindow"));
    };

    spec.hanWindow = function() {
      return this.performUnaryOp($SC.Symbol("hanWindow"));
    };

    spec.welWindow = function() {
      return this.performUnaryOp($SC.Symbol("welWindow"));
    };

    spec.triWindow = function() {
      return this.performUnaryOp($SC.Symbol("triWindow"));
    };

    spec.scurve = function() {
      return this.performUnaryOp($SC.Symbol("scurve"));
    };

    spec.ramp = function() {
      return this.performUnaryOp($SC.Symbol("ramp"));
    };

    spec.asFloat = function() {
      return this.performUnaryOp($SC.Symbol("asFloat"));
    };

    spec.asInteger = function() {
      return this.performUnaryOp($SC.Symbol("asInteger"));
    };

    spec.nthPrime = function() {
      return this.performUnaryOp($SC.Symbol("nthPrime"));
    };

    spec.prevPrime = function() {
      return this.performUnaryOp($SC.Symbol("prevPrime"));
    };

    spec.nextPrime = function() {
      return this.performUnaryOp($SC.Symbol("nextPrime"));
    };

    spec.indexOfPrime = function() {
      return this.performUnaryOp($SC.Symbol("indexOfPrime"));
    };

    spec.real = function() {
      return this.performUnaryOp($SC.Symbol("real"));
    };

    spec.imag = function() {
      return this.performUnaryOp($SC.Symbol("imag"));
    };

    spec.magnitude = function() {
      return this.performUnaryOp($SC.Symbol("magnitude"));
    };

    spec.magnitudeApx = function() {
      return this.performUnaryOp($SC.Symbol("magnitudeApx"));
    };

    spec.phase = function() {
      return this.performUnaryOp($SC.Symbol("phase"));
    };

    spec.angle = function() {
      return this.performUnaryOp($SC.Symbol("angle"));
    };

    spec.rho = function() {
      return this.performUnaryOp($SC.Symbol("rho"));
    };

    spec.theta = function() {
      return this.performUnaryOp($SC.Symbol("theta"));
    };

    spec.degrad = function() {
      return this.performUnaryOp($SC.Symbol("degrad"));

    };
    spec.raddeg = function() {
      return this.performUnaryOp($SC.Symbol("raddeg"));
    };

    spec["+"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("+"), $aNumber, $adverb);
    };

    spec["-"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("-"), $aNumber, $adverb);
    };

    spec["*"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("*"), $aNumber, $adverb);
    };

    spec["/"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("/"), $aNumber, $adverb);
    };

    spec.div = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("div"), $aNumber, $adverb);
    };

    spec.mod = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("mod"), $aNumber, $adverb);
    };

    spec.pow = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("pow"), $aNumber, $adverb);
    };

    spec.min = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("min"), $aNumber, $adverb);
    };

    spec.max = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("max"), $aNumber, $adverb);
    };

    spec["<"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("<"), $aNumber, $adverb);
    };

    spec["<="] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("<="), $aNumber, $adverb);
    };

    spec[">"] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol(">"), $aNumber, $adverb);
    };

    spec[">="] = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol(">="), $aNumber, $adverb);
    };

    spec.bitAnd = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitAnd"), $aNumber, $adverb);
    };

    spec.bitOr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitOr"), $aNumber, $adverb);
    };

    spec.bitXor = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitXor"), $aNumber, $adverb);
    };

    spec.bitHammingDistance = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("bitHammingDistance"), $aNumber, $adverb);
    };

    spec.lcm = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("lcm"), $aNumber, $adverb);
    };

    spec.gcd = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("gcd"), $aNumber, $adverb);
    };

    spec.round = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("round"), $aNumber, $adverb);
    };

    spec.roundUp = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("roundUp"), $aNumber, $adverb);
    };

    spec.trunc = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("trunc"), $aNumber, $adverb);
    };

    spec.atan2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("atan2"), $aNumber, $adverb);
    };

    spec.hypot = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("hypot"), $aNumber, $adverb);
    };

    spec.hypotApx = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("hypotApx"), $aNumber, $adverb);
    };

    spec.leftShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("leftShift"), $aNumber, $adverb);
    };

    spec.rightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("rightShift"), $aNumber, $adverb);
    };

    spec.unsignedRightShift = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("unsignedRightShift"), $aNumber, $adverb);
    };

    spec.ring1 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring1"), $aNumber, $adverb);
    };

    spec.ring2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring2"), $aNumber, $adverb);
    };

    spec.ring3 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring3"), $aNumber, $adverb);
    };

    spec.ring4 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("ring4"), $aNumber, $adverb);
    };

    spec.difsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("difsqr"), $aNumber, $adverb);
    };

    spec.sumsqr = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sumsqr"), $aNumber, $adverb);
    };

    spec.sqrsum = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sqrsum"), $aNumber, $adverb);
    };

    spec.sqrdif = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("sqrdif"), $aNumber, $adverb);
    };

    spec.absdif = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("absdif"), $aNumber, $adverb);
    };

    spec.thresh = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("thresh"), $aNumber, $adverb);
    };

    spec.amclip = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("amclip"), $aNumber, $adverb);
    };

    spec.scaleneg = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("scaleneg"), $aNumber, $adverb);
    };

    spec.clip2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("clip2"), $aNumber, $adverb);
    };

    spec.fold2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("fold2"), $aNumber, $adverb);
    };

    spec.wrap2 = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("wrap2"), $aNumber, $adverb);
    };

    spec.excess = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("excess"), $aNumber, $adverb);
    };

    spec.firstArg = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("firstArg"), $aNumber, $adverb);
    };

    spec.rrand = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("rrand"), $aNumber, $adverb);
    };

    spec.exprand = function($aNumber, $adverb) {
      return this.performBinaryOp($SC.Symbol("exprand"), $aNumber, $adverb);
    };

    spec.performUnaryOp = function($aSelector) {
      return this.collect($SC.Function(function($item) {
        return $item.perform($aSelector);
      }));
    };

    spec.performBinaryOp = function($aSelector, $theOperand, $adverb) {
      return $theOperand.performBinaryOpOnSeqColl($aSelector, this, $adverb);
    };

    spec.performBinaryOpOnSeqColl = function($aSelector, $theOperand, $adverb) {
      var adverb;

      if ($adverb === $nil || !$adverb) {
        return _performBinaryOpOnSeqColl_adverb_nil(
          this, $aSelector, $theOperand
        );
      }
      if (BOOL($adverb.isInteger())) {
        return _performBinaryOpOnSeqColl_adverb_int(
          this, $aSelector, $theOperand, $adverb.valueOf()
        );
      }

      adverb = $adverb.__sym__();
      if (adverb === "t") {
        return _performBinaryOpOnSeqColl_adverb_t(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "x") {
        return _performBinaryOpOnSeqColl_adverb_x(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "s") {
        return _performBinaryOpOnSeqColl_adverb_s(
          this, $aSelector, $theOperand
        );
      }
      if (adverb === "f") {
        return _performBinaryOpOnSeqColl_adverb_f(
          this, $aSelector, $theOperand
        );
      }

      throw new Error(
        "unrecognized adverb: '" + adverb + "' for operator '" + String($aSelector) + "'"
      );
    };

    function _performBinaryOpOnSeqColl_adverb_nil($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().max($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add(
          $theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i))
        );
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_int($this, $aSelector, $theOperand, adverb) {
      var $size, $newList, $i;
      var size, i;

      if (adverb === 0) {
        $size = $this.size().max($theOperand.size());
        $newList = $this.species().new($size);

        size = $size.__int__();
        for (i = 0; i < size; ++i) {
          $i = $SC.Integer(i);
          $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
        }

      } else if (adverb > 0) {

        $newList = $theOperand.collect($SC.Function(function($item) {
          return $item.perform($aSelector, $this, $SC.Integer(adverb - 1));
        }));

      } else {

        $newList = $this.collect($SC.Function(function($item) {
          return $theOperand.perform($aSelector, $item, $SC.Integer(adverb + 1));
        }));

      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_t($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $theOperand.size();
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add($theOperand.at($i).perform($aSelector, $this));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_x($this, $aSelector, $theOperand) {
      var $size, $newList;

      $size = $theOperand.size() ["*"] ($this.size());
      $newList = $this.species().new($size);
      $theOperand.do($SC.Function(function($a) {
        $this.do($SC.Function(function($b) {
          $newList.add($a.perform($aSelector, $b));
        }));
      }));

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_s($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().min($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add($theOperand.wrapAt($i).perform($aSelector, $this.wrapAt($i)));
      }

      return $newList;
    }

    function _performBinaryOpOnSeqColl_adverb_f($this, $aSelector, $theOperand) {
      var $size, $newList, $i;
      var size, i;

      $size = $this.size().max($theOperand.size());
      $newList = $this.species().new($size);

      size = $size.__int__();
      for (i = 0; i < size; ++i) {
        $i = $SC.Integer(i);
        $newList.add($theOperand.foldAt($i).perform($aSelector, $this.foldAt($i)));
      }

      return $newList;
    }

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber, $adverb) {
      return this.collect($SC.Function(function($item) {
        return $aNumber.perform($aSelector, $item, $adverb);
      }));
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex, $adverb) {
      return this.collect($SC.Function(function($item) {
        return $aComplex.perform($aSelector, $item, $adverb);
      }));
    };

    spec.asFraction = function($denominator, $fasterBetter) {
      return this.collect($SC.Function(function($item) {
        return $item.asFraction($denominator, $fasterBetter);
      }));
    };

    // TODO: implements asPoint
    // TODO: implements asRect

    spec.ascii = function() {
      return this.collect($SC.Function(function($item) {
        return $item.ascii();
      }));
    };

    spec.rate = function() {
      if (this.size().__int__() === 1) {
        return this.first().rate();
      }
      return this.collect($SC.Function(function($item) {
        return $item.rate();
      })).minItem();
    };

    spec.multiChannelPerform = function() {
      var method;

      if (this.size() > 0) {
        method = utils.getMethod("Object", "multiChannelPerform");
        return method.apply(this, arguments);
      }

      return this.class().new();
    };

    spec.multichannelExpandRef = utils.nop;

    spec.clip = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("clip") ].concat(slice.call(arguments))
      );
    };

    spec.wrap = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("wrap") ].concat(slice.call(arguments))
      );
    };

    spec.fold = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("fold") ].concat(slice.call(arguments))
      );
    };

    spec.linlin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("linlin") ].concat(slice.call(arguments))
      );
    };

    spec.linexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("linexp") ].concat(slice.call(arguments))
      );
    };

    spec.explin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("explin") ].concat(slice.call(arguments))
      );
    };

    spec.expexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("expexp") ].concat(slice.call(arguments))
      );
    };

    spec.lincurve = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lincurve") ].concat(slice.call(arguments))
      );
    };

    spec.curvelin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("curvelin") ].concat(slice.call(arguments))
      );
    };

    spec.bilin = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("bilin") ].concat(slice.call(arguments))
      );
    };

    spec.biexp = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("biexp") ].concat(slice.call(arguments))
      );
    };

    spec.moddif = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("moddif") ].concat(slice.call(arguments))
      );
    };

    spec.range = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("range") ].concat(slice.call(arguments))
      );
    };

    spec.exprange = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("exprange") ].concat(slice.call(arguments))
      );
    };

    spec.curverange = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("curverange") ].concat(slice.call(arguments))
      );
    };

    spec.unipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("unipolar") ].concat(slice.call(arguments))
      );
    };

    spec.bipolar = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("bipolar") ].concat(slice.call(arguments))
      );
    };

    spec.lag = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag") ].concat(slice.call(arguments))
      );
    };

    spec.lag2 = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag2") ].concat(slice.call(arguments))
      );
    };

    spec.lag3 = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag3") ].concat(slice.call(arguments))
      );
    };

    spec.lagud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lagud") ].concat(slice.call(arguments))
      );
    };

    spec.lag2ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag2ud") ].concat(slice.call(arguments))
      );
    };

    spec.lag3ud = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("lag3ud") ].concat(slice.call(arguments))
      );
    };

    spec.varlag = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("varlag") ].concat(slice.call(arguments))
      );
    };

    spec.slew = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("slew") ].concat(slice.call(arguments))
      );
    };

    spec.blend = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("blend") ].concat(slice.call(arguments))
      );
    };

    spec.checkBadValues = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("checkBadValues") ].concat(slice.call(arguments))
      );
    };

    spec.prune = function() {
      return this.multiChannelPerform.apply(
        this, [ $SC.Symbol("prune") ].concat(slice.call(arguments))
      );
    };

    // TODO: implements minNyquist
    // TODO: implements sort
    // TODO: implements sortBy
    // TODO: implements sortMap
    // TODO: implements sortedMedian
    // TODO: implements median
    // TODO: implements quickSort
    // TODO: implements order

    spec.swap = fn(function($i, $j) {
      var $temp;

      $temp = this.at($i);
      this.put($i, this.at($j));
      this.put($j, $temp);

      return this;
    }, "i; j");

    // TODO: implements quickSortRange
    // TODO: implements mergeSort
    // TODO: implements mergeSortTemp
    // TODO: implements mergeTemp
    // TODO: implements insertionSort
    // TODO: implements insertionSortRange
    // TODO: implements hoareMedian
    // TODO: implements hoareFind
    // TODO: implements hoarePartition
    // TODO: implements $streamContensts
    // TODO: implements $streamContenstsLimit

    spec.wrapAt = fn(function($index) {
      $index = $index ["%"] (this.size());
      return this.at($index);
    }, "index");

    spec.wrapPut = fn(function($index, $value) {
      $index = $index ["%"] (this.size());
      return this.put($index, $value);
    }, "index; value");

    // TODO: implements reduce
    // TODO: implements join
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements schedBundleArrayOnClock
  });

})(sc);

// src/sc/lang/classlib/Collections/ArrayedCollection.js
(function(sc) {

  var slice = [].slice;
  var fn  = sc.lang.fn;
  var $SC = sc.lang.$SC;
  var iterator = sc.lang.iterator;
  var rand     = sc.libs.random;
  var mathlib  = sc.libs.mathlib;

  sc.lang.klass.refine("ArrayedCollection", function(spec, utils) {
    var BOOL   = utils.BOOL;
    var $nil   = utils.$nil;
    var $int_0 = utils.$int_0;
    var $int_1 = utils.$int_1;

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.valueOf();
      });
    };

    spec.__elem__ = function(item) {
      return item;
    };

    spec._ThrowIfImmutable = function() {
      if (this._immutable) {
        throw new Error("Attempted write to immutable object.");
      }
    };

    // TODO: implements $newClear
    // TODO: implements indexedSize

    spec.size = function() {
      return $SC.Integer(this._.length);
    };

    // TODO: implements maxSize

    spec.swap = fn(function($a, $b) {
      var raw = this._;
      var a, b, len, tmp;

      this._ThrowIfImmutable();

      a = $a.__int__();
      b = $b.__int__();
      len = raw.length;

      if (a < 0 || len <= a || b < 0 || len <= b) {
        throw new Error("out of index");
      }

      tmp = raw[b];
      raw[b] = raw[a];
      raw[a] = tmp;

      return this;
    }, "a; b");

    spec.at = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            return $nil;
          }
          return this._[i];
        }, this));
      }

      i = $index.__int__();

      return this._[i] || $nil;
    }, "index");

    spec.clipAt = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          i = mathlib.clip_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.clip_idx($index.__int__(), this._.length);

      return this._[i];
    }, "index");

    spec.wrapAt = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          var i = mathlib.wrap_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.wrap_idx($index.__int__(), this._.length);

      return this._[i];
    }, "index");

    spec.foldAt = fn(function($index) {
      var i;

      if (Array.isArray($index._)) {
        return $SC.Array($index._.map(function($index) {
          var i = mathlib.fold_idx($index.__int__(), this._.length);
          return this._[i];
        }, this));
      }

      i = mathlib.fold_idx($index.__int__(), this._.length);

      return this._[i];
    }, "index");

    spec.put = fn(function($index, $item) {
      var i;

      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          var i = $index.__int__();
          if (i < 0 || this._.length <= i) {
            throw new Error("out of index");
          }
          this._[i] = this.__elem__($item);
        }, this);
      } else {
        i = $index.__int__();
        if (i < 0 || this._.length <= i) {
          throw new Error("out of index");
        }
        this._[i] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.clipPut = fn(function($index, $item) {
      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.clip_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.wrapPut = fn(function($index, $item) {
      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.wrap_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.foldPut = fn(function($index, $item) {
      this._ThrowIfImmutable();

      if (Array.isArray($index._)) {
        $index._.forEach(function($index) {
          this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
        }, this);
      } else {
        this._[mathlib.fold_idx($index.__int__(), this._.length)] = this.__elem__($item);
      }

      return this;
    }, "index; item");

    spec.removeAt = fn(function($index) {
      var raw = this._;
      var index;

      this._ThrowIfImmutable();

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      return raw.splice(index, 1)[0];
    }, "index");

    spec.takeAt = fn(function($index) {
      var raw = this._;
      var index, ret, instead;

      this._ThrowIfImmutable();

      index = $index.__int__();
      if (index < 0 || raw.length <= index) {
        throw new Error("out of index");
      }

      ret = raw[index];
      instead = raw.pop();
      if (index !== raw.length) {
        raw[index] = instead;
      }

      return ret;
    }, "index");

    spec.indexOf = fn(function($item) {
      var index;

      index = this._.indexOf($item);
      return index === -1 ? $nil : $SC.Integer(index);
    }, "item");

    spec.indexOfGreaterThan = fn(function($val) {
      var raw = this._;
      var val, i, imax = raw.length;

      val = $val.__num__();
      for (i = 0; i < imax; ++i) {
        if (raw[i].__num__() > val) {
          return $SC.Integer(i);
        }
      }

      return $nil;
    }, "val");

    spec.takeThese = fn(function($func) {
      var raw = this._;
      var i = 0, $i;

      $i = $SC.Integer(i);
      while (i < raw.length) {
        if (BOOL($func.value(raw[i], $i))) {
          this.takeAt($i);
        } else {
          $i = $SC.Integer(++i);
        }
      }

      return this;
    }, "func");

    spec.replace = fn(function($find, $replace) {
      var $index, $out, $array;

      this._ThrowIfImmutable();

      $out     = $SC.Array();
      $array   = this;
      $find    = $find.asArray();
      $replace = $replace.asArray();
      $SC.Function(function() {
        return ($index = $array.find($find)).notNil();
      }).while($SC.Function(function() {
        $out = $out ["++"] ($array.keep($index)) ["++"] ($replace);
        $array = $array.drop($index ["+"] ($find.size()));
      }));

      return $out ["++"] ($array);
    }, "find; replace");

    spec.slotSize = function() {
      return this.size();
    };

    spec.slotAt = function($index) {
      return this.at($index);
    };

    spec.slotPut = function($index, $value) {
      return this.put($index, $value);
    };

    spec.slotKey = function($index) {
      return $index;
    };

    spec.slotIndex = utils.alwaysReturn$nil;

    spec.getSlots = function() {
      return this.copy();
    };

    spec.setSlots = function($array) {
      return this.overWrite($array);
    };

    spec.atModify = fn(function($index, $function) {
      this.put($index, $function.value(this.at($index), $index));
      return this;
    }, "index; function");

    spec.atInc = fn(function($index, $inc) {
      this.put($index, this.at($index) ["+"] ($inc));
      return this;
    }, "index; inc=1");

    spec.atDec = fn(function($index, $dec) {
      this.put($index, this.at($index) ["-"] ($dec));
      return this;
    }, "index; dec=1");

    spec.isArray = utils.alwaysReturn$true;
    spec.asArray = utils.nop;

    spec.copyRange = fn(function($start, $end) {
      var start, end, instance, raw;

      if ($start === $nil) {
        start = 0;
      } else {
        start = $start.__int__();
      }
      if ($end === $nil) {
        end = this._.length;
      } else {
        end = $end.__int__();
      }
      raw = this._.slice(start, end + 1);

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    }, "start; end");

    spec.copySeries = fn(function($first, $second, $last) {
      var i, first, second, last, step, instance, raw;

      raw = [];
      if ($first === $nil) {
        first = 0;
      } else {
        first = $first.__int__();
      }
      if ($second === $nil) {
        second = first + 1;
      } else {
        second = $second.__int__();
      }
      if ($last === $nil) {
        last = Infinity;
      } else {
        last = $last.__int__();
      }
      last = Math.max(0, Math.min(last, this._.length - 1));
      step = second - first;

      if (step > 0) {
        for (i = first; i <= last; i += step) {
          raw.push(this._[i]);
        }
      } else if (step < 0) {
        for (i = first; i >= last; i += step) {
          raw.push(this._[i]);
        }
      }

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    }, "first; second; last");

    spec.putSeries = fn(function($first, $second, $last, $value) {
      var i, first, second, last, step;

      this._ThrowIfImmutable();

      if ($first === $nil) {
        first = 0;
      } else {
        first = $first.__int__();
      }
      if ($second === $nil) {
        second = first + 1;
      } else {
        second = $second.__int__();
      }
      if ($last === $nil) {
        last = Infinity;
      } else {
        last = $last.__int__();
      }
      last = Math.max(0, Math.min(last, this._.length - 1));
      step = second - first;

      $value = this.__elem__($value);

      if (step > 0) {
        for (i = first; i <= last; i += step) {
          this._[i] = $value;
        }
      } else if (step < 0) {
        for (i = first; i >= last; i += step) {
          this._[i] = $value;
        }
      }

      return this;
    }, "first; second; last; value");

    spec.add = fn(function($item) {
      this._ThrowIfImmutable();
      this._.push(this.__elem__($item));

      return this;
    }, "item");

    spec.addAll = fn(function($aCollection) {
      var $this = this;

      this._ThrowIfImmutable();

      if ($aCollection.isSequenceableCollection().valueOf()) {
        $aCollection.do($SC.Function(function($item) {
          $this._.push($this.__elem__($item));
        }));
      } else {
        this.add($aCollection);
      }

      return this;
    }, "aCollection");

    spec.putEach = fn(function($keys, $values) {
      var keys, values, i, imax;

      this._ThrowIfImmutable();

      $keys   = $keys.asArray();
      $values = $values.asArray();

      keys   = $keys._;
      values = $values._;
      for (i = 0, imax = keys.length; i < imax; ++i) {
        this.put(keys[i], this.__elem__(values[i % values.length]));
      }

      return this;
    }, "keys; values");

    spec.extend = fn(function($size, $item) {
      var instance, raw, size, i;

      raw  = this._.slice();
      size = $size.__int__();
      if (raw.length > size) {
        raw.splice(size);
      } else if (raw.length < size) {
        for (i = size - raw.length; i--; ) {
          raw.push(this.__elem__($item));
        }
      }

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    }, "size; item");

    spec.insert = fn(function($index, $item) {
      var index;

      this._ThrowIfImmutable();

      index = Math.max(0, $index.__int__());
      this._.splice(index, 0, this.__elem__($item));

      return this;
    }, "index; item");

    spec.move = function($fromIndex, $toIndex) {
      return this.insert($toIndex, this.removeAt($fromIndex));
    };

    spec.addFirst = fn(function($item) {
      var instance, raw;

      raw = this._.slice();
      raw.unshift(this.__elem__($item));

      instance = new this.__Spec();
      instance._ = raw;
      return instance;
    }, "item");

    spec.addIfNotNil = fn(function($item) {
      if ($item === $nil) {
        return this;
      }

      return this.addFirst(this.__elem__($item));
    }, "item");

    spec.pop = function() {
      if (this._.length === 0) {
        return $nil;
      }
      this._ThrowIfImmutable();
      return this._.pop();
    };

    spec["++"] = function($anArray) {
      var instance, raw;

      raw = this._.slice();

      instance = new this.__Spec();
      instance._ = raw;
      if ($anArray !== $nil) {
        instance.addAll($anArray);
      }
      return instance;
    };

    // TODO: implements overWrite
    // TODO: implements grow
    // TODO: implements growClear

    spec.seriesFill = fn(function($start, $step) {
      var i, imax;

      for (i = 0, imax = this._.length; i < imax; ++i) {
        this.put($SC.Integer(i), $start);
        $start = $start ["+"] ($step);
      }

      return this;
    }, "start; step");

    spec.fill = fn(function($value) {
      var raw, i, imax;

      this._ThrowIfImmutable();

      $value = this.__elem__($value);

      raw = this._;
      for (i = 0, imax = raw.length; i < imax; ++i) {
        raw[i] = $value;
      }

      return this;
    }, "value");

    spec.do = function($function) {
      iterator.execute(
        iterator.array$do(this),
        $function
      );
      return this;
    };

    spec.reverseDo = function($function) {
      iterator.execute(
        iterator.array$reverseDo(this),
        $function
      );
      return this;
    };

    spec.reverse = function() {
      var $res = this.copy();

      $res._.reverse();

      return $res;
    };

    spec.windex = function() {
      var raw = this._;
      var x, r, i, imax;

      // <-- _ArrayWindex -->
      x = 0;
      r = rand.next();
      for (i = 0, imax = raw.length; i < imax; ++i) {
        x += raw[i].__num__();
        if (x >= r) {
          return $SC.Integer(i);
        }
      }

      return $int_0;
    };

    spec.normalizeSum = function() {
      return this ["*"] (this.sum().reciprocal());
    };

    spec.normalize = fn(function($min, $max) {
      var $minItem, $maxItem;

      $minItem = this.minItem();
      $maxItem = this.maxItem();
      return this.collect($SC.Function(function($el) {
        return $el.linlin($minItem, $maxItem, $min, $max);
      }));
    }, "min=0.0; max=1.0");

    // TODO: implements asciiPlot
    // TODO: implements perfectShuffle
    // TODO: implements performInPlace

    spec.clipExtend = fn(function($length) {
      var last = this._[this._.length - 1] || $nil;
      return this.extend($length, last);
    }, "length");

    spec.rank = function() {
      return $int_1 ["+"] (this.first().rank());
    };

    spec.shape = function() {
      return $SC.Array([ this.size() ]) ["++"] (this.at($int_0).shape());
    };

    spec.reshape = function() {
      var $result;
      var shape, size, i, imax;

      shape = slice.call(arguments);

      size = 1;
      for (i = 0, imax = shape.length; i < imax; ++i) {
        size *= shape[i].__int__();
      }

      $result = this.flat().wrapExtend($SC.Integer(size));
      for (i = imax - 1; i >= 1; --i) {
        $result = $result.clump(shape[i]);
      }

      return $result;
    };

    spec.reshapeLike = fn(function($another, $indexing) {
      var $index, $flat;

      $index = $int_0;
      $flat  = this.flat();

      return $another.deepCollect($SC.Integer(0x7FFFFFFF), $SC.Function(function() {
        var $item = $flat.perform($indexing, $index);
        $index = $index.__inc__();
        return $item;
      }));
    }, "another; indexing=\\wrapAt");

    // TODO: implements deepCollect
    // TODO: implements deepDo

    spec.unbubble = fn(function($depth, $levels) {
      if ($depth.__num__() <= 0) {
        if (this.size().__int__() > 1) {
          return this;
        }
        if ($levels.__int__() <= 1) {
          return this.at($int_0);
        }
        return this.at($int_0).unbubble($depth, $levels.__dec__());
      }

      return this.collect($SC.Function(function($item) {
        return $item.unbubble($depth.__dec__());
      }));
    }, "depth=0; levels=1");

    spec.bubble = fn(function($depth, $levels) {
      if ($depth.__int__() <= 0) {
        if ($levels.__int__() <= 1) {
          return $SC.Array([ this ]);
        }
        return $SC.Array([ this.bubble($depth, $levels.__dec__()) ]);
      }

      return this.collect($SC.Function(function($item) {
        return $item.bubble($depth.__dec__(), $levels);
      }));
    }, "depth=0; levels=1");

    spec.slice = fn(function($$cuts) {
      var $firstCut, $list;
      var cuts_size, cuts;

      cuts_size = $$cuts.size().__int__();
      if (cuts_size === 0) {
        return this.copy();
      }

      $firstCut = $$cuts.at($int_0);
      if ($firstCut === $nil) {
        $list = this.copy();
      } else {
        $list = this.at($firstCut.asArray());
      }

      if (cuts_size === 1) {
        return $list.unbubble();
      }

      cuts = $$cuts._.slice(1);
      return $list.collect($SC.Function(function($item) {
        return $item.slice.apply($item, cuts);
      })).unbubble();
    }, "*cuts");

    spec.$iota = function() {
      var $a;
      var args, product, i, imax, a;

      args = arguments;

      product = 1;
      for (i = 0, imax = args.length; i < imax; ++i) {
        product *= args[i].__int__();
      }

      a = new Array(product);
      for (i = 0; i < product; ++i) {
        a[i] = $SC.Integer(i);
      }

      $a = $SC.Array(a);
      return $a.reshape.apply($a, args);
    };

    // TODO: implements asRandomTable
    // TODO: implements tableRand
    // TODO: implements msgSize
    // TODO: implements bundleSize
    // TODO: implements clumpBundles

    spec.includes = function($item) {
      return $SC.Boolean(this._.indexOf($item) !== -1);
    };

    spec.asString = function() {
      return $SC.String("[ " + this._.map(function($elem) {
        return $elem.asString().__str__();
      }).join(", ") + " ]");
    };
  });

  sc.lang.klass.refine("RawArray", function(spec, utils) {
    spec.archiveAsCompileString = utils.alwaysReturn$true;
    spec.archiveAsObject = utils.alwaysReturn$true;
    spec.rate = function() {
      return $SC.Symbol("scalar");
    };

    // TODO: implements readFromStream
    // TODO: implements powerset
  });

})(sc);

// src/sc/lang/classlib/Collections/String.js
(function(sc) {

  var fn  = sc.lang.fn;
  var io  = sc.lang.io;
  var $SC = sc.lang.$SC;

  sc.lang.klass.refine("String", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

    spec.__str__ = function() {
      return this.valueOf();
    };

    spec.__elem__ = function($item) {
      if ($item.__tag !== 1028) {
        throw new TypeError("Wrong type.");
      }
      return $item;
    };

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.__str__();
      }).join("");
    };

    spec.toString = function() {
      return this.valueOf();
    };

    // TODO: implements unixCmdActions
    // TODO: implements unixCmdActions_

    spec.$new = function() {
      throw new Error("String.new is illegal, should use literal.");
    };

    // TODO: implements $initClass
    // TODO: implements $doUnixCmdAction
    // TODO: implements unixCmd
    // TODO: implements unixCmdGetStdOut

    spec.asSymbol = function() {
      return $SC.Symbol(this.__str__());
    };

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this.__str__());
      return $SC.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this.__str__());
      return $SC.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      var raw = this.__str__();
      var a, i, imax;

      a = new Array(raw.length);
      for (i = 0, imax = a.length; i < imax; ++i) {
        a[i] = $SC.Integer(raw.charCodeAt(i));
      }

      return $SC.Array(a);
    };

    // TODO: implements stripRTF
    // TODO: implements stripHTML
    // TODO: implements $scDir

    spec.compare = fn(function($aString, $ignoreCase) {
      var araw, braw, length, i, a, b, cmp, func;

      if ($aString.__tag !== 1034) {
        return $nil;
      }

      araw = this._;
      braw = $aString._;
      length = Math.min(araw.length, braw.length);

      if ($ignoreCase.__bool__()) {
        func = function(ch) {
          return ch.toLowerCase();
        };
      } else {
        func = function(ch) {
          return ch;
        };
      }
      for (i = 0; i < length; i++) {
        a = func(araw[i]._).charCodeAt(0);
        b = func(braw[i]._).charCodeAt(0);
        cmp = a - b;
        if (cmp !== 0) {
          return $SC.Integer(cmp < 0 ? -1 : +1);
        }
      }

      if (araw.length < braw.length) {
        cmp = -1;
      } else if (araw.length > braw.length) {
        cmp = 1;
      }

      return $SC.Integer(cmp);
    }, "aString; ignoreCase=false");

    spec["<"] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, $false).valueOf() < 0
      );
    };

    spec[">"] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, $false).valueOf() > 0
      );
    };

    spec["<="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, $false).valueOf() <= 0
      );
    };

    spec[">="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, $false).valueOf() >= 0
      );
    };

    spec["=="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, $false).valueOf() === 0
      );
    };

    spec["!="] = function($aString) {
      return $SC.Boolean(
        this.compare($aString, $false).valueOf() !== 0
      );
    };

    // TODO: implements hash

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber) {
      return $aNumber.asString().perform($aSelector, this);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex) {
      return $aComplex.asString().perform($aSelector, this);
    };

    spec.multiChannelPerform = function() {
      throw new Error("String:multiChannelPerform. Cannot expand strings.");
    };

    spec.isString = utils.alwaysReturn$true;

    spec.asString = utils.nop;

    spec.asCompileString = function() {
      return $SC.String("\"" + this.__str__() + "\"");
    };

    spec.species = function() {
      return $SC("String");
    };

    spec.postln = function() {
      io.post(this.__str__() + "\n");
      return this;
    };

    spec.post = function() {
      io.post(this.__str__());
      return this;
    };

    spec.postcln = function() {
      io.post("// " + this.__str__() + "\n");
      return this;
    };

    spec.postc = function() {
      io.post("// " + this.__str__());
      return this;
    };

    // TODO: implements postf
    // TODO: implements format
    // TODO: implements matchRegexp
    // TODO: implements fformat
    // TODO: implements die
    // TODO: implements error
    // TODO: implements warn
    // TODO: implements inform

    spec["++"] = function($anObject) {
      return $SC.String(
        this.toString() + $anObject.asString().toString()
      );
    };

    spec["+"] = function($anObject) {
      return $SC.String(
        this.toString() + " " + $anObject.asString().toString()
      );
    };

    // TODO: implements catArgs
    // TODO: implements scatArgs
    // TODO: implements ccatArgs
    // TODO: implements catList
    // TODO: implements scatList
    // TODO: implements ccatList
    // TODO: implements split
    // TODO: implements containsStringAt
    // TODO: implements icontainsStringAt
    // TODO: implements contains
    // TODO: implements containsi
    // TODO: implements findRegexp
    // TODO: implements findAllRegexp
    // TODO: implements find
    // TODO: implements findBackwards
    // TODO: implements endsWith
    // TODO: implements beginsWith
    // TODO: implements findAll
    // TODO: implements replace
    // TODO: implements escapeChar
    // TODO: implements shellQuote
    // TODO: implements quote
    // TODO: implements tr
    // TODO: implements insert
    // TODO: implements wrapExtend
    // TODO: implements zeroPad
    // TODO: implements padLeft
    // TODO: implements padRight
    // TODO: implements underlined
    // TODO: implements scramble
    // TODO: implements rotate
    // TODO: implements compile
    // TODO: implements interpret
    // TODO: implements interpretPrint
    // TODO: implements $readNew
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements inspectorClass
    // TODO: implements standardizePath
    // TODO: implements realPath
    // TODO: implements withTrailingSlash
    // TODO: implements withoutTrailingSlash
    // TODO: implements absolutePath
    // TODO: implements pathMatch
    // TODO: implements load
    // TODO: implements loadPaths
    // TODO: implements loadRelative
    // TODO: implements resolveRelative
    // TODO: implements include
    // TODO: implements exclude
    // TODO: implements basename
    // TODO: implements dirname
    // TODO: implements splittext
    // TODO: implements +/+
    // TODO: implements asRelativePath
    // TODO: implements asAbsolutePath
    // TODO: implements systemCmd
    // TODO: implements gethostbyname
    // TODO: implements getenv
    // TODO: implements setenv
    // TODO: implements unsetenv
    // TODO: implements codegen_UGenCtorArg
    // TODO: implements ugenCodeString
    // TODO: implements asSecs
    // TODO: implements speak
    // TODO: implements toLower
    // TODO: implements toUpper
    // TODO: implements mkdir
    // TODO: implements parseYAML
    // TODO: implements parseYAMLFile
  });

})(sc);

// src/sc/lang/classlib/Collections/Set.js
(function(sc) {

  function SCSet() {
    this.__initializeWith__("Collection");
  }

  sc.lang.klass.define(SCSet, "Set : Collection", function() {
    // TODO: implements species
    // TODO: implements copy
    // TODO: implements do
    // TODO: implements clear
    // TODO: implements makeEmpty
    // TODO: implements includes
    // TODO: implements findMatch
    // TODO: implements add
    // TODO: implements remove
    // TODO: implements choose
    // TODO: implements pop
    // TODO: implements powerset
    // TODO: implements unify
    // TODO: implements sect
    // TODO: implements union
    // TODO: implements difference
    // TODO: implements symmetricDifference
    // TODO: implements isSubsetOf
    // TODO: implements initSet
    // TODO: implements putCheck
    // TODO: implements fullCheck
    // TODO: implements grow
    // TODO: implements noCheckAdd
    // TODO: implements scanFor
    // TODO: implements fixCollisionsFrom
    // TODO: implements keyAt
    // TODO: implements asSet
  });

})(sc);

// src/sc/lang/classlib/Collections/Dictionary.js
(function(sc) {

  function SCDictionary() {
    this.__initializeWith__("Set");
    this._ = {};
  }

  sc.lang.klass.define(SCDictionary, "Dictionary : Set", function() {
    // TODO: implements $newFrom
    // TODO: implements at
    // TODO: implements atFail
    // TODO: implements matchAt
    // TODO: implements trueAt
    // TODO: implements add
    // TODO: implements put
    // TODO: implements putAll
    // TODO: implements putPairs
    // TODO: implements getPairs
    // TODO: implements associationAt
    // TODO: implements associationAtFail
    // TODO: implements keys
    // TODO: implements values
    // TODO: implements includes
    // TODO: implements includesKey
    // TODO: implements removeAt
    // TODO: implements removeAtFail
    // TODO: implements remove
    // TODO: implements removeFail
    // TODO: implements keysValuesDo
    // TODO: implements keysValuesChange
    // TODO: implements do
    // TODO: implements keysDo
    // TODO: implements associationsDo
    // TODO: implements pairsDo
    // TODO: implements collect
    // TODO: implements select
    // TODO: implements reject
    // TODO: implements invert
    // TODO: implements merge
    // TODO: implements blend
    // TODO: implements findKeyForValue
    // TODO: implements sortedKeysValuesDo
    // TODO: implements choose
    // TODO: implements order
    // TODO: implements powerset
    // TODO: implements transformEvent
    // TODO: implements embedInStream
    // TODO: implements asSortedArray
    // TODO: implements asKeyValuePairs
    // TODO: implements keysValuesArrayDo
    // TODO: implements grow
    // TODO: implements fixCollisionsFrom
    // TODO: implements scanFor
    // TODO: implements storeItemsOn
    // TODO: implements printItemsOn
  });

  function SCIdentityDictionary() {
    this.__initializeWith__("Dictionary");
  }

  sc.lang.klass.define(SCIdentityDictionary, "IdentityDictionary : Dictionary", function() {
    // TODO: implements at
    // TODO: implements put
    // TODO: implements putGet
    // TODO: implements includesKey
    // TODO: implements findKeyForValue
    // TODO: implements scanFor
    // TODO: implements freezeAsParent
    // TODO: implements insertParent
    // TODO: implements storeItemsOn
    // TODO: implements doesNotUnderstand
    // TODO: implements nextTimeOnGrid
    // TODO: implements asQuant
    // TODO: implements timingOffset
  });

})(sc);

// src/sc/lang/classlib/Collections/Environment.js
(function(sc) {

  function SCEnvironment() {
    this.__initializeWith__("IdentityDictionary");
  }

  sc.lang.klass.define(SCEnvironment, "Environment : IdentityDictionary", function() {
    // TODO: implements $make
    // TODO: implements $use
    // TODO: implements make
    // TODO: implements use
    // TODO: implements eventAt
    // TODO: implements composeEvents
    // TODO: implements $pop
    // TODO: implements $push
    // TODO: implements pop
    // TODO: implements push
    // TODO: implements linkDoc
    // TODO: implements unlinkDoc
  });

})(sc);

// src/sc/lang/classlib/Collections/Event.js
(function(sc) {

  function SCEvent() {
    this.__initializeWith__("Environment");
  }

  sc.lang.klass.define(SCEvent, "Event : Environment", function() {
    // TODO: implements $default
    // TODO: implements $silent
    // TODO: implements $addEventType
    // TODO: implements next
    // TODO: implements delta
    // TODO: implements play
    // TODO: implements isRest
    // TODO: implements isPlaying_
    // TODO: implements isRunning_
    // TODO: implements playAndDelta
    // TODO: implements synchWithQuant
    // TODO: implements asControlInput
    // TODO: implements asUGenInput
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements $initClass
    // TODO: implements $makeDefaultSynthDef
    // TODO: implements $makeParentEvents
  });

})(sc);

// src/sc/lang/classlib/Collections/Array.js
(function(sc) {

  var slice = [].slice;
  var fn    = sc.lang.fn;
  var $SC   = sc.lang.$SC;
  var rand  = sc.libs.random;
  var mathlib = sc.libs.mathlib;

  sc.lang.klass.refine("Array", function(spec, utils) {
    var BOOL    = utils.BOOL;
    var $nil    = utils.$nil;
    var SCArray = $SC("Array");

    spec.$with = function() {
      return $SC.Array(slice.call(arguments));
    };

    spec.reverse = function() {
      // <-- _ArrayReverse -->
      return $SC.Array(this._.slice().reverse());
    };

    spec.scramble = function() {
      var a, tmp, i, j, m;

      // <-- _ArrayScramble -->
      a = this._.slice();
      m = a.length;
      if (m > 1) {
        for (i = 0; m > 0; ++i, --m) {
          j = i + (rand.next() * m)|0;
          tmp  = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
      }

      return $SC.Array(a);
    };

    spec.mirror = function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror -->
      size = raw.length * 2 - 1;
      if (size < 2) {
        return $SC.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $SC.Array(a);
    };

    spec.mirror1 = function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror1 -->
      size = raw.length * 2 - 2;
      if (size < 2) {
        return $SC.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 2, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $SC.Array(a);
    };

    spec.mirror2 = function() {
      var raw = this._;
      var size, i, j, imax, a;

      // <-- _ArrayMirror2 -->
      size = raw.length * 2;
      if (size < 2) {
        return $SC.Array(raw.slice(0));
      }

      a = new Array(size);
      for (i = 0, imax = raw.length; i < imax; ++i) {
        a[i] = raw[i];
      }
      for (j = imax - 1, imax = size; i < imax; ++i, --j) {
        a[i] = raw[j];
      }

      return $SC.Array(a);
    };

    spec.stutter = fn(function($n) {
      var raw = this._;
      var n, a, i, j, imax, k;

      // <-- _ArrayStutter -->
      n = Math.max(0, $n.__int__());
      a = new Array(raw.length * n);
      for (i = 0, j = 0, imax = raw.length; i < imax; ++i) {
        for (k = 0; k < n; ++k, ++j) {
          a[j] = raw[i];
        }
      }

      return $SC.Array(a);
    }, "n=2");

    spec.rotate = fn(function($n) {
      var raw = this._;
      var n, a, size, i, j;

      // <-- _ArrayRotate -->
      n = $n.__int__();
      a = new Array(raw.length);
      size = a.length;
      n %= size;
      if (n < 0) {
        n += size;
      }
      for (i = 0, j = n; i < size; ++i) {
        a[j] = raw[i];
        if (++j >= size) {
          j = 0;
        }
      }

      return $SC.Array(a);
    }, "n=1");

    spec.pyramid = fn(function($patternType) {
      var patternType;
      var obj1, obj2, i, j, k, n, numslots, x;

      obj1 = this._;
      obj2 = [];

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      x = numslots = obj1.length;

      switch (patternType) {
      case 1:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 2:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 3:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 4:
        n = (x * x + x) >> 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 5:
        n = x * x;
        for (i = k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 6:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 7:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 8:
        n = x * x + x - 1;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 1; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 9:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = 0; j <= i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = i + 1; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      case 10:
        n = x * x;
        for (i = 0, k = 0; i < numslots; ++i) {
          for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        for (i = 0; i < numslots - 1; ++i) {
          for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
            obj2[k] = obj1[j];
          }
        }
        break;
      }

      return $SC.Array(obj2);
    }, "n=1");

    spec.pyramidg = fn(function($patternType) {
      var raw = this._;
      var patternType;
      var list = [], lastIndex, i;

      patternType = Math.max(1, Math.min($patternType.__int__(), 10));
      lastIndex = raw.length - 1;

      switch (patternType) {
      case 1:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        break;
      case 2:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        break;
      case 3:
        for (i = lastIndex; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        break;
      case 4:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 5:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        break;
      case 6:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        break;
      case 7:
        for (i = lastIndex; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        break;
      case 8:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 9:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        for (i = 1; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(i, lastIndex + 1)));
        }
        break;
      case 10:
        for (i = 0; i <= lastIndex; ++i) {
          list.push($SC.Array(raw.slice(lastIndex - i, lastIndex + 1)));
        }
        for (i = lastIndex - 1; i >= 0; --i) {
          list.push($SC.Array(raw.slice(0, i + 1)));
        }
        break;
      }

      return $SC.Array(list);
    }, "n=1");

    spec.sputter = fn(function($probability, $maxlen) {
      var list, prob, maxlen, i, length;

      list   = [];
      prob   = 1.0 - $probability.__num__();
      maxlen = $maxlen.__int__();
      i = 0;
      length = this._.length;
      while (i < length && list.length < maxlen) {
        list.push(this._[i]);
        if (rand.next() < prob) {
          i += 1;
        }
      }

      return $SC.Array(list);
    }, "probability=0.25; maxlen=100");

    spec.lace = fn(function($length) {
      var raw = this._;
      var length, wrap = raw.length;
      var a, i, $item;

      if ($length === $nil) {
        $length = $SC.Integer(wrap);
      }

      length = $length.__int__();
      a = new Array(length);

      for (i = 0; i < length; ++i) {
        $item = raw[i % wrap];
        if (Array.isArray($item._)) {
          a[i] = $item._[ ((i / wrap)|0) % $item._.length ];
        } else {
          a[i] = $item;
        }
      }

      return $SC.Array(a);
    }, "length");

    spec.permute = fn(function($nthPermutation) {
      var raw = this._;
      var obj1, obj2, size, $item;
      var nthPermutation, i, imax, j;

      obj1 = raw;
      obj2 = raw.slice();
      size = raw.length;
      nthPermutation = $nthPermutation.__int__();

      for (i = 0, imax = size - 1; i < imax; ++i) {
        j = i + nthPermutation % (size - i);
        nthPermutation = (nthPermutation / (size - i))|0;

        $item = obj2[i];
        obj2[i] = obj2[j];
        obj2[j] = $item;
      }

      return $SC.Array(obj2);
    }, "nthPermutation=0");

    spec.allTuples = fn(function($maxTuples) {
      var maxSize;
      var obj1, obj2, obj3, obj4, newSize, tupSize;
      var i, j, k;

      maxSize = $maxTuples.__int__();

      obj1 = this._;
      newSize = 1;
      tupSize = obj1.length;
      for (i = 0; i < tupSize; ++i) {
        if (Array.isArray(obj1[i]._)) {
          newSize *= obj1[i]._.length;
        }
      }
      newSize = Math.min(newSize, maxSize);

      obj2 = new Array(newSize);

      for (i = 0; i < newSize; ++i) {
        k = i;
        obj3 = new Array(tupSize);
        for (j = tupSize - 1; j >= 0; --j) {
          if (Array.isArray(obj1[j]._)) {
            obj4 = obj1[j]._;
            obj3[j] = obj4[k % obj4.length];
            k = (k / obj4.length)|0;
          } else {
            obj3[j] = obj1[j];
          }
        }
        obj2[i] = $SC.Array(obj3);
      }

      return $SC.Array(obj2);
    }, "maxTuples=16384");

    spec.wrapExtend = fn(function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());
      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[i % raw.length];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $SC.Array(a);
    }, "size");

    spec.foldExtend = fn(function($size) {
      var raw = this._;
      var size, a, i;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0; i < size; ++i) {
          a[i] = raw[mathlib.fold_idx(i, raw.length)];
        }
      } else {
        a = raw.slice(0, size);
      }

      return $SC.Array(a);
    }, "size");

    spec.clipExtend = fn(function($size) {
      var raw = this._;
      var size, a, i, imax, b;

      size = Math.max(0, $size.__int__());

      if (raw.length < size) {
        a = new Array(size);
        for (i = 0, imax = raw.length; i < imax; ++i) {
          a[i] = raw[i];
        }
        for (b = a[i - 1]; i < size; ++i) {
          a[i] = b;
        }
      } else {
        a = raw.slice(0, size);
      }

      return $SC.Array(a);
    }, "size");

    spec.slide = fn(function($windowLength, $stepSize) {
      var raw = this._;
      var windowLength, stepSize;
      var obj1, obj2, m, n, numwin, numslots;
      var i, j, h, k;

      windowLength = $windowLength.__int__();
      stepSize = $stepSize.__int__();
      obj1 = raw;
      obj2 = [];
      m = windowLength;
      n = stepSize;
      numwin = ((raw.length + n - m) / n)|0;
      numslots = numwin * m;

      for (i = h = k = 0; i < numwin; ++i,h += n) {
        for (j = h; j < m + h; ++j) {
          obj2[k++] = obj1[j];
        }
      }

      return $SC.Array(obj2);
    }, "windowLength=3; stepSize=1");

    spec.containsSeqColl = function() {
      var raw = this._;
      var i, imax;

      for (i = 0, imax = raw.length; i < imax; ++i) {
        if (BOOL(raw[i].isSequenceableCollection())) {
          return $SC.True();
        }
      }

      return $SC.False();
    };

    spec.unlace = fn(function($clumpSize, $numChan) {
      var raw = this._;
      var clumpSize, numChan;
      var a, b, size, i, j, k;

      clumpSize = $clumpSize.__int__();
      numChan   = $numChan  .__int__();
      size = (raw.length / clumpSize)|0;
      size = size - (size % numChan);
      if (size) {
        a = new Array(clumpSize);
        for (i = 0; i < clumpSize; ++i) {
          b = new Array(size);
          for (j = 0; j < size; j += numChan) {
            for (k = 0; k < numChan; ++k) {
              b[j + k] = raw[i * numChan + k + j * clumpSize];
            }
          }
          a[i] = $SC.Array(b);
        }
      } else {
        a = [];
      }

      return $SC.Array(a);
    }, "clumpSize=2; numChan=1");

    // TODO: implements interlace
    // TODO: implements deinterlace

    spec.flop =  function() {
      return this.multiChannelExpand();
    };

    spec.multiChannelExpand = function() {
      var raw = this._;
      var maxSize, size, obj1, obj2, obj3;
      var i, j;

      obj1 = raw;
      maxSize = obj1.reduce(function(len, $elem) {
        return Math.max(len, Array.isArray($elem._) ? $elem._.length : 1);
      }, 0);

      obj2 = new Array(maxSize);
      size = obj1.length;

      if (size === 0) {
        obj2[0] = $SC.Array([]);
      } else {
        for (i = 0; i < maxSize; ++i) {
          obj3 = new Array(size);
          for (j = 0; j < size; ++j) {
            if (Array.isArray(obj1[j]._)) {
              obj3[j] = obj1[j]._[i % obj1[j]._.length];
            } else {
              obj3[j] = obj1[j];
            }
          }
          obj2[i] = $SC.Array(obj3);
        }
      }

      return $SC.Array(obj2);
    };

    // TODO: implements envirPairs

    spec.shift = fn(function($n, $filler) {
      var $fill, $remain;

      $fill = SCArray.fill($n.abs(), $filler);
      $remain = this.drop($n.neg());

      if ($n < 0) {
        return $remain ["++"] ($fill);
      }

      return $fill ["++"] ($remain);
    }, "n; fillter=0.0");

    spec.powerset = function() {
      var raw = this._;
      var arrSize, powersize;
      var result, elemArr, mod, i, j;

      arrSize   = this.size().__int__();
      powersize = Math.pow(2, arrSize);

      result = [];
      for (i = 0; i < powersize; ++i) {
        elemArr = [];
        for (j = 0; j < arrSize; ++j) {
          mod = Math.pow(2, j);
          if (((i / mod)|0) % 2) {
            elemArr.push(raw[j]);
          }
        }
        result[i] = $SC.Array(elemArr);
      }

      return $SC.Array(result);
    };

    // TODO: implements source

    spec.asUGenInput = function($for) {
      return this.collect($SC.Function(function($_) {
        return $_.asUGenInput($for);
      }));
    };

    spec.asAudioRateInput = function($for) {
      return this.collect($SC.Function(function($_) {
        return $_.asAudioRateInput($for);
      }));
    };

    spec.asControlInput = function() {
      return this.collect($SC.Function(function($_) {
        return $_.asControlInput();
      }));
    };

    spec.isValidUGenInput = utils.alwaysReturn$true;

    spec.numChannels = function() {
      return this.size();
    };

    // TODO: implements poll
    // TODO: implements dpoll
    // TODO: implements evnAt
    // TODO: implements atIdentityHash
    // TODO: implements atIdentityHashInPairs
    // TODO: implements asSpec
    // TODO: implements fork

    spec.madd = fn(function($mul, $add) {
      return $SC("MulAdd").new(this, $mul, $add);
    }, "mul=1.0; add=0.0");

    // TODO: implements asRawOSC
    // TODO: implements printOn
    // TODO: implements storeOn
  });

})(sc);

})(this.self||global);

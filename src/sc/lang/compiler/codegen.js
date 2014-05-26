(function(sc) {
  "use strict";

  require("./sc");
  require("./scope");
  require("./pre-compiler");

  var codegen = {};

  var compiler = sc.lang.compiler;
  var Syntax   = compiler.Syntax;
  var Token    = compiler.Token;
  var Message  = compiler.Message;
  var precompile = compiler.precompile;

  var Scope = compiler.scope({
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
        stmt.vars.push(" = $.Nil()");
      }
      stmt.tail.push(";", "\n");
    },
    _appendVariable: function(stmt, id) {
      stmt.vars.push(
        ", ", $id(id)
      );
      if (id.charAt(0) !== "_") {
        stmt.vars.push(" = $.Nil()");
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
    begin_ref: function(scope) {
      var refId   = (this._refId | 0);
      var refName = "_ref" + refId;
      this.add("var", refName, scope);
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
    this.functionStack = [];
    this.functionArray = [];
  }

  CodeGen.prototype.compile = function(ast) {
    ast = precompile(ast);
    return this.generate(ast);
  };

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
      result.push(this.base, "return $.Nil();");
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
            item, operator, ref + ".$('at', [ $.Integer(" + i + ") ])"
          ));
        })
      ];

      if (node.remain) {
        result.push(",\n", this.addIndent(this._Assign(
          node.remain, operator, ref + ".$('copyToEnd', [ $.Integer(" + lastUsedIndex + ") ])"
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
      "$.Boolean(",
      this.generate(node.left), " " + node.operator + " ", this.generate(node.right),
      ")"
    ];
  };

  CodeGen.prototype._BinaryExpression = function(node) {
    var result;

    result = [
      this.generate(node.left),
      ".$('" + node.operator + "', [ ", this.generate(node.right)
    ];

    if (node.adverb) {
      result.push(", ", this.generate(node.adverb));
    }
    result.push(" ])");

    return result;
  };

  CodeGen.prototype.BlockExpression = function(node) {
    var body = this.withFunction([], function() {
      return this._Statements(node.body);
    });

    return [ "(", body, ")()" ];
  };

  CodeGen.prototype.CallExpression = function(node) {
    if (node.segmented) {
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
        this.generate(node.callee), ".$('" + node.method.name + "', [ " + ref + " ]), ",
        ref + ")"
      ];
      this.scope.end_ref();
    } else {
      if (list.length || node.args.keywords) {
        args = [
          this.stitchWith(list, ", ", function(item) {
            return this.generate(item);
          }),
          this.insertKeyValueElement(node.args.keywords, hasActualArgument)
        ];
        result = [
          this.generate(node.callee), ".$('" + node.method.name + "', [ ", args, " ])"
        ];
      } else {
        result = [
          this.generate(node.callee), ".$('" + node.method.name + "')"
        ];
      }
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
      ", " + ref + ".$('" + node.method.name + "', ",
      this.insertArrayElement(node.args.list), ".concat(",
      this.generate(node.args.expand), ".$('asArray')._",
      this.insertKeyValueElement(node.args.keywords, true),
      ")))"
    ];

    this.scope.end_ref();

    return result;
  };

  CodeGen.prototype.EnvironmentExpresion = function(node, opts) {
    var result;

    if (opts) {
      // setter
      result = [ "$.Environment('" + node.id.name + "', ", this.generate(opts.right), ")" ];
      opts.used = true;
    } else {
      // getter
      result = "$.Environment('" + node.id.name + "')";
    }

    return result;
  };

  CodeGen.prototype.FunctionExpression = function(node) {
    var fn, info;

    info = getInformationOfFunction(node);

    if (!node.segmented) {
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

    return [ "$.Function(", body ];
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

    return [ "$.SegFunction(", body ];
  };

  CodeGen.prototype.Identifier = function(node, opts) {
    var name = node.name;

    if (isClassName(name)) {
      return "$('" + name + "')";
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
        ", $.This().$('" + node.name + "_', [ " + ref + " ]), " + ref + ")"
      ];
      opts.used = true;
      this.scope.end_ref();
    } else {
      // getter
      name = "$.This().$('" + node.name + "')";
    }

    return name;
  };

  CodeGen.prototype.ListExpression = function(node) {
    var result;

    result = [
      "$.Array(",
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
      return "$.Integer(" + node.value + ")";
    case Token.FloatLiteral:
      return "$.Float(" + node.value + ")";
    case Token.CharLiteral:
      return "$.Char('" + node.value + "')";
    case Token.SymbolLiteral:
      return "$.Symbol('" + node.value + "')";
    case Token.StringLiteral:
      return "$.String('" + node.value + "')";
    case Token.TrueLiteral:
      return "$.True()";
    case Token.FalseLiteral:
      return "$.False()";
    }

    return "$.Nil()";
  };

  CodeGen.prototype.EventExpression = function(node) {
    return [
      "$.Event(", this.insertArrayElement(node.elements), ")"
    ];
  };

  CodeGen.prototype.Program = function(node) {
    var result, body;

    if (node.body.length) {
      body = this.withFunction([ "" ], function() { // "" compiled as $
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
    var name = node.name;
    name = name.charAt(0).toUpperCase() + name.substr(1);
    return [ "$." + name + "()" ];
  };

  CodeGen.prototype.UnaryExpression = function(node) {
    /* istanbul ignore else */
    if (node.operator === "`") {
      return [ "$.Ref(", this.generate(node.arg), ")" ];
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

  CodeGen.prototype.ValueMethodEvaluator = function(node) {
    return [ "$.Value(" + node.id + ", ", this.generate(node.expr), ")" ];
  };

  CodeGen.prototype.ValueMethodResult = function(node) {
    return [ "$.Result(" + node.id + ")" ];
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

  codegen.compile = function(ast, opts) {
    return new CodeGen(opts).compile(ast);
  };

  compiler.codegen = codegen;

})(sc);

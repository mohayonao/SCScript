(function(sc) {
  "use strict";

  require("./sc");
  require("./parser");

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

  var Scope = sc.lang.compiler.Scope.inheritWith({
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
      stmt.vars.push(this.parent.id(id));
      if (id.charAt(0) !== "_") {
        stmt.vars.push(" = $SC.Nil()");
      }
      stmt.tail.push(";", "\n");
    },
    _appendVariable: function(stmt, id) {
      stmt.vars.push(
        ", ", this.parent.id(id)
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

  CodeGen.prototype.id = function(id) {
    var ch = id.charAt(0);

    if (ch !== "_" && ch !== "$") {
      id = "$" + id;
    }

    return id;
  };

  CodeGen.prototype.isClassName = function(node) {
    var ch0;

    ch0 = node.name.charAt(0);
    return "A" <= ch0 && ch0 <= "Z";
  };

  CodeGen.prototype.isInterpreterVariable = function(node) {
    var name, found;

    name = node.name;
    found = this.scope.find(name);
    if (name.length === 1 && "a" <= name && name <= "z") {
      if (!found) {
        return true;
      }
    }
    if (!found) {
      this.throwError(null, Message.VariableNotDefined, name);
    }

    return false;
  };

  CodeGen.prototype.isSegmentedBlock = function(node) {
    if (node.type === Syntax.CallExpression && this.isSegmentedMethod(node)) {
      return true;
    }
    return Object.keys(node).some(function(key) {
      if (key !== "range" && key !== "loc") {
        if (typeof node[key] === "object") {
          return this.isSegmentedBlock(node[key]);
        }
      }
      return false;
    }, this);
  };

  CodeGen.prototype.isSegmentedMethod = function(node) {
    return !!SegmentedMethod[node.method.name];
  };

  CodeGen.prototype.withFunction = function(result, args, body) {
    var braces, base, stmtCount;
    var i, imax;

    braces = { open: [ "{" ], close: [ "}" ] };

    result.push("function(");
    for (i = 0, imax = args.length; i < imax; i++) {
      if (i) {
        result.push(", ");
      }
      result.push(this.id(args[i]));
    }
    result.push(") ");

    result.push(braces.open);

    base = this.base;
    this.base += "  ";

    this.scope.begin(result, args);

    stmtCount = body.call(this, result);
    if (stmtCount === 0) {
      result.push(this.base, "return $SC.Nil();");
      stmtCount += 1;
    }

    this.scope.end();

    this.base = base;

    result.push(braces.close);

    braces.open.push("\n");
    braces.close.unshift("\n", this.base);
  };

  CodeGen.prototype.withIndent = function(fn) {
    var base, result;

    base = this.base;
    this.base += "  ";
    result = fn.call(this, this.base);
    this.base = base;

    return result;
  };

  CodeGen.prototype.generate = function(node, opts) {
    var result, i, imax;

    if (Array.isArray(node)) {
      result = [];
      result.push("(");
      for (i = 0, imax = node.length; i < imax; ++i) {
        if (i) {
          result.push(", ");
        }
        result.push(this.generate(node[i], opts));
      }
      result.push(")");
    } else if (node && node.type) {
      result = this[node.type].call(this, node, opts);
    } else {
      result = node;
    }

    return result;
  };

  CodeGen.prototype.throwError = function(obj, messageFormat) {
    var args, message;

    args = Array.prototype.slice.call(arguments, 1);
    message = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    throw new Error(message);
  };

  CodeGen.prototype.AssignmentExpression = function(node) {
    var result;

    if (!Array.isArray(node.left)) {
      result = this.genSingleAssignment(node);
    } else {
      result = this.genDestructuringAssignment(node);
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.genSingleAssignment = function(node) {
    var result = [];
    var opts;

    opts = { right: node.right, used: false };

    result.push(this.generate(node.left, opts));

    if (!opts.used) {
      result.push(" " + node.operator + " ", this.generate(opts.right));
    }

    return result;
  };

  CodeGen.prototype.genDestructuringAssignment = function(node) {
    var result = [];
    var elements = node.left;
    var i, imax;

    this.scope.add("var", "_ref");

    result.push("(_ref = ", this.generate(node.right), ",");

    this.withIndent(function() {
      result.push("\n");
      for (i = 0, imax = elements.length; i < imax; ++i) {
        if (i) {
          result.push(",\n");
        }
        result.push(
          this.base,
          this.assign(elements[i], node.operator, "_ref.at($SC.Integer(" + i + "))")
        );
      }

      if (node.remain) {
        result.push(
          ",\n",
          this.base,
          this.assign(node.remain, node.operator, "_ref.copyToEnd($SC.Integer(" + imax + "))")
        );
      }
    });

    result.push(",\n", this.base, "_ref)");

    return result;
  };

  CodeGen.prototype.assign = function(left, operator, right) {
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
    var result;

    switch (node.operator) {
    case "===":
    case "!==":
      result = this.genEqualityOperator(node);
      break;
    default:
      result = this.genBinaryExpression(node);
      break;
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.genEqualityOperator = function(node) {
    return [
      "$SC.Boolean(",
      this.generate(node.left), " " + node.operator + " ", this.generate(node.right),
      ")"
    ];
  };

  CodeGen.prototype.genBinaryExpression = function(node) {
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
    var result = [];
    var elements;

    elements = node.body;

    result.push("(");
    this.withFunction(result, [], function() {
      var stmt, stmtCount, i, imax;

      for (i = stmtCount = 0, imax = elements.length; i < imax; ++i) {
        if (stmtCount) {
          result.push("\n");
        }
        stmt = this.generate(elements[i]);
        if (i === imax - 1) {
          stmt = [ "return ", stmt ];
        }
        result.push([ this.addIndent(stmt), ";" ]);
        stmtCount += 1;
      }

      return stmtCount;
    });
    result.push(")()");

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.CallExpression = function(node) {
    var result;

    if (this.isSegmentedMethod(node)) {
      this.state.calledSegmentedMethod = true;
    }

    if (!node.args.expand) {
      result = this.genNormalCall(node);
    } else {
      result = this.genExpandCall(node);
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.genNormalCall = function(node) {
    var args = [];
    var list, i, imax;

    list = node.args.list;

    for (i = 0, imax = list.length; i < imax; ++i) {
      if (i) {
        args.push(", ");
      }
      args.push(this.generate(list[i]));
    }

    args.push(this.insertKeywordArguments(node.args.keywords, !!imax));

    return [
      this.generate(node.callee), ".", node.method.name, "(", args, ")"
    ];
  };

  CodeGen.prototype.genExpandCall = function(node) {
    var result;

    this.scope.add("var", "_ref");

    result = [
      "(_ref = ",
      this.generate(node.callee),
      ", _ref." + node.method.name + ".apply(_ref, ",
      this.insertElements(node.args.list), ".concat(",
      this.generate(node.args.expand), ".asArray()._",
      this.insertKeywordArguments(node.args.keywords, true),
      ")))"
    ];

    return result;
  };

  CodeGen.prototype.insertKeywordArguments = function(keywords, with_comma) {
    var result = [];

    if (keywords) {
      if (with_comma) {
        result.push(", ");
      }
      result.push("{ ");
      Object.keys(keywords).forEach(function(key, i) {
        if (i) {
          result.push(", ");
        }
        result.push(key, ": ", this.generate(keywords[key]));
      }, this);
      result.push(" }");
    }

    return result;
  };

  CodeGen.prototype.GlobalExpression = function(node) {
    var result;

    result = "$SC.Global." + node.id.name;

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.FunctionExpression = function(node) {
    var result, info;

    info = this.getInformationOfFunction(node);

    if (!this.isSegmentedBlock(node)) {
      result = this.genSimpleFunction(node, info.args);
    } else {
      result = this.genSegmentedFunction(node, info.args);
    }

    result.push(this.genFunctionMetadata(info), ")");

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.getInformationOfFunction = function(node) {
    var args     = [];
    var defaults = [];
    var remain   = null;
    var list, i, imax;

    if (node.args) {
      list = node.args.list;
      for (i = 0, imax = list.length; i < imax; ++i) {
        args.push(list[i].id.name);
        defaults.push(list[i].id.name, list[i].init);
      }
      if (node.args.remain) {
        remain = node.args.remain.name;
        args.push(remain);
      }
    }

    if (node.partial) {
      defaults = [];
    }

    return { args: args, remain: remain, defaults: defaults, closed: node.closed };
  };

  CodeGen.prototype.genSimpleFunction = function(node, args) {
    var result = [];

    result.push("$SC.Function(");

    this.withFunction(result, args, function() {
      var stmt, i, imax;
      var count, elements = node.body;

      for (i = count = 0, imax = elements.length; i < imax; ++i) {
        if (count) {
          result.push("\n");
        }
        stmt = this.generate(elements[i]);
        if (stmt.length) {
          if (i === imax - 1) {
            stmt = [ "return ", stmt ];
          }
          result.push([ this.addIndent(stmt), ";" ]);
          count += 1;
        }
      }

      return count;
    });

    return result;
  };

  CodeGen.prototype.genSegmentedFunction = function(node, args) {
    var result;
    var fargs;

    result = [ "$SC.SegFunction(" ];

    fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    this.withFunction(result, [], function() {
      var fragments = [], syncBlockScope;
      var closureVars = args;
      var elements = node.body;
      var i, imax;

      for (i = 0, imax = closureVars.length; i < imax; ++i) {
        this.scope.add("var", closureVars[i]);
      }

      syncBlockScope = this.state.syncBlockScope;
      this.state.syncBlockScope = this.scope.peek();

      fragments.push("return [");
      this.withIndent(function() {
        var i = 0, imax = elements.length;

        fragments.push("\n");

        var loop = function() {
          var stmt;
          var count = 0;
          var j, jmax;

          while (i < imax) {
            if (i === 0) {
              if (args.length) {
                stmt = [];
                for (j = 0, jmax = args.length; j < jmax; ++j) {
                  if (j) {
                    stmt.push("; ");
                  }
                  stmt.push("$" + args[j] + " = " + fargs[j]);
                }
                fragments.push([ this.addIndent(stmt), ";", "\n" ]);
              }
            } else if (count) {
              fragments.push("\n");
            }
            this.state.calledSegmentedMethod = false;
            stmt = this.generate(elements[i]);
            if (stmt.length) {
              if (i === imax - 1 || this.state.calledSegmentedMethod) {
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

          return count;
        };

        while (i < imax) {
          if (i) {
            fragments.push(",", "\n");
            fragments.push(this.base);
            this.withFunction(fragments, [], loop);
          } else {
            fragments.push(this.base);
            this.withFunction(fragments, fargs, loop);
          }
        }
        fragments.push("\n");
      });
      fragments.push(this.addIndent("];"));

      result.push([ this.addIndent(fragments) ]);

      this.state.syncBlockScope = syncBlockScope;

      return 1;
    });

    return result;
  };

  CodeGen.prototype.genFunctionMetadata = function(info) {
    var defaults, remain, closed;
    var result;
    var i, imax;

    defaults = info.defaults;
    remain   = info.remain;
    closed   = info.closed;

    if (defaults.length === 0 && !remain && !closed) {
      return [];
    }

    result = [ ", '" ];

    for (i = 0, imax = defaults.length; i < imax; i += 2) {
      if (i) {
        result.push("; ");
      }
      result.push(defaults[i]);
      if (defaults[i + 1]) {
        result.push("=", defaults[i + 1].value); // TODO #[]
      }
    }
    if (remain) {
      if (i) {
        result.push("; ");
      }
      result.push("*" + remain);
    }
    result.push("'");

    if (closed) {
      result.push(", true");
    }

    return result;
  };

  CodeGen.prototype.Identifier = function(node, opts) {
    var result;

    if (this.isClassName(node)) {
      result = "$SC.Class('" + node.name + "')";
    } else if (this.isInterpreterVariable(node)) {
      result = this.genInterpreterVariable(node, opts);
    } else {
      result = this.id(node.name);
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.genInterpreterVariable = function(node, opts) {
    var name;

    if (opts) {
      // setter
      name = [
        "$this." + node.name + "_(", this.generate(opts.right), ")"
      ];
      opts.used = true;
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
      this.insertElements(node.elements),
    ];

    if (node.immutable) {
      result.push(", ", "true");
    }

    result.push(")");

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.Literal = function(node) {
    var result;

    switch (node.valueType) {
    case Token.IntegerLiteral:
      result = "$SC.Integer(" + node.value + ")";
      break;
    case Token.FloatLiteral:
      result = "$SC.Float(" + node.value + ")";
      break;
    case Token.CharLiteral:
      result = "$SC.Char('" + node.value + "')";
      break;
    case Token.SymbolLiteral:
      result = "$SC.Symbol('" + node.value + "')";
      break;
    case Token.StringLiteral:
      result = "$SC.String('" + node.value + "')";
      break;
    case Token.TrueLiteral:
      result = "$SC.True()";
      break;
    case Token.FalseLiteral:
      result = "$SC.False()";
      break;
    default:
      result = "$SC.Nil()";
      break;
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.ObjectExpression = function(node) {
    var result;

    result = [
      "$SC.Event(", this.insertElements(node.elements), ")"
    ];

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.Program = function(node) {
    var result = [];

    if (node.body.length) {
      if (!this.opts.bare) {
        result.push("SCScript");
      }
      result.push("(");
      this.withFunction(result, [ "this", "SC" ], function() {
        var elements = node.body;
        var stmt, stmtCount, i, imax;

        for (i = stmtCount = 0, imax = elements.length; i < imax; ++i) {
          if (stmtCount) {
            result.push("\n");
          }
          stmt = this.generate(elements[i]);
          if (stmt.length) {
            if (i === imax - 1) {
              stmt = [ "return ", stmt ];
            }
            result.push([ this.addIndent(stmt), ";" ]);
            stmtCount += 1;
          }
        }

        return stmtCount;
      });
      result.push(")");
      if (!this.opts.bare) {
        result.push(";");
      }
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.ThisExpression = function(node) {
    var result;

    if (node.name === "this") {
      result = "$this";
    } else {
      result = [ "$this." + node.name + "()" ];
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.UnaryExpression = function(node) {
    var result;

    /* istanbul ignore else */
    if (node.operator === "`") {
      result = [ "$SC.Ref(", this.generate(node.arg), ")" ];
    } else {
      throw new Error("Unknown UnaryExpression: " + node.operator);
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.VariableDeclaration = function(node) {
    var result = [];
    var declarations, count;
    var i, imax;

    declarations = node.declarations;
    for (i = count = 0, imax = declarations.length; i < imax; ++i) {
      if (count) {
        result.push(", ");
      }

      this.scope.add("var", declarations[i].id.name, this.state.syncBlockScope);
      if (declarations[i].init) {
        result.push(
          this.id(declarations[i].id.name),
          " = ",
          this.generate(declarations[i].init)
        );
        count += 1;
      }
    }

    return this.toSourceNodeWhenNeeded(result, node);
  };

  CodeGen.prototype.insertElements = function(elements) {
    var result;
    var i, imax;

    result = [];

    result.push("[");
    if (elements.length) {
      this.withIndent(function() {
        result.push("\n");
        for (i = 0, imax = elements.length; i < imax; ++i) {
          if (i) {
            result.push("\n");
          }
          result.push(this.base, this.generate(elements[i]), ",");
        }
        result.push("\n");
      });
      result.push(this.base);
    }
    result.push("]");

    return result;
  };

  codegen.compile = function(ast, opts) {
    return new CodeGen(opts).generate(ast);
  };

  var SCScript = sc.SCScript;

  SCScript.compile = function(source, opts) {
    return new CodeGen(opts).generate(sc.lang.parser.parse(source, opts));
  };

  sc.lang.codegen = codegen;

})(sc);

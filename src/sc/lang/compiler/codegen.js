(function(sc) {
  "use strict";

  require("./compiler");
  require("./scope");
  require("./rewriter");

  var codegen = {};

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Syntax   = sc.lang.compiler.Syntax;
  var Token    = sc.lang.compiler.Token;
  var Message  = sc.lang.compiler.Message;
  var rewriter = sc.lang.compiler.rewriter;

  function Scope(codegen, error) {
    sc.lang.compiler.Scope.call(this, error);
    this.codegen = codegen;
  }
  sc.libs.extend(Scope, sc.lang.compiler.Scope);

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

  Scope.prototype._addNewVariableStatement = function(stmt, id, indent) {
    stmt.head.push(indent, "var ");
    stmt.vars.push($id(id));
    stmt.tail.push(";", "\n");
  };

  Scope.prototype._appendVariable = function(stmt, id) {
    stmt.vars.push(", ", $id(id));
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

  function CodeGen(opts) {
    var that = this;
    this.opts = opts || {};
    this.base = "";
    this.state = {
      calledSegmentedMethod: false,
      syncBlockScope: null
    };
    this.scope = new Scope(this, function(message) {
      that.throwError(null, message);
    });
    if (typeof this.opts.bare === "undefined") {
      this.opts.bare = false;
    }
    this.functionStack = [];
    this.functionArray = [];
  }

  CodeGen.prototype.compile = function(ast) {
    ast = rewriter.rewrite(ast);
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
    var argItems, base;

    argItems = this.stitchWith(args, ", ", function(item) {
      return this.generate(item);
    });

    result = [ "function(", argItems, ") {\n" ];

    base = this.base;
    this.base += "  ";

    this.scope.begin(result, args);
    result.push(fn.call(this));
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

  CodeGen.prototype.insertKeyValueElement = function(keyValues, withComma) {
    var result = [];

    if (keyValues) {
      if (withComma) {
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
    var result, i, imax;

    result = [];
    for (i = 0, imax = elements.length; i < imax; ++i) {
      if (i) {
        result.push(bond);
      }
      result.push(fn.call(this, elements[i], i));
    }

    return result;
  };

  CodeGen.prototype.throwError = function(obj, messageFormat) {
    var message = strlib.format(messageFormat, slice.call(arguments, 2));
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
    return this.scope.useTemporaryVariable(function(tempVar) {
      var elements = node.left;
      var operator = node.operator;
      var assignments;

      assignments = this.withIndent(function() {
        var result, lastUsedIndex;

        lastUsedIndex = elements.length;

        result = [
          this.stitchWith(elements, ",\n", function(item, i) {
            return this.addIndent(this._Assign(
              item, operator, tempVar + ".$('at', [ $.Integer(" + i + ") ])"
            ));
          })
        ];

        if (node.remain) {
          result.push(",\n", this.addIndent(this._Assign(
            node.remain, operator, tempVar + ".$('copyToEnd', [ $.Integer(" + lastUsedIndex + ") ])"
          )));
        }

        return result;
      });

      return [
        "(" + tempVar + " = ", this.generate(node.right), ",\n",
        assignments , ",\n",
        this.addIndent(tempVar + ")")
      ];
    });
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

    list = node.args.list;
    hasActualArgument = !!list.length;

    if (node.stamp === "=") {
      result = this.scope.useTemporaryVariable(function(tempVar) {
        return [
          "(" + tempVar + " = ", this.generate(list[0]), ", ",
          this.generate(node.callee), ".$('" + node.method.name + "', [ " + tempVar + " ]), ",
          tempVar + ")"
        ];
      });
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
    return this.scope.useTemporaryVariable(function(tempVar) {
      return [
        "(" + tempVar + " = ",
        this.generate(node.callee),
        ", " + tempVar + ".$('" + node.method.name + "', ",
        this.insertArrayElement(node.args.list), ".concat(",
        this.generate(node.args.expand), ".$('asArray')._",
        this.insertKeyValueElement(node.args.keywords, true),
        ")))"
      ];
    });
  };

  CodeGen.prototype.EnvironmentExpression = function(node, opts) {
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
    var info = getInformationOfFunction(node);

    return [
      "$.Function(",
      this._FunctionBody(node, info.args),
      this._FunctionMetadata(info),
      ")"
    ];
  };

  CodeGen.prototype._FunctionBody = function(node, args) {
    var fargs, body, assignArguments;

    fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    assignArguments = function(item, i) {
      return $id(args[i]) + " = " + fargs[i];
    };

    body = this.withFunction([], function() {
      var result = [];
      var fragments = [], syncBlockScope;
      var elements = node.body;
      var i, imax;
      var functionBodies, calledSegmentedMethod;
      var resetVars;

      if (elements.length) {
        for (i = 0, imax = args.length; i < imax; ++i) {
          this.scope.add("var", args[i], { init: false });
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
            var stmt, j = 0;

            while (i < imax) {
              if (i === 0) {
                if (args.length) {
                  stmt = this.stitchWith(args, "; ", assignArguments);
                  fragments.push([ this.addIndent(stmt), ";", "\n" ]);
                }
              } else if (j) {
                fragments.push("\n");
              }

              calledSegmentedMethod = this.state.calledSegmentedMethod;
              this.state.calledSegmentedMethod = false;
              stmt = this.generate(elements[i]);

              if (i === lastIndex || this.state.calledSegmentedMethod) {
                stmt = [ "return ", stmt ];
              }
              fragments.push([ this.addIndent(stmt), ";" ]);
              j += 1;

              i += 1;
              if (this.state.calledSegmentedMethod) {
                break;
              }
              this.state.calledSegmentedMethod = calledSegmentedMethod;
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

          resetVars = Object.keys(this.state.syncBlockScope.vars);
          if (resetVars.length) {
            fragments.push(",", "\n", this.addIndent(this.withFunction([], function() {
              return this.addIndent(resetVars.sort().map($id).join(" = ") + " = null;");
            })));
          } else {
            fragments.push(",", "\n", this.addIndent("$.NOP"));
          }

          fragments.push("\n");

          return fragments;
        });

        fragments.push("return [", functionBodies, this.addIndent("];"));
      } else {
        fragments.push("return [];");
      }

      result.push([ this.addIndent(fragments) ]);

      this.state.syncBlockScope = syncBlockScope;

      return result;
    });

    return body;
  };

  var toArgumentValueString = function(node) {
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
            return toArgumentValueString(item);
          }), " ]");
        } else {
          result.push("=", toArgumentValueString(vals[i]));
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

  CodeGen.prototype.Identifier = function(node, opts) {
    var name = node.name;

    if (strlib.isClassName(name)) {
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
    var name;

    if (opts) {
      // setter
      name = this.scope.useTemporaryVariable(function(tempVar) {
        return [
          "(" + tempVar + " = ", this.generate(opts.right),
          ", $.This().$('" + node.name + "_', [ " + tempVar + " ]), " + tempVar + ")"
        ];
      });
      opts.used = true;
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
      var result;

      this.scope.add("var", item.id.name, { scope: scope, init: false });

      result = [ this.generate(item.id) ];

      if (item.init) {
        result.push(" = ", this.generate(item.init));
      } else {
        result.push(" = $.Nil()");
      }

      return result;
    });
  };

  CodeGen.prototype.ValueMethodEvaluator = function(node) {
    this.state.calledSegmentedMethod = true;
    return [ "this.push(), ", this.generate(node.expr) ];
  };

  CodeGen.prototype.ValueMethodResult = function() {
    return "this.shift()";
  };

  CodeGen.prototype._Statements = function(elements) {
    var lastIndex = elements.length - 1;

    return this.stitchWith(elements, "\n", function(item, i) {
      var stmt;

      stmt = this.generate(item);

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
      args: args,
      keys: keys,
      vals: vals,
      remain: remain,
      closed: node.closed
    };
  };

  codegen.compile = function(ast, opts) {
    return new CodeGen(opts).compile(ast);
  };

  sc.lang.compiler.codegen = codegen;
})(sc);

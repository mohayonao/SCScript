(function(sc) {
  "use strict";

  require("../compiler");
  require("./scope");

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Syntax   = sc.lang.compiler.Syntax;
  var Token    = sc.lang.compiler.Token;
  var Scope = sc.lang.compiler.Scope;

  function CodeGen(parent, opts) {
    if (!parent) {
      initialize(this, opts);
    } else {
      this.parent = parent;
      this.opts  = parent.opts;
      this.state = parent.state;
      this.scope = parent.scope;
      // TODO: remove
      this.functionStack = parent.functionStack;
      this.functionArray = parent.functionArray;
    }
  }

  function initialize(that, opts) {
    that.parent = null;
    that.opts = opts || {};
    that.state = {
      indent: "",
      calledSegmentedMethod: false,
      syncBlockScope: null,
      tempVarId: 0
    };
    that.scope = new Scope(that);
    if (typeof that.opts.bare === "undefined") {
      that.opts.bare = false;
    }
    that.functionStack = [];
    that.functionArray = [];
  }

  CodeGen.addGenerateMethod = function(name, method) {
    CodeGen.prototype[name] = method;
  };

  CodeGen.prototype.compile = function(ast) {
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
    return [ this.state.indent, stmt ];
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

    base = this.state.indent;
    this.state.indent += "  ";

    this.scope.begin().setIndent(this.state.indent);
    for (var i = 0, imax = args.length; i < imax; ++i) {
      this.scope.add("arg", args[i]);
    }
    result.push(
      this.scope.toVariableStatement(),
      fn.call(this)
    );
    this.scope.end();

    this.state.indent = base;

    result.push("\n", this.state.indent, "}");

    return result;
  };

  CodeGen.prototype.withIndent = function(fn) {
    var base, result;

    base = this.state.indent;
    this.state.indent += "  ";
    result = fn.call(this);
    this.state.indent = base;

    return result;
  };

  CodeGen.prototype.insertArrayElement = function(elements) {
    var result, items;

    result = [ "[", "]" ];

    if (elements.length) {
      items = this.withIndent(function() {
        return this.stitchWith(elements, "\n", function(item) {
          return [ this.state.indent, this.generate(item), "," ];
        });
      });
      result.splice(1, 0, "\n", items, "\n", this.state.indent);
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

  CodeGen.prototype.useTemporaryVariable = function(func) {
    var result;
    var tempName = "_ref" + this.state.tempVarId;

    this.scope.add("var", tempName);

    this.state.tempVarId += 1;
    result = func.call(this, tempName);
    this.state.tempVarId -= 1;

    return result;
  };

  CodeGen.prototype.throwError = function(obj, messageFormat) {
    var message = strlib.format(messageFormat, slice.call(arguments, 2));
    throw new Error(message);
  };

  // TODO: remove
  CodeGen.prototype.BlockExpression = function(node) {
    var body = this.withFunction([], function() {
      return this._Statements(node.body);
    });

    return [ "(", body, ")()" ];
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

      this.scope.add("var", item.id.name, scope);

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

  sc.lang.compiler.CodeGen = CodeGen;
})(sc);

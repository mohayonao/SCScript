(function(sc) {
  "use strict";

  require("./codegen");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("FunctionExpression", function(node) {
    return new FunctionExpressionGenerator(this).compile(node);
  });

  function FunctionExpressionGenerator(parent) {
    CodeGen.call(this, parent);
    this.functionStack = [];
    this.functionArray = [];
  }
  sc.libs.extend(FunctionExpressionGenerator, CodeGen);

  FunctionExpressionGenerator.prototype.compile = function(node) {
    var info = getInformationOfFunction(node);

    return [
      "$.Function(",
      this._FunctionBody(node, info.args),
      this._FunctionMetadata(info),
      ")"
    ];
  };

  FunctionExpressionGenerator.prototype._FunctionBody = function(node, args) {
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

  FunctionExpressionGenerator.prototype._FunctionMetadata = function(info) {
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
})(sc);

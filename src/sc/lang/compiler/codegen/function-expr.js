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
      this.FunctionBody(node, info.args),
      this.FunctionMetadata(info),
      ")"
    ];
  };

  FunctionExpressionGenerator.prototype.FunctionBody = function(node, args) {
    var fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    var assignArguments = function(item, i) {
      return $id(args[i]) + " = " + fargs[i];
    };

    var body = this.withFunction([], function() {
      var result = [];
      var fragments = [];
      var elements = node.body;

      var syncBlockScope = this.state.syncBlockScope;

      if (elements.length) {
        for (var i = 0, imax = args.length; i < imax; ++i) {
          this.scope.add("var", args[i]);
        }

        this.state.syncBlockScope = this.scope.peek();

        var functionBodies = this.withIndent(function() {
          var i = 0, imax = elements.length;
          var lastIndex = imax - 1;

          var fragments = [ "\n" ];

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

              var calledSegmentedMethod = this.state.calledSegmentedMethod;
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

          var resetVars = Object.keys(this.state.syncBlockScope.vars);
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

  FunctionExpressionGenerator.prototype.FunctionMetadata = function(info) {
    var keys = info.keys;
    var vals = info.vals;

    if (keys.length === 0 && !info.remain && !info.closed) {
      return [];
    }

    var args = this.stitchWith(keys, "; ", function(item, i) {
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

    var result = [ ", '", args ];

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

  function $id(name) {
    return name.replace(/^(?![_$])/, "$");
  }

  function toArgumentValueString(node) {
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
  }

  function getInformationOfFunction(node) {
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
  }
})(sc);

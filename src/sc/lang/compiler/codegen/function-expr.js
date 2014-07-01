(function(sc) {
  "use strict";

  require("./codegen");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("FunctionExpression", function(node) {
    var meta = getMetaDataOfFunction(node);
    return [
      "$.Function(",
      generateFunctionBody(this, node, meta.args),
      generateFunctionMetadata(this, meta),
      ")"
    ];
  });

  function generateFunctionBody(that, node, args) {
    return that.addIndent(that.withFunction([], function() {
      if (!node.body.length) {
        return [ "return [];" ];
      }

      return [
        "return [",
        generateSegmentedFunctionBody(that, node, args),
        that.addIndent("];")
      ];
    }));
  }

  function generateSegmentedFunctionBody(that, node, args) {
    for (var i = 0, imax = args.length; i < imax; ++i) {
      that.scope.add("var", args[i]);
    }

    var syncBlockScope = that.state.syncBlockScope;
    that.state.syncBlockScope = that.scope.peek();

    var result = that.withIndent(function() {
      return generateSegmentedFunctionBodyElements(that, node, args);
    });

    that.state.syncBlockScope = syncBlockScope;

    return result;
  }

  function generateSegmentedFunctionBodyElements(that, node, args) {
    var fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    var assignArguments = function(item, i) {
      return $id(args[i]) + " = " + fargs[i];
    };

    var i = 0, imax = node.body.length;
    var lastIndex = imax - 1;

    var fragments = [ "\n" ];

    var loop = function() {
      var fragments = [];
      var stmt;

      while (i < imax) {
        if (i === 0) {
          if (args.length) {
            stmt = that.stitchWith(args, "; ", assignArguments);
            fragments.push([ that.addIndent(stmt), ";", "\n" ]);
          }
        } else {
          fragments.push("\n");
        }

        var calledSegmentedMethod = that.state.calledSegmentedMethod;
        that.state.calledSegmentedMethod = false;

        stmt = that.generate(node.body[i]);

        if (i === lastIndex || that.state.calledSegmentedMethod) {
          stmt = [ "return ", stmt ];
        }
        fragments.push([ that.addIndent(stmt), ";" ]);

        i += 1;
        if (that.state.calledSegmentedMethod) {
          break;
        }

        that.state.calledSegmentedMethod = calledSegmentedMethod;
      }

      return fragments;
    };

    fragments.push(that.addIndent(that.withFunction(fargs, loop)));

    while (i < imax) {
      fragments.push(",", "\n", that.addIndent(that.withFunction([], loop)));
    }

    fragments.push(generateFunctionToCleanVariables(that));
    fragments.push("\n");

    return fragments;
  }

  function generateFunctionMetadata(that, info) {
    var keys = info.keys;
    var vals = info.vals;

    if (keys.length === 0 && !info.remain && !info.closed) {
      return [];
    }

    var args = that.stitchWith(keys, "; ", function(item, i) {
      var result = [ keys[i] ];

      if (vals[i]) {
        if (vals[i].type === Syntax.ListExpression) {
          result.push("=[ ", that.stitchWith(vals[i].elements, ", ", function(item) {
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
  }

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

  function generateFunctionToCleanVariables(that) {
    var resetVars = Object.keys(that.state.syncBlockScope.vars);

    if (resetVars.length) {
      return [ ",", "\n", that.addIndent(that.withFunction([], function() {
        return that.addIndent(resetVars.sort().map($id).join(" = ") + " = null;");
      })) ];
    }

    return [ ",", "\n", that.addIndent("$.NOP") ];
  }

  function getMetaDataOfFunction(node) {
    var args = [];
    var keys = [];
    var vals = [];
    var remain = null;

    if (node.args) {
      var list = node.args.list;
      for (var i = 0, imax = list.length; i < imax; ++i) {
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
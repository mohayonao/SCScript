(function(sc) {
  "use strict";

  require("./codegen");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var CodeGen = sc.lang.compiler.CodeGen;

  CodeGen.addGenerateMethod("FunctionExpression", function(node) {
    var meta = getMetaDataOfFunction(node);

    var result = [
      "$.Function(",
      generateFunctionBody(this, node, meta.args),
      generateFunctionMetadata(this, meta),
      ")"
    ];

    return result;
  });

  function generateFunctionBody(that, node, args) {
    return that.withFunction([], function() {
      return [
        "return [", generateSegmentedFunctionBody(that, node, args), "];"
      ];
    });
  }

  function generateSegmentedFunctionBody(that, node, args) {
    if (node.body.length === 0) {
      return [];
    }

    var result = null;
    var syncBlockScope = that.state.syncBlockScope;

    that.state.syncBlockScope = that.scope.peek();

    args.forEach(function(arg) {
      that.scope.add("var", arg);
    });
    result = generateSegmentedFunctionBodyElements(that, node, args);

    console.log(that.state.syncBlockScope.vars);

    that.state.syncBlockScope = syncBlockScope;

    return result;
  }

  function generateSegmentedFunctionBodyElements(that, node, args) {

    var fargs = args.map(function(_, i) {
      return "_arg" + i;
    });

    var assignArguments = function(_, i) {
      return $id(args[i]) + "=" + fargs[i];
    };

    var index = 0;
    var lastIndex = node.body.length - 1;
    var fragments = [];

    function loop() {
      var fragments = [];

      while (index <= lastIndex) {
        var stmt;

        if (index === 0) {
          if (args.length) {
            stmt = that.interpose(args, ";", assignArguments);
            fragments.push([ stmt, ";" ]);
          }
        }

        stmt = that.generate(node.body[index]);
        var segmented = !!node.body[index].segmented;

        if (index === lastIndex || segmented) {
          stmt = [ "return ", stmt ];
        }
        fragments.push([ stmt, ";" ]);

        index += 1;
        if (segmented) {
          break;
        }
      }

      return fragments;
    }

    fragments.push(that.withFunction(fargs, loop));

    while (index <= lastIndex) {
      fragments.push(",", that.withFunction([], loop));
    }

    fragments.push(generateFunctionToCleanVariables(that));

    return fragments;
  }

  function generateFunctionMetadata(that, info) {
    var keys = info.keys;
    var vals = info.vals;
    var args = that.interpose(keys, ";", function(item, i) {
      var result = [ keys[i] ];

      if (vals[i]) {
        if (vals[i].type === Syntax.ListExpression) {
          result.push("=[", that.interpose(vals[i].elements, ",", function(item) {
            return toArgumentValueString(item);
          }), "]");
        } else {
          result.push("=", toArgumentValueString(vals[i]));
        }
      }

      return result;
    });

    var result = [ "," ];

    if (args.length || info.remain) {
      result.push("'", args);

      if (info.remain) {
        if (keys.length) {
          result.push(";");
        }
        result.push("*" + info.remain);
      }

      result.push("',[]"); // TODO: put local variables
    } else {
      result.push("null,[]");
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
      return [ ",", that.withFunction([], function() {
        return resetVars.sort().map($id).join("=") + "=null;";
      }) ];
    }

    return [ ",$.NOP" ];
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

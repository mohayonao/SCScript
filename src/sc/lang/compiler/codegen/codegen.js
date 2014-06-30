(function(sc) {
  "use strict";

  require("../compiler");
  require("./scope");

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Scope = sc.lang.compiler.Scope;

  function CodeGen(parent, opts) {
    if (!parent) {
      initialize(this, opts);
    } else {
      this.parent = parent;
      this.opts  = parent.opts;
      this.state = parent.state;
      this.scope = parent.scope;
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
    var result = "";

    for (var i = 0, imax = list.length; i < imax; ++i) {
      var elem = list[i];
      result += Array.isArray(elem) ? this.flattenToString(elem) : elem;
    }

    return result;
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
      result = node.replace(/^(?![_$])/, "$");
    } else {
      result = "null";
    }

    return result;
  };

  CodeGen.prototype.withFunction = function(args, func) {
    var argItems = this.stitchWith(args, ", ", function(item) {
      return this.generate(item);
    });
    var result = [ "function(", argItems, ") {\n" ];

    var indent = this.state.indent;
    this.state.indent += "  ";

    this.scope.begin().setIndent(this.state.indent);
    for (var i = 0, imax = args.length; i < imax; ++i) {
      this.scope.add("arg", args[i]);
    }
    result.push(
      this.scope.toVariableStatement(),
      func.call(this)
    );
    this.scope.end();

    this.state.indent = indent;

    result.push("\n", this.state.indent, "}");

    return result;
  };

  CodeGen.prototype.withIndent = function(func) {
    var base, result;

    base = this.state.indent;
    this.state.indent += "  ";
    result = func.call(this);
    this.state.indent = base;

    return result;
  };

  CodeGen.prototype.addIndent = function(stmt) {
    return [ this.state.indent, stmt ];
  };

  CodeGen.prototype.insertArrayElement = function(elements) {
    var result = [ "[", "]" ];

    if (elements.length) {
      var items = this.withIndent(function() {
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
      // TODO: ???
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

  CodeGen.prototype.stitchWith = function(elements, bond, func) {
    var result = [];

    for (var i = 0, imax = elements.length; i < imax; ++i) {
      if (i) {
        result.push(bond);
      }
      result.push(func.call(this, elements[i], i));
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

  sc.lang.compiler.CodeGen = CodeGen;
})(sc);

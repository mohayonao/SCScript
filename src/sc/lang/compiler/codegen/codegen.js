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

  CodeGen.prototype.generate = function(node, opts) {
    if (Array.isArray(node)) {
      return [
        "(", this.stitchWith(node, ", ", function(item) {
          return this.generate(item, opts);
        }), ")"
      ];
    }

    if (node && node.type) {
      return toSourceNodeWhenNeeded(this[node.type](node, opts), node);
    }

    if (typeof node === "string") {
      return node.replace(/^(?![_$])/, "$");
    }

    return "null";
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
    var indent, result;

    indent = this.state.indent;
    this.state.indent += "  ";
    result = func.call(this);
    this.state.indent = indent;

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

  function toSourceNodeWhenNeeded(generated) {
    if (Array.isArray(generated)) {
      return flattenToString(generated);
    }
    return generated;
  }

  function flattenToString(list) {
    var result = "";

    for (var i = 0, imax = list.length; i < imax; ++i) {
      var elem = list[i];
      result += Array.isArray(elem) ? flattenToString(elem) : elem;
    }

    return result;
  }

  sc.lang.compiler.CodeGen = CodeGen;
})(sc);

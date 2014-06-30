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
    if (typeof that.opts.bare === "undefined") {
      that.opts.bare = false;
    }
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

  // TODO: remove
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

  sc.lang.compiler.CodeGen = CodeGen;
})(sc);

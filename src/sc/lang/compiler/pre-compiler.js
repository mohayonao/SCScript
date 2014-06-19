(function(sc) {
  "use strict";

  require("./sc");
  require("./compiler");
  require("./node");

  var compiler = sc.lang.compiler;
  var Syntax   = compiler.Syntax;
  var Node     = sc.lang.compiler.node;

  var SegmentedMethod = {
    idle: true,
    sleep: true,
    wait: true,
    yield: true,
    embedInStream: true,
  };

  function PreCompiler() {
    this.functionStack = [];
    this.functionArray = [];
  }

  PreCompiler.prototype.compile = function(ast) {
    ast = this.traverse(ast);
    this.functionArray.forEach(function(node) {
      node.body = this.segment(node.body);
    }, this);
    return ast;
  };

  PreCompiler.prototype.traverse = function(node) {
    var result;

    if (Array.isArray(node)) {
      result = this.traverse$Array(node);
    } else if (node && typeof node === "object") {
      result = this.traverse$Object(node);
    } else {
      result = node;
    }

    return result;
  };

  PreCompiler.prototype.traverse$Array = function(node) {
    return node.map(function(node) {
      return this.traverse(node);
    }, this);
  };

  PreCompiler.prototype.traverse$Object = function(node) {
    var result = {};

    if (isFunctionExpression(node)) {
      this.functionStack.push(result);
    } else if (isSegmentedMethod(node)) {
      result.segmented = true;
      this.functionStack.forEach(function(node) {
        if (!node.segmented) {
          this.functionArray.push(node);
          node.segmented = true;
        }
      }, this);
    }

    Object.keys(node).forEach(function(key) {
      /* istanbul ignore next */
      if (key === "range" || key === "loc") {
        result[key] = node[key];
      } else {
        result[key] = this.traverse(node[key]);
      }
    }, this);

    if (isFunctionExpression(result)) {
      this.functionStack.pop();
    }

    return result;
  };

  PreCompiler.prototype.segment = function(list) {
    var result = [];
    var id = 0;
    var i, imax;

    function traverse(parent, node, key) {
      var expr;

      if (node && typeof node === "object") {
        Object.keys(node).forEach(function(key) {
          traverse(node, node[key], key);
        });
      }
      if (isValueMethod(node)) {
        expr = Node.createValueMethodEvaluator(id, node);
        parent[key] = Node.createValueMethodResult(id++);
        result.push(expr);
      }
    }

    for (i = 0, imax = list.length; i < imax; ++i) {
      traverse(list, list[i], i);
      result.push(list[i]);
    }

    return result;
  };

  function isFunctionExpression(node) {
    return node && node.type === Syntax.FunctionExpression;
  }

  function isSegmentedMethod(node) {
    return node && node.type === Syntax.CallExpression &&
      (SegmentedMethod.hasOwnProperty(node.method.name) || isValueMethod(node));
  }

  function isValueMethod(node) {
    return node && node.type === Syntax.CallExpression &&
      node.method.name.substr(0, 5) === "value";
  }

  function precompile(ast) {
    return new PreCompiler().compile(ast);
  }

  sc.lang.compiler.precompile = precompile;
})(sc);

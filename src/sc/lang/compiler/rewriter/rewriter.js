(function(sc) {
  "use strict";

  require("../compiler");
  require("../node/node");

  var Syntax = sc.lang.compiler.Syntax;
  var Node = sc.lang.compiler.Node;

  var SegmentedMethod = {
    idle: true,
    sleep: true,
    wait: true,
    yield: true,
    alwaysYield: true,
    yieldAndReset: true,
    embedInStream: true,
  };

  function Rewriter() {
    this.functionStmtStack = [];
  }

  Rewriter.prototype.rewrite = function(ast) {
    return this.traverse(ast);
  };

  Rewriter.prototype.traverse = function(node) {
    if (!node) {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(function(elem) {
        this.traverse(elem);
      }, this);
      return;
    }

    if (node.type === Syntax.FunctionExpression) {
      this.processFunctionExpression(node);
    } else {
      if (isSegmentedMethod(node)) {
        node.segmented = true;
        this.setSegmented();
      }
    }

    if (isObject(node)) {
      Object.keys(node).forEach(function(key) {
        this.traverse(node[key]);
      }, this);
    }

    return node;
  };

  Rewriter.prototype.processFunctionExpression = function(node) {
    var body = this.replaceBody(node.body);

    body.forEach(function(stmt) {
      this.functionStmtStack.push(stmt);

      this.traverse(stmt);

      this.functionStmtStack.pop();
    }, this);

    node.body = body;
  };

  Rewriter.prototype.setSegmented = function() {
    this.functionStmtStack.forEach(function(stmt) {
      stmt.segmented = true;
    });
  };

  Rewriter.prototype.replaceBody = function(list) {
    var result = [];
    var id = 0;

    function traverse(parent, node, key) {
      if (isObject(node)) {
        Object.keys(node).forEach(function(key) {
          traverse(node, node[key], key);
        });
      }

      if (isValueMethod(node)) {
        var expr = Node.createValueMethodEvaluator(id, node);
        parent[key] = Node.createValueMethodResult(id++);
        result.push(expr);
      }
    }

    list.forEach(function(elem, i) {
      traverse(list, elem, i);
      result.push(list[i]);
    });

    return result;
  };

  function isObject(obj) {
    return obj && typeof obj === "object";
  }

  function isSegmentedMethod(node) {
    return node && node.type === Syntax.CallExpression &&
      (SegmentedMethod.hasOwnProperty(node.method.name) || isValueMethod(node));
  }

  function isValueMethod(node) {
    return node && node.type === Syntax.CallExpression &&
      node.method.name.substr(0, 5) === "value";
  }

  sc.lang.compiler.Rewriter = Rewriter;
})(sc);

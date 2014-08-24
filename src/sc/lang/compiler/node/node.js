(function(sc) {
  "use strict";

  require("../compiler");

  var Syntax = sc.lang.compiler.Syntax;

  var Node = {
    createAssignmentExpression: function(operator, left, right, remain) {
      var node = {
        type: Syntax.AssignmentExpression,
        operator: operator,
        left: left,
        right: right
      };

      if (remain) {
        node.remain = remain;
      }

      return node;
    },
    createBinaryExpression: function(operator, left, right) {
      var node = {
        type: Syntax.BinaryExpression,
        operator: operator.value,
        left: left,
        right: right
      };

      if (operator.adverb) {
        node.adverb = operator.adverb;
      }

      return node;
    },
    createBlockExpression: function(body) {
      return {
        type: Syntax.BlockExpression,
        body: body
      };
    },
    createCallExpression: function(callee, method, args, stamp) {
      args  = args  || { list: [] };
      stamp = stamp || "(";

      var node = {
        type: Syntax.CallExpression,
        stamp: stamp,
        callee: callee,
        method: method,
        args: args
      };

      return node;
    },
    createEnvironmentExpression: function(id) {
      return {
        type: Syntax.EnvironmentExpression,
        id: id
      };
    },
    createFunctionExpression: function(args, body, opts) {
      var node = {
        type: Syntax.FunctionExpression,
        body: body
      };

      if (args) {
        node.args = args;
      }
      if (opts.closed) {
        node.closed = true;
      }
      if (opts.partial) {
        node.partial = true;
      }
      if (opts.blockList) {
        node.blockList = true;
      }

      return node;
    },
    createIdentifier: function(name) {
      return {
        type: Syntax.Identifier,
        name: name
      };
    },
    createListExpression: function(elements, immutable) {
      var node = {
        type: Syntax.ListExpression,
        elements: elements
      };

      if (immutable) {
        node.immutable = !!immutable;
      }

      return node;
    },
    createLiteral: function(token) {
      return {
        type: Syntax.Literal,
        value: token.value,
        valueType: token.type
      };
    },
    createEventExpression: function(elements) {
      return {
        type: Syntax.EventExpression,
        elements: elements
      };
    },
    createProgram: function(body) {
      return {
        type: Syntax.Program,
        body: body
      };
    },
    createThisExpression: function(name) {
      return {
        type: Syntax.ThisExpression,
        name: name
      };
    },
    createUnaryExpression: function(operator, arg) {
      return {
        type: Syntax.UnaryExpression,
        operator: operator,
        arg: arg
      };
    },
    createVariableDeclaration: function(declarations, kind) {
      return {
        type: Syntax.VariableDeclaration,
        declarations: declarations,
        kind: kind
      };
    },
    createVariableDeclarator: function(id, init) {
      var node = {
        type: Syntax.VariableDeclarator,
        id: id
      };

      if (init) {
        node.init = init;
      }

      return node;
    },
    createValueMethodEvaluator: function(id, expr) {
      return {
        type: Syntax.ValueMethodEvaluator,
        id: id,
        expr: expr,
        segmented: true
      };
    },
    createValueMethodResult: function(id) {
      return {
        type: Syntax.ValueMethodResult,
        id: id
      };
    }
  };

  sc.lang.compiler.Node = Node;
})(sc);

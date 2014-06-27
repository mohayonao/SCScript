(function(sc) {
  "use strict";

  require("./base-parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;
  var BaseParser = sc.lang.compiler.BaseParser;

  BaseParser.addMethod("parseAssignmentExpression", function() {
    return new AssignmentExpressionParser(this).parse();
  });

  function AssignmentExpressionParser(parent) {
    BaseParser.call(this, parent.lexer, parent.state);
    this.parent = parent;
  }
  sc.libs.extend(AssignmentExpressionParser, BaseParser);

  AssignmentExpressionParser.prototype.parse = function() {
    return this.parseAssignmentExpression();
  };

  AssignmentExpressionParser.prototype.parseAssignmentExpression = function() {
    var marker = this.createMarker();

    var node, token;
    if (this.match("#")) {
      token = this.lex();
      if (this.matchAny([ "[", "{" ])) {
        this.unlex(token);
      } else {
        node = this.parseDestructuringAssignmentExpression();
      }
    }

    if (!node) {
      node = this.parseSimpleAssignmentExpression();
    }

    return marker.update().apply(node, true);
  };

  /*
    DestructuringAssignmentExpression :
      DestructuringAssignmentLeft = AssignmentExpression
  */
  AssignmentExpressionParser.prototype.parseDestructuringAssignmentExpression = function() {
    var left = this.parseDestructuringAssignmentLeft();
    var operator = this.lookahead;
    this.expect("=");
    var right = this.parseAssignmentExpression();

    return Node.createAssignmentExpression(
      operator.value, left.list, right, left.remain
    );
  };

  /*
    SimpleAssignmentExpression :
      PartialExpression
      PartialExpression = AssignmentExpression
  */
  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpression = function() {
    var node = this.parsePartialExpression();

    if (this.match("=")) {
      if (node.type === Syntax.CallExpression) {
        node = this._parseSimpleAssignmentCallExpression(node);
      } else {
        node = this._parseSimpleAssignmentExpression(node);
      }
    }

    return node;
  };

  AssignmentExpressionParser.prototype._parseSimpleAssignmentCallExpression = function(node) {
    this.expect("=");

    var marker = this.createMarker(node);
    var right = this.parseAssignmentExpression();

    node.method.name = node.method.name + "_";
    node.args.list   = node.args.list.concat(right);
    if (node.stamp !== "[")  {
      node.stamp = "=";
    }

    return marker.update().apply(node, true);
  };

  AssignmentExpressionParser.prototype._parseSimpleAssignmentExpression = function(node) {
    if (!isLeftHandSide(node)) {
      this.throwError(node, Message.InvalidLHSInAssignment);
    }

    var token = this.lex();
    var right = this.parseAssignmentExpression();

    return Node.createAssignmentExpression(token.value, node, right);
  };

  /*
    DestructuringAssignmentLeft :
      DestructingAssignmentLeftList
      DestructingAssignmentLeftList ... VariableIdentifier
  */
  AssignmentExpressionParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = {};

    params.list = this.parseDestructingAssignmentLeftList();

    if (this.match("...")) {
      this.lex();
      params.remain = this.parseVariableIdentifier();
    }

    return params;
  };

  /*
    DestructingAssignmentLeftList :
      VariableIdentifier
      DestructingAssignmentLeftList , VariableIdentifier
  */
  AssignmentExpressionParser.prototype.parseDestructingAssignmentLeftList = function() {
    var elemtns = [];

    do {
      elemtns.push(this.parseVariableIdentifier());
      if (this.match(",")) {
        this.lex();
      }
    } while (this.hasNextToken() && !this.matchAny([ "...", "=" ]));

    return elemtns;
  };

  function isLeftHandSide(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.EnvironmentExpresion:
      return true;
    }
    return false;
  }
})(sc);

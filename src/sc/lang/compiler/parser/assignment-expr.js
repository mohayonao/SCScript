(function(sc) {
  "use strict";

  require("./parser");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var Node = sc.lang.compiler.Node;
  var Parser = sc.lang.compiler.Parser;

  /*
    AssignmentExpression :
      PartialExpression
      PartialExpression = AssignmentExpression
      # DestructuringAssignmentLeft = AssignmentExpression

    DestructuringAssignmentLeft :
      DestructingAssignmentLeftList
      DestructingAssignmentLeftList ... Identifier

    DestructingAssignmentLeftList :
      Identifier
      DestructingAssignmentLeftList , Identifier
  */
  Parser.addParseMethod("AssignmentExpression", function() {
    return new AssignmentExpressionParser(this).parse();
  });

  function AssignmentExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(AssignmentExpressionParser, Parser);

  AssignmentExpressionParser.prototype.parse = function() {
    var token;
    if (this.match("#")) {
      token = this.lex();
      if (!this.matchAny([ "[", "{" ])) {
        return this.unlex(token).parseDestructuringAssignmentExpression();
      }
      this.unlex(token);
    }
    return this.parseSimpleAssignmentExpression();
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpression = function() {
    var expr = this.parsePartialExpression();

    if (!this.match("=")) {
      return expr;
    }
    this.lex();

    if (expr.type === Syntax.CallExpression) {
      return this.parseSimpleAssignmentExpressionViaMethod(expr);
    }

    return this.parseSimpleAssignmentExpressionViaOperator(expr);
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpressionViaMethod = function(expr) {
    var marker = this.createMarker(expr);
    var right = this.parseAssignmentExpression();

    var methodName = expr.method.name;
    if (expr.stamp === "[") {
      methodName = methodName === "at" ? "put" : "putSeries";
    } else {
      methodName = methodName + "_";
    }

    expr.method.name = methodName;
    expr.args.list   = expr.args.list.concat(right);
    if (expr.stamp !== "[")  {
      expr.stamp = "=";
    }

    return marker.update().apply(expr, true);
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignmentExpressionViaOperator = function(expr) {
    if (isInvalidLeftHandSide(expr)) {
      this.throwError(expr, Message.InvalidLHSInAssignment);
    }

    var marker = this.createMarker(expr);
    var right = this.parseAssignmentExpression();

    return marker.update().apply(
      Node.createAssignmentExpression("=", expr, right)
    );
  };

  AssignmentExpressionParser.prototype.parseDestructuringAssignmentExpression = function() {
    var marker = this.createMarker();

    this.expect("#");

    var left = this.parseDestructuringAssignmentLeft();

    this.expect("=");
    var right = this.parseAssignmentExpression();

    return marker.update().apply(
      Node.createAssignmentExpression("=", left.list, right, left.remain)
    );
  };

  AssignmentExpressionParser.prototype.parseDestructuringAssignmentLeft = function() {
    var params = {
      list: this.parseDestructingAssignmentLeftList()
    };

    if (this.match("...")) {
      this.lex();
      params.remain = this.parseIdentifier({ variable: true });
    }

    return params;
  };

  AssignmentExpressionParser.prototype.parseDestructingAssignmentLeftList = function() {
    var elemtns = [];

    do {
      elemtns.push(this.parseIdentifier({ variable: true }));
      if (this.match(",")) {
        this.lex();
      }
    } while (this.hasNextToken() && !this.matchAny([ "...", "=" ]));

    return elemtns;
  };

  function isInvalidLeftHandSide(expr) {
    switch (expr.type) {
    case Syntax.Identifier:
    case Syntax.EnvironmentExpression:
      return false;
    }
    return true;
  }
})(sc);

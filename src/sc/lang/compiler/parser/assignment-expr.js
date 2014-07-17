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
      SimpleAssign
      MultiAssign

    SimpleAssign :
      PartialExpression = AssignmentExpression

    MultiAssign :
      # MultiAssignLeft = AssignmentExpression

    MultiAssignLeft :
      MultiAssignLeftList
      MultiAssignLeftList ... Identifier

    MultiAssignLeftList :
      Identifier
      MultiAssignLeftList , Identifier
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
        return this.unlex(token).parseMultiAssign();
      }
      this.unlex(token);
    }
    return this.parseSimpleAssign();
  };

  AssignmentExpressionParser.prototype.parseSimpleAssign = function() {
    var expr = this.parsePartialExpression();

    if (!this.match("=")) {
      return expr;
    }
    this.lex();

    if (expr.type === Syntax.CallExpression) {
      return this.parseSimpleAssignViaMethod(expr);
    }

    return this.parseSimpleAssignViaOperator(expr);
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignViaMethod = function(expr) {
    var marker = this.createMarker(expr);
    var right = this.parseAssignmentExpression();

    var methodName = expr.method.name;
    if (expr.stamp === "[") {
      methodName = methodName === "at" ? "put" : "putSeries";
    } else if (expr.stamp === ".") {
      methodName = methodName + "_";
    } else {
      return this.throwUnexpected({ value: "=" });
    }

    expr.method.name = methodName;
    expr.args.list   = expr.args.list.concat(right);
    if (expr.stamp !== "[")  {
      expr.stamp = "=";
    }

    return marker.update().apply(expr, true);
  };

  AssignmentExpressionParser.prototype.parseSimpleAssignViaOperator = function(expr) {
    if (isInvalidLeftHandSide(expr)) {
      this.throwError(expr, Message.InvalidLHSInAssignment);
    }

    var marker = this.createMarker(expr);
    var right = this.parseAssignmentExpression();

    return marker.update().apply(
      Node.createAssignmentExpression("=", expr, right)
    );
  };

  AssignmentExpressionParser.prototype.parseMultiAssign = function() {
    var marker = this.createMarker();

    this.expect("#");

    var left = this.parseMultiAssignLeft();

    this.expect("=");
    var right = this.parseAssignmentExpression();

    return marker.update().apply(
      Node.createAssignmentExpression("=", left.list, right, left.remain)
    );
  };

  AssignmentExpressionParser.prototype.parseMultiAssignLeft = function() {
    var params = {
      list: this.parseMultiAssignLeftList()
    };

    if (this.match("...")) {
      this.lex();
      params.remain = this.parseIdentifier({ variable: true });
    }

    return params;
  };

  AssignmentExpressionParser.prototype.parseMultiAssignLeftList = function() {
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

(function(sc) {
  "use strict";

  require("./base-parser");

  var BaseParser = sc.lang.compiler.BaseParser;
  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;

  BaseParser.addMethod("parseLeftHandSideExpression", function(node) {
    return new LeftHandSideExpressionParser(this).parse(node);
  });

  function LeftHandSideExpressionParser(parent) {
    BaseParser.call(this, parent);
  }
  sc.libs.extend(LeftHandSideExpressionParser, BaseParser);

  /*
    LeftHandSideExpression :
      TODO: write
  */
  LeftHandSideExpressionParser.prototype.parse = function(node) {
    var marker = this.createMarker();
    var expr = this.parseSignedExpression(node);
    var prev = null;

    var stamp;
    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      var lookahead = this.lookahead;
      if ((prev === "{" && (stamp === "(" || stamp === "[")) ||
          (prev === "(" && stamp === "(")) {
        this.throwUnexpected(lookahead);
      }
      switch (stamp) {
      case "(":
        expr = this.parseParenthesis(expr);
        break;
      case "#":
        expr = this.parseClosedBrace(expr);
        break;
      case "{":
        expr = this.parseBrace(expr);
        break;
      case "[":
        expr = this.parseBracket(expr);
        break;
      case ".":
        expr = this.parseDot(expr);
        break;
      }
      marker.update().apply(expr, true);

      prev = stamp;
    }

    return expr;
  };

  LeftHandSideExpressionParser.prototype.parseParenthesis = function(expr) {
    if (isClassName(expr)) {
      // Class()
      return this.parseAbbrMethodCall(expr, "new", "(");
    }
    // func(a) -> a.func()
    return this.parseMethodCall(expr);
  };

  LeftHandSideExpressionParser.prototype.parseMethodCall = function(expr) {
    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var lookahead = this.lookahead;
    var args      = this.parseCallArgument();

    var method = expr;

    expr = args.list.shift();

    if (!expr) {
      if (args.expand) {
        expr = args.expand;
        delete args.expand;
      } else {
        this.throwUnexpected(lookahead);
      }
    }

    // max(0, 1) -> 0.max(1)
    return Node.createCallExpression(expr, method, args, "(");
  };

  LeftHandSideExpressionParser.prototype.parseAbbrMethodCall = function(expr, methodName, stamp) {
    var method = Node.createIdentifier(methodName);

    method = this.createMarker().apply(method);

    var args = this.parseCallArgument();

    return Node.createCallExpression(expr, method, args, stamp);
  };

  LeftHandSideExpressionParser.prototype.parseClosedBrace = function(expr) {
    this.expect("#");
    if (!this.match("{")) {
      this.throwUnexpected(this.lookahead);
    }

    this.state.closedFunction = true;
    expr = this.parseBrace(expr);
    this.state.closedFunction = false;

    return expr;
  };

  LeftHandSideExpressionParser.prototype.parseBrace = function(expr) {
    var method, node;

    if (expr.type === Syntax.CallExpression && expr.stamp && expr.stamp !== "(") {
      this.throwUnexpected(this.lookahead);
    }
    if (expr.type === Syntax.Identifier) {
      if (isClassName(expr)) {
        method = Node.createIdentifier("new");
        method = this.createMarker().apply(method);
        expr   = Node.createCallExpression(expr, method, { list: [] }, "{");
      } else {
        expr = Node.createCallExpression(null, expr, { list: [] });
      }
    }
    var disallowGenerator = this.state.disallowGenerator;
    this.state.disallowGenerator = true;
    node = this.parseBraces({ blocklist: true });
    this.state.disallowGenerator = disallowGenerator;

    // TODO: refactoring
    if (expr.callee === null) {
      expr.callee = node;
      node = expr;
    } else {
      expr.args.list.push(node);
    }

    return expr;
  };

  LeftHandSideExpressionParser.prototype.parseBracket = function(expr) {
    if (expr.type === Syntax.CallExpression && expr.stamp === "(") {
      this.throwUnexpected(this.lookahead);
    }

    if (isClassName(expr)) {
      expr = this.parseNewFrom(expr);
    } else {
      expr = this.parseListAt(expr);
    }

    return expr;
  };

  LeftHandSideExpressionParser.prototype.parseNewFrom = function(expr) {
    var method = Node.createIdentifier("[]");
    method = this.createMarker().apply(method);

    var marker = this.createMarker();

    var node = this.parseListExpression();
    node = marker.update().apply(node);

    return Node.createCallExpression(expr, method, { list: [ node ] }, "[");
  };

  LeftHandSideExpressionParser.prototype.parseListAt = function(expr) {
    var method = Node.createIdentifier("[]");
    method = this.createMarker().apply(method);

    var indexer = this.parseListIndexer();
    if (indexer) {
      if (indexer.length === 3) {
        method.name = "[..]";
      }
    } else {
      this.throwUnexpected(this.lookahead);
    }

    return Node.createCallExpression(expr, method, { list: indexer }, "[");
  };

  LeftHandSideExpressionParser.prototype.parseDot = function(expr) {
    this.expect(".");

    if (this.match("(")) {
      // expr.()
      return this.parseAbbrMethodCall(expr, "value", ".");
    }
    if (this.match("[")) {
      // expr.[0]
      return this.parseDotBracket(expr);
    }

    var method = this.parseMethodName();
    if (this.match("(")) {
      // expr.method(args)
      var args = this.parseCallArgument();
      return Node.createCallExpression(expr, method, args);
    }

    // expr.method
    return Node.createCallExpression(expr, method, { list: [] });
  };

  LeftHandSideExpressionParser.prototype.parseDotBracket = function(expr) {
    var marker = this.createMarker(expr);

    var method = Node.createIdentifier("value");
    method = this.createMarker().apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, ".");
    expr = marker.update().apply(expr);

    return this.parseListAt(expr);
  };

  LeftHandSideExpressionParser.prototype.parseCallArgument = function() {
    var args = { list: [] };
    var hasKeyword = false;

    this.expect("(");

    while (this.hasNextToken() && !this.match(")")) {
      var lookahead = this.lookahead;
      if (!hasKeyword) {
        if (this.match("*")) {
          this.lex();
          args.expand = this.parseExpressions();
          hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          this.parseCallArgumentKeyword(args);
          hasKeyword = true;
        } else {
          args.list.push(this.parseExpressions());
        }
      } else {
        if (lookahead.type !== Token.Label) {
          this.throwUnexpected(lookahead);
        }
        this.parseCallArgumentKeyword(args);
      }
      if (this.match(")")) {
        break;
      }
      this.expect(",");
    }

    this.expect(")");

    return args;
  };

  LeftHandSideExpressionParser.prototype.parseCallArgumentKeyword = function(args) {
    var key = this.lex().value;
    var value = this.parseExpressions();
    if (!args.keywords) {
      args.keywords = {};
    }
    args.keywords[key] = value;
  };

  LeftHandSideExpressionParser.prototype.parseMethodName = function() {
    var marker = this.createMarker();
    var property = this.lex();

    if (property.type !== Token.Identifier || isClassName(property)) {
      this.throwUnexpected(property);
    }

    var id = Node.createIdentifier(property.value);

    return marker.update().apply(id);
  };

  function isClassName(node) {
    if (node.type !== Syntax.Identifier) {
      return false;
    }

    var name = node.value || node.name;
    var ch = name.charAt(0);

    return "A" <= ch && ch <= "Z";
  }
})(sc);

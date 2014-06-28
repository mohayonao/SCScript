(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;
  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;

  Parser.addParseMethod("LeftHandSideExpression", function() {
    return new LHSExpressionParser(this).parse();
  });

  function LHSExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(LHSExpressionParser, Parser);

  /*
    LeftHandSideExpression :
      TODO: write
  */
  LHSExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();
    var expr = this.parseSignedExpression();
    var prev = null;

    var stamp;
    while ((stamp = this.matchAny([ "(", "{", "#", "[", "." ])) !== null) {
      var err = false;
      err = err || (prev === "(" && stamp === "(");
      err = err || (prev === "{" && stamp === "(");
      err = err || (prev === "[" && stamp === "(");
      err = err || (prev === "[" && stamp === "{");
      if (err) {
        this.throwUnexpected(this.lookahead);
      }

      expr = this.parseLHSChainExpression(stamp, expr);
      marker.update().apply(expr, true);

      if (stamp === "#") {
        stamp = "{";
      }

      prev = stamp;
    }

    return expr;
  };

  LHSExpressionParser.prototype.parseLHSChainExpression = function(stamp, expr) {
    if (stamp === "(") {
      return this.parseLHSParentheses(expr);
    }
    if (stamp === "#") {
      return this.parseLHSClosedBraces(expr);
    }
    if (stamp === "{") {
      return this.parseLHSBraces(expr);
    }
    if (stamp === "[") {
      return this.parseLHSBrackets(expr);
    }
    return this.parseLHSDot(expr);
  };

  LHSExpressionParser.prototype.parseLHSParentheses = function(expr) {
    if (isClassName(expr)) {
      // Expr.new( ... )
      return this.parseLHSAbbrMethodCall(expr, "new", "(");
    }
    // expr( a ... ) -> a.expr( ... )
    return this.parseLHSMethodCall(expr);
  };

  LHSExpressionParser.prototype.parseLHSClosedBraces = function(expr) {
    var token = this.expect("#");
    if (!this.match("{")) {
      return this.throwUnexpected(token);
    }
    return this.parseLHSBraces(expr, { closed: true });
  };

  LHSExpressionParser.prototype.parseLHSBraces = function(expr, opts) {
    opts = opts || {};

    if (expr.type === Syntax.Identifier) {
      expr = createCallExpressionForBraces(expr, this.createMarker());
    }
    var node = this.parseFunctionExpression({ blockList: true, closed: !!opts.closed });

    if (expr.callee === null) {
      expr.callee = node;
    } else {
      expr.args.list.push(node);
    }

    return expr;
  };

  function createCallExpressionForBraces(expr, marker) {
    var callee, method;

    if (isClassName(expr)) {
      callee = expr;
      method = marker.apply(Node.createIdentifier("new"));
    } else {
      callee = null;
      method = expr;
    }

    return Node.createCallExpression(callee, method, { list: [] }, "{");
  }

  LHSExpressionParser.prototype.parseLHSMethodCall = function(expr) {
    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var lookahead = this.lookahead;
    var args      = new ArgumentsParser(this).parse();

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

  LHSExpressionParser.prototype.parseLHSAbbrMethodCall = function(expr, methodName, stamp) {
    var method = Node.createIdentifier(methodName);

    method = this.createMarker().apply(method);

    var args = new ArgumentsParser(this).parse();

    return Node.createCallExpression(expr, method, args, stamp);
  };

  LHSExpressionParser.prototype.parseLHSBrackets = function(expr) {
    if (isClassName(expr)) {
      return this.parseLHSwithList(expr);
    }
    return this.parseLHSwithIndexer(expr);
  };

  LHSExpressionParser.prototype.parseLHSwithList = function(expr) {
    var marker = this.createMarker();

    var method = this.createMarker().apply(
      Node.createIdentifier("[]")
    );
    var listExpr = this.parseListExpression();

    return marker.update().apply(
      Node.createCallExpression(expr, method, { list: [ listExpr ] }, "[")
    );
  };

  LHSExpressionParser.prototype.parseLHSwithIndexer = function(expr) {
    var marker = this.createMarker();

    var method = this.createMarker().apply(
      Node.createIdentifier()
    );
    var listIndexer = this.parseListIndexer();

    method.name = listIndexer.length === 3 ? "[..]" : "[]";

    return marker.update().apply(
      Node.createCallExpression(expr, method, { list: listIndexer }, "[")
    );
  };

  LHSExpressionParser.prototype.parseLHSDot = function(expr) {
    this.expect(".");

    if (this.match("(")) {
      // expr.()
      return this.parseLHSAbbrMethodCall(expr, "value", ".");
    }
    if (this.match("[")) {
      // expr.[0]
      return this.parseDotBrackets(expr);
    }

    var marker = this.createMarker();

    var method = this.parseIdentifier({ variable: true });
    var args   = new ArgumentsParser(this).parse();

    return marker.update().apply(
      Node.createCallExpression(expr, method, args)
    );
  };

  LHSExpressionParser.prototype.parseDotBrackets = function(expr) {
    var marker = this.createMarker(expr);

    var method = Node.createIdentifier("value");
    method = this.createMarker().apply(method);

    expr = Node.createCallExpression(expr, method, { list: [] }, ".");
    expr = marker.update().apply(expr);

    return this.parseLHSwithIndexer(expr);
  };

  function ArgumentsParser(parent) {
    Parser.call(this, parent);
    this._hasKeyword = false;
    this._args = { list: [] };
  }
  sc.libs.extend(ArgumentsParser, Parser);

  ArgumentsParser.prototype.parse = function() {
    if (this.match("(")) {
      return this.parseArguments();
    }
    return { list: [] };
  };

  ArgumentsParser.prototype.parseArguments = function() {
    this.expect("(");

    while (this.hasNextToken() && !this.match(")")) {
      var lookahead = this.lookahead;
      if (!this._hasKeyword) {
        if (this.match("*")) {
          this.lex();
          this._args.expand = this.parseExpressions();
          this._hasKeyword = true;
        } else if (lookahead.type === Token.Label) {
          this.parseKeywordArgument();
          this._hasKeyword = true;
        } else {
          this._args.list.push(this.parseExpressions());
        }
      } else {
        this.parseKeywordArgument();
      }
      if (!this.match(")")) {
        this.expect(",");
      }
    }

    this.expect(")");

    return this._args;
  };

  ArgumentsParser.prototype.parseKeywordArgument = function() {
    var token = this.lex();
    if (token.type !== Token.Label) {
      return this.throwUnexpected(token);
    }

    var key = token.value;
    var val = this.parseExpressions();

    if (!this._args.keywords) {
      this._args.keywords = {};
    }
    this._args.keywords[key] = val;
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

(function(sc) {
  "use strict";

  require("./parser");

  var Parser = sc.lang.compiler.Parser;
  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Node = sc.lang.compiler.Node;

  Parser.addParseMethod("CallExpression", function() {
    return new CallExpressionParser(this).parse();
  });

  function CallExpressionParser(parent) {
    Parser.call(this, parent);
  }
  sc.libs.extend(CallExpressionParser, Parser);

  /*
    CallExpression :
      TODO: write later
  */
  CallExpressionParser.prototype.parse = function() {
    var marker = this.createMarker();
    var expr = this.parseSignedExpression();

    if (this.matchAny([ "{", "#" ])) {
      expr = this.parseBlockList(expr);
      marker.update().apply(expr, true);
    }

    var stamp;
    while ((stamp = this.matchAny([ ".", "[", "(" ])) !== null) {
      verifyChain(this, expr.stamp, stamp);

      expr = this.parseChainable(stamp, expr);

      marker.update().apply(expr, true);
    }

    return expr;
  };

  function verifyChain(that, prev, stamp) {
    var err = false;

    err = err || (prev === "(" && stamp === "(");
    err = err || (prev === "[" && stamp === "(");

    if (err) {
      that.throwUnexpected(that.lookahead);
    }
  }

  CallExpressionParser.prototype.parseChainable = function(stamp, expr) {
    if (stamp === "(") {
      return this.parseCallParentheses(expr);
    }
    if (stamp === "[") {
      return this.parseCallBrackets(expr);
    }
    return this.parseCallDot(expr);
  };

  CallExpressionParser.prototype.parseCallParentheses = function(expr) {
    if (isClassName(expr)) {
      // Expr.new( ... )
      return this.parseShortHandMethodCall(expr, "new");
    }
    // expr( a ... ) -> a.expr( ... )
    return this.parseMethodCall(expr);
  };

  CallExpressionParser.prototype.parseMethodCall = function(expr) {
    if (expr.type !== Syntax.Identifier) {
      this.throwUnexpected(this.lookahead);
    }

    var lookahead = this.lookahead;
    var args      = new ArgumentsParser(this).parse();
    var method    = expr;

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
    return Node.createCallExpression(expr, method, args);
  };

  CallExpressionParser.prototype.parseShortHandMethodCall = function(expr, methodName) {
    var method = Node.createIdentifier(methodName);
    var args = new ArgumentsParser(this).parse();

    return Node.createCallExpression(expr, method, args);
  };

  CallExpressionParser.prototype.parseCallBrackets = function(expr) {
    if (isClassName(expr)) {
      return this.parseCallwithList(expr);
    }
    return this.parseCallwithIndexer(expr);
  };

  CallExpressionParser.prototype.parseCallwithList = function(expr) {
    var marker = this.createMarker();
    var method = Node.createIdentifier("[]");
    var listExpr = this.parseListExpression();

    return marker.update().apply(
      Node.createCallExpression(expr, method, { list: [ listExpr ] }, "[")
    );
  };

  CallExpressionParser.prototype.parseCallwithIndexer = function(expr) {
    var marker = this.createMarker();
    var method = Node.createIdentifier();
    var listIndexer = this.parseListIndexer();

    method.name = listIndexer.length === 3 ? "copySeries" : "at";

    return marker.update().apply(
      Node.createCallExpression(expr, method, { list: listIndexer }, "[")
    );
  };

  function createCallExpressionForBraces(expr) {
    var callee, method;

    if (isClassName(expr)) {
      callee = expr;
      method = Node.createIdentifier("new");
    } else {
      callee = null;
      method = expr;
    }

    return Node.createCallExpression(callee, method);
  }

  CallExpressionParser.prototype.parseBlockList = function(expr) {
    expr = createCallExpressionForBraces(expr);

    var blockList = new ArgumentsParser(this).parseBlockList().list;

    if (expr.callee === null) {
      expr.callee = blockList.shift();
    }

    expr.args.list = expr.args.list.concat(blockList);

    return expr;
  };

  CallExpressionParser.prototype.parseCallDot = function(expr) {
    this.expect(".");

    if (this.match("(")) {
      // expr.()
      return this.parseShortHandMethodCall(expr, "value");
    }
    if (this.match("[")) {
      // expr.[0] === expr.at(0)
      return this.parseCallwithIndexer(expr);
    }

    var marker = this.createMarker();

    var method = this.parseIdentifier({ variable: true });
    var args   = new ArgumentsParser(this).parse();
    var stamp  = args ? "(" : ".";

    return marker.update().apply(
      Node.createCallExpression(expr, method, args, stamp)
    );
  };

  function ArgumentsParser(parent) {
    Parser.call(this, parent);
    this._args = { list: [] };
  }
  sc.libs.extend(ArgumentsParser, Parser);

  ArgumentsParser.prototype.parse = function() {
    if (this.match("(")) {
      return this.parseArguments();
    }
    if (this.matchAny([ "{", "#" ])) {
      return this.parseBlockList();
    }
    return null;
  };

  ArgumentsParser.prototype.parseBlockList = function() {
    var list = this._args.list;
    var stamp;

    while ((stamp = this.matchAny([ "{", "#" ])) !== null) {
      var closed = false;

      if (stamp === "#") {
        this.lex();
        if (!this.match("{")) {
          return this.throwUnexpected(this.lookahead);
        }
        closed = true;
      }

      list.push(
        this.parseFunctionExpression({ blockList: true, closed: closed })
      );
    }

    return this._args;
  };

  ArgumentsParser.prototype.parseArguments = function() {
    this.expect("(");

    if (this.lookahead.type !== Token.Label) {
      this.parseArgList();
    } else {
      this.parseKeyArgList();
    }

    this.expect(")");

    if (this.matchAny([ "{", "#" ])) {
      return this.parseBlockList();
    }

    return this._args;
  };

  ArgumentsParser.prototype.parseArgList = function() {
    while (this.hasNextToken() && !this.match(")")) {
      if (this.match("*") || this.lookahead.type === Token.Label) {
        break;
      }
      this.parseArg();
      this.skipComma();
    }

    if (this.match("*")) {
      this.parseArgv();
      this.skipComma();
    }

    if (!this.match(")")) {
      this.parseKeyArgList();
    }
  };

  ArgumentsParser.prototype.parseArg = function() {
    var arg = this.parseExpressions();

    this._args.list.push(arg);
  };

  ArgumentsParser.prototype.parseArgv = function() {
    this.expect("*");

    var argv = this.parseExpressions();

    this._args.expand = argv;
  };

  ArgumentsParser.prototype.parseKeyArgList = function() {
    this._args.keywords = {};

    while (this.hasNextToken() && !this.match(")")) {
      this.parseKeyArg();
      this.skipComma();
    }
  };

  ArgumentsParser.prototype.parseKeyArg = function() {
    var token = this.lex();

    if (token.type !== Token.Label) {
      return this.throwUnexpected(token);
    }

    var key = token.value;
    var val = this.parseExpressions();

    this._args.keywords[key] = val;
  };

  ArgumentsParser.prototype.skipComma = function() {
    if (!this.match(")")) {
      this.expect(",");
    }
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

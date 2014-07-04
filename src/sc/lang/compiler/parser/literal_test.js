(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseLiteral", function() {
      sc.test.compile(this.title).each({
        "1 ": sc.test.OK,
        "1.0 ": sc.test.OK,
        "nil ": sc.test.OK,
        "true ": sc.test.OK,
        "false ": sc.test.OK,
        "'sym'": sc.test.OK,
        '"str"': sc.test.OK,
        "$a ": sc.test.OK,
        "a ": Message.UnexpectedIdentifier,
      });
      sc.test.parse(this.title).each({
        "1 ": {
          type: Syntax.Literal,
          value: "1",
          valueType: Token.IntegerLiteral,
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        "1.0 ": {
          type: Syntax.Literal,
          value: "1.0",
          valueType: Token.FloatLiteral,
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
        "nil ": {
          type: Syntax.Literal,
          value: "nil",
          valueType: Token.NilLiteral,
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
        "true ": {
          type: Syntax.Literal,
          value: "true",
          valueType: Token.TrueLiteral,
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
        "false ": {
          type: Syntax.Literal,
          value: "false",
          valueType: Token.FalseLiteral,
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
        "'sym'": {
          type: Syntax.Literal,
          value: "sym",
          valueType: Token.SymbolLiteral,
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
        '"str"': {
          type: Syntax.Literal,
          value: "str",
          valueType: Token.StringLiteral,
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
        "$a ": {
          type: Syntax.Literal,
          value: "a",
          valueType: Token.CharLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
      });
    });
  });
})();

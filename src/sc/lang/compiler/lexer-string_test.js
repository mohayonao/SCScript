(function() {
  "use strict";

  require("./lexer-string");

  var Token = sc.lang.compiler.Token;
  var lexString = sc.lang.compiler.lexString;

  describe("sc.lang.compiler.lexString", function() {
    var test = function(items) {
      expect(lexString(items[0], 1), items[0]).to.eql(items[1]);
    };
    it("Symbol", function() {
      [
        [ "(\\100)", { type: Token.SymbolLiteral, value: "100", length: 4, line: 0 } ],
        [ "(\\abc)", { type: Token.SymbolLiteral, value: "abc", length: 4, line: 0 } ],
        [ "(\\a c)", { type: Token.SymbolLiteral, value: "a", length: 2, line: 0 } ],
        [ "(\\", { type: Token.SymbolLiteral, value: "", length: 1, line: 0 } ],
      ].forEach(test);
    });
    it("QuotedSymbol", function() {
      [
        [ "('100')", { type: Token.SymbolLiteral, value: "100", length: 5, line: 0 } ],
        [ "('\\0')", { type: Token.SymbolLiteral, value: "0", length: 4, line: 0 } ],
        [ "('unclosed", { error: true, value: "'unclosed", length: 9, line: 0 } ],
        [ "('newline\n", { error: true, value: "'newline", length: 8, line: 0 } ],
      ].forEach(test);
    });
    it("String", function() {
      [
        [ '("100")', { type: Token.StringLiteral, value: "100", length: 5, line: 0 } ],
        [ '("1\n0")', { type: Token.StringLiteral, value: "1\\n0", length: 5, line: 1 } ],
        [ '("1\t0")', { type: Token.StringLiteral, value: "1\t0", length: 5, line: 0 } ],
        [ '("1\\n0")', { type: Token.StringLiteral, value: "1\\n0", length: 6, line: 0 } ],
        [ '("unclosed', { error: true, value: '"unclosed', length: 9, line: 0 } ],
      ].forEach(test);
    });
    it("Not a String", function() {
      [
        [ "(string)", undefined ],
      ].forEach(test);
    });
  });
})();

(function() {
  "use strict";

  require("./string");

  var Token = sc.lang.compiler.Token;
  var Lexer = sc.lang.compiler.Lexer;

  function test(items) {
    var lexer = new Lexer();
    expect(lexer.lexString(items[0], 1), items[0]).to.deep.equal(items[1]);
  }

  describe("sc.lang.compiler.Lexer", function() {
    describe("lexString", function() {
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
      it("Char", function() {
        [
          [ "($a)", { type: Token.CharLiteral, value: "a", length: 2, line: 0 } ],
          [ "($", { type: Token.CharLiteral, value: "", length: 1, line: 0 } ],
        ].forEach(test);
      });
      it("Not a String", function() {
        [
          [ "(string)", undefined ],
        ].forEach(test);
      });
    });
  });
})();

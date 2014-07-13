describe("sc.lang.compiler.Lexer", function() {
  "use strict";

  var Token = sc.lang.compiler.Token;
  var Lexer = sc.lang.compiler.Lexer;

  function test(items) {
    var lexer = new Lexer();
    expect(lexer.lexNumber(items[0], 1), items[0]).to.deep.equal(items[1]);
  }

  describe("lexNumber", function() {
    it("Decimal Number", function() {
      [
        [ "-100", { type: Token.IntegerLiteral, value: "100", length: 3 } ],
        [ "-1_000", { type: Token.IntegerLiteral, value: "1000", length: 5 } ],
        [ "-010", { type: Token.IntegerLiteral, value: "10", length: 3 } ],
        [ "-100.0", { type: Token.FloatLiteral, value: "100.0", length: 5 } ],
        [ "-10pi", { type: Token.FloatLiteral, value: "31.41592653589793", length: 4 } ],
        [ "-100.5pi", { type: Token.FloatLiteral, value: "315.7300616857742", length: 7 } ],
      ].forEach(test);
    });

    it("Hex Number", function() {
      [
        [ "-0xFF", { type: Token.IntegerLiteral, value: "255", length: 4 } ],
        [ "-0x010", { type: Token.IntegerLiteral, value: "16", length: 5 } ],
        [ "-0x0api", { type: Token.FloatLiteral, value: "31.41592653589793", length: 6 } ],
      ].forEach(test);
    });

    it("Nary Number", function() {
      [
        [ "-2r11000000", { type: Token.IntegerLiteral, value: "192", length: 10 } ],
        [ "-1000r1_000", { type: Token.IntegerLiteral, value: "1000000000", length: 10 } ],
        [ "-2r0.0011"   , { type: Token.FloatLiteral, value: "0.1875", length: 8 } ],
        [ "-2r10pi", { type: Token.FloatLiteral, value: "6.283185307179586", length: 6 } ],
        [ "-30r10pi", { type: Token.IntegerLiteral, value: "27768", length: 7 } ],
        [ "-2r666", { error: true, value: "2r666", length: 5 } ],
        [ "-2r0.666", { error: true, value: "2r0.666", length: 7 } ]
      ].forEach(test);
    });

    it("Accidental", function() {
      [
        [ "-10b0", { type: Token.FloatLiteral, value: "10.0", length: 4 } ],
        [ "-10b50", { type: Token.FloatLiteral, value: "9.95", length: 5 } ],
        [ "-10b1000", { type: Token.FloatLiteral, value: "9.501", length: 7 } ],
        [ "+10s0", { type: Token.FloatLiteral, value: "10.0", length: 4 } ],
        [ "+10s50", { type: Token.FloatLiteral, value: "10.05", length: 5 } ],
        [ "+10s1000", { type: Token.FloatLiteral, value: "10.499", length: 7 } ],
        [ "-10bb", { type: Token.FloatLiteral, value: "9.8", length: 4 } ],
        [ "-10bbbbb", { type: Token.FloatLiteral, value: "9.6", length: 7 } ],
        [ "+10ss", { type: Token.FloatLiteral, value: "10.2", length: 4 } ],
        [ "+10sssss", { type: Token.FloatLiteral, value: "10.4", length: 7 } ],
      ].forEach(test);
    });
  });

});

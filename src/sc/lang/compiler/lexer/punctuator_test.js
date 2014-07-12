(function() {
  "use strict";

  require("./punctuator");

  var Token = sc.lang.compiler.Token;
  var Lexer = sc.lang.compiler.Lexer;

  function test(items) {
    var lexer = new Lexer();
    expect(lexer.lexPunctuator(items[0], 1), items[0]).to.deep.equal(items[1]);
  }

  describe("sc.lang.compiler.Lexer", function() {
    describe("lexPunctuator", function() {
      it("Punctuator", function() {
        [
          [ "(+", { type: Token.Punctuator, value: "+", length: 1 } ],
          [ "(+-+", { type: Token.Punctuator, value: "+-+", length: 3 } ],
          [ "(.", { type: Token.Punctuator, value: ".", length: 1 } ],
          [ "(..", { type: Token.Punctuator, value: "..", length: 2 } ],
          [ "(...", { type: Token.Punctuator, value: "...", length: 3 } ],
          [ "([])", { type: Token.Punctuator, value: "[", length: 1 } ],
          [ "(Punctuator", { error: true, value: "P", length: 1 } ],
        ].forEach(test);
      });
    });
  });
})();

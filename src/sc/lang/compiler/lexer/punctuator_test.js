(function() {
  "use strict";

  require("./punctuator");

  var Token = sc.lang.compiler.Token;
  var lexPunctuator = sc.lang.compiler.lexPunctuator;

  describe("sc.lang.compiler.lexPunctuator", function() {
    var test = function(items) {
      expect(lexPunctuator(items[0], 1), items[0]).to.eql(items[1]);
    };
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
})();

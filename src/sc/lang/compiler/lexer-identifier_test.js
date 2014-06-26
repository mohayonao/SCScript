(function() {
  "use strict";

  require("./lexer-identifier");

  var Token = sc.lang.compiler.Token;
  var lexIdentifier = sc.lang.compiler.lexIdentifier;

  describe("sc.lang.compiler.lexIdentifier", function() {
    var test = function(items) {
      expect(lexIdentifier(items[0], 1), items[0]).to.eql(items[1]);
    };
    it("Identifier", function() {
      [
        [ "+abcdef", { type: Token.Identifier, value: "abcdef", length: 6 } ],
        [ "+Object", { type: Token.Identifier, value: "Object", length: 6 } ],
        [ "+infinity", { type: Token.Identifier, value: "infinity", length: 8 } ],
        [ "+pie", { type: Token.Identifier, value: "pie", length: 3 } ],
        [ "+_", { type: Token.Identifier, value: "_", length: 1 } ],
        [ "+__", { type: Token.Identifier, value: "_", length: 1 } ],
      ].forEach(test);
    });
    it("Keyword", function() {
      [
        [ "+var", { type: Token.Keyword, value: "var", length: 3 } ],
        [ "+arg", { type: Token.Keyword, value: "arg", length: 3 } ],
        [ "+this", { type: Token.Keyword, value: "this", length: 4 } ],
      ].forEach(test);
    });
    it("Literal", function() {
      [
        [ "+inf", { type: Token.FloatLiteral, value: "Infinity", length: 3 } ],
        [ "+pi", { type: Token.FloatLiteral, value: String(Math.PI), length: 2 } ],
        [ "+nil", { type: Token.NilLiteral, value: "nil", length: 3 } ],
        [ "+true", { type: Token.TrueLiteral, value: "true", length: 4 } ],
        [ "+false", { type: Token.FalseLiteral, value: "false", length: 5 } ],
      ].forEach(test);
    });
    it("Label", function() {
      [
        [ "+freq:440", { type: Token.Label, value: "freq", length: 5 } ],
      ].forEach(test);
    });
  });
})();

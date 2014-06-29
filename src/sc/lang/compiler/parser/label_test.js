(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseLabelAsSymbol", function() {
      sc.test.compile(this.title).each({
        "a:": sc.test.OK,
        "a :": Message.UnexpectedIdentifier,
        "1:": Message.UnexpectedNumber,
      });
      sc.test.parse(this.title).each({
        "a:": {
          type: Syntax.Literal,
          value: "a",
          valueType: Token.SymbolLiteral,
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 },
          }
        }
      });
    });
  });
})();

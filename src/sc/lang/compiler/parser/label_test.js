describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseLabelAsSymbol", function() {
    sc.test.compile(this.title).each({
      "a:": sc.test.OK,
      "a :": strlib.format(Message.UnexpectedIdentifier),
      "1:": strlib.format(Message.UnexpectedNumber),
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

(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseThisExpression", function() {
      sc.test.compile(this.title).each({
        "this ": sc.test.OK,
        "var ": strlib.format(Message.UnexpectedKeyword, "var"),
        "this_ ": strlib.format(Message.UnexpectedIdentifier),
      });
      sc.test.parse(this.title).each({
        "this ": {
          type: Syntax.ThisExpression,
          name: "this",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        }
      });
    });
  });
})();

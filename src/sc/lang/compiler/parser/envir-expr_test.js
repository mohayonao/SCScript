(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseEnvironmentExpression", function() {
      sc.test.compile(this.title).each({
        "~a": sc.test.OK,
        "~1234": strlib.format(Message.UnexpectedNumber),
        "~_": strlib.format(Message.UnexpectedIdentifier),
        "~Object": strlib.format(Message.UnexpectedIdentifier),
      });
      sc.test.parse(this.title).each({
        "~a": {
          type: Syntax.EnvironmentExpression,
          id: {
            type: Syntax.Identifier,
            name: "a",
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          },
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        }
      });
    });
  });
})();

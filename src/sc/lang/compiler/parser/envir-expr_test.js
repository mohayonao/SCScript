(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseEnvironmentExpression", function() {
      sc.test.compile(this.title).each({
        "~a": sc.test.OK,
        "~1234": Message.UnexpectedNumber,
        "~_": Message.UnexpectedIdentifier,
        "~Object": Message.UnexpectedIdentifier,
      });
      sc.test.parse(this.title).each({
        "~a": {
          type: Syntax.EnvironmentExpresion,
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

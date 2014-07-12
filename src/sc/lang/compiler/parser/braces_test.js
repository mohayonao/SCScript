describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseBraces", function() {
    sc.test.compile(this.title).each({
      "{}": sc.test.OK,
      "{: a, a <- 3 }": sc.test.OK,
      "[]": strlib.format(Message.UnexpectedToken, "["),
    });

    sc.test.parse(this.title).each({
      "{}": {
        type: Syntax.FunctionExpression,
        body: [],
        range: [ 0, 2 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 2 },
        }
      }
    });
  });

});

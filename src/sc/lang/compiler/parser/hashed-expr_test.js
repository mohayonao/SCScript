describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseHashedExpression", function() {
    sc.test.compile(this.title).each({
      "#[]": sc.test.OK,
      "#{}": sc.test.OK,
      "#()": strlib.format(Message.UnexpectedToken, "#"),
    });

    sc.test.parse(this.title).each({
      "#[]": {
        type: Syntax.ListExpression,
        elements: [],
        immutable: true,
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 3 },
        }
      },
      "#{}": {
        type: Syntax.FunctionExpression,
        body: [],
        closed: true,
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 3 },
        }
      }
    });
  });
});

(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("sc.lang.compiler.Parser", function() {
    describe("parseIdentifier", function() {
      sc.test.compile(this.title).each({
        "value ": sc.test.OK,
        "1234 ": strlib.format(Message.UnexpectedNumber),
        "_ ": strlib.format(Message.UnexpectedIdentifier),
      });
      sc.test.parse(this.title).each({
        "value ": {
          type: Syntax.Identifier,
          name: "value",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        }
      });
    });
    describe("parsePrimaryIdentifier", function() {
      sc.test.compile(this.title).each({
        "value ": sc.test.OK,
        "_ ": sc.test.OK,
      });
      sc.test.parse(this.title).each({
        "value ": {
          type: Syntax.Identifier,
          name: "value",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
        "_ ": {
          type: Syntax.Identifier,
          name: "$_0",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        }
      });
    });
    describe("parseIdentifier(variable:true)", function() {
      sc.test.compile("parseIdentifier", { variable: true }).each({
        "value ": sc.test.OK,
        "_ ": strlib.format(Message.UnexpectedIdentifier),
        "Object ": strlib.format(Message.UnexpectedIdentifier),
      });
      sc.test.parse("parseIdentifier", { variable: true }).each({
        "value ": {
          type: Syntax.Identifier,
          name: "value",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        }
      });
    });
  });
})();

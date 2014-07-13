describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseBlockExpression", function() {
    sc.test.compile(this.title).each({
      "(var a = 10;)": sc.test.OK,
      "var a = 10;": strlib.format(Message.UnexpectedKeyword, "var"),
    });

    sc.test.parse(this.title).each({
      "(var a = 10;)": {
        type: Syntax.BlockExpression,
        body: [
          {
            type: Syntax.VariableDeclaration,
            kind: "var",
            declarations: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 6 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 9, 11 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 11 }
                  }
                },
                range: [ 5, 11 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 11 }
                }
              }
            ],
            range: [ 1, 11 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 11 }
            },
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 13 }
        }
      }
    });
  });

});

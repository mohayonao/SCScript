describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseAssignmentExpression", function() {
    sc.test.compile(this.title).each({
      "a = 10": sc.test.OK,
      "a.b = 10": sc.test.OK,
      "a[0] = 10": sc.test.OK,
      "#a, b = c": sc.test.OK,
      "#a ... b = c": sc.test.OK,
      "#[]": sc.test.OK,
      "[ 0 ] = 10": strlib.format(Message.InvalidLHSInAssignment),
    });

    sc.test.parse(this.title).each({
      "a = 10": {
        type: Syntax.AssignmentExpression,
        operator: "=",
        left: {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        right: {
          type: Syntax.Literal,
          value: "10",
          valueType: Token.IntegerLiteral,
          range: [ 4, 6 ],
          loc: {
            start: { line: 1, column: 4 },
            end: { line: 1, column: 6 }
          }
        },
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 }
        }
      },
      "a.b = 10": { // a.b_(10)
        type: Syntax.CallExpression,
        stamp: "=",
        callee: {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        method: {
          type: Syntax.Identifier,
          name: "b_",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end: { line: 1, column: 3 }
          }
        },
        args: {
          list: [
            {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 6, 8 ],
              loc: {
                start: { line: 1, column: 6 },
                end: { line: 1, column: 8 }
              }
            }
          ]
        },
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 8 }
        }
      },
      "a[0] = 10": { // a.put(0, 10)
        type: Syntax.CallExpression,
        stamp: "[",
        callee: {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        method: {
          type: Syntax.Identifier,
          name: "put",
          range: [ 1, 1 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 1 }
          }
        },
        args: {
          list: [
            {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 }
              }
            },
            {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 7, 9 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 9 }
              }
            }
          ]
        },
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      },
      "a[..] = 10": { // a.putSeries(nil, nil, nil, 10)
        type: Syntax.CallExpression,
        stamp: "[",
        callee: {
          type: Syntax.Identifier,
          name: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        method: {
          type: Syntax.Identifier,
          name: "putSeries",
          range: [ 1, 1 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 1 }
          }
        },
        args: {
          list: [
            null,
            null,
            null,
            {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 8, 10 ],
              loc: {
                start: { line: 1, column: 8 },
                end: { line: 1, column: 10 }
              }
            }
          ]
        },
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 10 }
        }
      },
      "#a, b = c": {
        type: Syntax.AssignmentExpression,
        operator: "=",
        left: [
          {
            type: Syntax.Identifier,
            name: "a",
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          },
          {
            type: Syntax.Identifier,
            name: "b",
            range: [ 4, 5 ],
            loc: {
              start: { line: 1, column: 4 },
              end: { line: 1, column: 5 }
            }
          }
        ],
        right: {
          type: Syntax.Identifier,
          name: "c",
          range: [ 8, 9 ],
          loc: {
            start: { line: 1, column: 8 },
            end: { line: 1, column: 9 }
          }
        },
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      },
      "#[]": {
        type: Syntax.ListExpression,
        immutable: true,
        elements: [],
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 3 }
        }
      },
      "#a ... b = c": {
        type: Syntax.AssignmentExpression,
        operator: "=",
        left: [
          {
            type: Syntax.Identifier,
            name: "a",
            range: [ 1, 2 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 }
            }
          }
        ],
        remain: {
          type: Syntax.Identifier,
          name: "b",
          range: [ 7, 8 ],
          loc: {
            start: { line: 1, column: 7 },
            end: { line: 1, column: 8 }
          }
        },
        right: {
          type: Syntax.Identifier,
          name: "c",
          range: [ 11, 12 ],
          loc: {
            start: { line: 1, column: 11 },
            end: { line: 1, column: 12 }
          }
        },
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 12 }
        }
      }
    });

  });
});

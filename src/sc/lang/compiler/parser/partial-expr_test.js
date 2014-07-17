describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("parsePartialExpression", function() {
    sc.test.compile(this.title).each({
      "'_'": sc.test.OK,
      "_.neg": sc.test.OK,    // { |a| a.neg }
      "[ _, _ ]": sc.test.OK, // { |a, b| [a, b] }
    });

    sc.test.parse(this.title).each({
      "'_'": {
        type: Syntax.Literal,
        value: "_",
        valueType: Token.SymbolLiteral,
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 3 }
        }
      },
      "_.neg": {
        type: Syntax.FunctionExpression,
        partial: true,
        args: {
          list: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "$_0",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 1 }
                }
              },
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 }
              }
            }
          ]
        },
        body: [
          {
            type: Syntax.CallExpression,
            stamp: ".",
            callee: {
              type: Syntax.Identifier,
              name: "$_0",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
              range: [ 2, 5 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 5 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 }
            }
          }
        ],
        range: [ 0, 5 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 5 }
        }
      },
      "[ _, _ ]": {
        type: Syntax.FunctionExpression,
        partial: true,
        args: {
          list: [
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "$_0",
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 3 }
                }
              },
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 }
              }
            },
            {
              type: Syntax.VariableDeclarator,
              id: {
                type: Syntax.Identifier,
                name: "$_1",
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              },
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 6 }
              }
            }
          ]
        },
        body: [
          {
            type: Syntax.ListExpression,
            elements: [
              {
                type: Syntax.Identifier,
                name: "$_0",
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 3 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "$_1",
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              }
            ],
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 8 }
        }
      }
    });
  });
});

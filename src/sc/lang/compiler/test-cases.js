(function() {
  "use strict";

  require("./compiler");

  var Token  = sc.lang.compiler.Token;
  var Syntax = sc.lang.compiler.Syntax;

  var cases = {
    "": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
      }
    },
    "    \n\t": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
      }
    },
    "// single line comment\n": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
      }
    },
    "/*\n/* / * */\n*/": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
      }
    },
    "-10pi": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Float(-31.41592653589793);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.Literal,
            value: "-31.41592653589793",
            valueType: Token.FloatLiteral,
          }
        ],
      }
    },
    "-a": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('neg');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: ".",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "-a.abs": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('neg').$('abs');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.CallExpression,
              callee: {
                type: Syntax.Identifier,
                name: "a",
              },
              method: {
                type: Syntax.Identifier,
                name: "neg",
              },
              args: {
                list: []
              },
              stamp: ".",
            },
            method: {
              type: Syntax.Identifier,
              name: "abs",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "nil ": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Nil();",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.Literal,
            value: "nil",
            valueType: Token.NilLiteral,
          }
        ],
      }
    },
    "true && false": {
      compiled: [
        "SCScript(function($) {",
        "  return $.True().$('&&', [ $.False() ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "&&",
            left: {
              type: Syntax.Literal,
              value: "true",
              valueType: Token.TrueLiteral,
            },
            right: {
              type: Syntax.Literal,
              value: "false",
              valueType: Token.FalseLiteral,
            },
          }
        ],
      }
    },
    "`$a": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Ref($.Char('a'));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.UnaryExpression,
            operator: "`",
            arg: {
              type: Syntax.Literal,
              value: "a",
              valueType: Token.CharLiteral,
            },
          }
        ],
      }
    },
    "a -.f b": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('-', [ $.This().$('b'), $.Symbol('f') ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "-",
            adverb: {
              type: Syntax.Literal,
              value: "f",
              valueType: Token.SymbolLiteral,
            },
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.Identifier,
              name: "b",
            },
          },
        ],
      }
    },
    "a /.1 b": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('/', [ $.This().$('b'), $.Integer(1) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "/",
            adverb: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
            },
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.Identifier,
              name: "b",
            },
          },
        ],
      }
    },
    "a max:.1 b": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('max', [ $.This().$('b'), $.Integer(1) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "max",
            adverb: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
            },
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.Identifier,
              name: "b",
            },
          },
        ],
      }
    },
    "[ 0, 0.5 ]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Array([",
        "    $.Integer(0),",
        "    $.Float(0.5),",
        "  ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ListExpression,
            elements: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "0.5",
                valueType: Token.FloatLiteral,
              },
            ],
          }
        ],
      }
    },
    "#[ 0, 0.5 ]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Array([",
        "    $.Integer(0),",
        "    $.Float(0.5),",
        "  ], true);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ListExpression,
            immutable: true,
            elements: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "0.5",
                valueType: Token.FloatLiteral,
              },
            ],
          }
        ],
      }
    },
    "#[ [] ]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Array([",
        "    $.Array([], true),",
        "  ], true);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ListExpression,
            immutable: true,
            elements: [
              {
                type: Syntax.ListExpression,
                immutable: true,
                elements: [
                ],
              },
            ],
          }
        ],
      }
    },
    "[ a: 1, 2: 3 ]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Array([",
        "    $.Symbol('a'),",
        "    $.Integer(1),",
        "    $.Integer(2),",
        "    $.Integer(3),",
        "  ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ListExpression,
            elements: [
              {
                type: Syntax.Literal,
                value: "a",
                valueType: Token.SymbolLiteral,
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
              }
            ],
          }
        ],
      }
    },
    "a = 2pi": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Float(6.283185307179586), $.This().$('a_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.Literal,
              value: "6.283185307179586",
              valueType: Token.FloatLiteral,
            },
          }
        ],
      }
    },
    "#a, b = c": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0, _ref1;",
        "  return (_ref0 = $.This().$('c'),",
        "    (_ref1 = _ref0.$('at', [ $.Integer(0) ]), $.This().$('a_', [ _ref1 ]), _ref1),",
        "    (_ref1 = _ref0.$('at', [ $.Integer(1) ]), $.This().$('b_', [ _ref1 ]), _ref1),",
        "  _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a",
              },
              {
                type: Syntax.Identifier,
                name: "b",
              }
            ],
            right: {
              type: Syntax.Identifier,
              name: "c",
            },
          }
        ],
      }
    },
    "#a, b ... c = d": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0, _ref1;",
        "  return (_ref0 = $.This().$('d'),",
        "    (_ref1 = _ref0.$('at', [ $.Integer(0) ]), $.This().$('a_', [ _ref1 ]), _ref1),",
        "    (_ref1 = _ref0.$('at', [ $.Integer(1) ]), $.This().$('b_', [ _ref1 ]), _ref1),",
        "    (_ref1 = _ref0.$('copyToEnd', [ $.Integer(2) ]), $.This().$('c_', [ _ref1 ]), _ref1),",
        "  _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a",
              },
              {
                type: Syntax.Identifier,
                name: "b",
              }
            ],
            remain: {
              type: Syntax.Identifier,
              name: "c",
            },
            right: {
              type: Syntax.Identifier,
              name: "d",
            },
          }
        ],
      }
    },
    "#a, b = #c, d = [ 0, 1 ]": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0, _ref1, _ref2;",
        "  return (_ref0 = (_ref1 = $.Array([",
        "    $.Integer(0),",
        "    $.Integer(1),",
        "  ]),",
        "    (_ref2 = _ref1.$('at', [ $.Integer(0) ]), $.This().$('c_', [ _ref2 ]), _ref2),",
        "    (_ref2 = _ref1.$('at', [ $.Integer(1) ]), $.This().$('d_', [ _ref2 ]), _ref2),",
        "  _ref1),",
        "    (_ref1 = _ref0.$('at', [ $.Integer(0) ]), $.This().$('a_', [ _ref1 ]), _ref1),",
        "    (_ref1 = _ref0.$('at', [ $.Integer(1) ]), $.This().$('b_', [ _ref1 ]), _ref1),",
        "  _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a",
              },
              {
                type: Syntax.Identifier,
                name: "b",
              }
            ],
            right: {
              type: Syntax.AssignmentExpression,
              operator: "=",
              left: [
                {
                  type: Syntax.Identifier,
                  name: "c",
                },
                {
                  type: Syntax.Identifier,
                  name: "d",
                }
              ],
              right: {
                type: Syntax.ListExpression,
                elements: [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  }
                ],
              },
            },
          }
        ],
      }
    },
    "1.neg": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(1).$('neg');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
            },
            args: {
              list: []
            },
          },
        ],
      }
    },
    "a.b.c = 1": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Integer(1), $.This().$('a').$('b').$('c_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.CallExpression,
              callee: {
                type: Syntax.Identifier,
                name: "a",
              },
              method: {
                type: Syntax.Identifier,
                name: "b",
              },
              args: {
                list: []
              },
            },
            stamp: "=",
            method: {
              type: Syntax.Identifier,
              name: "c_",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "a[0]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[]', [ $.Integer(0) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      },
    },
    "a[..10]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ null, null, $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          },
        ],
      }
    },
    "a[2..]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ $.Integer(2), null, null ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                null,
                null,
              ]
            },
          }
        ],
      }
    },
    "a[2..10]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ $.Integer(2), null, $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[2, 4..]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ $.Integer(2), $.Integer(4), null ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                null,
              ]
            },
          }
        ],
      }
    },
    "a[2, 4..10]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ $.Integer(2), $.Integer(4), $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[..]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ null, null, null ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                null,
                null,
                null,
              ]
            },
          },
        ],
      }
    },
    "a[0] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[]_', [ $.Integer(0), $.Integer(1) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[]_",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[..10] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]_', [ " +
          "null, null, $.Integer(10), $.Integer(1)" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[2..] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]_', [ " +
          "$.Integer(2), null, null, $.Integer(1)" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[2..10] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]_', [ " +
          "$.Integer(2), null, $.Integer(10), $.Integer(1)" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[2, 4..] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]_', [ " +
          "$.Integer(2), $.Integer(4), null, $.Integer(1)" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                null,
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[2, 4..10] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]_', [ " +
          "$.Integer(2), $.Integer(4), $.Integer(10), $.Integer(1)" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[..] = 1": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]_', [ " +
          "null, null, null, $.Integer(1)" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
            },
            args: {
              list: [
                null,
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "a[0;1,2;3..4;5]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('[..]', [ " +
          "($.Integer(0), $.Integer(1)), " +
          "($.Integer(2), $.Integer(3)), " +
          "($.Integer(4), $.Integer(5))" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  },
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                  },
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "4",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                  },
                ]
              ]
            },
          }
        ],
      }
    },
    "a[b[c=0;1]=0;1]": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return $.This().$('a').$('[]', [ " +
          "($.This().$('b').$('[]_', [ (" +
          "(_ref0 = $.Integer(0), $.This().$('c_', [ _ref0 ]), _ref0), " +
          "$.Integer(1)), $.Integer(0) ]), $.Integer(1))" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.CallExpression,
                    stamp: "[",
                    callee: {
                      type: Syntax.Identifier,
                      name: "b",
                    },
                    method: {
                      type: Syntax.Identifier,
                      name: "[]_",
                    },
                    args: {
                      list: [
                        [
                          {
                            type: Syntax.AssignmentExpression,
                            operator: "=",
                            left: {
                              type: Syntax.Identifier,
                              name: "c",
                            },
                            right: {
                              type: Syntax.Literal,
                              value: "0",
                              valueType: Token.IntegerLiteral,
                            },
                          },
                          {
                            type: Syntax.Literal,
                            value: "1",
                            valueType: Token.IntegerLiteral,
                          }
                        ],
                        {
                          type: Syntax.Literal,
                          value: "0",
                          valueType: Token.IntegerLiteral,
                        }
                      ]
                    },
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  }
                ]
              ]
            },
          }
        ],
      }
    },
    "(..10)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(0).$('series', [ null, $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "series",
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "(2..10)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(2).$('series', [ null, $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "series",
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "(2, 4..10)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(2).$('series', [ $.Integer(4), $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "series",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "(0;1, 2;3..4;5)": {
      compiled: [
        "SCScript(function($) {",
        "  return ($.Integer(0), $.Integer(1)).$('series', [ " +
          "($.Integer(2), $.Integer(3)), ($.Integer(4), $.Integer(5))" +
          " ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
              },
            ],
            method: {
              type: Syntax.Identifier,
              name: "series",
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                  },
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "4",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                  },
                ],
              ]
            },
          }
        ],
      }
    },
    "(:..)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(0).$('seriesIter', [ null, null ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
            },
            args: {
              list: [
                null,
                null,
              ]
            },
          }
        ],
      }
    },
    "(:..10)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(0).$('seriesIter', [ null, $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "(:2..)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(2).$('seriesIter', [ null, null ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
            },
            args: {
              list: [
                null,
                null,
              ]
            },
          }
        ],
      }
    },
    "(:2..10)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(2).$('seriesIter', [ null, $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "(:2, 4..)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(2).$('seriesIter', [ $.Integer(4), null ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                null,
              ]
            },
          }
        ],
      }
    },
    "(:2, 4..10)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(2).$('seriesIter', [ $.Integer(4), $.Integer(10) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                },
              ]
            },
          }
        ],
      }
    },
    "5 === 5.0": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Boolean($.Integer(5) === $.Float(5.0));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "===",
            left: {
              type: Syntax.Literal,
              value: "5",
              valueType: Token.IntegerLiteral,
            },
            right: {
              type: Syntax.Literal,
              value: "5.0",
              valueType: Token.FloatLiteral,
            },
          }
        ],
      }
    },
    "5 !== 5.0": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Boolean($.Integer(5) !== $.Float(5.0));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "!==",
            left: {
              type: Syntax.Literal,
              value: "5",
              valueType: Token.IntegerLiteral,
            },
            right: {
              type: Syntax.Literal,
              value: "5.0",
              valueType: Token.FloatLiteral,
            },
          }
        ],
      }
    },
    "5 == 5.0": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(5).$('==', [ $.Float(5.0) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "==",
            left: {
              type: Syntax.Literal,
              value: "5",
              valueType: Token.IntegerLiteral,
            },
            right: {
              type: Syntax.Literal,
              value: "5.0",
              valueType: Token.FloatLiteral,
            },
          }
        ],
      }
    },
    "{ arg a, b, c=3; nil }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $a, $b, $c;",
        "    return [",
        "      function(_arg0, _arg1, _arg2) {",
        "        $a = _arg0; $b = _arg1; $c = _arg2;",
        "        return $.Nil();",
        "      },",
        "      function() {",
        "        $a = $b = $c = null;",
        "      }",
        "    ];",
        "  }, 'a; b; c=3');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c",
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                  },
                }
              ]
            },
            body: [
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral,
              }
            ],
          }
        ],
      }
    },
    "{ arg a, b, c ... d; nil }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $a, $b, $c, $d;",
        "    return [",
        "      function(_arg0, _arg1, _arg2, _arg3) {",
        "        $a = _arg0; $b = _arg1; $c = _arg2; $d = _arg3;",
        "        return $.Nil();",
        "      },",
        "      function() {",
        "        $a = $b = $c = $d = null;",
        "      }",
        "    ];",
        "  }, 'a; b; c; *d');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c",
                  },
                }
              ],
              remain: {
                type: Syntax.Identifier,
                name: "d",
              }
            },
            body: [
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral,
              }
            ],
          }
        ],
      }
    },
    "{ arg ...args; nil }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $args;",
        "    return [",
        "      function(_arg0) {",
        "        $args = _arg0;",
        "        return $.Nil();",
        "      },",
        "      function() {",
        "        $args = null;",
        "      }",
        "    ];",
        "  }, '*args');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [],
              remain: {
                type: Syntax.Identifier,
                name: "args",
              }
            },
            body: [
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral,
              }
            ],
          }
        ],
      }
    },
    "{ |x = 1| x }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $x;",
        "    return [",
        "      function(_arg0) {",
        "        $x = _arg0;",
        "        return $x;",
        "      },",
        "      function() {",
        "        $x = null;",
        "      }",
        "    ];",
        "  }, 'x=1');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "x",
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  },
                }
              ]
            },
            body: [
              {
                type: "Identifier",
                name: "x",
              }
            ],
          }
        ],
      }
    },
    "{ |a=0 b=1| nil }": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  },
                }
              ]
            },
            body: [
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral,
              }
            ],
          }
        ],
      }
    },
    "{ a; b; c }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        $.This().$('a');",
        "        $.This().$('b');",
        "        return $.This().$('c');",
        "      },",
        "      $.NOP",
        "    ];",
        "  });",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.Identifier,
                name: "a",
              },
              {
                type: Syntax.Identifier,
                name: "b",
              },
              {
                type: Syntax.Identifier,
                name: "c",
              }
            ],
          }
        ],
      }
    },
    "{|x=1| var a = x * x; a * a; }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $x, $a;",
        "    return [",
        "      function(_arg0) {",
        "        $x = _arg0;",
        "        $a = $x.$('*', [ $x ]);",
        "        return $a.$('*', [ $a ]);",
        "      },",
        "      function() {",
        "        $a = $x = null;",
        "      }",
        "    ];",
        "  }, 'x=1');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "x",
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  },
                }
              ]
            },
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
                    },
                    init: {
                      type: Syntax.BinaryExpression,
                      operator: "*",
                      left: {
                        type: Syntax.Identifier,
                        name: "x",
                      },
                      right: {
                        type: Syntax.Identifier,
                        name: "x",
                      },
                    },
                  }
                ],
              },
              {
                type: Syntax.BinaryExpression,
                operator: "*",
                left: {
                  type: Syntax.Identifier,
                  name: "a",
                },
                right: {
                  type: Syntax.Identifier,
                  name: "a",
                },
              }
            ],
          }
        ],
      }
    },
    "a = #{}": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Function(function() {",
        "    return [];",
        "  }, '', true), $.This().$('a_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.FunctionExpression,
              body: [],
              closed: true,
            },
          }
        ],
      }
    },
    "{|a=#[ nil, true, false ], b= #[ inf, -inf ], c=#[ 0, 0.0, 2pi, $a, \\sym ]| nil }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $a, $b, $c;",
        "    return [",
        "      function(_arg0, _arg1, _arg2) {",
        "        $a = _arg0; $b = _arg1; $c = _arg2;",
        "        return $.Nil();",
        "      },",
        "      function() {",
        "        $a = $b = $c = null;",
        "      }",
        "    ];",
        "  }, 'a=[ nil, true, false ]; " +
          "b=[ inf, -inf ]; c=[ 0, 0.0, 6.283185307179586, $a, \\sym ]');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral,
              }
            ],
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "nil",
                        valueType: Token.NilLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "true",
                        valueType: "True",
                      },
                      {
                        type: Syntax.Literal,
                        value: "false",
                        valueType: "False",
                      }
                    ],
                    immutable: true,
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "Infinity",
                        valueType: "Float",
                      },
                      {
                        type: Syntax.Literal,
                        value: "-Infinity",
                        valueType: Token.FloatLiteral,
                      }
                    ],
                    immutable: true,
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c",
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "0",
                        valueType: Token.IntegerLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "0.0",
                        valueType: Token.FloatLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "6.283185307179586",
                        valueType: Token.FloatLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "a",
                        valueType: Token.CharLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "sym",
                        valueType: Token.SymbolLiteral,
                      }
                    ],
                    immutable: true,
                  },
                }
              ]
            },
          }
        ],
      }
    },
    "var level=0, slope=1, curve=1;": {
      compiled: [
        "SCScript(function($) {",
        "  var $level, $slope, $curve;",
        "  return $level = $.Integer(0), $slope = $.Integer(1), $curve = $.Integer(1);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.VariableDeclaration,
            kind: "var",
            declarations: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "level",
                },
                init: {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                },
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "slope",
                },
                init: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "curve",
                },
                init: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
              }
            ],
          }
        ],
      }
    },
    "var a, b; a=nil;": {
      compiled: [
        "SCScript(function($) {",
        "  var $a, $b;",
        "  $a = $.Nil(), $b = $.Nil();",
        "  return $a = $.Nil();",
        "});",
      ],
      ast: {
        type: Syntax.Program,
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
                },
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                },
              },
            ],
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.Literal,
              value: "nil",
              valueType: Token.NilLiteral,
            },
          },
        ],
      },
    },
    "var a; #a = [];": {
      compiled: [
        "SCScript(function($) {",
        "  var $a, _ref0;",
        "  $a = $.Nil();",
        "  return (_ref0 = $.Array([]),",
        "    $a = _ref0.$('at', [ $.Integer(0) ]),",
        "  _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
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
                },
              },
            ],
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a",
              },
            ],
            right: {
              type: Syntax.ListExpression,
              elements: [],
            },
          },
        ],
      }
    },
    "{ |x, y| var a; a = x + y; x.wait; a }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $x, $y, $a;",
        "    return [",
        "      function(_arg0, _arg1) {",
        "        $x = _arg0; $y = _arg1;",
        "        $a = $.Nil();",
        "        $a = $x.$('+', [ $y ]);",
        "        return $x.$('wait');",
        "      },",
        "      function() {",
        "        return $a;",
        "      },",
        "      function() {",
        "        $a = $x = $y = null;",
        "      }",
        "    ];",
        "  }, 'x; y');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "x",
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "y",
                  },
                }
              ]
            },
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
                    },
                  }
                ],
              },
              {
                type: Syntax.AssignmentExpression,
                operator: "=",
                left: {
                  type: Syntax.Identifier,
                  name: "a",
                },
                right: {
                  type: Syntax.BinaryExpression,
                  operator: "+",
                  left: {
                    type: Syntax.Identifier,
                    name: "x",
                  },
                  right: {
                    type: Syntax.Identifier,
                    name: "y",
                  },
                },
              },
              {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.Identifier,
                  name: "x",
                },
                method: {
                  type: Syntax.Identifier,
                  name: "wait",
                },
                args: {
                  list: []
                },
              },
              {
                type: Syntax.Identifier,
                name: "a",
              }
            ],
          }
        ],
      }
    },
    "{ if (true) { 1.wait }; 0 }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.True().$('if', [ $.Function(function() {",
        "          return [",
        "            function() {",
        "              return $.Integer(1).$('wait');",
        "            },",
        "            $.NOP",
        "          ];",
        "        }) ]);",
        "      },",
        "      function() {",
        "        return $.Integer(0);",
        "      },",
        "      $.NOP",
        "    ];",
        "  });",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                stamp: "(",
                callee: {
                  type: Syntax.Literal,
                  value: "true",
                  valueType: Token.TrueLiteral,
                },
                method: {
                  type: Syntax.Identifier,
                  name: "if",
                },
                args: {
                  list: [
                    {
                      type: Syntax.FunctionExpression,
                      body: [
                        {
                          type: Syntax.CallExpression,
                          callee: {
                            type: Syntax.Literal,
                            value: "1",
                            valueType: Token.IntegerLiteral,
                          },
                          method: {
                            type: Syntax.Identifier,
                            name: "wait",
                          },
                          args: {
                            list: []
                          },
                        }
                      ],
                      blockList: true,
                    }
                  ]
                },
              },
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              }
            ],
          }
        ],
      }
    },
    "{ wait(1); 0 }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Integer(1).$('wait');",
        "      },",
        "      function() {",
        "        return $.Integer(0);",
        "      },",
        "      $.NOP",
        "    ];",
        "  });",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                stamp: "(",
                callee: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
                method: {
                  type: Syntax.Identifier,
                  name: "wait",
                },
                args: {
                  list: []
                },
              },
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              }
            ],
          }
        ],
      }
    },
    "max(0, 1, 2, *a, a: 5, b: 6)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Integer(0), _ref0.$('max', [",
        "    $.Integer(1),",
        "    $.Integer(2),",
        "  ].concat($.This().$('a').$('asArray')._, { a: $.Integer(5), b: $.Integer(6) })));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
              },
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                },
                b: {
                  type: Syntax.Literal,
                  value: "6",
                  valueType: Token.IntegerLiteral,
                }
              }
            },
          }
        ],
      }
    },
    "max(1, 2, *a)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Integer(1), _ref0.$('max', [",
        "    $.Integer(2),",
        "  ].concat($.This().$('a').$('asArray')._)));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
              }
            },
          }
        ],
      }
    },
    "max(1, 2, a: 5)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(1).$('max', [ $.Integer(2), { a: $.Integer(5) } ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                }
              ],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                }
              }
            },
          }
        ],
      }
    },
    "max(0, *a, a: 3)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Integer(0), _ref0.$('max', [" +
          "].concat($.This().$('a').$('asArray')._, { a: $.Integer(3) })));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [],
              expand: {
                type: Syntax.Identifier,
                name: "a",
              },
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                }
              }
            },
          }
        ],
      }
    },
    "max(0, *a)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Integer(0), _ref0.$('max', [" +
          "].concat($.This().$('a').$('asArray')._)));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [],
              expand: {
                type: Syntax.Identifier,
                name: "a",
              }
            },
          }
        ],
      }
    },
    "max(0, a: 1)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(0).$('max', [ { a: $.Integer(1) } ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                }
              }
            },
          }
        ],
      }
    },
    "max(*a, a: 2)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('max', [ { a: $.Integer(2) } ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                }
              }
            },
          }
        ],
      }
    },
    "max(*a)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('max');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "max(0; 1, 2; 3, 4; 5, a: 6; 7, b: 8; 9)": {
      compiled: [
        "SCScript(function($) {",
        "  return ($.Integer(0), $.Integer(1)).$('max', [ " +
          "($.Integer(2), $.Integer(3)), " +
          "($.Integer(4), $.Integer(5)), " +
          "{ a: ($.Integer(6), $.Integer(7)), b: ($.Integer(8), $.Integer(9)) } ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
              }
            ],
            method: {
              type: Syntax.Identifier,
              name: "max",
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                  }
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "4",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                  }
                ]
              ],
              keywords: {
                a: [
                  {
                    type: Syntax.Literal,
                    value: "6",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "7",
                    valueType: Token.IntegerLiteral,
                  }
                ],
                b: [
                  {
                    type: Syntax.Literal,
                    value: "8",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "9",
                    valueType: Token.IntegerLiteral,
                  }
                ]
              }
            },
          }
        ],
      }
    },
    "a = (1; 2; 3)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = " +
          "($.Integer(1), $.Integer(2), $.Integer(3)), " +
          "$.This().$('a_', [ _ref0 ]), " +
          "_ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
              },
              {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
              }
            ],
          }
        ],
      }
    },
    "a.midicps.min(220)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('midicps').$('min', [ $.Integer(220) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.CallExpression,
              callee: {
                type: Syntax.Identifier,
                name: "a",
              },
              method: {
                type: Syntax.Identifier,
                name: "midicps",
              },
              args: {
                list: []
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "min",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "220",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "Point(3, 4)": {
      compiled: [
        "SCScript(function($) {",
        "  return $('Point').$('new', [ $.Integer(3), $.Integer(4) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.Identifier,
              name: "Point",
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "Point.new(3, 4)": {
      compiled: [
        "SCScript(function($) {",
        "  return $('Point').$('new', [ $.Integer(3), $.Integer(4) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "Point",
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "Point.new": {
      compiled: [
        "SCScript(function($) {",
        "  return $('Point').$('new');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "Point",
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "Routine  {|i| i.postln}": {
      compiled: [
        "SCScript(function($) {",
        "  return $('Routine').$('new', [ $.Function(function() {",
        "    var $i;",
        "    return [",
        "      function(_arg0) {",
        "        $i = _arg0;",
        "        return $i.$('postln');",
        "      },",
        "      function() {",
        "        $i = null;",
        "      }",
        "    ];",
        "  }, 'i') ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "{",
            callee: {
              type: Syntax.Identifier,
              name: "Routine",
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
            },
            args: {
              list: [
                {
                  type: Syntax.FunctionExpression,
                  args: {
                    list: [
                      {
                        type: Syntax.VariableDeclarator,
                        id: {
                          type: Syntax.Identifier,
                          name: "i",
                        },
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.CallExpression,
                      callee: {
                        type: Syntax.Identifier,
                        name: "i",
                      },
                      method: {
                        type: Syntax.Identifier,
                        name: "postln",
                      },
                      args: {
                        list: []
                      },
                    }
                  ],
                  blockList: true,
                }
              ]
            },
          }
        ],
      }
    },
    "r {}.value": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [];",
        "  }).$('r').$('value');",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.CallExpression,
              stamp: "{",
              callee: {
                type: Syntax.FunctionExpression,
                body: [
                ],
                blockList: true,
              },
              method: {
                type: Syntax.Identifier,
                name: "r",
              },
              args: {
                list: []
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "Set[3, 4, 5]": {
      compiled: [
        "SCScript(function($) {",
        "  return $('Set').$('[]', [ $.Array([",
        "    $.Integer(3),",
        "    $.Integer(4),",
        "    $.Integer(5),",
        "  ]) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.Identifier,
              name: "Set",
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
            },
            args: {
              list: [
                {
                  type: Syntax.ListExpression,
                  elements: [
                    {
                      type: Syntax.Literal,
                      value: "3",
                      valueType: Token.IntegerLiteral,
                    },
                    {
                      type: Syntax.Literal,
                      value: "4",
                      valueType: Token.IntegerLiteral,
                    },
                    {
                      type: Syntax.Literal,
                      value: "5",
                      valueType: Token.IntegerLiteral,
                    }
                  ],
                }
              ]
            },
          }
        ],
      }
    },
    "Array [ 1, 2 ].at(0)": { // (Array [ 1, 2 ]).at(0)
      compiled: [
        "SCScript(function($) {",
        "  return $('Array').$('[]', [ $.Array([",
        "    $.Integer(1),",
        "    $.Integer(2),",
        "  ]) ]).$('at', [ $.Integer(0) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.CallExpression,
              stamp: "[",
              callee: {
                type: Syntax.Identifier,
                name: "Array",
              },
              method: {
                type: Syntax.Identifier,
                name: "[]",
              },
              args: {
                list: [
                  {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "2",
                        valueType: Token.IntegerLiteral,
                      },
                    ],
                  }
                ]
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "at",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "Array [ 1, 2 ][0]": { // (Array [ 1, 2 ])[0]
      compiled: [
        "SCScript(function($) {",
        "  return $('Array').$('[]', [ $.Array([",
        "    $.Integer(1),",
        "    $.Integer(2),",
        "  ]) ]).$('[]', [ $.Integer(0) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.CallExpression,
              stamp: "[",
              callee: {
                type: Syntax.Identifier,
                name: "Array",
              },
              method: {
                type: Syntax.Identifier,
                name: "[]",
              },
              args: {
                list: [
                  {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral,
                      },
                      {
                        type: Syntax.Literal,
                        value: "2",
                        valueType: Token.IntegerLiteral,
                      },
                    ],
                  }
                ]
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "a.(0, 1)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('value', [ $.Integer(0), $.Integer(1) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: ".",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "a.[0]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('value').$('[]', [ $.Integer(0) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.CallExpression,
              stamp: ".",
              callee: {
                type: Syntax.Identifier,
                name: "a",
              },
              method: {
                type: Syntax.Identifier,
                name: "value",
              },
              args: {
                list: []
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "a.[0;1]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('value').$('[]', [ ($.Integer(0), $.Integer(1)) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.CallExpression,
              stamp: ".",
              callee: {
                type: Syntax.Identifier,
                name: "a",
              },
              method: {
                type: Syntax.Identifier,
                name: "value",
              },
              args: {
                list: []
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  }
                ]
              ]
            },
          }
        ],
      }
    },
    "a.[..5]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('value').$('[..]', [ null, null, $.Integer(5) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "[",
            callee: {
              type: Syntax.CallExpression,
              stamp: ".",
              callee: {
                type: Syntax.Identifier,
                name: "a",
              },
              method: {
                type: Syntax.Identifier,
                name: "value",
              },
              args: {
                list: []
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                }
              ]
            },
          }
        ],
      }
    },
    "a.value(*[])": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.This().$('a'), _ref0.$('value', [" +
          "].concat($.Array([]).$('asArray')._)));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
            },
            args: {
              list: [],
              expand: {
                type: Syntax.ListExpression,
                elements: [],
              }
            },
          }
        ],
      }
    },
    "if (x<3) {\\abc} {\\def}": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('x').$('<', [ $.Integer(3) ]).$('if', [ $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Symbol('abc');",
        "      },",
        "      $.NOP",
        "    ];",
        "  }), $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Symbol('def');",
        "      },",
        "      $.NOP",
        "    ];",
        "  }) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "(",
            callee: {
              type: Syntax.BinaryExpression,
              operator: "<",
              left: {
                type: Syntax.Identifier,
                name: "x",
              },
              right: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "if",
            },
            args: {
              list: [
                {
                  type: Syntax.FunctionExpression,
                  body: [
                    {
                      type: Syntax.Literal,
                      value: "abc",
                      valueType: Token.SymbolLiteral,
                    }
                  ],
                  blockList: true,
                },
                {
                  type: Syntax.FunctionExpression,
                  body: [
                    {
                      type: Syntax.Literal,
                      value: "def",
                      valueType: Token.SymbolLiteral,
                    }
                  ],
                  blockList: true,
                }
              ]
            },
          }
        ],
      }
    },
    "z.do  {|x| x.play }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('z').$('do', [ $.Function(function() {",
        "    var $x;",
        "    return [",
        "      function(_arg0) {",
        "        $x = _arg0;",
        "        return $x.$('play');",
        "      },",
        "      function() {",
        "        $x = null;",
        "      }",
        "    ];",
        "  }, 'x') ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "z",
            },
            method: {
              type: Syntax.Identifier,
              name: "do",
            },
            args: {
              list: [
                {
                  type: Syntax.FunctionExpression,
                  args: {
                    list: [
                      {
                        type: Syntax.VariableDeclarator,
                        id: {
                          type: Syntax.Identifier,
                          name: "x",
                        },
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.CallExpression,
                      callee: {
                        type: Syntax.Identifier,
                        name: "x",
                      },
                      method: {
                        type: Syntax.Identifier,
                        name: "play",
                      },
                      args: {
                        list: []
                      },
                    }
                  ],
                  blockList: true,
                }
              ]
            },
          }
        ],
      }
    },
    "z.do #{|x| x.play }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('z').$('do', [ $.Function(function() {",
        "    var $x;",
        "    return [",
        "      function(_arg0) {",
        "        $x = _arg0;",
        "        return $x.$('play');",
        "      },",
        "      function() {",
        "        $x = null;",
        "      }",
        "    ];",
        "  }, 'x', true) ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "z",
            },
            method: {
              type: Syntax.Identifier,
              name: "do",
            },
            args: {
              list: [
                {
                  type: Syntax.FunctionExpression,
                  args: {
                    list: [
                      {
                        type: Syntax.VariableDeclarator,
                        id: {
                          type: Syntax.Identifier,
                          name: "x",
                        },
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.CallExpression,
                      callee: {
                        type: Syntax.Identifier,
                        name: "x",
                      },
                      method: {
                        type: Syntax.Identifier,
                        name: "play",
                      },
                      args: {
                        list: []
                      },
                    }
                  ],
                  closed: true,
                  blockList: true,
                }
              ]
            },
          }
        ],
      }
    },
    "loop { 'x'.postln; 1.wait }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        $.Symbol('x').$('postln');",
        "        return $.Integer(1).$('wait');",
        "      },",
        "      $.NOP",
        "    ];",
        "  }).$('loop');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: "{",
            callee: {
              type: Syntax.FunctionExpression,
              body: [
                {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Literal,
                    value: "x",
                    valueType: Token.SymbolLiteral,
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "postln",
                  },
                  args: {
                    list: []
                  },
                },
                {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "wait",
                  },
                  args: {
                    list: []
                  },
                }
              ],
              blockList: true,
            },
            method: {
              type: Syntax.Identifier,
              name: "loop",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "~a": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Environment('a');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.EnvironmentExpression,
            id: {
              type: Syntax.Identifier,
              name: "a",
            },
          },
        ],
      }
    },
    "~a.abs": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Environment('a').$('abs');",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.EnvironmentExpression,
              id: {
                type: Syntax.Identifier,
                name: "a",
              },
            },
            method: {
              type: Syntax.Identifier,
              name: "abs",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "~a = 0": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Environment('a', $.Integer(0));",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.EnvironmentExpression,
              id: {
                type: Syntax.Identifier,
                name: "a",
              },
            },
            right: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
            },
          }
        ],
      }
    },
    "()": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Event([]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.EventExpression,
            elements: [],
          }
        ],
      }
    },
    "( \\answer : 42 )": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Event([",
        "    $.Symbol('answer'),",
        "    $.Integer(42),",
        "  ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.EventExpression,
            elements: [
              {
                type: Syntax.Literal,
                value: "answer",
                valueType: Token.SymbolLiteral,
              },
              {
                type: Syntax.Literal,
                value: "42",
                valueType: Token.IntegerLiteral,
              }
            ],
          }
        ],
      }
    },
    "x = ( a: 1, b: 2, 3: 4 )": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Event([",
        "    $.Symbol('a'),",
        "    $.Integer(1),",
        "    $.Symbol('b'),",
        "    $.Integer(2),",
        "    $.Integer(3),",
        "    $.Integer(4),",
        "  ]), $.This().$('x_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "x",
            },
            right: {
              type: Syntax.EventExpression,
              elements: [
                {
                  type: Syntax.Literal,
                  value: "a",
                  valueType: Token.SymbolLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "b",
                  valueType: Token.SymbolLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                }
              ],
            },
          }
        ],
      }
    },
    "x = ( a : 1, b : 2, c : 3 )": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Event([",
        "    $.This().$('a'),",
        "    $.Integer(1),",
        "    $.This().$('b'),",
        "    $.Integer(2),",
        "    $.This().$('c'),",
        "    $.Integer(3),",
        "  ]), $.This().$('x_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "x",
            },
            right: {
              type: Syntax.EventExpression,
              elements: [
                {
                  type: Syntax.Identifier,
                  name: "a",
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Identifier,
                  name: "b",
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Identifier,
                  name: "c",
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                }
              ],
            },
          }
        ],
      }
    },
    "x = (1 + 2: 3, 4: 5)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Event([",
        "    $.Integer(1).$('+', [ $.Integer(2) ]),",
        "    $.Integer(3),",
        "    $.Integer(4),",
        "    $.Integer(5),",
        "  ]), $.This().$('x_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "x",
            },
            right: {
              type: Syntax.EventExpression,
              elements: [
                {
                  type: Syntax.BinaryExpression,
                  operator: "+",
                  left: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                  },
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                },
                {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                }
              ],
            },
          }
        ],
      }
    },
    "f = _ + _": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = $.Function(function() {",
        "    var $_0, $_1;",
        "    return [",
        "      function(_arg0, _arg1) {",
        "        $_0 = _arg0; $_1 = _arg1;",
        "        return $_0.$('+', [ $_1 ]);",
        "      },",
        "      function() {",
        "        $_0 = $_1 = null;",
        "      }",
        "    ];",
        "  }), $.This().$('f_', [ _ref0 ]), _ref0);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "f",
            },
            right: {
              type: Syntax.FunctionExpression,
              args: {
                list: [
                  {
                    type: Syntax.VariableDeclarator,
                    id: {
                      type: Syntax.Identifier,
                      name: "$_0",
                    },
                  },
                  {
                    type: Syntax.VariableDeclarator,
                    id: {
                      type: Syntax.Identifier,
                      name: "$_1",
                    },
                  }
                ]
              },
              body: [
                {
                  type: Syntax.BinaryExpression,
                  operator: "+",
                  left: {
                    type: Syntax.Identifier,
                    name: "$_0",
                  },
                  right: {
                    type: Syntax.Identifier,
                    name: "$_1",
                  },
                }
              ],
              partial: true,
            },
          }
        ],
      }
    },
    "[ _, _ ]": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    var $_0, $_1;",
        "    return [",
        "      function(_arg0, _arg1) {",
        "        $_0 = _arg0; $_1 = _arg1;",
        "        return $.Array([",
        "          $_0,",
        "          $_1,",
        "        ]);",
        "      },",
        "      function() {",
        "        $_0 = $_1 = null;",
        "      }",
        "    ];",
        "  });",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "$_0",
                  },
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "$_1",
                  },
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
                  },
                  {
                    type: Syntax.Identifier,
                    name: "$_1",
                  }
                ],
              }
            ],
            partial: true,
          }
        ],
      }
    },
    "var a; var b;": {
      compiled: [
        "SCScript(function($) {",
        "  var $a, $b;",
        "  $a = $.Nil();",
        "  return $b = $.Nil();",
        "});",
      ],
      ast: {
        type: Syntax.Program,
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
                },
              }
            ],
          },
          {
            type: Syntax.VariableDeclaration,
            kind: "var",
            declarations: [
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                },
              }
            ],
          }
        ],
      }
    },
    "var a; a = 10;": {
      compiled: [
        "SCScript(function($) {",
        "  var $a;",
        "  $a = $.Nil();",
        "  return $a = $.Integer(10);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
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
                },
              }
            ],
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
            },
          }
        ],
      }
    },
    "var a = { var a; a }; a": {
      compiled: [
        "SCScript(function($) {",
        "  var $a;",
        "  $a = $.Function(function() {",
        "    var $a;",
        "    return [",
        "      function() {",
        "        $a = $.Nil();",
        "        return $a;",
        "      },",
        "      function() {",
        "        $a = null;",
        "      }",
        "    ];",
        "  });",
        "  return $a;",
        "});",
      ],
      ast: {
        type: Syntax.Program,
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
                },
                init: {
                  type: Syntax.FunctionExpression,
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
                          },
                        }
                      ],
                    },
                    {
                      type: Syntax.Identifier,
                      name: "a",
                    }
                  ],
                },
              }
            ],
          },
          {
            type: Syntax.Identifier,
            name: "a",
          }
        ],
      }
    },
    "this ": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This();",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ThisExpression,
            name: "this",
          }
        ],
      }
    },
    "thisProcess.platform;": {
      compiled: [
        "SCScript(function($) {",
        "  return $.ThisProcess().$('platform');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.ThisExpression,
              name: "thisProcess",
            },
            method: {
              type: Syntax.Identifier,
              name: "platform",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "a.(Class)": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('a').$('value', [ $('Class') ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            stamp: ".",
            callee: {
              type: Syntax.Identifier,
              name: "a",
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
            },
            args: {
              list: [
                {
                  type: Syntax.Identifier,
                  name: "Class",
                }
              ]
            },
          }
        ],
      }
    },
    '"sc"': {
      compiled: [
        "SCScript(function($) {",
        "  return $.String('sc');",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.Literal,
            value: "sc",
            valueType: Token.StringLiteral,
          }
        ],
      }
    },
    '"#{69.midicps}"': {
      compiled: [
        "SCScript(function($) {",
        "  return $.Integer(69).$('midicps').$('asString');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.CallExpression,
              callee: {
                type: Syntax.Literal,
                value: "69",
                valueType: Token.IntegerLiteral
              },
              method: {
                type: Syntax.Identifier,
                name: "midicps",
              },
              args: {
                list: []
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "asString",
            },
            args: {
              list: []
            },
          }
        ],
      }
    },
    "{ neg(a.value) }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        return this.push(), $.This().$('a').$('value');",
        "      },",
        "      function() {",
        "        return this.shift().$('neg');",
        "      },",
        "      $.NOP",
        "    ];",
        "  });",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                stamp: "(",
                callee: {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Identifier,
                    name: "a",
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "value",
                  },
                  args: {
                    list: []
                  },
                },
                method: {
                  type: Syntax.Identifier,
                  name: "neg",
                },
                args: {
                  list: []
                },
              }
            ],
          }
        ],
      }
    },
    "{ { 1 }.value; }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        return this.push(), $.Function(function() {",
        "          return [",
        "            function() {",
        "              return $.Integer(1);",
        "            },",
        "            $.NOP",
        "          ];",
        "        }).$('value');",
        "      },",
        "      function() {",
        "        return this.shift();",
        "      },",
        "      $.NOP",
        "    ];",
        "  });",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.FunctionExpression,
                  body: [
                    {
                      type: Syntax.Literal,
                      value: "1",
                      valueType: Token.IntegerLiteral,
                    }
                  ],
                },
                method: {
                  type: Syntax.Identifier,
                  name: "value",
                },
                args: {
                  list: []
                },
              }
            ],
          }
        ],
      }
    },
    "{ (..10).do(_.yield) }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Integer(0).$('series', [ " +
                   "null, $.Integer(10) ]).$('do', [ $.Function(function() {",
        "          var $_0;",
        "          return [",
        "            function(_arg0) {",
        "              $_0 = _arg0;",
        "              return $_0.$('yield');",
        "            },",
        "            function() {",
        "              $_0 = null;",
        "            }",
        "          ];",
        "        }) ]);",
        "      },",
        "      $.NOP",
        "    ];",
        "  });",
        "});"
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "series",
                  },
                  args: {
                    list: [
                      null,
                      {
                        type: Syntax.Literal,
                        value: "10",
                        valueType: Token.IntegerLiteral,
                      }
                    ]
                  },
                },
                method: {
                  type: Syntax.Identifier,
                  name: "do",
                },
                args: {
                  list: [
                    {
                      type: Syntax.FunctionExpression,
                      args: {
                        list: [
                          {
                            type: Syntax.VariableDeclarator,
                            id: {
                              type: Syntax.Identifier,
                              name: "$_0",
                            },
                          }
                        ]
                      },
                      body: [
                        {
                          type: Syntax.CallExpression,
                          callee: {
                            type: Syntax.Identifier,
                            name: "$_0",
                          },
                          method: {
                            type: Syntax.Identifier,
                            name: "yield",
                          },
                          args: {
                            list: []
                          },
                        }
                      ],
                      partial: true,
                    }
                  ]
                },
              }
            ],
          }
        ],
      }
    }
  };

  sc.test.compiler = {
    cases: cases
  };
})();

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
        range: [ 0, 0 ],
        loc: {
          start: { line: 0, column: 0 },
          end  : { line: 0, column: 0 }
        }
      }
    },
    "    \n\t": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
        range: [ 6, 6 ],
        loc: {
          start: { line: 2, column: 1 },
          end  : { line: 2, column: 1 }
        }
      }
    },
    "// single line comment\n": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
        range: [ 23, 23 ],
        loc: {
          start: { line: 2, column: 0 },
          end  : { line: 2, column: 0 }
        }
      }
    },
    "/*\n/* / * */\n*/": {
      compiled: "",
      ast: {
        type: Syntax.Program,
        body: [],
        range: [ 15, 15 ],
        loc: {
          start: { line: 3, column: 3 },
          end  : { line: 3, column: 3 }
        }
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
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          }
        ],
        range: [ 0, 5 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 5 }
        }
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
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 2 }
            }
          }
        ],
        range: [ 0, 2 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 2 }
        }
      }
    },
    "nil": {
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
            value: "null",
            valueType: Token.NilLiteral,
            range: [ 0, 3 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 3 }
            }
          }
        ],
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 3 }
        }
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
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 4 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "false",
              valueType: Token.FalseLiteral,
              range: [ 8, 13 ],
              loc: {
                start: { line: 1, column: 8 },
                end  : { line: 1, column: 13 }
              }
            },
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
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
              range: [ 1, 3 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 3 }
              }
            },
            range: [ 0, 3 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 3 }
            }
          }
        ],
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 3 }
        }
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
            adverb  : {
              type: Syntax.Literal,
              value: "f",
              valueType: Token.SymbolLiteral,
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 6, 7 ],
              loc: {
                start: { line: 1, column: 6 },
                end  : { line: 1, column: 7 }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 },
            }
          },
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 },
        }
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
            adverb  : {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 6, 7 ],
              loc: {
                start: { line: 1, column: 6 },
                end  : { line: 1, column: 7 }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 },
            }
          },
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 },
        }
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
            adverb  : {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end  : { line: 1, column: 8 }
              }
            },
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Identifier,
              name: "b",
              range: [ 9, 10 ],
              loc: {
                start: { line: 1, column: 9 },
                end  : { line: 1, column: 10 }
              }
            },
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 10 },
            }
          },
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 10 },
        }
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
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 },
                }
              },
              {
                type: Syntax.Literal,
                value: "0.5",
                valueType: Token.FloatLiteral,
                range: [ 5, 8 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 8 },
                }
              },
            ],
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 10 },
            }
          }
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 10 },
        }
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
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end  : { line: 1, column: 4 },
                }
              },
              {
                type: Syntax.Literal,
                value: "0.5",
                valueType: Token.FloatLiteral,
                range: [ 6, 9 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end  : { line: 1, column: 9 },
                }
              },
            ],
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 11 },
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 11 },
        }
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
                range: [ 3, 5 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end  : { line: 1, column: 5 },
                }
              },
            ],
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 },
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 },
        }
      }
    },
    "#[ #[] ]": {
      ast: new Error("unexpected token #")
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
                range: [ 2, 4 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 4 }
                }
              },
              {
                type : Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              },
              {
                type : Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end  : { line: 1, column: 9 }
                }
              },
              {
                type : Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end  : { line: 1, column: 12 }
                }
              }
            ],
            range: [ 0, 14 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 14 }
            }
          }
        ],
        range: [ 0, 14 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 14 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "6.283185307179586",
              valueType: Token.FloatLiteral,
              range: [ 4, 7 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 7 }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end  : { line: 1, column: 2 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "b",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              }
            ],
            right: {
              type: Syntax.Identifier,
              name: "c",
              range: [ 8, 9 ],
              loc: {
                start: { line: 1, column: 8 },
                end  : { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end  : { line: 1, column: 2 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "b",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              }
            ],
            remain: {
              type: Syntax.Identifier,
              name: "c",
              range: [ 10, 11 ],
              loc: {
                start: { line: 1, column: 10 },
                end  : { line: 1, column: 11 }
              }
            },
            right: {
              type: Syntax.Identifier,
              name: "d",
              range: [ 14, 15 ],
              loc: {
                start: { line: 1, column: 14 },
                end  : { line: 1, column: 15 }
              }
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end  : { line: 1, column: 2 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "b",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              }
            ],
            right: {
              type: Syntax.AssignmentExpression,
              operator: "=",
              left: [
                {
                  type: Syntax.Identifier,
                  name: "c",
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "d",
                  range: [ 12, 13 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end  : { line: 1, column: 13 }
                  }
                }
              ],
              right: {
                type: Syntax.ListExpression,
                elements: [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                    range: [ 18, 19 ],
                    loc: {
                      start: { line: 1, column: 18 },
                      end  : { line: 1, column: 19 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 21, 22 ],
                    loc: {
                      start: { line: 1, column: 21 },
                      end  : { line: 1, column: 22 }
                    }
                  }
                ],
                range: [ 16, 24 ],
                loc: {
                  start: { line: 1, column: 16 },
                  end  : { line: 1, column: 24 }
                }
              },
              range: [ 8, 24 ],
              loc: {
                start: { line: 1, column: 8 },
                end  : { line: 1, column: 24 }
              }
            },
            range: [ 0, 24 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 24 }
            }
          }
        ],
        range: [ 0, 24 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 24 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "neg",
              range: [ 2, 5 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 5 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          },
        ],
        range: [ 0, 5 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 5 }
        }
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
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "b",
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              args: {
                list: []
              },
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            stamp: "=",
            method: {
              type: Syntax.Identifier,
              name: "c_",
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 9 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end  : { line: 1, column: 9 }
                  }
                }
              ]
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
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
                    end  : { line: 1, column: 3 }
                  }
                }
              ]
            },
            range: [ 0, 4 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 4 }
            }
          }
        ],
        range: [ 0, 4 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 4 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 6 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 6 }
                  }
                },
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          },
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                null,
                null,
              ]
            },
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 6 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 7 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 7 }
                  }
                },
              ]
            },
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 8 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                null,
              ]
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 10 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end  : { line: 1, column: 10 }
                  }
                },
              ]
            },
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 11 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                null,
                null,
                null,
              ]
            },
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          },
        ],
        range: [ 0, 5 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 5 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
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
                    end  : { line: 1, column: 3 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 8 }
                  }
                },
              ]
            },
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 8 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 6 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 6 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end  : { line: 1, column: 11 }
                  }
                },
              ]
            },
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 11 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 10 }
                  }
                },
              ]
            },
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 10 }
            }
          }
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 10 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 7 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 11, 12 ],
                  loc: {
                    start: { line: 1, column: 11 },
                    end  : { line: 1, column: 12 }
                  }
                },
              ]
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 12 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                null,
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 12, 13 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end  : { line: 1, column: 13 }
                  }
                },
              ]
            },
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 10 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end  : { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 14, 15 ],
                  loc: {
                    start: { line: 1, column: 14 },
                    end  : { line: 1, column: 15 }
                  }
                },
              ]
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]_",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
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
                  range: [ 8, 9 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end  : { line: 1, column: 9 }
                  }
                },
              ]
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                    range: [ 2, 3 ],
                    loc: {
                      start: { line: 1, column: 2 },
                      end  : { line: 1, column: 3 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end  : { line: 1, column: 5 }
                    }
                  },
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 7 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 8, 9 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end  : { line: 1, column: 9 }
                    }
                  },
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "4",
                    valueType: Token.IntegerLiteral,
                    range: [ 11, 12 ],
                    loc: {
                      start: { line: 1, column: 11 },
                      end  : { line: 1, column: 12 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end  : { line: 1, column: 14 }
                    }
                  },
                ]
              ]
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
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
                      range: [ 2, 3 ],
                      loc: {
                        start: { line: 1, column: 2 },
                        end  : { line: 1, column: 3 }
                      }
                    },
                    method: {
                      type: Syntax.Identifier,
                      name: "[]_",
                      range: [ 3, 3 ],
                      loc: {
                        start: { line: 1, column: 3 },
                        end  : { line: 1, column: 3 }
                      }
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
                              range: [ 4, 5 ],
                              loc: {
                                start: { line: 1, column: 4 },
                                end  : { line: 1, column: 5 }
                              }
                            },
                            right: {
                              type: Syntax.Literal,
                              value: "0",
                              valueType: Token.IntegerLiteral,
                              range: [ 6, 7 ],
                              loc: {
                                start: { line: 1, column: 6 },
                                end  : { line: 1, column: 7 }
                              }
                            },
                            range: [ 4, 7 ],
                            loc: {
                              start: { line: 1, column: 4 },
                              end  : { line: 1, column: 7 }
                            }
                          },
                          {
                            type: Syntax.Literal,
                            value: "1",
                            valueType: Token.IntegerLiteral,
                            range: [ 8, 9 ],
                            loc: {
                              start: { line: 1, column: 8 },
                              end  : { line: 1, column: 9 }
                            }
                          }
                        ],
                        {
                          type: Syntax.Literal,
                          value: "0",
                          valueType: Token.IntegerLiteral,
                          range: [ 11, 12 ],
                          loc: {
                            start: { line: 1, column: 11 },
                            end  : { line: 1, column: 12 }
                          }
                        }
                      ]
                    },
                    range: [ 2, 12 ],
                    loc: {
                      start: { line: 1, column: 2 },
                      end  : { line: 1, column: 12 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end  : { line: 1, column: 14 }
                    }
                  }
                ]
              ]
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "series",
              range: [ 1, 1 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 1 }
              }
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 3, 5 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 5 }
                  }
                },
              ]
            },
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 6 }
        }
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
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "series",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 6 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 6 }
                  }
                },
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "series",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 9 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 9 }
                  }
                },
              ]
            },
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 10 }
            }
          }
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 10 }
        }
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
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end  : { line: 1, column: 2 }
                }
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end  : { line: 1, column: 4 }
                }
              },
            ],
            method: {
              type: Syntax.Identifier,
              name: "series",
              range: [ 4, 4 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 4 }
              }
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 7 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 8, 9 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end  : { line: 1, column: 9 }
                    }
                  },
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "4",
                    valueType: Token.IntegerLiteral,
                    range: [ 11, 12 ],
                    loc: {
                      start: { line: 1, column: 11 },
                      end  : { line: 1, column: 12 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end  : { line: 1, column: 14 }
                    }
                  },
                ],
              ]
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                null,
                null,
              ]
            },
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          }
        ],
        range: [ 0, 5 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 5 }
        }
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
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 6 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 6 }
                  }
                },
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 3 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
              range: [ 3, 3 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                null,
                null,
              ]
            },
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 6 }
        }
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
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 3 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
              range: [ 3, 3 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                null,
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 7 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 7 }
                  }
                },
              ]
            },
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 8 }
        }
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
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 3 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
              range: [ 3, 3 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                null,
              ]
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 3 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "seriesIter",
              range: [ 3, 3 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 10 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end  : { line: 1, column: 10 }
                  }
                },
              ]
            },
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 11 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "5.0",
              valueType: Token.FloatLiteral,
              range: [ 6, 9 ],
              loc: {
                start: { line: 1, column: 6 },
                end  : { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "5.0",
              valueType: Token.FloatLiteral,
              range: [ 6, 9 ],
              loc: {
                start: { line: 1, column: 6 },
                end  : { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "5.0",
              valueType: Token.FloatLiteral,
              range: [ 5, 8 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 8 }
              }
            },
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 8 }
        }
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
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 7 }
                    }
                  },
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                    range: [ 9, 10 ],
                    loc: {
                      start: { line: 1, column: 9 },
                      end  : { line: 1, column: 10 }
                    }
                  },
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c",
                    range: [ 12, 13 ],
                    loc: {
                      start: { line: 1, column: 12 },
                      end  : { line: 1, column: 13 }
                    }
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 14, 15 ],
                    loc: {
                      start: { line: 1, column: 14 },
                      end  : { line: 1, column: 15 }
                    }
                  },
                  range: [ 12, 15 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end  : { line: 1, column: 15 }
                  }
                }
              ]
            },
            body: [
              {
                type: Syntax.Literal,
                value: "null",
                valueType: Token.NilLiteral,
                range: [ 17, 20 ],
                loc: {
                  start: { line: 1, column: 17 },
                  end  : { line: 1, column: 20 }
                }
              }
            ],
            range: [ 0, 22 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 22 }
            }
          }
        ],
        range: [ 0, 22 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 22 }
        }
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
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 7 }
                    }
                  },
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                    range: [ 9, 10 ],
                    loc: {
                      start: { line: 1, column: 9 },
                      end  : { line: 1, column: 10 }
                    }
                  },
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c",
                    range: [ 12, 13 ],
                    loc: {
                      start: { line: 1, column: 12 },
                      end  : { line: 1, column: 13 }
                    }
                  },
                  range: [ 12, 13 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end  : { line: 1, column: 13 }
                  }
                }
              ],
              remain: {
                type: Syntax.Identifier,
                name: "d",
                range: [ 18, 19 ],
                loc: {
                  start: { line: 1, column: 18 },
                  end  : { line: 1, column: 19 }
                }
              }
            },
            body: [
              {
                type: Syntax.Literal,
                value: "null",
                valueType: Token.NilLiteral,
                range: [ 21, 24 ],
                loc: {
                  start: { line: 1, column: 21 },
                  end  : { line: 1, column: 24 }
                }
              }
            ],
            range: [ 0, 26 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 26 }
            }
          }
        ],
        range: [ 0, 26 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 26 }
        }
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
                range: [ 9, 13 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end  : { line: 1, column: 13 }
                }
              }
            },
            body: [
              {
                type: Syntax.Literal,
                value: "null",
                valueType: Token.NilLiteral,
                range: [ 15, 18 ],
                loc: {
                  start: { line: 1, column: 15 },
                  end  : { line: 1, column: 18 }
                }
              }
            ],
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 20 }
            }
          }
        ],
        range: [ 0, 20 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 20 }
        }
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
                    range: [ 3, 4 ],
                    loc: {
                      start: { line: 1, column: 3 },
                      end  : { line: 1, column: 4 }
                    }
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 7, 8 ],
                    loc: {
                      start: { line: 1, column: 7 },
                      end  : { line: 1, column: 8 }
                    }
                  },
                  range: [ 3, 8 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 8 }
                  }
                }
              ]
            },
            body: [
              {
                type: "Identifier",
                name: "x",
                range: [ 10, 11 ],
                loc: {
                  start: { line: 1, column: 10 },
                  end  : { line: 1, column: 11 }
                }
              }
            ],
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
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
        "      }",
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
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "b",
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "c",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end  : { line: 1, column: 9 }
                }
              }
            ],
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 11 }
        }
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
                    range: [ 2, 3 ],
                    loc: {
                      start: { line: 1, column: 2 },
                      end  : { line: 1, column: 3 }
                    }
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end  : { line: 1, column: 5 }
                    }
                  },
                  range: [ 2, 5 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 5 }
                  }
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
                      range: [ 11, 12 ],
                      loc: {
                        start: { line: 1, column: 11 },
                        end  : { line: 1, column: 12 }
                      }
                    },
                    init: {
                      type: Syntax.BinaryExpression,
                      operator: "*",
                      left: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 15, 16 ],
                        loc: {
                          start: { line: 1, column: 15 },
                          end  : { line: 1, column: 16 }
                        }
                      },
                      right: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 19, 20 ],
                        loc: {
                          start: { line: 1, column: 19 },
                          end  : { line: 1, column: 20 }
                        }
                      },
                      range: [ 15, 20 ],
                      loc: {
                        start: { line: 1, column: 15 },
                        end  : { line: 1, column: 20 }
                      }
                    },
                    range: [ 11, 20 ],
                    loc: {
                      start: { line: 1, column: 11 },
                      end  : { line: 1, column: 20 }
                    }
                  }
                ],
                range: [ 7, 20 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end  : { line: 1, column: 20 }
                }
              },
              {
                type: Syntax.BinaryExpression,
                operator: "*",
                left: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 22, 23 ],
                  loc: {
                    start: { line: 1, column: 22 },
                    end  : { line: 1, column: 23 }
                  }
                },
                right: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 26, 27 ],
                  loc: {
                    start: { line: 1, column: 26 },
                    end  : { line: 1, column: 27 }
                  }
                },
                range: [ 22, 27 ],
                loc: {
                  start: { line: 1, column: 22 },
                  end  : { line: 1, column: 27 }
                }
              }
            ],
            range: [ 0, 30 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 30 }
            }
          }
        ],
        range: [ 0, 30 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 30 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.FunctionExpression,
              body: [],
              closed: true,
              range: [ 4, 7 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 7 }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
                value: "null",
                valueType: Token.NilLiteral,
                range: [ 76, 79 ],
                loc: {
                  start: { line: 1, column: 76 },
                  end  : { line: 1, column: 79 }
                }
              }
            ],
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a",
                    range: [ 2, 3 ],
                    loc: {
                      start: { line: 1, column: 2 },
                      end  : { line: 1, column: 3 }
                    }
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "null",
                        valueType: Token.NilLiteral,
                        range: [ 7, 10 ],
                        loc: {
                          start: { line: 1, column: 7 },
                          end  : { line: 1, column: 10 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "true",
                        valueType: "True",
                        range: [ 12, 16 ],
                        loc: {
                          start: { line: 1, column: 12 },
                          end  : { line: 1, column: 16 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "false",
                        valueType: "False",
                        range: [ 18, 23 ],
                        loc: {
                          start: { line: 1, column: 18 },
                          end  : { line: 1, column: 23 }
                        }
                      }
                    ],
                    immutable: true,
                    range: [ 4, 25 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end  : { line: 1, column: 25 }
                    }
                  },
                  range: [ 2, 25 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 25 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b",
                    range: [ 27, 28 ],
                    loc: {
                      start: { line: 1, column: 27 },
                      end  : { line: 1, column: 28 }
                    }
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "Infinity",
                        valueType: "Float",
                        range: [ 33, 36 ],
                        loc: {
                          start: { line: 1, column: 33 },
                          end  : { line: 1, column: 36 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "-Infinity",
                        valueType: Token.FloatLiteral,
                        range: [ 38, 42 ],
                        loc: {
                          start: { line: 1, column: 38 },
                          end  : { line: 1, column: 42 }
                        }
                      }
                    ],
                    immutable: true,
                    range: [ 30, 44 ],
                    loc: {
                      start: { line: 1, column: 30 },
                      end  : { line: 1, column: 44 }
                    }
                  },
                  range: [ 27, 44 ],
                  loc: {
                    start: { line: 1, column: 27 },
                    end  : { line: 1, column: 44 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c",
                    range: [ 46, 47 ],
                    loc: {
                      start: { line: 1, column: 46 },
                      end  : { line: 1, column: 47 }
                    }
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "0",
                        valueType: Token.IntegerLiteral,
                        range: [ 51, 52 ],
                        loc: {
                          start: { line: 1, column: 51 },
                          end  : { line: 1, column: 52 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "0.0",
                        valueType: Token.FloatLiteral,
                        range: [ 54, 57 ],
                        loc: {
                          start: { line: 1, column: 54 },
                          end  : { line: 1, column: 57 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "6.283185307179586",
                        valueType: Token.FloatLiteral,
                        range: [ 59, 62 ],
                        loc: {
                          start: { line: 1, column: 59 },
                          end  : { line: 1, column: 62 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "a",
                        valueType: Token.CharLiteral,
                        range: [ 64, 66 ],
                        loc: {
                          start: { line: 1, column: 64 },
                          end  : { line: 1, column: 66 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "sym",
                        valueType: Token.SymbolLiteral,
                        range: [ 68, 72 ],
                        loc: {
                          start: { line: 1, column: 68 },
                          end  : { line: 1, column: 72 }
                        }
                      }
                    ],
                    immutable: true,
                    range: [ 48, 74 ],
                    loc: {
                      start: { line: 1, column: 48 },
                      end  : { line: 1, column: 74 }
                    }
                  },
                  range: [ 46, 74 ],
                  loc: {
                    start: { line: 1, column: 46 },
                    end  : { line: 1, column: 74 }
                  }
                }
              ]
            },
            range: [ 0, 81 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 81 }
            }
          }
        ],
        range: [ 0, 81 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 81 }
        }
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
                  range: [ 4, 9 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 9 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end  : { line: 1, column: 11 }
                  }
                },
                range: [ 4, 11 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 11 }
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "slope",
                  range: [ 13, 18 ],
                  loc: {
                    start: { line: 1, column: 13 },
                    end  : { line: 1, column: 18 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 19, 20 ],
                  loc: {
                    start: { line: 1, column: 19 },
                    end  : { line: 1, column: 20 }
                  }
                },
                range: [ 13, 20 ],
                loc: {
                  start: { line: 1, column: 13 },
                  end  : { line: 1, column: 20 }
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "curve",
                  range: [ 22, 27 ],
                  loc: {
                    start: { line: 1, column: 22 },
                    end  : { line: 1, column: 27 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 28, 29 ],
                  loc: {
                    start: { line: 1, column: 28 },
                    end  : { line: 1, column: 29 }
                  }
                },
                range: [ 22, 29 ],
                loc: {
                  start: { line: 1, column: 22 },
                  end  : { line: 1, column: 29 }
                }
              }
            ],
            range: [ 0, 29 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 29 }
            }
          }
        ],
        range: [ 0, 30 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 30 }
        }
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
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              },
              {
                type: Syntax.VariableDeclarator,
                id: {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 8 }
                  }
                },
                range: [ 7, 8 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end  : { line: 1, column: 8 }
                }
              },
            ],
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 10, 11 ],
              loc: {
                start: { line: 1, column: 10 },
                end  : { line: 1, column: 11 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "null",
              valueType: Token.NilLiteral,
              range: [ 12, 15 ],
              loc: {
                start: { line: 1, column: 12 },
                end  : { line: 1, column: 15 }
              }
            },
            range: [ 10, 15 ],
            loc: {
              start: { line: 1, column: 10 },
              end  : { line: 1, column: 15 }
            }
          },
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 16 }
        }
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
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              },
            ],
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: [
              {
                type: Syntax.Identifier,
                name: "a",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end  : { line: 1, column: 9 }
                }
              },
            ],
            right: {
              type: Syntax.ListExpression,
              elements: [],
              range: [ 12, 14 ],
              loc: {
                start: { line: 1, column: 12 },
                end  : { line: 1, column: 14 }
              }
            },
            range: [ 7, 14 ],
            loc: {
              start: { line: 1, column: 7 },
              end  : { line: 1, column: 14 }
            }
          },
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
                    range: [ 3, 4 ],
                    loc: {
                      start: { line: 1, column: 3 },
                      end  : { line: 1, column: 4 }
                    }
                  },
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 4 }
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "y",
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 7 }
                    }
                  },
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 7 }
                  }
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
                      range: [ 13, 14 ],
                      loc: {
                        start: { line: 1, column: 13 },
                        end  : { line: 1, column: 14 }
                      }
                    },
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end  : { line: 1, column: 14 }
                    }
                  }
                ],
                range: [ 9, 14 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end  : { line: 1, column: 14 }
                }
              },
              {
                type: Syntax.AssignmentExpression,
                operator: "=",
                left: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 16, 17 ],
                  loc: {
                    start: { line: 1, column: 16 },
                    end  : { line: 1, column: 17 }
                  }
                },
                right: {
                  type: Syntax.BinaryExpression,
                  operator: "+",
                  left: {
                    type: Syntax.Identifier,
                    name: "x",
                    range: [ 20, 21 ],
                    loc: {
                      start: { line: 1, column: 20 },
                      end  : { line: 1, column: 21 }
                    }
                  },
                  right: {
                    type: Syntax.Identifier,
                    name: "y",
                    range: [ 24, 25 ],
                    loc: {
                      start: { line: 1, column: 24 },
                      end  : { line: 1, column: 25 }
                    }
                  },
                  range: [ 20, 25 ],
                  loc: {
                    start: { line: 1, column: 20 },
                    end  : { line: 1, column: 25 }
                  }
                },
                range: [ 16, 25 ],
                loc: {
                  start: { line: 1, column: 16 },
                  end  : { line: 1, column: 25 }
                }
              },
              {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.Identifier,
                  name: "x",
                  range: [ 27, 28 ],
                  loc: {
                    start: { line: 1, column: 27 },
                    end  : { line: 1, column: 28 }
                  }
                },
                method: {
                  type: Syntax.Identifier,
                  name: "wait",
                  range: [ 29, 33 ],
                  loc: {
                    start: { line: 1, column: 29 },
                    end  : { line: 1, column: 33 }
                  }
                },
                args: {
                  list: []
                },
                range: [ 27, 33 ],
                loc: {
                  start: { line: 1, column: 27 },
                  end  : { line: 1, column: 33 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "a",
                range: [ 35, 36 ],
                loc: {
                  start: { line: 1, column: 35 },
                  end  : { line: 1, column: 36 }
                }
              }
            ],
            range: [ 0, 38 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 38 }
            }
          }
        ],
        range: [ 0, 38 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 38 }
        }
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
        "            }",
        "          ];",
        "        }) ]);",
        "      },",
        "      function() {",
        "        return $.Integer(0);",
        "      }",
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
                  range: [ 6, 10 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 10 }
                  }
                },
                method: {
                  type: Syntax.Identifier,
                  name: "if",
                  range: [ 2, 4 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 4 }
                  }
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
                            range: [ 14, 15 ],
                            loc: {
                              start: { line: 1, column: 14 },
                              end  : { line: 1, column: 15 }
                            }
                          },
                          method: {
                            type: Syntax.Identifier,
                            name: "wait",
                            range: [ 16, 20 ],
                            loc: {
                              start: { line: 1, column: 16 },
                              end  : { line: 1, column: 20 }
                            }
                          },
                          args: {
                            list: []
                          },
                          range: [ 14, 20 ],
                          loc: {
                            start: { line: 1, column: 14 },
                            end  : { line: 1, column: 20 }
                          }
                        }
                      ],
                      blocklist: true,
                      range: [ 12, 22 ],
                      loc: {
                        start: { line: 1, column: 12 },
                        end  : { line: 1, column: 22 }
                      }
                    }
                  ]
                },
                range: [ 2, 22 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 22 }
                }
              },
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 24, 25 ],
                loc: {
                  start: { line: 1, column: 24 },
                  end  : { line: 1, column: 25 }
                }
              }
            ],
            range: [ 0, 27 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 27 }
            }
          }
        ],
        range: [ 0, 27 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 27 }
        }
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
        "      }",
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
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 8 }
                  }
                },
                method: {
                  type: Syntax.Identifier,
                  name: "wait",
                  range: [ 2, 6 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 6 }
                  }
                },
                args: {
                  list: []
                },
                range: [ 2, 9 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 9 }
                }
              },
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end  : { line: 1, column: 12 }
                }
              }
            ],
            range: [ 0, 14 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 14 }
            }
          }
        ],
        range: [ 0, 14 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 14 }
        }
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
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 8 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end  : { line: 1, column: 11 }
                  }
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 14, 15 ],
                loc: {
                  start: { line: 1, column: 14 },
                  end  : { line: 1, column: 15 }
                }
              },
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                  range: [ 20, 21 ],
                  loc: {
                    start: { line: 1, column: 20 },
                    end  : { line: 1, column: 21 }
                  }
                },
                b: {
                  type: Syntax.Literal,
                  value: "6",
                  valueType: Token.IntegerLiteral,
                  range: [ 26, 27 ],
                  loc: {
                    start: { line: 1, column: 26 },
                    end  : { line: 1, column: 27 }
                  }
                }
              }
            },
            range: [ 0, 28 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 28 }
            }
          }
        ],
        range: [ 0, 28 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 28 }
        }
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
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 8 }
                  }
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end  : { line: 1, column: 12 }
                }
              }
            },
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
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
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 8 }
                  }
                }
              ],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                  range: [ 13, 14 ],
                  loc: {
                    start: { line: 1, column: 13 },
                    end  : { line: 1, column: 14 }
                  }
                }
              }
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end  : { line: 1, column: 9 }
                }
              },
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 14, 15 ],
                  loc: {
                    start: { line: 1, column: 14 },
                    end  : { line: 1, column: 15 }
                  }
                }
              }
            },
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 16 }
        }
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
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end  : { line: 1, column: 9 }
                }
              }
            },
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 10 }
            }
          }
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 10 }
        }
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
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end  : { line: 1, column: 11 }
                  }
                }
              }
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 12 }
        }
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
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 6 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 11, 12 ],
                  loc: {
                    start: { line: 1, column: 11 },
                    end  : { line: 1, column: 12 }
                  }
                }
              }
            },
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
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
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 6 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 7, 8 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end  : { line: 1, column: 8 }
                }
              }
            ],
            method: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 10, 11 ],
                    loc: {
                      start: { line: 1, column: 10 },
                      end  : { line: 1, column: 11 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end  : { line: 1, column: 14 }
                    }
                  }
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "4",
                    valueType: Token.IntegerLiteral,
                    range: [ 16, 17 ],
                    loc: {
                      start: { line: 1, column: 16 },
                      end  : { line: 1, column: 17 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                    range: [ 19, 20 ],
                    loc: {
                      start: { line: 1, column: 19 },
                      end  : { line: 1, column: 20 }
                    }
                  }
                ]
              ],
              keywords: {
                a: [
                  {
                    type: Syntax.Literal,
                    value: "6",
                    valueType: Token.IntegerLiteral,
                    range: [ 25, 26 ],
                    loc: {
                      start: { line: 1, column: 25 },
                      end  : { line: 1, column: 26 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "7",
                    valueType: Token.IntegerLiteral,
                    range: [ 28, 29 ],
                    loc: {
                      start: { line: 1, column: 28 },
                      end  : { line: 1, column: 29 }
                    }
                  }
                ],
                b: [
                  {
                    type: Syntax.Literal,
                    value: "8",
                    valueType: Token.IntegerLiteral,
                    range: [ 34, 35 ],
                    loc: {
                      start: { line: 1, column: 34 },
                      end  : { line: 1, column: 35 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "9",
                    valueType: Token.IntegerLiteral,
                    range: [ 37, 38 ],
                    loc: {
                      start: { line: 1, column: 37 },
                      end  : { line: 1, column: 38 }
                    }
                  }
                ]
              }
            },
            range: [ 0, 39 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 39 }
            }
          }
        ],
        range: [ 0, 39 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 39 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: [
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end  : { line: 1, column: 9 }
                }
              },
              {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end  : { line: 1, column: 12 }
                }
              }
            ],
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
      }
    },
    "a = (var a = 1; a)": {
      compiled: [
        "SCScript(function($) {",
        "  var _ref0;",
        "  return (_ref0 = (function() {",
        "    var $a;",
        "    $a = $.Integer(1);",
        "    return $a;",
        "  })(), $.This().$('a_', [ _ref0 ]), _ref0);",
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
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
                        range: [ 9, 10 ],
                        loc: {
                          start: { line: 1, column: 9 },
                          end  : { line: 1, column: 10 }
                        }
                      },
                      init: {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral,
                        range: [ 13, 14 ],
                        loc: {
                          start: { line: 1, column: 13 },
                          end  : { line: 1, column: 14 }
                        }
                      },
                      range: [ 9, 14 ],
                      loc: {
                        start: { line: 1, column: 9 },
                        end  : { line: 1, column: 14 }
                      }
                    }
                  ],
                  range: [ 5, 14 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 14 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 16, 17 ],
                  loc: {
                    start: { line: 1, column: 16 },
                    end  : { line: 1, column: 17 }
                  }
                }
              ],
              range: [ 4, 18 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 18 }
              }
            },
            range: [ 0, 18 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 18 }
            }
          }
        ],
        range: [ 0, 18 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 18 }
        }
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
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "midicps",
                range: [ 2, 9 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 9 }
                }
              },
              args: {
                list: []
              },
              range: [ 0, 9 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 9 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "min",
              range: [ 10, 13 ],
              loc: {
                start: { line: 1, column: 10 },
                end  : { line: 1, column: 13 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "220",
                  valueType: Token.IntegerLiteral,
                  range: [ 14, 17 ],
                  loc: {
                    start: { line: 1, column: 14 },
                    end  : { line: 1, column: 17 }
                  }
                }
              ]
            },
            range: [ 0, 18 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 18 }
            }
          }
        ],
        range: [ 0, 18 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 18 }
        }
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
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
              range: [ 5, 5 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 5 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 10 }
                  }
                }
              ]
            },
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 11 }
        }
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
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
              range: [ 6, 9 ],
              loc: {
                start: { line: 1, column: 6 },
                end  : { line: 1, column: 9 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end  : { line: 1, column: 11 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 13, 14 ],
                  loc: {
                    start: { line: 1, column: 13 },
                    end  : { line: 1, column: 14 }
                  }
                }
              ]
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
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
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 5 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
              range: [ 6, 9 ],
              loc: {
                start: { line: 1, column: 6 },
                end  : { line: 1, column: 9 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
              range: [ 0, 7 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 7 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "new",
              range: [ 9, 9 ],
              loc: {
                start: { line: 1, column: 9 },
                end  : { line: 1, column: 9 }
              }
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
                          range: [ 11, 12 ],
                          loc: {
                            start: { line: 1, column: 11 },
                            end  : { line: 1, column: 12 }
                          }
                        },
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end  : { line: 1, column: 12 }
                        }
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.CallExpression,
                      callee: {
                        type: Syntax.Identifier,
                        name: "i",
                        range: [ 14, 15 ],
                        loc: {
                          start: { line: 1, column: 14 },
                          end  : { line: 1, column: 15 }
                        }
                      },
                      method: {
                        type: Syntax.Identifier,
                        name: "postln",
                        range: [ 16, 22 ],
                        loc: {
                          start: { line: 1, column: 16 },
                          end  : { line: 1, column: 22 }
                        }
                      },
                      args: {
                        list: []
                      },
                      range: [ 14, 22 ],
                      loc: {
                        start: { line: 1, column: 14 },
                        end  : { line: 1, column: 22 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 9, 23 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 23 }
                  }
                }
              ]
            },
            range: [ 0, 23 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 23 }
            }
          }
        ],
        range: [ 0, 23 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 23 }
        }
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
              callee: {
                type: Syntax.FunctionExpression,
                body: [
                ],
                blocklist: true,
                range: [ 2, 4 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 4 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "r",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              args: {
                list: []
              },
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 4 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
              range: [ 5, 10 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 10 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 10 }
            }
          }
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 10 }
        }
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
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 3 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 3, 3 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 3 }
              }
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
                      range: [ 4, 5 ],
                      loc: {
                        start: { line: 1, column: 4 },
                        end  : { line: 1, column: 5 }
                      }
                    },
                    {
                      type: Syntax.Literal,
                      value: "4",
                      valueType: Token.IntegerLiteral,
                      range: [ 7, 8 ],
                      loc: {
                        start: { line: 1, column: 7 },
                        end  : { line: 1, column: 8 }
                      }
                    },
                    {
                      type: Syntax.Literal,
                      value: "5",
                      valueType: Token.IntegerLiteral,
                      range: [ 10, 11 ],
                      loc: {
                        start: { line: 1, column: 10 },
                        end  : { line: 1, column: 11 }
                      }
                    }
                  ],
                  range: [ 3, 12 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 12 }
                  }
                }
              ]
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 12 }
        }
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
                range: [ 0, 5 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 5 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "[]",
                range: [ 6, 6 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end  : { line: 1, column: 6 }
                }
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
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end  : { line: 1, column: 9 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "2",
                        valueType: Token.IntegerLiteral,
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end  : { line: 1, column: 12 }
                        }
                      },
                    ],
                    range: [ 6, 14 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 14 }
                    }
                  }
                ]
              },
              range: [ 0, 14 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 14 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "at",
              range: [ 15, 17 ],
              loc: {
                start: { line: 1, column: 15 },
                end  : { line: 1, column: 17 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 18, 19 ],
                  loc: {
                    start: { line: 1, column: 18 },
                    end  : { line: 1, column: 19 }
                  }
                }
              ]
            },
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 20 }
            }
          }
        ],
        range: [ 0, 20 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 20 }
        }
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
                range: [ 0, 5 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 5 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "[]",
                range: [ 6, 6 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end  : { line: 1, column: 6 }
                }
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
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end  : { line: 1, column: 9 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "2",
                        valueType: Token.IntegerLiteral,
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end  : { line: 1, column: 12 }
                        }
                      },
                    ],
                    range: [ 6, 14 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 14 }
                    }
                  }
                ]
              },
              range: [ 0, 14 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 14 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 14, 14 ],
              loc: {
                start: { line: 1, column: 14 },
                end  : { line: 1, column: 14 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 15, 16 ],
                  loc: {
                    start: { line: 1, column: 15 },
                    end  : { line: 1, column: 16 }
                  }
                }
              ]
            },
            range: [ 0, 17 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 17 }
            }
          }
        ],
        range: [ 0, 17 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 17 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 4 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 7 }
                  }
                }
              ]
            },
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 8 }
        }
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
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "value",
                range: [ 2, 2 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 2 }
                }
              },
              args: {
                list: []
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 4 }
                  }
                }
              ]
            },
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          }
        ],
        range: [ 0, 5 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 5 }
        }
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
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "value",
                range: [ 2, 2 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 2 }
                }
              },
              args: {
                list: []
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[]",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                    range: [ 3, 4 ],
                    loc: {
                      start: { line: 1, column: 3 },
                      end  : { line: 1, column: 4 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 5, 6 ],
                    loc: {
                      start: { line: 1, column: 5 },
                      end  : { line: 1, column: 6 }
                    }
                  }
                ]
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "value",
                range: [ 2, 2 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 2 }
                }
              },
              args: {
                list: []
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 2 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "[..]",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                null,
                null,
                {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                }
              ]
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 7 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
              range: [ 2, 7 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 7 }
              }
            },
            args: {
              list: [],
              expand: {
                type: Syntax.ListExpression,
                elements: [],
                range: [ 9, 11 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end  : { line: 1, column: 11 }
                }
              }
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 12 }
        }
      }
    },
    "if (x<3) {\\abc} {\\def}": {
      compiled: [
        "SCScript(function($) {",
        "  return $.This().$('x').$('<', [ $.Integer(3) ]).$('if', [ $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Symbol('abc');",
        "      }",
        "    ];",
        "  }), $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Symbol('def');",
        "      }",
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
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              },
              right: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 6, 7 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end  : { line: 1, column: 7 }
                }
              },
              range: [ 4, 7 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 7 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "if",
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 2 }
              }
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
                      range: [ 10, 14 ],
                      loc: {
                        start: { line: 1, column: 10 },
                        end  : { line: 1, column: 14 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 9, 15 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 15 }
                  }
                },
                {
                  type: Syntax.FunctionExpression,
                  body: [
                    {
                      type: Syntax.Literal,
                      value: "def",
                      valueType: Token.SymbolLiteral,
                      range: [ 17, 21 ],
                      loc: {
                        start: { line: 1, column: 17 },
                        end  : { line: 1, column: 21 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 16, 22 ],
                  loc: {
                    start: { line: 1, column: 16 },
                    end  : { line: 1, column: 22 }
                  }
                }
              ]
            },
            range: [ 0, 22 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 22 }
            }
          }
        ],
        range: [ 0, 22 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 22 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "do",
              range: [ 2, 4 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 4 }
              }
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
                          range: [ 8, 9 ],
                          loc: {
                            start: { line: 1, column: 8 },
                            end  : { line: 1, column: 9 }
                          }
                        },
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end  : { line: 1, column: 9 }
                        }
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.CallExpression,
                      callee: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end  : { line: 1, column: 12 }
                        }
                      },
                      method: {
                        type: Syntax.Identifier,
                        name: "play",
                        range: [ 13, 17 ],
                        loc: {
                          start: { line: 1, column: 13 },
                          end  : { line: 1, column: 17 }
                        }
                      },
                      args: {
                        list: []
                      },
                      range: [ 11, 17 ],
                      loc: {
                        start: { line: 1, column: 11 },
                        end  : { line: 1, column: 17 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 6, 19 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 19 }
                  }
                }
              ]
            },
            range: [ 0, 19 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 19 }
            }
          }
        ],
        range: [ 0, 19 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 19 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "do",
              range: [ 2, 4 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 4 }
              }
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
                          range: [ 8, 9 ],
                          loc: {
                            start: { line: 1, column: 8 },
                            end  : { line: 1, column: 9 }
                          }
                        },
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end  : { line: 1, column: 9 }
                        }
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.CallExpression,
                      callee: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end  : { line: 1, column: 12 }
                        }
                      },
                      method: {
                        type: Syntax.Identifier,
                        name: "play",
                        range: [ 13, 17 ],
                        loc: {
                          start: { line: 1, column: 13 },
                          end  : { line: 1, column: 17 }
                        }
                      },
                      args: {
                        list: []
                      },
                      range: [ 11, 17 ],
                      loc: {
                        start: { line: 1, column: 11 },
                        end  : { line: 1, column: 17 }
                      }
                    }
                  ],
                  closed: true,
                  blocklist: true,
                  range: [ 6, 19 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 19 }
                  }
                }
              ]
            },
            range: [ 0, 19 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 19 }
            }
          }
        ],
        range: [ 0, 19 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 19 }
        }
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
        "      }",
        "    ];",
        "  }).$('loop');",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.FunctionExpression,
              body: [
                {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Literal,
                    value: "x",
                    valueType: Token.SymbolLiteral,
                    range: [ 7, 10 ],
                    loc: {
                      start: { line: 1, column: 7 },
                      end  : { line: 1, column: 10 }
                    }
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "postln",
                    range: [ 11, 17 ],
                    loc: {
                      start: { line: 1, column: 11 },
                      end  : { line: 1, column: 17 }
                    }
                  },
                  args: {
                    list: []
                  },
                  range: [ 7, 17 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 17 }
                  }
                },
                {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 19, 20 ],
                    loc: {
                      start: { line: 1, column: 19 },
                      end  : { line: 1, column: 20 }
                    }
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "wait",
                    range: [ 21, 25 ],
                    loc: {
                      start: { line: 1, column: 21 },
                      end  : { line: 1, column: 25 }
                    }
                  },
                  args: {
                    list: []
                  },
                  range: [ 19, 25 ],
                  loc: {
                    start: { line: 1, column: 19 },
                    end  : { line: 1, column: 25 }
                  }
                }
              ],
              blocklist: true,
              range: [ 5, 27 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 27 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "loop",
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 4 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 27 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 27 }
            }
          }
        ],
        range: [ 0, 27 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 27 }
        }
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
            type: Syntax.EnvironmentExpresion,
            id: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 2 }
            }
          },
        ],
        range: [ 0, 2 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 2 }
        }
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
              type: Syntax.EnvironmentExpresion,
              id: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end  : { line: 1, column: 2 }
                }
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 2 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 6 }
              }
            },
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 6 }
        }
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
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 2 }
            }
          }
        ],
        range: [ 0, 2 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 2 }
        }
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
                range: [ 2, 9 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 9 }
                }
              },
              {
                type: Syntax.Literal,
                value: "42",
                valueType: Token.IntegerLiteral,
                range: [ 12, 14 ],
                loc: {
                  start: { line: 1, column: 12 },
                  end  : { line: 1, column: 14 }
                }
              }
            ],
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 16 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.EventExpression,
              elements: [
                {
                  type: Syntax.Literal,
                  value: "a",
                  valueType: Token.SymbolLiteral,
                  range: [ 6, 8 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 8 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end  : { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "b",
                  valueType: Token.SymbolLiteral,
                  range: [ 12, 14 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end  : { line: 1, column: 14 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 15, 16 ],
                  loc: {
                    start: { line: 1, column: 15 },
                    end  : { line: 1, column: 16 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 18, 19 ],
                  loc: {
                    start: { line: 1, column: 18 },
                    end  : { line: 1, column: 19 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 21, 22 ],
                  loc: {
                    start: { line: 1, column: 21 },
                    end  : { line: 1, column: 22 }
                  }
                }
              ],
              range: [ 4, 24 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 24 }
              }
            },
            range: [ 0, 24 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 24 }
            }
          }
        ],
        range: [ 0, 24 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 24 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.EventExpression,
              elements: [
                {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end  : { line: 1, column: 11 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 13, 14 ],
                  loc: {
                    start: { line: 1, column: 13 },
                    end  : { line: 1, column: 14 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 17, 18 ],
                  loc: {
                    start: { line: 1, column: 17 },
                    end  : { line: 1, column: 18 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "c",
                  range: [ 20, 21 ],
                  loc: {
                    start: { line: 1, column: 20 },
                    end  : { line: 1, column: 21 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 24, 25 ],
                  loc: {
                    start: { line: 1, column: 24 },
                    end  : { line: 1, column: 25 }
                  }
                }
              ],
              range: [ 4, 27 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 27 }
              }
            },
            range: [ 0, 27 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 27 }
            }
          }
        ],
        range: [ 0, 27 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 27 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
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
                    range: [ 5, 6 ],
                    loc: {
                      start: { line: 1, column: 5 },
                      end  : { line: 1, column: 6 }
                    }
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 9, 10 ],
                    loc: {
                      start: { line: 1, column: 9 },
                      end  : { line: 1, column: 10 }
                    }
                  },
                  range: [ 5, 10 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 12, 13 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end  : { line: 1, column: 13 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 15, 16 ],
                  loc: {
                    start: { line: 1, column: 15 },
                    end  : { line: 1, column: 16 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                  range: [ 18, 19 ],
                  loc: {
                    start: { line: 1, column: 18 },
                    end  : { line: 1, column: 19 }
                  }
                }
              ],
              range: [ 4, 20 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 20 }
              }
            },
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 20 }
            }
          }
        ],
        range: [ 0, 20 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 20 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
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
                      range: [ 4, 5 ],
                      loc: {
                        start: { line: 1, column: 4 },
                        end  : { line: 1, column: 5 }
                      }
                    },
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end  : { line: 1, column: 5 }
                    }
                  },
                  {
                    type: Syntax.VariableDeclarator,
                    id: {
                      type: Syntax.Identifier,
                      name: "$_1",
                      range: [ 8, 9 ],
                      loc: {
                        start: { line: 1, column: 8 },
                        end  : { line: 1, column: 9 }
                      }
                    },
                    range: [ 8, 9 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end  : { line: 1, column: 9 }
                    }
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
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end  : { line: 1, column: 5 }
                    }
                  },
                  right: {
                    type: Syntax.Identifier,
                    name: "$_1",
                    range: [ 8, 9 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end  : { line: 1, column: 9 }
                    }
                  },
                  range: [ 4, 9 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 9 }
                  }
                }
              ],
              partial: true,
              range: [ 4, 9 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
                    range: [ 2, 3 ],
                    loc: {
                      start: { line: 1, column: 2 },
                      end  : { line: 1, column: 3 }
                    }
                  },
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
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
                      end  : { line: 1, column: 6 }
                    }
                  },
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
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
                      end  : { line: 1, column: 3 }
                    }
                  },
                  {
                    type: Syntax.Identifier,
                    name: "$_1",
                    range: [ 5, 6 ],
                    loc: {
                      start: { line: 1, column: 5 },
                      end  : { line: 1, column: 6 }
                    }
                  }
                ],
                range: [ 0, 8 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 8 }
                }
              }
            ],
            partial: true,
            range: [ 0, 8 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 8 }
            }
          }
        ],
        range: [ 0, 8 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 8 }
        }
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
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              }
            ],
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
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
                  range: [ 11, 12 ],
                  loc: {
                    start: { line: 1, column: 11 },
                    end  : { line: 1, column: 12 }
                  }
                },
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end  : { line: 1, column: 12 }
                }
              }
            ],
            range: [ 7, 12 ],
            loc: {
              start: { line: 1, column: 7 },
              end  : { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 13 }
        }
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
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              }
            ],
            range: [ 0, 5 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 5 }
            }
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end  : { line: 1, column: 8 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 11, 13 ],
              loc: {
                start: { line: 1, column: 11 },
                end  : { line: 1, column: 13 }
              }
            },
            range: [ 7, 13 ],
            loc: {
              start: { line: 1, column: 7 },
              end  : { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 14 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 14 }
        }
      }
    },
    "(var a; a = 10;)": {
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
                  range: [ 5, 6 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 6 }
                  }
                },
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              }
            ],
            range: [ 1, 6 ],
            loc: {
              start: { line: 1, column: 1 },
              end  : { line: 1, column: 6 }
            }
          },
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 8, 9 ],
              loc: {
                start: { line: 1, column: 8 },
                end  : { line: 1, column: 9 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 12, 14 ],
              loc: {
                start: { line: 1, column: 12 },
                end  : { line: 1, column: 14 }
              }
            },
            range: [ 8, 14 ],
            loc: {
              start: { line: 1, column: 8 },
              end  : { line: 1, column: 14 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 16 }
        }
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
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
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
                            range: [ 14, 15 ],
                            loc: {
                              start: { line: 1, column: 14 },
                              end  : { line: 1, column: 15 }
                            }
                          },
                          range: [ 14, 15 ],
                          loc: {
                            start: { line: 1, column: 14 },
                            end  : { line: 1, column: 15 }
                          }
                        }
                      ],
                      range: [ 10, 15 ],
                      loc: {
                        start: { line: 1, column: 10 },
                        end  : { line: 1, column: 15 }
                      }
                    },
                    {
                      type: Syntax.Identifier,
                      name: "a",
                      range: [ 17, 18 ],
                      loc: {
                        start: { line: 1, column: 17 },
                        end  : { line: 1, column: 18 }
                      }
                    }
                  ],
                  range: [ 8, 20 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end  : { line: 1, column: 20 }
                  }
                },
                range: [ 4, 20 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 20 }
                }
              }
            ],
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 20 }
            }
          },
          {
            type: Syntax.Identifier,
            name: "a",
            range: [ 22, 23 ],
            loc: {
              start: { line: 1, column: 22 },
              end  : { line: 1, column: 23 }
            }
          }
        ],
        range: [ 0, 23 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 23 }
        }
      }
    },
    "this": {
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
            range: [ 0, 4 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 4 }
            }
          }
        ],
        range: [ 0, 4 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 4 }
        }
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
              range: [ 0, 11 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 11 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "platform",
              range: [ 12, 20 ],
              loc: {
                start: { line: 1, column: 12 },
                end  : { line: 1, column: 20 }
              }
            },
            args: {
              list: []
            },
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 20 }
            }
          }
        ],
        range: [ 0, 21 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 21 }
        }
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
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            method: {
              type: Syntax.Identifier,
              name: "value",
              range: [ 2, 2 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Identifier,
                  name: "Class",
                  range: [ 3, 8 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end  : { line: 1, column: 8 }
                  }
                }
              ]
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 9 }
        }
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
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 15 }
        }
      }
    },
    '"\\#{}##{{69.midicps}.value}#{}hz"': {
      compiled: [
        "SCScript(function($) {",
        "  return $.String('\\#{}#').$('++', [ $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Integer(69).$('midicps');",
        "      }",
        "    ];",
        "  }).$('value').$('asString') ]).$('++', [ $.String('hz') ]);",
        "});",
      ],
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "++",
            left: {
              type: Syntax.BinaryExpression,
              operator: "++",
              left: {
                type: Syntax.Literal,
                value: "\\#{}#",
                valueType: Token.StringLiteral
              },
              right: {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.FunctionExpression,
                    body: [
                      {
                        type: Syntax.CallExpression,
                        callee: {
                          type: Syntax.Literal,
                          value: "69",
                          valueType: Token.IntegerLiteral
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "midicps"
                        },
                        args: {
                          list: []
                        }
                      }
                    ]
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "value"
                  },
                  args: {
                    list: []
                  }
                },
                method: {
                  type: Syntax.Identifier,
                  name: "asString"
                },
                args: {
                  list: []
                }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "hz",
              valueType: Token.StringLiteral
            },
            range: [ 0, 33 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 33 }
            }
          }
        ],
        range: [ 0, 33 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 33 }
        }
      }
    },
    "{ neg(a.value) }": {
      compiled: [
        "SCScript(function($) {",
        "  return $.Function(function() {",
        "    return [",
        "      function() {",
        "        return $.Value(0, $.This().$('a').$('value'));",
        "      },",
        "      function() {",
        "        return $.Result(0).$('neg');",
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
            body: [
              {
                type: Syntax.CallExpression,
                stamp: "(",
                callee: {
                  type: Syntax.CallExpression,
                  callee: {
                    type: Syntax.Identifier,
                    name: "a",
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end  : { line: 1, column: 7 }
                    }
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "value",
                    range: [ 8, 13 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end  : { line: 1, column: 13 }
                    }
                  },
                  args: {
                    list: []
                  },
                  range: [ 6, 13 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end  : { line: 1, column: 13 }
                  }
                },
                method: {
                  type: Syntax.Identifier,
                  name: "neg",
                  range: [ 2, 5 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 5 }
                  }
                },
                args: {
                  list: []
                },
                range: [ 2, 14 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 14 }
                }
              }
            ],
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end  : { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end  : { line: 1, column: 16 }
        }
      }
    }
  };

  sc.test.compiler = {
    cases: cases
  };

})();

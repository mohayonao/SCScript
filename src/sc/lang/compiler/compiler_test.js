(function() {
  "use strict";

  require("./");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler", function() {
    it(".tokenize", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();
      var Lexer$tokenize = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "Lexer").withArgs(source, opts).returns({
        tokenize: Lexer$tokenize
      });

      var test = sc.lang.compiler.tokenize(source, opts);

      expect(sc.lang.compiler.Lexer).to.be.calledWithNew;
      expect(Lexer$tokenize).to.be.calledLastIn(test);
    }));
    it(".parse", sinon.test(function() {
      var source = Math.random();
      var opts = Math.random();
      var lexer = { name: "Lexer" };
      var Parser$parse = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "Lexer").withArgs(source, opts).returns(lexer);
      this.stub(sc.lang.compiler, "Parser").withArgs(null, lexer).returns({
        parse: Parser$parse
      });

      var test = sc.lang.compiler.parse(source, opts);

      expect(sc.lang.compiler.Lexer).to.be.calledWithNew;
      expect(sc.lang.compiler.Parser).to.be.calledWithNew;
      expect(Parser$parse).to.be.calledLastIn(test);
    }));
    it(".compile given string", sinon.test(function() {
      var source = String(Math.random());
      var opts = Math.random();
      var ast1 = Math.random();
      var ast2 = Math.random();
      var Rewriter$rewrite = this.spy(function() {
        return ast2;
      });
      var CodeGen$compile = this.spy(sc.test.func());

      this.stub(sc.lang.compiler, "parse").withArgs(source).returns(ast1);
      this.stub(sc.lang.compiler, "Rewriter").withArgs().returns({
        rewrite: Rewriter$rewrite
      });
      this.stub(sc.lang.compiler, "CodeGen").withArgs(null, opts).returns({
        compile: CodeGen$compile
      });

      var test = sc.lang.compiler.compile(source, opts);

      expect(sc.lang.compiler.parse).to.be.calledWith(source, opts);
      expect(sc.lang.compiler.Rewriter).to.be.calledWithNew;
      expect(Rewriter$rewrite).to.be.calledWith(ast1);
      expect(sc.lang.compiler.CodeGen).to.be.calledWithNew;
      expect(CodeGen$compile).to.be.calledWith(ast2);
      expect(CodeGen$compile).to.be.calledLastIn(test);
    }));
    it(".compile given ast", sinon.test(function() {
      var opts = Math.random();
      var ast1 = Math.random();
      var ast2 = Math.random();
      var Rewriter$rewrite = this.spy(function() {
        return ast2;
      });
      var CodeGen$compile = this.spy(sc.test.func());

      this.spy(sc.lang.compiler, "parse");
      this.stub(sc.lang.compiler, "Rewriter").withArgs().returns({
        rewrite: Rewriter$rewrite
      });
      this.stub(sc.lang.compiler, "CodeGen").withArgs(null, opts).returns({
        compile: CodeGen$compile
      });

      var test = sc.lang.compiler.compile(ast1, opts);

      expect(sc.lang.compiler.parse).to.be.not.called;
      expect(sc.lang.compiler.Rewriter).to.be.calledWithNew;
      expect(Rewriter$rewrite).to.be.calledWith(ast1);
      expect(sc.lang.compiler.CodeGen).to.be.calledWithNew;
      expect(CodeGen$compile).to.be.calledWith(ast2);
      expect(CodeGen$compile).to.be.calledLastIn(test);
    }));
    describe("combined test", function() {
      _.chain({
        "": {
          expected: [ "" ],
          ast: {
            type: Syntax.Program,
            body: [],
          }
        },
        "    \n\t": {
          expected: [ "" ],
          ast: {
            type: Syntax.Program,
            body: [],
          }
        },
        "// single line comment\n": {
          expected: [ "" ] ,
          ast: {
            type: Syntax.Program,
            body: [],
          }
        },
        "/*\n/* / * */\n*/": {
          expected: [ "" ],
          ast: {
            type: Syntax.Program,
            body: [],
          }
        },
        "-10pi": {
          expected: [
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('neg');",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('neg').$('abs');",
            "});",
          ],
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.CallExpression,
                stamp: "(",
                callee: {
                  type: Syntax.CallExpression,
                  stamp: "(",
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
                  }
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
        "#[ [] ]": {
          expected: [
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
        "a = 2pi": {
          expected: [
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
        "a.b.c = 1": {
          expected: [
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
                stamp: "=",
                callee: {
                  type: Syntax.CallExpression,
                  stamp: "(",
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
        "a[0] = 1": {
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('put', [ $.Integer(0), $.Integer(1) ]);",
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
                  name: "put",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('putSeries', [ " +
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
                  name: "putSeries",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('putSeries', [ " +
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
                  name: "putSeries",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('putSeries', [ " +
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
                  name: "putSeries",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('putSeries', [ " +
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
                  name: "putSeries",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('putSeries', [ " +
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
                  name: "putSeries",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('putSeries', [ " +
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
                  name: "putSeries",
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
          expected: [
            "SCScript(function($) {",
            "  return $.This().$('a').$('copySeries', [ " +
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
                  name: "copySeries",
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
          expected: [
            "SCScript(function($) {",
            "  var _ref0;",
            "  return $.This().$('a').$('at', [ " +
              "($.This().$('b').$('put', [ (" +
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
                  name: "at",
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
                          name: "put",
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
        "(0;1, 2;3..4;5)": {
          expected: [
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
        "{|x=1| var a = x * x; a * a; }": {
          expected: [
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
        "var level=0, slope=1, curve=1;": {
          expected: [
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
          expected: [
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
        "{ |x, y| var a; a = x + y; x.wait; a }": {
          expected: [
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
            "  }, 'x;y');",
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
                    stamp: "(",
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
          expected: [
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
          expected: [
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
        "max(0; 1, 2; 3, 4; 5, a: 6; 7, b: 8; 9)": {
          expected: [
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
          expected: [
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
        "Point(3, 4)": {
          expected: [
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
          expected: [
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
        "Point.new": {
          expected: [
            "SCScript(function($) {",
            "  return $('Point').$('new');",
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
                  list: []
                },
              }
            ],
          }
        },
        "Set[3, 4, 5]": {
          expected: [
            "SCScript(function($) {",
            "  return $('Set').$('at', [ $.Array([",
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
                  name: "at",
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
          expected: [
            "SCScript(function($) {",
            "  return $('Array').$('at', [ $.Array([",
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
                stamp: "(",
                callee: {
                  type: Syntax.CallExpression,
                  stamp: "[",
                  callee: {
                    type: Syntax.Identifier,
                    name: "Array",
                  },
                  method: {
                    type: Syntax.Identifier,
                    name: "at",
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
          expected: [
            "SCScript(function($) {",
            "  return $('Array').$('at', [ $.Array([",
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
                    name: "at",
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
        "~a": {
          expected: [
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
          expected: [
            "SCScript(function($) {",
            "  return $.Environment('a').$('abs');",
            "});"
          ],
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.CallExpression,
                stamp: "(",
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
          expected: [
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
        "x = (1 + 2: 3, 4: 5)": {
          expected: [
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
          expected: [
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
                  partial: true,
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
                },
              }
            ],
          }
        },
        "var a; var b;": {
          expected: [
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
        "var a = { var a; a }; a": {
          expected: [
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
        "{ (..10).do(_.yield) }": {
          expected: [
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
                    stamp: "(",
                    callee: {
                      type: Syntax.CallExpression,
                      stamp: "(",
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
                              stamp: "(",
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
      }).pairs().each(function(items) {
        var code = items[0];
        var ast  = items[1].ast;
        var expected = items[1].expected;
        it("ast:" + code, function() {
          var test = sc.lang.compiler.parse(code);
          expect(test).to.eql(ast);
        });
        it("compile:" + code, function() {
          var expectedAST = esprima.parse(expected.join("\n"));
          var compiled  = sc.lang.compiler.compile(code);
          var actualAST = esprima.parse(compiled);
          expect(actualAST).to.eql(expectedAST);
        });
      });
    });
  });
})();

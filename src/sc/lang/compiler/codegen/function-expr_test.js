(function() {
  "use strict";

  require("./installer");

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;

  describe("sc.lang.compiler.CodeGen", function() {
    describe("Value", function() {
      sc.test.codegen().each([
        {
          code: "{}",
          expected: "$.Function(function() { return []; })",
          ast: {
            type: Syntax.FunctionExpression,
            body: []
          }
        },
        {
          code: "#{}",
          expected: "$.Function(function() { return []; }, '', true)",
          ast: {
            type: Syntax.FunctionExpression,
            closed: true,
            body: []
          }
        },
        {
          code: "{|a,b|}",
          expected: "$.Function(function() { return []; }, 'a;b')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b"
                  }
                }
              ]
            },
            body: []
          }
        },
        {
          code: "{|a=0,b=1.0,c=$c,d=\\d}",
          expected: "$.Function(function() { return []; }, 'a=0;b=1.0;c=$c;d=\\d')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1.0",
                    valueType: Token.FloatLiteral
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "c",
                    valueType: Token.CharLiteral
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "d"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "d",
                    valueType: Token.SymbolLiteral
                  }
                }
              ]
            },
            body: []
          }
        },
        {
          code: "{|a=nil,b=true,c=false}",
          expected: "$.Function(function() { return []; }, 'a=nil;b=true;c=false')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "nil",
                    valueType: Token.NilLiteral
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "true",
                    valueType: Token.TrueLiteral
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "c"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "false",
                    valueType: Token.FalseLiteral
                  }
                }
              ]
            },
            body: []
          }
        },
        {
          code: "{|a=inf,b=-inf}",
          expected: "$.Function(function() { return []; }, 'a=inf;b=-inf')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "Infinity",
                    valueType: Token.FloatLiteral
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "b"
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "-Infinity",
                    valueType: Token.FloatLiteral
                  }
                }
              ]
            },
            body: []
          }
        },
        {
          code: "{|a=#[0,1,2]}",
          expected: "$.Function(function() { return []; }, 'a=[0,1,2]')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  },
                  init: {
                    type: Syntax.ListExpression,
                    elements:[
                      {
                        type: Syntax.Literal,
                        value: "0",
                        valueType: Token.IntegerLiteral
                      },
                      {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral
                      },
                      {
                        type: Syntax.Literal,
                        value: "2",
                        valueType: Token.IntegerLiteral
                      }
                    ]
                  }
                }
              ]
            },
            body: []
          }
        },
        {
          code: "{|*a|}",
          expected: "$.Function(function() { return []; }, '*a')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [],
              remain: {
                type: Syntax.Identifier,
                name: "a"
              }
            },
            body: []
          }
        },
        {
          code: "{|a,*b|}",
          expected: "$.Function(function() { return []; }, 'a;*b')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  }
                }
              ],
              remain: {
                type: Syntax.Identifier,
                name: "b"
              }
            },
            body: []
          }
        },
        {
          code: "{ nil; nil }",
          expected: "$.Function(function() {" +
                    "  return [" +
                    "    function() {" +
                    "      $.Nil();" +
                    "      return $.Nil();" +
                    "    }," +
                    "    $.NOP" +
                    "  ]; " +
                    "})",
          ast: {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral
              },
              {
                type: Syntax.Literal,
                value: "nil",
                valueType: Token.NilLiteral
              }
            ]
          }
        },
        {
          code: "{ a0.value; a1.value }",
          expected: "$.Function(function() {" +
                    "  return [" +
                    "    function() {" +
                    "      return $a0.$('value');" +
                    "    }," +
                    "    function() {" +
                    "      return $a1.$('value');" +
                    "    }," +
                    "    $.NOP" +
                    "  ]; " +
                    "})",
          ast: {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                segmented: true,
                callee: {
                  type: Syntax.Identifier,
                  name: "a0"
                },
                method: {
                  type: Syntax.Identifier,
                  name: "value"
                },
                args: {
                  list: []
                }
              },
              {
                type: Syntax.CallExpression,
                segmented: true,
                callee: {
                  type: Syntax.Identifier,
                  name: "a1"
                },
                method: {
                  type: Syntax.Identifier,
                  name: "value"
                },
                args: {
                  list: []
                }
              }
            ]
          }
        },
        {
          code: "{ |a| a }",
          expected: "$.Function(function() {" +
                    "  var $a;" +
                    "  return [" +
                    "    function(_arg0) {" +
                    "      $a = _arg0;" +
                    "      return $a;" +
                    "    }," +
                    "    function() {" +
                    "      $a = null;" +
                    "    }" +
                    "  ]; " +
                    "}, 'a')",
          ast: {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "a"
                  }
                }
              ]
            },
            body: [
              {
                type: Syntax.Identifier,
                name: "a",
              }
            ]
          }
        },
        {
          code: "[_, _]",
          expected: "$.Function(function() {" +
                    "  var $_0, $_1;" +
                    "  return [" +
                    "    function(_arg0, _arg1) {" +
                    "      $_0 = _arg0;" +
                    "      $_1 = _arg1;" +
                    "      return $.Array([ $_0, $_1, ]);" +
                    "    }," +
                    "    function() {" +
                    "      $_0 = $_1 = null;" +
                    "    }" +
                    "  ]; " +
                    "})",
          ast: {
            type: Syntax.FunctionExpression,
            partial: true,
            args: {
              list: [
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "$_0"
                  }
                },
                {
                  type: Syntax.VariableDeclarator,
                  id: {
                    type: Syntax.Identifier,
                    name: "$_1"
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
                    name: "$_0"
                  },
                  {
                    type: Syntax.Identifier,
                    name: "$_1"
                  }
                ]
              }
            ]
          }
        },
      ]);
    });
  });
})();

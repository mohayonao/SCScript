describe("sc.lang.compiler.Parser", function() {
  "use strict";

  var Syntax = sc.lang.compiler.Syntax;
  var Token = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var strlib = sc.libs.strlib;

  describe("parseGeneratorExpression", function() {
    sc.test.compile(this.title).each({
      "{: a, a <- 3 }": sc.test.OK,
      "{: [ a, b ], a b <- 3 }": sc.test.OK,
      "{: a, var b = 3, a <- b }": sc.test.OK,
      "{: a, a <- 7, a.odd }": sc.test.OK,
      "{: a, a <- 3, ::a.postln }": sc.test.OK,
      "{: a, a <- 10, :while a < 3 }": sc.test.OK,
      "{: a, a <- 10, :until a < 3 }": strlib.format(Message.UnexpectedIdentifier, "until"),
    });

    sc.test.parse(this.title).each({
      "{: a, a <- 3 }": {
        type: Syntax.CallExpression,
        stamp: "(",
        callee: {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "do"
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
                            name: "a",
                            range: [ 6, 7 ],
                            loc: {
                              start: { line: 1, column: 6 },
                              end: { line: 1, column: 7 }
                            }
                          }
                        }
                      ]
                    },
                    body: [
                      {
                        type: Syntax.CallExpression,
                        stamp: "(",
                        callee: {
                          type: Syntax.Identifier,
                          name: "a",
                          range: [ 3, 4 ],
                          loc: {
                            start: { line: 1, column: 3 },
                            end: { line: 1, column: 4 }
                          }
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "yield"
                        },
                        args: {
                          list: []
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        method: {
          type: Syntax.Identifier,
          name: "r"
        },
        args: {
          list: []
        }
      },
      "{: [ a, b ], a b <- 3 }": {
        type: Syntax.CallExpression,
        stamp: "(",
        callee: {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 20, 21 ],
                loc: {
                  start: { line: 1, column: 20 },
                  end: { line: 1, column: 21 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "do"
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
                            name: "a",
                            range: [ 13, 14 ],
                            loc: {
                              start: { line: 1, column: 13 },
                              end: { line: 1, column: 14 }
                            }
                          }
                        },
                        {
                          type: Syntax.VariableDeclarator,
                          id: {
                            type: Syntax.Identifier,
                            name: "b",
                            range: [ 15, 16 ],
                            loc: {
                              start: { line: 1, column: 15 },
                              end: { line: 1, column: 16 }
                            }
                          }
                        }
                      ]
                    },
                    body: [
                      {
                        type: Syntax.CallExpression,
                        stamp: "(",
                        callee: {
                          type: Syntax.ListExpression,
                          elements: [
                            {
                              type: Syntax.Identifier,
                              name: "a",
                              range: [ 5, 6 ],
                              loc: {
                                start: { line: 1, column: 5 },
                                end: { line: 1, column: 6 }
                              }
                            },
                            {
                              type: Syntax.Identifier,
                              name: "b",
                              range: [ 8, 9 ],
                              loc: {
                                start: { line: 1, column: 8 },
                                end: { line: 1, column: 9 }
                              }
                            }
                          ],
                          range: [ 3, 11 ],
                          loc: {
                            start: { line: 1, column: 3 },
                            end: { line: 1, column: 11 }
                          }
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "yield"
                        },
                        args: {
                          list: []
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        method: {
          type: Syntax.Identifier,
          name: "r"
        },
        args: {
          list: []
        }
      },
      "{: a, var b = 3, a <- b }": {
        type: Syntax.CallExpression,
        stamp: "(",
        callee: {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.FunctionExpression,
                args: {
                  list: [
                    {
                      type: Syntax.VariableDeclarator,
                      id: {
                        type: Syntax.Identifier,
                        name: "b",
                        range: [ 10, 11 ],
                        loc: {
                          start: { line: 1, column: 10 },
                          end: { line: 1, column: 11 }
                        }
                      }
                    }
                  ]
                },
                body: [
                  {
                    type: Syntax.CallExpression,
                    stamp: "(",
                    callee: {
                      type: Syntax.Identifier,
                      name: "b",
                      range: [ 22, 23 ],
                      loc: {
                        start: { line: 1, column: 22 },
                        end: { line: 1, column: 23 }
                      }
                    },
                    method: {
                      type: Syntax.Identifier,
                      name: "do"
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
                                  name: "a",
                                  range: [ 17, 18 ],
                                  loc: {
                                    start: { line: 1, column: 17 },
                                    end: { line: 1, column: 18 }
                                  }
                                }
                              }
                            ]
                          },
                          body: [
                            {
                              type: Syntax.CallExpression,
                              stamp: "(",
                              callee: {
                                type: Syntax.Identifier,
                                name: "a",
                                range: [ 3, 4 ],
                                loc: {
                                  start: { line: 1, column: 3 },
                                  end: { line: 1, column: 4 }
                                }
                              },
                              method: {
                                type: Syntax.Identifier,
                                name: "yield"
                              },
                              args: {
                                list: []
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              method: {
                type: Syntax.Identifier,
                name: "value"
              },
              args: {
                list: [
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 14, 15 ],
                    loc: {
                      start: { line: 1, column: 14 },
                      end: { line: 1, column: 15 }
                    }
                  }
                ]
              }
            }
          ]
        },
        method: {
          type: Syntax.Identifier,
          name: "r"
        },
        args: {
          list: []
        }
      },
      "{: a, a <- 7, a.odd }": {
        type: Syntax.CallExpression,
        stamp: "(",
        callee: {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "7",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "do"
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
                            name: "a",
                            range: [ 6, 7 ],
                            loc: {
                              start: { line: 1, column: 6 },
                              end: { line: 1, column: 7 }
                            }
                          }
                        }
                      ]
                    },
                    body: [
                      {
                        type: Syntax.CallExpression,
                        stamp: "(",
                        callee: {
                          type: Syntax.CallExpression,
                          stamp: ".",
                          callee: {
                            type: Syntax.Identifier,
                            name: "a",
                            range: [ 14, 15 ],
                            loc: {
                              start: { line: 1, column: 14 },
                              end: { line: 1, column: 15 }
                            }
                          },
                          method: {
                            type: Syntax.Identifier,
                            name: "odd",
                            range: [ 16, 19 ],
                            loc: {
                              start: { line: 1, column: 16 },
                              end: { line: 1, column: 19 }
                            }
                          },
                          args: {
                            list: []
                          },
                          range: [ 14, 19 ],
                          loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 19 }
                          }
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "if"
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
                                    type: Syntax.Identifier,
                                    name: "a",
                                    range: [ 3, 4 ],
                                    loc: {
                                      start: { line: 1, column: 3 },
                                      end: { line: 1, column: 4 }
                                    }
                                  },
                                  method: {
                                    type: Syntax.Identifier,
                                    name: "yield"
                                  },
                                  args: {
                                    list: []
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        method: {
          type: Syntax.Identifier,
          name: "r"
        },
        args: {
          list: []
        }
      },
      "{: a, a <- 3, ::a.postln }": {
        type: Syntax.CallExpression,
        stamp: "(",
        callee: {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "do"
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
                            name: "a",
                            range: [ 6, 7 ],
                            loc: {
                              start: { line: 1, column: 6 },
                              end: { line: 1, column: 7 }
                            }
                          }
                        }
                      ]
                    },
                    body: [
                      [
                        {
                          type: Syntax.CallExpression,
                          stamp: ".",
                          callee: {
                            type: Syntax.Identifier,
                            name: "a",
                            range: [ 16, 17 ],
                            loc: {
                              start: { line: 1, column: 16 },
                              end: { line: 1, column: 17 }
                            }
                          },
                          method: {
                            type: Syntax.Identifier,
                            name: "postln",
                            range: [ 18, 24 ],
                            loc: {
                              start: { line: 1, column: 18 },
                              end: { line: 1, column: 24 }
                            }
                          },
                          args: {
                            list: []
                          },
                          range: [ 16, 24 ],
                          loc: {
                            start: { line: 1, column: 16 },
                            end: { line: 1, column: 24 }
                          }
                        },
                        {
                          type: Syntax.CallExpression,
                          stamp: "(",
                          callee: {
                            type: Syntax.Identifier,
                            name: "a",
                            range: [ 3, 4 ],
                            loc: {
                              start: { line: 1, column: 3 },
                              end: { line: 1, column: 4 }
                            }
                          },
                          method: {
                            type: Syntax.Identifier,
                            name: "yield"
                          },
                          args: {
                            list: []
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          ]
        },
        method: {
          type: Syntax.Identifier,
          name: "r"
        },
        args: {
          list: []
        }
      },
      "{: a, a <- 10, :while a < 3 }": {
        type: Syntax.CallExpression,
        stamp: "(",
        callee: {
          type: Syntax.FunctionExpression,
          body: [
            {
              type: Syntax.CallExpression,
              stamp: "(",
              callee: {
                type: Syntax.Literal,
                value: "10",
                valueType: Token.IntegerLiteral,
                range: [ 11, 13 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 13 }
                }
              },
              method: {
                type: Syntax.Identifier,
                name: "do"
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
                            name: "a",
                            range: [ 6, 7 ],
                            loc: {
                              start: { line: 1, column: 6 },
                              end: { line: 1, column: 7 }
                            }
                          }
                        }
                      ]
                    },
                    body: [
                      {
                        type: Syntax.CallExpression,
                        stamp: "(",
                        callee: {
                          type: Syntax.BinaryExpression,
                          operator: "<",
                          left: {
                            type: Syntax.Identifier,
                            name: "a",
                            range: [ 22, 23 ],
                            loc: {
                              start: { line: 1, column: 22 },
                              end: { line: 1, column: 23 }
                            }
                          },
                          right: {
                            type: Syntax.Literal,
                            value: "3",
                            valueType: Token.IntegerLiteral,
                            range: [ 26, 27 ],
                            loc: {
                              start: { line: 1, column: 26 },
                              end: { line: 1, column: 27 }
                            }
                          },
                          range: [ 22, 27 ],
                          loc: {
                            start: { line: 1, column: 22 },
                            end: { line: 1, column: 27 }
                          }
                        },
                        method: {
                          type: Syntax.Identifier,
                          name: "if"
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
                                    type: Syntax.Identifier,
                                    name: "a",
                                    range: [ 3, 4 ],
                                    loc: {
                                      start: { line: 1, column: 3 },
                                      end: { line: 1, column: 4 }
                                    }
                                  },
                                  method: {
                                    type: Syntax.Identifier,
                                    name: "yield"
                                  },
                                  args: {
                                    list: []
                                  }
                                }
                              ]
                            },
                            {
                              type: Syntax.FunctionExpression,
                              body: [
                                {
                                  type: Syntax.CallExpression,
                                  stamp: "(",
                                  callee: {
                                    type: Syntax.Literal,
                                    value: "nil",
                                    valueType: Token.NilLiteral
                                  },
                                  method: {
                                    type: Syntax.Identifier,
                                    name: "alwaysYield"
                                  },
                                  args: {
                                    list: []
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        method: {
          type: Syntax.Identifier,
          name: "r"
        },
        args: {
          list: []
        }
      },
    });
  });
});

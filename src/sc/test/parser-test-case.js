(function(sc) {
  "use strict";

  require("../lang/parser");

  var Token  = sc.lang.parser.Token;
  var Syntax = sc.lang.parser.Syntax;

  var q = function(str) {
    return "'" + str + "'";
  };

  var cases = {
    "": {
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
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.Literal,
            value: "(-10 * Math.PI)",
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
    "`100": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.UnaryExpression,
            operator: "`",
            arg: {
              type: Syntax.Literal,
              value: "100",
              valueType: Token.IntegerLiteral,
              range: [ 1, 4 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 4 }
              }
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
      }
    },
    "a -.f b": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.BinaryExpression,
            operator: "-",
            adverb  : {
              type: Syntax.Identifier,
              name: "f",
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
    "[ a: 1, 2: 3]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ListExpression,
            elements: [
              {
                type: Syntax.Label,
                name: "a",
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
    "a = 2pi": {
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
              value: "(2 * Math.PI)",
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
    "a.b.c = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 0, 1 ],
                  loc: {
                    start: { line: 1, column: 0 },
                    end  : { line: 1, column: 1 }
                  }
                },
                property: {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                range: [ 0, 3 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 3 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "c",
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end  : { line: 1, column: 5 }
                }
              },
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 5 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
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
    "a[0] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 4 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
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
    "a[5..10] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.ListIndexer,
                first: {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                second: null,
                last: {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral,
                  range: [ 5, 7 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end  : { line: 1, column: 7 }
                  }
                },
                range: [ 2, 7 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 7 }
                }
              },
              range: [ 0, 8 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 8 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 11, 12 ],
              loc: {
                start: { line: 1, column: 11 },
                end  : { line: 1, column: 12 }
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
    "a[7,9..13] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.ListIndexer,
                first: {
                  type: Syntax.Literal,
                  value: "7",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                second: {
                  type: Syntax.Literal,
                  value: "9",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                last: {
                  type: Syntax.Literal,
                  value: "13",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 9 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end  : { line: 1, column: 9 }
                  }
                },
                range: [ 2, 9 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 9 }
                }
              },
              range: [ 0, 10 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 10 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 13, 14 ],
              loc: {
                start: { line: 1, column: 13 },
                end  : { line: 1, column: 14 }
              }
            },
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
    "a[..5] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.ListIndexer,
                first: null,
                second: null,
                last: {
                  type: Syntax.Literal,
                  value: "5",
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
              },
              range: [ 0, 6 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 6 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 9, 10 ],
              loc: {
                start: { line: 1, column: 9 },
                end  : { line: 1, column: 10 }
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
    "a[12..] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.ListIndexer,
                first: {
                  type: Syntax.Literal,
                  value: "12",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 4 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 4 }
                  }
                },
                second: null,
                last: null,
                range: [ 2, 6 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 6 }
                }
              },
              range: [ 0, 7 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 7 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 10, 11 ],
              loc: {
                start: { line: 1, column: 10 },
                end  : { line: 1, column: 11 }
              }
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
    "a[1,3..] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.ListIndexer,
                first: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 2, 3 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 3 }
                  }
                },
                second: {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end  : { line: 1, column: 5 }
                  }
                },
                last: null,
                range: [ 2, 7 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 7 }
                }
              },
              range: [ 0, 8 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 8 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 11, 12 ],
              loc: {
                start: { line: 1, column: 11 },
                end  : { line: 1, column: 12 }
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
    "a[..] = 1": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.MemberExpression,
              computed: true,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end  : { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.ListIndexer,
                first: null,
                second: null,
                last: null,
                range: [ 2, 4 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 4 }
                }
              },
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 5 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
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
    "a[..]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: null,
              second: null,
              last: null,
              range: [ 2, 4 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 4 }
              }
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
    "a[..3]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: null,
              second: null,
              last: {
                type: Syntax.Literal,
                value: "3",
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
    "a[3..]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              second: null,
              last: null,
              range: [ 2, 5 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 5 }
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
    "a[2..4]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              second: null,
              last: {
                type: Syntax.Literal,
                value: "4",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              },
              range: [ 2, 6 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 6 }
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
    "a[4..2]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: {
                type: Syntax.Literal,
                value: "4",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              second: null,
              last: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              },
              range: [ 2, 6 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 6 }
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
    "a[0, 2..]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              second: {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 6 }
                }
              },
              last: null,
              range: [ 2, 8 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 8 }
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
    "a[0, -2..]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 2, 3 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end  : { line: 1, column: 3 }
                }
              },
              second: {
                type: Syntax.Literal,
                value: "-2",
                valueType: Token.IntegerLiteral,
                range: [ 5, 7 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end  : { line: 1, column: 7 }
                }
              },
              last: null,
              range: [ 2, 9 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 9 }
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
    "a[0;1,2;3..4;5]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: [
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
                }
              ],
              second: [
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
                }
              ],
              last: [
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
                }
              ],
              range: [ 2, 14 ],
              loc: {
                start: { line: 1, column: 2 },
                end  : { line: 1, column: 14 }
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
    "a[b[c=0;1]=0;1]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end  : { line: 1, column: 1 }
              }
            },
            property: [
              {
                type: Syntax.AssignmentExpression,
                operator: "=",
                left: {
                  type: Syntax.MemberExpression,
                  computed: true,
                  object: {
                    type: Syntax.Identifier,
                    name: "b",
                    range: [ 2, 3 ],
                    loc: {
                      start: { line: 1, column: 2 },
                      end  : { line: 1, column: 3 }
                    }
                  },
                  property: [
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
                  range: [ 2, 10 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end  : { line: 1, column: 10 }
                  }
                },
                right: {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 11, 12 ],
                  loc: {
                    start: { line: 1, column: 11 },
                    end  : { line: 1, column: 12 }
                  }
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
            ],
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
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: null,
            second: null,
            last: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 3, 5 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 5 }
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
    "(1..16)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            second: null,
            last: {
              type: Syntax.Literal,
              value: "16",
              valueType: Token.IntegerLiteral,
              range: [ 4, 6 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 6 }
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
    "(16..1)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: {
              type: Syntax.Literal,
              value: "16",
              valueType: Token.IntegerLiteral,
              range: [ 1, 3 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 3 }
              }
            },
            second: null,
            last: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end  : { line: 1, column: 6 }
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
    "(1, 3..11)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: {
              type: Syntax.Literal,
              value: "1",
              valueType: Token.IntegerLiteral,
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            second: {
              type: Syntax.Literal,
              value: "3",
              valueType: Token.IntegerLiteral,
              range: [ 4, 5 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 5 }
              }
            },
            last: {
              type: Syntax.Literal,
              value: "11",
              valueType: Token.IntegerLiteral,
              range: [ 7, 9 ],
              loc: {
                start: { line: 1, column: 7 },
                end  : { line: 1, column: 9 }
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
    "(..20)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: null,
            second: null,
            last: {
              type: Syntax.Literal,
              value: "20",
              valueType: Token.IntegerLiteral,
              range: [ 3, 5 ],
              loc: {
                start: { line: 1, column: 3 },
                end  : { line: 1, column: 5 }
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
    "(a..20)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 1, 2 ],
              loc: {
                start: { line: 1, column: 1 },
                end  : { line: 1, column: 2 }
              }
            },
            second: null,
            last: {
              type: Syntax.Literal,
              value: "20",
              valueType: Token.IntegerLiteral,
              range: [ 4, 6 ],
              loc: {
                start: { line: 1, column: 4 },
                end  : { line: 1, column: 6 }
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
    "(0;1,2;3..4;5)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end: { line: 1, column: 2 }
                }
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 }
                }
              }
            ],
            second: [
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              },
              {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 7, 8 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 8 }
                }
              }
            ],
            last: [
              {
                type: Syntax.Literal,
                value: "4",
                valueType: Token.IntegerLiteral,
                range: [ 10, 11 ],
                loc: {
                  start: { line: 1, column: 10 },
                  end: { line: 1, column: 11 }
                }
              },
              {
                type: Syntax.Literal,
                value: "5",
                valueType: Token.IntegerLiteral,
                range: [ 12, 13 ],
                loc: {
                  start: { line: 1, column: 12 },
                  end: { line: 1, column: 13 }
                }
              }
            ],
            range: [ 0, 14 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 14 }
            }
          }
        ],
        range: [ 0, 14 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 14 }
        }
      }
    },
    "(:0..)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 }
              }
            },
            second: null,
            last: null,
            generator: true,
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 }
        }
      }
    },
    "(:0, 2..)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.RangeExpression,
            first: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 2, 3 ],
              loc: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 }
              }
            },
            second: {
              type: Syntax.Literal,
              value: "2",
              valueType: Token.IntegerLiteral,
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 6 }
              }
            },
            last: null,
            generator: true,
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      }
    },
    "5 !== 5.0": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "5",
              valueType: Token.FloatLiteral,
              range: [ 6, 9 ],
              loc: {
                start: { line: 1, column: 6 },
                end: { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      }
    },
    "5 == 5.0": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "5",
              valueType: Token.FloatLiteral,
              range: [ 5, 8 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 8 }
              }
            },
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
    },
    "{ arg a, b, c=3; }": {
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
                      end: { line: 1, column: 7 }
                    }
                  },
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
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
                      end: { line: 1, column: 10 }
                    }
                  },
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 10 }
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
                      end: { line: 1, column: 13 }
                    }
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 14, 15 ],
                    loc: {
                      start: { line: 1, column: 14 },
                      end: { line: 1, column: 15 }
                    }
                  },
                  range: [ 12, 15 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end: { line: 1, column: 15 }
                  }
                }
              ]
            },
            body: [],
            range: [ 0, 18 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 18 }
            }
          }
        ],
        range: [ 0, 18 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 18 }
        }
      }
    },
    "{ arg a, b, c ... d; }": {
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
                      end: { line: 1, column: 7 }
                    }
                  },
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
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
                      end: { line: 1, column: 10 }
                    }
                  },
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 10 }
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
                      end: { line: 1, column: 13 }
                    }
                  },
                  range: [ 12, 13 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end: { line: 1, column: 13 }
                  }
                }
              ],
              remain: {
                type: Syntax.Identifier,
                name: "d",
                range: [ 18, 19 ],
                loc: {
                  start: { line: 1, column: 18 },
                  end: { line: 1, column: 19 }
                }
              }
            },
            body: [],
            range: [ 0, 22 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 22 }
            }
          }
        ],
        range: [ 0, 22 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 22 }
        }
      }
    },
    "{ arg ...args; }": {
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
                  end: { line: 1, column: 13 }
                }
              }
            },
            body: [],
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 16 }
        }
      }
    },
    "{ |x = 1| x }": {
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
                      end: { line: 1, column: 4 }
                    }
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 7, 8 ],
                    loc: {
                      start: { line: 1, column: 7 },
                      end: { line: 1, column: 8 }
                    }
                  },
                  range: [ 3, 8 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 8 }
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
                  end: { line: 1, column: 11 }
                }
              }
            ],
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 13 }
        }
      }
    },
    "{ a; b; c }": {
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
                  end: { line: 1, column: 3 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "b",
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "c",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 9 }
                }
              }
            ],
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 11 }
        }
      }
    },
    "{|x=1| var a = x * x; a * a; }": {
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
                      end: { line: 1, column: 3 }
                    }
                  },
                  init: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 }
                    }
                  },
                  range: [ 2, 5 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 1, column: 5 }
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
                        end: { line: 1, column: 12 }
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
                          end: { line: 1, column: 16 }
                        }
                      },
                      right: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 19, 20 ],
                        loc: {
                          start: { line: 1, column: 19 },
                          end: { line: 1, column: 20 }
                        }
                      },
                      range: [ 15, 20 ],
                      loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 20 }
                      }
                    },
                    range: [ 11, 20 ],
                    loc: {
                      start: { line: 1, column: 11 },
                      end: { line: 1, column: 20 }
                    }
                  }
                ],
                range: [ 7, 20 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 20 }
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
                    end: { line: 1, column: 23 }
                  }
                },
                right: {
                  type: Syntax.Identifier,
                  name: "a",
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
              }
            ],
            range: [ 0, 30 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 30 }
            }
          }
        ],
        range: [ 0, 30 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 30 }
        }
      }
    },
    "a = #{}": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.FunctionExpression,
              body: [],
              closed: true,
              range: [ 5, 7 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 7 }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 7 }
        }
      }
    },
    "var level=0, slope=1, curve=1;": {
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
                    end: { line: 1, column: 9 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end: { line: 1, column: 11 }
                  }
                },
                range: [ 4, 11 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 11 }
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
                    end: { line: 1, column: 18 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 19, 20 ],
                  loc: {
                    start: { line: 1, column: 19 },
                    end: { line: 1, column: 20 }
                  }
                },
                range: [ 13, 20 ],
                loc: {
                  start: { line: 1, column: 13 },
                  end: { line: 1, column: 20 }
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
                    end: { line: 1, column: 27 }
                  }
                },
                init: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 28, 29 ],
                  loc: {
                    start: { line: 1, column: 28 },
                    end: { line: 1, column: 29 }
                  }
                },
                range: [ 22, 29 ],
                loc: {
                  start: { line: 1, column: 22 },
                  end: { line: 1, column: 29 }
                }
              }
            ],
            range: [ 0, 29 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 29 }
            }
          }
        ],
        range: [ 0, 30 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 30 }
        }
      }
    },
    "{ |x, y| var a; a = x + y; x.wait; a }": {
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
                      end: { line: 1, column: 4 }
                    }
                  },
                  range: [ 3, 4 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 4 }
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
                      end: { line: 1, column: 7 }
                    }
                  },
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
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
                        end: { line: 1, column: 14 }
                      }
                    },
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end: { line: 1, column: 14 }
                    }
                  }
                ],
                range: [ 9, 14 ],
                loc: {
                  start: { line: 1, column: 9 },
                  end: { line: 1, column: 14 }
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
                    end: { line: 1, column: 17 }
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
                      end: { line: 1, column: 21 }
                    }
                  },
                  right: {
                    type: Syntax.Identifier,
                    name: "y",
                    range: [ 24, 25 ],
                    loc: {
                      start: { line: 1, column: 24 },
                      end: { line: 1, column: 25 }
                    }
                  },
                  range: [ 20, 25 ],
                  loc: {
                    start: { line: 1, column: 20 },
                    end: { line: 1, column: 25 }
                  }
                },
                range: [ 16, 25 ],
                loc: {
                  start: { line: 1, column: 16 },
                  end: { line: 1, column: 25 }
                }
              },
              {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                  type: Syntax.Identifier,
                  name: "x",
                  range: [ 27, 28 ],
                  loc: {
                    start: { line: 1, column: 27 },
                    end: { line: 1, column: 28 }
                  }
                },
                property: {
                  type: Syntax.Identifier,
                  name: "wait",
                  range: [ 29, 33 ],
                  loc: {
                    start: { line: 1, column: 29 },
                    end: { line: 1, column: 33 }
                  }
                },
                range: [ 27, 33 ],
                loc: {
                  start: { line: 1, column: 27 },
                  end: { line: 1, column: 33 }
                }
              },
              {
                type: Syntax.Identifier,
                name: "a",
                range: [ 35, 36 ],
                loc: {
                  start: { line: 1, column: 35 },
                  end: { line: 1, column: 36 }
                }
              }
            ],
            range: [ 0, 38 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 38 }
            }
          }
        ],
        range: [ 0, 38 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 38 }
        }
      }
    },
    "{ if (true) { 1.wait }; 0 }": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.Identifier,
                  name: "if",
                  range: [ 2, 4 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 1, column: 4 }
                  }
                },
                args: {
                  list: [
                    {
                      type: Syntax.Literal,
                      value: "true",
                      valueType: Token.BooleanLiteral,
                      range: [ 6, 10 ],
                      loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 10 }
                      }
                    },
                    {
                      type: Syntax.FunctionExpression,
                      body: [
                        {
                          type: Syntax.MemberExpression,
                          computed: false,
                          object: {
                            type: Syntax.Literal,
                            value: "1",
                            valueType: Token.IntegerLiteral,
                            range: [ 14, 15 ],
                            loc: {
                              start: { line: 1, column: 14 },
                              end: { line: 1, column: 15 }
                            }
                          },
                          property: {
                            type: Syntax.Identifier,
                            name: "wait",
                            range: [ 16, 20 ],
                            loc: {
                              start: { line: 1, column: 16 },
                              end: { line: 1, column: 20 }
                            }
                          },
                          range: [ 14, 20 ],
                          loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 20 }
                          }
                        }
                      ],
                      blocklist: true,
                      range: [ 12, 22 ],
                      loc: {
                        start: { line: 1, column: 12 },
                        end: { line: 1, column: 22 }
                      }
                    }
                  ]
                },
                range: [ 2, 22 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 22 }
                }
              },
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 24, 25 ],
                loc: {
                  start: { line: 1, column: 24 },
                  end: { line: 1, column: 25 }
                }
              }
            ],
            range: [ 0, 27 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 27 }
            }
          }
        ],
        range: [ 0, 27 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 27 }
        }
      }
    },
    "{ wait(1); 0 }": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            body: [
              {
                type: Syntax.CallExpression,
                callee: {
                  type: Syntax.Identifier,
                  name: "wait",
                  range: [ 2, 6 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 1, column: 6 }
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
                        end: { line: 1, column: 8 }
                      }
                    }
                  ]
                },
                range: [ 2, 9 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 9 }
                }
              },
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              }
            ],
            range: [ 0, 14 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 14 }
            }
          }
        ],
        range: [ 0, 14 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 14 }
        }
      }
    },
    "max(0, 1, 2, *a, a: 5, b: 6)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 8 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end: { line: 1, column: 11 }
                  }
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 14, 15 ],
                loc: {
                  start: { line: 1, column: 14 },
                  end: { line: 1, column: 15 }
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
                    end: { line: 1, column: 21 }
                  }
                },
                b: {
                  type: Syntax.Literal,
                  value: "6",
                  valueType: Token.IntegerLiteral,
                  range: [ 26, 27 ],
                  loc: {
                    start: { line: 1, column: 26 },
                    end: { line: 1, column: 27 }
                  }
                }
              }
            },
            range: [ 0, 28 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 28 }
            }
          }
        ],
        range: [ 0, 28 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 28 }
        }
      }
    },
    "max(1, 2, *a)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 8 }
                  }
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              }
            },
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 13 }
        }
      }
    },
    "max(1, 2, a: 5)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 7, 8 ],
                  loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 8 }
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
                    end: { line: 1, column: 14 }
                  }
                }
              }
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 15 }
        }
      }
    },
    "max(0, *a, a: 3)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                  }
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 9 }
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
                    end: { line: 1, column: 15 }
                  }
                }
              }
            },
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 16 }
        }
      }
    },
    "max(0, *a)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                  }
                }
              ],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 9 }
                }
              }
            },
            range: [ 0, 10 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 10 }
            }
          }
        ],
        range: [ 0, 10 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 10 }
        }
      }
    },
    "max(0, a: 1)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.Literal,
                  value: "0",
                  valueType: Token.IntegerLiteral,
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                  }
                }
              ],
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end: { line: 1, column: 11 }
                  }
                }
              }
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 12 }
        }
      }
    },
    "max(*a, a: 2)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              },
              keywords: {
                a: {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 11, 12 ],
                  loc: {
                    start: { line: 1, column: 11 },
                    end: { line: 1, column: 12 }
                  }
                }
              }
            },
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 13 }
        }
      }
    },
    "max(*a)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [],
              expand: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 7 }
        }
      }
    },
    "max()": { // TODO: throw error
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
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
      }
    },
    "max(0; 1, 2; 3, 4; 5, a: 6; 7, b: 8; 9)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "max",
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                [
                  {
                    type: Syntax.Literal,
                    value: "0",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 7, 8 ],
                    loc: {
                      start: { line: 1, column: 7 },
                      end: { line: 1, column: 8 }
                    }
                  }
                ],
                [
                  {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 10, 11 ],
                    loc: {
                      start: { line: 1, column: 10 },
                      end: { line: 1, column: 11 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 13, 14 ],
                    loc: {
                      start: { line: 1, column: 13 },
                      end: { line: 1, column: 14 }
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
                      end: { line: 1, column: 17 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                    range: [ 19, 20 ],
                    loc: {
                      start: { line: 1, column: 19 },
                      end: { line: 1, column: 20 }
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
                      end: { line: 1, column: 26 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "7",
                    valueType: Token.IntegerLiteral,
                    range: [ 28, 29 ],
                    loc: {
                      start: { line: 1, column: 28 },
                      end: { line: 1, column: 29 }
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
                      end: { line: 1, column: 35 }
                    }
                  },
                  {
                    type: Syntax.Literal,
                    value: "9",
                    valueType: Token.IntegerLiteral,
                    range: [ 37, 38 ],
                    loc: {
                      start: { line: 1, column: 37 },
                      end: { line: 1, column: 38 }
                    }
                  }
                ]
              }
            },
            range: [ 0, 39 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 39 }
            }
          }
        ],
        range: [ 0, 39 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 39 }
        }
      }
    },
    "a = (1; 2; 3)": {
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
                end: { line: 1, column: 1 }
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
                  end: { line: 1, column: 6 }
                }
              },
              {
                type: Syntax.Literal,
                value: "2",
                valueType: Token.IntegerLiteral,
                range: [ 8, 9 ],
                loc: {
                  start: { line: 1, column: 8 },
                  end: { line: 1, column: 9 }
                }
              },
              {
                type: Syntax.Literal,
                value: "3",
                valueType: Token.IntegerLiteral,
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              }
            ],
            range: [ 0, 13 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 13 }
        }
      }
    },
    "a = (var a = 1; a)": {
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
                end: { line: 1, column: 1 }
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
                          end: { line: 1, column: 10 }
                        }
                      },
                      init: {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral,
                        range: [ 13, 14 ],
                        loc: {
                          start: { line: 1, column: 13 },
                          end: { line: 1, column: 14 }
                        }
                      },
                      range: [ 9, 14 ],
                      loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 14 }
                      }
                    }
                  ],
                  range: [ 5, 14 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 14 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 16, 17 ],
                  loc: {
                    start: { line: 1, column: 16 },
                    end: { line: 1, column: 17 }
                  }
                }
              ],
              range: [ 4, 18 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 18 }
              }
            },
            range: [ 0, 18 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 18 }
            }
          }
        ],
        range: [ 0, 18 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 18 }
        }
      }
    },
    "a.midicps.min(220)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 0, 1 ],
                  loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 1 }
                  }
                },
                property: {
                  type: Syntax.Identifier,
                  name: "midicps",
                  range: [ 2, 9 ],
                  loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 1, column: 9 }
                  }
                },
                range: [ 0, 9 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 9 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "min",
                range: [ 10, 13 ],
                loc: {
                  start: { line: 1, column: 10 },
                  end: { line: 1, column: 13 }
                }
              },
              range: [ 0, 13 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 13 }
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
                    end: { line: 1, column: 17 }
                  }
                }
              ]
            },
            range: [ 0, 18 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 18 }
            }
          }
        ],
        range: [ 0, 18 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 18 }
        }
      }
    },
    "Point(3, 4)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "Point",
                range: [ 0, 5 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 5 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "new",
                range: [ 5, 5 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 5 }
                }
              },
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 5 }
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
                    end: { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 10 }
                  }
                }
              ]
            },
            range: [ 0, 11 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 11 }
            }
          }
        ],
        range: [ 0, 11 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 11 }
        }
      }
    },
    "Point.new(3, 4)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "Point",
                range: [ 0, 5 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 5 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "new",
                range: [ 6, 9 ],
                loc: {
                  start: { line: 1, column: 6 },
                  end: { line: 1, column: 9 }
                }
              },
              range: [ 0, 9 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 9 }
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
                    end: { line: 1, column: 11 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 13, 14 ],
                  loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 1, column: 14 }
                  }
                }
              ]
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 15 }
        }
      }
    },
    "Point.new": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: false,
            object: {
              type: Syntax.Identifier,
              name: "Point",
              range: [ 0, 5 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 5 }
              }
            },
            property: {
              type: Syntax.Identifier,
              name: "new",
              range: [ 6, 9 ],
              loc: {
                start: { line: 1, column: 6 },
                end: { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      }
    },
    "Routine  {|i| i.postln}": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "Routine",
                range: [ 0, 7 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 7 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "new",
                range: [ 7, 7 ],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 7 }
                }
              },
              range: [ 0, 7 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 7 }
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
                            end: { line: 1, column: 12 }
                          }
                        },
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end: { line: 1, column: 12 }
                        }
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.MemberExpression,
                      computed: false,
                      object: {
                        type: Syntax.Identifier,
                        name: "i",
                        range: [ 14, 15 ],
                        loc: {
                          start: { line: 1, column: 14 },
                          end: { line: 1, column: 15 }
                        }
                      },
                      property: {
                        type: Syntax.Identifier,
                        name: "postln",
                        range: [ 16, 22 ],
                        loc: {
                          start: { line: 1, column: 16 },
                          end: { line: 1, column: 22 }
                        }
                      },
                      range: [ 14, 22 ],
                      loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 22 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 9, 23 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 23 }
                  }
                }
              ]
            },
            range: [ 0, 23 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 23 }
            }
          }
        ],
        range: [ 0, 23 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 23 }
        }
      }
    },
    "Set[3, 4, 5]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "Set",
                range: [ 0, 3 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 3 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "newFrom",
                range: [ 3, 3 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 3 }
                }
              },
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
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
                        end: { line: 1, column: 5 }
                      }
                    },
                    {
                      type: Syntax.Literal,
                      value: "4",
                      valueType: Token.IntegerLiteral,
                      range: [ 7, 8 ],
                      loc: {
                        start: { line: 1, column: 7 },
                        end: { line: 1, column: 8 }
                      }
                    },
                    {
                      type: Syntax.Literal,
                      value: "5",
                      valueType: Token.IntegerLiteral,
                      range: [ 10, 11 ],
                      loc: {
                        start: { line: 1, column: 10 },
                        end: { line: 1, column: 11 }
                      }
                    }
                  ],
                  range: [ 3, 12 ],
                  loc: {
                    start: { line: 1, column: 3 },
                    end: { line: 1, column: 12 }
                  }
                }
              ]
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 12 }
        }
      }
    },
    "Set [1, 2].value": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "Set",
                range: [ 0, 3 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 3 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "newFrom",
                range: [ 3, 3 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 3 }
                }
              },
              range: [ 0, 3 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.MemberExpression,
                  computed: false,
                  object: {
                    type: Syntax.ListExpression,
                    elements: [
                      {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral,
                        range: [ 5, 6 ],
                        loc: {
                          start: { line: 1, column: 5 },
                          end: { line: 1, column: 6 }
                        }
                      },
                      {
                        type: Syntax.Literal,
                        value: "2",
                        valueType: Token.IntegerLiteral,
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end: { line: 1, column: 9 }
                        }
                      }
                    ],
                    range: [ 4, 10 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 10 }
                    }
                  },
                  property: {
                    type: Syntax.Identifier,
                    name: "value",
                    range: [ 11, 16 ],
                    loc: {
                      start: { line: 1, column: 11 },
                      end: { line: 1, column: 16 }
                    }
                  },
                  range: [ 4, 16 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 16 }
                  }
                }
              ]
            },
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 16 }
        }
      }
    },
    "a.(0, 1)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "value",
                range: [ 2, 2 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 2 }
                }
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 2 }
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
                    end: { line: 1, column: 4 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                  }
                }
              ]
            },
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
    },
    "a.[0]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 3, 4 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 4 }
              }
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
      }
    },
    "a.[0;1]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 }
              }
            },
            property: [
              {
                type: Syntax.Literal,
                value: "0",
                valueType: Token.IntegerLiteral,
                range: [ 3, 4 ],
                loc: {
                  start: { line: 1, column: 3 },
                  end: { line: 1, column: 4 }
                }
              },
              {
                type: Syntax.Literal,
                value: "1",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              }
            ],
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 7 }
        }
      }
    },
    "a.[..5]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: true,
            object: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 0, 1 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 }
              }
            },
            property: {
              type: Syntax.ListIndexer,
              first: null,
              second: null,
              last: {
                type: Syntax.Literal,
                value: "5",
                valueType: Token.IntegerLiteral,
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              },
              range: [ 3, 6 ],
              loc: {
                start: { line: 1, column: 3 },
                end: { line: 1, column: 6 }
              }
            },
            range: [ 0, 7 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 7 }
            }
          }
        ],
        range: [ 0, 7 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 7 }
        }
      }
    },
    "a.value(*[])": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "value",
                range: [ 2, 7 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 7 }
                }
              },
              range: [ 0, 7 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 7 }
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
                  end: { line: 1, column: 11 }
                }
              }
            },
            range: [ 0, 12 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 12 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 12 }
        }
      }
    },
    "if (x<3) {\\abc} {\\def}": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "if",
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 2 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.BinaryExpression,
                  operator: "<",
                  left: {
                    type: Syntax.Identifier,
                    name: "x",
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 }
                    }
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "3",
                    valueType: Token.IntegerLiteral,
                    range: [ 6, 7 ],
                    loc: {
                      start: { line: 1, column: 6 },
                      end: { line: 1, column: 7 }
                    }
                  },
                  range: [ 4, 7 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 7 }
                  }
                },
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
                        end: { line: 1, column: 14 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 9, 15 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 15 }
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
                        end: { line: 1, column: 21 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 16, 22 ],
                  loc: {
                    start: { line: 1, column: 16 },
                    end: { line: 1, column: 22 }
                  }
                }
              ]
            },
            range: [ 0, 22 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 22 }
            }
          }
        ],
        range: [ 0, 22 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 22 }
        }
      }
    },
    "z.do  {|x| x.play }": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "z",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "do",
                range: [ 2, 4 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 4 }
                }
              },
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 4 }
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
                            end: { line: 1, column: 9 }
                          }
                        },
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end: { line: 1, column: 9 }
                        }
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.MemberExpression,
                      computed: false,
                      object: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end: { line: 1, column: 12 }
                        }
                      },
                      property: {
                        type: Syntax.Identifier,
                        name: "play",
                        range: [ 13, 17 ],
                        loc: {
                          start: { line: 1, column: 13 },
                          end: { line: 1, column: 17 }
                        }
                      },
                      range: [ 11, 17 ],
                      loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 1, column: 17 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 6, 19 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 19 }
                  }
                }
              ]
            },
            range: [ 0, 19 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 19 }
            }
          }
        ],
        range: [ 0, 19 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 19 }
        }
      }
    },
    "z.do #{|x| x.play }": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "z",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "do",
                range: [ 2, 4 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 4 }
                }
              },
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 4 }
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
                            end: { line: 1, column: 9 }
                          }
                        },
                        range: [ 8, 9 ],
                        loc: {
                          start: { line: 1, column: 8 },
                          end: { line: 1, column: 9 }
                        }
                      }
                    ]
                  },
                  body: [
                    {
                      type: Syntax.MemberExpression,
                      computed: false,
                      object: {
                        type: Syntax.Identifier,
                        name: "x",
                        range: [ 11, 12 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end: { line: 1, column: 12 }
                        }
                      },
                      property: {
                        type: Syntax.Identifier,
                        name: "play",
                        range: [ 13, 17 ],
                        loc: {
                          start: { line: 1, column: 13 },
                          end: { line: 1, column: 17 }
                        }
                      },
                      range: [ 11, 17 ],
                      loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 1, column: 17 }
                      }
                    }
                  ],
                  closed: true,
                  blocklist: true,
                  range: [ 6, 19 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 19 }
                  }
                }
              ]
            },
            range: [ 0, 19 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 19 }
            }
          }
        ],
        range: [ 0, 19 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 19 }
        }
      }
    },
    "loop { 'x'.postln; 1.wait }": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.Identifier,
              name: "loop",
              range: [ 0, 4 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 4 }
              }
            },
            args: {
              list: [
                {
                  type: Syntax.FunctionExpression,
                  body: [
                    {
                      type: Syntax.MemberExpression,
                      computed: false,
                      object: {
                        type: Syntax.Literal,
                        value: q("x"),
                        valueType: Token.SymbolLiteral,
                        range: [ 7, 10 ],
                        loc: {
                          start: { line: 1, column: 7 },
                          end: { line: 1, column: 10 }
                        }
                      },
                      property: {
                        type: Syntax.Identifier,
                        name: "postln",
                        range: [ 11, 17 ],
                        loc: {
                          start: { line: 1, column: 11 },
                          end: { line: 1, column: 17 }
                        }
                      },
                      range: [ 7, 17 ],
                      loc: {
                        start: { line: 1, column: 7 },
                        end: { line: 1, column: 17 }
                      }
                    },
                    {
                      type: Syntax.MemberExpression,
                      computed: false,
                      object: {
                        type: Syntax.Literal,
                        value: "1",
                        valueType: Token.IntegerLiteral,
                        range: [ 19, 20 ],
                        loc: {
                          start: { line: 1, column: 19 },
                          end: { line: 1, column: 20 }
                        }
                      },
                      property: {
                        type: Syntax.Identifier,
                        name: "wait",
                        range: [ 21, 25 ],
                        loc: {
                          start: { line: 1, column: 21 },
                          end: { line: 1, column: 25 }
                        }
                      },
                      range: [ 19, 25 ],
                      loc: {
                        start: { line: 1, column: 19 },
                        end: { line: 1, column: 25 }
                      }
                    }
                  ],
                  blocklist: true,
                  range: [ 5, 27 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 27 }
                  }
                }
              ]
            },
            range: [ 0, 27 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 27 }
            }
          }
        ],
        range: [ 0, 27 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 27 }
        }
      }
    },
    "~a = 0": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.GlobalExpression,
              id: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 1, 2 ],
                loc: {
                  start: { line: 1, column: 1 },
                  end: { line: 1, column: 2 }
                }
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 2 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "0",
              valueType: Token.IntegerLiteral,
              range: [ 5, 6 ],
              loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 6 }
              }
            },
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 }
        }
      }
    },
    "()": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ObjectExpression,
            elements: [],
            range: [ 0, 2 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 2 }
            }
          }
        ],
        range: [ 0, 2 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 2 }
        }
      }
    },
    "( \\answer : 42 )": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.ObjectExpression,
            elements: [
              {
                type: Syntax.Literal,
                value: "answer",
                valueType: Token.SymbolLiteral,
                range: [ 2, 9 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 9 }
                }
              },
              {
                type: Syntax.Literal,
                value: "42",
                valueType: Token.IntegerLiteral,
                range: [ 12, 14 ],
                loc: {
                  start: { line: 1, column: 12 },
                  end: { line: 1, column: 14 }
                }
              }
            ],
            range: [ 0, 16 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 16 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 16 }
        }
      }
    },
    "x = ( a: 1, b: 2, c: 3 )": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.ObjectExpression,
              elements: [
                {
                  type: Syntax.Label,
                  name: "a",
                  range: [ 6, 8 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 8 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 9, 10 ],
                  loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.Label,
                  name: "b",
                  range: [ 12, 14 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end: { line: 1, column: 14 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 15, 16 ],
                  loc: {
                    start: { line: 1, column: 15 },
                    end: { line: 1, column: 16 }
                  }
                },
                {
                  type: Syntax.Label,
                  name: "c",
                  range: [ 18, 20 ],
                  loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 20 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 21, 22 ],
                  loc: {
                    start: { line: 1, column: 21 },
                    end: { line: 1, column: 22 }
                  }
                }
              ],
              range: [ 4, 24 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 24 }
              }
            },
            range: [ 0, 24 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 24 }
            }
          }
        ],
        range: [ 0, 24 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 24 }
        }
      }
    },
    "x = ( a : 1, b : 2, c : 3 )": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.ObjectExpression,
              elements: [
                {
                  type: Syntax.Identifier,
                  name: "a",
                  range: [ 6, 7 ],
                  loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "1",
                  valueType: Token.IntegerLiteral,
                  range: [ 10, 11 ],
                  loc: {
                    start: { line: 1, column: 10 },
                    end: { line: 1, column: 11 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "b",
                  range: [ 13, 14 ],
                  loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 1, column: 14 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "2",
                  valueType: Token.IntegerLiteral,
                  range: [ 17, 18 ],
                  loc: {
                    start: { line: 1, column: 17 },
                    end: { line: 1, column: 18 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "c",
                  range: [ 20, 21 ],
                  loc: {
                    start: { line: 1, column: 20 },
                    end: { line: 1, column: 21 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 24, 25 ],
                  loc: {
                    start: { line: 1, column: 24 },
                    end: { line: 1, column: 25 }
                  }
                }
              ],
              range: [ 4, 27 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 27 }
              }
            },
            range: [ 0, 27 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 27 }
            }
          }
        ],
        range: [ 0, 27 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 27 }
        }
      }
    },
    "x = (1 + 2: 3, 4: 5)": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.ObjectExpression,
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
                      end: { line: 1, column: 6 }
                    }
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 9, 10 ],
                    loc: {
                      start: { line: 1, column: 9 },
                      end: { line: 1, column: 10 }
                    }
                  },
                  range: [ 5, 10 ],
                  loc: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 10 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 12, 13 ],
                  loc: {
                    start: { line: 1, column: 12 },
                    end: { line: 1, column: 13 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 15, 16 ],
                  loc: {
                    start: { line: 1, column: 15 },
                    end: { line: 1, column: 16 }
                  }
                },
                {
                  type: Syntax.Literal,
                  value: "5",
                  valueType: Token.IntegerLiteral,
                  range: [ 18, 19 ],
                  loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 19 }
                  }
                }
              ],
              range: [ 4, 20 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 20 }
              }
            },
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 20 }
            }
          }
        ],
        range: [ 0, 20 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 20 }
        }
      }
    },
    "f = _ + _": {
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
                end: { line: 1, column: 1 }
              }
            },
            right: {
              type: Syntax.FunctionExpression,
              args: {
                list: [
                  {
                    type: Syntax.Identifier,
                    name: "_0",
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 }
                    }
                  },
                  {
                    type: Syntax.Identifier,
                    name: "_1",
                    range: [ 8, 9 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end: { line: 1, column: 9 }
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
                    name: "_0",
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 }
                    }
                  },
                  right: {
                    type: Syntax.Identifier,
                    name: "_1",
                    range: [ 8, 9 ],
                    loc: {
                      start: { line: 1, column: 8 },
                      end: { line: 1, column: 9 }
                    }
                  },
                  range: [ 4, 9 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 9 }
                  }
                }
              ],
              partial: true,
              range: [ 4, 9 ],
              loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 9 }
              }
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      }
    },
    "[_, _]": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.FunctionExpression,
            args: {
              list: [
                {
                  type: Syntax.Identifier,
                  name: "_0",
                  range: [ 1, 2 ],
                  loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 2 }
                  }
                },
                {
                  type: Syntax.Identifier,
                  name: "_1",
                  range: [ 4, 5 ],
                  loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
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
                    name: "_0",
                    range: [ 1, 2 ],
                    loc: {
                      start: { line: 1, column: 1 },
                      end: { line: 1, column: 2 }
                    }
                  },
                  {
                    type: Syntax.Identifier,
                    name: "_1",
                    range: [ 4, 5 ],
                    loc: {
                      start: { line: 1, column: 4 },
                      end: { line: 1, column: 5 }
                    }
                  }
                ],
                range: [ 0, 6 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 6 }
                }
              }
            ],
            partial: true,
            range: [ 0, 6 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 6 }
            }
          }
        ],
        range: [ 0, 6 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 6 }
        }
      }
    },
    "var a; var b;": {
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
                    end: { line: 1, column: 5 }
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
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
                    end: { line: 1, column: 12 }
                  }
                },
                range: [ 11, 12 ],
                loc: {
                  start: { line: 1, column: 11 },
                  end: { line: 1, column: 12 }
                }
              }
            ],
            range: [ 7, 12 ],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 12 }
            }
          }
        ],
        range: [ 0, 13 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 13 }
        }
      }
    },
    "var a; a = 10;": {
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
                    end: { line: 1, column: 5 }
                  }
                },
                range: [ 4, 5 ],
                loc: {
                  start: { line: 1, column: 4 },
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
          {
            type: Syntax.AssignmentExpression,
            operator: "=",
            left: {
              type: Syntax.Identifier,
              name: "a",
              range: [ 7, 8 ],
              loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 8 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 11, 13 ],
              loc: {
                start: { line: 1, column: 11 },
                end: { line: 1, column: 13 }
              }
            },
            range: [ 7, 13 ],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 13 }
            }
          }
        ],
        range: [ 0, 14 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 14 }
        }
      }
    },
    "(var a; a = 10;)": {
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
                    end: { line: 1, column: 6 }
                  }
                },
                range: [ 5, 6 ],
                loc: {
                  start: { line: 1, column: 5 },
                  end: { line: 1, column: 6 }
                }
              }
            ],
            range: [ 1, 6 ],
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 6 }
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
                end: { line: 1, column: 9 }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "10",
              valueType: Token.IntegerLiteral,
              range: [ 12, 14 ],
              loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 14 }
              }
            },
            range: [ 8, 14 ],
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 14 }
            }
          }
        ],
        range: [ 0, 16 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 16 }
        }
      }
    },
    "var a = { var a; a }; a": {
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
                    end: { line: 1, column: 5 }
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
                              end: { line: 1, column: 15 }
                            }
                          },
                          range: [ 14, 15 ],
                          loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 15 }
                          }
                        }
                      ],
                      range: [ 10, 15 ],
                      loc: {
                        start: { line: 1, column: 10 },
                        end: { line: 1, column: 15 }
                      }
                    },
                    {
                      type: Syntax.Identifier,
                      name: "a",
                      range: [ 17, 18 ],
                      loc: {
                        start: { line: 1, column: 17 },
                        end: { line: 1, column: 18 }
                      }
                    }
                  ],
                  range: [ 8, 20 ],
                  loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 20 }
                  }
                },
                range: [ 4, 20 ],
                loc: {
                  start: { line: 1, column: 4 },
                  end: { line: 1, column: 20 }
                }
              }
            ],
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 20 }
            }
          },
          {
            type: Syntax.Identifier,
            name: "a",
            range: [ 22, 23 ],
            loc: {
              start: { line: 1, column: 22 },
              end: { line: 1, column: 23 }
            }
          }
        ],
        range: [ 0, 23 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 23 }
        }
      }
    },
    "thisProcess.platform;": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: false,
            object: {
              type: Syntax.ThisExpression,
              name: "thisProcess",
              range: [ 0, 11 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 11 }
              }
            },
            property: {
              type: Syntax.Identifier,
              name: "platform",
              range: [ 12, 20 ],
              loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 20 }
              }
            },
            range: [ 0, 20 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 20 }
            }
          }
        ],
        range: [ 0, 21 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 21 }
        }
      }
    },
    "a.(Class)": {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.CallExpression,
            callee: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Identifier,
                name: "a",
                range: [ 0, 1 ],
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 1, column: 1 }
                }
              },
              property: {
                type: Syntax.Identifier,
                name: "value",
                range: [ 2, 2 ],
                loc: {
                  start: { line: 1, column: 2 },
                  end: { line: 1, column: 2 }
                }
              },
              range: [ 0, 2 ],
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 2 }
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
                    end: { line: 1, column: 8 }
                  }
                }
              ]
            },
            range: [ 0, 9 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 9 }
            }
          }
        ],
        range: [ 0, 9 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 9 }
        }
      }
    },
    '"#{69.midicps}"': {
      ast: {
        type: Syntax.Program,
        body: [
          {
            type: Syntax.MemberExpression,
            computed: false,
            object: {
              type: Syntax.MemberExpression,
              computed: false,
              object: {
                type: Syntax.Literal,
                value: "69",
                valueType: Token.IntegerLiteral
              },
              property: {
                type: Syntax.Identifier,
                name: "midicps",
              }
            },
            property: {
              type: Syntax.Identifier,
              name: "asString",
            },
            range: [ 0, 15 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 15 }
            }
          }
        ],
        range: [ 0, 15 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 15 }
        }
      }
    },
    '"\\#{}##{{69.midicps}.value}#{}hz"': {
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
                value: "'\\#{}#'",
                valueType: Token.SymbolLiteral
              },
              right: {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                  type: Syntax.MemberExpression,
                  computed: false,
                  object: {
                    type: Syntax.FunctionExpression,
                    body: [
                      {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: {
                          type: Syntax.Literal,
                          value: "69",
                          valueType: Token.IntegerLiteral
                        },
                        property: {
                          type: Syntax.Identifier,
                          name: "midicps"
                        }
                      }
                    ]
                  },
                  property: {
                    type: Syntax.Identifier,
                    name: "value"
                  }
                },
                property: {
                  type: Syntax.Identifier,
                  name: "asString"
                }
              }
            },
            right: {
              type: Syntax.Literal,
              value: "'hz'",
              valueType: Token.SymbolLiteral
            },
            range: [ 0, 33 ],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 33 }
            }
          }
        ],
        range: [ 0, 33 ],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 33 }
        }
      }
    },
  };

  sc.test.parser = {
    cases: cases
  };

})(sc);

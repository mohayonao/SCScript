(function(sc) {
  "use strict";

  require("../sc");

  sc.lang.compiler = {
    Token: {
      CharLiteral: "Char",
      EOF: "<EOF>",
      FalseLiteral: "False",
      FloatLiteral: "Float",
      Identifier: "Identifier",
      IntegerLiteral: "Integer",
      Keyword: "Keyword",
      Label: "Label",
      NilLiteral: "Nil",
      Punctuator: "Punctuator",
      StringLiteral: "String",
      SymbolLiteral: "Symbol",
      TrueLiteral: "True",
      SingleLineComment: "SingleLineComment",
      MultiLineComment: "MultiLineComment"
    },
    Syntax: {
      AssignmentExpression: "AssignmentExpression",
      BinaryExpression: "BinaryExpression",
      BlockExpression: "BlockExpression",
      CallExpression: "CallExpression",
      FunctionExpression: "FunctionExpression",
      EnvironmentExpression: "EnvironmentExpression",
      Identifier: "Identifier",
      ListExpression: "ListExpression",
      Literal: "Literal",
      EventExpression: "EventExpression",
      Program: "Program",
      ThisExpression: "ThisExpression",
      UnaryExpression: "UnaryExpression",
      VariableDeclaration: "VariableDeclaration",
      VariableDeclarator: "VariableDeclarator",
      ValueMethodEvaluator: "ValueMethodEvaluator",
      ValueMethodResult: "ValueMethodResult"
    },
    Message: {
      ArgumentAlreadyDeclared: "argument '#{0}' already declared",
      InvalidLHSInAssignment: "invalid left-hand side in assignment",
      NotImplemented: "not implemented #{0}",
      UnexpectedEOS: "unexpected end of input",
      UnexpectedIdentifier: "unexpected identifier",
      UnexpectedNumber: "unexpected number",
      UnexpectedLiteral: "unexpected #{0}",
      UnexpectedToken: "unexpected token #{0}",
      VariableAlreadyDeclared: "variable '#{0}' already declared",
      VariableNotDefined: "variable '#{0}' not defined"
    },
    Keywords: {
      var: "keyword",
      arg: "keyword",
      const: "keyword",
      this: "function",
      thisThread: "function",
      thisProcess: "function",
      thisFunction: "function",
      thisFunctionDef: "function",
    },
    binaryPrecedenceDefaults: {
      "?": 1,
      "??": 1,
      "!?": 1,
      "->": 2,
      "||": 3,
      "&&": 4,
      "|": 5,
      "&": 6,
      "==": 7,
      "!=": 7,
      "===": 7,
      "!==": 7,
      "<": 8,
      ">": 8,
      "<=": 8,
      ">=": 8,
      "<<": 9,
      ">>": 9,
      "+>>": 9,
      "+": 10,
      "-": 10,
      "*": 11,
      "/": 11,
      "%": 11,
      "!": 12
    },
    tokenize: function(source, opts) {
      return new sc.lang.compiler.Lexer(source, opts).tokenize();
    },
    parse: function(source, opts) {
      // TODO: new sc.lang.compiler.Parser(null, lexer).parse();
      return sc.lang.compiler.parser.parse(source, opts);
    },
    compile: function(source, opts) {
      var ast;

      if (typeof source === "string") {
        ast = sc.lang.compiler.parse(source, opts);
      } else {
        ast = source;
      }

      ast = new sc.lang.compiler.Rewriter().rewrite(ast);

      // TODO: new sc.lang.compiler.CodeGen(ast, opts).compile();
      return sc.lang.compiler.codegen.compile(ast, opts);
    }
  };
})(sc);

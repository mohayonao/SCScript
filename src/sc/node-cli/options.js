"use strict";

var optionator = require("optionator");

module.exports = optionator({
  prepend: "Usage: scsc [options]",
  options: [
    {
      option: "compile", alias: "c", type: "Boolean",
      description: "compile to JavaScript and save as .js files"
    },
    {
      option: "eval", alias: "e", type: "Boolean",
      description: "pass a string from the command line as input"
    },
    {
      option: "help", alias: "h", type: "Boolean",
      description: "display this help message"
    },
    {
      option: "interactive", alias: "i", type: "Boolean",
      description: "run an interactive SCScript REPL"
    },
    {
      option: "nodes", alias: "n", type: "Boolean",
      description: "print out the parse tree that the parser produces"
    },
    {
      option: "output", alias: "o", type: "String",
      description: "set the output directory for compiled JavaScript"
    },
    {
      option: "print", alias: "p", type: "Boolean",
      description: "print out the compiled JavaScript"
    },
    {
      option: "stdio", alias: "s", type: "Boolean",
      description: "listen for and compile scripts over stdio"
    },
    {
      option: "tokens", alias: "t", type: "Boolean",
      description: "print out the tokens that the lexer produce"
    },
    {
      option: "version", alias: "v", type: "Boolean",
      description: "display the version number"
    },
  ]
});

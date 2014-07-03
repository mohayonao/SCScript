module.exports = function(grunt) {
  "use strict";

  var _ = require("underscore");
  var path = require("path");
  var esprima = require("esprima");
  var estraverse = require("estraverse");
  var EventEmitter = require("events").EventEmitter;
  var reqUtils = require("./assets/require");

  grunt.registerTask("-typo", function(filter) {
    var src = grunt.file._expand("src").applyFilter(filter);

    if (!src.length) {
      return;
    }

    reqUtils.clearCache();

    var checker = new TypoChecker();

    _.each(grunt.file.expand("tools/grunt-tasks/typo/*.js"), function(filename) {
      checker.addRule(path.resolve(filename));
    });

    _.chain(src).each(function(filename) {
      checker.verify(filename);
    });

    if (!checker.hasTypo) {
      grunt.log.ok(src.length + " files typo free.");
    }

    return !checker.hasTypo;
  });

  function TypoChecker() {
    this.filename   = "";
    this.sourceCode = "";
    this.hasTypo = false;
    this.emitter = new EventEmitter();
  }

  TypoChecker.prototype.addRule = function(filepath) {
    var rule = require(filepath);

    _.each(rule(this), function(func, name) {
      this.emitter.on(name, func);
    }, this);
  };

  TypoChecker.prototype.verify = function(filename) {
    this.filename   = filename;
    this.sourceCode = grunt.file.read(filename);

    var ast = esprima.parse(this.sourceCode, { loc: true });
    var emitter = this.emitter;

    estraverse.traverse(ast, {
      enter: function(node) {
        emitter.emit(node.type, node);
      },
      leave: function(node) {
        emitter.emit(node.type + ":exit", node);
      }
    });
  };

  TypoChecker.prototype.report = function(node, message) {
    var lines = this.sourceCode.split("\n");
    var lineNum = node.loc.start.line;
    var lineCol = node.loc.start.column;

    grunt.log.subhead("   " + this.filename);
    grunt.log.write(String(lineNum).rightAlign(7) + "|");
    grunt.log.writeln(lines[lineNum - 1].grey);
    grunt.log.write(" ".repeat(lineCol + 8));
    grunt.log.writeln("^ " + message);

    this.hasTypo = true;
  };
};

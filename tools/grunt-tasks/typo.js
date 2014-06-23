module.exports = function(grunt) {
  "use strict";

  var esprima = require("esprima");
  var estraverse = require("estraverse");
  var reqUtils = require("./assets/require");

  var Syntax = esprima.Syntax;

  grunt.registerTask("-typo", function(filter) {
    var src = grunt.file._expand("src").applyFilter(filter);
    var constVariables, hasTypo;

    if (!src.length) {
      return;
    }

    reqUtils.clearCache();

    constVariables = require("../../src/const");

    var detector = new Detector(constVariables);

    src.forEach(function(fileName) {
      if (detector.check(fileName)) {
        hasTypo = true;
      }
    });

    if (!hasTypo) {
      grunt.log.ok(src.length + " files typo free.");
    }

    return !hasTypo;
  });

  function Detector(constVariables) {
    this.constVariables = constVariables;
    this.hasTypo = false;
  }

  Detector.detectors = [];
  Detector.addChecker = function(callback) {
    Detector.detectors.push(callback);
    return Detector;
  };

  Detector.prototype.check = function(fileName) {
    this.fileName = fileName;
    this.sourceCode = grunt.file.read(fileName);
    this.hasTypo = false;
    var that = this, ast = esprima.parse(this.sourceCode, { loc: true });
    estraverse.traverse(ast, {
      enter: function(node, parent) {
        Detector.detectors.forEach(function(callback) {
          callback.call(that, node, parent);
        });
      }
    });
    return this.hasTypo;
  };

  Detector.prototype.showError = function(node, message) {
    var lines = this.sourceCode.split("\n");
    var lineNum = node.loc.start.line;
    var lineCol = node.loc.start.column;
    grunt.log.subhead("   " + this.fileName);
    grunt.log.write(String(lineNum).rightAlign(7) + "|");
    grunt.log.writeln(lines[lineNum - 1].grey);
    grunt.log.write(" ".repeat(lineCol + 8));
    grunt.log.writeln("^ " + message);
  };

  Detector.addChecker(function(node, parent) { // constVariables check
    if (node.type !== Syntax.Identifier) {
      return;
    }
    if (parent.type !== Syntax.MemberExpression) {
      return;
    }
    if (parent.object.type !== Syntax.Identifier) {
      return;
    }
    if (parent.object.name !== "sc") {
      return;
    }
    if (!/^[A-Z0-9_]+$/.test(node.name)) {
      return;
    }
    if (node.name !== "VERSION" && !this.constVariables.hasOwnProperty(node.name)) {
      this.showError(node, String.format("#{0} is not defined.", node.name)
      );
      this.hasTypo = true;
    }
  });

  function getArgumentDefinition(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      var node = list[i];
      if (node && node.type === Syntax.Property) {
        if (node.key.name === "args" && node.value.type === Syntax.Literal) {
          return node.value.value;
        }
      }
    }
    return null;
  }

  Detector.addChecker(function(node) { // arguments check
    if (node.type !== Syntax.CallExpression) {
      return;
    }
    if (node.callee.type !== Syntax.MemberExpression) {
      return;
    }
    if (node.callee.property.type !== Syntax.Identifier) {
      return;
    }
    if (!/^add(?:Class)?Method$/.test(node.callee.property.name)) {
      return;
    }
    if (node.arguments.length < 3) {
      return;
    }
    if (node.arguments[1].type !== Syntax.ObjectExpression) {
      return;
    }
    if (node.arguments[2].type !== Syntax.FunctionExpression) {
      return;
    }
    var args = getArgumentDefinition(node.arguments[1].properties);
    if (!args) {
      return;
    }
    var expected = args.split(";").map(function(x) {
      return "$" + x.split("=")[0].replace("*", "$").trim();
    });
    var actual = node.arguments[2].params;
    for (var i = 0, imax = Math.max(expected.length, actual.length); i < imax; ++i) {
      if (!actual[i]) {
        this.showError(
          actual[i - 1], String.format("expect #{0}, but got None", expected[i])
        );
        this.hasTypo = true;
        break;
      }
      if (expected[i] !== actual[i].name) {
        this.showError(
          actual[i], String.format("expect #{0}, but got #{1}", expected[i], actual[i].name)
        );
        this.hasTypo = true;
        break;
      }
    }
  });
};

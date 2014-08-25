/* jshint node: true */
module.exports = function(grunt) {
  "use strict";

  var _ = require("underscore");
  var path = require("path");
  var moduleSorter = require("module-sorter");
  var sorter = require("./assets/sorter");
  var srcRoot = path.resolve(__dirname, "../../src");

  var constVariables = {};

  grunt.registerTask("build", function() {
    constVariables = require("../../src/const");

    buildSCScript();
    buildClassLib();

    makeBrowserTest();
  });

  function q(str) {
    return "\"" + str + "\"";
  }

  function build(root) {
    return moduleSorter.sort(root).map(formatter).join("").trim();
  }

  function buildSCScript() {
    var tmpl = _.template(grunt.file.read(__dirname + "/assets/scscript.tmpl"));
    grunt.file.write("build/scscript.js", tmpl({
      version: q(grunt.config.data.pkg.version),
      source: build("src/sc")
    }));
  }

  function buildClassLib() {
    grunt.file.write("build/scscript-classlib.js", [
      build("src/sc/classlib")
    ].join(""));
  }

  function formatter(filepath) {
    var src;

    src = grunt.file.read(filepath);

    _.chain(constVariables).keys().each(function(key) {
      src = src.replace(new RegExp("sc." + key + "(?=\\b)", "g"), constVariables[key]);
    });

    src = src.replace(/\s*['"]use strict['"];\s*$/gm, "");
    src = src.replace(/^\s*require\("\.[^"]+"\);\s*$/gm, "");
    src = src.replace(/(\s*\n){2,}/g, "\n\n");
    src = src.trim();

    if (src) {
      src = "\n// " + path.relative(srcRoot, filepath) + "\n" + src + "\n";
    }

    return src;
  }

  function makeBrowserTest() {
    var tests, html;

    tests = grunt.file._expand("test").sort(sorter.byFilePath).map(function(filepath) {
      return "    <script src=\"../../../" + filepath + "\"></script>";
    });
    html = grunt.file.read("assets/index.tmpl").replace("#{TESTS}", tests.join("\n"));

    grunt.file.write("docs/report/test/index.html", html);
  }
};

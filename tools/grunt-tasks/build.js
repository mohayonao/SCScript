module.exports = function(grunt) {
  "use strict";

  var path = require("path");
  var sorter = require("./utils/sorter");

  var q = function(str) {
    return "\"" + str + "\"";
  };
  var constVariables = {};

  grunt.registerTask("build", function() {
    constVariables = require("../../src/const");

    buildSCScript();
    buildClassLib();

    makeBrowserTest();
  });

  var build = function(files) {
    return sortModules(files).map(formatter).join("").trim();
  };

  var buildSCScript = function() {
    var files, result;

    files  = grunt.file._expand("src", "!classlib", "!test");
    result = [
      "(function(global) {\n",
      '"use strict";\n\n',
      "var sc = { VERSION: " + q(grunt.config.data.pkg.version) + " };\n\n",
      build(files),
      "\n\n})(this.self || global);"
    ].join("");

    grunt.file.write("build/scscript.js", result);
  };

  var buildClassLib = function() {
    var files, result;

    files  = grunt.file._expand("classlib", "!test");
    result = build(files);

    grunt.file.write("build/scscript-classlib.js", result);
  };

  var sortModules = function(files) {
    var result = [];

    var walker = function(filepath) {
      var index, dir, src, re, m;

      index = result.indexOf(filepath);
      if (index !== -1) {
        result.splice(index, 1);
      }
      result.unshift(filepath);

      dir = path.dirname(filepath);
      src = grunt.file.read(filepath);

      re = /^\s*require\("(\..+?)(?:\.js)?"\);\s*$/gm;
      while ((m = re.exec(src)) !== null) {
        walker(path.join(dir, m[1] + ".js"));
      }
    };

    files.forEach(walker);

    return result;
  };

  var formatter = function(filepath) {
    var src;

    src = grunt.file.read(filepath);

    Object.keys(constVariables).forEach(function(key) {
      src = src.replace(new RegExp("sc." + key + "(?=\\b)", "g"), constVariables[key]);
    });

    src = src.replace(/\s*['"]use strict['"];\s*$/gm, "");
    src = src.replace(/^\s*require\("\.[^"]+"\);\s*$/gm, "");
    src = src.replace(/(\s*\n){2,}/g, "\n\n");
    src = src.trim();

    if (src) {
      src = "\n// " + filepath + "\n" + src + "\n";
    }

    return src;
  };

  var makeBrowserTest = function() {
    var tests, html;

    tests = grunt.file._expand("test").sort(sorter.byFilePath).map(function(filepath) {
      return "    <script src=\"../../../" + filepath + "\"></script>";
    });
    html = grunt.file.read("assets/index.tmpl").replace("#{TESTS}", tests.join("\n"));

    grunt.file.write("docs/report/test/index.html", html);
  };

};

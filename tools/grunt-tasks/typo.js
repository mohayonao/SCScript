module.exports = function(grunt) {
  "use strict";

  var reqUtils = require("./assets/require");

  grunt.registerTask("-typo", function(filter) {
    var src = grunt.file._expand("src").applyFilter(filter);
    var constVariables;
    var countOfChecked, hasTypo;

    if (!src.length) {
      return;
    }

    reqUtils.clearCache();

    countOfChecked = 0;
    constVariables = require("../../src/const");

    src.forEach(function(file) {
      var code, re, m;

      code = grunt.file.read(file);

      re = /sc\.([A-Z0-9_]+)(?=\b)/g;
      re.match = function() {
        return (re.exec(code) || [ null, null ])[1];
      };

      while ((m = re.match()) !== null) {
        if (m !== "VERSION" && !constVariables.hasOwnProperty(m)) {
          grunt.verbose.or.write("Typong " + file + "...");
          grunt.log.error();
          grunt.log.writeln("  sc." + m);
          hasTypo = true;
        }
      }
      countOfChecked += 1;
    });

    if (!hasTypo) {
      grunt.log.ok(countOfChecked + " files typo free.");
    }

    return !hasTypo;
  });

};

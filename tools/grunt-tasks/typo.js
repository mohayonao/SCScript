module.exports = function(grunt) {
  "use strict";

  var reqUtils = require("./utils/require");

  grunt.registerTask("-typo", function(filter) {
    var constVariables;
    var countOfChecked, hasTypo;

    reqUtils.clearCache();

    countOfChecked = 0;
    constVariables = require("../../src/const");

    grunt.file._expand("src").applyFilter(filter).forEach(function(file) {
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

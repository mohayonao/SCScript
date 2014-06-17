module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("-complexity", function(filter, verbose) {
    var src = grunt.file._expand("src", "!classlib", "!test").applyFilter(filter);

    if (!src.length) {
      return;
    }

    grunt._loadNpmTasksIfNeeded("grunt-complexity");

    grunt.config.data.complexity = {
      src: src,
      options: {
        breakOnErrors: false,
        errorsOnly: false,
        hideComplexFunctions: !verbose
      }
    };

    grunt.task.run("complexity");
  });

};

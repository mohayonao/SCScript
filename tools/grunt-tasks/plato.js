module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("plato", function() {
    grunt._loadNpmTasksIfNeeded("grunt-plato");

    grunt.config.data.plato = {
      options: {
        jshint: grunt.file.readJSON(".jshintrc"),
        complexity: {
          logicalor: true,
          switchcase: true,
          forin: true,
          trycatch: true
        }
      },
      dist: {
        files: {
          "docs/report/plato": grunt.file._expand("src", "!test")
        }
      }
    };

    grunt.task.run("plato");
  });
};

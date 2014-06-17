module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("-jshint", function(filter) {
    var files, tests;

    grunt._loadNpmTasksIfNeeded("grunt-contrib-jshint");

    if (filter) {
      files = [];
      tests = [];
      grunt.file._expand("all").applyFilter(filter).forEach(function(file) {
        if (!/_test\.js$/.test(file)) {
          files.push(file);
        } else {
          tests.push(file);
        }
      });
    } else {
      files = grunt.file._expand("all", "!test");
      tests = grunt.file._expand("test");
    }

    grunt.config.data.jshint = {
      options: grunt.file.readJSON(".jshintrc")
    };

    if (files.length) {
      grunt.config.data.jshint.src = files;
    }

    if (tests.length) {
      grunt.config.data.jshint.test = {
        options: grunt.file.readJSON(".jshintrc-for-test"),
        files: {
          src: tests
        }
      };
    }

    grunt.task.run("jshint");
  });

};

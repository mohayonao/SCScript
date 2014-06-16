module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("-jscs", function(filter) {
    grunt._loadNpmTasksIfNeeded("grunt-jscs-checker");

    grunt.config.data.jscs = {
      src: grunt.file._expand("src").applyFilter(filter),
      options: {
        config: ".jscsrc"
      }
    };

    grunt.task.run("jscs");
  });

};

module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("-jscs", function(filter) {
    var src = grunt.file._expand("all").applyFilter(filter);

    if (!src.length) {
      return;
    }

    grunt._loadNpmTasksIfNeeded("grunt-jscs-checker");

    grunt.config.data.jscs = {
      src: src,
      options: {
        config: ".jscsrc"
      }
    };

    grunt.task.run("jscs");
  });
};

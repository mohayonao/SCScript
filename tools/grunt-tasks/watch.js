module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("-watch", function() {
    grunt._loadNpmTasksIfNeeded("grunt-este-watch");

    grunt.config.data.esteWatch = {
      options: {
        dirs: [ "src/**/", "tools/**", "bin/", "demo/" ]
      },
      js: function(file) {
        return [ "check:" + file ];
      }
    };

    grunt.task.run("esteWatch");
  });

};

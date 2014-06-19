module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("-connect", function() {
    grunt._loadNpmTasksIfNeeded("grunt-contrib-connect");

    grunt.config.data.connect = {
      server: {
        options: {
          port: process.env.PORT || 3000,
          hostname: "*"
        }
      }
    };

    grunt.task.run("connect");
  });
};

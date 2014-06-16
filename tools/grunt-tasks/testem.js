module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("testem", [ "-testem" ]);

  grunt.registerTask("-testem", function() {
    var child, done = this.async();

    child = grunt.util.spawn({
      cmd: "testem",
      args: [ "ci", "--launch", "Chrome,Safari,Firefox,Opera" ]
    }, function() {
      done();
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

};

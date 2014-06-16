module.exports = function(grunt) {
  "use strict";

  grunt._loadNpmTasksIfNeeded = function(name) {
    if (!grunt._loadNpmTasksIfNeeded[name]) {
      grunt._loadNpmTasksIfNeeded[name] = true;
      grunt.loadNpmTasks(name);
    }
  };

  grunt.file._expand = function() {
    var result = [];
    var map = grunt.file.readJSON("./tools/grunt-tasks/utils/files.json");

    [].slice.call(arguments).forEach(function(name) {
      result.push.apply(result, map[name] || [ name ]);
    });

    result = grunt.file.expand(result);

    Object.defineProperty(result, "applyFilter", {
      value: function(filter) {
        return applyFilter(this, filter);
      }
    });

    return result;
  };

  var applyFilter = function(list, filter) {
    var result = [];

    if (filter) {
      filter.split("+").forEach(function(filter) {
        result.push.apply(result, list.filter(function(file) {
          return file.indexOf(filter) !== -1;
        }));
      });
    } else {
      result = list;
    }

    return result;
  };

  var toS = function(obj) {
    return obj || "";
  };

  var toTaskArgs = function(args) {
    args = [].slice.call(args).map(toS).join(":");
    if (args) {
      args = ":" + args;
    }
    return args;
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON("./package.json")
  });

  grunt.loadTasks("tools/grunt-tasks");

  grunt.registerTask("default", [ "-connect", "-watch" ]);

  grunt.registerTask("typo", function() {
    grunt.task.run("-typo" + toTaskArgs(arguments));
  });

  grunt.registerTask("jshint", function() {
    grunt.task.run("-jshint" + toTaskArgs(arguments));
  });

  grunt.registerTask("jscs", function() {
    grunt.task.run("-jscs" + toTaskArgs(arguments));
  });

  grunt.registerTask("test", function() {
    grunt.task.run("-mocha" + toTaskArgs(arguments));
  });

  grunt.registerTask("mocha", function() {
    grunt.task.run("-mocha" + toTaskArgs(arguments));
  });

  grunt.registerTask("lint", function(filter) {
    grunt.task.run("-typo:"   + toS(filter));
    grunt.task.run("-jscs:"   + toS(filter));
    grunt.task.run("-jshint:" + toS(filter));
  });

  grunt.registerTask("check", function(filter) {
    grunt.task.run("-typo:"   + toS(filter));
    grunt.task.run("-jscs:"   + toS(filter));
    grunt.task.run("-jshint:" + toS(filter));
    grunt.task.run("-mocha:"  + toS(filter) + ":nyan:text");
  });

  grunt.registerTask("cover", function(filter) {
    grunt.task.run("-mocha:" + toS(filter) + ":nyan:lcov");
  });

  grunt.registerTask("travis"  , [ "typo", "jscs", "jshint", "mocha::list:lcovonly" ]);
  grunt.registerTask("gh-pages", [ "build", "test::nyan:lcov", "plato" ]);

};

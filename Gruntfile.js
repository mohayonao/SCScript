module.exports = function(grunt) {
  "use strict";

  require("./tools/strlib");

  var _ = require("underscore");

  grunt._loadNpmTasksIfNeeded = function(name) {
    if (!grunt._loadNpmTasksIfNeeded[name]) {
      grunt._loadNpmTasksIfNeeded[name] = true;
      grunt.loadNpmTasks(name);
    }
  };

  grunt.file._expand = function() {
    var dict = grunt.file.readJSON("tools/grunt-tasks/assets/files.json");
    var list = grunt.file.expand(_.chain(arguments).map(function(name) {
      return dict[name] || name;
    }).flatten().value());

    Object.defineProperty(list, "applyFilter", {
      value: function(filter) {
        return applyFilter(this, filter);
      }
    });

    return list;
  };

  var applyFilter = function(list, filter) {
    return !filter ? list : _.chain(filter.split("+")).map(function(filter) {
      return _.chain(list).filter(function(file) {
        return file.indexOf(filter) !== -1;
      }).value();
    }).flatten().value();
  };

  var toTaskArgs = function(args) {
    if (_.isUndefined(args)) {
      return "";
    }
    if (_.isArguments(args)) {
      return _.map(args, toTaskArgs).join(":");
    }
    return args;
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json")
  });

  if (!_.contains(process.argv, "--help")) {
    grunt.loadTasks("tools/grunt-tasks");
  }

  grunt.registerTask(
    "default", "Start web server and run task whenever files changed.", [
      "-connect", "-watch"
    ]
  );
  grunt.registerTask(
    "typo", "Run the typo checker.", function() {
      grunt.task.run("-typo:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "jscs", "Run the code style checker.", function() {
      grunt.task.run("-jscs:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "jshint", "Run the lint checker to detect errors and potential problems.",
    function() {
      grunt.task.run("-jshint:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "test", "Run node unit tests.", function() {
      grunt.task.run("-mocha:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "mocha", "Run node unit tests.", function() {
      grunt.task.run("-mocha:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "cover", "Run node unit tests and create code coverage.", function(filter) {
      grunt.task.run("-mocha:" + toTaskArgs(filter) + ":nyan:lcov");
    }
  );
  grunt.registerTask(
    "complexity", "Report code complexity.", function() {
      grunt.task.run("-complexity:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "complex", "Report code complexity.", function() {
      grunt.task.run("-complexity:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "impl", "Report classlib methods that are not implemented.", function() {
      grunt.task.run("-impl:" + toTaskArgs(arguments));
    }
  );
  grunt.registerTask(
    "lint", 'Alias for "typo", "jscs", "jshint" tasks.', function(filter) {
      grunt.task.run("-typo:"   + toTaskArgs(filter));
      grunt.task.run("-jscs:"   + toTaskArgs(filter));
      grunt.task.run("-jshint:" + toTaskArgs(filter));
    }
  );
  grunt.registerTask(
    "check", 'Alias for "lint", "test", "complex" tasks.', function(filter) {
      grunt.task.run("lint:"        + toTaskArgs(filter));
      grunt.task.run("-mocha:"      + toTaskArgs(filter) + ":nyan:text");
      grunt.task.run("-complexity:" + toTaskArgs(filter));
    }
  );
  grunt.registerTask(
    "travis"  , "Run tasks for Travis CI.", [
      "-typo", "-jscs", "-jshint", "-mocha::list:lcovonly"
    ]
  );
  grunt.registerTask(
    "gh-pages", "Generate contents for gh-pages.", [
      "build", "test::nyan:lcov", "plato"
    ]
  );
};

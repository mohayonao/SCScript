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

  if (process.argv.every(function(arg) {
    return arg !== "--help";
  })) {
    grunt.loadTasks("tools/grunt-tasks");
  }

  grunt.registerTask("default", "Start web server and run task whenever files changed.", [ "-connect", "-watch" ]);

  grunt.registerTask("typo", "Run the typo checker.", function() {
    grunt.task.run("-typo" + toTaskArgs(arguments));
  });

  grunt.registerTask("jscs", "Run the code style checker.", function() {
    grunt.task.run("-jscs" + toTaskArgs(arguments));
  });

  grunt.registerTask("jshint", "Run the lint checker to detect errors and potential problems.", function() {
    grunt.task.run("-jshint" + toTaskArgs(arguments));
  });

  grunt.registerTask("test", "Run node unit tests.", function() {
    grunt.task.run("-mocha" + toTaskArgs(arguments));
  });

  grunt.registerTask("mocha", "Run node unit tests.", function() {
    grunt.task.run("-mocha" + toTaskArgs(arguments));
  });

  grunt.registerTask("cover", "Run node unit tests and report code coverage.", function(filter) {
    grunt.task.run("-mocha:" + toS(filter) + ":nyan:lcov");
  });

  grunt.registerTask("complexity", "Report code complexity.", function() {
    grunt.task.run("-complexity" + toTaskArgs(arguments));
  });

  grunt.registerTask("complex", "Report code complexity.", function() {
    grunt.task.run("-complexity" + toTaskArgs(arguments));
  });

  grunt.registerTask("lint", 'Alias for "typo", "jscs", "jshint" tasks.', function(filter) {
    grunt.task.run("-typo:"   + toS(filter));
    grunt.task.run("-jscs:"   + toS(filter));
    grunt.task.run("-jshint:" + toS(filter));
  });

  grunt.registerTask("check", 'Alias for "lint", "test", "complex" tasks.', function(filter) {
    grunt.task.run("lint:"        + toS(filter));
    grunt.task.run("-mocha:"      + toS(filter) + ":nyan:text");
    grunt.task.run("-complexity:" + toS(filter));
  });

  grunt.registerTask("travis"  , "Run tasks for Travis CI.", [ "-typo", "-jscs", "-jshint", "-mocha::list:lcovonly" ]);
  grunt.registerTask("gh-pages", "Generate contents for gh-pages.", [ "build", "test::nyan:lcov", "plato" ]);

};

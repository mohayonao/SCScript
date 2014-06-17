module.exports = function(grunt) {
  "use strict";

  var path = require("path");
  var Mocha = require("mocha");

  var chai = require("chai");
  var sinon = require("sinon");
  var istanbul = require("istanbul");
  var esprima = require("esprima");
  var sorter = require("./utils/sorter");
  var reqUtils = require("./utils/require");

  global.expect = chai.expect;
  global.chai = chai;
  global.sinon = sinon;
  global.esprima = esprima;

  chai.use(require("sinon-chai"));

  var trimExtJS = function(path) {
    return (/(?:src\/)?(.+?)(?:_test)?\.js$/.exec(path) || [ null, path ])[1];
  };

  var resolveFilter = function(filter) {
    var relationalTest = grunt.file.readJSON("./tools/grunt-tasks/utils/relational-test.json");

    filter = trimExtJS(filter);
    if (relationalTest[filter]) {
      filter = relationalTest[filter].join("+");
    }

    return filter;
  };

  grunt.registerTask("-mocha", function(filter, reporter, cover) {
    var mocha, done, tstFiles;
    var matchFn, coverageVar, instrumenter;

    mocha = new Mocha();
    matchFn = {};

    filter = resolveFilter(filter || "");
    tstFiles = grunt.file._expand("src").applyFilter(filter);
    tstFiles.sort(sorter.byFilePath).forEach(function(file) {
      if (/_test\.js$/.test(file)) {
        mocha.addFile(file);
      } else {
        matchFn[path.resolve(file)] = true;
      }
    });

    if (mocha.files.length === 0) {
      return;
    }

    reqUtils.clearCache();

    global.sc = {};
    require("../../src/const");
    global.sc.VERSION = grunt.config.data.pkg.version;
    global.SCScript = {
      install: function(installer) {
        installer(global.sc);
      }
    };

    if (cover) {
      coverageVar = "$$cov_" + Date.now() + "$$";
      instrumenter = new istanbul.Instrumenter({ coverageVariable: coverageVar });
      istanbul.hook.hookRequire(function(file) {
        return matchFn[file];
      }, instrumenter.instrumentSync.bind(instrumenter));
      global[coverageVar] = {};
    }
    if (!reporter) {
      reporter = "spec";
    }

    require("../test-utils");

    done = this.async();
    mocha.reporter(reporter).run(function(failure) {
      var collector;

      if (cover) {
        collector = new istanbul.Collector();
        collector.add(global[coverageVar]);

        if (cover !== "text") {
          istanbul.Report.create(cover, { dir: "docs/report" }).writeReport(collector, true);
        }

        istanbul.Report.create("text").writeReport(collector, true);
      }

      done(!failure);
    });
  });

};

/* jshint node: true */
module.exports = function(grunt) {
  "use strict";

  var path = require("path");
  var Mocha = require("mocha");

  var _ = require("underscore");
  var chai = require("chai");
  var sinon = require("sinon");
  var istanbul = require("istanbul");
  var esprima = require("esprima");
  var sorter = require("./assets/sorter");
  var reqUtils = require("./assets/require");

  global.expect = chai.expect;
  global.chai = chai;
  global.sinon = sinon;
  global.esprima = esprima;
  global._ = _;

  chai.use(require("sinon-chai"));

  var trimExtJS = function(path) {
    return (/(?:src\/)?(.+?)(?:_test)?\.js$/.exec(path) || [ null, path ])[1];
  };

  var resolveFilter = function(filter) {
    var relationalTest = grunt.file.readJSON(__dirname + "/assets/relational-test.json");

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
      if (cover) {
        createCoverageReport(cover);
      }

      done(!failure);
    });

    var createCoverageReport = function(cover) {
      var collector, reports = [];

      collector = new istanbul.Collector();
      collector.add(global[coverageVar]);

      if (cover !== "text") {
        reports.push(istanbul.Report.create(cover, { dir: "docs/report" }));
      }
      reports.push(istanbul.Report.create("text"));

      _.each(reports, function(report) {
        report.writeReport(collector, true);
      });
    };
  });
};

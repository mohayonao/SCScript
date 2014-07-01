module.exports = function(grunt) {
  "use strict";

  var _ = require("underscore");
  var IMPLEMENTED     = true;
  var NOT_IMPLEMENTED = false;

  grunt.registerTask("-impl", function(filter, style) {
    var src = grunt.file._expand("classlib", "!test").applyFilter(filter);

    if (!src.length) {
      return;
    }

    var reporter = new Reporter(style);

    _.each(src, function(file) {
      _.each(grunt.file.read(file).split("\n"), function(line) {
        var re, methodIdentifier;

        re = /klass\.(?:define|refine)\("(.+?)(?:\s*:[^"]+)?"/.exec(line);
        if (re) {
          reporter.setKlassName(re[1]);
        }

        re = /\s*builder\.add(Class)?Method\(\"(.+?)\",/.exec(line);
        if (re) {
          methodIdentifier = (re[1] ? "." : "#") + re[2];
          reporter.addMethod(methodIdentifier, IMPLEMENTED);
        }

        re = /TODO:\s*implements\s*(\$)?(.+)$/.exec(line);
        if (re) {
          methodIdentifier = (re[1] ? "." : "#") + re[2];
          reporter.addMethod(methodIdentifier, NOT_IMPLEMENTED);
        }
      });
    });

    reporter.report();
  });

  var Reporter = (function() {
    function Reporter(style) {
      this._db = {};
      this._current = null;
      this._addMethod = addMethodDelegate[style] || addMethodDelegate.verbose;
    }

    Reporter.prototype.setKlassName = function(klassName) {
      this._current = {
        name: klassName,
        buffer: [],
        countOfMethods: 0,
        countOfNotImpl: 0
      };
      this._db[klassName] = this._current;
    };

    Reporter.prototype.addMethod = function(methodIdentifier, impl) {
      if (!this._current) {
        return;
      }
      this._addMethod(methodIdentifier, impl);
    };

    Reporter.prototype.report = function() {
      _.chain(this._db).values().each(function(data) {
        grunt.log.writeln(
          (data.name + ": " + data.countOfNotImpl + " items are not implemented").green
        );
        if (data.buffer.length) {
          _.each(data.buffer, function(line) {
            grunt.log.writeln(" " + line);
          });
          grunt.log.writeln();
        }
      });
    };

    var addMethodDelegate = {
      min: function(methodIdentifier, impl) {
        if (!impl) {
          this._current.countOfNotImpl += 1;
        }
        this._current.countOfMethods += 1;
      },
      list: function(methodIdentifier, impl) {
        if (!impl) {
          addMethodDelegate.verbose.call(this, methodIdentifier, impl);
        }
      },
      verbose: function(methodIdentifier, impl) {
        var line = this._current.name + methodIdentifier;

        if (impl) {
          line = line.grey;
        } else {
          line = line.yellow;
          this._current.countOfNotImpl += 1;
        }

        this._current.countOfMethods += 1;
        this._current.buffer.push(line);
      }
    };

    return Reporter;
  })();
};

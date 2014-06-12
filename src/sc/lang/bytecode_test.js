(function() {
  "use strict";

  require("./bytecode");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var bytecode = sc.lang.bytecode;

  describe("sc.lang.bytecode", function() {
    it("empty function", function() {
      var f;

      f = bytecode.create(function() {
        return [];
      });

      expect(f.resume(), 1).to.be.a("SCNil");
      expect(f.resume(), 2).to.be.a("SCNil");
    });
    it("break", function() {
      var f;

      f = $.Function(function() {
        return [
          function() {
            this.break();
          },
          function() {
            throw new Error("should not be reached");
          }
        ];
      });

      expect(f.value(), 1).to.be.a("SCNil");
      expect(f.value(), 2).to.be.a("SCNil");
    });
    it("resume", function() {
      var f;

      f = $$(function($a, $b) {
        return $$([ $a, $b ]);
      }, "a=0; b=1");

      expect(f.value(), 1).to.be.a("SCArray").to.eql([ 0, 1 ]);
      expect(f.value(), 2).to.be.a("SCArray").to.eql([ 0, 1 ]);
    });
    it("iterator", function() {
      var f;

      f = $$(function() {
        return $$([ 1, 2, 3 ]).collect($$(function($_) {
          return $_.neg();
        }));
      });

      expect(f.value(), 1).to.be.a("SCArray").that.eqls([ -1, -2, -3 ]);
      expect(f.value(), 2).to.be.a("SCArray").that.eqls([ -1, -2, -3 ]);
    });
    it("value", function() {
      var f, passed;

      f = $.Function(function() {
        return [
          function() {
            return $.Function(function() {
              return [
                function() {
                  return $$(function() {
                    passed.push(1);
                    return $$(1);
                  }).value();
                },
                function() {
                  return $$(function() {
                    passed.push(2);
                    return $$(2);
                  }).value();
                },
              ];
            }).value();
          },
          function() {
            return $.Function(function() {
              return [
                function() {
                  return $$(function() {
                    passed.push(3);
                    return $$(3);
                  }).value();
                },
                function() {
                  return $$(function() {
                    passed.push(4);
                    return $$(4);
                  }).value();
                },
              ];
            }).value();
          }
        ];
      });

      passed = [];
      expect(f.value(), 1).to.be.a("SCInteger").that.equals(4);
      expect(passed).to.eql([ 1, 2, 3, 4 ]);

      passed = [];
      expect(f.value(), 2).to.be.a("SCInteger").that.equals(4);
      expect(passed).to.eql([ 1, 2, 3, 4 ]);
    });
    it("delay estimation", function() {
      var f;

      f = $.Function(function() {
        return [
          function() {
            return this.push($.Function(function() {
              return [
                function() {
                  return $$(1).yield();
                },
                function() {
                  return $$(2).yield();
                },
              ];
            }).value());
          },
          function() {
            return this.shift().$("+", [ $$(1) ]);
          }
        ];
      });

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 2).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(3);

      expect(f.value(), 4).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 6).to.be.a("SCInteger").that.equals(3);
    });
    it("yield", function() {
      var f;

      f = $.Function(function() {
        return [
          function() {
            return $$(1).yield();
          },
          function() {
            return $$(2).yield();
          },
          function() {
            return $$(3).yield();
          }
        ];
      });

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 2).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(3);

      expect(f.value(), 4).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 6).to.be.a("SCInteger").that.equals(3);
    });
    it("yield nested", function() {
      var f;

      f = $.Function(function() {
        return [
          function() {
            return $$(1).yield();
          },
          function() {
            return $.Function(function() {
              return [
                function() {
                  return $$(2).yield();
                },
                function() {
                  return $$(3).yield();
                },
              ];
            }).value();
          },
          function() {
            return $$(4).yield();
          }
        ];
      });

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 2).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(3);
      expect(f.value(), 4).to.be.a("SCInteger").that.equals(4);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 6).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 7).to.be.a("SCInteger").that.equals(3);
      expect(f.value(), 8).to.be.a("SCInteger").that.equals(4);
    });
  });

})();

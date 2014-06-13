(function() {
  "use strict";

  require("./bytecode");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var bytecode = sc.lang.bytecode;

  var state = function(f) {
    return f.state().valueOf();
  };

  describe("sc.lang.bytecode", function() {
    it("empty function", function() {
      var f;

      f = bytecode.create(function() {
        return [];
      });

      expect(state(f)  , 0).to.equal(sc.C.STATE_DONE);

      expect(f.resume(), 1).to.be.a("SCNil");
      expect(state(f)  , 2).to.equal(sc.C.STATE_DONE);

      expect(f.resume(), 3).to.be.a("SCNil");
      expect(state(f)  , 4).to.equal(sc.C.STATE_DONE);
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

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCNil");
      expect(state(f) , 2).to.equal(sc.C.STATE_DONE);

      expect(f.value(), 3).to.be.a("SCNil");
      expect(state(f) , 4).to.equal(sc.C.STATE_DONE);
    });
    it("resume", function() {
      var f;

      f = $$(function($a, $b) {
        return $$([ $a, $b ]);
      }, "a=0; b=1");

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCArray").to.eql([ 0, 1 ]);
      expect(state(f) , 2).to.equal(sc.C.STATE_DONE);

      expect(f.value(), 3).to.be.a("SCArray").to.eql([ 0, 1 ]);
      expect(state(f) , 4).to.equal(sc.C.STATE_DONE);
    });
    it("iterator", function() {
      var f;

      f = $$(function() {
        return $$([ 1, 2, 3 ]).collect($$(function($_) {
          return $_.neg();
        }));
      });

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCArray").that.eqls([ -1, -2, -3 ]);
      expect(state(f) , 2).to.equal(sc.C.STATE_DONE);

      expect(f.value(), 3).to.be.a("SCArray").that.eqls([ -1, -2, -3 ]);
      expect(state(f) , 4).to.equal(sc.C.STATE_DONE);
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

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      passed = [];
      expect(f.value(), 1).to.be.a("SCInteger").that.equals(4);
      expect(passed   , 2).to.eql([ 1, 2, 3, 4 ]);
      expect(state(f) , 3).to.equal(sc.C.STATE_DONE);

      passed = [];
      expect(f.value(), 4).to.be.a("SCInteger").that.equals(4);
      expect(passed   , 5).to.eql([ 1, 2, 3, 4 ]);
      expect(state(f) , 6).to.equal(sc.C.STATE_DONE);
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
            return this.shift().$("+", [ $$(1) ]).yield();
          }
        ];
      });

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 2).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(2);
      expect(state(f) , 4).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(3);
      expect(state(f) , 6).to.equal(sc.C.STATE_DONE);

      expect(f.value(), 7).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 8).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 9).to.be.a("SCInteger").that.equals(2);
      expect(state(f) ,10).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(),11).to.be.a("SCInteger").that.equals(3);
      expect(state(f) ,12).to.equal(sc.C.STATE_DONE);
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

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 2).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(2);
      expect(state(f) , 4).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(3);
      expect(state(f) , 6).to.equal(sc.C.STATE_DONE);

      expect(f.value(), 7).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 8).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 9).to.be.a("SCInteger").that.equals(2);
      expect(state(f) ,10).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(),11).to.be.a("SCInteger").that.equals(3);
      expect(state(f) ,12).to.equal(sc.C.STATE_DONE);
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

      expect(state(f) , 0).to.equal(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 2).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(2);
      expect(state(f) , 4).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(3);
      expect(state(f) , 6).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(), 7).to.be.a("SCInteger").that.equals(4);
      expect(state(f) , 8).to.equal(sc.C.STATE_DONE);

      expect(f.value(), 9).to.be.a("SCInteger").that.equals(1);
      expect(state(f) ,10).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(),11).to.be.a("SCInteger").that.equals(2);
      expect(state(f) ,12).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(),13).to.be.a("SCInteger").that.equals(3);
      expect(state(f) ,14).to.equal(sc.C.STATE_SUSPENDED);
      expect(f.value(),15).to.be.a("SCInteger").that.equals(4);
      expect(state(f) ,16).to.equal(sc.C.STATE_DONE);
    });
    it("yield with iterator 1", function() {
      var f;

      f = $$(function() {
        return $$([ 1, 2, 3 ]).do($$(function($_) {
          return $_.yield();
        }));
      });

      expect(state(f) , 0).to.equals(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 2).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(2);
      expect(state(f) , 4).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(3);
      expect(state(f) , 6).to.equals(sc.C.STATE_DONE);

      expect(f.value(), 7).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 8).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 9).to.be.a("SCInteger").that.equals(2);
      expect(state(f) ,10).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),11).to.be.a("SCInteger").that.equals(3);
      expect(state(f) ,12).to.equals(sc.C.STATE_DONE);
    });
    it("yield with iterator 2", function() {
      var f;

      f = $.Function(function() {
        return [
          function() {
            return $$([ 1, 2 ]).do($$(function($_) {
              return $_.yield();
            }));
          },
          function() {
            return $$([ 3, 5 ]).do($.Function(function() {
              var $_;
              return [
                function(_arg0) {
                  $_ = _arg0;
                  return $_.yield();
                }, function() {
                  return $_.$("+", [ $$(1) ]).yield();
                }
              ];
            }));
          },
          function() {
            return $$([]).do($$(function($_) {
              return $_.yield();
            }));
          }
        ];
      });

      expect(state(f) , 0).to.equals(sc.C.STATE_INIT);

      expect(f.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(state(f) , 2).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(2);
      expect(state(f) , 4).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 5).to.be.a("SCInteger").that.equals(3);
      expect(state(f) , 6).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 7).to.be.a("SCInteger").that.equals(4);
      expect(state(f) , 8).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(), 9).to.be.a("SCInteger").that.equals(5);
      expect(state(f) ,10).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),11).to.be.a("SCInteger").that.equals(6);
      expect(state(f) ,12).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),13).to.be.a("SCNil");
      expect(state(f) ,14).to.equals(sc.C.STATE_DONE);

      expect(f.value(),15).to.be.a("SCInteger").that.equals(1);
      expect(state(f) ,16).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),17).to.be.a("SCInteger").that.equals(2);
      expect(state(f) ,18).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),19).to.be.a("SCInteger").that.equals(3);
      expect(state(f) ,20).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),21).to.be.a("SCInteger").that.equals(4);
      expect(state(f) ,22).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),23).to.be.a("SCInteger").that.equals(5);
      expect(state(f) ,24).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),25).to.be.a("SCInteger").that.equals(6);
      expect(state(f) ,26).to.equals(sc.C.STATE_SUSPENDED);
      expect(f.value(),27).to.be.a("SCNil");
      expect(state(f) ,28).to.equals(sc.C.STATE_DONE);
    });
  });

})();

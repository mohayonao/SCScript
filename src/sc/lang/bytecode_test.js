describe("sc.lang.bytecode", function() {
  "use strict";

  var $$ = sc.test.object;
  var $  = sc.lang.$;
  var SCRoutine = $("Routine");

  var SHOULD_BE_IGNORED = function() {
    return $$("\\should be ignored");
  };

  describe("current", function() {
    var current;

    before(function() {
      current = sc.lang.bytecode.getCurrent();
    });
    after(function() {
      sc.lang.bytecode.setCurrent(current);
    });

    it("getCurrent / setCurrent", function() {
      sc.lang.bytecode.setCurrent(12345);

      var test = sc.lang.bytecode.getCurrent();

      expect(test).to.equal(12345);
    });
  });

  describe("as Function", function() {
    it("empty", function() {
      /*
        f = {}
      */
      var f = $.Function(function() {
        return [];
      }, null, null);

      expect(f.value(), 0).to.be.a("SCNil");
      expect(f.value(), 1).to.be.a("SCNil");
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("return", function() {
      /*
        f = { 10 }
      */
      var f = $$(function() {
        return $$(10);
      });

      expect(f.value(), 0).to.be.a("SCInteger").that.equals(10);
      expect(f.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("yield", function() {
      /*
        f = { 10.yield }
      */
      var f = $$(function() {
        return $$(10).yield();
      });

      expect(function() {
        f.value();
      }).to.throw("yield was called outside of a Routine");
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("args", function() {
      /*
        f = { |a, b| [ a, b ] }
      */
      var f = $.Function(function() {
        return [ function($a, $b) {
          return $$([ $a, $b ]);
        } ];
      }, "a=0; b=1", null);

      expect(f.value()              , 0).to.be.a("SCArray").that.deep.equals([  0,  1 ]);
      expect(f.value($$(10))        , 1).to.be.a("SCArray").that.deep.equals([ 10,  1 ]);
      expect(f.value($$(10), $$(20)), 2).to.be.a("SCArray").that.deep.equals([ 10, 20 ]);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("break", function() {
      /*
        f = { ^10; throw('should not be reached') }
      */
      var spy = sinon.spy();
      var f = $.Function(function(_) {
        return [
          function() {
            _.break();
            return $$(10);
          },
          function() {
            throw new Error("should not be reached");
          },
          spy
        ];
      }, null, []);

      expect(spy      , 0).to.callCount(0);
      expect(f.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(spy      , 2).to.callCount(1);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(10);
      expect(spy      , 4).to.callCount(2);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("iterator", function() {
      /*
        f = { [ 10, 20, 30 ].collect(_.neg) }
      */
      var f = $$(function() {
        return $$([ 10, 20, 30 ]).collect($$(function($_) {
          return $_.neg();
        }));
      });

      expect(f.value(), 0).to.be.a("SCArray").that.deep.equals([ -10, -20, -30 ]);
      expect(f.value(), 1).to.be.a("SCArray").that.deep.equals([ -10, -20, -30 ]);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("iterator break", function() {
      var f = $$(function() {
        return $$(100).do($.Function(function(_) {
          return [ function($_) {
            passed += 1;
            if ($_.valueOf() === 5) {
              _.break();
            }
          } ];
        }, null, null));
      }), passed;

      passed = 0;
      expect(f.value(), 0).to.be.a("SCInteger").that.equals(100);
      expect(passed   , 1).to.equals(6);

      passed = 0;
      expect(f.value(), 0).to.be.a("SCInteger").that.equals(100);
      expect(passed   , 1).to.equals(6);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("value", function() {
      /*
        f = {
          {
            { 10 }.value;
            { 20 }.value;
          }.value;
          {
            { 30 }.value;
            { 40 }.value;
          }.value;
        };
      */
      var assert = function($actual, expected) {
        expect($actual.valueOf()).to.equal(expected);
        return $actual;
      };
      var spy = sinon.spy();
      var f = $.Function(function(_) {
        return [
          function() {
            return _.push(), $.Func(function() {
              return $$(10);
            }).value();
          },
          function() {
            return _.push(), $.Func(function() {
              return $$(20);
            }).value();
          },
          function() {
            return _.push(), $.Function(function(_) {
              return [ function() {
                assert(_.shift(), 10);
                return assert(_.shift(), 20);
              } ];
            }, null, null).value();
          },
          function() {
            assert(_.shift(), 20);
            return _.push(), $.Func(function() {
              return $$(30);
            }).value();
          },
          function() {
            return _.push(), $.Func(function() {
              return $$(40);
            }).value();
          },
          function() {
            return _.push(), $.Function(function(_) {
              return [ function() {
                assert(_.shift(), 30);
                return assert(_.shift(), 40);
              } ];
            }, null, null).value();
          },
          function() {
            return assert(_.shift(), 40);
          },
          spy
        ];
      }, null, []);

      expect(spy      , 0).to.callCount(0);
      expect(f.value(), 1).to.be.a("SCInteger").that.equals(40);
      expect(spy      , 2).to.callCount(1);
      expect(f.value(), 3).to.be.a("SCInteger").that.equals(40);
      expect(spy      , 4).to.callCount(2);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("function$while", function() {
      /*
        i = 0;
        while { i < 3 } { i = i + 1; }
      */
      var i = 0, spy;

      $$(function() {
        return $$(i < 3);
      }).while($$(spy = sinon.spy(function() {
        i = i + 1;
      }))).value();

      expect(spy).to.callCount(3);
    });

    it("Array.fill", function() {
      /* f = { Array.fill(4, { |i| i + 1 }) } */
      var f = $$(function() {
        return $("Array").fill($$(4), $$(function($i) {
          return $i ["+"] ($$(1));
        }));
      });

      expect(f.value()).to.be.a("SCArray").that.deep.equals([ 1, 2, 3, 4 ]);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });
  });

  describe("as Routine", function() {
    it("empty", function() {
      /*
        r = r {}
      */
      var r = SCRoutine.new($.Function(function() {
        return [];
      }, null, null));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCNil");
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(r.value(), 3).to.be.a("SCNil");
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("return", function() {
      /*
        r = r { 10 }
      */
      var r = SCRoutine.new($$(function() {
        return $$(10);
      }));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCNil");
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(r.value(), 3).to.be.a("SCNil");
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("yield", function() {
      /*
        r = r { 10.yield }
      */
      var r = SCRoutine.new($$(function() {
        return $$(10).yield();
      }));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCNil");
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("args", function() {
      /*
        r = r { |a, b| [ a, b ].yield }
      */
      var r = SCRoutine.new($$(function($a, $b) {
        return $$([ $a, $b ]).yield();
      }, "a=0; b=1"));

      expect(r.reset().value()              , 0).to.be.a("SCArray").that.deep.equals([ null, 1 ]);
      expect(r.reset().value($$(10))        , 1).to.be.a("SCArray").that.deep.equals([ 10, 1 ]);
      expect(r.reset().value($$(10), $$(20)), 2).to.be.a("SCArray").that.deep.equals([ 10, 1 ]);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("break", function() {
      var spy = sinon.spy();
      var r = SCRoutine.new($.Function(function(_) {
        return [
          function() {
            _.break();
            return $$(10).yield();
          },
          function() {
            throw new Error("should not be reached");
          },
          spy
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy      , 3).to.callCount(0);
      expect(r.value(), 4).to.be.a("SCNil");
      expect(spy      , 5).to.callCount(1);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("n-times yield", function() {
      /*
        r = r {
          10.yield;
          20.yield;
          30.yield;
          40.yield
        }
      */
      var spy = sinon.spy();
      var r = SCRoutine.new($.Function(function() {
        return [
          SHOULD_BE_IGNORED,
          function() {
            return $$(10).yield();
          },
          SHOULD_BE_IGNORED,
          function() {
            return $$(20).yield();
          },
          SHOULD_BE_IGNORED,
          function() {
            return $$(30).yield();
          },
          SHOULD_BE_IGNORED,
          function() {
            return $$(40).yield();
          },
          SHOULD_BE_IGNORED,
          spy
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(20);
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 5).to.be.a("SCInteger").that.equals(30);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 7).to.be.a("SCInteger").that.equals(40);
      expect(r.state(), 8).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy      , 9).to.callCount(0);
      expect(r.value(),10).to.be.a("SCNil");
      expect(spy      ,11).to.callCount(1);
      expect(r.state(),12).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("nested yield", function() {
      /*
        r = r {
          10.yield;
          {
            20.yield;
            30.yield;
          }.value;
          40.yield;
        }
      */
      var spy = sinon.spy();
      var r = SCRoutine.new($.Function(function() {
        return [
          SHOULD_BE_IGNORED,
          function() {
            return $$(10).yield();
          },
          SHOULD_BE_IGNORED,
          function() {
            return $.Function(function() {
              return [
                SHOULD_BE_IGNORED,
                function() {
                  return $$(20).yield();
                },
                SHOULD_BE_IGNORED,
                function() {
                  return $$(30).yield();
                },
                SHOULD_BE_IGNORED
              ];
            }, null, null).value();
          },
          SHOULD_BE_IGNORED,
          function() {
            return $$(40).yield();
          },
          SHOULD_BE_IGNORED,
          spy
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(20);
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 5).to.be.a("SCInteger").that.equals(30);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 7).to.be.a("SCInteger").that.equals(40);
      expect(r.state(), 8).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy      , 9).to.callCount(0);
      expect(r.value(),10).to.be.a("SCNil");
      expect(spy      ,11).to.callCount(1);
      expect(r.state(),12).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("iterator yield", function() {
      /*
        r = r { [ 10, 20, 30, 40 ].do(_.yield) }
      */
      var r = SCRoutine.new($$(function() {
        return $$([ 10, 20, 30, 40 ]).do($$(function($_) {
          return $_.yield();
        }));
      }));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(20);
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 5).to.be.a("SCInteger").that.equals(30);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 7).to.be.a("SCInteger").that.equals(40);
      expect(r.state(), 8).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 9).to.be.a("SCNil");
      expect(r.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("iterator n-times yield", function() {
      /*
        r = r {
          [ 10, 30 ].do({ |i|
            (i+ 0).yield;
            (i+10).yield;
          })
        }
      */
      var spy = sinon.spy();
      var r = SCRoutine.new($$(function() {
        return $$([ 10, 30 ]).do($.Function(function() {
          var $i;
          return [
            function(_arg0) {
              $i = _arg0;
              return ($i ["+"] ($$( 0))).yield();
            },
            function() {
              return ($i ["+"] ($$(10))).yield();
            },
            spy
          ];
        }, null, []));
      }));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(20);
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 5).to.be.a("SCInteger").that.equals(30);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy      , 7).to.callCount(0);
      expect(r.value(), 8).to.be.a("SCInteger").that.equals(40);
      expect(spy      , 9).to.callCount(1);
      expect(r.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(),11).to.be.a("SCNil");
      expect(r.state(),12).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("yieldAndReset", function() {
      /*
        r = r {
        	10.yield;
        	{
        		20.yield;
        		30.yieldAndReset;
            40.yield;
        	}.value;
        	50.yield;
        };
      */
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var r = SCRoutine.new($.Function(function(_) {
        return [
          function() {
            return $$(10).yield();
          },
          function() {
            return _.push(), $.Function(function() {
              return [
                function() {
                  return $$(20).yield();
                },
                function() {
                  return $$(30).yieldAndReset();
                },
                function() {
                  return $$(40).yield();
                },
                spy1
              ];
            }, null, []).value();
          },
          function() {
            _.shift();
            return $$(50).yield();
          },
          spy2
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(20);
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy1     , 5).to.callCount(0);
      expect(spy2     , 6).to.callCount(0);
      expect(r.value(), 7).to.be.a("SCInteger").that.equals(30);
      expect(spy1     , 8).to.callCount(1);
      expect(spy2     , 9).to.callCount(1);
      expect(r.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(),11).to.be.a("SCInteger").that.equals(10);
      expect(r.state(),12).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(),13).to.be.a("SCInteger").that.equals(20);
      expect(r.state(),14).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy1     ,15).to.callCount(1);
      expect(spy2     ,16).to.callCount(1);
      expect(r.value(),17).to.be.a("SCInteger").that.equals(30);
      expect(spy1     ,18).to.callCount(2);
      expect(spy2     ,19).to.callCount(2);
      expect(r.state(),20).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("alwaysYield", function() {
      /*
        r = r {
          10.yield;
          {
            20.yield;
            30.alwaysYield;
            40.yield;
          }.value;
          50.yield;
        };
      */
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var r = SCRoutine.new($.Function(function(_) {
        return [
          function() {
            return $$(10).yield();
          },
          function() {
            return _.push(), $.Function(function() {
              return [
                function() {
                  return $$(20).yield();
                },
                function() {
                  return $$(30).alwaysYield();
                },
                function() {
                  return $$(40).yield();
                },
                spy1
              ];
            }, null, []).value();
          },
          function() {
            _.shift();
            return $$(50).yield();
          },
          spy2
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(20);
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy1     , 5).to.callCount(0);
      expect(spy2     , 6).to.callCount(0);
      expect(r.value(), 7).to.be.a("SCInteger").that.equals(30);
      expect(spy1     , 8).to.callCount(1);
      expect(spy2     , 9).to.callCount(1);
      expect(r.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(r.value(),11).to.be.a("SCInteger").that.equals(30);
      expect(r.reset(),12).to.equals(r);
      expect(r.state(),13).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(),14).to.be.a("SCInteger").that.equals(10);
      expect(r.state(),15).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(),16).to.be.a("SCInteger").that.equals(20);
      expect(r.state(),17).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy1     ,18).to.callCount(1);
      expect(spy2     ,19).to.callCount(1);
      expect(r.value(),20).to.be.a("SCInteger").that.equals(30);
      expect(spy1     ,21).to.callCount(2);
      expect(spy2     ,22).to.callCount(2);
      expect(r.state(),23).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(r.value(),24).to.be.a("SCInteger").that.equals(30);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("value", function() {
      /*
        r = r {
          {
            { 10 }.value.yield;
            { 20 }.value.yield;
          }.value.yield;
          {
            { 30 }.value.yield;
            { 40 }.value.yield;
          }.value.yield;
        };
      */
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var r = SCRoutine.new($.Function(function(_) {
        return [
          function() {
            return _.push(), $.Func(function() {
              return $$(10);
            }).value();
          },
          function() {
            return _.push(), $.Func(function() {
              return $$(20);
            }).value();
          },
          function() {
            return _.push(), $.Function(function(_) {
              return [
                function() {
                  return _.shift().yield();
                },
                function() {
                  return _.shift().yield();
                },
                spy1
              ];
            }, null, []).value();
          },
          function() {
            var $a = _.shift();
            return $a.yield();
          },
          function() {
            return _.push(), $.Func(function() {
              return $$(30);
            }).value();
          },
          function() {
            return _.push(), $.Func(function() {
              return $$(40);
            }).value();
          },
          function() {
            return _.push(), $.Function(function(_) {
              return [
                function() {
                  return _.shift().yield();
                },
                function() {
                  return _.shift().yield();
                },
                spy2
              ];
            }, null, []).value();
          },
          function() {
            return _.shift().yield();
          },
          spy3
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy1     , 3).to.callCount(0);
      expect(r.value(), 4).to.be.a("SCInteger").that.equals(20);
      expect(spy1     , 5).to.callCount(1);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 7).to.be.a("SCNil");
      expect(r.state(), 8).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 9).to.be.a("SCInteger").that.equals(30);
      expect(r.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy2     ,11).to.callCount(0);
      expect(r.value(),12).to.be.a("SCInteger").that.equals(40);
      expect(spy2     ,13).to.callCount(1);
      expect(r.state(),14).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(),15).to.be.a("SCNil");
      expect(r.state(),16).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy3     ,17).to.callCount(0);
      expect(r.value(),18).to.be.a("SCNil");
      expect(spy3     ,19).to.callCount(1);
      expect(r.state(),20).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("value.yield", function() {
      /*
        a = Pseq.new([ 10, 20, 30 ]).asStream;
        r = r { a.value.yield; };
      */
      var spy = sinon.spy();
      var a = sc.test.routine([ 10, 20, 30 ]);
      var r = SCRoutine.new($.Function(function(_) {
        return [
          function() {
            return _.push(), a.value();
          },
          function() {
            return _.shift().yield();
          },
          spy
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy      , 3).to.callCount(0);
      expect(r.value(), 4).to.be.a("SCNil");
      expect(spy      , 5).to.callCount(1);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("routine value", function() {
      /*
        r = r { var a = { 10.yield; 20 }.value; a.yield }
      */
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var r = SCRoutine.new($.Function(function(_) {
        var $a;
        return [
          function() {
            return _.push(), $.Function(function() {
              return [
                function() {
                  return $$(10).yield();
                },
                function() {
                  return $$(20);
                },
                spy1
              ];
            }, null, []).value();
          },
          function() {
            $a = _.shift();
            return $a.yield();
          },
          spy2
        ];
      }, null, []));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy1     , 3).to.callCount(0);
      expect(r.value(), 4).to.be.a("SCInteger").that.equals(20);
      expect(spy1     , 5).to.callCount(1);
      expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(spy2     , 7).to.callCount(0);
      expect(r.value(), 8).to.be.a("SCNil");
      expect(spy2     , 9).to.callCount(1);
      expect(r.state(),10).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("function$while", function() {
      /*
        i = 0;
        r = r {
          while { i < 3 } { i = i + 1 }
        }
      */
      var i = 0, spy;
      var r = SCRoutine.new($$(function() {
        return $$(function() {
          return $$(i < 3);
        }).while($$(spy = sinon.spy(function() {
          i = i + 1;
        })));
      }));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCNil");
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(spy).to.callCount(3);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("use iterator in a Function", function() {
      /*
        r = Pseq.new([ 1, 2, 3 ]).asStream;
        f = { r.value };
      */
      var r = sc.test.routine([ 1, 2, 3 ]);
      var f = $$(function() {
        return r.value();
      });

      expect(f.value(), 0).to.be.a("SCInteger").that.equals(1);
      expect(f.value(), 1).to.be.a("SCInteger").that.equals(2);
      expect(f.value(), 2).to.be.a("SCInteger").that.equals(3);
      expect(f.value(), 3).to.be.a("SCNil");
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("use iterators at the same time", function() {
      /*
        a = Pseq.new([   1,   2,   3 ]).asStream;
        b = Pseq.new([  10,  20,  30 ]).asStream;
        c = Pseq.new([ 100, 200, 300 ]).asStream;
        f = { [ a.value, b.value, c.value ] };
      */
      var a = sc.test.routine([   1,   2,   3 ]);
      var b = sc.test.routine([  10,  20,  30 ]);
      var c = sc.test.routine([ 100, 200, 300 ]);
      var f = $$(function() {
        return $$([ a.value(), b.value(), c.value() ]);
      });

      expect(f.value(), 0).to.be.a("SCArray").that.deep.equals([ 1, 10, 100 ]);
      expect(f.value(), 1).to.be.a("SCArray").that.deep.equals([ 2, 20, 200 ]);
      expect(f.value(), 2).to.be.a("SCArray").that.deep.equals([ 3, 30, 300 ]);
      expect(f.value(), 3).to.be.a("SCArray").that.deep.equals([ null, null, null ]);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });

    it("Array.fill", function() {
      /* r = r { Array.fill(4, { |i| i + 1 }).yield } */
      var r = SCRoutine.new($$(function() {
        return $("Array").fill($$(4), $$(function($i) {
          return $i ["+"] ($$(1));
        })).yield();
      }));

      expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
      expect(r.value(), 1).to.be.a("SCArray").that.deep.equals([ 1, 2, 3, 4 ]);
      expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
      expect(r.value(), 3).to.be.a("SCNil");
      expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
      expect(sc.lang.bytecode.getCurrent(), "bytecode.current should be null").to.be.null;
    });
  });
});

(function() {
  "use strict";

  require("./bytecode");
  require("./main");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  function arrayToRoutine(array) {
    return $("Routine").new($$(function() {
      return $$(array).do($$(function($_) {
        return $_.yield();
      }));
    }));
  }

  var SHOULD_BE_IGNORED = function() {
    return $$("\\should be ignored");
  };

  describe("sc.lang.bytecode", function() {
    var currentThread;
    before(function() {
      currentThread = sc.lang.main.$currentThread;
      sc.lang.main.$currentThread = {
        __tag: sc.TAG_OBJ
      };
    });
    after(function() {
      sc.lang.main.$currentThread = currentThread;
    });
    describe("as Function", function() {
      it("empty", function() {
        /*
          f = {}
        */
        var f = $.Function(function() {
          return [];
        });
        expect(f.value(), 0).to.be.a("SCNil");
        expect(f.value(), 1).to.be.a("SCNil");
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("args", function() {
        /*
          f = { |a, b| [ a, b ] }
        */
        var f = $.Function(function() {
          return [ function($a, $b) {
            return $$([ $a, $b ]);
          } ];
        }, "a=0; b=1");
        expect(f.value()              , 0).to.be.a("SCArray").that.eqls([  0,  1 ]);
        expect(f.value($$(10))        , 1).to.be.a("SCArray").that.eqls([ 10,  1 ]);
        expect(f.value($$(10), $$(20)), 2).to.be.a("SCArray").that.eqls([ 10, 20 ]);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("break", function() {
        /*
          f = { ^10; throw('should not be reached') }
        */
        var spy = sinon.spy();
        var f = $.Function(function() {
          return [
            function() {
              this.break();
              return $$(10);
            },
            function() {
              throw new Error("should not be reached");
            },
            spy
          ];
        });
        expect(spy      , 0).to.callCount(0);
        expect(f.value(), 1).to.be.a("SCInteger").that.equals(10);
        expect(spy      , 2).to.callCount(1);
        expect(f.value(), 3).to.be.a("SCInteger").that.equals(10);
        expect(spy      , 4).to.callCount(2);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        expect(f.value(), 0).to.be.a("SCArray").that.eqls([ -10, -20, -30 ]);
        expect(f.value(), 1).to.be.a("SCArray").that.eqls([ -10, -20, -30 ]);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("iterator break", function() {
        var f = $$(function() {
          return $$(100).do($$(function($_) {
            passed += 1;
            if ($_.valueOf() === 5) {
              this.break();
            }
          }));
        }), passed;

        passed = 0;
        expect(f.value(), 0).to.be.a("SCInteger").that.equals(100);
        expect(passed   , 1).to.equals(6);

        passed = 0;
        expect(f.value(), 0).to.be.a("SCInteger").that.equals(100);
        expect(passed   , 1).to.equals(6);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        var f = $.Function(function() {
          return [
            function() {
              return this.push(), $.Function(function() {
                return [
                  function() {
                    return $$(10);
                  }
                ];
              }).value();
            },
            function() {
              return this.push(), $.Function(function() {
                return [
                  function() {
                    return $$(20);
                  }
                ];
              }).value();
            },
            function() {
              return this.push(), $.Function(function() {
                return [
                  function() {
                    assert(this.shift(), 10);
                    return assert(this.shift(), 20);
                  }
                ];
              }).value();
            },
            function() {
              assert(this.shift(), 20);
              return this.push(), $.Function(function() {
                return [
                  function() {
                    return $$(30);
                  }
                ];
              }).value();
            },
            function() {
              return this.push(), $.Function(function() {
                return [
                  function() {
                    return $$(40);
                  }
                ];
              }).value();
            },
            function() {
              return this.push(), $.Function(function() {
                return [
                  function() {
                    assert(this.shift(), 30);
                    return assert(this.shift(), 40);
                  }
                ];
              }).value();
            },
            function() {
              return assert(this.shift(), 40);
            },
            spy
          ];
        });

        expect(spy      , 0).to.callCount(0);
        expect(f.value(), 1).to.be.a("SCInteger").that.equals(40);
        expect(spy      , 2).to.callCount(1);
        expect(f.value(), 3).to.be.a("SCInteger").that.equals(40);
        expect(spy      , 4).to.callCount(2);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        expect(f.value()).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4 ]);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
    });

    describe("as Routine", function() {
      var SCRoutine;
      before(function() {
        SCRoutine = $("Routine");
        this.createInstance = function(value) {
          var $func;
          if (Array.isArray(value)) {
            $func = $.Function(function() {
              return value;
            });
          } else {
            $func = value;
          }
          return SCRoutine.new($func);
        };
      });
      it("empty", function() {
        /*
          r = r {}
        */
        var r = this.createInstance($.Function(function() {
          return [];
        }));
        expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
        expect(r.value(), 1).to.be.a("SCNil");
        expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
        expect(r.value(), 3).to.be.a("SCNil");
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("return", function() {
        /*
          r = r { 10 }
        */
        var r = this.createInstance($$(function() {
          return $$(10);
        }));
        expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
        expect(r.value(), 1).to.be.a("SCNil");
        expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
        expect(r.value(), 3).to.be.a("SCNil");
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("yield", function() {
        /*
          r = r { 10.yield }
        */
        var r = this.createInstance($$(function() {
          return $$(10).yield();
        }));
        expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
        expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
        expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
        expect(r.value(), 3).to.be.a("SCNil");
        expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("args", function() {
        /*
          r = r { |a, b| [ a, b ].yield }
        */
        var r = this.createInstance($$(function($a, $b) {
          return $$([ $a, $b ]).yield();
        }, "a=0; b=1"));
        expect(r.reset().value()              , 0).to.be.a("SCArray").that.eqls([ null, 1 ]);
        expect(r.reset().value($$(10))        , 1).to.be.a("SCArray").that.eqls([ 10, 1 ]);
        expect(r.reset().value($$(10), $$(20)), 2).to.be.a("SCArray").that.eqls([ 10, 1 ]);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("break", function() {
        var spy = sinon.spy();
        var r = this.createInstance([
          function() {
            this.break();
            return $$(10).yield();
          },
          function() {
            throw new Error("should not be reached");
          },
          spy
        ]);
        expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
        expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
        expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
        expect(spy      , 3).to.callCount(0);
        expect(r.value(), 4).to.be.a("SCNil");
        expect(spy      , 5).to.callCount(1);
        expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        var r = this.createInstance([
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
        ]);
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        var r = this.createInstance([
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
            }).value();
          },
          SHOULD_BE_IGNORED,
          function() {
            return $$(40).yield();
          },
          SHOULD_BE_IGNORED,
          spy
        ]);
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("iterator yield", function() {
        /*
          r = r { [ 10, 20, 30, 40 ].do(_.yield) }
        */
        var r = this.createInstance($$(function() {
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        var r = this.createInstance($$(function() {
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
          }));
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
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
        var r = this.createInstance([
          function() {
            return this.push(), $.Function(function() {
              return [
                function() {
                  return $$(10);
                }
              ];
            }).value();
          },
          function() {
            return this.push(), $.Function(function() {
              return [
                function() {
                  return $$(20);
                }
              ];
            }).value();
          },
          function() {
            return this.push(), $.Function(function() {
              return [
                function() {
                  return this.shift().yield();
                },
                function() {
                  return this.shift().yield();
                },
                spy1
              ];
            }).value();
          },
          function() {
            var $a = this.shift();
            return $a.yield();
          },
          function() {
            return this.push(), $.Function(function() {
              return [
                function() {
                  return $$(30);
                }
              ];
            }).value();
          },
          function() {
            return this.push(), $.Function(function() {
              return [
                function() {
                  return $$(40);
                }
              ];
            }).value();
          },
          function() {
            return this.push(), $.Function(function() {
              return [
                function() {
                  return this.shift().yield();
                },
                function() {
                  return this.shift().yield();
                },
                spy2
              ];
            }).value();
          },
          function() {
            return this.shift().yield();
          },
          spy3
        ]);

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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("value.yield", function() {
        /*
          a = r { [ 10, 20, 30 ].do(_.yield) };
          r = r { a.value.yield; };
        */
        var spy = sinon.spy();
        var a = arrayToRoutine([ 10, 20, 30 ]);
        var r = this.createInstance($.Function(function() {
          return [
            function() {
              return this.push(), a.value();
            },
            function() {
              return this.shift().yield();
            },
            spy
          ];
        }));

        expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
        expect(r.value(), 1).to.be.a("SCInteger").that.equals(10);
        expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
        expect(spy      , 3).to.callCount(0);
        expect(r.value(), 4).to.be.a("SCNil");
        expect(spy      , 5).to.callCount(1);
        expect(r.state(), 6).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("routine value", function() {
        /*
          r = r { var a = { 10.yield; 20 }.value; a.yield }
        */
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var r = this.createInstance($.Function(function() {
          var $a;
          return [
            function() {
              return this.push(), $.Function(function() {
                return [
                  function() {
                    return $$(10).yield();
                  },
                  function() {
                    return $$(20);
                  },
                  spy1
                ];
              }).value();
            },
            function() {
              $a = this.shift();
              return $a.yield();
            },
            spy2
          ];
        }));

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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("function$while", function() {
        /*
          i = 0;
          r = r {
            while { i < 3 } { i = i + 1 }
          }
        */
        var i = 0, spy;
        var r = this.createInstance($$(function() {
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
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("use iterator in a Function", function() {
        /*
          r = r { [ 1, 2, 3 ].do(_.yield) };
          f =   { r.value };
        */
        var r, f;
        r = arrayToRoutine([ 1, 2, 3 ]);
        f = $$(function() {
          return r.value();
        });
        expect(f.value(), 0).to.be.a("SCInteger").that.equals(1);
        expect(f.value(), 1).to.be.a("SCInteger").that.equals(2);
        expect(f.value(), 2).to.be.a("SCInteger").that.equals(3);
        expect(f.value(), 3).to.be.a("SCNil");
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("use iterators at the same time", function() {
        /*
          a = r { [   1,   2,   3 ].do(_.yield) };
          b = r { [  10,  20,  30 ].do(_.yield) };
          c = r { [ 100, 200, 300 ].do(_.yield) };
          f =   { [ a.value, b.value, c.value ] };
        */
        var a, b, c, f;
        a = arrayToRoutine([   1,   2,   3 ]);
        b = arrayToRoutine([  10,  20,  30 ]);
        c = arrayToRoutine([ 100, 200, 300 ]);
        f = $$(function() {
          return $$([ a.value(), b.value(), c.value() ]);
        });
        expect(f.value(), 0).to.be.a("SCArray").that.eqls([ 1, 10, 100 ]);
        expect(f.value(), 1).to.be.a("SCArray").that.eqls([ 2, 20, 200 ]);
        expect(f.value(), 2).to.be.a("SCArray").that.eqls([ 3, 30, 300 ]);
        expect(f.value(), 3).to.be.a("SCArray").that.eqls([ null, null, null ]);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
      it("Array.fill", function() {
        /* r = r { Array.fill(4, { |i| i + 1 }).yield } */
        var r = this.createInstance($$(function() {
          return $("Array").fill($$(4), $$(function($i) {
            return $i ["+"] ($$(1));
          })).yield();
        }));
        expect(r.state(), 0).to.be.a("SCInteger").that.equals(sc.STATE_INIT);
        expect(r.value(), 1).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4 ]);
        expect(r.state(), 2).to.be.a("SCInteger").that.equals(sc.STATE_SUSPENDED);
        expect(r.value(), 3).to.be.a("SCNil");
        expect(r.state(), 4).to.be.a("SCInteger").that.equals(sc.STATE_DONE);
        expect(sc.lang.bytecode.current, "bytecode.current should be null").to.be.null;
      });
    });
  });

})();

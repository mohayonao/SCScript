(function() {
  "use strict";

  require("./Array");

  var $ = sc.test.$;
  var testCase = sc.test.testCase;

  var $SC = sc.lang.$SC;

  describe("SCArray", function() {
    var SCArray;
    before(function() {
      SCArray = $SC("Array");
      this.createInstance = function(source) {
        return $SC.Array((source || []).map($));
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.C.TAG_ARRAY);
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance([ $SC.String("freq"), $SC.Integer(440) ]);

      test = instance.valueOf();
      expect(test).to.be.a("JSArray").to.eql([ "freq", 440 ]);
    });
    it(".newClear", function() {
      var test = SCArray.newClear($SC.Integer(4));
      expect(test).to.be.a("SCArray").that.eqls([ null, null, null, null ]);
    });
    it(".with", function() {
      var test = SCArray.with($SC.Integer(0), $SC.Integer(1), $SC.Integer(2));
      expect(test).to.be.a("SCArray").that.eqls([ 0, 1, 2 ]);
    });
    it("#reverse", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1 ],
          result: [ 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          result: [ 3, 2, 1 ]
        },
      ]);
    });
    it("#scramble", function() {
      testCase(this, [
        {
          source: [ 1 ],
          result: [ 1 ]
        },
        {
          source: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
          result: [ 8, 1, 3, 6, 2, 4, 0, 9, 5, 7 ]
        },
      ], { randSeed: 0 });
    });
    it("#mirror", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1 ],
          result: [ 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          result: [ 1, 2, 3, 2, 1 ]
        },
      ]);
    });
    it("#mirror1", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1 ],
          result: [ 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          result: [ 1, 2, 3, 2 ]
        },
      ]);
    });
    it("#mirror2", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1 ],
          result: [ 1, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          result: [ 1, 2, 3, 3, 2, 1 ]
        },
      ]);
    });
    it("#stutter", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1 ],
          result: [ 1, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 3 ],
          result: [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ]
        },
      ]);
    });
    it("#rotate", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1, 2, 3 ],
          result: [ 3, 1, 2 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: [ 2, 3, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ -2 ],
          result: [ 3, 1, 2 ]
        },
      ]);
    });
    it("#pyramid", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: [
            1,
            1, 2,
            1, 2, 3,
            1, 2, 3, 4,
            1, 2, 3, 4, 5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 1 ],
          result: [
            1,
            1, 2,
            1, 2, 3,
            1, 2, 3, 4,
            1, 2, 3, 4, 5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: [
            5,
            4, 5,
            3, 4, 5,
            2, 3, 4, 5,
            1, 2, 3, 4, 5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 3 ],
          result: [
            1, 2, 3, 4, 5,
            1, 2, 3, 4,
            1, 2, 3,
            1, 2,
            1
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 4 ],
          result: [
            1, 2, 3, 4, 5,
            2, 3, 4, 5,
            3, 4, 5,
            4, 5,
            5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5 ],
          result: [
            1,
            1, 2,
            1, 2, 3,
            1, 2, 3, 4,
            1, 2, 3, 4, 5,
            1, 2, 3, 4,
            1, 2, 3,
            1, 2,
            1
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: [
            5,
            4, 5,
            3, 4, 5,
            2, 3, 4, 5,
            1, 2, 3, 4, 5,
            2, 3, 4, 5,
            3, 4, 5,
            4, 5,
            5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 7 ],
          result: [
            1, 2, 3, 4, 5,
            1, 2, 3, 4,
            1, 2, 3,
            1, 2,
            1,
            1, 2,
            1, 2, 3,
            1, 2, 3, 4,
            1, 2, 3, 4, 5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 8 ],
          result: [
            1, 2, 3, 4, 5,
            2, 3, 4, 5,
            3, 4, 5,
            4, 5,
            5,
            4, 5,
            3, 4, 5,
            2, 3, 4, 5,
            1, 2, 3, 4, 5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 9 ],
          result: [
            1,
            1, 2,
            1, 2, 3,
            1, 2, 3, 4,
            1, 2, 3, 4, 5,
            2, 3, 4, 5,
            3, 4, 5,
            4, 5,
            5
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10 ],
          result: [
            5,
            4, 5,
            3, 4, 5,
            2, 3, 4, 5,
            1, 2, 3, 4, 5,
            1, 2, 3, 4,
            1, 2, 3,
            1, 2,
            1
          ]
        },
      ]);
    });
    it("#pyramidg", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          result: [
            [ 1 ],
            [ 1, 2 ],
            [ 1, 2, 3 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3, 4, 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 1 ],
          result: [
            [ 1 ],
            [ 1, 2 ],
            [ 1, 2, 3 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3, 4, 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2 ],
          result: [
            [ 5 ],
            [ 4, 5 ],
            [ 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 1, 2, 3, 4, 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 3 ],
          result: [
            [ 1, 2, 3, 4, 5 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3 ],
            [ 1, 2 ],
            [ 1 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 4 ],
          result: [
            [ 1, 2, 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 3, 4, 5 ],
            [ 4, 5 ],
            [ 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 5 ],
          result: [
            [ 1 ],
            [ 1, 2 ],
            [ 1, 2, 3 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3, 4, 5 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3 ],
            [ 1, 2 ],
            [ 1 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 6 ],
          result: [
            [ 5 ],
            [ 4, 5 ],
            [ 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 1, 2, 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 3, 4, 5 ],
            [ 4, 5 ],
            [ 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 7 ],
          result: [
            [ 1, 2, 3, 4, 5 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3 ],
            [ 1, 2 ],
            [ 1 ],
            [ 1, 2 ],
            [ 1, 2, 3 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3, 4, 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 8 ],
          result: [
            [ 1, 2, 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 3, 4, 5 ],
            [ 4, 5 ],
            [ 5 ],
            [ 4, 5 ],
            [ 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 1, 2, 3, 4, 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 9 ],
          result: [
            [ 1 ],
            [ 1, 2 ],
            [ 1, 2, 3 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 3, 4, 5 ],
            [ 4, 5 ],
            [ 5 ]
          ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 10 ],
          result: [
            [ 5 ],
            [ 4, 5 ],
            [ 3, 4, 5 ],
            [ 2, 3, 4, 5 ],
            [ 1, 2, 3, 4, 5 ],
            [ 1, 2, 3, 4 ],
            [ 1, 2, 3 ],
            [ 1, 2 ],
            [ 1 ]
          ]
        },
      ]);
    });
    it("#sputter", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 0.75, 10 ],
          result: [ 1, 1, 2, 3, 3, 3, 3, 3, 3, 4 ]
        },
      ], { randSeed: 0 });
    });
    it("#lace", function() {
      testCase(this, [
        {
          source: [ [ 1, 2, 3 ], 6, [ -1, -2 ] ],
          result: [ 1, 6, -1 ]
        },
        {
          source: [ [ 1, 2, 3 ], 6, [ -1, -2 ] ],
          args  : [ 12 ],
          result: [ 1, 6, -1, 2, 6, -2, 3, 6, -1, 1, 6, -2 ]
        },
      ]);
    });
    it("#permute", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: [ 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 1 ],
          result: [ 2, 1, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: [ 3, 2, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 3 ],
          result: [ 1, 3, 2 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 4 ],
          result: [ 2, 3, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 5 ],
          result: [ 3, 1, 2 ]
        },
      ]);
    });
    it("#allTuples", function() {
      testCase(this, [
        {
          source: [ 0, [ 1, 2, 3 ] ],
          result: [
            [ 0, 1 ], [ 0, 2 ], [ 0, 3 ]
          ]
        },
        {
          source: [ [ 1, 2, 3, 4, 5 ], [ 10, 20, 30 ] ],
          result: [
            [ 1, 10 ], [ 1, 20 ], [ 1, 30 ],
            [ 2, 10 ], [ 2, 20 ], [ 2, 30 ],
            [ 3, 10 ], [ 3, 20 ], [ 3, 30 ],
            [ 4, 10 ], [ 4, 20 ], [ 4, 30 ],
            [ 5, 10 ], [ 5, 20 ], [ 5, 30 ]
          ]
        },
        {
          source: [ [ 1, 2, 3, 4, 5 ], [ 10, 20, 30 ] ],
          args  : [ 3 ],
          result: [
            [ 1, 10 ], [ 1, 20 ], [ 1, 30 ]
          ]
        },
      ]);
    });
    it("#wrapExtend", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 10 ],
          result: [ 1, 2, 3, 1, 2, 3, 1, 2, 3, 1 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: [ 1, 2 ]
        },
      ]);
    });
    it("#foldExtend", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 10 ],
          result: [ 1, 2, 3, 2, 1, 2, 3, 2, 1, 2 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: [ 1, 2 ]
        },
      ]);
    });
    it("#clipExtend", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          args  : [ 10 ],
          result: [ 1, 2, 3, 3, 3, 3, 3, 3, 3, 3 ]
        },
        {
          source: [ 1, 2, 3 ],
          args  : [ 2 ],
          result: [ 1, 2 ]
        },
      ]);
    });
    it("#slide", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          result: [ 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 3, 1 ],
          result: [ 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6 ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 1, 2 ],
          result: [ 1, 3, 5 ]
        },
      ]);
    });
    it("#containsSeqColl", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4 ],
          result: false
        },
        {
          source: [ 1, 2, [ 3 ], 4 ],
          result: true
        }
      ]);
    });
    it("#unlace", function() {
      testCase(this, [
        {
          source: [],
          result: []
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 1, 1 ],
          result: [ [ 1, 2, 3, 4, 5, 6 ] ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 2, 1 ],
          result: [ [ 1, 3, 5 ], [ 2, 4, 6 ] ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 3, 1 ],
          result: [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 2, 2 ],
          result: [ [ 1, 2 ], [ 3, 4 ] ]
        },
        {
          source: [ 1, 2, 3, 4, 5, 6 ],
          args  : [ 2, 3 ],
          result: [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
        },
      ]);
    });
    it.skip("#interlace", function() {
    });
    it.skip("#deinterlace", function() {
    });
    it("#flop", function() {
      testCase(this, [
        {
          source: [],
          result: [ [] ]
        },
        {
          source: [ [ 1, 2, 3 ], [ 4, 5, 6 ] ],
          result: [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
        },
        {
          source: [ [ 1, 2, 3 ], [ 4, 5, 6 ], 7 ],
          result: [ [ 1, 4, 7 ], [ 2, 5, 7 ], [ 3, 6, 7 ] ]
        },
      ]);
    });
    it("#multiChannelExpand", function() {
      testCase(this, [
        {
          source: [],
          result: [ [] ]
        },
        {
          source: [ [ 1, 2, 3 ], [ 4, 5, 6 ] ],
          result: [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
        },
        {
          source: [ [ 1, 2, 3 ], [ 4, 5, 6 ], 7 ],
          result: [ [ 1, 4, 7 ], [ 2, 5, 7 ], [ 3, 6, 7 ] ]
        },
      ]);
    });
    it.skip("#envirPairs", function() {
    });
    it("#shift", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ 2, 0 ],
          result: [ 0, 0, 1, 2, 3 ]
        },
        {
          source: [ 1, 2, 3, 4, 5 ],
          args  : [ -2, 0 ],
          result: [ 3, 4, 5, 0, 0 ]
        },
      ]);
    });
    it("#powerset", function() {
      testCase(this, [
        {
          source: [ 1, 2, 3 ],
          result: [
            [  ], [ 1 ], [ 2 ], [ 1, 2 ], [ 3 ], [ 1, 3 ], [ 2, 3 ], [ 1, 2, 3 ]
          ]
        },
      ]);
    });
    it.skip("#source", function() {
    });
    it("#asUGenInput", sinon.test(function() {
      var instance, test;
      var $elem1, $elem2, $elem3;
      var $ugen1, $ugen2, $ugen3;
      var $for;

      $elem1 = sc.test.object({
        asUGenInput: this.spy(function() {
          return $ugen1;
        })
      });
      $elem2 = sc.test.object({
        asUGenInput: this.spy(function() {
          return $ugen2;
        })
      });
      $elem3 = sc.test.object({
        asUGenInput: this.spy(function() {
          return $ugen3;
        })
      });
      $ugen1 = sc.test.object();
      $ugen2 = sc.test.object();
      $ugen3 = sc.test.object();
      $for = sc.test.object();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);

      test = instance.asUGenInput($for);
      expect($elem1.asUGenInput).to.be.calledWith($for);
      expect($elem2.asUGenInput).to.be.calledWith($for);
      expect($elem3.asUGenInput).to.be.calledWith($for);
      expect(test).to.be.a("SCArray").that.eqls([ $ugen1, $ugen2, $ugen3 ]);
    }));
    it("#asAudioRateInput", sinon.test(function() {
      var instance, test;
      var $elem1, $elem2, $elem3;
      var $ugen1, $ugen2, $ugen3;
      var $for;

      $elem1 = sc.test.object({
        asAudioRateInput: this.spy(function() {
          return $ugen1;
        })
      });
      $elem2 = sc.test.object({
        asAudioRateInput: this.spy(function() {
          return $ugen2;
        })
      });
      $elem3 = sc.test.object({
        asAudioRateInput: this.spy(function() {
          return $ugen3;
        })
      });
      $ugen1 = sc.test.object();
      $ugen2 = sc.test.object();
      $ugen3 = sc.test.object();
      $for = sc.test.object();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);

      test = instance.asAudioRateInput($for);
      expect($elem1.asAudioRateInput).to.be.calledWith($for);
      expect($elem2.asAudioRateInput).to.be.calledWith($for);
      expect($elem3.asAudioRateInput).to.be.calledWith($for);
      expect(test).to.be.a("SCArray").that.eqls([ $ugen1, $ugen2, $ugen3 ]);
    }));
    it("#asControlInput", sinon.test(function() {
      var instance, test;
      var $elem1, $elem2, $elem3;
      var $ugen1, $ugen2, $ugen3;

      $elem1 = sc.test.object({
        asControlInput: this.spy(function() {
          return $ugen1;
        })
      });
      $elem2 = sc.test.object({
        asControlInput: this.spy(function() {
          return $ugen2;
        })
      });
      $elem3 = sc.test.object({
        asControlInput: this.spy(function() {
          return $ugen3;
        })
      });
      $ugen1 = sc.test.object();
      $ugen2 = sc.test.object();
      $ugen3 = sc.test.object();

      instance = this.createInstance([ $elem1, $elem2, $elem3 ]);

      test = instance.asControlInput();
      expect($elem1.asControlInput).to.be.called;
      expect($elem2.asControlInput).to.be.called;
      expect($elem3.asControlInput).to.be.called;
      expect(test).to.be.a("SCArray").that.eqls([ $ugen1, $ugen2, $ugen3 ]);
    }));
    it("#isValidUGenInput", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.isValidUGenInput();
      expect(test).to.be.a("SCBoolean").that.equals(true);
    });
    it("#numChannels", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "size", sc.test.func);

      test = instance.numChannels();
      expect(instance.size).to.be.calledLastIn(test);
    }));
    it.skip("#poll", function() {
    });
    it.skip("#dpoll", function() {
    });
    it.skip("#envAt", function() {
    });
    it.skip("#atIdentityHash", function() {
    });
    it.skip("#atIdentityHashInPairs", function() {
    });
    it.skip("#asSpec", function() {
    });
    it.skip("#fork", function() {
    });
    it("#madd", sinon.test(function() {
      var instance, test, spy;
      var $mul, $add;

      spy = this.spy(sc.test.func);
      $mul = sc.test.object();
      $add = sc.test.object();
      this.stub(sc.lang.klass, "get").withArgs("MulAdd").returns(sc.test.object({
        new: spy
      }));

      instance = this.createInstance();
      test = instance.madd($mul, $add);

      expect(spy).to.be.calledWith(instance, $mul, $add);
      expect(spy).to.be.calledLastIn(test);
    }));
    it.skip("asRawOSC", function() {
    });
    it.skip("printOn", function() {
    });
    it.skip("storeOn", function() {
    });
  });
})();

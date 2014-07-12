describe("Collections/String", function() {
  "use strict";

  var testCase = sc.test.testCase;
  var $$ = sc.test.object;
  var $  = sc.lang.$;
  var SCString = $("String");

  describe("SCString", function() {
    before(function() {
      this.createInstance = function(str) {
        return $.String(str || "str");
      };
    });

    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_STR);
    });

    it("#__str__", function() {
      var instance, test;

      instance = this.createInstance("str");

      test = instance.__str__();
      expect(test).to.be.a("JSString").that.equals("str");
    });

    it("#__elem__", function() {
      var instance, test;
      var $ch = $$("$a");

      instance = this.createInstance();

      test = instance.__elem__($ch);
      expect(test).to.equal($ch);

      expect(function() {
        instance.__elem__($$(0));
      }).to.throw("Wrong type");
    });

    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance("str");

      test = instance.valueOf();
      expect(test).to.be.a("JSString").that.equals("str");
    });

    it(".newClear", function() {
      var test;

      test = SCString.newClear($$(4));
      expect(test).to.be.a("SCString").that.equals("    ");
    });
    it.skip("<>unixCmdActions", function() {
    });
    it.skip(".initClass", function() {
    });
    it.skip(".doUnixCmdAction", function() {
    });
    it.skip("#unixCmd", function() {
    });
    it.skip("#unixCmdGetStdOut", function() {
    });

    it("#asSymbol", function() {
      var instance, test;

      instance = this.createInstance("str");

      test = instance.asSymbol();
      expect(test).to.be.a("SCSymbol").that.equals("str");
    });

    it("#asInteger", function() {
      testCase(this, [
        [ "100", [], 100 ],
        [ "+50", [], +50 ],
        [ "-50", [], -50 ],
        [ "5.5", [],   5 ],
        [ "5oo", [],   5 ],
        [ "oo5", [],   0 ],
      ]);
    });

    it("#asFloat", function() {
      testCase(this, [
        [ "100", [], $.Float(100) ],
        [ "+50", [], $.Float(+50) ],
        [ "-50", [], $.Float(-50) ],
        [ "5.5", [], $.Float(5.5) ],
        [ "5oo", [], $.Float(  5) ],
        [ "oo5", [], $.Float(  0) ],
        [ "+1.5e-5", [], +1.5e-5 ],
      ]);
    });

    it("#ascii", function() {
      testCase(this, [
        [ "str", [], [ 115, 116, 114 ] ]
      ]);
    });
    it.skip("#stripRTF", function() {
    });
    it.skip("#stripHTML", function() {
    });
    it.skip("#$scDir", function() {
    });

    it("#compare", function() {
      testCase(this, [
        [ "123", [ 123 ], null ],
        [ "123", [ "456" ], -1 ],
        [ "123", [ "123" ],  0 ],
        [ "456", [ "123" ], +1 ],
        [ "123" , [ "1234" ], -1 ],
        [ "1234", [ "123"  ], +1 ],
        [ "abc", [ "DEF", true ], -1 ],
        [ "abc", [ "ABC", true ],  0 ],
        [ "DEF", [ "abc", true ], +1 ],
      ]);
    });

    it("#<", function() {
      testCase(this, [
        [ "123", [ "456" ], true  ],
        [ "123", [ "123" ], false ],
        [ "456", [ "123" ], false ],
      ]);
    });

    it("#>", function() {
      testCase(this, [
        [ "123", [ "456" ], false ],
        [ "123", [ "123" ], false ],
        [ "456", [ "123" ], true  ],
      ]);
    });

    it("#<=", function() {
      testCase(this, [
        [ "123", [ "456" ], true  ],
        [ "123", [ "123" ], true  ],
        [ "456", [ "123" ], false ],
      ]);
    });

    it("#>=", function() {
      testCase(this, [
        [ "123", [ "456" ], false ],
        [ "123", [ "123" ], true  ],
        [ "456", [ "123" ], true  ],
      ]);
    });

    it("#==", function() {
      testCase(this, [
        [ "123", [ "456" ], false ],
        [ "123", [ "123" ], true  ],
        [ "456", [ "123" ], false ],
      ]);
    });

    it("#!=", function() {
      testCase(this, [
        [ "123", [ "456" ], true  ],
        [ "123", [ "123" ], false ],
        [ "456", [ "123" ], true  ],
      ]);
    });
    it.skip("#hash", function() {
    });

    it("#performBinaryOpOnSimpleNumber", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $aNumber = $$({
        asString: function() {
          return $$({ perform: SCString$perform });
        }
      });
      var SCString$perform = this.spy(sc.test.func());

      instance = this.createInstance();

      test = instance.performBinaryOpOnSimpleNumber($aSelector, $aNumber);
      expect(SCString$perform).to.be.calledWith($aSelector, instance);
      expect(SCString$perform).to.be.calledLastIn(test);
    }));

    it("#performBinaryOpOnComplex", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $aComplex = $$({
        asString: function() {
          return $$({ perform: SCString$perform });
        }
      });
      var SCString$perform = this.spy(sc.test.func());

      instance = this.createInstance();

      test = instance.performBinaryOpOnComplex($aSelector, $aComplex);
      expect(SCString$perform).to.be.calledWith($aSelector, instance);
      expect(SCString$perform).to.be.calledLastIn(test);
    }));

    it("#multiChannelPerform", function() {
      var instance;

      instance = this.createInstance();
      expect(function() {
        instance.multiChannelPerform();
      }).to.throw("Cannot expand strings");
    });

    it("#isString", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isString();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });

    it("#asString", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.asString).to.doNothing;
    });

    it("#asCompileString", function() {
      var instance, test;

      instance = this.createInstance("str");

      test = instance.asCompileString();
      expect(test).to.be.a("SCString").that.equals("\"str\"");
    });

    it("#species", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.species();
      expect(test).to.equal(SCString);
    });

    it("#postln", sinon.test(function() {
      var instance, test;

      instance = this.createInstance("post");
      this.stub(sc.lang.io, "post");

      test = instance.postln();
      expect(test).to.equal(instance);
      expect(sc.lang.io.post).to.be.calledWith("post\n");
    }));

    it("#post", sinon.test(function() {
      var instance, test;

      instance = this.createInstance("post");
      this.stub(sc.lang.io, "post");

      test = instance.post();
      expect(test).to.equal(instance);
      expect(sc.lang.io.post).to.be.calledWith("post");
    }));

    it("#postcln", sinon.test(function() {
      var instance, test;

      instance = this.createInstance("post");
      this.stub(sc.lang.io, "post");

      test = instance.postcln();
      expect(test).to.equal(instance);
      expect(sc.lang.io.post).to.be.calledWith("// post\n");
    }));

    it("#postc", sinon.test(function() {
      var instance, test;

      instance = this.createInstance("post");
      this.stub(sc.lang.io, "post");

      test = instance.postc();
      expect(test).to.equal(instance);
      expect(sc.lang.io.post).to.be.calledWith("// post");
    }));
    it.skip("#postf", function() {
    });
    it.skip("#format", function() {
    });
    it.skip("#matchRegexp", function() {
    });
    it.skip("#fformat", function() {
    });
    it.skip("#die", function() {
    });
    it.skip("#error", function() {
    });
    it.skip("#warn", function() {
    });
    it.skip("#inform", function() {
    });

    it("#++", function() {
      testCase(this, [
        [ "abc", [ "def" ], "abcdef" ],
        [ "abc", [ null ], "abcnil" ],
        [ "abc", [ 0 ], "abc0" ],
      ]);
    });

    it("#+", function() {
      testCase(this, [
        [ "abc", [ "def" ], "abc def" ],
        [ "abc", [ null ], "abc nil" ],
        [ "abc", [ 0 ], "abc 0" ],
      ]);
    });
    it.skip("#catArgs", function() {
    });
    it.skip("#scatArgs", function() {
    });
    it.skip("#ccatArgs", function() {
    });
    it.skip("#catList", function() {
    });
    it.skip("#scatList", function() {
    });
    it.skip("#ccatList", function() {
    });
    it.skip("#split", function() {
    });
    it.skip("#containsStringAt", function() {
    });
    it.skip("#icontainsStringAt", function() {
    });
    it.skip("#contains", function() {
    });
    it.skip("#containsi", function() {
    });
    it.skip("#findRegexp", function() {
    });
    it.skip("#findAllRegexp", function() {
    });
    it.skip("#find", function() {
    });
    it.skip("#findBackwards", function() {
    });
    it.skip("#endsWith", function() {
    });
    it.skip("#beginsWith", function() {
    });
    it.skip("#findAll", function() {
    });
    it.skip("#replace", function() {
    });
    it.skip("#escapeChar", function() {
    });
    it.skip("#shellQuote", function() {
    });
    it.skip("#quote", function() {
    });
    it.skip("#tr", function() {
    });
    it.skip("#insert", function() {
    });
    it.skip("#wrapExtend", function() {
    });
    it.skip("#zeroPad", function() {
    });
    it.skip("#padLeft", function() {
    });
    it.skip("#padRight", function() {
    });
    it.skip("#underlined", function() {
    });
    it.skip("#scramble", function() {
    });
    it.skip("#rotate", function() {
    });
    it.skip("#compile", function() {
    });
    it.skip("#interpret", function() {
    });
    it.skip("#interpretPrint", function() {
    });
    it.skip("#$readNew", function() {
    });
    it.skip("#printOn", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#inspectorClass", function() {
    });
    it.skip("#standardizePath", function() {
    });
    it.skip("#realPath", function() {
    });
    it.skip("#withTrailingSlash", function() {
    });
    it.skip("#withoutTrailingSlash", function() {
    });
    it.skip("#absolutePath", function() {
    });
    it.skip("#pathMatch", function() {
    });
    it.skip("#load", function() {
    });
    it.skip("#loadPaths", function() {
    });
    it.skip("#loadRelative", function() {
    });
    it.skip("#resolveRelative", function() {
    });
    it.skip("#include", function() {
    });
    it.skip("#exclude", function() {
    });
    it.skip("#basename", function() {
    });
    it.skip("#dirname", function() {
    });
    it.skip("#splittext", function() {
    });
    it.skip("#+/+", function() {
    });
    it.skip("#asRelativePath", function() {
    });
    it.skip("#asAbsolutePath", function() {
    });
    it.skip("#systemCmd", function() {
    });
    it.skip("#gethostbyname", function() {
    });
    it.skip("#getenv", function() {
    });
    it.skip("#setenv", function() {
    });
    it.skip("#unsetenv", function() {
    });
    it.skip("#codegen_UGenCtorArg", function() {
    });
    it.skip("#ugenCodeString", function() {
    });
    it.skip("#asSecs", function() {
    });
    it.skip("#speak", function() {
    });
    it.skip("#toLower", function() {
    });
    it.skip("#toUpper", function() {
    });
    it.skip("#mkdir", function() {
    });
    it.skip("#parseYAML", function() {
    });
    it.skip("#parseYAMLFile  ", function() {
    });
  });

});

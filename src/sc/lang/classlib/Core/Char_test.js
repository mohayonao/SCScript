"use strict";

require("./Char");

var testCase = sc.test.testCase;

var $SC = sc.lang.$SC;
var fromCharCode = String.fromCharCode;

describe("SCChar", function() {
  var SCChar;
  before(function() {
    SCChar = $SC.Class("Char");
    this.createInstance = function(value) {
      return $SC.Char(typeof value === "undefined" ? "a" : value);
    };
  });
  it("#__tag", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.__tag;
    expect(test).to.be.a("JSNumber").that.equals(sc.C.TAG_CHAR);
  });
  it("#__str__", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.__str__();
    expect(test).to.be.a("JSString").that.equals("a");
  });
  it("#valueOf", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.valueOf();
    expect(test).to.be.a("JSString").that.equals("a");
  });
  it(".nl", function() {
    var test = SCChar.nl();
    expect(test).to.be.a("SCChar").that.equals("\n");
  });
  it(".ff", function() {
    var test = SCChar.ff();
    expect(test).to.be.a("SCChar").that.equals("\f");
  });
  it(".tab", function() {
    var test = SCChar.tab();
    expect(test).to.be.a("SCChar").that.equals("\t");
  });
  it(".space", function() {
    var test = SCChar.space();
    expect(test).to.be.a("SCChar").that.equals(" ");
  });
  it(".comma", function() {
    var test = SCChar.comma();
    expect(test).to.be.a("SCChar").that.equals(",");
  });
  it(".new", function() {
    expect(function() {
      SCChar.new();
    }).to.throw("should use literal");
  });
  it.skip("#hash", function() {
  });
  it("#ascii", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.ascii();
    expect(test).to.be.a("SCInteger").that.equals(0x61);
  });
  it("#digit", function() {
    var instance, test;
    var table = {
      0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
      a:10, b:11, c:12, d:13, e:14, f:15, g:16, h:17, i:18, j:19,
      k:20, l:21, m:22, n:23, o:24, p:25, q:26, r:27, s:28, t:29,
      u:30, v:31, w:32, x:33, y:34, z:35,
      A:10, B:11, C:12, D:13, E:14, F:15, G:16, H:17, I:18, J:19,
      K:20, L:21, M:22, N:23, O:24, P:25, Q:26, R:27, S:28, T:29,
      U:30, V:31, W:32, X:33, Y:34, Z:35,
    };
    for (var i = 0, ch; i < 128; ++i) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      if (typeof table[fromCharCode(i)] !== "undefined") {
        test = instance.digit();
        expect(test).with_message("'#{0}'.digit", ch)
          .to.be.a("SCInteger").that.equals(table[ch]);
      } else {
        expect(function() {
          instance.digit();
        }).to.throw("digitValue failed");
      }
    }
  });
  it("#asAscii", function() {
    var instance = this.createInstance();
    expect(instance.asAscii).to.be.nop;
  });
  it("#asUnicode", sinon.test(function() {
    var instance, test;

    instance = this.createInstance();
    this.stub(instance, "ascii", sc.test.func);

    test = instance.asUnicode();
    expect(instance.ascii).to.be.calledLastIn(test);
  }));
  it("#toUpper", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.toUpper();
    expect(test).to.be.a("SCChar").that.equals("A");
  });
  it("#toUpper", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.toLower();
    expect(test).to.be.a("SCChar").that.equals("a");
  });
  it("#isAlpha", function() {
    var instance, test;
    var trueCase = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isAlpha();
      expect(test).with_message("'#{0}'.isAlpha", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isAlphaNum", function() {
    var instance, test;
    var trueCase = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isAlphaNum();
      expect(test).with_message("'#{0}'.isAlphaNum", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isPrint", function() {
    var instance, test;
    var trueCase = " !\"#$%&'()*+,-./0123456789:;<=>?@" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isPrint();
      expect(test).with_message("'#{0}'.isPrint", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isPunct", function() {
    var instance, test;
    var trueCase = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isPunct();
      expect(test).with_message("'#{0}'.isPunct", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isControl", function() {
    var instance, test;
    var falseCase = " !\"#$%&'()*+,-./0123456789:;<=>?@" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isControl();
      expect(test).with_message("'#{0}'.isControl", ch)
        .to.be.a("SCBoolean").that.equals(falseCase.indexOf(ch) === -1);
    }
  });
  it("#isSpace", function() {
    var instance, test;
    var trueCase = "\t\n\v\f\r ";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isSpace();
      expect(test).with_message("'#{0}'.isSpace", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isVowl", function() {
    var instance, test;
    var trueCase = "aeiouAEIOU";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isVowl();
      expect(test).with_message("'#{0}'.isVowl", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isDecDigit", function() {
    var instance, test;
    var trueCase = "0123456789";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isDecDigit();
      expect(test).with_message("'#{0}'.isDecDigit", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isUpper", function() {
    var instance, test;
    var trueCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isUpper();
      expect(test).with_message("'#{0}'.isUpper", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isLower", function() {
    var instance, test;
    var trueCase = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isLower();
      expect(test).with_message("'#{0}'.isLower", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isFileSafe", function() {
    var instance, test;
    var trueCase = " !#$%&'()*+,-.0123456789;<=>?@" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isFileSafe();
      expect(test).with_message("'#{0}'.isFileSafe", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#isPathSeparator", function() {
    var instance, test;
    var trueCase = "/";

    for (var i = 0, ch; i < 128; i++) {
      ch = fromCharCode(i);
      instance = this.createInstance(ch);
      test = instance.isPathSeparator();
      expect(test).with_message("'#{0}'.isPathSeparator", ch)
        .to.be.a("SCBoolean").that.equals(trueCase.indexOf(ch) !== -1);
    }
  });
  it("#<", function() {
    testCase(this, [
      [ "a", [ "$a" ], false ],
      [ "a", [ "$b" ], true  ],
      [ "b", [ "$a" ], false ],
      [ "b", [ "$b" ], false ],
    ]);
  });
  it("#++", function() {
    var test, instance;
    var $h;

    $h = $SC.Char("h");

    instance = this.createInstance("c");

    test = instance ["++"] ($h);
    expect(test).to.be.a("SCString").that.equals("ch");
  });
  it("#archiveAsCompileString", function() {
    var instance, test;

    instance = this.createInstance();

    test = instance.archiveAsCompileString();
    expect(test).to.be.a("SCBoolean").that.equals(true);
  });
  it("#asString", function() {
    var instance, test;

    instance = this.createInstance();

    test = instance.asString();
    expect(test).to.be.a("SCString").that.equals("a");
  });
  it("#shallowCopy", function() {
    var instance = this.createInstance();
    expect(instance.shallowCopy).to.be.nop;
  });
});

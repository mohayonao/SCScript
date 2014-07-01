SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $ = sc.lang.$;

  sc.lang.klass.refine("Char", function(builder) {
    builder.addMethod("__str__", function() {
      return this._;
    });

    builder.addClassMethod("nl", function() {
      return $.Char("\n");
    });

    builder.addClassMethod("ff", function() {
      return $.Char("\f");
    });

    builder.addClassMethod("tab", function() {
      return $.Char("\t");
    });

    builder.addClassMethod("space", function() {
      return $.Char(" ");
    });

    builder.addClassMethod("comma", function() {
      return $.Char(",");
    });

    builder.addClassMethod("new", function() {
      throw new Error("Char.new is illegal, should use literal.");
    });

    // TODO: implements hash

    builder.addMethod("ascii", function() {
      return $.Integer(this._.charCodeAt(0));
    });

    builder.addMethod("digit", function() {
      var ascii = this._.charCodeAt(0);
      if (0x30 <= ascii && ascii <= 0x39) {
        return $.Integer(ascii - 0x30);
      }
      if (0x41 <= ascii && ascii <= 0x5a) {
        return $.Integer(ascii - 0x37);
      }
      if (0x61 <= ascii && ascii <= 0x7a) {
        return $.Integer(ascii - 0x57);
      }
      throw new Error("digitValue failed");
    });

    builder.addMethod("asAscii");

    builder.addMethod("asUnicode", function() {
      return this.ascii();
    });

    builder.addMethod("toUpper", function() {
      return $.Char(this._.toUpperCase());
    });

    builder.addMethod("toLower", function() {
      return $.Char(this._.toLowerCase());
    });

    builder.addMethod("isAlpha", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    });

    builder.addMethod("isAlphaNum", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39) ||
                         (0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    });

    builder.addMethod("isPrint", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e));
    });

    builder.addMethod("isPunct", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x21 <= ascii && ascii <= 0x2f) ||
                         (0x3a <= ascii && ascii <= 0x40) ||
                         (0x5b <= ascii && ascii <= 0x60) ||
                         (0x7b <= ascii && ascii <= 0x7e));
    });

    builder.addMethod("isControl", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x00 <= ascii && ascii <= 0x1f) || ascii === 0x7f);
    });

    builder.addMethod("isSpace", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x09 <= ascii && ascii <= 0x0d) || ascii === 0x20);
    });

    builder.addMethod("isVowl", function() {
      var ch = this._.charAt(0).toUpperCase();
      return $.Boolean("AEIOU".indexOf(ch) !== -1);
    });

    builder.addMethod("isDecDigit", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39));
    });

    builder.addMethod("isUpper", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a));
    });

    builder.addMethod("isLower", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x61 <= ascii && ascii <= 0x7a));
    });

    builder.addMethod("isFileSafe", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e) &&
                         ascii !== 0x2f && // 0x2f is '/'
                         ascii !== 0x3a && // 0x3a is ':'
                         ascii !== 0x22);  // 0x22 is '"'
    });

    builder.addMethod("isPathSeparator", function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean(ascii === 0x2f);
    });

    builder.addMethod("<", function($aChar) {
      return $.Boolean(this.ascii() < $aChar.ascii());
    });

    builder.addMethod("++", function($that) {
      return $.String(this._ + $that.__str__());
    });

    // TODO: implements $bullet
    // TODO: implements printOn
    // TODO: implements storeOn

    builder.addMethod("archiveAsCompileString", function() {
      return $.True();
    });

    builder.addMethod("asString", function() {
      return $.String(this._);
    });

    builder.addMethod("shallowCopy");
  });
});

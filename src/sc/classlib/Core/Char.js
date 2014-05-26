SCScript.install(function(sc) {
  "use strict";

  require("../Math/Magnitude");

  var $ = sc.lang.$;

  sc.lang.klass.refine("Char", function(spec, utils) {
    spec.__str__ = function() {
      return this._;
    };

    spec.$nl = function() {
      return $.Char("\n");
    };

    spec.$ff = function() {
      return $.Char("\f");
    };

    spec.$tab = function() {
      return $.Char("\t");
    };

    spec.$space = function() {
      return $.Char(" ");
    };

    spec.$comma = function() {
      return $.Char(",");
    };

    spec.$new = function() {
      throw new Error("Char.new is illegal, should use literal.");
    };

    // TODO: implements hash

    spec.ascii = function() {
      return $.Integer(this._.charCodeAt(0));
    };

    spec.digit = function() {
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
    };

    spec.asAscii = utils.nop;

    spec.asUnicode = function() {
      return this.ascii();
    };

    spec.toUpper = function() {
      return $.Char(this._.toUpperCase());
    };

    spec.toLower = function() {
      return $.Char(this._.toLowerCase());
    };

    spec.isAlpha = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isAlphaNum = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39) ||
                         (0x41 <= ascii && ascii <= 0x5a) ||
                         (0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isPrint = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e));
    };

    spec.isPunct = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x21 <= ascii && ascii <= 0x2f) ||
                         (0x3a <= ascii && ascii <= 0x40) ||
                         (0x5b <= ascii && ascii <= 0x60) ||
                         (0x7b <= ascii && ascii <= 0x7e));
    };

    spec.isControl = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x00 <= ascii && ascii <= 0x1f) || ascii === 0x7f);
    };

    spec.isSpace = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x09 <= ascii && ascii <= 0x0d) || ascii === 0x20);
    };

    spec.isVowl = function() {
      var ch = this._.charAt(0).toUpperCase();
      return $.Boolean("AEIOU".indexOf(ch) !== -1);
    };

    spec.isDecDigit = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x30 <= ascii && ascii <= 0x39));
    };

    spec.isUpper = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x41 <= ascii && ascii <= 0x5a));
    };

    spec.isLower = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x61 <= ascii && ascii <= 0x7a));
    };

    spec.isFileSafe = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean((0x20 <= ascii && ascii <= 0x7e) &&
                         ascii !== 0x2f && // 0x2f is '/'
                         ascii !== 0x3a && // 0x3a is ':'
                         ascii !== 0x22);  // 0x22 is '"'
    };

    spec.isPathSeparator = function() {
      var ascii = this._.charCodeAt(0);
      return $.Boolean(ascii === 0x2f);
    };

    spec["<"] = function($aChar) {
      return $.Boolean(this.ascii() < $aChar.ascii());
    };

    spec["++"] = function($that) {
      return $.String(this._ + $that.__str__());
    };

    // TODO: implements $bullet
    // TODO: implements printOn
    // TODO: implements storeOn

    spec.archiveAsCompileString = function() {
      return $.True();
    };

    spec.asString = function() {
      return $.String(this._);
    };

    spec.shallowCopy = utils.nop;
  });

});

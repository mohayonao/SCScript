(function(sc) {
  "use strict";

  require("./compiler");

  var strlib = sc.libs.strlib;
  var Token = sc.lang.compiler.Token;

  function NumberLexer(source, index) {
    this.source = source;
    this.index  = index;
  }

  NumberLexer.prototype.scan = function() {
    return this.scanNAryNumberLiteral() ||
      this.scanHexNumberLiteral() ||
      this.scanAccidentalNumberLiteral() ||
      this.scanDecimalNumberLiteral();
  };

  NumberLexer.prototype.match = function(re) {
    return re.exec(this.source.slice(this.index));
  };

  NumberLexer.prototype.scanNAryNumberLiteral = function() {
    var items = this.match(
      /^(\d+)r((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+)(?:\.((?:[\da-zA-Z](?:_(?=[\da-zA-Z]))?)+))?/
    );

    if (!items) {
      return;
    }

    var base    = removeUnderscore(items[1])|0;
    var integer = removeUnderscore(items[2]);
    var frac    = removeUnderscore(items[3]) || "";
    var pi = false;

    if (!frac && base < 26 && integer.substr(-2) === "pi") {
      integer = integer.slice(0, -2);
      pi = true;
    }

    var type  = Token.IntegerLiteral;
    var value = calcNBasedInteger(integer, base);

    if (frac) {
      type = Token.FloatLiteral;
      value += calcNBasedFrac(frac, base);
    }

    if (isNaN(value)) {
      return { error: true, value: items[0], length: items[0].length };
    }

    return makeNumberToken(type, value, pi, items[0].length);
  };

  NumberLexer.prototype.scanHexNumberLiteral = function() {
    var items = this.match(/^(0x(?:[\da-fA-F](?:_(?=[\da-fA-F]))?)+)(pi)?/);

    if (!items) {
      return;
    }

    var integer = removeUnderscore(items[1]);
    var pi      = !!items[2];

    var type  = Token.IntegerLiteral;
    var value = +integer;

    return makeNumberToken(type, value, pi, items[0].length);
  };

  NumberLexer.prototype.scanAccidentalNumberLiteral = function() {
    var items = this.match(/^(\d+)([bs]+)(\d*)/);

    if (!items) {
      return;
    }

    var integer    = removeUnderscore(items[1]);
    var accidental = items[2];
    var sign = (accidental.charAt(0) === "s") ? +1 : -1;

    var cents;
    if (items[3] === "") {
      cents = Math.min(accidental.length * 0.1, 0.4);
    } else {
      cents = Math.min(items[3] * 0.001, 0.499);
    }
    var value = +integer + (sign * cents);

    return makeNumberToken(Token.FloatLiteral, value, false, items[0].length);
  };

  NumberLexer.prototype.scanDecimalNumberLiteral = function() {
    var items = this.match(
      /^((?:\d(?:_(?=\d))?)+((?:\.(?:\d(?:_(?=\d))?)+)?(?:e[-+]?(?:\d(?:_(?=\d))?)+)?))(pi)?/
    );

    var integer = +removeUnderscore(items[1]);
    var frac    = !!items[2];
    var pi      = !!items[3];

    var type  = (frac || pi) ? Token.FloatLiteral : Token.IntegerLiteral;
    var value = integer;

    return makeNumberToken(type, value, pi, items[0].length);
  };

  function removeUnderscore(str) {
    return str && str.replace(/_/g, "");
  }

  function char2num(ch, base) {
    var num = strlib.char2num(ch, base);
    if (num >= base) {
      num = NaN;
    }
    return num;
  }

  function calcNBasedInteger(integer, base) {
    var value = 0;
    for (var i = 0, imax = integer.length; i < imax; ++i) {
      value *= base;
      value += char2num(integer[i], base);
    }
    return value;
  }

  function calcNBasedFrac(frac, base) {
    var value = 0;
    for (var i = 0, imax = frac.length; i < imax; ++i) {
      value += char2num(frac[i], base) * Math.pow(base, -(i + 1));
    }
    return value;
  }

  function makeNumberToken(type, value, pi, length) {
    if (pi) {
      type = Token.FloatLiteral;
      value = value * Math.PI;
    }

    if (type === Token.FloatLiteral && value === (value|0)) {
      value = value + ".0";
    }

    return { type: type, value: String(value), length: length };
  }

  sc.lang.compiler.lexNumber = function(source, index) {
    return new NumberLexer(source, index).scan();
  };
})(sc);

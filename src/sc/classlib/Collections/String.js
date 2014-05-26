SCScript.install(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var $  = sc.lang.$;
  var fn = sc.lang.fn;
  var io = sc.lang.io;

  sc.lang.klass.refine("String", function(spec, utils) {
    var $nil   = utils.$nil;
    var $false = utils.$false;

    spec.__str__ = function() {
      return this.valueOf();
    };

    spec.__elem__ = function($item) {
      if ($item.__tag !== sc.C.TAG_CHAR) {
        throw new TypeError("Wrong type.");
      }
      return $item;
    };

    spec.valueOf = function() {
      return this._.map(function(elem) {
        return elem.__str__();
      }).join("");
    };

    spec.toString = function() {
      return this.valueOf();
    };

    // TODO: implements unixCmdActions
    // TODO: implements unixCmdActions_
    // TODO: implements $initClass
    // TODO: implements $doUnixCmdAction
    // TODO: implements unixCmd
    // TODO: implements unixCmdGetStdOut

    spec.asSymbol = function() {
      return $.Symbol(this.__str__());
    };

    spec.asInteger = function() {
      var m = /^[-+]?\d+/.exec(this.__str__());
      return $.Integer(m ? m[0]|0 : 0);
    };

    spec.asFloat = function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this.__str__());
      return $.Float(m ? +m[0] : 0);
    };

    spec.ascii = function() {
      var raw = this.__str__();
      var a, i, imax;

      a = new Array(raw.length);
      for (i = 0, imax = a.length; i < imax; ++i) {
        a[i] = $.Integer(raw.charCodeAt(i));
      }

      return $.Array(a);
    };

    // TODO: implements stripRTF
    // TODO: implements stripHTML
    // TODO: implements $scDir

    spec.compare = fn(function($aString, $ignoreCase) {
      var araw, braw, length, i, a, b, cmp, func;

      if ($aString.__tag !== sc.C.TAG_STR) {
        return $nil;
      }

      araw = this._;
      braw = $aString._;
      length = Math.min(araw.length, braw.length);

      if ($ignoreCase.__bool__()) {
        func = function(ch) {
          return ch.toLowerCase();
        };
      } else {
        func = function(ch) {
          return ch;
        };
      }
      for (i = 0; i < length; i++) {
        a = func(araw[i]._).charCodeAt(0);
        b = func(braw[i]._).charCodeAt(0);
        cmp = a - b;
        if (cmp !== 0) {
          return $.Integer(cmp < 0 ? -1 : +1);
        }
      }

      if (araw.length < braw.length) {
        cmp = -1;
      } else if (araw.length > braw.length) {
        cmp = 1;
      }

      return $.Integer(cmp);
    }, "aString; ignoreCase=false");

    spec["<"] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() < 0
      );
    };

    spec[">"] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() > 0
      );
    };

    spec["<="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() <= 0
      );
    };

    spec[">="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() >= 0
      );
    };

    spec["=="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() === 0
      );
    };

    spec["!="] = function($aString) {
      return $.Boolean(
        this.compare($aString, $false).valueOf() !== 0
      );
    };

    // TODO: implements hash

    spec.performBinaryOpOnSimpleNumber = function($aSelector, $aNumber) {
      return $aNumber.asString().perform($aSelector, this);
    };

    spec.performBinaryOpOnComplex = function($aSelector, $aComplex) {
      return $aComplex.asString().perform($aSelector, this);
    };

    spec.multiChannelPerform = function() {
      throw new Error("String:multiChannelPerform. Cannot expand strings.");
    };

    spec.isString = utils.alwaysReturn$true;

    spec.asString = utils.nop;

    spec.asCompileString = function() {
      return $.String("\"" + this.__str__() + "\"");
    };

    spec.species = function() {
      return $("String");
    };

    spec.postln = function() {
      io.post(this.__str__() + "\n");
      return this;
    };

    spec.post = function() {
      io.post(this.__str__());
      return this;
    };

    spec.postcln = function() {
      io.post("// " + this.__str__() + "\n");
      return this;
    };

    spec.postc = function() {
      io.post("// " + this.__str__());
      return this;
    };

    // TODO: implements postf
    // TODO: implements format
    // TODO: implements matchRegexp
    // TODO: implements fformat
    // TODO: implements die
    // TODO: implements error
    // TODO: implements warn
    // TODO: implements inform

    spec["++"] = function($anObject) {
      return $.String(
        this.toString() + $anObject.asString().toString()
      );
    };

    spec["+"] = function($anObject) {
      return $.String(
        this.toString() + " " + $anObject.asString().toString()
      );
    };

    // TODO: implements catArgs
    // TODO: implements scatArgs
    // TODO: implements ccatArgs
    // TODO: implements catList
    // TODO: implements scatList
    // TODO: implements ccatList
    // TODO: implements split
    // TODO: implements containsStringAt
    // TODO: implements icontainsStringAt
    // TODO: implements contains
    // TODO: implements containsi
    // TODO: implements findRegexp
    // TODO: implements findAllRegexp
    // TODO: implements find
    // TODO: implements findBackwards
    // TODO: implements endsWith
    // TODO: implements beginsWith
    // TODO: implements findAll
    // TODO: implements replace
    // TODO: implements escapeChar
    // TODO: implements shellQuote
    // TODO: implements quote
    // TODO: implements tr
    // TODO: implements insert
    // TODO: implements wrapExtend
    // TODO: implements zeroPad
    // TODO: implements padLeft
    // TODO: implements padRight
    // TODO: implements underlined
    // TODO: implements scramble
    // TODO: implements rotate
    // TODO: implements compile
    // TODO: implements interpret
    // TODO: implements interpretPrint
    // TODO: implements $readNew
    // TODO: implements printOn
    // TODO: implements storeOn
    // TODO: implements inspectorClass
    // TODO: implements standardizePath
    // TODO: implements realPath
    // TODO: implements withTrailingSlash
    // TODO: implements withoutTrailingSlash
    // TODO: implements absolutePath
    // TODO: implements pathMatch
    // TODO: implements load
    // TODO: implements loadPaths
    // TODO: implements loadRelative
    // TODO: implements resolveRelative
    // TODO: implements include
    // TODO: implements exclude
    // TODO: implements basename
    // TODO: implements dirname
    // TODO: implements splittext
    // TODO: implements +/+
    // TODO: implements asRelativePath
    // TODO: implements asAbsolutePath
    // TODO: implements systemCmd
    // TODO: implements gethostbyname
    // TODO: implements getenv
    // TODO: implements setenv
    // TODO: implements unsetenv
    // TODO: implements codegen_UGenCtorArg
    // TODO: implements ugenCodeString
    // TODO: implements asSecs
    // TODO: implements speak
    // TODO: implements toLower
    // TODO: implements toUpper
    // TODO: implements mkdir
    // TODO: implements parseYAML
    // TODO: implements parseYAMLFile
  });

});

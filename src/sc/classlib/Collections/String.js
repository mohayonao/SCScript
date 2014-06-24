SCScript.install(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var $  = sc.lang.$;
  var $nil   = $.nil;
  var $false = $.false;
  var $space = $.Char(" ");

  sc.lang.klass.refine("String", function(builder) {
    builder.addMethod("__str__", function() {
      return this.valueOf();
    });

    builder.addMethod("__elem__", function($item) {
      if (!$item) {
        return $space;
      }
      if ($item.__tag !== sc.TAG_CHAR) {
        throw new TypeError("Wrong type.");
      }
      return $item;
    });

    builder.addMethod("valueOf", function() {
      return this._.map(function(elem) {
        return elem.__str__();
      }).join("");
    });

    builder.addMethod("toString", function() {
      return this.valueOf();
    });

    // TODO: implements unixCmdActions
    // TODO: implements unixCmdActions_
    // TODO: implements $initClass
    // TODO: implements $doUnixCmdAction
    // TODO: implements unixCmd
    // TODO: implements unixCmdGetStdOut

    builder.addMethod("asSymbol", function() {
      return $.Symbol(this.__str__());
    });

    builder.addMethod("asInteger", function() {
      var m = /^[-+]?\d+/.exec(this.__str__());
      return $.Integer(m ? m[0]|0 : 0);
    });

    builder.addMethod("asFloat", function() {
      var m = /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/.exec(this.__str__());
      return $.Float(m ? +m[0] : 0);
    });

    builder.addMethod("ascii", function() {
      var raw = this.__str__();
      var a, i, imax;

      a = new Array(raw.length);
      for (i = 0, imax = a.length; i < imax; ++i) {
        a[i] = $.Integer(raw.charCodeAt(i));
      }

      return $.Array(a);
    });

    // TODO: implements stripRTF
    // TODO: implements stripHTML
    // TODO: implements $scDir

    builder.addMethod("compare", {
      args: "aString; ignoreCase=false"
    }, function($aString, $ignoreCase) {
      var araw, braw, length, i, a, b, cmp, func;

      if ($aString.__tag !== sc.TAG_STR) {
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
    });

    builder.addMethod("<", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() < 0
      );
    });

    builder.addMethod(">", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() > 0
      );
    });

    builder.addMethod("<=", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() <= 0
      );
    });

    builder.addMethod(">=", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() >= 0
      );
    });

    builder.addMethod("==", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() === 0
      );
    });

    builder.addMethod("!=", function($aString) {
      return $.Boolean(
        this.compare($aString, $false).__num__() !== 0
      );
    });

    // TODO: implements hash

    builder.addMethod("performBinaryOpOnSimpleNumber", function($aSelector, $aNumber) {
      return $aNumber.asString().perform($aSelector, this);
    });

    builder.addMethod("performBinaryOpOnComplex", function($aSelector, $aComplex) {
      return $aComplex.asString().perform($aSelector, this);
    });

    builder.addMethod("multiChannelPerform", function() {
      throw new Error("String:multiChannelPerform. Cannot expand strings.");
    });

    builder.addMethod("isString", sc.TRUE);

    builder.addMethod("asString");

    builder.addMethod("asCompileString", function() {
      return $.String("\"" + this.__str__() + "\"");
    });

    builder.addMethod("species", function() {
      return $("String");
    });

    builder.addMethod("postln", function() {
      sc.lang.io.post(this.__str__() + "\n");
      return this;
    });

    builder.addMethod("post", function() {
      sc.lang.io.post(this.__str__());
      return this;
    });

    builder.addMethod("postcln", function() {
      sc.lang.io.post("// " + this.__str__() + "\n");
      return this;
    });

    builder.addMethod("postc", function() {
      sc.lang.io.post("// " + this.__str__());
      return this;
    });

    // TODO: implements postf
    // TODO: implements format
    // TODO: implements matchRegexp
    // TODO: implements fformat
    // TODO: implements die
    // TODO: implements error
    // TODO: implements warn
    // TODO: implements inform

    builder.addMethod("++", function($anObject) {
      return $.String(
        this.toString() + $anObject.asString().toString()
      );
    });

    builder.addMethod("+", function($anObject) {
      return $.String(
        this.toString() + " " + $anObject.asString().toString()
      );
    });
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

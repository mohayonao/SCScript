(function(sc) {
  "use strict";

  require("./ArrayedCollection");

  var $SC = sc.lang.$SC;

  var instances = {};

  function SCString(value) {
    if (instances[value]) {
      return instances[value];
    }
    // TODO: array?
    this.__initializeWith__("RawArray");
    this._class = $SC.Class("String");
    this._raw = value;
    instances[value] = this;
  }

  sc.lang.klass.define("String", "RawArray", {
    constructor: SCString,
    $new: function() {
      throw new Error("String.new is illegal, should use literal.");
    },
    __tag__: function() {
      return sc.C.TAG_STR;
    },
    __str__: function() {
      return this._raw;
    },
    NotYetImplemented: [
      // "$initClass",
      "$doUnixCmdAction",
      "prUnixCmd",
      "unixCmd",
      "unixCmdGetStdOut",
      "asSymbol",
      "asInteger",
      "asFloat",
      "ascii",
      "stripRTF",
      "stripHTML",
      "$scDir",
      "compare",
      "hash",
      "performBinaryOpOnSimpleNumber",
      "performBinaryOpOnComplex",
      "multiChannelPerform",
      "isString",
      "asString",
      "asCompileString",
      "species",
      "postln",
      "post",
      "postcln",
      "postc",
      "postf",
      "format",
      "prFormat",
      "matchRegexp",
      "fformat",
      "die",
      "error",
      "warn",
      "inform",
      "catArgs",
      "scatArgs",
      "ccatArgs",
      "catList",
      "scatList",
      "ccatList",
      "split",
      "containsStringAt",
      "icontainsStringAt",
      "contains",
      "containsi",
      "findRegexp",
      "findAllRegexp",
      "while",
      "find",
      "findBackwards",
      "endsWith",
      "beginsWith",
      "findAll",
      "while",
      "replace",
      "escapeChar",
      "shellQuote",
      "quote",
      "tr",
      "insert",
      "wrapExtend",
      "zeroPad",
      "padLeft",
      "padRight",
      "underlined",
      "scramble",
      "rotate",
      "compile",
      "interpret",
      "interpretPrint",
      "$readNew",
      "prCat",
      "printOn",
      "storeOn",
      "inspectorClass",
      "standardizePath",
      "realPath",
      "withTrailingSlash",
      "withoutTrailingSlash",
      "absolutePath",
      "pathMatch",
      "load",
      "loadPaths",
      "loadRelative",
      "resolveRelative",
      "include",
      "exclude",
      "basename",
      "dirname",
      "splitext",
      "asRelativePath",
      "asAbsolutePath",
      "systemCmd",
      "gethostbyname",
      "getenv",
      "setenv",
      "unsetenv",
      "codegen_UGenCtorArg",
      "ugenCodeString",
      "asSecs",
      "speak",
      "toLower",
      "toUpper",
      "mkdir",
      "parseYAML",
      "parseYAMLFile",
    ]
  });

  $SC.String = function(value) {
    return new SCString(String(value)); // jshint ignore: line
  };

})(sc);

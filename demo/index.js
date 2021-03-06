/* jshint browser: true, devel: true */
/* global SCScript, CodeMirror, $, _ */
window.onload = function() {
  "use strict";

  var editor, now;
  var prev = "";

  if (window.performance && typeof window.performance.now === "function") {
    now = window.performance.now.bind(window.performance);
  } else {
    now = function() {
      return Infinity;
    };
  }

  function update(source) {
    if (prev !== source) {
      window.location.replace("#" + encodeURIComponent(source));
      prev = source;
    }
  }

  function getCode(editor) {
    var code, cursor, line, range, callback;
    var cssName = "blink1";

    code = editor.getSelection();
    if (!code) {
      cursor = editor.getCursor();
      line   = cursor.line;
      range  = selectRegion(editor, line);
      if (range) {
        editor.setSelection({ line: range[0], ch: 0 }, { line: range[1], ch: Infinity });
        code = editor.getSelection();
        callback = function() {
          editor.setSelection(cursor);
        };
        cssName = "blink2";
      }
    }

    blink(cssName, ".CodeMirror-focused .CodeMirror-selected", callback);

    return code;
  }

  function selectRegion(editor, begin) {
    var lookAt, end, last, line;
    var depth, code;

    code   = null;
    lookAt = begin;
    end    = begin;
    last   = editor.lineCount();
    depth  = 0;

    while (true) {
      line = editor.getLine(lookAt);
      for (var i = 0; i < line.length; ++i) {
        var ch = line.charAt(i);
        if (ch === "(" || ch === "[" || ch === "{") {
          depth += 1;
        } else if (ch === "}" || ch === "]" || ch === ")") {
          depth -= 1;
        }
      }
      if (depth === 0) {
        return [ begin, end ];
      } else if (depth < 0) {
        begin -= 1;
        if (begin < 0) {
          return;
        }
        lookAt = begin;
      } else if (depth > 0) {
        end += 1;
        if (end > last) {
          return;
        }
        lookAt = end;
      }
    }
  }

  var getCssRule = (function() {
    var cache = {};
    return function(selector) {
      selector = selector.toLowerCase();
      if (!cache[selector]) {
        _.each(document.styleSheets, function(sheet) {
          _.each(sheet.cssRules || sheet.rules, function(rule) {
            if (String(rule.selectorText).toLowerCase().indexOf(selector) !== -1) {
              cache[selector] = rule;
            }
          });
        });
      }
      return cache[selector];
    };
  })();

  function blink(cssName, selector, callback) {
    var rule = getCssRule(selector);
    if (rule) {
      setTimeout(function() {
        rule.style.setProperty("-webkit-animation", null);
        if (callback) {
          callback();
        }
      }, 500);
      rule.style.setProperty("-webkit-animation", cssName + " 0.5s");
    }
  }

  function isObject(obj) {
    return obj && obj.constructor === Object;
  }

  function isSCObject(obj) {
    return obj && typeof obj._ !== "undefined";
  }

  function SCObject(value) {
    this.class = value.__className;
    this.hash  = value.__hash;
  }

  var formatter = {
    SCObject: function(value) {
      return new SCObject(value);
    },
    Array: function(value) {
      return value.map(formatter.Value);
    },
    Object: function(value) {
      var dict = {};
      Object.keys(value).forEach(function(key) {
        dict[key] = formatter.Value(value[key]);
      });
      return dict;
    },
    Value: function(value) {
      if (isSCObject(value)) {
        return formatter.SCObject(value);
      }
      if (Array.isArray(value)) {
        return formatter.Array(value);
      }
      if (isObject(value)) {
        return formatter.Object(value);
      }
      return value;
    }
  };

  function evaluate() {
    var code, result;
    var beginTime, elapsedTime;

    code = getCode(editor).trim();
    beginTime = now();

    result = eval.call(null, SCScript.compile(code));

    elapsedTime = now() - beginTime;

    if (result) {
      result = formatter.Value(result.valueOf());
    }

    console.log(result);

    if (!isNaN(elapsedTime)) {
      $("#timecop").text(elapsedTime.toFixed(3) + "ms");
    }
  }

  function boot() {
    console.log("boot");
  }

  function stop() {
    console.log("stop");
  }

  function readFromGist(gistid, callback) {
    var url = "https://api.github.com/gists/" + gistid;
    $.ajax({ url: url, type: "GET", dataType: "jsonp" }).then(function(result) {
      var files, code;
      files = result.data.files;
      if (files) {
        code = _.chain(files).keys().filter(function(key) {
          return files[key].language === "SuperCollider";
        }).map(function(key) {
          return files[key].content;
        }).value().join("\n");
      } else {
        code = "";
        console.warn("gist:" + gistid + " not found");
      }
      callback(code);
    });
  }

  editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "SCScript",
    theme: "sc-mode",
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    showCursorWhenSelecting: true,
    matchBrackets: true,
    extraKeys: {
      "Ctrl-Enter": evaluate,
      "Ctrl-B": boot,
      "Ctrl-.": stop,
      "Cmd-Enter": evaluate,
      "Cmd-B": boot,
      "Cmd-.": stop,
    }
  });

  editor.on("keyup", function() {
    update(editor.getValue());
  });

  if (/mac/i.test(window.navigator.platform)) {
    $(".mac").show();
  } else {
    $(".win").show();
  }

  if (window.location.hash) {
    prev = decodeURIComponent(window.location.hash.substr(1));
    if (/^gist:/.test(prev)) {
      readFromGist(prev.substr(5), function(code) {
        editor.setValue(code);
        prev = code;
      });
    } else {
      editor.setValue(prev);
    }
  }

  $("#menualt").on("click", function() {
    $("#sidemenu").animate({ width: "toggle", opacity: "toggle" }, 500, "swing");
  });
};

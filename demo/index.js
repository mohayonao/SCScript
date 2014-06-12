/* jshint browser: true, devel: true */
/* global SCScript, CodeMirror, $ */
window.onload = function() {
  "use strict";

  var editor;
  var prev = "";

  var update = function(source) {
    if (prev !== source) {
      window.location.replace("#" + encodeURIComponent(source));
      prev = source;
    }
  };

  var getCode = function(editor) {
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

    blink(cssName, ".codemirror-focused .codemirror-selected", callback);

    return code;
  };

  var selectRegion = function(editor, begin) {
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
  };

  var getCssRule = (function() {
    var cache = {};
    return function(selector) {
      if (!cache[selector]) {
        [].slice.call(document.styleSheets).forEach(function(sheet) {
          [].slice.call(sheet.cssRules || sheet.rules).forEach(function(rule) {
            if (rule.selectorText && rule.selectorText.indexOf(selector) !== -1) {
              cache[selector] = rule;
            }
          });
        });
      }
      return cache[selector];
    };
  })();

  var blink = function(cssName, selector, callback) {
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
  };

  var evaluate = function() {
    var code, result;

    code = SCScript.compile(getCode(editor));

    result = eval.call(null, code);

    if (result) {
      result = result.valueOf();
    }

    console.log(result);
  };

  var boot = function() {
    console.log("boot");
  };

  var stop = function() {
    console.log("stop");
  };

  var readFromGist = function(gistid, callback) {
    var url = "https://api.github.com/gists/" + gistid;
    $.ajax({ url: url, type: "GET", dataType: "jsonp" }).then(function(result) {
      var files, code;
      files = result.data.files;
      if (files) {
        code = Object.keys(files).filter(function(key) {
          return files[key].language === "SuperCollider";
        }).map(function(key) {
          return files[key].content;
        }).join("\n");
      } else {
        code = "";
        console.warn("gist:" + gistid + " not found");
      }
      callback(code);
    });
  };

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
      "Cmd-Enter" : evaluate,
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

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/utils.js":[function(require,module,exports) {
function mergeObjects() {
  var result = {};

  for (var i = 0; i < arguments.length; i++) {
    var keys = Object.keys(arguments[i]),
        object = arguments[i] || {};

    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      result[key] = object[key];
    }
  }

  return result;
}

function createElement(tag, styleClasses) {
  var element = document.createElement(tag);

  if (styleClasses && styleClasses.length) {
    styleClasses.forEach(function (styleClass) {
      element.classList.add(styleClass);
    });
  }

  return element;
}

module.exports = {
  mergeObjects: mergeObjects,
  createElement: createElement
};
},{}],"src/grid.js":[function(require,module,exports) {
var utils = require("./utils.js");

var gridDefaultConfiguration = {
  title: "Data Table",
  height: "100%",
  width: "100%",
  data: [],
  dataType: "object",
  columnModel: [],
  noDataMessage: "No Data Available",
  defaultOuterStyleClass: "default-table-style"
};
var gridObject, gridElement;
/* Given more time, I would have:

  * Used ES6 Classes or ES prototypes for better code organization
  * Added sorting
  * Added tests
*/

/* Init grid and return grid object */

function initializeGrid(gridName, parentElement, configuration) {
  var config = utils.mergeObjects({}, gridDefaultConfiguration, configuration);

  if (!gridName) {
    throw new Error("Grid name must be provided.");
  }

  if (!parentElement) {
    throw new Error("Parent element must be provided.");
  }

  gridObject = {
    name: gridName,
    gridElement: gridElement,
    parentElement: parentElement,
    config: config,
    setData: setData,
    destroy: destroy
  };
  renderGrid();
  gridObject.gridElement = gridElement;
  return gridObject;
}

function setData(data) {
  var tbodyEl = gridElement.querySelector("tbody"); // clear tbody

  while (tbodyEl.firstChild) {
    tbodyEl.removeChild(tbodyEl.firstChild);
  }

  createRows(tbodyEl, gridObject.config.columnModel, data);
}

function renderGrid() {
  if (!gridObject.parentElement) {
    throw new Error("Parent element must be provided.");
  }

  var parent = gridObject.parentElement,
      config = gridObject.config; //empty the parent element

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  } //create basic table


  gridElement = utils.createElement("table", [config.defaultOuterStyleClass]);
  gridElement.style.width = config.width;
  parent.style.height = config.height; //create column heads

  var theadEl = utils.createElement("thead");

  if (!config.columnModel || !config.columnModel.length) {
    config.columnModel = creteColumnModelFromData(config.data);
  }

  createColumnHeaders(theadEl, config.columnModel);
  gridElement.appendChild(theadEl);
  var tbodyEl = utils.createElement("tbody");

  if (config.data && config.data.length) {
    createRows(tbodyEl, config.columnModel, config.data);
  } else {
    addEmptyMessage(config, tbodyEl);
  }

  gridElement.appendChild(tbodyEl); //append table

  parent.appendChild(gridElement);
}

function addEmptyMessage(config, tbodyEl) {
  var td = utils.createElement("td");
  td.textContent = config.noDataMessage;
  td.setAttribute("colspan", config.columnModel.length);
  td.style.textAlign = "center";
  tbodyEl.append(td);
}

function creteColumnModelFromData(data) {
  var columns = Object.keys(data[0]);
  return columns.map(function (column) {
    return {
      title: column,
      column: column
    };
  });
}

function createColumnHeaders(theadEl, columnModel) {
  var trEl = utils.createElement("tr");
  theadEl.append(trEl);
  columnModel.forEach(function (columnDefination) {
    var newColEl = utils.createElement("th");
    newColEl.textContent = columnDefination.title || columnDefination.column;
    trEl.appendChild(newColEl);
  });
}

function createRows(tbodyEl, columnModel, data) {
  data.forEach(function (record, index) {
    var trEl = utils.createElement("tr");
    tbodyEl.append(trEl); //row click event handler

    trEl.addEventListener("click", function (event) {
      var rowClickEvent = new CustomEvent("rowclick", {
        detail: {
          record: record,
          index: index,
          rowElement: trEl
        }
      });
      gridElement.dispatchEvent(rowClickEvent);
    }); //create tds for each datum

    columnModel.forEach(function (model) {
      var newColEl = utils.createElement("td");
      newColEl.style.textAlign = model.align;
      /* Content: render content thru render if any, else render as plain text */

      if (model.renderer) {
        newColEl.innerHTML = model.renderer(record[model.column]);
      } else {
        newColEl.textContent = record[model.column];
      }

      trEl.appendChild(newColEl);
    });
  });
}

function destroy() {
  //event handlers will be removed automatically when elements are garbage collected
  gridObject.parentElement.removeChild(gridObject.parentElement.firstChild);
}

module.exports = {
  initializeGrid: initializeGrid
};
},{"./utils.js":"src/utils.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var grid = require("./grid.js");

var gridParent = document.querySelector(".example-grid-parent");
var gridObject = grid.initializeGrid("myDataGrid", gridParent, {
  title: "My Grid",
  data: [{
    name: "Jon Doe",
    gender: "male",
    age: 35
  }, {
    name: "Jane Doe",
    gender: "female",
    age: 30
  }],
  columnModel: [{
    title: "User Name",
    column: "name",
    width: "200px",
    align: "left"
  }, {
    title: "Gender",
    column: "gender",
    width: "100px",
    align: "left",
    renderer: function renderer(value, row) {
      switch (value) {
        case "male":
          return "👨";

        case "female":
          return "👩";

        default:
          return value;
      }
    }
  }, {
    title: "Age",
    column: "age",
    width: "100px",
    align: "right"
  }],
  height: "500px"
});
gridObject.gridElement.addEventListener("rowclick", function (event) {
  console.log("clicked row: ", event.detail);
}); //set data any time

gridObject.setData([{
  name: "Ramesh",
  gender: "male",
  age: 20
}, {
  name: "Surekha",
  gender: "female",
  age: 11
}]); //gridObject.destroy(); /* Destory grid */

console.log(gridObject);
},{"./styles.css":"src/styles.css","./grid.js":"src/grid.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62836" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map
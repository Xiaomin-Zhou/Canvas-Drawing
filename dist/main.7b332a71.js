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
})({"epB2":[function(require,module,exports) {
var canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");
ctx.strokeStyle = 'none';
var lineWidth = 5;
ctx.lineCap = "round";
var painting = false;
var eraserEnabled = false;
var last;
var LiColor = document.getElementsByTagName("li");
listenToUser();
getColor();

function getColor() {
  for (var i = 0; i < LiColor.length; i++) {
    LiColor[i].onclick = function () {
      for (var _i = 0; _i < LiColor.length; _i++) {
        LiColor[_i].classList.remove("active");

        this.classList.add("active");
        activeColor = this.style.backgroundColor;
        console.log(this.style.backgroundColor);
        ctx.fillStyle = activeColor;
        ctx.strokeStyle = activeColor;
      }
    };
  }
}

function listenToUser() {
  var _this = this;

  thin.onclick = function () {
    lineWidth = 2;
    thin.classList.add("active");
    normal.classList.remove("active");
    strong.classList.remove("active");
    eraser.classList.remove("active");
  };

  normal.onclick = function () {
    lineWidth = 5;
    normal.classList.add("active");
    thin.classList.remove("active");
    strong.classList.remove("active");
    eraser.classList.remove("active");
  };

  strong.onclick = function () {
    lineWidth = 10;
    strong.classList.add("active");
    thin.classList.remove("active");
    normal.classList.remove("active");
    eraser.classList.remove("active");
  };

  eraser.onclick = function () {
    eraserEnabled = true;
    eraser.classList.add("active");
    pen.classList.remove("active");
    thin.classList.remove("active");
    normal.classList.remove("active");
    strong.classList.remove("active");
  };

  pen.onclick = function write() {
    eraserEnabled = false;
    pen.classList.add("active");
    eraser.classList.remove("active");
  };

  clear.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    eraser.classList.remove("active");
  };

  download.onclick = function () {
    var url = canvas.toDataURL();
    window.alert("已经保存在本地，命名为：myDrawing.png");
    var a = document.createElement("a");
    a.download = "myDrawing.png";
    a.href = url;
    a.click();
    eraser.classList.remove("active");
  };

  var historyData = [];

  function saveData(data) {
    historyData.length === 10 && historyData.shift(); // 储存上限为10步

    historyData.push(data);
  }

  undo.onclick = function () {
    eraser.classList.remove("active");
    if (historyData.length < 1) return false;
    ctx.putImageData(historyData[historyData.length - 1], 0, 0);
    historyData.pop();
  }; //检测手机设备


  function is_touch_device() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  } // 判断是手机设备后，用drawLine画线，保留上次画的点


  if (is_touch_device()) {
    canvas.ontouchstart = function (e) {
      _this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height); //在这里储存绘图

      saveData(_this.firstDot);
      painting = true;
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY; // 起点

      last = [x, y];
    };

    canvas.ontouchmove = function (e) {
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;

      if (painting) {
        if (eraserEnabled) {
          ctx.clearRect(x - 5, y - 5, 20, 20);
        } else {
          drawLine(last[0], last[1], x, y); // 时时更新 last

          last = [x, y];
        }
      }
    };
  } else {
    // 判断在PC端，painting 是用来 停/起 笔的;
    canvas.onmousedown = function (e) {
      _this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height); //在这里储存绘图

      saveData(_this.firstDot);
      painting = true;
      last = [e.clientX, e.clientY];
    };

    canvas.onmouseup = function (e) {
      painting = false;
    };

    canvas.onmousemove = function (e) {
      if (painting === true) {
        if (eraserEnabled) {
          ctx.clearRect(e.clientX - 5, e.clientY - 5, 20, 20);
        } else {
          drawLine(last[0], last[1], e.clientX, e.clientY);
          last = [e.clientX, e.clientY];
        }
      }
    };
  }
} // 两点之间用canvas画线的 函数


function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lineWidth; //线 粗细设置

  ctx.stroke();
}
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.7b332a71.js.map
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
})({"react-dom/diif.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;

var _index = require("./index");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function diff(dom, vnode, container) {
  var ret = diffNode(dom, vnode);

  if (container) {
    container.appendChild(ret);
  }
}

function diffNode(dom, vnode) {
  var out = dom; //实现虚拟dom的渲染
  //如果是空

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode); //如果是字符串

  if (typeof vnode === 'string') {
    if (dom) {
      if (dom && dom.nodeType === 3) {
        //dom存在，并且是文本
        if (dom.textContent !== vnode) {
          //更新文本内容
          dom.textContent = vnode;
        }
      }
    } else {
      out = document.createTextNode(vnode); //创建文本节点 
    }

    return out;
  } //如果是组件(函数组件和类组件)


  if (typeof vnode.tag === 'function') {
    return diffComponent(out, vnode);
  } //非文本节点，分为组件和非文本dom节点


  if (!dom) {
    out = document.createElement(vnode.tag);
  }

  diffAttribute(out, vnode); //比较子节点

  if (vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out, vnode.children);
  }

  return out;
}

function diffAttribute(dom, vnode) {
  //dom原有节点，vnode是虚拟dom
  var oldAttrs = []; //保存之前的dom所有属性

  var newAttrs = vnode.attrs; //新的dom属性

  var domAttrs = _toConsumableArray(document.querySelector('#root').attributes);

  domAttrs.forEach(function (item) {
    oldAttrs[item.name] = item.value;
  }); //比较
  //如果原来的属性没在新的属性里，就移除

  for (var key in oldAttrs) {
    if (!(key in newAttrs)) {
      (0, _index.setAttribute)(dom, key, undefined); //设置undefined就是移除属性
    }
  } //更新和新增


  for (var keys in newAttrs) {
    if (oldAttrs[keys] !== newAttrs[keys]) {
      (0, _index.setAttribute)(dom, keys, newAttrs[keys]);
    }
  }
} // 对比子节点


function diffChildren(dom, vchildren) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyed = {}; // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开

  if (domChildren.length > 0) {
    _toConsumableArray(domChildren).forEach(function (item) {
      // 获取key
      var key = item.key;

      if (key) {
        // 如果key存在,保存到对象中
        keyed[key] = item;
      } else {
        // 如果key不存在,保存到数组中
        children.push(item);
      }
    });
  }

  if (vchildren && vchildren.length > 0) {
    var min = 0;
    var childrenLen = children.length; //2

    _toConsumableArray(vchildren).forEach(function (vchild, i) {
      // 获取虚拟DOM中所有的key
      var key = vchild.key;
      var child;

      if (key) {
        // 如果有key,找到对应key值的节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // alert(1);
        // 如果没有key,则优先找类型相同的节点
        for (var j = min; j < childrenLen; j++) {
          var c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      } // 对比


      child = diffNode(child, vchild); // 更新DOM

      var f = domChildren[i];

      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child); // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (child === f.nextSibling) {
          removeNode(f); // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(child, f);
        }
      }
    });
  }
}

function diffComponent(dom, vnode) {
  var comp = dom; //如果组件没变化，重新设置props

  if (comp && comp.constructor === vnode.tag) {
    (0, _index.setComponentProps)(comp, vnode.attrs); //赋值

    dom = comp.base;
  } else {
    //组件发生变化
    if (comp) {
      //移除旧组件
      unmountComponent(comp);
      comp = null;
    } //1.创建新组件


    comp = (0, _index.createComponent)(vnode.tag, vnode.attrs); //设置组件属性

    (0, _index.setComponentProps)(comp, vnode.attrs); //挂载

    dom = comp.base;
  }

  return dom;
}

function unmountComponent(comp) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}
},{"./index":"react-dom/index.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponent = createComponent;
exports.setComponentProps = setComponentProps;
exports.renderComponent = renderComponent;
exports.setAttribute = setAttribute;
exports.default = void 0;

var _component = _interopRequireDefault(require("../react/component"));

var _diif = require("./diif");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ReactDOM = {
  render: render
};

function render(vnode, container, dom) {
  return (0, _diif.diff)(dom, vnode, container); // return container.appendChild(_render(vnode)) //_render返回节点对象
}

function createComponent(comp, props) {
  var inst; //如果是类定义的组件，就创建实例

  if (comp.prototype && comp.prototype.render) {
    //由于类组件需要继承component，实现render方法，所以在原型上有render
    inst = new comp(props);
  } else {
    //函数组件
    //如果是函数组件，转换成类组件，方便统一管理
    inst = new _component.default(props);
    inst.constructor = comp; //将类的构造函数指向该函数
    //定义dender函数

    inst.render = function () {
      return this.constructor(props);
    };
  }

  return inst; //返回类组件
}

function setComponentProps(comp, props) {
  //comp已经是类组件
  //更新props
  comp.props = props;

  if (!comp.base) {
    if (comp.componentWillMount) {
      comp.componentWillMount(); //执行第一个声明周期
    } else if (comp.componentWillReceiveProps) {
      comp.componentWillReceiveProps(); //所以第一次不会执行该方法
    }
  } //渲染组件


  renderComponent(comp);
}

function renderComponent(comp) {
  var base;
  var renderer = comp.render();

  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  } //base = _render(render)//得到真实的dom对象


  base = (0, _diif.diffNode)(comp.base, renderer);

  if (comp.base) {
    if (comp.componentDidUpdate) {
      comp.componentDidUpdate();
    }
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  }

  comp.base = base; //挂在实例上
}

function _render(vnode) {
  //实现虚拟dom的渲染
  //如果是空
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode); //如果是字符串

  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  } //如果是组件(类组件和函数组件)


  if (typeof vnode.tag === 'function') {
    //函数组件
    // 1.创建组件，可能是函数组件和类组件，都转换成类组件通一处理
    var comp = createComponent(vnode.tag, vnode.attrs); // 2.设置组件属性

    setComponentProps(comp); // 3.转换成节点对象返回

    return comp.base; //返回组装好的实例对象
  } //剩下的就是虚拟dom
  //解构出虚拟dom


  var _vnode = vnode,
      tag = _vnode.tag,
      attrs = _vnode.attrs,
      children = _vnode.children; //创建根dom

  var dom = document.createElement(tag); //绑定属性

  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      setAttribute(dom, key, value);
    });
  } //渲染子节点，递归


  if (children) {
    children.forEach(function (node) {
      return render(node, dom);
    });
  } //加载到div上并返回


  return dom;
}

function setAttribute(dom, key, value) {
  //将classname转成class
  if (key === 'className') {
    key = 'class';
  } //事件监听，onClick，onBlur


  if (/on\w+/.test(key)) {
    //转小写
    key = key.toLowerCase();
    dom[key] = value || '';
  } else if (key === 'style') {
    //样式属性
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && _typeof(value) == 'object') {
      for (var k in value) {
        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px';
        } else {
          dom.style[k] = value[k];
        }
      }
    }
  } else {
    //其他属性，title='123'
    if (key in dom) {
      dom[key] = value || '';
    }

    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}

var _default = ReactDOM;
exports.default = _default;
},{"../react/component":"react/component.js","./diif":"react-dom/diif.js"}],"react/set_state_queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enquequeSetState = enquequeSetState;

var _reactDom = require("../react-dom");

var setStateQueue = [];
var renderQueue = [];

function defer(fn) {
  return Promise.resolve().then(fn);
}

function enquequeSetState(stateChange, component) {
  if (setStateQueue.length === 0) {
    defer(flush);
  } //短时间合并多个state


  setStateQueue.push({
    stateChange: stateChange,
    component: component
  }); //如果renderQueue没有组件，才去添加

  var r = renderQueue.some(function (item) {
    return item === component;
  });

  if (!r) {
    renderQueue.push(component);
  }
} //一段时间后


function flush() {
  var item, component; // 遍历state

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component; // 如果没有prevState,则将当前的state作为初始的prevState

    if (!_component.prevState) {
      _component.prevState = Object.assign({}, _component.state);
    } // 如果stateChange是一个方法,也就是setState的第一种形式


    if (typeof stateChange === 'function') {
      Object.assign(_component.state, stateChange(_component.prevState, _component.props));
    } else {
      // 如果stateChange是一个对象,则直接合并到setState中
      Object.assign(_component.state, stateChange);
    }

    _component.prevState = _component.state;
  } // 遍历组件


  while (component = renderQueue.shift()) {
    (0, _reactDom.renderComponent)(component);
  }
}
},{"../react-dom":"react-dom/index.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../react-dom/index");

var _set_state_queue = require("./set_state_queue");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange) {
      //对象拷贝
      // Object.assign(this.state,state)//可以不加
      // //渲染组件
      // renderComponent(this)
      (0, _set_state_queue.enquequeSetState)(stateChange, this);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"../react-dom/index":"react-dom/index.js","./set_state_queue":"react/set_state_queue.js"}],"react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createElement(tag, attrs) {
  attrs = attrs || {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    children: children,
    key: attrs.key || null
  };
}

var _default = {
  createElement: createElement,
  Component: _component.default
};
exports.default = _default;
},{"./component":"react/component.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ele = _react.default.createElement("div", {
  className: "active",
  title: "111"
}, "hello,", _react.default.createElement("button", null, "react")); // function Home(){
//     return (
//         <div className="active" title='111'>
//         hello,<button>react</button>
//     </div>
//     )
// }


var Home = /*#__PURE__*/function (_React$Component) {
  _inherits(Home, _React$Component);

  var _super = _createSuper(Home);

  function Home() {
    var _this;

    _classCallCheck(this, Home);

    _this = _super.call(this);
    _this.state = {
      num: 0
    };
    return _this;
  }

  _createClass(Home, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('加载完成');
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log('加载即将完成');
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      console.log('props');
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      console.log('加载即将更新');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log('加载更新完成');
    }
  }, {
    key: "click",
    value: function click() {
      this.setState(function (prevState) {
        return {
          num: prevState.num + 1
        };
      });
      this.setState(function (prevState) {
        return {
          num: prevState.num + 1
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "active",
        title: "111"
      }, "hello,", _react.default.createElement("button", {
        onClick: this.click.bind(this)
      }, "react"), this.state.num);
    }
  }]);

  return Home;
}(_react.default.Component);

_reactDom.default.render(_react.default.createElement(Home, null), document.getElementById('root'));
},{"./react":"react/index.js","./react-dom":"react-dom/index.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50052" + '/');

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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/react-simple.e31bb0bc.js.map
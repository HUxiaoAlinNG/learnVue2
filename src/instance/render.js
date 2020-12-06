import { createElement, createTextVNode } from "../vdom/create-element";

// 生成虚拟dom 
function installRenderHelpers(target) {
  target._s = function (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (Object.prototype.toString.call(val) === '[object Object]' && val.toString === String.prototype.toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }
  target._v = function (text) {
    return createTextVNode(this, text);
  }
  target._c = function (...args) {
    return createElement(this, ...args);
  }
}

export function renderMixin(Vue) {
  installRenderHelpers(Vue.prototype)

  // 执行render汗水，通过解析出来的_render来渲染虚拟dom
  Vue.prototype._render = function () {
    const vm = this;
    const { render } = vm.$options;
    let vnode = render.call(vm);
    return vnode;
  }
}
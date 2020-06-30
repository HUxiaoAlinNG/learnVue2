import { createElement, createTextVNode } from "../vdom/create-element";

function installRenderHelpers(target) {
  target._s = (val) => {
    val == null
      ? ''
      : Array.isArray(val) || (String.prototype.toString.call(val) === '[object Object]' && val.toString === String.prototype.toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }
  target._v = (text) => createTextVNode(text);
  target._c = (a, b, c, d) => createElement(a, b, c, d, false)
}

export function renderMixin(Vue) {
  installRenderHelpers(Vue.prototype)

  // 通过解析出来的_render来渲染虚拟dom
  Vue.prototype._render = function () {
    const vm = this;
    const { render } = vm.$options;
    let vnode = render.call(vm);
    return vnode;
  }
}
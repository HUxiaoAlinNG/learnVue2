import Watcher from "../observer/watcher";
import { patch } from "../observer/patch";
import { callHook } from "../global-api/index";


export function mountComponent(vm, el) {
  vm.$el = el;
  callHook(vm, "beforeMount");
  // 渲染页面
  const updateComponent = () => {
    // vm._render()：返回虚拟dom
    // vm._update： 根据虚拟dom渲染真实dom
    vm._update(vm._render());
  }
  new Watcher(vm, updateComponent, () => { }, true);
  callHook(vm, "mounted");
}

export function lifecycleMixin(Vue) {
  // 通过虚拟dom来创建真实dom
  Vue.prototype._update = function (vnode) {
    console.log("原始虚拟dom vnode\n", vnode);
    const vm = this;
    const preVNode = vm._vnode;
    vm._vnode = vnode;
    if (preVNode) {
      // dom diff操作
      vm.$el = patch(preVNode, vnode);
    } else {
      // 需要用虚拟节点创建出真实节点 替换掉 真实的$el
      vm.$el = patch(vm.$el, vnode);
    }
  }
}


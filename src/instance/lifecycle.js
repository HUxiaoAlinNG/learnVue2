import Watcher from "../observer/watcher";
import { patch } from "../observer/patch";

export function mountComponent(vm, el) {
  vm.$el = el;
  const updateComponent = () => {
    // 返回虚拟dom
    vm._update(vm._render());
  }
  new Watcher(vm, updateComponent, () => { }, true);
}

export function lifecycleMixin(Vue) {
  // 通过虚拟dom来创建真实dom
  Vue.prototype._update = function (vnode) {
    console.log("vnode", vnode);
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  }
}
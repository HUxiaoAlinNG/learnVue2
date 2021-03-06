import { initState } from "./state";
import { compileToFunctions } from "../compile/index";
import { mountComponent } from "./lifecycle";
import { mergeOptions } from "../util/index";
import { callHook } from "../global-api/index";

export function initMixin(Vue) {
  Vue.prototype._init = function (opts) {
    const vm = this;
    vm.$options = mergeOptions(vm.constructor.options, opts);
    console.log("vm.$options", vm.$options)

    callHook(vm, "beforeCreate");
    initState(vm);
    callHook(vm, "created");
    // 若传入el，则进行模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  // 原始真实dom =》 ast =》 render =》 虚拟dom =》 真实dom
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = el && document.querySelector(el);
    // 组件调用该方法时不传el，故屏蔽
    // if (!el) {
    //   throw new Error("can't get el");
    // }
    // 优先级：render > template > el的内容
    if (!opts.render) {
      // element.outerHTML 获取 序列化HTML片段
      const template = opts.template || el.outerHTML;
      // 转换为render
      opts.render = compileToFunctions(template);
    }

    mountComponent(vm, el);
  }
}
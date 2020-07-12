import { initState } from "./state";
import { compileToFunctions } from "../compile/index";
import { mountComponent, callHook } from "./lifecycle";
import { mergeOptions } from "../util/index";

export function initMixin(Vue) {
  Vue.prototype._init = function (opts) {
    const vm = this;
    vm.$options = mergeOptions(vm.constructor.options, opts);
    console.log("vm.$options", vm.$options)

    callHook("beforeCreate");
    initState(vm);
    callHook("created");
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = el && document.querySelector(el);
    if (!el) {
      throw new Error("can't get el");
    }
    // 优先级：render > template > el的内容
    if (!opts.render) {
      const template = opts.template || el.outerHTML;
      opts.render = compileToFunctions(template);
      console.log("opts.render", opts.render.toString());
    }

    mountComponent(vm, el);
  }
}
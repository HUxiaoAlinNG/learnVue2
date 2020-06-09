import { initState } from "./state";
import { compileToFunctions } from "../compile/index";

export function initMixin(Vue) {
  Vue.prototype._init = function (opts) {
    const vm = this;
    vm.$options = opts;
    console.log("opts", opts);
    initState(vm);
  }

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = el && document.querySelector(el);
    if (!el) {
      throw new Error("can't get el");
    }

    if (!opts.render) {
      const template = opts.template || el.outerHTML;
      opts.render = compileToFunctions(template);
    }
  }
}
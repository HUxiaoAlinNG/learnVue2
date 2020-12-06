import { mergeOptions } from "../util/index";
import { extend } from "../shared/util";
import { ASSET_TYPES } from "../shared/constants";
import { defineReactive, del, observe, set } from "../observer/index";
import { nextTick } from "../util/next-tick";
import initAssetRegisters from "./assets";
import initExtend from "./extend";
import initUse from "./use";
import initMixin from "./mixin";

// 初始化全局变量
export function initGlobalAPI(Vue) {
  Vue.options = {};
  Vue.util = {
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.observable = function (obj) {
    observe(obj);
    return obj;
  }

  initMixin(Vue);
  // 存放全局的组件、指令、过滤器
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null);
  });

  // 存放Vue构造函数
  Vue.options._base = Vue;

  initUse(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

// 调用生命周期函数
export function callHook(vm, hook) {
  const hookHandlers = vm.$options[hook];
  if (Array.isArray(hookHandlers) && hookHandlers.length) {
    hookHandlers.forEach(handler => handler.call(vm));
  }
}
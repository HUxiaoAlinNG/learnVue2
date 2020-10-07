import { mergeOptions } from "../util/index";
import { extend, toArray, isPlainObject } from "../shared/util";
import { ASSET_TYPES } from "../shared/constants";
import { defineReactive, del, observe, set } from "../observer/index";
import { nextTick } from "../util/next-tick";

export function initGlobalAPI(Vue) {
  Vue.options = {};

  Vue.mixin = function (mixin) {
    // 合并属性到Vue.options
    this.options = mergeOptions(this.options, mixin);
  }

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

  // 存放全局的组件、指令、过滤器
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null);
  });

  Vue.options._base = Vue;

  Vue.use = function (plugin) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // 获取参数并增加Vue的构造函数作为第一个参数
    const args = toArray(arguments, 1);
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    // 记录
    installedPlugins.push(plugin);
    return this;
  }

  // 可以通过传入的对象获取这个对象的构造函数
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options);
    }
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    // 子组件的选项和Vue.options进行合并
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    return Sub;
  }

  // 初始化 Vue.component、Vue.directive、Vue.filter
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 将指令、过滤器、组件 绑定在Vue.options上,这样创建子组件时都会和Vue.options进行合并，所以子组件可以拿到全局的定义
        this.options[type + 's'][id] = definition;

        return definition
      }
    }
  })
}
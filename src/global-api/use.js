import { toArray } from "../shared/util";

export default function initUse(Vue) {
  // 插件方法
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
}
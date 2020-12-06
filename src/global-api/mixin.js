import { mergeOptions } from "../util/index";

export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    // 合并属性到Vue.options
    this.options = mergeOptions(this.options, mixin);
  }
}
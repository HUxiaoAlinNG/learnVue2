import { mergeOptions } from "../util/index";

export function initGlobalAPI(Vue) {
  Vue.options = {};

  Vue.mixin = function (mixin) {
    // 合并属性到Vue.options
    this.options = mergeOptions(this.options, mixin);
  }

  // TODO 用来测试
  Vue.mixin({
    name: "test",
  });
  Vue.mixin({
    a: 1,
    beforeCreate() {
      console.log(2)
    }
  });
}
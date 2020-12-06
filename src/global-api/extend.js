import { mergeOptions } from "../util/index";

export default function initExtend(Vue) {
  let cid = 0;
  // 可以通过传入的对象获取这个对象的构造函数
  // 创建出一个子类，继承于Vue,并返回这个类
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options);
    }
    // 增加唯一性
    Sub.cid = cid++;
    // 继承父类
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    // 子组件的选项和Vue.options进行合并
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    return Sub;
  }
}
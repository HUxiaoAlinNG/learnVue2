import { ASSET_TYPES } from "../shared/constants";
import { isPlainObject } from "../shared/util";

// 注册
export default function initAssetRegisters(Vue) {
  // 初始化 Vue.component、Vue.directive、Vue.filter
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          // this.options._base === Vue,确保在Vue上进行合并
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
import { isObject, def } from "../util/index";
import { arrayMethods } from "./array";

class Observer {
  constructor(data) {
    // 给监听过的数据添加__ob__属性，并且设置不可枚举(避免遍历属性时无限循环),设置value为Observer实例，从而可以访问实例上的方法
    def(data, "__ob__", this, false);
    if (Array.isArray(data)) {
      // 覆盖原型
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  // 针对Array类型
  observeArray(data) {
    data.forEach(item => {
      observe(item);
    });
  }

  // 针对Object类型
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    });
  }
}

function defineReactive(data, key, value) {
  // 进行递归劫持属性
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (value === newVal) {
        return;
      }
      // 重新绑定
      observe(newVal);
      value = newVal;
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return;
  }
  return new Observer(data);
}
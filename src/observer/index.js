import { isObject, def } from "../util/index";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(data) {
    // 给监听过的数据添加__ob__属性，并且设置不可枚举(避免遍历属性时无限循环),设置value为Observer实例，从而可以访问实例上的方法
    def(data, "__ob__", this, false);
    // 为了给数组收集watcher
    this.dep = new Dep();
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
  const childObj = observe(value);
  const dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      // 如果取值时有watcher，则让watcher收集dep，dep收集watcher
      if (Dep.target) {
        dep.depend();
        // 收集数组依赖
        if (childObj) {
          childObj.dep.depend();
          // 若值为数组，继续收集依赖
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newVal) {
      if (value === newVal) {
        return;
      }
      // 重新绑定
      observe(newVal);
      value = newVal;
      // 渲染更新
      dep.notice();
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return;
  }
  return new Observer(data);
}

function dependArray(arr) {
  for (let e, i = 0, l = arr.length; i < l; i++) {
    e = arr[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
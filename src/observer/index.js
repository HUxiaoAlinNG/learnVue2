import { isObject, def } from "../util/index";
import { isValidArrayIndex, hasOwn } from "../shared/util";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(data) {
    // 给监听过的数据添加__ob__属性，并且设置不可枚举(避免遍历属性时无限循环),设置value为Observer实例，从而可以访问实例上的方法
    // 改写的 数组原型方法 就用到了该属性
    def(data, "__ob__", this, false);
    // 为了给数组收集watcher
    this.dep = new Dep();
    // 对象和数组采用不同的监听方法，数据通过改写原型的方式(为了性能着想)，不监听索引，所以不能通过修改索引的方式修改数组值(例如：arr[0]=1)，并且由于length无法用Object.defineProperty进行监听
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

// 数据劫持
export function defineReactive(data, key, value) {
  // 进行递归劫持属性
  const childObj = observe(value);
  const dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      // 如果取值时有watcher，则让watcher收集dep，dep收集watcher
      if (Dep.target) {
        dep.depend();
        // 收集数组依赖(对象也会收集，不过由于watcher有去重机制，所以不会重复收集依赖)
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

// 绑定data
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

// 为了绑定公有方法$set
export function set(target, key, val) {
  // 1.数组，调重写后的splice方法(更新视图)
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1, val);
    return val;
  }
  // 2.对象本身属性，直接设置
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = target.__ob__;
  // 3.没有绑定过，不管。直接设置
  if (!ob) {
    target[key] = val;
    return val;
  }
  // 4.设置属性为响应式
  defineReactive(ob.value, key, val);
  // 更新视图
  ob.dep.notice();
  return val;
}

// 为了绑定公有方法$del
export function del(target, key) {
  // 1.数组，调用重写的splice方法删除(更新视图)
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }

  // 2.若对象没有该属性，直接返回
  if (!hasOwn(target, key)) {
    return
  }

  const ob = target.__ob__;
  // 3.删除key
  delete target.key;
  // 4.没有监听过，则直接返回
  if (!ob) {
    return
  }
  // 5.通知更新
  ob.dep.notice();
}
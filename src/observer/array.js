// 只针对会改变自身的方法进行拦截
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

const oldArrayProtoMethods = Array.prototype;
// arrayMethods.__proto__ === Array.prototype
export const arrayMethods = Object.create(oldArrayProtoMethods);

// 增加(重写)数组方法
methodsToPatch.forEach(method => {
  arrayMethods[method] = function (...args) {
    // 调用原型方法
    const arrRes = oldArrayProtoMethods[method].apply(this, args);
    // 取出Observer,用来调observeArray
    const ob = this.__ob__;
    // 存放新增的元素
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);   // array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
        break;
    }
    // 绑定新增元素
    if (inserted) {
      ob.observeArray(inserted);
    }

    return arrRes;
  }
});
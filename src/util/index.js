export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
  "activated",
  "deactivated",
  "errorCaptured",
  "serverPrefetch"
];
const strats = {};
// 合并生命周期属性
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return Array.isArray(childVal) ? childVal : [childVal];
    }
  }
  return parentVal;
}

// 生命周期属性特殊处理
LIFECYCLE_HOOKS.forEach(hook => strats[hook] = mergeHook);

export function isObject(value) {
  if (typeof value === "object" && value !== null) {
    return true;
  }
  return false;
}

export function def(data, key, value, enumerable) {
  Object.defineProperty(data, key, {
    enumerable: !!enumerable,
    value,
    writable: true,
    configurable: true,
  })
}

// 合并属性
export function mergeOptions(parent, child, vm) {
  // 1.组件先将自己的extends和mixin与父属性合并
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  // 2.再用之前合并后的结果，与自身的属性进行合并
  const options = {};
  for (const key in parent) {
    mergeField(key);
  }
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      if (typeof parent[key] === "object" && typeof child[key] === "object") {
        options[key] = {
          ...parent[key],
          ...child[key],
        }
      } else if (typeof child[key] === "undefined") {
        options[key] = parent[key];
      }
      else {
        options[key] = child[key];
      }
    }
  }

  return options;
}
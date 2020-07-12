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
export function mergeOptions(parent, child) {
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
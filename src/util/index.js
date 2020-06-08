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
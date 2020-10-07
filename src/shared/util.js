export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

export function isValidArrayIndex(val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

const _toString = Object.prototype.toString

export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
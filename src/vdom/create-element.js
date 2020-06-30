import VNode from "./vnode";

export function createElement(tag, data = {}, ...children) {
  const key = data.key;
  if (key) {
    delete data.key;
  }
  return new VNode(tag, data, key, children);
}

export function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, undefined, text);
}
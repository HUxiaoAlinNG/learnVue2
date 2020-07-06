import { vnode } from "./vnode";

export function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, children);
}

export function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, text);
}
// 生成vnode
export function vnode(tag, data, children, text) {
  return {
    tag,
    data,
    children,
    text,
  }
};
// 生成vnode
export function vnode(tag, data, key, children, text, componentOption) {
  return {
    componentOption,
    tag,
    data,
    key,
    children,
    text,
  }
};
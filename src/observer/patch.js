// 更新节点
export function patch(oldVNode, VNode) {
  if (oldVNode.nodeType) {
    const parentEle = oldVNode.parentNode;
    const newEle = createElm(VNode);
    parentEle.insertBefore(newEle, oldVNode.nextSibling);
    parentEle.removeChild(oldVNode);
    return newEle;
  }
}

function createElm(vnode) {
  const { tag, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
function updateProperties(vnode) {
  const newProps = vnode.data || {};
  const el = vnode.el;
  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else { // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key]);
    }
  }
}
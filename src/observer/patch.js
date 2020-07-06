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

function createElm(VNode) {
  const { tag, children, text } = VNode;
  if (typeof tag === 'string') {
    VNode.el = document.createElement(tag);
    updateProperties(VNode);
    children.forEach(child => {
      VNode.el.appendChild(createElm(child));
    });
  } else {
    VNode.el = document.createTextNode(text);
  }
  return VNode.el;
}
function updateProperties(VNode) {
  const newProps = VNode.data || {};
  const el = VNode.el;
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
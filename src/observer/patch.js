// 更新节点
export function patch(oldVNode, VNode) {
  if (!oldVNode) {
    return createElm(VNode);
  }
  // 生成真实dom，替换旧dom
  if (oldVNode.nodeType) {
    const parentEle = oldVNode.parentNode;
    const newEle = createElm(VNode);
    parentEle.insertBefore(newEle, oldVNode.nextSibling);
    parentEle.removeChild(oldVNode);
    return newEle;
  }
}

// 创建真实dom
function createElm(VNode) {
  const { tag, children, text } = VNode;
  // 标签
  if (typeof tag === 'string') {
    // 针对组件
    if (createComponent(VNode)) {
      return VNode.componentInstance.$el;
    }

    VNode.el = document.createElement(tag);
    updateProperties(VNode);
    children.forEach(child => {
      VNode.el.appendChild(createElm(child));
    });
    // 文本
  } else {
    VNode.el = document.createTextNode(text);
  }
  return VNode.el;
}

// 创建组件
function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);
  }
  debugger
  if (vnode.componentInstance) {
    return true;
  }
}

// 添加标签内部属性
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
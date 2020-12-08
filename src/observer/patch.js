// 更新节点
export function patch(oldVNode, VNode) {
  // 组件渲染
  if (!oldVNode) {
    return createElm(VNode);
  }
  // 第一次渲染，为真实dom元素
  if (oldVNode.nodeType) {
    const parentEle = oldVNode.parentNode;
    const newEle = createElm(VNode);
    parentEle.insertBefore(newEle, oldVNode.nextSibling);
    parentEle.removeChild(oldVNode);
    return newEle;
  } else { // 新旧虚拟节点进行比对
    // 标签不一致：直接替换
    if (VNode.tag !== oldVNode.tag) {
      oldVNode.el.parentNode.replaceChild(createElm(VNode), oldVNode.el);
    }
    // 标签一致且是文本：替换文本
    if (!oldVNode.tag) {
      if (oldVNode.text !== VNode.text) {
        oldVNode.el.textContent = VNode.text;
      }
    }
    // 标签一致且不是文本
    // 1.复用标签，更新属性
    let el = vnode.el = oldVnode.el;
    updateProperties(vnode, oldVnode.data);
    // 2.比较子节点
    const oldChildren = oldVnode.children || [];
    const newChildren = vnode.children || [];
    // 2.1 都有子节点
    if (oldChildren.length > 0 && newChildren.length > 0) {
      updateChildren(el, oldChildren, newChildren);
      // 2.2老的有子节点、新的没有：直接情况
    } else if (oldChildren.length > 0) {
      el.innerHTML = '';
      // 2.3 新的有子节点：添加子元素
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i];
        el.appendChild(createElm(child));
      }
    }
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

// 更新标签内部属性
function updateProperties(VNode, oldProps = {}) {
  const newProps = VNode.data || {};
  const el = VNode.el;

  const newStyle = newProps.style || {};
  const oldStyle = oldProps.style || {};
  // 删掉多余style
  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // 删除多余属性
  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  // 更新style和属性
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

// 更新子节点
function updateChildren(parent, oldChildren, newChildren) {
  // 采用双指针比对的方式
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  const map = makeIndexByKey(oldChildren);

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 没有元素，直接递增
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
      // 针对向尾部插入的情况：头和头相等进行比对，老节点与新节点 开始索引 递增
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
      // 针对向头部插入的情况：尾和尾相等进行比对，老节点与新节点 开始索引 递减
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
      // 针对头移动到尾部的情况
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
      // 针对尾部移动到头部的情况
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
      // 完全乱序
    } else {
      const moveIndex = map[newStartVnode.key];
      // 找不到索引，代表为新元素，直接插入
      if (moveIndex == undefined) {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        // 找到索引，则做移动操作
      } else {
        let moveVnode = oldChildren[moveIndex];
        // 进行空间占位
        oldChildren[moveIndex] = null;
        parent.insertBefore(moveVnode.el, oldStartVnode.el);
        patch(moveVnode, newStartVnode);
      }
      // 只增加新节点索引
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  // 结束循环，证明新节点元素更多，进行插入
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
      // 第二个参数为 null 则 newNode 将被插入到子节点的末尾。
      parent.insertBefore(createElm(newChildren[i]), ele);
    }
  }
  // 结束循环，删除多余的元素
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i];
      if (child !== null) {
        parent.removeChild(child.el)
      }
    }
  }
}

// 判断是否为同一节点
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

// 用作映射
function makeIndexByKey(children) {
  const map = {};
  children.forEach((item, index) => {
    map[item.key] = index
  });
  return map;
}
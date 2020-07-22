const callbacks = [];
let pending = false;

// 异步函数，优先级:Promise > MutationObserver > setImmediate > setTimeout
let timerFunc;
if (typeof Promise !== 'undefined') {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (typeof MutationObserver !== 'undefined') {
  const observe = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(1);
  observe.observe(textNode, {
    characterData: true
  });
  timerFunc = () => {
    textNode.textContent = 2;
  }
} else if (typeof setImmediate !== 'undefined') {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks);
  }
}


// 执行渲染函数并清空
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

export function nextTick(cb, ctx) {
  pending = true;
  callbacks.push(() => {
    cb.call(ctx);
  });
  timerFunc();
}
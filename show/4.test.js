// 找到滚动属性的父元素
const scrollParent = (el) => {
  let parent = el.parentNode;
  while (parent && parent.nodeType === 1) {
    if (/scroll｜auto/.test(getComputedStyle(parent)['overflow'])) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return parent;
}

// 节流
const throttle = (cb, delay) => {
  let prev = Date.now();
  return () => {
    let now = Date.now();
    if (now - prev >= delay) {
      cb();
      prev = Date.now();
    }
  }
}

// 通过new Image()来加载图片
const loadImageAsync = (src, resolve, reject) => {
  let image = new Image();
  image.src = src;
  image.onload = resolve;
  image.onerror = reject;
}

const Lazy = (Vue) => {
  // 每个图片元素作为一个事件
  class ReactiveListener {
    constructor({ el, src, elRenderer, options }) {
      this.el = el;
      this.src = src;
      this.elRenderer = elRenderer;
      this.options = options;
      this.state = { loading: false }
    }
    // 校验是否在加载范围内
    checkInView() {
      const { top } = this.el.getBoundingClientRect();
      console.log(top);
      return top < window.innerHeight * this.options.preLoad;
    }
    // 加载图片
    load() {
      this.elRenderer(this, 'loading');
      loadImageAsync(this.src, () => {
        this.state.loading = true; // 加载完毕了
        this.elRenderer(this, 'loaded');
      }, () => {
        this.elRenderer(this, 'error');
      });
    }
  }

  return class LazyClass {
    constructor(options) {
      this.options = options;
      this.listenerQueue = [];
      this.bindHandler = false;
    }

    lazyLoadHandler() {
      this.listenerQueue.forEach(listener => {
        const catIn = listener.checkInView()
        catIn && listener.load();
      })
    }

    add(el, bindings, vnode, oldVnode) {
      Vue.nextTick(() => {
        // 获取滚动元素
        let parent = scrollParent(el);
        // 获取链接
        let src = bindings.value;

        // 绑定事件
        if (!this.bindHandler) {
          this.bindHandler = true;
          this.lazyHandler = throttle(this.lazyLoadHandler.bind(this), 500);
          parent.addEventListener('scroll', this.lazyHandler.bind(this));
        }
        // 给每个元素创建个实例，放到数组中
        const listener = new ReactiveListener({
          el, // 当前元素
          src, // 真实路径
          elRenderer: this.elRenderer.bind(this), // 传入渲染器
          options: this.options,
        });
        this.listenerQueue.push(listener);
        // 检测需要默认加载哪些数据
        this.lazyLoadHandler();
      });
    }
    // 设置图片src
    elRenderer(listener, state) {
      let el = listener.el;
      let src = '';
      switch (state) {
        case 'loading':
          src = listener.options.loading || ''
          break;
        case 'error':
          src = listener.options.error || ''
        default:
          src = listener.src;
          break;
      }
      el.setAttribute('src', src);
    }
  }
}

const VueLazyLoad = {
  install(Vue, options) {
    const LazyClass = Lazy(Vue);
    const lazy = new LazyClass(options);

    Vue.directive("lazy", {
      bind: lazy.add.bind(lazy)
    })
  }
}
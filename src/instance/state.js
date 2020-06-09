import { observe } from "../observer/watcher";


export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) initData(vm);
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch) initWatch(vm, opts.watch);
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    }
  })
}

// TODO
// 初始化props
function initProps(vm, props) {

}

// TODO
// 初始化methods
function initMethods(vm, methods) {

}

// TODO
// 初始化data
function initData(vm) {
  debugger;
  let data = vm.$options.data;
  data = vm._data = typeof vm.$options.data === "function" ? data.call(vm) : data;
  // 将_data全部代理给vm，方便获取data
  for (let key in data) {
    proxy(vm, "_data", key);
  }
  // 绑定data
  observe(data);
}

// TODO
// 初始化computed
function initComputed(vm, computed) {

}

// TODO
// 初始化watch
function initWatch(vm, watch) {

}
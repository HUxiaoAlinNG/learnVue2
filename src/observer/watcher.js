let uid = 0;
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    if (typeof this.expOrFn === "function") {
      this.getter = this.expOrFn;
    }
    this.cb = cb;
    this.options = options;
    this.id = uid++;
    this.get();
  }

  get() {
    this.getter()
  }
}

export default Watcher;
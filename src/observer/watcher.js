import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";

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
    this.deps = [];
    this.depIds = new Set();
    this.get();
  }

  // dep收集watcher并执行更新函数
  get() {
    // dep收集watcher
    pushTarget(this);
    this.getter();
    popTarget();
  }

  // 收集dep，同时dep收集watcher
  addDep(target) {
    const depId = target.id;
    // 避免重复收集dep，同时也避免dep重复收集watcher
    if (!this.depIds.has(depId)) {
      this.depIds.add(depId);
      this.deps.push(target);
      target.addSub(this);
    }
  }

  // 放入异步队列进行更新
  update() {
    queueWatcher(this);
  }

  run() {
    this.get();
  }
}

export default Watcher;